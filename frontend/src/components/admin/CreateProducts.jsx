import React, { useState, useEffect } from 'react'
import { API_ENDPOINTS } from '../../config/api'
import { FaTimes, FaUpload, FaTrash, FaPlus, FaSave } from 'react-icons/fa'
import Button from '../Button'
import toast from 'react-hot-toast'

const CreateProducts = ({ isOpen, onClose, onSuccess }) => {

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    highlight: false,
    isHero: false,
  });

  const [ sizes, setSizes ] = useState([]);
  const [ currentSize, setCurrentSize ] = useState('');
  const [ images, setImages] = useState([]);
  const [ imagePreview, setImagePreview ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ heroCount, setHeroCount ] = useState(0);

  const categories = [
    'Shirts',
    'T-Shirts',
    'Accessories',

  ]

  // Fetch current hero products count when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchHeroCount();
    }
  }, [isOpen]);

  const fetchHeroCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.CATALOG.LIST, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        const heroProducts = data.data.filter(product => product.isHero);
        setHeroCount(heroProducts.length);
      }
    } catch (error) {
      console.error('Error fetching hero count:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Check hero limit when trying to enable isHero
    if (name === 'isHero' && checked && heroCount >= 5) {
      toast.error('Maksimal 5 produk yang bisa ditambahkan ke Hero Section!');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const addSize = () => {
    if (currentSize.trim() && !sizes.includes(currentSize.trim())) {
      setSizes(prev => [...prev, currentSize.trim()]);
      setCurrentSize('');
    }
  }

  const removeSize = (sizeToRemove) => {
    setSizes(prev => prev.filter(size => size !== sizeToRemove));
  }

  const handleImageUpload = (e) => {

    const files = Array.from(e.target.files);

    if(files.length > 4 + images.length) {
      toast.error('You can only upload up to 4 images')
      return
    }

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`File ${file.name} is too large (max 5MB)`)
          return
        }

        setImages(prev => [...prev, file])
        
        // Create preview
        const reader = new FileReader()
        reader.onload = (event) => {
          setImagePreview(prev => [...prev, {
            file: file,
            url: event.target.result,
            name: file.name
          }])
        }
        reader.readAsDataURL(file)
      } else {
        toast.error(`${file.name} is not a valid image file`)
      }
    })
  }

  // Handle remove image
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreview(prev => prev.filter((_, i) => i !== index))
  }

  // Form validation
  const validateForm = () => {
    const errors = []
    
    if (!formData.name.trim()) errors.push('Product name is required')
    if (!formData.description.trim()) errors.push('Description is required')
    if (!formData.price || parseFloat(formData.price) <= 0) errors.push('Valid price is required')
    if (!formData.category) errors.push('Category is required')
    if (!formData.stock || parseInt(formData.stock) < 0) errors.push('Valid stock quantity is required')
    if (images.length === 0) errors.push('At least one image is required')
    
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error))
      return false
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      const submitData = new FormData()
      
      submitData.append('name', formData.name.trim())
      submitData.append('description', formData.description.trim())
      submitData.append('price', formData.price)
      submitData.append('category', formData.category)
      submitData.append('stock', formData.stock)
      submitData.append('highlight', formData.highlight)
      submitData.append('isHero', formData.isHero)
      submitData.append('sizes', JSON.stringify(sizes))
      
      images.forEach((image, index) => {
        submitData.append(`image${index + 1}`, image)
      })
      
      const token = localStorage.getItem('token')
      const response = await fetch(API_ENDPOINTS.CATALOG.CREATE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type for FormData, browser will set it
        },
        body: submitData
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('Product created successfully!')
        resetForm()
        onSuccess() // Refresh product list
        onClose() // Close modal
      } else {
        toast.error(data.message || 'Failed to create product')
      }
      
    } catch (error) {
      console.error('Error creating product:', error)
      toast.error('Error creating product')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      highlight: false,
      isHero: false,
    })
    setSizes([])
    setCurrentSize('')
    setImages([])
    setImagePreview([])
  }

  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-offwhite border-3 border-matteblack max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-offwhite border-b-2 border-matteblack p-4 flex justify-between items-center">
          <h2 className="font-bricolage text-xl font-bold">Create New Product</h2>
          <button
            onClick={onClose}
            className="p-2 bg-red-200 border-2 border-matteblack hover:shadow-matteblack-thin transition-all"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-display-bold text-sm mb-2 block">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-matteblack font-display"
                placeholder="Enter product name..."
                maxLength={100}
              />
            </div>

            <div>
              <label className="font-display-bold text-sm mb-2 block">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-matteblack font-display"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-display-bold text-sm mb-2 block">Price (IDR) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-matteblack font-display"
                placeholder="0"
                min="0"
                step="1000"
              />
            </div>

            <div>
              <label className="font-display-bold text-sm mb-2 block">Stock Quantity *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-matteblack font-display"
                placeholder="0"
                min="0"
              />
            </div>
          </div>
      {/* Description */}
      <div>
            <label className="font-display-bold text-sm mb-2 block">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-3 border-2 border-matteblack font-display h-24"
              placeholder="Enter product description..."
              maxLength={500}
            />
            <p className="text-xs text-gray-600 mt-1">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Sizes */}
          <div>
            <label className="font-display-bold text-sm mb-2 block">Available Sizes (Optional)</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={currentSize}
                onChange={(e) => setCurrentSize(e.target.value)}
                className="flex-1 p-3 border-2 border-matteblack font-display"
                placeholder="Enter size (e.g., S, M, L, XL)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
              />
              <Button
                type="button"
                onClick={addSize}
                text="Add"
                className="bg-green-600 text-white flex items-center gap-2"
              >
                <FaPlus className="text-xs" />
              </Button>
            </div>
            
            {sizes.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {sizes.map((size, index) => (
                  <span 
                    key={index}
                    className="bg-accent border-2 border-matteblack px-3 py-1 text-sm flex items-center gap-2"
                  >
                    {size}
                    <button
                      type="button"
                      onClick={() => removeSize(size)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="font-display-bold text-sm mb-2 block">Product Images * (Max 4)</label>
            <div className="border-2 border-dashed border-matteblack p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <FaUpload className="text-2xl text-gray-600" />
                <p className="font-display text-gray-600">
                  Click to upload images (JPG, PNG - Max 5MB each)
                </p>
              </label>
            </div>

            {/* Image Preview */}
            {imagePreview.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                {imagePreview.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img.url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover border-2 border-matteblack"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full text-xs hover:bg-red-700"
                    >
                      <FaTrash />
                    </button>
                    <p className="text-xs font-display mt-1 truncate">{img.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="highlight"
                checked={formData.highlight}
                onChange={handleInputChange}
                className="w-4 h-4"
                id="highlight"
              />
              <label htmlFor="highlight" className="font-display">
                Highlight this product (Featured on homepage)
              </label>
            </div>
            
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isHero"
                checked={formData.isHero}
                onChange={handleInputChange}
                className="w-4 h-4"
                id="isHero"
                disabled={heroCount >= 5 && !formData.isHero}
              />
              <label htmlFor="isHero" className={`font-display ${heroCount >= 5 && !formData.isHero ? 'text-gray-400' : ''}`}>
                🏠 Add to Hero Section (Homepage slider)
                <span className={`ml-2 text-sm ${heroCount >= 5 ? 'text-red-600' : 'text-gray-600'}`}>
                  ({heroCount}/5)
                </span>
              </label>
            </div>
            {heroCount >= 5 && !formData.isHero && (
              <p className="text-red-600 text-sm mt-1">
                ⚠️ Hero section sudah penuh. Hapus produk hero lain terlebih dahulu.
              </p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t-2 border-matteblack">
            <Button
              type="button"
              text="Cancel"
              onClick={onClose}
              className="bg-gray-600 text-white"
            />
            <Button
              type="submit"
              disabled={loading}
              text={loading ? "Creating..." : "Create Product"}
              className={`flex items-center gap-2 ${loading ? 'bg-gray-400' : 'bg-green-600'} text-white`}
            >
              <FaSave />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateProducts