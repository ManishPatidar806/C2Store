import React from 'react'

const StatsCard = ({ 
  title,
  value,
  change,
  changeType = 'positive',
  icon,
  iconColor = 'bg-primary-500',
  className = '',
  loading = false,
  ...props 
}) => {
  const changeColors = {
    positive: 'text-semantic-success',
    negative: 'text-semantic-error',
    neutral: 'text-neutral-500'
  }
  
  if (loading) {
    return (
      <div className={`stat-card-admin animate-pulse ${className}`} {...props}>
        <div className={`stat-icon-admin bg-neutral-200`} />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-neutral-200 rounded w-3/4" />
          <div className="h-6 bg-neutral-200 rounded w-1/2" />
          <div className="h-3 bg-neutral-200 rounded w-1/3" />
        </div>
      </div>
    )
  }
  
  return (
    <div className={`stat-card-admin ${className}`} {...props}>
      {icon && (
        <div className={`stat-icon-admin ${iconColor}`}>
          {icon}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-600 truncate">
          {title}
        </p>
        <p className="text-2xl font-semibold text-neutral-900">
          {value}
        </p>
        {change && (
          <p className={`text-sm ${changeColors[changeType]} flex items-center space-x-1`}>
            {changeType === 'positive' && (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l10-10M17 7H7v10" />
              </svg>
            )}
            {changeType === 'negative' && (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17L7 7m10 0v10H7" />
              </svg>
            )}
            <span>{change}</span>
          </p>
        )}
      </div>
    </div>
  )
}

export default StatsCard