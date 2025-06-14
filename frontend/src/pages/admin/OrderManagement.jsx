import React, { useContext } from 'react'
import { ShopContext } from '../../context/ShopContext'
import { useAuth } from '../../context/AuthContext'

const OrderManagement = () => {

  const { userId } = useAuth()

  return (
    <div>OrderManagement</div>
  )
}

export default OrderManagement