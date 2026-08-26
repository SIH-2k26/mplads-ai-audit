// Projects page — frontend/src/pages/Projects.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import {
  RiskBadge, StatusBadge, LoadingState, ErrorState, EmptyState, PageHeader,
} from '../components/common';
import { useProjects } from '../hooks/useProject';
import { MOCK_STATE_LIST } from '../mocks/mockProjects';
import { formatCurrency, formatPercent, formatDate } from '../utils/formatters';
import type { ProjectFilters, RiskLevel, ProjectStatus } from '../types/project';

const RISK_LEVELS: RiskLevel[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const STATUSES: ProjectStatus[] = [
  'RECOMMENDED', 'SANCTIONED', 'WORK_IN_PROGRESS', 'COMPLETED', 'LAPSED', 'SUSPENDED',
];
const STATUS_LABELS: Record<string, string> = {
  RECOMMENDED: 'Recommended', SANCTIONED: 'Sanctioned',
  WORK_IN_PROGRESS: 'In Progress', COMPLETED: 'Completed',
  LAPSED: 'Lapsed', SUSPENDED: 'Suspended',
};

export default function Projects() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ProjectFilters>({ page: 1, pageSize: 20 });
  const [search, setSearch] = useState('');
  const { result, loading, error, retry } = useProjects({ ...filters, search: search || undefined });

  const updateFilter = <K extends keyof ProjectFilters>(key: K, value: ProjectFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Projects"
        subtitle={result ? `${result.total} projects found` : 'MPLADS Project Registry'}
      />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search project ID, name, state..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* State */}
          <select
            value={filters.state ?? ''}
            onChange={(e) => updateFilter('state', e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All States</option>
            {MOCK_STATE_LIST.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          {/* Risk Level */}
          <select
            value={filters.riskLevel ?? ''}
            onChange={(e) => updateFilter('riskLevel', e.target.value as RiskLevel)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Risk Levels</option>
            {RISK_LEVELS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>

          {/* Status */}
          <select
            value={filters.status ?? ''}
            onChange={(e) => updateFilter('status', e.target.value as ProjectStatus)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>

          {/* Clear */}
          <button
            onClick={() => { setFilters({ page: 1, pageSize: 20 }); setSearch(''); }}
            className="px-3 py-2 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <LoadingState message="Loading projects..." />
        ) : error ? (
          <ErrorState message={error} onRetry={retry} />
        ) : !result?.items.length ? (
          <EmptyState title="No projects found" description="Try adjusting your search or filters." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs font-medium text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-5 py-3">Project ID</th>
                  <th className="text-left px-4 py-3">Project</th>
                  <th className="text-left px-4 py-3">Location</th>
                  <th className="text-left px-4 py-3">Agency</th>
                  <th className="text-right px-4 py-3">Sanctioned</th>
                  <th className="text-right px-4 py-3">Spent</th>
                  <th className="text-right px-4 py-3">Progress</th>
                  <th className="text-right px-4 py-3">Risk</th>
                  <th className="text-left px-4 py-3">Level</th>
                  <th className="text-left px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {result.items.map((p) => (
                  <tr
                    key={p.projectId}
                    onClick={() => navigate(`/projects/${encodeURIComponent(p.projectId)}`)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3 text-xs font-mono text-slate-500 whitespace-nowrap">{p.projectId}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-800 max-w-[220px] truncate">{p.projectName}</p>
                      <p className="text-xs text-slate-400">{p.category}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">
                      {p.district}<br />{p.state}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 max-w-[160px] truncate">{p.agency}</td>
                    <td className="px-4 py-3 text-xs text-right font-medium text-slate-700 whitespace-nowrap">
                      {formatCurrency(p.sanctionedAmount)}
                    </td>
                    <td className="px-4 py-3 text-xs text-right text-slate-600 whitespace-nowrap">
                      {formatCurrency(p.expenditure)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="text-xs text-slate-600">
                        <span className="text-blue-600 font-medium">{formatPercent(p.financialProgress)}</span>
                        {' / '}
                        <span className="text-green-600 font-medium">{formatPercent(p.physicalProgress)}</span>
                      </div>
                      <div className="text-xs text-slate-400">fin / phy</div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-sm font-bold ${
                        p.riskScore >= 80 ? 'text-rose-700' :
                        p.riskScore >= 60 ? 'text-red-600' :
                        p.riskScore >= 40 ? 'text-amber-600' : 'text-green-600'
                      }`}>{p.riskScore}</span>
                    </td>
                    <td className="px-4 py-3"><RiskBadge level={p.riskLevel} size="sm" /></td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {result && result.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
            <p className="text-xs text-slate-400">
              Showing {result.items.length} of {result.total}
            </p>
            <div className="flex gap-2">
              <button
                disabled={result.page <= 1}
                onClick={() => updateFilter('page', result.page - 1)}
                className="px-3 py-1.5 text-xs border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="px-3 py-1.5 text-xs text-slate-600">
                Page {result.page} / {result.totalPages}
              </span>
              <button
                disabled={result.page >= result.totalPages}
                onClick={() => updateFilter('page', result.page + 1)}
                className="px-3 py-1.5 text-xs border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
