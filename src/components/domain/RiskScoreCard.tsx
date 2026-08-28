import React from 'react';
import { ShieldAlert, Info, Activity } from 'lucide-react';
import { getRiskColorClass } from '../../lib/utils';

export function RiskScoreCard({
  currentScore,
  futureScore,
  systemicScore,
  confidence = 92,
  evidenceCoverage = 88,
  className,
}: {
  currentScore: number;
  futureScore?: number;
  systemicScore?: number;
  confidence?: number;
  evidenceCoverage?: number;
  className?: string;
}) {
  const currentRisk = getRiskColorClass(currentScore);

  return (
    <div className={`rounded-[6px] border border-[#D9D5CC] bg-white p-5 shadow-card ${className || ''}`}>
      <div className="flex items-center justify-between border-b border-[#EDE8DE] pb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-[4px] ${currentRisk.bg} ${currentRisk.text}`}>
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[#18324A] uppercase tracking-wider">Composite Risk Index</h4>
            <p className="text-[11px] text-[#667085]">AI Multi-Factor Risk Assessment</p>
          </div>
        </div>
        <span className={`px-2.5 py-1 text-xs font-bold rounded-[3px] border ${currentRisk.badgeBg}`}>
          {currentRisk.label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 my-4 py-1 text-center divide-x divide-[#EDE8DE]">
        <div>
          <span className="text-[11px] font-medium text-[#667085] uppercase tracking-wider block">Current Risk</span>
          <span className={`text-3xl font-extrabold font-mono ${currentRisk.text}`}>
            {currentScore}
            <span className="text-xs font-normal text-[#667085]">/100</span>
          </span>
        </div>

        <div>
          <span className="text-[11px] font-medium text-[#667085] uppercase tracking-wider block">Future Risk (SLA)</span>
          <span className="text-2xl font-bold font-mono text-[#18324A]">
            {futureScore ?? Math.max(10, Math.round(currentScore * 0.85))}
            <span className="text-xs font-normal text-[#667085]">/100</span>
          </span>
        </div>

        <div>
          <span className="text-[11px] font-medium text-[#667085] uppercase tracking-wider block">Systemic Risk</span>
          <span className="text-2xl font-bold font-mono text-[#18324A]">
            {systemicScore ?? Math.max(15, Math.round(currentScore * 0.78))}
            <span className="text-xs font-normal text-[#667085]">/100</span>
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-[#EDE8DE] flex items-center justify-between text-[11px] text-[#667085]">
        <span className="flex items-center gap-1.5">
          <Activity className="h-3.5 w-3.5 text-[#2F7658]" />
          Model Confidence: <strong className="text-[#18324A]">{confidence}%</strong>
        </span>
        <span className="flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-[#18324A]" />
          Evidence Coverage: <strong className="text-[#18324A]">{evidenceCoverage}%</strong>
        </span>
      </div>
    </div>
  );
}
