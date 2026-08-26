// SHAP Explainability — frontend/src/components/risk/ShapExplainability.tsx
// Renders backend-provided feature contributions in a SHAP-style waterfall/bar chart.
// No ML logic in frontend — only visualization.

import type { ShapExplanation } from '../../types/risk';
import { SHAP_BAR_COLOR } from '../../utils/riskColors';

interface Props {
  shap: ShapExplanation;
}

export default function ShapExplainability({ shap }: Props) {
  const maxAbs = Math.max(...shap.features.map((f) => Math.abs(f.contribution)));

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
        <span>Feature</span>
        <span>Contribution to Risk</span>
      </div>

      {shap.features.map((feature, i) => {
        const pct = (Math.abs(feature.contribution) / maxAbs) * 100;
        const color = SHAP_BAR_COLOR(feature.contribution);
        const isPositive = feature.contribution >= 0;

        return (
          <div key={i} className="flex items-center gap-3 py-1.5 border-b border-slate-50 last:border-0">
            {/* Feature name */}
            <div className="w-36 flex-shrink-0">
              <p className="text-xs text-slate-700 font-medium">{feature.feature}</p>
              {feature.value && (
                <p className="text-xs text-slate-400">{feature.value}</p>
              )}
            </div>

            {/* Bar */}
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1 h-5 bg-slate-50 rounded overflow-hidden relative">
                <div
                  className="absolute top-0 h-full rounded transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    left: isPositive ? '0%' : undefined,
                    right: !isPositive ? '0%' : undefined,
                    backgroundColor: color,
                    opacity: 0.75,
                  }}
                />
              </div>

              {/* Value */}
              <span
                className="text-xs font-semibold w-12 text-right"
                style={{ color }}
              >
                {isPositive ? '+' : ''}{feature.contribution.toFixed(2)}
              </span>
            </div>
          </div>
        );
      })}

      <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-2 border-t border-slate-100">
        <span>Baseline Risk: <strong className="text-slate-600">{shap.baselineRisk}</strong></span>
        <span>Final Risk: <strong className="text-slate-700">{shap.finalRisk}</strong></span>
      </div>
      <p className="text-xs text-slate-400 mt-1">
        Feature contributions computed by backend ML explainability engine.
      </p>
    </div>
  );
}
