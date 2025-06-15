import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import authService from './authService';

const cartService = {
  // Helper untuk auth headers
  getAuthHeaders: () => ({
    'Authorization': `Bearer ${authService.getToken()}`,
    'Content-Type': 'application/json'
  }),

  // Get cart
  getCart: async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.CART.GET, {
        headers: cartService.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal mengambil cart';
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
      throw error.response?.data?.message || 'Gagal menambah ke cart';
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
      throw error.response?.data?.message || 'Gagal update cart';
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