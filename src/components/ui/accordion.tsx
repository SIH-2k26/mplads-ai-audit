import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
  className?: string;
}

export function Accordion({ items, defaultOpenId, className }: AccordionProps) {
  const [openId, setOpenId] = React.useState<string | null>(defaultOpenId || null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className={cn('divide-y divide-[#D9DFE3] border-y border-[#D9DFE3]', className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className="py-3">
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between text-left text-xs font-bold text-[#172B3A] hover:text-[#D99016] transition-colors"
            >
              <span>{item.title}</span>
              <ChevronDown
                className={cn('h-4 w-4 text-[#647383] transition-transform duration-200', isOpen && 'rotate-180 text-[#D99016]')}
              />
            </button>
            {isOpen && (
              <div className="pt-2 text-xs text-[#647383] leading-relaxed animate-in fade-in slide-in-from-top-1 duration-150">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
