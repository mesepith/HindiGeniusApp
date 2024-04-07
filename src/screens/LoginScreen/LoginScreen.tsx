// src/screens/LoginScreen.tsx
import React from 'react';
import { View, Alert, ActivityIndicator } from 'react-native';
import CustomButton from '../../components/CustomButton';
import useGoogleSignIn from '../../hooks/useGoogleSignIn';
import { styles } from './LoginScreen.styles';
import FastImage from 'react-native-fast-image';
import loginGif from '../../assets/login.gif'
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
    <FastImage
      source={loginGif}
      style={styles.backgroundContainer}
      resizeMode={FastImage.resizeMode.cover}
    >
      <View style={styles.container}>
        <CustomButton title="Login with Google" onPress={handleGoogleSignIn} />
      </View>
    </FastImage>
  );
};

export default LoginScreen;
