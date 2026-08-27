import React from 'react';
import { X, ShieldCheck, FileText, Download } from 'lucide-react';
import { useUiStore } from '../../stores/useUiStore';
import { Button } from '../ui/button';
import { EvidencePanel } from './EvidencePanel';
import { PolicyReferenceCard } from './PolicyReferenceCard';
import { CostBenchmarkCard } from './CostBenchmarkCard';

export function EvidenceDrawer() {
  const { activeEvidenceDrawerItem, closeEvidenceDrawer } = useUiStore();
  const { isOpen, title, project } = activeEvidenceDrawerItem;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-none transition-opacity animate-in fade-in duration-200">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={closeEvidenceDrawer} />

      {/* Slide-in Drawer Container */}
      <div className="relative z-10 flex h-full w-full max-w-2xl flex-col bg-[#F7F5F0] shadow-2xl border-l border-[#D9D5CC] overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[#D9D5CC] bg-white px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-[4px] bg-[#18324A] text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#18324A] leading-tight">
                {title || 'Evidence & Regulatory Audit Dossier'}
              </h3>
              <p className="text-xs text-[#667085] font-mono">
                {project ? `${project.code} • ${project.district}` : 'Audited Evidence Dossier'}
              </p>
            </div>
          </div>
          <button
            onClick={closeEvidenceDrawer}
            className="rounded-[4px] p-1.5 text-[#667085] hover:bg-[#EDE8DE] hover:text-[#18324A]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {project && (
            <>
              {/* Cost Benchmark Section */}
              <CostBenchmarkCard benchmark={project.costBenchmark} />

              {/* Policy Reference Citations */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-[#18324A] uppercase tracking-wider">Applicable Statutory Rules</h4>
                {project.applicableRules.map((rule) => (
                  <PolicyReferenceCard key={rule.ruleId} rule={rule} />
                ))}
              </div>

              {/* Detailed Evidence Portfolio */}
              <EvidencePanel evidenceItems={project.evidenceItems} />
            </>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="flex items-center justify-between border-t border-[#D9D5CC] bg-white px-6 py-3.5">
          <Button variant="outline" size="sm" className="text-xs flex items-center gap-1.5" onClick={() => window.print()}>
            <Download className="h-3.5 w-3.5" />
            Export Certified PDF Dossier
          </Button>
          <Button variant="default" size="sm" onClick={closeEvidenceDrawer}>
            Close Dossier
          </Button>
        </div>
      </div>
    </div>
  );
}
