import axios from 'axios';
import { API_BASE_URL } from '../utils/ApiConstants';
import { Alert } from 'react-native'; // Import Alert

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
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";
      Alert.alert("Fetch Messages Error", errorMessage);
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
    } catch (error: any) {
      console.error('Error sending message:', error);
      const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";
      Alert.alert("Send Message Error", errorMessage);
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
    } catch (error: any) {
        console.error('Error starting new session:', error);
        const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";
        Alert.alert("Start New Session Error", errorMessage);
        throw error;
    }
},
};

export default ChatService;