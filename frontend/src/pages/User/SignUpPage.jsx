import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import toast, { Toaster } from 'react-hot-toast';
import authService from '../../services/authService';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [currentState, setCurrentState] = useState('Sign Up'); // Login/Signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [npm, setNpm] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^[0-9]{10,13}$/;
    return re.test(phone);
  };

  const validateNpm = (npm) => {
    const re = /^[0-9]{10}$/;
    return re.test(npm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password || !phone || (currentState === "Sign Up" && !name)) {
      setError("Harap isi semua bidang yang wajib diisi!");
      toast.error("Harap isi semua kolom!");
      return;
    }

    if (!validateEmail(email)) {
      setError("Format email tidak valid");
      toast.error("Format email tidak valid");
      return;
    }
    if (!validateNpm(npm)) {
      throw new Error("Format NPM tidak valid");
    }

    if (phone && !validatePhone(phone)) {
      setError("Format nomor telepon tidak valid (10-13 digit)");
      toast.error("Format nomor telepon tidak valid (10-13 digit)");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      toast.error("Password minimal 6 karakter");
      return;
    }

    // Simulasi proses login/register
    console.log({ email, password, name, phone });
    setSuccess(currentState === 'Login' ? 'Login berhasil!' : 'Registrasi berhasil!');
    toast.success(currentState === 'Login' ? 'Login berhasil!' : 'Registrasi berhasil!');
    
    // Redirect setelah 2 detik
    setTimeout(() => {
      navigate('/');
    }, 2000);
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
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-bold mb-2 text-gray-700">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className='w-full py-3 px-4 border-3 border-black bg-white rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(255,136,45,1)] transition-all' 
              placeholder='Minimal 6 characters' 
            />
          </div>
          
          {currentState === "Login" && (
            <p className="font-display text-sm text-gray-500 cursor-pointer hover:text-gray-700 hover:underline">
              Forgot Password?
            </p>
          )}

          <Button 
            text={currentState === 'Login' ? 'Login' : 'Sign Up'} 
            type="submit"
            className={`w-full text-center py-3 ${currentState === 'Sign Up' ? 'mt-6' : ''}`}
          />

          {/* Toggle Login/Sign Up */}
          <p className="flex gap-1 justify-start font-display text-sm text-gray-500 hover:text-gray-700">
            <p>Already have an account? </p>
            <Link to='/login'>
              <span className="text-accent cursor-pointer hover:text-amber-700 hover:underline font-bold"  onClick={() => setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login')}>
                Login
              </span>
            </Link> 
          </p>

        </div>
      </form>
    </div>
  );
};

export default SignUpPage;