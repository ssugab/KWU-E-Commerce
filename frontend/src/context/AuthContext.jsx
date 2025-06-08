import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../services/authService';

const AuthContext = createContext();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

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

  // Check authentication status saat aplikasi dimuat
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = authService.getToken();
      if (token) {
        setIsAuthenticated(true);
        // Bisa tambahkan fetch user profile di sini jika diperlukan
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    setIsAuthenticated(true);
    setUser(response.user || { email }); // Set user data jika ada
    return response;
  };

  const signup = async (name, npm, email, phone, password) => {
    const response = await authService.signup(name, npm, email, phone, password);
    setIsAuthenticated(true);
    setUser(response.user || { name, npm, email, phone }); // Set user data jika ada
    return response;
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const getUser = async () => {
    const response = await axios.get(`${backendUrl}/api/user/profile`);
    setUser(response.data.user);
  }

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    signup,
    logout,
    getUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 