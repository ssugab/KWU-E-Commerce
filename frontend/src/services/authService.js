import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(API_ENDPOINTS.USER.LOGIN, {
        email,
        password
      });
      if (response.data.success) {
        // Simpan token ke localStorage
        localStorage.setItem('token', response.data.token);
        return response.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  signup: async (name, email, phone, password) => {
    try {
      const response = await axios.post(API_ENDPOINTS.USER.SIGNUP, {
        name,
        email,
        phone,
        password
      });
      if (response.data.success) {
        // Simpan token ke localStorage
        localStorage.setItem('token', response.data.token);
        return response.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getProfile: async (userId) => {
    try {
      const respone = await axios.get(API_ENDPOINTS.USER.PROFILE, { 
        
      })
    } catch (error) {
      
    }
  },
};

export default authService; 