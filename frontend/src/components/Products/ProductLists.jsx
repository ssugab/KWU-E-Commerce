import React, { useContext, lazy } from 'react';

import { ShopContext } from '../../context/ShopContext';

const ProductGrid = () => {

  const { catalog } = useContext(ShopContext);
  const ProductCard = lazy(() => import('./ProductCard'));

  console.log(catalog);

  return (
    <div className='flex flex-col'>
      {catalog.map((product, index) => (
        <ProductCard 
          key={product.id || index} 
          id={product.id} 
          name={product.name} 
          image={product.images && product.images[0]}
          price={product.price}
          description={product.description}
        />
      ))}
    </div>
  );
};

export default ProductGrid;