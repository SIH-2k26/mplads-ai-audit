import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  ShieldAlert,
  Search,
  MapPin,
  BarChart2,
  Sliders,
  ChevronDown,
  ChevronUp,
  Users,
  Building2,
  Landmark,
  FileText,
  Activity,
  Briefcase,
  ClipboardList,
  BookOpen,
} from 'lucide-react';
import { useUiStore } from '../../stores/useUiStore';
import { useRoleStore } from '../../stores/useRoleStore';
import { UserRole } from '../../types';

// ─── Per-role sidebar configuration ─────────────────────────────────────────
// Each role gets exactly the nav items relevant to their jurisdiction.

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const ROLE_NAV: Record<UserRole, NavGroup[]> = {
  // ── MP: Constituency-level view ─────────────────────────────────────────
  MP: [
    {
      label: 'My Constituency',
      items: [
        { path: '/mp', label: 'MP Overview', icon: Home },
        { path: '/projects', label: 'Projects Explorer', icon: Search },
        { path: '/maps', label: 'Constituency Map', icon: MapPin },
      ],
    },
    {
      label: 'Financials & Risk',
      items: [
        { path: '/alerts', label: 'Alerts & Warnings', icon: ShieldAlert },
        { path: '/risk-assessment', label: 'Risk Simulator', icon: Activity },
      ],
    },
    {
      label: 'Reports',
      items: [
        { path: '/compliance', label: 'Compliance Status', icon: BarChart2 },
        { path: '/reports', label: 'Reports', icon: FileText },
      ],
    },
  ],

  // ── District Authority: District-level command ───────────────────────────
  DISTRICT_AUTHORITY: [
    {
      label: 'District Command',
      items: [
        { path: '/district', label: 'District Overview', icon: Sliders },
        { path: '/projects', label: 'Projects Explorer', icon: Search },
        { path: '/maps', label: 'Constituency Map', icon: MapPin },
      ],
    },
    {
      label: 'Forensics & Watch',
      items: [
        { path: '/alerts', label: 'Alerts & Warnings', icon: ShieldAlert },
        { path: '/cases', label: 'Cases Directorate', icon: ClipboardList },
        { path: '/risk-assessment', label: 'Risk Assessment', icon: Activity },
      ],
    },
    {
      label: 'Registries',
      items: [
        { path: '/contractors', label: 'Contractors', icon: Users },
        { path: '/agencies', label: 'Agencies Office', icon: Briefcase },
        { path: '/compliance', label: 'Statutory Compliance', icon: BarChart2 },
      ],
    },
  ],

  // ── State Nodal: State-wide oversight ───────────────────────────────────
  STATE_NODAL: [
    {
      label: 'State Command',
      items: [
        { path: '/state', label: 'State Overview', icon: Landmark },
        { path: '/district', label: 'District Breakdown', icon: Sliders },
        { path: '/projects', label: 'Projects Explorer', icon: Search },
      ],
    },
    {
      label: 'Enforcement & Risk',
      items: [
        { path: '/alerts', label: 'Alerts & Warnings', icon: ShieldAlert },
        { path: '/cases', label: 'Cases Directorate', icon: ClipboardList },
        { path: '/risk-assessment', label: 'Risk Assessment', icon: Activity },
      ],
    },
    {
      label: 'Governance',
      items: [
        { path: '/contractors', label: 'Contractors', icon: Users },
        { path: '/agencies', label: 'Agencies Office', icon: Briefcase },
        { path: '/compliance', label: 'Compliance Tracker', icon: BarChart2 },
        { path: '/policies', label: 'Policies Registry', icon: BookOpen },
        { path: '/reports', label: 'Audit Reports', icon: FileText },
      ],
    },
  ],

  // ── Ministry: National command ───────────────────────────────────────────
  MINISTRY_DIID: [
    {
      label: 'National Command',
      items: [
        { path: '/ministry', label: 'Ministry Command', icon: Building2 },
        { path: '/state', label: 'State Telemetry', icon: Landmark },
        { path: '/projects', label: 'Projects Explorer', icon: Search },
      ],
    },
    {
      label: 'Intelligence & Risk',
      items: [
        { path: '/alerts', label: 'National Alerts', icon: ShieldAlert },
        { path: '/cases', label: 'Cases Directorate', icon: ClipboardList },
        { path: '/risk-assessment', label: 'Risk Simulator', icon: Activity },
      ],
    },
    {
      label: 'Policy & Governance',
      items: [
        { path: '/contractors', label: 'Contractors', icon: Users },
        { path: '/agencies', label: 'Agencies Office', icon: Briefcase },
        { path: '/compliance', label: 'Compliance Tracker', icon: BarChart2 },
        { path: '/policies', label: 'Policies Registry', icon: BookOpen },
        { path: '/reports', label: 'National Reports', icon: FileText },
        { path: '/maps', label: 'National Map', icon: MapPin },
      ],
    },
  ],

  // ── CAG Auditor: Full audit access ───────────────────────────────────────
  AUDITOR: [
    {
      label: 'Audit Operations',
      items: [
        { path: '/reports', label: 'Audit Reports', icon: FileText },
        { path: '/cases', label: 'Cases Directorate', icon: ClipboardList },
        { path: '/compliance', label: 'Compliance Tracker', icon: BarChart2 },
      ],
    },
    {
      label: 'Forensic Investigation',
      items: [
        { path: '/projects', label: 'Projects Explorer', icon: Search },
        { path: '/risk-assessment', label: 'Risk Simulator', icon: Activity },
        { path: '/alerts', label: 'Alerts & Flags', icon: ShieldAlert },
      ],
    },
    {
      label: 'Registries',
      items: [
        { path: '/contractors', label: 'Contractors', icon: Users },
        { path: '/agencies', label: 'Agencies Office', icon: Briefcase },
        { path: '/policies', label: 'Policies Registry', icon: BookOpen },
        { path: '/maps', label: 'National Map', icon: MapPin },
      ],
    },
  ],
};

// Role badge colours
const ROLE_BADGE: Record<UserRole, { bg: string; label: string }> = {
  MP: { bg: 'bg-blue-100 text-blue-800', label: 'MP' },
  DISTRICT_AUTHORITY: { bg: 'bg-[#9FE870] text-[#0E0E0E]', label: 'District' },
  STATE_NODAL: { bg: 'bg-purple-100 text-purple-800', label: 'State Nodal' },
  MINISTRY_DIID: { bg: 'bg-amber-100 text-amber-800', label: 'Ministry' },
  AUDITOR: { bg: 'bg-red-100 text-red-700', label: 'CAG Auditor' },
};

export function AppSidebar() {
  const { sidebarCollapsed } = useUiStore();
  const { currentRole } = useRoleStore();
  const location = useLocation();
  const currentPath = location.pathname;

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const groups = ROLE_NAV[currentRole] ?? [];
  const badge = ROLE_BADGE[currentRole];

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  const navItemClass = (path: string) => {
    const active = isActive(path);
    return `w-full flex items-center gap-3.5 px-4 py-3 rounded-full text-sm font-medium transition-all text-left cursor-pointer ${
      active
        ? 'bg-[#EAE8E2] text-[#0E0E0E] font-semibold'
        : 'text-[#0E0E0E] hover:bg-[#F1F0EC]'
    }`;
  };

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [label]: prev[label] === false ? true : false,
    }));
  };

  const isGroupExpanded = (label: string) => expandedGroups[label] !== false;

  return (
    <aside
      id="sidebar-wise"
      className={`fixed top-[61px] left-0 bottom-0 z-20 bg-white flex flex-col justify-between py-4 transition-all duration-300 border-r border-[#F1F0EC] select-none overflow-y-auto no-scrollbar ${
        sidebarCollapsed ? 'w-16 px-2' : 'w-64 px-4'
      }`}
    >
      <div className="space-y-4">
        {/* Role indicator pill */}
        {!sidebarCollapsed && (
          <div className={`mx-2 px-3 py-1.5 rounded-full text-[10px] font-bold text-center ${badge.bg} select-none`}>
            {badge.label} VIEW
          </div>
        )}

        {/* Dynamic navigation groups */}
        <nav className="space-y-4">
          {groups.map((group) => {
            const expanded = isGroupExpanded(group.label);
            return (
              <div key={group.label}>
                {!sidebarCollapsed && (
                  <button
                    onClick={() => toggleGroup(group.label)}
                    className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider cursor-pointer"
                  >
                    <span>{group.label}</span>
                    {expanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}

                {(expanded || sidebarCollapsed) && (
                  <div className="space-y-1 mt-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          to={item.path}
                          key={item.path}
                          className={navItemClass(item.path)}
                          title={sidebarCollapsed ? item.label : undefined}
                        >
                          <Icon className="w-5 h-5 stroke-[1.75] shrink-0" />
                          {!sidebarCollapsed && (
                            <span className="truncate">{item.label}</span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      {!sidebarCollapsed && (
        <div className="px-3 pt-4 border-t border-[#F1F0EC] text-[10px] text-[#6B6B6B] flex items-center justify-between shrink-0">
          <span>MPLADS Guardian v3.0</span>
          <span className="w-2 h-2 rounded-full bg-[#9FE870] animate-pulse" title="System Live" />
        </div>
      )}
    </aside>
  );
}
