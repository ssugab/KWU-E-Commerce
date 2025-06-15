import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../services/authService';
import { API_ENDPOINTS } from '../config/api';

const AuthContext = createContext();


const useAuth = () => {
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
      console.log('🔍 AuthContext - Checking auth status, token:', token ? 'exists' : 'not found');
      
      if (token) {
        try {
          console.log('🔄 AuthContext - Setting authenticated true and fetching profile...');
          setIsAuthenticated(true);
          await fetchUserProfile();
        } catch (error) {
          console.error('❌ AuthContext - Error fetching user profile:', error);
          // Jika error, hapus token yang invalid
          authService.logout();
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        console.log('⚠️ AuthContext - No token found, setting authenticated false');
        setIsAuthenticated(false);
        setUser(null);
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
        
        // Save email user to localStorage for fallback in payment
        if (response.data.email) {
          localStorage.setItem('userEmail', response.data.email);
        }
        
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    console.log('🔄 AuthContext - Logging in...');
    const response = await authService.login(email, password);

    console.log('✅ AuthContext - Login successful, setting authenticated true');
    setIsAuthenticated(true);
    
    // Fetch user profile setelah login berhasil
    await fetchUserProfile();
    console.log('✅ AuthContext - User profile fetched after login');
    
    return response;
  };

  const signup = async (name, npm, email, phone, password) => {
    console.log('🔄 AuthContext - Signing up...');
    const response = await authService.signup(name, npm, email, phone, password);
    console.log('✅ AuthContext - Signup successful, setting authenticated true');
    setIsAuthenticated(true);
    
    // Fetch user profile setelah signup berhasil
    await fetchUserProfile();
    console.log('✅ AuthContext - User profile fetched after signup');
    
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

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      
      // Clear user email from localStorage
      localStorage.removeItem('userEmail');
    }
  };

  // Function to refresh user data
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

export default AuthProvider;
export { useAuth };