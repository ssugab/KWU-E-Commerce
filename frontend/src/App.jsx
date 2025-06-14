import React, { useEffect } from 'react'
import {Routes, Route, useLocation} from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Home from './pages/Home'
import Cart from './pages/Cart'
import Catalog from './pages/Catalog'
import Product from './pages/Product'
import MainLayouts from './components/Layouts/MainLayouts'
import AdminLayouts from './components/Layouts/AdminLayouts'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import Profile from './pages/User/profile'
import Login from './pages/User/LoginPage'
import SignUp from './pages/User/SignUpPage'
import Payment from './pages/Payment'
import Orders from './pages/Orders'
import Checkout from './pages/Checkout'

import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'

import { AuthProvider, useAuth } from './context/AuthContext'

const App = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Effect to scroll to top of page when route changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);

  return (
    <AuthProvider>
      <div className='App w-full max-w-full overflow-x-hidden'>
        <Toaster position="top-center" />

        <Routes>
          <Route element={<MainLayouts />}>
            <Route path='/' element={<Home />} />
            <Route path='/catalog' element={<Catalog />} />
            <Route path='/contact' element={<Contact />}/>
            <Route path='/product/:productId' element={<Product />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/orders' element={<Orders />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/checkout' element={<Checkout />} />
            <Route path='/payment' element={<Payment />} />
          </Route>

          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          
          {/* Admin Routes */}
          <Route element={user?.role === 'Admin' ? <AdminLayouts /> : <MainLayouts />}></Route>
          <Route element={<AdminLayouts />}>
            <Route path='/admin/login' element={<AdminLogin />} />
            <Route path='/admin/dashboard' element={<AdminDashboard />} />
          </Route>
          
          <Route path='*' element={<NotFound />} />
       
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App