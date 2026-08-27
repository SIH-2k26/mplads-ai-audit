import React from 'react';
import { AlertTriangle, ChevronRight } from 'lucide-react';

export function WhyFlaggedBox({
  reasons,
  className,
}: {
  reasons: string[];
  className?: string;
}) {
  if (!reasons || reasons.length === 0) {
    return (
      <div className={`rounded-[6px] border border-[#2F7658]/30 bg-emerald-50/40 p-4 ${className || ''}`}>
        <h4 className="text-xs font-semibold text-[#2F7658] uppercase tracking-wider mb-1">Audit Status: Normal</h4>
        <p className="text-xs text-[#2F7658]">No active anomalies or regulatory breaches detected for this work.</p>
      </div>
    );
  }

  return (
    <div className={`rounded-[6px] border border-[#C98219]/40 bg-[#FFFDF8] p-5 shadow-subtle ${className || ''}`}>
      <div className="flex items-center gap-2 mb-3 border-b border-[#EDE8DE] pb-2.5">
        <div className="p-1 rounded-[3px] bg-[#C98219]/10 text-[#C98219]">
          <AlertTriangle className="h-4 w-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-[#18324A] uppercase tracking-wider">Why Was This Flagged?</h4>
          <p className="text-[11px] text-[#667085]">AI Diagnostic Rationales & Benchmark Deviations</p>
        </div>
      </div>

      <ul className="space-y-2.5">
        {reasons.map((reason, index) => (
          <li key={index} className="flex items-start gap-2 text-xs leading-relaxed text-[#1D2939]">
            <ChevronRight className="h-3.5 w-3.5 text-[#C98219] flex-shrink-0 mt-0.5" />
            <span>{reason}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
