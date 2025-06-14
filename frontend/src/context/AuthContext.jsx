import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../services/authService';
import { API_ENDPOINTS } from '../config/api';

const AuthContext = createContext();



export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Setup axios interceptor untuk menambahkan token otomatis
  useEffect(() => {
    const setupAxiosInterceptor = () => {
      axios.interceptors.request.use(
        (config) => {
          const token = authService.getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );

      // Response interceptor untuk handle token expired
      axios.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.status === 401) {
            logout(); // Auto logout jika token expired
          }
          return Promise.reject(error);
        }
      );
    };

    setupAxiosInterceptor();
  }, []);

  // Check authentication status dan fetch user data saat aplikasi dimuat
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          setIsAuthenticated(true);
          await fetchUserProfile();
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Jika error, hapus token yang invalid
          authService.logout();
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.USER.PROFILE);
      if (response.data.success) {
        setUser(response.data);
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    setIsAuthenticated(true);
    
    // Fetch user profile setelah login berhasil
    await fetchUserProfile();
    
    return response;
  };

  const signup = async (name, npm, email, phone, password) => {
    const response = await authService.signup(name, npm, email, phone, password);
    setIsAuthenticated(true);
    
    // Fetch user profile setelah signup berhasil
    await fetchUserProfile();
    
    return response;
  };

  const adminLogin = async (email, password) => {
    try {
      const response = await axios.post(`${API_ENDPOINTS.USER.LOGIN.replace('/login', '/admin')}`, {
        email,
        password
      });
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true);
        
        // Set admin user data
        setUser({
          email,
          role: 'admin',
          name: 'Admin User'
        });
        
        return response.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  // Function untuk refresh user data
  const refreshUser = async () => {
    if (isAuthenticated) {
      await fetchUserProfile();
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    signup,
    adminLogin,
    logout,
    refreshUser,
    fetchUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 