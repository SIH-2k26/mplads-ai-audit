// Common components — frontend/src/components/common/index.tsx

// MetricCard
interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  accent?: 'default' | 'red' | 'amber' | 'green' | 'blue';
  trend?: { value: string; direction: 'up' | 'down' | 'neutral' };
}

const accentStyles = {
  default: 'border-slate-200 bg-white',
  red: 'border-red-200 bg-red-50',
  amber: 'border-amber-200 bg-amber-50',
  green: 'border-green-200 bg-green-50',
  blue: 'border-blue-200 bg-blue-50',
};

export function MetricCard({ title, value, subtitle, icon, accent = 'default', trend }: MetricCardProps) {
  return (
    <div className={`rounded-xl border p-5 ${accentStyles[accent]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          {trend && (
            <p className={`text-xs mt-1 font-medium ${
              trend.direction === 'up' ? 'text-red-600' :
              trend.direction === 'down' ? 'text-green-600' : 'text-slate-500'
            }`}>
              {trend.value}
            </p>
          )}
        </div>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
    </div>
  );
}

// RiskBadge
import type { RiskLevel } from '../../types/project';
import { RISK_COLORS } from '../../utils/riskColors';

interface RiskBadgeProps { level: RiskLevel; size?: 'sm' | 'md' }

export function RiskBadge({ level, size = 'md' }: RiskBadgeProps) {
  const c = RISK_COLORS[level];
  const sz = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${sz} ${c.bg} ${c.text} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {level}
    </span>
  );
}

// SeverityBadge
import type { AgentSeverity } from '../../types/agent';
import { SEVERITY_COLORS } from '../../utils/riskColors';

interface SeverityBadgeProps { severity: AgentSeverity }

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const c = SEVERITY_COLORS[severity];
  return (
    <span className={`inline-flex items-center rounded-full text-xs font-semibold px-2.5 py-0.5 ${c.bg} ${c.text}`}>
      {severity}
    </span>
  );
}

// StatusBadge
const STATUS_STYLES: Record<string, string> = {
  WORK_IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-200',
  COMPLETED: 'bg-green-50 text-green-700 border-green-200',
  SANCTIONED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  RECOMMENDED: 'bg-purple-50 text-purple-700 border-purple-200',
  LAPSED: 'bg-red-50 text-red-700 border-red-200',
  SUSPENDED: 'bg-amber-50 text-amber-700 border-amber-200',
  TERMINATED: 'bg-gray-100 text-gray-600 border-gray-300',
  NEW: 'bg-blue-50 text-blue-700 border-blue-200',
  UNDER_REVIEW: 'bg-amber-50 text-amber-700 border-amber-200',
  ESCALATED: 'bg-red-50 text-red-700 border-red-200',
  RESOLVED: 'bg-green-50 text-green-700 border-green-200',
  FALSE_POSITIVE: 'bg-gray-50 text-gray-600 border-gray-200',
  OPEN: 'bg-blue-50 text-blue-700 border-blue-200',
  UNDER_INVESTIGATION: 'bg-amber-50 text-amber-700 border-amber-200',
  PENDING_REVIEW: 'bg-purple-50 text-purple-700 border-purple-200',
  CLOSED: 'bg-green-50 text-green-700 border-green-200',
  ARCHIVED: 'bg-gray-50 text-gray-500 border-gray-200',
};

const STATUS_LABELS: Record<string, string> = {
  WORK_IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  SANCTIONED: 'Sanctioned',
  RECOMMENDED: 'Recommended',
  LAPSED: 'Lapsed',
  SUSPENDED: 'Suspended',
  TERMINATED: 'Terminated',
  NEW: 'New',
  UNDER_REVIEW: 'Under Review',
  ESCALATED: 'Escalated',
  RESOLVED: 'Resolved',
  FALSE_POSITIVE: 'False Positive',
  OPEN: 'Open',
  UNDER_INVESTIGATION: 'Investigating',
  PENDING_REVIEW: 'Pending Review',
  CLOSED: 'Closed',
  ARCHIVED: 'Archived',
};

interface StatusBadgeProps { status: string }

export function StatusBadge({ status }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] ?? 'bg-gray-50 text-gray-600 border-gray-200';
  return (
    <span className={`inline-flex items-center rounded-full text-xs font-medium px-2.5 py-0.5 border ${style}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

// LoadingState
interface LoadingStateProps { message?: string }

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
      <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-3" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

// ErrorState
interface ErrorStateProps { message: string; onRetry?: () => void }

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-500">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
        <span className="text-red-500 text-xl">⚠</span>
      </div>
      <p className="text-sm font-medium text-slate-700 mb-1">Unable to load data</p>
      <p className="text-xs text-slate-400 mb-4 max-w-xs text-center">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-xs font-medium bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}

// EmptyState
interface EmptyStateProps { title: string; description?: string }

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
      <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
      {description && <p className="text-xs text-slate-400 max-w-xs text-center">{description}</p>}
    </div>
  );
}

// PageHeader
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

// SectionCard
interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export function SectionCard({ title, subtitle, children, className = '', actions }: SectionCardProps) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 ${className}`}>
      <div className="flex items-start justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
