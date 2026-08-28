import React from 'react';
import { Building2, Calendar, MapPin, Tag } from 'lucide-react';
import { ProjectAssessmentInput, WorkCategoryType } from '../../types/riskAssessment';
import { Input } from '../ui/input';

interface Props {
  formData: ProjectAssessmentInput;
  onChange: (field: keyof ProjectAssessmentInput, value: any) => void;
  errors?: Record<string, string>;
}

const CATEGORIES: WorkCategoryType[] = [
  'Road Infrastructure',
  'Water Infrastructure',
  'Education Infrastructure',
  'Public Health',
  'Sanitation & Drainage',
  'Community Assets',
  'Civil Works',
  'Other',
];

export function ProjectIdentificationSection({ formData, onChange, errors }: Props) {
  return (
    <div className="rounded-[6px] border border-[#D9DFE3] bg-white p-5 shadow-subtle space-y-4">
      <div className="flex items-center justify-between border-b border-[#D9DFE3] pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-[3px] bg-[#15324A] text-xs font-bold text-white font-mono">
            01
          </span>
          <h3 className="text-xs font-bold font-mono text-[#15324A] uppercase tracking-wider">
            Project Identification & Jurisdiction
          </h3>
        </div>
        <span className="text-[11px] text-[#647383]">Statutory Metadata</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        {/* Project ID / Work ID */}
        <div>
          <label className="text-[11px] font-bold text-[#15324A] uppercase tracking-wide block mb-1">
            Work ID / Project Code <span className="text-[#C94B4B]">*</span>
          </label>
          <Input
            value={formData.projectId}
            onChange={(e) => onChange('projectId', e.target.value)}
            placeholder="e.g. MPLADS-MH-PUN-2025-1023"
            className="font-mono text-xs"
          />
        </div>

        {/* Project Name */}
        <div className="sm:col-span-2">
          <label className="text-[11px] font-bold text-[#15324A] uppercase tracking-wide block mb-1">
            Official Project Title <span className="text-[#C94B4B]">*</span>
          </label>
          <Input
            value={formData.projectName}
            onChange={(e) => onChange('projectName', e.target.value)}
            placeholder="e.g. Construction of Community Multi-Purpose Hall"
            className="text-xs"
          />
        </div>

        {/* Work Category */}
        <div>
          <label className="text-[11px] font-bold text-[#15324A] uppercase tracking-wide block mb-1">
            Work Category <span className="text-[#C94B4B]">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => onChange('category', e.target.value as WorkCategoryType)}
            className="w-full rounded-[4px] border border-[#D9DFE3] bg-white px-3 py-2 text-xs text-[#172B3A] focus:border-[#15324A] focus:outline-none"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* State */}
        <div>
          <label className="text-[11px] font-bold text-[#15324A] uppercase tracking-wide block mb-1">
            State
          </label>
          <Input
            value={formData.state}
            onChange={(e) => onChange('state', e.target.value)}
            placeholder="e.g. Maharashtra"
            className="text-xs"
          />
        </div>

        {/* District */}
        <div>
          <label className="text-[11px] font-bold text-[#15324A] uppercase tracking-wide block mb-1">
            District
          </label>
          <Input
            value={formData.district}
            onChange={(e) => onChange('district', e.target.value)}
            placeholder="e.g. Pune"
            className="text-xs"
          />
        </div>

        {/* Parliamentary Constituency */}
        <div>
          <label className="text-[11px] font-bold text-[#15324A] uppercase tracking-wide block mb-1">
            Parliamentary Constituency
          </label>
          <Input
            value={formData.constituency}
            onChange={(e) => onChange('constituency', e.target.value)}
            placeholder="e.g. Pune Parliamentary Constituency"
            className="text-xs"
          />
        </div>

        {/* Implementing Agency */}
        <div>
          <label className="text-[11px] font-bold text-[#15324A] uppercase tracking-wide block mb-1">
            Implementing Agency
          </label>
          <Input
            value={formData.implementingAgency}
            onChange={(e) => onChange('implementingAgency', e.target.value)}
            placeholder="e.g. Pune Municipal Corporation (PWD)"
            className="text-xs"
          />
        </div>

        {/* Sanction Date */}
        <div>
          <label className="text-[11px] font-bold text-[#15324A] uppercase tracking-wide block mb-1">
            Sanction Date
          </label>
          <Input
            type="date"
            value={formData.sanctionDate}
            onChange={(e) => onChange('sanctionDate', e.target.value)}
            className="text-xs font-mono"
          />
        </div>

        {/* Expected Completion Date */}
        <div>
          <label className="text-[11px] font-bold text-[#15324A] uppercase tracking-wide block mb-1">
            Target Completion Date
          </label>
          <Input
            type="date"
            value={formData.expectedCompletionDate}
            onChange={(e) => onChange('expectedCompletionDate', e.target.value)}
            className="text-xs font-mono"
          />
        </div>
      </div>
    </div>
  );
}
