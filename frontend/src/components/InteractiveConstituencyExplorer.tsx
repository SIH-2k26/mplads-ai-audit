import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  Search,
  ShieldAlert,
  Satellite,
  Filter,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Radio,
  Sparkles,
  TrendingUp,
  Activity
} from 'lucide-react';
import { MPLADSProject } from '../types';

interface StateSummary {
  state: string;
  code: string;
  totalSeats: number;
  flaggedWorks: number;
  cleanWorks: number;
  totalSanctionedCr: number;
  flaggedOutlayCr: number;
  reconciledOutlayCr: number;
  riskTier: 'critical' | 'moderate' | 'low';
  radarCoverage: number;
  integrityScore: number;
  coordinates: { x: number; y: number };
}

const STATES_DATA: StateSummary[] = [
  { state: 'Tamil Nadu', code: 'TN', totalSeats: 39, flaggedWorks: 2, cleanWorks: 37, totalSanctionedCr: 390.0, flaggedOutlayCr: 22.8, reconciledOutlayCr: 367.2, riskTier: 'low', radarCoverage: 99.2, integrityScore: 94.8, coordinates: { x: 45, y: 82 } },
  { state: 'Gujarat', code: 'GJ', totalSeats: 26, flaggedWorks: 0, cleanWorks: 26, totalSanctionedCr: 286.0, flaggedOutlayCr: 0.0, reconciledOutlayCr: 286.0, riskTier: 'low', radarCoverage: 97.5, integrityScore: 98.2, coordinates: { x: 22, y: 48 } },
  { state: 'Kerala', code: 'KL', totalSeats: 20, flaggedWorks: 1, cleanWorks: 19, totalSanctionedCr: 220.0, flaggedOutlayCr: 12.0, reconciledOutlayCr: 208.0, riskTier: 'low', radarCoverage: 99.5, integrityScore: 96.4, coordinates: { x: 38, y: 90 } },
  { state: 'Maharashtra', code: 'MH', totalSeats: 48, flaggedWorks: 7, cleanWorks: 41, totalSanctionedCr: 520.0, flaggedOutlayCr: 74.2, reconciledOutlayCr: 445.8, riskTier: 'moderate', radarCoverage: 94.1, integrityScore: 85.7, coordinates: { x: 35, y: 58 } },
  { state: 'Karnataka', code: 'KA', totalSeats: 28, flaggedWorks: 4, cleanWorks: 24, totalSanctionedCr: 320.0, flaggedOutlayCr: 39.5, reconciledOutlayCr: 280.5, riskTier: 'moderate', radarCoverage: 96.0, integrityScore: 88.3, coordinates: { x: 36, y: 72 } },
  { state: 'Rajasthan', code: 'RJ', totalSeats: 25, flaggedWorks: 2, cleanWorks: 23, totalSanctionedCr: 275.0, flaggedOutlayCr: 24.6, reconciledOutlayCr: 250.4, riskTier: 'moderate', radarCoverage: 92.8, integrityScore: 91.0, coordinates: { x: 28, y: 36 } },
  { state: 'Uttar Pradesh', code: 'UP', totalSeats: 80, flaggedWorks: 12, cleanWorks: 68, totalSanctionedCr: 840.0, flaggedOutlayCr: 112.4, reconciledOutlayCr: 727.6, riskTier: 'critical', radarCoverage: 98.4, integrityScore: 78.5, coordinates: { x: 50, y: 38 } },
  { state: 'West Bengal', code: 'WB', totalSeats: 42, flaggedWorks: 6, cleanWorks: 36, totalSanctionedCr: 450.0, flaggedOutlayCr: 68.0, reconciledOutlayCr: 382.0, riskTier: 'critical', radarCoverage: 91.5, integrityScore: 82.1, coordinates: { x: 74, y: 46 } },
  { state: 'Bihar', code: 'BR', totalSeats: 40, flaggedWorks: 5, cleanWorks: 35, totalSanctionedCr: 410.0, flaggedOutlayCr: 54.1, reconciledOutlayCr: 355.9, riskTier: 'critical', radarCoverage: 89.2, integrityScore: 80.4, coordinates: { x: 64, y: 40 } },
];

interface InteractiveConstituencyExplorerProps {
  onSelectState?: (stateName: string) => void;
  onSelectProject?: (project: MPLADSProject) => void;
}

export const InteractiveConstituencyExplorer: React.FC<InteractiveConstituencyExplorerProps> = ({
  onSelectState,
  onSelectProject,
}) => {
  const [selectedState, setSelectedState] = useState<StateSummary>(STATES_DATA[0]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterRisk, setFilterRisk] = useState<string>('all');

  const filteredStates = STATES_DATA.filter((s) => {
    const matchesSearch = s.state.toLowerCase().includes(searchTerm.toLowerCase()) || s.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = filterRisk === 'all' || s.riskTier === filterRisk;
    return matchesSearch && matchesRisk;
  });

  return (
    <div id="interactive-constituency-explorer" className="space-y-6 select-none font-sans">
      {/* ─── 1. Green Telemetry Header Banner ─────────────────────────────── */}
      <div className="p-5 rounded-[24px] bg-gradient-to-r from-[#ECFDF5] via-[#F0FDF4] to-[#F7FEE7] border border-[#A7F3D0] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#16A34A] text-white flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#064E3B]">3,724 Clean Works Reconciled</h2>
              <span className="bg-[#10B981] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                74.5% High Integrity
              </span>
            </div>
            <p className="text-xs text-[#047857] font-medium mt-0.5">
              ISRO Cartosat-3 Optical & SAR Radar Verified • ₹1,626.6 Cr Verified Clean Outlay
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-[#064E3B]">
          <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-[#6EE7B7]">
            <Radio className="w-3.5 h-3.5 text-[#16A34A] animate-pulse" />
            <span>98.6% Radar Mesh Health</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-[#6EE7B7]">
            <TrendingUp className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Avg Integrity: 88.6/100</span>
          </div>
        </div>
      </div>

      {/* ─── 2. Top Search & Filter Bar ──────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search state or constituency..."
              className="w-full bg-[#F1F0EC] border border-[#E5E3DC] rounded-full pl-9 pr-4 py-2 text-xs text-[#0E0E0E] placeholder-[#9E9E9E] focus:outline-hidden focus:border-[#16A34A]"
            />
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 bg-[#F1F0EC] p-1 rounded-full text-xs">
          {[
            { id: 'all', label: 'All Regions' },
            { id: 'low', label: '🌿 High Integrity (Green)' },
            { id: 'moderate', label: 'Moderate' },
            { id: 'critical', label: 'Critical Risk' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterRisk(tab.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                filterRisk === tab.id
                  ? 'bg-[#16A34A] text-white shadow-xs'
                  : 'text-[#6B6B6B] hover:text-[#0E0E0E]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── 3. Main Interactive Grid ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: State Cards Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredStates.map((st) => {
            const isSelected = selectedState.code === st.code;
            const isLowRisk = st.riskTier === 'low';
            return (
              <motion.div
                key={st.code}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => setSelectedState(st)}
                className={`p-4 rounded-[20px] border transition-all cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden ${
                  isSelected
                    ? 'bg-white border-[#16A34A] shadow-md ring-2 ring-[#16A34A]/40'
                    : isLowRisk
                    ? 'bg-[#F0FDF4] border-[#BBF7D0] hover:border-[#86EFAC]'
                    : 'bg-[#F1F0EC] border-[#E5E3DC] hover:border-[#D5D2C8]'
                }`}
              >
                {/* Top Green Accent for High Integrity */}
                {isLowRisk && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#16A34A] to-[#22C55E]" />
                )}

                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-[#0E0E0E]">{st.state}</h4>
                      {isLowRisk && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#6B6B6B]">{st.totalSeats} Lok Sabha Seats</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      st.riskTier === 'critical'
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : st.riskTier === 'moderate'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] font-bold'
                    }`}
                  >
                    {st.riskTier === 'low' ? 'VERIFIED GREEN' : st.riskTier.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#6B6B6B]">
                    <span>Verified Clean Outlay:</span>
                    <strong className="text-[#16A34A] font-bold">
                      ₹{st.reconciledOutlayCr.toFixed(1)} Cr ({((st.cleanWorks / st.totalSeats) * 100).toFixed(0)}%)
                    </strong>
                  </div>
                  <div className="flex justify-between text-[#6B6B6B]">
                    <span>Integrity Score:</span>
                    <strong className={isLowRisk ? 'text-[#16A34A]' : 'text-[#0E0E0E]'}>
                      {st.integrityScore} / 100
                    </strong>
                  </div>
                </div>

                {/* Green Progress Bar */}
                <div>
                  <div className="flex justify-between text-[10px] text-[#6B6B6B] mb-1">
                    <span>ISRO Telemetry Pass:</span>
                    <span className="font-semibold text-[#16A34A]">{st.radarCoverage}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#E5E3DC] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#16A34A] to-[#4ADE80] rounded-full"
                      style={{ width: `${st.radarCoverage}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right: Selected State Deep-Dive & GIS Radar Canvas */}
        <div className="lg:col-span-5 bg-[#F0FDF4] rounded-[24px] p-6 border border-[#BBF7D0] flex flex-col justify-between space-y-6 shadow-sm">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#16A34A] text-white flex items-center justify-center text-xs font-extrabold shadow-2xs">
                  {selectedState.code}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#064E3B]">{selectedState.state} Region</h3>
                  <span className="text-[11px] text-[#047857] font-medium">State Nodal Vigilance Directorate</span>
                </div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                selectedState.riskTier === 'low'
                  ? 'bg-white text-[#16A34A] border-[#86EFAC]'
                  : 'bg-white text-red-600 border-red-200'
              }`}>
                {selectedState.flaggedWorks} Flagged • {selectedState.cleanWorks} Reconciled
              </span>
            </div>

            {/* Interactive Radar GIS Simulation Map Container */}
            <div className="relative w-full h-40 bg-[#064E3B] rounded-2xl overflow-hidden border border-[#047857] flex items-center justify-center">
              {/* Radar Grid Circles */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-32 h-32 rounded-full border border-emerald-300" />
                <div className="w-20 h-20 rounded-full border border-emerald-300 absolute" />
                <div className="w-8 h-8 rounded-full border border-emerald-300 absolute" />
                <div className="w-full h-px bg-emerald-300 absolute" />
                <div className="h-full w-px bg-emerald-300 absolute" />
              </div>

              {/* Scanning Beam */}
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-transparent to-transparent animate-spin origin-center pointer-events-none" style={{ animationDuration: '6s' }} />

              {/* Geo Coordinate Markers */}
              <div className="relative z-10 text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono">
                  <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-ping" />
                  <span>GPS RADAR PASS • {selectedState.code}-ACTIVE</span>
                </div>
                <div className="text-[11px] text-emerald-200/80 font-mono">
                  Telemetry Latency: 14ms • SAR Integrity {selectedState.integrityScore}%
                </div>
              </div>
            </div>

            {/* Financial Reconciliation Card */}
            <div className="bg-white p-4 rounded-2xl border border-[#A7F3D0] space-y-2">
              <span className="text-xs text-[#064E3B] font-semibold">Total Verified Capital Outlay</span>
              <div className="text-2xl font-extrabold text-[#064E3B]">
                ₹{selectedState.reconciledOutlayCr.toFixed(2)} Cr
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-[#ECFDF5]">
                <span className="text-[#047857]">Total Sanctioned:</span>
                <span className="font-bold text-[#064E3B]">₹{selectedState.totalSanctionedCr.toFixed(2)} Cr</span>
              </div>
            </div>

            {/* Live ISRO Telemetry Status */}
            <div className="bg-white p-4 rounded-2xl border border-[#A7F3D0] space-y-1.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-[#064E3B]">
                <Satellite className="w-4 h-4 text-[#16A34A]" />
                <span>ISRO Cartosat-3 Automated Optical Mesh</span>
              </div>
              <p className="text-[#047857] leading-relaxed text-[11px]">
                Ground volumetric validation passes scheduled every 14 days over high-density civil works across {selectedState.state}.
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectState && onSelectState(selectedState.state)}
            className="w-full py-3 rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
          >
            <span>Explore {selectedState.state} Constituency Works</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
