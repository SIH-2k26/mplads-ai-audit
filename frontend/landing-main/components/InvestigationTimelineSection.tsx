import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, FileText, UserCheck, Search, UploadCloud, MessageSquare, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

export function InvestigationTimelineSection() {
  const steps = [
    { num: '01', title: 'Anomaly Detected', desc: 'Real-time statistical or policy variance triggered.', icon: ShieldAlert },
    { num: '02', title: 'Risk Score Generated', desc: 'Composite index mapped against 9 risk vectors.', icon: Search },
    { num: '03', title: 'Evidence Collected', desc: 'Vouchers, photos, and SoR rates compiled.', icon: FileText },
    { num: '04', title: 'Officer Assigned', desc: 'Dispatched to Collector or Field Auditor queue.', icon: UserCheck },
    { num: '05', title: 'Field Inquiry', desc: 'On-site IQM verification and measurement check.', icon: UploadCloud },
    { num: '06', title: 'Officer Comments', desc: 'Statutory explanation recorded in docket.', icon: MessageSquare },
    { num: '07', title: 'Authoritative Verdict', desc: 'Confirm Issue, Dismiss, Resolve, or Escalate.', icon: CheckCircle2 },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#FAFAF9] border-b border-[#E5E3DC]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#002449] bg-[#002449]/10 px-3 py-1 rounded-full border border-[#002449]/30">
            CHAPTER 08 • DUE PROCESS PROTOCOL
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#002449] tracking-tight uppercase leading-tight font-sans">
            Investigate With <br />
            <span className="text-[#D89425]">Corroborated Evidence.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#6B6B6B] leading-relaxed">
            The platform provides complete traceability from the first anomalous signal to final administrative action.
          </p>
        </div>

        {/* 7-Step Timeline Horizontal Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-10">
          {steps.map((st, idx) => {
            const Icon = st.icon;

            return (
              <div
                key={st.title}
                className="rounded-[6px] border border-[#E5E3DC] bg-white p-4 shadow-card flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-extrabold text-[#D89425]">
                      {st.num}
                    </span>
                    <div className="p-1.5 rounded bg-[#FAFAF9] text-[#002449] border border-[#E5E3DC]">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-[#002449] mb-1 leading-tight">
                    {st.title}
                  </h4>

                  <p className="text-[11px] text-[#6B6B6B] leading-snug">
                    {st.desc}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-[#E5E3DC] text-[9px] font-mono text-[#6B6B6B]">
                  Step {st.num} of 07
                </div>
              </div>
            );
          })}
        </div>

        {/* Case CTA Banner */}
        <div className="rounded-[8px] border-2 border-[#002449] bg-white p-6 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#002449] uppercase tracking-wider">
              Explore Active Case Inquiries (CASE-2026-0182)
            </h3>
            <p className="text-xs text-[#6B6B6B] mt-0.5">
              Inspect corroborating evidence, peer rate benchmarks, and the authoritative human verdict panel.
            </p>
          </div>

          <Link to="/cases/CASE-2026-0182">
            <Button variant="default" size="sm" className="bg-[#002449] rounded-full text-white text-xs font-bold flex items-center gap-1.5 h-9 px-4 shadow-elevated flex-shrink-0">
              <span>Open Case Docket</span>
              <ArrowRight className="h-3.5 w-3.5 text-white/70" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
