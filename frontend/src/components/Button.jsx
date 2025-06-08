import React from 'react'
import { Link } from 'react-router-dom'

const Button = ({ text, to, align = 'center', className, type, onClick, disabled }) => {
  const justify = align === 'left' ? 'justify-start' : 'justify-center'

  const baseClasses = 'font-bricolage text-xl bg-accent border-black border-3 hover:bg-amber-600 hover:shadow-matteblack text-matteblack py-2 px-4 rounded-lg transition-all';
  const disabledClasses = 'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-accent disabled:hover:shadow-none';

  if (to) {
    return (
      <div className={` flex ${justify}`}>
        <Link 
          to={to} 
          className={`${baseClasses} ${className}`}
          // Link tidak punya prop disabled, jadi kita bisa atur style-nya secara manual jika perlu
        >
          {text}
        </Link>
      </div>
    );
  }

  return (
    <div className={` flex ${justify}`}>
    <button 
      type={type} // Bisa 'button' atau 'submit'
      onClick={onClick}
      disabled={disabled} // Teruskan prop disabled
      className={`${baseClasses} ${disabledClasses} ${className}`}
    >
      {text}
    </button>
  </div>
  )
}

export default Button