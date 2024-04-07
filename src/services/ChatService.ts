import axios from 'axios';
import { API_BASE_URL } from '../utils/ApiConstants';

interface Message {
  message: string;
  response: string;
}

const ChatService = {
  fetchMessages: async (userId: string, token: string | null): Promise<Message[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chats/${userId}`, {
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

  sendMessage: async (message: string, token: string | null): Promise<string> => {
    try {
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
      return response.data.response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
};

export default ChatService;