import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';

const Navbar = () => {

  const [visible, setVisible] = useState(false);
  const [currentState, setCurrentState] = useState('');

  useEffect(() => { // untuk menutup sidebar menu saat ukuran layar lebih besar dari md screen
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint di Tailwind
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
    <div className='flex items-center justify-between py-5 border-b-3 bg-offwhite text-matteblack sticky top-0 z-50'>
      {/* Left Navigation */}
      <div className='flex-1 md:flex hidden justify-start'>
        <ul className="flex gap-10 pl-10 font-atemica whitespace-nowrap">
          {[
            { path: '/', label: 'Home' },
            { path: '/catalog', label: 'Catalog' },
            { path: '/accessories', label: 'Accessories' },
            { path: '/contact', label: 'Contact' },
            { path: '/best-seller', label: 'Best Seller' }
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

        {/*  BG accent on active menu navbar
        <NavLink
          to={item.path}
          className={({ isActive }) => 
                    `relative pb-1 text-sm hover:text-accent transition-colors duration-200 ${
                      isActive ? 'bg-accent after:scale-x-100 p-4 rounded-lg' : 'after:scale-x-0'
                    } after:absolute after:w-full after:bg-accent after:transition-all after:duration-300  `
                  }>
                {item.label}
                </NavLink> 
        */}

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
            <NavLink
              to='/cart'
              className={({ isActive }) => 
                `relative pb-1 text-sm hover:text-accent 
              ${isActive ? 'text-accent after:scale-x-100' : 'after:scale-x-0'}
              after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2.5px] after:bg-accent after:transition-all after:duration-300 `
              }>
              <img src={assets.shopping_bag_icon} className='w-6 pb-0.5 hover:scale-110 transition-all duration-300' alt="" />
              <span className='absolute -right-3 -top-2 w-4 h-4 rounded-full bg-accent text-white text-xs flex items-center justify-center'>
                0
              </span>
            </NavLink>
          </li>
          
            {/* Icon Profile After Login --------------- dan dropdown menu profil */}
            <div className='group relative'>
              {currentState === 'Login' ? (
                <div>
                  <img className='w-5 cursor-pointer hover:scale-110 transition-all duration-300' src={assets.profile} alt="profile" />
                  <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                    <div className='flex flex-col gap-2 w-36 py-3 px-5 font-atemica bg-offwhite text-matteblack border-2 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded '> 
                      <NavLink to='/profile' className='cursor-pointer hover:text-accent'>My Profile</NavLink>
                      <NavLink to='/orders' className='cursor-pointer hover:text-accent'>Orders</NavLink>
                      <NavLink to='/logout' className='cursor-pointer hover:text-accent'>Logout</NavLink>
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
          {/* Menu Icon small screen*/}
          <img onClick={()=>setVisible(true)} src={assets.menu_icon} className='w-7 cursor-pointer mr-4.5 sm:block md:hidden' alt="" />
      </div>

      {/* Sidebar Menu for Small screen*/}
        {/* Background tambahan untuk transisi */}
      <div className={`absolute top-0 right-0 bottom-0 h-screen w-full bg-accent transition-opacity duration-700 pointer-events-none ${visible ? 'opacity-100' : 'opacity-0'}`}>
      </div>

      <div className={`absolute top-0 right-0 bottom-0 h-screen overflow-hidden bg-offwhite transition-all duration-700 ease-in-out z-50 ${visible ? 'w-full' : 'w-0'}`}>
          <div className='flex flex-col text-matteblack'>
            <div className='flex items-center gap-4 p-4'>
              <img onClick={()=> setVisible(false)} src={assets.return_icon} className='h-4.5 cursor-pointer' alt="" />
            </div>
            {/* <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border-b-3' to='/'>Home</NavLink>
            <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6' to='/catalog'>Catalog</NavLink>
            <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border-t-3' to='/about'>About</NavLink> */}
          <div className="flex flex-col gap-4 p-4 border-t-3">
            {[
              { path: '/', label: 'Home' },
              { path: '/catalog', label: 'Catalog' },
              { path: '/accessories', label: 'Accessories' },
              { path: '/contact', label: 'Contact' },
              { path: '/best-seller', label: 'Best Seller' }
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