import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, View, Text, StyleSheet } from 'react-native';
import LoginScreen from './screens/LoginScreen/LoginScreen';
import ChatScreen from './screens/ChatScreen/ChatScreen';
import AboutUsScreen from './screens/AboutUsScreen';
import TermsAndConditionsScreen from './screens/TermsAndConditionsScreen';
import { useDispatch } from 'react-redux';
import { clearUser } from './store/actions/userActions'; // Adjust the path as necessary 
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const logout = async () => {
    try {
        console.log('Logoutzz');
        await AsyncStorage.removeItem('userToken'); // Clear token from storage
        dispatch(clearUser()); // Clear user state in Redux
        GoogleSignin.signOut(); // Sign out from Google Sign In
        // Reset the navigation state and navigate back to the Login screen
        props.navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
    } catch (error) {
        console.error('Logout failed', error);
    }
};

    

    return (
      <DrawerContentScrollView {...props}>
        {user && (
        <View style={styles.userInfoSection}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
      )}
          <DrawerItemList {...props} />
          <View style={{ padding: 20 }}>
          <Button title="Logout" onPress={logout} />
          </View>
      </DrawerContentScrollView>
    );
};

const DrawerNavigator = () => (
  <Drawer.Navigator initialRouteName="Chat" drawerContent={props => <CustomDrawerContent {...props} />}>
    <Drawer.Screen name="Chat" component={ChatScreen} />
    <Drawer.Screen name="About Us" component={AboutUsScreen} />
    <Drawer.Screen name="Terms and Conditions" component={TermsAndConditionsScreen} />
  </Drawer.Navigator>
);

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={DrawerNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  userInfoSection: {
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: 'gray',
    paddingTop: 5,
  },
});

export default Navigation;
