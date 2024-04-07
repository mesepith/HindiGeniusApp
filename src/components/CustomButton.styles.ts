// src/components/CustomButton.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4285F4', // Google's blue color
    paddingVertical: 12, // Increase padding for a bigger button
    paddingHorizontal: 30, // Increase padding for a wider button
    borderRadius: 10, // Increase for more rounded corners
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 16, // Adjust the margin as needed to move the button down
  },
  text: {
    color: '#FFFFFF', // White color for text
    fontSize: 18, // Increase font size if needed
    fontWeight: 'bold',
  },
});
