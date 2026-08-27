import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

interface WiseNoticeBannerProps {
  onFindOutMore: () => void;
}

export const WiseNoticeBanner: React.FC<WiseNoticeBannerProps> = ({ onFindOutMore }) => {
  const [dismissed, setDismissed] = useState<boolean>(false);

  if (dismissed) return null;

  return (
    <div className="bg-[#F1F0EC] rounded-[16px] p-4 flex items-center justify-between gap-4 transition-all">
      <div className="flex items-center gap-3.5 sm:gap-4">
        {/* Colorful Wallet / Card Illustration Icon */}
        <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-tr from-amber-400 via-emerald-400 to-cyan-400 p-0.5 shadow-xs flex items-center justify-center">
          <div className="w-full h-full bg-[#F1F0EC] rounded-[10px] flex items-center justify-center text-base">
            📑
          </div>
        </div>

        {/* Text and Underlined Link */}
        <div className="text-xs sm:text-sm text-[#0E0E0E] leading-snug">
          <span>We&apos;ve updated how Sentinel cross-references ISRO Cartosat-3 SAR imagery with PFMS treasury bills.{' '}</span>
          <button
            onClick={onFindOutMore}
            className="font-medium underline hover:text-[#6B6B6B] transition-colors cursor-pointer inline"
          >
            Find out more
          </button>
        </div>
      </div>

      {/* Dismiss button */}
      <button
        onClick={() => setDismissed(true)}
        className="p-1 rounded-full text-[#6B6B6B] hover:text-[#0E0E0E] hover:bg-[#EAE8E2] transition-colors cursor-pointer shrink-0"
        title="Dismiss notice"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
