import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { KpiCard } from '../components/domain/KpiCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { RiskMap } from '../components/domain/RiskMap';
import { mockPortfolioDistribution } from '../data/mock-analytics';
import { mockProjects } from '../data/mock-projects';
import { formatCurrencyINR, formatPercentage } from '../lib/utils';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, CheckCircle2, Clock, Landmark, Layers, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export function MpDashboardPage() {
  const highRiskWorks = mockProjects.filter((p) => p.currentRiskScore >= 60);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Constituency Dashboard"
        subtitle="Pune Parliamentary Constituency • FY 2026–27 • Shri Girish Bapat (MP)"
        badge={
          <Badge variant="secondary" className="font-mono">
            Last updated: 26 Aug 2026
          </Badge>
        }
      />

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Recommended Works"
          value="128"
          change="↑ 8 this year"
          changeType="positive"
          subtitle="Constituency allocation"
          icon={Landmark}
        />
        <KpiCard
          title="Active Works in Progress"
          value="47"
          change="6 delayed"
          changeType="negative"
          variant="warning"
          subtitle="Under civil construction"
          icon={Clock}
        />
        <KpiCard
          title="Completed & Handover"
          value="68"
          change="53% of total"
          changeType="positive"
          variant="success"
          subtitle="Durable community assets"
          icon={CheckCircle2}
        />
        <KpiCard
          title="Works Requiring Review"
          value="13"
          change="3 critical flags"
          changeType="critical"
          variant="critical"
          subtitle="Needs MP attention"
          icon={AlertTriangle}
        />
      </div>

      {/* Fund Utilisation Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            <span>MPLADS Entitlement & Fund Utilisation</span>
            <span className="text-sm font-mono font-bold text-[#18324A]">
              ₹3.82 Cr / ₹5.00 Cr (76.4%)
            </span>
          </CardTitle>
          <CardDescription>
            Annual entitlement allocation of ₹5.00 Crore for FY 2026–27
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={76.4} indicatorClassName="bg-[#C98219]" />
          <div className="flex flex-wrap items-center justify-between text-xs text-[#667085]">
            <span>Sanctioned Expenditure: <strong>₹3.82 Cr</strong></span>
            <span>Committed Releases: <strong>₹3.48 Cr</strong></span>
            <span>Available Balance: <strong className="text-[#2F7658]">₹1.18 Cr</strong></span>
          </div>
        </CardContent>
      </Card>

      {/* Development Portfolio & Needs Attention Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1/3: Portfolio Distribution Donut */}
        <Card className="lg:col-span-1 flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Development Portfolio</CardTitle>
            <CardDescription>Sector-wise allocation across Pune</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockPortfolioDistribution}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {mockPortfolioDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any) => [`${value} Works`, name]}
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D9D5CC', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs border-t border-[#EDE8DE] pt-3">
              <div className="p-2 rounded bg-[#FAFAF7]">
                <span className="text-[#667085] text-[10px] block">Top Sector</span>
                <strong className="text-[#18324A]">Education (28 works)</strong>
              </div>
              <div className="p-2 rounded bg-[#FAFAF7]">
                <span className="text-[#667085] text-[10px] block">Largest Outlay</span>
                <strong className="text-[#18324A]">Roads (₹13.92 Cr)</strong>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right 2/3: "Needs Attention" Plain-Language Section */}
        <Card className="lg:col-span-2 border-l-4 border-l-[#C98219]">
          <CardHeader>
            <CardTitle className="text-[#18324A]">
              <span className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-[#C98219]" />
                Needs Attention — High Priority Constituency Works
              </span>
              <Badge variant="saffron">{highRiskWorks.length} Actions Required</Badge>
            </CardTitle>
            <CardDescription>
              Plain-language summary of projects experiencing cost variances, delays, or procedural milestones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {highRiskWorks.map((work) => (
              <div
                key={work.id}
                className="p-4 rounded-[4px] border border-[#EDE8DE] bg-[#FAFAF7] hover:bg-white hover:border-[#D9D5CC] transition-all space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        work.currentRiskScore >= 80
                          ? 'bg-red-50 text-[#B44343] border border-[#B44343]/30'
                          : 'bg-orange-50 text-[#C98219] border border-[#C98219]/30'
                      }`}
                    >
                      {work.currentRiskScore >= 80 ? 'HIGH RISK' : 'DELAY RISK'}
                    </span>
                    <span className="text-xs font-bold text-[#18324A]">{work.title}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#18324A]">
                    {formatCurrencyINR(work.sanctionedAmount)}
                  </span>
                </div>

                <p className="text-xs text-[#667085] leading-relaxed">
                  {work.whyFlagged[0] || 'Work execution requires status review with District Collectorate.'}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#EDE8DE]/80 text-[11px]">
                  <div className="flex items-center gap-3 text-[#667085]">
                    <span>Disbursed: <strong>{work.financialProgressPercentage}%</strong></span>
                    <span>Physical: <strong>{work.physicalProgressPercentage}%</strong></span>
                    <span>Location: <strong>{work.location.wardOrVillage}</strong></span>
                  </div>

                  <Link to={`/projects/${work.id}`}>
                    <Button variant="outline" size="sm" className="h-7 text-xs flex items-center gap-1">
                      Review Work <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Constituency Interactive Project Map */}
      <RiskMap level="DISTRICT" />
    </div>
  );
}
