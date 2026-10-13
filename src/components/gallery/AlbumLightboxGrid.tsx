'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, Maximize2, Download, Image as ImageIcon } from 'lucide-react'

interface GalleryItem {
  id: string
  title: string
  media_url: string
  created_at?: string
  description?: string | null
}

interface AlbumLightboxGridProps {
  items: GalleryItem[]
  eventTitle: string
}

export default function AlbumLightboxGrid({ items, eventTitle }: AlbumLightboxGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const handleOpen = (index: number) => {
    setSelectedIndex(index)
  }

  const handleClose = () => {
    setSelectedIndex(null)
  }

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return
    setSelectedIndex((prev) => (prev! > 0 ? prev! - 1 : items.length - 1))
  }, [selectedIndex, items.length])

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return
    setSelectedIndex((prev) => (prev! < items.length - 1 ? prev! + 1 : 0))
  }, [selectedIndex, items.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }

    if (selectedIndex !== null) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [selectedIndex, handlePrev, handleNext])

  if (!items || items.length === 0) {
    return (
      <div className="text-center p-16 bg-[#101827]/60 border border-border-color rounded-2xl backdrop-blur-md">
        <div className="h-20 w-20 rounded-2xl bg-secondary-bg/80 flex items-center justify-center mx-auto mb-4 border border-border-color">
          <ImageIcon className="h-10 w-10 text-muted-text opacity-50" />
        </div>
        <h3 className="text-xl font-heading font-bold text-primary-text mb-2">No Photos in this Album Yet</h3>
        <p className="text-secondary-text max-w-md mx-auto text-sm">
          Photos for {eventTitle} will be uploaded here soon. Check back shortly!
        </p>
      </div>
    )
  }

  const currentItem = selectedIndex !== null ? items[selectedIndex] : null

  return (
    <>
      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((item, index) => (
          <div
            key={item.id}
            onClick={() => handleOpen(index)}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer border border-border-color/80 bg-secondary-bg shadow-lg hover:border-primary-cyan/60 hover:shadow-[0_0_25px_rgba(0,217,255,0.2)] transition-all duration-300"
          >
            <img
              src={item.media_url}
              alt={item.title || `${eventTitle} photo ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {/* Overlay Gradient on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-white/90 truncate max-w-[80%] drop-shadow">
                  {item.title || `Photo ${index + 1}`}
                </span>
                <span className="h-8 w-8 rounded-full bg-primary-cyan/20 border border-primary-cyan/40 backdrop-blur-md flex items-center justify-center text-primary-cyan">
                  <Maximize2 className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && currentItem && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center animate-in fade-in duration-200"
          onClick={handleClose}
        >
          {/* Top Bar */}
          <div 
            className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-left">
              <h4 className="text-white font-heading font-semibold text-base sm:text-lg drop-shadow">
                {eventTitle}
              </h4>
              <p className="text-xs sm:text-sm text-secondary-text">
                Photo {selectedIndex + 1} of {items.length} {currentItem.title ? `• ${currentItem.title}` : ''}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={currentItem.media_url}
                target="_blank"
                rel="noreferrer"
                download
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="View original / Download"
              >
                <Download className="h-5 w-5" />
              </a>
              <button
                onClick={handleClose}
                className="p-2.5 rounded-full bg-white/10 hover:bg-functional-error/30 text-white hover:text-functional-error transition-colors"
                title="Close (Esc)"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Left Arrow */}
          {items.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handlePrev()
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/50 hover:bg-primary-cyan/30 text-white hover:text-primary-cyan border border-white/10 hover:border-primary-cyan/50 backdrop-blur-md transition-all z-20 group"
              title="Previous (Left arrow)"
            >
              <ChevronLeft className="h-6 w-6 group-hover:-translate-x-0.5 transition-transform" />
            </button>
          )}

          {/* Main Image Container */}
          <div 
            className="relative max-w-[92vw] max-h-[82vh] flex items-center justify-center p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentItem.media_url}
              alt={currentItem.title || `${eventTitle} preview`}
              className="max-w-full max-h-[82vh] object-contain rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10"
            />
          </div>

          {/* Right Arrow */}
          {items.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/50 hover:bg-primary-cyan/30 text-white hover:text-primary-cyan border border-white/10 hover:border-primary-cyan/50 backdrop-blur-md transition-all z-20 group"
              title="Next (Right arrow)"
            >
              <ChevronRight className="h-6 w-6 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}

          {/* Bottom Thumbnails Strip (Mobile & Desktop) */}
          {items.length > 1 && (
            <div 
              className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-[90vw] overflow-x-auto flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {items.map((thumb, idx) => (
                <button
                  key={thumb.id}
                  onClick={() => setSelectedIndex(idx)}
                  className={`h-12 w-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    idx === selectedIndex ? 'border-primary-cyan scale-105 shadow-[0_0_10px_rgba(0,217,255,0.5)]' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={thumb.media_url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
