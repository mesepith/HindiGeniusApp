import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import ChatService from '../services/ChatService';

interface Message {
  message: string;
  response: string;
}

const useChat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const flatListRef = useRef<FlatList>(null);
  const isReadyToScroll = useRef(false);

  const fetchSessionId = useCallback(async () => {
    if (user && user.id) {
      try {
        const newSessionId = await ChatService.startNewSession();
        setSessionId(newSessionId);
        setMessages([]);
      } catch (error: any) {
        console.error('Error starting new chat session:', error);
        // Alert.alert('Error starting new chat session ', error.message);
      }
    }
  }, [user]);

  const fetchMessages = useCallback(async () => {
    setIsLoadingMessages(true);
    try {
      if (user && user.id && sessionId) {
        const fetchedMessages = await ChatService.fetchMessages(user.id, sessionId);
        setMessages(fetchedMessages);
      }
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      // Alert.alert("Error fetching messages ", error.message);
    } finally {
      setIsLoadingMessages(false);
      if (isReadyToScroll.current && flatListRef.current && user) {
        setTimeout(() => {
          flatListRef.current.scrollToEnd({ animated: false });
        }, 500);
      }
    }
  }, [user, sessionId]);

  useEffect(() => {
    if (sessionId) {
      fetchMessages();
    }
  }, [sessionId, fetchMessages]);

  useEffect(() => {
    fetchSessionId();
  }, [fetchSessionId]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      isReadyToScroll.current = true;
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleSendMessage = async () => {
    if (message.trim() === '') return;
    setIsLoading(true);
    try {
      const response = await ChatService.sendMessage(message, sessionId);
      console.log('user inside handleSendMessage, ', user);
      console.log('response msg, ', response);
      setMessages(currentMessages => [...currentMessages, { message, response }]);
      setMessage('');
      setTimeout(() => {
        if (response !==undefined) {
          console.log('response inside setTimeout, ', response);
          console.log('i m here -----')
          if (response.length > 300 && flatListRef.current) {
            const index = messages.length; // Index of the new message
            flatListRef.current.scrollToIndex({ index, animated: true, viewPosition: 0 });
          } else {
            flatListRef.current?.scrollToEnd({ animated: true });
          }
        }
      }, 100);
    } catch (error: any) {
      console.error('Error sending message:', error);
      // Alert.alert("Error sending messages ", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { message, setMessage, messages, isLoading, isLoadingMessages, handleSendMessage, fetchSessionId, flatListRef, isReadyToScroll };
};

export default useChat;
