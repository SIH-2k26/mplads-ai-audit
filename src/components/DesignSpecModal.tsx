import React from 'react';
import { X, Check, Palette, Sparkles, Layers, ShieldCheck } from 'lucide-react';

interface DesignSpecModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesignSpecModal: React.FC<DesignSpecModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="modal-design-spec"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-[24px] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#F1F0EC] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#15803D] text-white flex items-center justify-center font-bold">
              7
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#0E0E0E]">
                Wise Visual Design System
              </h2>
              <p className="text-xs text-[#6B6B6B]">
                Replicating Wise&apos;s calm, confident, uncluttered execution
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#6B6B6B] hover:text-[#0E0E0E] hover:bg-[#F1F0EC] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs sm:text-sm">
          {/* Color System */}
          <div className="space-y-3">
            <h3 className="font-semibold text-[#0E0E0E] text-sm">
              1. Color System (Zero Neon, Pure Warm Clarity)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-white border border-[#EAE8E2] space-y-1">
                <div className="w-full h-8 rounded-xl bg-white border border-[#EAE8E2]" />
                <span className="font-semibold text-[#0E0E0E] block">Pure White</span>
                <span className="text-[11px] text-[#6B6B6B]">#FFFFFF (Page Base)</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#F1F0EC] space-y-1">
                <div className="w-full h-8 rounded-xl bg-[#F1F0EC] border border-[#E5E3DC]" />
                <span className="font-semibold text-[#0E0E0E] block">Soft Warm Gray</span>
                <span className="text-[11px] text-[#6B6B6B]">#F1F0EC (Cards)</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#F1F0EC] space-y-1">
                <div className="w-full h-8 rounded-xl bg-[#15803D]" />
                <span className="font-semibold text-[#0E0E0E] block">Institutional Green</span>
                <span className="text-[11px] text-[#6B6B6B]">#15803D (Verified Action)</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#F1F0EC] space-y-1">
                <div className="w-full h-8 rounded-xl bg-[#0E0E0E]" />
                <span className="font-semibold text-[#0E0E0E] block">Near-Black</span>
                <span className="text-[11px] text-[#6B6B6B]">#0E0E0E (Typography)</span>
              </div>
            </div>
          </div>

          {/* Component Principles */}
          <div className="space-y-2.5 p-4 rounded-2xl bg-[#F1F0EC]">
            <h3 className="font-semibold text-[#0E0E0E] text-sm">
              2. Core Layout & Spacing Rules
            </h3>
            <ul className="space-y-1.5 text-xs text-[#6B6B6B] list-disc list-inside leading-relaxed">
              <li><strong className="text-[#0E0E0E]">Fixed Transparent Sidebar:</strong> Thin 1.5px stroke icons, generous 12-16px vertical padding, soft pill active backgrounds.</li>
              <li><strong className="text-[#0E0E0E]">Fully Rounded Pill Buttons:</strong> 9999px border-radius with solid green or warm gray fills.</li>
              <li><strong className="text-[#0E0E0E]">Two-Card Hero Pair:</strong> Equal height 20px radius cards with layered visual accents.</li>
              <li><strong className="text-[#0E0E0E]">Approachable Numerals:</strong> Clean 32-40px regular weight typography with no harsh monospace styling.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#F1F0EC] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-[#0E0E0E] text-white text-xs font-semibold hover:bg-black cursor-pointer"
          >
            Close Specimen
          </button>
        </div>
      </div>
    </div>
  );
};
