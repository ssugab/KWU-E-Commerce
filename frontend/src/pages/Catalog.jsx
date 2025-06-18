import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { FaChevronDown } from 'react-icons/fa'
import ProductCard from '../components/Products/ProductCard'

const Catalog = () => {

  const { products } = useContext(ShopContext);
  const [ showCategory, setShowCategory] = useState(false);
  const [ showPrice, setShowPrice] = useState(false);
  const [ filteredProducts, setFilteredProducts] = useState([])
  const [ category, setCategory] = useState([])
  const [ price, setPrice] = useState([])
  const [ sortBy, setSortBy] = useState('relevant')

  const handleCategory = (e) => {
    if(category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value))
    }
    else {
      setCategory(prev => [...prev, e.target.value])
    }
  }

  const handlePrice = (e) => {
    if(price.includes(e.target.value)) {
      setPrice(prev => prev.filter(item => item !== e.target.value))
    }
    else {
      setPrice(prev => [...prev, e.target.value])
    }
  }

  const applyFilter = () => {
    let productsCopy = products.slice();

    if(category.length > 0) {
      productsCopy = productsCopy.filter(product => category.includes(product.category))
    }

    if(price.length > 0) {
      productsCopy = productsCopy.filter(product => {
        const productPrice = product.price;
        return price.some(priceRange => {
          if(priceRange === 'Below 100') {
            return productPrice < 100000;
          }
          if(priceRange === 'Above 100') {
            return productPrice >= 100000;
          }
          return false;
        });
      });
    }

    setFilteredProducts(productsCopy);
  }

  const sortProduct = () => {
    let filteredProductsCopy = filteredProducts.slice();

    switch (sortBy) {
      case 'latest':
        setFilteredProducts(filteredProductsCopy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        break;

      case 'oldest':
        setFilteredProducts(filteredProductsCopy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
        break;

      case 'price-asc':
        setFilteredProducts(filteredProductsCopy.sort((a, b) => a.price - b.price));
        break;

      case 'price-desc':
        setFilteredProducts(filteredProductsCopy.sort((a, b) => b.price - a.price));
        break;

      default:
        applyFilter();
        break;
    }
  }

  useEffect(() => {
    if (products && Array.isArray(products)) {
      setFilteredProducts(products)
    }
  },[products])

  useEffect(() => {
    applyFilter();
  },[category, price])

  useEffect(() => {
    sortProduct();
  },[sortBy])

  return (
    <div className='flex flex-col'>
      <div className="flex justify-center md:justify-start bg-accent border-b-4">
          <h2 className="font-atemica text-center text-3xl ml-0 md:ml-15 mt-10 mb-5">Our Products</h2>
      </div>

      {/* Catalog Section */}
      <div className='flex flex-col md:flex-row gap-x-6 p-6 pl-10'>

        {/* Filter Section */}
        <div className="flex flex-row md:flex-col h-full gap-2 items-start">
          <h2 className='font-atemica text-xl mt-2'>Filters</h2>
          {/* Category Filter Section */}
          <div className="w-full md:w-auto flex flex-col">
            {/* Category Button */}
            <div 
              onClick={() => setShowCategory(!showCategory)} 
              className='flex flex-row items-center justify-between p-3 border-2 rounded-lg text-lg font-display-bold bg-accent hover:shadow-matteblack transition ease-in-out duration-300 cursor-pointer mb-4 w-full md:w-48'
            >
              Category 
              <FaChevronDown className={`transform transition-transform duration-300 ${showCategory ? 'rotate-180' : ''}`} />
            </div>
            
            {/* Category Filter Options */}
            <div className={`${showCategory ? 'block' : 'hidden'} transition-all duration-300 w-full md:w-48 mb-5`}>
              <div className='flex flex-col gap-3 p-4 border-2 rounded-lg bg-gray-50 font-display-bold'>
                <label className='flex items-center gap-2 cursor-pointer hover:shadow-matteblack transition ease-in-out duration-300 p-2 rounded'>
                  <input type="checkbox" className="form-checkbox" value={'Shirt'} onChange={handleCategory} />
                  <span>Shirts</span>
                </label>
                <label className='flex items-center gap-2 cursor-pointer hover:shadow-matteblack transition ease-in-out duration-300 p-2 rounded'>
                  <input type="checkbox" className="form-checkbox" value={'Accessories'} onChange={handleCategory}/>
                  <span>Accessories</span>
                </label>
                <label className='flex items-center gap-2 cursor-pointer hover:shadow-matteblack transition ease-in-out duration-300 p-2 rounded'>
                  <input type="checkbox" className="form-checkbox" value={'Ospek Kit'} onChange={handleCategory}/>
                  <span>Ospek Kit</span>
                </label>
                {/* <Button text="Apply" to="/catalog" className="w-full text-center font-display-bold mt-10" onClick={applyFilter} /> */}
              </div>
            </div>
          </div>

          {/* Price Filter Section */}
          <div className='w-full md:w-auto flex flex-col'>
            {/* Price Button */}
            <div 
              onClick={() => setShowPrice(!showPrice)} 
              className='flex flex-row items-center justify-between p-3 border-2 rounded-lg text-lg font-display-bold bg-accent hover:shadow-matteblack transition ease-in-out duration-300 cursor-pointer mb-4 w-full md:w-48'
            >
              Price 
              <FaChevronDown className={`transform transition-transform duration-300 ${showPrice ? 'rotate-180' : ''}`} />
            </div>

            {/* Price Filter Options */}
            <div className={`${showPrice ? 'block' : 'hidden'} transition-all duration-300 w-full md:w-48 mb-5`}>
              <div className='flex flex-col gap-3 p-4 border-2 rounded-lg bg-gray-50 font-display-bold'>
                <label className='flex items-center gap-2 cursor-pointer hover:shadow-matteblack transition ease-in-out duration-300 p-2 rounded'>
                  <input type="checkbox" className="form-checkbox" value={'Below 100'} onChange={handlePrice}/>
                  <span>Under Rp 100.000</span>
                </label>
                <label className='flex items-center gap-2 cursor-pointer hover:shadow-matteblack transition ease-in-out duration-300 p-2 rounded'>
                  <input type="checkbox" className="form-checkbox" value={'Above 100'} onChange={handlePrice}/>
                  <span>Over Rp 100.000</span>
                </label>
              </div>
            </div>

          </div>
        </div>

        {/* Products Section */}
        <div className="w-full border-t-3 md:border-t-0">

          {/* Sort Section */}
          <div className='flex flex-row gap-5 justify-end items-center pt-5 md:pt-0 px-2 md:px-10'>
            <h3 className='font-display-bold'>Sort By</h3>
            <select 
              className='custom-select border-3 border-matteblack p-2 shadow-matteblack font-display outline-none bg-offwhite3 transition-all duration-300 cursor-pointer'  
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="relevant">Relevant</option>
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>
          </div>
          
          {/* Product Grid */}
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 pt-5 pb-40 px-2 md:px-10 md:pl-2'>
            {filteredProducts && filteredProducts.length > 0 ? (
              filteredProducts.map((item, index) => (
                <ProductCard 
                  key={item.id || index} 
                  id={item.id}
                  name={item.name}
                  image={item.images && item.images[0]}
                  price={item.price}
                  description={item.description}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 font-bricolage text-2xl">Products Not Found</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Catalog