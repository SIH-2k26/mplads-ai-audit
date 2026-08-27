import React from 'react';
import { ChevronRight, Landmark, Plus, ShieldAlert, Sparkles, Building2, CheckCircle2 } from 'lucide-react';

interface WiseCardsRowProps {
  onOpenCardDetails: () => void;
  onOpenDoMoreAction: () => void;
  onSelectSubBalance: (type: string) => void;
  totalOutlayCr?: number;
  disbursedCr?: number;
  flaggedRiskCr?: number;
  reconciledCr?: number;
  activeFreezesCount?: number;
}

export const WiseCardsRow: React.FC<WiseCardsRowProps> = ({
  onOpenCardDetails,
  onOpenDoMoreAction,
  onSelectSubBalance,
  totalOutlayCr = 4950.0,
  disbursedCr = 3840.5,
  flaggedRiskCr = 412.8,
  reconciledCr = 3427.7,
  activeFreezesCount = 3,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
      {/* CARD 1: Everyday Account (Replicated Pixel-for-Pixel) */}
      <div className="bg-[#F1F0EC] rounded-[20px] p-5 sm:p-6 flex flex-col justify-between transition-all">
        <div>
          {/* Top Layered Physical Card Graphic */}
          <div className="relative mb-5 pt-2">
            {/* Background layered card edges (matching Wise pink/blue/orange peeking cards) */}
            <div className="absolute top-0 left-3 right-3 h-3 bg-[#E45858] rounded-t-xl opacity-90" />
            <div className="absolute top-1 left-2 right-2 h-3 bg-[#2D68C4] rounded-t-xl opacity-95" />
            <div className="absolute top-2 left-1 right-1 h-3 bg-[#E8A338] rounded-t-xl" />

            {/* Front Wise Signature Green Card */}
            <div className="relative mt-3 bg-[#9FE870] rounded-xl p-3 flex items-center justify-between shadow-xs">
              <button
                onClick={onOpenCardDetails}
                className="bg-black/10 hover:bg-black/15 text-[#0E0E0E] text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>{activeFreezesCount} active freezes</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {/* Geometric Wise-style mark */}
              <div className="w-6 h-6 flex items-center justify-center text-[#0E0E0E]">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4 3h16l-7 18h-4l3-8H5l3-10z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Account Title & Main Balance */}
          <button
            onClick={onOpenCardDetails}
            className="w-full flex items-center justify-between text-left group cursor-pointer"
          >
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-[#0E0E0E] group-hover:underline">
                National scheme account
              </h2>
              <p className="text-xs text-[#6B6B6B] mt-0.5">
                ₹{totalOutlayCr.toLocaleString('en-IN', { minimumFractionDigits: 2 })} Cr sanctioned
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#6B6B6B] group-hover:text-[#0E0E0E]" />
          </button>

          {/* Sub-balances List (Matching Singapore/US/Korea flags in Wise) */}
          <div className="mt-4 space-y-2.5">
            {/* 1. Disbursed Tranches */}
            <button
              onClick={() => onSelectSubBalance('disbursed')}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#EAE8E2] transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                {/* Indian Flag Emblem */}
                <div className="w-6 h-6 rounded-full bg-white border border-[#E5E3DC] flex items-center justify-center text-[10px] overflow-hidden shadow-xs">
                  <span className="text-xs">🇮🇳</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-[#0E0E0E]">
                  ₹{disbursedCr.toLocaleString('en-IN', { minimumFractionDigits: 2 })} Cr
                </span>
                <span className="text-[11px] text-[#6B6B6B] hidden sm:inline">(Disbursed)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#6B6B6B] group-hover:text-[#0E0E0E]" />
            </button>

            {/* 2. Flagged at Risk */}
            <button
              onClick={() => onSelectSubBalance('flagged')}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#EAE8E2] transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-[10px]">
                  <span className="text-xs">🚩</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-[#0E0E0E]">
                  ₹{flaggedRiskCr.toLocaleString('en-IN', { minimumFractionDigits: 2 })} Cr
                </span>
                <span className="text-[11px] text-red-600 font-medium hidden sm:inline">(Flagged Risk)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#6B6B6B] group-hover:text-[#0E0E0E]" />
            </button>

            {/* 3. Reconciled */}
            <button
              onClick={() => onSelectSubBalance('reconciled')}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#EAE8E2] transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-[10px]">
                  <span className="text-xs">🛡️</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-[#0E0E0E]">
                  ₹{reconciledCr.toLocaleString('en-IN', { minimumFractionDigits: 2 })} Cr
                </span>
                <span className="text-[11px] text-emerald-700 font-medium hidden sm:inline">(Reconciled)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#6B6B6B] group-hover:text-[#0E0E0E]" />
            </button>
          </div>
        </div>

        {/* Bottom Button Pill: Account details */}
        <div className="mt-5 pt-3 border-t border-[#EAE8E2]">
          <button
            onClick={onOpenCardDetails}
            className="bg-[#EAE8E2] hover:bg-[#E0DDD5] text-[#0E0E0E] text-xs font-semibold px-4 py-2 rounded-full transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Landmark className="w-3.5 h-3.5 text-[#0E0E0E]" />
            <span>Scheme details</span>
          </button>
        </div>
      </div>

      {/* CARD 2: Do more with your money (Replicated Pixel-for-Pixel) */}
      <div className="bg-[#F1F0EC] rounded-[20px] p-6 flex flex-col items-center justify-between text-center min-h-[300px] relative overflow-hidden">
        {/* Subtle Arched Top Layer (Wise style) */}
        <div className="w-24 h-4 bg-white/40 rounded-b-full mx-auto -mt-6 mb-2" />

        <div className="my-auto space-y-2 max-w-[280px]">
          <h2 className="text-lg sm:text-xl font-semibold text-[#0E0E0E] leading-snug">
            Do more with AI Sentinel
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
            Continuous ISRO satellite radar, GSTIN shell detection, and automated CAG compliance.
          </p>
        </div>

        {/* Wise Signature Green Circular Action Button */}
        <button
          onClick={onOpenDoMoreAction}
          className="w-14 h-14 rounded-full bg-[#9FE870] hover:bg-[#8ee05c] flex items-center justify-center text-[#0E0E0E] transition-transform hover:scale-105 cursor-pointer shadow-xs mt-4"
          title="Launch Continuous Vigilance Scan"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
