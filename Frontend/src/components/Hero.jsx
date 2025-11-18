import React, { useState, useEffect, useContext } from 'react'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import { Button, LazyImage } from './ui'

const Hero = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { navigate } = useContext(ShopContext);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleShopNow = () => {
        navigate('/collection');
    };

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-neutral-50 to-primary-50/30">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(194,135,90,0.3),transparent)]"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(194,135,90,0.05)_50%,transparent_75%)]"></div>
            </div>

            <div className="container-wide relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh] py-20 lg:py-0">
                    
                    {/* Hero Content */}
                    <div className={`space-y-8 transform transition-all duration-1000 ${
                        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
                    }`}>
                        
                        {/* Badge */}
                        <div className="flex items-center space-x-4">
                            <div className="h-px w-12 bg-primary-600 animate-fade-in"></div>
                            <span className="text-caption text-primary-600 font-medium tracking-wider">
                                OUR BESTSELLERS
                            </span>
                            <div className="h-px w-8 bg-primary-600/50 animate-fade-in"></div>
                        </div>

                        {/* Main Heading */}
                        <div className="space-y-4">
                            <h1 className="text-display leading-none">
                                <span className="block text-neutral-900">Latest</span>
                                <span className="block text-primary-600 font-serif">Arrivals</span>
                            </h1>
                            <p className="text-body-large max-w-lg leading-relaxed text-neutral-600">
                                Discover our curated collection of premium clothing that blends 
                                contemporary style with timeless elegance.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button 
                                onClick={handleShopNow}
                                size="large"
                                className="group"
                            >
                                <span className="flex items-center space-x-3">
                                    <span>Shop Collection</span>
                                    <svg 
                                        className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </span>
                            </Button>
                            
                            <Button 
                                variant="outline"
                                size="large"
                                onClick={() => navigate('/about')}
                            >
                                Learn More
                            </Button>
                        </div>

                        {/* Social Proof */}
                        <div className="flex items-center space-x-8 pt-8">
                            <div className="text-center">
                                <div className="text-heading-3 text-primary-600">10K+</div>
                                <div className="text-body-small text-neutral-500">Happy Customers</div>
                            </div>
                            <div className="w-px h-12 bg-neutral-200"></div>
                            <div className="text-center">
                                <div className="text-heading-3 text-primary-600">500+</div>
                                <div className="text-body-small text-neutral-500">Premium Products</div>
                            </div>
                            <div className="w-px h-12 bg-neutral-200"></div>
                            <div className="text-center">
                                <div className="text-heading-3 text-primary-600">24/7</div>
                                <div className="text-body-small text-neutral-500">Support</div>
                            </div>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className={`relative transform transition-all duration-1000 delay-300 ${
                        isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-12 opacity-0 scale-95'
                    }`}>
                        <div className="relative">
                            {/* Image Container */}
                            <div className="relative overflow-hidden rounded-3xl shadow-strong">
                                <LazyImage 
                                    src={assets.hero_img} 
                                    alt="Fashion Collection" 
                                    className="group-hover:scale-105 transition-transform duration-700 h-[600px]"
                                    objectFit="cover"
                                    loading="eager"
                                />
                                
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/20 via-transparent to-transparent"></div>
                                
                                {/* Floating Elements */}
                                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-medium animate-bounce-soft">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
                                        <span className="text-sm font-medium text-neutral-900">New Collection</span>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary-100 rounded-full blur-xl opacity-60 animate-pulse-soft"></div>
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent-100 rounded-full blur-2xl opacity-40 animate-pulse-soft"></div>
                            
                            {/* Feature Cards */}
                            <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 bg-white rounded-2xl shadow-strong p-6 max-w-xs animate-slide-in-left">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-neutral-900">Premium Quality</h3>
                                        <p className="text-xs text-neutral-600">Handpicked materials</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-primary-300 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-primary-600 rounded-full mt-2 animate-pulse"></div>
                </div>
            </div>
        </section>
    )
}

export default Hero
