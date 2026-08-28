import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { KpiCard } from '../components/domain/KpiCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { RiskMap } from '../components/domain/RiskMap';
import { ProjectRiskSheet, ProjectRiskData } from '../components/domain/ProjectRiskSheet';
import { mockDistricts } from '../data/mock-geo';
import { Link } from 'react-router-dom';
import {
  Users,
  CreditCard,
  Layers,
  Clock,
  ArrowRight,
  TrendingUp,
  Building,
  AlertOctagon,
  ShieldCheck,
  MapPin,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  Scale,
  FileText,
  Eye,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { toast } from 'sonner';

export function StateDashboardPage() {
  const [selectedDistrictsForCompare, setSelectedDistrictsForCompare] = useState<string[]>(['pune', 'nagpur', 'thane']);
  const [selectedProjectForSheet, setSelectedProjectForSheet] = useState<ProjectRiskData | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // State Monthly Risk Trend
  const stateRiskTrendData = [
    { month: 'Sep 2025', avgRisk: 42, highRiskWorks: 140, resolved: 18 },
    { month: 'Nov 2025', avgRisk: 46, highRiskWorks: 156, resolved: 24 },
    { month: 'Jan 2026', avgRisk: 52, highRiskWorks: 172, resolved: 31 },
    { month: 'Mar 2026', avgRisk: 58, highRiskWorks: 198, resolved: 38 },
    { month: 'May 2026', avgRisk: 55, highRiskWorks: 188, resolved: 45 },
    { month: 'Jul 2026', avgRisk: 51, highRiskWorks: 184, resolved: 52 },
  ];

  // State Escalation Queue
  const stateEscalationQueue = [
    {
      id: 'CASE-MH-2026-081',
      district: 'Pune',
      projectTitle: 'Ward 17 Community Complex & Multi-purpose Hall',
      escalationReason: 'Cross-scheme MLALADS duplicate claim and contractor cartel concentration across 3 talukas',
      escalatedBy: 'District Magistrate & Collector, Pune',
      date: '24 Aug 2026',
      riskScore: 86,
      status: 'UNDER STATE INQUIRY',
    },
    {
      id: 'CASE-MH-2026-074',
      district: 'Nagpur',
      projectTitle: 'Solar Cold Storage Agriculture Cluster',
      escalationReason: 'Inter-district single-vendor tender collusion between Nagpur & Wardha implementing bodies',
      escalatedBy: 'District Collector, Nagpur',
      date: '18 Aug 2026',
      riskScore: 82,
      status: 'VIGILANCE NOTICE ISSUED',
    },
    {
      id: 'CASE-MH-2026-068',
      district: 'Thane',
      projectTitle: 'Urban Stormwater Drainage Network Phase II',
      escalationReason: 'Repeated milestone breach (+140 days) with 94% funds drawn from State Treasury',
      escalatedBy: 'District Collector, Thane',
      date: '10 Aug 2026',
      riskScore: 79,
      status: 'FINANCIAL FREEZE',
    },
  ];

  const handleDistrictDrilldown = (distName: string) => {
    toast.info(`Switching District Focus to: ${distName}`, {
      description: `Filtering telemetry for ${distName} District Collectorate.`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="State Nodal Authority (SNA) Dashboard — Maharashtra"
        subtitle="Systemic risk intelligence and cross-district performance benchmarking"
        badge={
          <Badge variant="default" className="font-mono bg-[#15324A] text-white">
            GOVERNMENT OF MAHARASHTRA • PLANNING DEPT
          </Badge>
        }
        breadcrumbs={[
          { label: 'Intelligence Platform', path: '/' },
          { label: 'State / Nodal Authority Dashboard' },
        ]}
      />

      {/* Hero State KPI Strip (8 Core Indicators) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <KpiCard title="Total Works" value="2,481" subtitle="36 Districts" />
        <KpiCard title="Sanctioned" value="₹1,248 Cr" subtitle="State Allocation" />
        <KpiCard title="Utilised" value="₹893 Cr" subtitle="DBT Disbursed" />
        <KpiCard title="Utilisation %" value="71.6%" variant="success" subtitle="State Avg" />
        <KpiCard title="High Risk" value="184" variant="warning" subtitle="Score ≥ 60" />
        <KpiCard title="Critical" value="42" variant="critical" subtitle="Score ≥ 80" />
        <KpiCard title="Delayed" value="91" subtitle="SLA Overruns" />
        <KpiCard title="Duplicates" value="23" subtitle="Scheme Clusters" />
      </div>

      {/* SECTION C: SYSTEMIC RISK DETECTION CARDS */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#D99018]" />
          <h3 className="text-xs font-mono font-bold text-[#15324A] uppercase tracking-wider">
            Systemic Anomaly Detection & Cross-District Vectors
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="p-3.5 rounded bg-white border-l-4 border-l-[#D99018] border border-[#D9DFE3] shadow-card space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#15324A]">
              <Users className="h-4 w-4 text-[#D99018]" />
              <span>Contractor Cartels</span>
            </div>
            <strong className="text-xl font-mono font-extrabold text-[#15324A] block">12 Districts</strong>
            <p className="text-[11px] text-[#647383]">
              Single-contractor syndicate award concentration &gt;40% in municipal public works.
            </p>
          </div>

          <div className="p-3.5 rounded bg-white border-l-4 border-l-[#C98220] border border-[#D9DFE3] shadow-card space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#15324A]">
              <CreditCard className="h-4 w-4 text-[#C98220]" />
              <span>End-Period Surges</span>
            </div>
            <strong className="text-xl font-mono font-extrabold text-[#15324A] block">7 Districts</strong>
            <p className="text-[11px] text-[#647383]">
              Abnormal expenditure spikes in Q4 (March fund exhaust velocity &gt;3.8x normal).
            </p>
          </div>

          <div className="p-3.5 rounded bg-white border-l-4 border-l-[#C94B4B] border border-[#D9DFE3] shadow-card space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#15324A]">
              <Layers className="h-4 w-4 text-[#C94B4B]" />
              <span>Duplicate Clusters</span>
            </div>
            <strong className="text-xl font-mono font-extrabold text-[#C94B4B] block">23 Clusters</strong>
            <p className="text-[11px] text-[#647383]">
              High geospatial overlap with PMGSY, MLALADS, and State PWD road assets.
            </p>
          </div>

          <div className="p-3.5 rounded bg-white border-l-4 border-l-[#15324A] border border-[#D9DFE3] shadow-card space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#15324A]">
              <Clock className="h-4 w-4 text-[#15324A]" />
              <span>Abnormal Delays</span>
            </div>
            <strong className="text-xl font-mono font-extrabold text-[#15324A] block">34% Works</strong>
            <p className="text-[11px] text-[#647383]">
              High-value civil projects (&gt;₹50L) exceeding estimated completion timeline by &gt;90 days.
            </p>
          </div>

          <div className="p-3.5 rounded bg-white border-l-4 border-l-[#2E8064] border border-[#D9DFE3] shadow-card space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#15324A]">
              <Scale className="h-4 w-4 text-[#2E8064]" />
              <span>Single-Bid Tenders</span>
            </div>
            <strong className="text-xl font-mono font-extrabold text-[#2E8064] block">48 Tenders</strong>
            <p className="text-[11px] text-[#647383]">
              Tenders awarded under single-bidder exceptions with compressed advertisement windows.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION B & E: STATE GEOGRAPHIC HEATMAP & RISK TREND */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: State Heatmap */}
        <div className="lg:col-span-2 space-y-4">
          <RiskMap level="STATE" />
        </div>

        {/* Right 1 col: State Risk Trend */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-xs uppercase font-bold text-[#15324A]">
                Statewide Risk Trend (Last 6 Months)
              </CardTitle>
              <CardDescription className="text-xs">
                Monthly composite risk index vs high-risk projects detected
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stateRiskTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#D9DFE3" />
                    <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 9 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 9 }} />
                    <Line type="monotone" dataKey="avgRisk" stroke="#15324A" strokeWidth={2} name="Avg Risk Score" />
                    <Line type="monotone" dataKey="highRiskWorks" stroke="#C94B4B" strokeWidth={2} name="High Risk Works" />
                    <Line type="monotone" dataKey="resolved" stroke="#2E8064" strokeWidth={2} name="Resolved Cases" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Section F: State Escalation Docket */}
          <Card className="border-l-4 border-l-[#C94B4B]">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs uppercase font-bold text-[#15324A]">
                  District → State Escalation Queue
                </CardTitle>
                <Badge variant="critical">3 Pending</Badge>
              </div>
              <CardDescription className="text-xs">
                Interventions escalated by District Collectors for State Nodal disposal
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2.5">
              {stateEscalationQueue.map((item) => (
                <div key={item.id} className="p-2.5 rounded bg-[#FAFAF7] border border-[#D9DFE3] space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#15324A]">{item.id}</span>
                    <Badge variant="critical" className="text-[9px]">
                      Risk {item.riskScore}
                    </Badge>
                  </div>
                  <strong className="text-[#172B3A] block text-[11px]">{item.projectTitle}</strong>
                  <p className="text-[10px] text-[#647383]">{item.escalationReason}</p>
                  <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-[#15324A]">
                    <span>From: {item.district} Collector</span>
                    <span className="text-[#C94B4B] font-bold">{item.status}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SECTION A: DISTRICT PERFORMANCE BENCHMARK LEAGUE TABLE */}
      <Card>
        <CardHeader className="p-4 border-b border-[#D9DFE3] bg-[#FAFAF7]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-sm uppercase font-bold text-[#15324A]">
                District Performance & Systemic Anomaly League Table
              </CardTitle>
              <CardDescription className="text-xs">
                Comparative monitoring across Maharashtra districts (Ranked by composite risk and fund utilization)
              </CardDescription>
            </div>
            <Link to="/maps">
              <Button variant="outline" size="sm" className="text-xs font-bold border-[#15324A] text-[#15324A]">
                Open Full Geographic Map →
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#FAFAF7] text-[10px] font-mono uppercase text-[#15324A]">
                  <TableHead className="font-bold">District</TableHead>
                  <TableHead className="font-bold">Active Works</TableHead>
                  <TableHead className="font-bold">Fund Utilisation</TableHead>
                  <TableHead className="font-bold">Completion %</TableHead>
                  <TableHead className="font-bold">Composite Risk</TableHead>
                  <TableHead className="font-bold">Avg Delay</TableHead>
                  <TableHead className="font-bold">Critical Cases</TableHead>
                  <TableHead className="font-bold">Duplicate Clusters</TableHead>
                  <TableHead className="font-bold text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs">
                {mockDistricts.map((dist) => (
                  <TableRow key={dist.id} className="hover:bg-[#FAFAF7]">
                    <TableCell className="font-bold text-[#15324A]">
                      {dist.name}
                    </TableCell>
                    <TableCell className="font-mono">{dist.totalProjects}</TableCell>
                    <TableCell className="font-mono font-semibold text-[#2E8064]">
                      {dist.utilisationPercentage}%
                    </TableCell>
                    <TableCell className="font-mono">
                      {Math.round(dist.utilisationPercentage * 0.94)}%
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-0.5 rounded-[3px] font-mono font-bold text-xs border ${
                          dist.compositeRiskScore >= 70
                            ? 'bg-red-50 text-[#C94B4B] border-[#C94B4B]/30'
                            : dist.compositeRiskScore >= 50
                            ? 'bg-amber-50 text-[#C98220] border-[#C98220]/30'
                            : 'bg-emerald-50 text-[#2E8064] border-[#2E8064]/30'
                        }`}
                      >
                        {dist.compositeRiskScore} / 100
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-[#647383]">
                      +{dist.delayRatePercentage} Days
                    </TableCell>
                    <TableCell className="font-mono font-semibold text-[#C94B4B]">
                      {dist.costAnomaliesCount} Cases
                    </TableCell>
                    <TableCell className="font-mono text-[#C98220]">
                      {Math.round(dist.costAnomaliesCount * 0.6)} Clusters
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to="/district">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDistrictDrilldown(dist.name)}
                          className="h-7 text-xs flex items-center gap-1 font-bold text-[#15324A] hover:bg-[#D9DFE3]/50"
                        >
                          <span>Drilldown</span>
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
