import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Button from '../../components/Button';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { ShopContext } from '../../context/ShopContext';

const SignUpPage = () => {
  const [currentState, setCurrentState] = useState('Register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [npm, setNpm] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { navigate } = useContext(ShopContext);
  const { register } = useAuth();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^[0-9]{10,13}$/;
    return re.test(phone);
  };

  const validateNpm = (npm) => {
    const re = /^[0-9]{11}$/;
    return re.test(npm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!name || !npm || !email || !phone || !password) {
        throw new Error("Please fill all fields!");
      }

      if (!validateEmail(email)) {
        throw new Error("Invalid email format");
      }

      if (!validateNpm(npm)) {
          throw new Error("Invalid NPM format (must be 11 digits)");
      }

      if (!validatePhone(phone)) {
        throw new Error("Invalid phone number format (10-13 digits)");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      await register(name, npm, email, phone, password);
      
      toast.success('Registration successful! Welcome!');

      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (error) {
      const errorMessage = error.message || error || 'An error occurred during registration';
      toast.error(errorMessage);
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
        Back to Home
      </button>

      <form className='flex flex-col w-full max-w-2xl m-auto mt-15 gap-4 justify-center items-center mb-20' onSubmit={handleSubmit}>
        <div className='inline-flex items-center'>
          <p className='font-atemica font-bold text-3xl'>{currentState}</p>
        </div>

        {/* Input Field */}
        <div className='flex flex-col w-full bg-offwhite p-10 pb-6 mt-5 mb-10 gap-6 rounded-lg border-2 font-display shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] '>
          {currentState === 'Login' ? null : (
            <div className="w-full">
              <label className="block text-sm font-bold mb-2 text-gray-700">Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className='w-full py-3 px-4 border-2 border-black bg-white rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(255,136,45,1)] transition-all' 
                placeholder='ex: Yves Saint Laurent' 
                disabled={isLoading}
              />
            </div>
          )}

          <div className="w-full">
            <label className="block text-sm font-bold mb-2 text-gray-700">NPM</label>
            <input 
              type="text" 
              value={npm} 
              onChange={(e) => setNpm(e.target.value)} 
              className='w-full py-3 px-4 border-2 border-black bg-white rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(255,136,45,1)] transition-all' 
              placeholder='ex: 2208xxx' 
              disabled={isLoading}
            />
          </div>
          {/* <div className="w-full">
            <label className="block text-sm font-bold mb-2 text-gray-700">Major</label>
            <input 
              type="text" 
              value={major} 
              onChange={(e) => setMajor(e.target.value)} 
              className='w-full py-3 px-4 border-2 border-black bg-white rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(255,136,45,1)] transition-all' 
              placeholder='ex: Sistem Informasi' 
            />
          </div> */}
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
            <label className="block text-sm font-bold mb-2 text-gray-700">No Telepon</label>
            <input 
              type="text" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              className='w-full py-3 px-4 border-3 border-black bg-white rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(255,136,45,1)] transition-all' 
              placeholder='08xxxxxxxxxx' 
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
                placeholder='Minimal 6 characters' 
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
            text={isLoading ? 'Registering...' : 'Register'} 
            type="submit"
            className={`w-full text-center py-3 mt-6 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          />

          {/* Toggle Login/Register */}
          <div className="flex gap-1 justify-start font-display text-sm text-gray-500 hover:text-gray-700">
            <span>Already have an account? </span>
            <Link to='/login'>
              <span className="text-accent cursor-pointer hover:text-amber-700 hover:underline font-bold"  onClick={() => setCurrentState(currentState === 'Login' ? 'Register' : 'Login')}>
                Login
              </span>
            </Link> 
          </div>

        </div>
      </form>
    </div>
  );
};

export default SignUpPage;