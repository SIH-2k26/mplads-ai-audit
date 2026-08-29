import React, { useState } from 'react';
import { Database, FileInput, CheckCheck, Cpu, ShieldAlert, FileText, CheckCircle2, ChevronRight, Info } from 'lucide-react';
import { Dialog } from './ui/dialog';

interface StageDetail {
  num: string;
  title: string;
  desc: string;
  inputs: string[];
  processing: string[];
  outputs: string[];
  ruleRef: string;
}

export function IntelligenceFlowSection() {
  const [selectedStage, setSelectedStage] = useState<StageDetail | null>(null);

  const stages: StageDetail[] = [
    {
      num: '01',
      title: 'Data Sources',
      desc: 'Treasury vouchers, e-Tenders, IQM photos & PWD SoR',
      inputs: ['District Treasury Vouchers', 'GeM / e-Procurement Portals', 'MoSPI MPLADS Central DB', 'State PWD Schedule of Rates'],
      processing: ['Automated scheduled delta extraction', 'Checksum and cryptographic hash validation', 'MIME-type & PDF schema verification'],
      outputs: ['Normalized immutable raw payload', 'Event stream ingested with ingestion timestamp'],
      ruleRef: 'MPLADS Guidelines 2023 §3.1',
    },
    {
      num: '02',
      title: 'Ingestion & OCR',
      desc: 'Automated ledger sync & sanction order OCR parsing',
      inputs: ['Scanned PDF sanction letters', 'Contractor payment bills', 'Measurement book uploads'],
      processing: ['OCR bounding-box detection', 'Regex & NLP table entity extraction', 'Signatory and seal verification'],
      outputs: ['Structured JSON document metadata', 'Key-value entity dictionary'],
      ruleRef: 'GFR 2017 Rule 149',
    },
    {
      num: '03',
      title: 'Normalization',
      desc: 'Standardized rate baselines & GIS coordinate linkage',
      inputs: ['Raw work descriptions', 'Unmapped GPS points', 'Contractor GST numbers'],
      processing: ['Fuzzy semantic category matching', 'Cadastral GIS boundary projection', 'Corporate PAN/GSTN cross-linkage'],
      outputs: ['Harmonized Project Record', 'Geotagged physical polygon'],
      ruleRef: 'CVC Circular 09/2021',
    },
    {
      num: '04',
      title: 'Anomaly Engine',
      desc: 'Disbursement vs physical slopes & cartel graph metrics',
      inputs: ['Historical peer cost distributions', 'Physical progress inspection dates', 'Disbursement milestone ledgers'],
      processing: ['Cost percentile outlier calculation (Z-score)', 'Slope divergence delta: % Fin vs % Phy', 'Bidder syndicate graph degree centrality'],
      outputs: ['Cost variance multiplier', 'Tender bypass flag', 'Cartel cluster score'],
      ruleRef: 'MPLADS Revised Guidelines 2023 §4.2',
    },
    {
      num: '05',
      title: 'Risk Scoring',
      desc: '9-vector decomposed risk index (0–100)',
      inputs: ['Anomaly engine telemetry', 'SLA deadline projections', 'Contractor delay history'],
      processing: ['Weighted multi-criteria risk synthesis', 'Decomposition into 9 orthogonal vectors', 'Confidence interval calibration'],
      outputs: ['Composite Risk Index (0–100)', 'Risk classification: LOW / MEDIUM / HIGH / CRITICAL'],
      ruleRef: 'MoSPI Risk Assessment Matrix',
    },
    {
      num: '06',
      title: 'Evidence Dossier',
      desc: 'Rule citations, SoR deviations & ledger logs',
      inputs: ['Extracted risk flags', 'Prevailing PWD SoR baselines', 'Geotagged photo records'],
      processing: ['Statutory guideline citation mapping', 'Comparative peer cost graph assembly', 'Audit dossier cryptographic packaging'],
      outputs: ['Verifiable Case Evidence Packet', 'Court-ready and audit-ready docket'],
      ruleRef: 'Evidence Act & Audit Protocol',
    },
    {
      num: '07',
      title: 'Investigation',
      desc: 'Human authority inquiry & formal verdict',
      inputs: ['Evidence dossier', 'Assigned Officer inquiry notes', 'Contractor written response'],
      processing: ['Formal show-cause recording', 'Authoritative human review panel', 'Immutable ledger verdict registration'],
      outputs: ['Statutory Verdict: Confirmed / False Positive / Resolved / Escalated', 'Corrective administrative action order'],
      ruleRef: 'District Collector Statutory Powers',
    },
  ];

  return (
    <section id="how-it-thinks" className="py-20 sm:py-28 bg-white border-b border-[#D9DFE3]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D99016] bg-[#D99016]/10 px-3 py-1 rounded-full border border-[#D99016]/30">
            CHAPTER 03 • SYSTEM ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#15324A] tracking-tight uppercase leading-tight font-sans">
            How AGASTYA Thinks.
          </h2>
          <p className="text-sm sm:text-base text-[#647383] leading-relaxed">
            The end-to-end multi-stage pipeline converting raw administrative transactions into verifiable diagnostic signals. Click any stage to inspect technical logic.
          </p>
        </div>

        {/* 7-Stage Process Pipeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 items-stretch">
          {stages.map((st, i) => (
            <button
              key={st.title}
              type="button"
              onClick={() => setSelectedStage(st)}
              className="rounded-[6px] border border-[#D9DFE3] bg-[#FAFAF7] p-4 flex flex-col justify-between shadow-subtle hover:border-[#15324A] hover:bg-white transition-all group text-left cursor-pointer hover:translate-y-[-2px]"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono font-bold text-[#D99016]">
                    {st.num}
                  </span>
                  <div className="p-1.5 rounded bg-white text-[#15324A] border border-[#D9DFE3] group-hover:bg-[#15324A] group-hover:text-white transition-colors">
                    <Info className="h-3.5 w-3.5" />
                  </div>
                </div>

                <h3 className="text-xs font-bold text-[#15324A] uppercase tracking-wide leading-tight mb-1.5">
                  {st.title}
                </h3>

                <p className="text-[11px] text-[#647383] leading-snug">
                  {st.desc}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-[#D9DFE3] text-[9px] font-mono text-[#647383] flex items-center justify-between">
                <span className="text-[#D99016] font-bold">Inspect Logic</span>
                {i < stages.length - 1 && <ChevronRight className="h-3 w-3 text-[#98A2B3] hidden lg:inline" />}
              </div>
            </button>
          ))}
        </div>

        {/* Interactive Stage Dialog */}
        {selectedStage && (
          <Dialog
            open={!!selectedStage}
            onOpenChange={(open: boolean) => !open && setSelectedStage(null)}
            title={`STAGE ${selectedStage.num}: ${selectedStage.title.toUpperCase()}`}
            description={selectedStage.desc}
          >
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5 bg-[#FAFAF7] p-3 rounded border border-[#D9DFE3]">
                <span className="text-[10px] font-mono font-bold text-[#15324A] uppercase block">
                  1. Inputs Entering This Stage
                </span>
                <ul className="space-y-1 text-xs text-[#647383]">
                  {selectedStage.inputs.map((inp, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="text-[#D99016] font-bold">•</span>
                      <span>{inp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1.5 bg-[#FAFAF7] p-3 rounded border border-[#D9DFE3]">
                <span className="text-[10px] font-mono font-bold text-[#15324A] uppercase block">
                  2. Processing & Deterministic Algorithms
                </span>
                <ul className="space-y-1 text-xs text-[#647383]">
                  {selectedStage.processing.map((proc, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="text-[#2E8064] font-bold">•</span>
                      <span>{proc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1.5 bg-[#FAFAF7] p-3 rounded border border-[#D9DFE3]">
                <span className="text-[10px] font-mono font-bold text-[#15324A] uppercase block">
                  3. Outputs Produced for Downstream Layers
                </span>
                <ul className="space-y-1 text-xs text-[#647383]">
                  {selectedStage.outputs.map((out, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="text-[#15324A] font-bold">•</span>
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#D9DFE3] text-[11px] font-mono text-[#647383]">
                <span>Statutory Reference:</span>
                <strong className="text-[#15324A]">{selectedStage.ruleRef}</strong>
              </div>
            </div>
          </Dialog>
        )}
      </div>
    </section>
  );
}
