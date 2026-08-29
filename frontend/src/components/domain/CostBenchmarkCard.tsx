import React from 'react';
import { CostBenchmark } from '../../types';
import { formatCurrencyINR } from '../../lib/utils';
import { AlertTriangle, TrendingUp } from 'lucide-react';

interface CostBenchmarkCardProps {
  benchmark: CostBenchmark;
}

export const CostBenchmarkCard: React.FC<CostBenchmarkCardProps> = ({ benchmark }) => {
  const isHigh = benchmark.deviationPercentage > 10;

  return (
    <div className="bg-[#F1F0EC] p-5 rounded-[20px] border border-[#E5E3DC] space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#0E0E0E]" />
          <h4 className="text-xs font-bold text-[#0E0E0E] uppercase tracking-wider">
            Cost Benchmark Analytics
          </h4>
        </div>
        {isHigh && (
          <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-red-200">
            <AlertTriangle className="w-3 h-3" />
            <span>+{benchmark.deviationPercentage}% Deviation</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
        <div className="space-y-1">
          <span className="text-[10px] text-[#6B6B6B] block">Project Outlay</span>
          <span className="text-base font-bold text-[#0E0E0E]">
            ₹{formatCurrencyINR(benchmark.projectCost)}
          </span>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] text-[#6B6B6B] block">Peer Median Cost</span>
          <span className="text-base font-bold text-[#0E0E0E]">
            ₹{formatCurrencyINR(benchmark.peerMedian)}
          </span>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] text-[#6B6B6B] block">Expected Range</span>
          <span className="text-xs font-semibold text-[#0E0E0E] block pt-1">
            ₹{formatCurrencyINR(benchmark.expectedRange[0])} - ₹{formatCurrencyINR(benchmark.expectedRange[1])}
          </span>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] text-[#6B6B6B] block">Peer Sample Size</span>
          <span className="text-xs font-semibold text-[#0E0E0E] block pt-1">
            {benchmark.peerSampleCount} similar works
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-[#EAE8E2] text-[11px] text-[#6B6B6B]">
        This project sits in the <strong className="text-[#0E0E0E] font-semibold">{benchmark.peerPercentile}th percentile</strong> of regional cost distributions for similar scopes.
      </div>
    </div>
  );
};
