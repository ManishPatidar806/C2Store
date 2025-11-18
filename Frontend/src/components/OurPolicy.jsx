import React from 'react'

const OurPolicy = () => {
  const policies = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      title: 'Easy Exchange Policy',
      description: 'Hassle-free exchanges within 30 days of purchase'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: '30 Days Return Policy',
      description: 'Free returns and refunds for qualified purchases'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: '24/7 Customer Support',
      description: 'Round-the-clock assistance for all your queries'
    }
  ]

  return (
    <section className="section-spacing bg-neutral-50">
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {policies.map((policy, index) => (
            <div 
              key={index}
              className="group text-center space-y-6 p-8 bg-white rounded-3xl shadow-soft hover:shadow-medium transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Icon */}
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                  {policy.icon}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-heading-3 text-neutral-900 group-hover:text-primary-600 transition-colors duration-200">
                  {policy.title}
                </h3>
                <p className="text-body text-neutral-600 leading-relaxed">
                  {policy.description}
                </p>
              </div>

              {/* Decorative element */}
              <div className="flex justify-center">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-primary-300 to-transparent group-hover:via-primary-600 transition-colors duration-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default OurPolicy
