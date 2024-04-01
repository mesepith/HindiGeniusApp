// src/screens/LoginScreen.tsx

import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import axios from 'axios';
import { GOOGLE_WEB_CLIENT_ID } from './../../credentials'


GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID, // Replace with your actual Web Client ID from Google Console
});

// Validation schema using Yup
const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const LoginScreen = ({ navigation }) => {
  const handleLogin = (values) => {
    // Here, you would usually send values to your backend to log the user in.
    // This example simply shows an alert.
    Alert.alert('Login Attempt', `Email: ${values.email}, Password: ${values.password}`);
  };

  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('userInfo');
      console.log(userInfo);
      const userToken = await GoogleSignin.getTokens(); // Get the user tokens
      console.log('userToken');
      console.log(userToken);
  
      // Send the ID token to your backend via HTTPS
      // Replace 'http://your-backend-url/api/auth/google' with your actual backend API endpoint
      axios.post('http://your-backend-url/api/auth/google', {
        token: userToken.idToken,
      })
      .then(response => {
        // Handle the response from your backend (e.g., save user data to async storage, navigate to another screen)
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={LoginSchema}
      onSubmit={values => handleLogin(values)}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}
          <TextInput
            style={styles.input}
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
            placeholder="Password"
            secureTextEntry
          />
          {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}
          <Button onPress={handleSubmit} title="Login" color="#6200EE" />
          <Button
            title="Don't have an account? Register"
            onPress={() => navigation.navigate('Register')}
            color="#6200EE"
          />
          <Button title="Login with Google" onPress={googleSignIn} />

        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    width: '100%',
    marginBottom: 10,
  },
});

export default LoginScreen;
