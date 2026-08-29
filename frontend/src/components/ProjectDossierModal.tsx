import React, { useState } from 'react';
import { MPLADSProject } from '../types';
import {
  X,
  ShieldAlert,
  Satellite,
  Building2,
  Lock,
  Unlock,
  FileText,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Landmark
} from 'lucide-react';

interface ProjectDossierModalProps {
  project: MPLADSProject | null;
  onClose: () => void;
  onToggleFreeze: (projectId: string) => void;
}

export const ProjectDossierModal: React.FC<ProjectDossierModalProps> = ({
  project,
  onClose,
  onToggleFreeze,
}) => {
  const [activeTab, setActiveTab] = useState<'evidence' | 'satellite' | 'vendor-nexus' | 'audit-log'>('evidence');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  if (!project) return null;

  const isFrozen = project.status === 'Disbursal Frozen';

  const handleAction = (actionName: string) => {
    setActionSuccessMsg(`Directive Dispatched: ${actionName}`);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  return (
    <div
      id="modal-project-dossier"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-[24px] w-full max-w-3xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-[#F1F0EC] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F1F0EC] flex items-center justify-center text-lg">
              🏢
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#0E0E0E]">
                  {project.code}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 uppercase">
                  {project.riskTier} Risk
                </span>
              </div>
              <h2 className="text-base font-semibold text-[#0E0E0E] leading-snug">
                {project.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#6B6B6B] hover:text-[#0E0E0E] hover:bg-[#F1F0EC] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation (Wise rounded pill style) */}
        <div className="px-6 pt-3 pb-2 bg-white flex items-center gap-2 overflow-x-auto border-b border-[#F1F0EC]">
          {[
            { id: 'evidence', label: 'AI Anomaly Analysis' },
            { id: 'satellite', label: 'ISRO Satellite Radar' },
            { id: 'vendor-nexus', label: 'Contractor Shell Nexus' },
            { id: 'audit-log', label: 'CAG Docket' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#0E0E0E] text-white font-semibold'
                    : 'bg-[#F1F0EC] text-[#0E0E0E] hover:bg-[#EAE8E2]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Notification Banner */}
        {actionSuccessMsg && (
          <div className="px-6 py-2.5 bg-[#9FE870] text-[#0E0E0E] text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#0E0E0E]" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Figures Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-[16px] bg-[#F1F0EC]">
              <span className="text-xs text-[#6B6B6B] block">Sanctioned</span>
              <span className="text-base sm:text-lg font-semibold text-[#0E0E0E] block mt-0.5">
                ₹{project.sanctionedAmountCr.toFixed(2)} Cr
              </span>
            </div>

            <div className="p-4 rounded-[16px] bg-[#F1F0EC]">
              <span className="text-xs text-[#6B6B6B] block">Disbursed</span>
              <span className="text-base sm:text-lg font-semibold text-[#0E0E0E] block mt-0.5">
                ₹{project.disbursedAmountCr.toFixed(2)} Cr
              </span>
            </div>

            <div className="p-4 rounded-[16px] bg-[#F1F0EC]">
              <span className="text-xs text-[#6B6B6B] block">Ground Progress</span>
              <span className="text-base sm:text-lg font-semibold text-red-600 block mt-0.5">
                {project.physicalProgressPercent}%
              </span>
            </div>

            <div className="p-4 rounded-[16px] bg-[#F1F0EC]">
              <span className="text-xs text-[#6B6B6B] block">Discrepancy Gap</span>
              <span className="text-base sm:text-lg font-semibold text-red-600 block mt-0.5">
                +{project.discrepancyPercent.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* TAB 1: Evidence */}
          {activeTab === 'evidence' && (
            <div className="space-y-4">
              <div className="p-5 rounded-[16px] bg-[#F1F0EC] space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-red-700">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Primary Anomaly: {project.anomalyCategory}</span>
                </div>
                <p className="text-sm font-semibold text-[#0E0E0E]">{project.primaryAnomaly}</p>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">
                  {project.detailedAnalysis}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-[16px] bg-[#F1F0EC] space-y-2">
                  <span className="text-xs font-semibold text-[#0E0E0E] block">
                    Constituency & Agency
                  </span>
                  <div className="text-xs space-y-1.5 text-[#6B6B6B]">
                    <div className="flex justify-between">
                      <span>Constituency:</span>
                      <span className="font-medium text-[#0E0E0E]">{project.constituency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>State:</span>
                      <span className="font-medium text-[#0E0E0E]">{project.state}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Agency:</span>
                      <span className="font-medium text-[#0E0E0E]">{project.implementingAgency}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-[16px] bg-[#F1F0EC] space-y-2">
                  <span className="text-xs font-semibold text-[#0E0E0E] block">
                    Contractor & GSTIN
                  </span>
                  <div className="text-xs space-y-1.5 text-[#6B6B6B]">
                    <div className="flex justify-between">
                      <span>Contractor:</span>
                      <span className="font-medium text-[#0E0E0E]">{project.contractorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GSTIN:</span>
                      <span className="font-medium text-[#0E0E0E]">{project.contractorGstin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Trust Score:</span>
                      <span className="font-semibold text-red-600">{project.trustScore}/100</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Satellite */}
          {activeTab === 'satellite' && (
            <div className="space-y-4">
              <div className="p-5 rounded-[16px] bg-[#F1F0EC] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0E0E0E]">
                    ISRO Cartosat-3 / Sentinel-1 SAR Multi-Temporal Optical Diff
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EAE8E2] text-[#0E0E0E]">
                    0.28m Ground Resolution
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-4 rounded-[12px] bg-white text-center space-y-2">
                    <div className="h-32 rounded-lg bg-[#F1F0EC] flex items-center justify-center text-xs font-medium text-[#6B6B6B]">
                      T0 Baseline (Sanction Date)
                    </div>
                    <span className="text-xs text-[#6B6B6B] block">Zero ground alteration</span>
                  </div>

                  <div className="p-4 rounded-[12px] bg-white text-center space-y-2 border border-red-200">
                    <div className="h-32 rounded-lg bg-red-50 text-red-700 flex items-center justify-center text-xs font-semibold">
                      T+240d Pass (Foundation Only 18%)
                    </div>
                    <span className="text-xs text-red-600 font-medium block">
                      Claimed 88% — Superstructure Missing
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Shell Nexus */}
          {activeTab === 'vendor-nexus' && (
            <div className="p-5 rounded-[16px] bg-[#F1F0EC] space-y-3">
              <span className="text-xs font-semibold text-[#0E0E0E] block">
                Contractor Nexus & Common Director PAN
              </span>
              <p className="text-xs text-[#6B6B6B] leading-relaxed">
                Sentinel network matching discovered 3 bidding entities sharing the same director PAN and chartered accountant registration.
              </p>
              <div className="space-y-2 pt-2">
                <div className="p-3 bg-white rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[#0E0E0E] block">Pragati Infratech Pvt Ltd (L1)</span>
                    <span className="text-[#6B6B6B] text-[11px]">Director PAN: ABCDP8841M</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-semibold">
                    Primary Node
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[#0E0E0E] block">Apex Civil Projects LLP (L2)</span>
                    <span className="text-[#6B6B6B] text-[11px]">Shares PAN: ABCDP8841M</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-semibold">
                    Collusive Match
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CAG Docket */}
          {activeTab === 'audit-log' && (
            <div className="p-5 rounded-[16px] bg-[#F1F0EC] space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-[#EAE8E2]">
                <span className="text-[#6B6B6B]">CAG Special Audit Reference:</span>
                <span className="font-semibold text-[#0E0E0E]">{project.cagReference}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#EAE8E2]">
                <span className="text-[#6B6B6B]">Status:</span>
                <span className="font-semibold text-[#0E0E0E]">{project.status}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#6B6B6B]">Last Reconciled:</span>
                <span className="text-[#0E0E0E]">2025-02-25 (Delhi GovCloud)</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Bar (Wise Pill Buttons) */}
        <div className="px-6 py-4 border-t border-[#F1F0EC] bg-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAction('Dispatch Field Audit Team')}
              className="px-4 py-2 rounded-full bg-[#F1F0EC] hover:bg-[#EAE8E2] text-[#0E0E0E] text-xs font-semibold transition-colors cursor-pointer"
            >
              Dispatch Field Audit
            </button>
            <button
              onClick={() => handleAction('Issue Show-Cause Notice')}
              className="px-4 py-2 rounded-full bg-[#F1F0EC] hover:bg-[#EAE8E2] text-[#0E0E0E] text-xs font-semibold transition-colors cursor-pointer"
            >
              Issue Show-Cause
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFreeze(project.id)}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isFrozen
                  ? 'bg-[#9FE870] hover:bg-[#8ee05c] text-[#0E0E0E]'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {isFrozen ? 'Lift Freeze' : 'Freeze Public Disbursal'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-[#F1F0EC] hover:bg-[#EAE8E2] text-[#0E0E0E] text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
