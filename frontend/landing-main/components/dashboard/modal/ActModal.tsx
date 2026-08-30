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
    <div className="space-y-6">
      {/* 1. RISK STATUS & RECOMMENDATION */}
      <div className="rounded-[6px] border border-white/15 bg-white/5 p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-white/15 pb-2">
          <span className="font-mono text-[10px] font-bold text-gray-400 uppercase">
            Human Decision Protocol
          </span>
          <span className="rounded bg-[#C94B4B]/20 text-[#C94B4B] border border-[#C94B4B]/40 px-2 py-0.2 text-[10px] font-mono font-bold">
            HIGH RISK (87/100)
          </span>
        </div>

        <div className="space-y-1">
          <h4 className="text-xs font-bold font-mono text-gray-400 uppercase tracking-wide">
            Recommended Next Statutory Step:
          </h4>
          <p className="text-xs text-white leading-relaxed font-semibold">
            "Initiate officer-level evidence review and issue 14-day statutory clarification notice to contractor under Rule 5.4."
          </p>
        </div>
      </div>

      {/* 2. CONFIRMATION PROMPT (If an action is clicked) */}
      {confirmingAction && (
        <div className="p-4 rounded-[6px] border border-white/30 bg-white/15 space-y-3 animate-in fade-in-50 duration-150">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-white/60" />
            <h4 className="text-xs font-bold text-white uppercase font-mono">
              Confirm Statutory Action: {confirmingAction}
            </h4>
          </div>
          <p className="text-xs text-gray-200">
            Are you sure you want to record this administrative action for Project P-1023? This will generate a formal entry into the government audit ledger.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleConfirmAction}
              className="rounded-[4px] bg-white px-3.5 py-1.5 text-xs font-bold text-[#002449] hover:bg-gray-100 transition-colors"
            >
              Confirm & Log Action
            </button>
            <button
              type="button"
              onClick={() => setConfirmingAction(null)}
              className="rounded-[4px] bg-[#002449] border border-white/15 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 3. AUTHORIZED HUMAN ACTIONS GRID */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 block">
          Authorized Administrative Actions
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {/* Action 1: Review Evidence */}
          <button
            type="button"
            onClick={() => handleActionClick('Review Evidence')}
            className="p-3 rounded-[4px] border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 text-left transition-all flex items-start gap-2.5"
          >
            <FileCheck className="h-4 w-4 text-white/60 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">Review Evidence Dossier</strong>
              <span className="text-[11px] text-gray-300">
                Inspect sanction, tender, and payment documents in detail.
              </span>
            </div>
          </button>

          {/* Action 2: Assign Investigation */}
          <button
            type="button"
            onClick={() => handleActionClick('Assign Investigation')}
            className="p-3 rounded-[4px] border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 text-left transition-all flex items-start gap-2.5"
          >
            <Briefcase className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">Assign Field Investigation</strong>
              <span className="text-[11px] text-gray-300">
                Depute Executive Engineer for 7-day physical site verification.
              </span>
            </div>
          </button>

          {/* Action 3: Request Clarification */}
          <button
            type="button"
            onClick={() => handleActionClick('Request Clarification')}
            className="p-3 rounded-[4px] border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 text-left transition-all flex items-start gap-2.5"
          >
            <Send className="h-4 w-4 text-[#2E8064] flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">Request IA Clarification</strong>
              <span className="text-[11px] text-gray-300">
                Issue compliance memo to line agency regarding rate markup.
              </span>
            </div>
          </button>

          {/* Action 4: Open Case */}
          <button
            type="button"
            onClick={() => handleActionClick('Open Formal Case')}
            className="p-3 rounded-[4px] border border-[#C94B4B]/40 bg-white/5 hover:bg-white/10 hover:border-[#C94B4B] text-left transition-all flex items-start gap-2.5"
          >
            <AlertTriangle className="h-4 w-4 text-[#C94B4B] flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">Open Formal Case Inquiry</strong>
              <span className="text-[11px] text-gray-300">
                Escalate to statutory inquiry docket with subpoena authority.
              </span>
            </div>
          </button>

          {/* Action 5: Dismiss Alert */}
          <button
            type="button"
            onClick={() => handleActionClick('Dismiss Alert (False Positive)')}
            className="p-3 rounded-[4px] border border-white/15 bg-white/5 hover:bg-white/10 text-left transition-all flex items-start gap-2.5 sm:col-span-2"
          >
            <XCircle className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-200 block">Dismiss as Justified False Positive</strong>
              <span className="text-[11px] text-gray-400">
                Record engineering memo justifying cost variance due to site topography.
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 4. GOVERNANCE MANDATE NOTICE */}
      <div className="rounded-[4px] border border-white/15 bg-[#002449] p-3 flex items-start gap-2.5 text-[11px] text-gray-300">
        <ShieldCheck className="h-4 w-4 text-[#2E8064] flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-white">Statutory Governance Principle:</strong> AI assists anomaly identification; only designated constitutional authorities (District Collector / Nodal Officer) record official verdicts and enforce administrative actions.
        </div>
      </div>

      {/* Footer Navigation Action */}
      <div className="flex items-center justify-between pt-2 border-t border-white/15">
        <span className="text-[11px] font-mono text-gray-400">
          Authority: Pune District Collectorate
        </span>
        <button
          type="button"
          onClick={onClose}
          className="rounded-[4px] bg-white/5 border border-white/15 px-3 py-1.5 text-xs font-bold text-gray-300 hover:text-white transition-colors"
        >
          Close Action Panel
        </button>
      </div>
    </div>
  );
}
