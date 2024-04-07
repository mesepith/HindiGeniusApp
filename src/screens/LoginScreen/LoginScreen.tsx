// src/screens/LoginScreen.tsx
import React from 'react';
import { View, Alert, ActivityIndicator } from 'react-native';
import CustomButton from '../../components/CustomButton';
import useGoogleSignIn from '../../hooks/useGoogleSignIn';
import { styles } from './LoginScreen.styles';

const LoginScreen = ({ navigation }) => {
  const { googleSignIn } = useGoogleSignIn();
  const [loading, setLoading] = React.useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const result = await googleSignIn();
    setLoading(false);

    if (result.success) {
      navigation.navigate('Home');
    } else {
      Alert.alert('Registration failed', result.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomButton title="Login with Google" onPress={handleGoogleSignIn} />
    </View>
  );
};

export default LoginScreen;
