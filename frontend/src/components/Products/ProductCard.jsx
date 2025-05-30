import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ id, name, price, image, description }) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
  // Debug logging untuk gambar
  console.log('🖼️ ProductCard - Image URL:', image);
  console.log('📋 ProductCard - Product data:', { id, name, price, image, description });
  
  // Fallback image jika gambar tidak ada
  const displayImage = image || '/placeholder-product.jpg';
  
  return (
    <Link 
      to={`${backendUrl}/product/${id}`} 
      className="bg-white shadow-md rounded-lg border-3 p-5 hover:shadow-[4px_4px_0px_0px_rgba(255,136,45,1)] transition-all flex flex-col items-center"
    >
      <img 
        className="w-3/4 rounded-lg block mb-5" 
        src={displayImage} 
        alt={name}
        onError={(e) => {
          console.log('❌ Image failed to load:', displayImage);
          e.target.src = '/placeholder-product.jpg'; // Fallback jika error
        }}
        onLoad={() => {
          console.log('✅ Image loaded successfully:', displayImage);
        }}
      />
      <div className='mt-auto w-full bg-offwhite rounded-lg p-2 border-2 font-display-bold'>
        <h2 className="text-lg font-display-bold font-medium mt-3">{name}</h2>
        <p className="text-gray-600 font-display">{description}</p>
        <p className="text-accent font-bold mt-2">Rp {price.toLocaleString()}</p>
      </div>
    </Link> 

  );
};

export default ProductCard; 