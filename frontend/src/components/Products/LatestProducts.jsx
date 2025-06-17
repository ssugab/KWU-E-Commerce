import React, { useEffect, useState } from 'react'
import { API_ENDPOINTS } from '../../config/api'
import ProductCard from './ProductCard';

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.CATALOG.GET_FEATURED}&status=active`);
      const data = await response.json();
      
      if (data.success && data.data) {
        // Max 4 Products - filter hanya produk aktif
        const activeProducts = data.data.filter(product => product.status === 'active');
        setFeaturedProducts(activeProducts.slice(0, 4));
      } else {
        // Fallback: if no featured products, get regular active products
        const fallbackResponse = await fetch(`${API_ENDPOINTS.CATALOG.GET_ALL}?status=active&limit=4`);
        const fallbackData = await fallbackResponse.json();
        
        if (fallbackData.success && fallbackData.data) {
          setFeaturedProducts(fallbackData.data.slice(0, 4));
        }
      }
    } catch (error) {
      console.error('Error loading featured products:', error);
      // Fallback empty state
      setFeaturedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center p-10'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4'></div>
        <div className='text-lg text-gray-600'>Memuat produk unggulan...</div>
      </div>
    );
  }

  if (featuredProducts.length === 0) {
    return (
      <div className='flex justify-center items-center p-10'>
        <div className='text-center'>
          <div className='text-4xl mb-4'>⭐</div>
          <div className='text-lg text-gray-600'>Belum ada produk unggulan</div>
          <p className='text-sm text-gray-500 mt-2'>Admin belum menyetel produk untuk ditampilkan di homepage</p>
        </div>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2 md:gap-4 p-4 md:p-10'>
      {featuredProducts.map((item) => (
        <div key={item._id} className="relative">
          {/* Featured Badge */}
          <div className="absolute top-2 left-2 z-10 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold border border-yellow-600 shadow-sm">
            ⭐ Featured
          </div>
          <ProductCard 
            id={item._id} 
            image={item.images && item.images[0]} 
            name={item.name} 
            price={item.price}
          />
        </div>
      ))}
    </div>
  );
};

export default FeaturedProducts;