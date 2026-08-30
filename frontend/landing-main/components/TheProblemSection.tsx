import React from 'react';
import { ChevronRight, Layers, ArrowRight } from 'lucide-react';

export function TheProblemSection() {
  const lifecycleWords = [
    { num: '01', label: 'Recommendations' },
    { num: '02', label: 'Sanctions' },
    { num: '03', label: 'Procurement' },
    { num: '04', label: 'Execution' },
    { num: '05', label: 'Payments' },
    { num: '06', label: 'Progress' },
    { num: '07', label: 'Documents' },
    { num: '08', label: 'Completion' },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#F7F5F0] border-b border-[#E5E3DC]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="inline-block text-xs font-mono font-bold uppercase tracking-widest text-[#002449] bg-[#002449]/10 px-3 py-1 rounded-full border border-[#002449]/30">
            The Governance Challenge
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#002449] tracking-tight uppercase leading-tight">
            Public development generates an enormous amount of data.
          </h2>
        </div>

        {/* Structured 8-Stage Lifecycle Stream Grid */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {lifecycleWords.map((item, i) => (
            <div
              key={item.label}
              className="bg-white rounded-[4px] border border-[#E5E3DC] p-3 text-center shadow-subtle hover:border-[#002449] transition-all flex flex-col justify-between h-24"
            >
              <span className="text-[10px] font-mono font-bold text-[#002449] block">
                {item.num}
              </span>
              <span className="text-xs font-bold text-[#002449] leading-tight">
                {item.label}
              </span>
              <div className="flex justify-center text-[#98A2B3] pt-1">
                {i < lifecycleWords.length - 1 ? (
                  <ChevronRight className="h-3.5 w-3.5" />
                ) : (
                  <span className="text-[9px] font-mono font-bold text-[#2F7658]">Asset</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* The Core Insight Punchline */}
        <div className="mt-12 max-w-3xl mx-auto p-6 sm:p-8 rounded-[8px] border-2 border-[#002449] bg-white shadow-card text-center space-y-3">
          <h3 className="text-xl sm:text-2xl font-bold text-[#002449]">
            The challenge isn't collecting data. <br />
            <span className="text-[#002449]">It's connecting the signals in real time.</span>
          </h3>

          <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed max-w-2xl mx-auto">
            Traditional administrative oversight examines projects months or years after expenditures have already been settled. Sanchay acts as a continuous intelligence layer across the entire lifecycle — identifying cost deviations, milestone deceleration, and contractor cartelization before they mature into irrevocable audit findings.
          </p>
        </div>
      </div>
    </section>
  );
}
