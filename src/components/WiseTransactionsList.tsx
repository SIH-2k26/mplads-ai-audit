import React from 'react';
import { MPLADSProject } from '../types';
import { ChevronRight, ShieldAlert, AlertTriangle, Building2, Satellite } from 'lucide-react';

interface WiseTransactionsListProps {
  projects: MPLADSProject[];
  onSelectProject: (project: MPLADSProject) => void;
  onSeeAll: () => void;
}

export const WiseTransactionsList: React.FC<WiseTransactionsListProps> = ({
  projects,
  onSelectProject,
  onSeeAll,
}) => {
  // Display top recent items
  const displayProjects = projects.slice(0, 6);

  const getCategoryBadge = (anomalyCategory: string, riskTier: string) => {
    switch (anomalyCategory) {
      case 'Satellite Mismatch':
        return {
          bg: 'bg-orange-50 border-orange-200 text-orange-700',
          icon: '🛰️',
          short: 'SAR Mismatch',
        };
      case 'Vendor Collusion':
        return {
          bg: 'bg-purple-50 border-purple-200 text-purple-700',
          icon: '🏢',
          short: 'Shell Ring',
        };
      case 'Ghost Milestone':
        return {
          bg: 'bg-red-50 border-red-200 text-red-700',
          icon: '⚠️',
          short: 'Ghost Claim',
        };
      default:
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-700',
          icon: '📋',
          short: 'Cost Gap',
        };
    }
  };

  return (
    <div className="space-y-3 pt-2">
      {/* Header with See All */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#0E0E0E]">Transactions & Flagged Works</h2>
        <button
          onClick={onSeeAll}
          className="text-sm font-medium text-[#0E0E0E] underline hover:text-[#6B6B6B] transition-colors cursor-pointer"
        >
          See all
        </button>
      </div>

      {/* Transactions List */}
      <div className="divide-y divide-[#F1F0EC]">
        {displayProjects.map((project) => {
          const badge = getCategoryBadge(project.anomalyCategory, project.riskTier);
          const isFrozen = project.status === 'Disbursal Frozen';

          return (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="py-3.5 px-2 -mx-2 rounded-2xl hover:bg-[#F1F0EC] transition-colors flex items-center justify-between gap-4 cursor-pointer group"
            >
              {/* Left: Avatar/Logo + Details */}
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Taobao-style Rounded Square Vendor/Category Badge */}
                <div className="w-10 h-10 rounded-xl bg-white border border-[#EAE8E2] flex flex-col items-center justify-center shrink-0 shadow-2xs group-hover:border-[#D4D1C7] transition-colors">
                  <span className="text-sm leading-none">{badge.icon}</span>
                  <span className="text-[7.5px] font-bold text-[#6B6B6B] uppercase tracking-tighter mt-0.5">
                    {project.state.substring(0, 2)}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[#0E0E0E] truncate group-hover:underline">
                      {project.contractorName}
                    </h3>
                    {isFrozen && (
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-red-100 text-red-700">
                        Frozen
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#6B6B6B] truncate mt-0.5">
                    {project.flaggedDate} • {project.constituency} • {project.title}
                  </p>
                </div>
              </div>

              {/* Right: Disbursed Amount / Gap */}
              <div className="text-right shrink-0">
                <span className="text-sm font-semibold text-[#0E0E0E] block">
                  - ₹{project.disbursedAmountCr.toFixed(2)} Cr
                </span>
                <span className="text-xs text-red-600 font-medium block">
                  +{project.discrepancyPercent.toFixed(1)}% Gap
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
