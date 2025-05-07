import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [currentState, setCurrentState] = useState('Sign Up'); // Login/Signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^[0-9]{10,13}$/;
    return re.test(phone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password || (currentState === "Sign Up" && !name)) {
      setError("Harap isi semua bidang yang wajib diisi");
      return;
    }

    if (!validateEmail(email)) {
      setError("Format email tidak valid");
      return;
    }

    if (currentState === "Sign Up" && phone && !validatePhone(phone)) {
      setError("Format nomor telepon tidak valid (10-13 digit)");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    // Simulasi proses login/register
    console.log({ email, password, name, phone });
    setSuccess(currentState === 'Login' ? 'Login berhasil!' : 'Registrasi berhasil!');
    
    // Redirect setelah 2 detik
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <div className='p-5'>
      <button 
        onClick={() => navigate('/')}
        className="mb-4 font-atemica text-gray-600 hover:text-gray-800 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Kembali ke Beranda
      </button>

      <form className='flex flex-col w-full max-w-2xl m-auto mt-5 gap-4 justify-center items-center mb-20' onSubmit={handleSubmit}>
        <div className='inline-flex items-center'>
          <p className='font-atemica font-bold text-3xl'>{currentState}</p>
        </div>

        {/* Toggle Login/Sign Up */}
        <p className="block ml-[-490px] font-display text-sm cursor-pointer text-gray-500 hover:text-gray-700" onClick={() => setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login')}>
          {currentState === 'Login' ? 'Belum punya akun? ' : 'Sudah punya akun? '}
          <span className="text-accent hover:text-amber-700 font-bold">
            {currentState === 'Login' ? 'Sign Up' : 'Login'}
          </span>
        </p>

        {/* Error Message */}
        {error && (
          <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="w-full bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{success}</span>
          </div>
        )}

        {/* Input Field */}
        <div className='flex flex-col w-full bg-offwhite p-10 pb-6 gap-8 rounded-lg border-2 border-accent font-display shadow-xl'>
          {currentState === 'Login' ? null : (
            <div className="w-full">
              <label className="block text-sm font-bold mb-2 text-gray-700">Nama</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className='w-full py-3 px-4 border-2 border-black bg-white rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(255,136,45,1)] transition-all' 
                placeholder='Masukkan nama lengkap' 
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
              placeholder='Minimal 6 karakter' 
            />
          </div>
          
          {currentState === "Login" && (
            <p className="font-display text-sm text-gray-500 cursor-pointer hover:text-gray-700 hover:underline pt-4">
              Lupa Password?
            </p>
          )}
       
          <button 
            type="submit" 
            className="mt-5 w-full bg-accent hover:bg-amber-600 border-2 border-black text-white py-3 px-4 rounded-lg hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            {currentState === 'Login' ? 'Login' : 'Sign Up'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;