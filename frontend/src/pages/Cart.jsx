import React from 'react'

const Cart = () => {

  return (
    <div className='p-10'>
      <div className='flex flex-col gap-4 items-center'>
        <h1 className='font-atemica text-2xl font-bold flex-1'>Cart</h1>
        <div className='w-1/2 border-t-3 border-l-3 border-r-3' >
          <p className='text-sm text-gray-500'>Add items to your cart</p>
        </div>
        <div className='w-1/2 border-t-3 border-l-3 border-r-3' >
          <p className='text-sm text-gray-500'>Add items to your cart</p>
        </div>

      </div>
    </div>
  )
}

export default Cart