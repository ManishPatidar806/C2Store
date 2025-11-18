import React from 'react'
import { Button } from './ui'

const Navbar = ({ setToken }) => {
  const handleLogout = () => {
    setToken('')
    localStorage.removeItem('token')
  }

  return (
    <header className="navbar-admin animate-slide-up">
      {/* Left side - Breadcrumb */}
      <div className="flex items-center space-x-4">
        <h2 className="text-heading-4 text-neutral-900 font-display">
          Admin Dashboard
        </h2>
        <div className="hidden sm:flex items-center space-x-2 text-sm text-neutral-500">
          <span>Dashboard</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-neutral-900 font-medium">Overview</span>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative p-2 text-neutral-400 hover:text-neutral-600 transition-colors duration-200">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-semantic-error rounded-full"></span>
        </button>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="secondary"
          size="sm"
          className="flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </Button>
      </div>
    </header>
  )
}

export default Navbar