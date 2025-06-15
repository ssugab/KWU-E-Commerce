import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

// Configure axios timeout
axios.defaults.timeout = 15000; // 15 seconds

export const useCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  // Helper function untuk get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  // Simple validation
  const validateOrderData = useCallback((orderData) => {
    const { customer, items, pricing } = orderData;
    
    if (!customer?.name || !customer?.email || !customer?.phone) {
      return { isValid: false, message: 'Data customer tidak lengkap' };
    }
    
    if (!items?.length) {
      return { isValid: false, message: 'Keranjang kosong' };
    }
    
    // Validasi setiap item
    items?.forEach((item, index) => {
      if (!item.productId) {
        return { isValid: false, message: `Item ${index + 1}: Product ID tidak valid` };
      }
      if (!item.quantity || item.quantity < 1) {
        return { isValid: false, message: `Item ${index + 1}: Quantity tidak valid` };
      }
    });

    if (!pricing?.total || pricing.total <= 0) {
      return { isValid: false, message: 'Total tidak valid' };
    }
    
    return { isValid: true, message: 'Valid' };
  }, []);

  // Format data untuk dikirim ke backend
  const formatOrderData = useCallback((userData, cartItems, subtotal) => {
    const total = subtotal;

    // Sanitize input data
    const sanitizeString = (str) => str?.toString().trim() || '';

    return {
      customer: {
        name: sanitizeString(userData.name),
        email: sanitizeString(userData.email).toLowerCase(),
        phone: sanitizeString(userData.phone),
        npm: sanitizeString(userData.npm)
      },
      items: cartItems.map(item => ({
        productId: item._id,
        size: item.size || 'default',
        quantity: parseInt(item.quantity) || 1
      })),
      pricing: {
        subtotal: parseFloat(subtotal) || 0,
        total: parseFloat(total) || 0
      },
      orderDate: new Date().toISOString(),
      source: 'web', // Track order source
      userAgent: navigator.userAgent.substring(0, 200) // Untuk debugging
    };
  }, []);

  // Create order - Simplified
  const createOrder = useCallback(async (userData, cartItems, subtotal) => {
    setIsLoading(true);
    
    try {
      const orderData = formatOrderData(userData, cartItems, subtotal);
      const validation = validateOrderData(orderData);
      
      if (!validation.isValid) {
        throw new Error(validation.message);
      }

      // Get token for authentication
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found. Please login again.');
      }
      const response = await axios.post(API_ENDPOINTS.ORDERS.CREATE, orderData, {
        headers: getAuthHeaders()
      });

      if (response.data.success) {
        const order = response.data.order;
        setCurrentOrder(order);
        sessionStorage.setItem('currentOrderId', order._id);
        sessionStorage.setItem('orderCreatedAt', new Date().toISOString());
        
        console.log('✅ Order created successfully:', order);
        
        return {
          success: true,
          order,
          orderId: order._id,
          message: 'Order created successfully'
        };
      } else {
        throw new Error(response.data.message || 'Failed to create order');
      }

      
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to create order'
      };
    } finally {
      setIsLoading(false);
    }
  }, [formatOrderData, validateOrderData]);

  // Get order by ID
  const getOrder = useCallback(async (orderId) => {
    if (!orderId) return { success: false, message: 'Order ID tidak valid' };

    try {
      const response = await axios.get(API_ENDPOINTS.ORDERS.GET(orderId));
      if (response.data.success) {
        return {
          success: true,
          order: response.data.order
        };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Failed to get order';
    }
  }, []);

  // Get orders by email (untuk user) dengan pagination yang lebih baik
  const getOrdersByEmail = useCallback(async (email, page = 1, limit = 10) => {
    if (!email) return { success: false, message: 'Email tidak valid', orders: [] };

    try {
      const response = await axios.get(
        `${API_ENDPOINTS.ORDERS.GET_BY_EMAIL(email)}?page=${page}&limit=${limit}`
      );
      
      if (response.data.success) {
        return {
          success: true,
          orders: response.data.orders || [],
          pagination: response.data.pagination || null
        };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('❌ Error fetching orders by email:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Gagal mengambil daftar pesanan',
        orders: [],
        pagination: null
      };
    }
  }, []);

  // Update order status (untuk admin) dengan validasi
  const updateOrderStatus = useCallback(async (orderId, status, adminNotes = '') => {
    if (!orderId || !status) return { success: false, message: 'Parameter tidak lengkap' };

    try {
      const response = await axios.put(API_ENDPOINTS.ORDERS.UPDATE_STATUS(orderId), {
        status,
        adminNotes: adminNotes.trim()
      });
      
      if (response.data.success) {
        return {
          success: true,
          order: response.data.order,
          message: 'Status pesanan berhasil diperbarui'
        };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('❌ Error updating order status:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Gagal memperbarui status pesanan'
      };
    }
  }, []);

  // Update payment status dengan validasi
  const updatePaymentStatus = useCallback(async (orderId, paymentStatus, paymentMethod = null) => {
    if (!orderId || !paymentStatus) return { success: false, message: 'Parameter tidak lengkap' };

    try {
      const response = await axios.put(API_ENDPOINTS.ORDERS.UPDATE_PAYMENT(orderId), {
        paymentStatus,
        paymentMethod
      });
      
      if (response.data.success) {
        return {
          success: true,
          order: response.data.order,
          message: 'Status pembayaran berhasil diperbarui'
        };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('❌ Error updating payment status:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Gagal memperbarui status pembayaran'
      };
    }
  }, []);

  // Cancel order dengan alasan
  const cancelOrder = useCallback(async (orderId, reason = '') => {
    if (!orderId) return { success: false, message: 'Order ID tidak valid' };

    try {
      const response = await axios.put(API_ENDPOINTS.ORDERS.CANCEL(orderId), {
        reason: reason.trim(),
        cancelledBy: 'customer',
        cancelledAt: new Date().toISOString()
      });
      
      if (response.data.success) {
        return {
          success: true,
          order: response.data.order,
          message: 'Pesanan berhasil dibatalkan'
        };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('❌ Error cancelling order:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Gagal membatalkan pesanan'
      };
    }
  }, []);

  // Clear current order
  const clearCurrentOrder = useCallback(() => {
    setCurrentOrder(null);
    sessionStorage.removeItem('currentOrderId');
    sessionStorage.removeItem('orderCreatedAt');
  }, []);

  // Get current order from session - Simplified
  const getCurrentOrderFromSession = useCallback(async () => {
    const orderId = sessionStorage.getItem('currentOrderId');
    
    if (orderId) {
      const result = await getOrder(orderId);
      if (result.success) {
        setCurrentOrder(result.order);
        return result.order;
      } else {
        // Order tidak ditemukan di database, bersihkan session
        console.log('❌ Order not found in database, clearing session...');
        clearCurrentOrder();
      }
    }
    
    // Fallback: Jika tidak ada order di session atau order tidak valid, coba ambil order terbaru user
    console.log('🔄 No valid order in session, trying to get latest order...');
    
    // Cek apakah ada user yang login
    const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
    if (userEmail) {
      try {
        const result = await getOrdersByEmail(userEmail, 1, 1); // Ambil 1 order terbaru
        if (result.success && result.orders && result.orders.length > 0) {
          const latestOrder = result.orders[0];
          // Hanya ambil order yang statusnya pending payment
          if (latestOrder.paymentStatus === 'pending') {
            console.log('✅ Found latest pending order:', latestOrder._id);
            // Simpan ke session untuk next time
            sessionStorage.setItem('currentOrderId', latestOrder._id);
            sessionStorage.setItem('orderCreatedAt', latestOrder.orderDate);
            
            setCurrentOrder(latestOrder);
            return latestOrder;
          } else {
            console.log('⚠️ Latest order is not pending payment:', latestOrder.paymentStatus);
          }
        } else console.log('📭 No orders found for user');
      } catch (error) {
        console.error('❌ Error getting latest order:', error);
      }
    } else {
      console.log('❌ No user email found in storage');
    }
    
    return null;
  }, [getOrder, clearCurrentOrder, getOrdersByEmail]);

  return {
    // State
    isLoading,
    currentOrder,

    // Core functions
    createOrder,
    getOrder,
    getOrdersByEmail,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder,

    // Utility functions
    validateOrderData,
    formatOrderData,
    clearCurrentOrder,
    getCurrentOrderFromSession
  };
}; 