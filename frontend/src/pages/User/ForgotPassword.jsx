import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: email, 2: reset code + new password
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSendResetCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!email) {
        throw new Error("Please enter your email");
      }

      if (!validateEmail(email)) {
        throw new Error("Please enter a valid email");
      }

      const response = await axios.post(API_ENDPOINTS.USER.FORGOT_PASSWORD, {
        email: email
      });

      if (response.data.success) {
        toast.success('Reset code sent! Check the console for now.');
        console.log('Reset Code:', response.data.resetToken); // For development
        setStep(2);
      } else {
        throw new Error(response.data.message);
      }

    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to send reset code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!resetCode || !newPassword) {
        throw new Error("Please fill all fields");
      }

      if (newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      const response = await axios.post(API_ENDPOINTS.USER.RESET_PASSWORD, {
        email: email,
        resetToken: resetCode,
        newPassword: newPassword
      });

      if (response.data.success) {
        toast.success('Password reset successfully! You can now login.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        throw new Error(response.data.message);
      }

    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='p-5 min-h-screen bg-offwhite2'>
      <Toaster position="top-center" />
      
      {/* Back Button */}
      <Link 
        to="/login"
        className="mb-4 font-atemica text-gray-600 hover:text-gray-800 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Login
      </Link>

      <div className='flex flex-col w-full max-w-md m-auto mt-10 gap-6 justify-center items-center'>
        
        {/* Header */}
        <div className='text-center'>
          <h1 className='font-atemica font-bold text-3xl mb-2'>Forgot Password</h1>
          <p className='font-display text-gray-600'>
            {step === 1 ? 'Enter your email to receive a reset code' : 'Enter the reset code and your new password'}
          </p>
        </div>

        {/* Step 1: Email Input */}
        {step === 1 && (
          <form className='w-full space-y-4' onSubmit={handleSendResetCode}>
            <div className="w-full">
              <label className="block text-sm font-bold mb-2 text-gray-700">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className='w-full py-3 px-4 border-3 border-black bg-white rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(255,136,45,1)] transition-all' 
                placeholder='Enter your email' 
                disabled={isLoading}
              />
            </div>

            <Button 
              type="submit" 
              text={isLoading ? 'Sending...' : 'Send Reset Code'}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Sending...' : 'Send Reset Code'}
            </Button>
          </form>
        )}

        {/* Step 2: Reset Code + New Password */}
        {step === 2 && (
          <form className='w-full space-y-4' onSubmit={handleResetPassword}>
            <div className="w-full">
              <label className="block text-sm font-bold mb-2 text-gray-700">Reset Code</label>
              <input 
                type="text" 
                value={resetCode} 
                onChange={(e) => setResetCode(e.target.value)} 
                className='w-full py-3 px-4 border-3 border-black bg-white rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(255,136,45,1)] transition-all' 
                placeholder='Enter 6-digit code' 
                disabled={isLoading}
                maxLength={6}
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-bold mb-2 text-gray-700">New Password</label>
              <input 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                className='w-full py-3 px-4 border-3 border-black bg-white rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(255,136,45,1)] transition-all' 
                placeholder='Enter new password (min 6 characters)' 
                disabled={isLoading}
              />
            </div>

            <Button 
              type="submit" 
              text={isLoading ? 'Resetting...' : 'Reset Password'}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center text-sm text-gray-600 hover:text-gray-800 underline"
              disabled={isLoading}
            >
              Back to email step
            </button>
          </form>
        )}

        {/* Login Link */}
        <div className='text-center'>
          <p className='font-display text-sm text-gray-600'>
            Remember your password?{' '}
            <Link to="/login" className='text-accent hover:underline font-bold'>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 