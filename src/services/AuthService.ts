import axios from 'axios';
import { API_BASE_URL } from '../utils/ApiConstants';

const AuthService = {
  registerWithGoogle: async (userData: { name: string; email: string; google_user_id: string }) => {
    try {
        console.log('API_BASE_URL', API_BASE_URL);
      const response = await axios.post(`${API_BASE_URL}/auth/register-google`, userData);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default AuthService;