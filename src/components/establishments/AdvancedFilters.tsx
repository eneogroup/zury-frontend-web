'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFilters } from '@/hooks/useFilters';

export default function AdvancedFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories, quartiers, loading } = useFilters();
  
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isNeighborhoodOpen, setIsNeighborhoodOpen] = useState(true);
  const [isRatingOpen, setIsRatingOpen] = useState(false);

  const selectedCategories = searchParams.get('categorie')?.split(',') || [];
  const selectedNeighborhoods = searchParams.get('quartier')?.split(',') || [];
  const minRating = searchParams.get('minRating') || '';

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);
    let selected = [...selectedCategories];

    if (selected.includes(categoryId)) {
      selected = selected.filter((c) => c !== categoryId);
    } else {
      selected.push(categoryId);
    }

    if (selected.length > 0) {
      params.set('categorie', selected.join(','));
    } else {
      params.delete('categorie');
    }

    params.delete('page');
    router.push(`/explorer?${params.toString()}`);
  };

  const handleNeighborhoodChange = (quartierId: string) => {
    const params = new URLSearchParams(searchParams);
    let selected = [...selectedNeighborhoods];

    if (selected.includes(quartierId)) {
      selected = selected.filter((n) => n !== quartierId);
    } else {
      selected.push(quartierId);
    }

    if (selected.length > 0) {
      params.set('quartier', selected.join(','));
    } else {
      params.delete('quartier');
    }

    params.delete('page');
    router.push(`/explorer?${params.toString()}`);
  };

  const handleRatingChange = (rating: string) => {
    const params = new URLSearchParams(searchParams);

    if (rating) {
      params.set('minRating', rating);
    } else {
      params.delete('minRating');
    }

    params.delete('page');
    router.push(`/explorer?${params.toString()}`);
  };

  const handleReset = () => {
    router.push('/explorer');
  };

  const hasFilters = selectedCategories.length > 0 || selectedNeighborhoods.length > 0 || minRating;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <p className="text-gray-400">Chargement des filtres...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-dark">Filtres avancés</h3>
        {hasFilters && (
          <button
            onClick={handleReset}
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Catégories */}
      <div className="mb-6">
        <button
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          className="flex items-center justify-between w-full mb-3"
        >
          <span className="font-semibold text-dark">Catégorie</span>
          {isCategoryOpen ? (
            <ChevronUp className="w-5 h-5 text-gray" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray" />
          )}
        </button>

        {isCategoryOpen && (
          <div className="space-y-2">
            {categories.map((category) => (
              <label
                key={category.value}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.value)}
                  onChange={() => handleCategoryChange(category.value)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-dark flex-1">{category.label}</span>
                {category.count !== undefined && (
                  <span className="text-sm text-gray">({category.count})</span>
                )}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Quartiers */}
      <div className="mb-6">
        <button
          onClick={() => setIsNeighborhoodOpen(!isNeighborhoodOpen)}
          className="flex items-center justify-between w-full mb-3"
        >
          <span className="font-semibold text-dark">Quartier</span>
          {isNeighborhoodOpen ? (
            <ChevronUp className="w-5 h-5 text-gray" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray" />
          )}
        </button>

        {isNeighborhoodOpen && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {quartiers.map((quartier) => (
              <label
                key={quartier.value}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedNeighborhoods.includes(quartier.value)}
                  onChange={() => handleNeighborhoodChange(quartier.value)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-dark text-sm flex-1">{quartier.label}</span>
                {quartier.count !== undefined && (
                  <span className="text-xs text-gray">({quartier.count})</span>
                )}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Note minimale */}
      <div>
        <button
          onClick={() => setIsRatingOpen(!isRatingOpen)}
          className="flex items-center justify-between w-full mb-3"
        >
          <span className="font-semibold text-dark">Note min.</span>
          {isRatingOpen ? (
            <ChevronUp className="w-5 h-5 text-gray" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray" />
          )}
        </button>

        {isRatingOpen && (
          <div className="space-y-2">
            {['4.5', '4.0', '3.5', '3.0'].map((rating) => (
              <label
                key={rating}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <input
                  type="radio"
                  name="rating"
                  checked={minRating === rating}
                  onChange={() => handleRatingChange(rating)}
                  className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                />
                <span className="flex items-center gap-1 text-dark">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        'text-lg',
                        i < Math.floor(parseFloat(rating)) ? 'text-gold' : 'text-gray-300'
                      )}
                    >
                      ★
                    </span>
                  ))}
                  <span className="ml-1 text-sm">& plus</span>
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}