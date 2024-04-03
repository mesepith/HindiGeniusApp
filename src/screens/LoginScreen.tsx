import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import axios from 'axios';
import { GOOGLE_WEB_CLIENT_ID } from '../../credentials';
import { useDispatch } from 'react-redux';
import { setUser } from './../store/actions/userActions';
import AuthService from '../services/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
});

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      // Send the user data to the backend for registration
      const userData = {
        name: userInfo.user.name,
        email: userInfo.user.email,
        google_user_id: userInfo.user.id,
      };

      const response = await AuthService.registerWithGoogle(userData);

      if (response.success) {
        console.log('response::')
        console.log(response);

        // Store the token in AsyncStorage
        await AsyncStorage.setItem('userToken', response.token);

        // Store the user data in Redux store
        dispatch(setUser(response.user));

        // Navigate to the desired screen (e.g., ChatScreen)
        navigation.navigate('Home');
      } else {
        Alert.alert('Registration failed', response.data.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred during Google Sign-In');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Login with Google" onPress={googleSignIn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoginScreen;