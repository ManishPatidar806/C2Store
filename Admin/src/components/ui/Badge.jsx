import React from 'react'

const Badge = ({ 
  children, 
  variant = 'neutral',
  size = 'medium',
  className = '',
  ...props 
}) => {
  const variants = {
    success: 'badge-admin-success',
    warning: 'badge-admin-warning',
    error: 'badge-admin-error',
    info: 'badge-admin-info',
    neutral: 'badge-admin-neutral'
  }
  
  const sizes = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-2.5 py-0.5 text-xs',
    large: 'px-3 py-1 text-sm'
  }
  
  return (
    <span
      className={`
        badge-admin
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge