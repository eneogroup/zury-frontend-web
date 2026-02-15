'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const categories = [
  { label: 'Restaurant', value: 'restaurant' },
  { label: 'Bar', value: 'bar' },
  { label: 'Hôtel', value: 'hotel' },
  { label: 'Lounge', value: 'lounge' },
];

const neighborhoods = [
  { label: 'Bacongo', value: 'Bacongo' },
  { label: 'Centre-ville', value: 'Centre-ville' },
  { label: 'Poto-Poto', value: 'Poto-Poto' },
  { label: 'Moungali', value: 'Moungali' },
  { label: 'Djiri', value: 'Djiri' },
];

const minRatings = [
  { label: '5 étoiles', value: 5, stars: 5 },
  { label: '4+ étoiles', value: 4, stars: 4 },
  { label: '3+ étoiles', value: 3, stars: 3 },
];

export default function AdvancedFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category')?.split(',').filter(Boolean) || []
  );
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>(
    searchParams.get('neighborhood')?.split(',').filter(Boolean) || []
  );
  const [selectedMinRating, setSelectedMinRating] = useState<number>(
    Number(searchParams.get('minRating')) || 0
  );

  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isNeighborhoodOpen, setIsNeighborhoodOpen] = useState(true);
  const [isRatingOpen, setIsRatingOpen] = useState(true);

  const handleCategoryToggle = (value: string) => {
    const newCategories = selectedCategories.includes(value)
      ? selectedCategories.filter(c => c !== value)
      : [...selectedCategories, value];
    
    setSelectedCategories(newCategories);
    updateURL({ categories: newCategories });
  };

  const handleNeighborhoodToggle = (value: string) => {
    const newNeighborhoods = selectedNeighborhoods.includes(value)
      ? selectedNeighborhoods.filter(n => n !== value)
      : [...selectedNeighborhoods, value];
    
    setSelectedNeighborhoods(newNeighborhoods);
    updateURL({ neighborhoods: newNeighborhoods });
  };

  const handleRatingSelect = (value: number) => {
    const newRating = selectedMinRating === value ? 0 : value;
    setSelectedMinRating(newRating);
    updateURL({ minRating: newRating });
  };

  const updateURL = ({ 
    categories, 
    neighborhoods, 
    minRating 
  }: { 
    categories?: string[], 
    neighborhoods?: string[], 
    minRating?: number 
  }) => {
    const params = new URLSearchParams(searchParams);
    
    // Update categories
    if (categories !== undefined) {
      if (categories.length > 0) {
        params.set('category', categories.join(','));
      } else {
        params.delete('category');
      }
    }

    // Update neighborhoods
    if (neighborhoods !== undefined) {
      if (neighborhoods.length > 0) {
        params.set('neighborhood', neighborhoods.join(','));
      } else {
        params.delete('neighborhood');
      }
    }

    // Update min rating
    if (minRating !== undefined) {
      if (minRating > 0) {
        params.set('minRating', minRating.toString());
      } else {
        params.delete('minRating');
      }
    }

    router.push(`/explorer?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedNeighborhoods([]);
    setSelectedMinRating(0);
    const params = new URLSearchParams(searchParams);
    params.delete('category');
    params.delete('neighborhood');
    params.delete('minRating');
    router.push(`/explorer?${params.toString()}`);
  };

  const hasActiveFilters = selectedCategories.length > 0 || 
                          selectedNeighborhoods.length > 0 || 
                          selectedMinRating > 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-28">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-dark">Filtres avancés</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Catégorie */}
      <div className="mb-6">
        <button
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          className="flex items-center justify-between w-full mb-3 text-dark font-semibold"
        >
          <span>Catégorie</span>
          {isCategoryOpen ? (
            <ChevronUp className="w-5 h-5 text-gray" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray" />
          )}
        </button>

        <AnimatePresence>
          {isCategoryOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-2 overflow-hidden"
            >
              {categories.map((category) => (
                <label
                  key={category.value}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.value)}
                    onChange={() => handleCategoryToggle(category.value)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-gray group-hover:text-dark transition-colors">
                    {category.label}
                  </span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quartier */}
      <div className="mb-6">
        <button
          onClick={() => setIsNeighborhoodOpen(!isNeighborhoodOpen)}
          className="flex items-center justify-between w-full mb-3 text-dark font-semibold"
        >
          <span>Quartier</span>
          {isNeighborhoodOpen ? (
            <ChevronUp className="w-5 h-5 text-gray" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray" />
          )}
        </button>

        <AnimatePresence>
          {isNeighborhoodOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-2 overflow-hidden"
            >
              {neighborhoods.map((neighborhood) => (
                <label
                  key={neighborhood.value}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedNeighborhoods.includes(neighborhood.value)}
                    onChange={() => handleNeighborhoodToggle(neighborhood.value)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-gray group-hover:text-dark transition-colors">
                    {neighborhood.label}
                  </span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Note minimale */}
      <div>
        <button
          onClick={() => setIsRatingOpen(!isRatingOpen)}
          className="flex items-center justify-between w-full mb-3 text-dark font-semibold"
        >
          <span>Note min.</span>
          {isRatingOpen ? (
            <ChevronUp className="w-5 h-5 text-gray" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray" />
          )}
        </button>

        <AnimatePresence>
          {isRatingOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-2 overflow-hidden"
            >
              {minRatings.map((rating) => (
                <button
                  key={rating.value}
                  onClick={() => handleRatingSelect(rating.value)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
                    selectedMinRating === rating.value
                      ? "bg-primary/10 border border-primary/30"
                      : "hover:bg-light"
                  )}
                >
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          "text-lg",
                          i < rating.stars ? "text-gold" : "text-gray-300"
                        )}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}