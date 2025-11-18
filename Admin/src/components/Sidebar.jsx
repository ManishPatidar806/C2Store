import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  const menuItems = [
    { 
      label: 'Dashboard', 
      path: '/',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        </svg>
      )
    },
    { 
      label: 'Add Product', 
      path: '/add',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    { 
      label: 'Product List', 
      path: '/list',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    { 
      label: 'Orders', 
      path: '/orders',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
        </svg>
      )
    }
  ]

  return (
    <aside className="sidebar-admin animate-slide-in">
      {/* Logo Section */}
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center shadow-medium">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-900 font-display">Dreams</h1>
            <p className="text-sm text-neutral-500">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`
            }
          >
            <span className="transition-colors duration-200 group-hover:text-primary-600">
              {item.icon}
            </span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Help Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200">
        <div className="bg-primary-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-primary-900 mb-2">Need Help?</h3>
          <p className="text-xs text-primary-700 mb-3">Get support for managing your store</p>
          <button className="w-full text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200">
            Contact Support
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar