import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, AlertTriangle, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { formatCurrencyINR } from '../../lib/utils';

export function InteractiveProjectLifecycle() {
  const [selectedStage, setSelectedStage] = useState<number>(4); // Default to Payment

  const stages = [
    {
      step: '01. RECOMMENDATION',
      title: 'MP Recommendation',
      date: '10 May 2025',
      status: 'VERIFIED',
      details: 'Recommended by MP Pune for Youth Skill & Community Welfare.',
      metrics: 'Outlay proposed: ₹42.0 Lakhs',
      checkpoint: 'Statutory eligibility checked against MPLADS 2023 Guidelines §2.3.',
      flag: null,
    },
    {
      step: '02. SANCTION',
      title: 'Administrative Sanction',
      date: '18 June 2025',
      status: 'VERIFIED',
      details: 'Collector Sanction Order PUN/MPLADS/2025/441 issued.',
      metrics: 'Sanction amount: ₹42.0 Lakhs',
      checkpoint: 'De-duplication cross-checked against PMGSY & State Budget schemes.',
      flag: null,
    },
    {
      step: '03. PROCUREMENT',
      title: 'Tender & Work Order',
      date: '30 August 2025',
      status: 'MONITORED',
      details: 'Awarded to M/s Sahyadri Buildtech Infrastructure Pvt Ltd.',
      metrics: 'Tender ID: e-Tender MH-PUN-772',
      checkpoint: 'Single-contractor concentration checked (Won 4 of last 6 Haveli tenders).',
      flag: 'Contractor concentration 68.4% in Haveli Block.',
    },
    {
      step: '04. EXECUTION',
      title: 'On-Ground Construction',
      date: '15 April 2026',
      status: 'DELAYED',
      details: 'Plinth and foundation completed; super-structure currently stalled.',
      metrics: 'Verified physical progress: 31.0%',
      checkpoint: 'Geotagged site inspection conducted by Zilla Parishad Engineer.',
      flag: '+78 days delayed beyond contractual milestone.',
    },
    {
      step: '05. PAYMENT & RELEASES',
      title: 'Installment Disbursement',
      date: '10 February 2026',
      status: 'CRITICAL',
      details: '2nd Installment released without verifying roof slab completion.',
      metrics: 'Disbursed: ₹38.85L (92.5% of total)',
      checkpoint: 'GFR-12C Utilisation Certificate missing for Installment #2.',
      flag: 'Critical Mismatch: 92.5% financial vs 31.0% physical (+61.5% gap).',
    },
    {
      step: '06. HANDOVER & ASSET',
      title: 'Asset Registration & UC',
      date: '30 September 2026 (Scheduled)',
      status: 'PENDING',
      details: 'Scheduled handover and national GIS asset registry barcode tagging.',
      metrics: 'Remaining balance: ₹3.15 Lakhs',
      checkpoint: 'Final completion certificate & IQM inspection report pending.',
      flag: 'High probability of SLA breach if unrectified.',
    },
  ];

  const current = stages[selectedStage];

  return (
    <section id="lifecycle" className="py-24 bg-[#F7F5F0] border-b border-[#D9D5CC]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#C98219] bg-[#C98219]/10 px-3 py-1 rounded-full border border-[#C98219]/30">
            Project Digital Twin Cockpit
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#18324A] tracking-tight uppercase">
            Every Project Has a Story.
          </h2>
          <p className="text-sm sm:text-base text-[#667085] leading-relaxed">
            From the initial parliamentary recommendation to physical asset handover, Agastya continuously monitors checkpoints at every lifecycle milestone.
          </p>
        </div>

        {/* Interactive Lifecycle Timeline Navigator */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
          {stages.map((st, idx) => {
            const isSelected = selectedStage === idx;
            const isFlagged = !!st.flag;

            return (
              <button
                key={st.step}
                type="button"
                onClick={() => setSelectedStage(idx)}
                className={`p-3 rounded-[4px] border text-left transition-all relative ${
                  isSelected
                    ? 'bg-[#18324A] text-white border-[#18324A] shadow-elevated'
                    : 'bg-white border-[#D9D5CC] hover:border-[#18324A] text-[#1D2939]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-mono font-bold ${isSelected ? 'text-gray-300' : 'text-[#667085]'}`}>
                    {st.step.split('.')[0]}
                  </span>
                  {isFlagged && (
                    <span className="h-2 w-2 rounded-full bg-[#B44343] animate-pulse" />
                  )}
                </div>
                <div className="text-xs font-bold mt-1 leading-snug truncate">
                  {st.title}
                </div>
                <div className={`text-[10px] font-mono mt-1 truncate ${isSelected ? 'text-[#E7A943]' : 'text-[#667085]'}`}>
                  {st.status}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Real-time Telemetry Showcase */}
        <div className="rounded-[8px] border-2 border-[#18324A] bg-white p-6 sm:p-8 shadow-card">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6 border-b border-[#EDE8DE] pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-[#C98219] uppercase">
                  {current.step}
                </span>
                <Badge variant={current.status === 'CRITICAL' || current.status === 'DELAYED' ? 'critical' : 'success'}>
                  {current.status}
                </Badge>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#18324A]">
                {current.title} — Multipurpose Community Hall (P-1023)
              </h3>
              <p className="text-xs text-[#667085] mt-1 font-mono">
                Hadapsar Extension, Pune District • Implementing Agency: Pune Zilla Parishad
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-[#667085] uppercase tracking-wider block">Milestone Metric</span>
              <span className="text-lg font-mono font-bold text-[#18324A]">
                {current.metrics}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#18324A] uppercase tracking-wider block">
                Milestone Execution Record
              </span>
              <p className="text-xs text-[#1D2939] leading-relaxed bg-[#FAFAF7] p-3.5 rounded border border-[#EDE8DE]">
                {current.details}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#2F7658] font-medium">
                <ShieldCheck className="h-4 w-4" />
                <span>{current.checkpoint}</span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-[#18324A] uppercase tracking-wider block">
                AI Diagnostic Telemetry
              </span>
              {current.flag ? (
                <div className="p-3.5 rounded bg-red-50 border border-[#B44343]/30 text-xs text-[#B44343] space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-[11px] uppercase">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Checkpoint Variance Flag
                  </div>
                  <p className="text-[11px] text-[#1D2939] leading-relaxed">
                    {current.flag}
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded bg-emerald-50 border border-[#2F7658]/30 text-xs text-[#2F7658] flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Statutory compliance and execution timeline validated.</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-[#EDE8DE] flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-[#667085]">
              Project ID: <strong className="text-[#18324A] font-mono">MPLADS-MH-PUN-2026-1023</strong>
            </span>
            <Link to="/projects/P-1023">
              <Button variant="default" size="sm" className="text-xs flex items-center gap-1.5 font-bold">
                <span>Open Complete Project Digital Twin</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
