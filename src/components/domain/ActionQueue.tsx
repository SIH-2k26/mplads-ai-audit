import React from 'react';
import { AlertCircle, Clock, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Alert } from '../../types';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { useUiStore } from '../../stores/useUiStore';
import { mockProjects } from '../../data/mock-projects';

export function ActionQueue({
  alerts,
  className,
}: {
  alerts: Alert[];
  className?: string;
}) {
  const { openEvidenceDrawer } = useUiStore();

  const handleOpenEvidence = (alert: Alert) => {
    const project = mockProjects.find((p) => p.id === alert.projectId);
    openEvidenceDrawer({
      title: `Evidence Dossier: ${alert.type.replace('_', ' ')}`,
      project: project || null,
      alert: alert,
    });
  };

  return (
    <div className={`rounded-[6px] border border-[#D9D5CC] bg-white shadow-card overflow-hidden ${className || ''}`}>
      <div className="flex items-center justify-between border-b border-[#EDE8DE] bg-[#FAFAF7] px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-[4px] bg-[#B44343]/10 text-[#B44343]">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#18324A] uppercase tracking-wider">Priority Action Queue</h3>
            <p className="text-xs text-[#667085]">Statutory Decisions & Interventions Requiring District Magistrate Action</p>
          </div>
        </div>
        <span className="text-xs font-bold text-[#B44343] bg-red-50 px-2.5 py-1 rounded border border-[#B44343]/30">
          {alerts.filter((a) => a.severity === 'CRITICAL').length} Critical Interventions
        </span>
      </div>

      <div className="divide-y divide-[#EDE8DE]">
        {alerts.map((alert) => {
          const isCritical = alert.severity === 'CRITICAL';
          const isHigh = alert.severity === 'HIGH';

          return (
            <div key={alert.id} className="p-4 sm:p-5 transition-colors hover:bg-[#F7F5F0]/60">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-[2px] border ${
                        isCritical
                          ? 'bg-red-50 text-[#B44343] border-[#B44343]/40'
                          : isHigh
                          ? 'bg-orange-50 text-[#C98219] border-[#C98219]/40'
                          : 'bg-amber-50 text-[#B7791F] border-[#B7791F]/40'
                      }`}
                    >
                      {alert.severity} PRIORITY
                    </span>
                    <Link
                      to={`/projects/${alert.projectId}`}
                      className="text-xs font-mono font-bold text-[#18324A] hover:underline"
                    >
                      {alert.projectCode}
                    </Link>
                    <span className="text-xs text-[#667085]">• {alert.district}</span>
                  </div>

                  <h4 className="text-xs font-bold text-[#18324A] leading-snug">
                    {alert.projectTitle}
                  </h4>

                  <p className="text-xs text-[#1D2939] leading-relaxed bg-[#FAFAF7] p-2.5 rounded-[4px] border border-[#EDE8DE]">
                    <strong className="text-[#18324A]">Issue: </strong>
                    {alert.whyFlagged}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#667085] pt-1">
                    <span className="flex items-center gap-1 font-mono text-[#B44343] font-semibold">
                      <Clock className="h-3.5 w-3.5" />
                      SLA Deadline: {alert.slaDaysRemaining} day{alert.slaDaysRemaining > 1 ? 's' : ''} remaining
                    </span>
                    <span>Assigned: <strong className="text-[#18324A]">{alert.assignedAuthority}</strong></span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-2 flex-shrink-0 pt-2 sm:pt-0">
                  <Button
                    variant="saffron"
                    size="sm"
                    className="text-xs flex items-center gap-1 w-full sm:w-auto"
                    onClick={() => handleOpenEvidence(alert)}
                  >
                    Review Evidence ({alert.evidenceCount})
                  </Button>
                  <Link to={`/projects/${alert.projectId}`} className="w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="text-xs flex items-center gap-1 w-full">
                      Project Cockpit <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
