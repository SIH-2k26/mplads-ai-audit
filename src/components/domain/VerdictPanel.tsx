import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, AlertCircle, ArrowUpRight, CheckSquare } from 'lucide-react';
import { CaseStatus } from '../../types';
import { Button } from '../ui/button';
import { caseService } from '../../services/caseService';

export function VerdictPanel({
  caseId,
  currentStatus,
  existingNotes,
  onVerdictSubmitted,
  className,
}: {
  caseId: string;
  currentStatus: CaseStatus;
  existingNotes?: string;
  onVerdictSubmitted?: (updatedCase: any) => void;
  className?: string;
}) {
  const [selectedVerdict, setSelectedVerdict] = useState<CaseStatus>(currentStatus);
  const [notes, setNotes] = useState<string>(existingNotes || '');
  const [investigatorName, setInvestigatorName] = useState<string>('Dr. Ramesh Deshmukh (Addl. Collector)');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleSaveVerdict = async () => {
    if (!notes.trim()) {
      alert('Please enter statutory audit/investigation notes before submitting verdict.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await caseService.updateCaseVerdict(caseId, selectedVerdict, notes, investigatorName);
      setSuccessMessage('Official investigation verdict recorded into immutable audit trail.');
      if (onVerdictSubmitted && res) {
        onVerdictSubmitted(res);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const verdictOptions: Array<{
    value: CaseStatus;
    label: string;
    description: string;
    icon: any;
    color: string;
  }> = [
    {
      value: 'CONFIRMED_ISSUE',
      label: 'Confirm Irregularity / Overrun',
      description: 'Evidence verifies violation of MPLADS Guidelines or SoR benchmark.',
      icon: AlertCircle,
      color: 'text-[#B44343] border-[#B44343]/30 hover:bg-red-50/60',
    },
    {
      value: 'FALSE_POSITIVE',
      label: 'Dismiss as False Positive',
      description: 'Legitimate cost or terrain factor justified by engineering memo.',
      icon: XCircle,
      color: 'text-[#2F7658] border-[#2F7658]/30 hover:bg-emerald-50/60',
    },
    {
      value: 'INSUFFICIENT_EVIDENCE',
      label: 'Insufficient Evidence (Site Audit Req.)',
      description: 'Require physical verification by Independent Quality Monitor (IQM).',
      icon: ShieldCheck,
      color: 'text-[#B7791F] border-[#B7791F]/30 hover:bg-amber-50/60',
    },
    {
      value: 'RESOLVED',
      label: 'Mark Resolved (Rectified)',
      description: 'Compliance defect rectified, missing UC furnished or recovery completed.',
      icon: CheckCircle2,
      color: 'text-[#2F7658] border-[#2F7658]/30 hover:bg-emerald-50/60',
    },
    {
      value: 'ESCALATED',
      label: 'Escalate to State / CAG Vigilance',
      description: 'Subpoena required for contractor syndicate or treasury inquiry.',
      icon: ArrowUpRight,
      color: 'text-[#7E57C2] border-[#7E57C2]/30 hover:bg-purple-50/60',
    },
  ];

  return (
    <div className={`rounded-[6px] border border-[#D9D5CC] bg-white p-5 shadow-card ${className || ''}`}>
      <div className="flex items-center justify-between border-b border-[#EDE8DE] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-[4px] bg-[#18324A] text-white">
            <CheckSquare className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#18324A] uppercase tracking-wider">
              Statutory Human Verdict & Decision
            </h4>
            <p className="text-[11px] text-[#667085]">
              AI flags anomalies; only designated human authorities record formal verdicts
            </p>
          </div>
        </div>

        <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded bg-[#EDE8DE] text-[#18324A] border border-[#D9D5CC]">
          Status: {currentStatus.replace('_', ' ')}
        </span>
      </div>

      {successMessage && (
        <div className="mb-4 p-3 rounded-[4px] bg-emerald-50 border border-[#2F7658]/30 text-xs font-semibold text-[#2F7658] flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          {successMessage}
        </div>
      )}

      {/* Select Verdict Option */}
      <div className="space-y-2 mb-4">
        <label className="text-xs font-bold text-[#18324A] uppercase tracking-wider block">
          Select Finding Verdict
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {verdictOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedVerdict === opt.value;

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedVerdict(opt.value)}
                className={`flex items-start gap-2.5 p-3 rounded-[4px] border text-left transition-all ${
                  isSelected
                    ? 'bg-[#18324A] text-white border-[#18324A] shadow-sm'
                    : `bg-white border-[#D9D5CC] ${opt.color}`
                }`}
              >
                <Icon className={`h-4 w-4 flex-shrink-0 mt-0.5 ${isSelected ? 'text-white' : ''}`} />
                <div>
                  <div className="text-xs font-bold leading-tight">{opt.label}</div>
                  <div
                    className={`text-[11px] leading-relaxed mt-0.5 ${
                      isSelected ? 'text-gray-200' : 'text-[#667085]'
                    }`}
                  >
                    {opt.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Audit Notes Input */}
      <div className="space-y-2 mb-4">
        <label className="text-xs font-bold text-[#18324A] uppercase tracking-wider block">
          Official Audit & Investigation Notes <span className="text-[#B44343]">*</span>
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Record ground inspection findings, contractor explanation, engineer remarks, or justification memo reference..."
          className="w-full rounded-[4px] border border-[#D9D5CC] bg-white p-3 text-xs text-[#1D2939] placeholder:text-[#98A2B3] focus:border-[#18324A] focus:outline-none focus:ring-1 focus:ring-[#18324A]"
        />
      </div>

      {/* Investigator Attribution */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#EDE8DE]">
        <div className="text-xs text-[#667085]">
          Signing Authority: <strong className="text-[#18324A]">{investigatorName}</strong>
        </div>

        <Button
          variant="default"
          size="sm"
          disabled={isSubmitting}
          onClick={handleSaveVerdict}
          className="text-xs flex items-center gap-1.5"
        >
          <ShieldCheck className="h-4 w-4" />
          {isSubmitting ? 'Recording Verdict...' : 'Submit Authoritative Verdict'}
        </Button>
      </div>
    </div>
  );
}
