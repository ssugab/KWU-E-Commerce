import { API_ENDPOINTS } from '../config/api';

const getAllProducts = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.CATALOG.GET_ALL);
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return data.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

const getProduct = async (id) => {
  try {
    const response = await fetch(API_ENDPOINTS.CATALOG.GET_ONE(id));
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return data.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

const getLatestProducts = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.CATALOG.GET_FEATURED);
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return data.data;
  } catch (error) {
    console.error('Error fetching latest products:', error);
    throw error;
  }
};

export const productService = {
  getAllProducts,
  getProduct,
  getLatestProducts
};

export default productService;