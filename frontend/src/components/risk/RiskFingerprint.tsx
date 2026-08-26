// Risk Fingerprint — frontend/src/components/risk/RiskFingerprint.tsx
// Visualizes backend-generated risk signals as horizontal bar chart.
// Does NOT compute any values — purely displays what backend returns.

import type { RiskFingerprint as RiskFingerprintType } from '../../types/risk';

const SIGNAL_LABELS: Record<keyof RiskFingerprintType, string> = {
  costInflation: 'Cost Inflation',
  paymentProgressMismatch: 'Payment/Progress Mismatch',
  repeatedDelay: 'Repeated Delay',
  contractorPattern: 'Contractor Pattern',
  documentationGap: 'Documentation Gap',
  duplicateWork: 'Duplicate Work',
  procurementIrregularity: 'Procurement Irregularity',
  geographicCluster: 'Geographic Cluster',
};

function getBarColor(value: number): string {
  if (value >= 0.8) return 'bg-rose-500';
  if (value >= 0.6) return 'bg-red-400';
  if (value >= 0.4) return 'bg-amber-400';
  return 'bg-green-400';
}

function getTextColor(value: number): string {
  if (value >= 0.8) return 'text-rose-700';
  if (value >= 0.6) return 'text-red-600';
  if (value >= 0.4) return 'text-amber-600';
  return 'text-green-600';
}

interface Props {
  fingerprint: RiskFingerprintType;
}

export default function RiskFingerprint({ fingerprint }: Props) {
  const entries = Object.entries(fingerprint) as [keyof RiskFingerprintType, number][];
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-3">
      {sorted.map(([key, value]) => (
        <div key={key}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-600">{SIGNAL_LABELS[key]}</span>
            <span className={`text-xs font-semibold ${getTextColor(value)}`}>
              {(value * 100).toFixed(0)}
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${getBarColor(value)}`}
              style={{ width: `${value * 100}%` }}
            />
          </div>
        </div>
      ))}
      <p className="text-xs text-slate-400 mt-2">
        Values computed by backend risk engine. Higher = more risk signal detected.
      </p>
    </div>
  );
}
