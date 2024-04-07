// src/screens/LoginScreen.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    width: '100%', // Ensure it covers the whole screen width
    height: '100%', // Ensure it covers the whole screen height
    alignItems: 'center', // Center children horizontally
    justifyContent: 'center', // Center children vertically
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40, // Adjust this value as needed to slide down the button
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});