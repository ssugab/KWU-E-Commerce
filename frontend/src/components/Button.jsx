import React from 'react'
import { Link } from 'react-router-dom'

const Button = ({ text, to, align = 'center', className, type, onClick }) => {
  const justify = align === 'left' ? 'justify-start' : 'justify-center'
  
  if (type === 'submit') {
    return (
      <div className={`w-full flex ${justify}`}>
        <button 
          type="submit"
          onClick={onClick}
          className={`font-bricolage text-xl bg-accent border-black border-3 hover:bg-amber-600 hover:shadow-matteblack text-matteblack py-2 px-4 rounded-lg transition-all ${className}`}
        >
          {text}
        </button>
      </div>
    )
  }

  return (
    <div className={`w-full flex ${justify}`}>
      <Link 
        to={to} 
        className={`font-bricolage bg-accent border-black border-3 hover:bg-amber-600 hover:shadow-matteblack text-matteblack py-2 px-4 rounded-lg transition-all ${className}`}
      >
        {text}
      </Link>
    </div>
  )
}

export default Button