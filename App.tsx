import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import store from './src/store/store';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/navigation/StackNavigator';  // Updated import
import LogoutHandler from './src/components/LogoutHandler';  // Import the new component
import LoadingScreen from './src/screens/LoadingScreen';
import { isUserAuthenticated } from './src/utils/authUtils';
import { Platform } from 'react-native';


const App = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isReady, setIsReady] = useState(false); // State to manage the readiness of the app to be rendered

  useEffect(() => {

    if (Platform.OS === 'android') {
      const { initialize } = require('react-native-clarity');
      initialize('m8d14bf6ev');

      const { initMessaging } = require('./src/services/NotificationService');
      initMessaging();  // Initialize messaging service only for Android
    }

    const checkAuthentication = async () => {
      const authenticated = await isUserAuthenticated();
      setIsAuthenticated(authenticated);  // Set authenticated state based on token presence
      console.log("Authenticated status:", authenticated); // Debug: Log authenticated status
    };

    checkAuthentication();
  }, []);

   // If isAuthenticated is still null, it means we are still checking the auth status
  if (isAuthenticated === null) {
    return <LoadingScreen />;  // Show loading screen while authentication status is checked
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
      <StackNavigator initialRouteName={isAuthenticated ? "Home" : "Login"}>
          {/* If authenticated, direct to Home, otherwise to Login */}
        </StackNavigator>
        <LogoutHandler />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
