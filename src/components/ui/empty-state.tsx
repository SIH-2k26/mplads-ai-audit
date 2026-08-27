import React from 'react';
import { FileQuestion, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './button';
import { cn } from '../../lib/utils';

export function EmptyState({
  title = 'No records found',
  description = 'There are no active entries matching your current filters.',
  actionLabel,
  onAction,
  className,
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-[6px] border border-dashed border-[#D9D5CC] bg-[#FAFAF7]',
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EDE8DE] text-[#18324A] mb-3">
        <FileQuestion className="h-6 w-6 text-[#667085]" />
      </div>
      <h4 className="text-sm font-semibold text-[#18324A]">{title}</h4>
      <p className="mt-1 text-xs text-[#667085] max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({
  title = 'Failed to load intelligence data',
  description = 'An error occurred while communicating with the data engine.',
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-[6px] border border-[#B44343]/30 bg-red-50/50',
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-[#B44343] mb-3">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h4 className="text-sm font-semibold text-[#B44343]">{title}</h4>
      <p className="mt-1 text-xs text-[#667085] max-w-sm">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-4 flex items-center gap-1.5 border-[#B44343]/40 text-[#B44343] hover:bg-red-50">
          <RefreshCw className="h-3.5 w-3.5" />
          Retry Query
        </Button>
      )}
    </div>
  );
}
