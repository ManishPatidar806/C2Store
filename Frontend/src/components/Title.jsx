import React from 'react'

const Title = ({ text1, text2, align = 'center', size = 'large' }) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const sizeClasses = {
    small: 'text-xl md:text-2xl',
    medium: 'text-2xl md:text-3xl',
    large: 'text-3xl md:text-4xl',
    xlarge: 'text-4xl md:text-5xl'
  };

  return (
    <div className={`space-y-4 ${alignmentClasses[align] || alignmentClasses.center}`}>
      <h2 className={`font-display font-normal leading-tight ${sizeClasses[size] || sizeClasses.large}`}>
        <span className="text-neutral-600">{text1}</span>
        {text2 && (
          <>
            <span className="mx-2 text-neutral-300">•</span>
            <span className="text-primary-600">{text2}</span>
          </>
        )}
      </h2>
      
      {/* Decorative underline */}
      <div className={`flex items-center space-x-2 ${
        align === 'left' ? 'justify-start' : 
        align === 'right' ? 'justify-end' : 
        'justify-center'
      }`}>
        <div className="h-px w-8 bg-primary-300"></div>
        <div className="w-1.5 h-1.5 bg-primary-600 rounded-full"></div>
        <div className="h-px w-16 bg-primary-600"></div>
        <div className="w-1.5 h-1.5 bg-primary-600 rounded-full"></div>
        <div className="h-px w-8 bg-primary-300"></div>
      </div>
    </div>
  )
}

export default Title
