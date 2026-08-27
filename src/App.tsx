import React, { useState } from 'react';
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
import { FLAGGED_PROJECTS, SYSTEM_METRICS } from './data/mockData';
import { MPLADSProject } from './types';
import { Landmark, ShieldAlert, Users, Plus, ArrowLeft } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [isDesignSpecOpen, setIsDesignSpecOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<MPLADSProject | null>(null);
  const [quickActionType, setQuickActionType] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showAnalyticsChart, setShowAnalyticsChart] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Mutable projects state for interactive freezing
  const [projectsList, setProjectsList] = useState<MPLADSProject[]>(FLAGGED_PROJECTS);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
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
                trustScore={SYSTEM_METRICS.nationalCompositeTrustScore}
                totalOutlayCr={SYSTEM_METRICS.totalSanctionedCr}
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
                totalOutlayCr={SYSTEM_METRICS.totalSanctionedCr}
                disbursedCr={SYSTEM_METRICS.totalExpendedCr}
                flaggedRiskCr={SYSTEM_METRICS.flaggedOutlayCr}
                reconciledCr={SYSTEM_METRICS.totalExpendedCr - SYSTEM_METRICS.flaggedOutlayCr}
                activeFreezesCount={activeFreezesCount}
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
                  className="bg-[#9FE870] hover:bg-[#8ee05c] text-[#0E0E0E] text-xs font-semibold px-4 py-2 rounded-full cursor-pointer"
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
                  <div className="w-full h-36 bg-[#9FE870] rounded-2xl p-4 flex flex-col justify-between text-[#0E0E0E] shadow-sm">
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
                      <span>Scheme Outlay:</span>
                      <span className="font-semibold text-[#0E0E0E]">₹4,950.00 Cr</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#EAE8E2]">
                      <span>Disbursed to Date:</span>
                      <span className="font-semibold text-[#0E0E0E]">₹3,840.50 Cr (77.6%)</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Forensic Hold / Frozen:</span>
                      <span className="font-semibold text-red-600">₹412.80 Cr</span>
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

          {/* SECONDARY VIEW: Insights */}
          {currentView === 'insights' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#F1F0EC]">
                <div>
                  <button
                    onClick={() => setCurrentView('overview')}
                    className="text-xs text-[#6B6B6B] hover:text-[#0E0E0E] flex items-center gap-1 mb-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
                  </button>
                  <h1 className="text-2xl font-semibold text-[#0E0E0E]">Insights & Health Trends</h1>
                </div>
              </div>

              <RiskTrendChartCard />
            </div>
          )}

          {/* SECONDARY VIEW: Recipients (Contractors & Agencies) */}
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
                  <h1 className="text-2xl font-semibold text-[#0E0E0E]">Recipients & Contractors</h1>
                  <p className="text-xs text-[#6B6B6B]">Monitored vendors, DRDAs, and Zilla Parishad implementing agencies</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectsList.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProject(p)}
                    className="p-4 rounded-[20px] bg-[#F1F0EC] hover:bg-[#EAE8E2] transition-colors cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#0E0E0E]">{p.contractorName}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#0E0E0E]">
                        Score: {p.trustScore}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B6B6B]">GSTIN: {p.contractorGstin} • {p.constituency}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FALLBACK SUB-VIEWS */}
          {!['overview', 'flagged-projects', 'fund-cards', 'insights', 'recipients'].includes(currentView) && (
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

      {/* MODALS */}
      {/* 1. Design Spec Modal (Triggered by green pill top-right) */}
      <DesignSpecModal
        isOpen={isDesignSpecOpen}
        onClose={() => setIsDesignSpecOpen(false)}
      />

      {/* 2. Flagged Project Dossier Modal */}
      <ProjectDossierModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onToggleFreeze={handleToggleFreeze}
      />

      {/* 3. Quick Action Directive Modal */}
      <QuickActionModal
        actionType={quickActionType}
        onClose={() => setQuickActionType(null)}
      />

      {/* 4. Officer Profile Modal */}
      <WiseOfficerProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}
