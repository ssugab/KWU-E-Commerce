import React from 'react'
import { assets } from '../assets/assets'
import ProductGrid from '../components/ProductGrid'

const Catalog = () => {
  return (
    <div className=''>
      <div className="flex justify-center md:justify-start mt-12 ml-0 md:ml-15 mb-[-25px]">
            <h2 className="font-atemica text-center text-3xl ">Our Products</h2>
      </div>
      <ProductGrid />
      
    </div>
  )
}

export default Catalog