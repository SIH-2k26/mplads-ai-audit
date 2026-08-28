import React from 'react';
import { CheckCircle2, Clock, AlertCircle, Calendar } from 'lucide-react';
import { TimelineMilestone } from '../../types';
import { formatCurrencyINR } from '../../lib/utils';

export function ProjectTimelineVisualizer({
  milestones,
  className,
}: {
  milestones: TimelineMilestone[];
  className?: string;
}) {
  return (
    <div className={`rounded-[6px] border border-[#D9D5CC] bg-white p-5 shadow-card ${className || ''}`}>
      <div className="flex items-center justify-between border-b border-[#EDE8DE] pb-3 mb-5">
        <div>
          <h4 className="text-xs font-semibold text-[#18324A] uppercase tracking-wider">Project Lifecycle & Milestones</h4>
          <p className="text-[11px] text-[#667085]">Statutory MPLADS Workflow & Audit Trail</p>
        </div>
        <span className="text-[11px] font-mono text-[#667085] bg-[#F7F5F0] px-2 py-0.5 rounded border border-[#D9D5CC]">
          {milestones.filter((m) => m.status === 'COMPLETED').length} / {milestones.length} Completed
        </span>
      </div>

      <div className="relative border-l-2 border-[#D9D5CC] ml-4 space-y-6 pb-2">
        {milestones.map((m) => {
          const isCompleted = m.status === 'COMPLETED';
          const isDelayed = m.status === 'DELAYED';
          const isInProgress = m.status === 'IN_PROGRESS';

          return (
            <div key={m.id} className="relative pl-6">
              {/* Milestone Icon Node */}
              <div
                className={`absolute -left-[13px] top-0 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-white ${
                  isCompleted
                    ? 'border-[#2F7658] text-[#2F7658]'
                    : isDelayed
                    ? 'border-[#B44343] bg-red-50 text-[#B44343]'
                    : isInProgress
                    ? 'border-[#C98219] bg-orange-50 text-[#C98219]'
                    : 'border-[#D9D5CC] text-[#98A2B3]'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : isDelayed ? (
                  <AlertCircle className="h-3.5 w-3.5" />
                ) : isInProgress ? (
                  <Clock className="h-3.5 w-3.5 animate-pulse" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-[#D9D5CC]" />
                )}
              </div>

              {/* Content Box */}
              <div className="rounded-[4px] border border-[#EDE8DE] bg-[#FAFAF7] p-3 transition-colors hover:bg-white hover:border-[#D9D5CC]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#18324A]">{m.step}</span>
                  <div className="flex items-center gap-2">
                    {m.amount && (
                      <span className="text-[11px] font-mono font-semibold text-[#18324A] bg-[#EDE8DE] px-2 py-0.5 rounded">
                        {formatCurrencyINR(m.amount)}
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-[2px] ${
                        isCompleted
                          ? 'bg-[#2F7658]/10 text-[#2F7658]'
                          : isDelayed
                          ? 'bg-[#B44343]/10 text-[#B44343]'
                          : isInProgress
                          ? 'bg-[#C98219]/10 text-[#C98219]'
                          : 'bg-[#EDE8DE] text-[#667085]'
                      }`}
                    >
                      {m.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-[#667085] mt-1.5">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="h-3 w-3" />
                    {m.date}
                  </span>
                  {m.delayDays && (
                    <span className="text-[#B44343] font-semibold">
                      +{m.delayDays} days delayed beyond SLA
                    </span>
                  )}
                </div>

                {m.notes && (
                  <p className="text-xs text-[#1D2939] mt-2 pt-2 border-t border-[#EDE8DE]/80 leading-relaxed">
                    {m.notes}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
