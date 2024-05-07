// src/hooks/useGoogleSignIn.ts
import { useDispatch } from 'react-redux';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AuthService from '../services/AuthService';
import { setUser, clearUser } from '../store/actions/userActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { GOOGLE_WEB_CLIENT_ID } from '../../credentials';
import { Alert } from 'react-native';  // Import Alert if not already imported

const useGoogleSignIn = () => {
  const dispatch = useDispatch();

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
        await AsyncStorage.setItem('userToken', response.token);
        dispatch(setUser(response.user));
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
      dispatch(clearUser());
      await GoogleSignin.signOut();
      return true;
    } catch (error: any) {
      console.error('Logout failed:', error);
      Alert.alert("Logout failed", error);
      return false;
    }
  };

  return { googleSignIn, googleSignOut };
};

export default useGoogleSignIn;
