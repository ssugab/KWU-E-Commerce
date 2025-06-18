const API_URL = 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  USER: {
    LOGIN: `${API_URL}/user/login`,
    REGISTER: `${API_URL}/user/register`,
    SIGNUP: `${API_URL}/user/signup`, // Backward compatibility
    LOGOUT: `${API_URL}/user/logout`,
    PROFILE: `${API_URL}/user/profile`,
    CHANGE_PASSWORD: `${API_URL}/user/change-password`,
    REFRESH_TOKEN: `${API_URL}/user/refresh-token`,
    ADMIN_LOGIN: `${API_URL}/user/admin-login`,
    ADMIN_DASHBOARD: `${API_URL}/admin/dashboard`,
    FORGOT_PASSWORD: `${API_URL}/user/forgot-password`,
    RESET_PASSWORD: `${API_URL}/user/reset-password`,
  },
  CATALOG: {
    GET_ALL: `${API_URL}/catalog`,
    GET_ONE: (id) => `${API_URL}/catalog/${id}`,
    GET_HERO: `${API_URL}/catalog/hero`,
    GET_FEATURED: `${API_URL}/catalog`,
    CREATE: `${API_URL}/catalog/create`,
    UPDATE: (id) => `${API_URL}/catalog/update/${id}`,
    DELETE: (id) => `${API_URL}/catalog/delete/${id}`,
  },
  CART: {
    GET: `${API_URL}/cart`,
    ADD: `${API_URL}/cart/add`,
    UPDATE: `${API_URL}/cart/update`,
    REMOVE: `${API_URL}/cart/remove`,
    CLEAR: `${API_URL}/cart/clear`,
  },
  ORDERS: {
    CREATE: `${API_URL}/orders/create`,
    GET: (id) => `${API_URL}/orders/${id}`,
    GET_ALL: `${API_URL}/orders`,
    GET_MY_ORDERS: `${API_URL}/orders/my-orders`,
    GET_BY_EMAIL: (email) => `${API_URL}/orders/user/${email}`,
    UPDATE_STATUS: (id) => `${API_URL}/orders/${id}/status`,
    UPDATE_PAYMENT: (id) => `${API_URL}/orders/${id}/payment`,
    UPLOAD_PROOF: (id) => `${API_URL}/orders/${id}/upload-proof`,
    CONFIRM_RECEIPT: (id) => `${API_URL}/orders/${id}/confirm-receipt`,
    CANCEL: (id) => `${API_URL}/orders/${id}/cancel`,
    DELETE: (id) => `${API_URL}/orders/${id}`,
    
    CONFIRM_PAYMENT: (id) => `${API_URL}/orders/${id}/confirm-payment`,
    REJECT_PAYMENT: (id) => `${API_URL}/orders/${id}/reject-payment`,
    MARK_READY_PICKUP: (id) => `${API_URL}/orders/${id}/ready-pickup`,
    GET_NEW_COUNT: `${API_URL}/orders/admin/new-count`,
  },
  ADMIN: {
    SALES_REPORT: `${API_URL}/admin/sales-report`,
    ANALYTICS: `${API_URL}/admin/analytics`
  }
};