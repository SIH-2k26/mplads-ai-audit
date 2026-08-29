import React, { useState } from 'react';
import {
  Home,
  ShieldAlert,
  Network,
  Search,
  MapPin,
  BarChart2,
  Sliders,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  flaggedCount?: number;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  flaggedCount = 38,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const [investigationExpanded, setInvestigationExpanded] = useState<boolean>(true);

  // Top Nav Items strictly matching user specification:
  // - Home -> Overview (same home icon)
  // - Cards -> Flagged Projects (shield-alert icon with black rounded badge)
  // - Transactions -> Entity Analytics (network icon, no badge)
  const topNavItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    {
      id: 'flagged-projects',
      label: 'Flagged Projects',
      icon: ShieldAlert,
      badge: flaggedCount,
    },
    {
      id: 'entity-analytics',
      label: 'Entity Analytics',
      icon: Network,
    },
  ];

  // Investigation Sub-items:
  // - Case Briefs
  // - Early Warnings
  // - Risk Fingerprint
  // - SHAP Explainability
  const investigationSubItems = [
    { id: 'case-briefs', label: 'Case Briefs' },
    { id: 'early-warnings', label: 'Early Warnings' },
    { id: 'risk-fingerprint', label: 'Risk Fingerprint' },
    { id: 'shap-explainability', label: 'SHAP Explainability' },
  ];

  // Bottom Nav Items:
  // - Recipients -> Constituency Map (map-pin icon)
  // - Insights -> Leaderboard (bar-chart icon)
  // - Simulation Sandbox (sliders icon)
  const bottomNavItems = [
    { id: 'constituency-map', label: 'Constituency Map', icon: MapPin },
    { id: 'leaderboard', label: 'Leaderboard', icon: BarChart2 },
    { id: 'simulation-sandbox', label: 'Simulation Sandbox', icon: Sliders },
  ];

  const handleNavClick = (id: string) => {
    onSelectView(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const isInvestigationActive = investigationSubItems.some(
    (item) => item.id === currentView
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        id="sidebar-wise"
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 w-64 bg-white flex flex-col justify-between py-6 px-4 transition-transform duration-200 border-r border-[#F1F0EC] lg:border-none select-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Section */}
        <div className="space-y-6">
          {/* Logo / Header */}
          <div className="flex items-center justify-between px-2 pt-1 pb-2">
            <button
              onClick={() => handleNavClick('overview')}
              className="flex items-center gap-2 text-left group cursor-pointer focus:outline-none"
            >
              {/* Geometric Wise-style Flag/Lightning Symbol */}
              <div className="w-8 h-8 flex items-center justify-center text-[#0E0E0E]">
                <svg
                  viewBox="0 0 24 24"
                  className="w-7 h-7 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4 3h16l-7 18h-4l3-8H5l3-10z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-[#0E0E0E] lowercase leading-none">
                  sentinel
                </span>
                <span className="text-[10px] text-[#6B6B6B] font-medium tracking-wide uppercase mt-0.5">
                  MPLADS • MoSPI
                </span>
              </div>
            </button>

            {/* Mobile Close */}
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-full text-[#6B6B6B] hover:text-[#0E0E0E] hover:bg-[#F1F0EC] lg:hidden cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Items (Exact Wise Spacing, Typography & Pill Active States) */}
          <nav className="space-y-1">
            {/* 1. Top Level Items: Overview, Flagged Projects (badge), Entity Analytics */}
            {topNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-sm font-medium transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#EAE8E2] text-[#0E0E0E] font-semibold'
                      : 'text-[#0E0E0E] hover:bg-[#F1F0EC] hover:text-[#0E0E0E]'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <Icon className="w-5 h-5 stroke-[1.75] shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="min-w-[24px] h-6 px-1.5 rounded-full bg-[#0E0E0E] text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* 2. Expandable Group: Investigation */}
            <div className="pt-0.5">
              <button
                onClick={() => setInvestigationExpanded(!investigationExpanded)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-sm font-medium transition-all text-left cursor-pointer ${
                  isInvestigationActive && !investigationExpanded
                    ? 'bg-[#EAE8E2] text-[#0E0E0E] font-semibold'
                    : 'text-[#0E0E0E] hover:bg-[#F1F0EC]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Search className="w-5 h-5 stroke-[1.75]" />
                  <span>Investigation</span>
                </div>
                {investigationExpanded ? (
                  <ChevronUp className="w-4 h-4 text-[#6B6B6B]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#6B6B6B]" />
                )}
              </button>

              {/* Sub-items (Indented exactly like Wise screenshot) */}
              {investigationExpanded && (
                <div className="pl-12 pr-2 py-1 space-y-1 transition-all">
                  {investigationSubItems.map((sub) => {
                    const isSubActive = currentView === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => handleNavClick(sub.id)}
                        className={`w-full text-left py-2 px-3 rounded-full text-sm transition-colors block cursor-pointer ${
                          isSubActive
                            ? 'text-[#0E0E0E] font-semibold bg-[#EAE8E2]'
                            : 'text-[#6B6B6B] hover:text-[#0E0E0E] hover:bg-[#F1F0EC]'
                        }`}
                      >
                        {sub.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Bottom Nav Items: Constituency Map, Leaderboard, Simulation Sandbox */}
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-sm font-medium transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#EAE8E2] text-[#0E0E0E] font-semibold'
                      : 'text-[#0E0E0E] hover:bg-[#F1F0EC] hover:text-[#0E0E0E]'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <Icon className="w-5 h-5 stroke-[1.75] shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info in sidebar */}
        <div className="px-3 pt-4 border-t border-[#F1F0EC] text-xs text-[#6B6B6B] flex items-center justify-between">
          <span>SANCHAY v3.0</span>
          <span className="w-2 h-2 rounded-full bg-[#9FE870]" title="System Live" />
        </div>
      </aside>
    </>
  );
};

