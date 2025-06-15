import React, { useContext } from 'react'
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa'
import Button from '../../components/Button'
import { ShopContext } from '../../context/ShopContext'

const ProductManagement = () => {
  const { products } = useContext(ShopContext)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
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
                    <img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover rounded border" />
                  </td>
                  <td className="font-display py-4">{product.name}</td>
                  <td className="font-display py-4">{product.category}</td>
                  <td className="font-display py-4">{formatCurrency(product.price)}</td>
                  <td className="font-display py-4">{product.stock || 'N/A'}</td>
                  <td className="py-4">
                    <span className="px-3 py-1 rounded border font-display text-xs bg-green-200 text-green-800 border-green-300">
                      Active
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
}

export default ProductManagement