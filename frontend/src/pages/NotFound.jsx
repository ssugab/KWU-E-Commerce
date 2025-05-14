import React from 'react'
import { NavLink } from 'react-router-dom'
import Button from '../components/Button'

const NotFound = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-offwhite'>
      <h1 className='text-6xl font-bold text-accent mb-4'>404</h1>
      <h2 className='text-2xl font-display mb-6'>Halaman Tidak Ditemukan</h2>
      <p className='text-gray-600 mb-8 text-center max-w-md'>
        Maaf, halaman yang Anda cari tidak dapat ditemukan. 
        Silakan kembali ke halaman utama atau coba periksa URL yang Anda masukkan.
      </p>
      <Button 
        text="Kembali ke Beranda" 
        to="/"
        className="mt-4"
      />
    </div>
  )
}

export default NotFound