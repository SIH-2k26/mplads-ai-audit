import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { EmptyState, ErrorState } from '../components/ui/empty-state';
import { StaleDataBanner } from '../components/ui/stale-data-banner';
import { KpiCard } from '../components/domain/KpiCard';
import { RiskScoreCard } from '../components/domain/RiskScoreCard';
import { RiskFingerprint } from '../components/domain/RiskFingerprint';
import { WhyFlaggedBox } from '../components/domain/WhyFlaggedBox';
import { CostBenchmarkCard } from '../components/domain/CostBenchmarkCard';
import { FinancialVsPhysicalProgress } from '../components/domain/FinancialVsPhysicalProgress';
import { PolicyReferenceCard } from '../components/domain/PolicyReferenceCard';
import { EvidencePanel } from '../components/domain/EvidencePanel';
import { VerdictPanel } from '../components/domain/VerdictPanel';
import { RelationshipGraph } from '../components/domain/RelationshipGraph';
import { mockProjects } from '../data/mock-projects';
import { mockPolicies } from '../data/mock-policies';
import { Palette, CheckCircle2, Shield, AlertTriangle } from 'lucide-react';

export function DesignSystemPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const sampleProject = mockProjects[0];
  const samplePolicy = mockPolicies[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="MPLADS Design System & Component Gallery"
        subtitle="Institutional design tokens, accessible components, and domain intelligence widgets"
        badge={
          <Badge variant="secondary" className="font-mono">
            GIGW & WCAG 2.1 AA Compliant
          </Badge>
        }
      />

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Colors & Tokens</TabsTrigger>
          <TabsTrigger value="buttons-badges">Buttons & Badges</TabsTrigger>
          <TabsTrigger value="kpis">KPIs & Metrics</TabsTrigger>
          <TabsTrigger value="risk-components">Risk & Anomaly Widgets</TabsTrigger>
          <TabsTrigger value="evidence-policy">Evidence & Policy</TabsTrigger>
          <TabsTrigger value="states">Data States & Banners</TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview & Colors */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Institutional Color Palette</CardTitle>
              <CardDescription>
                Designed for authority, trust, high legibility, and zero visual gimmicks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {[
                  { name: 'Primary Navy', hex: '#18324A', text: 'text-white' },
                  { name: 'Deep Navy', hex: '#102A43', text: 'text-white' },
                  { name: 'Warm Ivory', hex: '#F7F5F0', text: 'text-[#18324A]' },
                  { name: 'Warm Sand', hex: '#EDE8DE', text: 'text-[#18324A]' },
                  { name: 'Saffron Accent', hex: '#C98219', text: 'text-white' },
                  { name: 'Soft Amber', hex: '#E7A943', text: 'text-[#18324A]' },
                  { name: 'Forest Success', hex: '#2F7658', text: 'text-white' },
                  { name: 'Ochre Warning', hex: '#B7791F', text: 'text-white' },
                  { name: 'Crimson Critical', hex: '#B44343', text: 'text-white' },
                  { name: 'Primary Text', hex: '#1D2939', text: 'text-white' },
                  { name: 'Secondary Text', hex: '#667085', text: 'text-white' },
                  { name: 'Parchment Border', hex: '#D9D5CC', text: 'text-[#18324A]' },
                ].map((color) => (
                  <div key={color.name} className="rounded-[4px] border border-[#D9D5CC] overflow-hidden bg-white shadow-subtle">
                    <div
                      className={`h-16 flex items-end p-2 ${color.text}`}
                      style={{ backgroundColor: color.hex }}
                    >
                      <span className="font-mono text-[10px] font-bold">{color.hex}</span>
                    </div>
                    <div className="p-2 text-xs font-semibold text-[#18324A]">
                      {color.name}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Buttons & Badges */}
        <TabsContent value="buttons-badges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Button System</CardTitle>
              <CardDescription>Government operational action triggers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="default">Primary Navy</Button>
                <Button variant="secondary">Warm Sand Secondary</Button>
                <Button variant="outline">Institutional Outline</Button>
                <Button variant="saffron">Saffron Action</Button>
                <Button variant="critical">Critical Intervention</Button>
                <Button variant="ghost">Ghost Button</Button>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#EDE8DE]">
                <Button size="sm">Small (32px)</Button>
                <Button size="default">Default (36px)</Button>
                <Button size="lg">Large (44px)</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Semantic Status Badges</CardTitle>
              <CardDescription>Colour + Icon + Text for accessibility</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3">
              <Badge variant="default">Institutional Default</Badge>
              <Badge variant="secondary">Secondary Tag</Badge>
              <Badge variant="outline">Outline Badge</Badge>
              <Badge variant="success">Low Risk / Verified</Badge>
              <Badge variant="warning">Medium Risk / Pending</Badge>
              <Badge variant="saffron">High Risk / Alert</Badge>
              <Badge variant="critical">Critical SLA Breach</Badge>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: KPIs */}
        <TabsContent value="kpis" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              title="Total Works Sanctioned"
              value="128"
              change="+8 this FY"
              changeType="positive"
              subtitle="Pune Parliamentary Constituency"
            />
            <KpiCard
              title="Active Civil Works"
              value="47"
              change="6 delayed"
              changeType="negative"
              variant="warning"
              subtitle="On-ground implementation"
            />
            <KpiCard
              title="Completed & Handed Over"
              value="68"
              change="53% of total"
              changeType="positive"
              variant="success"
              subtitle="Durable community assets"
            />
            <KpiCard
              title="High / Critical Risk"
              value="13"
              change="3 critical"
              changeType="critical"
              variant="critical"
              subtitle="Requires immediate review"
            />
          </div>
        </TabsContent>

        {/* Tab 4: Risk & Anomaly Widgets */}
        <TabsContent value="risk-components" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RiskScoreCard
              currentScore={sampleProject.currentRiskScore}
              futureScore={sampleProject.futureRiskScore}
              systemicScore={sampleProject.systemicRiskScore}
              confidence={sampleProject.confidenceScore}
              evidenceCoverage={sampleProject.evidenceCoverage}
            />

            <WhyFlaggedBox reasons={sampleProject.whyFlagged} />
          </div>

          <RiskFingerprint fingerprint={sampleProject.riskFingerprint} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CostBenchmarkCard benchmark={sampleProject.costBenchmark} />
            <FinancialVsPhysicalProgress
              financialProgress={sampleProject.financialProgressPercentage}
              physicalProgress={sampleProject.physicalProgressPercentage}
              gap={sampleProject.progressMismatchGap}
            />
          </div>
        </TabsContent>

        {/* Tab 5: Evidence & Policy */}
        <TabsContent value="evidence-policy" className="space-y-6">
          <PolicyReferenceCard rule={sampleProject.applicableRules[0]} />
          <EvidencePanel evidenceItems={sampleProject.evidenceItems} />
          <VerdictPanel
            caseId="CASE-2026-0182"
            currentStatus="UNDER_INVESTIGATION"
            existingNotes="Preliminary inspection confirmed plinth stage only."
          />
          <RelationshipGraph
            relationships={sampleProject.relationships}
            projectTitle={sampleProject.title}
          />
        </TabsContent>

        {/* Tab 6: Data States */}
        <TabsContent value="states" className="space-y-6">
          <StaleDataBanner
            lastUpdated={sampleProject.dataFreshness.lastUpdated}
            financialDataAgeDays={sampleProject.dataFreshness.financialDataAgeDays}
            physicalDataAgeDays={sampleProject.dataFreshness.physicalDataAgeDays}
            isStale={sampleProject.dataFreshness.isStale}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EmptyState
              title="No high-risk works in this block"
              description="All civil works in Haveli Block currently meet milestone velocity and cost targets."
              actionLabel="View All Works"
              onAction={() => alert('Filter reset')}
            />

            <ErrorState
              title="Failed to fetch state telemetry"
              description="The state planning connection timed out after 3 retries."
              onRetry={() => alert('Retrying...')}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
