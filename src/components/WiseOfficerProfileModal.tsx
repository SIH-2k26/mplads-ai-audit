import React from 'react';
import { X, ShieldCheck, Lock, Copy, CheckCircle2, UserCheck, Key } from 'lucide-react';
import { useUiStore } from '../stores/useUiStore';
import { useRoleStore } from '../stores/useRoleStore';
import { toast } from 'sonner';

export const WiseOfficerProfileModal: React.FC = () => {
  const { profileModalOpen, setProfileModalOpen } = useUiStore();
  const { currentRole, userTitle, userJurisdiction } = useRoleStore();

  if (!profileModalOpen) return null;

  const onClose = () => setProfileModalOpen(false);

  // Dynamic clearance details based on current role
  const getRoleDetails = () => {
    switch (currentRole) {
      case 'MP':
        return {
          name: 'Shri Ashok Salunkhe, MP',
          clearance: 'Level 5 Parliamentary Clearance',
          token: '#GOV-LS-2024-9918',
          node: 'Parliament House Central, New Delhi',
        };
      case 'DISTRICT_AUTHORITY':
        return {
          name: 'Shri Ashok Salunkhe, IAS',
          clearance: 'Level 4 Statutory Clearance',
          token: '#GOV-MH-PUNE-4412',
          node: 'District Secretariat, Pune (MH)',
        };
      case 'STATE_NODAL':
        return {
          name: 'Dr. Ashok Salunkhe, IAS',
          clearance: 'Level 4 State Executive Clearance',
          token: '#GOV-MH-[#STATE-8831]',
          node: 'Mantralaya, Mumbai (MH)',
        };
      case 'MINISTRY_DIID':
        return {
          name: 'Dr. Arvind Subramanian',
          clearance: 'Level 5 Top Secret Clearance',
          token: '#GOV-DL-MOSPI-88392',
          node: 'MoSPI Command Centre, New Delhi',
        };
      case 'AUDITOR':
      default:
        return {
          name: 'Shri Ashok Salunkhe, CAG',
          clearance: 'Level 5 Forensic Audit Clearance',
          token: '#GOV-CAG-AUDIT-0042',
          node: 'CAG Directorate General, New Delhi',
        };
    }
  };

  const details = getRoleDetails();

  const handleCopyToken = () => {
    navigator.clipboard.writeText(details.token);
    toast.success('Session token copied to clipboard');
  };

  const handleLockSession = () => {
    toast.info('Session locked for security. Click Done to return.');
    onClose();
  };

  return (
    <div
      id="modal-officer-profile"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150 select-none"
    >
      <div className="bg-white rounded-[24px] w-full max-w-md shadow-2xl overflow-hidden border border-[#E5E3DC]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#F1F0EC] flex items-center justify-between bg-[#FAF9F5]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <h2 className="text-sm font-bold text-[#0E0E0E]">Officer Profile & SSO Clearance</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#6B6B6B] hover:text-[#0E0E0E] hover:bg-[#EAE8E2] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Officer identity card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F1F0EC] border border-[#E5E3DC]">
            <div className="w-12 h-12 rounded-full bg-[#9FE870] text-[#0E0E0E] font-bold text-base flex items-center justify-center shrink-0 shadow-2xs">
              AS
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-[#0E0E0E] truncate">{details.name}</h3>
              <p className="text-xs text-[#6B6B6B] truncate">{userTitle}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {details.clearance}
                </span>
              </div>
            </div>
          </div>

          {/* Session & Infrastructure info */}
          <div className="p-4 rounded-2xl bg-[#F1F0EC] space-y-2.5 text-xs border border-[#E5E3DC]">
            <div className="flex justify-between items-center">
              <span className="text-[#6B6B6B]">Jurisdiction:</span>
              <span className="font-semibold text-[#0E0E0E] font-mono text-[11px]">{userJurisdiction}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6B6B6B]">GovCloud Node:</span>
              <span className="font-semibold text-[#0E0E0E]">{details.node}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6B6B6B]">Session Token:</span>
              <div className="flex items-center gap-1">
                <span className="font-mono text-[#0E0E0E] font-semibold">{details.token}</span>
                <button
                  onClick={handleCopyToken}
                  className="p-1 hover:bg-[#E0DDD5] rounded cursor-pointer transition-colors"
                  title="Copy Token"
                >
                  <Copy className="w-3 h-3 text-[#6B6B6B]" />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-[#E5E3DC]">
              <span className="text-[#6B6B6B]">CAG Forensic Sync:</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified & Online</span>
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#F1F0EC] bg-[#FAF9F5] flex items-center justify-between">
          <button
            onClick={handleLockSession}
            className="px-3.5 py-1.5 rounded-full border border-[#E5E3DC] bg-white text-[#0E0E0E] text-xs font-semibold hover:bg-[#F1F0EC] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-[#6B6B6B]" />
            <span>Lock Session</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-full bg-[#0E0E0E] text-white text-xs font-semibold hover:bg-black transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
