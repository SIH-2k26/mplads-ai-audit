import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  ShieldCheck,
  Lock,
  Copy,
  CheckCircle2,
  Download,
  FileCheck2,
  Activity,
  LogOut,
} from 'lucide-react';
import { useUiStore } from '../stores/useUiStore';
import { useRoleStore } from '../stores/useRoleStore';
import { useLanguageStore } from '../stores/useLanguageStore';
import { SanchayLogo } from './common/SanchayLogo';
import { toast } from 'sonner';

export const WiseOfficerProfileModal: React.FC = () => {
  const { profileModalOpen, setProfileModalOpen } = useUiStore();
  const { currentRole, userTitle, userJurisdiction } = useRoleStore();

  const onClose = () => setProfileModalOpen(false);

  // Dynamic clearance & cadre details per role
  const getRoleDetails = () => {
    switch (currentRole) {
      case 'MP':
        return {
          name: 'Shri Ashok Salunkhe',
          designation: 'Member of Parliament (Lok Sabha)',
          cadre: 'Parliamentary Constituency #24',
          batch: '18th Lok Sabha',
          idNumber: 'MP-LS-2024-0492',
          clearance: 'Level 5 Statutory Clearance',
          token: 'GOV-LS-2024-9918-X7',
          node: 'Parliament Central Node #01',
          latency: '12ms',
          logs: [
            { action: 'Sanctioned ₹1.85 Cr for Ward 17 Community Hall', time: 'Today, 11:20 AM' },
            { action: 'Reviewed Constituency Progress Map', time: 'Yesterday, 04:45 PM' },
            { action: 'Approved Annual Audit Summary 2024-25', time: '24 Feb 2025' },
          ],
        };
      case 'DISTRICT_AUTHORITY':
        return {
          name: 'Shri Ashok Salunkhe, IAS',
          designation: 'District Magistrate & Collector',
          cadre: 'Maharashtra Cadre (Batch 2012)',
          batch: 'IAS Registration #MH-9921',
          idNumber: 'DM-PUNE-2023-4412',
          clearance: 'Level 4 District Executive Clearance',
          token: 'GOV-MH-PUNE-4412-K9',
          node: 'Pune District Secretariat #04',
          latency: '14ms',
          logs: [
            { action: 'Enforced Administrative Hold on P-1023 Tender', time: 'Today, 10:15 AM' },
            { action: 'Reconciled Cartosat-3 SAR Radar Measurements', time: 'Yesterday, 02:30 PM' },
            { action: 'Signed PWD Field Verification Directive', time: '23 Feb 2025' },
          ],
        };
      case 'STATE_NODAL':
        return {
          name: 'Dr. Ashok Salunkhe, IAS',
          designation: 'State Nodal Secretary (Planning Dept.)',
          cadre: 'Government of Maharashtra',
          batch: 'IAS Senior Selection Grade',
          idNumber: 'SEC-MH-2021-8831',
          clearance: 'Level 4 State Oversight Clearance',
          token: 'GOV-MH-STATE-8831-M3',
          node: 'Mantralaya Gateway Mumbai #02',
          latency: '18ms',
          logs: [
            { action: 'Published Maharashtra Q4 Outlay Summary', time: 'Today, 09:30 AM' },
            { action: 'Disbursed ₹124.5 Cr District Allocations', time: '22 Feb 2025' },
            { action: 'Cleared State Telemetry Sync with MoSPI', time: '20 Feb 2025' },
          ],
        };
      case 'MINISTRY_DIID':
        return {
          name: 'Dr. Arvind Subramanian',
          designation: 'Director General / MoSPI Authority',
          cadre: 'Central Secretariat Service (Apex)',
          batch: 'Senior Executive Service',
          idNumber: 'DG-MOSPI-2020-0088',
          clearance: 'Level 5 Top Secret Intelligence Clearance',
          token: 'GOV-DL-MOSPI-88392-Z1',
          node: 'New Delhi National Telemetry Core',
          latency: '8ms',
          logs: [
            { action: 'Triggered AI Neural Risk Simulator', time: 'Today, 01:10 PM' },
            { action: 'Reviewed National Red-Flagged Contractors', time: 'Yesterday, 06:15 PM' },
            { action: 'Exported Cabinet Oversight Brief', time: '23 Feb 2025' },
          ],
        };
      case 'AUDITOR':
      default:
        return {
          name: 'Shri Ashok Salunkhe, CAG',
          designation: 'Senior Vigilance & Forensic Audit Officer',
          cadre: 'Indian Audit & Accounts Service (IA&AS)',
          batch: 'IA&AS Batch 2010',
          idNumber: 'CAG-AUD-2022-0042',
          clearance: 'Level 5 Statutory Audit Clearance',
          token: 'GOV-CAG-AUDIT-0042-P5',
          node: 'CAG Audit Directorate Core',
          latency: '11ms',
          logs: [
            { action: 'Issued Section 14 Show-Cause Subpoena', time: 'Today, 08:45 AM' },
            { action: 'Audited Cover-Bidding Linkages (ALT-103)', time: 'Yesterday, 03:20 PM' },
            { action: 'Verified Geo-Tagged Evidence Checklist', time: '22 Feb 2025' },
          ],
        };
    }
  };

  const navigate = useNavigate();
  const details = getRoleDetails();

  const handleCopyToken = () => {
    navigator.clipboard.writeText(details.token);
    toast.success('Session token copied to clipboard');
  };

  const handleLockSession = () => {
    toast.info('Session locked.');
    onClose();
  };

  const handleDownloadDossier = () => {
    toast.success(`Dossier PDF for ${details.name} generated successfully.`);
  };

  const handleLogout = () => {
    useLanguageStore.getState().setLanguage('en');
    try {
      localStorage.removeItem('sanchay_preferred_language');
    } catch {
      // ignore
    }

    onClose();
    toast.success('Logged Out Successfully', {
      description: 'Redirecting to Sanchay Public Portal...',
    });
    navigate('/');
  };

  return (
    <AnimatePresence>
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ type: 'spring', duration: 0.3, bounce: 0.1 }}
            className="relative w-full max-w-lg bg-white rounded-[20px] shadow-2xl overflow-hidden border border-[#E5E3DC] z-10"
          >
            {/* Header */}
            <div className="bg-[#002449] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center p-1.5 border border-white/20">
                  <SanchayLogo className="w-full h-full" variant="light" />
                </div>
                <div>
                  <h2 className="text-sm font-bold tracking-tight text-white">
                    Officer Credentials & Clearance
                  </h2>
                  <span className="text-[10px] text-white/70 font-mono block">
                    GOVERNMENT OF INDIA • MoSPI SSO
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Profile Card */}
              <div className="p-5 rounded-[16px] bg-[#F1F0EC] border border-[#E5E3DC] space-y-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-[#002449] text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-sm border border-[#002449]">
                    <span>AS</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-[#0E0E0E] truncate">
                      {details.name}
                    </h3>
                    <p className="text-xs text-[#6B6B6B] mt-0.5">{details.designation}</p>
                    <p className="text-[11px] font-mono text-[#6B6B6B]">{details.cadre}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E5E3DC] flex items-center justify-between gap-2 flex-wrap text-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#15803D]/10 text-[#15803D] font-bold text-[10px] border border-[#15803D]/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{details.clearance}</span>
                  </span>
                  <span className="font-mono text-[10px] font-bold text-[#002449] bg-white px-2.5 py-1 rounded-full border border-[#E5E3DC]">
                    ID: {details.idNumber}
                  </span>
                </div>
              </div>

              {/* Telemetry & Security Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Node info */}
                <div className="p-3.5 rounded-[14px] bg-[#F1F0EC] border border-[#E5E3DC] space-y-1">
                  <span className="text-[9.5px] font-mono font-bold text-[#6B6B6B] uppercase tracking-wider block">
                    Telemetry Gateway
                  </span>
                  <span className="font-semibold text-[#0E0E0E] block truncate text-xs">
                    {details.node}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#15803D] font-medium pt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#15803D] animate-pulse" />
                    <span>Latency: {details.latency} • Online</span>
                  </div>
                </div>

                {/* Session Token */}
                <div className="p-3.5 rounded-[14px] bg-[#F1F0EC] border border-[#E5E3DC] space-y-1">
                  <span className="text-[9.5px] font-mono font-bold text-[#6B6B6B] uppercase tracking-wider block">
                    SSO Cryptographic Token
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-[#0E0E0E] text-[11px] truncate">
                      {details.token}
                    </span>
                    <button
                      onClick={handleCopyToken}
                      className="p-1 hover:bg-white rounded-md transition-colors cursor-pointer shrink-0 ml-1 border border-transparent hover:border-[#E5E3DC]"
                      title="Copy Token"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#6B6B6B]" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[#15803D] font-medium pt-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>CAG Verified</span>
                  </div>
                </div>
              </div>

              {/* Recent Audit & Sanction Log Trail */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-mono font-bold text-[#6B6B6B] uppercase tracking-wider block">
                  Recent Audit Actions
                </span>

                <div className="space-y-1.5">
                  {details.logs.map((log, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-[12px] bg-white border border-[#E5E3DC] flex items-center justify-between gap-3 text-xs shadow-2xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#002449] shrink-0" />
                        <span className="font-medium text-[#0E0E0E] truncate text-xs">{log.action}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#6B6B6B] shrink-0">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-3.5 border-t border-[#E5E3DC] bg-[#FAF9F5] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-1.5 rounded-full border border-red-200 bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-600" />
                  <span>Log Out</span>
                </button>
                <button
                  onClick={handleDownloadDossier}
                  className="px-3.5 py-1.5 rounded-full border border-[#E5E3DC] bg-white text-[#0E0E0E] text-xs font-semibold hover:bg-[#F1F0EC] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-[#6B6B6B]" />
                  <span>Export Dossier</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="px-6 py-1.5 rounded-full bg-[#002449] hover:bg-[#001B36] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
