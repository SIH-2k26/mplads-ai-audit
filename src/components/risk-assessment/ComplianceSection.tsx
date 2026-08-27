import React from 'react';
import { ShieldCheck, Check, X, AlertTriangle } from 'lucide-react';
import { ProjectAssessmentInput } from '../../types/riskAssessment';

interface Props {
  formData: ProjectAssessmentInput;
  onChange: (field: keyof ProjectAssessmentInput, value: any) => void;
}

export function ComplianceSection({ formData, onChange }: Props) {
  const complianceToggles: Array<{
    field: keyof ProjectAssessmentInput;
    label: string;
    description: string;
    riskIfFalse?: boolean; // if false is risky (e.g. Technical Sanction)
    riskIfTrue?: boolean; // if true is risky (e.g. Duplicate Suspected)
  }> = [
    {
      field: 'technicalSanctionAvailable',
      label: 'Technical Sanction (TS) Available & Approved',
      description: 'Formal technical approval by PWD / Executive Engineer prior to sanction.',
      riskIfFalse: true,
    },
    {
      field: 'administrativeApprovalAvailable',
      label: 'Administrative Approval (AA) by District Authority',
      description: 'Collectorate sanction order formally issued under MPLADS guidelines.',
      riskIfFalse: true,
    },
    {
      field: 'documentationComplete',
      label: 'Complete Statutory Dossier (Land NOC, Estimates)',
      description: 'Land title clarity certificate and detailed estimate sheets on record.',
      riskIfFalse: true,
    },
    {
      field: 'geoLocationVerified',
      label: 'Geo-Coordinates & Boundary Verified',
      description: 'GPS lat/long verified against revenue cadastral maps.',
      riskIfFalse: true,
    },
    {
      field: 'duplicateWorkSuspected',
      label: 'Suspected Duplicate Work / Scheme Overlap',
      description: 'Potential double-dipping or asset overlap with PMGSY, JJM, or State PWD.',
      riskIfTrue: true,
    },
    {
      field: 'nearbySimilarWork',
      label: 'Nearby Similar Work Under Different Scheme',
      description: 'Similar civil asset located within 500m radius executed in last 3 years.',
      riskIfTrue: true,
    },
    {
      field: 'repeatedContractor',
      label: 'Repeated Contractor Syndicate Pattern',
      description: 'Contractor repeatedly winning consecutive packages with minimal competition.',
      riskIfTrue: true,
    },
  ];

  return (
    <div className="rounded-[6px] border border-[#D9DFE3] bg-white p-5 shadow-subtle space-y-4">
      <div className="flex items-center justify-between border-b border-[#D9DFE3] pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-[3px] bg-[#15324A] text-xs font-bold text-white font-mono">
            05
          </span>
          <h3 className="text-xs font-bold font-mono text-[#15324A] uppercase tracking-wider">
            Compliance, Duplication & Integrity Indicators
          </h3>
        </div>
        <span className="text-[11px] text-[#647383]">Statutory Audit Checks</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {complianceToggles.map((item) => {
          const value = Boolean(formData[item.field]);
          const isElevated =
            (item.riskIfTrue && value) || (item.riskIfFalse && !value);

          return (
            <div
              key={item.field}
              className={`p-3.5 rounded-[4px] border transition-colors flex items-start justify-between gap-3 ${
                isElevated
                  ? 'border-[#C94B4B]/30 bg-red-50/40'
                  : 'border-[#D9DFE3] bg-[#FAFAF7]'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#15324A]">{item.label}</span>
                  {isElevated && (
                    <span className="rounded bg-[#C94B4B]/15 px-1 py-0.2 text-[9px] font-bold text-[#C94B4B] font-mono">
                      RISK SIGNAL
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#647383] leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Yes / No Toggle Buttons */}
              <div className="flex items-center rounded border border-[#D9DFE3] bg-white p-0.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => onChange(item.field, true)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-[3px] transition-colors flex items-center gap-1 ${
                    value
                      ? item.riskIfTrue
                        ? 'bg-[#C94B4B] text-white shadow-xs'
                        : 'bg-[#2E8064] text-white shadow-xs'
                      : 'text-[#647383] hover:text-[#15324A]'
                  }`}
                >
                  <Check className="h-3 w-3" /> Yes
                </button>
                <button
                  type="button"
                  onClick={() => onChange(item.field, false)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-[3px] transition-colors flex items-center gap-1 ${
                    !value
                      ? item.riskIfFalse
                        ? 'bg-[#C94B4B] text-white shadow-xs'
                        : 'bg-[#15324A] text-white shadow-xs'
                      : 'text-[#647383] hover:text-[#15324A]'
                  }`}
                >
                  <X className="h-3 w-3" /> No
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
