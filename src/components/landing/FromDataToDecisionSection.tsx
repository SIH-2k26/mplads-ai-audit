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
  ArrowUpRight,
  Activity,
  Check,
} from 'lucide-react';
import { Dialog } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface CompactStageInfo {
  num: string;
  title: string;
  subtitle: string;
  desc: string;
  bottomLabel: string;
  icon: React.ElementType;
  summary: string;
  keyPoints: string[];
  exampleSignal: string;
}

export function FromDataToDecisionSection() {
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [hoveredStageIndex, setHoveredStageIndex] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedModalIndex, setSelectedModalIndex] = useState<number>(0);
  const [hasScrolledIntoView, setHasScrolledIntoView] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);

  const stages: CompactStageInfo[] = [
    {
      num: '01',
      title: 'DETECT',
      subtitle: 'Early Warning Anomaly Engine',
      desc: 'Identify anomalies across cost benchmarks, payment velocity, single-tender procurement and execution timelines.',
      bottomLabel: 'EARLY WARNING ENGINE',
      icon: Search,
      summary:
        'Continuously scans project records, financial velocity, and tender submissions against statutory benchmarks before payments are released.',
      keyPoints: [
        'Cost deviation above PWD Schedule of Rates baseline',
        'Geospatial duplicate & cross-scheme overlap alerts',
        'Single-bid tender awards & contractor concentration',
      ],
      exampleSignal: 'Ward 17 Community Hall (P-1023): +38.2% cost mark-up vs PWD SoR',
    },
    {
      num: '02',
      title: 'EXPLAIN',
      subtitle: 'Explainable Risk Reasoning',
      desc: 'Explain why a project was flagged with plain-language diagnostic rationales and PWD SoR percentile baselines.',
      bottomLabel: 'EXPLAINABLE REASONING',
      icon: Eye,
      summary:
        'Decomposes composite risk scores into transparent, cited factors so officers understand the exact evidence and statutory rules behind every flag.',
      keyPoints: [
        'Multi-factor score decomposition (Cost, Delay, Disconnect)',
        'Direct citations to MPLADS Guidelines 2023 & CVC rules',
        'Zero black-box AI — every score traces to ledger vouchers',
      ],
      exampleSignal: 'Risk 87/100: Cost variance (+18 pts), Milestone delay (+16 pts)',
    },
    {
      num: '03',
      title: 'INVESTIGATE',
      subtitle: 'Evidence & Verification Docket',
      desc: 'Connect flags with corroborating evidence dossiers, treasury ledgers, and geotagged field survey photos.',
      bottomLabel: 'IMMUTABLE EVIDENCE DOCKET',
      icon: FileText,
      summary:
        'Automatically collates technical sanction estimates, treasury DBT vouchers, and geotagged photos into an authoritative case docket for officer review.',
      keyPoints: [
        'Technical sanction & tender comparative statements',
        'PFMS & State Treasury disbursement transaction records',
        'Geotagged site photos & GFR-12C UC compliance tracking',
      ],
      exampleSignal: 'Case CASE-2026-0182: Dispatched to District Vigilance Officer',
    },
    {
      num: '04',
      title: 'ACT',
      subtitle: 'Authoritative Human Verdict',
      desc: 'Enable an authorized human decision-maker to confirm findings, dismiss false positives, resolve, or escalate.',
      bottomLabel: 'AUTHORITATIVE HUMAN VERDICT',
      icon: CheckCircle2,
      summary:
        'Empowers designated district authorities to make informed decisions. The AI provides decision support; authorized officials retain full control.',
      keyPoints: [
        'Dismiss valid site-specific variances as false positives',
        'Demand formal contractor explanation under Rule 5.4',
        'Freeze next fund installment or escalate to Vigilance Panel',
      ],
      exampleSignal: 'Officer Action: 14-day statutory clarification notice issued',
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
                    <span>Inspect</span>
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
            ● CONTINUOUS INTELLIGENCE PIPELINE: <span className="text-[#E5B45A]">DETECT</span> → <span className="text-[#E5B45A]">EXPLAIN</span> → <span className="text-[#E5B45A]">INVESTIGATE</span> → <span className="text-[#E5B45A]">HUMAN DECISION</span>
          </p>
        </div>

      </div>

      {/* COMPACT & ELEGANT STAGE POPUP CARD */}
      <Dialog
        open={modalOpen}
        onOpenChange={setModalOpen}
        className="max-w-md bg-[#102F45] text-white border-2 border-[#D99018] shadow-2xl p-5 rounded-[8px]"
      >
        {/* Compact Header */}
        <div className="flex items-center justify-between border-b border-[#234D6C] pb-3 mb-3.5 pr-6">
          <div className="flex items-center gap-2.5">
            <span className="text-lg font-mono font-extrabold text-[#D99018] bg-[#183B54] px-2 py-0.5 rounded border border-[#234D6C]">
              {currentModalStage.num}
            </span>
            <div>
              <h3 className="text-base font-extrabold text-white uppercase tracking-wide leading-none">
                {currentModalStage.title}
              </h3>
              <p className="text-[10px] font-mono text-[#E5B45A] mt-0.5">
                {currentModalStage.subtitle}
              </p>
            </div>
          </div>

          <Badge variant="secondary" className="bg-[#183B54] text-[#E5B45A] border-[#234D6C] font-mono text-[9px] px-1.5 py-0.2">
            STAGE {selectedModalIndex + 1}/4
          </Badge>
        </div>

        {/* Concise Body Content */}
        <div className="space-y-3.5 text-xs">
          {/* Summary Sentence */}
          <p className="text-xs text-gray-200 leading-relaxed font-normal bg-[#183B54] p-3 rounded-[4px] border border-[#234D6C]">
            {currentModalStage.summary}
          </p>

          {/* Key Checklist Functions */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-gray-300 uppercase tracking-wider block">
              Core Capabilities:
            </span>
            <div className="space-y-1 text-gray-300">
              {currentModalStage.keyPoints.map((pt, i) => (
                <div key={i} className="flex items-start gap-2 bg-[#183B54]/40 p-1.5 rounded border border-[#234D6C]/60 text-[11px]">
                  <Check className="h-3.5 w-3.5 text-[#2E8064] flex-shrink-0 mt-0.5" />
                  <span className="leading-tight">{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Trigger Example */}
          <div className="p-2.5 rounded bg-[#183B54] border border-[#234D6C] flex items-start gap-2">
            <Activity className="h-3.5 w-3.5 text-[#D99018] flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-[9px] font-mono font-bold text-[#E5B45A] uppercase block">
                Sample Operational Trigger:
              </span>
              <span className="text-[11px] text-gray-200 font-medium leading-tight block mt-0.5">
                {currentModalStage.exampleSignal}
              </span>
            </div>
          </div>
        </div>

        {/* Compact Footer Navigation */}
        <div className="mt-4 pt-3 border-t border-[#234D6C] flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevModalStage}
            className="bg-[#183B54] text-white border-[#234D6C] hover:bg-[#102F45] text-xs font-semibold h-7 px-2.5"
          >
            <ArrowLeft className="h-3 w-3 mr-1" />
            Prev
          </Button>

          <span className="text-[10px] font-mono text-gray-400">
            {selectedModalIndex + 1} of 4
          </span>

          <Button
            variant="default"
            size="sm"
            onClick={handleNextModalStage}
            className="bg-[#D99018] hover:bg-[#C98220] text-[#15324A] text-xs font-bold h-7 px-2.5"
          >
            Next
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </Dialog>
    </section>
  );
}
