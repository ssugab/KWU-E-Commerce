import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import toast, { Toaster } from 'react-hot-toast';
import authService from '../../services/authService';

const LoginPage = () => {
  const navigate = useNavigate();
  const [currentState, setCurrentState] = useState('Sign Up'); // Login/Signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (!email || !password || !phone || (currentState === "Sign Up" && !name)) {
        throw new Error("Harap isi semua bidang yang wajib diisi!");
      }

      if (!validateEmail(email)) {
        throw new Error("Format email tidak valid");
      }

      if (phone && !validatePhone(phone)) {
        throw new Error("Format nomor telepon tidak valid (10-13 digit)");
      }

      if (password.length < 6) {
        throw new Error("Password minimal 6 karakter");
      }

      if (currentState === 'Login') {
        const response = await authService.login(email, password);
        toast.success('Login berhasil!');
        setSuccess('Login berhasil!');
      } else {
        const response = await authService.signup(name, email, phone, password);
        toast.success('Registrasi berhasil!');
        setSuccess('Registrasi berhasil!');
      }

      // Redirect setelah 2 detik
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      setError(error.message);
      toast.error(error.message);
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
        <div className='flex flex-col w-full bg-offwhite p-10 pb-6 mt-5 mb-10 gap-6 rounded-lg border-2 font-display shadow-xl'>
          {currentState === 'Login' ? null : (
            <div className="w-full">
              <label className="block text-sm font-bold mb-2 text-gray-700">Nama</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className='w-full py-3 px-4 border-2 border-black bg-white rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(255,136,45,1)] transition-all' 
                placeholder='Masukkan nama lengkap' 
                disabled={isLoading}
              />
            </div>
          )}
          <div className="w-full">
            <label className="block text-sm font-bold mb-2 text-gray-700">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className='w-full py-3 px-4 border-3 border-black bg-white rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(255,136,45,1)] transition-all' 
              placeholder='contoh@email.com' 
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
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className='w-full py-3 px-4 border-3 border-black bg-white rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(255,136,45,1)] transition-all' 
              placeholder='Minimal 6 karakter' 
              disabled={isLoading}
            />
          </div>
          
          {currentState === "Login" && (
            <p className="font-display text-sm text-gray-500 cursor-pointer hover:text-gray-700 hover:underline">
              Lupa Password?
            </p>
          )}
       
          {/* <button  Button manual
            type="submit" 
            className={`w-full bg-accent hover:bg-amber-600 border-2 border-black text-offmatte py-3 px-4 rounded-lg hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all
          ${currentState === 'Sign Up' ? 'mt-4' : ''}`}>
            {currentState === 'Login' ? 'Login' : 'Sign Up'}
          </button>} */}

          <Button 
            text={isLoading ? 'Loading...' : (currentState === 'Login' ? 'Login' : 'Sign Up')} 
            type="submit"
            className={`w-full text-center py-3 ${currentState === 'Sign Up' ? 'mt-6' : ''}`}
            disabled={isLoading}
          />

          {/* Toggle Login/Sign Up */}
          <p className="justify-start font-display text-sm text-gray-500 hover:text-gray-700">
            {currentState === 'Login' ? 'Belum punya akun? ' : 'Sudah punya akun? '}
            <span 
              className="text-accent cursor-pointer hover:text-amber-700 hover:underline font-bold"  
              onClick={() => !isLoading && setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login')}
            >
              {currentState === 'Login' ? 'Sign Up' : 'Login'}
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;