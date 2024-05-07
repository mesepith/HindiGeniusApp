import React from 'react';
import { Provider } from 'react-redux';
import store from './src/store/store';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/navigation/StackNavigator';  // Updated import
import { initialize } from 'react-native-clarity';

const App = () => {
  React.useEffect(() => {
    initialize('m8d14bf6ev');
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
