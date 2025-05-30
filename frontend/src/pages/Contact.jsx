import React, { useState } from 'react'
import Button from '../components/Button'
import toast from 'react-hot-toast'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    npm: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent successfully');
    // Reset form after successful submission
    setFormData({
      name: '',
      email: '',
      npm: '',
      phone: '',
      message: ''
    });
  };

  return (
    <div className='min-h-screen bg-offwhite2 pb-12'>
      {/* Header Section */}
      <div className="flex justify-center md:justify-start bg-accent">
        <h1 className="font-atemica text-center text-4xl ml-0 md:ml-15 mt-10 mb-8 text-matteblack">Contact Us</h1>
      </div>

      {/* Contact Form Container */}
      <div className='max-w-2xl mx-auto p-6 mt-8 pb-12'>
        <div className='bg-white border-3 border-matteblack rounded-lg shadow-matteblack p-8'>
          {/* Form Header */}
          <div className='text-center mb-8'>
            <h2 className='font-display-bold text-2xl text-matteblack mb-2'>Get In Touch</h2>
            <p className='font-display text-gray-600'>We're like to hear from you! Please fill this form below.</p>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Name Input */}
              <div className='flex flex-col'>
                <label htmlFor="name" className='font-display-bold text-matteblack mb-2'>Full Name</label>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder='Insert your full name'
                  className='py-3 px-4 border-2 border-matteblack bg-white rounded-lg shadow-matteblack-thin focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(255,136,45,1)] transition-all duration-300 font-display'
                  required
                />
              </div>

              {/* Email Input */}
              <div className='flex flex-col'>
                <label htmlFor="email" className='font-display-bold text-matteblack mb-2'>Email</label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder='example@email.com'
                  className='py-3 px-4 border-2 border-matteblack bg-white rounded-lg shadow-matteblack-thin focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(255,136,45,1)] transition-all duration-300 font-display'
                  required
                />
              </div>

              {/* NPM Input */}
              <div className='flex flex-col'>
                <label htmlFor="npm" className='font-display-bold text-matteblack mb-2'>NPM</label>
                <input 
                  type="text" 
                  id="npm"
                  name="npm"
                  value={formData.npm}
                  onChange={handleInputChange}
                  placeholder='Student ID Number'
                  className='py-3 px-4 border-2 border-matteblack bg-white rounded-lg shadow-matteblack-thin focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(255,136,45,1)] transition-all duration-300 font-display'
                />
              </div>

              {/* Phone Input */}
              <div className='flex flex-col'>
                <label htmlFor="phone" className='font-display-bold text-matteblack mb-2'>Phone Number</label>
                <input 
                  type="tel" 
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder='08xxxxxxxxxx'
                  className='py-3 px-4 border-2 border-matteblack bg-white rounded-lg shadow-matteblack-thin focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(255,136,45,1)] transition-all duration-300 font-display'
                />
              </div>
            </div>

            {/* Message Textarea */}
            <div className='flex flex-col'>
              <label htmlFor="message" className='font-display-bold text-matteblack mb-2'>Message</label>
              <textarea 
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="5"
                placeholder='Write your message here...'
                className='py-3 px-4 border-2 border-matteblack bg-white rounded-lg shadow-matteblack-thin focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(255,136,45,1)] transition-all duration-300 font-display resize-vertical'
                required
              />
            </div>

            {/* Submit Button */}
            <div className='flex justify-center pt-4'>
              <button
                type="submit"
                className='bg-accent hover:shadow-matteblack text-matteblack font-display-bold py-3 px-8 border-2 border-matteblack rounded-lg transition-all duration-300 transform hover:translate-x-1 hover:translate-y-1'
              >
                Send Message
              </button>
            </div>
          </form>

          {/* Contact Info */}
          <div className='mt-12 pt-8 border-t-2 border-gray-200'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-center'>
              <div className='flex flex-col items-center'>
                <div className='bg-accent rounded-full p-3 mb-3'>
                  <svg className='w-6 h-6 text-matteblack' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className='font-display-bold text-matteblack mb-1'>Address</h3>
                <p className='font-display text-gray-600 text-sm'>BEM FASILKOM, UPNVJT, Surabaya</p>
              </div>

              <div className='flex flex-col items-center'>
                <div className='bg-accent rounded-full p-3 mb-3'>
                  <svg className='w-6 h-6 text-matteblack' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className='font-display-bold text-matteblack mb-1'>Phone Number</h3>
                <p className='font-display text-gray-600 text-sm'>08xxxxxxxxxx</p>
              </div>

              <div className='flex flex-col items-center'>
                <div className='bg-accent rounded-full p-3 mb-3'>
                  <svg className='w-6 h-6 text-matteblack' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className='font-display-bold text-matteblack mb-1'>Email</h3>
                <p className='font-display text-gray-600 text-sm'>kwu.bem@student.upnjatim.ac.id</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact