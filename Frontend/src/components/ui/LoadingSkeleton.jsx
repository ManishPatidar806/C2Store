import React from 'react'

const LoadingSkeleton = ({ 
  variant = 'card', 
  count = 1, 
  className = '', 
  aspectRatio,
  ...props 
}) => {
  const variants = {
    card: (
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden animate-pulse">
        <div className={`bg-neutral-200 ${aspectRatio === 'square' ? 'aspect-square' : 'h-48'}`} />
        <div className="p-6 space-y-3">
          <div className="h-4 bg-neutral-200 rounded w-3/4" />
          <div className="h-4 bg-neutral-200 rounded w-1/2" />
          <div className="h-6 bg-neutral-200 rounded w-1/4" />
        </div>
      </div>
    ),
    
    productGrid: (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-soft overflow-hidden animate-pulse">
            <div className="aspect-square bg-neutral-200" />
            <div className="p-4 space-y-2">
              <div className="h-3 bg-neutral-200 rounded w-3/4" />
              <div className="h-3 bg-neutral-200 rounded w-1/2" />
              <div className="h-4 bg-neutral-200 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    ),
    
    text: (
      <div className="space-y-2">
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="h-4 bg-neutral-200 rounded animate-pulse" />
        ))}
      </div>
    ),
    
    hero: (
      <div className="container-wide pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="h-12 bg-neutral-200 rounded animate-pulse" />
            <div className="space-y-3">
              <div className="h-4 bg-neutral-200 rounded animate-pulse" />
              <div className="h-4 bg-neutral-200 rounded w-3/4 animate-pulse" />
            </div>
            <div className="h-12 bg-neutral-200 rounded w-48 animate-pulse" />
          </div>
          <div className="aspect-square bg-neutral-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    ),
    
    default: (
      <div className="space-y-2">
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="h-4 bg-neutral-200 rounded animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className={`${className}`} {...props}>
      {variants[variant] || variants.default}
    </div>
  )
}

// Individual skeleton components for specific use cases
export const SkeletonCard = ({ aspectRatio, className = '' }) => (
  <LoadingSkeleton variant="card" aspectRatio={aspectRatio} className={className} />
)

export const SkeletonText = ({ lines = 3, className = '' }) => (
  <LoadingSkeleton variant="text" count={lines} className={className} />
)

export const SkeletonProductGrid = ({ count = 8, className = '' }) => (
  <LoadingSkeleton variant="productGrid" count={count} className={className} />
)

export const SkeletonHero = ({ className = '' }) => (
  <LoadingSkeleton variant="hero" className={className} />
)

export default LoadingSkeleton