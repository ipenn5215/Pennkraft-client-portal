'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  Calculator,
  FileSpreadsheet,
  BarChart3,
  Clock,
  DollarSign,
  Download,
  Star,
  Users,
  Zap,
  Shield,
  Check,
  ShoppingCart
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Tools' },
    { id: 'estimating', name: 'Estimating' },
    { id: 'project-management', name: 'Project Management' },
    { id: 'analytics', name: 'Analytics' }
  ]

  const tools = [
    {
      id: 1,
      name: 'PaintPro Estimator',
      category: 'estimating',
      description: 'Advanced painting estimation tool with prevailing wage calculations and material optimization',
      price: 149,
      originalPrice: 199,
      rating: 4.8,
      reviews: 127,
      icon: Calculator,
      features: [
        'Prevailing wage calculations',
        'Material quantity optimizer',
        'Labor hour estimator',
        'Export to Excel/PDF',
        'Lifetime updates'
      ],
      badge: 'Best Seller',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      name: 'Tile & Floor Calculator Pro',
      category: 'estimating',
      description: 'Comprehensive tile and flooring takeoff tool with waste factor calculations',
      price: 99,
      originalPrice: 149,
      rating: 4.9,
      reviews: 89,
      icon: FileSpreadsheet,
      features: [
        'Pattern layout optimizer',
        'Waste factor calculator',
        'Multiple room support',
        'Material database',
        'Cloud sync'
      ],
      badge: 'Popular',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 3,
      name: 'Drywall Master Suite',
      category: 'estimating',
      description: 'Complete drywall estimation suite with finishing levels and texture calculations',
      price: 129,
      rating: 4.7,
      reviews: 64,
      icon: Calculator,
      features: [
        'Level 0-5 finishing calculator',
        'Texture material estimator',
        'Fastener calculator',
        'Taping compound optimizer',
        'Project templates'
      ],
      color: 'from-green-500 to-green-600'
    },
    {
      id: 4,
      name: 'Project Timeline Tracker',
      category: 'project-management',
      description: 'Visual project timeline management with automated scheduling and crew optimization',
      price: 199,
      originalPrice: 299,
      rating: 4.6,
      reviews: 92,
      icon: Clock,
      features: [
        'Gantt chart visualization',
        'Crew scheduling',
        'Weather integration',
        'Progress tracking',
        'Client portal access'
      ],
      badge: 'New',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 5,
      name: 'Bid Analytics Dashboard',
      category: 'analytics',
      description: 'Comprehensive bid analysis and win rate optimization platform',
      price: 249,
      rating: 4.9,
      reviews: 41,
      icon: BarChart3,
      features: [
        'Win rate analysis',
        'Competitor tracking',
        'Margin optimizer',
        'Historical data trends',
        'Custom reports'
      ],
      badge: 'Pro',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 6,
      name: 'Glass & Mirror Calculator',
      category: 'estimating',
      description: 'Specialized tool for shower doors, mirrors, and commercial glass estimation',
      price: 89,
      originalPrice: 129,
      rating: 4.5,
      reviews: 37,
      icon: FileSpreadsheet,
      features: [
        'Custom cut optimizer',
        'Hardware calculator',
        'Installation time estimator',
        'Safety glass requirements',
        'Quote generator'
      ],
      color: 'from-teal-500 to-teal-600'
    }
  ]

  const filteredTools = selectedCategory === 'all'
    ? tools
    : tools.filter(tool => tool.category === selectedCategory)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <>
      <Navigation alwaysWhite />

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="section-padding bg-gradient-to-r from-primary-600 to-blue-700 text-white pt-24">
          <div className="max-w-7xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Construction Tools Marketplace
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-blue-100 max-w-3xl mx-auto mb-8"
            >
              Professional-grade estimation tools and calculators designed by contractors, for contractors.
              Save time, increase accuracy, and win more bids.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <div className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                <Shield className="h-5 w-5" />
                <span>30-Day Money Back Guarantee</span>
              </div>
              <div className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                <Zap className="h-5 w-5" />
                <span>Instant Download</span>
              </div>
              <div className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                <Users className="h-5 w-5" />
                <span>Trusted by 1000+ Contractors</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="sticky top-16 z-30 bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex space-x-4 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredTools.map((tool) => (
                <motion.div
                  key={tool.id}
                  variants={itemVariants}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
                >
                  {/* Tool Header */}
                  <div className={`bg-gradient-to-r ${tool.color} p-6 text-white relative`}>
                    {tool.badge && (
                      <span className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                        {tool.badge}
                      </span>
                    )}
                    <tool.icon className="h-12 w-12 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">{tool.name}</h3>
                    <p className="text-blue-100 text-sm">{tool.description}</p>
                  </div>

                  {/* Tool Body */}
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Rating */}
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 font-semibold">{tool.rating}</span>
                      </div>
                      <span className="text-gray-500 text-sm">({tool.reviews} reviews)</span>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 mb-6 flex-grow">
                      {tool.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Pricing and CTA */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-3xl font-bold text-gray-900">
                              ${tool.price}
                            </span>
                            {tool.originalPrice && (
                              <span className="text-lg text-gray-400 line-through">
                                ${tool.originalPrice}
                              </span>
                            )}
                          </div>
                          {tool.originalPrice && (
                            <span className="text-sm text-green-600">
                              Save ${tool.originalPrice - tool.price}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <button className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center space-x-2">
                          <ShoppingCart className="h-4 w-4" />
                          <span>Add to Cart</span>
                        </button>
                        <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2">
                          <Download className="h-4 w-4" />
                          <span>Learn More</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mt-16 bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-8 text-center"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Need a Custom Tool?
              </h2>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                We develop custom estimation tools tailored to your specific business needs.
                From specialized calculators to complete workflow automation.
              </p>
              <button className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200">
                Request Custom Development
              </button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}