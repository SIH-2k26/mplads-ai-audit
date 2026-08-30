import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  ArrowLeft,
  ShieldCheck,
  Download,
  AlertTriangle,
  Activity,
  Calendar,
  Network,
  Clock,
  Briefcase,
  Users,
  Search,
  Sparkles
} from 'lucide-react';
import { projectService } from '../services/projectService';
import { useUiStore } from '../stores/useUiStore';
import { Project } from '../types';
import { formatCurrencyINR } from '../lib/utils';
import { EvidencePanel } from '../components/domain/EvidencePanel';
import { PolicyReferenceCard } from '../components/domain/PolicyReferenceCard';

// Subcomponent: Risk Score Card
function RiskScoreCard({
  currentScore,
  futureScore,
  systemicScore,
  confidence,
  evidenceCoverage
}: {
  currentScore: number;
  futureScore: number;
  systemicScore: number;
  confidence: number;
  evidenceCoverage: number;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 select-none">
      <div className="p-4 bg-[#F1F0EC] border border-[#E5E3DC] rounded-[20px] text-center">
        <span className="text-[9px] text-[#6B6B6B] uppercase font-bold tracking-wider">Current Risk</span>
        <span className="text-xl font-bold text-red-600 block mt-1 font-mono">{currentScore}/100</span>
      </div>
      <div className="p-4 bg-[#F1F0EC] border border-[#E5E3DC] rounded-[20px] text-center">
        <span className="text-[9px] text-[#6B6B6B] uppercase font-bold tracking-wider">Future Forecast</span>
        <span className="text-xl font-bold text-orange-600 block mt-1 font-mono">{futureScore}/100</span>
      </div>
      <div className="p-4 bg-[#F1F0EC] border border-[#E5E3DC] rounded-[20px] text-center">
        <span className="text-[9px] text-[#6B6B6B] uppercase font-bold tracking-wider">Systemic Risk</span>
        <span className="text-xl font-bold text-[#0E0E0E] block mt-1 font-mono">{systemicScore}/100</span>
      </div>
      <div className="p-4 bg-[#F1F0EC] border border-[#E5E3DC] rounded-[20px] text-center">
        <span className="text-[9px] text-[#6B6B6B] uppercase font-bold tracking-wider">Model Confidence</span>
        <span className="text-xl font-bold text-emerald-700 block mt-1 font-mono">{confidence}%</span>
      </div>
      <div className="p-4 bg-[#F1F0EC] border border-[#E5E3DC] rounded-[20px] text-center col-span-2 sm:col-span-1">
        <span className="text-[9px] text-[#6B6B6B] uppercase font-bold tracking-wider">Evidence Coverage</span>
        <span className="text-xl font-bold text-[#0E0E0E] block mt-1 font-mono">{evidenceCoverage}%</span>
      </div>
    </div>
  );
}

// Subcomponent: Why Flagged Box
function WhyFlaggedBox({ reasons }: { reasons: string[] }) {
  return (
    <Card className="bg-red-50 border-red-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-red-700 flex items-center gap-1.5 font-bold">
          <AlertTriangle className="w-4 h-4 text-red-700" />
          <span>Vigilance Verification Alert Parameters</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 text-xs text-red-800 space-y-1.5 leading-relaxed font-semibold">
          {reasons.map((reason, idx) => (
            <li key={idx}>{reason}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

// Subcomponent: Financial vs Physical Progress
function FinancialVsPhysicalProgress({
  financial,
  physical,
  gap
}: {
  financial: number;
  physical: number;
  gap: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Milestone Progress Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2.5 text-xs">
          <div>
            <div className="flex justify-between mb-1 font-semibold text-[#0E0E0E]">
              <span>Financial Drawdown (Disbursed)</span>
              <span className="font-mono">{financial}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-black/5 overflow-hidden">
              <div className="h-full bg-[#0E0E0E] rounded-full" style={{ width: `${financial}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1 font-semibold text-[#0E0E0E]">
              <span>Verified Physical Completion (ISRO Pass)</span>
              <span className="font-mono">{physical}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-black/5 overflow-hidden">
              <div className="h-full bg-[#9FE870] rounded-full" style={{ width: `${physical}%` }} />
            </div>
          </div>
        </div>

        <div className="p-3.5 bg-red-100/60 rounded-xl border border-red-200 flex items-center justify-between text-xs select-none">
          <span className="font-semibold text-red-800">Physical vs Financial Gap Mismatch:</span>
          <span className="font-bold text-red-700 font-mono text-sm">+{gap.toFixed(1)}% Gap</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Subcomponent: Risk Fingerprint
function RiskFingerprint({ fingerprint }: { fingerprint: Project['riskFingerprint'] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Profile Fingerprint</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Object.entries(fingerprint).map(([key, val]) => (
          <div key={key} className="space-y-1.5 text-xs">
            <div className="flex justify-between font-semibold text-[#0E0E0E] capitalize">
              <span>{key} Risk</span>
              <span className="font-mono text-[#6B6B6B]">{val}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-black/5 overflow-hidden">
              <div
                className={`h-full rounded-full ${val > 70 ? 'bg-red-500' : val > 40 ? 'bg-orange-400' : 'bg-emerald-500'}`}
                style={{ width: `${val}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Subcomponent: Timeline Visualizer
function ProjectTimelineVisualizer({ milestones }: { milestones: Project['timeline'] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Execution Milestones Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {milestones.map((m, idx) => {
          const getStatusColor = (status: string) => {
            if (status === 'COMPLETED') return 'text-emerald-700 font-bold';
            if (status === 'DELAYED') return 'text-red-600 font-semibold';
            return 'text-[#6B6B6B]';
          };

          return (
            <div key={m.id} className="relative pl-6 border-l border-[#E5E3DC] pb-4 last:pb-0 select-none">
              <div className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-white ${
                m.status === 'COMPLETED' ? 'bg-[#9FE870]' : m.status === 'DELAYED' ? 'bg-red-500' : 'bg-gray-400'
              }`} />
              
              <div className="text-xs">
                <div className="flex justify-between items-start flex-wrap gap-2 font-semibold text-[#0E0E0E]">
                  <span>{m.step}</span>
                  <span className={getStatusColor(m.status)}>{m.status}</span>
                </div>
                <div className="text-[10px] text-[#6B6B6B] mt-0.5 font-mono">Date: {m.date}</div>
                {m.delayDays && <div className="text-red-600 font-semibold mt-0.5">SLA Stall: +{m.delayDays} days delay</div>}
                {m.notes && <p className="text-[#6B6B6B] mt-1 text-[11px] leading-relaxed">{m.notes}</p>}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

// Subcomponent: Relationship Graph
function RelationshipGraph({ relationships }: { relationships: Project['relationships'] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Collusion & Entity Linkages Registry</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Target Node Entity</TableHead>
              <TableHead>Target Type</TableHead>
              <TableHead>Relationship Type</TableHead>
              <TableHead>Link weight</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {relationships.map((r, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-semibold text-xs text-[#0E0E0E]">{r.targetName}</TableCell>
                <TableCell className="text-xs font-mono">{r.targetType}</TableCell>
                <TableCell className="text-xs text-[#6B6B6B]">{r.relationType}</TableCell>
                <TableCell className="text-xs font-bold text-red-600">{r.weight}% nexus</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Subcomponent: Stale Data Banner
function StaleDataBanner({
  lastUpdated,
  financialDataAgeDays,
  physicalDataAgeDays,
  isStale
}: {
  lastUpdated: string;
  financialDataAgeDays: number;
  physicalDataAgeDays: number;
  isStale: boolean;
}) {
  if (!isStale) return null;
  return (
    <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl border border-amber-200 text-xs flex items-center gap-2 select-none">
      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-800" />
      <span>
        Data freshness latency alert: Telemetry was last synced on {lastUpdated} (Financial data is {financialDataAgeDays} days stale, Physical data is {physicalDataAgeDays} days stale).
      </span>
    </div>
  );
}

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
      <div className="p-12 text-center bg-[#F1F0EC] rounded-[20px] select-none text-xs text-[#6B6B6B] font-sans font-medium animate-pulse">
        Loading Project Digital Twin Cockpit...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-12 text-center bg-[#F1F0EC] rounded-[20px] select-none text-xs text-[#6B6B6B] font-sans">
        Project record not found: {id}
        <div className="mt-4">
          <Link to="/projects">
            <Button variant="default" size="sm">Back to Explorer</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Navigation Back Link */}
      <div className="flex items-center justify-between select-none">
        <Link to="/projects" className="text-xs text-[#6B6B6B] hover:text-[#0E0E0E] flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Projects Explorer
        </Link>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              openEvidenceDrawer({
                title: `Evidence Dossier: ${project.title}`,
                project,
              })
            }
            className="bg-[#9FE870] hover:bg-[#8ee05c] text-[#0E0E0E] text-xs font-semibold px-4 py-2 rounded-full cursor-pointer transition-all flex items-center gap-1 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 fill-[#0E0E0E]" />
            <span>Open Evidence Dossier</span>
          </button>
          
          <button
            onClick={() => window.print()}
            className="bg-white hover:bg-[#F1F0EC] text-[#0E0E0E] border border-[#E5E3DC] text-xs font-semibold px-4 py-2 rounded-full cursor-pointer transition-all"
          >
            Print Cockpit Brief
          </button>
        </div>
      </div>

      <PageHeader
        title={project.title}
        subtitle={`${project.code} • ${project.district}, ${project.state}`}
        badge={
          <Badge variant={project.currentRiskScore >= 80 ? 'destructive' : 'secondary'}>
            {project.currentRiskScore}/100 Risk Score
          </Badge>
        }
      />

      <StaleDataBanner
        lastUpdated={project.dataFreshness.lastUpdated}
        financialDataAgeDays={project.dataFreshness.financialDataAgeDays}
        physicalDataAgeDays={project.dataFreshness.physicalDataAgeDays}
        isStale={project.dataFreshness.isStale}
      />

      {/* Tabs Selector Navigation */}
      <div className="flex items-center gap-1.5 bg-[#F1F0EC] p-1 rounded-full text-xs border border-[#E5E3DC] w-max select-none">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'timeline', label: 'Timeline' },
          { id: 'evidence', label: 'Evidence Dossier' },
          { id: 'rules', label: 'Applicable Rules' },
          { id: 'relationships', label: 'Nexus Graph' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#0E0E0E] text-white font-semibold'
                : 'text-[#6B6B6B] hover:text-[#0E0E0E]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <RiskScoreCard
              currentScore={project.currentRiskScore}
              futureScore={project.futureRiskScore}
              systemicScore={project.systemicRiskScore}
              confidence={project.confidenceScore}
              evidenceCoverage={project.evidenceCoverage}
            />

            {project.currentRiskScore >= 60 && <WhyFlaggedBox reasons={project.whyFlagged} />}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FinancialVsPhysicalProgress
                financial={project.financialProgressPercentage}
                physical={project.physicalProgressPercentage}
                gap={project.progressMismatchGap}
              />
              <div className="bg-[#F1F0EC] p-5 rounded-[20px] border border-[#E5E3DC] space-y-4">
                <h4 className="text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">Project Nodal Information</h4>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#EAE8E2]">
                    <span className="text-[#6B6B6B]">Sanctioned Allocation:</span>
                    <strong className="text-[#0E0E0E]">₹{formatCurrencyINR(project.sanctionedAmount)}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#EAE8E2]">
                    <span className="text-[#6B6B6B]">Released Funds:</span>
                    <strong className="text-[#0E0E0E]">₹{formatCurrencyINR(project.releasedAmount)}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#EAE8E2]">
                    <span className="text-[#6B6B6B]">Contractor:</span>
                    <strong className="text-[#0E0E0E]">{project.contractor.name} ({project.contractor.panNumber})</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#6B6B6B]">Implementing Nodal:</span>
                    <strong className="text-[#0E0E0E]">{project.implementingAgency.name}</strong>
                  </div>
                </div>
              </div>
            </div>

            <RiskFingerprint fingerprint={project.riskFingerprint} />
          </div>
        )}

        {activeTab === 'timeline' && <ProjectTimelineVisualizer milestones={project.timeline} />}

        {activeTab === 'evidence' && <EvidencePanel evidenceItems={project.evidenceItems} />}

        {activeTab === 'rules' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#6B6B6B] uppercase tracking-wider px-1">
              Applicable Statutory Guidelines
            </h4>
            <div className="space-y-4">
              {project.applicableRules.map((rule) => (
                <PolicyReferenceCard key={rule.ruleId} rule={rule} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'relationships' && <RelationshipGraph relationships={project.relationships} />}
      </div>
    </div>
  );
}
