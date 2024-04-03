// src/screens/ChatScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import useRequireAuth from '../hooks/useRequireAuth'; // Adjust the path if necessary
import { View, TextInput, FlatList, StyleSheet, Button, ActivityIndicator, Text } from 'react-native';
import { useSelector } from 'react-redux';
import axios from 'axios'; // Use axios directly instead of ChatService
import Message from '../components/Message';
import { RootState } from '../store/store';
import { API_BASE_URL } from '../utils/ApiConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const ChatScreen = () => {
  useRequireAuth(); // This will take care of redirecting to the login screen if the user is not authenticated

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // New state variable for loading state
  const [isLoadingMessages, setIsLoadingMessages] = useState(false); // New state variable
  const user = useSelector((state: RootState) => state.user.user);
  const flatListRef = useRef<FlatList>(null); // Create a reference for the FlatList
  const navigation = useNavigation(); // Use useNavigation to get the navigation prop

  useEffect(() => {
    setIsLoadingMessages(true); // Start loading
    // Fetch previous chat messages for the user
    const fetchMessages = async () => {
      // Check if user exists and has an 'id' property before making the request
      if (user && user.id) {
        try {
          const token = await AsyncStorage.getItem('userToken');
          const response = await axios.get(`${API_BASE_URL}/chats/${user.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setMessages(response.data.messages);
          
        } catch (error) {
          console.error('Error fetching messages:', error);
        } finally {
          setIsLoadingMessages(false); // Stop loading
        }
      } else {
        // If there's no user, we can set loading to false immediately
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [user]); // Depend on the whole user object instead of just user.id

  const handleSendMessage = async () => {
    if (message.trim() === '') return;
    setIsLoading(true); // Start loading before sending the message

    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        `${API_BASE_URL}/chats/send`,
        {
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages(currentMessages => [...currentMessages, { message, response: response.data.response }]);
      setMessage('');

      // Decide whether to scroll to the end or to the start of the last message based on its length
      setTimeout(() => {
        if (response.data.response.length > 300) { // Assuming 300 is the threshold for a long message
          // If the response is long, scroll to the last message and align it to the top
          const index = messages.length; // Index of the new message
          flatListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0 });
        } else {
          // For shorter messages, just scroll to the bottom
          flatListRef.current?.scrollToEnd({ animated: true });
        }
      }, 100);

    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false); // Stop loading after receiving response or in case of error
    }
  };

  return (
    <View style={styles.container}>

        {isLoadingMessages ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text>Loading messages...</Text>
          </View>
        ) : (
        <>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Message message={item.message} response={item.response} />}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Type your message..."
              onSubmitEditing={handleSendMessage} // Call handleSendMessage when the Enter key is pressed
              returnKeyType="send" // Optionally, set the return key to "send" for better UX
            />
            {isLoading ? (
              <ActivityIndicator size="small" color="#007AFF" /> // Show loader when sending message
            ) : (
              <Button title="Send" onPress={handleSendMessage} />
            )}
          </View>

        </>
        )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;