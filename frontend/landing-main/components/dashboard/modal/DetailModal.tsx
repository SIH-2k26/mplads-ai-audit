import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export type IntelligenceModalType = 'detect' | 'explain' | 'investigate' | 'act';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryNumber?: string;
  categoryLabel?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function DetailModal({
  isOpen,
  onClose,
  categoryNumber = '01',
  categoryLabel = 'EARLY WARNING ENGINE',
  title,
  subtitle,
  children,
}: DetailModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          {/* Semi-transparent dark backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-[2px]"
          />

          {/* Centered Modal Window — light body like real dashboard */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-[20px] border border-[#E5E3DC] bg-white text-[#0E0E0E] shadow-2xl z-10 flex flex-col font-sans"
          >
            {/* Modal Header — navy brand strip */}
            <div className="sticky top-0 z-20 flex items-start justify-between bg-[#002449] px-6 py-4 rounded-t-[20px]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-extrabold text-white/60">
                    {categoryNumber}
                  </span>
                  <span className="h-3 w-[1px] bg-white/20" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/60">
                    {categoryLabel}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-white font-sans">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-xs text-white/70 font-normal leading-relaxed max-w-xl">
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Close Button (X) */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/30 flex-shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body Content — light dashboard theme */}
            <div className="p-6 space-y-5 text-sm text-[#0E0E0E]">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
