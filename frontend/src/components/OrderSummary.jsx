import React, { useContext, useMemo } from 'react'
import { ShopContext } from '../context/ShopContext'
import Button from './Button'
import { FaShieldAlt, FaTruck, FaWhatsapp } from 'react-icons/fa'

const OrderSummary = ({ cartData, isProcessing }) => {
  const { getCartAmount, navigate } = useContext(ShopContext);

  /* Hitung ongkos kirim berdasarkan subtotal
  const calculateShipping = (subtotal) => {
    if (subtotal >= 100000) return 0; // Free shipping untuk pembelian di atas 100k
    return 15000; // Flat rate 15k untuk pickup
  }; */

  // Memoized calculations untuk performa
  const orderCalculations = useMemo(() => {
    const subtotal = getCartAmount();
    //const shipping = calculateShipping(subtotal);
    const total = subtotal;

    return {
      subtotal,
      //shipping,
      total,
      itemCount: cartData.reduce((sum, item) => sum + item.quantity, 0)
    };
  }, [cartData, getCartAmount]);

  /*  Hitung estimasi waktu pickup
  const getPickupEstimate = () => {
    const now = new Date();
    const orderHour = now.getHours();
    const isWeekday = now.getDay() >= 1 && now.getDay() <= 5;
    
    if (isWeekday && orderHour < 15) {
      return "Hari ini (konfirmasi 1 jam sebelumnya)";
    } else {
      return "1-2 hari kerja";
    }
  }; */

  return (
    <div className='bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm'>
      {/* Header */}
      <div className='border-b border-gray-200 pb-4 mb-6'>
        <h2 className='font-atemica text-xl text-gray-900 flex items-center gap-2'>
          📋 <span>Order Summary</span>
        </h2>
        <p className='text-sm text-gray-600 mt-1'>
          {orderCalculations.itemCount} item{orderCalculations.itemCount > 1 ? 's' : ''} selected
        </p>
      </div>

      {/* Order Details */}
      <div className='space-y-4 mb-6'>
        
        {/* Subtotal */}
        <div className='flex justify-between items-center'>
          <span className='text-gray-700'>Subtotal ({orderCalculations.itemCount} item{orderCalculations.itemCount > 1 ? 's' : ''})</span>
          <span className='font-medium text-gray-900'>
            Rp {orderCalculations.subtotal.toLocaleString()}
          </span>
        </div>

        {/* Shipping 
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-2'>
            <FaTruck className="w-4 h-4 text-gray-500" />
            <span className='text-gray-700'>Pickup Fee</span>
          </div>
          <span className={`font-medium ${orderCalculations.shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
            {orderCalculations.shipping === 0 ? 'GRATIS' : `Rp ${orderCalculations.shipping.toLocaleString()}`}
          </span>
        </div> */}

        {/* Free shipping indicator 
        {orderCalculations.subtotal < 100000 && (
          <div className='p-3 bg-orange-50 rounded-lg border border-orange-200'>
            <p className='text-xs text-orange-800'>
              💡 Belanja Rp {(100000 - orderCalculations.subtotal).toLocaleString()} lagi untuk FREE PICKUP!
            </p>
          </div>
        )} */}

        <hr className='border-gray-200' />

        {/* Total */}
        <div className='flex justify-between items-center text-lg font-bold'>
          <span className='text-gray-900'>Total</span>
          <span className='text-accent text-xl'>
            Rp {orderCalculations.total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Pickup Information */}
      <div className='bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6'>
        <h3 className='font-semibold text-blue-900 mb-2 flex items-center gap-2'>
          <FaTruck className="w-4 h-4" />
          <span>Info Pickup</span>
        </h3>
        <div className='space-y-2 text-sm text-blue-800'>
          {/* <p><strong>Estimasi siap:</strong> {getPickupEstimate()}</p> */}
          <p><strong>Location:</strong> BEM KWU Secretariat</p>
          <p><strong>Contact:</strong> 081348886432 (Eza)</p>
        </div>
      </div>

      {/* Security & Contact Info */}
      <div className='space-y-3 mb-6'>
        {/*<div className='flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200'>
          <FaShieldAlt className="w-4 h-4 text-green-600" />
          <span className='text-sm text-green-800 font-medium'>
            Secure & Reliable Transaction
          </span>
        </div> */}

        <div className='flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200'>
          <FaWhatsapp className="w-4 h-4 text-green-600" />
          <span className='text-sm text-green-800'>
            Help via WhatsApp: 081348886432
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='space-y-3'>
        {/* Order Summary Button (for mobile review) */}
        <button className='lg:hidden w-full p-3 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-200 transition-colors'>
          View Order Details
        </button>

        <Button onClick={() => navigate('/payment')} text='Payment' />

        {/* Processing Indicator */}
        {isProcessing && (
          <div className='w-full p-4 bg-accent/10 border border-accent rounded-lg'>
            <div className='flex items-center justify-center gap-3'>
              <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-accent'></div>
              <span className='text-accent font-medium'>Processing order...</span>
            </div>
          </div>
        )}

        {/* Terms & Conditions */}
        <div className='text-xs text-gray-600 space-y-1'>
          {/*<p>
            By continuing, you agree to our{' '}
            <a href="#" className='text-accent hover:underline'>Terms & Conditions</a>.
          </p>*/}
          <p>
            Order will be confirmed via WhatsApp within 1x24 hours.
          </p>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary 