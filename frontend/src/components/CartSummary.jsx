import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import Button from './Button'

const CartSummary = () => {

  const { getCartAmount, navigate } = useContext(ShopContext);

  
  return (
    <div className='bg-offwhite2'>
              <h2 className='font-atemica text-xl font-bold mb-4'>Order Summary</h2>
              
              <div className='space-y-3 mb-4'>
                <div className='flex justify-between'>
                  <span>Subtotal</span>
                  <span>Rp {getCartAmount().toLocaleString()}</span>
                </div>

                <hr className='border-matteblack' />
                <div className='flex justify-between font-bold text-lg'>
                  <span>Total</span>
                  <span>Rp {getCartAmount().toLocaleString()}</span>
                </div>
              </div>

              
            </div>
  )
}

export default CartSummary