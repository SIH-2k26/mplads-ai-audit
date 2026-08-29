import React from 'react';
import { SYSTEM_METRICS } from '../data/mockData';
import {
  IndianRupee,
  ShieldAlert,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  TrendingUp,
  PieChart,
  CheckCircle2
} from 'lucide-react';

interface StatCardsClusterProps {
  onSelectRiskTier?: (tier: string) => void;
  selectedRiskFilter?: string;
}

export const StatCardsCluster: React.FC<StatCardsClusterProps> = ({
  onSelectRiskTier,
  selectedRiskFilter,
}) => {
  const {
    totalSanctionedCr,
    totalExpendedCr,
    utilizationRate,
    totalMonitoredProjects,
    flaggedOutlayCr,
    flaggedProjectsCount,
    activeCriticalAlerts,
    riskDistribution,
  } = SYSTEM_METRICS;

  return (
    <div id="stat-cards-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Stat 1: Total Sanctioned vs Expended (ACRU 'Total income / Total expenses' equivalent) */}
      <div
        id="card-stat-sanctioned-expended"
        className="instrument-card rounded-xl p-4 border border-[#1E2638] bg-[#0F141E] flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-mono-audit uppercase tracking-wider font-semibold">
            Total Sanctioned / Expended
          </span>
          <IndianRupee className="w-4 h-4 text-cyan-400" />
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-mono-audit font-bold text-slate-100">
              ₹{totalSanctionedCr.toLocaleString('en-IN', { minimumFractionDigits: 1 })}
              <span className="text-xs font-normal text-slate-400 ml-1">Cr</span>
            </span>
            <span className="text-xs font-mono-audit text-emerald-400 flex items-center font-semibold">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              {utilizationRate}% Utilized
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>Expended: ₹{totalExpendedCr.toLocaleString('en-IN', { minimumFractionDigits: 1 })} Cr</span>
            <span className="font-mono-audit">{totalMonitoredProjects.toLocaleString()} Works</span>
          </div>
        </div>

        {/* Minimalist Progress Meter */}
        <div className="mt-3">
          <div className="w-full bg-[#172030] h-1.5 rounded-full overflow-hidden flex">
            <div
              className="bg-cyan-400 h-full rounded-full transition-all"
              style={{ width: `${utilizationRate}%` }}
              title={`Disbursed: ${utilizationRate}%`}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono-audit text-slate-400 mt-1">
            <span>Disbursed ₹3,840.5 Cr</span>
            <span>Balance ₹1,109.5 Cr</span>
          </div>
        </div>
      </div>

      {/* Stat 2: Flagged High-Risk Outlay */}
      <div
        id="card-stat-flagged-outlay"
        className="instrument-card rounded-xl p-4 border border-[#1E2638] bg-[#0F141E] flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-mono-audit uppercase tracking-wider font-semibold">
            Flagged Risk Outlay
          </span>
          <AlertTriangle className="w-4 h-4 text-amber-400" />
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-mono-audit font-bold text-amber-400">
              ₹{flaggedOutlayCr.toFixed(1)}
              <span className="text-xs font-normal text-amber-400/70 ml-1">Cr</span>
            </span>
            <span className="text-xs font-mono-audit text-red-400 bg-red-950/50 px-1.5 py-0.5 rounded border border-red-900/40">
              +18.4% YoY
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>In Suspicious / Stalled Works</span>
            <span className="font-mono-audit font-semibold text-slate-300">
              {flaggedProjectsCount} Projects
            </span>
          </div>
        </div>

        {/* Action footnote */}
        <div className="mt-3 pt-2 border-t border-[#182030] flex items-center justify-between text-[10.5px] font-mono-audit text-slate-400">
          <span>8.3% of total allocation</span>
          <span className="text-amber-400 font-semibold">Forensic Hold</span>
        </div>
      </div>

      {/* Stat 3: Active Forensic Alerts */}
      <div
        id="card-stat-critical-alerts"
        className="instrument-card rounded-xl p-4 border border-[#1E2638] bg-[#0F141E] flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-mono-audit uppercase tracking-wider font-semibold">
            Active Forensic Alerts
          </span>
          <div className="relative">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 absolute -top-0.5 -right-0.5 animate-ping" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-mono-audit font-bold text-red-400">
              {activeCriticalAlerts}
              <span className="text-xs font-normal text-red-400/80 ml-1.5 uppercase">Critical</span>
            </span>
            <span className="text-[11px] font-mono-audit text-cyan-400 bg-cyan-950/50 px-1.5 py-0.5 rounded border border-cyan-800/40">
              T+2h MoSPI Sync
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>12 Shell Vendors Identified</span>
            <span className="text-emerald-400 font-mono-audit">14 Frozen</span>
          </div>
        </div>

        {/* Priority breakdown */}
        <div className="mt-3 pt-2 border-t border-[#182030] flex items-center justify-between text-[10.5px] font-mono-audit">
          <span className="text-slate-400">ISRO Mismatches: 19</span>
          <span className="text-red-400 font-semibold">19 Pending CAG</span>
        </div>
      </div>

      {/* Stat 4: Risk Tier Distribution Matrix (ACRU 'Saved balance' equivalent position) */}
      <div
        id="card-stat-risk-distribution"
        className="instrument-card rounded-xl p-4 border border-[#1E2638] bg-[#0F141E] flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-mono-audit uppercase tracking-wider font-semibold">
            Risk Tier Distribution
          </span>
          <PieChart className="w-4 h-4 text-slate-400" />
        </div>

        {/* Multi-segmented Distribution Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-[#151D2A] h-2.5 rounded-full overflow-hidden flex gap-0.5 p-0.5">
            <div
              className="bg-emerald-500 h-full rounded-l-full cursor-pointer hover:opacity-80 transition-opacity"
              style={{ width: `${riskDistribution.low.percent}%` }}
              title={`Low Risk: ${riskDistribution.low.percent}%`}
              onClick={() => onSelectRiskTier && onSelectRiskTier('low')}
            />
            <div
              className="bg-cyan-500 h-full cursor-pointer hover:opacity-80 transition-opacity"
              style={{ width: `${riskDistribution.medium.percent}%` }}
              title={`Medium Watch: ${riskDistribution.medium.percent}%`}
              onClick={() => onSelectRiskTier && onSelectRiskTier('medium')}
            />
            <div
              className="bg-amber-500 h-full cursor-pointer hover:opacity-80 transition-opacity"
              style={{ width: `${riskDistribution.high.percent}%` }}
              title={`High Divergence: ${riskDistribution.high.percent}%`}
              onClick={() => onSelectRiskTier && onSelectRiskTier('high')}
            />
            <div
              className="bg-red-500 h-full rounded-r-full cursor-pointer hover:opacity-80 transition-opacity"
              style={{ width: `${riskDistribution.critical.percent}%` }}
              title={`Critical Hold: ${riskDistribution.critical.percent}%`}
              onClick={() => onSelectRiskTier && onSelectRiskTier('critical')}
            />
          </div>

          {/* Micro Legend & Quantities */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10.5px] font-mono-audit pt-1">
            <button
              onClick={() => onSelectRiskTier && onSelectRiskTier('low')}
              className={`flex items-center justify-between px-1.5 py-0.5 rounded text-left ${
                selectedRiskFilter === 'low' ? 'bg-emerald-950/60 text-emerald-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Low:
              </span>
              <span className="font-semibold">{riskDistribution.low.percent}%</span>
            </button>

            <button
              onClick={() => onSelectRiskTier && onSelectRiskTier('medium')}
              className={`flex items-center justify-between px-1.5 py-0.5 rounded text-left ${
                selectedRiskFilter === 'medium' ? 'bg-cyan-950/60 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Med:
              </span>
              <span className="font-semibold">{riskDistribution.medium.percent}%</span>
            </button>

            <button
              onClick={() => onSelectRiskTier && onSelectRiskTier('high')}
              className={`flex items-center justify-between px-1.5 py-0.5 rounded text-left ${
                selectedRiskFilter === 'high' ? 'bg-amber-950/60 text-amber-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                High:
              </span>
              <span className="font-semibold text-amber-400">{riskDistribution.high.percent}%</span>
            </button>

            <button
              onClick={() => onSelectRiskTier && onSelectRiskTier('critical')}
              className={`flex items-center justify-between px-1.5 py-0.5 rounded text-left ${
                selectedRiskFilter === 'critical' ? 'bg-red-950/60 text-red-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                Crit:
              </span>
              <span className="font-semibold text-red-400">{riskDistribution.critical.percent}%</span>
            </button>
          </div>
        </div>

        <div className="mt-1 pt-1 border-t border-[#182030] text-[10px] font-mono-audit text-slate-400 text-center">
          Click tier to filter inspection table
        </div>
      </div>
    </div>
  );
};
