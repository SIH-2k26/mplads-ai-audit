import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { VerdictPanel } from '../components/domain/VerdictPanel';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { caseService } from '../services/caseService';
import { CaseInvestigation } from '../types';
import {
  Briefcase,
  FileText,
  BookOpen,
  TrendingUp,
  Clock,
  ShieldAlert,
  ArrowLeft,
  ExternalLink,
  History,
} from 'lucide-react';

export function CaseDetailPage() {
  const { id = 'CASE-2026-0182' } = useParams<{ id: string }>();
  const [caseItem, setCaseItem] = useState<CaseInvestigation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    caseService.getCaseById(id).then((data) => {
      setCaseItem(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-[#667085]">
        Loading formal case file and audit trail...
      </div>
    );
  }

  if (!caseItem) {
    return (
      <div className="p-8 text-center text-sm text-[#B44343]">
        Case record not found: {id}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Investigation Case File: ${caseItem.caseNumber}`}
        subtitle={`Project Under Inquiry: ${caseItem.projectTitle} • ${caseItem.district}, ${caseItem.state}`}
        badge={
          <Badge variant="critical" className="font-mono">
            {caseItem.priority} PRIORITY (Risk: {caseItem.riskScore}/100)
          </Badge>
        }
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Case Management', path: '/cases' },
          { label: caseItem.caseNumber },
        ]}
        actions={
          <Link to={`/projects/${caseItem.projectId}`}>
            <Button variant="outline" size="sm" className="text-xs flex items-center gap-1">
              Open Full Digital Twin →
            </Button>
          </Link>
        }
      />

      {/* Rationale: Why Was This Flagged? */}
      <Card className="border-l-4 border-l-[#B44343]">
        <CardHeader className="bg-[#FAFAF7]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-[#B44343]" />
            <CardTitle className="text-xs uppercase font-bold text-[#18324A]">
              Why Was This Inquiry Flagged by AI Risk Engine?
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-[#1D2939] font-medium leading-relaxed mt-2">
            {caseItem.whyFlagged}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Grid: Evidence List, Applicable Rule, Peer Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Evidence List (1 col) */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#18324A]" />
              <CardTitle className="text-xs uppercase font-bold text-[#18324A]">
                Corroborated Evidence ({caseItem.evidenceList.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {caseItem.evidenceList.map((ev, i) => (
              <div key={i} className="p-2.5 rounded bg-[#FAFAF7] border border-[#EDE8DE] text-xs space-y-0.5">
                <div className="font-bold text-[#18324A]">{ev.title}</div>
                <div className="text-[10px] text-[#667085] font-mono">Ref: {ev.reference} • {ev.timestamp}</div>
                <div className="text-[10px] text-[#2F7658]">Source: {ev.source}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Applicable Rule (1 col) */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#C98219]" />
              <CardTitle className="text-xs uppercase font-bold text-[#18324A]">
                Statutory Rule Citation
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3 rounded bg-[#FAFAF7] border border-[#EDE8DE]">
              <span className="text-[10px] uppercase font-bold text-[#C98219] block">
                {caseItem.applicableRule.section} • Page {caseItem.applicableRule.page}
              </span>
              <span className="font-bold text-[#18324A] block mt-1">
                {caseItem.applicableRule.title}
              </span>
            </div>
            <Link to={caseItem.applicableRule.documentUrl}>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-[#18324A] hover:underline flex items-center gap-1 p-0">
                View Full Regulatory Text <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Peer Benchmark Comparison (1 col) */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#18324A]" />
              <CardTitle className="text-xs uppercase font-bold text-[#18324A]">
                Peer Benchmark Engine
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3 rounded bg-[#FAFAF7] border border-[#EDE8DE] space-y-2">
              <div>
                <span className="text-[10px] text-[#667085] uppercase tracking-wider block">Expected Range</span>
                <span className="font-mono font-bold text-[#18324A]">{caseItem.peerComparison.expectedRange}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#667085] uppercase tracking-wider block">Project Cost</span>
                <span className="font-mono font-bold text-[#B44343]">{caseItem.peerComparison.actualAmount}</span>
              </div>
              <div className="pt-1 border-t border-[#EDE8DE] text-[11px] font-semibold text-[#B44343]">
                {caseItem.peerComparison.peerDeviation} ({caseItem.peerComparison.sampleSize} peer sample size)
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Human Decision / Verdict Panel */}
      <VerdictPanel
        caseId={caseItem.id}
        currentStatus={caseItem.status}
        existingNotes={caseItem.verdictNotes}
        onVerdictSubmitted={(updated) => setCaseItem(updated)}
      />

      {/* Immutable Investigation Audit Log */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-[#18324A]" />
            <CardTitle className="text-xs uppercase font-bold text-[#18324A]">
              Immutable Audit & Inquiry Timeline
            </CardTitle>
          </div>
          <CardDescription>
            Chronological ledger of AI flags, investigator notes, subpoenas, and recorded verdicts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {caseItem.timeline.map((entry) => (
              <div key={entry.id} className="p-3 rounded bg-[#FAFAF7] border border-[#EDE8DE] text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#18324A]">{entry.action}</span>
                  <span className="text-[10px] font-mono text-[#667085]">{entry.timestamp}</span>
                </div>
                <div className="text-[11px] text-[#667085] mt-0.5">
                  Authority: <strong>{entry.user}</strong> ({entry.role})
                </div>
                <p className="mt-2 text-[#1D2939] leading-relaxed bg-white p-2 rounded border border-[#EDE8DE]">
                  {entry.notes}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
