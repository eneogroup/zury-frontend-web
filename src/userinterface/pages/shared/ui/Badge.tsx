import { cn } from '../../../../service/utils/cn'
import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'restaurant' | 'bar' | 'hotel' | 'lounge' | 'open' | 'closed' | 'premium'
  className?: string
}

export default function Badge({ children, variant = 'restaurant', className }: BadgeProps) {
  const variants = {
    restaurant: 'bg-primary/90 text-white',
    bar: 'bg-gold/90 text-dark',
    hotel: 'bg-blue-500/90 text-white',
    lounge: 'bg-purple-500/90 text-white',
    open: 'bg-emerald-500/90 text-white',
    closed: 'bg-red-500/90 text-white',
    premium: 'bg-gold/20 text-gold border border-gold/30',
  }

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm',
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}
