import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success';
  children?: React.ReactNode;
  className?: string;
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-[#0E0E0E] text-white border-transparent',
    secondary: 'bg-[#EAE8E2] text-[#0E0E0E] border-transparent',
    destructive: 'bg-red-100 text-red-700 border-red-200',
    outline: 'border border-[#E5E3DC] text-[#0E0E0E] bg-white',
    success: 'bg-[#9FE870] text-[#0E0E0E] border-transparent',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold transition-colors select-none font-sans',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
