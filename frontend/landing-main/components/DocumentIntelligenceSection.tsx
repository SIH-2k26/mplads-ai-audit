import React from 'react';
import { FileText, ArrowRight, CheckCircle2, Cpu, Database, ScanLine } from 'lucide-react';

export function DocumentIntelligenceSection() {
  const extractedEntities = [
    { label: 'Work Title', value: 'Construction of Community Hall & Skill Centre' },
    { label: 'Sanction Amount', value: '₹42,00,000 (INR Forty-Two Lakhs Only)' },
    { label: 'Sanction Order No.', value: 'PUN/MPLADS/2025/441-A' },
    { label: 'Implementing Agency', value: 'Pune Zilla Parishad (Rural Works Div)' },
    { label: 'Awarded Contractor', value: 'M/s Sahyadri Buildtech Infrastructure' },
    { label: 'Sanction Date', value: '18 June 2025' },
    { label: 'SLA Deadline', value: '17 June 2026 (12 Months)' },
    { label: 'GPS Location', value: '18.5204° N, 73.8567° E (Ward 17)' },
  ];

  return (
    <section className="py-20 sm:py-28 bg-white border-b border-[#DDE2E5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D89425] bg-[#D89425]/10 px-3 py-1 rounded-full border border-[#D89425]/30">
            CHAPTER 07 • MULTIMODAL INGESTION
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#16324A] tracking-tight uppercase leading-tight font-sans">
            From PDF Documents to <br />
            <span className="text-[#D89425]">Structured Intelligence.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#66727D] leading-relaxed">
            Unstructured sanction letters, measurement books, and treasury vouchers are automatically digitized into verified audit entities.
          </p>
        </div>

        {/* Visual Pipeline: PDF Input -> OCR/NLP -> Structured Entities */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Simulated Government PDF Artifact */}
          <div className="lg:col-span-5 rounded-[6px] border border-[#DDE2E5] bg-[#F7F8F6] p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between border-b border-[#DDE2E5] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#D89425]" />
                <span className="text-xs font-bold font-mono text-[#16324A]">
                  SANCTION_ORDER_441.PDF
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#287A5A] font-bold bg-emerald-50 px-2 py-0.5 rounded border border-[#287A5A]/30">
                ● OCR Parsed
              </span>
            </div>

            <div className="space-y-2 text-[11px] text-[#66727D] font-serif p-4 bg-white rounded border border-[#DDE2E5] shadow-xs">
              <div className="text-center font-bold text-black border-b pb-1 text-[10px]">
                GOVERNMENT OF MAHARASHTRA • DISTRICT COLLECTOR OFFICE PUNE
              </div>
              <p className="italic">
                "Sanction is hereby accorded under MPLADS Scheme 2023 for the work of Construction of Community Hall & Skill Centre at Hadapsar Ward 17 for an amount of ₹42,00,000/- to be executed by Pune Zilla Parishad..."
              </p>
              <div className="pt-2 text-[9px] font-mono text-[#98A2B3] flex justify-between">
                <span>Ref: PUN/MPLADS/2025/441-A</span>
                <span>Date: 18/06/2025</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#66727D] font-mono pt-1">
              <span>Layout & Table Detection</span>
              <span>100% Deterministic Extraction</span>
            </div>
          </div>

          {/* Center Connector */}
          <div className="hidden lg:flex lg:col-span-1 justify-center">
            <div className="h-10 w-10 rounded-full bg-[#16324A] text-white flex items-center justify-center shadow-card">
              <ArrowRight className="h-5 w-5 text-[#E5B45A]" />
            </div>
          </div>

          {/* Right: Extracted Structured Schema */}
          <div className="lg:col-span-6 rounded-[8px] border-2 border-[#16324A] bg-white p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#DDE2E5] pb-2.5">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[#D89425]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#16324A]">
                  Extracted Project Schema
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#66727D]">
                Confidence: 99.4%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {extractedEntities.map((e, idx) => (
                <div key={idx} className="p-2 rounded bg-[#F7F8F6] border border-[#DDE2E5]">
                  <span className="text-[9px] text-[#66727D] uppercase font-mono block">
                    {e.label}
                  </span>
                  <strong className="text-xs text-[#16324A] font-semibold block truncate">
                    {e.value}
                  </strong>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#DDE2E5] flex items-center justify-between text-[11px] text-[#287A5A] font-semibold">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Validated against District Treasury Ledgers
              </span>
              <span className="font-mono text-[#66727D] text-[10px]">SHA-256 Ledger Hash Verified</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
