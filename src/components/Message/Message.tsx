import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, Share } from 'react-native';
import styles from './Message.styles';

interface MessageProps {
  message: string;
  response: string;
}

const Message: React.FC<MessageProps> = ({ message, response }) => {
  const handleLongPress = useCallback(async () => {
    try {
      await Share.share({
        message: `${response}`,
      });
    } catch (error) {
      console.error('Error sharing message:', error);
    }
  }, [message, response]);

  return (
    <View style={styles.container}>
        <View style={styles.messageContainer}>
          <Text style={styles.message}>{message}</Text>
        </View>
      <TouchableOpacity onLongPress={handleLongPress}>
      <View style={styles.responseContainer}>
        <Text style={styles.response}>{response}</Text>
      </View>
      </TouchableOpacity>
    </View>
  );
};

export default Message;
