import React, { useState } from 'react'
import { Button } from './ui'
import { toast } from 'react-toastify'

const NewsletterBox = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    
    if (!email.trim()) {
      toast.error('Please enter your email address')
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Successfully subscribed to our newsletter!')
      setEmail('')
      setIsLoading(false)
    }, 1000)
  }

  return (
    <section className="section-spacing bg-gradient-to-r from-primary-600 to-primary-700">
      <div className="container-narrow text-center text-white">
        
        {/* Header */}
        <div className="space-y-6 mb-12">
          <div className="space-y-4">
            <h2 className="text-heading-1 font-display text-white">
              Stay In The Loop
            </h2>
            <p className="text-xl text-primary-100 leading-relaxed max-w-2xl mx-auto">
              Subscribe to our newsletter and get <span className="font-semibold text-white">20% off</span> your first order, 
              plus exclusive access to new arrivals, style tips, and special offers.
            </p>
          </div>
          
          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-primary-100">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-primary-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Exclusive Offers</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-primary-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>New Arrivals First</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-primary-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Style Tips</span>
            </div>
          </div>
        </div>

        {/* Newsletter Form */}
        <div className="max-w-md mx-auto">
          <form onSubmit={onSubmitHandler} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={isLoading}
                className="bg-white text-primary-600 hover:bg-primary-50 font-semibold px-8 py-3 whitespace-nowrap"
              >
                {isLoading ? 'Subscribing...' : 'Subscribe Now'}
              </Button>
            </div>
          </form>
          
          {/* Privacy Notice */}
          <p className="text-xs text-primary-200 mt-4">
            By subscribing, you agree to receive marketing emails from us. You can unsubscribe at any time.
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="flex flex-wrap justify-center items-center gap-8 text-primary-200">
            <div className="flex items-center space-x-2 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Your data is safe</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>No spam, ever</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Unsubscribe anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewsletterBox
