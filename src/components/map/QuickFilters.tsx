'use client';

interface QuickFiltersProps {
  onCategoryClick: (category: string) => void;
}

const QUICK_CATEGORIES = [
  { id: 'Restaurant', name: '🍽️ Restaurants', color: '#E63946' },
  { id: 'Bar', name: '🍺 Bars', color: '#F77F00' },
  { id: 'Hotel', name: '🏨 Hôtels', color: '#06B6D4' },
  { id: 'Lounge', name: '🎵 Lounges', color: '#8B5CF6' },
];

export default function QuickFilters({ onCategoryClick }: QuickFiltersProps) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
      <div className="flex gap-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg p-2">
        {QUICK_CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryClick(category.id)}
            className="px-4 py-2 rounded-full font-medium text-sm transition-all hover:scale-105 hover:shadow-md"
            style={{
              backgroundColor: `${category.color}20`,
              color: category.color,
            }}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}