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
    
    if (isAuthenticated) {
      try {
        const response = await cartService.addToCart(productId, size, quantity);
        console.log('✅ Successfully added to cart:', response);

      } catch (error) {
        console.error('🚨 Error adding to database cart:', error);
        toast.error('Failed to add to cart. Data saved temporarily.');
      }
    } else {
      console.log('⚠️ User not authenticated - cart saved locally only');
      toast('Product added to local cart. Login to save permanently.', {
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
    return getCartAmount(); // Alias for getCartAmount
  }

  const updateQuantity = async (productId, size, quantity) => {
    let cartItems = structuredClone(cart);

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      if (cartItems[productId]) {
        delete cartItems[productId][size];
        // If no other size, delete product completely
        if (Object.keys(cartItems[productId]).length === 0) {
          delete cartItems[productId];
        }
      }
    } else {
      cartItems[productId][size] = quantity;
    }
    
    setCart(cartItems);

    // Sync to database if user is logged in
    if (isAuthenticated) {
      try {
        await cartService.updateCartQuantity(productId, size, quantity);
      } catch (error) {
        console.log('🚨 Error updating database cart:', error);
        toast.error('Failed to update cart. Data saved temporarily.');
      }
    }
  }

  const removeFromCart = async (productId, size) => {
    let cartItems = structuredClone(cart);
    
    if (cartItems[productId]) {
      delete cartItems[productId][size];
      // If no other size, delete product completely
      if (Object.keys(cartItems[productId]).length === 0) {
        delete cartItems[productId];
      }
    }
    
    setCart(cartItems);

    // Sync to database if user is logged in
    if (isAuthenticated) {
      try {
        await cartService.removeFromCart(productId, size);
      } catch (error) {
        console.log('🚨 Error removing from database cart:', error);
        toast.error('Failed to remove from cart. Data saved temporarily.');
      }
    }
  };

  const clearCart = async () => {
    setCart({});

    // Sync to database if user is logged in
    if (isAuthenticated) {
      try {
        await cartService.clearCart();
      } catch (error) {
        console.log('🚨 Error clearing database cart:', error);
        toast.error('Failed to clear cart in database.');
      }
    }
  };

  const getProducts = async () => {
    try {
      
      const response = await axios.get(API_ENDPOINTS.CATALOG.GET_ALL);
      
      if(response.data.success){
        
        const mappedData = response.data.data.map(item => ({
          ...item,
          id: item._id,
          status: item.status
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
      
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(`Error: ${error.message}`);
      }
    }
  }


  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (isAuthenticated && token && products.length > 0) {
      //console.log('All conditions met: user authenticated, token exists, products loaded');
      const timeoutId = setTimeout(() => {
        loadCartFromDatabase();
      }, 500);
      
      return () => clearTimeout(timeoutId);
    } else {
      console.log('Conditions not met for cart loading:', {
        isAuthenticated,
        tokenExists: !!token,
        productsLength: products.length
      });
    }
  }, [isAuthenticated, products.length]);

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