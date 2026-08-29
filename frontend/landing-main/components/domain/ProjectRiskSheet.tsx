import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Clock,
  MapPin,
  Building,
  User,
  ArrowRight,
  ExternalLink,
  Download,
  Eye,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Sheet } from '../ui/sheet';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { toast } from 'sonner';

export interface ProjectRiskData {
  id: string;
  title: string;
  category: string;
  location: string;
  state: string;
  district: string;
  sanctionedAmount: string;
  expenditure: string;
  physicalProgress: number;
  financialProgress: number;
  expectedCompletion: string;
  riskScore: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  reasons: string[];
  evidenceDocuments: {
    name: string;
    type: string;
    status: 'VERIFIED' | 'FLAGGED' | 'PENDING' | 'AVAILABLE';
    date: string;
  }[];
  recommendedAction: string;
  executingAgency?: string;
  contractor?: string;
}

interface ProjectRiskSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: ProjectRiskData | null;
}

export function ProjectRiskSheet({ open, onOpenChange, project }: ProjectRiskSheetProps) {
  if (!project) return null;

  const handleDocumentClick = (docName: string) => {
    toast.info(`Inspecting Evidence File: ${docName}`, {
      description: `Cryptographic SHA-256 hash verified against State Treasury records.`,
    });
  };

  const handleAssignOfficer = () => {
    toast.success(`Priority Case Docket Dispatched`, {
      description: `Assigned to ${project.district} District Vigilance Officer with statutory 14-day SLA.`,
    });
  };

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-extrabold text-[#D99018] bg-[#D99018]/10 px-2 py-0.5 rounded border border-[#D99018]/30">
            {project.id}
          </span>
          <span className="text-xs font-bold text-[#15324A] uppercase">Project Risk Dossier</span>
        </div>
      }
      description={`${project.district} District · ${project.state} • ${project.category}`}
      className="max-w-xl"
    >
      <div className="space-y-5 text-xs">
        
        {/* Top Risk Header Card */}
        <div className="p-4 rounded-[6px] border border-[#D9DFE3] bg-[#FAFAF7] space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-bold text-[#15324A] leading-snug">
                {project.title}
              </h4>
              <div className="flex items-center gap-1.5 text-[11px] text-[#647383] mt-1 font-mono">
                <MapPin className="h-3 w-3 text-[#D99018]" />
                <span>{project.location}</span>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <span className="text-[9px] font-mono text-[#647383] uppercase block">AI RISK INDEX</span>
              <span
                className={`text-xl font-mono font-extrabold px-2 py-0.5 rounded inline-block ${
                  project.riskScore >= 80
                    ? 'bg-red-50 text-[#C94B4B] border border-[#C94B4B]/30'
                    : project.riskScore >= 60
                    ? 'bg-amber-50 text-[#C98220] border border-[#C98220]/30'
                    : 'bg-emerald-50 text-[#2E8064] border border-[#2E8064]/30'
                }`}
              >
                {project.riskScore} / 100
              </span>
            </div>
          </div>

          {/* Key Financial & Milestone Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#D9DFE3] font-mono text-[10px]">
            <div className="p-2 rounded bg-white border border-[#D9DFE3]">
              <span className="text-[#647383] block">Sanctioned:</span>
              <strong className="text-xs text-[#15324A]">{project.sanctionedAmount}</strong>
            </div>

            <div className="p-2 rounded bg-white border border-[#D9DFE3]">
              <span className="text-[#647383] block">Disbursed:</span>
              <strong className="text-xs text-[#15324A]">{project.expenditure}</strong>
            </div>

            <div className="p-2 rounded bg-white border border-[#D9DFE3]">
              <span className="text-[#647383] block">Physical:</span>
              <strong className="text-xs text-[#2E8064]">{project.physicalProgress}%</strong>
            </div>

            <div className="p-2 rounded bg-white border border-[#D9DFE3]">
              <span className="text-[#647383] block">Financial:</span>
              <strong className="text-xs text-[#C94B4B]">{project.financialProgress}%</strong>
            </div>
          </div>
        </div>

        {/* Section: WHY THIS PROJECT WAS FLAGGED (Explainable Reasoning) */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#D99018]" />
            <h5 className="text-[11px] font-mono font-bold text-[#15324A] uppercase tracking-wider">
              Why Was This Project Flagged? (Explainable Anomaly Triggers)
            </h5>
          </div>

          <div className="space-y-1.5">
            {project.reasons.map((reason, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded bg-red-50/70 border border-[#C94B4B]/30 flex items-start gap-2 text-xs"
              >
                <span className="text-[#C94B4B] font-bold mt-0.5">•</span>
                <span className="text-[#172B3A] leading-snug">{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section: CORROBORATING EVIDENCE DOSSIER */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h5 className="text-[11px] font-mono font-bold text-[#15324A] uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-[#15324A]" />
              <span>Corroborating Evidence Dossier ({project.evidenceDocuments.length} Records)</span>
            </h5>
            <span className="text-[10px] font-mono text-[#2E8064]">● Cryptographically Verified</span>
          </div>

          <div className="rounded border border-[#D9DFE3] bg-white divide-y divide-[#D9DFE3] overflow-hidden">
            {project.evidenceDocuments.map((doc, idx) => (
              <div
                key={idx}
                onClick={() => handleDocumentClick(doc.name)}
                className="p-2.5 flex items-center justify-between hover:bg-[#FAFAF7] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-[#647383]" />
                  <div>
                    <strong className="text-xs text-[#172B3A] block hover:text-[#D99018]">{doc.name}</strong>
                    <span className="text-[10px] text-[#647383] font-mono">{doc.type} • {doc.date}</span>
                  </div>
                </div>

                <Badge
                  variant={
                    doc.status === 'VERIFIED'
                      ? 'success'
                      : doc.status === 'FLAGGED'
                      ? 'critical'
                      : doc.status === 'PENDING'
                      ? 'warning'
                      : 'secondary'
                  }
                  className="font-mono text-[9px]"
                >
                  {doc.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Section: RECOMMENDED REVIEW ACTION */}
        <div className="p-3.5 rounded bg-[#FAFAF7] border border-[#D9DFE3] space-y-1">
          <span className="text-[10px] font-mono font-bold text-[#15324A] uppercase block">
            Mandated Administrative Action:
          </span>
          <p className="text-xs text-[#172B3A] font-medium leading-relaxed">
            {project.recommendedAction}
          </p>
          <span className="text-[10px] font-mono text-[#647383] block pt-1">
            Human Decision-Maker Mandate: System provides risk decision support; authorized officials verify on-site.
          </span>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-[#D9DFE3] flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAssignOfficer}
            className="text-xs font-semibold h-8 border-[#D9DFE3] hover:border-[#15324A]"
          >
            Assign Investigating Officer
          </Button>

          <Link to={`/projects/${project.id}`} onClick={() => onOpenChange(false)}>
            <Button
              variant="default"
              size="sm"
              className="bg-[#15324A] hover:bg-[#0F2638] text-white text-xs font-bold h-8 px-3.5 shadow-card flex items-center gap-1"
            >
              <span>Inspect Digital Twin</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#E5B45A]" />
            </Button>
          </Link>
        </div>

      </div>
    </Sheet>
  );
}
