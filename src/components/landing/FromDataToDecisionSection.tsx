import React from 'react';
import { Search, Eye, FileText, CheckCircle2, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { Card } from '../ui/card';

export function FromDataToDecisionSection() {
  const stages = [
    {
      num: '01',
      title: 'DETECT',
      desc: 'Identify anomalies across cost benchmarks, payment velocity, single-tender procurement and execution timelines.',
      bottomLabel: 'EARLY WARNING ENGINE',
      icon: Search,
    },
    {
      num: '02',
      title: 'EXPLAIN',
      desc: 'Explain why a project was flagged with plain-language diagnostic rationales and PWD SoR percentile baselines.',
      bottomLabel: 'EXPLAINABLE REASONING',
      icon: Eye,
    },
    {
      num: '03',
      title: 'INVESTIGATE',
      desc: 'Connect flags with corroborating evidence dossiers, treasury ledgers, and geotagged field survey photos.',
      bottomLabel: 'IMMUTABLE EVIDENCE DOCKET',
      icon: FileText,
    },
    {
      num: '04',
      title: 'ACT',
      desc: 'Enable an authorized human decision-maker to confirm findings, dismiss false positives, resolve, or escalate.',
      bottomLabel: 'AUTHORITATIVE HUMAN VERDICT',
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="bg-[#102F45] text-white py-20 sm:py-26 relative overflow-hidden border-b border-[#15324B]">
      {/* Subtle Grid Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#D99018_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14 space-y-3">
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

        {/* 4 Structured Institutional Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stages.map((s) => {
            const Icon = s.icon;

            return (
              <div
                key={s.num}
                className="group rounded-[6px] border border-[#234D6C] bg-[#183B54] p-5 flex flex-col justify-between shadow-card hover:border-[#D99018] transition-all duration-200 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-extrabold font-mono text-[#D99018]">
                      {s.num}
                    </span>
                    <div className="p-2 rounded bg-[#102F45] text-[#E5B45A] border border-[#234D6C] group-hover:bg-[#15324B] group-hover:text-white transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-wide uppercase mb-2">
                    {s.title}
                  </h3>

                  <p className="text-xs text-gray-300 leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-[#234D6C] text-[10px] font-mono font-bold text-[#E5B45A] flex items-center justify-between">
                  <span>{s.bottomLabel}</span>
                  <ArrowUpRight className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
