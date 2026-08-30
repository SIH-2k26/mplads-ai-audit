import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShieldAlert,
  CheckCircle2,
  FileText,
  Lock,
  ArrowRight,
  Sparkles,
  Search,
  BookOpen,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUiStore } from '../stores/useUiStore';

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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-[2px]"
          />

          {/* Centered Modal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-[20px] border border-[#E5E3DC] bg-white text-[#0E0E0E] shadow-2xl z-10 flex flex-col font-sans"
          >
            {/* Header */}
            <div className="sticky top-0 z-20 flex items-start justify-between bg-[#002449] px-6 py-4 rounded-t-[20px]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-white border border-white/20">
                    {data.category}
                  </span>
                  <span className="font-mono text-xs font-bold text-white/70">
                    {data.tag}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-white font-sans">
                  {data.title}
                </h2>
                <p className="text-xs text-white/70 font-normal leading-relaxed">
                  {data.location} • {data.subtitle}
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 space-y-4 text-xs text-[#0E0E0E]">
              {/* Top Analytical Status Metric Card */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-[20px] border border-[#E5E3DC] bg-[#F1F0EC]">
                <div className="space-y-0.5 text-center sm:text-left">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6B6B6B]">
                    {data.metricLabel}
                  </span>
                  <div className="text-2xl font-extrabold font-mono text-[#0E0E0E]">
                    {data.metricValue}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {data.riskScore !== undefined && (
                    <div className="text-center sm:text-right border-r border-[#E5E3DC] pr-4">
                      <span className="text-[10px] font-mono text-[#6B6B6B] block uppercase font-bold">
                        Composite Risk
                      </span>
                      <strong
                        className={`text-2xl font-mono font-extrabold ${
                          data.riskScore >= 80
                            ? 'text-red-600'
                            : data.riskScore >= 60
                            ? 'text-orange-600'
                            : 'text-emerald-700'
                        }`}
                      >
                        {data.riskScore}/100
                      </strong>
                    </div>
                  )}

                  <div className="text-left">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[11px] font-mono font-bold ${
                        data.statusVariant === 'critical'
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : data.statusVariant === 'saffron'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {data.statusLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary Description */}
              <div className="p-3.5 rounded-[16px] bg-[#F1F0EC] border border-[#E5E3DC] text-xs text-[#0E0E0E] leading-relaxed">
                {data.summary}
              </div>

              {/* Why Flagged / Key Signals */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6B6B6B] block">
                  Why Was This Flagged? (Diagnostic Signals)
                </span>
                <div className="space-y-1.5">
                  {data.whyFlagged.map((reason, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 bg-[#F1F0EC] p-3 rounded-[12px] border border-[#E5E3DC] text-xs text-[#0E0E0E]"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="leading-snug">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grounded Evidence Sources */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6B6B6B] block">
                  Corroborating Evidence Dossier
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs">
                  {data.evidenceSources.map((ev, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-[16px] bg-[#F1F0EC] border border-[#E5E3DC] space-y-1 flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[9px] text-[#6B6B6B] uppercase font-bold block">
                          {ev.docType}
                        </span>
                        <strong className="text-[#0E0E0E] text-xs block font-sans mt-0.5">
                          {ev.name}
                        </strong>
                      </div>
                      <div className="pt-2 border-t border-[#EAE8E2] text-[10px] text-[#6B6B6B]">
                        Ref: {ev.ref}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Explanation & Verified Status */}
              <div className="rounded-[16px] border border-[#E5E3DC] bg-[#F1F0EC] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#6B6B6B] uppercase flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-[#0E0E0E]" />
                    <span>AI Synthesized Diagnostic Assessment</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ✓ Evidence Verified
                  </span>
                </div>
                <p className="text-xs text-[#0E0E0E] leading-relaxed italic">
                  "{data.aiExplanation}"
                </p>
                {data.statutoryRule && (
                  <p className="text-[10px] text-[#6B6B6B] font-mono pt-1">
                    Statutory Rule Reference: <strong className="text-[#0E0E0E]">{data.statutoryRule}</strong>
                  </p>
                )}
              </div>

              {/* Public vs Official Boundary Callout */}
              {!data.isPublicAccessible && (
                <div className="p-3 rounded-[12px] bg-[#FAFAF9] border border-[#E5E3DC] flex items-center gap-2.5 text-xs text-[#6B6B6B]">
                  <Lock className="h-4 w-4 text-[#6B6B6B] flex-shrink-0" />
                  <span>
                    Detailed audit sub-ledgers and confidential officer remarks require authorized administrative credentials.
                  </span>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#EAE8E2]">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setAiAssistantOpen(true);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white border border-[#E5E3DC] px-4 py-2 text-xs font-semibold text-[#0E0E0E] hover:bg-[#F1F0EC] transition-colors shadow-2xs"
                >
                  <Search className="h-3.5 w-3.5 text-[#6B6B6B]" />
                  <span>Ask Follow-Up Query in Sanchay AI</span>
                </button>

                {data.actionUrl && (
                  <Link
                    to={data.actionUrl}
                    onClick={onClose}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-full bg-[#0E0E0E] px-4 py-2 text-xs font-semibold text-white hover:bg-black transition-colors shadow-2xs"
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
