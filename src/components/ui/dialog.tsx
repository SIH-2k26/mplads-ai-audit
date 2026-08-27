import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ open, onOpenChange, title, description, children, className }: DialogProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    if (open) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0F2638]/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
        onClick={() => onOpenChange(false)}
      />

      {/* Content */}
      <div
        className={cn(
          'relative z-50 w-full max-w-lg rounded-[8px] border-2 border-[#15324A] bg-white p-6 shadow-2xl animate-in zoom-in-95 fade-in duration-200',
          className
        )}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-[4px] p-1 text-[#647383] hover:bg-[#F3F5F4] hover:text-[#172B3A] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {title && (
          <div className="mb-4 pr-6">
            <h3 className="text-base font-bold text-[#172B3A] uppercase tracking-wide">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-[#647383] mt-0.5 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="text-xs text-[#172B3A]">{children}</div>
      </div>
    </div>
  );
}
