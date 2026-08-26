// AgentCard — frontend/src/components/agents/AgentCard.tsx

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { AgentResult } from '../../types/agent';
import { SeverityBadge } from '../common';
import { AGENT_STATUS_COLORS } from '../../utils/riskColors';
import { formatConfidence } from '../../utils/formatters';

interface AgentCardProps {
  agent: AgentResult;
}

export default function AgentCard({ agent }: AgentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const statusStyle = AGENT_STATUS_COLORS[agent.status];

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start justify-between p-4 hover:bg-slate-50 transition-colors text-left"
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Status pill */}
          <span className={`mt-0.5 inline-flex items-center rounded-full text-xs font-semibold px-2 py-0.5 flex-shrink-0 ${statusStyle.bg} ${statusStyle.text}`}>
            {statusStyle.label}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800">{agent.agentName}</p>
            {agent.signals.length > 0 && (
              <p className="text-xs text-slate-500 mt-0.5 truncate">{agent.signals[0]}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-3">
          {agent.applicability && (
            <>
              <div className="text-right">
                <p className="text-lg font-bold text-slate-800">{agent.score}</p>
                <p className="text-xs text-slate-400">Score</p>
              </div>
              <SeverityBadge severity={agent.severity} />
            </>
          )}
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-3">
          {/* Metadata row */}
          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
            <span>Confidence: <strong className="text-slate-700">{formatConfidence(agent.confidence)}</strong></span>
            <span>Applicability: <strong className="text-slate-700">{agent.applicability ? 'Yes' : 'No'}</strong></span>
            <span>Status: <strong className="text-slate-700">{agent.status}</strong></span>
          </div>

          {/* Signals */}
          {agent.signals.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-1.5">Signals</p>
              <ul className="space-y-1">
                {agent.signals.map((signal, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                    {signal}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Evidence */}
          {agent.evidence.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-1.5">Evidence</p>
              <div className="bg-slate-50 rounded-lg p-3 space-y-1">
                {agent.evidence.map((ev, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-slate-500">{ev.label}</span>
                    <span className="font-medium text-slate-800">
                      {ev.value}{ev.unit ? ` ${ev.unit}` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendation */}
          {agent.recommendation && (
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-blue-700 mb-1">Recommended Action</p>
              <p className="text-xs text-blue-600">{agent.recommendation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
