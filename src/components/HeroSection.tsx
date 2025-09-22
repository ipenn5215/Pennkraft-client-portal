'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Calculator, Camera, Cpu, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function HeroSection() {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-20 right-10 w-48 h-48 bg-white/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, 20, 0],
            opacity: [0.05, 0.15, 0.05]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
          className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={staggerChildren}
          initial="initial"
          animate="animate"
          className="text-white"
        >
          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            Professional{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-200">
              Estimating
            </span>
            <br />
            & Tech Solutions
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto leading-relaxed"
          >
            Expert construction estimates, real estate photography, and AI-powered tech integration.
            Serving residential & commercial projects with precision and innovation.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link
              href="/portal"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-all duration-300 flex items-center justify-center space-x-2 group"
            >
              <span>Get Started</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <a
              href="#services"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300"
            >
              Our Services
            </a>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <Calculator className="h-8 w-8 mx-auto mb-3 text-primary-200" />
              <h3 className="font-semibold mb-1">Estimating</h3>
              <p className="text-sm text-primary-200">Construction Trades</p>
            </div>
            <div className="text-center">
              <Camera className="h-8 w-8 mx-auto mb-3 text-primary-200" />
              <h3 className="font-semibold mb-1">Photography</h3>
              <p className="text-sm text-primary-200">Real Estate Media</p>
            </div>
            <div className="text-center">
              <Cpu className="h-8 w-8 mx-auto mb-3 text-primary-200" />
              <h3 className="font-semibold mb-1">Tech Solutions</h3>
              <p className="text-sm text-primary-200">AI Integration</p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-3 text-primary-200" />
              <h3 className="font-semibold mb-1">Marketing</h3>
              <p className="text-sm text-primary-200">Brand Strategy</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-3 bg-white/50 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}