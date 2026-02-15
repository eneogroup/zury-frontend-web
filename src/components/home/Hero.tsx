'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explorer?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-dark to-primary text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Titre */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          Découvrez les meilleurs lieux
          <br />
          de Brazzaville
        </h1>
        
        <p className="text-lg md:text-xl text-light mb-8">
          Restaurants · Bars · Hôtels · Événements
        </p>

        {/* Barre de recherche */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un restaurant, bar, hôtel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-32 py-4 rounded-lg text-dark text-lg focus:outline-none focus:ring-4 focus:ring-accent shadow-lg"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Rechercher
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}