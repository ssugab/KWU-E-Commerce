import React, { useContext, lazy } from 'react';

import { ShopContext } from '../../context/ShopContext';

const ProductGrid = () => {

  const { products } = useContext(ShopContext);
  const ProductCard = lazy(() => import('./ProductCard'));

  console.log(products);

  return (
    <div className='flex flex-col'>
      {products.map((product, index) => (
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