import React from 'react';
import { Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

export function StaleDataBanner({
  lastUpdated,
  financialDataAgeDays,
  physicalDataAgeDays,
  isStale,
  className,
}: {
  lastUpdated: string;
  financialDataAgeDays: number;
  physicalDataAgeDays: number;
  isStale: boolean;
  className?: string;
}) {
  const formattedDate = new Date(lastUpdated).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-[4px] border text-xs',
        isStale
          ? 'bg-amber-50/70 border-[#B7791F]/30 text-[#B7791F]'
          : 'bg-[#F7F5F0] border-[#D9D5CC] text-[#667085]',
        className
      )}
    >
      <div className="flex items-center gap-2">
        {isStale ? (
          <AlertTriangle className="h-4 w-4 text-[#B7791F] flex-shrink-0" />
        ) : (
          <ShieldCheck className="h-4 w-4 text-[#2F7658] flex-shrink-0" />
        )}
        <span>
          <strong className="text-[#18324A]">Data Audit Stamp:</strong> Last synchronized on {formattedDate}.
          {isStale && ' Field inspection reports require on-ground physical refresh.'}
        </span>
      </div>

      <div className="flex items-center gap-4 text-[11px]">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-[#667085]" />
          Financial Ledger: <strong>{financialDataAgeDays}d ago</strong> (Current)
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-[#667085]" />
          Physical Inspection: <strong className={isStale ? 'text-[#B7791F]' : 'text-[#2F7658]'}>{physicalDataAgeDays}d ago</strong> {isStale ? '(STALE)' : '(GOOD)'}
        </span>
      </div>
    </div>
  );
}
