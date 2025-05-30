import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../../context/ShopContext'
import ProductCard from './ProductCard';

const LatestProducts = () => {
  const { catalog } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Algoritma untuk mendapatkan produk terbaru
    if (catalog && catalog.length > 0) {
      console.log('🔍 LatestProducts - Catalog data:', catalog);
      
      // Opsi 1: Ambil 4 produk pertama (asumsi data sudah diurutkan berdasarkan tanggal terbaru)
      const latest = catalog.slice(0, 4);
      
      console.log('📦 Latest products:', latest);
      console.log('🖼️ Images check:', latest.map(item => ({
        id: item.id,
        name: item.name,
        images: item.images,
        firstImage: item.images && item.images[0]
      })));
      
      // Opsi 2: Jika ingin urutkan berdasarkan ID terbesar (ID auto-increment)
      // const latest = catalog
      //   .sort((a, b) => b.id - a.id)
      //   .slice(0, 4);
      
      // Opsi 3: Jika ada field createdAt/dateAdded
      // const latest = catalog
      //   .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      //   .slice(0, 4);
      
      setLatestProducts(latest);
      setLoading(false);
    }
  }, [catalog]);

  if (loading) {
    return (
      <div className='flex justify-center items-center p-10'>
        <div className='text-lg text-gray-600'>Memuat produk terbaru...</div>
      </div>
    );
  }

  if (latestProducts.length === 0) {
    return (
      <div className='flex justify-center items-center p-10'>
        <div className='text-lg text-gray-600'>Tidak ada produk tersedia</div>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 p-10'>
      {latestProducts.map((item) => (
        <ProductCard 
          key={item.id} // Lebih baik gunakan ID unik daripada index
          id={item.id} 
          image={item.images && item.images[0]} // Ambil gambar pertama dari array images
          name={item.name} 
          price={item.price}
          //description={item.description} 
        />
      ))}
    </div>
  );
};

export default LatestProducts;