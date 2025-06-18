import React, { useContext, useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext';
import { ShopContext } from '../context/ShopContext';
import { useCheckout } from '../hooks/useCheckout';
import { FaEye, FaTimesCircle, FaCheckCircle, FaClock, FaShippingFast, FaBox } from 'react-icons/fa';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const Orders = () => {
  const { navigate } = useContext(ShopContext);
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { getOrdersByEmail, confirmReceiptOrder } = useCheckout();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  // const [cancelling, setCancelling] = useState(null);

  // Load orders when component mounts
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error('Please login first to view your orders');
      navigate('/login');
      return;
    }

    if (!authLoading && isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated, authLoading, currentPage]);

  const loadOrders = async () => {
    if (!user?.email) {
      return;
    }

    setLoading(true);
    try {
      const result = await getOrdersByEmail(user.email, currentPage, 10);
      
      if (result.success) {
        setOrders(result.orders);
        setPagination(result.pagination);
      } else {
        toast.error(result.message || 'Failed to load orders');
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  // Handle view order detail
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  /* Handle cancel order - user currently cannot cancel order (only admin can cancel order)
  TODO: Add cancel order consent from user later
  const handleCancelOrder = async (orderId, orderNumber) => {
    if (!confirm(`Are you sure you want to cancel order ${orderNumber}?`)) return;

    setCancelling(orderId);
    try {
      const result = await cancelOrder(orderId, 'Cancelled by customer');
      
      if (result.success) {
        toast.success('Order successfully cancelled');
        loadOrders();
      } else {
        toast.error(result.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Error cancelling order');
    } finally {
      setCancelling(null);
    }
  }; */

  // Handle confirm order receipt
  const handleConfirmReceipt = async (orderId) => {
    if (!confirm(`Confirm that you have received the order?`)) return;

    try {
      const result = await confirmReceiptOrder(orderId, 'Order received successfully');
      
      if (result.success) {
        toast.success('Order confirmation successful!');
        loadOrders(); // Refresh orders
      } else {
        toast.error(result.message || 'Failed to confirm receipt');
      }
    } catch (error) {
      console.error('Error confirming receipt:', error);
      toast.error('Error confirming receipt');
    }
  };

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending_confirmation':
        return {
          color: 'text-orange-600 bg-orange-100',
          icon: <FaClock className="w-4 h-4" />,
          label: 'Waiting for Confirmation'
        };
      case 'confirmed':
        return {
          color: 'text-blue-600 bg-blue-100',
          icon: <FaCheckCircle className="w-4 h-4" />,
          label: 'Confirmed'
        };
      case 'ready_pickup':
        return {
          color: 'text-green-600 bg-green-100',
          icon: <FaBox className="w-4 h-4" />,
          label: 'Ready to Pickup'
        };
      case 'picked_up':
        return {
          color: 'text-green-700 bg-green-200',
          icon: <FaShippingFast className="w-4 h-4" />,
          label: 'Picked Up'
        };
      case 'cancelled':
        return {
          color: 'text-red-600 bg-red-100',
          icon: <FaTimesCircle className="w-4 h-4" />,
          label: 'Cancelled'
        };
      case 'expired':
        return {
          color: 'text-gray-600 bg-gray-100',
          icon: <FaTimesCircle className="w-4 h-4" />,
          label: 'Expired'
        };
      default:
        return {
          color: 'text-gray-600 bg-gray-100',
          icon: <FaClock className="w-4 h-4" />,
          label: status
        };
    }
  };

  // Get payment status info
  const getPaymentStatusInfo = (paymentStatus) => {
    switch (paymentStatus) {
      case 'paid':
        return { color: 'text-green-600', label: 'Paid' };
      case 'pending':
        return { color: 'text-orange-600', label: 'Pending' };
      case 'failed':
        return { color: 'text-red-600', label: 'Failed' };
      default:
        return { color: 'text-gray-600', label: paymentStatus };
    }
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4'></div>
          <p className='text-gray-600'>
            {authLoading ? 'Verifying login...' : 'Loading your orders...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-offwhite2 pb-10'>
      {/* Header */}
      <div className="flex justify-center md:justify-start bg-accent border-b-4">
        <h1 className="font-atemica text-center text-3xl ml-0 md:ml-15 mt-10 mb-5">My Orders</h1>
      </div>

      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-6xl mx-auto'>
          
          {/* User Info - coming soon
          {user && (
            <div className='bg-white border-2 border-matteblack rounded-xl p-6 mb-8 shadow-matteblack'>
              <h2 className='font-atemica text-xl mb-4'>Informasi Akun</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <span className='text-gray-600'>Nama:</span>
                  <span className='ml-2 font-medium'>{user.name}</span>
                </div>
                <div>
                  <span className='text-gray-600'>Email:</span>
                  <span className='ml-2 font-medium'>{user.email}</span>
                </div>
              </div>
            </div>
          )} */}

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className='bg-white border-2 border-matteblack rounded-xl p-8 text-center shadow-matteblack'>
              <div className='text-6xl mb-4'>📦</div>
              <h2 className='text-2xl font-bold text-gray-800 mb-2'>You don't have any orders yet.</h2>
              <p className='text-gray-600 mb-6'>Start shopping now!</p>
              <Button text="Start Shopping" to="/catalog" />
            </div>
          ) : (
            <div className='space-y-6'>
              <div className='flex justify-between items-center'>
                <h2 className='text-2xl font-bold text-gray-900'>
                  Order List ({pagination?.totalOrders || 0})
                </h2>
                <hr className='border-2 w-4/5 ' />
              </div>

              {/* Orders Grid */}
              <div className='grid gap-6'>
                {orders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  const paymentInfo = getPaymentStatusInfo(order.paymentStatus);
                  
                  return (
                    <div key={order._id} className='bg-white border-2 rounded-xl p-6 shadow-sm hover:shadow-accent transition-shadow'>
                      <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
                        
                        {/* Order Info */}
                        <div className='flex-1'>
                          <div className='flex flex-col sm:flex-row sm:items-center gap-2 mb-3'>
                            <h3 className='font-bold text-lg'>#{order.orderNumber}</h3>
                            <div className='flex gap-2'>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusInfo.color}`}>
                                {statusInfo.icon}
                                {statusInfo.label}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${paymentInfo.color} bg-gray-100`}>
                                {paymentInfo.label}
                              </span>
                              {order.status === 'ready_pickup' && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium animate-pulse">
                                  Pickup max in 7 days!
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Payment Rejected Notification */}
                          {order.paymentStatus === 'failed' && order.status === 'pending_confirmation' && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                              <div className="flex items-start gap-3">
                                <div className="text-red-600 text-xl">❌</div>
                                <div className="flex-1">
                                  <p className="text-red-800 font-bold mb-1">Payment Proof Rejected!</p>
                                  <p className="text-red-700 text-sm mb-3">
                                    The payment proof you uploaded is invalid or unclear. Please upload a valid payment proof.
                                  </p>
                                  {order.adminNotes && (
                                    <div className="text-sm text-red-600 bg-red-100 p-2 rounded mb-3">
                                      <p className="font-medium">Rejection Reason:</p>
                                      <p>{order.adminNotes}</p>
                                    </div>
                                  )}
                                  <div className="text-sm text-red-600 space-y-1">
                                    <p className="font-medium">📋 Tips upload payment proof:</p>
                                    <ul className="list-disc list-inside space-y-1 text-red-700">
                                      <li>Make sure the photo is clear and not blurry</li>
                                      <li>The photo must show the correct recipient's name</li>
                                      <li>The transfer amount must match the total order amount</li>
                                      <li>Screenshot from a legitimate mobile banking application</li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Ready Pickup Notification */}
                          {order.status === 'ready_pickup' && (
                            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-start gap-3">
                                <div className="text-green-600 text-xl">🎉</div>
                                <div className="flex-1">
                                  <p className="text-green-800 font-bold mb-1">Order ready for pickup!</p>
                                  <p className="text-green-700 text-sm mb-3">
                                    Your order is ready for pickup. Please come to the pickup location.
                                  </p>
                                  <div className="text-sm text-green-600 space-y-1">
                                    <p className="font-medium">📍 Pickup Location:</p>
                                    <p>BEM Fakultas Ilmu Komputer, Universitas Pembangunan Nasional Veteran Jawa Timur, Surabaya</p>
                                    <p>📞 WA: 0896-3000-0157 (Vania) / 081234567890 (Admin)</p>
                                    <p>🕒 Monday-Friday: 09:00-16:00</p>
                                    <p className="mt-2 text-orange-700 font-medium bg-orange-100 px-2 py-1 rounded">
                                      ⚠️ Please pick up within 7 days before expiration
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm'>
                            <div>
                              <span className='text-gray-600'>Date:</span>
                              <p className='font-medium'>{new Date(order.orderDate).toLocaleDateString('id-ID')}</p>
                            </div>
                            <div>
                              <span className='text-gray-600'>Items:</span>
                              <p className='font-medium'>{order.orderItems?.length || 0} items</p>
                            </div>
                            <div>
                              <span className='text-gray-600'>Total:</span>
                              <p className='font-bold text-accent'>Rp {order.pricing?.total?.toLocaleString() || '0'}</p>
                            </div>
                            <div>
                              <span className='text-gray-600'>Payment Method:</span>
                              <p className='font-medium'>{order.paymentMethod || 'QRIS'}</p>
                            </div>
                          </div>

                          {/* Admin Notes - only for admin */}
                          {order.adminNotes && (
                            <div className='mt-3 p-3 bg-blue-50 rounded-lg'>
                              <p className='text-sm text-blue-800'>
                                <strong>Admin Notes:</strong> {order.adminNotes}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className='flex flex-col sm:flex-row gap-2'>
                          <Button
                            text="Detail"
                            onClick={() => handleViewOrder(order)}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2"
                          >
                            <FaEye className="w-3 h-3" />
                          </Button>
                          
                          {/* Cancel button - only for pending orders 
                          {(order.status === 'pending_confirmation' && order.paymentStatus !== 'paid') && (
                            <Button
                              text={cancelling === order._id ? "Membatalkan..." : "Batalkan"}
                              onClick={() => handleCancelOrder(order._id, order.orderNumber)}
                              disabled={cancelling === order._id}
                              className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2"
                            />
                          )} */}

                          {/* Payment button - for unpaid orders */}
                          {order.paymentStatus === 'pending' && order.status !== 'cancelled' && order.status !== 'expired' && order.status !== 'ready_pickup' && order.status !== 'picked_up' && (
                            <Button
                              text="Pay Now"
                              onClick={() => {
                                sessionStorage.setItem('currentOrderId', order._id);
                                navigate('/payment');
                              }}
                              className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2"
                            />
                          )}

                          {/* Reupload payment proof button - for rejected payment orders */}
                          {order.paymentStatus === 'failed' && order.status === 'pending_confirmation' && (
                            <Button
                              text="Reupload Payment Proof"
                              onClick={() => {
                                sessionStorage.setItem('currentOrderId', order._id);
                                navigate('/payment');
                              }}
                              className="bg-orange-600 hover:bg-orange-700 text-white text-sm px-4 py-2 animate-pulse"
                            />
                          )}

                          {/* Confirm Receipt button - for ready_pickup orders */}
                          {order.status === 'ready_pickup' && (
                            <Button
                              text="Confirm Receipt"
                              onClick={() => handleConfirmReceipt(order._id)}
                              className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className='flex justify-center items-center gap-4 mt-8'>
                  <Button
                    text="Previous"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="text-sm px-4 py-2"
                  />
                  <span className='text-gray-600'>
                    Page {currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    text="Next"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= pagination.totalPages}
                    className="text-sm px-4 py-2"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {showOrderDetail && selectedOrder && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-offwhite3 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-6'>
              {/* Modal Header */}
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold'>Order Detail #{selectedOrder.orderNumber}</h2>
                <button
                  onClick={() => setShowOrderDetail(false)}
                  className='text-gray-500 hover:text-gray-700 text-2xl'
                >
                  ×
                </button>
              </div>

              {/* Order Details */}
              <div className='grid grid-cols-1 gap-6'>
                
                {/* Order Info */}
                <div className='space-y-4'>
                  <h3 className='font-semibold text-lg border-b pb-2'>Order Information</h3>
                  <div className='space-y-2'>
                    <p><strong>Order Date:</strong> {new Date(selectedOrder.orderDate).toLocaleString('id-ID')}</p>
                    <p><strong>Status:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded text-sm ${getStatusInfo(selectedOrder.status).color}`}>
                        {getStatusInfo(selectedOrder.status).label}
                      </span>
                    </p>
                    <p><strong>Payment Status:</strong> 
                      <span className={`ml-2 ${getPaymentStatusInfo(selectedOrder.paymentStatus).color}`}>
                        {getPaymentStatusInfo(selectedOrder.paymentStatus).label}
                      </span>
                    </p>
                    <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod || 'QRIS'}</p>
                    {selectedOrder.notes && (
                      <p><strong>Notes:</strong> {selectedOrder.notes}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className='mt-6'>
                <h3 className='font-semibold text-lg border-b pb-2 mb-4'>Order Items</h3>
                <div className='space-y-3'>
                  {selectedOrder.orderItems?.map((item, index) => (
                    <div key={index} className='flex items-center gap-4 p-3 bg-offwhite rounded-lg'>
                      {item.productImage && (
                        <img 
                          src={item.productImage} 
                          alt={item.productName}
                          className='w-16 h-16 object-cover rounded-lg border'
                        />
                      )}
                      <div className='flex-1'>
                        <h4 className='font-medium'>{item.productName}</h4>
                        {item.size && item.size !== 'default' && (
                          <p className='text-sm text-gray-600'>Size: {item.size}</p>
                        )}
                        <p className='text-sm text-gray-600'>Qty: {item.quantity}</p>
                      </div>
                      <div className='text-right'>
                        <p className='font-medium'>Rp {item.productPrice?.toLocaleString()}</p>
                        <p className='text-sm text-gray-600'>
                          Total: Rp {item.itemTotal?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Summary */}
              <div className='mt-6 bg-offwhite2 border-2 p-4 rounded-lg'>
                <h3 className='font-semibold text-lg mb-3'>Payment Summary</h3>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <span>Subtotal:</span>
                    <span>Rp {selectedOrder.pricing?.subtotal?.toLocaleString() || '0'}</span>
                  </div>
                  <hr />
                  <div className='flex justify-between font-bold text-lg'>
                    <span>Total:</span>
                    <span className='text-accent'>Rp {selectedOrder.pricing?.total?.toLocaleString() || '0'}</span>
                  </div>
                </div>
              </div>

              {/* Status History */}
              {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                <div className='mt-6'>
                  <h3 className='font-semibold text-lg border-b pb-2 mb-4'>Order Status History</h3>
                  <div className='space-y-2'>
                    {selectedOrder.statusHistory.map((history, index) => (
                      <div key={index} className='flex justify-between items-center p-2 bg-offwhite rounded'>
                        <span className='text-sm'>
                          {getStatusInfo(history.status).label}
                          {history.notes && ` - ${history.notes}`}
                        </span>
                        <span className='text-xs text-gray-500'>
                          {new Date(history.timestamp).toLocaleString('id-ID')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className='mt-6 flex justify-end gap-3'>
                <Button
                  text="Close"
                  onClick={() => setShowOrderDetail(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white"
                />
                {selectedOrder.paymentStatus === 'pending' && selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'expired' && selectedOrder.status !== 'ready_pickup' && selectedOrder.status !== 'picked_up' && (
                  <Button
                    text="Continue Payment"
                    onClick={() => {
                      sessionStorage.setItem('currentOrderId', selectedOrder._id);
                      setShowOrderDetail(false);
                      navigate('/payment');
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  />
                )}
              </div>
              
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders