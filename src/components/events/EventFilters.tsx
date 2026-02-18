'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

const periods = [
  { id: 'all', label: 'Tout' },
  { id: 'today', label: "Aujourd'hui" },
  { id: 'weekend', label: 'Ce weekend' },
  { id: 'week', label: 'Cette semaine' },
  { id: 'month', label: 'Ce mois' },
];

export default function EventFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPeriod = searchParams.get('period') || 'all';

  const handlePeriodChange = (periodId: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (periodId === 'all') {
      params.delete('period');
    } else {
      params.set('period', periodId);
    }
    
    params.delete('page'); // Reset pagination
    
    router.push(`/evenements?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      <span className="text-sm font-semibold text-dark whitespace-nowrap mr-2">
        Période :
      </span>
      {periods.map((period) => (
        <button
          key={period.id}
          onClick={() => handlePeriodChange(period.id)}
          className={cn(
            "px-5 py-2.5 rounded-full font-medium transition-all whitespace-nowrap shadow-sm",
            currentPeriod === period.id || (period.id === 'all' && !currentPeriod)
              ? "bg-primary text-white scale-105"
              : "bg-white text-dark border border-gray-200 hover:border-primary hover:shadow-md"
          )}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}