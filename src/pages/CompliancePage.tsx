import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertOctagon,
  Copy,
  Layers,
  Scale,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  History,
  FileText,
  Building2,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { mockFraudArchetypes, mockCrossSchemeOverlaps } from '../data/mock-archetypes';
import { Link } from 'react-router-dom';

export function CompliancePage() {
  const [activeTab, setActiveTab] = useState<'archetypes' | 'crossScheme' | 'auditTrail' | 'rules'>('archetypes');

  const auditLog = [
    {
      id: 'AUD-901',
      timestamp: '27 Aug 2026, 09:14 AM',
      officer: 'Shri R. K. Patil (District Auditor)',
      action: 'Confirmed SoR Cost Variance Issue',
      target: 'Project P-1023 (Ward 17 Community Hall)',
      evidence: 'PWD SoR 2024-25 Rate Item #441 comparison showing +38.2% mark-up on structural steel.',
      status: 'VERDICT RECORDED',
    },
    {
      id: 'AUD-902',
      timestamp: '26 Aug 2026, 04:30 PM',
      officer: 'Smt. Ananya Deshmukh (Field Auditor)',
      action: 'Field Inspection Brief Dispatched',
      target: 'Project P-0871 (Haveli Bituminous Link Road)',
      evidence: 'Geotagged photographic survey and PMGSY 2023 Batch III overlay verification scheduled.',
      status: 'UNDER FIELD INQUIRY',
    },
    {
      id: 'AUD-903',
      timestamp: '25 Aug 2026, 11:20 AM',
      officer: 'District Collector Oversight Panel',
      action: 'Dismissed False Positive Alert',
      target: 'Project P-0412 (STEM Smart Classroom East Delhi)',
      evidence: 'Authorized technical justification for smart board electronics warranty bundle verified against GeM rate card.',
      status: 'CLOSED (FALSE POSITIVE)',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <PageHeader
        title="Fraud Archetype & Compliance Intelligence"
        subtitle="Machine-readable statutory verification, recognized fraud archetype fingerprinting, cross-scheme deduplication, and immutable audit logs."
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Compliance & Archetype Intelligence' },
        ]}
      />

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)}>
        <div className="border-b border-[#D9DFE3] pb-2">
          <TabsList className="bg-[#FAFAF7] border border-[#D9DFE3]">
            <TabsTrigger value="archetypes" className="text-xs font-bold">
              Fraud Archetype Fingerprinting
            </TabsTrigger>
            <TabsTrigger value="crossScheme" className="text-xs font-bold">
              Cross-Scheme Overlap Detection
            </TabsTrigger>
            <TabsTrigger value="auditTrail" className="text-xs font-bold">
              Immutable Governance Audit Trail
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Fraud Archetype Fingerprinting */}
        <TabsContent value="archetypes" className="space-y-6 pt-4">
          <div className="bg-[#FAFAF7] p-4 rounded-[6px] border border-[#D9DFE3] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded bg-[#15324A] text-[#E5B45A] flex items-center justify-center font-bold">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#15324A] uppercase tracking-wide">
                  Recognized Irregularity Archetypes (AI Pattern Library)
                </h4>
                <p className="text-[11px] text-[#647383]">
                  Grounded in historical CAG audit findings and CVC procurement circulars.
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold text-[#D99018] bg-[#D99018]/10 px-2.5 py-1 rounded border border-[#D99018]/30">
              5 Active Archetype Models
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {mockFraudArchetypes.map((arch) => (
              <div
                key={arch.id}
                className="rounded-[6px] border-2 border-[#D9DFE3] bg-white p-5 shadow-card hover:border-[#15324A] transition-all space-y-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between border-b border-[#D9DFE3] pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#D99018] uppercase">
                      {arch.code}
                    </span>
                    <h3 className="text-sm font-extrabold text-[#15324A] uppercase tracking-wide">
                      {arch.name}
                    </h3>
                  </div>

                  <Badge variant={arch.severity === 'CRITICAL' ? 'critical' : 'warning'}>
                    {arch.severity}
                  </Badge>
                </div>

                <p className="text-xs text-[#172B3A] leading-relaxed">
                  {arch.description}
                </p>

                {/* Match Stats */}
                <div className="grid grid-cols-3 gap-2 bg-[#FAFAF7] p-2.5 rounded border border-[#D9DFE3] text-center font-mono">
                  <div>
                    <span className="text-[9px] text-[#647383] uppercase block">AI Confidence</span>
                    <strong className="text-xs text-[#2E8064]">{arch.confidence}%</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#647383] uppercase block">Historical Matches</span>
                    <strong className="text-xs text-[#15324A]">{arch.historicalMatches} Cases</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#647383] uppercase block">Active Flagged</span>
                    <strong className="text-xs text-[#C94B4B]">{arch.affectedProjectsCount} Works</strong>
                  </div>
                </div>

                {/* Trigger Signals */}
                <div className="space-y-1.5 text-xs">
                  <span className="text-[10px] font-mono font-bold text-[#15324A] uppercase block">
                    Composite Trigger Signals:
                  </span>
                  <ul className="space-y-1 text-[#647383]">
                    {arch.triggerSignals.map((sig, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#D99018] font-bold mt-0.5">•</span>
                        <span className="text-[11px] leading-snug">{sig}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Action */}
                <div className="p-3 rounded bg-[#FAFAF7] border border-[#D9DFE3] text-xs">
                  <span className="text-[10px] font-mono font-bold text-[#15324A] uppercase block">
                    Mandated Verification Protocol:
                  </span>
                  <p className="text-[11px] text-[#172B3A] mt-0.5 font-medium">
                    {arch.recommendedAction}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#D9DFE3] flex items-center justify-between text-[10px] font-mono text-[#647383]">
                  <span>Cluster: {arch.stateConcentration}</span>
                  <Link to="/alerts" className="font-bold text-[#15324A] hover:underline flex items-center gap-1">
                    View Flagged Works <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Tab 2: Cross-Scheme Overlap Detection */}
        <TabsContent value="crossScheme" className="space-y-6 pt-4">
          <div className="bg-[#FAFAF7] p-4 rounded-[6px] border border-[#D9DFE3]">
            <h4 className="text-xs font-bold text-[#15324A] uppercase tracking-wide">
              Cross-Scheme Expenditure & Spatial Deduplication
            </h4>
            <p className="text-xs text-[#647383] mt-0.5">
              Cross-referencing MPLADS works against PMGSY (Pradhan Mantri Gram Sadak Yojana), MLALADS, State PWD, and Smart Cities Mission assets.
            </p>
          </div>

          <div className="space-y-4">
            {mockCrossSchemeOverlaps.map((cso) => (
              <div
                key={cso.id}
                className="rounded-[8px] border-2 border-[#15324A] bg-white p-5 shadow-card space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D9DFE3] pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#D99018] uppercase">
                      OVERLAP CASE: {cso.id}
                    </span>
                    <h3 className="text-sm font-bold text-[#15324A]">
                      {cso.mpladsProject.title} ↔ {cso.overlappingScheme.schemeName} Overlap
                    </h3>
                  </div>

                  <Badge variant={cso.riskStatus === 'CONFIRMED OVERLAP' ? 'critical' : 'warning'}>
                    {cso.riskStatus} ({cso.similarityScore}% Similarity)
                  </Badge>
                </div>

                {/* Comparative Two-Card Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card A: MPLADS */}
                  <div className="p-4 rounded bg-[#FAFAF7] border border-[#D9DFE3] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#15324A] text-[11px] bg-white px-2 py-0.5 rounded border border-[#D9DFE3]">
                        MPLADS Work ({cso.mpladsProject.id})
                      </span>
                      <strong className="text-xs text-[#15324A]">{cso.mpladsProject.outlay}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#647383] block">Sanction Title:</span>
                      <strong className="text-xs text-[#172B3A]">{cso.mpladsProject.title}</strong>
                    </div>
                    <div className="text-[11px] text-[#647383]">
                      <div>• Location: {cso.mpladsProject.location}</div>
                      <div>• Executing Agency: {cso.mpladsProject.agency}</div>
                      <div>• Sanction Date: {cso.mpladsProject.sanctionDate}</div>
                    </div>
                  </div>

                  {/* Card B: External Scheme */}
                  <div className="p-4 rounded bg-[#FAFAF7] border border-[#D9DFE3] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#D99018] text-[11px] bg-white px-2 py-0.5 rounded border border-[#D9DFE3]">
                        {cso.overlappingScheme.schemeName} ({cso.overlappingScheme.referenceId})
                      </span>
                      <strong className="text-xs text-[#D99018]">{cso.overlappingScheme.outlay}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#647383] block">Sanction Title:</span>
                      <strong className="text-xs text-[#172B3A]">{cso.overlappingScheme.title}</strong>
                    </div>
                    <div className="text-[11px] text-[#647383]">
                      <div>• Distance Offset: <strong className="text-[#C94B4B]">{cso.proximityDistanceKm} km</strong></div>
                      <div>• Executing Agency: {cso.overlappingScheme.agency}</div>
                      <div>• Completion Date: {cso.overlappingScheme.completionDate}</div>
                    </div>
                  </div>
                </div>

                {/* AI Explanation & Next Action */}
                <div className="p-3 rounded bg-red-50/70 border border-[#C94B4B]/30 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#C94B4B] uppercase block">
                      AI Deduplication Finding:
                    </span>
                    <p className="text-[11px] text-[#172B3A] mt-0.5">
                      {cso.notes}
                    </p>
                  </div>

                  <Link to={`/projects/${cso.mpladsProject.id}`}>
                    <Button variant="default" size="sm" className="bg-[#15324A] text-white text-xs font-bold h-8 px-3 flex-shrink-0">
                      <span>Inspect Digital Twin</span>
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Tab 3: Immutable Governance Audit Trail */}
        <TabsContent value="auditTrail" className="space-y-6 pt-4">
          <div className="bg-white rounded-[6px] border border-[#D9DFE3] shadow-card overflow-hidden">
            <div className="p-4 bg-[#FAFAF7] border-b border-[#D9DFE3] flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#15324A] uppercase tracking-wider">
                  Authoritative Human Decisions & AI Model Verdicts
                </h4>
                <p className="text-[11px] text-[#647383]">
                  Tamper-proof cryptographic record of all officer interventions, confirmations, and false-positive closures.
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#2E8064]">
                ● SHA-256 Ledger Synchronized
              </span>
            </div>

            <div className="divide-y divide-[#D9DFE3] text-xs">
              {auditLog.map((log) => (
                <div key={log.id} className="p-4 space-y-2 hover:bg-[#FAFAF7] transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#15324A] bg-[#FAFAF7] px-2 py-0.5 rounded border border-[#D9DFE3]">
                        {log.id}
                      </span>
                      <strong className="text-xs text-[#172B3A]">{log.action}</strong>
                    </div>
                    <span className="text-[10px] font-mono text-[#647383]">{log.timestamp}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#647383]">
                    <div>• Target: <strong className="text-[#172B3A]">{log.target}</strong></div>
                    <div>• Authorized Officer: <strong className="text-[#172B3A]">{log.officer}</strong></div>
                  </div>

                  <div className="p-2 rounded bg-[#FAFAF7] border border-[#D9DFE3] text-[11px] text-[#172B3A]">
                    <span className="font-mono text-[9px] text-[#647383] uppercase block">Corroborating Evidence:</span>
                    {log.evidence}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
