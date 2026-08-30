import React from 'react';

interface SanchayLogoProps {
  className?: string;
  variant?: 'light' | 'navy' | 'dark' | 'auto';
  size?: number;
}

export function SanchayLogo({ className = 'h-6 w-6', variant = 'auto', size }: SanchayLogoProps) {
  const src =
    variant === 'light'
      ? '/logo-white.png'
      : variant === 'navy'
      ? '/logo-navy.png'
      : '/logo.png';

  return (
    <img
      src={src}
      alt="SANCHAY Logo"
      style={size ? { width: size, height: size } : undefined}
      className={`object-contain select-none pointer-events-none ${className}`}
    />
  );
}
