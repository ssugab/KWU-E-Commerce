import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Button from '../../components/Button';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [currentState, setCurrentState] = useState('Login'); // Login/Signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!email || !password ) {
        throw new Error("Harap isi semua bidang yang wajib diisi!");
      }

      if (!validateEmail(email)) {
        throw new Error("Format email tidak valid");
      }
      if (password.length < 6) {
        throw new Error("Password minimal 6 karakter");
      }

      if (currentState === 'Login') {
        await login(email, password);
        toast.success('Login berhasil!');  
      }
      
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 1000);

    } catch (error) {
      toast.error(error.message || error || 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='p-5'>
      <Toaster position="top-center" />
      <button 
        onClick={() => navigate('/')}
        className="mb-4 font-atemica text-gray-600 hover:text-gray-800 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Kembali ke Beranda
      </button>

      <form className='flex flex-col w-full max-w-2xl m-auto mt-15 gap-4 justify-center items-center mb-20' onSubmit={handleSubmit}>
        <div className='inline-flex items-center'>
          <p className='font-atemica font-bold text-3xl'>{currentState}</p>
        </div>

        {/* Input Field */}
        <div className='flex flex-col w-full bg-offwhite p-10 pb-6 mt-5 mb-10 gap-6 rounded-lg border-2 font-display shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'>

          <div className="w-full">
            <label className="block text-sm font-bold mb-2 text-gray-700">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className='w-full py-3 px-4 border-3 border-black bg-white rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(255,136,45,1)] transition-all' 
              placeholder='example@email.com' 
              disabled={isLoading}
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-bold mb-2 text-gray-700">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className='w-full py-3 px-4 pr-12 border-3 border-black bg-white rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(255,136,45,1)] transition-all' 
                placeholder='6 Characters Minimum' 
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          {currentState === "Login" && (
            <p className="font-display text-sm text-gray-500 cursor-pointer hover:text-gray-700 hover:underline">
              Forgot Password?
            </p>
          )}
       
          <Button 
            text={isLoading ? 'Loading...' : (currentState === 'Login' ? 'Login' : 'Register')} 
            type="submit"
            className={`w-full text-center py-3 ${currentState === 'Register' ? 'mt-6' : ''}`}
            disabled={isLoading}
          />

          {/* Toggle Login/Register */}
          <p className="justify-start font-display text-sm text-gray-500 hover:text-gray-700">
          {currentState === 'Login' ? 'Don\'t have an account? ' : 'Have an account? '}
            <Link to='/register'>
            <span 
              className="text-accent cursor-pointer hover:text-amber-700 hover:underline font-bold"  
              onClick={() => !isLoading && setCurrentState(currentState === 'Login' ? 'Register' : 'Login')}
            >
              {currentState === 'Login' ? 'Register' : 'Login'}
            </span>
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;