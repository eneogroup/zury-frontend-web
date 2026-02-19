'use client';

import { useState, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';

interface MapFiltersProps {
  categories: Array<{ id: string; name: string; count: number }>;
  neighborhoods: string[];
  onFilterChange: (filters: {
    categories: string[];
    neighborhoods: string[];
    search: string;
  }) => void;
}

export default function MapFilters({
  categories,
  neighborhoods,
  onFilterChange,
}: MapFiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Émettre les changements de filtres
  useEffect(() => {
    onFilterChange({
      categories: selectedCategories,
      neighborhoods: selectedNeighborhoods,
      search: searchQuery,
    });
  }, [selectedCategories, selectedNeighborhoods, searchQuery, onFilterChange]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleNeighborhood = (neighborhood: string) => {
    setSelectedNeighborhoods(prev =>
      prev.includes(neighborhood)
        ? prev.filter(n => n !== neighborhood)
        : [...prev, neighborhood]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedNeighborhoods([]);
    setSearchQuery('');
  };

  const hasActiveFilters = 
    selectedCategories.length > 0 || 
    selectedNeighborhoods.length > 0 || 
    searchQuery.length > 0;

  return (
    <div className="relative">
      {/* Bouton toggle filtres - Plus compact sur mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white hover:bg-gray-50 text-dark font-semibold px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-lg transition-all"
      >
        <Filter className="w-4 h-4 md:w-5 md:h-5" />
        <span className="text-sm md:text-base">Filtres</span>
        {hasActiveFilters && (
          <span className="bg-primary text-white text-xs font-bold px-1.5 md:px-2 py-0.5 rounded-full">
            {selectedCategories.length + selectedNeighborhoods.length + (searchQuery ? 1 : 0)}
          </span>
        )}
      </button>

      {/* Panel de filtres - Plein écran sur mobile */}
      {isOpen && (
        <>
          {/* Backdrop mobile */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="fixed inset-x-0 bottom-0 md:absolute md:top-14 md:left-0 md:inset-x-auto bg-white rounded-t-2xl md:rounded-lg shadow-2xl p-4 max-w-sm md:max-w-sm max-h-[85vh] md:max-h-[calc(100vh-120px)] overflow-y-auto z-50">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base md:text-lg text-dark">Filtrer la carte</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Recherche */}
            <div className="mb-4">
              <label className="block text-xs md:text-sm font-semibold text-dark mb-2">
                Rechercher
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nom de l'établissement..."
                  className="w-full px-3 py-2 pl-9 md:pl-10 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Catégories */}
            <div className="mb-4">
              <label className="block text-xs md:text-sm font-semibold text-dark mb-2">
                Catégories
              </label>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => toggleCategory(category.id)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="flex-1 text-xs md:text-sm text-dark">
                      {category.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({category.count})
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Quartiers */}
            {neighborhoods.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs md:text-sm font-semibold text-dark mb-2">
                  Quartiers
                </label>
                <div className="space-y-2 max-h-40 md:max-h-48 overflow-y-auto">
                  {neighborhoods.map((neighborhood) => (
                    <label
                      key={neighborhood}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedNeighborhoods.includes(neighborhood)}
                        onChange={() => toggleNeighborhood(neighborhood)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="flex-1 text-xs md:text-sm text-dark">
                        {neighborhood}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <button
                onClick={clearAllFilters}
                disabled={!hasActiveFilters}
                className="flex-1 px-3 py-2 text-xs md:text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Réinitialiser
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-3 py-2 text-xs md:text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Appliquer
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}