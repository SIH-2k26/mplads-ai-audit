// Risk Score Card — frontend/src/components/risk/RiskScoreCard.tsx

import type { RiskResult } from '../../types/risk';
import { RiskBadge } from '../common';
import { RISK_SCORE_COLOR } from '../../utils/riskColors';

interface Props {
  risk: RiskResult;
}

export default function RiskScoreCard({ risk }: Props) {
  const scoreColor = RISK_SCORE_COLOR(risk.overallRiskScore);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {/* Overall */}
      <div className="col-span-2 sm:col-span-1 bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center border border-slate-200">
        <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Overall Risk</p>
        <p className={`text-5xl font-bold ${scoreColor}`}>{risk.overallRiskScore}</p>
        <p className="text-xs text-slate-400 mt-1">out of 100</p>
        <div className="mt-2">
          <RiskBadge level={risk.riskLevel} />
        </div>
      </div>

      {/* Current */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Current Risk</p>
        <p className={`text-3xl font-bold ${RISK_SCORE_COLOR(risk.currentRisk)}`}>{risk.currentRisk}</p>
        <p className="text-xs text-slate-400 mt-1">Present state</p>
      </div>

      {/* Future */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Future Risk</p>
        <p className={`text-3xl font-bold ${RISK_SCORE_COLOR(risk.futureRisk)}`}>{risk.futureRisk}</p>
        <p className="text-xs text-slate-400 mt-1">Projected</p>
      </div>

      {/* Systemic */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Systemic Risk</p>
        <p className={`text-3xl font-bold ${RISK_SCORE_COLOR(risk.systemicRisk)}`}>{risk.systemicRisk}</p>
        <p className="text-xs text-slate-400 mt-1">Agency/Contractor</p>
      </div>
    </div>
  );
}
