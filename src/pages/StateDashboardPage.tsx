import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { KpiCard } from '../components/domain/KpiCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { RiskMap } from '../components/domain/RiskMap';
import { mockDistricts } from '../data/mock-geo';
import { getRiskColorClass } from '../lib/utils';
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
} from 'lucide-react';

export function StateDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="State Nodal Authority (SNA) Dashboard — Maharashtra"
        subtitle="Systemic Risk Intelligence & Cross-District Performance Benchmark • Planning Department"
        badge={
          <Badge variant="secondary" className="font-mono">
            ALL-DISTRICT STATE JURISDICTION
          </Badge>
        }
      />

      {/* Hero State KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <KpiCard title="Total Works" value="2,481" subtitle="Statewide" />
        <KpiCard title="Sanctioned" value="₹1,248 Cr" subtitle="Total outlays" />
        <KpiCard title="Utilised" value="₹893 Cr" subtitle="Disbursed" />
        <KpiCard title="Utilisation" value="71.6%" variant="success" subtitle="State avg" />
        <KpiCard title="High Risk" value="184" variant="warning" subtitle="Score ≥ 60" />
        <KpiCard title="Critical" value="42" variant="critical" subtitle="Score ≥ 80" />
        <KpiCard title="Delayed" value="91" subtitle="SLA overruns" />
        <KpiCard title="Duplicates" value="63" subtitle="Clusters" />
      </div>

      {/* Systemic Patterns Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-[#C98219]">
          <CardHeader className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#C98219]" />
              <span className="text-[11px] font-bold text-[#18324A] uppercase tracking-wider">
                Contractor Concentration
              </span>
            </div>
            <CardTitle className="text-xl font-bold font-mono mt-1">12 Districts</CardTitle>
            <CardDescription>
              Abnormal single-contractor win concentration exceeding 40% threshold
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-l-4 border-l-[#B7791F]">
          <CardHeader className="p-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-[#B7791F]" />
              <span className="text-[11px] font-bold text-[#18324A] uppercase tracking-wider">
                End-Period Spikes
              </span>
            </div>
            <CardTitle className="text-xl font-bold font-mono mt-1">7 Districts</CardTitle>
            <CardDescription>
              Unusual spending acceleration and clustered March release surges
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-l-4 border-l-[#B44343]">
          <CardHeader className="p-4">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#B44343]" />
              <span className="text-[11px] font-bold text-[#18324A] uppercase tracking-wider">
                Duplicate Clusters
              </span>
            </div>
            <CardTitle className="text-xl font-bold font-mono mt-1">23 Clusters</CardTitle>
            <CardDescription>
              High geospatial and asset overlap detected against PMGSY/State schemes
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-l-4 border-l-[#18324A]">
          <CardHeader className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#18324A]" />
              <span className="text-[11px] font-bold text-[#18324A] uppercase tracking-wider">
                Delay Trajectory
              </span>
            </div>
            <CardTitle className="text-xl font-bold font-mono mt-1">34% Works</CardTitle>
            <CardDescription>
              High-value civil projects (&gt;₹50L) exceeding estimated completion velocity
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* State Risk Heatmap */}
      <RiskMap level="STATE" />

      {/* District Performance & Risk Benchmark Table */}
      <Card>
        <CardHeader>
          <CardTitle>District Performance & Anomaly League Table</CardTitle>
          <CardDescription>
            Comparative telemetry across Maharashtra districts • Click any district for operational drill-down
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>District</TableHead>
                <TableHead>Composite Risk</TableHead>
                <TableHead>Fund Utilisation</TableHead>
                <TableHead>Delay Rate</TableHead>
                <TableHead>Cost Anomalies</TableHead>
                <TableHead>Active Works</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDistricts.map((dist) => {
                const riskStyle = getRiskColorClass(dist.compositeRiskScore);

                return (
                  <TableRow key={dist.id}>
                    <TableCell className="font-bold text-[#18324A]">
                      {dist.name}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-0.5 rounded-[3px] font-mono font-bold text-xs border ${riskStyle.badgeBg}`}>
                        {dist.compositeRiskScore} / 100
                      </span>
                    </TableCell>
                    <TableCell className="font-mono font-semibold">
                      {dist.utilisationPercentage}%
                    </TableCell>
                    <TableCell className="font-mono text-[#667085]">
                      {dist.delayRatePercentage}%
                    </TableCell>
                    <TableCell className="font-mono font-semibold text-[#B44343]">
                      {dist.costAnomaliesCount} flagged
                    </TableCell>
                    <TableCell className="font-mono text-[#18324A]">
                      {dist.totalProjects}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to="/district">
                        <Button variant="ghost" size="sm" className="h-7 text-xs flex items-center gap-1">
                          District View <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
