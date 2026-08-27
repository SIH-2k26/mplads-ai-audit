// Early Warning component — frontend/src/components/risk/EarlyWarning.tsx

import type { EarlyWarnings } from '../../types/risk';
import { AlertTriangle, Clock, TrendingUp, DollarSign, Activity } from 'lucide-react';

const WARNING_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  DELAY: Clock,
  COST_OVERRUN: DollarSign,
  PAYMENT_MISMATCH: Activity,
  RISK_TRAJECTORY: TrendingUp,
};

const SEVERITY_STYLES = {
  LOW: 'bg-green-50 border-green-200 text-green-800',
  MEDIUM: 'bg-amber-50 border-amber-200 text-amber-800',
  HIGH: 'bg-red-50 border-red-200 text-red-800',
  CRITICAL: 'bg-rose-50 border-rose-300 text-rose-900',
};

interface Props {
  warnings: EarlyWarnings;
}

export default function EarlyWarning({ warnings }: Props) {
  if (!warnings.predictions.length) {
    return <p className="text-sm text-slate-400">No early warnings generated.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {warnings.predictions.map((pred, i) => {
        const Icon = WARNING_ICONS[pred.type] ?? AlertTriangle;
        const style = SEVERITY_STYLES[pred.severity];
        return (
          <div key={i} className={`rounded-xl border p-4 ${style}`}>
            <div className="flex items-start gap-3">
              <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">{pred.label}</p>
                <p className="text-xs mt-0.5 opacity-80">
                  Probability: {(pred.probability * 100).toFixed(0)}%
                </p>
                {pred.description && (
                  <p className="text-xs mt-1.5 opacity-75 leading-relaxed">{pred.description}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
