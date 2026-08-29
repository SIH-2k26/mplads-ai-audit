import React, { useState } from 'react';
import { MessageSquare, Sparkles, X, ArrowRight, BookOpen, ShieldCheck } from 'lucide-react';
import { useRoleStore } from '../../stores/useRoleStore';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

export function AskAiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [citations, setCitations] = useState<string[]>([]);
  const { currentRole, selectedDistrict } = useRoleStore();

  const handleQuickAsk = (samplePrompt: string) => {
    setQuery(samplePrompt);
    generateMockResponse(samplePrompt);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    generateMockResponse(query);
  };

  const generateMockResponse = (q: string) => {
    const lower = q.toLowerCase();
    if (lower.includes('mismatch') || lower.includes('financial')) {
      setResponse(
        `Identified 2 projects in ${selectedDistrict} with physical/financial progress gaps >30%: ` +
        `P-1023 (Community Hall Ward 17: 92.5% spent vs 31% physical) and P-0871 (Haveli Link Road: 87% spent vs 51% physical).`
      );
      setCitations(['MPLADS Guidelines 2023 §5.4', 'District Treasury Ledger Voucher 991']);
    } else if (lower.includes('contractor') || lower.includes('sahyadri')) {
      setResponse(
        `Contractor M/s Sahyadri Buildtech Infrastructure holds 68.4% concentration in Haveli Block with 8 active projects and ₹6.42 Cr contract value. 4 out of last 6 tenders won with average delay of 114 days.`
      );
      setCitations(['CVC Circular 09/2021 Clause 9.4', 'e-Procurement Bid Log T882']);
    } else if (lower.includes('rule') || lower.includes('cost') || lower.includes('sor')) {
      setResponse(
        `Per MPLADS Guidelines 2023 Section 4.2 (Page 37), technical sanction estimates must not exceed 10% of prevailing PWD/CPWD Schedule of Rates without written sanction committee justification.`
      );
      setCitations(['MPLADS Guidelines 2023 §4.2, P.37', 'State PWD SoR 2025-26']);
    } else {
      setResponse(
        `Query grounded across ${selectedDistrict} MPLADS database: 128 active projects, 7 high risk flags, ₹48.5 Cr sanctioned. All estimates cross-referenced with PWD Schedule of Rates.`
      );
      setCitations(['District Planning Office Database', 'MoSPI National Portal']);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#18324A] text-white px-4 py-3 shadow-elevated border border-[#C98219] hover:bg-[#102A43] transition-all hover:scale-105"
        >
          <Sparkles className="h-4 w-4 text-[#E7A943]" />
          <span className="text-xs font-bold tracking-wide">Ask SANCHAY Intelligence</span>
        </button>
      )}

      {/* Floating Assistant Popover */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 rounded-[8px] border-2 border-[#18324A] bg-white shadow-2xl animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between bg-[#18324A] px-4 py-3 text-white rounded-t-[6px]">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#E7A943]" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                SANCHAY Grounded Assistant
              </h3>
            </div>
            <div>
              <p className="text-[10px] text-gray-300">
                Role: {currentRole.replace('_', ' ')} • Grounded in Policy & Ledger Data
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded text-gray-300 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="p-3 bg-[#FAFAF7] border-b border-[#EDE8DE] space-y-1.5">
            <span className="text-[10px] font-semibold text-[#667085] uppercase tracking-wider block">
              Suggested Role Queries
            </span>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => handleQuickAsk(`Show projects with high financial-physical mismatch in ${selectedDistrict}.`)}
                className="text-left text-[11px] text-[#18324A] hover:text-[#C98219] bg-white p-1.5 rounded border border-[#EDE8DE] hover:border-[#C98219] truncate"
              >
                "Projects with high progress mismatch in {selectedDistrict}."
              </button>
              <button
                type="button"
                onClick={() => handleQuickAsk(`Inspect contractor cartel concentration in ${selectedDistrict}.`)}
                className="text-left text-[11px] text-[#18324A] hover:text-[#C98219] bg-white p-1.5 rounded border border-[#EDE8DE] hover:border-[#C98219] truncate"
              >
                "Contractor cartel concentration flags."
              </button>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-4 max-h-64 overflow-y-auto space-y-3">
            {response ? (
              <div className="space-y-2">
                <div className="p-3 rounded-[4px] bg-[#F7F5F0] border border-[#D9D5CC] text-xs text-[#1D2939] leading-relaxed">
                  {response}
                </div>

                {citations.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-semibold text-[#667085] uppercase tracking-wider block">
                      Evidence & Rule Citations
                    </span>
                    {citations.map((c, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-[#2F7658] font-mono font-medium">
                        <BookOpen className="h-3 w-3" />
                        {c}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-[#667085] text-center py-4">
                Ask any question regarding MPLADS projects, cost benchmarks, contractor syndicates, or applicable GIGW/GFR rules.
              </p>
            )}
          </div>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-[#EDE8DE] bg-white flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Query projects, rules, or anomalies..."
              className="flex-1 rounded-[4px] border border-[#D9D5CC] bg-white px-2.5 py-1.5 text-xs text-[#1D2939] focus:outline-none focus:border-[#18324A]"
            />
            <Button variant="default" size="sm" type="submit" className="h-8 px-3 text-xs">
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
