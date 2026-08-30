import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Search,
  CheckCircle2,
  ChevronRight,
  Radio,
  TrendingUp,
  Satellite,
  ShieldCheck,
  Building2,
} from 'lucide-react';

interface StateSummary {
  code: string;
  state: string;
  totalSeats: number;
  cleanWorks: number;
  flaggedWorks: number;
  reconciledOutlayCr: number;
  totalSanctionedCr: number;
  radarCoverage: number;
  integrityScore: number;
  riskTier: 'low' | 'moderate' | 'critical';
}

const STATES_DATA: StateSummary[] = [
  {
    code: 'MH',
    state: 'Maharashtra',
    totalSeats: 48,
    cleanWorks: 1240,
    flaggedWorks: 84,
    reconciledOutlayCr: 412.5,
    totalSanctionedCr: 480.0,
    radarCoverage: 98.4,
    integrityScore: 91.2,
    riskTier: 'low',
  },
  {
    code: 'UP',
    state: 'Uttar Pradesh',
    totalSeats: 80,
    cleanWorks: 1840,
    flaggedWorks: 210,
    reconciledOutlayCr: 640.8,
    totalSanctionedCr: 800.0,
    radarCoverage: 94.1,
    integrityScore: 82.5,
    riskTier: 'moderate',
  },
  {
    code: 'KA',
    state: 'Karnataka',
    totalSeats: 28,
    cleanWorks: 820,
    flaggedWorks: 42,
    reconciledOutlayCr: 255.4,
    totalSanctionedCr: 280.0,
    radarCoverage: 99.1,
    integrityScore: 94.8,
    riskTier: 'low',
  },
  {
    code: 'TN',
    state: 'Tamil Nadu',
    totalSeats: 39,
    cleanWorks: 940,
    flaggedWorks: 55,
    reconciledOutlayCr: 345.0,
    totalSanctionedCr: 390.0,
    radarCoverage: 97.6,
    integrityScore: 93.1,
    riskTier: 'low',
  },
  {
    code: 'WB',
    state: 'West Bengal',
    totalSeats: 42,
    cleanWorks: 710,
    flaggedWorks: 145,
    reconciledOutlayCr: 260.2,
    totalSanctionedCr: 420.0,
    radarCoverage: 89.4,
    integrityScore: 71.4,
    riskTier: 'critical',
  },
  {
    code: 'GJ',
    state: 'Gujarat',
    totalSeats: 26,
    cleanWorks: 780,
    flaggedWorks: 31,
    reconciledOutlayCr: 242.0,
    totalSanctionedCr: 260.0,
    radarCoverage: 99.4,
    integrityScore: 96.0,
    riskTier: 'low',
  },
  {
    code: 'RJ',
    state: 'Rajasthan',
    totalSeats: 25,
    cleanWorks: 610,
    flaggedWorks: 88,
    reconciledOutlayCr: 198.5,
    totalSanctionedCr: 250.0,
    radarCoverage: 92.8,
    integrityScore: 84.1,
    riskTier: 'moderate',
  },
  {
    code: 'MP',
    state: 'Madhya Pradesh',
    totalSeats: 29,
    cleanWorks: 690,
    flaggedWorks: 94,
    reconciledOutlayCr: 220.1,
    totalSanctionedCr: 290.0,
    radarCoverage: 91.5,
    integrityScore: 83.2,
    riskTier: 'moderate',
  },
];

interface Props {
  onSelectState?: (stateName: string) => void;
}

export const InteractiveConstituencyExplorer: React.FC<Props> = ({ onSelectState }) => {
  const [selectedState, setSelectedState] = useState<StateSummary>(STATES_DATA[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('all');

  const filteredStates = STATES_DATA.filter((st) => {
    const matchesSearch =
      st.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = filterRisk === 'all' || st.riskTier === filterRisk;
    return matchesSearch && matchesRisk;
  });

  return (
    <div id="interactive-constituency-explorer" className="space-y-6 select-none font-sans">
      {/* ─── 1. Institutional Telemetry Header Banner ─────────────────────────────── */}
      <div className="p-5 rounded-[20px] bg-[#F1F0EC] border border-[#E5E3DC] shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-[#002449] text-white flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-[#0E0E0E]">3,724 Clean Works Reconciled</h2>
              <span className="bg-[#15803D]/10 text-[#15803D] border border-[#15803D]/20 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                74.5% High Integrity
              </span>
            </div>
            <p className="text-xs text-[#6B6B6B] font-normal mt-0.5">
              ISRO Cartosat-3 Optical & SAR Radar Verified • ₹1,626.6 Cr Verified Clean Outlay
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold text-[#0E0E0E]">
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-[#E5E3DC] shadow-2xs">
            <Radio className="w-3.5 h-3.5 text-[#15803D] animate-pulse" />
            <span className="text-[11px] font-mono">98.6% Radar Mesh</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-[#E5E3DC] shadow-2xs">
            <TrendingUp className="w-3.5 h-3.5 text-[#002449]" />
            <span className="text-[11px] font-mono">Avg Score: 88.6/100</span>
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
              className="w-full bg-[#F1F0EC] border border-[#E5E3DC] rounded-full pl-9 pr-4 py-2 text-xs text-[#0E0E0E] placeholder-[#6B6B6B] focus:outline-hidden focus:border-[#002449] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1 bg-[#F1F0EC] p-1 rounded-full text-xs border border-[#E5E3DC]">
          {[
            { id: 'all', label: 'All Regions' },
            { id: 'low', label: 'High Integrity' },
            { id: 'moderate', label: 'Moderate' },
            { id: 'critical', label: 'Critical Risk' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterRisk(tab.id)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                filterRisk === tab.id
                  ? 'bg-[#002449] text-white shadow-xs'
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
            return (
              <motion.div
                key={st.code}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedState(st)}
                className={`p-4 rounded-[20px] border transition-all cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden ${
                  isSelected
                    ? 'bg-white border-[#002449] shadow-md ring-2 ring-[#002449]/15'
                    : 'bg-[#F1F0EC] border-[#E5E3DC] hover:border-[#002449]/40 hover:bg-white shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-[#0E0E0E]">{st.state}</h4>
                      {st.riskTier === 'low' && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#6B6B6B] mt-0.5">{st.totalSeats} Lok Sabha Seats</p>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                      st.riskTier === 'critical'
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : st.riskTier === 'moderate'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-[#15803D]/10 text-[#15803D] border border-[#15803D]/20'
                    }`}
                  >
                    {st.riskTier === 'low' ? 'ON TRACK' : st.riskTier.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#6B6B6B]">
                    <span>Verified Outlay:</span>
                    <strong className="text-[#0E0E0E] font-bold font-mono">
                      ₹{st.reconciledOutlayCr.toFixed(1)} Cr ({((st.cleanWorks / (st.cleanWorks + st.flaggedWorks)) * 100).toFixed(0)}%)
                    </strong>
                  </div>
                  <div className="flex justify-between text-[#6B6B6B]">
                    <span>Integrity Score:</span>
                    <strong className="text-[#002449] font-bold font-mono">
                      {st.integrityScore} / 100
                    </strong>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-[10px] text-[#6B6B6B] mb-1 font-mono">
                    <span>ISRO Telemetry Pass:</span>
                    <span className="font-semibold text-[#002449]">{st.radarCoverage}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#E5E3DC] overflow-hidden">
                    <div
                      className="h-full bg-[#002449] rounded-full"
                      style={{ width: `${st.radarCoverage}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right: Selected State Deep-Dive & GIS Radar Canvas */}
        <div className="lg:col-span-5 bg-[#F1F0EC] rounded-[20px] p-6 border border-[#E5E3DC] flex flex-col justify-between space-y-6 shadow-sm">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#002449] text-white flex items-center justify-center text-xs font-extrabold shadow-xs">
                  {selectedState.code}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0E0E0E]">{selectedState.state} Region</h3>
                  <span className="text-[11px] text-[#6B6B6B] font-medium">State Nodal Vigilance Directorate</span>
                </div>
              </div>
              <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${
                selectedState.riskTier === 'low'
                  ? 'bg-white text-[#15803D] border-[#E5E3DC]'
                  : 'bg-white text-red-600 border-red-200'
              }`}>
                {selectedState.flaggedWorks} Flagged • {selectedState.cleanWorks} Reconciled
              </span>
            </div>

            {/* Interactive Radar GIS Simulation Map Container */}
            <div className="relative w-full h-40 bg-[#002449] rounded-[16px] overflow-hidden border border-[#001B36] flex items-center justify-center">
              {/* Radar Grid Circles */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-32 h-32 rounded-full border border-white" />
                <div className="w-20 h-20 rounded-full border border-white absolute" />
                <div className="w-8 h-8 rounded-full border border-white absolute" />
                <div className="w-full h-px bg-white absolute" />
                <div className="h-full w-px bg-white absolute" />
              </div>

              {/* Scanning Beam */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent animate-spin origin-center pointer-events-none" style={{ animationDuration: '6s' }} />

              {/* Geo Coordinate Markers */}
              <div className="relative z-10 text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/20 text-white text-[11px] font-mono">
                  <span className="w-2 h-2 rounded-full bg-[#15803D] animate-ping" />
                  <span>GPS RADAR PASS • {selectedState.code}-ACTIVE</span>
                </div>
                <div className="text-[11px] text-gray-300 font-mono">
                  Telemetry Latency: 14ms • SAR Integrity {selectedState.integrityScore}%
                </div>
              </div>
            </div>

            {/* Financial Reconciliation Card */}
            <div className="bg-white p-4 rounded-[16px] border border-[#E5E3DC] space-y-2 shadow-2xs">
              <span className="text-xs text-[#6B6B6B] font-medium font-sans">Total Verified Capital Outlay</span>
              <div className="text-2xl font-extrabold text-[#002449] font-mono">
                ₹{selectedState.reconciledOutlayCr.toFixed(2)} Cr
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-[#F1F0EC] font-mono">
                <span className="text-[#6B6B6B]">Total Sanctioned:</span>
                <span className="font-bold text-[#0E0E0E]">₹{selectedState.totalSanctionedCr.toFixed(2)} Cr</span>
              </div>
            </div>

            {/* Live ISRO Telemetry Status */}
            <div className="bg-white p-4 rounded-[16px] border border-[#E5E3DC] space-y-1.5 text-xs shadow-2xs">
              <div className="flex items-center gap-2 font-bold text-[#0E0E0E]">
                <Satellite className="w-4 h-4 text-[#002449]" />
                <span>ISRO Cartosat-3 Automated Optical Mesh</span>
              </div>
              <p className="text-[#6B6B6B] leading-relaxed text-[11px]">
                Ground volumetric validation passes scheduled every 14 days over high-density civil works across {selectedState.state}.
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectState && onSelectState(selectedState.state)}
            className="w-full py-3 rounded-full bg-[#002449] hover:bg-[#001B36] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
          >
            <span>Explore {selectedState.state} Constituency Works</span>
            <ChevronRight className="w-4 h-4 text-white/70" />
          </button>
        </div>
      </div>
    </div>
  );
};
