import React, { useState } from 'react';
import { TIME_SERIES_TRUST_DATA } from '../data/mockData';

interface RiskTrendChartCardProps {
  onOpenAuditSpike?: (spikeNote: string) => void;
}

export const RiskTrendChartCard: React.FC<RiskTrendChartCardProps> = ({ onOpenAuditSpike }) => {
  const [activeHorizon, setActiveHorizon] = useState<'7D' | '30D' | '90D' | '1Y'>('30D');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const chartData = TIME_SERIES_TRUST_DATA[activeHorizon];
  const latestData = chartData[chartData.length - 1];

  // SVG dimensions
  const width = 500;
  const height = 150;
  const padding = 20;

  const minScore = 70;
  const maxScore = 88;

  const points = chartData.map((item, index) => {
    const x = padding + (index / (chartData.length - 1)) * (width - padding * 2);
    const y = height - padding - ((item.score - minScore) / (maxScore - minScore)) * (height - padding * 2);
    return { x, y, ...item };
  });

  const pathD = points.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[idx - 1];
    const cpX1 = prev.x + (curr.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (curr.x - prev.x) / 2;
    const cpY2 = curr.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;
  const benchmarkY = height - padding - ((80.0 - minScore) / (maxScore - minScore)) * (height - padding * 2);

  return (
    <div className="bg-[#F1F0EC] rounded-[20px] p-5 sm:p-6 space-y-4">
      {/* Header with Time Horizon Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs text-[#6B6B6B] block">National Scheme Health</span>
          <h2 className="text-base sm:text-lg font-semibold text-[#0E0E0E]">
            Integrity & Compliance Score Trend
          </h2>
        </div>

        {/* Time Horizon Pills */}
        <div className="flex items-center gap-1 bg-[#EAE8E2] p-1 rounded-full">
          {(['7D', '30D', '90D', '1Y'] as const).map((horizon) => (
            <button
              key={horizon}
              onClick={() => setActiveHorizon(horizon)}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                activeHorizon === horizon
                  ? 'bg-white text-[#0E0E0E] shadow-2xs'
                  : 'text-[#6B6B6B] hover:text-[#0E0E0E]'
              }`}
            >
              {horizon}
            </button>
          ))}
        </div>
      </div>

      {/* Big Score Number */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-semibold text-[#0E0E0E] tracking-tight">
          {latestData.score.toFixed(1)}
        </span>
        <span className="text-xs text-[#6B6B6B]">
          Statutory Benchmark: 80.0
        </span>
      </div>

      {/* Native SVG Area Chart with Wise Green */}
      <div className="w-full relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-40 overflow-visible"
        >
          <defs>
            <linearGradient id="wiseGreenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#15803D" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#15803D" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          {/* Benchmark line */}
          <line
            x1={padding}
            y1={benchmarkY}
            x2={width - padding}
            y2={benchmarkY}
            stroke="#D4D1C7"
            strokeDasharray="4 4"
            strokeWidth="1.5"
          />

          {/* Area fill */}
          <path d={areaD} fill="url(#wiseGreenGradient)" />

          {/* Line stroke */}
          <path d={pathD} fill="none" stroke="#0E0E0E" strokeWidth="2.5" />

          {/* Interactive points */}
          {points.map((pt, idx) => (
            <g key={idx}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredPoint === idx ? 5 : 3}
                fill={hoveredPoint === idx ? '#15803D' : '#0E0E0E'}
                stroke="#FFFFFF"
                strokeWidth={hoveredPoint === idx ? 2 : 1}
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredPoint(idx)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              <text
                x={pt.x}
                y={height - 2}
                fontSize="10"
                fill="#6B6B6B"
                textAnchor="middle"
                className="font-medium select-none"
              >
                {pt.timestamp}
              </text>
            </g>
          ))}
        </svg>

        {/* Hover Tooltip */}
        {hoveredPoint !== null && (
          <div
            className="absolute top-0 bg-white p-2.5 rounded-xl shadow-md border border-[#F1F0EC] text-xs pointer-events-none transition-all z-10"
            style={{
              left: `${(points[hoveredPoint].x / width) * 100}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <p className="font-semibold text-[#0E0E0E]">{points[hoveredPoint].timestamp}</p>
            <p className="text-[#6B6B6B]">
              Score: <strong className="text-[#0E0E0E]">{points[hoveredPoint].score}</strong>
            </p>
            {points[hoveredPoint].note && (
              <p className="text-[11px] text-[#6B6B6B] mt-0.5">{points[hoveredPoint].note}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
