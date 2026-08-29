import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Search, ShieldAlert, Satellite, Filter, ArrowUpRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { MPLADSProject } from '../types';

interface StateSummary {
  state: string;
  code: string;
  totalSeats: number;
  flaggedWorks: number;
  totalSanctionedCr: number;
  flaggedOutlayCr: number;
  riskTier: 'critical' | 'moderate' | 'low';
  radarCoverage: number;
}

const STATES_DATA: StateSummary[] = [
  { state: 'Uttar Pradesh', code: 'UP', totalSeats: 80, flaggedWorks: 12, totalSanctionedCr: 840.0, flaggedOutlayCr: 112.4, riskTier: 'critical', radarCoverage: 98.4 },
  { state: 'Maharashtra', code: 'MH', totalSeats: 48, flaggedWorks: 7, totalSanctionedCr: 520.0, flaggedOutlayCr: 74.2, riskTier: 'moderate', radarCoverage: 94.1 },
  { state: 'West Bengal', code: 'WB', totalSeats: 42, flaggedWorks: 6, totalSanctionedCr: 450.0, flaggedOutlayCr: 68.0, riskTier: 'critical', radarCoverage: 91.5 },
  { state: 'Bihar', code: 'BR', totalSeats: 40, flaggedWorks: 5, totalSanctionedCr: 410.0, flaggedOutlayCr: 54.1, riskTier: 'critical', radarCoverage: 89.2 },
  { state: 'Karnataka', code: 'KA', totalSeats: 28, flaggedWorks: 4, totalSanctionedCr: 320.0, flaggedOutlayCr: 39.5, riskTier: 'moderate', radarCoverage: 96.0 },
  { state: 'Tamil Nadu', code: 'TN', totalSeats: 39, flaggedWorks: 2, totalSanctionedCr: 390.0, flaggedOutlayCr: 22.8, riskTier: 'low', radarCoverage: 99.2 },
  { state: 'Rajasthan', code: 'RJ', totalSeats: 25, flaggedWorks: 2, totalSanctionedCr: 275.0, flaggedOutlayCr: 24.6, riskTier: 'moderate', radarCoverage: 92.8 },
  { state: 'Gujarat', code: 'GJ', totalSeats: 26, flaggedWorks: 0, totalSanctionedCr: 286.0, flaggedOutlayCr: 0.0, riskTier: 'low', radarCoverage: 97.5 },
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
    const matchesSearch = s.state.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = filterRisk === 'all' || s.riskTier === filterRisk;
    return matchesSearch && matchesRisk;
  });

  return (
    <div id="interactive-constituency-explorer" className="space-y-6">
      {/* Top Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search state or constituency..."
              className="w-full bg-[#F1F0EC] border border-[#E5E3DC] rounded-full pl-9 pr-4 py-2 text-xs text-[#0E0E0E] placeholder-[#9E9E9E] focus:outline-hidden focus:border-[#0E0E0E]"
            />
          </div>
        </div>

        {/* Risk Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-[#F1F0EC] p-1 rounded-full text-xs">
          {[
            { id: 'all', label: 'All Regions' },
            { id: 'critical', label: 'Critical Risk' },
            { id: 'moderate', label: 'Moderate' },
            { id: 'low', label: 'High Integrity' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterRisk(tab.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                filterRisk === tab.id
                  ? 'bg-[#0E0E0E] text-white font-semibold'
                  : 'text-[#6B6B6B] hover:text-[#0E0E0E]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: State Cards + Detail Visualizer */}
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
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-white border-[#0E0E0E] shadow-sm ring-1 ring-[#0E0E0E]'
                    : 'bg-[#F1F0EC] border-[#E5E3DC] hover:border-[#D5D2C8]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#0E0E0E]">{st.state}</h4>
                    <p className="text-[11px] text-[#6B6B6B]">{st.totalSeats} Lok Sabha Seats</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      st.riskTier === 'critical'
                        ? 'bg-red-100 text-red-700'
                        : st.riskTier === 'moderate'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {st.riskTier.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#6B6B6B]">
                    <span>Flagged Works:</span>
                    <strong className="text-[#0E0E0E]">{st.flaggedWorks} projects</strong>
                  </div>
                  <div className="flex justify-between text-[#6B6B6B]">
                    <span>Flagged Outlay:</span>
                    <strong className={st.flaggedOutlayCr > 0 ? 'text-red-600' : 'text-emerald-700'}>
                      ₹{st.flaggedOutlayCr.toFixed(1)} Cr
                    </strong>
                  </div>
                </div>

                {/* Radar Progress Bar */}
                <div>
                  <div className="flex justify-between text-[10px] text-[#6B6B6B] mb-1">
                    <span>ISRO SAR Radar Mesh:</span>
                    <span className="font-semibold text-[#0E0E0E]">{st.radarCoverage}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-black/5 overflow-hidden">
                    <div
                      className="h-full bg-[#9FE870] rounded-full"
                      style={{ width: `${st.radarCoverage}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right: Selected State Deep-Dive Dossier */}
        <div className="lg:col-span-5 bg-[#F1F0EC] rounded-[24px] p-6 border border-[#E5E3DC] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#0E0E0E] text-white flex items-center justify-center text-xs font-bold">
                  {selectedState.code}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0E0E0E]">{selectedState.state} Region</h3>
                  <span className="text-[11px] text-[#6B6B6B]">Zilla Parishad Vigilance Dashboard</span>
                </div>
              </div>
              <span className="text-xs font-bold text-red-600 bg-white px-2.5 py-1 rounded-full border border-red-200">
                {selectedState.flaggedWorks} Flagged
              </span>
            </div>

            {/* Outlay Metric Card */}
            <div className="bg-white p-4 rounded-2xl border border-[#E5E3DC] space-y-2">
              <span className="text-xs text-[#6B6B6B]">Total Sanctioned Capital Outlay</span>
              <div className="text-2xl font-bold text-[#0E0E0E]">
                ₹{selectedState.totalSanctionedCr.toFixed(2)} Cr
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-[#F1F0EC]">
                <span className="text-[#6B6B6B]">At Risk Divergence:</span>
                <span className="font-bold text-red-600">₹{selectedState.flaggedOutlayCr.toFixed(2)} Cr</span>
              </div>
            </div>

            {/* Live ISRO Telemetry Status */}
            <div className="bg-white p-4 rounded-2xl border border-[#E5E3DC] space-y-2 text-xs">
              <div className="flex items-center gap-2 font-semibold text-[#0E0E0E]">
                <Satellite className="w-4 h-4 text-emerald-600" />
                <span>ISRO Cartosat-3 Active Mesh</span>
              </div>
              <p className="text-[#6B6B6B] leading-relaxed text-[11px]">
                Ground volumetric passes scheduled every 14 days over high-density rural works across {selectedState.state}.
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectState && onSelectState(selectedState.state)}
            className="w-full py-3 rounded-full bg-[#0E0E0E] text-white text-xs font-semibold hover:bg-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <span>View {selectedState.state} Flagged Projects</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
