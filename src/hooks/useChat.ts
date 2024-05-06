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
  const [sessionId, setSessionId] = useState(''); // Store sessionId here
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const flatListRef = useRef<FlatList>(null);
  const isReadyToScroll = useRef(false);

  const fetchSessionId = useCallback(async () => {
    
    if (user && user.id) {  // Make sure sessionId is not undefined
      const token = await AsyncStorage.getItem('userToken');
      const newSessionId = await ChatService.startNewSession(token);
      setSessionId(newSessionId);  // Set the session ID first
      setMessages([]);  // Clear old messages for the new session
      return newSessionId;  // Return the new sessionId to be used in the next promise chain
    }
}, []);

  const fetchMessages = useCallback(async (sessionId) => {
    try {
      if (user && user.id && sessionId) {  // Make sure sessionId is not undefined
        const token = await AsyncStorage.getItem('userToken');
        const fetchedMessages = await ChatService.fetchMessages(user.id, token, sessionId);
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
    fetchSessionId().then(sessionId => {
        fetchMessages(sessionId);  // Now fetchMessages is called after fetchSessionId is completed
    });
}, [fetchMessages, fetchSessionId, user]);

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
      const response = await ChatService.sendMessage(message, token, sessionId);
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

  return { message, setMessage, messages, isLoading, isLoadingMessages, handleSendMessage, fetchSessionId, flatListRef, isReadyToScroll };
};

export default useChat;