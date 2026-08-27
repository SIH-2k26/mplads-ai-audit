import React from 'react';
import { HIGH_SCRUTINY_CONSTITUENCIES } from '../data/mockData';
import {
  Shield,
  Lock,
  FileSignature,
  Satellite,
  Building,
  FileDown,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Minus,
  Sparkles,
  Award,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface RightRailProps {
  onTriggerAction: (actionType: string) => void;
  onSelectConstituency: (constituencyName: string) => void;
}

export const RightRail: React.FC<RightRailProps> = ({
  onTriggerAction,
  onSelectConstituency,
}) => {
  return (
    <div id="right-hand-rail" className="space-y-4">
      {/* Officer / Audit Role Profile Card (ACRU 'My card' position) */}
      <div
        id="card-officer-profile"
        className="instrument-card-elevated rounded-xl p-4 border border-[#243044] bg-gradient-to-b from-[#131A26] to-[#0E131E] relative overflow-hidden"
      >
        {/* Subtle decorative security watermark badge */}
        <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
          <Shield className="w-32 h-32 text-cyan-400" />
        </div>

        {/* Top Header with Clearance Badge */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center font-mono-audit font-bold text-xs text-cyan-300">
              AS
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-tight">
                Dr. Arvind Subramanian
              </h3>
              <p className="text-[10px] font-mono-audit text-slate-400">
                Chief Vigilance Officer • MoSPI / CAG
              </p>
            </div>
          </div>

          <span className="text-[9.5px] font-mono-audit font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            LVL 4 SECRET
          </span>
        </div>

        {/* Digital Sentinel Credential Token */}
        <div className="my-3 p-2.5 rounded-lg bg-[#090D14] border border-[#1A2333] space-y-1.5 font-mono-audit text-xs">
          <div className="flex items-center justify-between text-[10.5px] text-slate-400">
            <span>Sentinel Auth Token</span>
            <span className="text-cyan-400 font-semibold">TOKEN-GOV-88392</span>
          </div>
          <div className="flex items-center justify-between text-[10.5px] text-slate-400">
            <span>Disbursal Hold Power</span>
            <span className="text-emerald-400 font-semibold">AUTHORITY ACTIVE</span>
          </div>
          <div className="flex items-center justify-between text-[10.5px] text-slate-400">
            <span>Jurisdiction</span>
            <span className="text-slate-300">Pan-India (543 LS + RS)</span>
          </div>
        </div>

        <div className="text-[10.5px] font-mono-audit text-slate-400 flex items-center justify-between pt-1">
          <span>Session Key: 0x9B41...E82</span>
          <span className="text-cyan-400">Delhi Nodal Secure</span>
        </div>
      </div>

      {/* Quick Sentinel Actions (ACRU 'Quick Payment / Transfer' position) */}
      <div
        id="card-quick-sentinel-actions"
        className="instrument-card rounded-xl p-4 border border-[#1E2638] bg-[#0F141E]"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-mono-audit uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            Quick Vigilance Actions
          </span>
          <span className="text-[10px] font-mono-audit text-slate-500">Authorized</span>
        </div>

        {/* Action Buttons Grid */}
        <div className="space-y-2">
          {/* Action 1: Freeze Disbursal */}
          <button
            id="btn-action-freeze-disbursal"
            onClick={() => onTriggerAction('freeze')}
            className="w-full flex items-center justify-between p-2.5 rounded-lg bg-red-950/30 hover:bg-red-950/60 border border-red-900/50 hover:border-red-600 text-slate-200 transition-all group text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded bg-red-950/80 border border-red-800 text-red-400 group-hover:text-red-300">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-semibold block text-slate-100 group-hover:text-red-200">
                  Freeze Disbursal Tranche
                </span>
                <span className="text-[10px] font-mono-audit text-slate-400">
                  Immediate PFMS/e-Sakshi payment halt
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-red-300 transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* Action 2: Trigger Satellite SAR Scan */}
          <button
            id="btn-action-satellite-scan"
            onClick={() => onTriggerAction('satellite')}
            className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#121927] hover:bg-[#182133] border border-[#202C40] hover:border-cyan-600/60 text-slate-200 transition-all group text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-400 group-hover:text-cyan-300">
                <Satellite className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-semibold block text-slate-100 group-hover:text-cyan-200">
                  Task ISRO Satellite SAR
                </span>
                <span className="text-[10px] font-mono-audit text-slate-400">
                  Sub-meter optical & radar ground audit
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-300 transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* Action 3: Generate CAG Audit Subpoena */}
          <button
            id="btn-action-cag-subpoena"
            onClick={() => onTriggerAction('subpoena')}
            className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#121927] hover:bg-[#182133] border border-[#202C40] hover:border-amber-600/60 text-slate-200 transition-all group text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded bg-amber-950/80 border border-amber-800 text-amber-400 group-hover:text-amber-300">
                <FileSignature className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-semibold block text-slate-100 group-hover:text-amber-200">
                  Issue Statutory Subpoena
                </span>
                <span className="text-[10px] font-mono-audit text-slate-400">
                  CAG Show-Cause notice under Sec 14(1)
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-300 transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* Action 4: Export MoSPI Brief */}
          <button
            id="btn-action-export-brief"
            onClick={() => onTriggerAction('export')}
            className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#121927] hover:bg-[#182133] border border-[#202C40] hover:border-slate-500 text-slate-200 transition-all group text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                <FileDown className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-semibold block text-slate-100">
                  Export Executive Dossier
                </span>
                <span className="text-[10px] font-mono-audit text-slate-400">
                  Encrypted PDF / CSV audit bundle
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* High-Scrutiny Constituencies Hotspot Feed */}
      <div
        id="card-constituency-hotspots"
        className="instrument-card rounded-xl p-4 border border-[#1E2638] bg-[#0F141E]"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono-audit uppercase tracking-wider text-slate-400 font-semibold">
            High-Scrutiny Hotspots
          </span>
          <span className="text-[10px] font-mono-audit text-red-400">High Variance</span>
        </div>

        <div className="space-y-2 mt-2">
          {HIGH_SCRUTINY_CONSTITUENCIES.map((con) => (
            <div
              key={con.id}
              onClick={() => onSelectConstituency(con.name)}
              className="p-2 rounded-lg bg-[#0A0D14] hover:bg-[#131A26] border border-[#1A2233] hover:border-[#2A374F] cursor-pointer transition-all flex items-center justify-between group"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300">
                    {con.name}
                  </span>
                  <span className="text-[9.5px] font-mono-audit text-slate-400">
                    ({con.state})
                  </span>
                </div>
                <div className="text-[10.5px] text-slate-400 truncate max-w-[170px] mt-0.5">
                  {con.highPriorityFlag}
                </div>
              </div>

              <div className="text-right font-mono-audit shrink-0">
                <div className="flex items-center justify-end gap-1">
                  <span
                    className={`text-xs font-bold ${
                      con.trustIndex < 65 ? 'text-amber-400' : 'text-slate-300'
                    }`}
                  >
                    {con.trustIndex}
                  </span>
                  {con.riskTrend === 'worsening' ? (
                    <TrendingDown className="w-3 h-3 text-red-400" />
                  ) : con.riskTrend === 'improving' ? (
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Minus className="w-3 h-3 text-slate-500" />
                  )}
                </div>
                <span className="text-[10px] text-slate-400">{con.flaggedProjects} flagged</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
