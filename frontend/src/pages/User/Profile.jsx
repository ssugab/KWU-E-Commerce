import React, { useContext, useState, useEffect } from 'react'
import authService from '../../services/authService';
import { ShopContext } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import { assets } from '../../assets/assets';

const Profile = () => {
  const { getUser } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser().then(setUser);
  }, [getUser]);
  
  console.log(user);
  
  return (
    <div className='flex flex-col h-screen gap-5'>
      <h1 className='text-2xl font-atemica justify-start p-10'>My Profile</h1>
      <div className='flex flex-col w-1/2 md:mx-auto mx-5 justify-center bg-accent border-3 p-7 gap-5 rounded-lg hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[4px] hover:-translate-y-[4px] transition-all duration-300'>
        <div className=''>Name: {user?.name}</div>
        <div className=''>Email: {user?.email}</div>
        <div className=''>Phone Number</div>
      </div>

      <div className='flex flex-col w-1/2 md:mx-auto mx-5 justify-center bg-accent border-3 p-7 gap-5 rounded-lg hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[4px] hover:-translate-y-[4px] transition-all duration-300'>
        <div className=''>Change Password</div>
      </div>

      <div className='flex  w-1/2 md:mx-auto mx-5 bg-accent border-3 p-7 gap-5 rounded-lg hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-red-500 hover:-translate-x-[4px] hover:-translate-y-[4px] transition-all duration-300'>
        <div className=''>Logout</div>
        <img src={assets.logout} alt="" />
      </div>
    </div>
  )
}

export default Profile