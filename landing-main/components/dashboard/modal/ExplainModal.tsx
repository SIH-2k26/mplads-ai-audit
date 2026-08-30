import React from 'react';
import { Eye, FileText, ArrowRight, TrendingUp, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ExplainModalProps {
  onClose: () => void;
}

export function ExplainModal({ onClose }: ExplainModalProps) {
  const topContributors = [
    {
      num: '1',
      title: 'Cost Deviation',
      detail: '+38.2% above comparable PWD SoR baseline',
      pts: '+28 pts',
      color: 'text-red-700 bg-red-100 border-red-200',
    },
    {
      num: '2',
      title: 'Progress / Disbursement Mismatch',
      detail: '92.5% funds disbursed vs 31.0% physical completion on site',
      pts: '+22 pts',
      color: 'text-red-700 bg-red-100 border-red-200',
    },
    {
      num: '3',
      title: 'Duplicate Similarity Overlap',
      detail: '74% coordinate & polygon similarity with PMGSY road asset',
      pts: '+15 pts',
      color: 'text-[#0E0E0E] bg-white border-[#E5E3DC]',
    },
    {
      num: '4',
      title: 'Procurement Anomaly',
      detail: 'Single-bid qualified tender with 8-day compressed notice',
      pts: '+12 pts',
      color: 'text-[#0E0E0E] bg-white border-[#E5E3DC]',
    },
  ];

  const evidenceSources = [
    {
      name: 'PWD Schedule of Rates 2024-25 (Civil Chapter 4)',
      type: 'Statutory Rate Schedule',
      ref: 'Chapter 4, Item #441 (Page 18)',
    },
    {
      name: 'Technical Sanction Order TS-MH-PUN-2024-881',
      type: 'Engineering Sanction',
      ref: 'Page 3 • Approved 14 Feb 2025',
    },
    {
      name: 'District Treasury Payment Vouchers V-991 to V-994',
      type: 'Financial Ledger',
      ref: 'PFMS DBT Reference #TXN-881920',
    },
    {
      name: 'EXIF-Geotagged Foundation Inspection Photos',
      type: 'Physical Verification',
      ref: 'GPS: 18.5204° N, 73.8567° E',
    },
  ];

  return (
    <div className="space-y-4 font-sans">
      {/* 1. RISK SCORE CARD */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-[20px] border border-[#E5E3DC] bg-[#F1F0EC]">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6B6B6B]">
            Explainable Risk Score
          </span>
          <div className="flex items-baseline justify-center sm:justify-start gap-2">
            <span className="text-4xl font-extrabold font-mono text-red-600">87</span>
            <span className="text-sm font-mono text-[#6B6B6B] font-bold">/ 100</span>
            <span className="rounded-full bg-red-100 text-red-700 border border-red-200 px-2.5 py-0.5 text-xs font-mono font-bold ml-2">
              HIGH RISK
            </span>
          </div>
        </div>

        <div className="text-xs text-[#6B6B6B] font-mono text-center sm:text-right border-t sm:border-t-0 sm:border-l border-[#E5E3DC] pt-2 sm:pt-0 sm:pl-4">
          <div>Confidence: <strong className="text-emerald-700">94.2% (Grounded)</strong></div>
          <div className="text-[#6B6B6B] text-[10px] mt-0.5">Model: XAI Decomposition v1.4</div>
        </div>
      </div>

      {/* 2. TOP CONTRIBUTING FACTORS */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6B6B6B] block">
          Top Contributing Factors (SHAP Risk Attribution)
        </span>
        <div className="space-y-2">
          {topContributors.map((c) => (
            <div
              key={c.num}
              className="flex items-center justify-between p-3.5 rounded-[16px] border border-[#E5E3DC] bg-[#F1F0EC] text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#6B6B6B]">{c.num}.</span>
                  <strong className="text-[#0E0E0E] text-xs font-semibold">{c.title}</strong>
                </div>
                <p className="text-[11px] text-[#6B6B6B] pl-4">{c.detail}</p>
              </div>
              <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded-full border ${c.color} shadow-2xs`}>
                {c.pts}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. AI EXPLANATION & WHY THIS MATTERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="p-3.5 rounded-[16px] border border-[#E5E3DC] bg-[#F1F0EC] space-y-1.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0E0E0E] block">
            AI Glass-Box Explanation
          </span>
          <p className="text-[#0E0E0E] text-xs leading-relaxed italic">
            "Cost and progress divergence are the strongest contributors to the current risk score. 92.5% of total outlay has been disbursed while verified milestone physical completion remains at only 31.0%."
          </p>
        </div>

        <div className="p-3.5 rounded-[16px] border border-[#E5E3DC] bg-[#F1F0EC] space-y-1.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 block">
            Why This Matters for Governance
          </span>
          <p className="text-[#6B6B6B] text-xs leading-relaxed">
            Significant disbursement without corresponding on-site physical progress creates exposure to contractor cash abandonment or unauthorized advance parking before project completion.
          </p>
        </div>
      </div>

      {/* 4. GROUNDED EVIDENCE SOURCES */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6B6B6B] block">
          Authoritative Evidence Sources Grounding This Score
        </span>
        <div className="divide-y divide-[#EAE8E2] rounded-[16px] border border-[#E5E3DC] bg-white overflow-hidden">
          {evidenceSources.map((ev, idx) => (
            <div key={idx} className="p-3 flex items-center justify-between text-xs hover:bg-[#FAFAF9] transition-colors">
              <div className="flex items-center gap-2.5">
                <FileText className="h-4 w-4 text-[#6B6B6B]" />
                <div>
                  <span className="font-semibold text-[#0E0E0E] block text-xs">{ev.name}</span>
                  <span className="text-[10px] text-[#6B6B6B] font-mono">{ev.ref}</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {ev.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Navigation Action */}
      <div className="flex items-center justify-between pt-2 border-t border-[#EAE8E2]">
        <span className="text-[11px] font-mono text-[#6B6B6B]">
          Statutory Reference: MPLADS Revised Guidelines 2023 §5.4
        </span>
        <Link
          to="/projects/P-1023"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#0E0E0E] px-4 py-1.5 text-xs font-semibold text-white hover:bg-black transition-colors shadow-2xs"
        >
          <span>Inspect Project Risk Passport</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
