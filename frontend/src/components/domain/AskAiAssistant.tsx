import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Send, Bot, HelpCircle } from 'lucide-react';
import { useUiStore } from '../../stores/useUiStore';
import { useRoleStore } from '../../stores/useRoleStore';

export function AskAiAssistant() {
  const { aiAssistantOpen, setAiAssistantOpen } = useUiStore();
  const { currentRole, selectedDistrict, userTitle } = useRoleStore();

  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [citations, setCitations] = useState<string[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const generateMockResponse = (q: string) => {
    setIsThinking(true);
    setResponse(null);
    setCitations([]);

    setTimeout(() => {
      const lower = q.toLowerCase();

      if (lower.includes('mismatch') || lower.includes('financial')) {
        setResponse(
          `Identified 2 projects in ${selectedDistrict} with physical/financial progress gaps >30%: ` +
          `P-1023 (Community Hall Ward 17: 92.5% spent vs 31% physical) and P-0871 (Haveli Link Road: 87% spent vs 51% physical).`
        );
        setCitations([
          'MPLADS Guidelines 2023 §5.4',
          'District Treasury Ledger Voucher 991',
        ]);
      } else if (lower.includes('contractor') || lower.includes('sahyadri')) {
        setResponse(
          `Contractor M/s Sahyadri Buildtech Infrastructure holds 68.4% concentration in Haveli Block with 8 active projects and ₹6.42 Cr contract value. 4 out of last 6 tenders won with average delay of 114 days.`
        );
        setCitations([
          'CVC Circular 09/2021 Clause 9.4',
          'e-Procurement Bid Log T882',
        ]);
      } else if (lower.includes('rule') || lower.includes('cost') || lower.includes('sor')) {
        setResponse(
          `Per MPLADS Guidelines 2023 Section 4.2 (Page 37), technical sanction estimates must not exceed 10% of prevailing PWD/CPWD Schedule of Rates without written sanction committee justification.`
        );
        setCitations([
          'MPLADS Guidelines 2023 §4.2, P.37',
          'State PWD SoR 2025-26',
        ]);
      } else {
        setResponse(
          `Query grounded across ${selectedDistrict} MPLADS database: 128 active projects, 7 high risk flags, ₹48.5 Cr sanctioned. All estimates cross-referenced with PWD Schedule of Rates.`
        );
        setCitations([
          'District Planning Office Database',
          'MoSPI National Portal',
        ]);
      }
      setIsThinking(false);
    }, 800);
  };

  const handleQuickAsk = (samplePrompt: string) => {
    setQuery(samplePrompt);
    generateMockResponse(samplePrompt);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    generateMockResponse(query);
  };

  return (
    <>
      {/* Floating Trigger Button (when closed) */}
      {!aiAssistantOpen && (
        <div className="fixed bottom-6 right-6 z-40 select-none">
          <button
            onClick={() => setAiAssistantOpen(true)}
            className="group flex items-center gap-2 bg-[#0E0E0E] hover:bg-black text-white px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer border border-white/20 active:scale-95"
            title="Ask Sanchay AI Assistant"
          >
            <div className="w-6 h-6 rounded-full bg-[#9FE870] flex items-center justify-center text-[#0E0E0E]">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold tracking-tight">Ask Sanchay</span>
            <span className="w-2 h-2 rounded-full bg-[#9FE870] animate-pulse" />
          </button>
        </div>
      )}

      {/* Chat Assistant Drawer Overlay */}
      <AnimatePresence>
        {aiAssistantOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none">
            {/* Backdrop */}
            <div className="absolute inset-0" onClick={() => setAiAssistantOpen(false)} />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative z-10 bg-white w-full max-w-2xl h-[600px] max-h-[85vh] rounded-[28px] shadow-2xl border border-[#E5E3DC] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 bg-[#F1F0EC] border-b border-[#E5E3DC] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#9FE870] flex items-center justify-center text-[#0E0E0E] shadow-2xs">
                    <Sparkles className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0E0E0E]">SANCHAY AI Assistant</h3>
                    <p className="text-xs text-[#6B6B6B]">
                      Role: {userTitle} ({selectedDistrict} Context)
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setAiAssistantOpen(false)}
                  className="p-1.5 rounded-full text-[#6B6B6B] hover:text-[#0E0E0E] hover:bg-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Message Window Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* AI Welcome Message */}
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#0E0E0E] text-white flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed bg-[#F1F0EC] text-[#0E0E0E] border border-[#E5E3DC]">
                    Hello, Vigilance Officer. I am Sanchay, your AI statutory audit assistant. I monitor e-Sakshi ledgers and Cartosat-3 SAR elevation data across {selectedDistrict}. How can I assist you?
                  </div>
                </div>

                {/* Query & Response Display */}
                {response && (
                  <>
                    {/* User message bubble */}
                    <div className="flex gap-3 justify-end">
                      <div className="max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed bg-[#0E0E0E] text-white font-medium">
                        {query}
                      </div>
                    </div>

                    {/* AI response bubble */}
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#0E0E0E] text-white flex items-center justify-center shrink-0 mt-1">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed bg-[#F1F0EC] text-[#0E0E0E] border border-[#E5E3DC] space-y-3">
                        <p className="font-sans whitespace-pre-wrap">{response}</p>
                        
                        {/* Citations Panel */}
                        {citations.length > 0 && (
                          <div className="pt-2 border-t border-[#EAE8E2] flex flex-wrap items-center gap-1.5 text-[10px] text-[#6B6B6B]">
                            <span className="font-semibold text-[#0E0E0E]">Citations:</span>
                            {citations.map((citation, index) => (
                              <span key={index} className="bg-white px-2 py-0.5 rounded-md border border-[#E5E3DC] font-mono">
                                {citation}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Spinner while thinking */}
                {isThinking && (
                  <div className="flex gap-3 items-center text-xs text-[#6B6B6B]">
                    <div className="w-7 h-7 rounded-full bg-[#0E0E0E] text-white flex items-center justify-center">
                      <Bot className="w-4 h-4 animate-spin" />
                    </div>
                    <div className="p-3 bg-[#F1F0EC] rounded-2xl flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0E0E0E] animate-bounce" />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0E0E0E] animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0E0E0E] animate-bounce [animation-delay:0.4s]" />
                      <span className="text-[11px] font-medium text-[#0E0E0E]">Querying treasury ledgers...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Prompts Panel */}
              <div className="px-5 py-2.5 bg-white border-t border-[#F1F0EC] space-y-1.5 select-none shrink-0">
                <span className="text-[9px] font-bold text-[#6B6B6B] uppercase tracking-wider block px-1">
                  Suggested Scrutiny Audits
                </span>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  <button
                    onClick={() => handleQuickAsk(`Projects with high progress mismatch in ${selectedDistrict}.`)}
                    className="shrink-0 bg-[#F1F0EC] hover:bg-[#EAE8E2] text-[#0E0E0E] text-[11px] font-medium px-3 py-1.5 rounded-full transition-colors cursor-pointer border border-[#E5E3DC]"
                  >
                    Mismatch in {selectedDistrict}
                  </button>
                  <button
                    onClick={() => handleQuickAsk('Contractor cartel concentration flags.')}
                    className="shrink-0 bg-[#F1F0EC] hover:bg-[#EAE8E2] text-[#0E0E0E] text-[11px] font-medium px-3 py-1.5 rounded-full transition-colors cursor-pointer border border-[#E5E3DC]"
                  >
                    Cartel Concentration Flags
                  </button>
                </div>
              </div>

              {/* Footer Query Input Form */}
              <div className="p-4 bg-[#F1F0EC] border-t border-[#E5E3DC]">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask Sanchay to scan projects, check cartel nodes, or explain guidelines..."
                    className="flex-1 bg-white border border-[#E5E3DC] rounded-full px-4 py-2.5 text-xs text-[#0E0E0E] placeholder-[#9E9E9E] focus:outline-none focus:border-[#0E0E0E]"
                  />
                  <button
                    type="submit"
                    disabled={!query.trim() || isThinking}
                    className="w-9 h-9 rounded-full bg-[#0E0E0E] text-white flex items-center justify-center hover:bg-black disabled:opacity-40 transition-all cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
