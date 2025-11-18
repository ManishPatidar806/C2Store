import React from 'react';

const Card = ({ 
  children, 
  variant = 'default',
  className = '',
  padding = 'default',
  hover = true,
  onClick,
  ...props 
}) => {
  const variants = {
    default: 'card-default',
    elevated: 'card-elevated',
    product: 'card-product'
  };

  const paddings = {
    none: '',
    small: 'p-4',
    default: 'p-6',
    large: 'p-8'
  };

  const hoverEffect = hover ? 'cursor-pointer' : '';
  const clickable = onClick ? 'cursor-pointer' : '';

  return (
    <div
      onClick={onClick}
      className={`
        ${variants[variant] || variants.default}
        ${paddings[padding] || paddings.default}
        ${hoverEffect}
        ${clickable}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;