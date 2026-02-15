'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

const categories = [
  { label: 'Tous', value: '' },
  { label: 'Restaurant', value: 'restaurant' },
  { label: 'Bar', value: 'bar' },
  { label: 'Hôtel', value: 'hotel' },
  { label: 'Lounge', value: 'lounge' },
];

const neighborhoods = [
  'Bacongo',
  'Centre-ville',
  'Poto-Poto',
  'Moungali',
  'Djiri',
];

export default function FilterChips() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || '';

  const handleCategoryClick = (value: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (value) {
      params.set('category', value);
    } else {
      params.delete('category');
    }
    
    router.push(`/explorer?${params.toString()}`);
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => handleCategoryClick(category.value)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
            currentCategory === category.value
              ? 'bg-primary text-white'
              : 'bg-white text-dark border border-gray-300 hover:border-primary'
          )}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}