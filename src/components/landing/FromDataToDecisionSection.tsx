import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import {
  Search,
  Eye,
  FileText,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  X,
  Check,
  AlertTriangle,
  Activity,
  ChevronUp,
} from 'lucide-react';

interface StageData {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  desc: string;
  bottomLabel: string;
  icon: React.ElementType;
  summary: string;
  miniProcess: string[];
  signalsTitle: string;
  signalsList: string[];
  exampleLabel: string;
  exampleTitle: string;
  exampleMetrics: { label: string; value: string; alert?: boolean }[];
  exampleNote: string;
}

export function FromDataToDecisionSection() {
  const [expandedStage, setExpandedStage] = useState<string | null>(null);

  // Keyboard accessibility: Escape to collapse
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExpandedStage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const stages: StageData[] = [
    {
      id: '01',
      num: '01',
      title: 'DETECT',
      subtitle: 'EARLY WARNING ENGINE',
      desc: 'Identify anomalies across cost benchmarks, payment velocity, single-tender procurement and execution timelines.',
      bottomLabel: 'EARLY WARNING ENGINE',
      icon: Search,
      summary:
        'Continuously scans project records, financial activity, procurement signals and execution data to identify anomalies before they become audit findings.',
      miniProcess: ['PROJECT DATA', 'ANOMALY CHECK', 'RISK SIGNAL'],
      signalsTitle: 'SIGNALS CHECKED',
      signalsList: [
        'Cost deviation above PWD Schedule of Rates baseline',
        'Fund utilization and dormant parking anomaly',
        'Timeline deviation past statutory milestone SLA',
        'Duplicate / overlapping works against State & PMGSY schemes',
        'Tender / single-bid procurement anomaly',
        'Eligibility & statutory compliance signal',
      ],
      exampleLabel: 'PROJECT SIGNAL (EARLY WARNING)',
      exampleTitle: 'Ward 17 Community Hall (Project P-1023)',
      exampleMetrics: [
        { label: 'Estimated Cost', value: '₹42.0 L' },
        { label: 'Comparable Baseline', value: '₹30.4 L' },
        { label: 'Deviation', value: '+38.2%', alert: true },
      ],
      exampleNote: 'STATUS: Requires Review (Early warning signal — not an automatic accusation)',
    },
    {
      id: '02',
      num: '02',
      title: 'EXPLAIN',
      subtitle: 'EXPLAINABLE REASONING',
      desc: 'Explain why a project was flagged with plain-language diagnostic rationales and PWD SoR percentile baselines.',
      bottomLabel: 'EXPLAINABLE REASONING',
      icon: Eye,
      summary:
        'Decomposes composite risk scores into transparent, cited factors so authorities understand why a project received an alert.',
      miniProcess: ['RISK SIGNAL', 'CONTRIBUTING FACTORS', 'EXPLANATION'],
      signalsTitle: 'WHY WAS THIS FLAGGED?',
      signalsList: [
        'Cost Factor: +38.2% variance vs PWD Schedule of Rates 2024-25',
        'Execution: 12 days behind expected milestone completion',
        'Financial vs Physical: 72% financial spent vs 48% physical progress',
        'Documentation: 1 mandatory compliance document pending',
      ],
      exampleLabel: 'DECOMPOSED RISK SCORE',
      exampleTitle: 'Composite Risk Index: 78 / 100',
      exampleMetrics: [
        { label: 'Cost Weight', value: '+32 pts' },
        { label: 'Delay Lag', value: '+26 pts' },
        { label: 'Doc Gap', value: '+20 pts', alert: true },
      ],
      exampleNote: 'Glass-box reasoning: every risk point is grounded in specific ledger vouchers and policy rules.',
    },
    {
      id: '03',
      num: '03',
      title: 'INVESTIGATE',
      subtitle: 'EVIDENCE & VERIFICATION',
      desc: 'Connect flags with corroborating evidence dossiers, treasury ledgers, and geotagged field survey photos.',
      bottomLabel: 'IMMUTABLE EVIDENCE DOCKET',
      icon: FileText,
      summary:
        'Corroborates cross-departmental documentation, treasury vouchers, contractor entity networks and geotagged field photos into an authoritative case docket.',
      miniProcess: ['FLAG', 'EVIDENCE', 'CROSS-CHECK', 'VERIFICATION'],
      signalsTitle: 'EVIDENCE CHECKLIST',
      signalsList: [
        'Technical Estimate: ✓ Available (TS-MH-PUN-2024-881)',
        'Tender Comparative Record: ✓ Available',
        'Payment Treasury Ledger: ✓ Available (Vouchers V-991 to V-994)',
        'Progress Photos: ✓ Available (EXIF Geotagged: 18.5204° N, 73.8567° E)',
        'Utilization Certificate: ⚠ Pending (GFR-12C Stage 2 overdue)',
      ],
      exampleLabel: 'MULTI-STREAM CROSS-CHECK',
      exampleTitle: 'Case Dossier: CASE-2026-0182',
      exampleMetrics: [
        { label: 'Evidence Streams', value: '4 Verified' },
        { label: 'Pending Docs', value: '1 Overdue' },
        { label: 'Status', value: 'Review Queue', alert: true },
      ],
      exampleNote: 'STATUS: Assigned to District Vigilance Officer with 14-day statutory turnaround SLA.',
    },
    {
      id: '04',
      num: '04',
      title: 'ACT',
      subtitle: 'HUMAN DECISION & RESOLUTION',
      desc: 'Enable an authorized human decision-maker to confirm findings, dismiss false positives, resolve, or escalate.',
      bottomLabel: 'AUTHORITATIVE HUMAN VERDICT',
      icon: CheckCircle2,
      summary:
        'Empowers designated district authorities to make informed decisions. AI assists the decision; authorized government officials remain responsible for final action.',
      miniProcess: ['VERIFIED SIGNAL', 'AUTHORITY REVIEW', 'HUMAN DECISION'],
      signalsTitle: 'POSSIBLE ADMINISTRATIVE OUTCOMES',
      signalsList: [
        '✓ VERIFIED (False Positive): Site-specific bedrock cost variance justified in writing',
        '⚠ REVIEW (Needs Evidence): Issue 14-day statutory notice to contractor under Rule 5.4',
        '⏸ FREEZE: Withhold 2nd installment disbursement pending physical inspection',
        '↗ ESCALATE: Initiate formal inquiry into contractor syndicate concentration',
      ],
      exampleLabel: 'HUMAN-IN-THE-LOOP MANDATE',
      exampleTitle: 'District Authority Action Protocol',
      exampleMetrics: [
        { label: 'Role', value: 'District Officer' },
        { label: 'Decision SLA', value: '14 Days' },
        { label: 'Audit Trail', value: 'Immutable', alert: false },
      ],
      exampleNote: 'AI assists the decision. Authorized officials remain responsible for the final action.',
    },
  ];

  const handleCardToggle = (id: string) => {
    setExpandedStage((prev) => (prev === id ? null : id));
  };

  return (
    <section className="bg-[#102F45] text-white py-20 sm:py-24 relative overflow-hidden border-b border-[#15324B]">
      {/* Subtle Grid Background Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#D99018_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
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

        {/* Continuous Pipeline Connector Bar */}
        <div className="relative hidden lg:block mb-6 px-10">
          <div className="relative h-1.5 w-full bg-[#183B54] rounded-full overflow-hidden border border-[#234D6C]">
            {/* Active Pathway Fill based on selection */}
            <div
              className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#D99018]/60 to-[#E5B45A] rounded-full transition-all duration-500 ease-out"
              style={{
                width:
                  expandedStage === '01'
                    ? '25%'
                    : expandedStage === '02'
                    ? '50%'
                    : expandedStage === '03'
                    ? '75%'
                    : expandedStage === '04'
                    ? '100%'
                    : '100%',
                opacity: expandedStage ? 0.9 : 0.35,
              }}
            />
          </div>

          {/* 4 Pipeline Node Markers */}
          <div className="absolute top-1/2 -translate-y-1/2 left-10 right-10 flex justify-between pointer-events-none">
            {stages.map((stg) => {
              const isSelected = expandedStage === stg.id;
              return (
                <div
                  key={stg.num}
                  className={`h-4 w-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                    isSelected
                      ? 'bg-[#D99018] border-white ring-4 ring-[#D99018]/40 scale-125'
                      : 'bg-[#102F45] border-[#234D6C]'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#234D6C]'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* 4 INLINE EXPANDING CARDS CONTAINER (Using Motion LayoutGroup) */}
        <LayoutGroup id="from-data-to-decision-pipeline">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-start">
            {stages.map((stage) => {
              const isExpanded = expandedStage === stage.id;
              const Icon = stage.icon;

              // Grid Span: When 1 card is expanded, it takes 6 cols (50%), others take 2 cols each (16.6%)
              // When collapsed, all 4 cards take 3 cols each (25%)
              const colSpanClass = isExpanded
                ? 'col-span-1 sm:col-span-2 lg:col-span-6'
                : expandedStage
                ? 'col-span-1 sm:col-span-1 lg:col-span-2'
                : 'col-span-1 sm:col-span-1 lg:col-span-3';

              return (
                <motion.div
                  layout
                  key={stage.id}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 28,
                    mass: 0.8,
                  }}
                  className={`${colSpanClass} transition-colors duration-200`}
                >
                  <div
                    tabIndex={0}
                    role="button"
                    aria-expanded={isExpanded}
                    aria-label={`${stage.title} - ${stage.subtitle}`}
                    onClick={() => handleCardToggle(stage.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCardToggle(stage.id);
                      }
                    }}
                    className={`rounded-[6px] border bg-[#183B54] p-5 flex flex-col justify-between shadow-card cursor-pointer transition-all duration-300 select-none outline-none focus-visible:ring-2 focus-visible:ring-[#D99018] ${
                      isExpanded
                        ? 'border-[#D99018] ring-2 ring-[#D99018]/30 bg-[#1A415E] shadow-2xl'
                        : 'border-[#234D6C] hover:border-[#D99018] hover:-translate-y-0.5'
                    }`}
                  >
                    {/* CARD HEADER: Anchored in place */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-extrabold font-mono text-[#D99018]">
                          {stage.num}
                        </span>
                        {isExpanded && (
                          <span className="text-[10px] font-mono font-bold text-[#E5B45A] bg-[#102F45] px-2 py-0.5 rounded border border-[#234D6C] uppercase">
                            {stage.subtitle}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <div
                          className={`p-2 rounded border transition-all duration-200 ${
                            isExpanded
                              ? 'bg-[#D99018] text-[#15324A] border-[#E5B45A] shadow-sm'
                              : 'bg-[#102F45] text-[#E5B45A] border-[#234D6C]'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>

                        {/* Close X control when expanded */}
                        {isExpanded && (
                          <button
                            type="button"
                            aria-label={`Collapse ${stage.title} details`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedStage(null);
                            }}
                            className="p-1 rounded bg-[#102F45] text-gray-300 hover:text-white hover:bg-[#234D6C] transition-colors border border-[#234D6C]"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* TITLE & DESCRIPTION */}
                    <div className="mt-3">
                      <h3 className="text-base font-bold text-white tracking-wide uppercase">
                        {stage.title}
                      </h3>

                      {!isExpanded && (
                        <p className="text-xs text-gray-300 leading-relaxed mt-1.5 line-clamp-3">
                          {stage.desc}
                        </p>
                      )}
                    </div>

                    {/* INLINE EXPANDED CONTENT (Only rendered when this card is active) */}
                    <AnimatePresence mode="wait">
                      {isExpanded && (
                        <motion.div
                          key="expanded-content"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                          className="mt-4 pt-4 border-t border-[#234D6C] space-y-4 text-xs"
                        >
                          {/* 1. Summary Explanation */}
                          <p className="text-xs text-gray-200 leading-relaxed font-normal bg-[#102F45] p-3 rounded-[4px] border border-[#234D6C]">
                            {stage.summary}
                          </p>

                          {/* 2. Mini Process Flow Visual */}
                          <div className="p-2.5 rounded bg-[#102F45] border border-[#234D6C] space-y-1.5">
                            <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider block">
                              INTERNAL PROCESS PIPELINE:
                            </span>
                            <div className="flex items-center flex-wrap gap-1.5 font-mono text-[10px]">
                              {stage.miniProcess.map((step, idx) => (
                                <React.Fragment key={step}>
                                  <span className="bg-[#183B54] text-[#E5B45A] px-2 py-0.5 rounded border border-[#234D6C] font-bold">
                                    {step}
                                  </span>
                                  {idx < stage.miniProcess.length - 1 && (
                                    <span className="text-gray-400">→</span>
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          {/* 3. Signals Checked / Why Flagged List */}
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-mono font-bold text-[#E5B45A] uppercase tracking-wider block">
                              {stage.signalsTitle}:
                            </span>
                            <div className="space-y-1 text-gray-300">
                              {stage.signalsList.map((sig, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-2 bg-[#102F45]/60 p-2 rounded border border-[#234D6C]/60 text-[11px] leading-snug"
                                >
                                  <Check className="h-3.5 w-3.5 text-[#2E8064] flex-shrink-0 mt-0.5" />
                                  <span>{sig}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 4. Realistic Project Signal Example */}
                          <div className="p-3 rounded bg-[#102F45] border border-[#234D6C] space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-mono font-bold text-[#E5B45A] uppercase flex items-center gap-1">
                                <Activity className="h-3 w-3" />
                                <span>{stage.exampleLabel}</span>
                              </span>
                            </div>

                            <strong className="text-xs text-white block">
                              {stage.exampleTitle}
                            </strong>

                            <div className="grid grid-cols-3 gap-2 font-mono text-[10px]">
                              {stage.exampleMetrics.map((met) => (
                                <div
                                  key={met.label}
                                  className="p-1.5 rounded bg-[#183B54] border border-[#234D6C] text-center"
                                >
                                  <span className="text-gray-400 block text-[9px]">{met.label}</span>
                                  <span
                                    className={`font-bold block mt-0.5 ${
                                      met.alert ? 'text-[#C94B4B]' : 'text-white'
                                    }`}
                                  >
                                    {met.value}
                                  </span>
                                </div>
                              ))}
                            </div>

                            <p className="text-[10px] text-gray-300 font-mono pt-1 italic">
                              {stage.exampleNote}
                            </p>
                          </div>

                          {/* 5. Collapse Trigger Button at Bottom */}
                          <div className="pt-2 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedStage(null);
                              }}
                              className="text-[11px] font-mono font-bold text-[#E5B45A] hover:text-white flex items-center gap-1 transition-colors"
                            >
                              <ChevronUp className="h-3.5 w-3.5" />
                              <span>Collapse Details ↑</span>
                            </button>

                            <span className="text-[10px] font-mono text-gray-400">
                              Stage {stage.num} of 04
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* COLLAPSED FOOTER (Only when not expanded) */}
                    {!isExpanded && (
                      <div className="mt-5 pt-3 border-t border-[#234D6C] text-[10px] font-mono font-bold text-[#E5B45A] flex items-center justify-between">
                        <span className="truncate">{stage.bottomLabel}</span>
                        <span className="flex items-center gap-1 text-[9px] font-sans font-bold uppercase group-hover:text-white transition-colors flex-shrink-0">
                          <span>Inspect</span>
                          <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </LayoutGroup>

        {/* Explanatory Pipeline Subtitle */}
        <div className="mt-8 text-center">
          <p className="text-[11px] font-mono text-gray-400 tracking-wide">
            ● CONTINUOUS INTELLIGENCE PIPELINE: <span className="text-[#E5B45A]">DETECT</span> → <span className="text-[#E5B45A]">EXPLAIN</span> → <span className="text-[#E5B45A]">INVESTIGATE</span> → <span className="text-[#E5B45A]">HUMAN DECISION</span> (CLICK ANY CARD TO EXPAND INLINE)
          </p>
        </div>

      </div>
    </section>
  );
}
