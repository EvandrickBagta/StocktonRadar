import React from 'react'
import Link from 'next/link'

const BusinessesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Stockton Businesses</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore the diverse business community that makes Stockton a thriving place to live and work.
          </p>
        </div>

        {/* Businesses Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Business Directory Coming Soon</h2>
              <p className="text-gray-600 text-lg mb-8">
                We're building a comprehensive directory of Stockton businesses. 
                Soon you'll be able to discover local restaurants, shops, services, 
                and professional businesses in your area.
              </p>
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-2">Business Categories:</h3>
                <ul className="text-green-800 text-left space-y-2">
                  <li>• Restaurants & Food Services</li>
                  <li>• Retail & Shopping</li>
                  <li>• Professional Services</li>
                  <li>• Healthcare & Wellness</li>
                  <li>• Automotive & Transportation</li>
                  <li>• Home & Garden Services</li>
                  <li>• Entertainment & Recreation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusinessesPage
