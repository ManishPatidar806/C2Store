import React from 'react'

const Input = ({ 
  label,
  error,
  help,
  required = false,
  className = '',
  type = 'text',
  ...props 
}) => {
  return (
    <div className="form-group-admin">
      {label && (
        <label className="form-label-admin">
          {label}
          {required && <span className="text-semantic-error ml-1">*</span>}
        </label>
      )}
      
      <input
        type={type}
        className={`
          ${error ? 'input-admin-error' : 'input-admin'}
          ${className}
        `}
        {...props}
      />
      
      {error && (
        <p className="form-error-admin">{error}</p>
      )}
      
      {help && !error && (
        <p className="form-help-admin">{help}</p>
      )}
    </div>
  )
}

export const Textarea = ({ 
  label,
  error,
  help,
  required = false,
  className = '',
  rows = 4,
  ...props 
}) => {
  return (
    <div className="form-group-admin">
      {label && (
        <label className="form-label-admin">
          {label}
          {required && <span className="text-semantic-error ml-1">*</span>}
        </label>
      )}
      
      <textarea
        rows={rows}
        className={`
          ${error ? 'input-admin-error' : 'textarea-admin'}
          ${className}
        `}
        {...props}
      />
      
      {error && (
        <p className="form-error-admin">{error}</p>
      )}
      
      {help && !error && (
        <p className="form-help-admin">{help}</p>
      )}
    </div>
  )
}

export const Select = ({ 
  label,
  error,
  help,
  required = false,
  children,
  className = '',
  ...props 
}) => {
  return (
    <div className="form-group-admin">
      {label && (
        <label className="form-label-admin">
          {label}
          {required && <span className="text-semantic-error ml-1">*</span>}
        </label>
      )}
      
      <select
        className={`
          ${error ? 'input-admin-error' : 'input-admin'}
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
      
      {error && (
        <p className="form-error-admin">{error}</p>
      )}
      
      {help && !error && (
        <p className="form-help-admin">{help}</p>
      )}
    </div>
  )
}

export default Input