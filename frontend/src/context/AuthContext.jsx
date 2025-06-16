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

  // Setup axios interceptor untuk menambahkan token otomatis dan support cookies
  useEffect(() => {
    const setupAxiosInterceptor = () => {
      // Set default config untuk cookies
      axios.defaults.withCredentials = true;
      
      axios.interceptors.request.use(
        (config) => {
          // Tetap kirim Authorization header sebagai fallback
          const token = authService.getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          
          // Pastikan withCredentials true untuk semua request
          config.withCredentials = true;
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
            const requestUrl = error.config?.url || '';
            
            // 🚫 Jangan auto logout untuk endpoint login dan admin-login
            if (requestUrl.includes('/login') || requestUrl.includes('/admin-login')) {
              console.log('🔓 AuthContext - 401 on login endpoint, not logging out');
              return Promise.reject(error);
            }
            
            // 🚫 Jangan auto logout jika user belum authenticated (avoid loop)
            if (!isAuthenticated) {
              console.log('🔓 AuthContext - 401 detected but user not authenticated, skipping logout');
              return Promise.reject(error);
            }
            
            console.log('🚫 AuthContext - 401 detected on protected endpoint, logging out...');
            logout(); // Auto logout jika token expired pada protected endpoints
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
        // Backend mengirim user data dalam response.data.user
        const userData = response.data.user || response.data;
        setUser(userData);
        
        // Save email user to localStorage for fallback in payment
        if (userData.email) {
          localStorage.setItem('userEmail', userData.email);
        }
        
        return userData;
      }
    } catch (error) {
      console.error('❌ AuthContext - Error fetching user profile:', error);
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

  const register = async (name, npm, email, phone, password) => {
    const response = await authService.register(name, npm, email, phone, password);
    setIsAuthenticated(true);
 
    await fetchUserProfile();
    
    return response;
  };

  // Backward compatibility alias
  const signup = register;

  const adminLogin = async (email, password) => {
    try {
      const response = await axios.post(`${API_ENDPOINTS.USER.ADMIN_LOGIN}`, {
        email,
        password
      }, {
        withCredentials: true
      });
      
      if (response.data.success) {
        // Backend set cookies dan mengirim accessToken
        const token = response.data.accessToken || response.data.token;
        if (token) {
          localStorage.setItem('token', token);
          console.log('✅ AuthContext - Admin token saved to localStorage');
          
          // Verify token tersimpan
          const savedToken = localStorage.getItem('token');
          console.log('🔍 Token verification after save:', savedToken ? `${savedToken.substring(0, 20)}...` : 'NULL');
        } else {
          console.error('❌ No token received from admin login response');
        }
        
        setIsAuthenticated(true);
        
        // Set admin user data dari response backend
        const userData = response.data.user || {
          email,
          role: 'admin',
          name: 'Admin User'
        };
        setUser(userData);
        
        console.log('✅ AuthContext - Admin login successful');
        return response.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      console.error('❌ AuthContext - Admin login error:', error);
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
      
      localStorage.removeItem('userEmail');
    }
  };

  // Function to refresh user data
  const refreshUser = async () => {
    if (isAuthenticated) {
      await fetchUserProfile();
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    console.log('🔄 AuthContext - Changing password...');
    const response = await authService.changePassword(currentPassword, newPassword);
    console.log('✅ AuthContext - Password changed successfully');
    return response;
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    signup, // backward compatibility
    adminLogin,
    logout,
    refreshUser,
    fetchUserProfile,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 

export default AuthProvider;
export { useAuth };