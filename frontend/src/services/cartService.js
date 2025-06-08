import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import authService from './authService';

const cartService = {
  // Helper function untuk mendapatkan header dengan token
  getAuthHeaders: () => {
    const token = authService.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  },

  // Mendapatkan cart user
  getCart: async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.CART.GET, {
        headers: cartService.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error getting cart:', error);
      throw error.response?.data?.message || error.message;
    }
  },

  // Menambah item ke cart
  addToCart: async (productId, size, quantity) => {
    try {
      const response = await axios.post(API_ENDPOINTS.CART.ADD, {
        productId,
        size,
        quantity
      }, {
        headers: cartService.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error.response?.data?.message || error.message;
    }
  },

  // Update quantity item di cart
  updateCartQuantity: async (productId, size, quantity) => {
    try {
      const response = await axios.put(API_ENDPOINTS.CART.UPDATE, {
        productId,
        size,
        quantity
      }, {
        headers: cartService.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error.response?.data?.message || error.message;
    }
  },

  // Menghapus item dari cart
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
      console.error('Error removing from cart:', error);
      throw error.response?.data?.message || error.message;
    }
  },

  // Menghapus semua item dari cart
  clearCart: async () => {
    try {
      const response = await axios.delete(API_ENDPOINTS.CART.CLEAR, {
        headers: cartService.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error.response?.data?.message || error.message;
    }
  }
};

export default cartService; 