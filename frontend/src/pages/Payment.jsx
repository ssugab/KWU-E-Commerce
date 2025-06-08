import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import Button from '../components/Button'

const Payment = () => {

  const { products, cart } = useContext(ShopContext);

  return (
    <div>
      <div className='flex justify-start'>
        <Link to='/checkout' className='cursor-pointer font-atemica text-center text-1xl ml-5 md:ml-15 mt-10 mb-5 hover:text-accent'>Checkout</Link>
        <h2 className="font-atemica text-center text-1xl ml-0 md:ml-2 mt-10 mb-5"> / Payment</h2>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 mb-6 font-atemica">
            <Link to='/checkout' className='flex items-center gap-2 text-accent hover:underline text-sm transition-colors'>
              <FaArrowLeft className="w-3 h-3" />
              <span>Checkout</span>
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-700 font-medium">Payment</span>
          </div>
      
      <div className='container mx-auto px-4 py-8 items-center border-4'>
        <img src={assets.qrCode} alt="QR Code" />
      </div>

    </div>
  )
}

export default Payment