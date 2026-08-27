// Agencies page — frontend/src/pages/Agencies.tsx

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { RiskBadge, LoadingState, ErrorState, EmptyState, PageHeader } from '../components/common';
import { getAgencies } from '../api/agencyApi';
import { formatCurrency, formatRate } from '../utils/formatters';
import type { Agency } from '../types/agency';

export default function Agencies() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    getAgencies({ search: search || undefined })
      .then(setAgencies)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search]);

  return (
    <div className="space-y-5">
      <PageHeader title="Agency Intelligence" subtitle="Analytics aggregated from project records" />

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search agencies..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      {loading ? <LoadingState message="Loading agency data..." /> :
       error ? <ErrorState message={error} onRetry={load} /> :
       !agencies.length ? <EmptyState title="No agencies found" /> : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs font-medium text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-5 py-3">Agency</th>
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-left px-4 py-3">State</th>
                  <th className="text-right px-4 py-3">Projects</th>
                  <th className="text-right px-4 py-3">Total Value</th>
                  <th className="text-right px-4 py-3">Avg Risk</th>
                  <th className="text-left px-4 py-3">Risk Level</th>
                  <th className="text-right px-4 py-3">Delay Rate</th>
                  <th className="text-right px-4 py-3">Cost Deviation</th>
                  <th className="text-right px-4 py-3">High Risk Projects</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {agencies.map((a) => (
                  <tr key={a.agencyId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-slate-800">{a.agencyName}</p>
                      <p className="text-xs text-slate-400">{a.agencyId}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">{a.agencyType}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{a.state}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-700 text-right">{a.totalProjects}</td>
                    <td className="px-4 py-3 text-xs text-slate-600 text-right">{formatCurrency(a.totalValue)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-sm font-bold ${
                        a.avgRiskScore >= 60 ? 'text-red-600' :
                        a.avgRiskScore >= 40 ? 'text-amber-600' : 'text-green-600'
                      }`}>{a.avgRiskScore}</span>
                    </td>
                    <td className="px-4 py-3"><RiskBadge level={a.riskLevel} size="sm" /></td>
                    <td className="px-4 py-3 text-xs text-right text-slate-600">{formatRate(a.delayRate)}</td>
                    <td className="px-4 py-3 text-xs text-right text-slate-600">{formatRate(a.costDeviation)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-sm font-medium ${a.highRiskProjects >= 5 ? 'text-red-600' : 'text-slate-700'}`}>
                        {a.highRiskProjects}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
