import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../../context/ShopContext'
import ProductCard from '../Products/ProductCard'

const SimilarProducts = ({category}) => {

  const { products } = useContext(ShopContext);
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    if(products && products.length > 0 && category){
      let productsCopy = products.slice();

      // Filter produk berdasarkan kategori yang sama, tapi exclude produk saat ini
      productsCopy = productsCopy.filter((item) => {
        // console.log('🔍 Comparing:', category, '===', item.category, '→', category === item.category);
        return category === item.category;
      });

      setSimilarProducts(productsCopy.slice(0, 4));
    } else {
      console.log('❌ SimilarProducts - Missing data:', {
        hasProducts: products && products.length > 0,
        hasCategory: !!category,
        productsLength: products.length
      });
    }
  }, [products, category]); // Tambahkan category sebagai dependency


  return (
    <div className='w-4/5 grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 pb-10'>
      {similarProducts.map((item, index) => (
        <ProductCard 
        key={item.id || index} 
        id={item.id} 
        name={item.name} 
        image={item.images && item.images[0]} 
        price={item.price} 
        description={item.description} />
      ))}
    </div>
  )
}

export default SimilarProducts