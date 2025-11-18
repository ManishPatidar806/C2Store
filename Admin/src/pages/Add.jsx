import React, { useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { Card, Button, Input } from '../components/ui'

// Textarea component (since it's not in the UI library yet)
const Textarea = ({ label, error, ...props }) => (
  <div className="space-y-2">
    {label && <label className="block text-sm font-medium text-neutral-700">{label}</label>}
    <textarea
      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      {...props}
    />
    {error && <p className="text-sm text-semantic-error">{error}</p>}
  </div>
)

// Select component
const Select = ({ label, children, ...props }) => (
  <div className="space-y-2">
    {label && <label className="block text-sm font-medium text-neutral-700">{label}</label>}
    <select
      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      {...props}
    >
      {children}
    </select>
  </div>
)

const Add = ({ token }) => {
  const [images, setImages] = useState([null, null, null, null])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Men',
    subCategory: 'Topwear',
    bestseller: false,
    sizes: []
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const categories = [
    { value: 'Men', label: 'Men' },
    { value: 'Women', label: 'Women' },
    { value: 'Kids', label: 'Kids' }
  ]

  const subCategories = [
    { value: 'Topwear', label: 'Topwear' },
    { value: 'Bottomwear', label: 'Bottomwear' },
    { value: 'Winterwear', label: 'Winterwear' }
  ]

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  const handleImageChange = (index, event) => {
    const file = event.target.files[0]
    if (file) {
      const newImages = [...images]
      newImages[index] = file
      setImages(newImages)
    }
  }

  const removeImage = (index) => {
    const newImages = [...images]
    newImages[index] = null
    setImages(newImages)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Product name is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
      newErrors.price = 'Valid price is required'
    }
    if (formData.sizes.length === 0) newErrors.sizes = 'At least one size is required'
    if (images.filter(img => img !== null).length === 0) {
      newErrors.images = 'At least one image is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fix the errors below')
      return
    }

    setLoading(true)

    try {
      const submitData = new FormData()
      
      submitData.append('name', formData.name)
      submitData.append('description', formData.description)
      submitData.append('price', formData.price)
      submitData.append('category', formData.category)
      submitData.append('subCategory', formData.subCategory)
      submitData.append('bestseller', formData.bestseller)
      submitData.append('sizes', JSON.stringify(formData.sizes))

      images.forEach((image, index) => {
        if (image) {
          submitData.append(`image${index + 1}`, image)
        }
      })

      const response = await axios.post(backendUrl + '/api/product/add', submitData, {
        headers: { token }
      })

      if (response.data.success) {
        toast.success('Product added successfully!')
        // Reset form
        setFormData({
          name: '',
          description: '',
          price: '',
          category: 'Men',
          subCategory: 'Topwear',
          bestseller: false,
          sizes: []
        })
        setImages([null, null, null, null])
      } else {
        toast.error(response.data.message || 'Failed to add product')
      }
    } catch (error) {
      console.error(error)
      toast.error('Error adding product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-neutral-900">Add New Product</h1>
        <p className="text-neutral-600">
          Create a new product listing for your store
        </p>
      </div>

      <form onSubmit={onSubmitHandler} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card title="Basic Information">
              <div className="space-y-4">
                <Input
                  label="Product Name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={errors.name}
                  required
                />

                <Textarea
                  label="Description"
                  placeholder="Describe your product..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  error={errors.description}
                  required
                />

                <Input
                  type="number"
                  label="Price (₹)"
                  placeholder="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  error={errors.price}
                  required
                />
              </div>
            </Card>

            {/* Categories */}
            <Card title="Categories">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </Select>

                <Select
                  label="Sub Category"
                  value={formData.subCategory}
                  onChange={(e) => handleInputChange('subCategory', e.target.value)}
                  required
                >
                  {subCategories.map(subCat => (
                    <option key={subCat.value} value={subCat.value}>{subCat.label}</option>
                  ))}
                </Select>
              </div>
            </Card>

            {/* Sizes */}
            <Card title="Sizes">
              <div className="space-y-2">
                <p className="text-sm text-neutral-600">Select available sizes:</p>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                        formData.sizes.includes(size)
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-neutral-300 text-neutral-600 hover:border-neutral-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {errors.sizes && <p className="text-sm text-red-500">{errors.sizes}</p>}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Product Images */}
            <Card title="Product Images">
              <div className="space-y-4">
                <p className="text-sm text-neutral-600">Upload up to 4 images</p>
                
                <div className="grid grid-cols-2 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <div className="aspect-square border-2 border-dashed border-neutral-300 rounded-lg overflow-hidden hover:border-primary-400 transition-colors duration-200">
                        {image ? (
                          <>
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors duration-200"
                            >
                              ×
                            </button>
                          </>
                        ) : (
                          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer text-neutral-400 hover:text-neutral-600">
                            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="text-xs">Add Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageChange(index, e)}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {errors.images && <p className="text-sm text-red-500">{errors.images}</p>}
              </div>
            </Card>

            {/* Settings */}
            <Card title="Settings">
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.bestseller}
                    onChange={(e) => handleInputChange('bestseller', e.target.checked)}
                    className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-neutral-700">
                    Mark as Bestseller
                  </span>
                </label>
                <p className="text-xs text-neutral-500">
                  Bestseller products will be featured prominently on the website
                </p>
              </div>
            </Card>

            {/* Submit Button */}
            <Card>
              <Button
                type="submit"
                loading={loading}
                size="large"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Adding Product...' : 'Add Product'}
              </Button>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Add