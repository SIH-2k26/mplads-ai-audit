import * as React from 'react';
import { cn } from '../../lib/utils';

interface HoverCardProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function HoverCard({ trigger, children, className }: HoverCardProps) {
  const [open, setOpen] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 150);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="inline-flex cursor-pointer">{trigger}</div>
      {open && (
        <div
          className={cn(
            'absolute z-50 mt-1.5 w-72 rounded-[6px] border border-[#D9DFE3] bg-white p-3.5 shadow-elevated animate-in fade-in zoom-in-95 duration-150',
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
