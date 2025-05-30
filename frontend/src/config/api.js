const API_URL = 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  USER: {
    LOGIN: `${API_URL}/user/login`,
    SIGNUP: `${API_URL}/user/signup`,
    LOGOUT: `${API_URL}/user/logout`,
    PROFILE: `${API_URL}/user/profile`,
    ADMIN_LOGIN: `${API_URL}/user/admin-login`,
  },
  PRODUCTS: {
    GET_ALL: `${API_URL}/products`,
    GET_ONE: (id) => `${API_URL}/products/${id}`,
    CATEGORY: (category) => `${API_URL}/products/${category}`,
    CREATE: `${API_URL}/products/create`,
    UPDATE: (id) => `${API_URL}/products/update/${id}`,
    DELETE: (id) => `${API_URL}/products/delete/${id}`,
  }
}; 