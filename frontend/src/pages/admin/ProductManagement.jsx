import React, { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash, FaEye, FaStar, FaRegStar, FaCheck, FaTimes } from 'react-icons/fa'
import Button from '../../components/Button'
import { API_ENDPOINTS } from '../../config/api'
import toast from 'react-hot-toast'
import CreateProducts from '../../components/admin/CreateProducts'
import EditProduct from '../../components/admin/EditProduct'

const ProductManagement = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showProductDetail, setShowProductDetail] = useState(false)
  const [showCreateProduct, setShowCreateProduct] = useState(false)
  const [showEditProduct, setShowEditProduct] = useState(false)

  // Load products dari backend
  const loadProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_ENDPOINTS.CATALOG.GET_ALL}?status=all`)
      const data = await response.json()
      
      if (data.success) {
        setProducts(data.data || [])
      } else {
        toast.error('Failed to load products')
      }
    } catch (error) {
      console.error('Error loading products:', error)
      toast.error('Error loading products')
    } finally {
      setLoading(false)
    }
  }

  // Toggle highlight product
  const toggleHighlight = async (productId, currentHighlight) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(API_ENDPOINTS.CATALOG.UPDATE(productId), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ highlight: !currentHighlight })
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(`Product ${!currentHighlight ? 'highlighted' : 'unhighlighted'} successfully!`)
        loadProducts() // Refresh products
      } else {
        toast.error(data.message || 'Failed to update product')
      }
    } catch (error) {
      console.error('Error updating highlight:', error)
      toast.error('Error updating product highlight')
    }
  }

  // Toggle product status
  const toggleStatus = async (productId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(API_ENDPOINTS.CATALOG.UPDATE(productId), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(`Product ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`)
        loadProducts() // Refresh products
      } else {
        toast.error(data.message || 'Failed to update product status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Error updating product status')
    }
  }

  // Toggle hero status
  const toggleHero = async (productId, currentHero) => {
    // Check if trying to add to hero when already at max limit
    if (!currentHero) {
      const currentHeroCount = products.filter(p => p.isHero).length;
      if (currentHeroCount >= 5) {
        toast.error('Maksimal 5 produk yang bisa ditambahkan ke Hero Section!');
        return;
      }
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(API_ENDPOINTS.CATALOG.UPDATE(productId), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isHero: !currentHero })
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(`Product ${!currentHero ? 'added to' : 'removed from'} hero successfully!`)
        loadProducts() // Refresh products
      } else {
        toast.error(data.message || 'Failed to update hero status')
      }
    } catch (error) {
      console.error('Error updating hero status:', error)
      toast.error('Error updating hero status')
    }
  }

  // Add Product
  const handleAddProduct = () => {
    setShowCreateProduct(true)
  }

  // Open edit product modal
  const openEditProduct = (product) => {
    setSelectedProduct(product)
    setShowEditProduct(true)
  }

  // Delete product
  const deleteProduct = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      return
    }
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(API_ENDPOINTS.CATALOG.DELETE(productId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('Product deleted successfully!')
        loadProducts() // Refresh products
      } else {
        toast.error(data.message || 'Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Error deleting product')
    }
  }

  // Load products saat component mount
  useEffect(() => {
    loadProducts()
  }, [])

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
      case 'active': return 'bg-green-200 text-green-800 border-green-300'
      case 'inactive': return 'bg-gray-200 text-gray-800 border-gray-300'
      case 'out_of_stock': return 'bg-red-200 text-red-800 border-red-300'
      default: return 'bg-gray-200 text-gray-800 border-gray-300'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-bricolage text-3xl font-bold text-matteblack">Product Management</h1>
        <div className="flex gap-3">
          <Button text="Refresh" onClick={loadProducts} className="flex items-center gap-2 bg-blue-600 text-white">
            <FaEye />
          </Button>
          <Button onClick={handleAddProduct} text="Add New Product" className="flex items-center gap-2 bg-green-600 text-white">
            <FaPlus />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-offwhite border-3 border-matteblack p-4">
          <h3 className="font-display text-sm text-gray-600">Total Products</h3>
          <p className="font-bricolage text-2xl font-bold">{products.length}</p>
        </div>
        <div className="bg-offwhite border-3 border-matteblack p-4">
          <h3 className="font-display text-sm text-gray-600">Active Products</h3>
          <p className="font-bricolage text-2xl font-bold text-green-600">
            {products.filter(p => p.status === 'active').length}
          </p>
        </div>
        {/* Hero Products Count // set parent div to 4 columns
        <div className="bg-offwhite border-3 border-matteblack p-4">
          <h3 className="font-display text-sm text-gray-600">Hero Products</h3>
          <p className={`font-bricolage text-2xl font-bold ${
            products.filter(p => p.isHero).length >= 5 ? 'text-red-600' : 'text-purple-600'
          }`}>
            {products.filter(p => p.isHero).length}/5
          </p>
          {products.filter(p => p.isHero).length >= 5 && (
            <p className="text-xs text-red-600 mt-1">⚠️ Limit tercapai</p>
          )}
        </div> */}
        <div className="bg-offwhite border-3 border-matteblack p-4">
          <h3 className="font-display text-sm text-gray-600">Inactive Products</h3>
          <p className="font-bricolage text-2xl font-bold text-gray-600">
            {products.filter(p => p.status === 'inactive').length}
          </p>
        </div>
        <div className="bg-offwhite border-3 border-matteblack p-4">
          <h3 className="font-display text-sm text-gray-600">Low Stock</h3>
          <p className="font-bricolage text-2xl font-bold text-red-600">
            {products.filter(p => p.stock < 5).length}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-offwhite border-3 border-matteblack p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="font-display text-gray-600">Loading products...</p>
        </div>
      ) : (
        /* Products Table */
        <div className="bg-offwhite border-3 border-matteblack p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-matteblack">
                  <th className="font-display-bold text-left py-3">Image</th>
                  <th className="font-display-bold text-left py-3">Name</th>
                  <th className="font-display-bold text-left py-3">Category</th>
                  <th className="font-display-bold text-left py-3">Price</th>
                  <th className="font-display-bold text-left py-3">Stock</th>
                  <th className="font-display-bold text-left py-3">Featured</th>
                  <th className="font-display-bold text-left py-3">Hero</th>
                  <th className="font-display-bold text-left py-3">Status</th>
                  <th className="font-display-bold text-left py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-8 font-display text-gray-600">
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id} className="border-b border-gray-200 hover:bg-accent hover:bg-opacity-20">
                      <td className="font-display py-4">
                        <img 
                          src={product.images?.[0] || '/placeholder.png'} 
                          alt={product.name} 
                          className="w-12 h-12 object-cover rounded border-2 border-matteblack" 
                        />
                      </td>
                      <td className="font-display py-4 max-w-xs">
                        <p className="font-medium truncate">{product.name}</p>
                        <p className="text-xs text-gray-600 truncate">{product.description}</p>
                      </td>
                      <td className="font-display py-4">{product.category}</td>
                      <td className="font-display py-4 font-medium">{formatCurrency(product.price)}</td>
                      <td className="font-display py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          product.stock < 5 ? 'bg-red-100 text-red-800' : 
                          product.stock < 10 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-4">
                        <button
                          onClick={() => toggleHighlight(product._id, product.highlight)}
                          className={`p-2 border-2 border-matteblack transition-all ${
                            product.highlight 
                              ? 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300' 
                              : 'bg-gray-200 text-gray-600 hover:bg-yellow-100'
                          }`}
                        >
                          {product.highlight ? <FaStar className="text-sm" /> : <FaRegStar className="text-sm" />}
                        </button>
                      </td>
                      <td className="py-4">
                        <button
                          onClick={() => toggleHero(product._id, product.isHero)}
                          className={`p-2 border-2 border-matteblack transition-all ${
                            product.isHero 
                              ? 'bg-purple-200 text-purple-800 hover:bg-purple-300' 
                              : 'bg-gray-200 text-gray-600 hover:bg-purple-100'
                          }`}
                        >
                          {product.isHero ? '🏠' : '➕'}
                        </button>
                      </td>
                      <td className="py-4">
                        <button
                          onClick={() => toggleStatus(product._id, product.status)}
                          className={`px-3 py-1 rounded border-2 font-display text-xs cursor-pointer hover:border-matteblack ${getStatusColor(product.status)} hover:opacity-80 transition-all`}
                        >
                          {product.status === 'active' ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setSelectedProduct(product)
                              setShowProductDetail(true)
                            }}
                            className="p-2 bg-blue-200 border-2 border-matteblack hover:shadow-matteblack-thin hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                          >
                            <FaEye className="text-xs" />
                          </button>
                                                      <button 
                             onClick={() => openEditProduct(product)}
                             className="p-2 bg-yellow-200 border-2 border-matteblack hover:shadow-matteblack-thin hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                           >
                            <FaEdit className="text-xs" />
                          </button>
                          <button 
                            onClick={() => deleteProduct(product._id, product.name)}
                            className="p-2 bg-red-200 border-2 border-matteblack hover:shadow-matteblack-thin hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                          >
                            <FaTrash className="text-xs" />
                          </button>
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

      {/* Product Detail Modal */}
      {showProductDetail && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-offwhite border-3 border-matteblack max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-offwhite border-b-2 border-matteblack p-4 flex justify-between items-center">
              <h2 className="font-bricolage text-xl font-bold">Product Details</h2>
              <button
                onClick={() => setShowProductDetail(false)}
                className="p-2 bg-red-200 border-2 border-matteblack hover:shadow-matteblack-thin transition-all"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Product Images */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {selectedProduct.images?.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${selectedProduct.name} ${index + 1}`}
                    className="w-full h-24 object-cover rounded border-2 border-matteblack"
                  />
                ))}
              </div>

              {/* Product Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-display-bold text-lg mb-2">Product Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {selectedProduct.name}</p>
                    <p><strong>Category:</strong> {selectedProduct.category}</p>
                    <p><strong>Price:</strong> {formatCurrency(selectedProduct.price)}</p>
                    <p><strong>Stock:</strong> {selectedProduct.stock}</p>
                    <p><strong>Status:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(selectedProduct.status)}`}>
                        {selectedProduct.status}
                      </span>
                    </p>
                    <p><strong>Highlighted:</strong> 
                      <span className="ml-2">
                        {selectedProduct.highlight ? 
                          <FaStar className="inline text-yellow-500" /> : 
                          <FaRegStar className="inline text-gray-400" />
                        }
                      </span>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-display-bold text-lg mb-2">Description</h3>
                  <p className="text-sm text-gray-700">{selectedProduct.description}</p>
                  
                  {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-display-bold mb-2">Available Sizes</h4>
                      <div className="flex gap-2 flex-wrap">
                        {selectedProduct.sizes.map((size, index) => (
                          <span key={index} className="px-2 py-1 bg-accent border border-matteblack text-xs rounded">
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3 pt-4 border-t-2 border-matteblack">
                <Button
                  text={selectedProduct.highlight ? "Remove Highlight" : "Add Highlight"}
                  onClick={() => {
                    toggleHighlight(selectedProduct._id, selectedProduct.highlight)
                    setShowProductDetail(false)
                  }}
                  className={`flex items-center gap-2 ${
                    selectedProduct.highlight ? 'bg-gray-600 text-white' : 'bg-yellow-600 text-white'
                  }`}
                >
                  {selectedProduct.highlight ? <FaRegStar /> : <FaStar />}
                </Button>
                
                <Button
                  text={selectedProduct.status === 'active' ? "Deactivate" : "Activate"}
                  onClick={() => {
                    toggleStatus(selectedProduct._id, selectedProduct.status)
                    setShowProductDetail(false)
                  }}
                  className={`flex items-center gap-2 ${
                    selectedProduct.status === 'active' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                  }`}
                >
                  {selectedProduct.status === 'active' ? <FaTimes /> : <FaCheck />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Product Modal */}
      <CreateProducts 
        isOpen={showCreateProduct} 
        onClose={() => setShowCreateProduct(false)} 
        onSuccess={loadProducts} 
      />

      {/* Edit Product Modal */}
      {showEditProduct && selectedProduct && (
        <EditProduct
          product={selectedProduct}
          onUpdate={loadProducts}
          onClose={() => {
            setShowEditProduct(false)
            setSelectedProduct(null)
          }}
        />
      )}
    </div>
  )
}

export default ProductManagement