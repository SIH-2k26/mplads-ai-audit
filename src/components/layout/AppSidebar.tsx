import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  ShieldAlert,
  Briefcase,
  Map,
  PieChart,
  CheckSquare,
  Users,
  Building2,
  FileText,
  BookOpen,
  FileSpreadsheet,
  Palette,
  ChevronLeft,
  ChevronRight,
  Landmark,
} from 'lucide-react';
import { useRoleStore } from '../../stores/useRoleStore';
import { useUiStore } from '../../stores/useUiStore';
import { cn } from '../../lib/utils';

export function AppSidebar() {
  const { currentRole } = useRoleStore();
  const { sidebarCollapsed, toggleSidebar } = useUiStore();

  const getDashboardPath = () => {
    switch (currentRole) {
      case 'MP':
        return '/mp';
      case 'DISTRICT_AUTHORITY':
        return '/district';
      case 'STATE_NODAL':
        return '/state';
      case 'MINISTRY_DIID':
        return '/ministry';
      default:
        return '/district';
    }
  };

  const navItems = [
    { label: 'Role Dashboard', path: getDashboardPath(), icon: LayoutDashboard },
    { label: 'Projects Explorer', path: '/projects', icon: FolderKanban },
    { label: 'Alerts & Risks', path: '/alerts', icon: ShieldAlert, badge: '4' },
    { label: 'Case Management', path: '/cases', icon: Briefcase, badge: '3' },
    { label: 'Geographic Risk Maps', path: '/maps', icon: Map },
    { label: 'Compliance & SLAs', path: '/compliance', icon: CheckSquare },
    { label: 'Contractors', path: '/contractors', icon: Users },
    { label: 'Implementing Agencies', path: '/agencies', icon: Building2 },
    { label: 'Policy & Guidelines', path: '/policies', icon: BookOpen },
    { label: 'Audit Reports', path: '/reports', icon: FileSpreadsheet },
    { label: 'Design System Gallery', path: '/design-system', icon: Palette, highlight: true },
  ];

  return (
    <aside
      className={cn(
        'fixed top-16 bottom-0 left-0 z-20 flex flex-col border-r border-[#D9D5CC] bg-[#FAFAF7] transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Role Indicator Banner */}
      {!sidebarCollapsed && (
        <div className="border-b border-[#EDE8DE] bg-[#EDE8DE]/40 p-4">
          <div className="flex items-center gap-2">
            <Landmark className="h-4 w-4 text-[#18324A]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#18324A]">
              {currentRole.replace('_', ' ')}
            </span>
          </div>
          <p className="text-[11px] text-[#667085] mt-0.5 truncate">
            {currentRole === 'MP'
              ? 'Pune Constituency'
              : currentRole === 'DISTRICT_AUTHORITY'
              ? 'Pune District Command'
              : currentRole === 'STATE_NODAL'
              ? 'Maharashtra State Oversight'
              : 'All-India National Oversight'}
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
                    ? 'bg-[#18324A] text-white shadow-subtle font-semibold'
                    : 'text-[#1D2939] hover:bg-[#EDE8DE] hover:text-[#18324A]',
                  item.highlight && !isActive && 'text-[#C98219] font-bold bg-[#C98219]/10'
                )
              }
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className="flex-1 truncate">{item.label}</span>
              )}
              {!sidebarCollapsed && item.badge && (
                <span className="rounded bg-[#B44343] px-1.5 py-0.2 text-[10px] font-bold text-white">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Sidebar Collapse Toggle */}
      <div className="border-t border-[#EDE8DE] p-3">
        <button
          type="button"
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center gap-2 rounded-[4px] border border-[#D9D5CC] bg-white py-1.5 text-xs font-medium text-[#667085] hover:bg-[#F7F5F0] hover:text-[#18324A] transition-colors"
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
