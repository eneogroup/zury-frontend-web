import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'restaurant' | 'bar' | 'hotel' | 'lounge' | 'open' | 'closed' | 'premium';
  className?: string;
}

export default function Badge({ children, variant = 'restaurant', className }: BadgeProps) {
  const variants = {
    restaurant: 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-md',
    bar: 'bg-gradient-to-r from-gold to-gold/80 text-dark shadow-md',
    hotel: 'bg-gradient-to-r from-accent to-accent/80 text-white shadow-md',
    lounge: 'bg-gradient-to-r from-dark to-dark/80 text-white shadow-md',
    open: 'bg-gradient-to-r from-accent to-accent/80 text-white shadow-md',
    closed: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md',
    premium: 'bg-gradient-to-r from-gold to-gold/80 text-dark shadow-md',
  };

  return (
    <span className={cn(
      'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide backdrop-blur-sm transition-transform hover:scale-105',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}