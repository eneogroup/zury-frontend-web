import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'restaurant' | 'bar' | 'hotel' | 'lounge' | 'open' | 'closed' | 'premium';
  className?: string;
}

export default function Badge({ children, variant = 'restaurant', className }: BadgeProps) {
  const variants = {
    restaurant: 'bg-primary/90 text-white backdrop-blur-sm',
    bar: 'bg-gold/90 text-dark backdrop-blur-sm',
    hotel: 'bg-accent/90 text-white backdrop-blur-sm',
    lounge: 'bg-dark/90 text-white backdrop-blur-sm',
    open: 'bg-accent/90 text-white backdrop-blur-sm',
    closed: 'bg-red-500/90 text-white backdrop-blur-sm',
    premium: 'bg-gold/90 text-dark backdrop-blur-sm',
  };

  return (
    <span className={cn(
      'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-sm',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}