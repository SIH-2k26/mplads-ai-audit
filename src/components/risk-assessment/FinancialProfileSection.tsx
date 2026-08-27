import React from 'react';
import { IndianRupee, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ProjectAssessmentInput } from '../../types/riskAssessment';
import { Input } from '../ui/input';

interface Props {
  formData: ProjectAssessmentInput;
  onChange: (field: keyof ProjectAssessmentInput, value: any) => void;
}

export function FinancialProfileSection({ formData, onChange }: Props) {
  // Live calculated utilization rate
  const utilization =
    formData.amountReleased > 0
      ? Math.min(100, Math.round((formData.amountUtilized / formData.amountReleased) * 100))
      : 0;

  const remainingBalance = Math.max(0, formData.amountReleased - formData.amountUtilized);

  return (
    <div className="rounded-[6px] border border-[#D9DFE3] bg-white p-5 shadow-subtle space-y-4">
      <div className="flex items-center justify-between border-b border-[#D9DFE3] pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-[3px] bg-[#15324A] text-xs font-bold text-white font-mono">
            02
          </span>
          <h3 className="text-xs font-bold font-mono text-[#15324A] uppercase tracking-wider">
            Financial Profile & Fund Outflow
          </h3>
        </div>

        {/* Live Calculated Utilization Badge */}
        <div className="flex items-center gap-2 rounded bg-[#FAFAF7] border border-[#D9DFE3] px-2.5 py-1 text-xs">
          <span className="text-[10px] text-[#647383] uppercase font-mono font-bold">
            Live Utilisation:
          </span>
          <strong
            className={`font-mono font-extrabold ${
              utilization > 85 ? 'text-[#C94B4B]' : utilization > 60 ? 'text-[#D99018]' : 'text-[#2E8064]'
            }`}
          >
            {utilization}%
          </strong>
          <span className="text-[10px] text-[#647383]">
            (₹{(formData.amountUtilized / 100000).toFixed(2)}L / ₹{(formData.amountReleased / 100000).toFixed(2)}L)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        {/* Sanctioned Amount */}
        <div>
          <label className="text-[11px] font-bold text-[#15324A] uppercase tracking-wide block mb-1">
            Sanctioned Amount (₹) <span className="text-[#C94B4B]">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs text-[#647383] font-mono">₹</span>
            <Input
              type="number"
              min={0}
              value={formData.sanctionedAmount || ''}
              onChange={(e) => onChange('sanctionedAmount', Number(e.target.value))}
              placeholder="e.g. 5000000"
              className="pl-7 font-mono text-xs"
            />
          </div>
          <span className="text-[10px] text-[#647383] mt-0.5 block">
            ≈ ₹{((formData.sanctionedAmount || 0) / 100000).toFixed(2)} Lakhs
          </span>
        </div>

        {/* Estimated Project Cost */}
        <div>
          <label className="text-[11px] font-bold text-[#15324A] uppercase tracking-wide block mb-1">
            Estimated Project Cost (₹)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs text-[#647383] font-mono">₹</span>
            <Input
              type="number"
              min={0}
              value={formData.estimatedProjectCost || ''}
              onChange={(e) => onChange('estimatedProjectCost', Number(e.target.value))}
              placeholder="e.g. 4800000"
              className="pl-7 font-mono text-xs"
            />
          </div>
          <span className="text-[10px] text-[#647383] mt-0.5 block">
            ≈ ₹{((formData.estimatedProjectCost || 0) / 100000).toFixed(2)} Lakhs
          </span>
        </div>

        {/* Amount Released */}
        <div>
          <label className="text-[11px] font-bold text-[#15324A] uppercase tracking-wide block mb-1">
            Amount Released (₹) <span className="text-[#C94B4B]">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs text-[#647383] font-mono">₹</span>
            <Input
              type="number"
              min={0}
              value={formData.amountReleased || ''}
              onChange={(e) => onChange('amountReleased', Number(e.target.value))}
              placeholder="e.g. 2500000"
              className="pl-7 font-mono text-xs"
            />
          </div>
          <span className="text-[10px] text-[#647383] mt-0.5 block">
            ≈ ₹{((formData.amountReleased || 0) / 100000).toFixed(2)} Lakhs
          </span>
        </div>

        {/* Amount Utilized */}
        <div>
          <label className="text-[11px] font-bold text-[#15324A] uppercase tracking-wide block mb-1">
            Amount Utilized / Disbursed (₹) <span className="text-[#C94B4B]">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs text-[#647383] font-mono">₹</span>
            <Input
              type="number"
              min={0}
              value={formData.amountUtilized || ''}
              onChange={(e) => onChange('amountUtilized', Number(e.target.value))}
              placeholder="e.g. 2150000"
              className="pl-7 font-mono text-xs"
            />
          </div>
          <span className="text-[10px] text-[#647383] mt-0.5 block">
            ≈ ₹{((formData.amountUtilized || 0) / 100000).toFixed(2)} Lakhs
          </span>
        </div>

        {/* Number of Payments / Installments */}
        <div>
          <label className="text-[11px] font-bold text-[#15324A] uppercase tracking-wide block mb-1">
            Installment / Voucher Count
          </label>
          <Input
            type="number"
            min={1}
            value={formData.paymentCount || ''}
            onChange={(e) => onChange('paymentCount', Number(e.target.value))}
            placeholder="e.g. 4"
            className="font-mono text-xs"
          />
          <span className="text-[10px] text-[#647383] mt-0.5 block">
            Total DBT payment transactions
          </span>
        </div>

        {/* Latest Payment Amount */}
        <div>
          <label className="text-[11px] font-bold text-[#15324A] uppercase tracking-wide block mb-1">
            Latest Payment Voucher Amount (₹)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs text-[#647383] font-mono">₹</span>
            <Input
              type="number"
              min={0}
              value={formData.latestPaymentAmount || ''}
              onChange={(e) => onChange('latestPaymentAmount', Number(e.target.value))}
              placeholder="e.g. 750000"
              className="pl-7 font-mono text-xs"
            />
          </div>
          <span className="text-[10px] text-[#647383] mt-0.5 block">
            Remaining unspent balance: ₹{(remainingBalance / 100000).toFixed(2)} Lakhs
          </span>
        </div>
      </div>
    </div>
  );
}
