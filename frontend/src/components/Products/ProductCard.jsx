import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ id, name, price, image, description }) => {

  // const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
  // Debug logging untuk gambar
  // console.log('🖼️ ProductCard - Image URL:', image);
  // console.log('📋 ProductCard - Product data:', { id, name, price, image, description });
  
  // Fallback image dengan data URL untuk menghindari network error
  const defaultPlaceholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTBlMGUwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
  const displayImage = image || defaultPlaceholder;
  
  return (
    <Link 
      to={`/product/${id}`}
      className="bg-offwhite shadow-md border-3 p-3 md:p-5 hover:shadow-accent transition-all flex flex-col items-center w-full max-w-sm max-h-[33rem] min-h-[20.274rem]"
    >
      {/* Image Container with fixed aspect ratio */}
      <div className="w-full aspect-square rounded-lg overflow-hidden mb-3 md:mb-5 bg-gray-100 border-2 hover:shadow-matteblack hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300">
        <img 
          className='w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105'
          src={displayImage} 
          alt={name}
          onError={(e) => {
            console.log('❌ Image failed to load:', displayImage);
            // set fallback if not using placeholder
            if (e.target.src !== defaultPlaceholder) {
              e.target.src = defaultPlaceholder;
            }
          }}
          onLoad={() => {
            // console.log('✅ Image loaded successfully:', displayImage);
          }}
        />
      </div>
      
      {/* Product Info */}
      <div className='mt-5 w-full bg-offwhite p-2 md:p-3 border-2 border-matteblack shadow-matteblack'>
        <h2 className="text-sm md:text-lg font-bricolage font-medium mb-1 md:mb-2 line-clamp-2">{name}</h2>
        <p className="text-gray-600 font-display text-xs md:text-sm mb-1 md:mb-2 line-clamp-2">{description}</p>
        <p className="text-accent font-bold text-base md:text-xl">Rp {price.toLocaleString()}</p>
      </div>
    </Link> 

  );
};

export default ProductCard; 