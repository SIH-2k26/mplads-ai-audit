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
    toast.info('Session locked. Click Done to resume.');
    onClose();
  };

  const handleDownloadDossier = () => {
    toast.success(`Dossier PDF for ${details.name} generated successfully.`);
  };

  const handleLogout = () => {
    onClose();
    toast.success('Logged Out Successfully', {
      description: 'Redirecting to Agastya Public Portal...',
    });
    navigate('/');
  };

  return (
    <AnimatePresence>
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
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
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
            className="relative w-full max-w-lg bg-white rounded-[24px] shadow-2xl overflow-hidden border border-[#E5E3DC] z-10 font-sans"
          >
            {/* Header / Sub-banner with Exact User-Uploaded Indian Emblem */}
            <div className="bg-[#002449] text-white px-6 py-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                {/* Official State Emblem Image Badge */}
                <div className="p-1 rounded-xl bg-white border border-blue-200 shrink-0 flex items-center justify-center">
                  <img src="/emblem.png" alt="State Emblem of India" className="h-7 w-auto object-contain" />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase block">
                    GOVERNMENT OF INDIA • GOV-SSO DOSSIER
                  </span>
                  <h2 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                    <span>Officer Credentials & Clearance</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-blue-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto no-scrollbar">
              
              {/* Official Credential Badge Card */}
              <div className="relative p-5 rounded-2xl bg-gradient-to-br from-[#FAF9F5] via-[#F5F3EB] to-[#F1F0EC] border border-[#E5E3DC] space-y-3 overflow-hidden shadow-2xs">
                {/* Background Emblem Watermark */}
                <img
                  src="/emblem.png"
                  alt=""
                  className="w-36 h-auto opacity-[0.08] pointer-events-none absolute right-2 top-1"
                />

                <div className="flex items-start justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-3.5">
                    {/* Avatar Initials Circle */}
                    <div className="w-14 h-14 rounded-2xl bg-[#002449] text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-md border-2 border-amber-400/60 relative">
                      <span>AS</span>
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#16A34A]"></span>
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-bold text-[#0E0E0E] leading-tight">{details.name}</h3>
                        <span className="text-[10px]" title="Government of India Verified">🇮🇳</span>
                      </div>
                      <p className="text-xs text-[#6B6B6B] font-medium mt-0.5">{details.designation}</p>
                      <p className="text-[10px] font-mono text-gray-500 mt-0.5">{details.cadre}</p>
                    </div>
                  </div>

                  {/* Top Right Official Indian Emblem Image */}
                  <div className="flex flex-col items-center shrink-0 hidden sm:flex">
                    <img src="/emblem.png" alt="State Emblem of India" className="h-12 w-auto object-contain" />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E5E3DC]/60 flex flex-wrap items-center justify-between gap-2 relative z-10 text-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {details.clearance}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-[#6B6B6B] bg-white px-2.5 py-0.5 rounded-md border border-[#E5E3DC]">
                    ID: {details.idNumber}
                  </span>
                </div>
              </div>

              {/* Telemetry & Security Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Node info */}
                <div className="p-3.5 rounded-2xl bg-[#F1F0EC] border border-[#E5E3DC] space-y-1">
                  <span className="text-[9px] font-bold text-[#6B6B6B] uppercase tracking-wider block">
                    GovCloud Telemetry Core
                  </span>
                  <span className="font-semibold text-[#0E0E0E] block truncate">{details.node}</span>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-medium pt-1">
                    <Activity className="w-3 h-3" />
                    <span>Latency: {details.latency} • Online</span>
                  </div>
                </div>

                {/* Session Token */}
                <div className="p-3.5 rounded-2xl bg-[#F1F0EC] border border-[#E5E3DC] space-y-1">
                  <span className="text-[9px] font-bold text-[#6B6B6B] uppercase tracking-wider block">
                    SSO Cryptographic Token
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#0E0E0E] text-[11px] truncate">
                      {details.token}
                    </span>
                    <button
                      onClick={handleCopyToken}
                      className="p-1 hover:bg-[#EAE8E2] rounded-md transition-colors cursor-pointer shrink-0 ml-1"
                      title="Copy Token"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#6B6B6B]" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-medium pt-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>CAG Vigilance Verified</span>
                  </div>
                </div>
              </div>

              {/* Recent Audit & Sanction Log Trail */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider flex items-center gap-1">
                    <FileCheck2 className="w-3.5 h-3.5" />
                    Recent Vigilance Audit Log Trail
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">Live Audit Feed</span>
                </div>

                <div className="space-y-1.5">
                  {details.logs.map((log, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-xl bg-white border border-[#E5E3DC] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0E0E0E] shrink-0" />
                        <span className="font-medium text-[#0E0E0E] truncate">{log.action}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#6B6B6B] shrink-0">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-4 border-t border-[#F1F0EC] bg-[#FAF9F5] flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-1.5 rounded-full border border-red-200 bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 hover:border-red-300 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
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
                <button
                  onClick={handleLockSession}
                  className="px-3.5 py-1.5 rounded-full border border-[#E5E3DC] bg-white text-[#0E0E0E] text-xs font-semibold hover:bg-[#F1F0EC] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-[#6B6B6B]" />
                  <span>Lock Session</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="px-6 py-1.5 rounded-full bg-[#002449] text-white text-xs font-bold hover:bg-[#001B36] transition-colors cursor-pointer"
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
