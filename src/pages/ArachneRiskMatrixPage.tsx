import React, { useState } from 'react';
import {
  ShieldAlert,
  Layers,
  Network,
  Scale,
  FileCheck2,
  TrendingUp,
  AlertTriangle,
  Building2,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Info,
  DollarSign,
  Clock,
  Briefcase,
  Search,
  Eye,
  FileText
} from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';

// 1. EU ARACHNE 7 Core Risk Pillars & Indicators
const ARACHNE_PILLARS = [
  {
    id: 'procurement',
    title: '1. Procurement & Tendering',
    icon: Briefcase,
    riskScore: 68,
    level: 'HIGH',
    description: 'Monitors single bidding, compressed tender publication windows, repeat tender winners, and bidder disqualification patterns.',
    indicators: [
      { code: 'PROC-01', name: 'Single-Bid Tender without Retendering', risk: 'CRITICAL', value: '1 Bid Received', benchmark: 'Min 3 Bids (GFR 149)', triggered: true },
      { code: 'PROC-02', name: 'Compressed Tender Publication Period', risk: 'HIGH', value: '7 Days', benchmark: 'Min 14 Days', triggered: true },
      { code: 'PROC-03', name: 'Bid Price Clustering (< 1.5% spread)', risk: 'MEDIUM', value: '0.8% Spread', benchmark: '> 5% Normal Spread', triggered: true },
      { code: 'PROC-04', name: 'Repeated Winner Concentration in District', risk: 'HIGH', value: '73% of Works', benchmark: '< 25% Concentration', triggered: true },
    ]
  },
  {
    id: 'contract',
    title: '2. Contract Management & Amendments',
    icon: FileText,
    riskScore: 54,
    level: 'MEDIUM',
    description: 'Tracks contract value escalation, repeated timeline extensions, and scope modifications post-award.',
    indicators: [
      { code: 'CONT-01', name: 'Contract Cost Overrun > 15%', risk: 'HIGH', value: '+28.4% Escalation', benchmark: 'Max 10% without TS', triggered: true },
      { code: 'CONT-02', name: 'Repeated Time Extensions (> 3 times)', risk: 'MEDIUM', value: '3 Extensions (180 days)', benchmark: 'Max 1 Extension', triggered: true },
      { code: 'CONT-03', name: 'Work Order Splitting below Sanction Ceiling', risk: 'HIGH', value: '₹48.5L (Limit ₹50L)', benchmark: 'Composite Work Rule', triggered: true },
    ]
  },
  {
    id: 'eligibility',
    title: '3. Eligibility & Double Funding (CAG 2341)',
    icon: Layers,
    riskScore: 72,
    level: 'HIGH',
    description: 'Detects overlapping works across PMGSY, AMRUT, and State schemes to prevent duplicate fund drawing.',
    indicators: [
      { code: 'ELIG-01', name: 'Spatial & Semantic Duplicate Detection', risk: 'CRITICAL', value: '94% Text Sim, 120m Geo', benchmark: 'Unique Work Asset', triggered: true },
      { code: 'ELIG-02', name: 'Inadmissible Asset under MPLADS Guidelines 3.2', risk: 'LOW', value: 'Permissible Community Hall', benchmark: 'Guidelines Annexure II', triggered: false },
      { code: 'ELIG-03', name: 'Unspent Balance Retention > 18 Months', risk: 'HIGH', value: '₹1.84 Cr Retained', benchmark: 'Refund/Reallocate rule', triggered: true },
    ]
  },
  {
    id: 'financial',
    title: '4. Financial Performance & Velocity',
    icon: DollarSign,
    riskScore: 81,
    level: 'CRITICAL',
    description: 'Audits non-linear fund depletion, fiscal March rush spending, and financial-vs-physical desynchronization.',
    indicators: [
      { code: 'FIN-01', name: 'Financial vs. Physical Progress Gap (> 40%)', risk: 'CRITICAL', value: 'Fin: 86.6% vs Phys: 35.0%', benchmark: 'Gap <= 10% (Para 4.3)', triggered: true },
      { code: 'FIN-02', name: 'March Fiscal Year-End Rush Spending', risk: 'HIGH', value: '62% spent in March', benchmark: '< 30% Quarterly Cap', triggered: true },
      { code: 'FIN-03', name: 'Round-Number Milestone Invoicing', risk: 'MEDIUM', value: '₹15,00,000 Flat Bill', benchmark: 'Itemized MB Extracts', triggered: true },
    ]
  },
  {
    id: 'collusion',
    title: '5. Corporate Links & Collusion Network',
    icon: Network,
    riskScore: 76,
    level: 'HIGH',
    description: 'Graph-based intelligence detecting shared directorships, common addresses, and beneficial ownership rings.',
    indicators: [
      { code: 'COLL-01', name: 'Shared Registered Address between Bidders', risk: 'CRITICAL', value: '2 Bidders at Same PIN/Plot', benchmark: 'Independent Entities', triggered: true },
      { code: 'COLL-02', name: 'Cross-Directorship Network Overlap', risk: 'HIGH', value: 'Common Managing Director', benchmark: 'Zero Entity Links', triggered: true },
      { code: 'COLL-03', name: 'Bid Rotation & Complementary Bidding Ring', risk: 'HIGH', value: 'Bid Rotation Score: 0.82', benchmark: '< 0.35 Score', triggered: true },
    ]
  },
  {
    id: 'reputation',
    title: '6. Reputation & Past Irregularity History',
    icon: ShieldAlert,
    riskScore: 42,
    level: 'MEDIUM',
    description: 'Maintains historical blacklist, past CAG audit findings, and agency debarment tracking.',
    indicators: [
      { code: 'REP-01', name: 'Contractor Past Audit Finding Rate', risk: 'MEDIUM', value: '2 Past Delay Penalties', benchmark: '0 Prior Defaults', triggered: true },
      { code: 'REP-02', name: 'Implementing Agency Stalled Works Ratio', risk: 'MEDIUM', value: '18% Stalled Rate', benchmark: '< 10% District Median', triggered: true },
      { code: 'REP-03', name: 'Debarment or Watchlist Record', risk: 'LOW', value: 'Clean Central GeM Status', benchmark: 'Non-Debarred', triggered: false },
    ]
  },
  {
    id: 'cost',
    title: '7. Reasonability of Costs & SoR Deviation',
    icon: TrendingUp,
    riskScore: 65,
    level: 'HIGH',
    description: 'Compares itemized rates against PWD Schedule of Rates (SoR) and peer median costs across similar terrain.',
    indicators: [
      { code: 'COST-01', name: 'Cost per Unit Deviation from Regional Median', risk: 'HIGH', value: '+38.2% Above Median', benchmark: '+/- 10% SoR Band', triggered: true },
      { code: 'COST-02', name: 'Tender vs. Initial Estimate Premium', risk: 'MEDIUM', value: '+8.4% Premium', benchmark: '< 5% GFR Norm', triggered: true },
      { code: 'COST-03', name: 'Inflation Adjusted Material Variance', risk: 'LOW', value: 'Within WPI Inflation Band', benchmark: 'RBI WPI Indices', triggered: false },
    ]
  }
];

// 2. Open Contracting Data Standard (OCDS) 5 Stages
const OCDS_STAGES = [
  {
    stage: '1. Planning',
    status: 'COMPLETED',
    fields: ['Budget Breakdown', 'DPR Recommendation', 'Constituency Allocation'],
    redFlags: 0,
    details: 'Sanction recommended by Hon. MP under 17th Lok Sabha quota. Approved within annual limit.'
  },
  {
    stage: '2. Tender',
    status: 'FLAGGED',
    fields: ['e-Procurement Notice', 'Bidding Documents', 'Bid Opening Record'],
    redFlags: 2,
    details: 'Single bid received on first call. 7-day tender window flagged as compressed. No retender call recorded.'
  },
  {
    stage: '3. Award',
    status: 'FLAGGED',
    fields: ['Evaluation Report', 'Award Notice', 'Bidder Entity Profiles'],
    redFlags: 1,
    details: 'Contract awarded to repeat winning contractor with 73% agency concentration in district.'
  },
  {
    stage: '4. Contract',
    status: 'FLAGGED',
    fields: ['Signed Work Order', 'Performance Guarantee', 'Amendment Log'],
    redFlags: 1,
    details: 'Work order executed at ₹44.0L with 3 retrospective extensions granted.'
  },
  {
    stage: '5. Implementation',
    status: 'CRITICAL',
    fields: ['Payment Tranches', 'Measurement Book', 'Geo-tagged Photos', 'Utilization Cert'],
    redFlags: 3,
    details: 'Disbursement at 86.6% against physical progress of 35.0%. Measurement Book and UC missing.'
  }
];

// 3. Official Datasets Reference Links
const BENCHMARK_DATASETS = [
  {
    title: 'MoSPI e-SAKSHI Official Portal (Live Works & Sanctions)',
    url: 'https://mplads.mospi.gov.in/digigov/dashboard.html',
    records: '25,000+ Active Works',
    description: 'Official centralized portal for paperless MPLADS recommendations, approvals, and fund flows.'
  },
  {
    title: 'Data.gov.in — 16th & 17th Lok Sabha Fund Utilisation',
    url: 'https://www.data.gov.in/catalog/utilisation-mplad-scheme-funds-and-detail-works-16th-lok-sabha-mps-0',
    records: '543 Constituencies',
    description: 'Open government dataset recording MP entitlement, sanction releases, and physical completion rates.'
  },
  {
    title: 'CAG Performance Audit Report #2341 (MPLADS)',
    url: 'https://cag.gov.in/en/audit-report/details/2341',
    records: 'All States & UTs',
    description: 'Statutory Comptroller and Auditor General findings on unspent balances, tender splitting, and inadmissible assets.'
  },
  {
    title: 'Open Contracting Data Standard (OCDS) Schema for Public Works',
    url: 'https://www.open-contracting.org/data-standard/',
    records: 'OCDS v1.1.5',
    description: 'International benchmark for transparency across Planning, Tender, Award, Contract, and Implementation.'
  },
  {
    title: 'EU ARACHNE Risk Scoring Methodology for Anti-Fraud',
    url: 'https://antifraud-knowledge-centre.ec.europa.eu/useful-tools/what-arachne_en',
    records: '7 Risk Pillars / 35 Indicators',
    description: 'Operational risk assessment tool adapted for automated algorithmic early warning in public procurement.'
  }
];

export function ArachneRiskMatrixPage() {
  const [selectedPillar, setSelectedPillar] = useState<string>('financial');
  const [activeTab, setActiveTab] = useState<string>('arachne');

  const activePillarData = ARACHNE_PILLARS.find(p => p.id === selectedPillar) || ARACHNE_PILLARS[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="ARACHNE & OCDS Anti-Fraud Early Warning Intelligence"
        subtitle="7-Pillar Algorithmic Risk Matrix, Open Contracting Data Standard (OCDS) 5-Stage Audit, and CAG Report #2341 Benchmarks."
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1 font-mono text-xs">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              ARACHNE + OCDS v1.1.5
            </Badge>
            <Button variant="default" size="sm" asChild>
              <a href="https://mplads.mospi.gov.in/digigov/dashboard.html" target="_blank" rel="noreferrer">
                <ExternalLink className="w-4 h-4 mr-1.5" />
                e-SAKSHI Portal
              </a>
            </Button>
          </div>
        }
      />

      {/* Top Level Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-sm hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Composite Risk</span>
            <Badge variant="critical">CRITICAL (74/100)</Badge>
          </div>
          <p className="text-2xl font-bold mt-2 font-mono text-foreground">74.2 <span className="text-xs font-normal text-muted-foreground">/ 100</span></p>
          <p className="text-xs text-muted-foreground mt-1">Weighted average across 7 ARACHNE pillars</p>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-sm hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">OCDS Stages Audited</span>
            <Badge variant="warning">4 / 5 Flagged</Badge>
          </div>
          <p className="text-2xl font-bold mt-2 font-mono text-foreground">5 Stages</p>
          <p className="text-xs text-muted-foreground mt-1">Planning, Tender, Award, Contract, Implementation</p>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-sm hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">CAG Red Flags</span>
            <Badge variant="critical">3 Active</Badge>
          </div>
          <p className="text-2xl font-bold mt-2 font-mono text-foreground">Report 2341</p>
          <p className="text-xs text-muted-foreground mt-1">Split tenders, unspent balances, missing MB</p>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-sm hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Data Feed Benchmark</span>
            <Badge variant="success">MoSPI Live</Badge>
          </div>
          <p className="text-2xl font-bold mt-2 font-mono text-foreground">543 Lok Sabha</p>
          <p className="text-xs text-muted-foreground mt-1">Data.gov.in & e-SAKSHI historical baseline</p>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 max-w-xl">
          <TabsTrigger value="arachne">ARACHNE 7 Pillars</TabsTrigger>
          <TabsTrigger value="ocds">OCDS 5-Stage Audit</TabsTrigger>
          <TabsTrigger value="datasets">Public Data Feeds</TabsTrigger>
        </TabsList>

        {/* 1. ARACHNE 7 Pillars Tab */}
        <TabsContent value="arachne" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar: Pillar Selectors */}
            <div className="lg:col-span-4 space-y-2">
              {ARACHNE_PILLARS.map(pillar => {
                const Icon = pillar.icon;
                const isSelected = pillar.id === selectedPillar;
                return (
                  <button
                    key={pillar.id}
                    onClick={() => setSelectedPillar(pillar.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-primary/10 border-primary shadow-sm text-foreground'
                        : 'bg-card border-border/60 hover:border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold leading-none">{pillar.title}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{pillar.indicators.length} indicators evaluated</p>
                      </div>
                    </div>
                    <Badge
                      variant={pillar.level === 'CRITICAL' || pillar.level === 'HIGH' ? 'critical' : 'outline'}
                      className="font-mono text-xs"
                    >
                      {pillar.riskScore}/100
                    </Badge>
                  </button>
                );
              })}
            </div>

            {/* Right Panel: Pillar Detailed Breakdown */}
            <div className="lg:col-span-8 bg-card border border-border/60 rounded-xl p-6 shadow-sm space-y-6">
              <div className="flex items-start justify-between border-b border-border/50 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <activePillarData.icon className="w-5 h-5 text-primary" />
                    {activePillarData.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{activePillarData.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground">Pillar Risk Score</span>
                  <p className="text-2xl font-bold font-mono text-foreground">{activePillarData.riskScore} <span className="text-xs font-normal text-muted-foreground">/ 100</span></p>
                </div>
              </div>

              {/* Indicators Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Evaluated Risk Indicators</h4>
                <div className="space-y-2.5">
                  {activePillarData.indicators.map((ind, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-lg border flex items-center justify-between ${
                        ind.triggered
                          ? 'bg-destructive/5 border-destructive/20'
                          : 'bg-muted/30 border-border/40'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono text-[10px]">{ind.code}</Badge>
                          <span className="text-sm font-semibold text-foreground">{ind.name}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Observed: <strong className="text-foreground font-mono">{ind.value}</strong></span>
                          <span>Statutory Benchmark: <strong className="text-foreground">{ind.benchmark}</strong></span>
                        </div>
                      </div>
                      <div className="text-right">
                        {ind.triggered ? (
                          <Badge variant="critical" className="text-xs">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            FLAGGED
                          </Badge>
                        ) : (
                          <Badge variant="success" className="text-xs">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            COMPLIANT
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statutory Action Directive */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-semibold text-foreground">Recommended Audit Protocol</h5>
                  <p className="text-xs text-muted-foreground mt-1">
                    Execute cross-verification of Measurement Book (MB) recordings against bank transaction UTR logs and certify geo-tagged photographic evidence in accordance with MoSPI Revised Guidelines 2023.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 2. OCDS 5-Stage Procurement Tab */}
        <TabsContent value="ocds" className="space-y-6">
          <div className="bg-card border border-border/60 rounded-xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">Open Contracting Data Standard (OCDS) 5-Stage Audit</h3>
              <p className="text-sm text-muted-foreground mt-1">
                End-to-end lifecycle scrutiny tracking red flags across all 5 procurement milestones defined by the Open Contracting Partnership.
              </p>
            </div>

            <div className="space-y-4">
              {OCDS_STAGES.map((stg, i) => (
                <div key={i} className="border border-border/60 rounded-xl p-4 bg-muted/20 hover:border-border transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-border/40 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm font-mono">
                        {i + 1}
                      </div>
                      <span className="font-bold text-base text-foreground">{stg.stage}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {stg.redFlags > 0 ? (
                        <Badge variant="critical" className="text-xs">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {stg.redFlags} Red Flags
                        </Badge>
                      ) : (
                        <Badge variant="success" className="text-xs">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Clean Stage
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-foreground mt-3 leading-relaxed">{stg.details}</p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {stg.fields.map((fld, j) => (
                      <span key={j} className="text-[11px] bg-background border border-border/60 px-2.5 py-0.5 rounded-md text-muted-foreground font-mono">
                        {fld}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* 3. Reference Datasets Tab */}
        <TabsContent value="datasets" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BENCHMARK_DATASETS.map((ds, idx) => (
              <div key={idx} className="bg-card border border-border/60 rounded-xl p-5 shadow-sm hover:border-primary/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-sm text-foreground">{ds.title}</h4>
                    <Badge variant="outline" className="font-mono text-[10px] shrink-0">{ds.records}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{ds.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-muted-foreground truncate max-w-[220px]">{ds.url}</span>
                  <Button variant="ghost" size="sm" asChild className="text-xs gap-1">
                    <a href={ds.url} target="_blank" rel="noreferrer">
                      Explore Dataset
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
