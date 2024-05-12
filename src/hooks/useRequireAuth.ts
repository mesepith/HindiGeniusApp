import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { RootState } from '../store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/actions/userActions';

const useRequireAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    const checkUser = async () => {
      if (!user && isFocused) {
        const userData = await AsyncStorage.getItem('user');
        console.log("userData from AsyncStorage useRequireAuth:", userData);

        if (!userData) {
          console.log('useRequireAuth: user is not there');
          navigation.navigate('Login');
        } else {
          console.log('useRequireAuth: user found in storage');
          dispatch(setUser(JSON.parse(userData)));
          // If needed, you can dispatch setUser here to update the Redux state with the stored user data
        }
      }
    };

    checkUser();
  }, [user, isFocused, navigation]);
};

export default useRequireAuth;
