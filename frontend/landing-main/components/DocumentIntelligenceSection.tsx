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
    <section className="py-20 sm:py-28 bg-transparent border-b border-[#E5E3DC] font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#002449] bg-[#002449]/10 px-3.5 py-1 rounded-full border border-[#002449]/30 inline-block">
            CHAPTER 07 • MULTIMODAL INGESTION
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#002449] tracking-tight uppercase leading-tight font-sans">
            From PDF Documents to <br />
            <span className="text-[#D99018]">Structured Intelligence.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#6B6B6B] leading-relaxed font-sans font-normal">
            Unstructured sanction letters, measurement books, and treasury vouchers are automatically digitized into verified audit entities.
          </p>
        </div>

        {/* Visual Pipeline: PDF Input -> OCR/NLP -> Structured Entities */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Simulated Government PDF Artifact */}
          <div className="lg:col-span-5 rounded-[20px] border border-[#E5E3DC] bg-white p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#EAE8E2] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#002449]" />
                <span className="text-xs font-bold font-mono text-[#002449]">
                  SANCTION_ORDER_441.PDF
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                ● OCR Parsed
              </span>
            </div>

            <div className="space-y-2 text-xs text-[#0E0E0E] font-serif p-4 bg-[#F1F0EC] rounded-[14px] border border-[#E5E3DC] shadow-2xs">
              <div className="text-center font-bold text-[#0E0E0E] border-b border-[#EAE8E2] pb-1.5 text-[10px] font-sans">
                GOVERNMENT OF MAHARASHTRA • DISTRICT COLLECTOR OFFICE PUNE
              </div>
              <p className="italic text-[11px] text-[#6B6B6B] leading-relaxed">
                "Sanction is hereby accorded under MPLADS Scheme 2023 for the work of Construction of Community Hall & Skill Centre at Hadapsar Ward 17 for an amount of ₹42,00,000/- to be executed by Pune Zilla Parishad..."
              </p>
              <div className="pt-2 text-[9px] font-mono text-[#6B6B6B] flex justify-between border-t border-[#EAE8E2]">
                <span>Ref: PUN/MPLADS/2025/441-A</span>
                <span>Date: 18/06/2025</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#6B6B6B] font-mono pt-1">
              <span>Layout & Table Detection</span>
              <span className="font-semibold text-[#002449]">100% Deterministic Extraction</span>
            </div>
          </div>

          {/* Center Connector */}
          <div className="hidden lg:flex lg:col-span-1 justify-center">
            <div className="h-10 w-10 rounded-full bg-[#002449] text-white flex items-center justify-center shadow-md">
              <ArrowRight className="h-5 w-5 text-white/90" />
            </div>
          </div>

          {/* Right: Extracted Structured Schema */}
          <div className="lg:col-span-6 rounded-[20px] border border-[#E5E3DC] bg-white p-6 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#EAE8E2] pb-2.5">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[#002449]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#002449] font-sans">
                  Extracted Project Schema
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Confidence: 99.4%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {extractedEntities.map((e, idx) => (
                <div key={idx} className="p-3 rounded-[12px] bg-white border border-[#E5E3DC] shadow-2xs">
                  <span className="text-[9px] text-[#6B6B6B] uppercase font-mono block font-bold">
                    {e.label}
                  </span>
                  <strong className="text-xs text-[#002449] font-semibold block truncate mt-0.5">
                    {e.value}
                  </strong>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#EAE8E2] flex items-center justify-between text-[11px] text-emerald-700 font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Validated against District Treasury Ledgers
              </span>
              <span className="font-mono text-[#6B6B6B] text-[10px]">SHA-256 Verified</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
