import React, { useState, useEffect, useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useCheckout } from '../hooks/useCheckout'
import { useAuth } from '../context/AuthContext'
import { assets } from '../assets/assets'
import { API_ENDPOINTS } from '../config/api'
import { FaArrowLeft, FaUpload, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import Button from '../components/Button'
import toast from 'react-hot-toast'

const Payment = () => {
  const { navigate } = useContext(ShopContext);
  const { getCurrentOrderFromSession } = useCheckout();
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  // 📦 STATE - Hanya yang diperlukan
  const [order, setOrder] = useState(null);                    // Data pesanan
  const [loading, setLoading] = useState(true);                // Loading state
  const [paymentFile, setPaymentFile] = useState(null);        // File bukti bayar
  const [filePreview, setFilePreview] = useState(null);        // Preview gambar
  const [uploading, setUploading] = useState(false);           // Status upload

  // 🔐 CEK LOGIN - Redirect jika belum login
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error('Please login and order to see payment');
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // 📋 LOAD ORDER - Ambil data pesanan
  useEffect(() => {
    const loadOrder = async () => {
      if (!isAuthenticated || authLoading) return;
      
      setLoading(true);
      try {
        console.log('🔄 Loading order data...');
        const orderData = await getCurrentOrderFromSession();
        
        if (orderData) {
          console.log('✅ Order loaded:', orderData);
          setOrder(orderData);
        } else {
          console.log('❌ No order found');
          toast.error('Order tidak ditemukan. Silakan checkout kembali.');
          navigate('/cart');
        }
      } catch (error) {
        console.error('Error loading order:', error);
        toast.error('Failed to load order data');
        navigate('/cart');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [isAuthenticated, authLoading, getCurrentOrderFromSession, navigate]);

  // 📁 HANDLE FILE UPLOAD - Validasi dan preview file
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // ✅ Validasi format file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Format file tidak didukung. Gunakan JPG, JPEG, atau PNG.');
      return;
    }

    // ✅ Validasi ukuran file (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Ukuran file terlalu besar. Maksimal 5MB.');
      return;
    }

    // 💾 Simpan file dan buat preview
    setPaymentFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => setFilePreview(e.target.result);
    reader.readAsDataURL(file);
    
    console.log('📁 File selected:', file.name);
  };

  // 🚀 SUBMIT PAYMENT - Upload to Cloudinary
  const submitPayment = async () => {
    // ✅ Validate payment proof
    if (!paymentFile) {
      toast.error('Silakan pilih file bukti pembayaran terlebih dahulu.');
      return;
    }

    if (!order) {
      toast.error('Data pesanan tidak ditemukan.');
      return;
    }

    setUploading(true);
    try {
      console.log('🚀 Uploading payment proof to Cloudinary...');
      
      // 📁 Prepare FormData for file upload
      const formData = new FormData();
      formData.append('paymentProof', paymentFile);
      
      console.log('📤 FormData prepared:', {
        fileName: paymentFile.name,
        fileSize: paymentFile.size,
        fileType: paymentFile.type
      });

      // 🌐 Upload to Cloudinary via backend
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.ORDERS.UPLOAD_PROOF(order._id)}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();
      console.log('📨 Upload response:', result);
      
      if (result.success) {
        console.log('✅ Payment proof uploaded successfully');
        toast.success('Bukti pembayaran berhasil dikirim! Menunggu konfirmasi admin.');
        
        // 🔄 Redirect to orders page after 2 seconds
        setTimeout(() => {
          navigate('/orders');
        }, 2000);
      } else {
        throw new Error(result.message || 'Failed to upload payment proof');
      }
    } catch (error) {
      console.error('❌ Error uploading payment proof:', error);
      toast.error(error.message || 'Gagal mengirim bukti pembayaran');
    } finally {
      setUploading(false);
    }
  };

  // 🔄 LOADING STATE
  if (authLoading || loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4'></div>
          <p className='text-gray-600'>
            {authLoading ? 'Verifying login...' : 'Loading payment data...'}
          </p>
        </div>
      </div>
    );
  }

  // ❌ NO ORDER STATE
  if (!order) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-800 mb-4'>Order Not Found</h2>
          <p className='text-gray-600 mb-6'>Please check your order status in your profile.</p>
          <Button text="Back to Cart" to="/cart" />
        </div>
      </div>
    );
  }

  // 💰 Check if order is paid
  const isPaid = order.paymentStatus === 'paid';

  return (
    <div className='min-h-screen bg-offwhite2'>
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-4xl mx-auto'>
          
          {/* 🔙 HEADER - Back to checkout */}
          <div className='flex items-center gap-4 mb-6'>
            <button 
              onClick={() => navigate('/checkout')} 
              className='flex items-center gap-2 text-accent hover:underline text-sm'
            >
              <FaArrowLeft className="w-3 h-3" />
              <span>Back to Checkout</span>
            </button>
          </div>

          {/* 📋 TITLE */}
          <h1 className='font-atemica text-2xl md:text-3xl mb-8 text-gray-900'>
            Order Payment
          </h1>

          {/* 📊 MAIN CONTENT */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            
            {/* 📋 LEFT: ORDER SUMMARY */}
            <div className='bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm'>
              <h2 className='font-atemica text-xl mb-6 text-gray-900'>📋 Order Summary</h2>
              
              <div className='space-y-4 mb-6'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Order ID:</span>
                  <span className='font-medium'>{order._id}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Customer:</span>
                  <span className='font-medium'>{order.customer?.name}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Total Items:</span>
                  <span className='font-medium'>{order.orderItems?.length || 0} item(s)</span>
                </div>
                
                <hr className='border-gray-200' />
                
                <div className='flex justify-between text-lg font-bold'>
                  <span>Total Payment:</span>
                  <span className='text-accent'>Rp {order.pricing?.total?.toLocaleString() || '0'}</span>
                </div>
              </div>

              {/* 💳 PAYMENT STATUS */}
              <div className='bg-gray-50 p-4 rounded-lg'>
                <div className='flex items-center gap-2 mb-2'>
                  {isPaid ? (
                    <FaCheckCircle className='text-green-500' />
                  ) : (
                    <div className='w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin'></div>
                  )}
                  <h3 className='font-semibold'>Payment Status</h3>
                </div>
                <p className={`text-sm ${isPaid ? 'text-green-700' : 'text-orange-700'}`}>
                  {isPaid ? 'Payment Success' : 'Waiting for Payment'}
                </p>
              </div>
            </div>

            {/* 💳 RIGHT: PAYMENT METHOD */}
            <div className='space-y-6'>
              
              {/* 📱 QR CODE */}
              <div className='bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm'>
                <h2 className='font-atemica text-xl mb-6 text-gray-900'>💳 Scan to Pay</h2>
                
                <div className='text-center'>
                  <div className='bg-gray-50 p-6 rounded-lg mb-4'>
                    <img 
                      src={assets.qrCode} 
                      alt="QR Code Payment" 
                      className='mx-auto max-w-full h-auto max-h-64 object-contain'
                    />
                  </div>
                  <h3 className='font-semibold text-lg mb-2'>Scan QR Code</h3>
                  <p className='text-gray-600 text-sm mb-4'>
                    Use mobile banking or e-wallet for payment
                  </p>
                  <div className='bg-blue-50 p-3 rounded-lg'>
                    <p className='text-blue-800 text-sm font-medium'>
                      Total: Rp {order.pricing?.total?.toLocaleString() || '0'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 📤 UPLOAD SECTION atau SUCCESS MESSAGE */}
              {isPaid ? (
                // ✅ SUCCESS MESSAGE
                <div className='bg-green-50 border-2 border-green-200 rounded-xl p-6'>
                  <div className='text-center'>
                    <FaCheckCircle className='mx-auto h-16 w-16 text-green-500 mb-4' />
                    <h3 className='text-xl font-bold text-green-900 mb-2'>Payment Success!</h3>
                    <p className='text-green-700 mb-4'>
                      Payment proof has been received and is being processed.
                    </p>
                    <Button
                      text="View Order Status"
                      to="/orders"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    />
                  </div>
                </div>
              ) : (
                // 📤 UPLOAD FORM
                <div className='bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm'>
                  <h2 className='font-atemica text-xl mb-6 text-gray-900'>📤 Upload Payment Proof</h2>
                  
                  <div className='space-y-4'>
                    {/* 📁 FILE INPUT */}
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Select Payment Proof File *
                      </label>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleFileSelect}
                        className='hidden'
                        id='paymentFile'
                        disabled={uploading}
                      />
                      <label
                        htmlFor='paymentFile'
                        className={`flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                          paymentFile 
                            ? 'border-green-300 bg-green-50' 
                            : 'border-gray-300 bg-gray-50 hover:border-accent hover:bg-accent/10'
                        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className='text-center'>
                          <FaUpload className='mx-auto h-8 w-8 text-gray-400 mb-2' />
                          <p className='text-sm text-gray-600'>
                            {paymentFile ? paymentFile.name : 'Click to select file'}
                          </p>
                          <p className='text-xs text-gray-500 mt-1'>
                            JPG, JPEG, PNG (Max 5MB)
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* 🖼️ PREVIEW */}
                    {filePreview && (
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Preview
                        </label>
                        <div className='relative'>
                          <img
                            src={filePreview}
                            alt="Payment Proof Preview"
                            className='w-full max-h-64 object-contain border-2 border-gray-200 rounded-lg'
                          />
                          <button
                            onClick={() => {
                              setPaymentFile(null);
                              setFilePreview(null);
                            }}
                            className='absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600'
                            disabled={uploading}
                          >
                            <FaTimesCircle className='w-4 h-4' />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 🚀 SUBMIT BUTTON */}
                    <Button
                      text={uploading ? 'Sending...' : 'Submit Payment Proof'}
                      onClick={submitPayment}
                      disabled={!paymentFile || uploading}
                      className={`w-full ${
                        !paymentFile || uploading 
                          ? 'bg-gray-300 cursor-not-allowed' 
                          : 'bg-accent hover:bg-accent/90'
                      }`}
                    />

                    {/* 📝 INSTRUCTIONS */}
                    <div className='bg-blue-50 p-4 rounded-lg'>
                      <h4 className='font-semibold text-blue-900 mb-2'>Instructions:</h4>
                      <ul className='text-sm text-blue-800 space-y-1'>
                        <li>• Screenshot or photo of transfer proof</li>
                        <li>• Make sure the amount and time of transfer are clearly visible</li>
                        <li>• File must be in JPG, JPEG, or PNG format</li>
                        <li>• Maximum file size 5MB</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* 📞 CONTACT INFO */}
          <div className='mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6'>
            <h3 className='font-semibold text-yellow-900 mb-2'>Need Help?</h3>
            <p className='text-yellow-800 text-sm mb-3'>
              If you are having trouble with the payment process, please contact us:
            </p>
            <div className='flex flex-col sm:flex-row gap-4'>
              <div className='text-sm text-yellow-800'>
                <strong>WhatsApp:</strong> 081348886432 (Eza)
              </div>
              <div className='text-sm text-yellow-800'>
                <strong>Email:</strong> kwubem@gmail.com
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Payment