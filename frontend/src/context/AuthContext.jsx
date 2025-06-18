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

  let refreshPromise = null;

  const refreshAccessToken = async () => {
    try {
      const refreshToken = authService.getRefreshToken();
      if (!refreshToken) {
        console.log('❌ No refresh token found');
        return { success: false };
      }

      console.log('🔄 Refreshing access token...');
      const response = await axios.post(API_ENDPOINTS.USER.REFRESH_TOKEN, {
        refreshToken: refreshToken
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        
        localStorage.setItem('token', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }
        
        console.log('Token refreshed successfully');
        return { success: true, accessToken };
      }
      
      return { success: false };
    } catch (error) {
      console.error('❌ Token refresh error:', error);
      return { success: false };
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

  useEffect(() => {
    // Set default config for cookies
    axios.defaults.withCredentials = true;
    
    // Request interceptor - add token to headers
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = authService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        config.withCredentials = true;
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle token refresh
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          const requestUrl = originalRequest?.url || '';
          
          if (requestUrl.includes('/login') || requestUrl.includes('/admin-login') || requestUrl.includes('/forgot-password') || requestUrl.includes('/reset-password')) {
            return Promise.reject(error);
          }

          if (!isAuthenticated) {
            return Promise.reject(error);
          }

          originalRequest._retry = true;

          try {
            if (refreshPromise) {
              await refreshPromise;
              return axios(originalRequest);
            }

            // Start refresh process
            refreshPromise = refreshAccessToken();
            const result = await refreshPromise;
            refreshPromise = null;

            if (result.success) {
              // Update token in original request
              originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;
              return axios(originalRequest);
            } else {
              const refreshToken = authService.getRefreshToken();
              if (!refreshToken) {
                logout();
              }
              throw new Error('Refresh failed');
            }
          } catch (refreshError) {
            refreshPromise = null;
            const refreshToken = authService.getRefreshToken();
            if (!refreshToken) {
              console.log('🚫 Token refresh failed, logging out...');
              logout();
            }
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [isAuthenticated]);


  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = authService.getToken();
      //console.log('🔍 AuthContext - Checking auth status, token:', token ? 'exists' : 'not found');
      
      if (token) {
        try {
          setIsAuthenticated(true);
          await fetchUserProfile();
        } catch (error) {
          console.error('❌ Error fetching user profile:', error);
          authService.logout();
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
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
        const userData = response.data.user || response.data;
        setUser(userData);
        
        if (userData.email) {
          localStorage.setItem('userEmail', userData.email);
        }
        
        return userData;
      }
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    setIsAuthenticated(true);
    await fetchUserProfile();
    return response;
  };

  const register = async (name, npm, email, phone, password, major) => {
    const response = await authService.register(name, npm, email, phone, password, major);
    setIsAuthenticated(true);
    await fetchUserProfile();
    return response;
  };

  const signup = register; // Backward compatibility

  const adminLogin = async (email, password) => {
    try {
      const response = await axios.post(API_ENDPOINTS.USER.ADMIN_LOGIN, {
        email,
        password
      }, {
        withCredentials: true
      });
      
      if (response.data.success) {
        const { accessToken, refreshToken } = response.data;
        
        if (accessToken) {
          localStorage.setItem('token', accessToken);
        }
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        
        setIsAuthenticated(true);
        
        const userData = response.data.user || {
          email,
          role: 'admin',
          name: 'Admin User'
        };
        setUser(userData);
        
        console.log('✅ Admin login successful');
        return response.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      console.error('❌ Admin login error:', error);
      throw error.response?.data?.message || error.message;
    }
  };

  const refreshUser = async () => {
    if (isAuthenticated) {
      await fetchUserProfile();
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    const response = await authService.changePassword(currentPassword, newPassword);
    return response;
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    signup,
    adminLogin,
    logout,
    refreshUser,
    fetchUserProfile,
    changePassword,
    refreshAccessToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 

export default AuthProvider;
export { useAuth };