import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { Button, Card, LazyImage } from '../components/ui'

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item]
            })
          }
        }
      }
      setCartData(tempData);
      setIsLoading(false);
    }
  }, [cartItems, products])

  const getTotalItems = () => {
    return cartData.reduce((total, item) => total + item.quantity, 0);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
        <div className="container-wide pt-8 pb-16">
          <div className="space-y-8">
            <div className="text-center">
              <div className="h-8 w-48 bg-neutral-200 rounded animate-pulse mx-auto"></div>
            </div>
            {Array.from({ length: 3 }, (_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-neutral-200 rounded"></div>
                  <div className="flex-1 space-y-2">
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

  if (cartData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
        <div className="container-wide pt-8 pb-16">
          <div className="text-center space-y-8">
            <Title text1={'YOUR'} text2={'CART'} />
            
            {/* Empty Cart State */}
            <div className="max-w-md mx-auto py-16">
              <div className="space-y-6">
                <div className="w-32 h-32 bg-neutral-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-16 h-16 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-heading-2 text-neutral-700">Your cart is empty</h3>
                  <p className="text-body text-neutral-500">
                    Add some items to your cart to get started with your shopping journey.
                  </p>
                </div>
                <Button onClick={() => navigate('/collection')} size="large">
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <div className="container-wide pt-8 pb-16">
        
        {/* Header */}
        <div className="text-center mb-12">
          <Title text1={'YOUR'} text2={'CART'} />
          <p className="text-body text-neutral-600 mt-4">
            {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartData.map((item, index) => {
              const productData = products.find((product) => product._id === item._id);
              
              return (
                <Card key={index} className="group hover:shadow-medium transition-all duration-300">
                  <div className="flex flex-col sm:flex-row gap-6">
                    
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <LazyImage
                        src={productData.image[0]}
                        alt={productData.name}
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl group-hover:scale-105 transition-transform duration-300"
                        aspectRatio="square"
                        objectFit="cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-heading-3 text-neutral-900 group-hover:text-primary-600 transition-colors duration-200">
                          {productData.name}
                        </h3>
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl font-semibold text-primary-600">
                            {currency}{productData.price}
                          </span>
                          <div className="px-3 py-1 bg-neutral-100 rounded-lg text-sm font-medium text-neutral-700">
                            Size: {item.size}
                          </div>
                        </div>
                      </div>

                      {/* Quantity and Remove Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-neutral-600">Quantity:</span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item._id, item.size, Math.max(1, item.quantity - 1))}
                              className="w-8 h-8 rounded-lg border border-neutral-300 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 hover:border-neutral-400 transition-colors duration-200"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <input 
                              value={item.quantity}
                              onChange={(e) => {
                                const newQuantity = parseInt(e.target.value) || 1;
                                if (newQuantity > 0) {
                                  updateQuantity(item._id, item.size, newQuantity);
                                }
                              }}
                              className="w-16 text-center py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                              type="number" 
                              min={1}
                            />
                            <button
                              onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                              className="w-8 h-8 rounded-lg border border-neutral-300 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 hover:border-neutral-400 transition-colors duration-200"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => updateQuantity(item._id, item.size, 0)}
                          className="p-2 text-neutral-400 hover:text-semantic-error hover:bg-red-50 rounded-lg transition-all duration-200 group/remove"
                          aria-label="Remove item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <div className="space-y-6">
                <h3 className="text-heading-3 text-neutral-900">Order Summary</h3>
                
                <CartTotal />
                
                <div className="space-y-4">
                  <Button 
                    onClick={() => navigate('/place-order')} 
                    size="large" 
                    className="w-full"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>Proceed to Checkout</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/collection')}
                    className="w-full"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </Card>

            {/* Trust Signals */}
            <Card className="space-y-4">
              <h4 className="font-semibold text-neutral-900">Why shop with us?</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Free Shipping</p>
                    <p className="text-xs text-neutral-500">On orders over $50</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">30-Day Returns</p>
                    <p className="text-xs text-neutral-500">Hassle-free returns</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Secure Payment</p>
                    <p className="text-xs text-neutral-500">256-bit SSL encryption</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
