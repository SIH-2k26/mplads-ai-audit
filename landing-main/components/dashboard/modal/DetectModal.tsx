import React from 'react';
import { ShieldAlert, AlertTriangle, ArrowRight, Clock, CheckCircle2, Info, Check, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DetectModalProps {
  onClose: () => void;
}

export function DetectModal({ onClose }: DetectModalProps) {
  const detectionSignals = [
    'Cost deviation above PWD Schedule of Rates baseline',
    'Fund utilization and dormant parking anomaly',
    'Timeline deviation past statutory milestone SLA',
    'Duplicate / overlapping works against State & PMGSY',
    'Tender / single-bid procurement anomaly',
    'Eligibility & statutory compliance signal',
  ];

  return (
    <div className="space-y-4 font-sans">
      {/* Context Brief */}
      <p className="text-xs text-[#6B6B6B] leading-relaxed">
        The Sentinel Engine continuously screens all MPLADS projects against statutory benchmarks, treasury
        data, and satellite verification. Below is a representative alert feed matching the operational
        dashboard view.
      </p>

      {/* ═══ PRIMARY ALERT CARD — Dashboard-styled card (#F1F0EC, rounded-[20px]) ═══ */}
      <div className="rounded-[20px] border border-[#E5E3DC] bg-[#F1F0EC] p-5 space-y-4 shadow-none">
        {/* Header Row: Icon Pill + ID + Severity + Status */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {/* Icon Pill */}
            <div className="w-8 h-8 rounded-full bg-[#EAE8E2] flex items-center justify-center border border-[#E5E3DC] flex-shrink-0">
              <ShieldAlert className="w-4 h-4 text-[#0E0E0E]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[#6B6B6B] font-mono">ALT-101</span>
                {/* Severity Badge — CRITICAL */}
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                  CRITICAL
                </span>
                {/* Status Badge — ACTIVE */}
                <span className="text-[10px] font-bold bg-[#0E0E0E] text-white px-2 py-0.5 rounded-full">
                  ACTIVE
                </span>
              </div>
              <h3 className="text-sm font-semibold text-[#0E0E0E] mt-1">
                Construction of Community Hall Ward 17
              </h3>
              <p className="text-[11px] text-[#6B6B6B] font-mono mt-0.5">
                P-1023 • Pune, Maharashtra • Civil Works
              </p>
            </div>
          </div>

          {/* Risk Score Pill */}
          <span className="text-xs font-bold font-mono bg-white text-[#0E0E0E] px-3 py-1.5 rounded-full border border-[#E5E3DC] flex-shrink-0 shadow-2xs">
            Risk Score: 88/100
          </span>
        </div>

        {/* Why Flagged */}
        <div className="space-y-1">
          <span className="text-[#6B6B6B] block uppercase tracking-wider text-[9px] font-bold">
            Why Flagged
          </span>
          <p className="text-[#0E0E0E] text-xs leading-relaxed">
            Financial progress of 92.5% is significantly ahead of 31% physical execution verified by
            Cartosat-3 SAR satellite radar. Cost deviation of +38.2% above PWD Schedule of Rates baseline
            for comparable civil works in Pune district.
          </p>
        </div>

        {/* Rule Applicability + SLA Deadline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <span className="text-[#6B6B6B] block uppercase tracking-wider text-[9px] font-bold">
              Rule Applicability
            </span>
            <span className="text-[#0E0E0E] font-medium text-xs block mt-0.5">
              MPLADS Revised Guidelines 2023 §4.2
            </span>
          </div>
          <div>
            <span className="text-[#6B6B6B] block uppercase tracking-wider text-[9px] font-bold">
              SLA Deadline
            </span>
            <span className="text-[#0E0E0E] font-semibold flex items-center gap-1 text-xs mt-0.5">
              <Clock className="w-3.5 h-3.5 text-red-600" />
              <span>05 Mar 2025 (7 days remaining)</span>
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-[#EAE8E2] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button className="bg-[#0E0E0E] hover:bg-black text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors cursor-default">
              Acknowledge
            </button>
            <button className="bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors cursor-default">
              Resolve & Lift Hold
            </button>
          </div>
          <Link
            to="/projects/P-1023"
            onClick={onClose}
            className="bg-white hover:bg-[#EAE8E2] text-[#0E0E0E] border border-[#E5E3DC] text-xs font-semibold px-4 py-1.5 rounded-full transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <span>Inspect Digital Twin</span>
            <Play className="w-3 h-3 text-[#0E0E0E]" />
          </Link>
        </div>
      </div>

      {/* ═══ SECONDARY ALERT CARD (HIGH severity, ACKNOWLEDGED status) ═══ */}
      <div className="rounded-[20px] border border-[#E5E3DC] bg-[#F1F0EC] p-4 space-y-3 shadow-none">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#EAE8E2] flex items-center justify-center border border-[#E5E3DC] flex-shrink-0">
              <AlertTriangle className="w-4 h-4 text-[#0E0E0E]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[#6B6B6B] font-mono">ALT-237</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                  HIGH
                </span>
                <span className="text-[10px] font-bold bg-[#EAE8E2] text-[#0E0E0E] px-2 py-0.5 rounded-full border border-[#E5E3DC]">
                  ACKNOWLEDGED
                </span>
              </div>
              <h3 className="text-sm font-semibold text-[#0E0E0E] mt-1">
                Rural Road Link Villupuram-Sirkazhi NH Connector
              </h3>
              <p className="text-[11px] text-[#6B6B6B] font-mono mt-0.5">
                P-2847 • Villupuram, Tamil Nadu • Road Construction
              </p>
            </div>
          </div>
          <span className="text-xs font-bold font-mono bg-white text-[#0E0E0E] px-3 py-1.5 rounded-full border border-[#E5E3DC] flex-shrink-0 shadow-2xs">
            Risk Score: 72/100
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-[#6B6B6B] block uppercase tracking-wider text-[9px] font-bold">
            Why Flagged
          </span>
          <p className="text-[#0E0E0E] text-xs leading-relaxed">
            Single-bid tender with compressed 8-day notice period. Contractor concentration of 48% across
            district with 6 simultaneous active works under same PAN entity.
          </p>
        </div>

        <div className="pt-3 border-t border-[#EAE8E2] flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Acknowledged by District Authority</span>
          </span>
          <Link
            to="/projects/P-0871"
            onClick={onClose}
            className="bg-white hover:bg-[#EAE8E2] text-[#0E0E0E] border border-[#E5E3DC] text-xs font-semibold px-3.5 py-1 rounded-full transition-colors flex items-center gap-1 shadow-2xs"
          >
            <span>Inspect</span>
            <Play className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* ═══ DETECTION SIGNALS REFERENCE ═══ */}
      <div className="rounded-[16px] border border-[#E5E3DC] bg-[#FAFAF9] p-4 space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6B6B6B] block">
          6 Continuous Detection Signal Types
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {detectionSignals.map((signal, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-[#0E0E0E]">
              <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{signal}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ INSTITUTIONAL DISCLAIMER ═══ */}
      <div className="rounded-[16px] border border-[#E5E3DC] bg-[#FAFAF9] p-3 flex items-start gap-2.5 text-[11px] text-[#6B6B6B]">
        <Info className="h-4 w-4 text-[#6B6B6B] flex-shrink-0 mt-0.5" />
        <span>
          Early warning signals are decision-support indicators, not accusations. Only designated
          constitutional authorities may take statutory action. All actions are logged to an immutable
          audit trail with officer credentials and timestamps.
        </span>
      </div>
    </div>
  );
}
