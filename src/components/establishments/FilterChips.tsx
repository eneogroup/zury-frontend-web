'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

const categories = [
  { id: 'all', label: 'Tous', emoji: '🏘️', apiValue: null },
  { id: 'restaurant', label: 'Restaurant', emoji: '🍽️', apiValue: 'Restaurant' },
  { id: 'bar', label: 'Bar', emoji: '🍹', apiValue: 'Bar' },
  { id: 'hotel', label: 'Hôtel', emoji: '🏨', apiValue: 'Hôtel' },
  { id: 'lounge', label: 'Lounge', emoji: '🎵', apiValue: 'Lounge' },
];

export default function FilterChips() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);
    
    const category = categories.find(c => c.id === categoryId);
    
    if (categoryId === 'all' || !category?.apiValue) {
      params.delete('category');
    } else {
      params.set('category', category.apiValue);
    }
    
    params.delete('page');
    
    router.push(`/explorer?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      <span className="text-sm font-semibold text-dark whitespace-nowrap mr-2">
        Catégories :
      </span>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryChange(category.id)}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all whitespace-nowrap shadow-sm",
            currentCategory === category.id || 
            (currentCategory === category.apiValue)
              ? "bg-primary text-white scale-105"
              : "bg-white text-dark border border-gray-200 hover:border-primary hover:shadow-md"
          )}
        >
          <span>{category.emoji}</span>
          {category.label}
        </button>
      ))}
    </div>
  );
}