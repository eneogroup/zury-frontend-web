'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

const periods = [
  { label: 'Tout', value: 'all' },
  { label: "Aujourd'hui", value: 'today' },
  { label: 'Ce weekend', value: 'weekend' },
  { label: 'Cette semaine', value: 'week' },
  { label: 'Ce mois', value: 'month' },
];

export default function EventFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPeriod = searchParams.get('period') || 'all';

  const handleFilterChange = (period: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (period === 'all') {
      params.delete('period');
    } else {
      params.set('period', period);
    }
    
    // Réinitialiser la pagination quand on change de filtre
    params.delete('page');
    
    router.push(`/evenements?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2">
      <span className="text-sm font-medium text-dark whitespace-nowrap">Période :</span>
      <div className="flex gap-2">
        {periods.map((period) => (
          <button
            key={period.value}
            onClick={() => handleFilterChange(period.value)}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap",
              currentPeriod === period.value
                ? "bg-primary text-white shadow-md"
                : "bg-white text-gray border border-gray-200 hover:border-primary hover:text-primary"
            )}
          >
            {period.label}
          </button>
        ))}
      </div>
    </div>
  );
}