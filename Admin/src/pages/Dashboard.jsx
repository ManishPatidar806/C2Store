import React, { useState, useEffect } from 'react'
import { Card, StatsCard, LoadingSpinner } from '../components/ui'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { backendUrl } from '../App'

const Dashboard = ({ token }) => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    processingOrders: 0,
    totalUsers: 0
  })
  const [loading, setLoading] = useState(true)
  const [recentOrders, setRecentOrders] = useState([])
  const [products, setProducts] = useState([])
  const [error, setError] = useState(null)

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    if (!token) {
      console.log('No token available, skipping dashboard data fetch')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      console.log('Fetching dashboard data with token:', token.slice(0, 10) + '...')

      // Fetch orders data
      console.log('Fetching orders from:', `${backendUrl}/api/order/list`)
      const ordersResponse = await axios.post(`${backendUrl}/api/order/list`, {}, {
        headers: { token }
      })
      console.log('Orders response:', ordersResponse.data)

      // Fetch products data (GET request)
      console.log('Fetching products from:', `${backendUrl}/api/product/list`)
      const productsResponse = await axios.get(`${backendUrl}/api/product/list`)
      console.log('Products response:', productsResponse.data)

      if (ordersResponse.data.success && productsResponse.data.success) {
        const orders = ordersResponse.data.orders || []
        const products = productsResponse.data.products || []
        
        console.log('Processing orders:', orders.length, 'products:', products.length)
        
        setProducts(products)
        setRecentOrders(orders.slice(0, 5)) // Get 5 most recent orders

        // Calculate statistics
        const totalOrders = orders.length
        const completedOrders = orders.filter(order => order.payment).length
        const pendingOrders = orders.filter(order => !order.payment && order.paymentMethod === 'COD').length
        const processingOrders = orders.filter(order => !order.payment && order.paymentMethod === 'Stripe').length
        const totalRevenue = orders
          .filter(order => order.payment)
          .reduce((sum, order) => sum + order.amount, 0)
        
        const newStats = {
          totalProducts: products.length,
          totalOrders,
          totalRevenue,
          pendingOrders,
          completedOrders,
          processingOrders,
          totalUsers: 0 // We don't have user count API, keeping as 0
        }
        
        console.log('Calculated stats:', newStats)
        setStats(newStats)
      } else {
        const errorMsg = ordersResponse.data.message || productsResponse.data.message || 'Failed to fetch data'
        console.error('API response error:', errorMsg)
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('Dashboard data fetch error:', error)
      console.error('Error details:', error.response?.data)
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load dashboard data'
      setError(errorMessage)
      toast.error(errorMessage)
      
      // Set empty data on error
      setStats({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        completedOrders: 0,
        processingOrders: 0,
        totalUsers: 0
      })
      setRecentOrders([])
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('Dashboard useEffect triggered, token:', token ? 'exists' : 'missing')
    fetchDashboardData()
  }, [token])

  // Show login prompt if no token
  if (!token) {
    return (
      <div className="space-y-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Please Login</h3>
          <p className="text-blue-700 mb-4">You need to login to access the admin dashboard</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-8 bg-neutral-200 rounded w-48 animate-pulse"></div>
              <div className="h-4 bg-neutral-200 rounded w-96 mt-2 animate-pulse"></div>
            </div>
            <div className="text-right">
              <div className="h-3 bg-neutral-200 rounded w-20 animate-pulse"></div>
              <div className="h-4 bg-neutral-200 rounded w-32 mt-1 animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }, (_, i) => (
            <StatsCard key={i} loading={true} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="" className="animate-pulse">
            <LoadingSpinner size="large" text="Loading dashboard data..." />
          </Card>
          <Card title="" className="animate-pulse">
            <LoadingSpinner size="large" text="Loading..." />
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Failed to Load Dashboard</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 text-neutral-900">Dashboard</h1>
            <p className="text-body text-neutral-600 mt-2">
              Welcome back! Here's what's happening with your store today.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={fetchDashboardData}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
            <div className="text-right">
              <p className="text-sm text-neutral-500">Last updated</p>
              <p className="font-medium text-neutral-900">{new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          change={`${products.length > 0 ? 'Products available' : 'No products yet'}`}
          changeType={products.length > 0 ? 'positive' : 'neutral'}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
          iconColor="bg-blue-500"
        />
        
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          change={`${stats.completedOrders} completed`}
          changeType="positive"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
            </svg>
          }
          iconColor="bg-green-500"
        />
        
        <StatsCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          change={stats.totalRevenue > 0 ? 'From completed orders' : 'No revenue yet'}
          changeType={stats.totalRevenue > 0 ? 'positive' : 'neutral'}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          }
          iconColor="bg-primary-500"
        />
        
        <StatsCard
          title="Pending Orders"
          value={stats.pendingOrders}
          change={stats.processingOrders > 0 ? `${stats.processingOrders} processing` : 'All orders processed'}
          changeType={stats.pendingOrders > 0 ? 'negative' : 'positive'}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          iconColor="bg-orange-500"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card 
          title="Recent Orders"
          action={
            <button 
              onClick={() => navigate('/orders')}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View all
            </button>
          }
        >
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-neutral-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
                </svg>
                <p className="text-neutral-500">No orders yet</p>
                <p className="text-sm text-neutral-400 mt-1">Orders will appear here when customers make purchases</p>
              </div>
            ) : (
              recentOrders.map((order) => {
                if (!order || !order._id) return null
                
                const orderDate = new Date(order.date || Date.now())
                const status = order.payment ? 'completed' : 
                             order.paymentMethod === 'COD' ? 'pending' : 'processing'
                const customerName = order.address ? `${order.address.firstName || ''} ${order.address.lastName || ''}`.trim() : 'Unknown Customer'
                
                return (
                  <div key={order._id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        status === 'completed' ? 'bg-green-100' :
                        status === 'pending' ? 'bg-yellow-100' :
                        'bg-blue-100'
                      }`}>
                        <svg className={`w-5 h-5 ${
                          status === 'completed' ? 'text-green-600' :
                          status === 'pending' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">#{order._id.slice(-6)}</p>
                        <p className="text-sm text-neutral-500">{customerName}</p>
                        <p className="text-xs text-neutral-400">{orderDate.toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-neutral-900">₹{(order.amount || 0).toLocaleString()}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        status === 'completed' ? 'bg-green-100 text-green-800' :
                        status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {status}
                      </span>
                      <p className="text-xs text-neutral-500 mt-1">{order.paymentMethod || 'Unknown'}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/add')}
              className="p-4 border-2 border-dashed border-neutral-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 group"
            >
              <div className="text-center">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-neutral-700 group-hover:text-primary-700">Add Product</p>
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/orders')}
              className="p-4 border-2 border-dashed border-neutral-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 group"
            >
              <div className="text-center">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-green-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-neutral-700 group-hover:text-primary-700">View Orders</p>
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/list')}
              className="p-4 border-2 border-dashed border-neutral-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 group"
            >
              <div className="text-center">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-purple-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-neutral-700 group-hover:text-primary-700">Manage Products</p>
              </div>
            </button>
            
            <button 
              onClick={fetchDashboardData}
              className="p-4 border-2 border-dashed border-neutral-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 group"
            >
              <div className="text-center">
                <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-orange-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-neutral-700 group-hover:text-primary-700">Refresh Data</p>
              </div>
            </button>
          </div>

          {/* Additional Stats Summary */}
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <h4 className="text-sm font-medium text-neutral-900 mb-4">Overview Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Order Success Rate</span>
                <span className="font-medium text-neutral-900">
                  {stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Avg Order Value</span>
                <span className="font-medium text-neutral-900">
                  ₹{stats.completedOrders > 0 ? Math.round(stats.totalRevenue / stats.completedOrders).toLocaleString() : 0}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard