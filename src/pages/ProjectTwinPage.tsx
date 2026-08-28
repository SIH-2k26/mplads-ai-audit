import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { RiskScoreCard } from '../components/domain/RiskScoreCard';
import { RiskFingerprint } from '../components/domain/RiskFingerprint';
import { WhyFlaggedBox } from '../components/domain/WhyFlaggedBox';
import { CostBenchmarkCard } from '../components/domain/CostBenchmarkCard';
import { FinancialVsPhysicalProgress } from '../components/domain/FinancialVsPhysicalProgress';
import { ProjectTimelineVisualizer } from '../components/domain/ProjectTimelineVisualizer';
import { EvidencePanel } from '../components/domain/EvidencePanel';
import { PolicyReferenceCard } from '../components/domain/PolicyReferenceCard';
import { RelationshipGraph } from '../components/domain/RelationshipGraph';
import { StaleDataBanner } from '../components/ui/stale-data-banner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { projectService } from '../services/projectService';
import { Project } from '../types';
import { formatCurrencyINR, getRiskColorClass } from '../lib/utils';
import {
  FileText,
  Clock,
  Building2,
  Users,
  MapPin,
  ShieldAlert,
  Download,
  Share2,
  Briefcase,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useUiStore } from '../stores/useUiStore';

export function ProjectTwinPage() {
  const { id = 'P-1023' } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const { openEvidenceDrawer } = useUiStore();

  useEffect(() => {
    setLoading(true);
    projectService.getProjectById(id).then((data) => {
      setProject(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-[#667085]">
        Loading Project Digital Twin Cockpit...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8 text-center text-sm text-[#B44343]">
        Project record not found for ID: {id}
      </div>
    );
  }

  const riskStyle = getRiskColorClass(project.currentRiskScore);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={project.title}
        subtitle={`${project.code} • ${project.district}, ${project.state} • ${project.sector}`}
        badge={
          <Badge
            className={`font-mono text-xs ${riskStyle.badgeBg}`}
          >
            {riskStyle.label} ({project.currentRiskScore}/100)
          </Badge>
        }
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Projects', path: '/projects' },
          { label: project.code },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="saffron"
              size="sm"
              className="text-xs flex items-center gap-1.5"
              onClick={() =>
                openEvidenceDrawer({
                  title: `Evidence Dossier: ${project.title}`,
                  project: project,
                })
              }
            >
              <FileText className="h-3.5 w-3.5" />
              Open Evidence Dossier
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs flex items-center gap-1.5"
              onClick={() => window.print()}
            >
              <Download className="h-3.5 w-3.5" />
              Print Twin Dossier
            </Button>
          </div>
        }
      />

      {/* Stale Data / Audit Freshness Banner */}
      <StaleDataBanner
        lastUpdated={project.dataFreshness.lastUpdated}
        financialDataAgeDays={project.dataFreshness.financialDataAgeDays}
        physicalDataAgeDays={project.dataFreshness.physicalDataAgeDays}
        isStale={project.dataFreshness.isStale}
      />

      {/* Project Entity Metadata Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 rounded-[6px] border border-[#D9D5CC] bg-white p-4 text-xs shadow-card">
        <div>
          <span className="text-[10px] text-[#667085] uppercase tracking-wider block">Sanctioned Cost</span>
          <strong className="text-sm font-mono text-[#18324A]">{formatCurrencyINR(project.sanctionedAmount)}</strong>
        </div>
        <div>
          <span className="text-[10px] text-[#667085] uppercase tracking-wider block">Released Amount</span>
          <strong className="text-sm font-mono text-[#18324A]">{formatCurrencyINR(project.releasedAmount)} ({project.utilisationPercentage}%)</strong>
        </div>
        <div>
          <span className="text-[10px] text-[#667085] uppercase tracking-wider block">Physical Progress</span>
          <strong className="text-sm font-mono text-[#2F7658]">{project.physicalProgressPercentage}% Complete</strong>
        </div>
        <div>
          <span className="text-[10px] text-[#667085] uppercase tracking-wider block">Constituency</span>
          <strong className="text-xs text-[#1D2939] truncate block">{project.constituency}</strong>
        </div>
        <div>
          <span className="text-[10px] text-[#667085] uppercase tracking-wider block">Contractor</span>
          <strong className="text-xs text-[#1D2939] truncate block">{project.contractor.name}</strong>
        </div>
        <div>
          <span className="text-[10px] text-[#667085] uppercase tracking-wider block">Implementing Agency</span>
          <strong className="text-xs text-[#1D2939] truncate block">{project.implementingAgency.name}</strong>
        </div>
      </div>

      {/* 10 Navigation Sub-Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="progress">Physical Progress</TabsTrigger>
          <TabsTrigger value="procurement">Procurement</TabsTrigger>
          <TabsTrigger value="payments">Payments & UCs</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="evidence">Evidence ({project.evidenceItems.length})</TabsTrigger>
          <TabsTrigger value="rules">Applicable Rules</TabsTrigger>
          <TabsTrigger value="relationships">Relationships & History</TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RiskScoreCard
              currentScore={project.currentRiskScore}
              futureScore={project.futureRiskScore}
              systemicScore={project.systemicRiskScore}
              confidence={project.confidenceScore}
              evidenceCoverage={project.evidenceCoverage}
            />

            <WhyFlaggedBox reasons={project.whyFlagged} />
          </div>

          <RiskFingerprint fingerprint={project.riskFingerprint} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CostBenchmarkCard benchmark={project.costBenchmark} />
            <FinancialVsPhysicalProgress
              financialProgress={project.financialProgressPercentage}
              physicalProgress={project.physicalProgressPercentage}
              gap={project.progressMismatchGap}
            />
          </div>
        </TabsContent>

        {/* Tab 2: Timeline */}
        <TabsContent value="timeline" className="space-y-6">
          <ProjectTimelineVisualizer milestones={project.timeline} />
        </TabsContent>

        {/* Tab 3: Financials */}
        <TabsContent value="financials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Breakdown & Treasury Ledger</CardTitle>
              <CardDescription>Installment disbursements, unspent balances, and expenditure trajectory</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded bg-[#FAFAF7] border border-[#EDE8DE] text-center">
                <div>
                  <span className="text-[10px] text-[#667085] uppercase tracking-wider block">Sanctioned</span>
                  <span className="text-base font-bold font-mono text-[#18324A]">{formatCurrencyINR(project.sanctionedAmount)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#667085] uppercase tracking-wider block">Released to Agency</span>
                  <span className="text-base font-bold font-mono text-[#18324A]">{formatCurrencyINR(project.releasedAmount)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#667085] uppercase tracking-wider block">Expended by Agency</span>
                  <span className="text-base font-bold font-mono text-[#18324A]">{formatCurrencyINR(project.expenditure)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#667085] uppercase tracking-wider block">Balance with Treasury</span>
                  <span className="text-base font-bold font-mono text-[#2F7658]">{formatCurrencyINR(project.remainingBalance)}</span>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Installment No</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Disbursement Date</TableHead>
                    <TableHead>Payee / Agency</TableHead>
                    <TableHead>UC Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {project.payments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-bold">Installment #{p.installmentNo}</TableCell>
                      <TableCell className="font-mono font-bold text-[#18324A]">{formatCurrencyINR(p.amountRupees)}</TableCell>
                      <TableCell className="font-mono text-[#667085]">{p.date}</TableCell>
                      <TableCell>{p.payee}</TableCell>
                      <TableCell>
                        <Badge variant={p.ucSubmitted ? 'success' : 'critical'}>
                          {p.ucSubmitted ? `UC Verified (${p.ucReference})` : 'Pending GFR-12C UC'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Physical Progress */}
        <TabsContent value="progress" className="space-y-6">
          <FinancialVsPhysicalProgress
            financialProgress={project.financialProgressPercentage}
            physicalProgress={project.physicalProgressPercentage}
            gap={project.progressMismatchGap}
          />
        </TabsContent>

        {/* Tab 5: Procurement */}
        <TabsContent value="procurement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Procurement & Contractor Telemetry</CardTitle>
              <CardDescription>Tender notice, bid evaluation results, and contractor concentration metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded bg-[#FAFAF7] border border-[#EDE8DE] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-[#667085] uppercase tracking-wider block">Contractor Awardee</span>
                  <span className="text-sm font-bold text-[#18324A]">{project.contractor.name}</span>
                  <span className="text-[11px] text-[#667085] font-mono block">PAN: {project.contractor.panNumber}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-[#667085] uppercase tracking-wider block">Contractor Risk Index</span>
                    <span className="text-sm font-mono font-bold text-[#B44343]">{project.contractor.riskScore} / 100</span>
                  </div>
                  <Link to={`/contractors/${project.contractor.id}`}>
                    <Button variant="outline" size="sm" className="text-xs">
                      View Profile →
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 6: Payments & UCs */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Utilisation Certificates (GFR-12C) & Release Schedule</CardTitle>
              <CardDescription>Statutory compliance audit of milestone installment releases</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Voucher ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Audited UC Ref</TableHead>
                    <TableHead>Compliance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {project.payments.map((pay) => (
                    <TableRow key={pay.id}>
                      <TableCell className="font-mono font-bold">{pay.id}</TableCell>
                      <TableCell className="font-mono">{formatCurrencyINR(pay.amountRupees)}</TableCell>
                      <TableCell className="font-mono text-[#667085]">{pay.date}</TableCell>
                      <TableCell className="font-mono text-[#18324A]">{pay.ucReference || 'None Furnished'}</TableCell>
                      <TableCell>
                        <Badge variant={pay.ucSubmitted ? 'success' : 'critical'}>
                          {pay.ucSubmitted ? 'Compliant' : 'Violation §5.4'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 7: Documents */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statutory Project Documents Repository</CardTitle>
              <CardDescription>Cryptographically verified files and inspection reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                {project.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 rounded bg-[#FAFAF7] border border-[#EDE8DE] text-xs">
                    <div className="flex items-center gap-2.5">
                      <FileText className="h-4 w-4 text-[#18324A]" />
                      <div>
                        <span className="font-bold text-[#18324A] block">{doc.title}</span>
                        <span className="text-[10px] text-[#667085] font-mono">
                          {doc.type} • {doc.fileSize} • Uploaded {doc.uploadedDate} • {doc.hash}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-[#18324A] hover:underline">
                      Download PDF
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 8: Evidence */}
        <TabsContent value="evidence" className="space-y-6">
          <EvidencePanel evidenceItems={project.evidenceItems} />
        </TabsContent>

        {/* Tab 9: Applicable Rules */}
        <TabsContent value="rules" className="space-y-6">
          <div className="space-y-4">
            {project.applicableRules.map((rule) => (
              <PolicyReferenceCard key={rule.ruleId} rule={rule} />
            ))}
          </div>
        </TabsContent>

        {/* Tab 10: Relationships & History */}
        <TabsContent value="relationships" className="space-y-6">
          <RelationshipGraph
            relationships={project.relationships}
            projectTitle={project.title}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
