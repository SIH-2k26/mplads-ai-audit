// Alerts page — frontend/src/pages/Alerts.tsx

import { useState } from 'react';
import { Bell, ChevronDown, ChevronUp } from 'lucide-react';
import {
  SeverityBadge, StatusBadge, LoadingState, ErrorState, EmptyState, PageHeader,
} from '../components/common';
import { formatDateTime } from '../utils/formatters';
import type { AlertFilters, Alert, AlertSeverity, AlertStatus } from '../types/alert';
import { getAlerts } from '../api/alertApi';
import { useEffect } from 'react';

const SEVERITIES: AlertSeverity[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const STATUSES: AlertStatus[] = ['NEW', 'UNDER_REVIEW', 'ESCALATED', 'RESOLVED', 'FALSE_POSITIVE'];

export default function Alerts() {
  const [filters, setFilters] = useState<AlertFilters>({});
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    getAlerts(filters)
      .then((r) => setAlerts(r.items))
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load alerts'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [JSON.stringify(filters)]);

  const updateFilter = <K extends keyof AlertFilters>(k: K, v: AlertFilters[K]) => {
    setFilters((prev) => ({ ...prev, [k]: v || undefined }));
  };

  const SEV_COLORS: Record<string, string> = {
    LOW: 'text-green-600 bg-green-50 border-green-200',
    MEDIUM: 'text-amber-700 bg-amber-50 border-amber-200',
    HIGH: 'text-red-700 bg-red-50 border-red-200',
    CRITICAL: 'text-rose-800 bg-rose-50 border-rose-300',
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Alerts" subtitle={`${alerts.length} active alerts`} />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-3">
        <select value={filters.severity ?? ''} onChange={(e) => updateFilter('severity', e.target.value as AlertSeverity)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Severities</option>
          {SEVERITIES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={filters.status ?? ''} onChange={(e) => updateFilter('status', e.target.value as AlertStatus)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s}>{s.replace('_', ' ')}</option>)}
        </select>
        <button onClick={() => setFilters({})}
          className="px-3 py-2 text-sm text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          Clear
        </button>
      </div>

      {/* Alert list */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <LoadingState message="Loading alerts..." />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : !alerts.length ? (
          <EmptyState title="No alerts" description="No alerts match current filters." />
        ) : (
          <div className="divide-y divide-slate-50">
            {/* Header */}
            <div className="grid grid-cols-12 text-xs font-medium text-slate-400 uppercase tracking-wider bg-slate-50 px-5 py-3">
              <span className="col-span-2">Alert ID</span>
              <span className="col-span-3">Project</span>
              <span className="col-span-2">Type</span>
              <span className="col-span-1">Severity</span>
              <span className="col-span-1 text-right">Risk</span>
              <span className="col-span-1">Status</span>
              <span className="col-span-2 text-right">Created</span>
            </div>

            {alerts.map((alert) => (
              <div key={alert.alertId}>
                <button
                  onClick={() => setExpanded(expanded === alert.alertId ? null : alert.alertId)}
                  className="w-full grid grid-cols-12 items-center gap-2 px-5 py-3 hover:bg-slate-50 transition-colors text-left"
                >
                  <span className="col-span-2 text-xs font-mono text-slate-500">{alert.alertId}</span>
                  <div className="col-span-3">
                    <p className="text-sm font-medium text-slate-800 truncate">{alert.projectName}</p>
                    <p className="text-xs text-slate-400">{alert.district}, {alert.state}</p>
                  </div>
                  <span className="col-span-2 text-xs text-slate-600">{alert.alertType.replace(/_/g, ' ')}</span>
                  <span className="col-span-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${SEV_COLORS[alert.severity]}`}>
                      {alert.severity}
                    </span>
                  </span>
                  <span className={`col-span-1 text-sm font-bold text-right ${
                    alert.riskScore >= 80 ? 'text-rose-700' :
                    alert.riskScore >= 60 ? 'text-red-600' :
                    alert.riskScore >= 40 ? 'text-amber-600' : 'text-green-600'
                  }`}>{alert.riskScore}</span>
                  <span className="col-span-1"><StatusBadge status={alert.status} /></span>
                  <span className="col-span-2 text-xs text-slate-400 text-right">
                    {formatDateTime(alert.createdAt)}
                    {expanded === alert.alertId ? <ChevronUp className="w-3 h-3 inline ml-1" /> : <ChevronDown className="w-3 h-3 inline ml-1" />}
                  </span>
                </button>

                {/* Expanded detail */}
                {expanded === alert.alertId && (
                  <div className="px-5 pb-4 bg-slate-50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1.5 uppercase">Trigger</p>
                      <p className="text-sm text-slate-700">{alert.trigger}</p>
                      {alert.agentName && (
                        <p className="text-xs text-slate-400 mt-1">Agent: {alert.agentName}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1.5 uppercase">Evidence</p>
                      <ul className="space-y-1">
                        {alert.evidence.map((e, i) => (
                          <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-400 flex-shrink-0" />
                            {e}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1.5 uppercase">Recommended Action</p>
                      <p className="text-sm text-slate-700">{alert.recommendedAction}</p>
                      <p className="text-xs text-slate-400 mt-2">Risk Contribution: {(alert.riskContribution * 100).toFixed(0)}%</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
