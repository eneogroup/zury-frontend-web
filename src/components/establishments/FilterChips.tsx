'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useFilters } from '@/hooks/useFilters';

const CATEGORY_EMOJIS: Record<string, string> = {
  'Restaurant': '🍽️',
  'Bar': '🍹',
  'Hôtel': '🏨',
  'Hotel': '🏨',
  'Lounge': '🎵',
  'Maquis': '🍖',
};

export default function FilterChips() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories, loading } = useFilters();
  
  const currentCategory = searchParams.get('categorie') || '';

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (!categoryId) {
      params.delete('categorie');
    } else {
      params.set('categorie', categoryId);
    }
    
    params.delete('page');
    router.push(`/explorer?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-dark">Catégories :</span>
        <div className="text-gray-400">Chargement...</div>
      </div>
    );
  }

  const allCategories = [
    { value: '', label: 'Tous', count: 0 },
    ...categories
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      <span className="text-sm font-semibold text-dark whitespace-nowrap mr-2">
        Catégories :
      </span>
      {allCategories.map((category) => {
        const isActive = currentCategory === category.value;
        const emoji = category.label === 'Tous' ? '🏘️' : CATEGORY_EMOJIS[category.label] || '📍';
        
        return (
          <button
            key={category.value || 'all'}
            onClick={() => handleCategoryChange(category.value)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all whitespace-nowrap shadow-sm",
              isActive
                ? "bg-primary text-white scale-105"
                : "bg-white text-dark border border-gray-200 hover:border-primary hover:shadow-md"
            )}
          >
            <span>{emoji}</span>
            {category.label}
          </button>
        );
      })}
    </div>
  );
}