import React from 'react';
import { X, ShieldCheck, UserCheck, Key, FileSpreadsheet, Lock } from 'lucide-react';

interface WiseOfficerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WiseOfficerProfileModal: React.FC<WiseOfficerProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="modal-officer-profile"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-[24px] w-full max-w-md shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#F1F0EC] flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#0E0E0E]">Officer Profile & Clearance</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#6B6B6B] hover:text-[#0E0E0E] hover:bg-[#F1F0EC] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F1F0EC]">
            <div className="w-12 h-12 rounded-full bg-[#9FE870] text-[#0E0E0E] font-bold text-base flex items-center justify-center shrink-0">
              AS
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#0E0E0E]">Dr. Arvind Subramanian</h3>
              <p className="text-xs text-[#6B6B6B]">Chief Vigilance Officer • MoSPI Directorate</p>
              <span className="inline-block px-2 py-0.5 mt-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Level 4 Secret Clearance
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F1F0EC] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#6B6B6B]">GovCloud Node:</span>
              <span className="font-semibold text-[#0E0E0E]">Delhi Central #04</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B6B6B]">Session Token:</span>
              <span className="font-semibold text-[#0E0E0E]">#GOV-DL-88392</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B6B6B]">CAG Forensic Sync:</span>
              <span className="font-semibold text-emerald-700">Online & Verified</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#F1F0EC] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-[#0E0E0E] text-white text-xs font-semibold hover:bg-black cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
