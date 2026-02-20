'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

const heroImages = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070', // Restaurant
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2074', // Restaurant intérieur
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2074', // Bar/nightlife
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=2070', // Food
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2074', // Restaurant extérieur
];

interface HeroProps {
  stats?: any;
}

export default function Hero({ stats }: HeroProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change toutes les 5 secondes

    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explorer?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/explorer');
    }
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  return (
    <div className="relative  min-h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* Carousel d'images de fond */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${image}')` }}
            />
          </div>
        ))}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark/80 via-dark/60 to-dark/40" />
      </div>

      {/* Boutons de navigation du carousel */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all"
        aria-label="Image précédente"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all"
        aria-label="Image suivante"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicateurs de slides */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide 
                ? 'w-8 bg-white' 
                : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Aller à l'image ${index + 1}`}
          />
        ))}
      </div>

      {/* Contenu */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Titre principal */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Où voulez-vous sortir ?
          </h1>
          <p className="text-xl text-white/90">
            Découvrez les meilleurs restaurants, bars et événements de Brazzaville
          </p>
        </div>

        {/* Onglets de catégories */}
        <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setCategory('all')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
              category === 'all'
                ? 'bg-white text-dark shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
            }`}
          >
            <MapPin className="w-5 h-5" />
            Tous les établissements
          </button>
          <button
            onClick={() => setCategory('restaurant')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
              category === 'restaurant'
                ? 'bg-white text-dark shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
            }`}
          >
            🍽️ Restaurants
          </button>
          <button
            onClick={() => setCategory('bar')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
              category === 'bar'
                ? 'bg-white text-dark shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
            }`}
          >
            🍹 Bars
          </button>
          <button
            onClick={() => setCategory('hotel')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
              category === 'hotel'
                ? 'bg-white text-dark shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
            }`}
          >
            🏨 Hôtels
          </button>
          <button
            onClick={() => setCategory('event')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
              category === 'event'
                ? 'bg-white text-dark shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
            }`}
          >
            🎉 Événements
          </button>
        </div>

        {/* Barre de recherche principale */}
        <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-2">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
            {/* Recherche */}
            <div className="md:col-span-5 flex items-center gap-3 px-4 py-3 border-r border-gray-200">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un restaurant, bar, hôtel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none text-dark placeholder:text-gray-400"
              />
            </div>

            {/* Quartier */}
            <div className="md:col-span-3 flex items-center gap-3 px-4 py-3 border-r border-gray-200">
              <MapPin className="w-5 h-5 text-gray-400" />
              <select className="flex-1 outline-none text-dark bg-transparent cursor-pointer">
                <option value="">Tous les quartiers</option>
                <option value="centre-ville">Centre-ville</option>
                <option value="poto-poto">Poto-Poto</option>
                <option value="bacongo">Bacongo</option>
                <option value="moungali">Moungali</option>
              </select>
            </div>

            {/* Date/Personnes (optionnel) */}
            <div className="md:col-span-2 flex items-center gap-3 px-4 py-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-dark">Aujourd'hui</span>
            </div>

            {/* Bouton de recherche */}
            <div className="md:col-span-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full h-full text-lg"
              >
                Rechercher
              </Button>
            </div>
          </div>
        </form>

        {/* Stats rapides */}
        {/* Stats rapides */}
        {stats && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.etablissements.total}+</div>
              <div className="text-sm text-white/80">Établissements</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.events.total_a_venir}+</div>
              <div className="text-sm text-white/80">Événements à venir</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">50+</div>
              <div className="text-sm text-white/80">Utilisateurs</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// {stats.utilisateurs.total_installations}