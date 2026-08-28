import React from 'react';
import { RiskFingerprint as FingerprintType } from '../../types';
import { getRiskColorClass } from '../../lib/utils';

export function RiskFingerprint({
  fingerprint,
  className,
}: {
  fingerprint: FingerprintType;
  className?: string;
}) {
  const vectors = [
    { label: 'Cost Deviation & SoR', key: 'cost', value: fingerprint.cost },
    { label: 'Financial Progress Mismatch', key: 'financial', value: fingerprint.financial },
    { label: 'Procurement / Tender Bypass', key: 'procurement', value: fingerprint.procurement },
    { label: 'Execution Velocity', key: 'execution', value: fingerprint.execution },
    { label: 'Milestone Delay Probability', key: 'delay', value: fingerprint.delay },
    { label: 'Contractor Cartelization', key: 'contractor', value: fingerprint.contractor },
    { label: 'Geospatial Duplicate Similarity', key: 'duplicate', value: fingerprint.duplicate },
    { label: 'Regulatory & UC Compliance', key: 'compliance', value: fingerprint.compliance },
    { label: 'Agency Historical Irregularities', key: 'historical', value: fingerprint.historical },
  ];

  return (
    <div className={`rounded-[6px] border border-[#D9D5CC] bg-white p-5 shadow-card ${className || ''}`}>
      <div className="flex items-center justify-between border-b border-[#EDE8DE] pb-3 mb-4">
        <div>
          <h4 className="text-xs font-semibold text-[#18324A] uppercase tracking-wider">Risk Fingerprint Matrix</h4>
          <p className="text-[11px] text-[#667085]">Decomposed Anomaly Factors (0–100 Scale)</p>
        </div>
        <span className="text-[11px] font-mono text-[#667085] bg-[#F7F5F0] px-2 py-0.5 rounded border border-[#D9D5CC]">
          9 Anomaly Vectors
        </span>
      </div>

      <div className="space-y-3">
        {vectors.map((vec) => {
          const riskStyle = getRiskColorClass(vec.value);
          return (
            <div key={vec.key} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#1D2939] font-medium">{vec.label}</span>
                <span className={`font-mono font-bold text-[11px] ${riskStyle.text}`}>
                  {vec.value}
                  <span className="text-[#667085] font-normal">/100</span>
                </span>
              </div>
              <div className="h-2 w-full bg-[#EDE8DE] rounded-[2px] overflow-hidden">
                <div
                  className={`h-full rounded-[2px] transition-all duration-500 ${
                    vec.value >= 80
                      ? 'bg-[#B44343]'
                      : vec.value >= 60
                      ? 'bg-[#C98219]'
                      : vec.value >= 35
                      ? 'bg-[#B7791F]'
                      : 'bg-[#2F7658]'
                  }`}
                  style={{ width: `${vec.value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
