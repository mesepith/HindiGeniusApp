import React from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Button, View, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { clearUser } from '../store/actions/userActions';
import  { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import useGoogleSignIn from '../hooks/useGoogleSignIn';  // Import the hook

const CustomDrawerContent = (props) => {
    const user = useSelector((state: RootState) => state.user.user);
    const dispatch = useDispatch();
    useGoogleSignIn();  // Initialize the Google Sign-In configuration

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            dispatch(clearUser());
            await GoogleSignin.signOut();  // Correctly awaited signOut method
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

export default CustomDrawerContent;
