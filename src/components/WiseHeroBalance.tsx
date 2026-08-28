import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart2 as BarChartIcon, ChevronDown as ChevronDownIcon } from 'lucide-react';
import { NumberTicker } from './motion/NumberTicker';

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
            {displayMode === 'outlay' ? 'Total monitored outlay' : 'National scheme compliance reliability score'}
          </span>
          <button
            onClick={() => setDisplayMode(displayMode === 'outlay' ? 'trust' : 'outlay')}
            className="text-[11px] text-[#6B6B6B] underline hover:text-[#0E0E0E] cursor-pointer"
          >
            switch to {displayMode === 'outlay' ? 'compliance score' : 'outlay'}
          </button>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#0E0E0E]">
            {displayMode === 'outlay' ? (
              <>
                <span className="font-light text-2xl sm:text-3xl mr-1">₹</span>
                <NumberTicker value={totalOutlayCr} decimalPlaces={2} /> Cr
              </>
            ) : (
              <>
                <NumberTicker value={trustScore} decimalPlaces={1} />{' '}
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
            <BarChartIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Wise Action Pills Row (Send, Add money, Request v) */}
      <div className="flex flex-wrap items-center gap-2 relative">
        {/* Primary Wise Green Pill (Send equivalent) */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onAuditScan}
          className="bg-[#16A34A] hover:bg-[#15803D] text-white font-medium text-sm px-6 py-2 rounded-full transition-all cursor-pointer shadow-none"
        >
          Audit scan
        </motion.button>

        {/* Secondary Warm Gray Pill (Add money equivalent) */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onFreezeTranche}
          className="bg-[#EAE8E2] hover:bg-[#E0DDD5] text-[#0E0E0E] font-medium text-sm px-5 py-2 rounded-full transition-all cursor-pointer"
        >
          Freeze tranche
        </motion.button>

        {/* Dropdown Warm Gray Pill (Request v equivalent) */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-[#EAE8E2] hover:bg-[#E0DDD5] text-[#0E0E0E] font-medium text-sm px-5 py-2 rounded-full transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Directives</span>
            <ChevronDownIcon className="w-4 h-4 text-[#0E0E0E]" />
          </motion.button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.95 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-[#F1F0EC] py-2 z-30"
                onClick={() => setDropdownOpen(false)}
              >
                <button
                  onClick={() => onSelectDirective('satellite')}
                  className="w-full text-left px-4 py-2.5 text-xs text-[#0E0E0E] hover:bg-[#F1F0EC] transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>Task ISRO Satellite Pass</span>
                  <span className="text-[10px] text-[#6B6B6B]">SAR</span>
                </button>
                <button
                  onClick={() => onSelectDirective('subpoena')}
                  className="w-full text-left px-4 py-2.5 text-xs text-[#0E0E0E] hover:bg-[#F1F0EC] transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>Issue Show-Cause Notice</span>
                  <span className="text-[10px] text-[#6B6B6B]">CAG</span>
                </button>
                <button
                  onClick={() => onSelectDirective('export')}
                  className="w-full text-left px-4 py-2.5 text-xs text-[#0E0E0E] hover:bg-[#F1F0EC] transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>Export Vigilance Dossier</span>
                  <span className="text-[10px] text-[#6B6B6B]">PDF / CSV</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};


