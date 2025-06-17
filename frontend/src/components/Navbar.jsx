import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {

  const { getCartCount, navigate } = useContext(ShopContext);
  const { isAuthenticated, logout, user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [visible, setVisible] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logout successful');
    setTimeout (() => {
      navigate('/');
      window.location.reload();
    }, 2000);
  };

  useEffect(() => { // untuk menutup sidebar menu saat ukuran layar lebih besar dari md screen
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint in Tailwind
        setVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  return (
    <div className='fixed top-0 left-0 right-0 flex items-center justify-between py-5 px-5 md:px-0 border-b-3 bg-offwhite text-matteblack z-50 w-full'>
      {/* Left Navigation */}
      <div className='flex-1 md:flex hidden justify-start overflow-hidden'>
        <ul className="flex gap-4 lg:gap-10 pl-4 lg:pl-10 font-atemica whitespace-nowrap overflow-hidden">
          {[
            { path: '/', label: 'Home' },
            { path: '/catalog', label: 'Catalog' },
            { path: '/contact', label: 'Contact' }
          ].map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `relative pb-1 text-sm hover:text-accent transition-colors duration-200 ${
                    isActive ? 'text-accent after:scale-x-100' : 'after:scale-x-0'
                  } after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2.5px] after:bg-accent after:transition-all after:duration-300  `
                }>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Logo */}
      <div className='flex-1 justify-center'>
        <NavLink to='/'>
          <img src={assets.kwulogo} className='max-w-[140px] sm:ml-0 md:mx-auto hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[4px] hover:-translate-y-[4px] transition-all duration-300' alt="KWU Logo" />
        </NavLink>
      </div>

      {/* Right Navigation */}
      <div className='flex-1 flex justify-end'>
        
        <ul className="md:flex hidden gap-10 pr-10">
          <li>
          {isAdmin && (
            <NavLink 
            to='/admin/dashboard' 
            className='flex items-center gap-2 px-3 border-2 border-matteblack rounded-sm bg-offwhite hover:bg-accent hover:text-matteblack hover:shadow-matteblack transition-all duration-200 font-display text-sm'
          >
            <span className='font-atemica pt-1'>Admin Dashboard</span>
          </NavLink>
          )}
          </li>

          <li>
            {isAuthenticated && (
            <NavLink
              to='/cart'
              className={({ isActive }) => 
                `relative pb-1 text-sm hover:text-accent 
              ${isActive ? 'text-accent after:scale-x-100' : 'after:scale-x-0'}
              after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2.5px] after:bg-accent after:transition-all after:duration-300 `
              }>
              <img src={assets.shopping_bag_icon} className='w-6 pb-0.5 hover:scale-110 transition-all duration-300' alt="" />
              <span className='absolute -right-3 -top-2 w-4 h-4 rounded-full bg-accent text-offwhite text-xs flex items-center justify-center'>
                {getCartCount()}
              </span>
            </NavLink>
            
            )}
          </li>

            {/* Icon Profile After Login */}
            <div className='group relative'>
              {isAuthenticated ? (
                <div>
                  <img className='w-5 cursor-pointer hover:scale-110 transition-all duration-300' src={assets.profile} alt="profile" />
                  <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                    <div className='flex flex-col gap-2 w-36 py-3 px-5 font-atemica bg-offwhite text-matteblack border-2 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded transition ease-in-out duration-300'> 
                      <NavLink to='/profile' className='cursor-pointer hover:text-accent'>My Profile</NavLink>
                      <NavLink to='/orders' className='cursor-pointer hover:text-accent'>Orders</NavLink>
                      <button onClick={handleLogout} className='cursor-pointer hover:text-accent text-left'>Logout</button>
                    </div>
                  </div>
                </div>
              ) : (
                <NavLink
                  to='/login'
                  className={({ isActive }) => 
                    `relative pb-1 text-sm hover:text-accent 
                    ${isActive ? 'text-accent after:scale-x-100' : 'after:scale-x-0'} 
                    after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2.5px] after:bg-accent after:transition-all after:duration-300 `
                  }>
                  LOGIN
                </NavLink>
              )}
            </div>

        </ul>
        {/* Menu Icon & Cart on small screen */}
        <div className='flex items-center gap-7'>
          {isAuthenticated ? (
            <NavLink
            to='/cart'
            onClick={()=> setVisible(false)}
            className={`relative text-sm sm:block md:hidden hover:text-accent`}
            >
                  <img src={assets.shopping_bag_icon} className='w-6 hover:scale-110 transition-all duration-300' alt="" />
                  <span className='absolute -right-2 -top-1 w-4 h-4 rounded-full bg-accent text-offwhite text-xs flex items-center justify-center'>
                    {getCartCount()}
                  </span>
            </NavLink>
          ) : (
            <div></div>
          )}
            <img onClick={()=>setVisible(true)} src={assets.menu_icon} className='w-7 mr-4.5 cursor-pointer sm:block md:hidden' alt="menu icon" />
        </div>    
      </div>

      {/* Sidebar Menu for Small screen*/}
      
        {/* Background for transition */}
        <div className={`absolute top-0 right-0 bottom-0 h-screen w-full bg-accent transition-opacity duration-700 pointer-events-none ${visible ? 'opacity-100' : 'opacity-0'}`}>
        </div>

      <div className={`absolute top-0 right-0 bottom-0 h-screen overflow-hidden bg-offwhite transition-all duration-700 ease-in-out z-50 ${visible ? 'w-full' : 'w-0'}`}>
          <div className='flex flex-col text-matteblack'>
            <div className='flex items-center justify-between p-6 px-8'>
              {/* Return Button - Left Side */}
              <img onClick={()=> setVisible(false)} src={assets.return_icon} className='h-4.5 cursor-pointer' alt="return icon" />
              
              {/* Cart & Profile - Right Side */}
              <div className='flex items-center gap-7'>
                {isAdmin && (
                  <NavLink 
                  to='/admin/dashboard' 
                  className='flex items-center gap-2 px-3 border-2 border-matteblack rounded-sm bg-offwhite hover:bg-accent hover:text-matteblack hover:shadow-matteblack transition-all duration-200 font-display text-sm'
                >
                  <span className='font-atemica pt-1'>Admin Dashboard</span>
                </NavLink>
                )}
                {isAuthenticated ? (
                <NavLink
                  to='/cart'
                  onClick={()=> setVisible(false)}
                  className={`relative text-sm hover:text-accent`}
                >
                  <img src={assets.shopping_bag_icon} className='w-6 hover:scale-110 transition-all duration-300' alt="" />
                  <span className='absolute -right-2 -top-1 w-4 h-4 rounded-full bg-accent text-offwhite text-xs flex items-center justify-center'>
                    {getCartCount()}
                  </span>
                </NavLink>
                ): (
                  <div></div>
                )}
                {isAuthenticated ? (
                  <NavLink to='/profile' >
                    <img onClick={()=> setVisible(false)} src={assets.profile} className='w-5 cursor-pointer hover:scale-110 transition-all duration-300' alt="profile" />
                  </NavLink>
                ) : (
                  <NavLink
                  to='/login'
                  className={({ isActive }) => 
                    `relative text-sm hover:text-accent 
                    ${isActive ? 'text-accent after:scale-x-100' : 'after:scale-x-0'} 
                    after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2.5px] after:bg-accent after:transition-all after:duration-300 `
                  }>
                  LOGIN
                </NavLink>
                )}
                
              </div>
            </div>

          <div className="flex flex-col gap-4 p-4 border-t-3">
            {[
              { path: '/', label: 'Home' },
              { path: '/catalog', label: 'Catalog' },
              { path: '/contact', label: 'Contact' }
            ].map((item) => (
              <div key={item.path} className='w-full border-b-3 font-atemica hover:bg-accent transition-colors duration-300' onClick={()=>setVisible(false)}>
                <NavLink
                  to={item.path}
                  className="block py-2 pl-6 hover:translate-x-[4px] transition-all duration-300">
                  {item.label}
                </NavLink>
              </div>
            ))}
          </div>
          </div>
          
      </div>

    </div>
  );
};

export default Navbar;