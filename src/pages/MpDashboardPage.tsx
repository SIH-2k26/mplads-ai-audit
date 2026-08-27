import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Wallet,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  BarChart3,
  Layers,
  FileText,
  Building2,
  MapPin,
  Scale,
  Sparkles,
  ChevronRight,
  Eye,
  Info,
  HelpCircle,
  MessageSquare,
  Activity,
} from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { mockMpProfiles, MpProfileData } from '../data/mock-mps';
import { MpComparisonView } from '../components/domain/MpComparisonView';
import { ProjectRiskSheet, ProjectRiskData } from '../components/domain/ProjectRiskSheet';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { toast } from 'sonner';

export function MpDashboardPage() {
  const [selectedMp, setSelectedMp] = useState<MpProfileData>(mockMpProfiles[0]);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'health' | 'early-warning' | 'trends' | 'compare'>('portfolio');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('ALL');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('ALL');
  
  // Project Risk Sheet State
  const [selectedProjectForSheet, setSelectedProjectForSheet] = useState<ProjectRiskData | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // AI Assistant Preset Query handler
  const handleAskAgastya = (query: string) => {
    toast.info(`Agastya AI Analyzing Query: "${query}"`, {
      description: `Synthesizing real-time project ledgers, PWD Schedule of Rates baselines, and milestone telemetry.`,
    });
  };

  // Mock Constituency Projects for Selected MP
  const constituencyProjects = [
    {
      id: 'P-1023',
      title: 'Community Hall & Skill Development Centre Ward 17',
      location: 'Shivaji Nagar, Pune',
      agency: 'Pune Municipal Corporation (PMC)',
      sanctioned: '₹42.00 L',
      utilized: '₹38.85 L',
      completion: 31,
      utilizationRate: 92.5,
      riskScore: 86,
      stage: 'Execution (Delayed)',
      stageIndex: 5,
      health: 'CRITICAL',
      reasons: [
        '+38.2% cost deviation above PWD Schedule of Rates 2024-25 baseline',
        '+51.5% progress gap: 92.5% funds disbursed vs only 31.0% physical execution',
        'Single-bid tender award with compressed 8-day notice period',
      ],
      recommendedAction: 'Verify structural estimate and inspect site before releasing 2nd fund tranche.',
    },
    {
      id: 'P-0871',
      title: 'Bituminous Village Link Road KM 12/400 to 16/200',
      location: 'Haveli Taluka, Pune',
      agency: 'Public Works Department (PWD) Division II',
      sanctioned: '₹58.00 L',
      utilized: '₹50.46 L',
      completion: 51,
      utilizationRate: 87.0,
      riskScore: 82,
      stage: 'Execution (Delayed)',
      stageIndex: 5,
      health: 'HIGH RISK',
      reasons: [
        '88% geospatial polygon alignment with PMGSY Batch III completed in Nov 2023',
        '+24.5% unit rate inflation on bitumen grade VG-30 against State PWD SoR',
      ],
      recommendedAction: 'Execute GPS geofenced road inspection survey to verify new pavement.',
    },
    {
      id: 'P-0912',
      title: 'Primary Health Centre Solar Diagnostic Diagnostic Unit',
      location: 'Baramati, Pune',
      agency: 'Zilla Parishad Pune (Health Dept)',
      sanctioned: '₹34.50 L',
      utilized: '₹25.87 L',
      completion: 60,
      utilizationRate: 75.0,
      riskScore: 72,
      stage: 'Execution (On Track)',
      stageIndex: 5,
      health: 'AT RISK',
      reasons: [
        '+42.0% cost deviation on 15kVA solar panels vs GeM direct purchase rate',
        'Unverified contractor GST status at time of work order issue',
      ],
      recommendedAction: 'Reconcile bill of quantities with GeM standard product rate cards.',
    },
    {
      id: 'P-0412',
      title: 'Digital Smart Classroom STEM Complex & Science Lab',
      location: 'Aundh Ward, Pune',
      agency: 'Zilla Parishad Pune (Education Dept)',
      sanctioned: '₹24.50 L',
      utilized: '₹23.28 L',
      completion: 95,
      utilizationRate: 95.0,
      riskScore: 24,
      stage: 'Handover Pending',
      stageIndex: 6,
      health: 'ON TRACK',
      reasons: [
        'All milestone deliverables submitted on schedule',
        'Direct GeM procurement with transparent manufacturer warranty',
      ],
      recommendedAction: 'Routine final completion inspection prior to asset handover.',
    },
    {
      id: 'P-0889',
      title: 'Rural Drinking Water RO Purification Units (6 Villages)',
      location: 'Khed Taluka, Pune',
      agency: 'Maharashtra Jeevan Pradhikaran (MJP)',
      sanctioned: '₹32.00 L',
      utilized: '₹22.40 L',
      completion: 70,
      utilizationRate: 70.0,
      riskScore: 68,
      stage: 'Execution (Delayed)',
      stageIndex: 5,
      health: 'AT RISK',
      reasons: [
        '32 days delay in electrical grid transformer connection approval',
      ],
      recommendedAction: 'Follow up with DISCOM for statutory grid energization certificate.',
    },
    {
      id: 'P-0655',
      title: 'Zilla Parishad High School Science & IT Wing',
      location: 'Shirur, Pune',
      agency: 'Public Works Department (PWD)',
      sanctioned: '₹48.00 L',
      utilized: '₹42.24 L',
      completion: 88,
      utilizationRate: 88.0,
      riskScore: 35,
      stage: 'Execution (On Track)',
      stageIndex: 5,
      health: 'ON TRACK',
      reasons: [
        'Physical progress aligned with approved architectural drawings',
      ],
      recommendedAction: 'Final verification brief generation for district archival.',
    },
  ];

  const filteredProjects = constituencyProjects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.agency.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = selectedStageFilter === 'ALL' || p.stage.includes(selectedStageFilter);
    const matchesRisk = selectedRiskFilter === 'ALL' || p.health === selectedRiskFilter;
    return matchesSearch && matchesStage && matchesRisk;
  });

  const handleOpenRiskDrawer = (p: typeof constituencyProjects[0]) => {
    setSelectedProjectForSheet({
      id: p.id,
      title: p.title,
      category: 'Constituency Development',
      location: p.location,
      state: selectedMp.state,
      district: selectedMp.constituency.split(' ')[0] || 'Pune',
      sanctionedAmount: p.sanctioned,
      expenditure: p.utilized,
      physicalProgress: p.completion,
      financialProgress: p.utilizationRate,
      expectedCompletion: '30 Oct 2026',
      riskScore: p.riskScore,
      severity: p.riskScore >= 80 ? 'CRITICAL' : p.riskScore >= 60 ? 'HIGH' : 'LOW',
      reasons: p.reasons,
      evidenceDocuments: [
        { name: `Technical Sanction (${p.id}-TS.pdf)`, type: 'Estimate', status: 'VERIFIED', date: '14 Feb 2025' },
        { name: `e-Tender Bid Comparative Statement`, type: 'Procurement', status: p.riskScore >= 80 ? 'FLAGGED' : 'VERIFIED', date: '28 Feb 2025' },
        { name: `Treasury DBT Vouchers (V-991 to V-994)`, type: 'Disbursement', status: 'AVAILABLE', date: '12 May 2025' },
        { name: `Geotagged Foundation Excavation Photo`, type: 'Site EXIF', status: 'VERIFIED', date: '20 Jun 2025' },
        { name: `GFR-12C Utilisation Certificate Stage 2`, type: 'Statutory', status: p.riskScore >= 80 ? 'FLAGGED' : 'PENDING', date: '15 Jul 2025' },
      ],
      recommendedAction: p.recommendedAction,
      executingAgency: p.agency,
      contractor: 'Awarded Infrastructure Entity',
    });
    setSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <PageHeader
        title="MP Performance & Risk Intelligence"
        subtitle="Constituency project monitoring, fund utilisation and early-warning intelligence"
        badge={
          <div className="flex items-center gap-1.5 bg-[#15324A] text-white px-2.5 py-1 rounded-[4px] font-mono text-xs">
            <span className="h-2 w-2 rounded-full bg-[#E5B45A] animate-pulse" />
            <span>CONSTITUENCY LENS: {selectedMp.constituency.toUpperCase()}</span>
          </div>
        }
        breadcrumbs={[
          { label: 'Intelligence Platform', path: '/' },
          { label: 'MP / Constituency Dashboard' },
        ]}
      />

      {/* Institutional Disclaimer Notice */}
      <div className="rounded-[4px] border border-[#234D6C]/30 bg-[#102F45]/10 p-3 flex items-start gap-3 text-xs text-[#172B3A]">
        <Info className="h-4 w-4 text-[#D99018] flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#15324A]">MONITORING & DECISION SUPPORT LAYER:</span>{' '}
          This dashboard consumes official public works records from eSAKSHI and state treasuries for oversight. Project recommendations, technical sanctions, and fund allocations remain governed by official statutory portals.
        </div>
      </div>

      {/* KPI ROW (Constituency Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-white p-3.5 rounded-[6px] border border-[#D9DFE3] shadow-card">
          <span className="text-[10px] font-mono text-[#647383] uppercase block">Total Works</span>
          <strong className="text-xl font-mono font-extrabold text-[#15324A] block mt-0.5">38</strong>
          <span className="text-[10px] text-[#647383]">Constituency Portfolio</span>
        </div>

        <div className="bg-white p-3.5 rounded-[6px] border border-[#D9DFE3] shadow-card">
          <span className="text-[10px] font-mono text-[#647383] uppercase block">Sanctioned</span>
          <strong className="text-xl font-mono font-extrabold text-[#15324A] block mt-0.5">₹18.50 Cr</strong>
          <span className="text-[10px] text-[#647383]">Approved Outlay</span>
        </div>

        <div className="bg-white p-3.5 rounded-[6px] border border-[#D9DFE3] shadow-card">
          <span className="text-[10px] font-mono text-[#647383] uppercase block">Utilised Amount</span>
          <strong className="text-xl font-mono font-extrabold text-[#2E8064] block mt-0.5">₹15.20 Cr</strong>
          <span className="text-[10px] text-[#2E8064] font-semibold">Disbursed via DBT</span>
        </div>

        <div className="bg-white p-3.5 rounded-[6px] border border-[#D9DFE3] shadow-card">
          <span className="text-[10px] font-mono text-[#647383] uppercase block">Utilisation %</span>
          <strong className="text-xl font-mono font-extrabold text-[#2E8064] block mt-0.5">82.2%</strong>
          <span className="text-[10px] text-[#2E8064] font-semibold">Healthy Conversion</span>
        </div>

        <div className="bg-white p-3.5 rounded-[6px] border border-[#D9DFE3] shadow-card">
          <span className="text-[10px] font-mono text-[#647383] uppercase block">Completed Works</span>
          <strong className="text-xl font-mono font-extrabold text-[#15324A] block mt-0.5">24</strong>
          <span className="text-[10px] text-[#647383]">63.2% Completed</span>
        </div>

        <div className="bg-white p-3.5 rounded-[6px] border border-[#D9DFE3] shadow-card">
          <span className="text-[10px] font-mono text-[#647383] uppercase block">Delayed Works</span>
          <strong className="text-xl font-mono font-extrabold text-[#C98220] block mt-0.5">6</strong>
          <span className="text-[10px] text-[#C98220] font-semibold">Past Milestone SLA</span>
        </div>

        <div className="bg-white p-3.5 rounded-[6px] border border-[#D9DFE3] shadow-card">
          <span className="text-[10px] font-mono text-[#647383] uppercase block">High-Risk Works</span>
          <strong className="text-xl font-mono font-extrabold text-[#C94B4B] block mt-0.5">3</strong>
          <span className="text-[10px] text-[#C94B4B] font-semibold">Requires Review</span>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9DFE3] pb-2">
          <TabsList className="bg-[#FAFAF7] border border-[#D9DFE3]">
            <TabsTrigger value="portfolio" className="text-xs font-bold">
              Constituency Project Portfolio
            </TabsTrigger>
            <TabsTrigger value="health" className="text-xs font-bold">
              Project Health & Lifecycle
            </TabsTrigger>
            <TabsTrigger value="early-warning" className="text-xs font-bold">
              AI Early Warning Signals
            </TabsTrigger>
            <TabsTrigger value="trends" className="text-xs font-bold">
              Fund Utilisation Trend
            </TabsTrigger>
            <TabsTrigger value="compare" className="text-xs font-bold">
              Compare with Peer MPs
            </TabsTrigger>
          </TabsList>

          {/* Search bar */}
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#647383]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search works, location, agency..."
              className="pl-8 pr-3 py-1 rounded-[4px] border border-[#D9DFE3] bg-white text-xs text-[#172B3A] placeholder-[#647383] outline-none focus:border-[#15324A] w-64"
            />
          </div>
        </div>

        {/* TAB 1: CONSTITUENCY PROJECT PORTFOLIO */}
        <TabsContent value="portfolio" className="space-y-4 pt-4">
          <div className="rounded-[8px] border-2 border-[#15324A] bg-white shadow-card overflow-hidden">
            <div className="p-4 border-b border-[#D9DFE3] bg-[#FAFAF7] flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-[#15324A] uppercase tracking-wide">
                  Live Constituency Works Portfolio ({filteredProjects.length} Projects)
                </h3>
                <p className="text-xs text-[#647383] mt-0.5">
                  Click any project row to inspect explainable risk telemetry, photographic evidence, and voucher records.
                </p>
              </div>

              {/* Filter controls */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedRiskFilter}
                  onChange={(e) => setSelectedRiskFilter(e.target.value)}
                  className="px-2 py-1 rounded-[4px] border border-[#D9DFE3] bg-white text-xs font-mono text-[#172B3A] outline-none"
                >
                  <option value="ALL">All Health States</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH RISK">High Risk</option>
                  <option value="AT RISK">At Risk</option>
                  <option value="ON TRACK">On Track</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FAFAF7] border-b border-[#D9DFE3] font-mono text-[11px] text-[#15324A] uppercase">
                    <th className="p-3 font-bold">Project ID & Title</th>
                    <th className="p-3 font-bold">Location & IA</th>
                    <th className="p-3 font-bold">Sanctioned</th>
                    <th className="p-3 font-bold">Physical / Financial</th>
                    <th className="p-3 font-bold">Current Stage</th>
                    <th className="p-3 font-bold">Risk Index</th>
                    <th className="p-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9DFE3]">
                  {filteredProjects.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => handleOpenRiskDrawer(p)}
                      className="hover:bg-[#FAFAF7] transition-colors cursor-pointer"
                    >
                      <td className="p-3">
                        <span className="font-bold text-[#172B3A] block hover:text-[#D99018]">
                          {p.title}
                        </span>
                        <span className="text-[10px] font-mono text-[#647383]">Ref: {p.id}</span>
                      </td>

                      <td className="p-3">
                        <span className="text-[#172B3A] block font-medium">{p.location}</span>
                        <span className="text-[10px] text-[#647383]">{p.agency}</span>
                      </td>

                      <td className="p-3 font-mono">
                        <strong className="text-[#15324A]">{p.sanctioned}</strong>
                        <span className="block text-[10px] text-[#647383]">Utilised: {p.utilized}</span>
                      </td>

                      <td className="p-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-[#2E8064] font-semibold">{p.completion}% Phy</span>
                            <span className="text-[#C94B4B] font-semibold">{p.utilizationRate}% Fin</span>
                          </div>
                          <div className="h-1.5 w-24 bg-[#D9DFE3] rounded-full overflow-hidden">
                            <div className="h-full bg-[#15324A] rounded-full" style={{ width: `${p.completion}%` }} />
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <span className="text-[11px] font-mono font-medium text-[#172B3A] bg-[#FAFAF7] px-2 py-0.5 rounded border border-[#D9DFE3]">
                          {p.stage}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-1.5 font-mono">
                          <span
                            className={`text-xs font-extrabold px-1.5 py-0.5 rounded ${
                              p.riskScore >= 80
                                ? 'bg-red-50 text-[#C94B4B] border border-[#C94B4B]/30'
                                : p.riskScore >= 60
                                ? 'bg-amber-50 text-[#C98220] border border-[#C98220]/30'
                                : 'bg-emerald-50 text-[#2E8064] border border-[#2E8064]/30'
                            }`}
                          >
                            {p.riskScore}
                          </span>
                          <span className="text-[10px] text-[#647383] font-bold">{p.health}</span>
                        </div>
                      </td>

                      <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenRiskDrawer(p)}
                            className="h-7 px-2 text-[10px] font-semibold text-[#15324A] hover:bg-[#D9DFE3]/50"
                          >
                            <ShieldAlert className="h-3 w-3 mr-1 text-[#D99018]" />
                            Inspect
                          </Button>
                          <Link to={`/projects/${p.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 px-2 text-[10px] font-bold border-[#15324A] text-[#15324A] hover:bg-[#15324A] hover:text-white"
                            >
                              <Eye className="h-3 w-3 mr-1" /> Cockpit
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section F: ASK AGASTYA INTELLIGENCE (Constituency Assistant) */}
          <div className="rounded-[6px] border border-[#234D6C] bg-[#102F45] text-white p-5 space-y-3 shadow-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#D99018]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Ask Agastya Intelligence — Constituency Assistant
                </h4>
              </div>
              <span className="text-[10px] font-mono text-[#E5B45A] bg-[#183B54] px-2 py-0.5 rounded border border-[#234D6C]">
                GROUNDED IN OFFICIAL LEDGERS
              </span>
            </div>

            <p className="text-xs text-gray-300">
              Instant explainable answers grounded in verified Schedule of Rates, treasury disbursements, and milestone SLA deadlines.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {[
                'Why is Ward 17 Community Hall high risk?',
                'Which projects in Pune constituency are delayed?',
                'Show projects with high expenditure but low physical progress',
                'Explain Project P-1023 risk score and evidence',
                'Show contractor concentration signals in Haveli',
              ].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleAskAgastya(q)}
                  className="rounded-[4px] bg-[#183B54] hover:bg-[#234D6C] text-gray-200 hover:text-white px-3 py-1.5 text-xs font-medium border border-[#234D6C] transition-colors text-left flex items-center gap-1.5"
                >
                  <MessageSquare className="h-3 w-3 text-[#D99018]" />
                  <span>{q}</span>
                </button>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: PROJECT HEALTH & LIFECYCLE */}
        <TabsContent value="health" className="space-y-6 pt-4">
          <div className="bg-white p-6 rounded-[6px] border border-[#D9DFE3] shadow-card space-y-6">
            <div>
              <h3 className="text-sm font-bold text-[#15324A] uppercase tracking-wider">
                Work Lifecycle Telemetry: {selectedMp.constituency} ({selectedMp.name})
              </h3>
              <p className="text-xs text-[#647383] mt-0.5">
                Monitoring stage conversion velocity across the official 8-stage MPLADS execution pipeline.
              </p>
            </div>

            {/* Visual 8-Stage Lifecycle Funnel */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 font-mono text-center">
              {[
                { stage: '1. Recommended', count: 38, label: 'Official Submission' },
                { stage: '2. Eligibility', count: 36, label: 'Guidelines OK' },
                { stage: '3. Sanctioned', count: 34, label: 'Admin Sanction' },
                { stage: '4. IA Assigned', count: 34, label: 'Executing Body' },
                { stage: '5. Tendered', count: 31, label: 'Procurement Done' },
                { stage: '6. Execution', count: 28, label: 'Under Construction' },
                { stage: '7. Completed', count: 24, label: 'Civil Works Done' },
                { stage: '8. Handover', count: 22, label: 'Public Handover' },
              ].map((st, idx) => (
                <div key={st.stage} className="p-3 rounded bg-[#FAFAF7] border border-[#D9DFE3] space-y-1">
                  <span className="text-[9px] font-bold text-[#647383] uppercase block">{st.stage}</span>
                  <div className="text-xl font-extrabold text-[#15324A]">{st.count}</div>
                  <span className="text-[9px] text-[#2E8064] font-bold block">{st.label}</span>
                </div>
              ))}
            </div>

            {/* Health Breakdown */}
            <div className="pt-4 border-t border-[#D9DFE3] space-y-3">
              <h4 className="text-xs font-bold text-[#15324A] uppercase tracking-wider">
                Constituency Project Health Distribution
              </h4>
              <div className="h-4 w-full bg-[#D9DFE3] rounded-full overflow-hidden flex">
                <div style={{ width: '63%' }} className="bg-[#2E8064]" title="On Track: 63%" />
                <div style={{ width: '21%' }} className="bg-[#E5B45A]" title="At Risk / Watchlist: 21%" />
                <div style={{ width: '11%' }} className="bg-[#C98220]" title="Delayed: 11%" />
                <div style={{ width: '5%' }} className="bg-[#C94B4B]" title="Critical: 5%" />
              </div>
              <div className="flex flex-wrap items-center justify-between text-xs font-mono">
                <span className="text-[#2E8064] font-bold">🟢 On Track: 24 Works (63%)</span>
                <span className="text-[#C98220] font-bold">🟡 At Risk: 8 Works (21%)</span>
                <span className="text-[#C98220] font-bold">🟠 Delayed: 4 Works (11%)</span>
                <span className="text-[#C94B4B] font-bold">🔴 Critical: 2 Works (5%)</span>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB 3: AI EARLY WARNING SIGNALS */}
        <TabsContent value="early-warning" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded bg-white border border-[#D9DFE3] shadow-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#C94B4B] uppercase">COST ESCALATION</span>
                <Badge variant="critical">HIGH RISK</Badge>
              </div>
              <h4 className="text-xs font-bold text-[#15324A]">Ward 17 Community Hall (P-1023)</h4>
              <p className="text-[11px] text-[#647383]">
                +38.2% cost mark-up vs prevailing PWD Schedule of Rates. Unit cement and reinforcement steel rates exceed district baseline.
              </p>
              <div className="pt-2 text-right">
                <button
                  type="button"
                  onClick={() => handleOpenRiskDrawer(constituencyProjects[0])}
                  className="text-xs font-bold text-[#15324A] hover:underline"
                >
                  Inspect Evidence →
                </button>
              </div>
            </div>

            <div className="p-4 rounded bg-white border border-[#D9DFE3] shadow-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#C98220] uppercase">DISBURSEMENT MISMATCH</span>
                <Badge variant="warning">MEDIUM</Badge>
              </div>
              <h4 className="text-xs font-bold text-[#15324A]">Village Link Road KM 12/400 (P-0871)</h4>
              <p className="text-[11px] text-[#647383]">
                87.0% financial disbursement recorded against 51.0% verified physical completion (+36.0% disbursement lag).
              </p>
              <div className="pt-2 text-right">
                <button
                  type="button"
                  onClick={() => handleOpenRiskDrawer(constituencyProjects[1])}
                  className="text-xs font-bold text-[#15324A] hover:underline"
                >
                  Inspect Evidence →
                </button>
              </div>
            </div>

            <div className="p-4 rounded bg-white border border-[#D9DFE3] shadow-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#C98220] uppercase">DUPLICATE WORK ALERT</span>
                <Badge variant="warning">WATCHLIST</Badge>
              </div>
              <h4 className="text-xs font-bold text-[#15324A]">Haveli Pavement Overlap (P-0871)</h4>
              <p className="text-[11px] text-[#647383]">
                74% geospatial coordinate similarity with PMGSY Batch III paved road completed in November 2023.
              </p>
              <div className="pt-2 text-right">
                <button
                  type="button"
                  onClick={() => handleOpenRiskDrawer(constituencyProjects[1])}
                  className="text-xs font-bold text-[#15324A] hover:underline"
                >
                  Inspect Evidence →
                </button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB 4: FUND UTILISATION TREND */}
        <TabsContent value="trends" className="space-y-4 pt-4">
          <div className="bg-white p-5 rounded-[6px] border border-[#D9DFE3] shadow-card">
            <h4 className="text-xs font-bold text-[#15324A] uppercase tracking-wider mb-2">
              Year-Wise Allocation vs Utilisation (₹ Crore) — {selectedMp.constituency}
            </h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={selectedMp.financial.yearWiseExpense}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D9DFE3" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="allocated" fill="#15324A" name="Allocated (₹ Cr)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="utilized" fill="#2E8064" name="Utilized (₹ Cr)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        {/* TAB 5: COMPARE WITH PEERS */}
        <TabsContent value="compare" className="pt-4">
          <MpComparisonView />
        </TabsContent>
      </Tabs>

      {/* Reusable Project Risk Sheet Drawer */}
      <ProjectRiskSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        project={selectedProjectForSheet}
      />
    </div>
  );
}
