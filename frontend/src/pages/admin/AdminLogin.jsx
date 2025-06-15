import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import Button from '../../components/Button'
import { useAuth } from '../../context/AuthContext'

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { adminLogin } = useAuth()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email) {
      newErrors.email = 'Email is required'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      setIsLoading(true)
      try {
        await adminLogin(formData.email, formData.password)
        navigate('/admin/dashboard')
      } catch (error) {
        setErrors({ general: error || 'Invalid admin credentials' })
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-offwhite2 flex items-center justify-center p-4">
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
      <div className="fixed top-10 left-10 w-20 h-20 border-3 border-matteblack rotate-12 opacity-20"></div>
      <div className="fixed top-32 right-16 w-16 h-16 bg-accent border-2 border-matteblack rotate-45 opacity-30"></div>
      <div className="fixed bottom-20 left-20 w-12 h-12 border-3 border-matteblack rotate-[-15deg] opacity-25"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-bricolage text-4xl font-bold text-matteblack mb-2">KWU ADMIN</h1>
          <p className="font-display text-gray-600">Login to Admin Dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-offwhite border-3 border-matteblack p-8 shadow-matteblack">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block font-display-bold text-matteblack mb-2">
                Email Admin
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full pl-10 pr-3 py-3 border-2 border-matteblack font-display focus:outline-none focus:shadow-matteblack-thin focus:-translate-x-0.5 focus:-translate-y-0.5 transition-all disabled:opacity-50"
                  placeholder="admin@kwu.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-red-600 font-display text-sm">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block font-display-bold text-matteblack mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full pl-10 pr-10 py-3 border-2 border-matteblack font-display focus:outline-none focus:shadow-matteblack-thin focus:-translate-x-0.5 focus:-translate-y-0.5 transition-all disabled:opacity-50"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:opacity-50"
                >
                  {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-red-600 font-display text-sm">{errors.password}</p>
              )}
            </div>

            {/* Error Message */}
            {errors.general && (
              <div className="bg-red-100 border-2 border-red-300 p-3">
                <p className="text-red-700 font-display text-sm">{errors.general}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              text={isLoading ? "Logging in..." : "Login as Admin"}
              disabled={isLoading}
              className="w-full text-center"
            />
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-yellow-100 border-2 border-yellow-300">
            <h4 className="font-display-bold text-yellow-800 mb-2">Demo Credentials:</h4>
            <p className="font-display text-yellow-700 text-sm">Email: admin@kwu.com</p>
            <p className="font-display text-yellow-700 text-sm">Password: admin123</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default AdminLogin