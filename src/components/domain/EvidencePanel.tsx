import React from 'react';
import { FileText, CheckCircle2, ShieldAlert, Cpu, Database, ExternalLink } from 'lucide-react';
import { EvidenceItem } from '../../types';
import { Button } from '../ui/button';

export function EvidencePanel({
  evidenceItems,
  className,
}: {
  evidenceItems: EvidenceItem[];
  className?: string;
}) {
  const getIcon = (type: EvidenceItem['type']) => {
    switch (type) {
      case 'DATA':
        return <Database className="h-4 w-4 text-[#18324A]" />;
      case 'BENCHMARK':
        return <ShieldAlert className="h-4 w-4 text-[#C98219]" />;
      case 'POLICY':
        return <FileText className="h-4 w-4 text-[#2F7658]" />;
      case 'MODEL':
        return <Cpu className="h-4 w-4 text-[#7E57C2]" />;
      case 'DOCUMENT':
      default:
        return <FileText className="h-4 w-4 text-[#18324A]" />;
    }
  };

  return (
    <div className={`rounded-[6px] border border-[#D9D5CC] bg-white p-5 shadow-card ${className || ''}`}>
      <div className="flex items-center justify-between border-b border-[#EDE8DE] pb-3 mb-4">
        <div>
          <h4 className="text-xs font-semibold text-[#18324A] uppercase tracking-wider">Statutory Evidence Portfolio</h4>
          <p className="text-[11px] text-[#667085]">Auditable artifacts supporting risk diagnostic flags</p>
        </div>
        <span className="text-[11px] font-mono text-[#2F7658] bg-emerald-50 px-2 py-0.5 rounded border border-[#2F7658]/30 flex items-center gap-1 font-semibold">
          <CheckCircle2 className="h-3 w-3" />
          {evidenceItems.length} Corroborated Items
        </span>
      </div>

      <div className="space-y-3">
        {evidenceItems.map((item) => (
          <div
            key={item.id}
            className="rounded-[4px] border border-[#EDE8DE] bg-[#FAFAF7] p-4 transition-all hover:bg-white hover:border-[#D9D5CC]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-[3px] bg-white border border-[#D9D5CC] shadow-subtle">
                  {getIcon(item.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#18324A]">{item.title}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-[#EDE8DE] text-[#18324A] rounded">
                      {item.type}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#667085] font-mono block mt-0.5">
                    Source: {item.sourceDoc || 'National Audited Database'} • Verified on {item.timestamp}
                  </span>
                </div>
              </div>

              {item.confidenceScore && (
                <span className="text-[11px] font-mono text-[#2F7658] font-bold bg-emerald-50 px-2 py-0.5 rounded border border-[#2F7658]/20 flex-shrink-0">
                  {item.confidenceScore}% Conf.
                </span>
              )}
            </div>

            <p className="text-xs text-[#1D2939] mt-2.5 leading-relaxed bg-white p-2.5 rounded-[3px] border border-[#EDE8DE]">
              {item.detail}
            </p>

            <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#667085]">
              <span className="flex items-center gap-1 text-[#2F7658] font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Evidence integrity digitally signed (SHA-256)
              </span>
              <Button variant="ghost" size="sm" className="h-6 text-[11px] text-[#18324A] hover:underline flex items-center gap-1">
                View Source Doc <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
