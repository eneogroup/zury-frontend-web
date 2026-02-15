'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

const periods = [
  { label: 'Tout', value: '' },
  { label: 'Aujourd\'hui', value: 'today' },
  { label: 'Ce weekend', value: 'weekend' },
  { label: 'Cette semaine', value: 'week' },
  { label: 'Ce mois', value: 'month' },
];

export default function EventFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPeriod = searchParams.get('period') || '';

  const handlePeriodClick = (value: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (value) {
      params.set('period', value);
    } else {
      params.delete('period');
    }
    
    router.push(`/evenements?${params.toString()}`);
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => handlePeriodClick(period.value)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
            currentPeriod === period.value
              ? 'bg-primary text-white'
              : 'bg-white text-dark border border-gray-300 hover:border-primary'
          )}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}