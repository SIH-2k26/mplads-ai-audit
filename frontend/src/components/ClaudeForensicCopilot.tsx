import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Bot,
  Send,
  X,
  ShieldAlert,
  FileText,
  Activity,
  CheckCircle2,
  Copy,
  Check,
  Search,
  Zap,
  HelpCircle,
  Sliders
} from 'lucide-react';
import { FLAGGED_PROJECTS } from '../data/mockData';
import { MPLADSProject } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  tags?: string[];
  citations?: string[];
  actionRecommendation?: {
    type: 'freeze' | 'subpoena' | 'satellite';
    label: string;
  };
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    sender: 'ai',
    text: 'Hello, Vigilance Officer. I am the AI Forensic Intelligence Engine. I continuously cross-reference PFMS treasury disbursements, ISRO Cartosat-3 SAR elevation models, and MCA-21 director PAN networks across all 543 Parliamentary Constituencies. How can I assist your statutory investigation today?',
    timestamp: 'Just now',
    citations: ['CAG Audit Manual 2024', 'ISRO NRSC Geoportal', 'PFMS API v4.2'],
  },
];

const SUGGESTED_PROMPTS = [
  {
    title: 'Synthesize Case Brief',
    prompt: 'Synthesize a formal CAG statutory prosecution docket for Project UP-VNS-2024-001 (Varanasi Ring Road Drain).',
  },
  {
    title: 'Audit PAN Collusion',
    prompt: 'Identify common Director PAN linkages and cover-bidding patterns across Eastern UP projects.',
  },
  {
    title: 'Analyze Optical Discrepancy',
    prompt: 'Explain why Cartosat-3 SAR flagged zero elevation changes on the Bellary bypass despite 65% claimed milestone.',
  },
  {
    title: 'SHAP Feature Breakdown',
    prompt: 'Show the top SHAP decision drivers behind the 94.2% anomaly score for Vindhya Infracon Ltd.',
  },
];

interface ClaudeForensicCopilotProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerAction?: (actionType: string) => void;
  selectedProject?: MPLADSProject | null;
}

export const ClaudeForensicCopilot: React.FC<ClaudeForensicCopilotProps> = ({
  isOpen,
  onClose,
  onTriggerAction,
  selectedProject,
}) => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputVal, setInputVal] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputVal;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsThinking(true);

    // Generate context-aware AI synthesis
    setTimeout(() => {
      let responseText = '';
      let actionRec: Message['actionRecommendation'] = undefined;
      let citations: string[] = ['PFMS Central Ledger', 'CAG Statutory Report'];

      const q = query.toLowerCase();

      if (q.includes('synthesize') || q.includes('case brief') || q.includes('varanasi') || q.includes('docket')) {
        responseText = `**STATUTORY FORENSIC DOCKET: UP-VNS-2024-001**\n\n- **Implementing Scheme:** MPLADS Central Outlay (Tranche 4)\n- **Executing Agency:** DRDA Varanasi / Zilla Parishad\n- **Target Entity:** Vindhya Infracon Ltd (GSTIN: 09AAACV1298K1ZX)\n- **Financial Discrepancy:** ₹48.50 Cr sanctioned (100% disbursed within 14 days) vs 22.4% physical earthwork confirmed by Cartosat-3 SAR radar.\n- **Statutory Violation:** Section 14(1) of CAG DPC Act (Misappropriation of Public Funds) and Rule 212 of General Financial Rules (GFR) 2017.\n\n**Forensic Recommendation:** Immediate disbursal freeze on linked sister escrow accounts and issuance of Section 14 show-cause summons to the Superintending Engineer.`;
        actionRec = { type: 'freeze', label: 'Execute Disbursal Freeze' };
        citations.push('ISRO SAR Pass #104', 'GFR Rule 212');
      } else if (q.includes('pan') || q.includes('collusion') || q.includes('cover-bid')) {
        responseText = `**CROSS-ENTITY DIRECTOR NEXUS ANALYSIS**\n\nForensic graph analysis has uncovered a high-confidence bid-rigging ring:\n\n1. **Director PAN ABCDP8841M (R.K. Agarwal)** holds a 99.4% equity stake in *Vindhya Infracon Ltd* and serves as Managing Director of *Apex Infraworks Pvt*.\n2. In tender **UP-RUR-2024-88**, Vindhya Infracon was selected as L1 (₹48.50 Cr) while Apex Infraworks submitted an identical formatted cover bid as L2 (+1.2% delta) from the same static IP subnet in Lucknow.\n3. Win rate in this cluster is **94.2%**, representing an anomalous statutory monopoly over Eastern UP rural drainage contracts.`;
        actionRec = { type: 'subpoena', label: 'Issue Section 14 Subpoena' };
        citations.push('MCA-21 Director Master Data', 'e-Procurement Portal IP Logs');
      } else if (q.includes('optical') || q.includes('radar') || q.includes('bellary') || q.includes('satellite')) {
        responseText = `**ISRO CARTOSAT-3 SAR OPTICAL RECONNAISSANCE REPORT**\n\n- **Coordinates:** 15.1394° N, 76.9214° E (Bellary bypass, Karnataka)\n- **Claimed Milestone:** Phase 3 Completion (65% Physical Progress certified by PWD)\n- **Sensor Findings:** Synthetic Aperture Radar (SAR) dual-polarization volumetric backscatter indicates zero soil displacement and raw unpaved terrain.\n- **Discrepancy Severity:** 91.2% Optical Divergence (Grade A Critical Anomaly).`;
        actionRec = { type: 'satellite', label: 'Task High-Res Optical Pass' };
        citations.push('Cartosat-3 SAR PolSAR Mode', 'Bhuvan Geoportal');
      } else if (q.includes('shap') || q.includes('feature')) {
        responseText = `**SHAP EXPLAINABILITY BREAKDOWN (MODEL VIGILANCE-XGB)**\n\n1. **Satellite SAR Soil Delta:** +0.42 SHAP (Highest Risk Driver)\n2. **Common Director PAN Overlap:** +0.28 SHAP\n3. **Tranche Disbursal Velocity (<48h):** +0.19 SHAP\n4. **Contractor Age < 120 Days:** +0.14 SHAP\n5. **Cumulative Composite Risk Score:** **94.2 / 100 (Extreme Severity)**`;
        citations.push('Vigilance XGBoost Model v3.1', 'SHAP Attributions Matrix');
      } else {
        responseText = `Based on forensic synthesis across current MPLADS records, **${query}** touches upon 38 flagged project nodes with aggregate exposure of ₹412.80 Cr. Real-time telemetry indicates high confidence in physical ground divergence and shared-director tender syndicates. Would you like me to prepare an exportable statutory notice or lock tranche releases?`;
        actionRec = { type: 'freeze', label: 'Review Risk Controls' };
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionRecommendation: actionRec,
        citations,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
    }, 600);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="bg-white w-full max-w-2xl h-[640px] max-h-[90vh] rounded-[28px] shadow-2xl border border-[#E5E3DC] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#F1F0EC] border-b border-[#E5E3DC] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#9FE870] flex items-center justify-center text-[#0E0E0E] shadow-2xs">
              <Sparkles className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#0E0E0E]">Forensic AI Copilot & Docket Synthesizer</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0E0E0E] text-white">
                  LIVE VIGILANCE
                </span>
              </div>
              <p className="text-xs text-[#6B6B6B]">Cross-referencing PFMS, Cartosat-3 SAR & MCA-21 registries</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#6B6B6B] hover:text-[#0E0E0E] hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-[#0E0E0E] text-white flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#0E0E0E] text-white font-medium'
                    : 'bg-[#F1F0EC] text-[#0E0E0E] border border-[#E5E3DC]'
                }`}
              >
                {/* Message Content */}
                <div className="whitespace-pre-wrap font-sans text-xs space-y-2">
                  {msg.text.split('\n\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>

                {/* Citations Footer */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-[#E5E3DC] flex flex-wrap items-center gap-1.5 text-[10px] text-[#6B6B6B]">
                    <span className="font-semibold text-[#0E0E0E]">Sources:</span>
                    {msg.citations.map((c, idx) => (
                      <span key={idx} className="bg-white px-2 py-0.5 rounded-md border border-[#E5E3DC]">
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Recommendation Button */}
                {msg.actionRecommendation && onTriggerAction && (
                  <div className="mt-3 pt-2 flex items-center justify-between">
                    <button
                      onClick={() => {
                        onTriggerAction(msg.actionRecommendation!.type);
                        onClose();
                      }}
                      className="bg-[#9FE870] hover:bg-[#8ee05c] text-[#0E0E0E] text-[11px] font-bold px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Zap className="w-3 h-3 fill-current" />
                      <span>{msg.actionRecommendation.label}</span>
                    </button>

                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="text-[#6B6B6B] hover:text-[#0E0E0E] flex items-center gap-1 text-[11px] cursor-pointer"
                      title="Copy docket to clipboard"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600 font-medium">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Brief</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-3 items-center text-xs text-[#6B6B6B]">
              <div className="w-7 h-7 rounded-full bg-[#0E0E0E] text-white flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 bg-[#F1F0EC] rounded-2xl flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0E0E0E] animate-bounce" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#0E0E0E] animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#0E0E0E] animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] font-medium text-[#0E0E0E]">Cross-referencing statutory ledgers...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Quick Prompts Row */}
        <div className="px-5 py-2 bg-white border-t border-[#F1F0EC] flex items-center gap-2 overflow-x-auto no-scrollbar">
          {SUGGESTED_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(item.prompt)}
              className="shrink-0 bg-[#F1F0EC] hover:bg-[#EAE8E2] text-[#0E0E0E] text-[11px] font-medium px-3 py-1.5 rounded-full transition-colors cursor-pointer border border-[#E5E3DC]"
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <div className="p-4 bg-[#F1F0EC] border-t border-[#E5E3DC]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask AI Copilot to synthesize dockets, check PANs, or analyze SAR data..."
              className="flex-1 bg-white border border-[#E5E3DC] rounded-full px-4 py-2.5 text-xs text-[#0E0E0E] placeholder-[#9E9E9E] focus:outline-hidden focus:border-[#0E0E0E]"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isThinking}
              className="w-9 h-9 rounded-full bg-[#0E0E0E] text-white flex items-center justify-center hover:bg-black disabled:opacity-40 transition-all cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
