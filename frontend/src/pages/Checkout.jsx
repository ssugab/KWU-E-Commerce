import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import Button from '../components/Button'
import CheckoutForm from '../components/CheckoutForm'
import OrderSummary from '../components/OrderSummary'
import { FaArrowLeft } from 'react-icons/fa'
// import { useCheckout } from '../hooks/useCheckout'
import toast from 'react-hot-toast'

const Checkout = () => {
  const { products, cart, getCartAmount, navigate } = useContext(ShopContext)
  const [cartData, setCartData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  /* const {
    createOrder,
    validateOrderData,
    calculateShipping,
    isLoading: checkoutLoading
  } = useCheckout(); */

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
    setCartData(tempData);
  },[cart])

  // Redirect jika cart kosong
  /* useEffect(() => {
    if (cartData.length === 0 ) {
      toast.error('Keranjang Anda kosong. Silakan tambahkan produk terlebih dahulu.');
      navigate('/catalog');
    }
  }, [cartData, checkoutLoading, navigate]);

  const handleFormSubmit = async (formData) => {
    setIsProcessing(true);
    try {
      // Validasi data order
      const orderData = {
        customerInfo: formData,
        items: cartData,
        subtotal: getCartAmount(),
        shipping: calculateShipping(getCartAmount()),
        total: getCartAmount() + calculateShipping(getCartAmount()),
        orderDate: new Date().toISOString(),
        status: 'pending'
      };

      // Validasi order data
      const validation = validateOrderData(orderData);
      if (!validation.isValid) {
        toast.error(validation.message);
        return;
      }

      // Buat order
      const result = await createOrder(orderData);
      
      if (result.success) {
        toast.success('Pesanan berhasil dibuat! Lanjut ke pembayaran...');
        // Simpan order ID untuk payment
        sessionStorage.setItem('currentOrderId', result.orderId);
        navigate('/payment');
      } else {
        toast.error(result.message || 'Gagal membuat pesanan');
      }
    } catch (error) {
      console.error('❌ Error creating order:', error);
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (checkoutLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4'></div>
          <p className='text-gray-600'>Memuat halaman checkout...</p>
        </div>
      </div>
    );
  }
 */
  
  return (
    <div className='min-h-screen bg-offwhite2'>
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-7xl mx-auto'>
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 mb-6">
            <Link to='/cart' className='flex items-center gap-2 text-accent hover:underline text-sm transition-colors'>
              <FaArrowLeft className="w-3 h-3" />
              <span>Cart</span>
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-700 font-medium">Checkout</span>
          </div>

          {/* Page Title */}
          <h1 className='font-atemica text-2xl md:text-3xl mb-8 text-gray-900'>Checkout</h1>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  ✓
                </div>
                <span className="ml-2 text-sm text-green-600 font-medium">Cart</span>
              </div>
              <div className="w-8 h-1 bg-accent"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <span className="ml-2 text-sm text-gray-900 font-medium">Checkout</span>
              </div>
              <div className="w-8 h-1 bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <span className="ml-2 text-sm text-gray-500">Payment</span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            
            {/* Left Column - Forms & Info */}
            <div className='lg:col-span-2 space-y-6'>
              
              {/* Pickup Address Section */}
              <div className='bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm'>
                <h2 className='font-atemica text-xl mb-4 text-gray-900 flex items-center gap-2'>
                  📍 <span>Pickup Address</span>
                </h2>
                <div className='bg-offwhite3 p-4 rounded-lg border border-gray-200'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <p className='text-sm text-gray-600 mb-1'>Contact Person:</p>
                      <p className='font-medium text-gray-900'>081348886432 (Eza)</p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-600 mb-1'>Operating Hours:</p>
                      <p className='text-gray-700'>Monday - Friday: 09:00 - 17:00</p>
                    </div>
                  </div>
                  <div className='mt-4'>
                    <p className='text-sm text-gray-600 mb-1'>Address:</p>
                    <p className='text-gray-700'>BEM Fakultas & Badan/UKM Keceh, Gn. Anyar, Kec. Gn. Anyar, Surabaya, Jawa Timur</p>
                  </div>
                  <div className='mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200'>
                    <p className='text-sm text-blue-800'>
                      💡 <strong>Note:</strong> Please confirm your presence at least 1 hour before pickup via WhatsApp.
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className='bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm'>
                <h2 className='font-bricolage text-xl mb-6 text-gray-900 flex items-center gap-2'>
                  📦 <span>Review Order ({cartData.length} item{cartData.length > 1 ? 's' : ''})</span>
                </h2>
                
                {cartData.length === 0 ? (
                  <div className='text-center py-8'>
                    <p className='text-gray-500 mb-2'>Cart is empty</p>
                    <Link to='/catalog' className='text-accent hover:underline text-sm'>
                      Back to catalog
                    </Link>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {cartData.map((item, index) => {
                      const productData = products.find((product) => product._id === item._id)
                      if (!productData) return null;
                      
                      return (
                        <div key={index} className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow'>
                          {/* Product Image */}
                          <div className='flex-shrink-0'>
                            <img 
                              src={productData.images[0]} 
                              alt={productData.name} 
                              className='w-20 h-20 object-cover rounded-lg border border-gray-200' 
                            />
                          </div>
                          
                          {/* Product Details */}
                          <div className='flex-1'>
                            <h3 className='font-semibold text-gray-900 mb-1'>{productData.name}</h3>
                            {item.size && (
                              <span className='inline-block px-2 py-1 bg-accent text-xs font-medium rounded text-matteblack mb-2'>
                                Size: {item.size}
                              </span>
                            )}
                            <p className='text-sm text-gray-600'>Quantity: {item.quantity}</p>
                          </div>
                          
                          {/* Price */}
                          <div className='text-right'>
                            <p className='font-bold text-lg text-gray-900'>
                              Rp {(productData.price * item.quantity).toLocaleString()}
                            </p>
                            <p className='text-xs text-gray-500'>
                              Rp {productData.price.toLocaleString()} /item
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Customer Information Form 
              <CheckoutForm onSubmit={handleFormSubmit} isProcessing={isProcessing} /> */}
            </div>

            {/* Right Column - Order Summary */}
            <div className='lg:col-span-1'>
              <div className='sticky top-4'>
                <OrderSummary 
                  cartData={cartData} 
                  isProcessing={isProcessing}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
