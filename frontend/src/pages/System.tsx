// System page — frontend/src/pages/System.tsx

import { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, XCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import { PageHeader, LoadingState, ErrorState } from '../components/common';
import { getSystemHealth } from '../api/systemApi';
import type { SystemHealth, ServiceStatus } from '../types/system';
import { formatDateTime } from '../utils/formatters';

const StatusIcon = ({ status }: { status: ServiceStatus }) => {
  switch (status) {
    case 'UP': return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'DOWN': return <XCircle className="w-5 h-5 text-red-500" />;
    case 'DEGRADED': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    default: return <HelpCircle className="w-5 h-5 text-slate-400" />;
  }
};

const STATUS_LABELS: Record<ServiceStatus, string> = {
  UP: 'Operational', DOWN: 'Down', DEGRADED: 'Degraded', UNKNOWN: 'Unknown',
};

export default function System() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    getSystemHealth()
      .then(setHealth)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load system health'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const services = health ? [
    health.backend,
    health.database,
    health.vectorDatabase,
    health.neo4j,
    health.mlService,
    health.ragService,
  ] : [];

  return (
    <div className="space-y-5">
      <PageHeader
        title="System Health"
        subtitle="Developer monitoring — API health and service status"
        actions={
          <button
            onClick={load}
            className="flex items-center gap-1.5 px-3 py-2 text-xs border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        }
      />

      {loading ? <LoadingState message="Checking services..." /> :
       error ? <ErrorState message={error} onRetry={load} /> :
       !health ? null : (
        <div className="space-y-5">
          {/* Overall status banner */}
          <div className={`rounded-xl border p-4 flex items-center gap-3 ${
            health.overallStatus === 'UP' ? 'bg-green-50 border-green-200' :
            health.overallStatus === 'DOWN' ? 'bg-red-50 border-red-200' :
            'bg-amber-50 border-amber-200'
          }`}>
            <StatusIcon status={health.overallStatus} />
            <div>
              <p className="text-sm font-semibold text-slate-800">
                System Status: {STATUS_LABELS[health.overallStatus]}
              </p>
              <p className="text-xs text-slate-500">Last checked: {formatDateTime(health.checkedAt)}</p>
            </div>
          </div>

          {/* Services grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((svc) => (
              <div key={svc.name} className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-slate-800">{svc.name}</p>
                  <StatusIcon status={svc.status} />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Status</span>
                    <span className={`font-medium ${
                      svc.status === 'UP' ? 'text-green-600' :
                      svc.status === 'DOWN' ? 'text-red-600' : 'text-amber-600'
                    }`}>{STATUS_LABELS[svc.status]}</span>
                  </div>
                  {svc.latencyMs !== undefined && (
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Latency</span>
                      <span className="font-medium text-slate-700">{svc.latencyMs} ms</span>
                    </div>
                  )}
                  {svc.version && (
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Version</span>
                      <span className="font-mono text-slate-600">{svc.version}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Version info */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-800 mb-4">Version Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { label: 'ML Model Version', value: health.modelVersion },
                { label: 'Risk Engine Version', value: health.riskEngineVersion },
                { label: 'Rule Version', value: health.ruleVersion },
                { label: 'Embedding Version', value: health.embeddingVersion },
                { label: 'Last Data Update', value: health.lastDataUpdate ? formatDateTime(health.lastDataUpdate) : undefined },
              ].filter((x) => x.value).map((item) => (
                <div key={item.label} className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-400">{item.label}</p>
                  <p className="text-xs font-mono font-medium text-slate-700 mt-0.5 break-all">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* API Health indicator */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-800 mb-4">API Configuration</h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">API Base URL</span>
                <span className="font-mono text-slate-700">{import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Mock API</span>
                <span className={`font-medium ${import.meta.env.VITE_USE_MOCK_API === 'true' ? 'text-amber-600' : 'text-green-600'}`}>
                  {import.meta.env.VITE_USE_MOCK_API === 'true' ? 'Enabled (development mode)' : 'Disabled (live backend)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Frontend Build</span>
                <span className="font-mono text-slate-600">{import.meta.env.MODE}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
