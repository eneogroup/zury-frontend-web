'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explorer?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">YAKALA</span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-dark hover:text-primary font-medium transition-colors"
            >
              Accueil
            </Link>
            <Link 
              href="/explorer" 
              className="text-dark hover:text-primary font-medium transition-colors"
            >
              Explorer
            </Link>
            <Link 
              href="/carte" 
              className="text-dark hover:text-primary font-medium transition-colors"
            >
              Carte
            </Link>
            <Link 
              href="/evenements" 
              className="text-dark hover:text-primary font-medium transition-colors"
            >
              Événements
            </Link>
          </nav>

          {/* Barre de recherche (optionnelle dans le header) */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray" />
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}