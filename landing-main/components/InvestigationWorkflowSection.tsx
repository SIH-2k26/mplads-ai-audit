import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, FileText, BookOpen, TrendingUp, CheckSquare, ArrowRight, CheckCircle2, XCircle, AlertCircle, RefreshCw, ArrowUpRight } from 'lucide-react';
import { Button } from './ui/button';

export function InvestigationWorkflowSection() {
  const steps = [
    { name: 'ALERT', icon: ShieldAlert, label: 'Risk Diagnostic Trigger' },
    { name: 'EVIDENCE', icon: FileText, label: 'Document & Ledger Dossier' },
    { name: 'RULE', icon: BookOpen, label: 'MPLADS Guideline Citation' },
    { name: 'COMPARISON', icon: TrendingUp, label: 'Statistical Peer Percentile' },
    { name: 'INVESTIGATION', icon: CheckSquare, label: 'Field Inquiry & Subpoena' },
    { name: 'HUMAN VERDICT', icon: CheckCircle2, label: 'Authoritative Decision' },
  ];

  const verdicts = [
    { label: 'Confirmed Issue', desc: 'SLA or SoR rate violation verified.', icon: AlertCircle, color: 'text-[#B44343] bg-red-50 border-[#B44343]/30' },
    { label: 'Dismissed False Positive', desc: 'Legitimate terrain factor justified.', icon: XCircle, color: 'text-[#2F7658] bg-emerald-50 border-[#2F7658]/30' },
    { label: 'Insufficient Evidence', desc: 'On-site IQM field audit ordered.', icon: AlertCircle, color: 'text-[#B7791F] bg-amber-50 border-[#B7791F]/30' },
    { label: 'Resolved / Rectified', desc: 'Missing UC furnished & ledger reconciled.', icon: RefreshCw, color: 'text-[#2F7658] bg-emerald-50 border-[#2F7658]/30' },
    { label: 'Escalated to Vigilance', desc: 'Contractor cartel referred to State cell.', icon: ArrowUpRight, color: 'text-[#7E57C2] bg-purple-50 border-[#7E57C2]/30' },
  ];

  return (
    <section id="investigation" className="py-24 bg-white border-b border-[#D9D5CC]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#C98219] bg-[#C98219]/10 px-3 py-1 rounded-full border border-[#C98219]/30">
            Due Process & Governance
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#18324A] tracking-tight uppercase">
            The Alert-to-Investigation Protocol
          </h2>
          <p className="text-sm sm:text-base text-[#667085] leading-relaxed">
            AI never declares fraud as an autonomous conclusion. The platform evidences anomalies and structures rigorous inquiry workflows for human authorities.
          </p>
        </div>

        {/* Horizontal Visual Flow */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
          {steps.map((st, idx) => {
            const Icon = st.icon;

            return (
              <div
                key={st.name}
                className="p-4 rounded-[6px] border border-[#D9D5CC] bg-[#FAFAF7] text-center flex flex-col justify-between"
              >
                <div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#18324A] text-white mx-auto mb-2">
                    <Icon className="h-4 w-4 text-[#E7A943]" />
                  </div>
                  <span className="text-[10px] font-mono text-[#667085] font-bold block">STEP 0{idx + 1}</span>
                  <h4 className="text-xs font-bold text-[#18324A] mt-0.5">{st.name}</h4>
                </div>
                <p className="text-[10px] text-[#667085] mt-2 pt-2 border-t border-[#EDE8DE]">
                  {st.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Authoritative Human Verdict Options Strip */}
        <div className="p-6 sm:p-8 rounded-[8px] border-2 border-[#18324A] bg-[#FAFAF7]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDE8DE] pb-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-[#18324A] uppercase tracking-wider">
                Authoritative Human Verdict Options
              </h3>
              <p className="text-xs text-[#667085]">
                Only designated District Collectors and Vigilance Officers record statutory verdicts
              </p>
            </div>
            <Link to="/cases">
              <Button variant="default" size="sm" className="text-xs font-bold flex items-center gap-1.5">
                <span>View Open Case Inquiries</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {verdicts.map((v) => {
              const Icon = v.icon;

              return (
                <div
                  key={v.label}
                  className={`p-3.5 rounded-[4px] border ${v.color} space-y-1`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <Icon className="h-3.5 w-3.5" />
                    <span>{v.label}</span>
                  </div>
                  <p className="text-[11px] text-[#1D2939] leading-snug">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
