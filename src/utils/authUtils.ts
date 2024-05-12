import AsyncStorage from '@react-native-async-storage/async-storage';

export const isUserAuthenticated = async () => {
  const token = await AsyncStorage.getItem('userToken');
  return !!token;  // Returns true if token exists, false otherwise
};