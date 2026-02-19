'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { ApiCategory, ApiQuartier } from '@/types';

interface MapFiltersProps {
  categories: ApiCategory[];
  quartiers: ApiQuartier[];
  onFilterChange: (filters: FilterState) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export interface FilterState {
  categories: string[];
  quartiers: string[];
  minRating: number;
}

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  quartiers: [],
  minRating: 0,
};

export default function MapFilters({
  categories,
  quartiers,
  onFilterChange,
  isOpen = false,
  onClose,
}: MapFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const handleCategoryChange = (categoryId: string) => {
    const newFilters = {
      ...filters,
      categories: filters.categories.includes(categoryId)
        ? filters.categories.filter((c) => c !== categoryId)
        : [...filters.categories, categoryId],
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleQuartierChange = (quartierId: string) => {
    const newFilters = {
      ...filters,
      quartiers: filters.quartiers.includes(quartierId)
        ? filters.quartiers.filter((q) => q !== quartierId)
        : [...filters.quartiers, quartierId],
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRatingChange = (rating: number) => {
    const newFilters = { ...filters, minRating: rating };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    onFilterChange(DEFAULT_FILTERS);
  };

  return (
    <div
      className={`fixed left-4 top-4 z-20 bg-white rounded-lg shadow-lg p-6 max-w-sm transition-all ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-lg">Filtres</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Catégories */}
      <div className="mb-6">
        <h3 className="font-semibold text-sm mb-3 text-gray-700">Catégories</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat.value)}
                onChange={() => handleCategoryChange(cat.value)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">
                {cat.label}
                <span className="ml-1 text-xs text-gray-500">({cat.count})</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Quartiers */}
      <div className="mb-6">
        <h3 className="font-semibold text-sm mb-3 text-gray-700">Quartiers</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {quartiers.map((quartier) => (
            <label key={quartier.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.quartiers.includes(quartier.value)}
                onChange={() => handleQuartierChange(quartier.value)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">
                {quartier.label}
                <span className="ml-1 text-xs text-gray-500">({quartier.count})</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Note minimale */}
      <div className="mb-6">
        <h3 className="font-semibold text-sm mb-3 text-gray-700">Note minimale</h3>
        <div className="flex gap-2">
          {[0, 2, 3, 4].map((rating) => (
            <button
              key={rating}
              onClick={() => handleRatingChange(rating)}
              className={`px-3 py-1 rounded text-sm font-semibold transition ${
                filters.minRating === rating
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {rating === 0 ? 'Tous' : `${rating}+ ⭐`}
            </button>
          ))}
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-2">
        <button
          onClick={resetFilters}
          className="flex-1 px-4 py-2 rounded border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
}
