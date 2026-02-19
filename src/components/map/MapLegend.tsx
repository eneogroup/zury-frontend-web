'use client';

interface MapLegendProps {
  categories: Array<{
    name: string;
    color: string;
    count: number;
  }>;
}

export default function MapLegend({ categories }: MapLegendProps) {
  return (
    <div className="absolute bottom-4 right-4 z-10 bg-white rounded-lg shadow-lg p-4 max-w-xs">
      <h3 className="text-sm font-bold text-dark mb-3">Légende</h3>
      <div className="space-y-2">
        {categories.map((category, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full border-2 border-white shadow"
              style={{ backgroundColor: category.color }}
            />
            <span className="text-sm text-gray-700">
              {category.name}
            </span>
            <span className="text-xs text-gray-500 ml-auto">
              ({category.count})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}