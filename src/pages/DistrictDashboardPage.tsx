import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { KpiCard } from '../components/domain/KpiCard';
import { ActionQueue } from '../components/domain/ActionQueue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { FinancialVsPhysicalProgress } from '../components/domain/FinancialVsPhysicalProgress';
import { mockAlerts } from '../data/mock-alerts';
import { mockProjects } from '../data/mock-projects';
import { formatCurrencyINR, getRiskColorClass } from '../lib/utils';
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
} from 'lucide-react';

export function DistrictDashboardPage() {
  const criticalAlerts = mockAlerts.filter((a) => a.severity === 'CRITICAL' || a.severity === 'HIGH');
  const sampleProject = mockProjects[0]; // P-1023

  return (
    <div className="space-y-6">
      <PageHeader
        title="District Command Centre — Pune"
        subtitle="Operational Command & Vigilance Oversight • District Magistrate & Collectorate"
        badge={
          <Badge variant="default" className="font-mono">
            LIVE OPERATIONAL STATUS
          </Badge>
        }
      />

      {/* Hero Operational KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <KpiCard
          title="Active Civil Works"
          value="128"
          subtitle="Pune District total"
          icon={Activity}
        />
        <KpiCard
          title="Require Action"
          value="21"
          change="Urgent"
          changeType="critical"
          variant="warning"
          subtitle="Collectorate queue"
          icon={Clock}
        />
        <KpiCard
          title="High / Critical Risk"
          value="7"
          change="3 critical"
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
          subtitle="Ready for approval"
          icon={FileCheck}
        />
      </div>

      {/* Main Grid: Priority Action Queue & Pre-Sanction Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Action Queue (2 cols) */}
        <div className="lg:col-span-2">
          <ActionQueue alerts={criticalAlerts} />
        </div>

        {/* Pre-Sanction Intelligence Check Card (1 col) */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-l-4 border-l-[#18324A]">
            <CardHeader className="bg-[#FAFAF7]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#C98219] tracking-wider">
                  AI Pre-Sanction Risk Check
                </span>
                <Badge variant="warning">Pre-Sanction Flag</Badge>
              </div>
              <CardTitle className="text-sm mt-1">
                Community Hall — Ward 17 (₹42.0L Proposed)
              </CardTitle>
              <CardDescription>
                Automated eligibility and de-duplication cross-checks before final Collector sanction
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 pt-4 text-xs">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded bg-emerald-50 text-[#2F7658]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="h-4 w-4" /> Statutory Scheme Eligibility
                  </span>
                  <span className="font-bold">VERIFIED</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-emerald-50 text-[#2F7658]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="h-4 w-4" /> Constituency Budget Limit
                  </span>
                  <span className="font-bold">AVAILABLE</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-emerald-50 text-[#2F7658]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="h-4 w-4" /> Land Documentation & NOC
                  </span>
                  <span className="font-bold">ATTACHED</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-orange-50 text-[#C98219] border border-[#C98219]/30">
                  <span className="flex items-center gap-1.5 font-medium">
                    <AlertTriangle className="h-4 w-4" /> Cost Benchmark vs Peers
                  </span>
                  <span className="font-bold">+38.2% (HIGH)</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-red-50 text-[#B44343] border border-[#B44343]/30">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Layers className="h-4 w-4" /> Duplicate Similarity
                  </span>
                  <span className="font-bold">74% OVERLAP</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-emerald-50 text-[#2F7658]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="h-4 w-4" /> SC/ST Area Allocation
                  </span>
                  <span className="font-bold">COMPLIANT (15%)</span>
                </div>
              </div>

              <div className="pt-2">
                <Link to="/projects/P-1023">
                  <Button variant="default" size="sm" className="w-full text-xs flex items-center justify-center gap-1">
                    Review Pre-Sanction Dossier <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Progress Mismatch Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FinancialVsPhysicalProgress
          financialProgress={sampleProject.financialProgressPercentage}
          physicalProgress={sampleProject.physicalProgressPercentage}
          gap={sampleProject.progressMismatchGap}
        />

        <Card>
          <CardHeader>
            <CardTitle>District Progress Mismatch Watchlist</CardTitle>
            <CardDescription>
              Average district disbursement gap is <strong>+24.0%</strong> • 12 projects exceed 30% mismatch threshold
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockProjects.slice(0, 3).map((prj) => {
              const riskStyle = getRiskColorClass(prj.currentRiskScore);

              return (
                <div
                  key={prj.id}
                  className="flex items-center justify-between p-3 rounded-[4px] border border-[#EDE8DE] bg-[#FAFAF7] hover:bg-white transition-all text-xs"
                >
                  <div className="space-y-0.5 max-w-sm">
                    <div className="flex items-center gap-2">
                      <Link to={`/projects/${prj.id}`} className="font-bold text-[#18324A] hover:underline">
                        {prj.code}
                      </Link>
                      <span className={`text-[10px] font-bold px-1.5 rounded border ${riskStyle.badgeBg}`}>
                        Risk {prj.currentRiskScore}
                      </span>
                    </div>
                    <div className="text-[#667085] truncate font-medium">{prj.title}</div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-[#B44343]">
                      Gap: +{prj.progressMismatchGap.toFixed(1)}%
                    </div>
                    <div className="text-[10px] text-[#667085]">
                      Fin {prj.financialProgressPercentage}% / Phy {prj.physicalProgressPercentage}%
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
