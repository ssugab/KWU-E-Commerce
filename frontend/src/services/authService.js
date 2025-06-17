import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(API_ENDPOINTS.USER.LOGIN, {
        email,
        password
      }, {
        withCredentials: true // Important for cookies
      });
      
      if (response.data.success) {
        // Backend set cookies, save to localStorage for fallback
        const token = response.data.accessToken || response.data.token;
        const refreshToken = response.data.refreshToken;
        
        if (token) {
          localStorage.setItem('token', token);
          console.log('✅ AuthService - Token saved to localStorage as fallback', token ? 'exists' : 'not found');
        }
        
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
          console.log('✅ AuthService - Refresh token saved to localStorage');
        }
        
        console.log('🍪 AuthService - Cookies should be set by backend');
        return response.data;
      }
      
      throw new Error(response.data.message);
    } catch (error) {
      console.error('❌ AuthService - Login error:', error);
      throw error.response?.data?.message || error.message;
    }
  },

  register: async (name, npm, email, phone, password) => {
    try {
      const response = await axios.post(API_ENDPOINTS.USER.REGISTER, {
        name,
        npm,
        email,
        phone,
        password
      }, {
        withCredentials: true 
      });
      
      if (response.data.success) {
        const token = response.data.accessToken || response.data.token;
        const refreshToken = response.data.refreshToken;
        
        if (token) {
          localStorage.setItem('token', token);
          console.log('✅ AuthService - Token saved to localStorage as fallback', token ? 'exists' : 'missing');
        }
        
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
          console.log('✅ AuthService - Refresh token saved to localStorage');
        }
        
        console.log('🍪 AuthService - Cookies should be set by backend');
        return response.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      console.error('❌ AuthService - Register error:', error);
      throw error.response?.data?.message || error.message;
    }
  },

  logout: async () => {
    try {
      await axios.post(API_ENDPOINTS.USER.LOGOUT, {}, {
        withCredentials: true 
      });
      console.log('✅ AuthService - Logout API called, cookies cleared by backend');
    } catch (error) {
      console.error('❌ AuthService - Logout API error:', error);
      // Continue to remove local token even if API error
    } finally {
      // Remove tokens from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  getRefreshToken: () => {
    return localStorage.getItem('refreshToken');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Backward compatibility alias
  signup: function(name, npm, email, phone, password) {
    return this.register(name, npm, email, phone, password);
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await axios.post(API_ENDPOINTS.USER.CHANGE_PASSWORD, {
        currentPassword,
        newPassword
      }, {
        withCredentials: true 
      });
      
      if (response.data.success) {
        console.log('✅ AuthService - Password changed successfully');
        return response.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      console.error('❌ AuthService - Change password error:', error);
      throw error.response?.data?.message || error.message;
    }
  }
};

export default authService; 