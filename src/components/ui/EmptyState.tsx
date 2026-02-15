'use client';

import { Search, Frown } from 'lucide-react';
import FadeIn from './FadeIn';

interface EmptyStateProps {
  title?: string;
  message: string;
  icon?: 'search' | 'empty';
}

export default function EmptyState({ 
  title = "Aucun résultat",
  message,
  icon = 'search'
}: EmptyStateProps) {
  const Icon = icon === 'search' ? Search : Frown;
  
  return (
    <FadeIn>
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-light rounded-full p-6 mb-4">
          <Icon className="w-16 h-16 text-gray" />
        </div>
        
        <h3 className="text-xl font-semibold text-dark mb-2">
          {title}
        </h3>
        
        <p className="text-gray text-center max-w-md">
          {message}
        </p>
      </div>
    </FadeIn>
  );
}