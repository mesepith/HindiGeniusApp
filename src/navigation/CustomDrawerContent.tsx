import React from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Button, View, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import styles from './styles';
import useGoogleSignIn from '../hooks/useGoogleSignIn';  // Import the hook

const CustomDrawerContent = (props) => {

    const { googleSignOut } = useGoogleSignIn();
    const user = useSelector((state: RootState) => state.user.user);

    const handleLogout = async () => {
        const success = await googleSignOut();
        if (success) {
            props.navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } else {
            console.error('Logout failed');
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
                <Button title="Logout" onPress={handleLogout} />
            </View>
        </DrawerContentScrollView>
    );
};

export default CustomDrawerContent;
