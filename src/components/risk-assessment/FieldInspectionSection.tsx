import React from 'react';
import { Camera, CheckSquare, Eye, FileSpreadsheet } from 'lucide-react';
import { ProjectAssessmentInput, FieldInspectionStatus } from '../../types/riskAssessment';
import { Input } from '../ui/input';

interface Props {
  formData: ProjectAssessmentInput;
  onChange: (field: keyof ProjectAssessmentInput, value: any) => void;
}

const INSPECTION_STATUSES: FieldInspectionStatus[] = [
  'Not Inspected',
  'Scheduled',
  'Inspected',
  'Issue Identified',
  'Verified',
];

export function FieldInspectionSection({ formData, onChange }: Props) {
  return (
    <div className="rounded-[6px] border border-[#D9DFE3] bg-white p-5 shadow-subtle space-y-4">
      <div className="flex items-center justify-between border-b border-[#D9DFE3] pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-[3px] bg-[#15324A] text-xs font-bold text-white font-mono">
            06
          </span>
          <h3 className="text-xs font-bold font-mono text-[#15324A] uppercase tracking-wider">
            Field Inspection & Evidence Telemetry (Optional)
          </h3>
        </div>
        <span className="text-[11px] text-[#647383]">Quality & Physical Audit</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        {/* Inspection Status */}
        <div>
          <label className="text-[11px] font-bold text-[#15324A] uppercase tracking-wide block mb-1">
            Site Inspection Status
          </label>
          <select
            value={formData.inspectionStatus}
            onChange={(e) => onChange('inspectionStatus', e.target.value as FieldInspectionStatus)}
            className="w-full rounded-[4px] border border-[#D9DFE3] bg-white px-3 py-2 text-xs text-[#172B3A] focus:border-[#15324A] focus:outline-none"
          >
            {INSPECTION_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Last Inspection Date */}
        <div>
          <label className="text-[11px] font-bold text-[#15324A] uppercase tracking-wide block mb-1">
            Last Physical Inspection Date
          </label>
          <Input
            type="date"
            value={formData.lastInspectionDate || ''}
            onChange={(e) => onChange('lastInspectionDate', e.target.value)}
            className="text-xs font-mono"
          />
        </div>

        {/* IQM Status */}
        <div>
          <label className="text-[11px] font-bold text-[#15324A] uppercase tracking-wide block mb-1">
            Independent Quality Monitor (IQM) Status
          </label>
          <Input
            value={formData.independentQualityMonitorStatus || ''}
            onChange={(e) => onChange('independentQualityMonitorStatus', e.target.value)}
            placeholder="e.g. IQM Satisfactory / Pending"
            className="text-xs"
          />
        </div>
      </div>

      {/* Checkboxes for Evidence Availability */}
      <div className="flex flex-wrap gap-4 pt-2 border-t border-[#D9DFE3] text-xs">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={formData.photoEvidenceAvailable}
            onChange={(e) => onChange('photoEvidenceAvailable', e.target.checked)}
            className="h-4 w-4 rounded border-[#D9DFE3] text-[#15324A] focus:ring-[#15324A]"
          />
          <span className="font-semibold text-[#172B3A]">Site Stage Photos Uploaded</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={formData.geoTaggedEvidenceAvailable}
            onChange={(e) => onChange('geoTaggedEvidenceAvailable', e.target.checked)}
            className="h-4 w-4 rounded border-[#D9DFE3] text-[#15324A] focus:ring-[#15324A]"
          />
          <span className="font-semibold text-[#172B3A]">Geo-Tagged (EXIF GPS) Evidence Verified</span>
        </label>
      </div>
    </div>
  );
}
