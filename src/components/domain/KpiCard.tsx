import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export function KpiCard({
  title,
  value,
  subtitle,
  change,
  changeType = 'neutral',
  icon: Icon,
  variant = 'default',
  className,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral' | 'critical';
  icon?: LucideIcon;
  variant?: 'default' | 'critical' | 'warning' | 'success';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-[6px] border border-[#D9D5CC] bg-white p-5 shadow-card transition-all hover:shadow-elevated',
        variant === 'critical' && 'border-l-4 border-l-[#B44343]',
        variant === 'warning' && 'border-l-4 border-l-[#C98219]',
        variant === 'success' && 'border-l-4 border-l-[#2F7658]',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-[#667085] uppercase tracking-wider block">
          {title}
        </span>
        {Icon && (
          <div className="p-1.5 rounded-[4px] bg-[#EDE8DE] text-[#18324A]">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#18324A] tracking-tight">
          {value}
        </span>
        {change && (
          <span
            className={cn(
              'text-xs font-semibold flex items-center',
              changeType === 'positive' && 'text-[#2F7658]',
              changeType === 'negative' && 'text-[#B44343]',
              changeType === 'critical' && 'text-[#B44343] font-bold',
              changeType === 'neutral' && 'text-[#667085]'
            )}
          >
            {changeType === 'positive' && <TrendingUp className="h-3.5 w-3.5 mr-0.5" />}
            {changeType === 'negative' && <TrendingDown className="h-3.5 w-3.5 mr-0.5" />}
            {change}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-[#667085] font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
