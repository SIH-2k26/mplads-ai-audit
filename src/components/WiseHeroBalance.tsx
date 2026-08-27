import React, { useState } from 'react';
import { BarChart2, ChevronDown, Check } from 'lucide-react';

interface WiseHeroBalanceProps {
  onAuditScan: () => void;
  onFreezeTranche: () => void;
  onSelectDirective: (directive: string) => void;
  onToggleAnalytics: () => void;
  trustScore?: number;
  totalOutlayCr?: number;
}

export const WiseHeroBalance: React.FC<WiseHeroBalanceProps> = ({
  onAuditScan,
  onFreezeTranche,
  onSelectDirective,
  onToggleAnalytics,
  trustScore = 76.4,
  totalOutlayCr = 4950.0,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [displayMode, setDisplayMode] = useState<'outlay' | 'trust'>('outlay');

  return (
    <div className="space-y-4">
      {/* Label and Big Number */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#6B6B6B] font-normal">
            {displayMode === 'outlay' ? 'Total monitored outlay' : 'National scheme integrity score'}
          </span>
          <button
            onClick={() => setDisplayMode(displayMode === 'outlay' ? 'trust' : 'outlay')}
            className="text-[11px] text-[#6B6B6B] underline hover:text-[#0E0E0E] cursor-pointer"
          >
            switch to {displayMode === 'outlay' ? 'trust score' : 'outlay'}
          </button>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#0E0E0E]">
            {displayMode === 'outlay' ? (
              <>
                <span className="font-light text-2xl sm:text-3xl mr-1">₹</span>
                {totalOutlayCr.toLocaleString('en-IN', { minimumFractionDigits: 2 })} Cr
              </>
            ) : (
              <>
                {trustScore.toFixed(1)}{' '}
                <span className="text-lg font-light text-[#6B6B6B]">/ 100</span>
              </>
            )}
          </h1>

          {/* Wise small inline stats icon button */}
          <button
            onClick={onToggleAnalytics}
            title="View Scheme Trust Analytics"
            className="p-1.5 rounded-full hover:bg-[#F1F0EC] text-[#0E0E0E] transition-colors cursor-pointer"
          >
            <BarChart2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Wise Action Pills Row (Send, Add money, Request v) */}
      <div className="flex flex-wrap items-center gap-2 relative">
        {/* Primary Wise Green Pill (Send equivalent) */}
        <button
          onClick={onAuditScan}
          className="bg-[#9FE870] hover:bg-[#8ee05c] text-[#0E0E0E] font-medium text-sm px-6 py-2 rounded-full transition-all cursor-pointer shadow-none"
        >
          Audit scan
        </button>

        {/* Secondary Warm Gray Pill (Add money equivalent) */}
        <button
          onClick={onFreezeTranche}
          className="bg-[#EAE8E2] hover:bg-[#E0DDD5] text-[#0E0E0E] font-medium text-sm px-5 py-2 rounded-full transition-all cursor-pointer"
        >
          Freeze tranche
        </button>

        {/* Dropdown Warm Gray Pill (Request v equivalent) */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-[#EAE8E2] hover:bg-[#E0DDD5] text-[#0E0E0E] font-medium text-sm px-5 py-2 rounded-full transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Directives</span>
            <ChevronDown className="w-4 h-4 text-[#0E0E0E]" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div
              className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-[#F1F0EC] py-2 z-30 animate-in fade-in zoom-in-95 duration-100"
              onClick={() => setDropdownOpen(false)}
            >
              <button
                onClick={() => onSelectDirective('satellite')}
                className="w-full text-left px-4 py-2.5 text-xs text-[#0E0E0E] hover:bg-[#F1F0EC] transition-colors flex items-center justify-between"
              >
                <span>Task ISRO Satellite Pass</span>
                <span className="text-[10px] text-[#6B6B6B]">SAR</span>
              </button>
              <button
                onClick={() => onSelectDirective('subpoena')}
                className="w-full text-left px-4 py-2.5 text-xs text-[#0E0E0E] hover:bg-[#F1F0EC] transition-colors flex items-center justify-between"
              >
                <span>Issue Show-Cause Notice</span>
                <span className="text-[10px] text-[#6B6B6B]">CAG</span>
              </button>
              <button
                onClick={() => onSelectDirective('export')}
                className="w-full text-left px-4 py-2.5 text-xs text-[#0E0E0E] hover:bg-[#F1F0EC] transition-colors flex items-center justify-between"
              >
                <span>Export Vigilance Dossier</span>
                <span className="text-[10px] text-[#6B6B6B]">PDF / CSV</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
