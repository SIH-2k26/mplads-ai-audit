import React, { useState } from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Send,
  XCircle,
  HelpCircle,
  Briefcase,
  ArrowRight,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface ActModalProps {
  onClose: () => void;
}

export function ActModal({ onClose }: ActModalProps) {
  const [confirmingAction, setConfirmingAction] = useState<string | null>(null);

  const handleActionClick = (actionName: string) => {
    setConfirmingAction(actionName);
  };

  const handleConfirmAction = () => {
    if (!confirmingAction) return;

    toast.success(`Administrative Action Executed: ${confirmingAction}`, {
      description: `Logged in immutable statutory audit trail with timestamp and officer credentials.`,
    });
    setConfirmingAction(null);
    onClose();
  };

  return (
    <div className="space-y-4 font-sans">
      {/* 1. RISK STATUS & RECOMMENDATION */}
      <div className="rounded-[20px] border border-[#E5E3DC] bg-[#F1F0EC] p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#E5E3DC] pb-2">
          <span className="font-mono text-[10px] font-bold text-[#6B6B6B] uppercase">
            Human Decision Protocol
          </span>
          <span className="rounded-full bg-red-100 text-red-700 border border-red-200 px-2.5 py-0.5 text-[10px] font-mono font-bold">
            HIGH RISK (87/100)
          </span>
        </div>

        <div className="space-y-1">
          <h4 className="text-xs font-bold font-mono text-[#6B6B6B] uppercase tracking-wide">
            Recommended Next Statutory Step:
          </h4>
          <p className="text-xs text-[#0E0E0E] leading-relaxed font-semibold">
            "Initiate officer-level evidence review and issue 14-day statutory clarification notice to contractor under Rule 5.4."
          </p>
        </div>
      </div>

      {/* 2. CONFIRMATION PROMPT (If an action is clicked) */}
      {confirmingAction && (
        <div className="p-4 rounded-[16px] border border-amber-300 bg-amber-50 space-y-3 animate-in fade-in-50 duration-150">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-700" />
            <h4 className="text-xs font-bold text-amber-900 uppercase font-mono">
              Confirm Statutory Action: {confirmingAction}
            </h4>
          </div>
          <p className="text-xs text-amber-800">
            Are you sure you want to record this administrative action for Project P-1023? This will generate a formal entry into the government audit ledger.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleConfirmAction}
              className="rounded-full bg-[#0E0E0E] px-4 py-1.5 text-xs font-semibold text-white hover:bg-black transition-colors"
            >
              Confirm & Log Action
            </button>
            <button
              type="button"
              onClick={() => setConfirmingAction(null)}
              className="rounded-full bg-white border border-[#E5E3DC] px-3.5 py-1.5 text-xs font-semibold text-[#0E0E0E] hover:bg-[#F1F0EC] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 3. AUTHORIZED HUMAN ACTIONS GRID */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6B6B6B] block">
          Authorized Administrative Actions
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {/* Action 1: Review Evidence */}
          <button
            type="button"
            onClick={() => handleActionClick('Review Evidence')}
            className="p-3.5 rounded-[16px] border border-[#E5E3DC] bg-[#F1F0EC] hover:bg-white hover:border-[#0E0E0E]/30 text-left transition-all flex items-start gap-2.5 shadow-2xs"
          >
            <FileCheck className="h-4 w-4 text-[#0E0E0E] flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#0E0E0E] block">Review Evidence Dossier</strong>
              <span className="text-[11px] text-[#6B6B6B]">
                Inspect sanction, tender, and payment documents in detail.
              </span>
            </div>
          </button>

          {/* Action 2: Assign Investigation */}
          <button
            type="button"
            onClick={() => handleActionClick('Assign Investigation')}
            className="p-3.5 rounded-[16px] border border-[#E5E3DC] bg-[#F1F0EC] hover:bg-white hover:border-[#0E0E0E]/30 text-left transition-all flex items-start gap-2.5 shadow-2xs"
          >
            <Briefcase className="h-4 w-4 text-[#0E0E0E] flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#0E0E0E] block">Assign Field Investigation</strong>
              <span className="text-[11px] text-[#6B6B6B]">
                Depute Executive Engineer for 7-day physical site verification.
              </span>
            </div>
          </button>

          {/* Action 3: Request Clarification */}
          <button
            type="button"
            onClick={() => handleActionClick('Request Clarification')}
            className="p-3.5 rounded-[16px] border border-[#E5E3DC] bg-[#F1F0EC] hover:bg-white hover:border-[#0E0E0E]/30 text-left transition-all flex items-start gap-2.5 shadow-2xs"
          >
            <Send className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#0E0E0E] block">Request IA Clarification</strong>
              <span className="text-[11px] text-[#6B6B6B]">
                Issue compliance memo to line agency regarding rate markup.
              </span>
            </div>
          </button>

          {/* Action 4: Open Case */}
          <button
            type="button"
            onClick={() => handleActionClick('Open Formal Case')}
            className="p-3.5 rounded-[16px] border border-red-200 bg-red-50/70 hover:bg-red-50 hover:border-red-300 text-left transition-all flex items-start gap-2.5 shadow-2xs"
          >
            <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-red-950 block">Open Formal Case Inquiry</strong>
              <span className="text-[11px] text-red-800">
                Escalate to statutory inquiry docket with subpoena authority.
              </span>
            </div>
          </button>

          {/* Action 5: Dismiss Alert */}
          <button
            type="button"
            onClick={() => handleActionClick('Dismiss Alert (False Positive)')}
            className="p-3.5 rounded-[16px] border border-[#E5E3DC] bg-[#F1F0EC] hover:bg-white text-left transition-all flex items-start gap-2.5 sm:col-span-2 shadow-2xs"
          >
            <XCircle className="h-4 w-4 text-[#6B6B6B] flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#0E0E0E] block">Dismiss as Justified False Positive</strong>
              <span className="text-[11px] text-[#6B6B6B]">
                Record engineering memo justifying cost variance due to site topography.
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 4. GOVERNANCE MANDATE NOTICE */}
      <div className="rounded-[16px] border border-[#E5E3DC] bg-[#FAFAF9] p-3.5 flex items-start gap-2.5 text-xs text-[#0E0E0E]">
        <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#0E0E0E]">Statutory Governance Principle:</strong> AI assists anomaly identification; only designated constitutional authorities (District Collector / Nodal Officer) record official verdicts and enforce administrative actions.
        </div>
      </div>

      {/* Footer Navigation Action */}
      <div className="flex items-center justify-between pt-2 border-t border-[#EAE8E2]">
        <span className="text-[11px] font-mono text-[#6B6B6B]">
          Authority: Pune District Collectorate
        </span>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-white border border-[#E5E3DC] px-3.5 py-1.5 text-xs font-semibold text-[#0E0E0E] hover:bg-[#F1F0EC] transition-colors"
        >
          Close Action Panel
        </button>
      </div>
    </div>
  );
}
