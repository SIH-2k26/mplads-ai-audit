import React, { useState } from 'react';
import { MPLADSProject } from '../types';
import {
  Search,
  Filter,
  ArrowUpDown,
  Lock,
  Unlock,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

interface FlaggedProjectsTableProps {
  projects: MPLADSProject[];
  onSelectProject: (project: MPLADSProject) => void;
  selectedRiskFilter?: string;
  onClearRiskFilter?: () => void;
}

export const FlaggedProjectsTable: React.FC<FlaggedProjectsTableProps> = ({
  projects,
  onSelectProject,
  selectedRiskFilter,
  onClearRiskFilter,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'discrepancy' | 'amount' | 'trust'>('discrepancy');

  const categories = ['ALL', 'Satellite Mismatch', 'Vendor Collusion', 'Ghost Milestone'];

  const filteredProjects = projects.filter((p) => {
    if (selectedCategory !== 'ALL' && p.anomalyCategory !== selectedCategory) {
      return false;
    }
    return true;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'discrepancy') return b.discrepancyPercent - a.discrepancyPercent;
    if (sortBy === 'amount') return b.disbursedAmountCr - a.disbursedAmountCr;
    if (sortBy === 'trust') return a.trustScore - b.trustScore;
    return 0;
  });

  return (
    <div className="space-y-4">
      {/* Table Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#0E0E0E] text-white font-semibold'
                  : 'bg-[#F1F0EC] text-[#0E0E0E] hover:bg-[#EAE8E2]'
              }`}
            >
              {cat === 'ALL' ? 'All categories' : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#F1F0EC] text-[#0E0E0E] font-medium text-xs rounded-full px-3 py-1.5 outline-none cursor-pointer"
          >
            <option value="discrepancy">Discrepancy Gap</option>
            <option value="amount">Disbursed Amount</option>
            <option value="trust">Trust Score</option>
          </select>
        </div>
      </div>

      {/* Projects List Rows (Wise Style) */}
      <div className="divide-y divide-[#F1F0EC]">
        {sortedProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => onSelectProject(project)}
            className="py-4 px-3 -mx-3 rounded-2xl hover:bg-[#F1F0EC] transition-colors flex items-center justify-between gap-4 cursor-pointer group"
          >
            {/* Left Info */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-white border border-[#EAE8E2] flex items-center justify-center shrink-0 text-base shadow-2xs">
                {project.anomalyCategory === 'Satellite Mismatch' ? '🛰️' : '🏢'}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#6B6B6B]">
                    {project.code}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                    {project.riskTier} risk
                  </span>
                  {project.status === 'Disbursal Frozen' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0E0E0E] text-white">
                      Disbursal Frozen
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-semibold text-[#0E0E0E] truncate group-hover:underline mt-0.5">
                  {project.title}
                </h3>

                <p className="text-xs text-[#6B6B6B] truncate mt-0.5">
                  {project.contractorName} • {project.constituency}, {project.state}
                </p>
              </div>
            </div>

            {/* Right Amounts & Chevron */}
            <div className="flex items-center gap-4 shrink-0 text-right">
              <div>
                <span className="text-sm font-semibold text-[#0E0E0E] block">
                  ₹{project.disbursedAmountCr.toFixed(2)} Cr
                </span>
                <span className="text-xs text-red-600 font-medium block">
                  +{project.discrepancyPercent.toFixed(1)}% Gap
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#6B6B6B] group-hover:text-[#0E0E0E]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
