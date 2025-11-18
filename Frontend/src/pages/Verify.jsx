import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const Verify = () => {
    const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext)
    const [searchParams, setSearchParams] = useSearchParams()
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState('processing')
    
    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')

    const verifyPayment = async () => {
        try {
            // Use token from context when available, otherwise fall back to localStorage
            const authToken = token || localStorage.getItem('token') || ''

            if (!authToken) {
                toast.error('Authentication required')
                navigate('/login')
                return
            }

            if (!orderId) {
                toast.error('Invalid order ID')
                navigate('/cart')
                return
            }

            setStatus('verifying')
            const response = await axios.post(
                backendUrl + '/api/order/verifyStripe', 
                { success, orderId }, 
                { headers: { token: authToken } }
            )

            if (response.data.success) {
                setStatus('success')
                setCartItems({})
                toast.success('Payment verified successfully!')
                setTimeout(() => {
                    navigate('/orders')
                }, 2000)
            } else {
                setStatus('failed')
                toast.error(response.data.message || 'Payment verification failed')
                setTimeout(() => {
                    navigate('/cart')
                }, 3000)
            }
        } catch (error) {
            console.log(error)
            setStatus('failed')
            toast.error(error.response?.data?.message || 'Payment verification failed')
            setTimeout(() => {
                navigate('/cart')
            }, 3000)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        verifyPayment()
    }, [token])

    const getStatusConfig = () => {
        switch (status) {
            case 'processing':
            case 'verifying':
                return {
                    icon: (
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
                    ),
                    title: 'Processing Payment',
                    message: 'Please wait while we verify your payment...',
                    color: 'text-blue-600'
                }
            case 'success':
                return {
                    icon: (
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    ),
                    title: 'Payment Successful!',
                    message: 'Your order has been confirmed. Redirecting to orders...',
                    color: 'text-green-600'
                }
            case 'failed':
                return {
                    icon: (
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    ),
                    title: 'Payment Failed',
                    message: 'There was an issue with your payment. Redirecting to cart...',
                    color: 'text-red-600'
                }
            default:
                return {
                    icon: null,
                    title: '',
                    message: '',
                    color: ''
                }
        }
    }

    const statusConfig = getStatusConfig()

    return (
        <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white flex items-center justify-center">
            <div className="max-w-md w-full mx-4">
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                    <div className="mb-6">
                        {statusConfig.icon}
                    </div>
                    
                    <h1 className={`text-2xl font-bold mb-4 ${statusConfig.color}`}>
                        {statusConfig.title}
                    </h1>
                    
                    <p className="text-neutral-600 mb-6">
                        {statusConfig.message}
                    </p>

                    {status === 'verifying' && (
                        <div className="space-y-2">
                            <div className="w-full bg-neutral-200 rounded-full h-2">
                                <div className="bg-primary-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                            </div>
                            <p className="text-sm text-neutral-500">Verifying payment details...</p>
                        </div>
                    )}

                    {status === 'failed' && (
                        <div className="space-y-4">
                            <button
                                onClick={() => navigate('/cart')}
                                className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors duration-200"
                            >
                                Return to Cart
                            </button>
                            <button
                                onClick={() => navigate('/contact')}
                                className="w-full border border-neutral-300 text-neutral-600 py-3 px-6 rounded-lg hover:border-neutral-400 transition-colors duration-200"
                            >
                                Contact Support
                            </button>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="space-y-4">
                            <button
                                onClick={() => navigate('/orders')}
                                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-200"
                            >
                                View Orders
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="w-full border border-neutral-300 text-neutral-600 py-3 px-6 rounded-lg hover:border-neutral-400 transition-colors duration-200"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Verify
