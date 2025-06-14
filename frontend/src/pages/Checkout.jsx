import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { useAuth } from '../context/AuthContext'
import { useCheckout } from '../hooks/useCheckout'
import CheckOutSummary from '../components/CheckOutSummary'
import Button from '../components/Button'
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa'
import toast from 'react-hot-toast'

const Checkout = () => {
  const { products, cart, getCartAmount, navigate, clearCart } = useContext(ShopContext)
  const { user, isAuthenticated, loading } = useAuth()
  const [cartData, setCartData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const {
    createOrder,
    isLoading: checkoutLoading
  } = useCheckout();

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

  // Tampilkan pesan jika cart kosong setelah loading selesai
  const isCartEmpty = cartData.length === 0 && products.length > 0;

  useEffect(() => {
    // Tunggu sampai loading selesai sebelum redirect
    if (!loading && !isAuthenticated) {
      toast.error('Silakan login untuk melihat checkout');
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate])

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Data user tidak ditemukan. Silakan login ulang.');
      return;
    }

    setIsProcessing(true);
    try {
      // Validasi data order
      const subtotal = getCartAmount();

      if (subtotal <= 0) {
        toast.error('Total pesanan tidak valid');
        return;
      }

      // Gunakan data user yang sudah ada
      const userData = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        npm: user.npm
      };

      // Buat order menggunakan useCheckout hook
      const result = await createOrder(userData, cartData, subtotal);
      
      if (result.success) {
        toast.success('Pesanan berhasil dibuat! Lanjut ke pembayaran...');
        clearCart();
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

  // Loading state - cek auth loading dulu
  if (loading || checkoutLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4'></div>
          <p className='text-gray-600'>
            {loading ? 'Memverifikasi login...' : 'Loading checkout page...'}
          </p>
        </div>
      </div>
    );
  }

  // Tampilkan pesan jika cart kosong setelah loading selesai
  if (isCartEmpty) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-offwhite2'>
        <div className='text-center max-w-md mx-auto p-8'>
          <div className='mb-6'>
            <div className='w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
              <span className='text-4xl'>🛒</span>
            </div>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>Keranjang Anda Kosong</h2>
            <p className='text-gray-600 mb-6'>
              Silakan tambahkan produk ke keranjang terlebih dahulu sebelum melakukan checkout.
            </p>
          </div>
          <div className='space-y-3'>
            <Button
              text='Kembali ke Katalog'
              onClick={() => navigate('/catalog')}
              className='w-full bg-accent hover:bg-accent/90 text-matteblack border-accent'
            />
            <Button
              text='Lihat Keranjang'
              onClick={() => navigate('/cart')}
              className='w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
            />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className='min-h-screen bg-offwhite2'>
      <div className='container mx-auto px-4 py-8 mb-50'>
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

          {/* Main Content Grid */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            
            {/* Left Column - Info */}
            <div className='lg:col-span-2 space-y-6'>
              
              {/* Customer Information - Display Only */}
              <div className='bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm'>
                <h2 className='font-atemica text-xl mb-6 text-gray-900 flex items-center gap-2'>
                  <FaUser className="w-5 h-5" />
                  <span>Informasi Pelanggan</span>
                </h2>
                
                <div className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                      <label className='block text-sm font-medium text-gray-600 mb-1'>
                        Nama Lengkap
                      </label>
                      <p className='text-gray-900 font-medium'>{user?.name || '-'}</p>
                    </div>
                    
                    <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                      <label className='block text-sm font-medium text-gray-600 mb-1'>
                        NPM
                      </label>
                      <p className='text-gray-900 font-medium'>{user?.npm || '-'}</p>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                      <label className='block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2'>
                        <FaEnvelope className="w-3 h-3" />
                        Email
                      </label>
                      <p className='text-gray-900 font-medium'>{user?.email || '-'}</p>
                    </div>
                    
                    <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                      <label className='block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2'>
                        <FaPhone className="w-3 h-3" />
                        Nomor Telepon
                      </label>
                      <p className='text-gray-900 font-medium'>{user?.phone || '-'}</p>
                    </div>
                  </div>

                  <div className='mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200'>
                    <p className='text-sm text-blue-800'>
                      💡 <strong>Info:</strong> Data di atas diambil dari profil akun Anda. Jika perlu mengubah, silakan update di halaman profil.
                    </p>
                  </div>
                </div>
              </div>

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
                
                {isCartEmpty ? (
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
                        <div key={index} className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-matteblack hover:shadow-matteblack transition-shadow'>
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
                            { item.size && item.size !== 'default' ? (
                              <span className='inline-block px-2 py-1 bg-offwhite3 text-xs font-medium text-matteblack mb-2'>
                                Size: {item.size}
                              </span>
                            ) : (
                              <div className='h-8'></div>
                            )}
                            <p className='text-sm text-gray-600'>Quantity: <span className='text-matteblack'>{item.quantity}</span></p>
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
            </div>

            {/* Right Column - Order Summary & Checkout */}
            <div className='lg:col-span-1'>
              <div className='sticky top-4 space-y-4'>
                <CheckOutSummary 
                  cartData={cartData} 
                  isProcessing={isProcessing}
                />
                
                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  text={isProcessing ? "⏳ Processing..." : "Confirm Order"}
                  className={`w-full border-accent font-medium py-3 text-base transition-all duration-200 ${
                    isProcessing 
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                      : 'bg-accent hover:bg-accent/90 text-matteblack hover:transform hover:scale-[1.02]'
                  }`}
                  disabled={isProcessing || isCartEmpty}
                />
                
                {isProcessing && (
                  <p className='text-center text-sm text-gray-600 mt-2'>
                    Processing your order, please wait...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
