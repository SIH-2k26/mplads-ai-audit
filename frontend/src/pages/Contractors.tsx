// Contractors page — frontend/src/pages/Contractors.tsx
// IMPORTANT: Language is neutral. Displays "risk indicators" not judgements.

import { useState, useEffect } from 'react';
import { Search, AlertTriangle } from 'lucide-react';
import { RiskBadge, LoadingState, ErrorState, EmptyState, PageHeader } from '../components/common';
import { getContractors } from '../api/contractorApi';
import { formatCurrency, formatRate } from '../utils/formatters';
import type { Contractor } from '../types/contractor';

export default function Contractors() {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = (q?: string) => {
    setLoading(true);
    getContractors({ search: q || undefined })
      .then(setContractors)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(search); }, [search]);

  return (
    <div className="space-y-5">
      <PageHeader title="Contractor Intelligence" subtitle="Risk indicators are aggregated from project data" />

      {/* Disclaimer */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <strong>Note:</strong> This page displays risk indicators derived from project data.
        Risk indicators do not constitute judgements on contractors.
        All assessments are based on objective project metrics computed by the backend.
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search contractors..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      {/* Grid */}
      {loading ? <LoadingState message="Loading contractor data..." /> :
       error ? <ErrorState message={error} onRetry={() => load(search)} /> :
       !contractors.length ? <EmptyState title="No contractors found" /> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {contractors.map((c) => (
            <div key={c.contractorId} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{c.contractorName}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{c.contractorId}</p>
                  </div>
                  <RiskBadge level={c.riskLevel} />
                </div>

                {/* Metrics grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Projects', value: c.totalProjects },
                    { label: 'Total Value', value: formatCurrency(c.totalProjectValue) },
                    { label: 'Avg Risk Score', value: c.avgRiskScore },
                    { label: 'Delay Rate', value: formatRate(c.delayRate) },
                    { label: 'Cost Anomaly', value: formatRate(c.costAnomalyRate) },
                    { label: 'Payment Anomaly', value: formatRate(c.paymentAnomalyRate) },
                  ].map((m) => (
                    <div key={m.label} className="bg-slate-50 rounded-lg p-2.5">
                      <p className="text-xs text-slate-400">{m.label}</p>
                      <p className="text-sm font-semibold text-slate-800 mt-0.5">{m.value}</p>
                    </div>
                  ))}
                </div>

                {/* States */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {c.states.map((s) => (
                    <span key={s} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>

                {/* Risk Indicators */}
                {c.riskIndicators.length > 0 && (
                  <button
                    onClick={() => setExpanded(expanded === c.contractorId ? null : c.contractorId)}
                    className="flex items-center gap-1.5 text-xs text-amber-700 font-medium hover:text-amber-900"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {c.riskIndicators.filter((r) => r.flagged).length} risk indicator(s) detected
                  </button>
                )}
              </div>

              {/* Expanded risk indicators */}
              {expanded === c.contractorId && c.riskIndicators.length > 0 && (
                <div className="border-t border-slate-100 px-5 py-4 bg-amber-50">
                  <p className="text-xs font-semibold text-amber-700 mb-2 uppercase tracking-wider">
                    Risk Indicators (Computed by Backend)
                  </p>
                  <div className="space-y-2">
                    {c.riskIndicators.map((ri, i) => (
                      <div key={i} className={`flex items-center justify-between text-xs rounded-lg px-3 py-2 ${ri.flagged ? 'bg-amber-100 text-amber-800' : 'bg-white text-slate-600'}`}>
                        <span>{ri.label}</span>
                        <span className="font-semibold">{ri.value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-amber-600 mt-2">
                    Risk indicators reflect patterns in project data, not personal judgements.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
