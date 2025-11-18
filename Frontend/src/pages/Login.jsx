import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Button, Input, Card } from '../components/ui'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
  const [currentState, setCurrentState] = useState('Login')
  const [isLoading, setIsLoading] = useState(false)
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [formErrors, setFormErrors] = useState({})

  const validateForm = () => {
    const errors = {}

    if (currentState === 'Sign Up' && !formData.name.trim()) {
      errors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (currentState === 'Sign Up' && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)

    try {
      let response

      if (currentState === 'Sign Up') {
        response = await axios.post(`${backendUrl}/api/user/register`, {
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      } else {
        response = await axios.post(`${backendUrl}/api/user/login`, {
          email: formData.email,
          password: formData.password
        })
      }

      if (response.data.success) {
        setToken(response.data.token)
        localStorage.setItem('token', response.data.token)
        
        // Store user info for profile page
        if (currentState === 'Sign Up') {
          localStorage.setItem('userName', formData.name)
          localStorage.setItem('userEmail', formData.email)
        } else {
          // For login, we'll decode token or use email from form
          localStorage.setItem('userEmail', formData.email)
          // If user name is not available, we'll use email prefix
          if (!localStorage.getItem('userName')) {
            localStorage.setItem('userName', formData.email.split('@')[0])
          }
        }
        
        toast.success(`${currentState === 'Login' ? 'Welcome back!' : 'Account created successfully!'}`)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-neutral-50 flex items-center justify-center py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="space-y-4">
            <h1 className="text-heading-1 font-display text-neutral-900">
              {currentState === 'Login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-body text-neutral-600">
              {currentState === 'Login' 
                ? 'Sign in to your account to continue shopping' 
                : 'Join our community and start your fashion journey'
              }
            </p>
          </div>
          
          {/* Decorative line */}
          <div className="flex items-center justify-center space-x-2 mt-6">
            <div className="h-px w-8 bg-primary-300"></div>
            <div className="w-1.5 h-1.5 bg-primary-600 rounded-full"></div>
            <div className="h-px w-16 bg-primary-600"></div>
            <div className="w-1.5 h-1.5 bg-primary-600 rounded-full"></div>
            <div className="h-px w-8 bg-primary-300"></div>
          </div>
        </div>

        <Card className="shadow-strong">
          <form onSubmit={onSubmitHandler} className="space-y-6">
            
            {/* Name Field (only for Sign Up) */}
            {currentState === 'Sign Up' && (
              <Input
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={formErrors.name}
                required
                icon={({ className }) => (
                  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              />
            )}

            {/* Email Field */}
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={formErrors.email}
              required
              icon={({ className }) => (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              )}
            />

            {/* Password Field */}
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={formErrors.password}
              required
              icon={({ className }) => (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
            />

            {/* Form Actions */}
            <div className="space-y-4">
              {currentState === 'Login' && (
                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button 
                type="submit" 
                size="large" 
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {currentState === 'Login' ? 'Sign In' : 'Create Account'}
              </Button>
            </div>
          </form>

          {/* Switch between Login/Signup */}
          <div className="mt-6 text-center">
            <p className="text-body-small text-neutral-600">
              {currentState === 'Login' ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => {
                  setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login')
                  setFormErrors({})
                  setFormData({ name: '', email: '', password: '' })
                }}
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
              >
                {currentState === 'Login' ? 'Create one now' : 'Sign in here'}
              </button>
            </p>
          </div>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-6 text-neutral-400">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-xs font-medium">SSL Secured</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-xs font-medium">Privacy Protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
