'use client';

import { useState } from 'react';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageGalleryProps {
  images: string[];
  name: string;
}

export default function ImageGallery({ images, name }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      {/* Galerie normale */}
      <div className="relative w-full h-[500px] bg-dark overflow-hidden">
        <ImageWithFallback
          src={images[currentIndex]}
          alt={`${name} - Photo ${currentIndex + 1}`}
          fill
          className="object-cover"
        />

        {/* Overlay gradient en bas */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark/60 to-transparent" />

        {/* Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10 backdrop-blur-sm"
              aria-label="Image précédente"
            >
              <ChevronLeft className="w-6 h-6 text-dark" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10 backdrop-blur-sm"
              aria-label="Image suivante"
            >
              <ChevronRight className="w-6 h-6 text-dark" />
            </button>

            {/* Indicateurs */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-white'
                      : 'w-2 bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Image ${index + 1}`}
                />
              ))}
            </div>

            {/* Compteur et fullscreen */}
            <div className="absolute top-6 right-6 flex items-center gap-3 z-10">
              <div className="bg-dark/70 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                {currentIndex + 1} / {images.length}
              </div>
              <button
                onClick={() => setIsFullscreen(true)}
                className="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all backdrop-blur-sm"
                aria-label="Plein écran"
              >
                <Maximize2 className="w-5 h-5 text-dark" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modal fullscreen */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          >
            {/* Image */}
            <div className="relative w-full h-full">
              <ImageWithFallback
                src={images[currentIndex]}
                alt={`${name} - Photo ${currentIndex + 1}`}
                fill
                className="object-contain"
              />
            </div>

            {/* Bouton fermer */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-sm transition-all"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation fullscreen */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-4 rounded-full backdrop-blur-sm transition-all"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-4 rounded-full backdrop-blur-sm transition-all"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>

                {/* Compteur */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}