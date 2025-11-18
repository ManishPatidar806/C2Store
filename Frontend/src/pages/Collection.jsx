import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {

    const { products } = useContext(ShopContext);
  const [showFilter,setShowFilter] = useState(false);
  const [filterProducts,setFilterProducts] = useState([]);
  const [category,setCategory] = useState([]);
  const [subCategory,setSubCategory] = useState([]);
  const [sortType,setSortType] = useState('relavent')

  const toggleCategory = (e) => {

    if (category.includes(e.target.value)) {
        setCategory(prev=> prev.filter(item => item !== e.target.value))
    }
    else{
      setCategory(prev => [...prev,e.target.value])
    }

  }

  const toggleSubCategory = (e) => {

    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev=> prev.filter(item => item !== e.target.value))
    }
    else{
      setSubCategory(prev => [...prev,e.target.value])
    }
  }

  const applyFilter = () => {

    let productsCopy = products.slice();

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }

    if (subCategory.length > 0 ) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory))
    }

    setFilterProducts(productsCopy)

  }

  const sortProduct = () => {

    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a,b)=>(a.price - b.price)));
        break;

      case 'high-low':
        setFilterProducts(fpCopy.sort((a,b)=>(b.price - a.price)));
        break;

      default:
        applyFilter();
        break;
    }

  }

  useEffect(()=>{
      applyFilter();
  },[category,subCategory,products])

  useEffect(()=>{
    sortProduct();
  },[sortType])

  return (
    <div className='min-h-screen bg-gradient-to-b from-neutral-50 to-white'>
      <div className='container-wide pt-8 pb-16'>
        
        {/* Page Header */}
        <div className='mb-12 text-center'>
          <Title text1={'ALL'} text2={'COLLECTIONS'} />
          <p className='text-neutral-600 mt-4 max-w-2xl mx-auto'>
            Discover our complete range of premium clothing for men, women, and kids
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
      
          {/* Filter Sidebar */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-2xl shadow-medium border-0 overflow-hidden'>
              {/* Filter Header */}
              <div className='p-6 border-b border-neutral-200'>
                <button 
                  onClick={()=>setShowFilter(!showFilter)} 
                  className='w-full flex items-center justify-between text-left focus:outline-none lg:cursor-default'
                >
                  <h3 className='text-heading-3 font-display font-semibold text-neutral-900'>
                    Filters
                  </h3>
                  <svg 
                    className={`w-5 h-5 text-neutral-500 transition-transform duration-200 lg:hidden ${
                      showFilter ? 'rotate-180' : ''
                    }`} 
                    fill='none' 
                    stroke='currentColor' 
                    viewBox='0 0 24 24'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                  </svg>
                </button>
              </div>

              {/* Filter Content */}
              <div className={`${showFilter ? '' : 'hidden'} lg:block`}>
                {/* Category Filter */}
                <div className='p-6 border-b border-neutral-200'>
                  <h4 className='text-body-large font-medium text-neutral-900 mb-4'>Categories</h4>
                  <div className='space-y-3'>
                    {['Men', 'Women', 'Kids'].map((cat) => (
                      <label key={cat} className='flex items-center space-x-3 cursor-pointer group'>
                        <input
                          type='checkbox'
                          value={cat}
                          onChange={toggleCategory}
                          className='w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 focus:ring-2'
                        />
                        <span className='text-neutral-700 group-hover:text-primary-600 transition-colors'>
                          {cat}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* SubCategory Filter */}
                <div className='p-6'>
                  <h4 className='text-body-large font-medium text-neutral-900 mb-4'>Type</h4>
                  <div className='space-y-3'>
                    {['Topwear', 'Bottomwear', 'Winterwear'].map((subCat) => (
                      <label key={subCat} className='flex items-center space-x-3 cursor-pointer group'>
                        <input
                          type='checkbox'
                          value={subCat}
                          onChange={toggleSubCategory}
                          className='w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 focus:ring-2'
                        />
                        <span className='text-neutral-700 group-hover:text-primary-600 transition-colors'>
                          {subCat}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className='lg:col-span-3'>
            {/* Results Header */}
            <div className='flex items-center justify-between mb-8'>
              <div className='flex items-center space-x-4'>
                <span className='text-neutral-600'>
                  Showing {filterProducts.length} product{filterProducts.length !== 1 ? 's' : ''}
                </span>
                {(category.length > 0 || subCategory.length > 0) && (
                  <button
                    onClick={() => {
                      setCategory([])
                      setSubCategory([])
                    }}
                    className='text-primary-600 hover:text-primary-700 text-sm font-medium'
                  >
                    Clear filters
                  </button>
                )}
              </div>
              
              {/* Sort Dropdown */}
              <div className='relative'>
                <select
                  onChange={(e)=>setSortType(e.target.value)}
                  className='appearance-none bg-white border border-neutral-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                >
                  <option value="relavent">Sort by: Relevant</option>
                  <option value="low-high">Sort by: Price Low to High</option>
                  <option value="high-low">Sort by: Price High to Low</option>
                </select>
                <div className='absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none'>
                  <svg className='w-4 h-4 text-neutral-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                  </svg>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filterProducts.length === 0 ? (
              <div className='col-span-full text-center py-16'>
                <div className='w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                  <svg className='w-12 h-12 text-neutral-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' />
                  </svg>
                </div>
                <h3 className='text-heading-3 font-semibold text-neutral-900 mb-2'>No products found</h3>
                <p className='text-neutral-600 mb-6'>Try adjusting your filters or browse all products</p>
                <button
                  onClick={() => {
                    setCategory([])
                    setSubCategory([])
                  }}
                  className='bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors'
                >
                  View All Products
                </button>
              </div>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8'>
                {filterProducts.map((item, index) => (
                  <ProductItem
                    key={index}
                    name={item.name}
                    id={item._id}
                    price={item.price}
                    image={item.image}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Collection
