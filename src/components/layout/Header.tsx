'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explorer?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:scale-105 transition-transform">
              ZURY
            </span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              href="/" 
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-all",
                isActive('/') 
                  ? "text-primary bg-primary/10" 
                  : "text-dark hover:text-primary hover:bg-primary/5"
              )}
            >
              Accueil
            </Link>
            <Link 
              href="/explorer" 
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-all",
                isActive('/explorer') 
                  ? "text-primary bg-primary/10" 
                  : "text-dark hover:text-primary hover:bg-primary/5"
              )}
            >
              Explorer
            </Link>
            <Link 
              href="/carte" 
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-all",
                isActive('/carte') 
                  ? "text-primary bg-primary/10" 
                  : "text-dark hover:text-primary hover:bg-primary/5"
              )}
            >
              Carte
            </Link>
            <Link 
              href="/evenements" 
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-all",
                isActive('/evenements') 
                  ? "text-primary bg-primary/10" 
                  : "text-dark hover:text-primary hover:bg-primary/5"
              )}
            >
              Événements
            </Link>
          </nav>

          {/* Barre de recherche */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray" />
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}