// src/components/Message.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  messageContainer: {
    backgroundColor: '#e6e6e6',
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  responseContainer: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
    alignSelf: 'flex-end',
  },
  message: {
    color: '#000',
  },
  response: {
    color: '#fff',
  },
});

export default Message;