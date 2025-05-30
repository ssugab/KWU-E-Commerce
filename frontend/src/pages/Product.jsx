import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';

const Product = () => {
  const { products } = useContext(ShopContext);

  
  return (
    <div>
      <Link to={`${products.link}`} className='flex flex-col items-center '>
        <img src={products.img} alt={products.name} className='w-1/2 h-1/2' />
        <h1>{products.name}</h1>
      </Link>
      <div>
        <div>Add to Cart</div>
      </div>
    </div>
  )
}

export default Product