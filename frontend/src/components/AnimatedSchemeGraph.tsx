import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, TrendingUp, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';

interface DataPoint {
  date: string;
  disbursed: number; // in Cr
  risk: number; // in Cr
  milestone: string;
}

const DATA_TIMEFRAMES: Record<string, DataPoint[]> = {
  '1M': [
    { date: 'Aug 01', disbursed: 3720, risk: 360, milestone: 'Tranche 4A Release' },
    { date: 'Aug 07', disbursed: 3755, risk: 372, milestone: 'UP Rural Audits' },
    { date: 'Aug 14', disbursed: 3790, risk: 388, milestone: 'Radar Pass #104' },
    { date: 'Aug 21', disbursed: 3815, risk: 401, milestone: 'Zilla Disbursal' },
    { date: 'Aug 27', disbursed: 3840.5, risk: 412.8, milestone: 'Current Sentinel Log' },
  ],
  '3M': [
    { date: 'Jun', disbursed: 3410, risk: 280, milestone: 'Q1 Close' },
    { date: 'Jul', disbursed: 3620, risk: 340, milestone: 'Monsoon Works Tranche' },
    { date: 'Aug', disbursed: 3840.5, risk: 412.8, milestone: 'Live Radar Stream' },
  ],
  '6M': [
    { date: 'Mar', disbursed: 2950, risk: 180, milestone: 'Annual Sanctions' },
    { date: 'Apr', disbursed: 3120, risk: 215, milestone: 'FY25-26 Kickoff' },
    { date: 'May', disbursed: 3300, risk: 250, milestone: 'Lok Sabha Phase II' },
    { date: 'Jun', disbursed: 3480, risk: 310, milestone: 'Q1 Review' },
    { date: 'Jul', disbursed: 3690, risk: 365, milestone: 'ISRO SAR Verification' },
    { date: 'Aug', disbursed: 3840.5, risk: 412.8, milestone: 'Current Status' },
  ],
  '1Y': [
    { date: 'Q3 24', disbursed: 2100, risk: 95, milestone: 'Initial Allocations' },
    { date: 'Q4 24', disbursed: 2750, risk: 140, milestone: 'Mid-term Audits' },
    { date: 'Q1 25', disbursed: 3200, risk: 220, milestone: 'CAG Phase 1' },
    { date: 'Q2 25', disbursed: 3840.5, risk: 412.8, milestone: 'Sentinel Live Vigilance' },
  ],
};

interface AnimatedSchemeGraphProps {
  onOpenDetails?: () => void;
}

export const AnimatedSchemeGraph: React.FC<AnimatedSchemeGraphProps> = ({ onOpenDetails }) => {
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y'>('1M');
  const [activeMetric, setActiveMetric] = useState<'disbursed' | 'risk'>('disbursed');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const currentData = DATA_TIMEFRAMES[timeframe];
  
  // Graph bounds math
  const width = 280;
  const height = 90;
  const paddingX = 14;
  const paddingY = 12;

  const values = currentData.map((d) => (activeMetric === 'disbursed' ? d.disbursed : d.risk));
  const minVal = Math.min(...values) * 0.96;
  const maxVal = Math.max(...values) * 1.04;
  const range = maxVal - minVal || 1;

  const getCoordinates = (val: number, idx: number) => {
    const x = paddingX + (idx / (currentData.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - ((val - minVal) / range) * (height - 2 * paddingY);
    return { x, y };
  };

  const points = currentData.map((d, i) =>
    getCoordinates(activeMetric === 'disbursed' ? d.disbursed : d.risk, i)
  );

  // Generate smooth SVG Catmull-Rom or cubic Bezier path
  const createSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
    
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const linePath = createSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  const activeColor = activeMetric === 'disbursed' ? '#16a34a' : '#dc2626';
  const gradientId = `graph-grad-${activeMetric}-${timeframe}`;

  const currentHoveredPoint = hoveredIndex !== null ? currentData[hoveredIndex] : currentData[currentData.length - 1];
  const activeValue = activeMetric === 'disbursed' ? currentHoveredPoint.disbursed : currentHoveredPoint.risk;

  return (
    <div
      id="animated-scheme-graph-card"
      className="bg-white/80 backdrop-blur-xs rounded-2xl p-3 sm:p-4 border border-[#E5E3DC] shadow-2xs flex flex-col justify-between select-none relative overflow-hidden group hover:border-[#D5D2C8] transition-all"
    >
      {/* Background Subtle Wave Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E3DC_1px,transparent_1px)] [background-size:12px_12px] opacity-40 pointer-events-none" />

      {/* Header with Title, Live Badge, and Metric Toggle */}
      <div className="relative z-10 flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
          <span className="text-[11px] font-semibold text-[#0E0E0E] uppercase tracking-wider">
            Flow Stream
          </span>
        </div>

        {/* Metric Pill Toggle (Disbursed vs Risk) */}
        <div className="flex items-center bg-[#F1F0EC] p-0.5 rounded-full text-[10px] font-medium">
          <button
            onClick={() => setActiveMetric('disbursed')}
            className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
              activeMetric === 'disbursed'
                ? 'bg-white text-[#0E0E0E] font-semibold shadow-2xs'
                : 'text-[#6B6B6B] hover:text-[#0E0E0E]'
            }`}
          >
            Disbursed
          </button>
          <button
            onClick={() => setActiveMetric('risk')}
            className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
              activeMetric === 'risk'
                ? 'bg-red-500 text-white font-semibold shadow-2xs'
                : 'text-[#6B6B6B] hover:text-[#0E0E0E]'
            }`}
          >
            Risk
          </button>
        </div>
      </div>

      {/* Value Readout & Milestone Banner */}
      <div className="relative z-10 flex items-baseline justify-between mb-1">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-base sm:text-lg font-bold text-[#0E0E0E] tracking-tight">
              ₹{activeValue.toLocaleString('en-IN', { minimumFractionDigits: 1 })} Cr
            </span>
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full ${
                activeMetric === 'disbursed'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {activeMetric === 'disbursed' ? '+4.2% MoM' : '+12.8% Delta'}
            </span>
          </div>
          <p className="text-[10px] text-[#6B6B6B] truncate max-w-[170px]">
            {currentHoveredPoint.date} • {currentHoveredPoint.milestone}
          </p>
        </div>

        {/* Timeframe switch */}
        <div className="flex items-center gap-1 text-[9px] text-[#6B6B6B]">
          {(['1M', '3M', '6M', '1Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-1.5 py-0.5 rounded-md transition-colors cursor-pointer ${
                timeframe === tf
                  ? 'bg-[#0E0E0E] text-white font-bold'
                  : 'hover:bg-[#EAE8E2] text-[#6B6B6B]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Animated SVG Graph */}
      <div className="relative z-10 h-[80px] w-full mt-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={activeMetric === 'disbursed' ? '#16A34A' : '#ef4444'}
                stopOpacity="0.35"
              />
              <stop
                offset="100%"
                stopColor={activeMetric === 'disbursed' ? '#16A34A' : '#ef4444'}
                stopOpacity="0.0"
              />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <motion.path
            key={`area-${gradientId}`}
            d={areaPath}
            fill={`url(#${gradientId})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />

          {/* Animated Line Stroke (bklit / motion-primitives style pathLength animation) */}
          <motion.path
            key={`line-${gradientId}`}
            d={linePath}
            fill="none"
            stroke={activeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
          />

          {/* Interactive Data Points */}
          {points.map((pt, idx) => {
            const isHovered = hoveredIndex === idx;
            const isLast = idx === points.length - 1 && hoveredIndex === null;
            const isHighlighted = isHovered || isLast;

            return (
              <g key={idx} className="cursor-pointer">
                {/* Touch/Hover Target */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="12"
                  fill="transparent"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* Visible Animated Dot */}
                {isHighlighted && (
                  <>
                    <motion.circle
                      cx={pt.x}
                      cy={pt.y}
                      r="7"
                      fill={activeColor}
                      opacity="0.25"
                      animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0.1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.8 }}
                    />
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="4"
                      fill="#FFFFFF"
                      stroke={activeColor}
                      strokeWidth="2.5"
                    />
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Sparkline Baseline Info / Trigger Action */}
      <div className="relative z-10 mt-2 pt-2 border-t border-[#F1F0EC] flex items-center justify-between text-[10px] text-[#6B6B6B]">
        <div className="flex items-center gap-1">
          <Activity className="w-3 h-3 text-[#0E0E0E]" />
          <span>Real-time Sanchay telemetry</span>
        </div>
        {onOpenDetails && (
          <button
            onClick={onOpenDetails}
            className="text-[#0E0E0E] font-semibold hover:underline cursor-pointer"
          >
            Audit Log →
          </button>
        )}
      </div>
    </div>
  );
};
