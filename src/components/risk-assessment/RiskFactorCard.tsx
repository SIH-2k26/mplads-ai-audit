import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { RiskFactorItem } from '../../types/riskAssessment';
import { Badge } from '../ui/badge';

interface Props {
  factor: RiskFactorItem;
}

export function RiskFactorCard({ factor }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const severityColor =
    factor.severity === 'CRITICAL'
      ? 'border-[#C94B4B]/40 bg-red-50/20'
      : factor.severity === 'HIGH'
      ? 'border-[#D99018]/40 bg-amber-50/20'
      : factor.severity === 'MEDIUM'
      ? 'border-[#C98220]/40 bg-orange-50/20'
      : 'border-[#2E8064]/40 bg-emerald-50/20';

  const badgeVariant =
    factor.severity === 'CRITICAL'
      ? 'critical'
      : factor.severity === 'HIGH'
      ? 'saffron'
      : factor.severity === 'MEDIUM'
      ? 'secondary'
      : 'success';

  return (
    <div
      className={`rounded-[6px] border transition-all duration-200 ${severityColor} overflow-hidden shadow-subtle`}
    >
      {/* Clickable Header Row */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left flex items-start justify-between gap-3 hover:bg-black/[0.02] transition-colors"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant={badgeVariant as any} className="font-mono text-[10px]">
              {factor.severity}
            </Badge>
            <span className="font-mono text-[10px] text-[#647383] uppercase font-bold">
              {factor.category}
            </span>
            {factor.riskContribution > 0 && (
              <span className="rounded bg-black/5 px-1.5 py-0.2 text-[10px] font-mono font-bold text-[#15324A]">
                +{factor.riskContribution} pts
              </span>
            )}
          </div>
          <h4 className="text-xs font-bold text-[#15324A]">{factor.title}</h4>
          <p className="text-[11px] text-[#647383]">
            Observed: <strong className="text-[#172B3A]">{factor.observedValue}</strong>
          </p>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-semibold text-[#15324A] flex-shrink-0 mt-1">
          <span>{isExpanded ? 'Collapse' : 'Details'}</span>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {/* Expanded In-Place Details */}
      {isExpanded && (
        <div className="p-4 pt-0 border-t border-black/5 space-y-3 text-xs animate-in fade-in-50 duration-150">
          {/* Comparative Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 font-mono text-[11px]">
            <div className="p-2.5 rounded bg-white border border-[#D9DFE3]">
              <span className="text-[9px] text-[#647383] uppercase block">Observed Input</span>
              <strong className="text-[#15324A]">{factor.observedValue}</strong>
            </div>

            <div className="p-2.5 rounded bg-white border border-[#D9DFE3]">
              <span className="text-[9px] text-[#647383] uppercase block">Reference / Expected</span>
              <strong className="text-[#647383]">{factor.referenceValue}</strong>
            </div>

            <div className="p-2.5 rounded bg-white border border-[#D9DFE3]">
              <span className="text-[9px] text-[#647383] uppercase block">Deviation Delta</span>
              <strong className="text-[#C94B4B]">{factor.deviation}</strong>
            </div>
          </div>

          {/* Why It Matters */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-[#15324A] uppercase tracking-wider block">
              Why This Matters
            </span>
            <p className="text-xs text-[#172B3A] leading-relaxed bg-white p-3 rounded border border-[#D9DFE3]">
              {factor.whyItMatters}
            </p>
          </div>

          {/* Recommended Verification */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-[#2E8064] uppercase tracking-wider block">
              Recommended Statutory Verification
            </span>
            <p className="text-xs text-[#172B3A] leading-relaxed bg-emerald-50/50 p-3 rounded border border-[#2E8064]/30">
              {factor.recommendedVerification}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
