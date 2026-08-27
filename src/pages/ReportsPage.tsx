import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  FileSpreadsheet,
  Download,
  FileText,
  Printer,
  Sparkles,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { caseService } from '../services/caseService';
import { toast } from 'sonner';

export function ReportsPage() {
  const [feedbackLog] = useState(caseService.getModelFeedbackLog());

  const reports = [
    {
      title: 'District Quarterly Anomaly & Variance Audit (Q2 FY 26-27)',
      desc: 'Summary of 128 works in Pune District, including 7 flagged cost overruns and 3 UC overdue notices.',
      date: '24 Aug 2026',
      size: '3.4 MB',
      type: 'DISTRICT AUDIT',
    },
    {
      title: 'Contractor Cartelization & Syndicate Network Dossier',
      desc: 'Top 5 vendor clusters in Maharashtra with >40% single-block tender concentration.',
      date: '18 Aug 2026',
      size: '5.1 MB',
      type: 'CARTEL INTEL',
    },
    {
      title: 'Pre-Sanction Statutory Compliance & Duplication Audit',
      desc: 'De-duplication cross-match report against PMGSY, Jal Jeevan Mission, and State PWD works.',
      date: '12 Aug 2026',
      size: '2.8 MB',
      type: 'PRE-SANCTION',
    },
    {
      title: 'CAG / CVC Annual Comprehensive Risk Prioritisation Docket',
      desc: 'Prioritised target list of top 20 high-value civil projects requiring statutory field audit.',
      date: '26 Aug 2026',
      size: '6.8 MB',
      type: 'CAG AUDIT',
    },
  ];

  const handleRetrainTrigger = () => {
    toast.success(`ML Retraining Pipeline Triggered (Model v1.5)`, {
      description: `Incorporating 142 investigator feedback records into Isolation Forest and Dynamic Weight Matrix.`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Statutory Audit Reports & ML Model Evaluation"
        subtitle="CAG audit dockets, printable inspection dossiers, and human-in-the-loop ML model evaluation metrics"
        badge={
          <Badge variant="default" className="font-mono bg-[#15324A] text-white">
            OFFICIAL AUDIT REPOSITORY
          </Badge>
        }
      />

      {/* SECTION 1: MODEL EVALUATION & HUMAN-IN-THE-LOOP FEEDBACK LOOP */}
      <div className="rounded-[8px] border-2 border-[#15324A] bg-white p-5 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D9DFE3] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#D99018]" />
              <h3 className="text-sm font-bold font-mono text-[#15324A] uppercase tracking-wide">
                Continuous ML Feedback Loop & Model Performance (v1.4 Ensemble)
              </h3>
            </div>
            <p className="text-xs text-[#647383] mt-0.5">
              The AI risk engine continuously learns from officer decisions (Confirmed Irregularity vs False Positive justifications).
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRetrainTrigger}
            className="text-xs font-bold border-[#15324A] text-[#15324A] hover:bg-[#15324A] hover:text-white flex items-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Trigger Model Retraining
          </Button>
        </div>

        {/* Model Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
          <div className="p-3 rounded bg-[#FAFAF7] border border-[#D9DFE3] text-center space-y-0.5">
            <span className="text-[10px] text-[#647383] uppercase block">Anomaly Precision</span>
            <strong className="text-xl font-extrabold text-[#2E8064]">87.4%</strong>
            <span className="text-[10px] text-[#647383] block">Isolation Forest</span>
          </div>

          <div className="p-3 rounded bg-[#FAFAF7] border border-[#D9DFE3] text-center space-y-0.5">
            <span className="text-[10px] text-[#647383] uppercase block">Detection Recall</span>
            <strong className="text-xl font-extrabold text-[#2E8064]">82.1%</strong>
            <span className="text-[10px] text-[#647383] block">Multi-Agent Suite</span>
          </div>

          <div className="p-3 rounded bg-[#FAFAF7] border border-[#D9DFE3] text-center space-y-0.5">
            <span className="text-[10px] text-[#647383] uppercase block">F1 Composite</span>
            <strong className="text-xl font-extrabold text-[#15324A]">84.7%</strong>
            <span className="text-[10px] text-[#647383] block">Weighted Metric</span>
          </div>

          <div className="p-3 rounded bg-[#FAFAF7] border border-[#D9DFE3] text-center space-y-0.5">
            <span className="text-[10px] text-[#647383] uppercase block">Duplicate Accuracy</span>
            <strong className="text-xl font-extrabold text-[#2E8064]">91.2%</strong>
            <span className="text-[10px] text-[#647383] block">Geo + Semantic</span>
          </div>

          <div className="p-3 rounded bg-[#FAFAF7] border border-[#D9DFE3] text-center space-y-0.5">
            <span className="text-[10px] text-[#647383] uppercase block">False Positive Rate</span>
            <strong className="text-xl font-extrabold text-[#C98220]">8.6%</strong>
            <span className="text-[10px] text-[#2E8064] block">-2.4% vs v1.3</span>
          </div>

          <div className="p-3 rounded bg-[#FAFAF7] border border-[#D9DFE3] text-center space-y-0.5">
            <span className="text-[10px] text-[#647383] uppercase block">Feedback Points</span>
            <strong className="text-xl font-extrabold text-[#15324A]">142</strong>
            <span className="text-[10px] text-[#647383] block">Officer Decisions</span>
          </div>
        </div>

        {/* Live Feedback Stream Table */}
        <div className="space-y-2 pt-2">
          <span className="text-[10px] font-mono font-bold text-[#15324A] uppercase tracking-wider block">
            Recent Ground-Truth Feedback Stream:
          </span>
          <div className="rounded border border-[#D9DFE3] bg-[#FAFAF7] divide-y divide-[#D9DFE3] overflow-hidden text-xs">
            {feedbackLog.map((fb) => (
              <div key={fb.id} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#15324A]">{fb.projectId}</span>
                    <strong className="text-[#172B3A]">{fb.projectTitle}</strong>
                    <Badge variant={fb.decision === 'CONFIRMED_ISSUE' ? 'critical' : 'success'}>
                      {fb.decision.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#647383] italic">"{fb.reason}"</p>
                </div>
                <div className="text-right flex-shrink-0 font-mono text-[10px] text-[#647383]">
                  <div>By: {fb.officer.split('(')[0]}</div>
                  <div>Model: {fb.modelVersion}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: OFFICIAL DOWNLOADABLE AUDIT REPORTS */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold text-[#15324A] uppercase tracking-wider">
          Downloadable Statutory Audit Dossiers & Inquiry Reports
        </h3>

        <div className="space-y-3">
          {reports.map((r, i) => (
            <Card key={i} className="hover:border-[#15324A] transition-colors">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-[#FAFAF7] text-[#15324A] border border-[#D9DFE3]">
                    <FileSpreadsheet className="h-5 w-5 text-[#D99018]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-sm font-bold text-[#15324A]">{r.title}</CardTitle>
                      <Badge variant="secondary" className="text-[9px] font-mono">
                        {r.type}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs text-[#647383] mt-0.5">
                      {r.desc} • <span className="font-mono">{r.size} • {r.date}</span>
                    </CardDescription>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs flex items-center gap-1.5 border-[#15324A] text-[#15324A] hover:bg-[#15324A] hover:text-white"
                  onClick={() => window.print()}
                >
                  <Download className="h-3.5 w-3.5" />
                  Download Dossier
                </Button>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
