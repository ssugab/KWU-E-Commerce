import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const ShopContext = createContext();

const ShopContextProvider = (props) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [catalog, setCatalog] = useState([]);
  const [cart, setCart] = useState([]);
  const [category] = useState([]);

  const addToCart = (productId) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === productId);
      if (existingItem) {
        return prev.map(item => 
          item.id === productId 
            ? {...item, quantity: item.quantity + 1}
            : item
        );
      }
      return [...prev, { id: productId, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCatalog = async () => {
    try {
      //console.log('🔄 Fetching catalog from:', `${backendUrl}/api/catalog/`);
      //console.log('📍 Backend URL:', backendUrl);
      
      const response = await axios.get(`${backendUrl}/api/catalog/`);
      //console.log('📦 Response received:', response);
      //console.log('📊 Response data:', response.data);
      
      if(response.data.success){
        console.log('✅ Success! Catalog data:', response.data.data);
        
        // Map _id ke id untuk konsistensi
        const mappedData = response.data.data.map(item => ({
          ...item,
          id: item._id // Tambahkan field id yang sama dengan _id
        }));
        
        //console.log('🔄 Mapped catalog data:', mappedData);
        setCatalog(mappedData);
      } else {
        console.log('❌ API returned success: false');
        console.log('📝 Error message:', response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log('🚨 Error fetching catalog:', error);
      console.log('🚨 Error response:', error.response);

    }
  }

  const getCatalogByCategory = async (category) => {
    try {
      const response = await axios.get(`${backendUrl}/api/catalog/${category}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching catalog by category:', error);
    }
  }

  useEffect(() => {
    getCatalog();
  }, []);

  const value = {
    catalog, getCatalog,
    category, getCatalogByCategory,
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    backendUrl
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;