import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import { Card } from '../components/ui'

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <div className="container-wide pt-8 pb-16">
        
        {/* Header */}
        <div className='text-center space-y-4 mb-16'>
          <Title text1={'ABOUT'} text2={'US'} />
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Discover our story, mission, and commitment to providing exceptional fashion experiences
          </p>
        </div>

        {/* Our Story Section */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20'>
          <div className="order-2 lg:order-1">
            <img 
              className='w-full h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-lg' 
              src={assets.about_img} 
              alt="About ClothStore" 
            />
          </div>
          <div className='order-1 lg:order-2 flex flex-col justify-center space-y-6'>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-neutral-900">Our Story</h2>
              <p className="text-lg text-neutral-600 leading-relaxed">
                C2Store was born out of a passion for fashion and a desire to revolutionize the way people shop for clothing online. Our journey began with a simple idea: to provide a platform where customers can easily discover, explore, and purchase high-quality fashion from the comfort of their homes.
              </p>
              <p className="text-lg text-neutral-600 leading-relaxed">
                Since our inception, we've worked tirelessly to curate a diverse selection of premium clothing that caters to every style and preference. From contemporary fashion to timeless classics, we offer an extensive collection sourced from trusted brands and emerging designers.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-neutral-900">Our Mission</h3>
              <p className="text-lg text-neutral-600 leading-relaxed">
                Our mission is to empower customers with choice, convenience, and confidence in their fashion journey. We're dedicated to providing a seamless shopping experience that exceeds expectations, from browsing and styling to delivery and beyond.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="space-y-12">
          <div className='text-center space-y-4'>
            <Title text1={'WHY'} text2={'CHOOSE US'} />
            <p className="text-xl text-neutral-600">
              Experience the difference with our commitment to excellence
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <Card className="p-8 text-center space-y-4 hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900">Quality Assurance</h3>
              <p className="text-neutral-600 leading-relaxed">
                We meticulously select and vet each product to ensure it meets our stringent quality standards and exceeds your expectations.
              </p>
            </Card>

            <Card className="p-8 text-center space-y-4 hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900">Convenience</h3>
              <p className="text-neutral-600 leading-relaxed">
                With our user-friendly interface and hassle-free ordering process, shopping for your favorite styles has never been easier.
              </p>
            </Card>

            <Card className="p-8 text-center space-y-4 hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900">Customer Service</h3>
              <p className="text-neutral-600 leading-relaxed">
                Our team of dedicated professionals is here to assist you every step of the way, ensuring your satisfaction is our top priority.
              </p>
            </Card>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-20">
          <NewsletterBox />
        </div>
      </div>
    </div>
  )
}


export default About
