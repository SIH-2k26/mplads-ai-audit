import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Download } from 'lucide-react';
import { useUiStore } from '../../stores/useUiStore';
import { Button } from '../ui/button';
import { EvidencePanel } from './EvidencePanel';
import { PolicyReferenceCard } from './PolicyReferenceCard';
import { CostBenchmarkCard } from './CostBenchmarkCard';

export function EvidenceDrawer() {
  const { activeEvidenceDrawerItem, closeEvidenceDrawer } = useUiStore();
  const { isOpen, title, project } = activeEvidenceDrawerItem;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end select-none">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeEvidenceDrawer}
            className="fixed inset-0 bg-black/20 backdrop-blur-xs"
          />

          {/* Drawer Body Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative z-10 flex h-full w-full max-w-2xl flex-col bg-white border-l border-[#F1F0EC] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 bg-[#F1F0EC] border-b border-[#E5E3DC] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#9FE870] flex items-center justify-center text-[#0E0E0E] shadow-2xs">
                  <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0E0E0E]">
                    {title || 'Evidence & Regulatory Audit Dossier'}
                  </h3>
                  <p className="text-[11px] font-mono text-[#6B6B6B]">
                    {project ? `${project.code} • ${project.district}` : 'Audited Evidence Dossier'}
                  </p>
                </div>
              </div>

              <button
                onClick={closeEvidenceDrawer}
                className="p-1.5 rounded-full text-[#6B6B6B] hover:text-[#0E0E0E] hover:bg-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {project ? (
                <>
                  <CostBenchmarkCard benchmark={project.costBenchmark} />

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-[#6B6B6B] uppercase tracking-wider px-1">
                      Applicable Statutory Rules
                    </h4>
                    {project.applicableRules.map((rule) => (
                      <PolicyReferenceCard key={rule.ruleId} rule={rule} />
                    ))}
                  </div>

                  <EvidencePanel evidenceItems={project.evidenceItems} />
                </>
              ) : (
                <div className="text-center py-12 text-[#6B6B6B] text-xs">
                  No project dossier selected.
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-[#F1F0EC] border-t border-[#E5E3DC] flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="bg-white hover:bg-[#F1F0EC] text-[#0E0E0E] border border-[#E5E3DC] text-xs font-semibold px-4 py-2 rounded-full cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Certified PDF Dossier</span>
              </button>

              <button
                onClick={closeEvidenceDrawer}
                className="bg-[#0E0E0E] hover:bg-black text-white text-xs font-semibold px-5 py-2 rounded-full cursor-pointer transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
