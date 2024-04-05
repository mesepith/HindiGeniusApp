// src/hooks/useGoogleSignIn.ts
import { useDispatch } from 'react-redux';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AuthService from '../services/AuthService';
import { setUser } from '../store/actions/userActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { GOOGLE_WEB_CLIENT_ID } from '../../credentials';

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
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: 'An error occurred during Google Sign-In' };
    }
  };

  return { googleSignIn };
};

export default useGoogleSignIn;