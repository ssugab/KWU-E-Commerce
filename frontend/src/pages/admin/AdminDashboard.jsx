import React, { useState, useEffect } from 'react'
import { FaShoppingBag, FaChartLine, FaCog, FaBox, FaCheck, FaDownload } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import { useAuth } from '../../context/AuthContext'
import { API_ENDPOINTS } from '../../config/api'
import toast from 'react-hot-toast'

import OrderManagement from './OrderManagement'
import ProductManagement from './ProductManagement'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const { logout } = useAuth()
  const navigate = useNavigate()
  
  // Basic stats states
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 24,
    totalRevenue: 0
  })

  // Sales report states
  const [salesData, setSalesData] = useState({
    dailySales: [],
    topProducts: [],
    recentOrders: [],
    totalSalesThisMonth: 0,
    totalOrdersThisMonth: 0
  })

  // Sidebar menu items - removed users, added reports
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: FaChartLine },
    { id: 'orders', label: 'Orders', icon: FaShoppingBag },
    { id: 'products', label: 'Products', icon: FaBox },
    { id: 'reports', label: 'Sales Reports', icon: FaDownload },
    { id: 'settings', label: 'Settings', icon: FaCog },
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // Load basic stats for overview
  const loadStats = async () => {
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
        const orders = data.orders || [];
        setStats(prev => ({
          ...prev,
          totalOrders: orders.length,
          totalRevenue: orders.reduce((sum, order) => sum + (order.pricing?.total || 0), 0)
        }));

        // Calculate sales data for reports
        calculateSalesData(orders);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // Calculate sales data for reports
  const calculateSalesData = (orders) => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Filter orders from this month
    const thisMonthOrders = orders.filter(order => 
      new Date(order.orderDate) >= thisMonth && 
      ['confirmed', 'ready_pickup', 'picked_up'].includes(order.status)
    );

    // Calculate daily sales for last 7 days
    const dailySales = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate.toDateString() === date.toDateString() &&
               ['confirmed', 'ready_pickup', 'picked_up'].includes(order.status);
      });
      
      dailySales.push({
        date: date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' }),
        sales: dayOrders.reduce((sum, order) => sum + (order.pricing?.total || 0), 0),
        orders: dayOrders.length
      });
    }

    // Calculate top products
    const productSales = {};
    orders.forEach(order => {
      if (['confirmed', 'ready_pickup', 'picked_up'].includes(order.status)) {
        order.orderItems?.forEach(item => {
          const productName = item.productName;
          if (!productSales[productName]) {
            productSales[productName] = { quantity: 0, revenue: 0 };
          }
          productSales[productName].quantity += item.quantity;
          productSales[productName].revenue += item.itemTotal || 0;
        });
      }
    });

    const topProducts = Object.entries(productSales)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    setSalesData({
      dailySales,
      topProducts,
      recentOrders: orders.slice(0, 5),
      totalSalesThisMonth: thisMonthOrders.reduce((sum, order) => sum + (order.pricing?.total || 0), 0),
      totalOrdersThisMonth: thisMonthOrders.length
    });
  };

  // Handle logout function
  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logout berhasil')
      navigate('/admin-login')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Gagal logout')
    }
  }

  // Load basic stats on component mount
  useEffect(() => {
    loadStats();
  }, [])

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-accent border-3 border-matteblack p-6 shadow-matteblack">
        <h1 className="font-bricolage text-3xl font-bold text-matteblack">Welcome to Admin Dashboard</h1>
        <p className="font-display text-matteblack mt-2">Kelola toko online KWU BEM dengan mudah</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-offwhite border-3 border-matteblack p-6 hover:shadow-matteblack hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-gray-600 text-sm">Total Orders</p>
              <p className="font-bricolage text-2xl font-bold text-matteblack">{stats.totalOrders}</p>
            </div>
            <div className="bg-accent p-3 border-2 border-matteblack">
              <FaShoppingBag className="text-matteblack text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-offwhite border-3 border-matteblack p-6 hover:shadow-matteblack hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-gray-600 text-sm">Total Revenue</p>
              <p className="font-bricolage text-2xl font-bold text-matteblack">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="bg-accent p-3 border-2 border-matteblack">
              <FaChartLine className="text-matteblack text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-offwhite border-3 border-matteblack p-6 hover:shadow-matteblack hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-gray-600 text-sm">This Month</p>
              <p className="font-bricolage text-2xl font-bold text-matteblack">{formatCurrency(salesData.totalSalesThisMonth)}</p>
            </div>
            <div className="bg-green-300 p-3 border-2 border-matteblack">
              <FaDownload className="text-matteblack text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-offwhite border-3 border-matteblack p-6 hover:shadow-matteblack hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-gray-600 text-sm">Orders This Month</p>
              <p className="font-bricolage text-2xl font-bold text-matteblack">{salesData.totalOrdersThisMonth}</p>
            </div>
            <div className="bg-blue-300 p-3 border-2 border-matteblack">
              <FaBox className="text-matteblack text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-offwhite border-3 border-matteblack p-6">
        <h2 className="font-bricolage text-xl font-bold text-matteblack mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            text="View All Orders" 
            onClick={() => setActiveTab('orders')}
            className="flex items-center gap-2 justify-center bg-blue-600 text-white"
          >
            <FaShoppingBag />
          </Button>
          <Button 
            text="Manage Products" 
            onClick={() => setActiveTab('products')}
            className="flex items-center gap-2 justify-center bg-green-600 text-white"
          >
            <FaBox />
          </Button>
          <Button 
            text="Sales Reports" 
            onClick={() => setActiveTab('reports')}
            className="flex items-center gap-2 justify-center bg-purple-600 text-white"
          >
            <FaDownload />
          </Button>
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="bg-offwhite border-3 border-matteblack p-6">
        <h2 className="font-bricolage text-xl font-bold text-matteblack mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border">
            <FaShoppingBag className="text-blue-600" />
            <span className="font-display">New orders waiting for confirmation</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border">
            <FaCheck className="text-green-600" />
            <span className="font-display">Recent payments confirmed</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border">
            <FaBox className="text-yellow-600" />
            <span className="font-display">Products need restocking</span>
                    </div>
        </div>
      </div>
    </div>
  )

  const renderOrders = () => <OrderManagement />
  const renderProducts = () => <ProductManagement />

  // Sales Reports render function
  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-bricolage text-3xl font-bold text-matteblack">Sales Reports</h1>
      </div>

      {/* Sales Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-offwhite border-3 border-matteblack p-6">
          <h3 className="font-display-bold text-lg mb-2">Total Revenue</h3>
          <p className="font-bricolage text-3xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
          <p className="text-sm text-gray-600 mt-1">All time</p>
        </div>
        
        <div className="bg-offwhite border-3 border-matteblack p-6">
          <h3 className="font-display-bold text-lg mb-2">This Month</h3>
          <p className="font-bricolage text-3xl font-bold text-blue-600">{formatCurrency(salesData.totalSalesThisMonth)}</p>
          <p className="text-sm text-gray-600 mt-1">{salesData.totalOrdersThisMonth} orders</p>
        </div>
        
        <div className="bg-offwhite border-3 border-matteblack p-6">
          <h3 className="font-display-bold text-lg mb-2">Average Order</h3>
          <p className="font-bricolage text-3xl font-bold text-purple-600">
            {formatCurrency(stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0)}
          </p>
          <p className="text-sm text-gray-600 mt-1">Per order</p>
        </div>
      </div>

      {/* Daily Sales Chart */}
      <div className="bg-offwhite border-3 border-matteblack p-6">
        <h3 className="font-bricolage text-xl font-bold mb-4">Sales Last 7 Days</h3>
        <div className="grid grid-cols-7 gap-2">
          {salesData.dailySales.map((day, index) => (
            <div key={index} className="text-center">
              <div className="bg-accent border-2 border-matteblack p-3 mb-2">
                <p className="font-display text-xs">{day.date}</p>
                <p className="font-bricolage font-bold text-sm">{day.orders}</p>
                <p className="font-display text-xs">orders</p>
              </div>
              <p className="font-display text-xs text-gray-600">{formatCurrency(day.sales)}</p>
                    </div>
              ))}
        </div>
      </div>

      {/* Top Products */}
              <div className="bg-offwhite border-3 border-matteblack p-6">
        <h3 className="font-bricolage text-xl font-bold mb-4">Top Selling Products</h3>
        <div className="space-y-3">
          {salesData.topProducts.map((product, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 border rounded">
              <div>
                <p className="font-display-bold">{product.name}</p>
                <p className="text-sm text-gray-600">{product.quantity} sold</p>
              </div>
              <div className="text-right">
                <p className="font-bricolage font-bold">{formatCurrency(product.revenue)}</p>
              </div>
            </div>
          ))}
        </div>
        </div>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      <h1 className="font-bricolage text-3xl font-bold text-matteblack">Settings</h1>
      <div className="bg-offwhite border-3 border-matteblack p-6">
        <p className="font-display text-center text-gray-600">Settings management coming soon...</p>
        <div className="mt-4 p-4 bg-gray-100 border-2 border-gray-300">
          <p className="font-display text-gray-700 text-sm">Current Stats:</p>
          <p className="font-display text-gray-700 text-sm">Total Orders: {stats.totalOrders}</p>
          <p className="font-display text-gray-700 text-sm">Total Revenue: {formatCurrency(stats.totalRevenue)}</p>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview()
      case 'orders': return renderOrders()
      case 'products': return renderProducts()
      case 'reports': return renderReports()
      case 'settings': return renderSettings()
      default: return renderOverview()
    }
  }

  return (
    <div className="min-h-screen bg-offwhite2 flex">
      {/* Grid Background Pattern */}
      <div 
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #23150F 1px, transparent 1px),
            linear-gradient(to bottom, #23150F 1px, transparent 1px)
          `,
          backgroundSize: '45px 45px'
        }}
      ></div>

      {/* Decorative elements */}
      <div className="fixed top-10 left-10 w-20 h-20 border-3 border-matteblack rotate-12 opacity-10"></div>
      <div className="fixed top-32 right-16 w-16 h-16 bg-accent border-2 border-matteblack rotate-45 opacity-20"></div>
      <div className="fixed bottom-20 left-20 w-12 h-12 border-3 border-matteblack rotate-[-15deg] opacity-15"></div>

      {/* Sidebar */}
      <div className="w-64 bg-matteblack border-r-3 border-matteblack relative z-10">
        <div className="p-6">
          <h2 className="font-bricolage text-2xl font-bold text-accent">KWU ADMIN</h2>
          <p className="font-display text-offwhite text-sm">Dashboard Panel</p>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 font-display transition-all ${
                activeTab === item.id 
                  ? 'bg-accent text-matteblack border-r-4 border-accent' 
                  : 'text-offwhite hover:bg-accent hover:text-matteblack'
              }`}
            >
              <item.icon />
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className='absolute bottom-20 left-6 right-6'>
          <Button to="/" text="Web KWU" className="w-full bg-accent text-matteblack hover:bg-accent hover:text-matteblack hover:shadow-matteblack text-center" />
        </div>
        
        {/* Logout Button */}
        <div className="absolute bottom-6 left-6 right-6">
          <Button 
            text="Logout" 
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 border-red-600" 
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative z-10">
        {/* Header */}
        <header className="bg-offwhite border-b-3 border-matteblack p-6">
          <div className="flex justify-between items-center">
            <h1 className="font-bricolage text-2xl font-bold text-matteblack">
              {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            </h1>
            <div className="flex items-center gap-4">
              <div className="bg-accent border-2 border-matteblack px-4 py-2">
                <span className="font-display-bold text-matteblack">Admin User</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard