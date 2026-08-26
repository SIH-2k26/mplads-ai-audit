// Dashboard page — frontend/src/pages/Dashboard.tsx

import { useNavigate } from 'react-router-dom';
import {
  FolderKanban, IndianRupee, TrendingUp,
  AlertTriangle, Clock, Bell,
} from 'lucide-react';
import {
  MetricCard, RiskBadge, StatusBadge, LoadingState, ErrorState, PageHeader,
} from '../components/common';
import {
  RiskDistributionChart, StateRiskChart, RiskTrendChart,
} from '../components/charts';
import { useDashboardStats, useRecentProjects } from '../hooks/useProject';
import { useRiskDistribution, useStateRiskSummary, useRiskTrend } from '../hooks/useRisk';
import { formatCurrency, formatDate } from '../utils/formatters';
import type { ProjectSummary } from '../types/project';

export default function Dashboard() {
  const navigate = useNavigate();
  const { stats, loading: statsLoading, error: statsError, retry: retryStats } = useDashboardStats();
  const { projects, loading: projLoading } = useRecentProjects(6);
  const { distribution } = useRiskDistribution();
  const { data: stateRisk } = useStateRiskSummary();
  const { trend } = useRiskTrend();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Dashboard"
        subtitle="MPLADS Risk Monitoring — Overview"
        actions={
          <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">
            Mock Data Active
          </span>
        }
      />

      {/* Stats grid */}
      {statsLoading ? (
        <LoadingState message="Loading statistics..." />
      ) : statsError ? (
        <ErrorState message={statsError} onRetry={retryStats} />
      ) : stats ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            title="Total Projects"
            value={stats.totalProjects.toLocaleString()}
            icon={<FolderKanban className="w-5 h-5" />}
          />
          <MetricCard
            title="Sanctioned Amount"
            value={formatCurrency(stats.totalSanctionedAmount)}
            icon={<IndianRupee className="w-5 h-5" />}
          />
          <MetricCard
            title="Total Expenditure"
            value={formatCurrency(stats.totalExpenditure)}
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <MetricCard
            title="Active Alerts"
            value={stats.activeAlerts}
            accent="red"
            icon={<Bell className="w-5 h-5 text-red-400" />}
          />
          <MetricCard
            title="High Risk Projects"
            value={stats.highRiskProjects}
            accent="red"
            icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
          />
          <MetricCard
            title="Medium Risk"
            value={stats.mediumRiskProjects}
            accent="amber"
          />
          <MetricCard
            title="Low Risk"
            value={stats.lowRiskProjects}
            accent="green"
          />
          <MetricCard
            title="Predicted Delays"
            value={stats.predictedDelays}
            accent="amber"
            icon={<Clock className="w-5 h-5 text-amber-400" />}
          />
        </div>
      ) : null}

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Risk Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Risk Distribution</h2>
          {distribution ? (
            <RiskDistributionChart distribution={distribution} />
          ) : (
            <LoadingState />
          )}
        </div>

        {/* State Risk */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">State-wise Avg Risk Score</h2>
          {stateRisk.length > 0 ? (
            <StateRiskChart data={stateRisk} />
          ) : (
            <LoadingState />
          )}
        </div>

        {/* Risk Trend */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">National Risk Trend</h2>
          {trend.length > 0 ? (
            <RiskTrendChart trend={trend} />
          ) : (
            <LoadingState />
          )}
        </div>
      </div>

      {/* Recent high-risk projects */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">Recent Projects — All</h2>
          <button
            onClick={() => navigate('/projects')}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            View all →
          </button>
        </div>

        {projLoading ? (
          <LoadingState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs font-medium text-slate-400 uppercase tracking-wider bg-slate-50">
                  <th className="text-left px-5 py-3">Project ID</th>
                  <th className="text-left px-4 py-3">Project Name</th>
                  <th className="text-left px-4 py-3">District / State</th>
                  <th className="text-right px-4 py-3">Risk Score</th>
                  <th className="text-left px-4 py-3">Risk Level</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {projects.map((p: ProjectSummary) => (
                  <tr
                    key={p.projectId}
                    onClick={() => navigate(`/projects/${encodeURIComponent(p.projectId)}`)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3 text-xs font-mono text-slate-500">{p.projectId}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-800 max-w-xs truncate">{p.projectName}</p>
                      <p className="text-xs text-slate-400">{p.agency}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">{p.district}, {p.state}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-sm font-bold ${
                        p.riskScore >= 80 ? 'text-rose-700' :
                        p.riskScore >= 60 ? 'text-red-600' :
                        p.riskScore >= 40 ? 'text-amber-600' : 'text-green-600'
                      }`}>{p.riskScore}</span>
                    </td>
                    <td className="px-4 py-3"><RiskBadge level={p.riskLevel} size="sm" /></td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3 text-xs text-slate-400">{formatDate(p.lastUpdated)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
