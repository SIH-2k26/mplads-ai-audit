// Risk Colors — frontend/src/utils/riskColors.ts
// Centralized color mapping for risk levels.
// All components use this — never hardcode risk colors in JSX.

import type { RiskLevel } from '../types/project';
import type { AgentSeverity, AgentStatus } from '../types/agent';
import type { AlertSeverity } from '../types/alert';
import type { ServiceStatus } from '../types/system';

export const RISK_COLORS: Record<RiskLevel, { bg: string; text: string; border: string; dot: string }> = {
  LOW: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    dot: 'bg-green-500',
  },
  MEDIUM: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  HIGH: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-500',
  },
  CRITICAL: {
    bg: 'bg-rose-50',
    text: 'text-rose-800',
    border: 'border-rose-300',
    dot: 'bg-rose-600',
  },
};

export const SEVERITY_COLORS: Record<AgentSeverity, { bg: string; text: string }> = {
  LOW: { bg: 'bg-green-50', text: 'text-green-700' },
  MEDIUM: { bg: 'bg-amber-50', text: 'text-amber-700' },
  HIGH: { bg: 'bg-red-50', text: 'text-red-700' },
  CRITICAL: { bg: 'bg-rose-50', text: 'text-rose-800' },
};

export const AGENT_STATUS_COLORS: Record<AgentStatus, { bg: string; text: string; label: string }> = {
  PASS: { bg: 'bg-green-50', text: 'text-green-700', label: 'Pass' },
  FLAG: { bg: 'bg-red-50', text: 'text-red-700', label: 'Flagged' },
  WARN: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Warning' },
  ERROR: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Error' },
  SKIPPED: { bg: 'bg-gray-50', text: 'text-gray-500', label: 'Skipped' },
  NOT_APPLICABLE: { bg: 'bg-gray-50', text: 'text-gray-400', label: 'N/A' },
};

export const SERVICE_STATUS_COLORS: Record<ServiceStatus, { bg: string; text: string; dot: string }> = {
  UP: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  DOWN: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  DEGRADED: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  UNKNOWN: { bg: 'bg-gray-50', text: 'text-gray-500', dot: 'bg-gray-400' },
};

export const RISK_SCORE_COLOR = (score: number): string => {
  if (score >= 80) return 'text-rose-700';
  if (score >= 60) return 'text-red-600';
  if (score >= 40) return 'text-amber-600';
  return 'text-green-600';
};

export const SHAP_BAR_COLOR = (contribution: number): string =>
  contribution >= 0 ? '#dc2626' : '#16a34a';

// Recharts-compatible hex colors
export const CHART_COLORS = {
  low: '#16a34a',
  medium: '#d97706',
  high: '#dc2626',
  critical: '#9f1239',
  primary: '#2563eb',
  secondary: '#64748b',
  grid: '#f1f5f9',
};
