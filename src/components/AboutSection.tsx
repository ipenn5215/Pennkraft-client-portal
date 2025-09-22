'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Award, Clock, Users, Target, CheckCircle } from 'lucide-react'

export default function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const stats = [
    { icon: Award, number: '500+', label: 'Projects Completed', color: 'text-blue-500' },
    { icon: Clock, number: '10+', label: 'Years Experience', color: 'text-green-500' },
    { icon: Users, number: '200+', label: 'Satisfied Clients', color: 'text-purple-500' },
    { icon: Target, number: '98%', label: 'Accuracy Rate', color: 'text-orange-500' }
  ]

  const features = [
    'Prevailing wage compliance expertise',
    'Fast turnaround times',
    'Detailed, itemized estimates',
    'Multiple trade specializations',
    'Technology-driven solutions'
  ]

  return (
    <section id="about" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Pennkraft?
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              With over a decade of experience in construction estimating and technology integration,
              we deliver precise, reliable solutions that help contractors and property owners make
              informed decisions with confidence.
            </p>

            <div className="grid gap-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="bg-gradient-to-r from-primary-50 to-blue-50 p-6 rounded-xl"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Our Mission
              </h3>
              <p className="text-gray-600">
                To revolutionize the construction industry through innovative technology,
                precise estimating, and exceptional service that empowers our clients
                to build with confidence and success.
              </p>
            </motion.div>
          </motion.div>

          {/* Right side - Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow duration-300"
              >
                <stat.icon className={`h-8 w-8 mx-auto mb-4 ${stat.color}`} />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: index * 0.2 + 0.3, duration: 0.5, type: "spring" }}
                  className="text-3xl font-bold text-gray-900 mb-2"
                >
                  {stat.number}
                </motion.div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="col-span-2 bg-gradient-to-br from-primary-600 to-primary-700 p-6 rounded-xl text-white text-center"
            >
              <h3 className="text-xl font-bold mb-2">Ready to Get Started?</h3>
              <p className="text-primary-100 mb-4">
                Join hundreds of satisfied clients who trust Pennkraft for their estimating needs.
              </p>
              <button className="bg-white text-primary-600 px-6 py-2 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200">
                Get Your Estimate
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}