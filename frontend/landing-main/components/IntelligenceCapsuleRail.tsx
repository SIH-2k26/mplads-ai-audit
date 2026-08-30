import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  Building,
  Users,
  FileSpreadsheet,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { CapsuleIntelligenceData, IntelligenceModal } from './IntelligenceModal';

export const CAPSULE_ITEMS: CapsuleIntelligenceData[] = [
  {
    id: 'CAP-PROJECT',
    category: 'PROJECT',
    tag: 'P-1023',
    title: 'Ward 17 Community Hall Complex',
    subtitle: 'Civil Construction & Skill Centre',
    location: 'Pune District • Ward 17, Maharashtra',
    metricLabel: 'Sanctioned Outlay',
    metricValue: '₹42.0 Lakhs',
    statusLabel: 'HIGH RISK • 87/100',
    statusVariant: 'critical',
    riskScore: 87,
    summary:
      'Execution of community multi-purpose civil hall exhibiting +38.2% cost mark-up over PWD Schedule of Rates and 61.5% disbursement-to-physical progress gap.',
    whyFlagged: [
      'Cost Deviation: +38.2% variance vs PWD Schedule of Rates 2024-25 baseline.',
      'Progress Gap: 92.5% funds disbursed vs 31.0% verified physical completion.',
      'Duplicate Overlap: 74% polygon alignment with PMGSY Batch III asphalt road.',
    ],
    evidenceSources: [
      {
        name: 'Technical Sanction TS-MH-PUN-2024-881',
        docType: 'Engineering Sanction',
        ref: 'Page 3 • 14 Feb 2025',
        verified: true,
      },
      {
        name: 'PWD Schedule of Rates 2024-25',
        docType: 'Statutory Rate Schedule',
        ref: 'Chapter 4, Item #441',
        verified: true,
      },
      {
        name: 'PFMS DBT Treasury Vouchers V-991 to V-994',
        docType: 'Financial Ledger',
        ref: 'TXN-881920',
        verified: true,
      },
    ],
    aiExplanation:
      'Grounded analysis indicates significant advance payment disbursement prior to verified on-site milestone progress. Single eligible bidder notice compressed to 8 days.',
    statutoryRule: 'MPLADS Revised Guidelines 2023 §5.4 & GFR Rule 12C',
    actionUrl: '/projects/P-1023',
    isPublicAccessible: true,
  },
  {
    id: 'CAP-DISTRICT',
    category: 'DISTRICT',
    tag: 'PUNE DISTRICT',
    title: 'Pune Operational Oversight Command',
    subtitle: 'Collectorate Infrastructure Monitoring',
    location: 'Maharashtra • 21 Legislative Blocks',
    metricLabel: 'Active Works Monitored',
    metricValue: '128 Active Works',
    statusLabel: '7 HIGH RISK DETECTED',
    statusVariant: 'saffron',
    riskScore: 68,
    summary:
      'Operational district monitoring 128 active civil packages with 82.2% fund utilisation velocity and 3 urgent SLA action queue notices.',
    whyFlagged: [
      '3 line agencies exceeding 60-day milestone delay tolerance thresholds.',
      '7 high-risk civil works flagged for pre-sanction rate re-verification.',
      '12.4% average cost deviation across rural water distribution packages.',
    ],
    evidenceSources: [
      {
        name: 'District Planning Office (DPO) Ledger Q2',
        docType: 'District Accounts',
        ref: 'DPO-PUN-2026-Q2',
        verified: true,
      },
      {
        name: 'eSAKSHI State Nodal Feed',
        docType: 'Central Portal Stream',
        ref: 'Batch #8812',
        verified: true,
      },
      {
        name: 'Zilla Parishad Workload Distribution Audit',
        docType: 'Agency Review',
        ref: 'ZP-ENG-082',
        verified: true,
      },
    ],
    aiExplanation:
      'District demonstrates strong overall fund absorption (82.2%) but exhibits localized contractor concentration in Haveli and Baramati talukas requiring field engineer dispatch.',
    statutoryRule: 'District Authority Operational Protocol §3.1',
    actionUrl: '/district',
    isPublicAccessible: true,
  },
  {
    id: 'CAP-CONTRACTOR',
    category: 'CONTRACTOR',
    tag: 'APEX INFRASTRUCTURE',
    title: 'M/s Apex Civil Constructions Ltd',
    subtitle: 'Vendor Concentration & Syndicate Pattern',
    location: 'Pune & Ahmednagar Districts',
    metricLabel: 'Total Active Contracts',
    metricValue: '18 Works (₹14.2 Cr)',
    statusLabel: '42% CONCENTRATION RISK',
    statusVariant: 'saffron',
    riskScore: 74,
    summary:
      'Contractor entity holding 42% of all active community infrastructure tenders in Haveli taluka with single-bid award patterns.',
    whyFlagged: [
      '42% single-vendor concentration across 18 concurrent MPLADS packages.',
      '6 consecutive tender wins awarded under single eligible bidder qualification.',
      'Average project delay of 45 days beyond contract completion targets.',
    ],
    evidenceSources: [
      {
        name: 'State e-Procurement Portal Bid Evaluation Log',
        docType: 'Procurement Ledger',
        ref: 'Tender-MH-2025-081',
        verified: true,
      },
      {
        name: 'Ministry of Corporate Affairs (MCA21) Registry',
        docType: 'Entity Record',
        ref: 'CIN: U45200MH2018PTC192831',
        verified: true,
      },
      {
        name: 'Bank Guarantee & Performance Security Deposit',
        docType: 'Financial Surety',
        ref: 'BG-SBI-PUN-9921',
        verified: true,
      },
    ],
    aiExplanation:
      'Network graph analysis reveals repeated sub-contracting ties with 2 partner entities, triggering an automated cartelization risk signal.',
    statutoryRule: 'Central Vigilance Commission (CVC) Tender Guidelines 2022',
    actionUrl: '/contractors',
    isPublicAccessible: false,
  },
  {
    id: 'CAP-AUDIT',
    category: 'AUDIT CASE',
    tag: 'CAG-2024-117',
    title: 'Statutory Bitumen Grade Unit Price Para',
    subtitle: 'Comptroller & Auditor General Audit Para',
    location: 'Western Maharashtra Zone',
    metricLabel: 'Audit Outlay Exposure',
    metricValue: '₹1.80 Crore',
    statusLabel: 'CAG AUDIT PARA ACTIVE',
    statusVariant: 'critical',
    riskScore: 91,
    summary:
      'Historical CAG compliance finding regarding +24.5% unit rate inflation on VG-30 grade bitumen across 3 linked rural road packages.',
    whyFlagged: [
      'Unjustified variance between State PWD SoR benchmark and actual work orders.',
      'Absence of mandatory stage-wise core sample compaction test certificates.',
      'Premature release of contractor retention money prior to defect liability period.',
    ],
    evidenceSources: [
      {
        name: 'Report of the CAG of India on Local Bodies',
        docType: 'Statutory Audit Report',
        ref: 'Report No. 4 of 2024 (Page 42)',
        verified: true,
      },
      {
        name: 'Public Accounts Committee (PAC) Action Taken Note',
        docType: 'Legislative Review',
        ref: 'PAC-MH-2024-ATN-12',
        verified: true,
      },
      {
        name: 'Executive Engineer Compliance Rectification Memo',
        docType: 'Departmental Memo',
        ref: 'PWD-EE-2025-119',
        verified: true,
      },
    ],
    aiExplanation:
      'Historical precedent used to train SANCHAY vector similarity engine to automatically flag identical rate inflation patterns in ongoing road estimates.',
    statutoryRule: 'CAG Performance Audit Manual §8.2 & PWD Manual Chapter 4',
    actionUrl: '/reports',
    isPublicAccessible: true,
  },
  {
    id: 'CAP-POLICY',
    category: 'POLICY',
    tag: 'MPLADS GUIDELINES 2023',
    title: 'Codified Statutory Scheme Guidelines',
    subtitle: 'MoSPI Regulatory Knowledge Base',
    location: 'All-India National Regulatory Base',
    metricLabel: 'Active Codified Rules',
    metricValue: '48 Machine Rules',
    statusLabel: 'STATUTORY BASELINE',
    statusVariant: 'success',
    riskScore: 12,
    summary:
      'Complete machine-readable rule registry codifying MPLADS eligibility, SC/ST 15% quota mandates, procurement thresholds, and GFR-12C compliance.',
    whyFlagged: [
      'Rule 5.4: Mandatory Technical Sanction (TS) prior to administrative allocation.',
      'Rule 3.2: 15% mandatory SC/ST designated population asset allocation.',
      'Rule 7.1: GFR-12C Utilisation Certificate mandatory within 45 days of milestone.',
    ],
    evidenceSources: [
      {
        name: 'MoSPI MPLADS Revised Guidelines 2023',
        docType: 'Central Circular',
        ref: 'F.No. 11011/02/2023-MPLADS',
        verified: true,
      },
      {
        name: 'General Financial Rules (GFR) 2017 Rule 12C',
        docType: 'Ministry of Finance',
        ref: 'GFR-2017 §Rule 12C',
        verified: true,
      },
      {
        name: 'Central Vigilance Commission Procurement Circular',
        docType: 'CVC Directive',
        ref: '02/05/2022-Vig',
        verified: true,
      },
    ],
    aiExplanation:
      'All SANCHAY AI risk scores are mathematically bounded by and cited against these authoritative legal provisions, ensuring zero black-box hallucination.',
    statutoryRule: 'Ministry of Statistics & Programme Implementation (MoSPI)',
    actionUrl: '/policies',
    isPublicAccessible: true,
  },
];

export function IntelligenceCapsuleRail() {
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);
  const [selectedCapsule, setSelectedCapsule] = useState<CapsuleIntelligenceData | null>(null);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'PROJECT':
        return FolderKanban;
      case 'DISTRICT':
        return Building;
      case 'CONTRACTOR':
        return Users;
      case 'AUDIT CASE':
        return FileSpreadsheet;
      case 'POLICY':
      default:
        return BookOpen;
    }
  };

  return (
    <div className="space-y-4">
      {/* Interactive Capsule Rail Container */}
      <div className="flex flex-col lg:flex-row items-stretch gap-3 min-h-[360px] select-none">
        {CAPSULE_ITEMS.map((item, idx) => {
          const isHovered = hoveredIndex === idx;
          const Icon = getCategoryIcon(item.category);

          return (
            <motion.div
              key={item.id}
              tabIndex={0}
              role="button"
              aria-label={`Inspect ${item.category} ${item.tag}`}
              onMouseEnter={() => setHoveredIndex(idx)}
              onClick={() => setSelectedCapsule(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedCapsule(item);
                }
              }}
              animate={{
                flex: isHovered ? 2.5 : 1,
              }}
              transition={{
                type: 'spring',
                stiffness: 280,
                damping: 30,
              }}
              className={`relative overflow-hidden cursor-pointer p-5 flex flex-col justify-between transition-all duration-300 rounded-[12px] border ${
                isHovered
                  ? 'bg-white/5 border-white/30 shadow-2xl ring-2 ring-white/30/30'
                  : 'bg-white/5/80 border-white/15 hover:border-white/30/60'
              }`}
            >
              {/* TOP: Category Badge & Status Pill */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-2 rounded border transition-colors ${
                      isHovered
                        ? 'bg-white text-[#002449] border-white'
                        : 'bg-[#002449] text-white/60 border-white/15'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  {isHovered && (
                    <span className="font-mono text-[10px] font-bold text-white/60 uppercase tracking-wider bg-[#002449] px-2 py-0.5 rounded border border-white/15">
                      {item.category}
                    </span>
                  )}
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold whitespace-nowrap ${
                    item.statusVariant === 'critical'
                      ? 'bg-red-950/80 text-[#C94B4B] border border-[#C94B4B]/40'
                      : item.statusVariant === 'saffron'
                      ? 'bg-amber-950/80 text-white/60 border border-white/30/40'
                      : 'bg-emerald-950/80 text-[#2E8064] border border-[#2E8064]/40'
                  }`}
                >
                  {isHovered ? item.statusLabel : item.tag}
                </span>
              </div>

              {/* CENTER: Title & Informational Expansion */}
              <div className="my-auto space-y-2 py-2">
                <div>
                  <span className="text-[10px] font-mono text-gray-400 block font-bold">
                    {item.tag}
                  </span>
                  <h3 className="text-sm font-bold text-white leading-tight font-sans mt-0.5">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-gray-300 font-sans mt-0.5">{item.location}</p>
                </div>

                {/* Expanded Details when active/hovered */}
                {isHovered ? (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2 text-xs pt-1"
                  >
                    <div className="p-2.5 rounded bg-[#002449] border border-white/15 font-mono flex items-center justify-between text-[11px]">
                      <span className="text-gray-400">{item.metricLabel}:</span>
                      <strong className="text-white font-bold">{item.metricValue}</strong>
                    </div>
                    <p className="text-[11px] text-gray-300 leading-snug line-clamp-2">
                      {item.summary}
                    </p>
                  </motion.div>
                ) : (
                  <div className="text-[10px] font-mono text-gray-400 pt-1">
                    Hover to preview evidence
                  </div>
                )}
              </div>

              {/* BOTTOM: Action Trigger */}
              <div className="pt-3 border-t border-white/15 flex items-center justify-between text-[11px] font-mono font-bold">
                <span className="text-white/60">{isHovered ? 'Click to Inspect Dossier' : item.category}</span>
                <span className="flex items-center gap-1 text-[10px] text-white font-sans uppercase">
                  <span>View</span>
                  <ArrowRight className="h-3.5 w-3.5 text-white/60" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Reusable Centered Intelligence Modal */}
      <IntelligenceModal
        isOpen={selectedCapsule !== null}
        onClose={() => setSelectedCapsule(null)}
        data={selectedCapsule}
      />
    </div>
  );
}
