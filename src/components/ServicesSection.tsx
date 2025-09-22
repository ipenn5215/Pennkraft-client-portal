'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Calculator,
  Home,
  Building2,
  Camera,
  Video,
  Cpu,
  Wrench,
  TrendingUp,
  Users,
  Palette,
  Grid3x3,
  Hammer,
  Frame,
  ShoppingBag,
  Square,
  DollarSign
} from 'lucide-react'

export default function ServicesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const services = [
    {
      category: 'Construction Estimating',
      icon: Calculator,
      description: 'Professional takeoffs and detailed estimates for all construction trades',
      color: 'from-blue-500 to-blue-600',
      items: [
        { icon: Palette, title: 'Painting Estimates', desc: 'Residential & commercial with prevailing wage calculations' },
        { icon: Grid3x3, title: 'Tile & Flooring Takeoffs', desc: 'Precise material quantities and labor calculations' },
        { icon: Hammer, title: 'Drywall Estimating', desc: 'Complete material and labor breakdowns' },
        { icon: Frame, title: 'Shower Door & Mirror Estimates', desc: 'Custom glass material takeoffs' },
        { icon: Square, title: 'Glass Rail & Storefront Quotes', desc: 'Commercial glass project estimates' }
      ]
    },
    {
      category: 'Field Walks & Assessments',
      icon: Camera,
      description: 'On-site project evaluation and documentation services',
      color: 'from-purple-500 to-purple-600',
      items: [
        { icon: Camera, title: 'Project Site Documentation', desc: 'Comprehensive photo documentation of job sites' },
        { icon: Video, title: 'Field Walk Videos', desc: 'Detailed video walkthroughs for remote assessment' },
        { icon: Home, title: 'Scope Verification', desc: 'On-site measurement and scope confirmation' },
        { icon: Building2, title: 'Progress Documentation', desc: 'Regular site visits to document project progress' }
      ]
    },
    {
      category: 'Tech Solutions & Development',
      icon: Cpu,
      description: 'Full-stack development and custom construction technology',
      color: 'from-green-500 to-green-600',
      items: [
        { icon: Cpu, title: 'Custom Construction Tools', desc: 'Tailored software solutions for contractors' },
        { icon: Wrench, title: 'Website Design & Development', desc: 'Full-stack web applications and sites' },
        { icon: Calculator, title: 'AI Estimating Integration', desc: 'Automated calculation and estimation tools' },
        { icon: Building2, title: 'Database & API Development', desc: 'Custom backends and data management systems' }
      ]
    },
    {
      category: 'Marketing & Branding',
      icon: TrendingUp,
      description: 'Strategic marketing for construction businesses',
      color: 'from-orange-500 to-orange-600',
      items: [
        { icon: TrendingUp, title: 'Marketing Strategy', desc: 'Contractor-focused marketing plans' },
        { icon: Users, title: 'Social Media Management', desc: 'Build your construction brand online' },
        { icon: Palette, title: 'Brand Development', desc: 'Professional identity for contractors' },
        { icon: ShoppingBag, title: 'Digital Presence', desc: 'Website and SEO optimization' }
      ]
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <section id="services" className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive solutions for construction estimating, real estate media,
            technology integration, and strategic marketing.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid lg:grid-cols-2 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.category}
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
            >
              <div className={`bg-gradient-to-r ${service.color} p-6 text-white`}>
                <div className="flex items-center mb-4">
                  <service.icon className="h-8 w-8 mr-3" />
                  <h3 className="text-2xl font-bold">{service.category}</h3>
                </div>
                <p className="text-blue-100">{service.description}</p>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="grid gap-4 flex-grow">
                  {service.items.map((item, itemIndex) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.1 + itemIndex * 0.1, duration: 0.5 }}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <item.icon className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-gray-600 text-sm">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: index * 0.2 + 0.5, duration: 0.5 }}
                  className="mt-6 pt-4 border-t border-gray-200"
                >
                  <button className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center space-x-2">
                    <DollarSign className="h-4 w-4" />
                    <span>Request Estimate</span>
                  </button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}