import React, { useState } from 'react';
import { Database, Cpu, ShieldAlert, FileText, CheckSquare, ArrowRight, Layers } from 'lucide-react';

export function IntelligencePipelineSection() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: '01. DATA INGESTION',
      name: 'DATA',
      desc: 'Heterogeneous administrative & on-ground inputs',
      icon: Database,
      items: [
        'Treasury Payment Vouchers',
        'Administrative Sanctions',
        'GeM & e-Tender Notices',
        'Inspection Reports & Geo-photos',
        'Physical Progress Measurements',
        'Codified MPLADS Guidelines 2023',
      ],
      color: 'border-l-[#002449]',
    },
    {
      title: '02. ANALYSIS & MODELS',
      name: 'ANALYSIS',
      desc: 'Multi-factor benchmark & anomaly engines',
      icon: Cpu,
      items: [
        'Schedule of Rates (SoR) Benchmarking',
        'Disbursement vs Execution Trajectory',
        'Bidder IP / GST / Phone Matching',
        'Geospatial Duplication Detection',
        'Cartel & Syndicate Network Graph',
        'SLA Milestone Velocity Forecasts',
      ],
      color: 'border-l-[#002449]',
    },
    {
      title: '03. RISK INDEXING',
      name: 'RISK',
      desc: 'Decomposed 9-vector composite score',
      icon: ShieldAlert,
      items: [
        'Current Risk Score (0–100)',
        'Future Risk & SLA Delay Probability',
        'Systemic & District-wide Risk Index',
        'Contractor Concentration Index',
        'Confidence & Coverage Percentiles',
      ],
      color: 'border-l-[#B44343]',
    },
    {
      title: '04. CORROBORATED EVIDENCE',
      name: 'EVIDENCE',
      desc: 'Verifiable statutory documentation dossier',
      icon: FileText,
      items: [
        'Mandatory Rule & Clause Citations',
        'Peer Cost Percentile Comparison',
        'Digitally Signed Document Hashes',
        'Physical Site Photo Verification',
        'Disbursement Ledger Excerpts',
      ],
      color: 'border-l-[#2F7658]',
    },
    {
      title: '05. ACTION & VERDICT',
      name: 'ACTION',
      desc: 'Human authority decision support',
      icon: CheckSquare,
      items: [
        'Priority Action Queue for Collectors',
        'Pre-Sanction Approval Checklists',
        'Official Case Investigation Docket',
        'Authoritative Human Verdict Panel',
        'Immutable Audit Trail Record',
      ],
      color: 'border-l-[#002449]',
    },
  ];

  return (
    <section id="pipeline" className="py-24 bg-white border-b border-[#E5E3DC]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#002449] bg-[#002449]/10 px-3 py-1 rounded-full border border-[#002449]/30">
            System Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#002449] tracking-tight uppercase">
            The Multi-Stage Intelligence Pipeline
          </h2>
          <p className="text-sm sm:text-base text-[#6B6B6B] leading-relaxed">
            How raw government transactions transform into explainable diagnostic evidence and authoritative administrative action.
          </p>
        </div>

        {/* 5-Stage Pipeline Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-stretch">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isHovered = activeStep === idx;

            return (
              <div
                key={step.name}
                onMouseEnter={() => setActiveStep(idx)}
                className={`rounded-[6px] border border-[#E5E3DC] bg-[#FAFAF9] p-5 shadow-card transition-all flex flex-col justify-between border-l-4 ${step.color} ${
                  isHovered ? 'bg-white shadow-elevated scale-[1.02] border-[#002449]' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold tracking-wider text-[#6B6B6B]">
                      {step.title}
                    </span>
                    <div className="p-1.5 rounded-[4px] bg-[#F1F0EC] text-[#002449]">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[#002449] mb-1">
                    {step.name}
                  </h3>
                  <p className="text-[11px] text-[#6B6B6B] leading-relaxed mb-4">
                    {step.desc}
                  </p>

                  <div className="space-y-2 pt-3 border-t border-[#F1F0EC]">
                    {step.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="text-[11px] font-medium text-[#1D2939] flex items-start gap-1.5 leading-snug"
                      >
                        <span className="text-[#002449] font-bold">•</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-[#F1F0EC] text-[10px] font-mono text-[#6B6B6B] flex items-center justify-between">
                  <span>Stage 0{idx + 1} of 05</span>
                  {idx < 4 && <ArrowRight className="h-3 w-3 text-[#98A2B3] hidden lg:inline" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
