import React from 'react';
import { BookOpen, ShieldCheck, FileCheck, Scale, Clock, FolderGit2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from './ui/badge';

export function GovernanceRulesSection() {
  const rules = [
    {
      title: 'ELIGIBILITY',
      ruleCode: 'MPLADS §2.3',
      desc: 'Asset recommendation verified against permissible public sector categories and prohibited private work lists.',
      status: 'AUTOMATED CHECK',
      icon: ShieldCheck,
      statusType: 'success',
    },
    {
      title: 'PROCUREMENT',
      ruleCode: 'GFR 2017 R-149',
      desc: 'Tender conditions, e-procurement publication periods (21 days), and single-bidder bypass validations.',
      status: 'MONITORED',
      icon: Scale,
      statusType: 'warning',
    },
    {
      title: 'SANCTION LIMITS',
      ruleCode: 'MPLADS §4.1',
      desc: 'Technical sanction limits, annual parliamentary quota ceilings (₹5.00 Cr), and district allocation rules.',
      status: 'ENFORCED',
      icon: FileCheck,
      statusType: 'success',
    },
    {
      title: 'UTILIZATION',
      ruleCode: 'GFR 12-C',
      desc: 'Mandatory furnishing of Utilisation Certificates before subsequent fund installment disbursements.',
      status: 'CRITICAL AUDIT',
      icon: AlertCircle,
      statusType: 'danger',
    },
    {
      title: 'TIMELINE & SLAs',
      ruleCode: 'MPLADS §5.4',
      desc: 'Timebound sanction (45 days) and execution milestones (12 months) with predictive delay alerts.',
      status: 'SLA TRACKER',
      icon: Clock,
      statusType: 'warning',
    },
    {
      title: 'DOCUMENTATION',
      ruleCode: 'CVC CIR-09/21',
      desc: 'Digitally signed measurement books, geotagged site inspection photo albums, and completion certs.',
      status: 'VERIFIED',
      icon: FolderGit2,
      statusType: 'success',
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-white border-b border-[#DDE2E5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D89425] bg-[#D89425]/10 px-3 py-1 rounded-full border border-[#D89425]/30">
            CHAPTER 05 • STATUTORY CODIFICATION
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#16324A] tracking-tight uppercase leading-tight font-sans">
            Rules Should Become <br />
            <span className="text-[#D89425]">Machine-Readable.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#66727D] leading-relaxed">
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
                className="rounded-[6px] border border-[#DDE2E5] bg-[#F7F8F6] p-5 shadow-subtle hover:border-[#16324A] hover:bg-white transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-[#D89425] bg-[#D89425]/10 px-2 py-0.5 rounded border border-[#D89425]/30">
                      {r.ruleCode}
                    </span>
                    <div className="p-1.5 rounded bg-white border border-[#DDE2E5] text-[#16324A]">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-[#16324A] uppercase tracking-wide mb-1.5">
                    {r.title}
                  </h3>

                  <p className="text-xs text-[#66727D] leading-relaxed">
                    {r.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#DDE2E5] flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    r.statusType === 'danger'
                      ? 'bg-red-50 text-[#C74747] border border-[#C74747]/30'
                      : r.statusType === 'warning'
                      ? 'bg-amber-50 text-[#C98220] border border-[#C98220]/30'
                      : 'bg-emerald-50 text-[#287A5A] border border-[#287A5A]/30'
                  }`}>
                    {r.status}
                  </span>
                  <span className="text-[10px] text-[#66727D] font-mono">Codified Logic</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
