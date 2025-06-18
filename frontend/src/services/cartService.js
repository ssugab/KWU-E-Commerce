import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import authService from './authService';

const cartService = {
  getAuthHeaders: () => {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  },

  // Get cart
  getCart: async () => {
    try {
      if (!authService.getToken()) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.get(API_ENDPOINTS.CART.GET, {
        headers: cartService.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Failed to get cart';
    }
  },

  // Add to cart
  addToCart: async (productId, size, quantity) => {
    try {
      const response = await axios.post(API_ENDPOINTS.CART.ADD, {
        productId, size, quantity
      }, {
        headers: cartService.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to add to cart';
    }
  },

  // Update cart quantity
  updateCartQuantity: async (productId, size, quantity) => {
    try {
      const response = await axios.put(API_ENDPOINTS.CART.UPDATE, {
        productId, size, quantity
      }, {
        headers: cartService.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update cart';
    }
  },

  // Remove from cart
  removeFromCart: async (productId, size) => {
    try {
      const response = await axios.delete(API_ENDPOINTS.CART.REMOVE, {
        headers: cartService.getAuthHeaders(),
        data: {
          productId,
          size
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Failed to remove from cart';
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      const response = await axios.delete(API_ENDPOINTS.CART.CLEAR, {
        headers: cartService.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Failed to clear cart';
    }
  }
};

export default cartService; 