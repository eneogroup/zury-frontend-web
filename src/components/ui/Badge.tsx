import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'restaurant' | 'bar' | 'hotel' | 'lounge' | 'open' | 'closed' | 'premium';
  className?: string;
}

export default function Badge({ children, variant = 'restaurant', className }: BadgeProps) {
  const variants = {
    restaurant: 'bg-primary text-white',
    bar: 'bg-gold text-dark',
    hotel: 'bg-accent text-white',
    lounge: 'bg-dark text-white',
    open: 'bg-accent text-white',
    closed: 'bg-red-500 text-white',
    premium: 'bg-gold text-dark',
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}