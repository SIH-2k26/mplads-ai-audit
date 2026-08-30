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
      color: 'text-[#C94B4B]',
    },
    {
      num: '2',
      title: 'Progress / Disbursement Mismatch',
      detail: '92.5% funds disbursed vs 31.0% physical completion on site',
      pts: '+22 pts',
      color: 'text-[#C94B4B]',
    },
    {
      num: '3',
      title: 'Duplicate Similarity Overlap',
      detail: '74% coordinate & polygon similarity with PMGSY road asset',
      pts: '+15 pts',
      color: 'text-white/60',
    },
    {
      num: '4',
      title: 'Procurement Anomaly',
      detail: 'Single-bid qualified tender with 8-day compressed notice',
      pts: '+12 pts',
      color: 'text-white/60',
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
    <div className="space-y-6">
      {/* 1. RISK SCORE CARD */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-[6px] border border-white/15 bg-white/5">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
            Explainable Risk Score
          </span>
          <div className="flex items-baseline justify-center sm:justify-start gap-2">
            <span className="text-4xl font-extrabold font-mono text-[#C94B4B]">87</span>
            <span className="text-sm font-mono text-gray-400 font-bold">/ 100</span>
            <span className="rounded bg-[#C94B4B]/20 text-[#C94B4B] border border-[#C94B4B]/40 px-2 py-0.5 text-xs font-mono font-bold ml-2">
              HIGH RISK
            </span>
          </div>
        </div>

        <div className="text-xs text-gray-300 font-mono text-center sm:text-right border-t sm:border-t-0 sm:border-l border-white/15 pt-2 sm:pt-0 sm:pl-4">
          <div>Confidence: <strong className="text-[#2E8064]">94.2% (Grounded)</strong></div>
          <div className="text-gray-400 text-[10px] mt-0.5">Model: XAI Decomposition v1.4</div>
        </div>
      </div>

      {/* 2. TOP CONTRIBUTING FACTORS */}
      <div className="space-y-2.5">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 block">
          Top Contributing Factors (SHAP Risk Attribution)
        </span>
        <div className="space-y-2">
          {topContributors.map((c) => (
            <div
              key={c.num}
              className="flex items-center justify-between p-3 rounded-[4px] border border-white/15 bg-white/5/70 text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-gray-400">{c.num}.</span>
                  <strong className="text-white text-xs">{c.title}</strong>
                </div>
                <p className="text-[11px] text-gray-300 pl-4">{c.detail}</p>
              </div>
              <span className={`font-mono text-xs font-bold ${c.color} px-2 py-1 rounded bg-[#002449] border border-white/15`}>
                {c.pts}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. AI EXPLANATION & WHY THIS MATTERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="p-3.5 rounded-[6px] border border-white/15 bg-white/5 space-y-1.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/60 block">
            AI Glass-Box Explanation
          </span>
          <p className="text-gray-200 text-xs leading-relaxed italic">
            "Cost and progress divergence are the strongest contributors to the current risk score. 92.5% of total outlay has been disbursed while verified milestone physical completion remains at only 31.0%."
          </p>
        </div>

        <div className="p-3.5 rounded-[6px] border border-white/15 bg-white/5 space-y-1.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2E8064] block">
            Why This Matters for Governance
          </span>
          <p className="text-gray-300 text-xs leading-relaxed">
            Significant disbursement without corresponding on-site physical progress creates exposure to contractor cash abandonment or unauthorized advance parking before project completion.
          </p>
        </div>
      </div>

      {/* 4. GROUNDED EVIDENCE SOURCES */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 block">
          Authoritative Evidence Sources Grounding This Score
        </span>
        <div className="divide-y divide-white/15 rounded border border-white/15 bg-white/5">
          {evidenceSources.map((ev, idx) => (
            <div key={idx} className="p-2.5 flex items-center justify-between text-xs hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-white/60" />
                <div>
                  <span className="font-bold text-white block text-xs">{ev.name}</span>
                  <span className="text-[10px] text-gray-400">{ev.ref}</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#2E8064] font-semibold bg-[#002449] px-2 py-0.5 rounded border border-white/15">
                {ev.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Navigation Action */}
      <div className="flex items-center justify-between pt-2 border-t border-white/15">
        <span className="text-[11px] font-mono text-gray-400">
          Statutory Reference: MPLADS Revised Guidelines 2023 §5.4
        </span>
        <Link
          to="/projects/P-1023"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 rounded-[4px] bg-white px-3.5 py-1.5 text-xs font-bold text-[#002449] hover:bg-gray-100 transition-colors shadow-sm"
        >
          <span>Inspect Project Risk Passport</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
