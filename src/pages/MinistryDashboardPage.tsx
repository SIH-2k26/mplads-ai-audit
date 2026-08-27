import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { KpiCard } from '../components/domain/KpiCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { RiskMap } from '../components/domain/RiskMap';
import { ProjectRiskSheet, ProjectRiskData } from '../components/domain/ProjectRiskSheet';
import { mockNationalRiskTrend, mockSystemicRiskCategories } from '../data/mock-analytics';
import { mockCases } from '../data/mock-cases';
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
  Sparkles,
  Layers,
  Building,
  Scale,
  Users,
  Printer,
  Download,
  Eye,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';

export function MinistryDashboardPage() {
  const [selectedProjectForSheet, setSelectedProjectForSheet] = useState<ProjectRiskData | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // State Benchmarking All-India Dataset
  const stateBenchmarks = [
    { state: 'Maharashtra', works: 2481, outlay: '₹1,248 Cr', util: 71.6, riskScore: 68, highRiskRate: '7.4%', delayDays: 38, anomalyDensity: 'High' },
    { state: 'Uttar Pradesh', works: 1984, outlay: '₹980 Cr', util: 68.4, riskScore: 74, highRiskRate: '9.2%', delayDays: 46, anomalyDensity: 'Critical' },
    { state: 'Karnataka', works: 1120, outlay: '₹560 Cr', util: 78.5, riskScore: 52, highRiskRate: '4.8%', delayDays: 22, anomalyDensity: 'Moderate' },
    { state: 'Tamil Nadu', works: 940, outlay: '₹470 Cr', util: 84.1, riskScore: 41, highRiskRate: '3.1%', delayDays: 14, anomalyDensity: 'Low' },
    { state: 'Rajasthan', works: 820, outlay: '₹410 Cr', util: 69.2, riskScore: 66, highRiskRate: '6.9%', delayDays: 34, anomalyDensity: 'High' },
    { state: 'West Bengal', works: 497, outlay: '₹248 Cr', util: 64.0, riskScore: 78, highRiskRate: '11.4%', delayDays: 52, anomalyDensity: 'Critical' },
  ];

  // CAG / CVC Audit Prioritisation Queue (Ranked by composite exposure formula)
  const auditPrioritisationList = [
    {
      rank: 1,
      id: 'P-1023',
      title: 'Ward 17 Community Hall Complex (Pune, MH)',
      financialExposure: '₹42.00 L',
      riskScore: 86,
      auditFormula: '86 Risk × ₹42L Outlay × 5 Verified Signals',
      priorityLevel: 'TIER 1 AUDIT',
      keyFactor: '+38.2% PWD SoR mark-up & 45-day overdue UC',
    },
    {
      rank: 2,
      id: 'P-0871',
      title: 'Village Link Road KM 12/400 (Pune, MH)',
      financialExposure: '₹58.00 L',
      riskScore: 82,
      auditFormula: '82 Risk × ₹58L Outlay × PMGSY Overlap',
      priorityLevel: 'TIER 1 AUDIT',
      keyFactor: '74% coordinate overlap with PMGSY Batch III',
    },
    {
      rank: 3,
      id: 'P-0912',
      title: 'Primary Health Diagnostic Solar Unit (Baramati, MH)',
      financialExposure: '₹34.50 L',
      riskScore: 72,
      auditFormula: '72 Risk × ₹34.5L Outlay × Single Tender',
      priorityLevel: 'TIER 2 AUDIT',
      keyFactor: '+42% solar equipment rate deviation',
    },
  ];

  const handleGenerateAuditBrief = (item: typeof auditPrioritisationList[0]) => {
    toast.success(`CAG / CVC Audit Brief Compiled for ${item.id}`, {
      description: `Cryptographically signed evidence brief generated for national auditor review.`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="National MPLADS Intelligence Directorate — Ministry / DIID"
        subtitle="Executive risk intelligence, policy compliance and national investigation oversight"
        badge={
          <Badge variant="default" className="font-mono bg-[#15324A] text-white">
            ALL-INDIA NATIONAL EXECUTIVE COCKPIT
          </Badge>
        }
        breadcrumbs={[
          { label: 'Intelligence Platform', path: '/' },
          { label: 'Ministry / National Oversight' },
        ]}
        actions={
          <Link to="/risk-assessment">
            <Button
              variant="default"
              size="sm"
              className="text-xs font-bold bg-[#15324A] hover:bg-[#0F2638] text-white flex items-center gap-1.5 shadow-subtle"
            >
              <span>Assess Project Risk</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#E5B45A]" />
            </Button>
          </Link>
        }
      />

      {/* Hero National KPI Strip (8 Core Indicators) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <KpiCard title="Total Works" value="7,842" subtitle="All-India Scope" />
        <KpiCard title="Active Works" value="5,218" subtitle="Under Execution" />
        <KpiCard title="High Risk" value="1,104" variant="warning" subtitle="Score ≥ 60" />
        <KpiCard title="Critical" value="287" variant="critical" subtitle="Score ≥ 80" />
        <KpiCard title="Sanctioned" value="₹3,812 Cr" subtitle="Annual Allocation" />
        <KpiCard title="Utilisation" value="74.2%" variant="success" subtitle="National Average" />
        <KpiCard title="Delayed" value="416" subtitle="SLA Overruns" />
        <KpiCard title="Open Cases" value="192" variant="critical" subtitle="Under Inquiry" />
      </div>

      {/* SECTION D: INVESTIGATION PIPELINE TRACKER */}
      <div className="bg-white p-5 rounded-[8px] border-2 border-[#15324A] shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-[#15324A]" />
            <h3 className="text-xs font-mono font-bold uppercase text-[#15324A] tracking-wider">
              National Investigation Pipeline (Stage Conversion & Disposal Telemetry)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#2E8064] font-bold">● 142 Cases Resolved FY 26-27</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 font-mono text-center">
          {[
            { stage: '1. Detected', count: 287, color: 'bg-red-50 text-[#C94B4B] border-[#C94B4B]/30', label: 'AI Risk Signals' },
            { stage: '2. Triaged', count: 192, color: 'bg-amber-50 text-[#C98220] border-[#C98220]/30', label: 'Priority Filtered' },
            { stage: '3. Evidence Dossier', count: 118, color: 'bg-blue-50 text-[#15324A] border-[#15324A]/30', label: 'Ledgers Compiled' },
            { stage: '4. Active Inquiry', count: 64, color: 'bg-purple-50 text-purple-700 border-purple-300', label: 'Field Verification' },
            { stage: '5. Finding Issued', count: 38, color: 'bg-orange-50 text-orange-700 border-orange-300', label: 'Statutory Notice' },
            { stage: '6. Resolved', count: 142, color: 'bg-emerald-50 text-[#2E8064] border-[#2E8064]/30', label: 'Disposed / Closed' },
          ].map((st) => (
            <div key={st.stage} className={`p-3 rounded border ${st.color} space-y-1`}>
              <span className="text-[9px] font-bold uppercase block">{st.stage}</span>
              <div className="text-xl font-extrabold">{st.count}</div>
              <span className="text-[9px] opacity-80 block">{st.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION A: NATIONAL RISK TREND CHART */}
      <Card>
        <CardHeader className="p-4 border-b border-[#D9DFE3] bg-[#FAFAF7]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#15324A]" />
              <CardTitle className="text-xs uppercase font-bold text-[#15324A]">
                National Risk Index Trend & Longitudinal Case Resolution (Last 12 Months)
              </CardTitle>
            </div>
            <span className="text-[10px] font-mono text-[#647383]">Period: Sep 2025 – Aug 2026</span>
          </div>
          <CardDescription className="text-xs">
            Longitudinal telemetry of average national composite risk vs active high-risk works and closed inquiries
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockNationalRiskTrend} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D9DFE3" />
                <XAxis dataKey="month" stroke="#647383" fontSize={10} />
                <YAxis stroke="#647383" fontSize={10} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="highRiskProjects" name="High Risk Works Count" stroke="#C94B4B" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="nationalAvg" name="National Avg Risk Score" stroke="#15324A" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="resolvedCases" name="Resolved Investigations" stroke="#2E8064" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* SECTION C & E: NATIONAL RISK MAP & SYSTEMIC PATTERNS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RiskMap level="NATIONAL" />
        </div>

        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#D99018]" />
                <CardTitle className="text-xs uppercase font-bold text-[#15324A]">
                  Top Systemic Anomaly Patterns
                </CardTitle>
              </div>
              <CardDescription className="text-xs">All-India recurring audit vectors</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[#D9DFE3] text-xs">
                {mockSystemicRiskCategories.map((cat) => (
                  <div key={cat.rank} className="p-3 flex items-center justify-between hover:bg-[#FAFAF7]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#647383]">#{cat.rank}</span>
                      <span className="font-medium text-[#172B3A] line-clamp-1">{cat.category}</span>
                    </div>
                    <div className="text-right flex-shrink-0 font-mono">
                      <span className="font-bold text-[#C94B4B]">{cat.count}</span>
                      <span className="text-[10px] text-[#647383] ml-1">({cat.trend})</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Section F: CAG / CVC Audit Prioritisation Matrix */}
          <Card className="border-l-4 border-l-[#D99018]">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs uppercase font-bold text-[#15324A]">
                  CAG / CVC Audit Prioritisation
                </CardTitle>
                <Badge variant="warning">Top 3 Targets</Badge>
              </div>
              <CardDescription className="text-xs">
                Ranked by: Risk Score × Financial Exposure × Evidence Strength
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2.5">
              {auditPrioritisationList.map((item) => (
                <div key={item.id} className="p-2.5 rounded bg-[#FAFAF7] border border-[#D9DFE3] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#15324A]">{item.id}</span>
                    <Badge variant="critical" className="text-[9px]">
                      {item.priorityLevel}
                    </Badge>
                  </div>
                  <strong className="text-[#172B3A] block text-[11px]">{item.title}</strong>
                  <div className="text-[10px] text-[#647383] font-mono">
                    Outlay: <strong>{item.financialExposure}</strong> • {item.keyFactor}
                  </div>
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[9px] font-mono text-[#647383]">{item.auditFormula}</span>
                    <button
                      type="button"
                      onClick={() => handleGenerateAuditBrief(item)}
                      className="text-[10px] font-bold text-[#15324A] hover:underline flex items-center gap-1"
                    >
                      <FileText className="h-3 w-3" /> Generate Brief
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SECTION B: STATE BENCHMARKING ALL-INDIA LEAGUE TABLE */}
      <Card>
        <CardHeader className="p-4 border-b border-[#D9DFE3] bg-[#FAFAF7]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm uppercase font-bold text-[#15324A]">
                State & UT Performance & Risk Benchmark Table
              </CardTitle>
              <CardDescription className="text-xs">
                National benchmarking across fund utilization, risk density, and average milestone delay
              </CardDescription>
            </div>
            <Link to="/reports">
              <Button variant="outline" size="sm" className="text-xs font-bold border-[#15324A] text-[#15324A]">
                Export National Audit Dossier →
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-[#FAFAF7] border-b border-[#D9DFE3] text-[10px] text-[#15324A] uppercase">
                  <th className="p-3 font-bold">State / UT</th>
                  <th className="p-3 font-bold">Total Works</th>
                  <th className="p-3 font-bold">Sanctioned Outlay</th>
                  <th className="p-3 font-bold">Utilisation %</th>
                  <th className="p-3 font-bold">Composite Risk</th>
                  <th className="p-3 font-bold">High Risk %</th>
                  <th className="p-3 font-bold">Avg Delay</th>
                  <th className="p-3 font-bold">Anomaly Density</th>
                  <th className="p-3 font-bold text-right">Drilldown</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9DFE3] text-xs font-sans">
                {stateBenchmarks.map((st) => (
                  <tr key={st.state} className="hover:bg-[#FAFAF7]">
                    <td className="p-3 font-bold text-[#172B3A]">{st.state}</td>
                    <td className="p-3 font-mono">{st.works}</td>
                    <td className="p-3 font-mono">{st.outlay}</td>
                    <td className="p-3 font-mono font-semibold text-[#2E8064]">{st.util}%</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-[3px] font-mono font-bold text-xs border ${
                          st.riskScore >= 70
                            ? 'bg-red-50 text-[#C94B4B] border-[#C94B4B]/30'
                            : st.riskScore >= 50
                            ? 'bg-amber-50 text-[#C98220] border-[#C98220]/30'
                            : 'bg-emerald-50 text-[#2E8064] border-[#2E8064]/30'
                        }`}
                      >
                        {st.riskScore} / 100
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[#C94B4B] font-bold">{st.highRiskRate}</td>
                    <td className="p-3 font-mono text-[#647383]">+{st.delayDays} Days</td>
                    <td className="p-3">
                      <Badge variant={st.anomalyDensity === 'Critical' ? 'critical' : st.anomalyDensity === 'High' ? 'warning' : 'success'}>
                        {st.anomalyDensity}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <Link to="/state">
                        <Button variant="ghost" size="sm" className="h-7 text-xs font-bold text-[#15324A] hover:bg-[#D9DFE3]/50">
                          Inspect State →
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Reusable Project Risk Sheet Drawer */}
      <ProjectRiskSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        project={selectedProjectForSheet}
      />
    </div>
  );
}
