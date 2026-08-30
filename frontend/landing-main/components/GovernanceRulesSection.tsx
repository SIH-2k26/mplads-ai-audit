import React from 'react';
import { Scale, FileCheck2, ShieldBan, FileSpreadsheet, Lock, AlertOctagon } from 'lucide-react';

export function GovernanceRulesSection() {
  const rules = [
    {
      ruleCode: 'RULE §4.2',
      title: 'Prohibited Work Check',
      desc: 'Machine check against commercial assets, private trusts, places of worship, or unauthorized land acquisitions.',
      status: 'STATUTORY PROHIBITION',
      statusType: 'danger',
      icon: ShieldBan,
    },
    {
      ruleCode: 'RULE §3.2',
      title: 'SC / ST Area Quota Focus',
      desc: 'Mandatory 15% allocation for SC and 7.5% for ST inhabited areas automatically verified per Parliamentary constituency.',
      status: 'MANDATORY ALLOCATION',
      statusType: 'warning',
      icon: Scale,
    },
    {
      ruleCode: 'RULE §5.4',
      title: 'Cost Benchmark Verification',
      desc: 'Engineering estimate rate variance check against local State PWD Schedule of Rates (SoR) before work order release.',
      status: 'PRE-SANCTION AUDIT',
      statusType: 'info',
      icon: FileCheck2,
    },
    {
      ruleCode: 'RULE §6.1',
      title: 'Procurement Integrity & CVC Rules',
      desc: 'Single-bidder tender exceptions, compressed notice periods, and contractor rotation verified across active district works.',
      status: 'PROCUREMENT AUDIT',
      statusType: 'danger',
      icon: Lock,
    },
    {
      ruleCode: 'RULE §7.1',
      title: 'GFR-12C UC Mandate',
      desc: 'Second installment disbursement blocked until Utilization Certificate (UC) for first installment is audited and uploaded.',
      status: 'DISBURSEMENT GATE',
      statusType: 'warning',
      icon: FileSpreadsheet,
    },
    {
      ruleCode: 'RULE §8.3',
      title: 'Geospatial Work Duplication',
      desc: 'Geographic proximity collision check against PMGSY, Smart Cities, and State road databases to prevent double-funding.',
      status: 'CROSS-SCHEME AUDIT',
      statusType: 'danger',
      icon: AlertOctagon,
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-white border-b border-[#E5E3DC] font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#002449] bg-[#002449]/10 px-3.5 py-1 rounded-full border border-[#002449]/30 inline-block">
            CHAPTER 05 • STATUTORY CODIFICATION
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#002449] tracking-tight uppercase leading-tight font-sans">
            Rules Should Become <br />
            <span className="text-[#D99018]">Machine-Readable.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#6B6B6B] leading-relaxed font-sans font-normal">
            Codifying the MPLADS Revised Guidelines 2023, General Financial Rules (GFR 2017), and CVC circulars into deterministic evaluation logic.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rules.map((r) => {
            const Icon = r.icon;

            return (
              <div
                key={r.title}
                className="rounded-[20px] border border-[#E5E3DC] bg-[#F1F0EC] p-6 shadow-2xs hover:border-[#002449] hover:bg-white hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-[#002449] bg-white px-2.5 py-1 rounded-full border border-[#E5E3DC]">
                      {r.ruleCode}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white border border-[#E5E3DC] text-[#002449] flex items-center justify-center">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-[#0E0E0E] uppercase tracking-wide mb-1.5 font-sans">
                    {r.title}
                  </h3>

                  <p className="text-xs text-[#6B6B6B] leading-relaxed font-sans">
                    {r.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#EAE8E2] flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                    r.statusType === 'danger'
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : r.statusType === 'warning'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {r.status}
                  </span>
                  <span className="text-[10px] text-[#6B6B6B] font-mono">Codified Logic</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
