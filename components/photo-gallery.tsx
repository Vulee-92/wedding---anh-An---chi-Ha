"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface PhotoGalleryProps {
  isOpen: boolean
  onClose: () => void
  photos: string[]
}

export default function PhotoGallery({ isOpen, onClose, photos }: PhotoGalleryProps) {
  const [showIntro, setShowIntro] = useState(true)
  const [showGallery, setShowGallery] = useState(false)
  const [currentPhoto, setCurrentPhoto] = useState(0)
  const [isClosing, setIsClosing] = useState(false)
  const [introFading, setIntroFading] = useState(false)

  // Create extended photo array for smooth infinite scroll
  const extendedPhotos = [...photos, ...photos, ...photos, ...photos, ...photos, ...photos, ...photos, ...photos]

  // Split extended photos into 3 columns
  const column1 = extendedPhotos.filter((_, index) => index % 3 === 0)
  const column2 = extendedPhotos.filter((_, index) => index % 3 === 1)
  const column3 = extendedPhotos.filter((_, index) => index % 3 === 2)

  useEffect(() => {
    if (isOpen) {
      setShowIntro(true)
      setShowGallery(false)
      setCurrentPhoto(0)
      setIsClosing(false)
      setIntroFading(false)

      // Start fading intro after 4.5 seconds
      const fadeTimer = setTimeout(() => {
        setIntroFading(true)
      }, 4500)

      // After 5 seconds, transition to gallery
      const timer = setTimeout(() => {
        setShowIntro(false)
        setTimeout(() => setShowGallery(true), 300)
      }, 5000)

      return () => {
        clearTimeout(fadeTimer)
        clearTimeout(timer)
      }
    }
  }, [isOpen])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 300)
  }

  const nextPhoto = () => {
    setCurrentPhoto((prev) => (prev + 1) % photos.length)
  }

  const prevPhoto = () => {
    setCurrentPhoto((prev) => (prev - 1 + photos.length) % photos.length)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") handleClose()
    if (e.key === "ArrowRight") nextPhoto()
    if (e.key === "ArrowLeft") prevPhoto()
  }

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 z-50 bg-black overflow-hidden transition-opacity duration-300 ${isClosing ? "opacity-0" : "opacity-100"}`}
    >
      {/* Close Button */}
      <Button
        onClick={handleClose}
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full backdrop-blur-sm transition-all duration-300"
      >
        <X className="w-6 h-6" />
      </Button>

      {/* Minimalist 3-Column Intro */}
      {showIntro && (
        <div
          className={`absolute inset-0 overflow-hidden bg-black transition-all duration-500 ${introFading ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
        >
          {/* Subtle center spotlight */}
          <div className="absolute inset-0 bg-gradient-radial from-white/5 via-transparent to-transparent animate-fade-in"></div>

          {/* Three Columns with Infinite Scroll */}
          <div className="flex h-full animate-fade-in">
            {/* Column 1 - Moving Up */}
            <div className="flex-1 flex flex-col space-y-2 sm:space-y-3 px-1 sm:px-2 animate-slide-up-infinite">
              {column1.map((photo, index) => (
                <div
                  key={`col1-${index}`}
                  className="relative w-full aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] rounded-lg overflow-hidden shadow-xl"
                  style={{
                    transform: `rotateX(3deg) rotateY(-5deg) rotateZ(1deg)`,
                    minHeight: "200px",
                    maxHeight: "400px",
                  }}
                >
                  <img
                    src={photo || "/placeholder.svg"}
                    alt={`Wedding photo ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
                  {/* Minimal border glow */}
                  <div className="absolute inset-0 border border-white/20 rounded-lg"></div>
                </div>
              ))}
            </div>

            {/* Column 2 - Moving Down */}
            <div className="flex-1 flex flex-col space-y-2 sm:space-y-3 px-1 sm:px-2 animate-slide-down-infinite">
              {column2.map((photo, index) => (
                <div
                  key={`col2-${index}`}
                  className="relative w-full aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] rounded-lg overflow-hidden shadow-xl"
                  style={{
                    transform: `rotateX(-2deg) rotateY(4deg) rotateZ(-1deg)`,
                    minHeight: "220px",
                    maxHeight: "420px",
                  }}
                >
                  <img
                    src={photo || "/placeholder.svg"}
                    alt={`Wedding photo ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tl from-white/10 via-transparent to-black/20"></div>
                  {/* Minimal border glow */}
                  <div className="absolute inset-0 border border-white/20 rounded-lg"></div>
                </div>
              ))}
            </div>

            {/* Column 3 - Moving Up (Delayed) */}
            <div className="flex-1 flex flex-col space-y-2 sm:space-y-3 px-1 sm:px-2 animate-slide-up-infinite-delayed">
              {column3.map((photo, index) => (
                <div
                  key={`col3-${index}`}
                  className="relative w-full aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] rounded-lg overflow-hidden shadow-xl"
                  style={{
                    transform: `rotateX(4deg) rotateY(6deg) rotateZ(-2deg)`,
                    minHeight: "200px",
                    maxHeight: "400px",
                  }}
                >
                  <img
                    src={photo || "/placeholder.svg"}
                    alt={`Wedding photo ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-bl from-white/10 via-transparent to-black/20"></div>
                  {/* Minimal border glow */}
                  <div className="absolute inset-0 border border-white/20 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Minimalist Loading Dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 animate-fade-in">
            <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse"></div>
            <div
              className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>

          {/* Floating particles for ambiance */}
          <div className="absolute inset-0 pointer-events-none animate-fade-in">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-0.5 bg-white/40 rounded-full animate-float-slow"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${4 + Math.random() * 2}s`,
                }}
              ></div>
            ))}
          </div>

          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/30 pointer-events-none"></div>
        </div>
      )}

      {/* Gallery Viewer */}
      {showGallery && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black transition-all duration-500 ${isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100 animate-fade-in"}`}
        >
          {/* Navigation Arrows */}
          <Button
            onClick={prevPhoto}
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 rounded-full z-10 backdrop-blur-sm transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>

          <Button
            onClick={nextPhoto}
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 rounded-full z-10 backdrop-blur-sm transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-8 h-8" />
          </Button>

          {/* Main Photo */}
          <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
            <div className="relative max-w-4xl max-h-full">
              <img
                src={photos[currentPhoto] || "/placeholder.svg"}
                alt={`Wedding photo ${currentPhoto + 1}`}
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl animate-scale-in transition-all duration-500"
                key={currentPhoto}
              />

              {/* Photo Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm transition-all duration-300">
                {currentPhoto + 1} / {photos.length}
              </div>
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/50 backdrop-blur-sm p-3 rounded-full max-w-xs sm:max-w-md overflow-x-auto transition-all duration-300">
            {photos.map((photo, index) => (
              <button
                key={index}
                onClick={() => setCurrentPhoto(index)}
                className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 flex-shrink-0 hover:scale-105 ${
                  index === currentPhoto ? "border-white scale-110" : "border-gray-500 hover:border-gray-300"
                }`}
              >
                <img
                  src={photo || "/placeholder.svg"}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Swipe Indicators for Mobile */}
          <div className="absolute top-1/2 left-8 transform -translate-y-1/2 text-white/50 animate-pulse sm:hidden transition-all duration-300">
            <div className="flex items-center space-x-1">
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs">Vuốt</span>
            </div>
          </div>
          <div className="absolute top-1/2 right-8 transform -translate-y-1/2 text-white/50 animate-pulse sm:hidden transition-all duration-300">
            <div className="flex items-center space-x-1">
              <span className="text-xs">Vuốt</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* Touch/Swipe Area for Mobile */}
      {showGallery && (
        <div
          className="absolute inset-0 sm:hidden"
          onTouchStart={(e) => {
            const touch = e.touches[0]
            const startX = touch.clientX

            const handleTouchEnd = (endEvent: TouchEvent) => {
              const endTouch = endEvent.changedTouches[0]
              const endX = endTouch.clientX
              const diff = startX - endX

              if (Math.abs(diff) > 50) {
                if (diff > 0) {
                  nextPhoto()
                } else {
                  prevPhoto()
                }
              }

              document.removeEventListener("touchend", handleTouchEnd)
            }

            document.addEventListener("touchend", handleTouchEnd)
          }}
        />
      )}
    </div>
  )
}
