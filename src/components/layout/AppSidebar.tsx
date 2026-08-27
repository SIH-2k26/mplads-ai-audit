import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  ShieldAlert,
  Briefcase,
  Map,
  CheckSquare,
  Users,
  Building2,
  BookOpen,
  FileSpreadsheet,
  Palette,
  ChevronLeft,
  ChevronRight,
  Landmark,
  Globe2,
  Building,
  UserCheck,
  Scale,
  Sparkles,
} from 'lucide-react';
import { useRoleStore } from '../../stores/useRoleStore';
import { useUiStore } from '../../stores/useUiStore';
import { cn } from '../../lib/utils';

export function AppSidebar() {
  const { currentRole } = useRoleStore();
  const { sidebarCollapsed, toggleSidebar } = useUiStore();

  // Dynamically configure navigation items with role-based prioritization
  const getNavItems = () => {
    switch (currentRole) {
      case 'MP':
        return [
          { label: 'MP Constituency Oversight', path: '/mp', icon: UserCheck, primary: true },
          { label: 'Constituency Projects & Twins', path: '/projects', icon: FolderKanban },
          { label: 'Early Warning Signals', path: '/alerts', icon: ShieldAlert, badge: '3' },
          { label: 'Geographic Work Maps', path: '/maps', icon: Map },
          { label: 'Codified Rules & Guidelines', path: '/policies', icon: BookOpen },
          { label: 'Browse States & Benchmarks', path: '/state', icon: Globe2 },
        ];
      case 'DISTRICT_AUTHORITY':
        return [
          { label: 'District Command Centre', path: '/district', icon: Building, primary: true },
          { label: 'Priority Action Queue', path: '/alerts', icon: ShieldAlert, badge: '7', highlight: true },
          { label: 'Monitored Works Explorer', path: '/projects', icon: FolderKanban },
          { label: 'Active Case Dossiers', path: '/cases', icon: Briefcase, badge: '3' },
          { label: 'Implementing Line Agencies', path: '/agencies', icon: Building2 },
          { label: 'District Geospatial Maps', path: '/maps', icon: Map },
          { label: 'Statutory Guidelines & NOCs', path: '/policies', icon: BookOpen },
        ];
      case 'STATE_NODAL':
        return [
          { label: 'State Nodal Oversight (SNA)', path: '/state', icon: Globe2, primary: true },
          { label: 'District Anomaly League Table', path: '/state', icon: Building },
          { label: 'State Risk Heatmap', path: '/maps', icon: Map },
          { label: 'Contractor Cartel Intel', path: '/contractors', icon: Users },
          { label: 'Fraud Archetypes & Overlap', path: '/compliance', icon: Scale },
          { label: 'Statewide Projects Directory', path: '/projects', icon: FolderKanban },
          { label: 'Escalated Cases', path: '/cases', icon: Briefcase, badge: '5' },
        ];
      case 'MINISTRY_DIID':
      default:
        return [
          { label: 'National Oversight Directorate', path: '/ministry', icon: Landmark, primary: true },
          { label: 'All-India Case Inquiries', path: '/cases', icon: Briefcase, badge: '12' },
          { label: 'CAG / CVC Audit Prioritisation', path: '/reports', icon: FileSpreadsheet, highlight: true },
          { label: 'Fraud Archetype Overlaps', path: '/compliance', icon: Scale },
          { label: 'Contractor Cartel Networks', path: '/contractors', icon: Users },
          { label: 'National Projects Telemetry', path: '/projects', icon: FolderKanban },
          { label: 'National Geographic Maps', path: '/maps', icon: Map },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside
      className={cn(
        'fixed top-16 bottom-0 left-0 z-20 flex flex-col border-r border-[#D9DFE3] bg-[#FAFAF7] transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Role Indicator Banner */}
      {!sidebarCollapsed && (
        <div className="border-b border-[#D9DFE3] bg-[#15324A] text-white p-3.5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#E5B45A] animate-pulse" />
            <span className="text-[11px] font-bold font-mono uppercase tracking-wider text-[#E5B45A]">
              {currentRole.replace('_', ' ')}
            </span>
          </div>
          <p className="text-[10px] text-gray-300 mt-0.5 truncate font-sans">
            {currentRole === 'MP'
              ? 'Pune Parliamentary Constituency'
              : currentRole === 'DISTRICT_AUTHORITY'
              ? 'District Magistrate & Collector, Pune'
              : currentRole === 'STATE_NODAL'
              ? 'Maharashtra State Planning Dept'
              : 'Ministry of Statistics (MoSPI), New Delhi'}
          </p>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-[4px] px-3 py-2 text-xs font-medium transition-colors select-none',
                  isActive
                    ? 'bg-[#15324A] text-white shadow-subtle font-semibold'
                    : 'text-[#172B3A] hover:bg-[#F3F5F4] hover:text-[#15324A]',
                  item.primary && !isActive && 'text-[#15324A] font-bold bg-[#15324A]/5 border border-[#15324A]/15',
                  item.highlight && !isActive && 'text-[#D99018] font-bold bg-[#D99018]/10'
                )
              }
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className="flex-1 truncate">{item.label}</span>
              )}
              {!sidebarCollapsed && item.badge && (
                <span className="rounded bg-[#C94B4B] px-1.5 py-0.2 text-[10px] font-bold text-white font-mono">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Sidebar Collapse Toggle */}
      <div className="border-t border-[#D9DFE3] p-3">
        <button
          type="button"
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center gap-2 rounded-[4px] border border-[#D9DFE3] bg-white py-1.5 text-xs font-medium text-[#647383] hover:bg-[#FAFAF7] hover:text-[#15324A] transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse Navigation</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
