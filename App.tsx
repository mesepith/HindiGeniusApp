import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './src/store/store';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/navigation/StackNavigator';  // Updated import
import { initialize } from 'react-native-clarity';
import LogoutHandler from './src/components/LogoutHandler';  // Import the new component


const App = () => {

  React.useEffect(() => {
    initialize('m8d14bf6ev');
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <StackNavigator />
        <LogoutHandler />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
