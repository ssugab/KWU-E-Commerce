import React, { useState } from 'react'
import Button from './Button'

const CheckoutForm = ({ onSubmit, isProcessing = false }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    streetAddress: '',
    city: '',
    postalCode: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error ketika user mulai mengetik
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Nama depan wajib diisi';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Nama belakang wajib diisi';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor telepon wajib diisi';
    } else if (!/^[0-9+\-\s()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Format nomor telepon tidak valid';
    }

    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = 'Alamat jalan wajib diisi';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Kota wajib diisi';
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Kode pos wajib diisi';
    } else if (!/^[0-9]{5}$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Kode pos harus 5 digit';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const inputClass = (fieldName) => `
    w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 font-medium
    ${errors[fieldName] 
      ? 'border-red-500 focus:border-red-500 bg-red-50' 
      : 'border-gray-300 focus:border-accent bg-white'
    }
    focus:outline-none focus:ring-2 focus:ring-accent/20
  `;

  return (
    <div className='bg-white border-2 border-gray-200 rounded-lg p-6'>
      <h2 className='font-atemica text-xl mb-6 text-gray-900'>👤 Informasi Pelanggan</h2>
      
      <form onSubmit={handleSubmit} className='space-y-6'>
        
        {/* Nama */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label htmlFor="firstName" className='block text-sm font-medium text-gray-700 mb-2'>
              Nama Depan *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={inputClass('firstName')}
              placeholder="Masukkan nama depan"
            />
            {errors.firstName && (
              <p className='text-red-500 text-sm mt-1'>{errors.firstName}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="lastName" className='block text-sm font-medium text-gray-700 mb-2'>
              Nama Belakang *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={inputClass('lastName')}
              placeholder="Masukkan nama belakang"
            />
            {errors.lastName && (
              <p className='text-red-500 text-sm mt-1'>{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email & Phone */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-2'>
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={inputClass('email')}
              placeholder="contoh@email.com"
            />
            {errors.email && (
              <p className='text-red-500 text-sm mt-1'>{errors.email}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="phone" className='block text-sm font-medium text-gray-700 mb-2'>
              Nomor Telepon *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={inputClass('phone')}
              placeholder="08123456789"
            />
            {errors.phone && (
              <p className='text-red-500 text-sm mt-1'>{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Alamat */}
        <div>
          <label htmlFor="streetAddress" className='block text-sm font-medium text-gray-700 mb-2'>
            Alamat Jalan *
          </label>
          <input
            type="text"
            id="streetAddress"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleInputChange}
            className={inputClass('streetAddress')}
            placeholder="Jl. Contoh No. 123"
          />
          {errors.streetAddress && (
            <p className='text-red-500 text-sm mt-1'>{errors.streetAddress}</p>
          )}
        </div>

        {/* Kota & Kode Pos */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label htmlFor="city" className='block text-sm font-medium text-gray-700 mb-2'>
              Kota *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={inputClass('city')}
              placeholder="Surabaya"
            />
            {errors.city && (
              <p className='text-red-500 text-sm mt-1'>{errors.city}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="postalCode" className='block text-sm font-medium text-gray-700 mb-2'>
              Kode Pos *
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              className={inputClass('postalCode')}
              placeholder="60119"
              maxLength="5"
            />
            {errors.postalCode && (
              <p className='text-red-500 text-sm mt-1'>{errors.postalCode}</p>
            )}
          </div>
        </div>

        {/* Catatan */}
        <div>
          <label htmlFor="notes" className='block text-sm font-medium text-gray-700 mb-2'>
            Catatan Tambahan (Opsional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows="3"
            className={inputClass('notes')}
            placeholder="Catatan khusus untuk pesanan Anda..."
          />
        </div>

        {/* Submit Button */}
        <div className='pt-4 border-t border-gray-200'>
          <Button
            type="submit"
            text={isProcessing ? "⏳ Memproses..." : "💳 Lanjut ke Pembayaran"}
            className={`w-full border-accent font-medium py-3 text-base transition-all duration-200 ${
              isProcessing 
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-accent hover:bg-accent/90 text-matteblack hover:transform hover:scale-[1.02]'
            }`}
            disabled={isProcessing}
          />
          {isProcessing && (
            <p className='text-center text-sm text-gray-600 mt-2'>
              Sedang memproses pesanan Anda, mohon tunggu...
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default CheckoutForm 