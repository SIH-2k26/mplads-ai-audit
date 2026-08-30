import React, { useState } from 'react';
import {
  X,
  Lock,
  Satellite,
  FileSignature,
  FileDown,
  CheckCircle2,
  AlertTriangle,
  Send,
  ShieldAlert
} from 'lucide-react';

interface QuickActionModalProps {
  actionType: string | null;
  onClose: () => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({ actionType, onClose }) => {
  const [selectedTarget, setSelectedTarget] = useState('ALL_CRITICAL');
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executed, setExecuted] = useState(false);

  if (!actionType) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setExecuted(true);
    }, 800);
  };

  const getActionDetails = () => {
    switch (actionType) {
      case 'freeze':
        return {
          title: 'Immediate Disbursal Freeze (PFMS Lock)',
          desc: 'Instruct Public Financial Management System (PFMS) & State Nodal Treasuries to withhold next fund tranche releases for flagged works with >50% discrepancy.',
          badge: 'Statutory Authority Sec 12(B)',
        };
      case 'satellite':
        return {
          title: 'Task ISRO Cartosat-3 SAR Optical Scan',
          desc: 'Deploy automated orbital radar pass over high-divergence GPS coordinates to verify physical earthworks and structural milestones.',
          badge: 'Space-Based Audit Protocol',
        };
      case 'subpoena':
        return {
          title: 'Issue Statutory CAG Show-Cause Notice',
          desc: 'Formally serve electronic Show-Cause dockets under CAG Vigilance Regulations to District Collectors and Executing Engineers.',
          badge: 'CAG Legal Enforcement',
        };
      case 'export':
        return {
          title: 'Export Executive Vigilance Dossier',
          desc: 'Download encrypted PDF brief and CSV data export containing 14,820 monitored works, 38 critical alerts, and contractor nexus logs.',
          badge: 'Executive Brief',
        };
      default:
        return {
          title: 'Execute Sentinel Directive',
          desc: 'Execute administrative sentinel directive across monitored constituencies.',
          badge: 'Vigilance Directive',
        };
    }
  };

  const details = getActionDetails();

  return (
    <div
      id="modal-quick-action"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-[24px] w-full max-w-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#F1F0EC] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[#6B6B6B] block uppercase tracking-wider">
              {details.badge}
            </span>
            <h2 className="text-base font-semibold text-[#0E0E0E]">{details.title}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#6B6B6B] hover:text-[#0E0E0E] hover:bg-[#F1F0EC] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {executed ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#15803D] text-white flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-[#0E0E0E]">
                Directive Dispatched Successfully
              </h3>
              <p className="text-xs text-[#6B6B6B] max-w-sm mx-auto leading-relaxed">
                Directive <strong className="text-[#0E0E0E]">#DIR-2025-CAG-8921</strong> registered and transmitted to state nodal treasuries.
              </p>
              <div className="pt-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-[#0E0E0E] text-white text-xs font-semibold hover:bg-black transition-colors cursor-pointer"
                >
                  Return to Home
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">{details.desc}</p>

              {/* Target Selector */}
              <div className="space-y-1.5 text-xs">
                <label className="text-[#6B6B6B] font-medium block">
                  Target Scope Jurisdiction
                </label>
                <select
                  value={selectedTarget}
                  onChange={(e) => setSelectedTarget(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#F1F0EC] border-none text-[#0E0E0E] font-medium text-xs focus:ring-2 focus:ring-[#0E0E0E] outline-none cursor-pointer"
                >
                  <option value="ALL_CRITICAL">All 38 Critical Risk Flagged Works (Recommended)</option>
                  <option value="UP_CLUSTER">Uttar Pradesh Eastern Cluster (Varanasi/Gorakhpur)</option>
                  <option value="MH_CLUSTER">Maharashtra Marathwada Division (Beed)</option>
                  <option value="KA_CLUSTER">Karnataka PWD STEM Procurement (Bellary)</option>
                </select>
              </div>

              {/* Confirmation Checkbox */}
              <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F1F0EC] cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-0.5 rounded accent-[#15803D] cursor-pointer w-4 h-4"
                />
                <span className="text-xs text-[#0E0E0E] leading-snug">
                  I certify that this administrative action is authorized under the official oversight mandate of the Chief Vigilance Officer.
                </span>
              </label>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F1F0EC]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-full bg-[#F1F0EC] hover:bg-[#EAE8E2] text-[#0E0E0E] text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!confirmed || isSubmitting}
                  className="px-6 py-2 rounded-full bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting ? 'Dispatching...' : 'Confirm & Dispatch'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
