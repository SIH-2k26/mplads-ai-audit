import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { KpiCard } from '../components/domain/KpiCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { RiskMap } from '../components/domain/RiskMap';
import { mockNationalRiskTrend, mockSystemicRiskCategories } from '../data/mock-analytics';
import { mockCases } from '../data/mock-cases';
import { formatCurrencyINR, getRiskColorClass } from '../lib/utils';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import {
  Globe2,
  TrendingUp,
  ShieldAlert,
  AlertOctagon,
  ArrowRight,
  Briefcase,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';

export function MinistryDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="National MPLADS Intelligence Directorate — Ministry / DIID"
        subtitle="Executive Risk Intelligence, Policy Compliance & National Investigation Directorate • All India FY 2026–27"
        badge={
          <Badge variant="default" className="font-mono">
            EXECUTIVE NATIONAL COCKPIT
          </Badge>
        }
      />

      {/* Hero National KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <KpiCard title="Total Works" value="7,842" subtitle="All-India" />
        <KpiCard title="Active Works" value="5,218" subtitle="In progress" />
        <KpiCard title="High Risk" value="1,104" variant="warning" subtitle="Score ≥ 60" />
        <KpiCard title="Critical" value="287" variant="critical" subtitle="Score ≥ 80" />
        <KpiCard title="Sanctioned" value="₹3,812 Cr" subtitle="Total allocation" />
        <KpiCard title="Utilisation" value="74.2%" variant="success" subtitle="National avg" />
        <KpiCard title="Delayed" value="416" subtitle="SLA overruns" />
        <KpiCard title="Open Cases" value="192" variant="critical" subtitle="Under investigation" />
      </div>

      {/* National Risk Trend (12 Months) */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#18324A]" />
              <CardTitle>National Risk Trend & Case Resolution Velocity (Last 12 Months)</CardTitle>
            </div>
            <span className="text-xs font-mono text-[#667085]">Data period: Sep 2025 – Aug 2026</span>
          </div>
          <CardDescription>
            Longitudinal trend of average composite risk index vs monthly active high-risk works detected
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockNationalRiskTrend} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDE8DE" />
                <XAxis dataKey="month" stroke="#667085" fontSize={11} />
                <YAxis stroke="#667085" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D9D5CC', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="highRiskProjects"
                  name="High Risk Works Count"
                  stroke="#B44343"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="nationalAvg"
                  name="National Avg Risk Score"
                  stroke="#18324A"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="resolvedCases"
                  name="Resolved Investigations"
                  stroke="#2F7658"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* National Heatmap & Top Systemic Risks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2/3: National Heatmap */}
        <div className="lg:col-span-2">
          <RiskMap level="NATIONAL" />
        </div>

        {/* Right 1/3: Top Systemic Risks Table */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Systemic Risk Patterns</CardTitle>
              <CardDescription>All-India recurring audit vectors</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[#EDE8DE]">
                {mockSystemicRiskCategories.map((cat) => (
                  <div key={cat.rank} className="p-3 text-xs flex items-center justify-between hover:bg-[#FAFAF7]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#667085]">{cat.rank}</span>
                      <span className="font-medium text-[#18324A] line-clamp-1">{cat.category}</span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="font-mono font-bold text-[#B44343]">{cat.count}</span>
                      <span className="text-[10px] text-[#667085] ml-1">({cat.trend})</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* National Investigation Queue Card */}
          <Card className="border-l-4 border-l-[#B44343]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs uppercase font-bold text-[#18324A]">
                  Critical National Cases
                </CardTitle>
                <Badge variant="critical">Urgent Interventions</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {mockCases.slice(0, 2).map((c) => (
                <div key={c.id} className="p-3 rounded bg-[#FAFAF7] border border-[#EDE8DE] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#18324A]">{c.caseNumber}</span>
                    <span className="text-[10px] font-bold text-[#B44343] bg-red-50 px-1.5 rounded border border-[#B44343]/30">
                      Risk {c.riskScore}
                    </span>
                  </div>
                  <div className="text-[#667085] line-clamp-1">{c.projectTitle}</div>
                  <Link to={`/cases/${c.id}`}>
                    <Button variant="ghost" size="sm" className="h-6 text-[11px] text-[#18324A] p-0 hover:underline">
                      Open Investigation Workspace →
                    </Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
