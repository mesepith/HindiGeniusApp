import messaging from '@react-native-firebase/messaging';
import { Alert, Linking, Platform } from 'react-native';

// Initialize messaging services and handle notifications
export const initMessaging = async () => {
    // Request permission to send notifications
    const authStatus = await messaging().requestPermission({
        sound: true,
        alert: true,
        badge: true,
        carPlay: false, // Relevant only for iOS
        provisional: true, // Only on iOS, for non-interruptive notifications
        announcement: false, // Only on iOS
    });

    // Log the current authorization status for debugging
    console.log('Notification Permission Status:', authStatusToString(authStatus));

    // Check if notifications are enabled at the system level (useful on Android)
    checkNotificationEnabled();

    // Get and log the FCM token
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
        console.log('FCM Token:', fcmToken);
    } else {
        console.log('Failed to obtain FCM token');
    }

    // Handle incoming messages when the app is in the foreground
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
        Alert.alert('New Notification!', JSON.stringify(remoteMessage.notification));
    });

    // Handle background message
    messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Received in background:', remoteMessage);
    });

    // Return the unsubscribe function to detach the listener when no longer needed
    return () => {
        unsubscribeOnMessage();
    };
};

// Convert authorization status to string for easier debugging
function authStatusToString(status) {
    switch (status) {
        case messaging.AuthorizationStatus.AUTHORIZED:
            return 'Authorized';
        case messaging.AuthorizationStatus.DENIED:
            return 'Denied';
        case messaging.AuthorizationStatus.NOT_DETERMINED:
            return 'Not Determined';
        case messaging.AuthorizationStatus.PROVISIONAL:
            return 'Provisional';
        default:
            return 'Unknown';
    }
}

// Function to check if notifications are enabled in the system settings (Android mainly)
export const checkNotificationEnabled = async () => {
    const enabled = await messaging().hasPermission();
    if (enabled) {
        console.log('Notification permission is granted.');
    } else {
        console.log('Notification permission is not granted.');
        Alert.alert(
            "Enable Notifications",
            "To stay up-to-date with important updates, please enable notifications. Tap 'Open Settings' to adjust your preferences in the system settings.",
            [
              { text: "Later", style: "cancel" },
              { text: "Open Settings", onPress: () => Linking.openSettings() }
            ]
          );
          
    }
};
