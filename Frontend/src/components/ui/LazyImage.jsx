import React, { useState, useRef, useEffect } from 'react'

const LazyImage = ({ 
  src, 
  alt, 
  className = '',
  placeholder,
  aspectRatio = 'auto',
  objectFit = 'cover',
  quality = 'high',
  loading = 'lazy',
  sizes,
  srcSet,
  onLoad,
  onError,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef(null)
  const observerRef = useRef(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    const imageElement = imgRef.current
    if (!imageElement) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setIsInView(true)
          observerRef.current?.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    )

    observerRef.current.observe(imageElement)

    return () => {
      observerRef.current?.disconnect()
    }
  }, [])

  const handleLoad = (event) => {
    setIsLoaded(true)
    onLoad?.(event)
  }

  const handleError = (event) => {
    setHasError(true)
    setIsLoaded(true)
    onError?.(event)
  }

  const aspectRatioClasses = {
    'square': 'aspect-square',
    'video': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '3/4': 'aspect-[3/4]',
    '4/5': 'aspect-[4/5]',
    '5/4': 'aspect-[5/4]',
    '16/9': 'aspect-[16/9]',
    '9/16': 'aspect-[9/16]',
    'auto': ''
  }

  const objectFitClasses = {
    'cover': 'object-cover',
    'contain': 'object-contain',
    'fill': 'object-fill',
    'scale-down': 'object-scale-down',
    'none': 'object-none'
  }

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden bg-neutral-100 ${aspectRatioClasses[aspectRatio]} ${className}`}
      {...props}
    >
      {/* Loading Skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0">
          {placeholder || (
            <div className="w-full h-full bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 animate-pulse">
              <div className="flex items-center justify-center w-full h-full">
                <svg 
                  className="w-8 h-8 text-neutral-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center">
          <div className="text-center space-y-2">
            <svg 
              className="w-8 h-8 text-neutral-400 mx-auto" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <p className="text-xs text-neutral-400">Failed to load</p>
          </div>
        </div>
      )}

      {/* Actual Image */}
      {isInView && !hasError && (
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full ${objectFitClasses[objectFit]} transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  )
}

export default LazyImage