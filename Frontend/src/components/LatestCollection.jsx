import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'
import { LoadingSkeleton } from './ui'

const LatestCollection = () => {
    const { products } = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (products.length > 0) {
            setLatestProducts(products.slice(0, 10));
            setIsLoading(false);
        } else {
            setIsLoading(true);
        }
    }, [products]);

    return (
        <section className="section-spacing bg-gradient-to-b from-white to-neutral-50/50">
            <div className="container-wide">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="space-y-6">
                        <Title text1={'LATEST'} text2={'COLLECTIONS'} />
                        <p className="text-body-large text-neutral-600 leading-relaxed">
                            Discover our newest arrivals featuring the latest trends in fashion. 
                            Each piece is carefully curated to bring you the perfect blend of style and comfort.
                        </p>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="flex items-center justify-center space-x-4 mt-8">
                        <div className="h-px w-16 bg-primary-300"></div>
                        <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                        <div className="h-px w-32 bg-primary-600"></div>
                        <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                        <div className="h-px w-16 bg-primary-300"></div>
                    </div>
                </div>

                {/* Products Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
                        {Array.from({ length: 10 }, (_, index) => (
                            <div key={index} className="space-y-4">
                                <LoadingSkeleton variant="product" className="aspect-[4/5] rounded-2xl" />
                                <div className="space-y-2 p-2">
                                    <LoadingSkeleton variant="text" className="h-4" />
                                    <LoadingSkeleton variant="text" className="h-4 w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : latestProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
                        {latestProducts.map((item, index) => (
                            <div 
                                key={item._id}
                                className="animate-fade-in-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <ProductItem 
                                    id={item._id} 
                                    image={item.image} 
                                    name={item.name} 
                                    price={item.price} 
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto space-y-4">
                            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto">
                                <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" />
                                </svg>
                            </div>
                            <h3 className="text-heading-3 text-neutral-600">No Products Available</h3>
                            <p className="text-body text-neutral-500">
                                We're currently updating our collection. Please check back soon for new arrivals.
                            </p>
                        </div>
                    </div>
                )}

                {/* View All Button */}
                {!isLoading && latestProducts.length > 0 && (
                    <div className="text-center mt-12">
                        <button 
                            onClick={() => window.location.href = '/collection'}
                            className="btn-outline group"
                        >
                            <span className="flex items-center space-x-2">
                                <span>View All Collection</span>
                                <svg 
                                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </section>
    )
}

export default LatestCollection
