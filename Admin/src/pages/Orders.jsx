import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { Card, Button, Badge, LoadingSpinner } from '../components/ui'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const fetchAllOrders = async () => {
    if (!token) {
      return null
    }

    try {
      setLoading(true)
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const statusHandler = async (orderId, newStatus) => {
    try {
      setUpdating(prev => ({ ...prev, [orderId]: true }))
      const response = await axios.post(
        backendUrl + '/api/order/status', 
        { orderId, status: newStatus }, 
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success('Order status updated successfully')
        await fetchAllOrders()
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to update order status')
    } finally {
      setUpdating(prev => ({ ...prev, [orderId]: false }))
    }
  }

  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = 
        order.address.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.address.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.address.phone.includes(searchTerm) ||
        order._id.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date)
        case 'oldest':
          return new Date(a.date) - new Date(b.date)
        case 'amount-high':
          return b.amount - a.amount
        case 'amount-low':
          return a.amount - b.amount
        default:
          return 0
      }
    })

  useEffect(() => {
    fetchAllOrders()
  }, [token])

  const statusOptions = [
    'Order Placed',
    'Packing',
    'Shipped',
    'Out for delivery',
    'Delivered'
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Placed':
        return 'bg-blue-100 text-blue-800'
      case 'Packing':
        return 'bg-yellow-100 text-yellow-800'
      case 'Shipped':
        return 'bg-purple-100 text-purple-800'
      case 'Out for delivery':
        return 'bg-orange-100 text-orange-800'
      case 'Delivered':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-neutral-100 text-neutral-800'
    }
  }

  const getPaymentStatus = (payment) => {
    return payment 
      ? { text: 'Paid', color: 'bg-green-100 text-green-800' }
      : { text: 'Pending', color: 'bg-red-100 text-red-800' }
  }

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold text-neutral-900">Orders</h1>
          <p className="text-neutral-600">Loading order data...</p>
        </div>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
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
            <h1 className="text-3xl font-semibold text-neutral-900">Orders</h1>
            <p className="text-neutral-600">
              Manage customer orders ({filteredOrders.length} of {orders.length} orders)
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="hidden lg:flex gap-4">
            <div className="text-center px-4 py-2 bg-neutral-50 rounded-lg">
              <p className="text-2xl font-bold text-neutral-900">{orders.length}</p>
              <p className="text-sm text-neutral-600">Total Orders</p>
            </div>
            <div className="text-center px-4 py-2 bg-neutral-50 rounded-lg">
              <p className="text-2xl font-bold text-neutral-900">
                {orders.filter(o => o.status !== 'Delivered').length}
              </p>
              <p className="text-sm text-neutral-600">Pending</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name, phone, or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount-high">Amount: High to Low</option>
                <option value="amount-low">Amount: Low to High</option>
              </select>
            </div>
          </div>
        </Card>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No orders found</h3>
              <p className="text-neutral-600">
                {orders.length === 0 
                  ? "No orders have been placed yet." 
                  : "No orders match your current filters."
                }
              </p>
            </div>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order._id}>
              <div className="space-y-6">
                {/* Order Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-neutral-900">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600">
                      Placed on {new Date(order.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4 lg:mt-0">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-neutral-900">{currency}{order.amount}</p>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatus(order.payment).color}`}>
                          {getPaymentStatus(order.payment).text}
                        </span>
                        <span className="text-sm text-neutral-600">• {order.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Customer Info */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-neutral-900">Customer</h4>
                    <div className="space-y-1 text-sm text-neutral-600">
                      <p className="font-medium text-neutral-900">
                        {order.address.firstName} {order.address.lastName}
                      </p>
                      <p>{order.address.phone}</p>
                      <div className="pt-1">
                        <p>{order.address.street}</p>
                        <p>
                          {order.address.city}, {order.address.state} {order.address.zipcode}
                        </p>
                        <p>{order.address.country}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-neutral-900">
                      Items ({order.items.length})
                    </h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <div className="flex-1">
                            <p className="text-neutral-900">{item.name}</p>
                            <p className="text-neutral-600">Size: {item.size} • Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-neutral-900">Update Status</h4>
                    <select
                      value={order.status}
                      onChange={(e) => statusHandler(order._id, e.target.value)}
                      disabled={updating[order._id]}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    
                    {updating[order._id] && (
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <LoadingSpinner size="small" />
                        <span>Updating status...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default Orders