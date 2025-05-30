import React from 'react'
import { ShopContext } from '../context/ShopContext'
import Button from '../components/Button'

const Cart = () => {

  return (
    <div className='flex justify-between mx-auto p-10 mt-10'>
      <div className='flex flex-1 flex-col gap-4 items-center'>
        <h1 className='font-atemica text-2xl font-bold flex-1 justify-start'>Your Cart</h1>
        <div className='w-1/2 border-t-3 border-l-3 border-r-3' >
          <p className='text-sm text-gray-500'>Add items to your carts</p>
        </div>
        <div className='w-1/2 border-t-3 border-l-3 border-r-3' >
          <p className='text-sm text-gray-500'>Add items to your cart</p>
        </div>

      </div>
      <div className='flex flex-1 flex-col gap-4 items-center'>

        <div>
          <div>
            <h3>Total</h3>
            
          </div>
          <Button text='Check Out' className='font-display'/>
        </div>
      </div>
    </div>
  )
}

export default Cart