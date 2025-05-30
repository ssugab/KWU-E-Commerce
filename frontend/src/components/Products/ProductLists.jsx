import React, { useContext, lazy, useState } from 'react';

import { ShopContext } from '../../context/ShopContext';

const ProductGrid = () => {

  const { catalog } = useContext(ShopContext);
  const [loading, setLoading] = useState(true);
  const ProductCard = lazy(() => import('./ProductCard'));

  console.log(catalog);

  return (
    <div className='flex flex-col'>
      {catalog.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;