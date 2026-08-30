import { clsx, type ClassValue } from 'clsx';
import { PureComponent } from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrencyINR(value: number): string {
  if (value === undefined || value === null) return '0.00';
  
  // If the value is small (e.g. if it's already in Crores in some places)
  if (value < 500) {
    return `${value.toFixed(2)} Cr`;
  }
  
  if (value >= 10000000) {
    return `${(value / 10000000).toFixed(2)} Cr`;
  } else if (value >= 100000) {
    return `${(value / 100000).toFixed(2)} L`;
  }
  
  return value.toLocaleString('en-IN', {
    maximumFractionDigits: 2
  });
}
