// Evidence Card — frontend/src/components/evidence/EvidenceCard.tsx

import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, ExternalLink } from 'lucide-react';
import type { PolicyEvidenceItem } from '../../types/case';
import { formatPercent } from '../../utils/formatters';

interface Props {
  evidence: PolicyEvidenceItem;
  index: number;
}

export default function EvidenceCard({ evidence, index }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start justify-between p-4 hover:bg-slate-50 transition-colors text-left"
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 leading-tight">{evidence.applicableRule}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {evidence.sourceDocument}
              {evidence.section && ` · ${evidence.section}`}
              {evidence.page && ` · Page ${evidence.page}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
            {formatPercent(evidence.confidence * 100, 0)} confidence
          </span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-100 pt-3">
          <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-3 mb-3">
            <p className="text-xs font-semibold text-amber-700 mb-1">Policy Evidence (RAG Retrieved)</p>
            <p className="text-sm text-amber-900 leading-relaxed italic">"{evidence.evidence}"</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
            {evidence.effectiveDate && (
              <div>
                <span className="text-slate-400">Effective Date: </span>
                <strong>{evidence.effectiveDate}</strong>
              </div>
            )}
            <div>
              <span className="text-slate-400">Confidence: </span>
              <strong>{formatPercent(evidence.confidence * 100, 1)}</strong>
            </div>
          </div>

          {evidence.sourceUrl && (
            <a
              href={evidence.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-xs text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              View Source Document
            </a>
          )}
        </div>
      )}
    </div>
  );
}
