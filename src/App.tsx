import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { WiseHeroBalance } from './components/WiseHeroBalance';
import { WiseCardsRow } from './components/WiseCardsRow';
import { WiseNoticeBanner } from './components/WiseNoticeBanner';
import { WiseTransactionsList } from './components/WiseTransactionsList';
import { RiskTrendChartCard } from './components/RiskTrendChartCard';
import { FlaggedProjectsTable } from './components/FlaggedProjectsTable';
import { ProjectDossierModal } from './components/ProjectDossierModal';
import { QuickActionModal } from './components/QuickActionModal';
import { DesignSpecModal } from './components/DesignSpecModal';
import { WiseOfficerProfileModal } from './components/WiseOfficerProfileModal';
import { ClaudeForensicCopilot } from './components/ClaudeForensicCopilot';
import { InteractiveEntityGraph } from './components/InteractiveEntityGraph';
import { InteractiveConstituencyExplorer } from './components/InteractiveConstituencyExplorer';
import { ComplianceTrendlineChart } from './components/ComplianceTrendlineChart';
import { FLAGGED_PROJECTS, SYSTEM_METRICS } from './data/mockData';
import { getDashboardSummary } from './services/api';
import { MPLADSProject } from './types';
import { Landmark, ShieldAlert, Users, Plus, ArrowLeft, Sparkles, Bot } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [isDesignSpecOpen, setIsDesignSpecOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<MPLADSProject | null>(null);
  const [quickActionType, setQuickActionType] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showAnalyticsChart, setShowAnalyticsChart] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Real backend metrics state (falls back to mock if backend offline)
  const [systemMetrics, setSystemMetrics] = useState(SYSTEM_METRICS);
  // Mutable projects state for interactive freezing
  const [projectsList, setProjectsList] = useState<MPLADSProject[]>(FLAGGED_PROJECTS);

  const fetchDashboardData = async () => {
    const { data, error } = await getDashboardSummary();
    if (data && !error) {
      setSystemMetrics((prev) => ({
        ...prev,
        totalSanctionedCr: data.total_sanctioned_cr,
        totalExpendedCr: data.total_expended_cr,
        utilizationRate: data.overall_utilisation_percentage,
        totalMonitoredProjects: data.total_projects,
        flaggedOutlayCr: data.flagged_outlay_cr,
        flaggedProjectsCount: data.flagged_projects_count,
        activeCriticalAlerts: data.critical_count,
        nationalCompositeTrustScore: data.composite_trust_score,
        trustScoreDelta: data.trust_score_delta,
        riskDistribution: {
          low: { count: data.risk_distribution.low.count, percent: data.risk_distribution.low.percent, label: data.risk_distribution.low.label },
          medium: { count: data.risk_distribution.medium.count, percent: data.risk_distribution.medium.percent, label: data.risk_distribution.medium.label },
          high: { count: data.risk_distribution.high.count, percent: data.risk_distribution.high.percent, label: data.risk_distribution.high.label },
          critical: { count: data.risk_distribution.critical.count, percent: data.risk_distribution.critical.percent, label: data.risk_distribution.critical.label },
        },
      }));

      if (data.top_flagged_projects && data.top_flagged_projects.length > 0) {
        const mappedTop: MPLADSProject[] = data.top_flagged_projects.map((p: any) => ({
          id: p.id,
          code: p.code,
          title: p.title,
          category: 'Rural Roads',
          state: p.state,
          constituency: `${p.district} Constituency`,
          constituencyType: 'Lok Sabha' as const,
          mpName: `Hon. Member ${p.district}`,
          implementingAgency: 'District Rural Development Agency',
          contractorName: 'Registered Infra Vendor',
          contractorGstin: '27AAAAA0000A1Z5',
          sanctionedAmountCr: p.sanctioned_amount_cr,
          disbursedAmountCr: p.expended_amount_cr,
          expendedAmountCr: p.expended_amount_cr,
          sanctionDate: '2024-03-12',
          targetCompletionDate: '2024-12-30',
          physicalProgressPercent: p.physical_progress,
          reportedFinancialProgressPercent: p.financial_progress,
          discrepancyPercent: p.discrepancy_percent,
          trustScore: Math.round(100 - p.risk_score),
          riskTier: p.risk_tier as any,
          primaryAnomaly: p.top_signals[0] || 'ELEVATED_RISK_SIGNAL',
          anomalyCategory: 'Vendor Collusion' as const,
          satelliteAuditStatus: 'Verified' as const,
          status: p.risk_tier === 'critical' ? 'Disbursal Frozen' : 'Under Forensic Review',
          flaggedDate: '2025-02-23',
        }));
        setProjectsList(mappedTop);
      }
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboardData();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleToggleFreeze = (projectId: string) => {
    setProjectsList((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const newStatus =
            p.status === 'Disbursal Frozen' ? 'Under Forensic Review' : 'Disbursal Frozen';
          return { ...p, status: newStatus };
        }
        return p;
      })
    );
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject((prev) =>
        prev
          ? {
              ...prev,
              status:
                prev.status === 'Disbursal Frozen'
                  ? 'Under Forensic Review'
                  : 'Disbursal Frozen',
            }
          : null
      );
    }
  };

  const activeFreezesCount = projectsList.filter((p) => p.status === 'Disbursal Frozen').length;

  const filteredProjects = projectsList.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.code.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      p.constituency.toLowerCase().includes(q) ||
      p.contractorName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex min-h-screen w-screen bg-white text-[#0E0E0E] font-sans antialiased">
      {/* 1. Wise-identical Fixed Left Sidebar */}
      <Sidebar
        currentView={currentView}
        onSelectView={(view) => setCurrentView(view)}
        flaggedCount={projectsList.filter((p) => p.riskTier === 'critical').length}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 bg-white">
        {/* Wise Top Header */}
        <Header
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
          onOpenDesignSpec={() => setIsDesignSpecOpen(true)}
          onRefreshData={handleRefresh}
          isRefreshing={isRefreshing}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenProfile={() => setIsProfileOpen(true)}
        />

        {/* Focused Main Content Area */}
        <main
          id="main-wise-canvas"
          className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 max-w-5xl w-full mx-auto space-y-8"
        >
          {/* HOME / OVERVIEW VIEW (Matching Wise Screenshot Pixel-for-Pixel) */}
          {currentView === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* 1. Hero Total Outlay & Action Pills Row */}
              <WiseHeroBalance
                onAuditScan={() => setQuickActionType('satellite')}
                onFreezeTranche={() => setQuickActionType('freeze')}
                onSelectDirective={(directive) => setQuickActionType(directive)}
                onToggleAnalytics={() => setShowAnalyticsChart(!showAnalyticsChart)}
                trustScore={systemMetrics.nationalCompositeTrustScore}
                totalOutlayCr={systemMetrics.totalSanctionedCr}
              />

              {/* Optional Inline Scheme Analytics Card (when toggled via chart icon) */}
              {showAnalyticsChart && (
                <div className="animate-in fade-in zoom-in-95 duration-150">
                  <RiskTrendChartCard />
                </div>
              )}

              {/* 2. Top Two-Card Row (Everyday account + Do more with AI Sentinel) */}
              <WiseCardsRow
                onOpenCardDetails={() => setCurrentView('fund-cards')}
                onOpenDoMoreAction={() => setQuickActionType('satellite')}
                onSelectSubBalance={(type) => {
                  if (type === 'flagged') {
                    setCurrentView('flagged-projects');
                  } else {
                    setQuickActionType('freeze');
                  }
                }}
                totalOutlayCr={systemMetrics.totalSanctionedCr}
                disbursedCr={systemMetrics.totalExpendedCr}
                flaggedRiskCr={systemMetrics.flaggedOutlayCr}
                reconciledCr={systemMetrics.totalExpendedCr - systemMetrics.flaggedOutlayCr}
                activeFreezesCount={activeFreezesCount}
              />

              {/* 30-Day Compliance Reliability Animated Recharts Trendline below National Scheme Account */}
              <ComplianceTrendlineChart
                currentScore={systemMetrics.nationalCompositeTrustScore}
                onOpenAuditLog={() => setShowAnalyticsChart(!showAnalyticsChart)}
              />

              {/* 3. Dismissible Notice Banner Strip */}
              <WiseNoticeBanner
                onFindOutMore={() => setIsDesignSpecOpen(true)}
              />

              {/* 4. Transactions / Recent Flagged Audit Activity Section */}
              <WiseTransactionsList
                projects={filteredProjects}
                onSelectProject={(project) => setSelectedProject(project)}
                onSeeAll={() => setCurrentView('flagged-projects')}
              />
            </div>
          )}

          {/* SECONDARY VIEW: Full Transactions / Flagged Projects View */}
          {currentView === 'flagged-projects' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#F1F0EC]">
                <div>
                  <button
                    onClick={() => setCurrentView('overview')}
                    className="text-xs text-[#6B6B6B] hover:text-[#0E0E0E] flex items-center gap-1 mb-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
                  </button>
                  <h1 className="text-2xl font-semibold text-[#0E0E0E]">Transactions & Flagged Works</h1>
                  <p className="text-xs text-[#6B6B6B]">
                    38 high-priority discrepancies flagged across 543 Parliamentary Constituencies
                  </p>
                </div>

                <button
                  onClick={() => setQuickActionType('freeze')}
                  className="bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold px-4 py-2 rounded-full cursor-pointer"
                >
                  Freeze Disbursals
                </button>
              </div>

              <FlaggedProjectsTable
                projects={filteredProjects}
                onSelectProject={(project) => setSelectedProject(project)}
              />
            </div>
          )}

          {/* SECONDARY VIEW: Cards / Scheme Fund Accounts */}
          {currentView === 'fund-cards' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#F1F0EC]">
                <div>
                  <button
                    onClick={() => setCurrentView('overview')}
                    className="text-xs text-[#6B6B6B] hover:text-[#0E0E0E] flex items-center gap-1 mb-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
                  </button>
                  <h1 className="text-2xl font-semibold text-[#0E0E0E]">Scheme Cards & Allocation Tranches</h1>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#F1F0EC] p-6 rounded-[20px] space-y-4">
                  <div className="w-full h-36 bg-[#15803D] rounded-2xl p-4 flex flex-col justify-between text-white shadow-sm">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold uppercase tracking-wider">MPLADS Central Tranche Card</span>
                      <span className="text-base font-bold">7</span>
                    </div>
                    <div>
                      <span className="text-xl font-bold tracking-tight">₹4,950.00 Cr</span>
                      <span className="text-xs block opacity-80">PFMS Nodal Treasury Account</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-[#6B6B6B]">
                    <div className="flex justify-between py-1 border-b border-[#EAE8E2]">
                      <span>Issued Authority:</span>
                      <span className="font-semibold text-[#0E0E0E]">MoSPI Central Division</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#EAE8E2]">
                      <span>Reconciled Outflow:</span>
                      <span className="font-semibold text-[#0E0E0E]">₹3,840.50 Cr (77.58%)</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Forensic Security Status:</span>
                      <span className="font-semibold text-emerald-700">Audit Lock Enforced</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#F1F0EC] p-6 rounded-[20px] flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-semibold text-[#0E0E0E]">Add or Reallocate Tranche</h3>
                    <p className="text-xs text-[#6B6B6B] mt-1 leading-relaxed">
                      Issue statutory fund releases through the Public Financial Management System (PFMS) or establish state nodal escrow reserves.
                    </p>
                  </div>
                  <button
                    onClick={() => setQuickActionType('freeze')}
                    className="w-full py-3 rounded-full bg-[#0E0E0E] text-white text-xs font-semibold hover:bg-black cursor-pointer"
                  >
                    Manage Tranche Locks
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECONDARY VIEW: Recipients & Contractor Entity Analytics */}
          {currentView === 'recipients' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#F1F0EC]">
                <div>
                  <button
                    onClick={() => setCurrentView('overview')}
                    className="text-xs text-[#6B6B6B] hover:text-[#0E0E0E] flex items-center gap-1 mb-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
                  </button>
                  <h1 className="text-2xl font-semibold text-[#0E0E0E]">Recipients & Contractor Entity Network</h1>
                  <p className="text-xs text-[#6B6B6B]">
                    Cross-entity PAN linkages, shared auditor credentials, and shell company bid-rigging rings
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsCopilotOpen(true)}
                    className="bg-[#0E0E0E] hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-full cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#15803D]" />
                    <span>AI Forensic Copilot</span>
                  </button>
                  <button
                    onClick={() => setQuickActionType('subpoena')}
                    className="bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold px-4 py-2 rounded-full cursor-pointer"
                  >
                    Issue Nexus Subpoena
                  </button>
                </div>
              </div>

              {/* Interactive SVG Network Graph */}
              <InteractiveEntityGraph
                onTriggerSubpoena={() => setQuickActionType('subpoena')}
                onSelectProject={(project) => setSelectedProject(project)}
              />

              {/* Network stats summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-[20px] bg-[#F1F0EC] space-y-1">
                  <span className="text-xs text-[#6B6B6B]">Detected Shell Clusters</span>
                  <span className="text-2xl font-semibold text-[#0E0E0E] block">14 Rings</span>
                  <span className="text-[11px] text-red-600 font-medium">8 sharing common CA PAN</span>
                </div>
                <div className="p-5 rounded-[20px] bg-[#F1F0EC] space-y-1">
                  <span className="text-xs text-[#6B6B6B]">Flagged Combined Outlay</span>
                  <span className="text-2xl font-semibold text-[#0E0E0E] block">₹412.80 Cr</span>
                  <span className="text-[11px] text-[#6B6B6B]">Across 38 high-risk works</span>
                </div>
                <div className="p-5 rounded-[20px] bg-[#F1F0EC] space-y-1">
                  <span className="text-xs text-[#6B6B6B]">Cross-Bid Win Rate</span>
                  <span className="text-2xl font-semibold text-[#0E0E0E] block">94.2%</span>
                  <span className="text-[11px] text-amber-700 font-medium">Statistically anomalous</span>
                </div>
              </div>

              {/* Collusion Clusters List */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-[#0E0E0E]">Identified Contractor Nexus Rings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectsList.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProject(p)}
                      className="p-5 rounded-[20px] bg-[#F1F0EC] hover:bg-[#EAE8E2] transition-colors cursor-pointer space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white text-[#0E0E0E]">
                          {p.code}
                        </span>
                        <span className="text-xs font-semibold text-red-600">
                          Trust: {p.trustScore}/100
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#0E0E0E]">{p.contractorName}</h4>
                        <p className="text-xs text-[#6B6B6B] mt-0.5">GSTIN: {p.contractorGstin} • {p.constituency}</p>
                      </div>
                      <div className="p-3 bg-white rounded-xl text-xs space-y-1">
                        <div className="flex justify-between text-[#6B6B6B]">
                          <span>Director PAN:</span>
                          <span className="font-semibold text-[#0E0E0E]">ABCDP8841M</span>
                        </div>
                        <div className="flex justify-between text-[#6B6B6B]">
                          <span>Shared Bidding Nodes:</span>
                          <span className="font-semibold text-red-600">3 sister entities</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. VIEW: Case Briefs (Investigation sub-item) */}
          {currentView === 'case-briefs' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#F1F0EC]">
                <div>
                  <button
                    onClick={() => setCurrentView('overview')}
                    className="text-xs text-[#6B6B6B] hover:text-[#0E0E0E] flex items-center gap-1 mb-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
                  </button>
                  <h1 className="text-2xl font-semibold text-[#0E0E0E]">Investigation: Case Briefs</h1>
                  <p className="text-xs text-[#6B6B6B]">
                    Statutory audit briefs, forensic logs, and formal CAG prosecution dockets
                  </p>
                </div>

                <button
                  onClick={() => setQuickActionType('export')}
                  className="bg-[#0E0E0E] text-white text-xs font-semibold px-4 py-2 rounded-full cursor-pointer hover:bg-black"
                >
                  Export Executive Brief (PDF)
                </button>
              </div>

              <div className="space-y-4">
                {projectsList.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProject(p)}
                    className="p-5 rounded-[20px] bg-[#F1F0EC] hover:bg-[#EAE8E2] transition-colors cursor-pointer space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#0E0E0E] text-white">
                          {p.cagReference}
                        </span>
                        <span className="text-xs font-medium text-[#6B6B6B]">{p.flaggedDate}</span>
                      </div>
                      <span className="text-xs font-semibold text-red-700 bg-red-100 px-2.5 py-1 rounded-full">
                        {p.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-[#0E0E0E]">{p.title}</h3>
                      <p className="text-xs text-[#6B6B6B] mt-1 leading-relaxed">{p.detailedAnalysis}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-[#E5E3DC]">
                      <span className="text-[#6B6B6B]">Sanctioned: ₹{p.sanctionedAmountCr.toFixed(2)} Cr • Disbursed: ₹{p.disbursedAmountCr.toFixed(2)} Cr</span>
                      <span className="text-red-600 font-semibold">Divergence Gap: +{p.discrepancyPercent.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. VIEW: Early Warnings (Investigation sub-item) */}
          {currentView === 'early-warnings' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#F1F0EC]">
                <div>
                  <button
                    onClick={() => setCurrentView('overview')}
                    className="text-xs text-[#6B6B6B] hover:text-[#0E0E0E] flex items-center gap-1 mb-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
                  </button>
                  <h1 className="text-2xl font-semibold text-[#0E0E0E]">Investigation: Early Warnings</h1>
                  <p className="text-xs text-[#6B6B6B]">
                    Real-time radar anomalies, sudden treasury drawdowns, and pre-emptive risk signals
                  </p>
                </div>

                <button
                  onClick={() => setQuickActionType('satellite')}
                  className="bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold px-4 py-2 rounded-full cursor-pointer"
                >
                  Task Orbital Radar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-[20px] bg-[#F1F0EC] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-red-600">Level 1 Immediate Alert</span>
                    <span className="text-xs text-[#6B6B6B]">14 mins ago</span>
                  </div>
                  <h3 className="text-base font-semibold text-[#0E0E0E]">Disproportionate Q4 Fund Drawdown</h3>
                  <p className="text-xs text-[#6B6B6B] leading-relaxed">
                    Eastern UP Cluster withdrew 88% of annual capital outlay within 72 hours of fiscal quarter closure without corresponding geotagged milestone photos.
                  </p>
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setQuickActionType('freeze')}
                      className="px-4 py-1.5 rounded-full bg-[#0E0E0E] text-white text-xs font-semibold hover:bg-black"
                    >
                      Enforce Treasury Lock
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-[20px] bg-[#F1F0EC] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-orange-600">Level 2 Optical Divergence</span>
                    <span className="text-xs text-[#6B6B6B]">1 hour ago</span>
                  </div>
                  <h3 className="text-base font-semibold text-[#0E0E0E]">Zero Earthwork at Claimed 65% Phase</h3>
                  <p className="text-xs text-[#6B6B6B] leading-relaxed">
                    Cartosat-3 SAR radar detected zero soil excavation on Bellary bypass road despite 3rd tranche clearance by PWD Executive Engineer.
                  </p>
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setQuickActionType('subpoena')}
                      className="px-4 py-1.5 rounded-full bg-[#0E0E0E] text-white text-xs font-semibold hover:bg-black"
                    >
                      Issue Show Cause
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. VIEW: Risk Fingerprint (Investigation sub-item) */}
          {currentView === 'risk-fingerprint' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#F1F0EC]">
                <div>
                  <button
                    onClick={() => setCurrentView('overview')}
                    className="text-xs text-[#6B6B6B] hover:text-[#0E0E0E] flex items-center gap-1 mb-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
                  </button>
                  <h1 className="text-2xl font-semibold text-[#0E0E0E]">Investigation: Risk Fingerprint</h1>
                  <p className="text-xs text-[#6B6B6B]">
                    Multi-vector risk profiles categorized by physical, contractor, financial, and regulatory metrics
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-[20px] bg-[#F1F0EC] space-y-4">
                  <h3 className="text-base font-semibold text-[#0E0E0E]">National Vector Breakdown</h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between mb-1 font-medium">
                        <span className="text-[#0E0E0E]">Satellite Optical Ground Divergence</span>
                        <span className="text-red-600 font-semibold">41.8%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#E5E3DC] overflow-hidden">
                        <div className="h-full bg-red-600 rounded-full" style={{ width: '41.8%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1 font-medium">
                        <span className="text-[#0E0E0E]">Vendor Collusion & Shared PANs</span>
                        <span className="text-purple-700 font-semibold">28.4%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#E5E3DC] overflow-hidden">
                        <div className="h-full bg-purple-600 rounded-full" style={{ width: '28.4%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1 font-medium">
                        <span className="text-[#0E0E0E]">Ghost Milestones & Duplicate Invoicing</span>
                        <span className="text-amber-700 font-semibold">18.6%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#E5E3DC] overflow-hidden">
                        <div className="h-full bg-amber-600 rounded-full" style={{ width: '18.6%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1 font-medium">
                        <span className="text-[#0E0E0E]">Fund Diversion & Unspent Balance Parking</span>
                        <span className="text-blue-700 font-semibold">11.2%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#E5E3DC] overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: '11.2%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-[20px] bg-[#F1F0EC] flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-semibold text-[#0E0E0E]">Automated Risk Scoring Engine</h3>
                    <p className="text-xs text-[#6B6B6B] mt-1 leading-relaxed">
                      Every MPLADS expenditure tranche is weighted through a 36-variable forensic model combining ISRO SAR, PFMS bank ledgers, and MCA-21 company registry filings.
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentView('shap-explainability')}
                    className="w-full py-3 rounded-full bg-[#0E0E0E] text-white text-xs font-semibold hover:bg-black cursor-pointer"
                  >
                    View SHAP Feature Importance
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 5. VIEW: SHAP Explainability (Investigation sub-item) */}
          {currentView === 'shap-explainability' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#F1F0EC]">
                <div>
                  <button
                    onClick={() => setCurrentView('overview')}
                    className="text-xs text-[#6B6B6B] hover:text-[#0E0E0E] flex items-center gap-1 mb-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
                  </button>
                  <h1 className="text-2xl font-semibold text-[#0E0E0E]">Investigation: SHAP Explainability</h1>
                  <p className="text-xs text-[#6B6B6B]">
                    Transparent Machine Learning feature attributions explaining why projects are flagged
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-[20px] bg-[#F1F0EC] space-y-4">
                <h3 className="text-base font-semibold text-[#0E0E0E]">Global Feature Importance (SHAP Values)</h3>
                <div className="space-y-3 text-xs">
                  {[
                    { feature: 'Satellite SAR Soil/Elevation Delta vs Claimed Stage', impact: '+0.42 SHAP (High Risk Driver)', width: '84%', color: 'bg-red-600' },
                    { feature: 'Director PAN Overlap Across Bidding Entities', impact: '+0.28 SHAP (High Risk Driver)', width: '56%', color: 'bg-orange-500' },
                    { feature: 'Tranche Disbursal Velocity (< 48hr turnaround)', impact: '+0.19 SHAP (Moderate Risk)', width: '38%', color: 'bg-amber-500' },
                    { feature: 'Contractor Age Under 120 Days at Tender Award', impact: '+0.14 SHAP (Moderate Risk)', width: '28%', color: 'bg-amber-500' },
                    { feature: 'Executing Agency Prior Audit Compliance History', impact: '-0.21 SHAP (Mitigating Factor)', width: '42%', color: 'bg-[#15803D]' },
                  ].map((item, i) => (
                    <div key={i} className="p-3.5 bg-white rounded-xl space-y-1.5">
                      <div className="flex justify-between font-medium">
                        <span className="text-[#0E0E0E]">{item.feature}</span>
                        <span className="text-xs font-semibold">{item.impact}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#F1F0EC] overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: item.width }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 6. VIEW: Constituency Map */}
          {currentView === 'constituency-map' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#F1F0EC]">
                <div>
                  <button
                    onClick={() => setCurrentView('overview')}
                    className="text-xs text-[#6B6B6B] hover:text-[#0E0E0E] flex items-center gap-1 mb-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
                  </button>
                  <h1 className="text-2xl font-semibold text-[#0E0E0E]">Constituency Vigilance Map</h1>
                  <p className="text-xs text-[#6B6B6B]">
                    Geographic distribution across 543 Parliamentary Lok Sabha Constituencies
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsCopilotOpen(true)}
                    className="bg-[#0E0E0E] hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-full cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#15803D]" />
                    <span>AI Regional Scan</span>
                  </button>
                </div>
              </div>

              {/* Rich Interactive Constituency Explorer */}
              <InteractiveConstituencyExplorer
                onSelectState={() => setCurrentView('flagged-projects')}
                onSelectProject={(project) => setSelectedProject(project)}
              />
            </div>
          )}

          {/* 7. VIEW: Leaderboard */}
          {currentView === 'leaderboard' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#F1F0EC]">
                <div>
                  <button
                    onClick={() => setCurrentView('overview')}
                    className="text-xs text-[#6B6B6B] hover:text-[#0E0E0E] flex items-center gap-1 mb-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
                  </button>
                  <h1 className="text-2xl font-semibold text-[#0E0E0E]">Constituency & State Leaderboard</h1>
                  <p className="text-xs text-[#6B6B6B]">
                    Composite integrity, speed of milestone reconciliation, and CAG statutory compliance rankings
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-[20px] bg-[#F1F0EC] space-y-4">
                <h3 className="text-base font-semibold text-[#0E0E0E]">Top Performing States (Integrity Index)</h3>
                <div className="space-y-2 text-xs">
                  {[
                    { rank: 1, name: 'Kerala', score: 94.2, compliance: '99.1% Reconciled', badge: 'bg-[#15803D] text-white' },
                    { rank: 2, name: 'Himachal Pradesh', score: 91.8, compliance: '97.4% Reconciled', badge: 'bg-[#15803D] text-white' },
                    { rank: 3, name: 'Tamil Nadu', score: 89.5, compliance: '95.8% Reconciled', badge: 'bg-[#15803D] text-white' },
                    { rank: 4, name: 'Andhra Pradesh', score: 83.2, compliance: '91.2% Reconciled', badge: 'bg-white' },
                    { rank: 5, name: 'Gujarat', score: 81.0, compliance: '88.6% Reconciled', badge: 'bg-white' },
                  ].map((item) => (
                    <div key={item.rank} className="p-3.5 bg-white rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#F1F0EC] text-[#0E0E0E] font-bold flex items-center justify-center text-xs">
                          {item.rank}
                        </span>
                        <div>
                          <span className="font-semibold text-sm text-[#0E0E0E]">{item.name}</span>
                          <span className="text-[#6B6B6B] block text-[11px]">{item.compliance}</span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-[#0E0E0E]">{item.score} / 100</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 8. VIEW: Simulation Sandbox */}
          {currentView === 'simulation-sandbox' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#F1F0EC]">
                <div>
                  <button
                    onClick={() => setCurrentView('overview')}
                    className="text-xs text-[#6B6B6B] hover:text-[#0E0E0E] flex items-center gap-1 mb-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
                  </button>
                  <h1 className="text-2xl font-semibold text-[#0E0E0E]">Policy & Vigilance Simulation Sandbox</h1>
                  <p className="text-xs text-[#6B6B6B]">
                    Simulate statutory threshold changes and automatic treasury hold triggers
                  </p>
                </div>

                <button
                  onClick={() => setQuickActionType('export')}
                  className="bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold px-4 py-2 rounded-full cursor-pointer"
                >
                  Apply Simulated Policy
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-[20px] bg-[#F1F0EC] space-y-4">
                  <h3 className="text-base font-semibold text-[#0E0E0E]">Vigilance Parameter Knobs</h3>
                  <div className="space-y-4 text-xs">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-[#0E0E0E] font-medium">Automatic Disbursal Freeze Threshold</span>
                        <span className="font-semibold text-[#0E0E0E]">50% Discrepancy</span>
                      </div>
                      <input type="range" min="20" max="80" defaultValue="50" className="w-full accent-[#0E0E0E] cursor-pointer" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-[#0E0E0E] font-medium">ISRO SAR Optical Pass Frequency</span>
                        <span className="font-semibold text-[#0E0E0E]">Every 14 Days</span>
                      </div>
                      <input type="range" min="7" max="60" defaultValue="14" className="w-full accent-[#0E0E0E] cursor-pointer" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-[#0E0E0E] font-medium">Director PAN Nexus Strictness</span>
                        <span className="font-semibold text-[#0E0E0E]">Tier 3 (Immediate Subpoena)</span>
                      </div>
                      <input type="range" min="1" max="5" defaultValue="3" className="w-full accent-[#0E0E0E] cursor-pointer" />
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-[20px] bg-[#F1F0EC] space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-[#0E0E0E]">Projected Impact</h3>
                    <p className="text-xs text-[#6B6B6B] mt-1 leading-relaxed">
                      At current simulated thresholds, Sentinel projects saving <strong className="text-[#0E0E0E]">₹342.50 Cr</strong> in delayed or misappropriated capital releases over FY 2025-26.
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-xl text-xs space-y-1.5">
                    <div className="flex justify-between text-[#6B6B6B]">
                      <span>False Positive Rate:</span>
                      <span className="font-semibold text-emerald-700">0.82%</span>
                    </div>
                    <div className="flex justify-between text-[#6B6B6B]">
                      <span>Mean Detection Velocity:</span>
                      <span className="font-semibold text-[#0E0E0E]">3.4 hours post-PFMS bill</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FALLBACK SUB-VIEWS */}
          {!['overview', 'flagged-projects', 'fund-cards', 'entity-analytics', 'case-briefs', 'early-warnings', 'risk-fingerprint', 'shap-explainability', 'constituency-map', 'leaderboard', 'simulation-sandbox', 'insights', 'recipients'].includes(currentView) && (
            <div className="p-8 text-center bg-[#F1F0EC] rounded-[20px] space-y-3">
              <h2 className="text-base font-semibold text-[#0E0E0E] capitalize">
                {currentView.replace('-', ' ')}
              </h2>
              <p className="text-xs text-[#6B6B6B] max-w-sm mx-auto">
                Continuous compliance logs and automated statutory dockets for this module are active and synced.
              </p>
              <button
                onClick={() => setCurrentView('overview')}
                className="px-5 py-2 rounded-full bg-[#0E0E0E] text-white text-xs font-semibold hover:bg-black cursor-pointer"
              >
                Return to Home
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Persistent Floating AI Forensic Copilot Trigger */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsCopilotOpen(true)}
          className="group flex items-center gap-2.5 bg-[#0E0E0E] hover:bg-black text-white px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer border border-white/20 active:scale-95"
          title="Open AI Forensic Copilot"
        >
          <div className="w-6 h-6 rounded-full bg-[#15803D] flex items-center justify-center text-white">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="text-xs font-bold tracking-tight">AI Copilot</span>
          <span className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse" />
        </button>
      </div>

      {/* MODALS */}
      {/* 1. AI Forensic Copilot Modal */}
      <ClaudeForensicCopilot
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        onTriggerAction={(actionType) => setQuickActionType(actionType)}
        selectedProject={selectedProject}
      />

      {/* 2. Design Spec Modal (Triggered by green pill top-right) */}
      <DesignSpecModal
        isOpen={isDesignSpecOpen}
        onClose={() => setIsDesignSpecOpen(false)}
      />

      {/* 3. Flagged Project Dossier Modal */}
      <ProjectDossierModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onToggleFreeze={handleToggleFreeze}
      />

      {/* 4. Quick Action Directive Modal */}
      <QuickActionModal
        actionType={quickActionType}
        onClose={() => setQuickActionType(null)}
      />

      {/* 5. Officer Profile Modal */}
      <WiseOfficerProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}
