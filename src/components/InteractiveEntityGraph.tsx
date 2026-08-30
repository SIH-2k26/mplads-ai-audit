import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Network, ShieldAlert, AlertTriangle, Building2, UserCheck, Search, Link2, ExternalLink, Activity, Radio, Play, Pause } from 'lucide-react';
import { MPLADSProject } from '../types';
import { LiveLineChart, LiveLine, LiveXAxis, LiveYAxis, type LiveLinePoint } from './charts';

interface Node {
  id: string;
  label: string;
  sublabel: string;
  type: 'contractor' | 'director' | 'agency' | 'tender';
  x: number;
  y: number;
  risk: 'critical' | 'high' | 'medium' | 'normal';
}

interface Edge {
  source: string;
  target: string;
  label: string;
  flagged?: boolean;
}

const NODES: Node[] = [
  { id: 'dir1', label: 'R. K. Agarwal', sublabel: 'PAN: ABCDP8841M', type: 'director', x: 260, y: 150, risk: 'critical' },
  { id: 'c1', label: 'Vindhya Infracon Ltd', sublabel: 'GST: 09AAACV1298K1ZX', type: 'contractor', x: 100, y: 70, risk: 'critical' },
  { id: 'c2', label: 'Apex Infraworks Pvt', sublabel: 'GST: 09AABCA9910L1ZY', type: 'contractor', x: 100, y: 230, risk: 'critical' },
  { id: 'c3', label: 'Surya Developers', sublabel: 'GST: 09AABCS4412M1ZW', type: 'contractor', x: 260, y: 280, risk: 'high' },
  { id: 't1', label: 'Tender UP-RUR-2024-88', sublabel: '₹48.50 Cr • 100% Disbursed', type: 'tender', x: 440, y: 100, risk: 'critical' },
  { id: 't2', label: 'Tender UP-RUR-2024-89', sublabel: '₹34.20 Cr • 88% Disbursed', type: 'tender', x: 440, y: 220, risk: 'high' },
  { id: 'ag1', label: 'DRDA Varanasi', sublabel: 'Sanctioning Authority', type: 'agency', x: 580, y: 160, risk: 'normal' },
];

const EDGES: Edge[] = [
  { source: 'dir1', target: 'c1', label: '99.4% Shareholder', flagged: true },
  { source: 'dir1', target: 'c2', label: 'Common Managing Director', flagged: true },
  { source: 'dir1', target: 'c3', label: 'Family Beneficial Owner', flagged: true },
  { source: 'c1', target: 't1', label: 'L1 Lowest Bidder (Won)', flagged: true },
  { source: 'c2', target: 't1', label: 'L2 Dummy Bidder (Cover Bid)', flagged: true },
  { source: 'c3', target: 't2', label: 'L1 Sole Bidder (Won)', flagged: true },
  { source: 't1', target: 'ag1', label: 'PFMS Tranche Passed' },
  { source: 't2', target: 'ag1', label: 'PFMS Tranche Passed' },
];

function generateInitialStreamData(): LiveLinePoint[] {
  const now = Math.floor(Date.now() / 1000);
  const points: LiveLinePoint[] = [];
  for (let i = 35; i >= 0; i--) {
    const t = now - i;
    const base = 74 + Math.sin(t * 0.15) * 8 + (i % 5 === 0 ? 6 : -3);
    points.push({ time: t, value: Math.min(98, Math.max(50, base)) });
  }
  return points;
}

interface InteractiveEntityGraphProps {
  onSelectProject?: (project: MPLADSProject) => void;
  onTriggerSubpoena?: () => void;
}

export const InteractiveEntityGraph: React.FC<InteractiveEntityGraphProps> = ({
  onTriggerSubpoena,
}) => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(NODES[0]);
  const [filterType, setFilterType] = useState<string>('all');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const filteredNodes = NODES.filter((n) => filterType === 'all' || n.type === filterType);

  const getNodeColor = (node: Node) => {
    switch (node.risk) {
      case 'critical':
        return { bg: '#FEE2E2', border: '#EF4444', text: '#991B1B', badge: 'bg-red-600 text-white' };
      case 'high':
        return { bg: '#FFEDD5', border: '#F97316', text: '#9A3412', badge: 'bg-orange-600 text-white' };
      case 'medium':
        return { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E', badge: 'bg-amber-600 text-white' };
      default:
        return { bg: '#F1F0EC', border: '#D5D2C8', text: '#0E0E0E', badge: 'bg-[#0E0E0E] text-white' };
    }
  };

  // ─── Live Streaming Telemetry for Nexus Graph ───────────────
  const [streamData, setStreamData] = useState<LiveLinePoint[]>(generateInitialStreamData);
  const [currentValue, setCurrentValue] = useState<number>(84.6);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const variation = (Math.random() - 0.48) * 3.5;
      const targetBase = selectedNode?.risk === 'critical' ? 88 : selectedNode?.risk === 'high' ? 76 : 64;
      const nextVal = Math.min(99.2, Math.max(45, targetBase + variation + Math.sin(now * 0.4) * 4));
      const rounded = Math.round(nextVal * 10) / 10;

      setCurrentValue(rounded);
      setStreamData((prev) => {
        const next = [...prev, { time: now, value: rounded }];
        return next.length > 50 ? next.slice(-45) : next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, selectedNode]);

  return (
    <div id="interactive-entity-graph" className="bg-[#F1F0EC] rounded-[24px] p-5 sm:p-6 border border-[#E5E3DC] space-y-4 font-sans">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#002449] text-white flex items-center justify-center shadow-2xs">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#002449]">Interactive Contractor Collusion Nexus</h3>
              <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200">
                Active Syndicate Match
              </span>
            </div>
            <p className="text-xs text-[#6B6B6B]">Visualizing cross-entity PAN linkages & cover bid clusters</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-full text-xs border border-[#E5E3DC]">
          {[
            { id: 'all', label: 'All Nodes' },
            { id: 'director', label: 'Key Directors' },
            { id: 'contractor', label: 'Shell Vendors' },
            { id: 'tender', label: 'Flagged Tenders' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                filterType === tab.id
                  ? 'bg-[#002449] text-white font-semibold shadow-2xs'
                  : 'text-[#6B6B6B] hover:text-[#0E0E0E]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full h-[360px] bg-white rounded-2xl border border-[#E5E3DC] overflow-hidden select-none">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#E5E3DC_1px,transparent_1px)] [background-size:16px_16px] opacity-60 pointer-events-none" />

        <svg className="w-full h-full" viewBox="0 0 700 360">
          {/* Edges */}
          {EDGES.map((edge, i) => {
            const src = NODES.find((n) => n.id === edge.source);
            const tgt = NODES.find((n) => n.id === edge.target);
            if (!src || !tgt) return null;

            const isHighlighted =
              hoveredNode === edge.source ||
              hoveredNode === edge.target ||
              (selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target));

            return (
              <g key={i}>
                <line
                  x1={src.x}
                  y1={src.y}
                  x2={tgt.x}
                  y2={tgt.y}
                  stroke={edge.flagged ? (isHighlighted ? '#EF4444' : '#FCA5A5') : '#D5D2C8'}
                  strokeWidth={isHighlighted ? 2.5 : edge.flagged ? 1.75 : 1.25}
                  strokeDasharray={edge.flagged ? '4,4' : undefined}
                />
                {/* Edge Midpoint Label */}
                {isHighlighted && (
                  <text
                    x={(src.x + tgt.x) / 2}
                    y={(src.y + tgt.y) / 2 - 6}
                    fill={edge.flagged ? '#991B1B' : '#6B6B6B'}
                    fontSize="9"
                    fontWeight="600"
                    textAnchor="middle"
                    className="bg-white"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {filteredNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const isHovered = hoveredNode === node.id;
            const colors = getNodeColor(node);

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => setSelectedNode(node)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer transition-transform"
              >
                {/* Outer Glow Ring for selected/hovered */}
                {(isSelected || isHovered) && (
                  <circle r="34" fill={colors.border} opacity="0.18" />
                )}

                {/* Node Body Circle */}
                <circle
                  r={isSelected ? '26' : '22'}
                  fill={colors.bg}
                  stroke={colors.border}
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                />

                {/* Node Icon */}
                <foreignObject
                  x={isSelected ? -12 : -10}
                  y={isSelected ? -12 : -10}
                  width={isSelected ? 24 : 20}
                  height={isSelected ? 24 : 20}
                >
                  <div className="w-full h-full flex items-center justify-center text-xs">
                    {node.type === 'director' && <UserCheck className="w-4 h-4 text-red-700" />}
                    {node.type === 'contractor' && <Building2 className="w-4 h-4 text-orange-700" />}
                    {node.type === 'tender' && <ShieldAlert className="w-4 h-4 text-red-700" />}
                    {node.type === 'agency' && <Link2 className="w-4 h-4 text-gray-700" />}
                  </div>
                </foreignObject>

                {/* Node Text Label */}
                <text
                  y="36"
                  fill="#0E0E0E"
                  fontSize="11"
                  fontWeight={isSelected ? '700' : '600'}
                  textAnchor="middle"
                >
                  {node.label}
                </text>
                <text
                  y="48"
                  fill="#6B6B6B"
                  fontSize="9"
                  textAnchor="middle"
                >
                  {node.sublabel}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Quick Legend */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs p-2 rounded-xl border border-[#E5E3DC] text-[10px] text-[#6B6B6B] flex items-center gap-3 shadow-2xs">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span>High Risk Nexus</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span>Dummy Bid Node</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#002449]" />
            <span>Statutory Body</span>
          </div>
        </div>
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-white rounded-2xl border border-[#E5E3DC] flex flex-wrap items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#002449] text-white uppercase">
                {selectedNode.type}
              </span>
              <span className="text-sm font-bold text-[#0E0E0E]">{selectedNode.label}</span>
              <span className="text-xs text-[#6B6B6B]">({selectedNode.sublabel})</span>
            </div>
            <p className="text-xs text-[#6B6B6B]">
              Associated with 3 interconnected bidding rings across Eastern UP, controlling ₹82.70 Cr in aggregate tenders.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onTriggerSubpoena && (
              <button
                onClick={onTriggerSubpoena}
                className="bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold px-4 py-2 rounded-full cursor-pointer transition-all flex items-center gap-1.5 shadow-2xs"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Issue Section 14 Subpoena</span>
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* ─── LIVE STREAMING NEXUS TELEMETRY CHART (@bklit/live-line-chart) ─── */}
      <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#E5E3DC] shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F1F0EC] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#002449] text-white flex items-center justify-center shadow-2xs">
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-[#002449]">
                  Live Collusion Nexus Bid Proximity & Risk Stream
                </h4>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#15803D]/15 text-[#15803D] border border-[#15803D]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#15803D] animate-pulse" />
                  REAL-TIME 1Hz
                </span>
              </div>
              <p className="text-[11px] text-[#6B6B6B]">
                Streaming MCA-21 subnet frequency & CPPP tender quote clustering telemetry for{' '}
                <strong className="text-[#0E0E0E]">{selectedNode?.label || 'Selected Syndicate'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] font-bold text-[#6B6B6B] block uppercase tracking-wider">Nexus Intensity</span>
              <span className="text-sm font-mono font-bold text-[#002449]">{currentValue.toFixed(1)}%</span>
            </div>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-3 py-1 rounded-full border border-[#E5E3DC] bg-[#F1F0EC] hover:bg-[#EAE8E2] text-xs font-semibold text-[#002449] flex items-center gap-1 cursor-pointer transition-colors"
            >
              {isPaused ? <Play className="w-3 h-3 text-emerald-700" /> : <Pause className="w-3 h-3 text-amber-700" />}
              <span>{isPaused ? 'Resume Stream' : 'Pause'}</span>
            </button>
          </div>
        </div>

        {/* Live Line Chart Component Container */}
        <div className="pt-1">
          <LiveLineChart
            data={streamData}
            value={currentValue}
            dataKey="value"
            window={30}
            numXTicks={5}
            paused={isPaused}
            margin={{ top: 12, right: 16, bottom: 20, left: 32 }}
          >
            <LiveLine
              dataKey="value"
              stroke="#002449"
              strokeWidth={2.5}
              pulse={true}
              badge={true}
              formatValue={(v) => `${v.toFixed(1)}%`}
              momentumColors={{
                up: '#DC2626',
                down: '#15803D',
                flat: '#002449',
              }}
            />
            <LiveXAxis numTicks={5} />
            <LiveYAxis minGap={28} formatValue={(v) => `${Math.round(v)}%`} />
          </LiveLineChart>
        </div>

        {/* Stream Summary Telemetry Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#F1F0EC] text-xs">
          <div className="bg-[#F1F0EC] p-2.5 rounded-xl">
            <span className="text-[10px] text-[#6B6B6B] block">Current Nexus Reading</span>
            <span className="font-bold text-[#002449] font-mono text-xs sm:text-sm">{currentValue.toFixed(1)}%</span>
          </div>
          <div className="bg-[#F1F0EC] p-2.5 rounded-xl">
            <span className="text-[10px] text-[#6B6B6B] block">IP Subnet Match</span>
            <span className="font-bold text-red-600 font-mono text-xs sm:text-sm">99.4% (3 Nodes)</span>
          </div>
          <div className="bg-[#F1F0EC] p-2.5 rounded-xl">
            <span className="text-[10px] text-[#6B6B6B] block">Tender Bid Gap</span>
            <span className="font-bold text-[#0E0E0E] font-mono text-xs sm:text-sm">0.14% (Cover Bid)</span>
          </div>
          <div className="bg-[#F1F0EC] p-2.5 rounded-xl">
            <span className="text-[10px] text-[#6B6B6B] block">Forensic Confidence</span>
            <span className="font-bold text-emerald-700 font-mono text-xs sm:text-sm">High (96.8%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
