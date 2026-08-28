import React from 'react';
import { Activity, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ProjectAssessmentInput, ProjectExecutionStatus } from '../../types/riskAssessment';
import { Input } from '../ui/input';

interface Props {
  formData: ProjectAssessmentInput;
  onChange: (field: keyof ProjectAssessmentInput, value: any) => void;
}

const STATUSES: ProjectExecutionStatus[] = [
  'Proposed',
  'Sanctioned',
  'In Progress',
  'Delayed',
  'Completed',
  'Closed',
];

export function ExecutionStatusSection({ formData, onChange }: Props) {
  const mismatch = Math.max(0, formData.financialProgress - formData.physicalProgress);

  return (
    <div className="rounded-[6px] border border-[#D9DFE3] bg-white p-5 shadow-subtle space-y-4">
      <div className="flex items-center justify-between border-b border-[#D9DFE3] pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-[3px] bg-[#15324A] text-xs font-bold text-white font-mono">
            03
          </span>
          <h3 className="text-xs font-bold font-mono text-[#15324A] uppercase tracking-wider">
            Execution Telemetry & Milestone Progress
          </h3>
        </div>

        {/* Live Calculated Progress Mismatch Indicator */}
        <div className="flex items-center gap-2 rounded bg-[#FAFAF7] border border-[#D9DFE3] px-2.5 py-1 text-xs">
          <span className="text-[10px] text-[#647383] uppercase font-mono font-bold">
            Progress Delta:
          </span>
          <strong
            className={`font-mono font-extrabold ${
              mismatch > 30 ? 'text-[#C94B4B]' : mismatch > 15 ? 'text-[#D99018]' : 'text-[#2E8064]'
            }`}
          >
            {mismatch > 0 ? `+${mismatch} pts gap` : 'Synchronized (0 pts)'}
          </strong>
          {mismatch > 15 && (
            <span className="rounded bg-[#C94B4B]/15 px-1.5 py-0.2 text-[9px] font-bold text-[#C94B4B] font-mono">
              MISMATCH
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        {/* Physical Progress % */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-bold text-[#15324A] uppercase tracking-wide">
              Verified Physical Progress (%) <span className="text-[#C94B4B]">*</span>
            </label>
            <span className="font-mono font-bold text-[#2E8064]">
              {formData.physicalProgress}%
            </span>
          </div>
          <Input
            type="number"
            min={0}
            max={100}
            value={formData.physicalProgress ?? ''}
            onChange={(e) => onChange('physicalProgress', Math.min(100, Math.max(0, Number(e.target.value))))}
            className="font-mono text-xs"
          />
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-[#2E8064] transition-all"
              style={{ width: `${formData.physicalProgress || 0}%` }}
            />
          </div>
        </div>

        {/* Financial Progress % */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-bold text-[#15324A] uppercase tracking-wide">
              Financial Progress / Spent (%) <span className="text-[#C94B4B]">*</span>
            </label>
            <span className="font-mono font-bold text-[#15324A]">
              {formData.financialProgress}%
            </span>
          </div>
          <Input
            type="number"
            min={0}
            max={100}
            value={formData.financialProgress ?? ''}
            onChange={(e) => onChange('financialProgress', Math.min(100, Math.max(0, Number(e.target.value))))}
            className="font-mono text-xs"
          />
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-[#15324A] transition-all"
              style={{ width: `${formData.financialProgress || 0}%` }}
            />
          </div>
        </div>

        {/* Current Execution Status */}
        <div>
          <label className="text-[11px] font-bold text-[#15324A] uppercase tracking-wide block mb-1">
            Current Project Status <span className="text-[#C94B4B]">*</span>
          </label>
          <select
            value={formData.currentStatus}
            onChange={(e) => onChange('currentStatus', e.target.value as ProjectExecutionStatus)}
            className="w-full rounded-[4px] border border-[#D9DFE3] bg-white px-3 py-2 text-xs text-[#172B3A] focus:border-[#15324A] focus:outline-none"
          >
            {STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Planned Duration */}
        <div>
          <label className="text-[11px] font-bold text-[#15324A] uppercase tracking-wide block mb-1">
            Planned Duration (Days)
          </label>
          <Input
            type="number"
            min={1}
            value={formData.plannedDurationDays || ''}
            onChange={(e) => onChange('plannedDurationDays', Number(e.target.value))}
            placeholder="e.g. 365"
            className="font-mono text-xs"
          />
        </div>

        {/* Actual / Elapsed Duration */}
        <div>
          <label className="text-[11px] font-bold text-[#15324A] uppercase tracking-wide block mb-1">
            Elapsed / Actual Duration (Days)
          </label>
          <Input
            type="number"
            min={0}
            value={formData.actualDurationDays || ''}
            onChange={(e) => onChange('actualDurationDays', Number(e.target.value))}
            placeholder="e.g. 420"
            className="font-mono text-xs"
          />
          {formData.actualDurationDays > formData.plannedDurationDays && (
            <span className="text-[10px] text-[#C94B4B] font-mono mt-0.5 block">
              ⚠️ Delay overrun: +{formData.actualDurationDays - formData.plannedDurationDays} days
            </span>
          )}
        </div>

        {/* Days Since Last Payment */}
        <div>
          <label className="text-[11px] font-bold text-[#15324A] uppercase tracking-wide block mb-1">
            Days Since Last Payment Release
          </label>
          <Input
            type="number"
            min={0}
            value={formData.daysSinceLastPayment || ''}
            onChange={(e) => onChange('daysSinceLastPayment', Number(e.target.value))}
            placeholder="e.g. 18"
            className="font-mono text-xs"
          />
        </div>
      </div>
    </div>
  );
}
