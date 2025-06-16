import React, { useState, useEffect } from 'react'
import { FaEye, FaCheck, FaTimes, FaDownload, FaBell, FaBoxOpen } from 'react-icons/fa'
import Button from '../../components/Button'
import { useCheckout } from '../../hooks/useCheckout'
import { API_ENDPOINTS } from '../../config/api'
import toast from 'react-hot-toast'

const OrderManagement = () => {
  const { updateOrderStatus } = useCheckout()
  
  // States
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderDetail, setShowOrderDetail] = useState(false)
  const [newOrdersCount, setNewOrdersCount] = useState(0)

  // Load orders dari backend
  const loadOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.ORDERS.GET_ALL, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders || []);
      } else {
        toast.error('Failed to load orders');
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  // Load new orders count for notification
  const loadNewOrdersCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.ORDERS.GET_NEW_COUNT, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include' // Include cookies untuk hybrid auth
      });
      const data = await response.json();
      
      if (data.success) {
        setNewOrdersCount(data.count);
      } else {
        console.error('❌ API Error:', data.message);
      }
    } catch (error) {
      console.error('Error loading new orders count:', error);
    }
  };

  // Mark orders as notified
  const markOrdersNotified = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.ORDERS.MARK_NOTIFIED, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include' // Include cookies untuk hybrid auth
      });
      
      if (response.ok) {
        setNewOrdersCount(0);
        toast.success('Notifikasi pesanan baru telah dibaca');
      }
    } catch (error) {
      console.error('Error marking orders notified:', error);
    }
  };

  // Konfirmasi pembayaran
  const confirmPayment = async (orderId) => {
    try {
      const result = await updateOrderStatus(orderId, 'confirmed', 'Payment confirmed by admin');
      
      if (result.success) {
        toast.success('Payment confirmed successfully!');
        loadOrders(); // Refresh orders
        setShowOrderDetail(false);
      } else {
        toast.error(result.message || 'Failed to confirm payment');
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast.error('Error confirming payment');
    }
  };

  // Mark order ready for pickup
  const markReadyPickup = async (orderId, adminNotes = '') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.ORDERS.MARK_READY_PICKUP(orderId), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ adminNotes })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Pesanan berhasil ditandai siap pickup! Customer akan mendapat notifikasi.');
        loadOrders(); // Refresh orders
        setShowOrderDetail(false);
      } else {
        toast.error(data.message || 'Failed to mark ready pickup');
      }
    } catch (error) {
      console.error('Error marking ready pickup:', error);
      toast.error('Error marking ready pickup');
    }
  };

  // Tolak pembayaran
  const rejectPayment = async (orderId) => {
    try {
      const result = await updateOrderStatus(orderId, 'pending_confirmation', 'Payment rejected - please upload valid proof');
      
      if (result.success) {
        toast.warning('Payment rejected. Customer will be notified.');
        loadOrders(); // Refresh orders
        setShowOrderDetail(false);
      } else {
        toast.error(result.message || 'Failed to reject payment');
      }
    } catch (error) {
      console.error('Error rejecting payment:', error);
      toast.error('Error rejecting payment');
    }
  };

  // Load orders saat component mount
  useEffect(() => {
    loadOrders();
    loadNewOrdersCount();
    
    // Polling setiap 30 detik untuk notifikasi baru
    const interval = setInterval(() => {
      loadNewOrdersCount();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_confirmation': return 'bg-yellow-200 text-yellow-800 border-yellow-300'
      case 'confirmed': return 'bg-blue-200 text-blue-800 border-blue-300'
      case 'ready_pickup': return 'bg-green-200 text-green-800 border-green-300'
      case 'picked_up': return 'bg-green-200 text-green-800 border-green-300'
      case 'cancelled': return 'bg-red-200 text-red-800 border-red-300'
      case 'expired': return 'bg-gray-200 text-gray-800 border-gray-300'
      default: return 'bg-gray-200 text-gray-800 border-gray-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="font-bricolage text-3xl font-bold text-matteblack">Order Management</h1>
          {/* Notifikasi Pesanan Baru */}
          {newOrdersCount > 0 && (
            <div 
              onClick={markOrdersNotified}
              className="flex items-center gap-2 bg-red-100 text-red-800 px-3 py-2 rounded-lg border border-red-300 cursor-pointer hover:bg-red-200 transition-all"
            >
              <FaBell className="text-sm animate-pulse" />
              <span className="text-sm font-medium">{newOrdersCount} Pesanan Baru</span>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <Button text="Refresh" onClick={loadOrders} className="flex items-center gap-2 bg-blue-600 text-white">
            <FaDownload />
          </Button>
          <Button text="Export Orders" className="flex items-center gap-2">
            <FaDownload />
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-offwhite border-3 border-matteblack p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="font-display text-gray-600">Loading orders...</p>
        </div>
      ) : (
        /* Orders Table */
        <div className="bg-offwhite border-3 border-matteblack p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-matteblack">
                  <th className="font-display-bold text-left py-3">Order ID</th>
                  <th className="font-display-bold text-left py-3">Customer</th>
                  <th className="font-display-bold text-left py-3">Items</th>
                  <th className="font-display-bold text-left py-3">Total</th>
                  <th className="font-display-bold text-left py-3">Payment</th>
                  <th className="font-display-bold text-left py-3">Status</th>
                  <th className="font-display-bold text-left py-3">Date</th>
                  <th className="font-display-bold text-left py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-8 font-display text-gray-600">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-200 hover:bg-accent hover:bg-opacity-20">
                      <td className="font-display py-4">#{order._id.slice(-6)}</td>
                      <td className="font-display py-4">{order.customer?.name}</td>
                      <td className="font-display py-4">{order.orderItems?.length} items</td>
                      <td className="font-display py-4">{formatCurrency(order.pricing?.total || 0)}</td>
                      <td className="py-4">
                        <div className="flex ">
                          <span className={`px-2 py-1 rounded text-xs ${
                            order.paymentStatus === 'paid' ? 'bg-green-200 text-green-800' :
                            order.paymentStatus === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-red-200 text-red-800'
                          }`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded border font-display text-xs ${getStatusColor(order.status)}`}>
                          {order.status?.replace('_', ' ') || 'unknown'}
                        </span>
                      </td>
                      <td className="font-display py-4">
                        {new Date(order.orderDate).toLocaleDateString('id-ID')}
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderDetail(true);
                            }}
                            className="p-2 bg-blue-200 border-2 border-matteblack hover:shadow-matteblack-thin hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                            title="View Details"
                          >
                            <FaEye className="text-xs" />
                          </button>
                          
                          {/* Quick Confirm Button - only for paid orders with proof */}
                          {order.paymentStatus === 'paid' && 
                           order.paymentProof?.imageUrl && 
                           order.status === 'pending_confirmation' && (
                            <button 
                              onClick={() => confirmPayment(order._id)}
                              className="p-2 bg-green-200 border-2 border-matteblack hover:shadow-matteblack-thin hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                              title="Quick Confirm"
                            >
                              <FaCheck className="text-xs" />
                            </button>
                          )}
                          
                          {/* Quick Reject Button */}
                          {order.paymentStatus === 'paid' && 
                           order.status === 'pending_confirmation' && (
                            <button 
                              onClick={() => rejectPayment(order._id)}
                              className="p-2 bg-red-200 border-2 border-matteblack hover:shadow-matteblack-thin hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                              title="Quick Reject"
                            >
                              <FaTimes className="text-xs" />
                            </button>
                          )}
                          
                          {/* Ready Pickup Button - only for confirmed orders */}
                          {order.status === 'confirmed' && (
                            <button 
                              onClick={() => markReadyPickup(order._id, 'Pesanan siap diambil')}
                              className="p-2 bg-orange-200 border-2 border-matteblack hover:shadow-matteblack-thin hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                              title="Mark Ready Pickup"
                            >
                              <FaBoxOpen className="text-xs" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {showOrderDetail && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-3 border-matteblack">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6 border-b-2 border-gray-200 pb-4">
                <h2 className="font-bricolage text-2xl font-bold text-matteblack">
                  Order Details #{selectedOrder._id.slice(-6)}
                </h2>
                <button
                  onClick={() => setShowOrderDetail(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Order Info Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                
                {/* Customer Info */}
                <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                  <h3 className="font-display-bold text-lg mb-3 text-matteblack">Customer Information</h3>
                  <div className="space-y-2">
                    <p><strong>Name:</strong> {selectedOrder.customer?.name}</p>
                    <p><strong>Email:</strong> {selectedOrder.customer?.email}</p>
                    <p><strong>Phone:</strong> {selectedOrder.customer?.phone}</p>
                    {selectedOrder.customer?.npm && (
                      <p><strong>NPM:</strong> {selectedOrder.customer.npm}</p>
                    )}
                  </div>
                </div>

                {/* Order Info */}
                <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                  <h3 className="font-display-bold text-lg mb-3 text-matteblack">Order Information</h3>
                  <div className="space-y-2">
                    <p><strong>Date:</strong> {new Date(selectedOrder.orderDate).toLocaleString('id-ID')}</p>
                    <p><strong>Status:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded text-sm ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status?.replace('_', ' ')}
                      </span>
                    </p>
                    <p><strong>Payment Status:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded text-sm ${
                        selectedOrder.paymentStatus === 'paid' ? 'bg-green-200 text-green-800' :
                        selectedOrder.paymentStatus === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-red-200 text-red-800'
                      }`}>
                        {selectedOrder.paymentStatus}
                      </span>
                    </p>
                    <p><strong>Total:</strong> {formatCurrency(selectedOrder.pricing?.total || 0)}</p>
                  </div>
                </div>
              </div>

              {/* Payment Proof Section */}
              <h3 className="font-display-bold text-lg mb-3 text-matteblack">📸 Payment Proof</h3>
              {selectedOrder.paymentProof?.imageUrl ? (
                <div className="mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                    <p className="text-green-600">Payment proof uploaded</p>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                    <p className="text-red-600">Payment proof not uploaded</p>
                  </div>
                </div>
              )}

              {/* Payment Proof Image */}
              {selectedOrder.paymentProof?.imageUrl && (
                <div className="mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <img 
                          src={selectedOrder.paymentProof.imageUrl} 
                          alt="Payment Proof"
                          className="w-full max-w-md h-auto border-2 border-gray-300 rounded-lg shadow-lg"
                          onClick={() => window.open(selectedOrder.paymentProof.imageUrl, '_blank')}
                          style={{ cursor: 'pointer' }}
                        />
                        <p className="text-sm text-gray-600 mt-2">
                          Click image to view full size
                        </p>
                      </div>
                      <div className="space-y-3">
                        <p><strong>Uploaded:</strong> {new Date(selectedOrder.paymentProof.uploadedAt).toLocaleString('id-ID')}</p>
                        <p className="text-sm text-gray-600">
                          Review this payment proof carefully before confirming or rejecting the payment.
                        </p>
                        
                        {/* Action Buttons */}
                        {selectedOrder.status === 'pending_confirmation' && (
                          <div className="flex gap-3 mt-4">
                            <button
                              onClick={() => confirmPayment(selectedOrder._id)}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <FaCheck /> Confirm Payment
                            </button>
                            <button
                              onClick={() => rejectPayment(selectedOrder._id)}
                              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <FaTimes /> Reject Payment
                            </button>
                          </div>
                        )}
                        
                        {selectedOrder.status === 'confirmed' && (
                          <div className="flex items-center gap-2 text-green-600">
                            <FaCheck /> Payment Confirmed
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="font-display-bold text-lg mb-3 text-matteblack">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.orderItems?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border">
                      {item.productImage && (
                        <img 
                          src={item.productImage} 
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded border"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium">{item.productName}</h4>
                        {item.size && item.size !== 'default' && (
                          <p className="text-sm text-gray-600">Size: {item.size}</p>
                        )}
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(item.productPrice)}</p>
                        <p className="text-sm text-gray-600">
                          Total: {formatCurrency(item.itemTotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Notes */}
              {selectedOrder.adminNotes && (
                <div className="mb-6">
                  <h3 className="font-display-bold text-lg mb-3 text-matteblack">Admin Notes</h3>
                  <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                    <p className="text-blue-800">{selectedOrder.adminNotes}</p>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t-2 border-gray-200">
                <Button
                  text="Close"
                  onClick={() => setShowOrderDetail(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderManagement