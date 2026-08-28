import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Download,
  RotateCcw,
  Sparkles,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  Table as TableIcon,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';
import { RiskAssessmentResult } from '../../types/riskAssessment';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { RiskFactorCard } from './RiskFactorCard';
import { assessmentService } from '../../services/risk/assessmentService';
import { toast } from 'sonner';

interface Props {
  result: RiskAssessmentResult;
  onModify: () => void;
}

export function AssessmentResultsView({ result, onModify }: Props) {
  const [isSaved, setIsSaved] = useState(false);
  const [compareExpanded, setCompareExpanded] = useState(false);

  const handleSave = () => {
    assessmentService.saveAssessment(result);
    setIsSaved(true);
    toast.success('Risk Assessment Saved', {
      description: `Assessment #${result.assessmentId} recorded into local intelligence history.`,
    });
  };

  const riskLevel = result.riskLevel;
  const riskColor =
    riskLevel === 'CRITICAL'
      ? 'text-[#C94B4B]'
      : riskLevel === 'HIGH'
      ? 'text-[#D99018]'
      : riskLevel === 'MEDIUM'
      ? 'text-[#C98220]'
      : 'text-[#2E8064]';

  const badgeVariant =
    riskLevel === 'CRITICAL'
      ? 'critical'
      : riskLevel === 'HIGH'
      ? 'saffron'
      : riskLevel === 'MEDIUM'
      ? 'secondary'
      : 'success';

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-[6px] border border-[#D9DFE3] shadow-subtle">
        <button
          type="button"
          onClick={onModify}
          className="flex items-center gap-1.5 text-xs font-bold text-[#15324A] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Modify Inputs & Re-run Simulation</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="text-xs font-bold border-[#D9DFE3] text-[#15324A] hover:bg-[#FAFAF7] flex items-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            Export Dossier
          </Button>

          <Button
            type="button"
            variant="default"
            size="sm"
            disabled={isSaved}
            onClick={handleSave}
            className="text-xs font-bold bg-[#15324A] hover:bg-[#0F2638] text-white flex items-center gap-1.5 shadow-subtle"
          >
            <BookmarkCheck className="h-3.5 w-3.5 text-[#E5B45A]" />
            {isSaved ? 'Saved to Intelligence Records' : 'Save Assessment'}
          </Button>
        </div>
      </div>

      {/* Assessment Header Dossier */}
      <div className="rounded-[8px] border-2 border-[#15324A] bg-white p-6 shadow-card space-y-6">
        {/* Title & Metadata */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-[#D9DFE3] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs text-[#15324A] bg-[#FAFAF7] px-2 py-0.5 rounded border border-[#D9DFE3]">
                {result.projectId}
              </span>
              <Badge variant="secondary" className="font-mono text-[10px]">
                {result.category}
              </Badge>
              <span className="text-[10px] text-[#647383] font-mono">
                Assessed: {result.timestamp}
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#15324A]">{result.projectName}</h2>
            <p className="text-xs text-[#647383]">
              {result.district} District, {result.state} • Prototype Rule-Based Inference
            </p>
          </div>

          {/* Large Analytical Score Card */}
          <div className="flex items-center gap-4 rounded-[6px] bg-[#FAFAF7] border border-[#D9DFE3] p-4 flex-shrink-0">
            <div className="text-center">
              <span className="text-[10px] text-[#647383] uppercase font-mono tracking-wider block">
                Project Risk Score
              </span>
              <div className="flex items-baseline justify-center gap-1 mt-0.5">
                <span className={`text-4xl font-extrabold font-mono ${riskColor}`}>
                  {result.riskScore}
                </span>
                <span className="text-xs font-mono font-bold text-[#647383]">/ 100</span>
              </div>
            </div>

            <div className="border-l border-[#D9DFE3] pl-4 space-y-1">
              <Badge variant={badgeVariant as any} className="font-mono text-xs px-2.5 py-0.5">
                {result.riskLevel} RISK
              </Badge>
              <p className="text-[10px] text-[#647383] max-w-[140px] leading-tight">
                Requires statutory verification before approval
              </p>
            </div>
          </div>
        </div>

        {/* Category Breakdown Bars */}
        <div className="space-y-3">
          <span className="text-[11px] font-mono font-bold text-[#15324A] uppercase tracking-wider block">
            Category-Level Risk Decomposition
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs font-mono">
            {Object.entries(result.categoryScores).map(([key, score]) => {
              const barColor =
                score > 70 ? 'bg-[#C94B4B]' : score > 40 ? 'bg-[#D99018]' : 'bg-[#2E8064]';
              return (
                <div key={key} className="p-3 rounded bg-[#FAFAF7] border border-[#D9DFE3] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#647383] uppercase">{key}</span>
                    <strong className="text-xs text-[#15324A]">{score}/100</strong>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                    <div className={`h-full ${barColor}`} style={{ width: `${score}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION: WHY AGASTYA FLAGGED THIS PROJECT */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-[#C94B4B]" />
            <h3 className="text-xs font-mono font-bold text-[#15324A] uppercase tracking-wider">
              Why AGASTYA Flagged This Project (Primary Risk Drivers)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {result.whyFlaggedContributors.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-[6px] border border-[#D9DFE3] bg-[#FAFAF7] space-y-2.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-[#D99018]">
                      DRIVER {c.index}
                    </span>
                    {c.riskContributionPoints > 0 && (
                      <span className="rounded bg-[#C94B4B]/15 px-1.5 py-0.2 text-[10px] font-mono font-bold text-[#C94B4B]">
                        +{c.riskContributionPoints} pts
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-[#15324A] mt-1">{c.title}</h4>
                  <p className="text-[11px] text-[#647383] leading-relaxed mt-1">{c.summary}</p>
                </div>

                <div className="p-2.5 rounded bg-white border border-[#D9DFE3] text-[10px] font-mono space-y-0.5">
                  <div className="flex justify-between">
                    <span className="text-[#647383]">{c.observedLabel}:</span>
                    <strong className="text-[#15324A]">{c.observedValue}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#647383]">{c.referenceLabel}:</span>
                    <strong className="text-[#647383]">{c.referenceValue}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION: EXPANDABLE IN-PLACE RISK FACTORS */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-[#15324A] uppercase tracking-wider">
              Detected Risk Factors & Evidence Triggers ({result.riskFactors.length})
            </h3>
            <span className="text-[11px] text-[#647383]">
              Click any card to inspect observed deviations and statutory checks
            </span>
          </div>

          <div className="space-y-2.5">
            {result.riskFactors.map((factor) => (
              <RiskFactorCard key={factor.id} factor={factor} />
            ))}
          </div>
        </div>

        {/* SECTION: COMPARE WITH EXPECTED TABLE */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={() => setCompareExpanded(!compareExpanded)}
            className="w-full flex items-center justify-between p-3 rounded-[6px] border border-[#D9DFE3] bg-[#FAFAF7] hover:bg-gray-100 transition-colors text-xs font-bold text-[#15324A]"
          >
            <div className="flex items-center gap-2">
              <TableIcon className="h-4 w-4 text-[#15324A]" />
              <span className="font-mono uppercase tracking-wider">
                Compare With Expected Baselines (Tolerance Matrix)
              </span>
            </div>
            {compareExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {compareExpanded && (
            <div className="rounded border border-[#D9DFE3] overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#15324A] text-white font-mono text-[10px] uppercase">
                  <tr>
                    <th className="p-3">Indicator Metric</th>
                    <th className="p-3">Observed Input</th>
                    <th className="p-3">Standard Reference</th>
                    <th className="p-3">Variance / Delta</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9DFE3] bg-white font-mono text-xs">
                  {result.compareWithExpected.map((row, i) => (
                    <tr key={i} className="hover:bg-[#FAFAF7]">
                      <td className="p-3 font-sans font-bold text-[#15324A]">{row.label}</td>
                      <td className="p-3 text-[#15324A]">{row.observed}</td>
                      <td className="p-3 text-[#647383]">{row.expected}</td>
                      <td className="p-3 font-bold text-[#15324A]">{row.difference}</td>
                      <td className="p-3 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            row.statusColor === 'red'
                              ? 'bg-red-50 text-[#C94B4B] border border-[#C94B4B]/30'
                              : row.statusColor === 'amber'
                              ? 'bg-amber-50 text-[#D99018] border border-[#D99018]/30'
                              : 'bg-emerald-50 text-[#2E8064] border border-[#2E8064]/30'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* SECTION: RECOMMENDED NEXT ACTIONS */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#2E8064]" />
            <h3 className="text-xs font-mono font-bold text-[#15324A] uppercase tracking-wider">
              Recommended Decision-Support Actions
            </h3>
          </div>

          <div className="p-4 rounded-[6px] bg-emerald-50/50 border border-[#2E8064]/30 space-y-2 text-xs">
            {result.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-2 text-[#172B3A]">
                <CheckCircle2 className="h-4 w-4 text-[#2E8064] flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
