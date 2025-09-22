'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, Calculator, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavigationProps {
  alwaysWhite?: boolean
}

export default function Navigation({ alwaysWhite = false }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    // Check initial scroll position
    handleScroll()

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: isHomePage ? '#services' : '/#services', label: 'Services' },
    { href: isHomePage ? '#about' : '/#about', label: 'About' },
    { href: '/gallery', label: 'Gallery', isPage: true },
    { href: '/tools', label: 'Tools', isPage: true },
    { href: isHomePage ? '#contact' : '/#contact', label: 'Contact' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-40 transition-all duration-300 ${
        isScrolled || alwaysWhite
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Calculator className={`h-8 w-8 ${isScrolled || alwaysWhite ? 'text-primary-600' : 'text-white'}`} />
            <span className={`text-xl font-bold ${isScrolled || alwaysWhite ? 'text-gray-900' : 'text-white'}`}>
              Pennkraft
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors duration-200 hover:text-primary-500 ${
                  isScrolled || alwaysWhite ? 'text-gray-700' : 'text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/portal"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span>Client Portal</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className={`md:hidden ${isScrolled || alwaysWhite ? 'text-gray-900' : 'text-white'}`}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white/95 backdrop-blur-md border-t"
        >
          <div className="px-4 py-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-gray-700 hover:text-primary-600 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/portal"
              className="block bg-primary-600 text-white px-4 py-2 rounded-lg text-center"
              onClick={() => setIsOpen(false)}
            >
              Client Portal
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}