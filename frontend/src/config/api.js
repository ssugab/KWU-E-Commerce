const API_URL = 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  USER: {
    LOGIN: `${API_URL}/user/login`,
    SIGNUP: `${API_URL}/user/signup`,
    LOGOUT: `${API_URL}/user/logout`,
    PROFILE: `${API_URL}/user/profile`,
    ADMIN_LOGIN: `${API_URL}/user/admin-login`,
    ADMIN_DASHBOARD: `${API_URL}/admin/dashboard`,
  },
  PRODUCTS: {
    GET_ALL: `${API_URL}/products`,
    GET_ONE: (id) => `${API_URL}/products/${id}`,
    CATEGORY: (category) => `${API_URL}/products/${category}`,
    CREATE: `${API_URL}/products/create`,
    UPDATE: (id) => `${API_URL}/products/update/${id}`,
    DELETE: (id) => `${API_URL}/products/delete/${id}`,
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
    GET_ALL: `${API_URL}/orders`,
    GET_ONE: (id) => `${API_URL}/orders/${id}`,
    GET_BY_NUMBER: (orderNumber) => `${API_URL}/orders/number/${orderNumber}`,
    GET_BY_EMAIL: (email) => `${API_URL}/orders/user/${email}`,
    UPDATE_STATUS: (id) => `${API_URL}/orders/${id}/status`,
    UPDATE_PAYMENT: (id) => `${API_URL}/orders/${id}/payment`,
    CANCEL: (id) => `${API_URL}/orders/${id}/cancel`,
    DELETE: (id) => `${API_URL}/orders/${id}`,
  }
};