import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { ProjectAssessmentInput } from '../../types/riskAssessment';
import { Button } from '../ui/button';

interface Props {
  formData: ProjectAssessmentInput;
  onSubmit: () => void;
  onReset: () => void;
  isProcessing: boolean;
}

export function LiveRiskPreview({ formData, onSubmit, onReset, isProcessing }: Props) {
  // Quick dynamic projection calculation for the sticky preview
  const utilization =
    formData.amountReleased > 0
      ? Math.min(100, Math.round((formData.amountUtilized / formData.amountReleased) * 100))
      : 0;

  const mismatch = Math.max(0, formData.financialProgress - formData.physicalProgress);

  const bidDeviation =
    formData.estimatedTenderAmount > 0
      ? Math.round(
          ((formData.selectedBidAmount - formData.estimatedTenderAmount) /
            formData.estimatedTenderAmount) *
            100
        )
      : 0;

  // Real-time quick score estimation
  let estimatedScore = 14;
  if (mismatch > 30) estimatedScore += 35;
  else if (mismatch > 15) estimatedScore += 20;

  if (bidDeviation > 25) estimatedScore += 22;
  else if (bidDeviation > 10) estimatedScore += 12;

  if (formData.eligibleBidderCount <= 1 || formData.tenderType === 'Nomination') estimatedScore += 16;
  if (formData.duplicateWorkSuspected) estimatedScore += 24;
  if (formData.nearbySimilarWork) estimatedScore += 10;
  if (!formData.technicalSanctionAvailable) estimatedScore += 20;
  if (formData.contractorConcentrationPercentage > 40) estimatedScore += 12;
  if (formData.actualDurationDays > formData.plannedDurationDays + 60) estimatedScore += 12;

  estimatedScore = Math.min(98, Math.max(12, estimatedScore));

  const riskLevel =
    estimatedScore >= 80
      ? 'CRITICAL'
      : estimatedScore >= 60
      ? 'HIGH'
      : estimatedScore >= 30
      ? 'MEDIUM'
      : 'LOW';

  const riskColor =
    riskLevel === 'CRITICAL'
      ? 'text-[#C94B4B]'
      : riskLevel === 'HIGH'
      ? 'text-[#D99018]'
      : riskLevel === 'MEDIUM'
      ? 'text-[#C98220]'
      : 'text-[#2E8064]';

  const riskBg =
    riskLevel === 'CRITICAL'
      ? 'bg-[#C94B4B]'
      : riskLevel === 'HIGH'
      ? 'bg-[#D99018]'
      : riskLevel === 'MEDIUM'
      ? 'bg-[#C98220]'
      : 'bg-[#2E8064]';

  // Active risk drivers detected
  const activeDrivers: string[] = [];
  if (mismatch > 15) activeDrivers.push(`Financial/physical gap (${mismatch} pts)`);
  if (bidDeviation > 15) activeDrivers.push(`Tender bid markup (+${bidDeviation}%)`);
  if (formData.eligibleBidderCount <= 1) activeDrivers.push('Single eligible bidder recorded');
  if (formData.tenderType === 'Nomination') activeDrivers.push('Direct nomination tender');
  if (formData.duplicateWorkSuspected) activeDrivers.push('Suspected duplicate scheme overlap');
  if (!formData.technicalSanctionAvailable) activeDrivers.push('Missing Technical Sanction (TS)');
  if (formData.contractorConcentrationPercentage > 40) activeDrivers.push(`High contractor volume (${formData.contractorConcentrationPercentage}%)`);

  return (
    <div className="sticky top-20 rounded-[8px] border-2 border-[#15324A] bg-white p-5 shadow-card space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#D9DFE3] pb-3">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-[#D99018]" />
          <h3 className="text-xs font-bold font-mono text-[#15324A] uppercase tracking-wider">
            Live Risk Signal Preview
          </h3>
        </div>
        <span className="rounded bg-[#FAFAF7] border border-[#D9DFE3] px-2 py-0.5 text-[10px] font-bold text-[#647383] font-mono">
          REAL-TIME
        </span>
      </div>

      {/* Score Meter */}
      <div className="rounded-[6px] bg-[#FAFAF7] border border-[#D9DFE3] p-4 text-center space-y-2">
        <span className="text-[10px] text-[#647383] uppercase font-mono tracking-wider block">
          Projected Risk Score
        </span>
        <div className="flex items-baseline justify-center gap-1">
          <span className={`text-4xl font-extrabold font-mono ${riskColor}`}>
            {estimatedScore}
          </span>
          <span className="text-sm text-[#647383] font-mono font-bold">/ 100</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono text-white" style={{ backgroundColor: riskLevel === 'CRITICAL' ? '#C94B4B' : riskLevel === 'HIGH' ? '#D99018' : riskLevel === 'MEDIUM' ? '#C98220' : '#2E8064' }}>
          {riskLevel} RISK
        </div>

        {/* Progress Bar */}
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${estimatedScore}%`,
              backgroundColor:
                riskLevel === 'CRITICAL'
                  ? '#C94B4B'
                  : riskLevel === 'HIGH'
                  ? '#D99018'
                  : riskLevel === 'MEDIUM'
                  ? '#C98220'
                  : '#2E8064',
            }}
          />
        </div>
      </div>

      {/* Derived Indicator Pills */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="p-2 rounded bg-[#FAFAF7] border border-[#D9DFE3]">
          <span className="text-[9px] text-[#647383] uppercase block">Utilisation</span>
          <strong className="text-[#15324A]">{utilization}%</strong>
        </div>
        <div className="p-2 rounded bg-[#FAFAF7] border border-[#D9DFE3]">
          <span className="text-[9px] text-[#647383] uppercase block">Progress Gap</span>
          <strong className={mismatch > 15 ? 'text-[#C94B4B]' : 'text-[#2E8064]'}>
            +{mismatch} pts
          </strong>
        </div>
        <div className="p-2 rounded bg-[#FAFAF7] border border-[#D9DFE3]">
          <span className="text-[9px] text-[#647383] uppercase block">Bid Deviation</span>
          <strong className={bidDeviation > 15 ? 'text-[#C94B4B]' : 'text-[#2E8064]'}>
            {bidDeviation > 0 ? `+${bidDeviation}%` : `${bidDeviation}%`}
          </strong>
        </div>
        <div className="p-2 rounded bg-[#FAFAF7] border border-[#D9DFE3]">
          <span className="text-[9px] text-[#647383] uppercase block">Bidders</span>
          <strong className={formData.eligibleBidderCount <= 1 ? 'text-[#C94B4B]' : 'text-[#2E8064]'}>
            {formData.eligibleBidderCount} qualified
          </strong>
        </div>
      </div>

      {/* Detected Risk Signals List */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[10px] font-bold text-[#15324A] uppercase tracking-wider block font-mono">
          Detected Risk Signals ({activeDrivers.length}):
        </span>
        {activeDrivers.length === 0 ? (
          <div className="p-2.5 rounded bg-emerald-50 border border-[#2E8064]/30 text-[11px] font-semibold text-[#2E8064] flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Parameters within nominal tolerance.
          </div>
        ) : (
          <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
            {activeDrivers.map((driver, i) => (
              <div
                key={i}
                className="p-1.5 rounded bg-red-50/60 border border-[#C94B4B]/20 text-[11px] font-medium text-[#C94B4B] flex items-center gap-1.5"
              >
                <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{driver}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2 border-t border-[#D9DFE3]">
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isProcessing}
          className="w-full h-10 bg-[#15324A] hover:bg-[#0F2638] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-subtle"
        >
          {isProcessing ? (
            <span>Running Analytical Pipeline...</span>
          ) : (
            <>
              <span>Run Risk Assessment</span>
              <ArrowRight className="h-4 w-4 text-[#E5B45A]" />
            </>
          )}
        </Button>

        <button
          type="button"
          onClick={onReset}
          disabled={isProcessing}
          className="w-full py-1.5 text-[11px] font-semibold text-[#647383] hover:text-[#15324A] flex items-center justify-center gap-1 transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          Reset Form to Clean Baseline
        </button>
      </div>
    </div>
  );
}
