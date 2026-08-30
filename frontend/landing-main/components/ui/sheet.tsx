import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/utils';

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  side?: 'left' | 'right';
  className?: string;
}

export function Sheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  side = 'right',
  className,
}: SheetProps) {
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

  const sideClasses = {
    right: 'right-0 top-0 bottom-0 h-full border-l border-[#E5E3DC] animate-in slide-in-from-right duration-250',
    left: 'left-0 top-0 bottom-0 h-full border-r border-[#E5E3DC] animate-in slide-in-from-left duration-250',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0E0E0E]/40 backdrop-blur-sm transition-opacity"
        onClick={() => onOpenChange(false)}
      />

      {/* Sheet Content */}
      <div
        className={cn(
          'fixed z-50 w-full max-w-md bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto',
          sideClasses[side],
          className
        )}
      >
        <div>
          <div className="flex items-center justify-between border-b border-[#E5E3DC] pb-4 mb-4">
            <div>
              {title && (
                <h3 className="text-sm font-bold text-[#0E0E0E] uppercase tracking-wide">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-xs text-[#6B6B6B] mt-0.5">{description}</p>
              )}
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-full p-1.5 text-[#6B6B6B] hover:bg-[#EAE8E2] hover:text-[#0E0E0E] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="text-xs text-[#0E0E0E]">{children}</div>
        </div>
      </div>
    </div>
  );
}
