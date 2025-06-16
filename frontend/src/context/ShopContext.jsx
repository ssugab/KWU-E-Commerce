import { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import cartService from "../services/cartService";
import { useAuth } from "./AuthContext";
import { API_ENDPOINTS } from "../config/api";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [category] = useState([]);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Load cart from database when user logged in
  const loadCartFromDatabase = async () => {
    console.log('🔍 LoadCartFromDatabase - isAuthenticated:', isAuthenticated);
    console.log('🔍 LoadCartFromDatabase - products.length:', products.length);
    
    const token = localStorage.getItem('token');
    if (!isAuthenticated || !token) {
      console.log('⚠️ User not authenticated or no token, skipping cart load');
      return;
    }

    try {
      const response = await cartService.getCart();
      
      if (response.success && response.cart && response.cart.products) {
        // Convert database cart format to local cart format
        const loadedCart = {};
        response.cart.products.forEach(item => {
          const productId = item.productId._id;
          const size = item.size || 'default';
          const quantity = item.quantity;

          if (!loadedCart[productId]) {
            loadedCart[productId] = {};
          }
          loadedCart[productId][size] = quantity;
        });

        console.log('✅ Cart loaded from database:', loadedCart);
        setCart(loadedCart);
      } else {
        console.log('📭 No cart found in database or empty cart');
        setCart({});
      }
    } catch (error) {
      console.error('🚨 Error loading cart from database:', error);
    }
  };

  const addToCart = async (productId, size, quantity) => {
    let cartItems = structuredClone(cart);

    if(cartItems[productId]){
      if(cartItems[productId][size]){
        cartItems[productId][size] += quantity;
      } else {
        cartItems[productId][size] = quantity;
      }
    } else {
      cartItems[productId] = {};
      cartItems[productId][size] = quantity;
    }
    
    setCart(cartItems);

    // Sync ke database jika user login
    console.log('🔍 AddToCart - isAuthenticated:', isAuthenticated);
    console.log('🔍 AddToCart - Token from localStorage:', localStorage.getItem('token') ? 'exists' : 'not found');
    
    if (isAuthenticated) {
      try {
        console.log('🔄 Attempting to add to database cart...');
        const response = await cartService.addToCart(productId, size, quantity);
        console.log('✅ Successfully added to database cart:', response);

      } catch (error) {
        console.error('🚨 Error adding to database cart:', error);
        toast.error('Gagal menyimpan ke cart. Data tersimpan sementara.');
      }
    } else {
      console.log('⚠️ User not authenticated - cart saved locally only');
      toast('Produk ditambahkan ke cart lokal. Login untuk menyimpan permanen.', {
        icon: 'ℹ️'
      });
    }
  };

  const getCartCount = () => {

    let totalCount = 0;
    for(const items in cart) {
      for(const size in cart[items]) {
        try {
          if(cart[items][size] > 0) {
            totalCount += cart[items][size];
          }
        } catch (error) {
          console.log('🚨 Error fetching cart count:', error);
        }
      }
    }
    return totalCount;
  }

  const getCartAmount = () => {
    let totalamount = 0;
    for(const items in cart){
      let itemInfo = products.find(product => product._id === items);
      for(const item in cart[items]){
        try {
          if(itemInfo && cart[items][item] > 0) {
            totalamount += itemInfo.price * cart[items][item];
          }
        } catch (error) {
          console.log('🚨 Error fetching cart amount:', error);
        }
      }
    }
    return totalamount;
  }

  const getCartTotal = () => {
    return getCartAmount(); // Alias untuk getCartAmount
  }

  const updateQuantity = async (productId, size, quantity) => {
    let cartItems = structuredClone(cart);

    if (quantity <= 0) {
      // Remove item jika quantity 0 atau kurang
      if (cartItems[productId]) {
        delete cartItems[productId][size];
        // Jika tidak ada size lain, hapus produk sepenuhnya
        if (Object.keys(cartItems[productId]).length === 0) {
          delete cartItems[productId];
        }
      }
    } else {
      cartItems[productId][size] = quantity;
    }
    
    setCart(cartItems);

    // Sync ke database jika user login
    if (isAuthenticated) {
      try {
        await cartService.updateCartQuantity(productId, size, quantity);
      } catch (error) {
        console.log('🚨 Error updating database cart:', error);
        toast.error('Gagal mengupdate cart. Data tersimpan sementara.');
      }
    }
  }

  const removeFromCart = async (productId, size) => {
    let cartItems = structuredClone(cart);
    
    if (cartItems[productId]) {
      delete cartItems[productId][size];
      // Jika tidak ada size lain, hapus produk sepenuhnya
      if (Object.keys(cartItems[productId]).length === 0) {
        delete cartItems[productId];
      }
    }
    
    setCart(cartItems);

    // Sync ke database jika user login
    if (isAuthenticated) {
      try {
        await cartService.removeFromCart(productId, size);
      } catch (error) {
        console.log('🚨 Error removing from database cart:', error);
        toast.error('Gagal menghapus dari cart. Data tersimpan sementara.');
      }
    }
  };

  const clearCart = async () => {
    setCart({});

    // Sync ke database jika user login
    if (isAuthenticated) {
      try {
        await cartService.clearCart();
      } catch (error) {
        console.log('🚨 Error clearing database cart:', error);
        toast.error('Gagal mengosongkan cart di database.');
      }
    }
  };

  const getProducts = async () => {
    try {
      console.log('🔄 Fetching products from:', API_ENDPOINTS.CATALOG.GET_ALL);
      
      const response = await axios.get(API_ENDPOINTS.CATALOG.GET_ALL);
      
      if(response.data.success){
        console.log('✅ Success! Products data:', response.data.data);
        
        const mappedData = response.data.data.map(item => ({
          ...item,
          id: item._id
        }));
        
        setProducts(mappedData);
      } else {
        console.log('❌ API returned success: false');
        console.log('📝 Error message:', response.data.message);
        toast.error(response.data.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.log('🚨 Error fetching products:', error);
      console.log('🚨 Error response:', error.response);
      
      // Check if error.response exists
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(`Error: ${error.message}`);
      }
    }
  }

  // Load cart from database when user logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (isAuthenticated && token && products.length > 0) {
      console.log('✅ All conditions met: user authenticated, token exists, products loaded');
      // Delay to prevent race condition
      const timeoutId = setTimeout(() => {
        loadCartFromDatabase();
      }, 500); // 500ms delay
      
      return () => clearTimeout(timeoutId);
    } else {
      console.log('⚠️ Conditions not met for cart loading:', {
        isAuthenticated,
        tokenExists: !!token,
        productsLength: products.length
      });
    }
  }, [isAuthenticated, products.length]);

  /* useEffect(() => {
    console.log('🛒 Cart state:', cart);
  }, [cart]);*/ 

  useEffect(() => {
    getProducts();
  }, []);

  const value = {
    products, getProducts,
    category,
    cart, addToCart, getCartCount, getCartAmount, getCartTotal,
    removeFromCart, updateQuantity, clearCart,
    loadCartFromDatabase,

    navigate
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;