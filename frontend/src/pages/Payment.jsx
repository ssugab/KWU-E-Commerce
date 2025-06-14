import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useCheckout } from '../hooks/useCheckout'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import { FaArrowLeft, FaUpload, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import Button from '../components/Button'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const Payment = () => {
  const { navigate } = useContext(ShopContext);
  const { getCurrentOrderFromSession, updatePaymentStatus } = useCheckout();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentProof, setPaymentProof] = useState(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');

  // Redirect jika user belum login 
  useEffect(() => {
    // Tunggu sampai loading selesai sebelum redirect
    if (!authLoading && !isAuthenticated) {
      toast.error('Silakan login dan pesan untuk melihat pembayaran');
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate])

  // Load order data saat component mount
  useEffect(() => {
    const loadOrderData = async () => {
      setLoading(true);
      try {
        const orderData = await getCurrentOrderFromSession();
        if (orderData) {
          setOrder(orderData);
          setPaymentStatus(orderData.paymentStatus || 'pending');
        } else {
          // toast.error('Order tidak ditemukan. Silakan lakukan checkout kembali.');
          // navigate('/checkout');
        }
      } catch (error) {
        console.error('Error loading order:', error);
        toast.error('Gagal memuat data pesanan');
        navigate('/cart');
      } finally {
        setLoading(false);
      }
    };

    loadOrderData();
  }, [getCurrentOrderFromSession, navigate]);

  // Handle file upload untuk bukti pembayaran
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Format file tidak didukung. Gunakan JPG, JPEG, atau PNG.');
        return;
      }

      // Validasi file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file terlalu besar. Maksimal 5MB.');
        return;
      }

      setPaymentProof(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPaymentProofPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit bukti pembayaran
  const handleSubmitPayment = async () => {
    if (!paymentProof) {
      toast.error('Silakan pilih file bukti pembayaran terlebih dahulu.');
      return;
    }

    if (!order) {
      toast.error('Data pesanan tidak ditemukan.');
      return;
    }

    setIsUploading(true);
    try {
      // Untuk sementara, kita simulasikan upload
      // Di production, ini akan upload ke cloudinary atau storage service
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulasi upload delay

      // Update payment status ke 'paid'
      const result = await updatePaymentStatus(order._id, 'paid', 'qris');
      
      if (result.success) {
        setPaymentStatus('paid');
        toast.success('Bukti pembayaran berhasil dikirim! Pesanan Anda akan segera diproses.');
        
        // Redirect ke orders page setelah 2 detik
        setTimeout(() => {
          navigate('/orders');
        }, 2000);
      } else {
        toast.error(result.message || 'Gagal mengirim bukti pembayaran');
      }
    } catch (error) {
      console.error('Error submitting payment proof:', error);
      toast.error('Terjadi kesalahan saat mengirim bukti pembayaran');
    } finally {
      setIsUploading(false);
    }
  };

  // Loading state - cek auth loading dulu
  if (authLoading || loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4'></div>
          <p className='text-gray-600'>
            {authLoading ? 'Memverifikasi login...' : 'Memuat data pembayaran...'}
          </p>
        </div>
      </div>
    );
  }

  // Jika tidak ada order
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

  return (
    <div className='min-h-screen bg-offwhite2'>
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-4xl mx-auto'>
          
          {/* Header */}
          <div className='flex justify-between items-center mb-6'>
            <div className='flex items-center gap-4'>
              <Link to='/checkout' className='flex items-center gap-2 text-accent hover:underline text-sm transition-colors'>
                <FaArrowLeft className="w-3 h-3" />
                <span>Checkout</span>
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-700 font-medium">Payment</span>
            </div>
          </div>

          {/* Page Title */}
          <h1 className='font-atemica text-2xl md:text-3xl mb-8 text-gray-900'>
            Pembayaran Pesanan
          </h1>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  ✓
                </div>
                <span className="ml-2 text-sm text-green-600 font-medium">Cart</span>
              </div>
              <div className="w-8 h-1 bg-green-500"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  ✓
                </div>
                <span className="ml-2 text-sm text-green-600 font-medium">Checkout</span>
              </div>
              <div className="w-8 h-1 bg-accent"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <span className="ml-2 text-sm text-gray-900 font-medium">Payment</span>
              </div>
            </div>
          </div>

          {/* Payment Content */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            
            {/* Left Column - Order Summary */}
            <div className='bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm'>
              <h2 className='font-atemica text-xl mb-6 text-gray-900'>📋 Ringkasan Pesanan</h2>
              
              <div className='space-y-4 mb-6'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Order Number:</span>
                  <span className='font-medium'>{order.orderNumber}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Customer:</span>
                  <span className='font-medium'>{order.customer?.firstName} {order.customer?.lastName}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Email:</span>
                  <span className='font-medium'>{order.customer?.email}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Total Items:</span>
                  <span className='font-medium'>{order.items?.length || 0} item(s)</span>
                </div>
                
                <hr className='border-gray-200' />
                
                <div className='flex justify-between text-lg font-bold'>
                  <span>Total Pembayaran:</span>
                  <span className='text-accent'>Rp {order.pricing?.total?.toLocaleString() || '0'}</span>
                </div>
              </div>

              {/* Payment Status */}
              <div className='bg-gray-50 p-4 rounded-lg mb-6'>
                <div className='flex items-center gap-2 mb-2'>
                  {paymentStatus === 'paid' ? (
                    <FaCheckCircle className='text-green-500' />
                  ) : paymentStatus === 'failed' ? (
                    <FaTimesCircle className='text-red-500' />
                  ) : (
                    <div className='w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin'></div>
                  )}
                  <h3 className='font-semibold'>Status Pembayaran</h3>
                </div>
                <p className={`text-sm ${
                  paymentStatus === 'paid' ? 'text-green-700' : 
                  paymentStatus === 'failed' ? 'text-red-700' : 'text-orange-700'
                }`}>
                  {paymentStatus === 'paid' ? 'Pembayaran Berhasil' : 
                   paymentStatus === 'failed' ? 'Pembayaran Gagal' : 'Menunggu Pembayaran'}
                </p>
              </div>
            </div>

            {/* Right Column - Payment Method & Upload */}
            <div className='space-y-6'>
              
              {/* QR Code Payment */}
              <div className='bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm'>
                <h2 className='font-atemica text-xl mb-6 text-gray-900'>💳 Metode Pembayaran</h2>
                
                <div className='text-center mb-6'>
                  <div className='bg-gray-50 p-6 rounded-lg mb-4'>
                    <img 
                      src={assets.qrCode} 
                      alt="QR Code Payment" 
                      className='mx-auto max-w-full h-auto max-h-64 object-contain'
                    />
                  </div>
                  <h3 className='font-semibold text-lg mb-2'>Scan QR Code</h3>
                  <p className='text-gray-600 text-sm mb-4'>
                    Gunakan aplikasi mobile banking atau e-wallet Anda untuk melakukan pembayaran
                  </p>
                  <div className='bg-blue-50 p-3 rounded-lg'>
                    <p className='text-blue-800 text-sm font-medium'>
                      Total: Rp {order.pricing?.total?.toLocaleString() || '0'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Upload Bukti Pembayaran */}
              {paymentStatus !== 'paid' && (
                <div className='bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm'>
                  <h2 className='font-atemica text-xl mb-6 text-gray-900'>📤 Upload Bukti Pembayaran</h2>
                  
                  <div className='space-y-4'>
                    {/* File Upload */}
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Pilih File Bukti Pembayaran *
                      </label>
                      <div className='relative'>
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={handleFileChange}
                          className='hidden'
                          id='paymentProof'
                          disabled={isUploading}
                        />
                        <label
                          htmlFor='paymentProof'
                          className={`flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                            paymentProof 
                              ? 'border-green-300 bg-green-50' 
                              : 'border-gray-300 bg-gray-50 hover:border-accent hover:bg-accent/10'
                          } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className='text-center'>
                            <FaUpload className='mx-auto h-8 w-8 text-gray-400 mb-2' />
                            <p className='text-sm text-gray-600'>
                              {paymentProof ? paymentProof.name : 'Klik untuk pilih file atau drag & drop'}
                            </p>
                            <p className='text-xs text-gray-500 mt-1'>
                              JPG, JPEG, PNG (Max 5MB)
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Preview */}
                    {paymentProofPreview && (
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Preview
                        </label>
                        <div className='relative'>
                          <img
                            src={paymentProofPreview}
                            alt="Payment Proof Preview"
                            className='w-full max-h-64 object-contain border-2 border-gray-200 rounded-lg'
                          />
                          <button
                            onClick={() => {
                              setPaymentProof(null);
                              setPaymentProofPreview(null);
                            }}
                            className='absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600'
                            disabled={isUploading}
                          >
                            <FaTimesCircle className='w-4 h-4' />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      text={isUploading ? 'Mengirim...' : 'Kirim Bukti Pembayaran'}
                      onClick={handleSubmitPayment}
                      disabled={!paymentProof || isUploading}
                      className={`w-full ${
                        !paymentProof || isUploading 
                          ? 'bg-gray-300 cursor-not-allowed' 
                          : 'bg-accent hover:bg-accent/90'
                      }`}
                    />

                    {/* Instructions */}
                    <div className='bg-blue-50 p-4 rounded-lg'>
                      <h4 className='font-semibold text-blue-900 mb-2'>Petunjuk:</h4>
                      <ul className='text-sm text-blue-800 space-y-1'>
                        <li>• Screenshot atau foto bukti transfer</li>
                        <li>• Pastikan nominal dan waktu transfer terlihat jelas</li>
                        <li>• File harus berformat JPG, JPEG, atau PNG</li>
                        <li>• Maksimal ukuran file 5MB</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Success */}
              {paymentStatus === 'paid' && (
                <div className='bg-green-50 border-2 border-green-200 rounded-xl p-6'>
                  <div className='text-center'>
                    <FaCheckCircle className='mx-auto h-16 w-16 text-green-500 mb-4' />
                    <h3 className='text-xl font-bold text-green-900 mb-2'>Pembayaran Berhasil!</h3>
                    <p className='text-green-700 mb-4'>
                      Bukti pembayaran Anda telah diterima dan sedang diproses.
                    </p>
                    <Button
                      text="Lihat Status Pesanan"
                      to="/orders"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    />
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Contact Info */}
          <div className='mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6'>
            <h3 className='font-semibold text-yellow-900 mb-2'>Butuh Bantuan?</h3>
            <p className='text-yellow-800 text-sm mb-3'>
              Jika Anda mengalami kesulitan dalam proses pembayaran, jangan ragu untuk menghubungi kami:
            </p>
            <div className='flex flex-col sm:flex-row gap-4'>
              <div className='text-sm text-yellow-800'>
                <strong>WhatsApp:</strong> 081348886432 (Eza)
              </div>
              <div className='text-sm text-yellow-800'>
                <strong>Email:</strong> kwubem@example.com
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Payment