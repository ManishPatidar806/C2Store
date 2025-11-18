import React from 'react'

const Card = ({ 
  children, 
  title,
  action,
  compact = false,
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`
        ${compact ? 'card-admin-compact' : 'card-admin'}
        ${className}
      `}
      {...props}
    >
      {title && (
        <div className="card-admin-header">
          <h3 className="text-heading-4 text-neutral-900">{title}</h3>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  )
}

export const CardHeader = ({ children, className = '' }) => (
  <div className={`card-admin-header ${className}`}>
    {children}
  </div>
)

export const CardBody = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
)

export const CardFooter = ({ children, className = '' }) => (
  <div className={`pt-4 border-t border-neutral-200 ${className}`}>
    {children}
  </div>
)

export default Card