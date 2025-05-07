import React from 'react'
import { NavLink } from 'react-router-dom'

const Button = ({ text, to, align = 'center', className }) => {
  const justify = align === 'left' ? 'justify-start' : 'justify-center'
  return (
    <div className={`w-full flex ${justify}`}>
      <NavLink 
        to={to} 
        className={`bg-accent border-black border-2 hover:bg-amber-600 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-matteblack py-2 px-4 rounded-lg transition-all ${className}`}
      >
        {text}
      </NavLink>
    </div>
  )
}

export default Button