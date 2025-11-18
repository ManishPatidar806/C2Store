import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { toast } from 'react-toastify';

const Product = () => {

  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')
  const [activeTab, setActiveTab] = useState('description')
  const [quantity, setQuantity] = useState(1)

  // Calculate dynamic values
  const calculateDiscount = (price) => {
    const originalPrice = Math.round(price * 1.25) // Assuming 20% discount
    const discount = Math.round((originalPrice - price) / originalPrice * 100)
    return { originalPrice, discount }
  }

  const getStockStatus = (productId, category) => {
    // In a real app, this would come from backend
    // For now, using bestseller status as stock indicator
    return productData?.bestseller ? 'In Stock' : 'Limited Stock'
  }

  const getDeliveryInfo = (price) => {
    const freeShippingThreshold = 499
    return {
      isFreeShipping: price >= freeShippingThreshold,
      threshold: freeShippingThreshold,
      deliveryDays: price >= freeShippingThreshold ? '2-3' : '3-5'
    }
  }

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item)
        setImage(item.image[0])
        return null;
      }
    })
  }

  useEffect(() => {
    fetchProductData();
  }, [productId, products])

  const handleAddToCart = () => {
    if (!size) {
      toast.error('Please select a size before adding to cart');
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart(productData._id, size);
    }
    toast.success(`Added ${quantity > 1 ? quantity + ' items' : 'item'} to cart`);
  }

  return productData ? (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Breadcrumb */}
        <div className='flex items-center space-x-2 text-sm text-gray-500 mb-8'>
          <span>Home</span>
          <span>/</span>
          <span>{productData.category}</span>
          <span>/</span>
          <span className='text-gray-900 font-medium'>{productData.name}</span>
        </div>

        {/* Product Section */}
        <div className='bg-white rounded-2xl shadow-lg overflow-hidden mb-12'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8'>
            
            {/* Product Images */}
            <div className='space-y-4'>
              {/* Main Image */}
              <div className='aspect-square bg-gray-100 rounded-xl overflow-hidden'>
                <img 
                  className='w-full h-full object-cover hover:scale-105 transition-transform duration-300' 
                  src={image} 
                  alt={productData.name} 
                />
              </div>
              
              {/* Thumbnail Images */}
              <div className='flex gap-3 overflow-x-auto pb-2'>
                {productData.image.map((item, index) => (
                  <div 
                    key={index}
                    onClick={() => setImage(item)} 
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                      image === item ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={item} className='w-full h-full object-cover' alt="" />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className='space-y-6'>
              {/* Title */}
              <div>
                <h1 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-3'>{productData.name}</h1>
                <div className='flex items-center gap-3 mb-4'>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    getStockStatus(productData._id, productData.category) === 'In Stock' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {getStockStatus(productData._id, productData.category)}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className='border-b border-gray-200 pb-6'>
                <div className='flex items-baseline gap-3'>
                  <span className='text-4xl font-bold text-gray-900'>{currency}{productData.price}</span>
                  {calculateDiscount(productData.price).discount > 0 && (
                    <>
                      <span className='text-lg text-gray-500 line-through'>
                        {currency}{calculateDiscount(productData.price).originalPrice}
                      </span>
                      <span className='bg-red-100 text-red-800 text-sm px-2 py-1 rounded-lg'>
                        {calculateDiscount(productData.price).discount}% OFF
                      </span>
                    </>
                  )}
                </div>
                <div className='flex items-center gap-4 mt-2'>
                  {getDeliveryInfo(productData.price).isFreeShipping ? (
                    <p className='text-green-600 text-sm'>✓ Free shipping ({getDeliveryInfo(productData.price).deliveryDays} days)</p>
                  ) : (
                    <p className='text-gray-600 text-sm'>
                      ✓ Shipping charges apply • {getDeliveryInfo(productData.price).deliveryDays} days delivery
                    </p>
                  )}
                  {productData.bestseller && (
                    <span className='bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full'>
                      ⭐ Bestseller
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>Description</h3>
                <p className='text-gray-600 leading-relaxed'>{productData.description}</p>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-3'>Select Size</h3>
                <div className='grid grid-cols-4 gap-3'>
                  {productData.sizes.map((item, index) => (
                    <button 
                      key={index}
                      onClick={() => setSize(item)} 
                      className={`py-3 px-4 rounded-lg border-2 font-medium transition-all duration-200 ${
                        item === size 
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-3'>Quantity</h3>
                <div className='flex items-center gap-4'>
                  <div className='flex items-center border border-gray-300 rounded-lg'>
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className='px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors'
                    >
                      -
                    </button>
                    <span className='px-4 py-2 border-x border-gray-300 bg-gray-50 min-w-[3rem] text-center'>
                      {quantity}
                    </span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className='px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors'
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div>
                <button 
                  onClick={handleAddToCart}
                  className='w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl'
                >
                  Add to Cart
                </button>
              </div>

              {/* Product Features */}
              <div className='bg-gray-50 rounded-lg p-4 space-y-2'>
                <div className='flex items-center gap-3 text-sm text-gray-600'>
                  <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                  <span>100% Original product</span>
                </div>
                <div className='flex items-center gap-3 text-sm text-gray-600'>
                  <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                  <span>Cash on delivery available</span>
                </div>
                <div className='flex items-center gap-3 text-sm text-gray-600'>
                  <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                  <span>Easy return & exchange within 7 days</span>
                </div>
                {getDeliveryInfo(productData.price).isFreeShipping ? (
                  <div className='flex items-center gap-3 text-sm text-gray-600'>
                    <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                    <span>Free shipping on this order</span>
                  </div>
                ) : (
                  <div className='flex items-center gap-3 text-sm text-gray-600'>
                    <span className='w-2 h-2 bg-blue-500 rounded-full'></span>
                    <span>Free shipping on orders over {currency}{getDeliveryInfo(productData.price).threshold}</span>
                  </div>
                )}
                {productData.category === 'Men' && (
                  <div className='flex items-center gap-3 text-sm text-gray-600'>
                    <span className='w-2 h-2 bg-blue-500 rounded-full'></span>
                    <span>Men's collection • Premium quality</span>
                  </div>
                )}
                {productData.category === 'Women' && (
                  <div className='flex items-center gap-3 text-sm text-gray-600'>
                    <span className='w-2 h-2 bg-pink-500 rounded-full'></span>
                    <span>Women's collection • Latest trends</span>
                  </div>
                )}
                {productData.category === 'Kids' && (
                  <div className='flex items-center gap-3 text-sm text-gray-600'>
                    <span className='w-2 h-2 bg-yellow-500 rounded-full'></span>
                    <span>Kids collection • Safe materials</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className='bg-white rounded-2xl shadow-lg overflow-hidden mb-12'>
          {/* Tab Headers */}
          <div className='border-b border-gray-200'>
            <div className='flex space-x-8 px-6'>
              <button 
                onClick={() => setActiveTab('description')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === 'description' 
                    ? 'border-indigo-500 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Description
              </button>
              <button 
                onClick={() => setActiveTab('specifications')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === 'specifications' 
                    ? 'border-indigo-500 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Specifications
              </button>
              <button 
                onClick={() => setActiveTab('shipping')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === 'shipping' 
                    ? 'border-indigo-500 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Shipping & Returns
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className='p-6'>
            {activeTab === 'description' && (
              <div className='prose max-w-none'>
                <h3 className='text-lg font-semibold mb-4'>Product Description</h3>
                <p className='text-gray-600 leading-relaxed mb-4'>
                  {productData.description}
                </p>
                <p className='text-gray-600 leading-relaxed mb-4'>
                  Experience premium quality and comfort with this carefully crafted piece. Made from the finest materials, 
                  this product combines style and functionality to meet your everyday needs.
                </p>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                  <div>
                    <h4 className='font-semibold mb-2'>Key Features:</h4>
                    <ul className='space-y-1 text-gray-600'>
                      <li>• Premium quality materials</li>
                      <li>• Comfortable fit</li>
                      <li>• Durable construction</li>
                      <li>• Easy care instructions</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className='font-semibold mb-2'>Available Sizes:</h4>
                    <div className='flex gap-2'>
                      {productData.sizes.map((size, index) => (
                        <span key={index} className='px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md'>
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                <h3 className='text-lg font-semibold mb-4'>Product Specifications</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-3'>
                    <div className='flex justify-between py-2 border-b border-gray-100'>
                      <span className='font-medium'>Category:</span>
                      <span className='text-gray-600'>{productData.category}</span>
                    </div>
                    <div className='flex justify-between py-2 border-b border-gray-100'>
                      <span className='font-medium'>Sub Category:</span>
                      <span className='text-gray-600'>{productData.subCategory}</span>
                    </div>
                    <div className='flex justify-between py-2 border-b border-gray-100'>
                      <span className='font-medium'>Available Sizes:</span>
                      <span className='text-gray-600'>{productData.sizes.join(', ')}</span>
                    </div>
                    <div className='flex justify-between py-2 border-b border-gray-100'>
                      <span className='font-medium'>Product ID:</span>
                      <span className='text-gray-600 font-mono text-xs'>{productData._id}</span>
                    </div>
                  </div>
                  <div className='space-y-3'>
                    <div className='flex justify-between py-2 border-b border-gray-100'>
                      <span className='font-medium'>Material:</span>
                      <span className='text-gray-600'>
                        {productData.subCategory === 'Topwear' ? 'Premium Cotton Blend' : 
                         productData.subCategory === 'Bottomwear' ? 'Denim/Cotton Mix' :
                         productData.subCategory === 'Winterwear' ? 'Wool Blend' : 'High-Quality Fabric'}
                      </span>
                    </div>
                    <div className='flex justify-between py-2 border-b border-gray-100'>
                      <span className='font-medium'>Care Instructions:</span>
                      <span className='text-gray-600'>
                        {productData.subCategory === 'Winterwear' ? 'Dry Clean Only' : 'Machine Wash Cold'}
                      </span>
                    </div>
                    <div className='flex justify-between py-2 border-b border-gray-100'>
                      <span className='font-medium'>Origin:</span>
                      <span className='text-gray-600'>Made in India</span>
                    </div>
                  </div>
                </div>
                {productData.bestseller && (
                  <div className='mt-6 p-4 bg-purple-50 rounded-lg'>
                    <h4 className='font-semibold text-purple-900 mb-2'>⭐ Bestseller Product</h4>
                    <p className='text-purple-700 text-sm'>
                      This product is one of our most popular items, loved by customers for its quality and style.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div>
                <h3 className='text-lg font-semibold mb-4'>Shipping & Returns</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                  <div>
                    <h4 className='font-semibold mb-3'>Shipping Information</h4>
                    <div className='space-y-2 text-gray-600'>
                      {getDeliveryInfo(productData.price).isFreeShipping ? (
                        <p>• Free shipping on this order</p>
                      ) : (
                        <p>• Free shipping on orders over {currency}{getDeliveryInfo(productData.price).threshold}</p>
                      )}
                      <p>• Standard delivery: {getDeliveryInfo(productData.price).deliveryDays} business days</p>
                      {getDeliveryInfo(productData.price).isFreeShipping && (
                        <p>• Express delivery: 1-2 business days (additional charges)</p>
                      )}
                      <p>• Cash on delivery available</p>
                      <p>• Order tracking provided</p>
                      {productData.category === 'Kids' && (
                        <p>• Special packaging for kids items</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className='font-semibold mb-3'>Return Policy</h4>
                    <div className='space-y-2 text-gray-600'>
                      <p>• 7-day easy return policy</p>
                      <p>• Free returns for defective items</p>
                      <p>• Items must be unused and in original packaging</p>
                      <p>• Refund processed within 5-7 business days</p>
                      <p>• Exchange available for size/color</p>
                      {productData.subCategory === 'Winterwear' && (
                        <p>• Extended return period for winter items (14 days)</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
                  <h4 className='font-semibold text-blue-900 mb-2'>📦 Order Information</h4>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
                    <div>
                      <span className='font-medium text-blue-800'>Estimated Delivery:</span>
                      <p className='text-blue-700'>{getDeliveryInfo(productData.price).deliveryDays} business days</p>
                    </div>
                    <div>
                      <span className='font-medium text-blue-800'>Shipping Cost:</span>
                      <p className='text-blue-700'>
                        {getDeliveryInfo(productData.price).isFreeShipping ? 'Free' : `${currency}49`}
                      </p>
                    </div>
                    <div>
                      <span className='font-medium text-blue-800'>Stock Status:</span>
                      <p className='text-blue-700'>{getStockStatus(productData._id, productData.category)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
      </div>
    </div>
  ) : (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600'></div>
    </div>
  )
}

export default Product
