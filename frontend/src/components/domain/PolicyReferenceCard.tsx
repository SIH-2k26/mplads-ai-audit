import React from 'react';
import { ApplicableRule } from '../../types';
import { BookOpen, ShieldAlert } from 'lucide-react';

interface PolicyReferenceCardProps {
  rule: ApplicableRule;
}

export const PolicyReferenceCard: React.FC<PolicyReferenceCardProps> = ({ rule }) => {
  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="bg-[#F1F0EC] p-5 rounded-[20px] border border-[#E5E3DC] space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#0E0E0E]" />
          <h4 className="text-sm font-bold text-[#0E0E0E]">
            {rule.ruleId}: {rule.documentTitle}
          </h4>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSeverityBadge(rule.severity)}`}>
          {rule.severity}
        </span>
      </div>

      <div className="space-y-1">
        <div className="text-xs text-[#6B6B6B]">
          Location: <span className="font-mono text-[#0E0E0E]">{rule.section} (Page {rule.page})</span>
        </div>
        <p className="text-xs font-medium text-[#0E0E0E]">{rule.summary}</p>
      </div>

      <div className="p-3 bg-white rounded-xl border border-[#E5E3DC] text-xs italic text-[#6B6B6B] leading-relaxed">
        "{rule.quote}"
      </div>
    </div>
  );
};
