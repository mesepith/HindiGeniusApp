import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import Share from 'react-native-share'; // Make sure to import Share from 'react-native-share'
import styles from './Message.styles';

interface MessageProps {
  message: string;
  response: string;
}

const Message: React.FC<MessageProps> = ({ message, response }) => {
  const [isActive, setIsActive] = useState(false);

  const handleLongPress = useCallback(async () => {
    const options = {
      title: 'Share',
      message: response,
      // url: onlineLogo, // Here we pass the local asset to be shared
    };

    try {
      const ShareResponse = await Share.open(options);
      console.log(ShareResponse);
    } catch (error) {
      console.error('Error sharing', error);
    }
  }, [response]);

  // Define the platform-specific style for iOS
  const iosContainerStyle = Platform.OS === 'ios' ? { zIndex: 1 } : {};

  return (
    <View style={[styles.container, iosContainerStyle]}>
      <View style={styles.messageContainer}>
        <Text style={styles.message}>{message}</Text>
      </View>
      <TouchableOpacity 
        onLongPress={handleLongPress}
        activeOpacity={1}
        style={isActive ? styles.activeContainer : styles.responseContainer}
      >
        <Text style={styles.response}>{response}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Message;
