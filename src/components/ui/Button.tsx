import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className,
  onClick,
  disabled = false,
  type = 'button'
}: ButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-primary/90 text-white hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed',
    success: 'bg-gradient-to-r from-accent to-accent/90 text-white hover:from-accent/90 hover:to-accent shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed',
    warning: 'bg-gradient-to-r from-gold to-gold/90 text-dark hover:from-gold/90 hover:to-gold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed',
    outline: 'border-2 border-gray-300 text-gray-700 hover:border-primary hover:text-primary hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-xl font-semibold transition-all duration-300 active:scale-95',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </button>
  );
}