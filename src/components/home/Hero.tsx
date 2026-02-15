'use client';

import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { heroImages } from '@/lib/mockData';

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  // Auto-slide du carousel toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explorer?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      {/* Carousel d'images en arrière-plan */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${heroImages[currentImageIndex]})`,
            }}
          />
          {/* Overlay sombre avec gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-dark/30 via-dark/30 to-dark/30" />
        </motion.div>
      </AnimatePresence>

      {/* Contenu par-dessus */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
        {/* Titre avec animation */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white drop-shadow-lg"
        >
          Découvrez les meilleurs lieux
          <br />
          de Brazzaville
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-white/90 mb-8 drop-shadow-md"
        >
          Restaurants · Bars · Hôtels · Événements
        </motion.p>

        {/* Barre de recherche avec effet glassmorphism */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          onSubmit={handleSearch}
          className="max-w-2xl mx-auto"
        >
          <div className="relative backdrop-blur-md bg-white/10 rounded-2xl p-2 shadow-2xl border border-white/20">
            <input
              type="text"
              placeholder="Rechercher un restaurant, bar, hôtel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-32 py-4 rounded-xl bg-white text-dark text-lg focus:outline-none shadow-lg placeholder:text-gray-400"
            />
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray" />
            <button
              type="submit"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              Rechercher
            </button>
          </div>
        </motion.form>
      </div>

      {/* Indicateurs du carousel */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentImageIndex
                ? 'w-8 bg-white'
                : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Image ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}