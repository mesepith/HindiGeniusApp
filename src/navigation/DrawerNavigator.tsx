import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from './CustomDrawerContent';
import ChatScreen from '../screens/ChatScreen/ChatScreen';
import AboutUsScreen from '../screens/AboutUsScreen';
import TermsAndConditionsScreen from '../screens/TermsAndConditionsScreen';
import { View, Image, Text } from 'react-native';
import logo from '../assets/logo.png';  // Ensure the logo path is correct

const Drawer = createDrawerNavigator();

// Custom header title component
const CustomHeaderTitle = ({ title }) => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={logo}
          style={{ width: 40, height: 40 }} // Adjust the size as needed
          resizeMode="contain"
        />
        <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 18 }}>
          {title}
        </Text>
      </View>
    );
  };

const DrawerNavigator = () => (
    <Drawer.Navigator
    initialRouteName="Hindi Writer"
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={({ route }) => ({
      headerTitle: () => <CustomHeaderTitle title={route.name} />,
      headerTitleAlign: 'center',
      // If you need to style the entire header (e.g., background color), use headerStyle
    })}
  >
        <Drawer.Screen name="Hindi Writer" component={ChatScreen} />
        <Drawer.Screen name="About Us" component={AboutUsScreen} />
        <Drawer.Screen name="Terms and Conditions" component={TermsAndConditionsScreen} />
    </Drawer.Navigator>
);

export default DrawerNavigator;
