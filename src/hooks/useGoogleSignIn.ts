  // src/hooks/useGoogleSignIn.ts
  import { useDispatch } from 'react-redux';
  import { GoogleSignin } from '@react-native-google-signin/google-signin';
  import AuthService from '../services/AuthService';
  import { setUser, clearUser } from '../store/actions/userActions';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { useEffect } from 'react';
  import { GOOGLE_WEB_CLIENT_ID } from '../../credentials';
  import { Alert, Platform } from 'react-native';  // Import Alert if not already imported
  import { useNavigation } from '@react-navigation/native';

  const useGoogleSignIn = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    useEffect(() => {
      // Ensures GoogleSignin is configured when the hook is first used
      GoogleSignin.configure({
        webClientId: GOOGLE_WEB_CLIENT_ID,
      });
    }, []);

    const googleSignIn = async () => {
      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const userData = {
          name: userInfo.user.name,
          email: userInfo.user.email,
          google_user_id: userInfo.user.id,
        };

        const response = await AuthService.registerWithGoogle(userData);
        if (response.success) {
          await AsyncStorage.setItem('userToken', response.accessToken); // Store access token
          await AsyncStorage.setItem('refreshToken', response.refreshToken); // Store refresh token
          await AsyncStorage.setItem('userId', String(response.user.id));
          await AsyncStorage.setItem('user', JSON.stringify(response.user));
          dispatch(setUser(response.user));

          if (Platform.OS === 'android') {
            const { setCustomUserId } = require('react-native-clarity');
            setCustomUserId(userInfo.user.email);  // Set Clarity user ID after successful login
          }
          
          return { success: true };
        } else {
          Alert.alert('Sign In Failed', response.data.message); // Display the error message from the server
          return { success: false, message: response.data.message };
        }
      } catch (error: any) {
        console.error(error);
        const errorMessage = error.response?.data?.message || error.message || "An error occurred during Google Sign-In";
        Alert.alert("Google Sign-In Error", errorMessage);
        return { success: false, message: 'An error occurred during Google Sign-In' };
      }
    };

    const googleSignOut = async () => {
      try {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('refreshToken');
        await AsyncStorage.removeItem('userId');
        await AsyncStorage.removeItem('user');
        dispatch(clearUser());
        await GoogleSignin.signOut();
        return true;
      } catch (error: any) {
        console.error('Logout failed:', error);
        Alert.alert("Logout failed", error);
        return false;
      }
    };

    const logout = async () => {
      try {
        await GoogleSignin.signOut(); // Ensures Google sign out
        await AsyncStorage.multiRemove(['userToken', 'refreshToken', 'userId', 'user']); // Removes all keys at once
        dispatch(clearUser());
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
        return true;
      } catch (error: any) {
        console.error('Logout failed:', error);
        Alert.alert("Logout failed", error.message);
        return false;
      }
    };

    return { googleSignIn, googleSignOut, logout };
  };

  export default useGoogleSignIn;
