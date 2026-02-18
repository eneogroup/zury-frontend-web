'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X, MapPin } from 'lucide-react';
import { searchService } from '@/lib/api';

interface SearchBarProps {
  initialQuery?: string;
}

export default function SearchBar({ initialQuery = '' }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(initialQuery || '');
  }, [initialQuery]);

  // Fermer les suggestions en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Recherche autocomplete
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchService.autocomplete(query, 5);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const params = new URLSearchParams(searchParams);
    params.set('q', searchQuery.trim());
    params.delete('page');
    
    setShowSuggestions(false);
    router.push(`/explorer?${params.toString()}`);
  };

  const handleSuggestionClick = (suggestion: any) => {
    // Si c'est un établissement, aller directement sur sa page
    if (suggestion.type === 'establishment') {
      router.push(`/establishments/${suggestion.id}`);
    } else {
      performSearch(suggestion.nom);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    
    const params = new URLSearchParams(searchParams);
    params.delete('q');
    params.delete('page');
    
    router.push(`/explorer?${params.toString()}`);
  };

  return (
    <div ref={searchRef} className="mb-8 relative">
      <form onSubmit={handleSearch}>
        <div className="relative max-w-3xl">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setShowSuggestions(true)}
            placeholder="Rechercher un établissement..."
            className="w-full px-6 py-4 pr-24 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent text-lg shadow-sm"
          />
          
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-20 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Effacer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-6 py-2 rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium"
          >
            <Search className="w-5 h-5" />
            <span className="hidden sm:inline">Rechercher</span>
          </button>
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 max-w-3xl mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
          <div className="p-2">
            {isLoading ? (
              <div className="px-4 py-3 text-gray-400 text-sm">Recherche...</div>
            ) : (
              suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-light rounded-xl transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-dark truncate">{suggestion.nom}</p>
                    {suggestion.quartier && (
                      <p className="text-sm text-gray truncate">{suggestion.quartier}</p>
                    )}
                  </div>
                  {suggestion.categorie && (
                    <span className="text-xs text-gray bg-gray-100 px-2 py-1 rounded">
                      {suggestion.categorie}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}