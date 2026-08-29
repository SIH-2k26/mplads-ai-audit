import React, { useState } from 'react';
import {
  Search,
  Eye,
  FileText,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { DetailModal, IntelligenceModalType } from './dashboard/modal/DetailModal';
import { DetectModal } from './dashboard/modal/DetectModal';
import { ExplainModal } from './dashboard/modal/ExplainModal';
import { InvestigateModal } from './dashboard/modal/InvestigateModal';
import { ActModal } from './dashboard/modal/ActModal';

interface StageBlock {
  id: IntelligenceModalType;
  num: string;
  title: string;
  subtitle: string;
  desc: string;
  bottomLabel: string;
  icon: React.ElementType;
  modalCategoryNumber: string;
  modalCategoryLabel: string;
  modalTitle: string;
  modalSubtitle: string;
}

export function FromDataToDecisionSection() {
  const [activeModal, setActiveModal] = useState<IntelligenceModalType | null>(null);

  const stages: StageBlock[] = [
    {
      id: 'detect',
      num: '01',
      title: 'DETECT',
      subtitle: 'EARLY WARNING ENGINE',
      desc: 'Identify anomalies across cost benchmarks, payment velocity, single-tender procurement and execution timelines.',
      bottomLabel: 'EARLY WARNING ENGINE',
      icon: Search,
      modalCategoryNumber: '01',
      modalCategoryLabel: 'EARLY WARNING ENGINE',
      modalTitle: 'Early Warning Detection',
      modalSubtitle: 'How the platform identifies potential MPLADS risks before they become audit findings.',
    },
    {
      id: 'explain',
      num: '02',
      title: 'EXPLAIN',
      subtitle: 'EXPLAINABLE REASONING',
      desc: 'Explain why a project was flagged with plain-language diagnostic rationales and PWD SoR percentile baselines.',
      bottomLabel: 'EXPLAINABLE REASONING',
      icon: Eye,
      modalCategoryNumber: '02',
      modalCategoryLabel: 'EXPLAINABLE REASONING',
      modalTitle: 'Risk Explanation & Diagnostics',
      modalSubtitle: 'Explain why a project received a particular risk score using decomposed contributing factors.',
    },
    {
      id: 'investigate',
      num: '03',
      title: 'INVESTIGATE',
      subtitle: 'EVIDENCE & VERIFICATION',
      desc: 'Connect flags with corroborating evidence dossiers, treasury ledgers, and geotagged field survey photos.',
      bottomLabel: 'IMMUTABLE EVIDENCE DOCKET',
      icon: FileText,
      modalCategoryNumber: '03',
      modalCategoryLabel: 'EVIDENCE & VERIFICATION',
      modalTitle: 'Investigation Workspace & Evidence Docket',
      modalSubtitle: 'Multi-source cross-system evidence reconciliation for field officers and vigilance auditors.',
    },
    {
      id: 'act',
      num: '04',
      title: 'ACT',
      subtitle: 'HUMAN DECISION & RESOLUTION',
      desc: 'Enable an authorized human decision-maker to confirm findings, dismiss false positives, resolve, or escalate.',
      bottomLabel: 'AUTHORITATIVE HUMAN VERDICT',
      icon: CheckCircle2,
      modalCategoryNumber: '04',
      modalCategoryLabel: 'HUMAN DECISION SUPPORT',
      modalTitle: 'Recommended Action Protocol',
      modalSubtitle: 'AI assists anomaly identification; authorized government officers record final statutory actions.',
    },
  ];

  const currentStage = stages.find((s) => s.id === activeModal);

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
            <div className="absolute top-0 bottom-0 left-0 w-full bg-gradient-to-r from-[#D99018]/60 via-[#E5B45A] to-[#D99018]/60 opacity-60 rounded-full" />
          </div>

          {/* 4 Pipeline Node Markers */}
          <div className="absolute top-1/2 -translate-y-1/2 left-10 right-10 flex justify-between pointer-events-none">
            {stages.map((stg) => (
              <div
                key={stg.num}
                className="h-4 w-4 rounded-full border-2 bg-[#102F45] border-[#D99018] flex items-center justify-center shadow-xs"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#E5B45A]" />
              </div>
            ))}
          </div>
        </div>

        {/* 4 NON-EXPANDING CARDS IN A STABLE 4-COLUMN GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {stages.map((stage) => {
            const Icon = stage.icon;

            return (
              <div
                key={stage.id}
                tabIndex={0}
                role="button"
                aria-label={`Open ${stage.title} detail modal`}
                onClick={() => setActiveModal(stage.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveModal(stage.id);
                  }
                }}
                className="group rounded-[6px] border border-[#234D6C] bg-[#183B54] p-5 flex flex-col justify-between shadow-card hover:border-[#D99018] hover:-translate-y-1 transition-all duration-200 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[#D99018]"
              >
                <div>
                  {/* CARD HEADER */}
                  <div className="flex items-start justify-between">
                    <span className="text-2xl font-extrabold font-mono text-[#D99018]">
                      {stage.num}
                    </span>

                    <div className="p-2 rounded border bg-[#102F45] text-[#E5B45A] border-[#234D6C] group-hover:border-[#D99018] group-hover:bg-[#D99018] group-hover:text-[#15324A] transition-all duration-200">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  {/* TITLE & DESCRIPTION */}
                  <div className="mt-3 space-y-1">
                    <span className="text-[9px] font-mono font-bold text-[#E5B45A] uppercase tracking-wider block">
                      {stage.subtitle}
                    </span>
                    <h3 className="text-base font-bold text-white tracking-wide uppercase">
                      {stage.title}
                    </h3>
                    <p className="text-xs text-gray-300 leading-relaxed line-clamp-3 pt-1">
                      {stage.desc}
                    </p>
                  </div>
                </div>

                {/* CARD FOOTER */}
                <div className="mt-6 pt-3 border-t border-[#234D6C] text-[10px] font-mono font-bold text-[#E5B45A] flex items-center justify-between">
                  <span className="truncate">{stage.bottomLabel}</span>
                  <span className="flex items-center gap-1 text-[9px] font-sans font-bold uppercase text-gray-300 group-hover:text-white transition-colors flex-shrink-0">
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
            ● CONTINUOUS INTELLIGENCE PIPELINE: <span className="text-[#E5B45A]">DETECT</span> → <span className="text-[#E5B45A]">EXPLAIN</span> → <span className="text-[#E5B45A]">INVESTIGATE</span> → <span className="text-[#E5B45A]">ACT</span> (CLICK ANY CARD TO INSPECT DETAIL DOSSIER)
          </p>
        </div>
      </div>

      {/* REUSABLE DETAIL MODAL OVERLAY (Position Fixed, Z-Index 50) */}
      <DetailModal
        isOpen={activeModal !== null}
        onClose={() => setActiveModal(null)}
        categoryNumber={currentStage?.modalCategoryNumber}
        categoryLabel={currentStage?.modalCategoryLabel}
        title={currentStage?.modalTitle || ''}
        subtitle={currentStage?.modalSubtitle}
      >
        {activeModal === 'detect' && <DetectModal onClose={() => setActiveModal(null)} />}
        {activeModal === 'explain' && <ExplainModal onClose={() => setActiveModal(null)} />}
        {activeModal === 'investigate' && <InvestigateModal onClose={() => setActiveModal(null)} />}
        {activeModal === 'act' && <ActModal onClose={() => setActiveModal(null)} />}
      </DetailModal>
    </section>
  );
}
