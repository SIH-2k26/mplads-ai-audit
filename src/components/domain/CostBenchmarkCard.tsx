import React from 'react';
import { TrendingUp, BarChart2 } from 'lucide-react';
import { CostBenchmark } from '../../types';
import { formatCurrencyINR } from '../../lib/utils';

export function CostBenchmarkCard({
  benchmark,
  className,
}: {
  benchmark: CostBenchmark;
  className?: string;
}) {
  const isHighCost = benchmark.deviationPercentage > 15;
  const isCriticalCost = benchmark.deviationPercentage > 30;

  return (
    <div className={`rounded-[6px] border border-[#D9D5CC] bg-white p-5 shadow-card ${className || ''}`}>
      <div className="flex items-center justify-between border-b border-[#EDE8DE] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-[4px] bg-[#EDE8DE] text-[#18324A]">
            <BarChart2 className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[#18324A] uppercase tracking-wider">Cost Intelligence Benchmark</h4>
            <p className="text-[11px] text-[#667085]">Evaluated against {benchmark.peerSampleCount} comparable peer projects</p>
          </div>
        </div>
        <span
          className={`px-2 py-0.5 text-xs font-bold rounded-[3px] border ${
            isCriticalCost
              ? 'bg-red-50 text-[#B44343] border-[#B44343]/30'
              : isHighCost
              ? 'bg-orange-50 text-[#C98219] border-[#C98219]/30'
              : 'bg-emerald-50 text-[#2F7658] border-[#2F7658]/30'
          }`}
        >
          {isCriticalCost ? 'ANOMALOUS OVERRUN' : isHighCost ? 'HIGH COST VARIANCE' : 'NORMAL BENCHMARK'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2 border-b border-[#EDE8DE]">
        <div>
          <span className="text-[11px] text-[#667085] uppercase tracking-wider block">Project Cost</span>
          <span className="text-lg font-bold font-mono text-[#18324A]">
            {formatCurrencyINR(benchmark.projectCost)}
          </span>
        </div>

        <div>
          <span className="text-[11px] text-[#667085] uppercase tracking-wider block">Peer Median</span>
          <span className="text-lg font-bold font-mono text-[#667085]">
            {formatCurrencyINR(benchmark.peerMedian)}
          </span>
        </div>

        <div>
          <span className="text-[11px] text-[#667085] uppercase tracking-wider block">Expected Range</span>
          <span className="text-xs font-semibold font-mono text-[#1D2939] mt-1 block">
            {formatCurrencyINR(benchmark.expectedRange[0])} – {formatCurrencyINR(benchmark.expectedRange[1])}
          </span>
        </div>

        <div>
          <span className="text-[11px] text-[#667085] uppercase tracking-wider block">Deviation / Rank</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`text-sm font-bold font-mono ${
                benchmark.deviationPercentage > 0 ? 'text-[#B44343]' : 'text-[#2F7658]'
              }`}
            >
              {benchmark.deviationPercentage > 0 ? `+${benchmark.deviationPercentage}%` : `${benchmark.deviationPercentage}%`}
            </span>
            <span className="text-[11px] text-[#667085]">({benchmark.peerPercentile}th %ile)</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-1 flex items-start gap-2 text-xs text-[#667085]">
        <TrendingUp className="h-4 w-4 text-[#C98219] flex-shrink-0 mt-0.5" />
        <span>
          <strong className="text-[#18324A]">Cost Engine Interpretation:</strong> This project's sanctioned estimate sits in the{' '}
          <strong>{benchmark.peerPercentile}th percentile</strong> among civil works in this sector. PWD Schedule of Rates (SoR) deviation memo required.
        </span>
      </div>
    </div>
  );
}
