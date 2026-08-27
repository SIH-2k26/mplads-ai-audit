import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Eye,
  FileText,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  AlertTriangle,
  FileSpreadsheet,
  Building,
  Check,
  Layers,
  ArrowUpRight,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { Dialog } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface PipelineStageInfo {
  num: string;
  title: string;
  subtitle: string;
  desc: string;
  bottomLabel: string;
  icon: React.ElementType;
  miniPipeline: { step: string; label: string }[];
  overview: string;
  liveExample: {
    project: string;
    sanctionedCost: string;
    benchmarkCost: string;
    deviation: string;
    riskSignal: string;
    flags: string[];
  };
  sources: string[];
  nextSteps: string;
}

export function FromDataToDecisionSection() {
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [hoveredStageIndex, setHoveredStageIndex] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedModalIndex, setSelectedModalIndex] = useState<number>(0);
  const [hasScrolledIntoView, setHasScrolledIntoView] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);

  const stages: PipelineStageInfo[] = [
    {
      num: '01',
      title: 'DETECT',
      subtitle: 'Early Warning Anomaly Engine',
      desc: 'Identify anomalies across cost benchmarks, payment velocity, single-tender procurement and execution timelines.',
      bottomLabel: 'EARLY WARNING ENGINE',
      icon: Search,
      miniPipeline: [
        { step: '01', label: 'Project Data Ingestion' },
        { step: '02', label: 'Statutory Rule Checks' },
        { step: '03', label: 'Statistical & ML Analysis' },
        { step: '04', label: 'Risk Signal Generated' },
      ],
      overview:
        'Continuous automated monitoring scanning across pre-sanction, procurement, and fund release telemetry. Identifies irregular patterns before funds are irrevocably disbursed.',
      liveExample: {
        project: 'Construction of Ward 17 Community Hall (Project P-1023)',
        sanctionedCost: '₹42.00 Lakhs',
        benchmarkCost: '₹30.40 Lakhs (PWD SoR Baseline)',
        deviation: '+38.2% Unit Rate Inflation',
        riskSignal: 'HIGH RISK (Score: 87/100)',
        flags: [
          'Cost outlier above PWD Schedule of Rates 2024-25 median',
          'Single-bid tender with compressed 8-day notice period',
          'Tender awarded to high-concentration contractor syndicate',
          'Overlapping geospatial polygon with MLALADS 2024 work (150m)',
        ],
      },
      sources: [
        'District Planning Office Sanction Records',
        'State Public Works Department (PWD) Schedule of Rates',
        'e-Procurement & GeM Tender Logs',
        'ISRO Bhuvan Spatial Asset Registry',
      ],
      nextSteps:
        'Automatically packages flagged telemetry anomalies and forwards to the Explainable Reasoning Engine.',
    },
    {
      num: '02',
      title: 'EXPLAIN',
      subtitle: 'Explainable Risk Reasoning',
      desc: 'Explain why a project was flagged with plain-language diagnostic rationales and PWD SoR percentile baselines.',
      bottomLabel: 'EXPLAINABLE REASONING',
      icon: Eye,
      miniPipeline: [
        { step: '01', label: 'Risk Score 78/100' },
        { step: '02', label: 'Factor Decomposition' },
        { step: '03', label: 'Evidence Citation' },
        { step: '04', label: 'Audit Rationale Dossier' },
      ],
      overview:
        'Decomposes composite risk scores into transparent, cited statutory factors. AGASTYA operates as a glass-box decision system where every risk point maps directly to evidence.',
      liveExample: {
        project: 'Bituminous Village Link Road KM 12/400 (Project P-0871)',
        sanctionedCost: '₹58.00 Lakhs',
        benchmarkCost: '₹46.50 Lakhs (Rural Roads Standard)',
        deviation: '+24.7% Estimated Variance',
        riskSignal: 'HIGH RISK (Score: 82/100)',
        flags: [
          'Cost Factor (+18 pts): Rate for bituminous macadam exceeds SoR Item #441',
          'Delay Factor (+16 pts): 88 days lag against statutory milestone timeline',
          'Financial Mismatch (+14 pts): 87% funds spent vs 51% physical completion',
          'Duplicate Factor (+11 pts): 88% spatial overlap with PMGSY Batch III work',
        ],
      },
      sources: [
        'MPLADS Revised Guidelines 2023 §4.2 & §5.4',
        'Central Vigilance Commission (CVC) Procurement Circulars',
        'District Treasury Direct Benefit Transfer Ledger',
      ],
      nextSteps:
        'Collates corroborating documents into an immutable electronic evidence docket for investigation.',
    },
    {
      num: '03',
      title: 'INVESTIGATE',
      subtitle: 'Evidence & Verification Docket',
      desc: 'Connect flags with corroborating evidence dossiers, treasury ledgers, and geotagged field survey photos.',
      bottomLabel: 'IMMUTABLE EVIDENCE DOCKET',
      icon: FileText,
      miniPipeline: [
        { step: '01', label: 'Alert Docket Received' },
        { step: '02', label: 'Multi-Source Cross-Check' },
        { step: '03', label: 'Field Verification Brief' },
        { step: '04', label: 'Assigned to Officer' },
      ],
      overview:
        'Automated collation of cross-departmental documentation, treasury vouchers, contractor entity networks, and geotagged field photos into an authoritative case docket.',
      liveExample: {
        project: 'Dossier CASE-2026-0182: Ward 17 Public Works Cluster',
        sanctionedCost: '₹1.18 Crore (Consolidated Outlay)',
        benchmarkCost: '₹84.20 Lakhs (Benchmark Estimate)',
        deviation: 'Multiple Structural Discrepancies',
        riskSignal: 'CRITICAL AUDIT QUEUE',
        flags: [
          '✓ Technical Sanction Estimate (TS-MH-PUN-2024-881) Attached',
          '⚠ Detailed Tender Comparative Statement Missing from e-Portal',
          '✓ District Treasury DBT Ledger Vouchers Verified (V-991 to V-994)',
          '✓ Geotagged Foundation Photo (EXIF: 18.5204° N, 73.8567° E)',
          '⚠ GFR-12C Utilisation Certificate (UC-02) overdue by 45 days',
        ],
      },
      sources: [
        'PFMS & State Treasury Payment Gateway',
        'Contractor PAN & Corporate Affairs Registry',
        'Independent Quality Monitor (IQM) Field Inspection Reports',
      ],
      nextSteps:
        'Dispatches complete 1-page inspection brief and mobile QR verification link to the designated District Vigilance Officer.',
    },
    {
      num: '04',
      title: 'ACT',
      subtitle: 'Authoritative Human Verdict & Resolution',
      desc: 'Enable an authorized human decision-maker to confirm findings, dismiss false positives, resolve, or escalate.',
      bottomLabel: 'AUTHORITATIVE HUMAN VERDICT',
      icon: CheckCircle2,
      miniPipeline: [
        { step: '01', label: 'Authority Reviews Docket' },
        { step: '02', label: 'On-Site Field Audit' },
        { step: '03', label: 'Official Recorded Finding' },
        { step: '04', label: 'Enforcement / Closure' },
      ],
      overview:
        'Empowering authorized government officers with evidence-backed decision support. The platform never makes automatic legal accusations—human officials evaluate evidence and take authoritative decisions.',
      liveExample: {
        project: 'Administrative Decision Options (District Collector / Nodal Authority)',
        sanctionedCost: 'Statutory 14-Day Decision SLA',
        benchmarkCost: 'Human In The Loop Protocol',
        deviation: 'Enforceable Audit Outcomes',
        riskSignal: 'DECISION PENDING REVIEW',
        flags: [
          '✓ Option A: DISMISS AS FALSE POSITIVE (e.g., valid site-specific bedrock cost justified)',
          '⚠ Option B: DEMAND CONTRACTOR EXPLANATION (Issue 14-day statutory notice under Rule 5.4)',
          '⏸ Option C: FREEZE FUND DISBURSEMENT (Withhold 2nd installment pending milestone audit)',
          '↗ Option D: ESCALATE TO VIGILANCE COMMITTEE (Initiate formal inquiry into contractor syndicate)',
        ],
      },
      sources: [
        'Ministry of Statistics & PI Governance Rules',
        'CAG Performance Audit Guidelines',
        'District Authority Statutory Sign-off Protocol',
      ],
      nextSteps:
        'Immutable audit trail recorded on ledger; feedback fine-tunes future anomaly detection thresholds.',
    },
  ];

  // Viewport Observer for Staggered Reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasScrolledIntoView(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Continuous Subtle Signal Travel across 01 -> 02 -> 03 -> 04
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setActiveStageIndex((prev) => (prev + 1) % 4);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  const handleCardClick = (idx: number) => {
    setSelectedModalIndex(idx);
    setModalOpen(true);
  };

  const handleNextModalStage = () => {
    setSelectedModalIndex((prev) => (prev + 1) % 4);
  };

  const handlePrevModalStage = () => {
    setSelectedModalIndex((prev) => (prev - 1 + 4) % 4);
  };

  const currentModalStage = stages[selectedModalIndex];

  return (
    <section
      ref={sectionRef}
      className="bg-[#102F45] text-white py-20 sm:py-24 relative overflow-hidden border-b border-[#15324B]"
    >
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#D99018_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

      {/* Subtle Continuous Intelligence Wave / Flow Layer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D99018]/5 to-transparent opacity-40 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="max-w-3xl mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#183B54] px-3.5 py-1 text-xs font-mono font-bold text-[#E5B45A] border border-[#234D6C]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#D99018]" />
            <span>OPERATIONAL GOVERNANCE ARCHITECTURE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase leading-tight font-sans">
            From Data <br />
            <span className="text-[#D99018]">To Decision.</span>
          </h2>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl font-normal">
            AGASTYA connects project records, financial activity, execution progress, governance rules and evidence into a single risk intelligence layer.
          </p>
        </div>

        {/* Continuous Pipeline Connector Bar (Desktop Horizontal) */}
        <div className="relative hidden lg:block mb-6 px-10">
          <div className="relative h-1.5 w-full bg-[#183B54] rounded-full overflow-hidden border border-[#234D6C]">
            {/* Pulsing Signal Packet traveling horizontally */}
            <div
              className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-[#E5B45A] to-transparent rounded-full transition-all duration-700 ease-out"
              style={{
                left: `${(activeStageIndex / 3) * 85}%`,
              }}
            />
          </div>

          {/* 4 Pipeline Nodes */}
          <div className="absolute top-1/2 -translate-y-1/2 left-10 right-10 flex justify-between pointer-events-none">
            {stages.map((stg, idx) => {
              const isActive = activeStageIndex === idx || hoveredStageIndex === idx;
              return (
                <div
                  key={stg.num}
                  className={`h-4 w-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                    isActive
                      ? 'bg-[#D99018] border-white ring-4 ring-[#D99018]/40 scale-125'
                      : 'bg-[#102F45] border-[#234D6C]'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-[#234D6C]'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* 4 Structured Pipeline Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
          {stages.map((s, idx) => {
            const Icon = s.icon;
            const isSignalActive = activeStageIndex === idx;
            const isHovered = hoveredStageIndex === idx;
            const isEmphasized = isSignalActive || isHovered;

            return (
              <div
                key={s.num}
                onClick={() => handleCardClick(idx)}
                onMouseEnter={() => setHoveredStageIndex(idx)}
                onMouseLeave={() => setHoveredStageIndex(null)}
                style={{
                  transitionDelay: hasScrolledIntoView ? `${idx * 110}ms` : '0ms',
                }}
                className={`group rounded-[6px] border bg-[#183B54] p-5 flex flex-col justify-between shadow-card transition-all duration-300 cursor-pointer ${
                  isEmphasized
                    ? 'border-[#D99018] ring-2 ring-[#D99018]/30 -translate-y-1.5 bg-[#1B4360]'
                    : 'border-[#234D6C] hover:border-[#D99018]'
                } ${
                  hasScrolledIntoView
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-6 scale-98'
                }`}
              >
                <div>
                  {/* Top Number & Icon Row */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-2xl font-extrabold font-mono transition-colors duration-200 ${
                        isEmphasized ? 'text-[#E5B45A]' : 'text-[#D99018]'
                      }`}
                    >
                      {s.num}
                    </span>

                    <div
                      className={`p-2 rounded border transition-all duration-200 ${
                        isEmphasized
                          ? 'bg-[#D99018] text-[#15324A] border-[#E5B45A] scale-110 shadow-sm'
                          : 'bg-[#102F45] text-[#E5B45A] border-[#234D6C] group-hover:bg-[#15324A] group-hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-white tracking-wide uppercase mb-2">
                    {s.title}
                  </h3>

                  <p className="text-xs text-gray-300 leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                {/* Footer Link & Stage Indicator */}
                <div className="mt-6 pt-3 border-t border-[#234D6C] text-[10px] font-mono font-bold text-[#E5B45A] flex items-center justify-between">
                  <span>{s.bottomLabel}</span>
                  <span className="flex items-center gap-1 text-[9px] font-sans font-bold uppercase group-hover:text-white transition-colors">
                    <span>Explore Stage</span>
                    <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Explanatory Pipeline Subtitle */}
        <div className="mt-8 text-center">
          <p className="text-[11px] font-mono text-gray-400 tracking-wide">
            ● CONTINUOUS INTELLIGENCE PIPELINE: <span className="text-[#E5B45A]">DETECT</span> → <span className="text-[#E5B45A]">EXPLAIN</span> → <span className="text-[#E5B45A]">INVESTIGATE</span> → <span className="text-[#E5B45A]">HUMAN DECISION</span> (CLICK ANY CARD TO INSPECT)
          </p>
        </div>

      </div>

      {/* PROCESS DETAIL MODAL / DIALOG */}
      <Dialog
        open={modalOpen}
        onOpenChange={setModalOpen}
        className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#102F45] text-white border-2 border-[#D99018] shadow-2xl p-6"
      >
        {/* Custom Header */}
        <div className="border-b border-[#234D6C] pb-4 mb-4">
          <div className="flex items-center justify-between pr-8">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-mono font-extrabold text-[#D99018] bg-[#183B54] px-2.5 py-0.5 rounded border border-[#234D6C]">
                {currentModalStage.num}
              </span>
              <div>
                <h3 className="text-xl font-extrabold text-white uppercase tracking-wide">
                  {currentModalStage.title}
                </h3>
                <p className="text-xs font-mono text-[#E5B45A]">
                  {currentModalStage.subtitle}
                </p>
              </div>
            </div>

            <div className="text-right">
              <Badge variant="secondary" className="bg-[#183B54] text-[#E5B45A] border-[#234D6C] font-mono text-[10px]">
                STAGE {selectedModalIndex + 1} OF 4
              </Badge>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="space-y-5 text-xs">
          
          {/* Mini Animated Workflow Diagram */}
          <div className="bg-[#183B54] p-3.5 rounded-[6px] border border-[#234D6C] space-y-2">
            <span className="text-[10px] font-mono font-bold text-gray-300 uppercase tracking-wider block">
              Workflow Sequence in AGASTYA:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {currentModalStage.miniPipeline.map((mp, i) => (
                <div
                  key={i}
                  className="p-2 rounded bg-[#102F45] border border-[#234D6C] text-center space-y-1"
                >
                  <span className="text-[9px] font-mono text-[#D99018] font-bold block">
                    {mp.step}
                  </span>
                  <span className="text-[10px] text-white font-medium block leading-tight">
                    {mp.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stage Overview Description */}
          <p className="text-xs text-gray-200 leading-relaxed font-normal bg-[#183B54]/50 p-3 rounded border border-[#234D6C]">
            {currentModalStage.overview}
          </p>

          {/* Live MPLADS Realistic Example Box */}
          <div className="bg-[#183B54] p-4 rounded-[6px] border border-[#234D6C] space-y-3">
            <div className="flex items-center justify-between border-b border-[#234D6C] pb-2">
              <span className="text-[10px] font-mono font-bold text-[#E5B45A] uppercase flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" />
                <span>Real-World Operational Scenario:</span>
              </span>
              <span className="text-[10px] font-mono text-[#C94B4B] font-bold bg-red-950/60 px-2 py-0.5 rounded border border-[#C94B4B]/40">
                {currentModalStage.liveExample.riskSignal}
              </span>
            </div>

            <div>
              <strong className="text-xs text-white block">
                {currentModalStage.liveExample.project}
              </strong>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 font-mono text-[10px]">
                <div className="p-2 rounded bg-[#102F45] border border-[#234D6C]">
                  <span className="text-gray-400 block">Sanctioned Cost:</span>
                  <span className="text-white font-bold">{currentModalStage.liveExample.sanctionedCost}</span>
                </div>
                <div className="p-2 rounded bg-[#102F45] border border-[#234D6C]">
                  <span className="text-gray-400 block">Benchmark:</span>
                  <span className="text-[#2E8064] font-bold">{currentModalStage.liveExample.benchmarkCost}</span>
                </div>
                <div className="p-2 rounded bg-[#102F45] border border-[#234D6C]">
                  <span className="text-gray-400 block">Identified Variance:</span>
                  <span className="text-[#C94B4B] font-bold">{currentModalStage.liveExample.deviation}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono text-gray-300 uppercase block">
                Diagnostic Signals / Evidence Checks:
              </span>
              <ul className="space-y-1 text-gray-300">
                {currentModalStage.liveExample.flags.map((flg, fi) => (
                  <li key={fi} className="flex items-start gap-1.5 text-[11px] leading-snug">
                    <span className="text-[#E5B45A] font-bold mt-0.5">•</span>
                    <span>{flg}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Corroborating Data Sources */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            <div className="p-3 rounded bg-[#183B54] border border-[#234D6C]">
              <span className="text-[9px] font-mono font-bold text-[#E5B45A] uppercase block mb-1">
                Corroborating Data Sources:
              </span>
              <ul className="space-y-1 text-gray-300 text-[10px]">
                {currentModalStage.sources.map((src, si) => (
                  <li key={si} className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-[#2E8064]" />
                    <span>{src}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded bg-[#183B54] border border-[#234D6C]">
              <span className="text-[9px] font-mono font-bold text-[#E5B45A] uppercase block mb-1">
                What Happens Next:
              </span>
              <p className="text-[10px] text-gray-300 leading-relaxed">
                {currentModalStage.nextSteps}
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer Navigation */}
        <div className="mt-6 pt-4 border-t border-[#234D6C] flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevModalStage}
            className="bg-[#183B54] text-white border-[#234D6C] hover:bg-[#102F45] text-xs font-semibold h-8"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Previous Stage
          </Button>

          <span className="text-[10px] font-mono text-gray-400">
            {selectedModalIndex + 1} / 4 Stages
          </span>

          <Button
            variant="default"
            size="sm"
            onClick={handleNextModalStage}
            className="bg-[#D99018] hover:bg-[#C98220] text-[#15324A] text-xs font-bold h-8"
          >
            Next Stage
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </Dialog>
    </section>
  );
}
