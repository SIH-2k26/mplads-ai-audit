import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyle =
      'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0E0E0E] disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer';
    
    const variants = {
      default: 'bg-[#0E0E0E] hover:bg-black text-white rounded-full font-semibold',
      primary: 'bg-[#9FE870] hover:bg-[#8ee05c] text-[#0E0E0E] rounded-full font-semibold',
      secondary: 'bg-[#EAE8E2] hover:bg-[#E0DDD5] text-[#0E0E0E] rounded-full font-medium',
      outline: 'border border-[#E5E3DC] bg-white hover:bg-[#F1F0EC] text-[#0E0E0E] rounded-full',
      ghost: 'hover:bg-[#F1F0EC] text-[#0E0E0E] rounded-full',
    };

    const sizes = {
      default: 'h-9 px-4 py-2 text-xs sm:text-sm',
      sm: 'h-8 px-3 text-xs',
      lg: 'h-10 px-8 text-sm',
      icon: 'h-9 w-9',
    };

    return (
      <button
        className={cn(baseStyle, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
