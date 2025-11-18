import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { Card, Button, Badge, LoadingSpinner } from '../components/ui'

const List = ({ token }) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const fetchList = async () => {
    try {
      setLoading(true)
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const removeProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      setDeleting(prev => ({ ...prev, [id]: true }))
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })

      if (response.data.success) {
        toast.success('Product deleted successfully')
        await fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setDeleting(prev => ({ ...prev, [id]: false }))
    }
  }

  // Filter and sort products
  const filteredProducts = list
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filter === 'all' || product.category.toLowerCase() === filter.toLowerCase()
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date)
        case 'oldest':
          return new Date(a.date) - new Date(b.date)
        case 'price-high':
          return b.price - a.price
        case 'price-low':
          return a.price - b.price
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  useEffect(() => {
    fetchList()
  }, [])

  const categories = ['all', 'Men', 'Women', 'Kids']
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'name', label: 'Name: A to Z' }
  ]

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold text-neutral-900">Products</h1>
          <p className="text-neutral-600">Loading your product inventory...</p>
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
            <h1 className="text-3xl font-semibold text-neutral-900">Products</h1>
            <p className="text-neutral-600">
              Manage your product inventory ({filteredProducts.length} of {list.length} products)
            </p>
          </div>
          <Button onClick={() => window.location.href = '/add'}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </Button>
        </div>

        {/* Filters and Search */}
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
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
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
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>
      </div>

      {/* Products List */}
      <Card>
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No products found</h3>
            <p className="text-neutral-600 mb-4">
              {list.length === 0 
                ? "You haven't added any products yet." 
                : "No products match your current filters."
              }
            </p>
            {list.length === 0 && (
              <Button onClick={() => window.location.href = '/add'}>
                Add Your First Product
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Desktop Table Header */}
            <div className="hidden lg:grid grid-cols-12 gap-4 pb-4 border-b border-neutral-200 text-sm font-medium text-neutral-600">
              <div className="col-span-1">Image</div>
              <div className="col-span-4">Product Details</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Actions</div>
            </div>

            {/* Product Items */}
            <div className="space-y-4 lg:space-y-2">
              {filteredProducts.map((item) => (
                <div key={item._id} 
                     className="flex flex-col lg:grid lg:grid-cols-12 gap-4 p-4 lg:p-3 border border-neutral-200 rounded-lg lg:rounded-md hover:border-neutral-300 transition-colors duration-200">
                  
                  {/* Mobile/Tablet Layout */}
                  <div className="lg:hidden space-y-4">
                    <div className="flex gap-4">
                      <img
                        src={item.image[0]}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 space-y-2">
                        <h3 className="font-medium text-neutral-900 line-clamp-2">{item.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{item.category}</Badge>
                          {item.bestseller && <Badge variant="primary">Bestseller</Badge>}
                        </div>
                        <p className="text-lg font-semibold text-neutral-900">{currency}{item.price}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-neutral-200">
                      <div className="flex gap-2">
                        {item.sizes?.map(size => (
                          <span key={size} className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded">
                            {size}
                          </span>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => removeProduct(item._id)}
                        loading={deleting[item._id]}
                        className="text-semantic-error border-semantic-error hover:bg-red-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden lg:contents">
                    <div className="col-span-1">
                      <img
                        src={item.image[0]}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="col-span-4 space-y-1">
                      <h3 className="font-medium text-neutral-900 line-clamp-1">{item.name}</h3>
                      <p className="text-sm text-neutral-600 line-clamp-2">{item.description}</p>
                      <div className="flex gap-1">
                        {item.sizes?.slice(0, 3).map(size => (
                          <span key={size} className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded">
                            {size}
                          </span>
                        ))}
                        {item.sizes?.length > 3 && (
                          <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded">
                            +{item.sizes.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="col-span-2">
                      <Badge variant="secondary">{item.category}</Badge>
                    </div>
                    
                    <div className="col-span-2">
                      <span className="text-lg font-semibold text-neutral-900">{currency}{item.price}</span>
                    </div>
                    
                    <div className="col-span-2">
                      {item.bestseller && <Badge variant="primary">Bestseller</Badge>}
                    </div>
                    
                    <div className="col-span-1">
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => removeProduct(item._id)}
                        loading={deleting[item._id]}
                        className="text-semantic-error border-semantic-error hover:bg-red-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default List