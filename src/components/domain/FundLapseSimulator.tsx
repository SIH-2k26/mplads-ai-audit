import React, { useState } from 'react';
import {
  Clock,
  TrendingDown,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Play,
  RotateCcw,
  Sliders,
  DollarSign,
  Building,
  CheckCircle2,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface PendingProjectWork {
  id: string;
  name: string;
  state: string;
  district: string;
  category: string;
  sanctionAmount: number; // in INR
  disbursedAmount: number; // in INR
  unspentBalance: number; // in INR
  physicalProgress: number; // %
  velocityScore: number; // speed of progress
  daysRemaining: number;
  lapseRiskScore: number; // 0 - 100
  urgencyLevel: 'CRITICAL_LAPSE' | 'HIGH_LAPSE' | 'MODERATE' | 'LOW_RISK';
}

const INITIAL_PROJECTS: PendingProjectWork[] = [
  {
    id: 'MPLADS-2025-UP-0881',
    name: 'Multi-Village Comprehensive Water Supply Scheme',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    category: 'Drinking Water',
    sanctionAmount: 4800000,
    disbursedAmount: 1200000,
    unspentBalance: 3600000,
    physicalProgress: 22.5,
    velocityScore: 0.15,
    daysRemaining: 18,
    lapseRiskScore: 92,
    urgencyLevel: 'CRITICAL_LAPSE'
  },
  {
    id: 'MPLADS-2025-MH-0412',
    name: 'Construction of Sub-District Health Wellness Centre',
    state: 'Maharashtra',
    district: 'Pune',
    category: 'Public Health',
    sanctionAmount: 3200000,
    disbursedAmount: 1800000,
    unspentBalance: 1400000,
    physicalProgress: 45.0,
    velocityScore: 0.35,
    daysRemaining: 24,
    lapseRiskScore: 78,
    urgencyLevel: 'HIGH_LAPSE'
  },
  {
    id: 'MPLADS-2025-BR-0199',
    name: 'Bituminous Approach Road & Culvert at Ward 7',
    state: 'Bihar',
    district: 'Patna',
    category: 'Roads & Bridges',
    sanctionAmount: 2500000,
    disbursedAmount: 2100000,
    unspentBalance: 400000,
    physicalProgress: 88.0,
    velocityScore: 0.85,
    daysRemaining: 30,
    lapseRiskScore: 28,
    urgencyLevel: 'LOW_RISK'
  },
  {
    id: 'MPLADS-2025-AS-0054',
    name: 'Solar High-Mast Lighting System for Hilly Village',
    state: 'Assam',
    district: 'Dima Hasao',
    category: 'Renewable Energy',
    sanctionAmount: 1200000,
    disbursedAmount: 300000,
    unspentBalance: 900000,
    physicalProgress: 18.0,
    velocityScore: 0.12,
    daysRemaining: 14,
    lapseRiskScore: 88,
    urgencyLevel: 'CRITICAL_LAPSE'
  },
  {
    id: 'MPLADS-2025-MP-0631',
    name: 'Govt Higher Secondary School Science Lab Addition',
    state: 'Madhya Pradesh',
    district: 'Bhopal',
    category: 'Education',
    sanctionAmount: 2200000,
    disbursedAmount: 1400000,
    unspentBalance: 800000,
    physicalProgress: 65.0,
    velocityScore: 0.55,
    daysRemaining: 45,
    lapseRiskScore: 48,
    urgencyLevel: 'MODERATE'
  }
];

export function FundLapseSimulator() {
  const [releaseWindowDays, setReleaseWindowDays] = useState<number>(14);
  const [fundingTranchePercent, setFundingTranchePercent] = useState<number>(100);
  const [activeScenario, setActiveScenario] = useState<'COVID_REPLAY' | 'MARCH_RUSH' | 'CUSTOM'>('CUSTOM');

  // Dynamic simulation calculation
  const simulatedProjects = INITIAL_PROJECTS.map(p => {
    // Window pressure penalty: if release window is less than days needed to verify
    const timePressure = Math.max(0, (30 - releaseWindowDays) / 30);
    const progressDeficit = (100 - p.physicalProgress) / 100;
    const adjustedLapseScore = Math.min(100, Math.round(p.lapseRiskScore * (1 + timePressure * 0.35 * progressDeficit)));

    let urgency: 'CRITICAL_LAPSE' | 'HIGH_LAPSE' | 'MODERATE' | 'LOW_RISK' = 'LOW_RISK';
    if (adjustedLapseScore >= 80) urgency = 'CRITICAL_LAPSE';
    else if (adjustedLapseScore >= 60) urgency = 'HIGH_LAPSE';
    else if (adjustedLapseScore >= 40) urgency = 'MODERATE';

    return {
      ...p,
      lapseRiskScore: adjustedLapseScore,
      urgencyLevel: urgency
    };
  }).sort((a, b) => b.lapseRiskScore - a.lapseRiskScore);

  const totalAtRiskFunds = simulatedProjects
    .filter(p => p.urgencyLevel === 'CRITICAL_LAPSE' || p.urgencyLevel === 'HIGH_LAPSE')
    .reduce((sum, p) => sum + p.unspentBalance, 0);

  const handleScenarioSelect = (type: 'COVID_REPLAY' | 'MARCH_RUSH') => {
    setActiveScenario(type);
    if (type === 'COVID_REPLAY') {
      // 7-day compressed release window (Historical COVID-19 reinstatement in FY22)
      setReleaseWindowDays(7);
      setFundingTranchePercent(50);
    } else {
      // March fiscal year-end rush (15 days remaining)
      setReleaseWindowDays(15);
      setFundingTranchePercent(100);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Case Study Context */}
      <div className="bg-card border border-border/60 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Fund-Lapse Risk Triage & What-If Simulator</h3>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs font-mono">
                USE CASE C
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Simulates fund-lapse probabilities under compressed release windows (e.g. COVID-19 suspension/resumption & March fiscal year-end deadlines).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={activeScenario === 'COVID_REPLAY' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleScenarioSelect('COVID_REPLAY')}
              className="text-xs font-mono"
            >
              Replay COVID-19 FY22 Window (7 Days)
            </Button>
            <Button
              variant={activeScenario === 'MARCH_RUSH' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleScenarioSelect('MARCH_RUSH')}
              className="text-xs font-mono"
            >
              March Fiscal Rush (15 Days)
            </Button>
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">Compressed Release Window</span>
              <span className="font-mono font-bold text-primary">{releaseWindowDays} Days Remaining</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="1"
              value={releaseWindowDays}
              onChange={(e) => {
                setReleaseWindowDays(Number(e.target.value));
                setActiveScenario('CUSTOM');
              }}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
              <span>5 Days (Critical)</span>
              <span>30 Days (Standard)</span>
              <span>60 Days</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">Available Allocation Tranche</span>
              <span className="font-mono font-bold text-primary">{fundingTranchePercent}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="10"
              value={fundingTranchePercent}
              onChange={(e) => {
                setFundingTranchePercent(Number(e.target.value));
                setActiveScenario('CUSTOM');
              }}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
              <span>20% (Constrained)</span>
              <span>50%</span>
              <span>100% (Full Release)</span>
            </div>
          </div>

          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3.5 flex flex-col justify-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-destructive">Total Funds at Imminent Lapse Risk</span>
            <p className="text-2xl font-bold font-mono text-destructive mt-1">
              ₹{(totalAtRiskFunds / 100000).toFixed(2)} Lakhs
            </p>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              Across {simulatedProjects.filter(p => p.urgencyLevel === 'CRITICAL_LAPSE').length} critical stalled works
            </span>
          </div>
        </div>
      </div>

      {/* Prioritized Action Triage Queue */}
      <div className="bg-card border border-border/60 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-bold text-foreground">Algorithmic Fund-Lapse Triage Queue</h4>
            <p className="text-xs text-muted-foreground">
              Ranked from highest urgency to lowest. Directs District Authorities toward works requiring immediate milestone disbursement.
            </p>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            {simulatedProjects.length} Works Ranked
          </Badge>
        </div>

        <div className="space-y-3">
          {simulatedProjects.map((p, idx) => (
            <div
              key={p.id}
              className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                p.urgencyLevel === 'CRITICAL_LAPSE'
                  ? 'bg-destructive/5 border-destructive/30 hover:border-destructive/50'
                  : p.urgencyLevel === 'HIGH_LAPSE'
                  ? 'bg-amber-500/5 border-amber-500/30 hover:border-amber-500/50'
                  : 'bg-muted/20 border-border/60 hover:border-border'
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold font-mono">
                    {idx + 1}
                  </span>
                  <Badge variant="outline" className="font-mono text-[10px]">{p.id}</Badge>
                  <span className="text-sm font-bold text-foreground">{p.name}</span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
                  <span>Location: <strong className="text-foreground">{p.district}, {p.state}</strong></span>
                  <span>Category: <strong className="text-foreground">{p.category}</strong></span>
                  <span>Unspent Balance: <strong className="text-foreground font-mono">₹{(p.unspentBalance / 100000).toFixed(2)}L</strong></span>
                  <span>Physical Progress: <strong className="text-foreground font-mono">{p.physicalProgress}%</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground block">Lapse Probability</span>
                  <span className="text-lg font-bold font-mono text-foreground">{p.lapseRiskScore}%</span>
                </div>

                <Badge
                  variant={
                    p.urgencyLevel === 'CRITICAL_LAPSE'
                      ? 'critical'
                      : p.urgencyLevel === 'HIGH_LAPSE'
                      ? 'warning'
                      : 'outline'
                  }
                  className="px-3 py-1 font-mono text-xs uppercase"
                >
                  {p.urgencyLevel === 'CRITICAL_LAPSE' ? 'Critical Triage' : p.urgencyLevel.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
