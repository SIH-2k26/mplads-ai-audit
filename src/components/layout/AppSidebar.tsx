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
} from 'lucide-react';
import { useRoleStore } from '../../stores/useRoleStore';
import { useUiStore } from '../../stores/useUiStore';
import { cn } from '../../lib/utils';

export function AppSidebar() {
  const { currentRole } = useRoleStore();
  const { sidebarCollapsed, toggleSidebar } = useUiStore();

  const navItems = [
    { label: 'Early Warning Center', path: '/alerts', icon: ShieldAlert, badge: '7', highlight: true },
    { label: 'Browse MPs & Performance', path: '/mp', icon: UserCheck },
    { label: 'Browse States & Heatmap', path: '/state', icon: Globe2 },
    { label: 'District Command Center', path: '/district', icon: Building },
    { label: 'National Oversight Center', path: '/ministry', icon: Landmark },
    { label: 'Projects & Digital Twins', path: '/projects', icon: FolderKanban },
    { label: 'Case Investigations', path: '/cases', icon: Briefcase, badge: '3' },
    { label: 'Contractor Cartel Intel', path: '/contractors', icon: Users },
    { label: 'Fraud Archetypes & Overlap', path: '/compliance', icon: Scale },
    { label: 'Implementing Agencies', path: '/agencies', icon: Building2 },
    { label: 'Geographic Risk Maps', path: '/maps', icon: Map },
    { label: 'Codified Rules & Policies', path: '/policies', icon: BookOpen },
    { label: 'Official Audit Reports', path: '/reports', icon: FileSpreadsheet },
    { label: 'Design System Gallery', path: '/design-system', icon: Palette },
  ];

  return (
    <aside
      className={cn(
        'fixed top-16 bottom-0 left-0 z-20 flex flex-col border-r border-[#D9DFE3] bg-[#FAFAF7] transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Role Indicator Banner */}
      {!sidebarCollapsed && (
        <div className="border-b border-[#D9DFE3] bg-[#F3F5F4] p-3.5">
          <div className="flex items-center gap-2">
            <Landmark className="h-4 w-4 text-[#15324A]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#15324A]">
              {currentRole.replace('_', ' ')}
            </span>
          </div>
          <p className="text-[10px] text-[#647383] mt-0.5 truncate font-mono">
            {currentRole === 'MP'
              ? 'Pune Constituency • Lok Sabha'
              : currentRole === 'DISTRICT_AUTHORITY'
              ? 'Pune District Command Authority'
              : currentRole === 'STATE_NODAL'
              ? 'Maharashtra State Nodal Oversight'
              : 'All-India National Ministry Center'}
          </p>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-[4px] px-3 py-2 text-xs font-medium transition-colors select-none',
                  isActive
                    ? 'bg-[#15324A] text-white shadow-subtle font-semibold'
                    : 'text-[#172B3A] hover:bg-[#F3F5F4] hover:text-[#15324A]',
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
