// src/hooks/useRequireAuth.ts
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { RootState } from '../store/store';

const useRequireAuth = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!user && isFocused) {
        console.log('useRequireAuth: user is not there');
      navigation.navigate('Login');
    }
  }, [user, isFocused, navigation]);
};

export default useRequireAuth;
