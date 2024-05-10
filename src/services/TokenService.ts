import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../utils/ApiConstants';
import { Alert } from 'react-native'; // Import Alert
import store from '../store/store';  // Import the Redux store directly if not passing dispatch through components
import { triggerLogout } from '../store/actions/userActions'; 

export const getToken = async () => {
  const token = await AsyncStorage.getItem('userToken');
  return token;  // Ensure this returns a string, not a promise object
};

export const getRefreshToken = async () => {
  console.log('----------------- getRefreshToken() ----------------- ');
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  return refreshToken;
};

export const refreshAccessToken = async () => {
  
  console.log('----------------- refreshAccessToken() api call ----------------- ');
  const refreshToken = await getRefreshToken();
  const userId = await AsyncStorage.getItem('userId');
  if (!refreshToken) throw new Error('No refresh token available');

  try {
    const url = `${API_BASE_URL}/auth/refresh-token`;
    console.log('Refresh Token URL:', url);
    const response = await axios.post(url, { refreshToken, userId });
    // console.log('responsezzzzzzzzzzzzz ', response);
    if (response.data.success) {
      await AsyncStorage.setItem('userToken', response.data.accessToken); // Update the stored access token
      await AsyncStorage.setItem('refreshToken', response.data.refreshToken); // Update the stored  Stored refresh token
      return response.data.accessToken;
    } else {
      throw new Error('Failed to refresh token');
    }
  } catch (error: any) {

    if (error.response && (error.response.status === 401 || error.response.status === 403) ) {
      // Throw a custom error for 401 status code
      throw new Error('UnauthorizedError');
    }

    Alert.alert("Error refreshing token refreshAccessToken()", error.message);
    console.error('Error refreshing token refreshAccessToken():', error);
    throw error;
  }
};

export const withRetry = async (apiCall, initialToken) => {
  try {
    return await apiCall(initialToken);
  } catch (error :any) {
    console.log('Error in initial API call:', error);
    if (error.response && error.response.status === 401) {
      console.log('Token expired, attempting to refresh... ', error.response.data.message);
      try {
        const newToken = await refreshAccessToken();
        console.log('Received new token, retrying API call......................');
        return await apiCall(newToken);  // Ensure the new token is used in the retry
      } catch (refreshError: any) {

        if (refreshError.message === 'UnauthorizedError' ) {

          // Alert.alert("You are logout", "Login Please");
          store.dispatch(triggerLogout());  // Use the store to dispatch an action directly

        }else{
          console.log('Failed to refresh token withRetry:', refreshError);
          Alert.alert("Failed to refresh token withRetry", refreshError.message || "Unknown error");
          throw refreshError;
        }
      }
    } else {
      Alert.alert("Error withRetry ", error.message);
      throw error;
    }
  }
};


