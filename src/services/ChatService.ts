import axios from 'axios';
import { API_BASE_URL } from '../utils/ApiConstants';
import { Alert } from 'react-native'; // Import Alert
import { withRetry, getToken } from './TokenService'; // Import token utility functions

interface Message {
  message: string;
  response: string;
}

const ChatService = {
  fetchMessages: async (userId: string, sessionId: string): Promise<Message[]> => {
    const exec = async (token: string | null) => {
      const url = `${API_BASE_URL}/chats/${userId}/${sessionId}`;
      console.log('Fetching messages from URL:', url);
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.messages;
    };
    // Updated to include async in the arrow function
    return withRetry(async () => exec(await getToken()));  
  },

  sendMessage: async (message: string, sessionId: string | null): Promise<string> => {
    const exec = async (token: string | null) => {
      const url = `${API_BASE_URL}/chats/send`;
      console.log('Sending message to URL:', url);
      const response = await axios.post(
        url,
        {
          message,
          sessionId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.response;
    };
    // Updated to include async in the arrow function
    return withRetry(async () => exec(await getToken()));  
  },

  startNewSession: async () => {
    const exec = async (token: string | null) => {
      const url = `${API_BASE_URL}/chats/start-new-session`;
      console.log('Starting new session at URL:', url);
      const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.sessionId;
    };
    // Updated to include async in the arrow function
    return withRetry(async () => exec(await getToken()));  
  },
};

export default ChatService;
