import React, { useState, useContext } from 'react'
import { FaUsers, FaShoppingBag, FaChartLine, FaCog, FaBox, FaPlus, FaEdit, FaTrash, FaEye, FaBell, FaDownload } from 'react-icons/fa'
import Button from '../../components/Button'
import { ShopContext } from '../../context/ShopContext'
import { useAuth } from '../../context/AuthContext'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const { products } = useContext(ShopContext)
  const { user } = useAuth()
  const [stats] = useState({
    totalUsers: 156,
    totalOrders: 89,
    totalProducts: 24,
    totalRevenue: 45670000
  })

  // Mock data untuk orders
  const [orders] = useState([
    { id: 1, customer: 'Ahmad Rizki', product: 'Ospek Kit 2025', quantity: 2, total: 150000, status: 'pending', date: '2024-01-15' },
    { id: 2, customer: 'Siti Nurhaliza', product: 'Merchandise Ospek', quantity: 1, total: 75000, status: 'completed', date: '2024-01-14' },
    { id: 3, customer: 'Budi Santoso', product: 'Notebook Ospek', quantity: 3, total: 225000, status: 'processing', date: '2024-01-13' },
  ])

  /* Mock data untuk products
  const [products] = useState([
    { id: 1, name: 'Ospek Kit 2025', price: 75000, stock: 45, category: 'Kit', status: 'active' },
    { id: 2, name: 'Merchandise Ospek 2025', price: 75000, stock: 30, category: 'Merchandise', status: 'active' },
    { id: 3, name: 'Notebook Ospek 2025', price: 75000, stock: 25, category: 'Stationery', status: 'active' },
  ]) */

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-200 text-green-800 border-green-300'
      case 'processing': return 'bg-yellow-200 text-yellow-800 border-yellow-300'
      case 'pending': return 'bg-red-200 text-red-800 border-red-300'
      default: return 'bg-gray-200 text-gray-800 border-gray-300'
    }
  }

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

      {/* Recent Orders */}
      <div className="bg-offwhite border-3 border-matteblack p-6">
        <h2 className="font-bricolage text-xl font-bold text-matteblack mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-matteblack">
                <th className="font-display-bold text-left py-2">Order ID</th>
                <th className="font-display-bold text-left py-2">Customer</th>
                <th className="font-display-bold text-left py-2">Product</th>
                <th className="font-display-bold text-left py-2">Total</th>
                <th className="font-display-bold text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b border-gray-200">
                  <td className="font-display py-3">#{order.id}</td>
                  <td className="font-display py-3">{order.customer}</td>
                  <td className="font-display py-3">{order.product}</td>
                  <td className="font-display py-3">{formatCurrency(order.total)}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded border font-display text-xs ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-bricolage text-3xl font-bold text-matteblack">Order Management</h1>
        <Button text="Export Orders" className="flex items-center gap-2">
          <FaDownload />
        </Button>
      </div>

      <div className="bg-offwhite border-3 border-matteblack p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-matteblack">
                <th className="font-display-bold text-left py-3">Order ID</th>
                <th className="font-display-bold text-left py-3">Customer</th>
                <th className="font-display-bold text-left py-3">Product</th>
                <th className="font-display-bold text-left py-3">Quantity</th>
                <th className="font-display-bold text-left py-3">Total</th>
                <th className="font-display-bold text-left py-3">Status</th>
                <th className="font-display-bold text-left py-3">Date</th>
                <th className="font-display-bold text-left py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-200 hover:bg-accent hover:bg-opacity-20">
                  <td className="font-display py-4">#{order.id}</td>
                  <td className="font-display py-4">{order.customer}</td>
                  <td className="font-display py-4">{order.product}</td>
                  <td className="font-display py-4">{order.quantity}</td>
                  <td className="font-display py-4">{formatCurrency(order.total)}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded border font-display text-xs ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="font-display py-4">{order.date}</td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button className="p-2 bg-blue-200 border-2 border-matteblack hover:shadow-matteblack-thin hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
                        <FaEye className="text-xs" />
                      </button>
                      <button className="p-2 bg-green-200 border-2 border-matteblack hover:shadow-matteblack-thin hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
                        <FaEdit className="text-xs" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-bricolage text-3xl font-bold text-matteblack">Product Management</h1>
        <Button text="Add New Product" className="flex items-center gap-2">
          <FaPlus />
        </Button>
      </div>

      <div className="bg-offwhite border-3 border-matteblack p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-matteblack">
                <th className="font-display-bold text-left py-3">Product ID</th>
                <th className="font-display-bold text-left py-3">Image</th>
                <th className="font-display-bold text-left py-3">Name</th>
                <th className="font-display-bold text-left py-3">Category</th>
                <th className="font-display-bold text-left py-3">Price</th>
                <th className="font-display-bold text-left py-3">Stock</th>
                <th className="font-display-bold text-left py-3">Status</th>
                <th className="font-display-bold text-left py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-200 hover:bg-accent hover:bg-opacity-20">
                  <td className="font-display py-4">#{product.id}</td>
                  <td className="font-display py-4">
                    <img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover" />
                  </td>
                  <td className="font-display py-4">{product.name}</td>
                  <td className="font-display py-4">{product.category}</td>
                  <td className="font-display py-4">{formatCurrency(product.price)}</td>
                  <td className="font-display py-4">{product.stock}</td>
                  <td className="py-4">
                    <span className="px-3 py-1 rounded border font-display text-xs bg-green-200 text-green-800 border-green-300">
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button className="p-2 bg-blue-200 border-2 border-matteblack hover:shadow-matteblack-thin hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
                        <FaEye className="text-xs" />
                      </button>
                      <button className="p-2 bg-yellow-200 border-2 border-matteblack hover:shadow-matteblack-thin hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
                        <FaEdit className="text-xs" />
                      </button>
                      <button className="p-2 bg-red-200 border-2 border-matteblack hover:shadow-matteblack-thin hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

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