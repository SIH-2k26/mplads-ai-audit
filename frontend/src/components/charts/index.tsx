// Charts — frontend/src/components/charts/index.tsx
// All Recharts-based chart components for the dashboard and project detail pages.

import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';
import type { RiskHistory } from '../../types/risk';
import { CHART_COLORS } from '../../utils/riskColors';

// ── Risk Trajectory (line chart) ──────────────────────────────────────────────
interface RiskTrajectoryProps {
  history: RiskHistory;
}

export function RiskTrajectoryChart({ history }: RiskTrajectoryProps) {
  const data = history.history.map((h) => ({
    month: h.month.replace(/^\d{4}-/, ''),
    risk: h.riskScore,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 4, right: 16, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
        <Tooltip
          contentStyle={{ fontSize: 12, border: '1px solid #e2e8f0', borderRadius: 8 }}
          formatter={(v: number) => [`${v}`, 'Risk Score']}
        />
        <Line
          type="monotone"
          dataKey="risk"
          stroke={CHART_COLORS.high}
          strokeWidth={2.5}
          dot={{ r: 4, fill: CHART_COLORS.high }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ── Risk Distribution (pie/donut) ─────────────────────────────────────────────
interface RiskDistributionProps {
  distribution: { low: number; medium: number; high: number; critical: number };
}

const DIST_ENTRIES = [
  { key: 'low', label: 'Low', color: CHART_COLORS.low },
  { key: 'medium', label: 'Medium', color: CHART_COLORS.medium },
  { key: 'high', label: 'High', color: CHART_COLORS.high },
  { key: 'critical', label: 'Critical', color: CHART_COLORS.critical },
] as const;

export function RiskDistributionChart({ distribution }: RiskDistributionProps) {
  const data = DIST_ENTRIES.map(({ key, label, color }) => ({
    name: label,
    value: distribution[key],
    color,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ fontSize: 12, border: '1px solid #e2e8f0', borderRadius: 8 }}
          formatter={(v: number, name: string) => [`${v} projects`, name]}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => <span style={{ fontSize: 11, color: '#64748b' }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ── State Risk Chart (horizontal bar) ────────────────────────────────────────
interface StateRiskChartProps {
  data: { state: string; avgRiskScore: number }[];
}

export function StateRiskChart({ data }: StateRiskChartProps) {
  const truncated = data.slice(0, 8).map((d) => ({
    state: d.state.replace(' Pradesh', ' P.').replace('West ', 'W. '),
    risk: d.avgRiskScore,
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={truncated} layout="vertical" margin={{ top: 4, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} horizontal={false} />
        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
        <YAxis type="category" dataKey="state" width={72} tick={{ fontSize: 11, fill: '#64748b' }} />
        <Tooltip
          contentStyle={{ fontSize: 12, border: '1px solid #e2e8f0', borderRadius: 8 }}
          formatter={(v: number) => [`${v}`, 'Avg Risk Score']}
        />
        <Bar dataKey="risk" fill={CHART_COLORS.primary} radius={[0, 4, 4, 0]} barSize={12} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Risk Trend (area chart) ───────────────────────────────────────────────────
interface RiskTrendChartProps {
  trend: { month: string; avgRisk: number }[];
}

export function RiskTrendChart({ trend }: RiskTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={trend} margin={{ top: 4, right: 16, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={CHART_COLORS.high} stopOpacity={0.2} />
            <stop offset="95%" stopColor={CHART_COLORS.high} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
        <Tooltip
          contentStyle={{ fontSize: 12, border: '1px solid #e2e8f0', borderRadius: 8 }}
          formatter={(v: number) => [`${v}`, 'Avg Risk Score']}
        />
        <Area
          type="monotone"
          dataKey="avgRisk"
          stroke={CHART_COLORS.high}
          fill="url(#riskGradient)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── Financial Chart ───────────────────────────────────────────────────────────
interface FinancialChartProps {
  sanctioned: number;
  expenditure: number;
  estimated?: number;
}

export function FinancialChart({ sanctioned, expenditure, estimated }: FinancialChartProps) {
  const toL = (v: number) => Math.round(v / 100000);
  const data = [
    { name: 'Sanctioned', value: toL(sanctioned), fill: CHART_COLORS.primary },
    { name: 'Expended', value: toL(expenditure), fill: CHART_COLORS.high },
    ...(estimated ? [{ name: 'Estimated', value: toL(estimated), fill: CHART_COLORS.medium }] : []),
  ];

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ top: 4, right: 16, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} unit="L" />
        <Tooltip
          contentStyle={{ fontSize: 12, border: '1px solid #e2e8f0', borderRadius: 8 }}
          formatter={(v: number) => [`₹${v}L`, '']}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={48}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Progress Chart ────────────────────────────────────────────────────────────
interface ProgressChartProps {
  financialProgress: number;
  physicalProgress: number;
  expectedProgress?: number;
}

export function ProgressChart({ financialProgress, physicalProgress, expectedProgress }: ProgressChartProps) {
  const data = [
    {
      name: 'Progress',
      financial: Math.round(financialProgress),
      physical: Math.round(physicalProgress),
      ...(expectedProgress !== undefined ? { expected: Math.round(expectedProgress) } : {}),
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 40, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} horizontal={false} />
        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} unit="%" />
        <YAxis type="category" dataKey="name" hide />
        <Tooltip
          contentStyle={{ fontSize: 12, border: '1px solid #e2e8f0', borderRadius: 8 }}
          formatter={(v: number, name: string) => [`${v}%`, name.charAt(0).toUpperCase() + name.slice(1)]}
        />
        <Legend iconSize={8} formatter={(v) => <span style={{ fontSize: 11, color: '#64748b' }}>{v.charAt(0).toUpperCase() + v.slice(1)}</span>} />
        <Bar dataKey="financial" name="financial" fill={CHART_COLORS.primary} radius={[0, 4, 4, 0]} barSize={18} />
        <Bar dataKey="physical" name="physical" fill={CHART_COLORS.low} radius={[0, 4, 4, 0]} barSize={18} />
        {expectedProgress !== undefined && (
          <Bar dataKey="expected" name="expected" fill={CHART_COLORS.secondary} radius={[0, 4, 4, 0]} barSize={18} />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}
