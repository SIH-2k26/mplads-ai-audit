import React from 'react';
import { EvidenceItem } from '../../types';
import { ShieldCheck, ShieldAlert, Cpu, FileText, Database, Shield } from 'lucide-react';

interface EvidencePanelProps {
  evidenceItems: EvidenceItem[];
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({ evidenceItems }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'MODEL':
        return <Cpu className="w-4 h-4 text-[#0E0E0E]" />;
      case 'DOCUMENT':
        return <FileText className="w-4 h-4 text-[#0E0E0E]" />;
      case 'DATA':
        return <Database className="w-4 h-4 text-[#0E0E0E]" />;
      default:
        return <Shield className="w-4 h-4 text-[#0E0E0E]" />;
    }
  };

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold text-[#6B6B6B] uppercase tracking-wider px-1">
        Verified Forensic Evidence Checklist
      </h4>
      <div className="space-y-2.5">
        {evidenceItems.map((item) => (
          <div
            key={item.id}
            className="bg-[#F1F0EC] p-4 rounded-[20px] border border-[#E5E3DC] flex items-start justify-between gap-3"
          >
            <div className="flex gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-[#E5E3DC] shrink-0 mt-0.5">
                {getIcon(item.type)}
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-[#0E0E0E]">{item.title}</span>
                  <span className="text-[9px] font-mono bg-white px-1.5 py-0.5 rounded border border-[#E5E3DC] text-[#6B6B6B]">
                    {item.type}
                  </span>
                </div>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">{item.detail}</p>
                {item.sourceDoc && (
                  <div className="text-[10px] text-gray-500 font-mono">
                    Source: {item.sourceDoc} {item.pageSection && `• ${item.pageSection}`}
                  </div>
                )}
                <div className="text-[9px] text-gray-400 font-mono">
                  Timestamp: {item.timestamp}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5 shrink-0">
              {item.verified ? (
                <span className="bg-[#15803D]/15 text-[#15803D] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#15803D]/30 shadow-2xs">
                  <ShieldCheck className="w-3 h-3 text-[#15803D]" />
                  <span>Verified</span>
                </span>
              ) : (
                <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-orange-200">
                  <ShieldAlert className="w-3 h-3" />
                  <span>Pending</span>
                </span>
              )}
              {item.confidenceScore && (
                <span className="text-[10px] font-bold text-[#0E0E0E] font-mono">
                  {item.confidenceScore}% Conf
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
