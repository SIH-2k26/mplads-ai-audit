import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatPercentage } from '../../lib/utils';

export function FinancialVsPhysicalProgress({
  financialProgress,
  physicalProgress,
  gap,
  className,
}: {
  financialProgress: number;
  physicalProgress: number;
  gap: number;
  className?: string;
}) {
  const isSevereGap = gap >= 25;
  const isModerateGap = gap >= 15 && gap < 25;

  const chartData = [
    {
      name: 'Disbursement vs Physical Completion',
      Financial: financialProgress,
      Physical: physicalProgress,
    },
  ];

  return (
    <div className={`rounded-[6px] border border-[#D9D5CC] bg-white p-5 shadow-card ${className || ''}`}>
      <div className="flex items-center justify-between border-b border-[#EDE8DE] pb-3 mb-4">
        <div>
          <h4 className="text-xs font-semibold text-[#18324A] uppercase tracking-wider">Financial vs Physical Progress</h4>
          <p className="text-[11px] text-[#667085]">Disbursement velocity compared against verified site execution</p>
        </div>
        <span
          className={`px-2 py-0.5 text-xs font-bold rounded-[3px] border ${
            isSevereGap
              ? 'bg-red-50 text-[#B44343] border-[#B44343]/30'
              : isModerateGap
              ? 'bg-amber-50 text-[#B7791F] border-[#B7791F]/30'
              : 'bg-emerald-50 text-[#2F7658] border-[#2F7658]/30'
          }`}
        >
          {isSevereGap ? 'CRITICAL PROGRESS GAP' : isModerateGap ? 'MODERATE DISCREPANCY' : 'ALIGNED'}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4 text-center divide-x divide-[#EDE8DE] bg-[#FAFAF7] p-3 rounded-[4px] border border-[#EDE8DE]">
        <div>
          <span className="text-[11px] text-[#667085] uppercase tracking-wider block">Financial Spent</span>
          <span className="text-xl font-bold font-mono text-[#18324A]">{formatPercentage(financialProgress)}</span>
        </div>
        <div>
          <span className="text-[11px] text-[#667085] uppercase tracking-wider block">Physical Done</span>
          <span className="text-xl font-bold font-mono text-[#2F7658]">{formatPercentage(physicalProgress)}</span>
        </div>
        <div>
          <span className="text-[11px] text-[#667085] uppercase tracking-wider block">Mismatch Gap</span>
          <span className={`text-xl font-bold font-mono ${isSevereGap ? 'text-[#B44343]' : 'text-[#18324A]'}`}>
            {gap > 0 ? `+${gap.toFixed(1)}%` : `${gap.toFixed(1)}%`}
          </span>
        </div>
      </div>

      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
            <XAxis type="number" domain={[0, 100]} unit="%" stroke="#667085" fontSize={11} />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip
              formatter={(value: any) => [`${value}%`, '']}
              contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D9D5CC', fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            <Bar dataKey="Financial" fill="#18324A" name="Financial Disbursed (%)" radius={[0, 2, 2, 0]} />
            <Bar dataKey="Physical" fill="#2F7658" name="Physical Complete (%)" radius={[0, 2, 2, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-[#EDE8DE] flex items-center gap-2 text-xs">
        {isSevereGap ? (
          <>
            <AlertCircle className="h-4 w-4 text-[#B44343] flex-shrink-0" />
            <span className="text-[#B44343]">
              <strong>Risk Alert:</strong> Financial expenditure exceeds reported physical execution by{' '}
              <strong>{gap.toFixed(1)}%</strong>. Exceeds 20% regulatory threshold.
            </span>
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4 text-[#2F7658] flex-shrink-0" />
            <span className="text-[#2F7658]">
              Financial disbursement is consistent with on-ground execution velocity.
            </span>
          </>
        )}
      </div>
    </div>
  );
}
