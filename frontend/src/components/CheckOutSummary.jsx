import React, { useContext, useMemo } from 'react'
import { ShopContext } from '../context/ShopContext'
import { FaShieldAlt, FaTruck, FaWhatsapp, FaCheckCircle } from 'react-icons/fa'

const CheckOutSummary = ({ cartData, isProcessing }) => {
  const { getCartAmount } = useContext(ShopContext);

  // Memoized calculations untuk performa
  const orderCalculations = useMemo(() => {
    const subtotal = getCartAmount();
    const total = subtotal;

    return {
      subtotal,
      total,
      itemCount: cartData.reduce((sum, item) => sum + item.quantity, 0)
    };
  }, [cartData, getCartAmount]);

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

        {/* Tax (if applicable) */}
        <div className='flex justify-between items-center text-sm'>
          <span className='text-gray-600'>Tax</span>
          <span className='text-gray-600'>Included</span>
        </div>

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
          <p><strong>Location:</strong> BEM KWU Secretariat</p>
          <p><strong>Contact:</strong> 081348886432 (Eza)</p>
          <p><strong>Hours:</strong> Mon-Fri, 09:00-17:00</p>
        </div>
      </div>

      {/* Security & Contact Info */}
      <div className='space-y-3 mb-6'>
        {/* Security Notice */}
        <div className='flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200'>
          <FaCheckCircle className="w-4 h-4 text-green-600" />
          <span className='text-sm text-green-800'>
            Secure checkout guaranteed
          </span>
        </div>

        {/* WhatsApp Contact */}
        <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200'>
          <FaWhatsapp className="w-4 h-4 text-green-600" />
          <span className='text-sm text-gray-700'>
            Help via WhatsApp: 081348886432
          </span>
        </div>
      </div>

      {/* Processing Indicator */}
      {isProcessing && (
        <div className='w-full p-4 bg-accent/10 border border-accent rounded-lg mb-4'>
          <div className='flex items-center justify-center gap-3'>
            <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-accent'></div>
            <span className='text-accent font-medium'>Processing order...</span>
          </div>
        </div>
      )}

      {/* Payment Methods Preview */}
      <div className='bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4'>
        <h4 className='font-semibold text-gray-900 mb-2 text-sm'>Payment Methods Available:</h4>
        <div className='flex items-center gap-2 text-sm text-gray-600'>
          <span className='px-2 py-1 bg-white rounded border text-xs'>QRIS</span>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className='text-xs text-gray-600 space-y-1'>
        <p>
          • Order will be confirmed via WhatsApp within 1x24 hours
        </p>
        <p>
          • Please confirm pickup at least 1 hour in advance
        </p>
        <p>
          • By proceeding, you agree to our Terms & Conditions
        </p>
      </div>
    </div>
  )
}

export default CheckOutSummary 