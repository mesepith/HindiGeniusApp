import React from 'react';
import { View, Text } from 'react-native';
import styles from './Message.styles';

interface MessageProps {
  message: string;
  response: string;
}

const Message: React.FC<MessageProps> = ({ message, response }) => (
  <View style={styles.container}>
    <View style={styles.messageContainer}>
      <Text style={styles.message}>{message}</Text>
    </View>
    <View style={styles.responseContainer}>
      <Text style={styles.response}>{response}</Text>
    </View>
  </View>
);

export default Message;