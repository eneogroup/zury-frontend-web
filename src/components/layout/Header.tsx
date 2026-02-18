'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const navItems = [
    { href: '/', label: 'Accueil' },
    { href: '/explorer', label: 'Explorer' },
    { href: '/carte', label: 'Carte' },
    { href: '/evenements', label: 'Événements' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-dark shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-white">
              ZURY
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "font-medium transition-colors",
                  pathname === item.href
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-white/80 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Barre de recherche (desktop uniquement, pas sur home) */}
          {!isHomePage && (
            <div className="hidden lg:flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Search className="w-4 h-4 text-white/60" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="bg-transparent outline-none text-white placeholder:text-white/60 w-48"
              />
            </div>
          )}

          {/* Mobile menu button */}
          <button className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}