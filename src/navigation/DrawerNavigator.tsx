import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from './CustomDrawerContent';
import ChatScreen from '../screens/ChatScreen/ChatScreen';
import AboutUsScreen from '../screens/AboutUsScreen';
import TermsAndConditionsScreen from '../screens/TermsAndConditionsScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => (
    <Drawer.Navigator initialRouteName="Hindi Writer" drawerContent={props => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name="Hindi Writer" component={ChatScreen} />
        <Drawer.Screen name="About Us" component={AboutUsScreen} />
        <Drawer.Screen name="Terms and Conditions" component={TermsAndConditionsScreen} />
    </Drawer.Navigator>
);

export default DrawerNavigator;
