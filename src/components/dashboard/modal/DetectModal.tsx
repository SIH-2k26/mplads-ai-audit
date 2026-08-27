import React from 'react';
import { Search, Check, AlertTriangle, ArrowRight, ShieldCheck, Activity, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DetectModalProps {
  onClose: () => void;
}

export function DetectModal({ onClose }: DetectModalProps) {
  const signalsChecked = [
    'Cost deviation above PWD Schedule of Rates baseline',
    'Fund utilization and dormant parking anomaly',
    'Timeline deviation past statutory milestone SLA',
    'Duplicate / overlapping works against State & PMGSY schemes',
    'Tender / single-bid procurement anomaly',
    'Eligibility & statutory compliance signal',
  ];

  return (
    <div className="space-y-6">
      {/* A. INTERNAL PROCESS PIPELINE */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#E5B45A] block">
          A. Internal Process Pipeline
        </span>
        <div className="flex items-center flex-wrap gap-2 font-mono text-xs bg-[#183B54] p-3 rounded-[6px] border border-[#234D6C]">
          <span className="bg-[#102F45] text-white px-3 py-1 rounded border border-[#234D6C] font-bold">
            PROJECT DATA
          </span>
          <span className="text-[#D99018] font-bold">→</span>
          <span className="bg-[#102F45] text-[#E5B45A] px-3 py-1 rounded border border-[#234D6C] font-bold">
            ANOMALY CHECK
          </span>
          <span className="text-[#D99018] font-bold">→</span>
          <span className="bg-[#102F45] text-[#C94B4B] px-3 py-1 rounded border border-[#C94B4B]/40 font-bold">
            RISK SIGNAL
          </span>
        </div>
      </div>

      {/* B. SIGNALS CHECKED */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#E5B45A] block">
          B. Continuous Detection Signals Checked
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {signalsChecked.map((sig, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 bg-[#183B54]/70 p-2.5 rounded-[4px] border border-[#234D6C] text-gray-200"
            >
              <Check className="h-4 w-4 text-[#2E8064] flex-shrink-0 mt-0.5" />
              <span className="leading-snug">{sig}</span>
            </div>
          ))}
        </div>
      </div>

      {/* C. PROJECT SIGNAL (EXAMPLE CASE) */}
      <div className="rounded-[6px] border border-[#234D6C] bg-[#183B54] p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#234D6C] pb-2">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-[#D99018]" />
            <span className="font-mono text-xs font-bold text-white uppercase">
              C. Sample Project Signal
            </span>
          </div>
          <span className="text-[10px] font-mono text-gray-400">ID: P-1023</span>
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white">
            Ward 17 Community Hall (Project P-1023)
          </h4>
          <p className="text-xs text-gray-300">
            Pune Municipal Corporation • Civil Works Category
          </p>
        </div>

        {/* 3 KPI Cards */}
        <div className="grid grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-2.5 rounded bg-[#102F45] border border-[#234D6C] text-center">
            <span className="text-gray-400 block text-[10px] uppercase">Estimated Cost</span>
            <span className="text-sm font-bold text-white block mt-0.5">₹42.0 L</span>
          </div>
          <div className="p-2.5 rounded bg-[#102F45] border border-[#234D6C] text-center">
            <span className="text-gray-400 block text-[10px] uppercase">Comparable Baseline</span>
            <span className="text-sm font-bold text-gray-300 block mt-0.5">₹30.4 L</span>
          </div>
          <div className="p-2.5 rounded bg-[#102F45] border border-[#C94B4B]/40 text-center bg-red-950/20">
            <span className="text-gray-400 block text-[10px] uppercase">Cost Deviation</span>
            <span className="text-sm font-bold text-[#C94B4B] block mt-0.5">+38.2%</span>
          </div>
        </div>
      </div>

      {/* D. STATUS & INSTITUTIONAL DISCLAIMER */}
      <div className="rounded-[6px] border border-[#D99018]/40 bg-[#D99018]/10 p-3.5 flex items-start gap-3 text-xs">
        <Info className="h-4 w-4 text-[#D99018] flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-[#D99018] uppercase">
              STATUS: REQUIRES REVIEW
            </span>
          </div>
          <p className="text-gray-200 text-xs leading-relaxed">
            <strong>Early warning signal — not an automatic accusation.</strong> AI detection functions as a decision-support signal for designated authorities to verify evidence, not as a conclusive finding of wrongdoing.
          </p>
        </div>
      </div>

      {/* Footer Navigation Action */}
      <div className="flex items-center justify-between pt-2 border-t border-[#234D6C]">
        <span className="text-[11px] font-mono text-gray-400">
          Source Engine: PWD Schedule of Rates + eSAKSHI Stream
        </span>
        <Link
          to="/projects/P-1023"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#D99018] px-3.5 py-1.5 text-xs font-bold text-[#15324A] hover:bg-[#E5B45A] transition-colors shadow-sm"
        >
          <span>Open Full Digital Twin</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
