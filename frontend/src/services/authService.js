import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(API_ENDPOINTS.USER.LOGIN, {
        email,
        password
      });
      console.log('🔍 AuthService - Login response:', response.data);
      
      if (response.data.success) {
        // Simpan accessToken ke localStorage (backend menggunakan accessToken sekarang)
        const token = response.data.accessToken || response.data.token;
        localStorage.setItem('token', token);
        console.log('✅ AuthService - Token saved to localStorage:', token ? 'exists' : 'missing');
        return response.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      console.error('❌ AuthService - Login error:', error);
      throw error.response?.data?.message || error.message;
    }
  },

  signup: async (name, npm, email, phone, password) => {
    try {
      const response = await axios.post(API_ENDPOINTS.USER.SIGNUP, {
        name,
        npm,
        email,
        phone,
        password
      });
      console.log('🔍 AuthService - Signup response:', response.data);
      
      if (response.data.success) {
        // Simpan accessToken ke localStorage (backend menggunakan accessToken sekarang)
        const token = response.data.accessToken || response.data.token;
        localStorage.setItem('token', token);
        console.log('✅ AuthService - Token saved to localStorage after signup:', token ? 'exists' : 'missing');
        return response.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      console.error('❌ AuthService - Signup error:', error);
      throw error.response?.data?.message || error.message;
    }
  },

  logout: async () => {
    try {
      // Call backend logout endpoint untuk blacklist token
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(API_ENDPOINTS.USER.LOGOUT, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
      // Tetap lanjut hapus token lokal meski API error
    } finally {
      // Hapus token dari localStorage
      localStorage.removeItem('token');
    }
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService; 