import React, { useContext, useState } from 'react'
import ProductLists from '../components/Products/ProductLists'
import ProductGrid3d from '../components/ProductGrid3d'
import { ShopContext } from '../context/ShopContext'
import { FaChevronDown } from 'react-icons/fa'
import Button from '../components/Button'

const Catalog = () => {

  const { products } = useContext(ShopContext);
  const [ showCategory, setShowCategory] = useState(false);
  const [ showPrice, setShowPrice] = useState(false);

  // const filteredProducts = products.filter(product => {
  //   product.filter(product => product.category === 'Shirts')
  // })

  return (
    <div className='flex flex-col'>
      <div className="flex justify-center md:justify-start bg-accent">
          <h2 className="font-atemica text-center text-3xl ml-0 md:ml-15 mt-10 mb-5">Our Products</h2>
      </div>

      {/* Catalog Section */}
      <div className='flex flex-col md:flex-row gap-x-6 p-6'>

        {/* Filter Section */}
        <div className="flex flex-row md:flex-col gap-2 items-start">
          {/* Category Filter Section */}
          <div className="w-full md:w-auto flex flex-col">
            {/* Category Button */}
            <div 
              onClick={() => setShowCategory(!showCategory)} 
              className='flex flex-row items-center justify-between p-3 border-2 rounded-lg text-lg font-display-bold bg-accent hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition ease-in-out duration-300 cursor-pointer mb-4 w-48'
            >
              Category 
              <FaChevronDown className={`transform transition-transform duration-300 ${showCategory ? 'rotate-180' : ''}`} />
            </div>
            
            {/* Category Filter Options */}
            <div className={`${showCategory ? 'block' : 'hidden'} transition-all duration-300 w-48`}>
              <div className='flex flex-col gap-3 p-4 border-2 rounded-lg bg-gray-50 font-display-bold'>
                <label className='flex items-center gap-2 cursor-pointer hover:shadow-matteblack transition ease-in-out duration-300 p-2 rounded'>
                  <input type="checkbox" className="form-checkbox" value={'Shirts'}/>
                  <span>Shirts</span>
                </label>
                <label className='flex items-center gap-2 cursor-pointer hover:shadow-matteblack transition ease-in-out duration-300 p-2 rounded'>
                  <input type="checkbox" className="form-checkbox" value={'Accessories'}/>
                  <span>Accessories</span>
                </label>
                <label className='flex items-center gap-2 cursor-pointer hover:shadow-matteblack transition ease-in-out duration-300 p-2 rounded'>
                  <input type="checkbox" className="form-checkbox" value={'Books'}/>
                  <span>Books</span>
                </label>
                <Button text="Apply" to="/catalog" className="w-full text-center font-display-bold mt-10" />
              </div>
            </div>
          </div>

          {/* Price Filter Section */}
          <div className='w-full md:w-auto flex flex-col'>
            {/* Price Button */}
            <div 
              onClick={() => setShowPrice(!showPrice)} 
              className='flex flex-row items-center justify-between p-3 border-2 rounded-lg text-lg font-display-bold bg-accent hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition ease-in-out duration-300 cursor-pointer mb-4 w-48'
            >
              Price 
              <FaChevronDown className={`transform transition-transform duration-300 ${showPrice ? 'rotate-180' : ''}`} />
            </div>

            {/* Price Filter Options */}
            <div className={`${showPrice ? 'block' : 'hidden'} transition-all duration-300 w-48`}>
              <div className='flex flex-col gap-3 p-4 border-2 rounded-lg bg-gray-50 font-display-bold'>
                <label className='flex items-center gap-2 cursor-pointer hover:shadow-matteblack transition ease-in-out duration-300 p-2 rounded'>
                  <input type="checkbox" className="form-checkbox" value={'Below 100'}/>
                  <span>Below 100</span>
                </label>
                <label className='flex items-center gap-2 cursor-pointer hover:shadow-matteblack transition ease-in-out duration-300 p-2 rounded'>
                  <input type="checkbox" className="form-checkbox" value={'Below 100'}/>
                  <span>Below 100</span>
                </label>
              </div>
            </div>

          </div>
        </div>

        {/* Products Section */}
        <div className="w-full border-t-3 md:border-t-0">
          {/* Sort Section */}
          <div className='flex flex-row gap-5 justify-end items-center pt-5 md:pt-0 px-10'>
            <h3 className='font-display-bold'>Sort By</h3>
            <select className='border-3 rounded-md p-2 font-display'>
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>
          </div>

          <ProductGrid3d />
        </div>
      </div>
    </div>
  )
}

export default Catalog