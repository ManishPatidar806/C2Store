import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import { Card, LazyImage } from './ui'

const ProductItem = ({ id, image, name, price }) => {
    const { currency } = useContext(ShopContext);

    return (
        <Link 
            onClick={() => scrollTo(0, 0)} 
            to={`/product/${id}`}
            className="group block w-full"
        >
            <Card 
                variant="product" 
                padding="none" 
                className="h-full hover:shadow-strong transition-all duration-500 transform hover:-translate-y-2"
            >
                {/* Image Container */}
                <div className="relative overflow-hidden">
                    <LazyImage
                        src={image[0]}
                        alt={name}
                        aspectRatio="4/5"
                        className="group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                    <div className="space-y-3">
                        <h3 className="text-body font-medium text-neutral-900 leading-tight group-hover:text-primary-600 transition-colors duration-200 line-clamp-2">
                            {name}
                        </h3>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-baseline space-x-1">
                                <span className="text-heading-3 text-primary-600 font-semibold">
                                    {currency}{price}
                                </span>
                            </div>
                        </div>

                        {/* Quick add to cart button */}
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                // Add to cart logic here
                            }}
                            className="w-full mt-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                        >
                            Quick Add to Cart
                        </button>
                    </div>
                </div>
            </Card>
        </Link>
    )
}

export default ProductItem
