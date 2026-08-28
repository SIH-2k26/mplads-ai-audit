import * as React from 'react';
import { cn } from '../../lib/utils';

interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  className?: string;
}

export function Popover({ trigger, children, align = 'center', className }: PopoverProps) {
  const [open, setOpen] = React.useState(false);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const alignClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  return (
    <div ref={popoverRef} className="relative inline-block">
      <div onClick={() => setOpen(!open)} className="cursor-pointer inline-flex">
        {trigger}
      </div>
      {open && (
        <div
          className={cn(
            'absolute z-50 mt-2 min-w-[240px] rounded-[6px] border border-[#D9DFE3] bg-white p-4 shadow-elevated animate-in fade-in zoom-in-95 duration-150',
            alignClasses[align],
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
