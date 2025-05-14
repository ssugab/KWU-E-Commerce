import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, columns = 3 }) => {
  // Menentukan class grid berdasarkan jumlah kolom
  const getGridClass = () => {
    switch(columns) {
      case 3:
        return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6';
      case 4:
        return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6';
      default:
        return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6';
    }
  };

  return (
    <div className={getGridClass()}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;