import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShieldAlert,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Lock,
  Sparkles,
  Search,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUiStore } from '../../stores/useUiStore';

export interface CapsuleIntelligenceData {
  id: string;
  category: 'PROJECT' | 'DISTRICT' | 'CONTRACTOR' | 'AUDIT CASE' | 'POLICY';
  tag: string;
  title: string;
  subtitle: string;
  location: string;
  metricLabel: string;
  metricValue: string;
  statusLabel: string;
  statusVariant: 'critical' | 'saffron' | 'success' | 'default';
  riskScore?: number;
  summary: string;
  whyFlagged: string[];
  evidenceSources: {
    name: string;
    docType: string;
    ref: string;
    verified: boolean;
  }[];
  aiExplanation: string;
  statutoryRule?: string;
  actionUrl?: string;
  isPublicAccessible: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: CapsuleIntelligenceData | null;
}

export function IntelligenceModal({ isOpen, onClose, data }: Props) {
  const { setAiAssistantOpen } = useUiStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!data) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={data.title}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          {/* Dark Backdrop with Subtle Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-[2px]"
          />

          {/* Centered Modal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-[8px] border border-[#234D6C] bg-[#102F45] text-white shadow-2xl z-10 flex flex-col font-sans"
          >
            {/* Header */}
            <div className="sticky top-0 z-20 flex items-start justify-between border-b border-[#234D6C] bg-[#102F45]/95 backdrop-blur px-6 py-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-[#183B54] px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#E5B45A] border border-[#234D6C]">
                    {data.category}
                  </span>
                  <span className="font-mono text-xs font-bold text-gray-300">
                    {data.tag}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-white font-sans">
                  {data.title}
                </h2>
                <p className="text-xs text-gray-300 font-normal leading-relaxed">
                  {data.location} • {data.subtitle}
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="rounded-[4px] p-1.5 text-gray-400 hover:bg-[#183B54] hover:text-white transition-colors border border-transparent hover:border-[#234D6C] focus:outline-none focus:ring-2 focus:ring-[#D99018]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 space-y-6 text-xs text-gray-200">
              {/* Top Analytical Status Metric Card */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-[6px] border border-[#234D6C] bg-[#183B54]">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
                    {data.metricLabel}
                  </span>
                  <div className="text-2xl font-extrabold font-mono text-white">
                    {data.metricValue}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {data.riskScore !== undefined && (
                    <div className="text-center sm:text-right border-r border-[#234D6C] pr-4">
                      <span className="text-[10px] font-mono text-gray-400 block uppercase">
                        Composite Risk
                      </span>
                      <strong
                        className={`text-2xl font-mono font-extrabold ${
                          data.riskScore >= 80
                            ? 'text-[#C94B4B]'
                            : data.riskScore >= 60
                            ? 'text-[#D99018]'
                            : 'text-[#2E8064]'
                        }`}
                      >
                        {data.riskScore}/100
                      </strong>
                    </div>
                  )}

                  <div className="text-left">
                    <span
                      className={`inline-block px-2.5 py-1 rounded text-[11px] font-mono font-bold ${
                        data.statusVariant === 'critical'
                          ? 'bg-red-950/80 text-[#C94B4B] border border-[#C94B4B]/50'
                          : data.statusVariant === 'saffron'
                          ? 'bg-amber-950/80 text-[#D99018] border border-[#D99018]/50'
                          : 'bg-emerald-950/80 text-[#2E8064] border border-[#2E8064]/50'
                      }`}
                    >
                      {data.statusLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary Description */}
              <div className="p-3.5 rounded bg-[#183B54]/70 border border-[#234D6C] text-xs text-gray-200 leading-relaxed">
                {data.summary}
              </div>

              {/* Why Flagged / Key Signals */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#E5B45A] block">
                  Why Was This Flagged? (Diagnostic Signals)
                </span>
                <div className="space-y-1.5">
                  {data.whyFlagged.map((reason, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 bg-[#183B54] p-2.5 rounded border border-[#234D6C] text-xs text-gray-200"
                    >
                      <CheckCircle2 className="h-4 w-4 text-[#2E8064] flex-shrink-0 mt-0.5" />
                      <span className="leading-snug">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grounded Evidence Sources */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#E5B45A] block">
                  Corroborating Evidence Dossier
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs">
                  {data.evidenceSources.map((ev, i) => (
                    <div
                      key={i}
                      className="p-3 rounded bg-[#183B54] border border-[#234D6C] space-y-1 flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[9px] text-[#D99018] uppercase font-bold block">
                          {ev.docType}
                        </span>
                        <strong className="text-white text-xs block font-sans mt-0.5">
                          {ev.name}
                        </strong>
                      </div>
                      <div className="pt-2 border-t border-[#234D6C] text-[10px] text-gray-400">
                        Ref: {ev.ref}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Explanation & Verified Status */}
              <div className="rounded-[6px] border border-[#234D6C] bg-[#183B54] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#E5B45A] uppercase flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-[#D99018]" />
                    <span>AI Synthesized Diagnostic Assessment</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#2E8064] font-bold">
                    ✓ Evidence Verified
                  </span>
                </div>
                <p className="text-xs text-gray-200 leading-relaxed italic">
                  "{data.aiExplanation}"
                </p>
                {data.statutoryRule && (
                  <p className="text-[10px] text-gray-400 font-mono pt-1">
                    Statutory Rule Reference: <strong>{data.statutoryRule}</strong>
                  </p>
                )}
              </div>

              {/* Public vs Official Boundary Callout */}
              {!data.isPublicAccessible && (
                <div className="p-3 rounded bg-[#183B54]/40 border border-[#234D6C] flex items-center gap-2.5 text-xs text-gray-300">
                  <Lock className="h-4 w-4 text-[#D99018] flex-shrink-0" />
                  <span>
                    Detailed audit sub-ledgers and confidential officer remarks require authorized administrative credentials.
                  </span>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#234D6C]">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setAiAssistantOpen(true);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[4px] bg-[#183B54] border border-[#234D6C] px-3.5 py-2 text-xs font-bold text-gray-200 hover:text-white hover:bg-[#1A415E] transition-colors"
                >
                  <Search className="h-3.5 w-3.5 text-[#D99018]" />
                  <span>Ask Follow-Up Query in Agastya AI</span>
                </button>

                {data.actionUrl && (
                  <Link
                    to={data.actionUrl}
                    onClick={onClose}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-[4px] bg-[#D99018] px-4 py-2 text-xs font-bold text-[#15324A] hover:bg-[#E5B45A] transition-colors shadow-sm"
                  >
                    <span>View Official Workspace</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
