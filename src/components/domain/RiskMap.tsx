import React, { useState } from 'react';
import { MapPin, Layers, Info, Filter, ArrowUpRight } from 'lucide-react';
import { mockDistricts, mockStates } from '../../data/mock-geo';
import { mockProjects } from '../../data/mock-projects';
import { Link } from 'react-router-dom';
import { formatCurrencyINR, getRiskColorClass } from '../../lib/utils';
import { Button } from '../ui/button';

export function RiskMap({
  level = 'DISTRICT',
  className,
}: {
  level?: 'NATIONAL' | 'STATE' | 'DISTRICT';
  className?: string;
}) {
  const [currentLevel, setCurrentLevel] = useState<'NATIONAL' | 'STATE' | 'DISTRICT'>(level);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);

  return (
    <div className={`rounded-[6px] border border-[#D9D5CC] bg-white p-5 shadow-card ${className || ''}`}>
      {/* Map Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EDE8DE] pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-[4px] bg-[#18324A] text-white">
              <MapPin className="h-4 w-4" />
            </div>
            <h4 className="text-xs font-bold text-[#18324A] uppercase tracking-wider">
              {currentLevel === 'NATIONAL'
                ? 'National Risk Heatmap (All-India States)'
                : currentLevel === 'STATE'
                ? 'State Geographic Risk Heatmap (Maharashtra)'
                : 'Constituency & Block Project Map (Pune District)'}
            </h4>
          </div>
          <p className="text-[11px] text-[#667085] mt-0.5">
            Geospatial density of anomalies, delayed milestones, and cost overruns
          </p>
        </div>

        {/* Level Switcher */}
        <div className="inline-flex rounded-[4px] border border-[#D9D5CC] bg-[#EDE8DE]/80 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => {
              setCurrentLevel('NATIONAL');
              setSelectedEntity(null);
            }}
            className={`px-3 py-1 rounded-[3px] font-medium transition-all ${
              currentLevel === 'NATIONAL' ? 'bg-white text-[#18324A] font-bold shadow-subtle' : 'text-[#667085]'
            }`}
          >
            National
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentLevel('STATE');
              setSelectedEntity(null);
            }}
            className={`px-3 py-1 rounded-[3px] font-medium transition-all ${
              currentLevel === 'STATE' ? 'bg-white text-[#18324A] font-bold shadow-subtle' : 'text-[#667085]'
            }`}
          >
            State (MH)
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentLevel('DISTRICT');
              setSelectedEntity(null);
            }}
            className={`px-3 py-1 rounded-[3px] font-medium transition-all ${
              currentLevel === 'DISTRICT' ? 'bg-white text-[#18324A] font-bold shadow-subtle' : 'text-[#667085]'
            }`}
          >
            District (Pune)
          </button>
        </div>
      </div>

      {/* Map Interactive Canvas Visualizer */}
      <div className="relative rounded-[4px] border border-[#D9D5CC] bg-[#FAFAF7] p-6 min-h-[340px] flex flex-col justify-between overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#D9D5CC_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        {/* Interactive Entity Pins / Heatmap Grid */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {currentLevel === 'NATIONAL' &&
            mockStates.map((st) => {
              const riskStyle = getRiskColorClass(st.compositeRiskScore);
              const isSelected = selectedEntity?.id === st.id;

              return (
                <div
                  key={st.id}
                  onClick={() => setSelectedEntity(st)}
                  className={`p-3 rounded-[4px] border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-[#18324A] shadow-card ring-2 ring-[#18324A]'
                      : 'bg-white/90 border-[#D9D5CC] hover:bg-white hover:border-[#98A2B3]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#18324A]">{st.name}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${riskStyle.badgeBg}`}>
                      {st.compositeRiskScore}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#667085] mt-1 space-y-0.5">
                    <div>Projects: <strong>{st.totalProjects}</strong></div>
                    <div>Sanctioned: <strong>{formatCurrencyINR(st.sanctionedAmountRupees, true)}</strong></div>
                    <div>High Risk: <strong className="text-[#B44343]">{st.highRiskCount}</strong></div>
                  </div>
                </div>
              );
            })}

          {currentLevel === 'STATE' &&
            mockDistricts.map((dst) => {
              const riskStyle = getRiskColorClass(dst.compositeRiskScore);
              const isSelected = selectedEntity?.id === dst.id;

              return (
                <div
                  key={dst.id}
                  onClick={() => setSelectedEntity(dst)}
                  className={`p-3 rounded-[4px] border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-[#18324A] shadow-card ring-2 ring-[#18324A]'
                      : 'bg-white/90 border-[#D9D5CC] hover:bg-white hover:border-[#98A2B3]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#18324A]">{dst.name}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${riskStyle.badgeBg}`}>
                      {dst.compositeRiskScore}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#667085] mt-1 space-y-0.5">
                    <div>Utilisation: <strong>{dst.utilisationPercentage}%</strong></div>
                    <div>Cost Anomalies: <strong className="text-[#B7791F]">{dst.costAnomaliesCount}</strong></div>
                    <div>Critical: <strong className="text-[#B44343]">{dst.criticalRiskCount}</strong></div>
                  </div>
                </div>
              );
            })}

          {currentLevel === 'DISTRICT' &&
            mockProjects.map((prj) => {
              const riskStyle = getRiskColorClass(prj.currentRiskScore);
              const isSelected = selectedEntity?.id === prj.id;

              return (
                <div
                  key={prj.id}
                  onClick={() => setSelectedEntity(prj)}
                  className={`p-3 rounded-[4px] border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-[#18324A] shadow-card ring-2 ring-[#18324A]'
                      : 'bg-white/90 border-[#D9D5CC] hover:bg-white hover:border-[#98A2B3]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#18324A] truncate">{prj.location.wardOrVillage}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${riskStyle.badgeBg}`}>
                      {prj.currentRiskScore}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#667085] mt-1 space-y-0.5">
                    <div className="truncate text-[#1D2939] font-medium">{prj.title}</div>
                    <div>Sanctioned: <strong>{formatCurrencyINR(prj.sanctionedAmount)}</strong></div>
                    <div>Sector: <strong>{prj.category}</strong></div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Selected Entity Card Overlay */}
        {selectedEntity && (
          <div className="relative z-20 mt-4 rounded-[4px] border border-[#18324A] bg-white p-4 shadow-elevated flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in-50">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#18324A]">
                  {selectedEntity.name || selectedEntity.title}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EDE8DE] text-[#18324A]">
                  {selectedEntity.code || selectedEntity.district || 'Geographic Node'}
                </span>
              </div>
              <p className="text-[11px] text-[#667085] mt-1">
                {selectedEntity.whyFlagged ? selectedEntity.whyFlagged[0] : `Sanctioned portfolio: ${formatCurrencyINR(selectedEntity.sanctionedAmountRupees || selectedEntity.sanctionedAmount || 0)}`}
              </p>
            </div>

            {selectedEntity.id && selectedEntity.id.startsWith('P-') ? (
              <Link to={`/projects/${selectedEntity.id}`}>
                <Button variant="default" size="sm" className="text-xs flex items-center gap-1">
                  Open Project Digital Twin <ArrowUpRight className="h-3 w-3" />
                </Button>
              </Link>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => {
                  if (currentLevel === 'NATIONAL') setCurrentLevel('STATE');
                  else if (currentLevel === 'STATE') setCurrentLevel('DISTRICT');
                }}
              >
                Drill Down Region →
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#667085] pt-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#2F7658]" /> Low Risk (0–34)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#B7791F]" /> Medium Risk (35–59)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#C98219]" /> High Risk (60–79)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#B44343]" /> Critical (80–100)
          </span>
        </div>
        <span>Click any node to inspect risk indicators & drill down.</span>
      </div>
    </div>
  );
}
