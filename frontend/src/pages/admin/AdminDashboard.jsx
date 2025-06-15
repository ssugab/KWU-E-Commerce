import React, { useState, useEffect } from 'react'
import { FaUsers, FaShoppingBag, FaChartLine, FaCog, FaBox, FaBell, FaCheck } from 'react-icons/fa'
import Button from '../../components/Button'
import { useAuth } from '../../context/AuthContext'
import { API_ENDPOINTS } from '../../config/api'
import toast from 'react-hot-toast'
// Import komponen terpisah
import OrderManagement from './OrderManagement'
import ProductManagement from './ProductManagement'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const { user, navigate } = useAuth()
  
  // Basic stats states (tanpa order management logic)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 24,
    totalRevenue: 0
  })

  // Sidebar menu items
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: FaChartLine },
    { id: 'orders', label: 'Orders', icon: FaShoppingBag },
    { id: 'products', label: 'Products', icon: FaBox },
    { id: 'users', label: 'Users', icon: FaUsers },
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
        setStats(prev => ({
          ...prev,
          totalOrders: data.orders?.length || 0,
          totalRevenue: data.orders?.reduce((sum, order) => sum + (order.pricing?.total || 0), 0) || 0
        }));
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // Check if user is admin and redirect to home if not
  useEffect(() => {
    if(!user?.role === 'admin'){
      toast.error('You are not authorized to access this page')
      navigate('/')
    } else {
      loadStats(); // Load basic stats for overview
    }
  }, [navigate, user])

  const StatCard = ({ title, value, icon: Icon, trend }) => (
    <div className="bg-offwhite border-3 border-matteblack p-6 hover:shadow-matteblack hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-gray-600 text-sm">{title}</p>
          <p className="font-bricolage text-2xl font-bold text-matteblack">{value}</p>
          {trend && (
            <p className="font-display text-sm text-green-600">+{trend}% from last month</p>
          )}
        </div>
        <div className="bg-accent p-3 border-2 border-matteblack">
          <Icon className="text-matteblack text-xl" />
        </div>
      </div>
    </div>
  )

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-accent border-3 border-matteblack p-6 shadow-matteblack">
        <h1 className="font-bricolage text-3xl font-bold text-matteblack">Welcome to Admin Dashboard</h1>
        <p className="font-display text-matteblack mt-2">Kelola toko online KWU BEM dengan mudah</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={FaUsers} 
          trend="12"
        />
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          icon={FaShoppingBag} 
          trend="8"
        />
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts} 
          icon={FaBox} 
          trend="5"
        />
        <StatCard 
          title="Total Revenue" 
          value={formatCurrency(stats.totalRevenue)} 
          icon={FaChartLine} 
          trend="15"
        />
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
            text="User Management" 
            onClick={() => setActiveTab('users')}
            className="flex items-center gap-2 justify-center bg-purple-600 text-white"
          >
            <FaUsers />
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

  // Simplified render functions using separate components
  const renderOrders = () => <OrderManagement />
  const renderProducts = () => <ProductManagement />

  const renderUsers = () => (
    <div className="space-y-6">
      <h1 className="font-bricolage text-3xl font-bold text-matteblack">User Management</h1>
      <div className="bg-offwhite border-3 border-matteblack p-6">
        <p className="font-display text-center text-gray-600">User management features coming soon...</p>
        {user && (
          <div className="mt-4 p-4 bg-blue-100 border-2 border-blue-300">
            <h4 className="font-display-bold text-blue-800 mb-2">Current User:</h4>
            <p className="font-display text-blue-700 text-sm">Email: {user.email}</p>
            <p className="font-display text-blue-700 text-sm">Name: {user.name}</p>
            <p className="font-display text-blue-700 text-sm">Role: {user.role}</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      <h1 className="font-bricolage text-3xl font-bold text-matteblack">Settings</h1>
      <div className="bg-offwhite border-3 border-matteblack p-6">
        <p className="font-display text-center text-gray-600">Settings panel coming soon...</p>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview()
      case 'orders': return renderOrders()
      case 'products': return renderProducts()
      case 'users': return renderUsers()
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
          <Button text="Logout" className="w-full bg-red-500 hover:bg-red-600 border-red-600" />
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
              <button className="p-2 bg-accent border-2 border-matteblack hover:shadow-matteblack-thin hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
                <FaBell className="text-matteblack" />
              </button>
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