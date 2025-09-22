'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ProtectedGallery from '@/components/gallery/ProtectedGallery'
import { Camera, Video, Shield, Award, Star } from 'lucide-react'

// Mock data for demonstration
const galleryItems = [
  // Real Estate Photography
  {
    id: '1',
    type: 'image' as const,
    src: '/images/gallery/property1-full.jpg',
    thumbnail: '/images/gallery/property1-thumb.jpg',
    title: 'Luxury Modern Home',
    description: 'Contemporary architecture in prime location',
    category: 'Real Estate',
    date: '2024-12-15',
    protected: true,
    watermarkPosition: 'diagonal' as const
  },
  {
    id: '2',
    type: 'image' as const,
    src: '/images/gallery/property2-full.jpg',
    thumbnail: '/images/gallery/property2-thumb.jpg',
    title: 'Downtown Condo',
    description: 'High-rise living with city views',
    category: 'Real Estate',
    date: '2024-12-10',
    protected: true,
    watermarkPosition: 'diagonal' as const
  },
  {
    id: '3',
    type: 'video' as const,
    src: '/videos/gallery/property-tour.mp4',
    thumbnail: '/images/gallery/video1-thumb.jpg',
    title: 'Virtual Property Tour',
    description: 'Walkthrough of luxury estate',
    category: 'Real Estate',
    date: '2024-12-08',
    protected: true,
    watermarkPosition: 'center' as const
  },

  // Construction Projects
  {
    id: '4',
    type: 'image' as const,
    src: '/images/gallery/construction1-full.jpg',
    thumbnail: '/images/gallery/construction1-thumb.jpg',
    title: 'Commercial Painting Project',
    description: 'Large-scale commercial renovation',
    category: 'Construction',
    date: '2024-11-20',
    protected: false,
    watermarkPosition: 'bottom-right' as const
  },
  {
    id: '5',
    type: 'image' as const,
    src: '/images/gallery/construction2-full.jpg',
    thumbnail: '/images/gallery/construction2-thumb.jpg',
    title: 'Custom Tile Installation',
    description: 'Premium bathroom renovation',
    category: 'Construction',
    date: '2024-11-15',
    protected: false,
    watermarkPosition: 'bottom-right' as const
  },
  {
    id: '6',
    type: 'image' as const,
    src: '/images/gallery/construction3-full.jpg',
    thumbnail: '/images/gallery/construction3-thumb.jpg',
    title: 'Drywall & Finishing',
    description: 'Complete interior finishing project',
    category: 'Construction',
    date: '2024-11-10',
    protected: false,
    watermarkPosition: 'bottom-right' as const
  },

  // Before & After
  {
    id: '7',
    type: 'image' as const,
    src: '/images/gallery/before-after1-full.jpg',
    thumbnail: '/images/gallery/before-after1-thumb.jpg',
    title: 'Kitchen Transformation',
    description: 'Complete kitchen renovation',
    category: 'Before & After',
    date: '2024-10-25',
    protected: true,
    watermarkPosition: 'diagonal' as const
  },
  {
    id: '8',
    type: 'image' as const,
    src: '/images/gallery/before-after2-full.jpg',
    thumbnail: '/images/gallery/before-after2-thumb.jpg',
    title: 'Bathroom Remodel',
    description: 'Modern bathroom upgrade',
    category: 'Before & After',
    date: '2024-10-20',
    protected: true,
    watermarkPosition: 'diagonal' as const
  },
]

const categories = ['Real Estate', 'Construction', 'Before & After']

const stats = [
  { label: 'Projects Completed', value: '500+', icon: Award },
  { label: 'Properties Photographed', value: '1,000+', icon: Camera },
  { label: 'Videos Produced', value: '200+', icon: Video },
  { label: 'Client Satisfaction', value: '5.0', icon: Star },
]

export default function GalleryPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <>
      <Navigation alwaysWhite />

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="pt-24 pb-12 bg-gradient-to-r from-primary-600 to-blue-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center text-white"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Our Work Gallery
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
                Explore our portfolio of construction projects and real estate photography.
                Every project showcases our commitment to quality and attention to detail.
              </p>

              {/* Protection Notice */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg"
              >
                <Shield className="h-5 w-5 mr-2" />
                <span>All media is protected by copyright © 2025 Pennkraft</span>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
            >
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center"
                >
                  <stat.icon className="h-8 w-8 text-white mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-blue-100">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Browse Our Portfolio
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Select a category to filter projects or browse all our work.
                Click on any image to view in full quality.
              </p>
            </motion.div>

            {/* Protected Gallery Component */}
            <ProtectedGallery
              items={galleryItems}
              categories={categories}
              watermark="© Pennkraft 2025"
              allowDownload={false}
              requireAuth={true}
              isAuthenticated={isAuthenticated}
            />

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mt-16 bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-8 text-center"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Start Your Project?
              </h2>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                Whether you need construction estimating or professional photography,
                we're here to help bring your vision to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/#contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  Get a Quote
                </a>
                <a
                  href="/portal/register"
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Client Portal
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}