import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { motion } from 'motion/react';
import { TrendingUp, ShieldCheck, AlertCircle, Calendar, Sparkles, Activity } from 'lucide-react';
import { NumberTicker } from './motion/NumberTicker';

export interface ComplianceDataPoint {
  dayNumber: number;
  date: string;
  displayDate: string;
  reliabilityScore: number;
  outlayMonitoredCr: number;
  flaggedDivergenceCr: number;
  status: 'normal' | 'flagged' | 'reconciled' | 'audit_pass';
  eventNote?: string;
}

const GENERATED_30_DAY_DATA: ComplianceDataPoint[] = [
  { dayNumber: 1, date: '2026-07-29', displayDate: 'Day 1', reliabilityScore: 74.2, outlayMonitoredCr: 4820.0, flaggedDivergenceCr: 430.0, status: 'normal', eventNote: 'Initial Monthly Baseline Audit' },
  { dayNumber: 2, date: '2026-07-30', displayDate: 'Day 2', reliabilityScore: 74.8, outlayMonitoredCr: 4830.0, flaggedDivergenceCr: 428.0, status: 'normal' },
  { dayNumber: 3, date: '2026-07-31', displayDate: 'Day 3', reliabilityScore: 75.1, outlayMonitoredCr: 4840.0, flaggedDivergenceCr: 425.0, status: 'normal' },
  { dayNumber: 4, date: '2026-08-01', displayDate: 'Day 4', reliabilityScore: 73.9, outlayMonitoredCr: 4855.0, flaggedDivergenceCr: 438.0, status: 'normal' },
  { dayNumber: 5, date: '2026-08-02', displayDate: 'Day 5', reliabilityScore: 72.4, outlayMonitoredCr: 4870.0, flaggedDivergenceCr: 450.0, status: 'flagged', eventNote: 'New Tranche Release without Geo-tag' },
  { dayNumber: 6, date: '2026-08-03', displayDate: 'Day 6', reliabilityScore: 71.0, outlayMonitoredCr: 4890.0, flaggedDivergenceCr: 462.0, status: 'flagged' },
  { dayNumber: 7, date: '2026-08-04', displayDate: 'Day 7', reliabilityScore: 69.8, outlayMonitoredCr: 4910.0, flaggedDivergenceCr: 475.0, status: 'flagged', eventNote: 'ISRO SAR Flags Earthwork Anomaly' },
  { dayNumber: 8, date: '2026-08-05', displayDate: 'Day 8', reliabilityScore: 70.5, outlayMonitoredCr: 4910.0, flaggedDivergenceCr: 470.0, status: 'normal' },
  { dayNumber: 9, date: '2026-08-06', displayDate: 'Day 9', reliabilityScore: 72.1, outlayMonitoredCr: 4915.0, flaggedDivergenceCr: 460.0, status: 'normal' },
  { dayNumber: 10, date: '2026-08-07', displayDate: 'Day 10', reliabilityScore: 74.0, outlayMonitoredCr: 4920.0, flaggedDivergenceCr: 445.0, status: 'audit_pass', eventNote: 'CAG Pre-Audit Notice Issued' },
  { dayNumber: 11, date: '2026-08-08', displayDate: 'Day 11', reliabilityScore: 75.3, outlayMonitoredCr: 4920.0, flaggedDivergenceCr: 440.0, status: 'normal' },
  { dayNumber: 12, date: '2026-08-09', displayDate: 'Day 12', reliabilityScore: 76.2, outlayMonitoredCr: 4925.0, flaggedDivergenceCr: 435.0, status: 'normal' },
  { dayNumber: 13, date: '2026-08-10', displayDate: 'Day 13', reliabilityScore: 75.8, outlayMonitoredCr: 4930.0, flaggedDivergenceCr: 438.0, status: 'normal' },
  { dayNumber: 14, date: '2026-08-11', displayDate: 'Day 14', reliabilityScore: 73.1, outlayMonitoredCr: 4945.0, flaggedDivergenceCr: 455.0, status: 'flagged', eventNote: 'Rapid Tranche Disbursal Spike' },
  { dayNumber: 15, date: '2026-08-12', displayDate: 'Day 15', reliabilityScore: 74.5, outlayMonitoredCr: 4945.0, flaggedDivergenceCr: 448.0, status: 'normal' },
  { dayNumber: 16, date: '2026-08-13', displayDate: 'Day 16', reliabilityScore: 77.0, outlayMonitoredCr: 4950.0, flaggedDivergenceCr: 432.0, status: 'reconciled', eventNote: 'Varanasi Ring Drain Tranche Freeze Executed' },
  { dayNumber: 17, date: '2026-08-14', displayDate: 'Day 17', reliabilityScore: 78.4, outlayMonitoredCr: 4950.0, flaggedDivergenceCr: 425.0, status: 'reconciled' },
  { dayNumber: 18, date: '2026-08-15', displayDate: 'Day 18', reliabilityScore: 79.1, outlayMonitoredCr: 4950.0, flaggedDivergenceCr: 420.0, status: 'normal' },
  { dayNumber: 19, date: '2026-08-16', displayDate: 'Day 19', reliabilityScore: 79.8, outlayMonitoredCr: 4950.0, flaggedDivergenceCr: 418.0, status: 'normal' },
  { dayNumber: 20, date: '2026-08-17', displayDate: 'Day 20', reliabilityScore: 81.2, outlayMonitoredCr: 4950.0, flaggedDivergenceCr: 410.0, status: 'audit_pass', eventNote: 'Cartosat-3 High-Res Radar Verification' },
  { dayNumber: 21, date: '2026-08-18', displayDate: 'Day 21', reliabilityScore: 82.0, outlayMonitoredCr: 4950.0, flaggedDivergenceCr: 405.0, status: 'reconciled' },
  { dayNumber: 22, date: '2026-08-19', displayDate: 'Day 22', reliabilityScore: 81.5, outlayMonitoredCr: 4950.0, flaggedDivergenceCr: 408.0, status: 'normal' },
  { dayNumber: 23, date: '2026-08-20', displayDate: 'Day 23', reliabilityScore: 80.8, outlayMonitoredCr: 4950.0, flaggedDivergenceCr: 412.0, status: 'normal' },
  { dayNumber: 24, date: '2026-08-21', displayDate: 'Day 24', reliabilityScore: 79.9, outlayMonitoredCr: 4950.0, flaggedDivergenceCr: 415.0, status: 'normal' },
  { dayNumber: 25, date: '2026-08-22', displayDate: 'Day 25', reliabilityScore: 78.5, outlayMonitoredCr: 4950.0, flaggedDivergenceCr: 419.0, status: 'normal' },
  { dayNumber: 26, date: '2026-08-23', displayDate: 'Day 26', reliabilityScore: 77.8, outlayMonitoredCr: 4950.0, flaggedDivergenceCr: 422.0, status: 'normal' },
  { dayNumber: 27, date: '2026-08-24', displayDate: 'Day 27', reliabilityScore: 76.9, outlayMonitoredCr: 4950.0, flaggedDivergenceCr: 418.0, status: 'normal' },
  { dayNumber: 28, date: '2026-08-25', displayDate: 'Day 28', reliabilityScore: 76.2, outlayMonitoredCr: 4950.0, flaggedDivergenceCr: 415.0, status: 'normal' },
  { dayNumber: 29, date: '2026-08-26', displayDate: 'Day 29', reliabilityScore: 76.0, outlayMonitoredCr: 4950.0, flaggedDivergenceCr: 413.5, status: 'normal' },
  { dayNumber: 30, date: '2026-08-27', displayDate: 'Day 30 (Today)', reliabilityScore: 76.4, outlayMonitoredCr: 4950.0, flaggedDivergenceCr: 412.8, status: 'audit_pass', eventNote: 'Current National Composite Reliability Baseline' },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data: ComplianceDataPoint = payload[0].payload;
    return (
      <div className="bg-[#0E0E0E] text-white p-3 rounded-xl shadow-xl border border-white/10 text-xs space-y-1.5 min-w-[200px] z-50">
        <div className="flex items-center justify-between border-b border-white/15 pb-1.5">
          <span className="font-semibold text-white/90 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[#15803D]" />
            {data.displayDate}
          </span>
          <span className="text-[10px] text-white/60">{data.date}</span>
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <span className="text-white/70">Compliance Reliability:</span>
          <span className="font-bold text-[#15803D] text-sm">
            {data.reliabilityScore.toFixed(1)}%
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-white/80">
          <span className="text-white/60">Flagged Risk Outlay:</span>
          <span className="font-medium text-red-400">₹{data.flaggedDivergenceCr.toFixed(1)} Cr</span>
        </div>

        {data.eventNote && (
          <div className="pt-1.5 mt-1 border-t border-white/10 text-[10px] text-amber-300 font-medium leading-tight">
            ⚡ {data.eventNote}
          </div>
        )}
      </div>
    );
  }
  return null;
};

interface ComplianceTrendlineChartProps {
  currentScore?: number;
  onOpenAuditLog?: () => void;
}

export const ComplianceTrendlineChart: React.FC<ComplianceTrendlineChartProps> = ({
  currentScore = 76.4,
  onOpenAuditLog,
}) => {
  const [timeRange, setTimeRange] = useState<'30d' | '14d' | '7d'>('30d');
  const [metricView, setMetricView] = useState<'score' | 'divergence'>('score');

  const filteredData = useMemo(() => {
    if (timeRange === '7d') return GENERATED_30_DAY_DATA.slice(-7);
    if (timeRange === '14d') return GENERATED_30_DAY_DATA.slice(-14);
    return GENERATED_30_DAY_DATA;
  }, [timeRange]);

  // Calculate 30-day stats
  const stats = useMemo(() => {
    const scores = filteredData.map((d) => d.reliabilityScore);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const max = Math.max(...scores);
    const min = Math.min(...scores);
    const delta = scores[scores.length - 1] - scores[0];
    return { avg, max, min, delta };
  }, [filteredData]);

  return (
    <div className="mt-4 p-4 sm:p-5 bg-white rounded-2xl border border-[#E5E3DC] shadow-2xs space-y-3.5">
      {/* Top Header Row with Title, Badges and Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#15803D]/15 border border-[#15803D]/30 flex items-center justify-center text-[#0E0E0E]">
            <Activity className="w-4 h-4 text-[#0E0E0E]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-[#0E0E0E]">
                30-Day Compliance Reliability Trendline
              </h3>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#15803D]/15 text-[#15803D] border border-[#15803D]/30">
                <ShieldCheck className="w-3 h-3 text-[#15803D]" />
                {stats.delta >= 0 ? `+${stats.delta.toFixed(1)}%` : `${stats.delta.toFixed(1)}%`} MoM
              </span>
            </div>
            <p className="text-[11px] text-[#6B6B6B]">
              Real-time multi-source composite scoring across PFMS disbursements & ISRO Cartosat-3 passes
            </p>
          </div>
        </div>

        {/* Timeframe & Mode Controls */}
        <div className="flex items-center gap-2">
          {/* Metric Selector */}
          <div className="flex items-center bg-[#F1F0EC] p-0.5 rounded-full text-[11px]">
            <button
              onClick={() => setMetricView('score')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                metricView === 'score'
                  ? 'bg-white text-[#0E0E0E] shadow-2xs font-semibold'
                  : 'text-[#6B6B6B] hover:text-[#0E0E0E]'
              }`}
            >
              Reliability Score
            </button>
            <button
              onClick={() => setMetricView('divergence')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                metricView === 'divergence'
                  ? 'bg-white text-red-600 shadow-2xs font-semibold'
                  : 'text-[#6B6B6B] hover:text-[#0E0E0E]'
              }`}
            >
              Risk Outlay (₹ Cr)
            </button>
          </div>

          {/* Timeframe Tabs */}
          <div className="flex items-center bg-[#F1F0EC] p-0.5 rounded-full text-[11px]">
            {(['7d', '14d', '30d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 rounded-full font-medium uppercase transition-all cursor-pointer ${
                  timeRange === range
                    ? 'bg-[#0E0E0E] text-white font-semibold shadow-2xs'
                    : 'text-[#6B6B6B] hover:text-[#0E0E0E]'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recharts Animated Area / Trendline Graph */}
      <div className="w-full h-44 sm:h-48 pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filteredData}
            margin={{ top: 10, right: 10, left: -24, bottom: 0 }}
          >
            <defs>
              <linearGradient id="reliabilityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#15803D" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#15803D" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#F1F0EC"
            />

            <XAxis
              dataKey="displayDate"
              tick={{ fontSize: 10, fill: '#6B6B6B' }}
              tickLine={false}
              axisLine={{ stroke: '#E5E3DC' }}
              interval="preserveStartEnd"
            />

            <YAxis
              domain={metricView === 'score' ? [65, 90] : [390, 490]}
              tick={{ fontSize: 10, fill: '#6B6B6B' }}
              tickLine={false}
              axisLine={false}
              unit={metricView === 'score' ? '%' : ' Cr'}
            />

            <Tooltip content={<CustomTooltip />} />

            {metricView === 'score' && (
              <ReferenceLine
                y={80}
                stroke="#6B6B6B"
                strokeDasharray="4 4"
                label={{
                  value: 'CAG Benchmark (80%)',
                  position: 'insideTopRight',
                  fill: '#6B6B6B',
                  fontSize: 9,
                }}
              />
            )}

            {metricView === 'score' ? (
              <Area
                type="monotone"
                dataKey="reliabilityScore"
                name="Compliance Reliability"
                stroke="#002449"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#reliabilityGradient)"
                isAnimationActive={true}
                animationDuration={1200}
                animationEasing="ease-out"
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  if (payload.status === 'flagged') {
                    return (
                      <circle
                        key={props.key}
                        cx={cx}
                        cy={cy}
                        r={4}
                        fill="#EF4444"
                        stroke="#FFFFFF"
                        strokeWidth={1.5}
                      />
                    );
                  }
                  if (payload.status === 'audit_pass') {
                    return (
                      <circle
                        key={props.key}
                        cx={cx}
                        cy={cy}
                        r={3.5}
                        fill="#002449"
                        stroke="#15803D"
                        strokeWidth={1.5}
                      />
                    );
                  }
                  return <React.Fragment key={props.key} />;
                }}
                activeDot={{
                  r: 6,
                  fill: '#002449',
                  stroke: '#15803D',
                  strokeWidth: 2,
                }}
              />
            ) : (
              <Area
                type="monotone"
                dataKey="flaggedDivergenceCr"
                name="Flagged Divergence"
                stroke="#EF4444"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#riskGradient)"
                isAnimationActive={true}
                animationDuration={1200}
                animationEasing="ease-out"
                activeDot={{
                  r: 6,
                  fill: '#EF4444',
                  stroke: '#FFFFFF',
                  strokeWidth: 2,
                }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 30-Day Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#F1F0EC] text-xs">
        <div className="bg-[#F1F0EC] p-2.5 rounded-xl">
          <span className="text-[10px] text-[#6B6B6B] block">30-Day Average</span>
          <span className="font-bold text-[#0E0E0E] text-xs sm:text-sm">
            <NumberTicker value={stats.avg} decimalPlaces={1} />%
          </span>
        </div>

        <div className="bg-[#F1F0EC] p-2.5 rounded-xl">
          <span className="text-[10px] text-[#6B6B6B] block">Peak Integrity</span>
          <span className="font-bold text-emerald-700 text-xs sm:text-sm">
            <NumberTicker value={stats.max} decimalPlaces={1} />%
          </span>
        </div>

        <div className="bg-[#F1F0EC] p-2.5 rounded-xl">
          <span className="text-[10px] text-[#6B6B6B] block">Trough (Risk Spike)</span>
          <span className="font-bold text-red-600 text-xs sm:text-sm">
            <NumberTicker value={stats.min} decimalPlaces={1} />%
          </span>
        </div>

        <div className="bg-[#F1F0EC] p-2.5 rounded-xl">
          <span className="text-[10px] text-[#6B6B6B] block">Current Baseline</span>
          <span className="font-bold text-[#0E0E0E] text-xs sm:text-sm flex items-center gap-1">
            <NumberTicker value={currentScore} decimalPlaces={1} />%
            <span className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse" />
          </span>
        </div>
      </div>
    </div>
  );
};
