import React from 'react';
import { ShoppingBag, Users, FileCheck, Percent } from 'lucide-react';
import { ProjectAssessmentInput, TenderType } from '../../types/riskAssessment';
import { Input } from '../ui/input';

interface Props {
  formData: ProjectAssessmentInput;
  onChange: (field: keyof ProjectAssessmentInput, value: any) => void;
}

const TENDER_TYPES: TenderType[] = [
  'Open Tender',
  'Limited Tender',
  'Nomination',
  'Other',
];

export function ProcurementSection({ formData, onChange }: Props) {
  const bidDeviation =
    formData.estimatedTenderAmount > 0
      ? Math.round(
          ((formData.selectedBidAmount - formData.estimatedTenderAmount) /
            formData.estimatedTenderAmount) *
            100
        )
      : 0;

  return (
    <div className="rounded-[6px] border border-[#D9DFE3] bg-white p-5 shadow-subtle space-y-4">
      <div className="flex items-center justify-between border-b border-[#D9DFE3] pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-[3px] bg-[#15324A] text-xs font-bold text-white font-mono">
            04
          </span>
          <h3 className="text-xs font-bold font-mono text-[#15324A] uppercase tracking-wider">
            Procurement & Contract Profile
          </h3>
        </div>

        {/* Live Calculated Bid Deviation Indicator */}
        <div className="flex items-center gap-2 rounded bg-[#FAFAF7] border border-[#D9DFE3] px-2.5 py-1 text-xs">
          <span className="text-[10px] text-[#647383] uppercase font-mono font-bold">
            Bid Deviation:
          </span>
          <strong
            className={`font-mono font-extrabold ${
              bidDeviation > 25
                ? 'text-[#C94B4B]'
                : bidDeviation > 10
                ? 'text-[#D99018]'
                : 'text-[#2E8064]'
            }`}
          >
            {bidDeviation > 0 ? `+${bidDeviation}% markup` : `${bidDeviation}%`}
          </strong>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        {/* Tender Type */}
        <div>
          <label className="text-[11px] font-bold text-[#15324A] uppercase tracking-wide block mb-1">
            Tender / Award Mode <span className="text-[#C94B4B]">*</span>
          </label>
          <select
            value={formData.tenderType}
            onChange={(e) => onChange('tenderType', e.target.value as TenderType)}
            className="w-full rounded-[4px] border border-[#D9DFE3] bg-white px-3 py-2 text-xs text-[#172B3A] focus:border-[#15324A] focus:outline-none"
          >
            {TENDER_TYPES.map((tt) => (
              <option key={tt} value={tt}>
                {tt}
              </option>
            ))}
          </select>
        </div>

        {/* Estimated Tender Amount */}
        <div>
          <label className="text-[11px] font-bold text-[#15324A] uppercase tracking-wide block mb-1">
            Estimated Tender Cost (₹) <span className="text-[#C94B4B]">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs text-[#647383] font-mono">₹</span>
            <Input
              type="number"
              min={0}
              value={formData.estimatedTenderAmount || ''}
              onChange={(e) => onChange('estimatedTenderAmount', Number(e.target.value))}
              placeholder="e.g. 5000000"
              className="pl-7 font-mono text-xs"
            />
          </div>
          <span className="text-[10px] text-[#647383] mt-0.5 block">
            Official Engineer Estimate / NIT
          </span>
        </div>

        {/* Selected Bid Amount */}
        <div>
          <label className="text-[11px] font-bold text-[#15324A] uppercase tracking-wide block mb-1">
            Awarded Contract Value (₹) <span className="text-[#C94B4B]">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs text-[#647383] font-mono">₹</span>
            <Input
              type="number"
              min={0}
              value={formData.selectedBidAmount || ''}
              onChange={(e) => onChange('selectedBidAmount', Number(e.target.value))}
              placeholder="e.g. 6800000"
              className="pl-7 font-mono text-xs"
            />
          </div>
          <span className="text-[10px] text-[#647383] mt-0.5 block">
            Actual Work Order (WO) amount
          </span>
        </div>

        {/* Total Bidders */}
        <div>
          <label className="text-[11px] font-bold text-[#15324A] uppercase tracking-wide block mb-1">
            Total Bidders Participating
          </label>
          <Input
            type="number"
            min={1}
            value={formData.bidderCount || ''}
            onChange={(e) => onChange('bidderCount', Number(e.target.value))}
            placeholder="e.g. 3"
            className="font-mono text-xs"
          />
        </div>

        {/* Eligible / Technically Qualified Bidders */}
        <div>
          <label className="text-[11px] font-bold text-[#15324A] uppercase tracking-wide block mb-1">
            Eligible Qualified Bidders (L1, L2...)
          </label>
          <Input
            type="number"
            min={1}
            value={formData.eligibleBidderCount || ''}
            onChange={(e) => onChange('eligibleBidderCount', Number(e.target.value))}
            placeholder="e.g. 1"
            className="font-mono text-xs"
          />
          {formData.eligibleBidderCount <= 1 && (
            <span className="text-[10px] text-[#C94B4B] font-mono mt-0.5 block">
              ⚠️ Single bidder risk indicator
            </span>
          )}
        </div>

        {/* Contractor Concentration % in District */}
        <div>
          <label className="text-[11px] font-bold text-[#15324A] uppercase tracking-wide block mb-1">
            Contractor District Concentration (%)
          </label>
          <Input
            type="number"
            min={0}
            max={100}
            value={formData.contractorConcentrationPercentage || ''}
            onChange={(e) =>
              onChange('contractorConcentrationPercentage', Math.min(100, Math.max(0, Number(e.target.value))))
            }
            placeholder="e.g. 48"
            className="font-mono text-xs"
          />
          <span className="text-[10px] text-[#647383] mt-0.5 block">
            % of active works held by same vendor
          </span>
        </div>
      </div>
    </div>
  );
}
