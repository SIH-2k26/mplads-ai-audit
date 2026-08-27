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
} from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { mockMpProfiles, MpProfileData } from '../data/mock-mps';
import { MpComparisonView } from '../components/domain/MpComparisonView';
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

export function MpDashboardPage() {
  const [activeTab, setActiveTab] = useState<'profiles' | 'compare' | 'funnel' | 'anomalies'>('profiles');
  const [selectedHouse, setSelectedHouse] = useState<'ALL' | 'Lok Sabha' | 'Rajya Sabha'>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMp, setSelectedMp] = useState<MpProfileData>(mockMpProfiles[0]);

  const filteredMps = mockMpProfiles.filter((mp) => {
    const matchesSearch =
      mp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mp.constituency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mp.state.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHouse = selectedHouse === 'ALL' || mp.house === selectedHouse;
    const matchesRisk = selectedRisk === 'ALL' || mp.aiMonitoring.riskLevel === selectedRisk;
    return matchesSearch && matchesHouse && matchesRisk;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <PageHeader
        title="MP Performance & Risk Intelligence"
        subtitle="Comprehensive constituency profiles, fund utilization trends, statutory compliance, and AI early-warning diagnostics."
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Browse MPs & Constituencies' },
        ]}
      />

      {/* Top State/National KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-[6px] border border-[#D9DFE3] shadow-2xs">
          <span className="text-[10px] font-mono text-[#647383] uppercase block">Total MPs Monitored</span>
          <strong className="text-xl font-mono font-extrabold text-[#15324A] block mt-0.5">543</strong>
          <span className="text-[10px] text-[#647383]">28 States & 8 UTs</span>
        </div>

        <div className="bg-white p-3.5 rounded-[6px] border border-[#D9DFE3] shadow-2xs">
          <span className="text-[10px] font-mono text-[#647383] uppercase block">Total Entitlement</span>
          <strong className="text-xl font-mono font-extrabold text-[#15324A] block mt-0.5">₹3,812 Cr</strong>
          <span className="text-[10px] text-[#647383]">₹5.0 Cr / MP Annual</span>
        </div>

        <div className="bg-white p-3.5 rounded-[6px] border border-[#D9DFE3] shadow-2xs">
          <span className="text-[10px] font-mono text-[#647383] uppercase block">Total Utilized</span>
          <strong className="text-xl font-mono font-extrabold text-[#2E8064] block mt-0.5">₹3,184 Cr</strong>
          <span className="text-[10px] text-[#2E8064] font-semibold">83.5% Avg Utilization</span>
        </div>

        <div className="bg-white p-3.5 rounded-[6px] border border-[#D9DFE3] shadow-2xs">
          <span className="text-[10px] font-mono text-[#647383] uppercase block">Works Completed</span>
          <strong className="text-xl font-mono font-extrabold text-[#15324A] block mt-0.5">5,420</strong>
          <span className="text-[10px] text-[#647383]">69.1% Completion Rate</span>
        </div>

        <div className="bg-white p-3.5 rounded-[6px] border border-[#D9DFE3] shadow-2xs">
          <span className="text-[10px] font-mono text-[#647383] uppercase block">Delayed Works</span>
          <strong className="text-xl font-mono font-extrabold text-[#C98220] block mt-0.5">821</strong>
          <span className="text-[10px] text-[#C98220] font-semibold">+42 Days Avg Delay</span>
        </div>

        <div className="bg-white p-3.5 rounded-[6px] border border-[#D9DFE3] shadow-2xs">
          <span className="text-[10px] font-mono text-[#647383] uppercase block">High-Risk Works</span>
          <strong className="text-xl font-mono font-extrabold text-[#C94B4B] block mt-0.5">416</strong>
          <span className="text-[10px] text-[#C94B4B] font-semibold">Requiring Action</span>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9DFE3] pb-2">
          <TabsList className="bg-[#FAFAF7] border border-[#D9DFE3]">
            <TabsTrigger value="profiles" className="text-xs font-bold">
              MP Implementation Profiles
            </TabsTrigger>
            <TabsTrigger value="compare" className="text-xs font-bold">
              Multi-MP Comparison
            </TabsTrigger>
            <TabsTrigger value="funnel" className="text-xs font-bold">
              Work Lifecycle & Health
            </TabsTrigger>
            <TabsTrigger value="anomalies" className="text-xs font-bold">
              Risk Diagnostics & RAG
            </TabsTrigger>
          </TabsList>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#647383]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search MP, Constituency, State..."
                className="pl-8 pr-3 py-1 rounded-[4px] border border-[#D9DFE3] bg-white text-xs text-[#172B3A] placeholder-[#647383] outline-none focus:border-[#15324A] w-56"
              />
            </div>

            <div className="flex rounded border border-[#D9DFE3] bg-white p-0.5 text-[10px] font-mono">
              {(['ALL', 'Lok Sabha', 'Rajya Sabha'] as const).map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setSelectedHouse(h)}
                  className={`px-2 py-0.5 rounded-[2px] font-bold ${
                    selectedHouse === h ? 'bg-[#15324A] text-white' : 'text-[#647383] hover:text-[#172B3A]'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab 1: MP Implementation Profiles (Non-ranking defensible approach) */}
        <TabsContent value="profiles" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredMps.map((mp) => (
              <div
                key={mp.id}
                onClick={() => setSelectedMp(mp)}
                className={`rounded-[6px] border bg-white p-5 shadow-card transition-all cursor-pointer ${
                  selectedMp.id === mp.id
                    ? 'border-2 border-[#15324A] ring-2 ring-[#D99018]/30'
                    : 'border-[#D9DFE3] hover:border-[#15324A]'
                }`}
              >
                {/* MP Header */}
                <div className="flex items-start justify-between border-b border-[#D9DFE3] pb-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#15324A]">{mp.name}</h3>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#FAFAF7] border border-[#D9DFE3] text-[#172B3A]">
                        {mp.party}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#647383] mt-0.5">
                      <MapPin className="h-3 w-3 text-[#D99018]" />
                      <span>{mp.constituency} • {mp.state} ({mp.house})</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] font-mono text-[#647383] uppercase block">PORTFOLIO HEALTH</span>
                    <Badge variant={mp.aiMonitoring.portfolioRisk >= 75 ? 'critical' : mp.aiMonitoring.portfolioRisk >= 50 ? 'warning' : 'success'}>
                      ● {mp.aiMonitoring.portfolioRisk}/100 ({mp.aiMonitoring.riskLevel})
                    </Badge>
                  </div>
                </div>

                {/* Structured Implementation Profile Sections */}
                <div className="space-y-2.5 text-xs">
                  {/* Financial */}
                  <div className="p-2.5 rounded bg-[#FAFAF7] border border-[#D9DFE3] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#15324A] uppercase block">FINANCIAL UTILIZATION</span>
                      <span className="text-[#647383]">₹{mp.financial.allocated} Cr Allocated • ₹{mp.financial.utilized} Cr Utilized</span>
                    </div>
                    <strong className={`text-sm font-mono ${mp.financial.utilizationRate >= 90 ? 'text-[#2E8064]' : 'text-[#C98220]'}`}>
                      {mp.financial.utilizationRate}%
                    </strong>
                  </div>

                  {/* Execution */}
                  <div className="p-2.5 rounded bg-[#FAFAF7] border border-[#D9DFE3] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#15324A] uppercase block">WORK EXECUTION</span>
                      <span className="text-[#647383]">{mp.execution.completed} Completed • {mp.execution.underExecution} Ongoing • {mp.execution.delayed} Delayed</span>
                    </div>
                    <strong className="text-sm font-mono text-[#15324A]">
                      {mp.execution.completionRate}%
                    </strong>
                  </div>

                  {/* Compliance & AI Monitoring */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded bg-[#FAFAF7] border border-[#D9DFE3]">
                      <span className="text-[9px] font-mono text-[#647383] uppercase block">COMPLIANCE</span>
                      <strong className="text-xs text-[#2E8064]">{mp.compliance.score}% Score</strong>
                      <div className="text-[10px] text-[#647383] mt-0.5">{mp.compliance.tenderExceptions} Tender Exceptions</div>
                    </div>

                    <div className="p-2 rounded bg-red-50/60 border border-[#C94B4B]/30">
                      <span className="text-[9px] font-mono text-[#C94B4B] font-bold uppercase block">AI ANOMALIES</span>
                      <strong className="text-xs text-[#C94B4B]">{mp.aiMonitoring.highRiskWorks} High-Risk Works</strong>
                      <div className="text-[10px] text-[#647383] mt-0.5">{mp.compliance.costOutliers} Cost Outliers • {mp.compliance.duplicateAlerts} Dupes</div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-4 pt-3 border-t border-[#D9DFE3] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#647383]">
                    {mp.recommendations.sanctioned} Works Sanctioned ({mp.recommendations.sanctionRate}%)
                  </span>
                  <span className="text-xs font-bold text-[#15324A] flex items-center gap-1 hover:text-[#D99018]">
                    Inspect Full Profile <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Selected MP Detailed Profile Cockpit */}
          {selectedMp && (
            <div className="mt-8 rounded-[8px] border-2 border-[#15324A] bg-white p-6 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9DFE3] pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#D99018] uppercase tracking-wider block">
                    DETAILED CONSTITUENCY DOSSIER
                  </span>
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#15324A]">
                    {selectedMp.name} — {selectedMp.constituency} ({selectedMp.state})
                  </h2>
                  <p className="text-xs text-[#647383] mt-0.5">
                    {selectedMp.house} • {selectedMp.term} • Party: {selectedMp.party} • Annual Quota: ₹5.00 Cr
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-[#647383] uppercase block">AI Risk Index</span>
                    <strong className="text-2xl font-mono font-extrabold text-[#C94B4B]">
                      {selectedMp.aiMonitoring.portfolioRisk}<span className="text-xs text-[#647383]">/100</span>
                    </strong>
                  </div>
                </div>
              </div>

              {/* Graphs Row: Allocation vs Expense & Risk Trajectory */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Year-wise Expenditure */}
                <div className="bg-[#FAFAF7] p-4 rounded border border-[#D9DFE3]">
                  <h4 className="text-xs font-bold text-[#15324A] uppercase tracking-wider mb-2">
                    Year-Wise Fund Utilization (₹ Crore)
                  </h4>
                  <div className="h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={selectedMp.financial.yearWiseExpense}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#D9DFE3" />
                        <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                        <Bar dataKey="allocated" fill="#15324A" name="Allocated" radius={[2, 2, 0, 0]} />
                        <Bar dataKey="utilized" fill="#2E8064" name="Utilized" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Risk Trajectory */}
                <div className="bg-[#FAFAF7] p-4 rounded border border-[#D9DFE3]">
                  <h4 className="text-xs font-bold text-[#15324A] uppercase tracking-wider mb-2">
                    AI Portfolio Risk Trajectory (Last 5 Months)
                  </h4>
                  <div className="h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedMp.aiMonitoring.riskTrajectory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#D9DFE3" />
                        <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="score" stroke="#C94B4B" strokeWidth={2.5} dot={{ r: 4, fill: '#C94B4B' }} name="Risk Score" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* "Why is this MP/Constituency at Risk?" Section */}
              <div className="bg-[#FAFAF7] p-5 rounded-[6px] border border-[#D9DFE3] space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#D99018]" />
                  <h4 className="text-xs font-bold text-[#15324A] uppercase tracking-wider">
                    Why is this Constituency at Risk? (AI Decomposed Rationale)
                  </h4>
                </div>

                <p className="text-xs text-[#172B3A] italic bg-white p-3 rounded border border-[#D9DFE3] leading-relaxed">
                  "{selectedMp.aiMonitoring.aiExecutiveSummary}"
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {selectedMp.aiMonitoring.riskContributors.map((c, idx) => (
                    <div key={idx} className="p-3 rounded bg-white border border-[#D9DFE3] flex items-start gap-2.5">
                      <span className="text-xs font-mono font-bold text-[#C94B4B] bg-red-50 px-1.5 py-0.5 rounded border border-[#C94B4B]/30">
                        +{c.delta}
                      </span>
                      <div>
                        <strong className="text-xs text-[#15324A] block">{c.factor}</strong>
                        <span className="text-[11px] text-[#647383]">{c.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Tab 2: Multi-MP Comparison Dashboard */}
        <TabsContent value="compare" className="pt-4">
          <MpComparisonView />
        </TabsContent>

        {/* Tab 3: Work Lifecycle Funnel & Health */}
        <TabsContent value="funnel" className="space-y-6 pt-4">
          <div className="bg-white p-6 rounded-[6px] border border-[#D9DFE3] shadow-card space-y-6">
            <div>
              <h3 className="text-sm font-bold text-[#15324A] uppercase tracking-wider">
                Work Lifecycle Funnel: {selectedMp.constituency} ({selectedMp.name})
              </h3>
              <p className="text-xs text-[#647383] mt-0.5">
                Tracking stage conversion efficiency from MP recommendation to on-site physical verification.
              </p>
            </div>

            {/* Visual Funnel */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { stage: '1. Recommended', count: selectedMp.recommendations.recommended, rate: '100%', color: 'bg-[#15324A]' },
                { stage: '2. Sanctioned', count: selectedMp.recommendations.sanctioned, rate: `${selectedMp.recommendations.sanctionRate}%`, color: 'bg-[#214C68]' },
                { stage: '3. Tendered', count: Math.round(selectedMp.recommendations.sanctioned * 0.92), rate: '92.0%', color: 'bg-[#234D6C]' },
                { stage: '4. Executing', count: selectedMp.execution.underExecution, rate: 'Active', color: 'bg-[#D99018]' },
                { stage: '5. Completed', count: selectedMp.execution.completed, rate: `${selectedMp.execution.completionRate}%`, color: 'bg-[#2E8064]' },
                { stage: '6. Verified', count: Math.round(selectedMp.execution.completed * 0.88), rate: '88.0%', color: 'bg-[#2E8064]' },
              ].map((f) => (
                <div key={f.stage} className="p-3.5 rounded bg-[#FAFAF7] border border-[#D9DFE3] text-center space-y-1">
                  <span className="text-[10px] font-mono font-bold text-[#647383] uppercase block">{f.stage}</span>
                  <div className="text-2xl font-extrabold font-mono text-[#15324A]">{f.count}</div>
                  <span className="text-[10px] font-mono text-[#2E8064] font-bold block">{f.rate}</span>
                </div>
              ))}
            </div>

            {/* Project Health Status Breakdown */}
            <div className="pt-4 border-t border-[#D9DFE3] space-y-3">
              <h4 className="text-xs font-bold text-[#15324A] uppercase tracking-wider">
                Active Project Health Distribution
              </h4>
              <div className="h-4 w-full bg-[#D9DFE3] rounded-full overflow-hidden flex">
                <div style={{ width: '62%' }} className="bg-[#2E8064]" title="On Track: 62%" />
                <div style={{ width: '21%' }} className="bg-[#E5B45A]" title="Watchlist: 21%" />
                <div style={{ width: '11%' }} className="bg-[#C98220]" title="Delayed: 11%" />
                <div style={{ width: '6%' }} className="bg-[#C94B4B]" title="High Risk: 6%" />
              </div>
              <div className="flex flex-wrap items-center justify-between text-xs font-mono">
                <span className="text-[#2E8064] font-bold">🟢 On Track: 62%</span>
                <span className="text-[#C98220] font-bold">🟡 Watchlist: 21%</span>
                <span className="text-[#C98220] font-bold">🟠 Delayed: 11%</span>
                <span className="text-[#C94B4B] font-bold">🔴 High Risk: 6%</span>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 4: Anomaly Diagnostics & RAG */}
        <TabsContent value="anomalies" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-[6px] border border-[#D9DFE3] shadow-card space-y-4">
              <h4 className="text-xs font-bold text-[#15324A] uppercase tracking-wider">
                Active Anomaly Triggers in {selectedMp.constituency}
              </h4>
              <div className="space-y-3 text-xs">
                {selectedMp.aiMonitoring.riskContributors.map((rc, idx) => (
                  <div key={idx} className="p-3 rounded bg-red-50/60 border border-[#C94B4B]/30 flex items-start justify-between">
                    <div>
                      <strong className="text-xs text-[#15324A] block">{rc.factor}</strong>
                      <p className="text-[11px] text-[#647383] mt-0.5">{rc.desc}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#C94B4B]">+{rc.delta} pts</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-[6px] border border-[#D9DFE3] shadow-card space-y-4">
              <h4 className="text-xs font-bold text-[#15324A] uppercase tracking-wider">
                Recognized Fraud Archetypes
              </h4>
              <div className="space-y-2.5 text-xs">
                {selectedMp.aiMonitoring.topArchetypes.length > 0 ? (
                  selectedMp.aiMonitoring.topArchetypes.map((arch) => (
                    <div key={arch} className="p-3 rounded bg-[#FAFAF7] border border-[#D9DFE3] flex items-center justify-between">
                      <div>
                        <strong className="text-xs text-[#15324A] block">{arch}</strong>
                        <span className="text-[10px] text-[#647383]">Historical match confidence: 84%</span>
                      </div>
                      <Badge variant="warning">DETECTED</Badge>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-[#2E8064] bg-emerald-50 rounded border border-[#2E8064]/30">
                    No systemic fraud archetypes triggered for this constituency.
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
