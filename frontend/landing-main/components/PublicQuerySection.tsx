import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Lock,
  Globe2,
  HelpCircle,
  X,
} from 'lucide-react';
import { IntelligenceCapsuleRail } from './IntelligenceCapsuleRail';
import { useUiStore } from '../stores/useUiStore';
import { Link } from 'react-router-dom';

interface QueryPreset {
  query: string;
  category: string;
  answer: string;
  contributors?: Array<{ label: string; score: string; alert?: boolean }>;
  sources: string[];
}

const PRESET_QUERIES: QueryPreset[] = [
  {
    query: 'Why is Project P-1023 high risk?',
    category: 'PROJECT DIAGNOSTIC',
    answer:
      'Project P-1023 (Ward 17 Community Hall) has been flagged as HIGH RISK (Score 87/100). Multiple independent signals indicate an elevated risk profile requiring administrative verification.',
    contributors: [
      { label: 'Cost anomaly (+38.2% vs PWD SoR baseline)', score: '+32 pts', alert: true },
      { label: 'Progress mismatch (92.5% spent vs 31.0% physical)', score: '+28 pts', alert: true },
      { label: 'Duplicate similarity (74% overlap with PMGSY road)', score: '+27 pts', alert: true },
    ],
    sources: ['MPLADS Guidelines §5.4', 'Project Record P-1023', 'CAG Finding 2024-117'],
  },
  {
    query: 'Show delayed works in Pune',
    category: 'DISTRICT OVERSIGHT',
    answer:
      'Pune District currently records 18 civil works delayed beyond their statutory milestone SLA. Primary delays are concentrated in rural water supply and bridge link packages with average overrun of 48 days.',
    contributors: [
      { label: 'Zilla Parishad Rural Water Works', score: '8 Works Delayed' },
      { label: 'PWD Division II Link Roads', score: '6 Works Delayed' },
      { label: 'PMC Health Centers', score: '4 Works Delayed' },
    ],
    sources: ['eSAKSHI State Nodal Feed', 'DPO Pune Quarterly Review', 'PWD Milestone Ledger'],
  },
  {
    query: 'Which projects have duplicate similarity?',
    category: 'DUPLICATION INTEL',
    answer:
      'SANCHAY detected 23 potential cross-scheme duplication clusters in Maharashtra where MPLADS civil proposals exhibit >70% geospatial and semantic overlap with existing Central or State assets.',
    contributors: [
      { label: 'PMGSY Batch III Asphalt Roads Overlap', score: '12 Clusters', alert: true },
      { label: 'Jal Jeevan Mission Pipeline Overlap', score: '8 Clusters', alert: true },
      { label: 'State PWD Culverts', score: '3 Clusters' },
    ],
    sources: ['State Asset GIS Registry', 'PMGSY Geofence Database', 'MPLADS Proposal Records'],
  },
  {
    query: 'What rules apply to community halls?',
    category: 'STATUTORY POLICY',
    answer:
      'Community hall proposals under MPLADS are governed by Chapter 5 (Eligible Works). Mandatory prerequisites include land ownership NOC in favor of local body, Technical Sanction by competent engineer, and 15% SC/ST quota compliance if in designated habitation.',
    contributors: [
      { label: 'Rule 5.4: Mandatory Technical Sanction (TS)', score: 'Statutory Pre-requisite' },
      { label: 'Rule 3.2: SC/ST Habitation Focus (15% Outlay)', score: 'Mandatory Allocation' },
      { label: 'Rule 7.1: GFR-12C Utilisation Certificate (45 Days)', score: 'Compliance SLA' },
    ],
    sources: ['MoSPI MPLADS Revised Guidelines 2023', 'GFR-2017 Rule 12C', 'CVC Directives'],
  },
];

export function PublicQuerySection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activePreset, setActivePreset] = useState<QueryPreset | null>(PRESET_QUERIES[0]);
  const { setAiAssistantOpen } = useUiStore();

  const handleSelectQuery = (preset: QueryPreset) => {
    setActivePreset(preset);
    setSearchQuery(preset.query);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const matched = PRESET_QUERIES.find((p) =>
      p.query.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (matched) {
      setActivePreset(matched);
    } else {
      setActivePreset({
        query: searchQuery,
        category: 'CUSTOM INTELLIGENCE QUERY',
        answer: `SANCHAY AI query analysis initiated for: "${searchQuery}". Synthesizing real-time project ledgers, PWD Schedule of Rates baselines, and milestone telemetry across authorized government databases.`,
        sources: ['eSAKSHI Public Portal', 'MoSPI Guidelines 2023', 'State PWD SoR'],
      });
    }
  };

  return (
    <section className="bg-[#F1F0EC] text-[#0E0E0E] py-20 sm:py-28 relative overflow-hidden border-b border-[#E5E3DC]">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* SECTION HEADER */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1 text-xs font-mono font-bold text-[#002449] border border-[#E5E3DC] shadow-2xs">
            <Globe2 className="h-3.5 w-3.5 text-[#002449]" />
            <span>CHAPTER 03 • PUBLIC QUERY & CITIZEN TRANSPARENCY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase leading-tight font-sans text-[#002449]">
            Ask About MPLADS. <br />
            <span className="text-[#D99018]">Explore What The System Can Verify.</span>
          </h2>

          <p className="text-sm sm:text-base text-[#6B6B6B] leading-relaxed max-w-2xl font-normal font-sans">
            Citizens, researchers, and public authorities can query the intelligence layer to inspect grounded project ledgers, contractor concentration, and statutory rule compliance.
          </p>
        </div>

        {/* INTERACTIVE SEARCH & QUERY INTERFACE */}
        <div className="rounded-[24px] border border-[#E5E3DC] bg-white p-6 sm:p-8 shadow-sm space-y-6">
          {/* Search Input Bar — High-contrast pill */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="absolute left-4.5 h-5 w-5 text-[#6B6B6B] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask about a project (e.g. P-1023), district (Pune), contractor, or statutory rule..."
              className="w-full h-14 pl-12 pr-36 sm:pr-40 rounded-full border border-[#E5E3DC] bg-[#F1F0EC] text-sm text-[#0E0E0E] placeholder:text-[#6B6B6B] focus:border-[#002449] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002449]/20 font-sans transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 h-10 px-5 rounded-full bg-[#002449] hover:bg-[#001B36] text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <span>Ask Sanchay</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          {/* Suggested Query Chips */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6B6B6B] block">
              Suggested Transparency Queries:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_QUERIES.map((preset) => {
                const isSelected = activePreset?.query === preset.query;
                return (
                  <button
                    key={preset.query}
                    type="button"
                    onClick={() => handleSelectQuery(preset)}
                    className={`px-3.5 py-1.5 rounded-full text-xs transition-all text-left flex items-center gap-1.5 font-sans cursor-pointer ${
                      isSelected
                        ? 'bg-[#002449] text-white font-semibold shadow-xs'
                        : 'bg-[#F1F0EC] text-[#0E0E0E] border border-[#E5E3DC] hover:bg-[#EAE8E2]'
                    }`}
                  >
                    <Sparkles className={`h-3 w-3 ${isSelected ? 'text-white' : 'text-[#6B6B6B]'}`} />
                    <span>{preset.query}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Grounded Query Response Card */}
          {activePreset && (
            <div className="p-6 rounded-[20px] border border-[#E5E3DC] bg-[#FAFAF9] text-[#0E0E0E] space-y-4 shadow-2xs animate-in fade-in-50 duration-200 font-sans">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EAE8E2] pb-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="rounded-full bg-[#002449]/10 px-2.5 py-0.5 text-[9.5px] font-mono font-bold text-[#002449] border border-[#002449]/20 uppercase">
                    {activePreset.category}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#0E0E0E]">
                    "{activePreset.query}"
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Evidence Verified</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#0E0E0E] leading-relaxed font-sans font-normal">
                {activePreset.answer}
              </p>

              {/* Contributors Grid */}
              {activePreset.contributors && (
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-mono font-bold text-[#6B6B6B] uppercase tracking-wider block">
                    Grounded Signal Breakdown:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                    {activePreset.contributors.map((c, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-[16px] bg-white border border-[#E5E3DC] space-y-1.5 flex flex-col justify-between shadow-2xs"
                      >
                        <span className="text-[#0E0E0E] text-[11px] font-sans font-medium">{c.label}</span>
                        <strong
                          className={`text-xs block mt-0.5 ${
                            c.alert ? 'text-red-700' : 'text-[#002449]'
                          }`}
                        >
                          {c.score}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grounded Sources & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#EAE8E2]">
                <div className="flex items-center flex-wrap gap-2 text-[10px] font-mono text-[#6B6B6B]">
                  <span className="font-bold text-[#0E0E0E]">Sources:</span>
                  {activePreset.sources.map((src) => (
                    <span
                      key={src}
                      className="rounded-full bg-white px-2.5 py-0.5 text-[#0E0E0E] border border-[#E5E3DC]"
                    >
                      {src}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setAiAssistantOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#002449] hover:underline transition-colors cursor-pointer"
                >
                  <span>Ask Follow-Up Query →</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CHAPTER: INTELLIGENCE CAPSULE RAIL */}
        <div className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E3DC] pb-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#002449] uppercase tracking-wide font-sans">
                MPLADS Intelligence Capsules
              </h3>
              <p className="text-xs text-[#6B6B6B] font-sans">
                Hover any capsule to preview summary signals • Click to open full evidence docket
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#002449] font-bold bg-white px-2.5 py-0.5 rounded-full border border-[#E5E3DC]">
              ● 5 ACTIVE DOMAINS
            </span>
          </div>

          <IntelligenceCapsuleRail />
        </div>

        {/* Public vs Official Data Governance Boundary Notice */}
        <div className="rounded-[20px] border border-[#E5E3DC] bg-white p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#6B6B6B] font-sans shadow-2xs">
          <div className="flex items-center gap-3">
            <Lock className="h-4 w-4 text-[#002449] flex-shrink-0" />
            <span>
              <strong className="text-[#0E0E0E]">Public Transparency vs Official Command Boundary:</strong> Public queries access sanctioned records and published audit findings. Sensitive vigilance notes and sub-ledgers require authorized credentials.
            </span>
          </div>

          <Link
            to="/district"
            className="text-xs font-semibold text-[#002449] hover:underline whitespace-nowrap flex items-center gap-1 transition-colors"
          >
            <span>Official Login Portal →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
