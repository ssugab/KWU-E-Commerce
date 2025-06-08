import React, { useContext } from 'react'
import { useAuth } from '../context/AuthContext';
import { ShopContext } from '../context/ShopContext';

const Orders = () => {

  const { products, cart } = useContext(ShopContext);

  return (
    <div className='pb-10'>
      <h1 className='text-2xl font-atemica justify-start p-10 '>Orders</h1>
      <div className='flex flex-col w-1/2 md:mx-auto mx-5 justify-center bg-accent border-3 p-7 gap-5 rounded-lg hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[4px] hover:-translate-y-[4px] transition-all duration-300'>
        <div className=''>Order ID:</div>
        <div className=''>Order Date</div>
        <div className=''>Order Status</div>
        <div className=''>Order Total</div>
        
      </div>

      <div>
        
      </div>
    </div>
  )
}

export default Orders