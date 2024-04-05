import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styles } from './CustomButton.styles';

// Custom Button Component
const CustomButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
