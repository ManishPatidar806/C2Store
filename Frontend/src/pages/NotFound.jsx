import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white flex items-center justify-center px-4">
      <div className="max-w-lg mx-auto text-center space-y-8">
        
        {/* 404 Animation */}
        <div className="relative">
          <div className="text-8xl md:text-9xl font-bold text-primary-100 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-primary-50 rounded-full flex items-center justify-center animate-pulse">
              <svg className="w-16 h-16 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-semibold text-neutral-900">
            Page Not Found
          </h1>
          <p className="text-lg text-neutral-600 leading-relaxed">
            Oops! The page you're looking for seems to have wandered off. 
            Don't worry, even the best explorers sometimes take a wrong turn.
          </p>
        </div>

        {/* Suggestions */}
        <div className="bg-neutral-50 rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900">What you can do:</h2>
          <ul className="space-y-3 text-left">
            <li className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-neutral-700">Check the URL for any typing errors</span>
            </li>
            <li className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-neutral-700">Browse our latest collection</span>
            </li>
            <li className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-neutral-700">Use the search function to find what you need</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate('/')}
            size="large"
            className="flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Go Home</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate('/collection')}
            size="large"
            className="flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
            </svg>
            <span>Shop Now</span>
          </Button>
          
          <button
            onClick={() => navigate(-1)}
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Go Back</span>
          </button>
        </div>

        {/* Help Section */}
        <div className="pt-8 border-t border-neutral-200">
          <p className="text-sm text-neutral-500 mb-4">
            Still can't find what you're looking for?
          </p>
          <Button
            variant="outline"
            size="small"
            onClick={() => navigate('/contact')}
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotFound