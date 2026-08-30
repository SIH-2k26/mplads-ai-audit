import React, { useState } from 'react';
import {
  FileText,
  Clock,
  Building2,
  CreditCard,
  FolderKanban,
  History,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface InvestigateModalProps {
  onClose: () => void;
}

type InvestigateTab =
  | 'OVERVIEW'
  | 'EVIDENCE'
  | 'TIMELINE'
  | 'CONTRACTOR'
  | 'PAYMENTS'
  | 'DOCUMENTS'
  | 'AUDIT_TRAIL';

export function InvestigateModal({ onClose }: InvestigateModalProps) {
  const [activeTab, setActiveTab] = useState<InvestigateTab>('EVIDENCE');

  const evidenceItems = [
    {
      doc: 'Administrative & Financial Sanction Order',
      source: 'eSAKSHI Nodal Portal',
      date: '12 Jun 2026',
      type: 'Primary Sanction Order',
      relevance: 'Mandatory Baseline',
      confidence: '100% Verified',
      status: 'VERIFIED',
    },
    {
      doc: 'e-Tender Bid Comparative Statement (Single Bidder)',
      source: 'State e-Procurement / GeM',
      date: '18 Jun 2026',
      type: 'Procurement Record',
      relevance: 'Single Bidder Exception',
      confidence: '95.4% Verified',
      status: 'FLAGGED',
    },
    {
      doc: 'PFMS DBT Payment Vouchers (V-991 to V-994)',
      source: 'District Treasury / PFMS',
      date: '02 Jul 2026',
      type: 'Financial Disbursal',
      relevance: '92.5% Funds Released',
      confidence: '100% Ledger',
      status: 'VERIFIED',
    },
    {
      doc: 'Geotagged Foundation Stage Photos',
      source: 'Site Inspection App (EXIF)',
      date: '20 Jul 2026',
      type: 'Physical Verification',
      relevance: 'GPS: 18.5204° N, 73.8567° E',
      confidence: '98.1% EXIF Match',
      status: 'VERIFIED',
    },
    {
      doc: 'GFR-12C Utilisation Certificate (Stage 2)',
      source: 'Implementing Line Agency',
      date: 'Overdue (45 Days)',
      type: 'Statutory Compliance',
      relevance: 'Missing Mandatory UC',
      confidence: 'SLA Breach Flagged',
      status: 'MISSING',
    },
  ];

  return (
    <div className="space-y-4 font-sans">
      {/* Project Status Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-[20px] border border-[#E5E3DC] bg-[#F1F0EC]">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#6B6B6B]">
              MPLADS-MH-PUN-2026-1023
            </span>
            <span className="rounded-full bg-red-100 text-red-700 border border-red-200 px-2 py-0.2 text-[10px] font-mono font-bold">
              RISK: 87/100
            </span>
          </div>
          <h3 className="text-sm font-bold text-[#0E0E0E]">
            Ward 17 Community Hall Complex (Pune, Maharashtra)
          </h3>
        </div>

        <div className="text-left sm:text-right font-mono text-xs">
          <span className="text-[#6B6B6B] block text-[10px] uppercase font-bold">Case Status</span>
          <span className="text-[#0E0E0E] font-bold">Pending Investigation (Active)</span>
        </div>
      </div>

      {/* Investigation Workspace Tab Navigation */}
      <div className="flex items-center gap-1.5 bg-[#F1F0EC] p-1.5 rounded-full border border-[#E5E3DC] overflow-x-auto text-xs font-mono select-none">
        {[
          { id: 'OVERVIEW', label: 'OVERVIEW', icon: FolderKanban },
          { id: 'EVIDENCE', label: 'EVIDENCE (5)', icon: FileText },
          { id: 'TIMELINE', label: 'TIMELINE', icon: Clock },
          { id: 'CONTRACTOR', label: 'CONTRACTOR', icon: Building2 },
          { id: 'PAYMENTS', label: 'PAYMENTS', icon: CreditCard },
          { id: 'DOCUMENTS', label: 'DOCS', icon: FileText },
          { id: 'AUDIT_TRAIL', label: 'AUDIT TRAIL', icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as InvestigateTab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#0E0E0E] text-white font-bold shadow-xs'
                  : 'text-[#6B6B6B] hover:text-[#0E0E0E]'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: EVIDENCE */}
      {activeTab === 'EVIDENCE' && (
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6B6B6B] block">
            Corroborated Cross-System Evidence Records
          </span>

          <div className="divide-y divide-[#EAE8E2] rounded-[16px] border border-[#E5E3DC] bg-white overflow-hidden text-xs">
            {evidenceItems.map((ev, i) => (
              <div key={i} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-[#FAFAF9] transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#0E0E0E] text-xs">{ev.doc}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                        ev.status === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : ev.status === 'FLAGGED'
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {ev.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#6B6B6B]">
                    Source: <span className="text-[#0E0E0E]">{ev.source}</span> • Date: <span className="text-[#0E0E0E] font-mono">{ev.date}</span>
                  </div>
                  <div className="text-[10px] text-[#6B6B6B] font-mono">
                    Relevance: {ev.relevance}
                  </div>
                </div>

                <div className="text-left sm:text-right font-mono text-[10px] text-[#0E0E0E] flex-shrink-0">
                  <span className="text-emerald-700 font-bold block">{ev.confidence}</span>
                  <span className="text-[#6B6B6B] block">{ev.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-3 font-mono text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-[16px] bg-[#F1F0EC] border border-[#E5E3DC]">
              <span className="text-[#6B6B6B] block text-[9px] font-bold uppercase">Sanctioned</span>
              <strong className="text-[#0E0E0E] text-sm mt-0.5 block">₹68.00 L</strong>
            </div>
            <div className="p-3 rounded-[16px] bg-[#F1F0EC] border border-[#E5E3DC]">
              <span className="text-[#6B6B6B] block text-[9px] font-bold uppercase">Disbursed</span>
              <strong className="text-red-600 text-sm mt-0.5 block">₹62.90 L (92.5%)</strong>
            </div>
            <div className="p-3 rounded-[16px] bg-[#F1F0EC] border border-[#E5E3DC]">
              <span className="text-[#6B6B6B] block text-[9px] font-bold uppercase">Physical Progress</span>
              <strong className="text-[#0E0E0E] text-sm mt-0.5 block">31.0% (Verified)</strong>
            </div>
            <div className="p-3 rounded-[16px] bg-[#F1F0EC] border border-[#E5E3DC]">
              <span className="text-[#6B6B6B] block text-[9px] font-bold uppercase">Executing Agency</span>
              <strong className="text-[#0E0E0E] text-xs mt-0.5 block">PMC Building Dept</strong>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: TIMELINE */}
      {activeTab === 'TIMELINE' && (
        <div className="p-4 bg-[#F1F0EC] rounded-[16px] border border-[#E5E3DC] space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between">
            <span className="text-[#0E0E0E]">● 12 Jun 2026: Administrative Sanction Issued</span>
            <span className="text-emerald-700 font-semibold">Completed</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#0E0E0E]">● 18 Jun 2026: Single-Bid Work Order Awarded</span>
            <span className="text-red-600 font-semibold">Anomaly Flagged</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#0E0E0E]">● 02 Jul 2026: 2nd Installment DBT Disbursed</span>
            <span className="text-orange-700 font-semibold">Disbursed (Ahead of Work)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#0E0E0E]">● 15 Aug 2026: GFR-12C Stage 2 Due</span>
            <span className="text-red-600 font-semibold">Overdue 45 Days</span>
          </div>
        </div>
      )}

      {/* Tab 4: CONTRACTOR */}
      {activeTab === 'CONTRACTOR' && (
        <div className="p-4 bg-[#F1F0EC] rounded-[16px] border border-[#E5E3DC] space-y-2 text-xs">
          <div className="font-bold text-[#0E0E0E]">Awarded Vendor: M/s Apex Civil Constructions Ltd</div>
          <div className="text-[#6B6B6B] font-mono text-[11px]">
            GSTIN: 27AABCA1234F1Z5 • Active Contracts in Pune: 6 works (₹4.8 Cr) • District Concentration: 48% (High)
          </div>
        </div>
      )}

      {/* Tab 5: PAYMENTS */}
      {activeTab === 'PAYMENTS' && (
        <div className="p-4 bg-[#F1F0EC] rounded-[16px] border border-[#E5E3DC] space-y-2 text-xs font-mono">
          <div className="flex justify-between text-[#0E0E0E]">
            <span>Voucher #V-991 (Advance): ₹20.00 L</span>
            <span className="text-emerald-700 font-semibold">Cleared</span>
          </div>
          <div className="flex justify-between text-[#0E0E0E]">
            <span>Voucher #V-992 (Plinth): ₹22.90 L</span>
            <span className="text-emerald-700 font-semibold">Cleared</span>
          </div>
          <div className="flex justify-between text-[#0E0E0E]">
            <span>Voucher #V-994 (Slab RA): ₹20.00 L</span>
            <span className="text-red-600 font-semibold">Disbursed before verification</span>
          </div>
        </div>
      )}

      {/* Tab 6: DOCUMENTS */}
      {activeTab === 'DOCUMENTS' && (
        <div className="p-4 bg-[#F1F0EC] rounded-[16px] border border-[#E5E3DC] space-y-1.5 text-xs">
          <div className="text-[#0E0E0E] font-mono">TS-MH-PUN-2024-881.pdf (3.4 MB) • Hash SHA-256 Verified</div>
          <div className="text-[#0E0E0E] font-mono">Tender-NIT-Pune-881.pdf (1.2 MB) • Hash SHA-256 Verified</div>
        </div>
      )}

      {/* Tab 7: AUDIT TRAIL */}
      {activeTab === 'AUDIT_TRAIL' && (
        <div className="p-4 bg-[#F1F0EC] rounded-[16px] border border-[#E5E3DC] space-y-1.5 text-xs font-mono text-[#0E0E0E]">
          <div>[2026-08-20 14:15 IST] AI Engine flagged +38.2% cost variance vs PWD SoR</div>
          <div>[2026-08-22 09:30 IST] Case docket compiled for District Collector review</div>
        </div>
      )}

      {/* Footer Navigation Action */}
      <div className="flex items-center justify-between pt-2 border-t border-[#EAE8E2]">
        <span className="text-[11px] font-mono text-[#6B6B6B]">
          Inspection Docket: CASE-2026-0182
        </span>
        <Link
          to="/cases/CASE-2026-0182"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#0E0E0E] px-4 py-1.5 text-xs font-semibold text-white hover:bg-black transition-colors shadow-2xs"
        >
          <span>Open Full Investigation Docket</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
