import React from 'react';
import { NavLink } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <NavLink 
      to={`/product/${product._id}`} 
      className="bg-white shadow-md rounded-lg border-3 p-5 hover:shadow-[4px_4px_0px_0px_rgba(255,136,45,1)] transition-all flex flex-col items-center"
    >
      <img 
        className="w-3/4 rounded-lg block mb-5" 
        src={product.image} 
        alt={product.name} 
      />
      <div className='mt-auto w-full bg-offwhite rounded-lg p-2 border-2'>
        <h2 className="text-lg font-display font-medium mt-3">{product.name}</h2>
        <p className="text-gray-600 font-display">{product.description}</p>
        <p className="text-accent font-bold mt-2">Rp {product.price.toLocaleString()}</p>
      </div>
    </NavLink>
  );
};

export default ProductCard; 