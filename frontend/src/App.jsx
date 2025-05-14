import React from 'react'
import {Routes, Route} from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Home from './pages/Home'
import Cart from './pages/Cart'
import Catalog from './pages/Catalog'
import Product from './pages/Product'
import MainLayouts from './components/Layouts/MainLayouts'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import Profile from './pages/User/profile'
import Login from './pages/User/LoginPage'
import SignUp from './pages/User/SignUpPage'

import Orders from './pages/Orders'
import Payment from './pages/Payment'

const App = () => {
  return (
    <div className='App'>
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
          <Route path='/payment' element={<Payment />} />
        </Route>

          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='*' element={<NotFound />} />       
      </Routes>
    </div>
  )
}

export default App