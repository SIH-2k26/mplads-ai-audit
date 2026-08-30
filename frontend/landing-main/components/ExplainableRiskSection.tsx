import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, ChevronRight, Activity, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { getRiskColorClass } from '../utils/utils';

export function ExplainableRiskSection() {
  const riskBars = [
    { label: 'Cost Deviation & SoR Benchmark', score: 88, desc: '+38.2% above peer median' },
    { label: 'Financial vs Physical Mismatch', score: 92, desc: '92.5% spent vs 31.0% physical' },
    { label: 'Procurement / Tender Bypass', score: 79, desc: 'Bid timing & single quotation flag' },
    { label: 'Contractor Cartel Concentration', score: 84, desc: '4 of 6 block tenders awarded to 1 firm' },
    { label: 'Geospatial Duplicate Similarity', score: 74, desc: '74% overlap with 2024 ZP hall' },
    { label: 'Milestone Delay SLA Probability', score: 74, desc: '+78 days delay beyond baseline' },
  ];

  return (
    <section className="py-24 bg-white border-b border-[#E5E3DC]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#002449] bg-[#002449]/10 px-3 py-1 rounded-full border border-[#002449]/30">
            Explainable AI (XAI)
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#002449] tracking-tight uppercase">
            Don't Just Show the Risk. Explain It.
          </h2>
          <p className="text-sm sm:text-base text-[#6B6B6B] leading-relaxed">
            The platform never outputs an opaque risk number. Every diagnostic score is accompanied by plain-language rationales, statistical peer percentiles, and auditable documentary evidence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left: Decomposed 9-Vector Risk Fingerprint */}
          <Card className="flex flex-col justify-between">
            <CardHeader className="bg-[#FAFAF9]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-[#002449]" />
                  <CardTitle className="text-xs uppercase font-bold text-[#002449]">
                    Multi-Vector Risk Deconstruction
                  </CardTitle>
                </div>
                <Badge variant="critical">Composite Score: 86 / 100</Badge>
              </div>
              <CardDescription>
                Decomposed anomaly factors for Community Hall (P-1023)
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-6">
              {riskBars.map((bar, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#002449]">{bar.label}</span>
                    <span className="font-mono font-bold text-[#B44343] text-[11px]">
                      {bar.score} / 100
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#F1F0EC] rounded-[2px] overflow-hidden">
                    <div
                      className="h-full bg-[#B44343] rounded-[2px] transition-all duration-500"
                      style={{ width: `${bar.score}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#6B6B6B] font-mono block">
                    {bar.desc}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Right: "Why Was This Flagged?" Plain Language Explanations */}
          <Card className="border-l-4 border-l-[#002449] flex flex-col justify-between">
            <CardHeader className="bg-[#FAFAF9]">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-[#002449]" />
                <CardTitle className="text-xs uppercase font-bold text-[#002449]">
                  Plain-Language Diagnostic Rationales
                </CardTitle>
              </div>
              <CardDescription>
                Auditable explanations grounded in PWD Schedule of Rates and State Treasury ledgers
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-6 text-xs">
              <div className="space-y-3">
                {[
                  {
                    title: 'Cost Benchmark Deviation (+38.2%)',
                    text: 'Sanctioned at ₹1,750/sq.ft compared against prevailing PWD District Schedule of Rates baseline of ₹1,270/sq.ft across 24 comparable community hall works in western Maharashtra.',
                  },
                  {
                    title: 'Disbursement vs Physical Milestone Gap (+61.5%)',
                    text: '92.5% of total sanctioned funds have been disbursed from the district treasury, whereas verified on-ground physical execution is currently measured at only 31.0% (foundation plinth stage).',
                  },
                  {
                    title: 'Contractor Concentration Anomaly (68.4%)',
                    text: 'The awarded vendor has secured 4 out of the last 6 civil construction contracts in Haveli Block within the preceding 12-month period, exceeding the CVC 40% cartelization alert threshold.',
                  },
                  {
                    title: 'Geographic Duplicate Work Similarity (74%)',
                    text: 'High geospatial coordinate overlap and structural similarity with Zilla Parishad community center sanctioned at Survey 44/1 in 2024.',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded bg-[#FAFAF9] border border-[#F1F0EC] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#002449] text-xs">
                      <ChevronRight className="h-3.5 w-3.5 text-[#002449] flex-shrink-0" />
                      <span>{item.title}</span>
                    </div>
                    <p className="text-[11px] text-[#6B6B6B] leading-relaxed pl-5">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded bg-amber-50 border border-[#B7791F]/30 text-[11px] text-[#B7791F] font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>AI diagnostic rationales guide human inquiry; verdicts remain the sole prerogative of the District Authority.</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
