import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { KpiCard } from '../components/domain/KpiCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { FinancialVsPhysicalProgress } from '../components/domain/FinancialVsPhysicalProgress';
import { ProjectRiskSheet, ProjectRiskData } from '../components/domain/ProjectRiskSheet';
import { mockAlerts } from '../data/mock-alerts';
import { mockProjects } from '../data/mock-projects';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  FileCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileText,
  Activity,
  Layers,
  Building,
  UserCheck,
  Briefcase,
  Eye,
  Send,
  AlertOctagon,
  Users,
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

export function DistrictDashboardPage() {
  const [selectedProjectForSheet, setSelectedProjectForSheet] = useState<ProjectRiskData | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Priority Action Queue Items
  const priorityActionQueue = [
    {
      id: 'P-1023',
      priority: 'CRITICAL',
      title: 'Community Hall & Skill Centre Ward 17',
      riskScore: 86,
      primaryIssue: '+38.2% cost inflation vs PWD Schedule of Rates & 45-day UC-02 overdue',
      evidenceCount: 5,
      slaDeadline: 'In 3 Days (30 Aug 2026)',
      slaUrgent: true,
      assignedAgency: 'PMC Executive Engineer (Ward 17)',
      assignedOfficer: 'S. Kulkarni (Vigilance Inspector)',
      recommendedAction: 'Issue 14-day statutory explanation notice under Rule 5.4 and hold 2nd installment.',
      sanctioned: '₹42.00 L',
      expenditure: '₹38.85 L',
      physical: 31,
      financial: 92.5,
      reasons: [
        '+38.2% cost deviation above prevailing PWD Schedule of Rates 2024-25 baseline',
        '+51.5% progress gap: 92.5% funds disbursed vs only 31.0% physical execution',
        'Single-bid tender award with compressed 8-day notice period',
        'Contractor concentration: firm holds 38.5% of total ward public works',
        'Missing mandatory GFR-12C Utilisation Certificate (UC-02 overdue by 45 days)',
      ],
    },
    {
      id: 'P-0871',
      priority: 'HIGH',
      title: 'Bituminous Village Link Road KM 12/400 to 16/200',
      riskScore: 82,
      primaryIssue: '74% geospatial polygon overlap with completed PMGSY Batch III asphalt road',
      evidenceCount: 4,
      slaDeadline: 'In 6 Days (02 Sep 2026)',
      slaUrgent: false,
      assignedAgency: 'PWD Division II (Haveli)',
      assignedOfficer: 'R. Mane (Assistant Engineer)',
      recommendedAction: 'Execute GPS geofenced drone verification before releasing second trench.',
      sanctioned: '₹58.00 L',
      expenditure: '₹50.46 L',
      physical: 51,
      financial: 87.0,
      reasons: [
        '88% geospatial polygon alignment with PMGSY Batch III completed in Nov 2023',
        '+24.5% unit rate inflation on bitumen grade VG-30 against State PWD SoR',
      ],
    },
    {
      id: 'P-0912',
      priority: 'HIGH',
      title: 'Primary Health Diagnostic Solar Unit',
      riskScore: 72,
      primaryIssue: '+42% solar equipment rate deviation & unverified contractor GST registration',
      evidenceCount: 3,
      slaDeadline: 'In 9 Days (05 Sep 2026)',
      slaUrgent: false,
      assignedAgency: 'Zilla Parishad Pune (Health Dept)',
      assignedOfficer: 'Dr. V. Patil (District Medical Officer)',
      recommendedAction: 'Audit supplier bill of quantities against GeM direct procurement rates.',
      sanctioned: '₹34.50 L',
      expenditure: '₹25.87 L',
      physical: 60,
      financial: 75.0,
      reasons: [
        '+42.0% cost deviation on 15kVA solar panels vs GeM direct purchase rate',
        'Unverified contractor GST status at time of work order issue',
      ],
    },
  ];

  // Implementing Agency Workload Data
  const agencyWorkloadData = [
    { agency: 'PWD Division Pune', active: 42, pendingReview: 8, delayed: 6, breaches: 1 },
    { agency: 'Zilla Parishad Pune', active: 38, pendingReview: 7, delayed: 5, breaches: 1 },
    { agency: 'Pune Municipal Corp', active: 28, pendingReview: 4, delayed: 4, breaches: 1 },
    { agency: 'MJP Water Authority', active: 20, pendingReview: 2, delayed: 3, breaches: 0 },
  ];

  // Delay Trajectory Data
  const delayTrajectoryData = [
    { month: 'Apr 2025', planned: 20, actual: 18, projected: 18 },
    { month: 'Jun 2025', planned: 45, actual: 36, projected: 36 },
    { month: 'Aug 2025', planned: 70, actual: 48, projected: 50 },
    { month: 'Oct 2025', planned: 90, actual: 58, projected: 62 },
    { month: 'Dec 2025', planned: 100, actual: 68, projected: 75 },
    { month: 'Feb 2026', planned: 100, actual: 78, projected: 88 },
  ];

  const handleOpenActionDrawer = (item: typeof priorityActionQueue[0]) => {
    setSelectedProjectForSheet({
      id: item.id,
      title: item.title,
      category: 'District Public Work',
      location: 'Pune District, Maharashtra',
      state: 'Maharashtra',
      district: 'Pune',
      sanctionedAmount: item.sanctioned,
      expenditure: item.expenditure,
      physicalProgress: item.physical,
      financialProgress: item.financial,
      expectedCompletion: '30 Oct 2026',
      riskScore: item.riskScore,
      severity: item.priority === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
      reasons: item.reasons,
      evidenceDocuments: [
        { name: `Technical Sanction (${item.id}-TS.pdf)`, type: 'Estimate', status: 'VERIFIED', date: '14 Feb 2025' },
        { name: `e-Tender Bid Comparative Statement`, type: 'Procurement', status: 'FLAGGED', date: '28 Feb 2025' },
        { name: `Treasury DBT Vouchers (V-991 to V-994)`, type: 'Disbursement', status: 'AVAILABLE', date: '12 May 2025' },
        { name: `Geotagged Foundation Excavation Photo`, type: 'Site EXIF', status: 'VERIFIED', date: '20 Jun 2025' },
        { name: `GFR-12C Utilisation Certificate Stage 2`, type: 'Statutory', status: 'PENDING', date: '15 Jul 2025' },
      ],
      recommendedAction: item.recommendedAction,
      executingAgency: item.assignedAgency,
      contractor: 'Awarded Contractor Entity',
    });
    setSheetOpen(true);
  };

  const handleAssignAction = (id: string) => {
    toast.success(`District Intervention Dispatched`, {
      description: `Formal inspection order generated for Project ${id}. Officer assigned with 7-day compliance SLA.`,
    });
  };

  const handleEscalateToState = (id: string) => {
    toast.warning(`Escalated to State Nodal Authority`, {
      description: `Case dossier for Project ${id} submitted to Maharashtra Planning Department for cross-agency sanction review.`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="District Command Centre — Pune"
        subtitle="Operational command, compliance monitoring and intervention management"
        badge={
          <Badge variant="default" className="font-mono bg-[#15324A] text-white">
            PUNE DISTRICT JURISDICTION
          </Badge>
        }
        breadcrumbs={[
          { label: 'Intelligence Platform', path: '/' },
          { label: 'District Command Centre' },
        ]}
      />

      {/* Hero Operational KPI Strip (6 Key Indicators) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard
          title="Active Civil Works"
          value="128"
          subtitle="Monitored in Pune"
          icon={Activity}
        />
        <KpiCard
          title="Require Action"
          value="21"
          change="Urgent"
          changeType="critical"
          variant="warning"
          subtitle="Collectorate Queue"
          icon={Clock}
        />
        <KpiCard
          title="High/Critical Risk"
          value="7"
          change="3 Critical"
          changeType="critical"
          variant="critical"
          subtitle="Risk index ≥ 60"
          icon={ShieldAlert}
        />
        <KpiCard
          title="SLA Breaches"
          value="3"
          change="Overdue"
          changeType="negative"
          variant="critical"
          subtitle="UC / Sanction deadlines"
          icon={AlertTriangle}
        />
        <KpiCard
          title="Pending Sanctions"
          value="12"
          change="Pre-check ready"
          changeType="positive"
          variant="success"
          subtitle="Under AI Pre-Audit"
          icon={FileCheck}
        />
        <KpiCard
          title="Delayed Works"
          value="18"
          change="+36 Days Avg"
          changeType="negative"
          variant="warning"
          subtitle="Past milestone date"
          icon={Clock}
        />
      </div>

      {/* SECTION A: PRIORITY ACTION QUEUE (Most Prominent Section) */}
      <div className="rounded-[8px] border-2 border-[#15324A] bg-white p-5 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D9DFE3] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#C94B4B] bg-red-50 px-2 py-0.5 rounded border border-[#C94B4B]/30 uppercase">
                LEVEL 1 PRIORITY QUEUE
              </span>
              <h3 className="text-base font-extrabold text-[#15324A] tracking-tight uppercase">
                Priority Intervention Action Queue ({priorityActionQueue.length} Active Cases)
              </h3>
            </div>
            <p className="text-xs text-[#647383] mt-0.5">
              Urgent statutory interventions requiring District Magistrate & Collector review and formal administrative disposal.
            </p>
          </div>

          <Link to="/alerts">
            <Button variant="outline" size="sm" className="text-xs font-bold border-[#15324A] text-[#15324A]">
              View All 21 District Alerts →
            </Button>
          </Link>
        </div>

        {/* Priority Action Cards List */}
        <div className="space-y-3">
          {priorityActionQueue.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-[6px] border border-[#D9DFE3] bg-[#FAFAF7] hover:bg-white hover:border-[#15324A] transition-all space-y-3 shadow-card"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-extrabold text-[#15324A] bg-white px-2 py-0.5 rounded border border-[#D9DFE3]">
                      {item.id}
                    </span>
                    <strong className="text-sm text-[#172B3A]">{item.title}</strong>
                    <Badge variant={item.priority === 'CRITICAL' ? 'critical' : 'warning'}>
                      {item.priority}
                    </Badge>
                  </div>
                  <div className="text-xs font-medium text-[#C94B4B] flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>Primary Flag: {item.primaryIssue}</span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-[10px] font-mono text-[#647383] uppercase block">AI Risk Index</span>
                  <strong className="text-lg font-mono font-extrabold text-[#C94B4B]">
                    {item.riskScore} / 100
                  </strong>
                </div>
              </div>

              {/* Detail Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono bg-white p-2.5 rounded border border-[#D9DFE3]">
                <div>
                  <span className="text-[#647383] block text-[10px]">SLA DEADLINE</span>
                  <strong className={item.slaUrgent ? 'text-[#C94B4B]' : 'text-[#172B3A]'}>
                    {item.slaDeadline}
                  </strong>
                </div>

                <div>
                  <span className="text-[#647383] block text-[10px]">EVIDENCE DOSSIER</span>
                  <strong className="text-[#2E8064]">{item.evidenceCount} Files Verified</strong>
                </div>

                <div>
                  <span className="text-[#647383] block text-[10px]">EXECUTING IA</span>
                  <span className="text-[#172B3A] text-[11px] truncate block">{item.assignedAgency}</span>
                </div>

                <div>
                  <span className="text-[#647383] block text-[10px]">ASSIGNED OFFICER</span>
                  <span className="text-[#172B3A] text-[11px] truncate block">{item.assignedOfficer}</span>
                </div>
              </div>

              {/* Recommended Action & Trigger Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-[#D9DFE3]/60">
                <div className="text-xs text-[#172B3A]">
                  <strong className="text-[#15324A] font-mono">RECOMMENDED ACTION: </strong>
                  <span>{item.recommendedAction}</span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenActionDrawer(item)}
                    className="h-7 text-xs font-semibold border-[#D9DFE3] hover:border-[#15324A]"
                  >
                    <Eye className="h-3 w-3 mr-1" /> Review Evidence
                  </Button>

                  <Link to={`/projects/${item.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs font-bold border-[#15324A] text-[#15324A] hover:bg-[#15324A] hover:text-white"
                    >
                      Open Cockpit
                    </Button>
                  </Link>

                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleAssignAction(item.id)}
                    className="h-7 text-xs bg-[#15324A] hover:bg-[#0F2638] text-white font-bold"
                  >
                    Assign Officer
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEscalateToState(item.id)}
                    className="h-7 text-xs text-[#C98220] hover:text-[#C94B4B] hover:bg-orange-50 font-bold"
                  >
                    Escalate ↑
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION B & C: PRE-SANCTION RISK CHECK & DISTRICT RISK MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Section B: AI Pre-Sanction Risk Check (1 col) */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-l-4 border-l-[#15324A]">
            <CardHeader className="bg-[#FAFAF7]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono font-bold text-[#D99018] tracking-wider">
                  AI PRE-SANCTION VERIFICATION
                </span>
                <Badge variant="warning">Pre-Sanction Flag</Badge>
              </div>
              <CardTitle className="text-sm mt-1">
                Ward 17 Community Hall (₹42.0L Proposed)
              </CardTitle>
              <CardDescription className="text-xs">
                Continuous compliance monitoring before Collector admin sanction is finalized
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-2 pt-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between p-2 rounded bg-emerald-50 text-[#2E8064] border border-[#2E8064]/20">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Statutory Eligibility Check
                  </span>
                  <span className="font-bold font-mono">VERIFIED</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-emerald-50 text-[#2E8064] border border-[#2E8064]/20">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5" /> MP Constituency Budget
                  </span>
                  <span className="font-bold font-mono">AVAILABLE</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-emerald-50 text-[#2E8064] border border-[#2E8064]/20">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Land Title NOC & Clearances
                  </span>
                  <span className="font-bold font-mono">ATTACHED</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-orange-50 text-[#C98220] border border-[#C98220]/30">
                  <span className="flex items-center gap-1.5 font-medium">
                    <AlertTriangle className="h-3.5 w-3.5" /> Cost Benchmark vs PWD SoR
                  </span>
                  <span className="font-bold font-mono">+38.2% HIGH</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-red-50 text-[#C94B4B] border border-[#C94B4B]/30">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Layers className="h-3.5 w-3.5" /> Duplicate Geo-Similarity
                  </span>
                  <span className="font-bold font-mono">74% OVERLAP</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-emerald-50 text-[#2E8064] border border-[#2E8064]/20">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5" /> SC/ST Area Allocation (15%)
                  </span>
                  <span className="font-bold font-mono">COMPLIANT</span>
                </div>
              </div>

              <div className="pt-2">
                <Link to="/projects/P-1023">
                  <Button variant="default" size="sm" className="w-full text-xs bg-[#15324A] hover:bg-[#0F2638] text-white">
                    Review Pre-Sanction Case Dossier →
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section C & D: District Risk Matrix & Delay Trajectory (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section D: Delay Trajectory Chart */}
          <Card>
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xs uppercase font-bold text-[#15324A]">
                    District Delay Trajectory & Planned vs Actual Progress (%)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Aggregate physical milestone progress vs initial engineering completion schedule
                  </CardDescription>
                </div>
                <span className="text-[10px] font-mono text-[#C94B4B] font-bold">● -18.4% Cumulative Lag</span>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={delayTrajectoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#D9DFE3" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Line type="monotone" dataKey="planned" stroke="#15324A" strokeWidth={2} name="Planned Target (%)" strokeDasharray="4 4" />
                    <Line type="monotone" dataKey="actual" stroke="#2E8064" strokeWidth={2.5} name="Verified Physical (%)" />
                    <Line type="monotone" dataKey="projected" stroke="#C98220" strokeWidth={2} name="AI Projected Trajectory (%)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Section E: District Implementing Agency Workload */}
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-xs uppercase font-bold text-[#15324A]">
                Implementing Agency Workload & SLA Compliance
              </CardTitle>
              <CardDescription className="text-xs">
                Monitoring civil execution workload and response times across Pune line departments
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="bg-[#FAFAF7] border-b border-[#D9DFE3] text-[10px] text-[#15324A] uppercase">
                      <th className="p-2.5 font-bold">Executing Agency</th>
                      <th className="p-2.5 font-bold">Active Works</th>
                      <th className="p-2.5 font-bold">Pending Reviews</th>
                      <th className="p-2.5 font-bold">Delayed Works</th>
                      <th className="p-2.5 font-bold text-right">SLA Breaches</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D9DFE3] text-xs font-sans">
                    {agencyWorkloadData.map((ag) => (
                      <tr key={ag.agency} className="hover:bg-[#FAFAF7]">
                        <td className="p-2.5 font-bold text-[#172B3A]">{ag.agency}</td>
                        <td className="p-2.5 font-mono">{ag.active}</td>
                        <td className="p-2.5 font-mono text-[#C98220] font-bold">{ag.pendingReview}</td>
                        <td className="p-2.5 font-mono text-[#C94B4B]">{ag.delayed}</td>
                        <td className="p-2.5 font-mono font-bold text-right">
                          <span className={`px-1.5 py-0.5 rounded ${ag.breaches > 0 ? 'bg-red-50 text-[#C94B4B] border border-[#C94B4B]/30' : 'text-[#2E8064]'}`}>
                            {ag.breaches}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Reusable Project Risk Sheet Drawer */}
      <ProjectRiskSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        project={selectedProjectForSheet}
      />
    </div>
  );
}
