import axios from 'axios';
import { API_BASE_URL } from '../utils/ApiConstants';

interface Message {
  message: string;
  response: string;
}

const ChatService = {
  fetchMessages: async (userId: string, token: string | null, sessionId: string): Promise<Message[]> => {
    console.log('sessionId inside fetchMessages:', sessionId);
    try {
      const response = await axios.get(`${API_BASE_URL}/chats/${userId}/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.messages;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  sendMessage: async (message: string, token: string, sessionId: string | null): Promise<string> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/chats/send`,
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
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
  startNewSession: async (token: string | null) => {
    try {
      
        const response = await axios.get(`${API_BASE_URL}/chats/start-new-session`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log('startNewSession sessionId ', response.data.sessionId);
        return response.data.sessionId;
    } catch (error) {
        console.error('Error starting new session:', error);
        throw error;
    }
},
};

export default ChatService;