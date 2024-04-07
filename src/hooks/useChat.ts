import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatService from '../services/ChatService';

interface Message {
  message: string;
  response: string;
}

const useChat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const flatListRef = useRef<FlatList>(null);
  const isReadyToScroll = useRef(false);

  const fetchMessages = useCallback(async () => {
    try {
      if (user && user.id) {
        const token = await AsyncStorage.getItem('userToken');
        const fetchedMessages = await ChatService.fetchMessages(user.id, token);
        setMessages(fetchedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoadingMessages(false);
      if (isReadyToScroll.current) {
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: false });
        }, 500);
      }
    }
  }, [user]);

  useEffect(() => {
    setIsLoadingMessages(true);
    fetchMessages();
  }, [fetchMessages, user]);

  useEffect(() => {
    // Set isReadyToScroll to true after the initial render
    const timeoutId = setTimeout(() => {
      isReadyToScroll.current = true;
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleSendMessage = async () => {
    if (message.trim() === '') return;
    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await ChatService.sendMessage(message, token);
      setMessages(currentMessages => [...currentMessages, { message, response }]);
      setMessage('');

      // Decide whether to scroll to the end or to the start of the last message based on its length
      setTimeout(() => {
        if (response.length > 300) {
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
      setIsLoading(false);
    }
  };

  return { message, setMessage, messages, isLoading, isLoadingMessages, handleSendMessage, flatListRef, isReadyToScroll };
};

export default useChat;