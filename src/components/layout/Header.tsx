'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'Explorer', href: '/explorer' },
  { name: 'Carte', href: '/carte' },
  { name: 'Evenements', href: '/evenements' },
  { href: '/rejoindre-zury', name: 'Devenir partenaire' },
  { href: '/eneo-academy', name: 'Eneo Academy' },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      // Fermer le menu mobile si ouvert
      setMobileMenuOpen(false);
      
      // Rediriger vers Explorer avec le terme de recherche
      router.push(`/explorer?q=${encodeURIComponent(searchQuery.trim())}`);
      
      // Reset du champ de recherche
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-dark text-white shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
          {/* Logo Image */}
            <img
              className="h-28 w-auto"
              src="/logo.png"
              alt="ZURY"
            />
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors relative py-2',
                    isActive
                      ? 'text-primary'
                      : 'text-white/80 hover:text-primary'
                  )}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Recherche Desktop */}
          <div className="hidden md:block flex-1 max-w-xs ml-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="w-full bg-white/10 text-white placeholder-white/60 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white/20 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-primary transition-colors"
                aria-label="Rechercher"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Bouton menu mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            {/* Recherche Mobile */}
            <form onSubmit={handleSearch} className="mb-4 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="w-full bg-white/10 text-white placeholder-white/60 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white/20 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-primary transition-colors"
                aria-label="Rechercher"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>

            {/* Navigation Mobile */}
            <div className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'block px-4 py-2 rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-white/80 hover:bg-white/10'
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}