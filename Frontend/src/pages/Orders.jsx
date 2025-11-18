import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';
import { Card, Badge } from '../components/ui';
import { toast } from 'react-toastify';

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([])
  const [loading, setLoading] = useState(true)
  const [groupedOrders, setGroupedOrders] = useState([])

  const loadOrderData = async () => {
    try {
      if (!token) {
        toast.error('Please login to view orders')
        return
      }

      setLoading(true)
      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } })
      
      if (response.data.success) {
        // Group orders by order ID to show them properly
        const orders = response.data.orders
        setGroupedOrders(orders.reverse())
      } else {
        toast.error(response.data.message || 'Failed to load orders')
      }
    } catch (error) {
      toast.error('Failed to load orders')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrderData()
  }, [token])

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

  const getPaymentColor = (payment) => {
    return payment 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
        <div className="container-wide pt-8 pb-16">
          <div className="space-y-8">
            <div className="text-center">
              <div className="h-8 w-48 bg-neutral-200 rounded animate-pulse mx-auto"></div>
            </div>
            {Array.from({ length: 3 }, (_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="space-y-4">
                  <div className="h-6 bg-neutral-200 rounded w-1/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                    <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <div className="container-wide pt-8 pb-16">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <Title text1="MY" text2="ORDERS" />
            <p className="text-neutral-600 text-lg">Track your order history and current orders</p>
          </div>

          {/* Orders List */}
          {groupedOrders.length === 0 ? (
            <Card className="text-center py-16">
              <div className="space-y-4">
                <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900">No orders found</h3>
                <p className="text-neutral-600">You haven't placed any orders yet.</p>
                <button 
                  onClick={() => window.location.href = '/collection'}
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  Start Shopping
                </button>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              {groupedOrders.map((order, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="space-y-6">
                    {/* Order Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pb-4 border-b border-neutral-200">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-neutral-900">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-neutral-600">
                          <span>Placed on {new Date(order.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</span>
                          <span>•</span>
                          <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-neutral-900">{currency}{order.amount}</p>
                          <div className="flex items-center space-x-2">
                            <Badge className={getPaymentColor(order.payment)}>
                              {order.payment ? 'Paid' : 'Pending'}
                            </Badge>
                            <span className="text-sm text-neutral-500">via {order.paymentMethod}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-4">
                      {order.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-lg">
                          <img 
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0" 
                            src={item.image[0]} 
                            alt={item.name}
                          />
                          <div className="flex-1 space-y-1">
                            <h4 className="font-medium text-neutral-900">{item.name}</h4>
                            <div className="flex items-center space-x-4 text-sm text-neutral-600">
                              <span>Size: {item.size}</span>
                              <span>Qty: {item.quantity}</span>
                              <span className="font-semibold">{currency}{item.price}</span>
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-neutral-200">
                      <div className="space-y-1 mb-4 sm:mb-0">
                        <p className="text-sm font-medium text-neutral-900">Delivery Address:</p>
                        <p className="text-sm text-neutral-600">
                          {order.address.firstName} {order.address.lastName}<br/>
                          {order.address.street}, {order.address.city}<br/>
                          {order.address.state} {order.address.zipcode}, {order.address.country}
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button 
                          onClick={loadOrderData}
                          className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:border-neutral-400 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Refresh
                        </button>
                        {order.status !== 'Delivered' && (
                          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200">
                            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Track Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Orders
