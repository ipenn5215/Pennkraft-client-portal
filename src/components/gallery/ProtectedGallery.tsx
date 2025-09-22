'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Shield,
  Lock,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2
} from 'lucide-react'
import Image from 'next/image'

interface MediaItem {
  id: string
  type: 'image' | 'video'
  src: string
  thumbnail: string
  title: string
  description?: string
  category?: string
  date?: string
  protected?: boolean
  watermarkPosition?: 'center' | 'bottom-right' | 'top-left' | 'diagonal'
}

interface ProtectedGalleryProps {
  items: MediaItem[]
  categories?: string[]
  watermark?: string
  allowDownload?: boolean
  requireAuth?: boolean
  isAuthenticated?: boolean
}

export default function ProtectedGallery({
  items,
  categories = [],
  watermark = 'Pennkraft © 2025',
  allowDownload = false,
  requireAuth = false,
  isAuthenticated = false
}: ProtectedGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Filter items by category
  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter(item => item.category === selectedCategory)

  // Disable right-click context menu
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('.protected-media')) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }

    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('.protected-media')) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('dragstart', handleDragStart)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('dragstart', handleDragStart)
    }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedItem) return

      switch (e.key) {
        case 'Escape':
          setSelectedItem(null)
          break
        case 'ArrowLeft':
          navigateImage('prev')
          break
        case 'ArrowRight':
          navigateImage('next')
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedItem, selectedIndex])

  const navigateImage = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev'
      ? (selectedIndex - 1 + filteredItems.length) % filteredItems.length
      : (selectedIndex + 1) % filteredItems.length

    setSelectedIndex(newIndex)
    setSelectedItem(filteredItems[newIndex])
  }

  const openLightbox = (item: MediaItem, index: number) => {
    if (requireAuth && !isAuthenticated && item.protected) {
      alert('Please login to view full-quality media')
      return
    }
    setSelectedItem(item)
    setSelectedIndex(index)
  }

  const renderWatermark = (position: string = 'center') => {
    const baseClasses = "absolute text-white/40 font-bold text-lg select-none pointer-events-none"

    switch (position) {
      case 'center':
        return (
          <div className={`${baseClasses} inset-0 flex items-center justify-center text-3xl`}>
            {watermark}
          </div>
        )
      case 'bottom-right':
        return (
          <div className={`${baseClasses} bottom-4 right-4`}>
            {watermark}
          </div>
        )
      case 'top-left':
        return (
          <div className={`${baseClasses} top-4 left-4`}>
            {watermark}
          </div>
        )
      case 'diagonal':
        return (
          <div className={`${baseClasses} inset-0 flex items-center justify-center transform rotate-45 text-4xl opacity-20`}>
            <div className="whitespace-nowrap">{watermark} {watermark} {watermark}</div>
          </div>
        )
      default:
        return null
    }
  }

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="gallery-container">
      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedCategory === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <div
              className="relative aspect-square cursor-pointer protected-media"
              onClick={() => openLightbox(item, index)}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            >
              {/* Thumbnail */}
              <div className="relative w-full h-full">
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  className="object-cover select-none"
                  draggable={false}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />

                {/* Watermark Overlay */}
                {renderWatermark('bottom-right')}

                {/* Protection Badge */}
                {item.protected && (
                  <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm p-2 rounded-lg">
                    <Lock className="h-4 w-4 text-white" />
                  </div>
                )}

                {/* Video Play Button */}
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/50 backdrop-blur-sm p-4 rounded-full">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="text-white">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-gray-200 mt-1">{item.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <div
              className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="h-6 w-6 text-white" />
              </button>

              {/* Navigation Buttons */}
              <button
                onClick={() => navigateImage('prev')}
                className="absolute left-4 z-10 p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>

              <button
                onClick={() => navigateImage('next')}
                className="absolute right-4 z-10 p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>

              {/* Media Content */}
              <div className="relative protected-media max-w-full max-h-full">
                {selectedItem.type === 'image' ? (
                  <div className="relative">
                    <img
                      src={selectedItem.src}
                      alt={selectedItem.title}
                      className="max-w-full max-h-[80vh] object-contain select-none"
                      draggable={false}
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                    />
                    {renderWatermark(selectedItem.watermarkPosition || 'diagonal')}
                  </div>
                ) : (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      src={selectedItem.src}
                      className="max-w-full max-h-[80vh] object-contain"
                      controls={false}
                      onContextMenu={(e) => e.preventDefault()}
                    />
                    {renderWatermark(selectedItem.watermarkPosition || 'diagonal')}

                    {/* Video Controls */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-black/50 backdrop-blur-sm p-3 rounded-full">
                      <button
                        onClick={toggleVideo}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="h-5 w-5 text-white" />
                        ) : (
                          <Play className="h-5 w-5 text-white" />
                        )}
                      </button>
                      <button
                        onClick={toggleMute}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                      >
                        {isMuted ? (
                          <VolumeX className="h-5 w-5 text-white" />
                        ) : (
                          <Volume2 className="h-5 w-5 text-white" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Info Panel */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h2 className="text-2xl font-bold text-white mb-2">{selectedItem.title}</h2>
                {selectedItem.description && (
                  <p className="text-gray-200">{selectedItem.description}</p>
                )}
                {selectedItem.date && (
                  <p className="text-gray-400 text-sm mt-2">{selectedItem.date}</p>
                )}

                {/* Protection Notice */}
                <div className="flex items-center mt-4 text-yellow-400 text-sm">
                  <Shield className="h-4 w-4 mr-2" />
                  <span>This media is protected by copyright</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS for additional protection */}
      <style jsx global>{`
        .protected-media {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        .protected-media img,
        .protected-media video {
          pointer-events: none;
          -webkit-user-drag: none;
          -khtml-user-drag: none;
          -moz-user-drag: none;
          -o-user-drag: none;
          user-drag: none;
        }
      `}</style>
    </div>
  )
}