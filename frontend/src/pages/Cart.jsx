import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import Button from '../components/Button'
import { FaTrash } from 'react-icons/fa';
import CartSummary from '../components/CartSummary'
import toast from 'react-hot-toast';

const Cart = () => {

  const { products, cart, updateQuantity, getCartAmount, getCartTotal, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [quantity, setQuantity] = useState();

  useEffect(() => {
    const tempData = [];
    for(const items in cart){
      for(const size in cart[items]){
        if(cart[items][size] > 0){
          tempData.push({
            _id: items,
            size: size,
            quantity: cart[items][size],
          })
        }
      }
    }

    //console.log('🛒 Cart Data Temp:', tempData);
    setCartData(tempData);
  },[cart])

  

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-7xl mx-auto'>
        
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-0 justify-between mx-4 md:mx-8 lg:mx-10 p-4 mt-4 '>

          {/* Cart Items */}
          <div className='col-span-2 pr-8'>
            <h1 className='font-atemica text-1xl md:text-2xl font-bold mb-6'>Your Cart</h1>


              {
              cartData.length === 0 ? (
                <div className='text-center py-12'>
                <p className='text-sm text-gray-500'>Your cart is empty. Add items to your carts</p>
                </div>
              ) : 
              (
                cartData.map((item, index) => {
                  console.log('🛒 Item:', item);
                  const productData = products.find((product) => product._id === item._id)
                  console.log('🛒 Product Data:', productData);

                  return (
                    <div key={index} className=' border-3 border-b-0 bg-offwhite3'>
                      <div className='w-full py-2 flex gap-5 px-5'>

                        {/* Product Image */}
                        <div className='flex-shrink-0'>
                          <img src={productData.images[0]} alt={`${productData.name} image`} 
                          className='w-20 h-20 md:w-34 md:h-34 object-cover border-2 border-gray-200' />
                        </div>

                        {/* Product Details */}
                        <div className='flex-1 space-y-2 '>
                        <h3 className='font-bold text-lg'>{productData.name}</h3>

                          {item.size ? (
                            <p className='text-sm bg-offwhite3 inline-block px-2 py-1 border border-gray-300 mb-7'>
                              Size: {item.size}
                            </p>
                          ): (
                            <div className='h-12'></div>
                          )}
                          
                          {/* Bottom details of Cart Item */}
                          <div className='flex items-center justify-between'>
                            <p className='font-bold text-lg'>Rp {productData.price.toLocaleString()}</p>
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Quantity:</span>
                              <div className="flex items-center border-2 border-gray-300 rounded overflow-hidden">
                                <button 
                                  onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                                >
                                  -
                                </button>
                                <span className="px-4 py-1 bg-white font-medium min-w-[50px] text-center">
                                  {item.quantity}
                                </span>
                                <button 
                                  onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                                  disabled={item.quantity >= (productData.stock || 1)}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div className='flex gap-2 pb-2'>
                              <button className='text-red-500 hover:text-red-700 cursor-pointer' onClick={() => updateQuantity(item._id, item.size, 0)}><FaTrash /></button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}

              {/* Continue Shopping */}
              <div className='pt-4'>
                  <p className='text-sm text-gray-600 mb-3'>Not ready to checkout?</p>
                  <Button 
                    text='Continue Shopping' 
                    to='/catalog'
                    align='left'
                    className='bg-accent hover:bg-accent/90 text-matteblack border-accent'
                  />
              </div>
            
          </div>

          {/* Cart Summary */}
          <div className='lg:col-span-1 border-2 border-matteblack p-6 shadow-matteblack h-60 sticky'>
            <CartSummary />
            <Button 
                
                text='Check Out'
                className='w-full bg-accent hover:bg-accent/90 text-matteblack border-accent font-bricolage py-2'
                disabled={cartData.length === 0}
                onClick={() => navigate('/checkout')}
            />
          </div>

        </div>

      </div>
    </div>
  )
}

export default Cart