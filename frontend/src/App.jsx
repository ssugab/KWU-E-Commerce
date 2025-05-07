import React from 'react'
import {Routes, Route, useLocation} from 'react-router-dom'

import Home from './pages/Home'
import Cart from './pages/Cart'
import Catalog from './pages/Catalog'
import Login from './pages/Login'
import Orders from './pages/Orders'
import Payment from './pages/Payment'
import Product from './pages/Product'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Contact from './pages/Contact'

const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className='App'>
      {!isLoginPage && <Navbar />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/catalog' element={<Catalog />} />
        <Route path='/contact' element={<Contact />}/>
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/login' element={<Login />} />
        <Route path='/payment' element={<Payment />} />
      </Routes>

      {!isLoginPage && <Footer />}
    </div>
  )
}

const App = () => {
  return <AppContent />
}

export default App