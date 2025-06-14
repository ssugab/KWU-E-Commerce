import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

// Configure axios defaults untuk timeout dan retry
axios.defaults.timeout = 30000; // 30 seconds timeout

export const useCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  // Utility function untuk retry failed requests
  const retryRequest = useCallback(async (requestFn, maxRetries = 3, delay = 1000) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        console.warn(`❌ Request attempt ${attempt} failed:`, error.message);
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }, []);

  // Validasi data order sebelum dikirim ke backend
  const validateOrderData = useCallback((orderData) => {
    const errors = [];

    // Validasi customer info
    if (!orderData.customer?.name?.trim()) {
      errors.push('Nama wajib diisi');
    }
    if (!orderData.customer?.email?.trim()) {
      errors.push('Email wajib diisi');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderData.customer.email)) {
      errors.push('Format email tidak valid');
    }
    if (!orderData.customer?.phone?.trim()) {
      errors.push('Nomor telepon wajib diisi');
    } else if (!/^[0-9+\-\s()]{10,}$/.test(orderData.customer.phone)) {
      errors.push('Format nomor telepon tidak valid (minimal 10 digit)');
    }

    // Validasi items
    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      errors.push('Keranjang kosong atau tidak valid');
    }

    // Validasi setiap item
    orderData.items?.forEach((item, index) => {
      if (!item.productId) {
        errors.push(`Item ${index + 1}: Product ID tidak valid`);
      }
      if (!item.quantity || item.quantity < 1) {
        errors.push(`Item ${index + 1}: Quantity tidak valid`);
      }
    });

    // Validasi pricing
    if (!orderData.pricing || orderData.pricing.total <= 0) {
      errors.push('Total pesanan tidak valid');
    }

    return {
      isValid: errors.length === 0,
      errors,
      message: errors.length > 0 ? errors[0] : 'Data valid'
    };
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

  // Buat order baru dengan retry mechanism
  const createOrder = useCallback(async (userData, cartItems, subtotal) => {
    setIsLoading(true);
    
    try {
      // Format data order
      const orderData = formatOrderData(userData, cartItems, subtotal);
      
      // Validasi data
      const validation = validateOrderData(orderData);
      if (!validation.isValid) {
        throw new Error(validation.message);
      }

      console.log('📤 Sending order data:', orderData);

      // Get token for authentication
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login ulang.');
      }

      // Kirim ke backend dengan retry mechanism dan auth headers
      const response = await retryRequest(async () => {
        return await axios.post(API_ENDPOINTS.ORDERS.CREATE, orderData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      });

      if (response.data.success) {
        const order = response.data.order;
        setCurrentOrder(order);
        
        // Simpan order ID ke session storage untuk payment
        sessionStorage.setItem('currentOrderId', order._id);
        sessionStorage.setItem('currentOrderNumber', order.orderNumber);
        sessionStorage.setItem('orderCreatedAt', new Date().toISOString());
        
        console.log('✅ Order created successfully:', order);
        
        return {
          success: true,
          order,
          orderId: order._id,
          orderNumber: order.orderNumber,
          message: 'Pesanan berhasil dibuat'
        };
      } else {
        throw new Error(response.data.message || 'Gagal membuat pesanan');
      }

    } catch (error) {
      console.error('❌ Error creating order:', error);
      
      // Improved error messaging
      let errorMessage = 'Terjadi kesalahan saat membuat pesanan';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Koneksi timeout. Silakan coba lagi.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Sesi telah berakhir. Silakan login ulang.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Data pesanan tidak valid';
      } else if (error.response?.status === 500) {
        errorMessage = 'Terjadi kesalahan server. Silakan coba lagi.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error.response?.data || error
      };
    } finally {
      setIsLoading(false);
    }
  }, [formatOrderData, validateOrderData, retryRequest]);

  // Get order by ID dengan error handling yang lebih baik
  const getOrder = useCallback(async (orderId) => {
    if (!orderId) {
      return {
        success: false,
        message: 'Order ID tidak valid'
      };
    }

    try {
      const response = await axios.get(API_ENDPOINTS.ORDERS.GET_ONE(orderId));
      
      if (response.data.success) {
        return {
          success: true,
          order: response.data.order
        };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('❌ Error fetching order:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Gagal mengambil data pesanan'
      };
    }
  }, []);

  // Get orders by email (untuk user) dengan pagination yang lebih baik
  const getOrdersByEmail = useCallback(async (email, page = 1, limit = 10) => {
    if (!email) {
      return {
        success: false,
        message: 'Email tidak valid',
        orders: [],
        pagination: null
      };
    }

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
    if (!orderId || !status) {
      return {
        success: false,
        message: 'Parameter tidak lengkap'
      };
    }

    try {
      const response = await axios.put(API_ENDPOINTS.ORDERS.UPDATE_STATUS(orderId), {
        status,
        adminNotes: adminNotes.trim(),
        updatedBy: 'admin',
        updatedAt: new Date().toISOString()
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
    if (!orderId || !paymentStatus) {
      return {
        success: false,
        message: 'Parameter tidak lengkap'
      };
    }

    try {
      const response = await axios.put(API_ENDPOINTS.ORDERS.UPDATE_PAYMENT(orderId), {
        paymentStatus,
        paymentMethod,
        paymentUpdatedAt: new Date().toISOString()
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
    if (!orderId) {
      return {
        success: false,
        message: 'Order ID tidak valid'
      };
    }

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

  // Clear current order dengan cleanup yang lebih baik
  const clearCurrentOrder = useCallback(() => {
    setCurrentOrder(null);
    sessionStorage.removeItem('currentOrderId');
    sessionStorage.removeItem('currentOrderNumber');
    sessionStorage.removeItem('orderCreatedAt');
  }, []);

  // Get current order from session dengan validasi expiry
  const getCurrentOrderFromSession = useCallback(async () => {
    const orderId = sessionStorage.getItem('currentOrderId');
    const orderCreatedAt = sessionStorage.getItem('orderCreatedAt');
    
    if (orderId) {
      // Check if order session is not too old (24 hours)
      if (orderCreatedAt) {
        const createdTime = new Date(orderCreatedAt);
        const now = new Date();
        const hoursDiff = (now - createdTime) / (1000 * 60 * 60);
        
        if (hoursDiff > 24) {
          console.log('🕐 Order session expired, clearing...');
          clearCurrentOrder();
          return null;
        }
      }
      
      const result = await getOrder(orderId);
      if (result.success) {
        setCurrentOrder(result.order);
        return result.order;
      } else {
        // Clear invalid order from session
        clearCurrentOrder();
      }
    }
    return null;
  }, [getOrder, clearCurrentOrder]);

  // Get order statistics (helper function)
  const getOrderStats = useCallback(async (email) => {
    try {
      const result = await getOrdersByEmail(email, 1, 100); // Get all orders
      if (result.success) {
        const orders = result.orders;
        return {
          total: orders.length,
          pending: orders.filter(o => o.status === 'pending').length,
          confirmed: orders.filter(o => o.status === 'confirmed').length,
          completed: orders.filter(o => o.status === 'completed').length,
          cancelled: orders.filter(o => o.status === 'cancelled').length,
          totalAmount: orders.reduce((sum, o) => sum + (o.pricing?.total || 0), 0)
        };
      }
      return null;
    } catch (error) {
      console.error('❌ Error getting order stats:', error);
      return null;
    }
  }, [getOrdersByEmail]);

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
    getCurrentOrderFromSession,
    getOrderStats,
    retryRequest
  };
}; 