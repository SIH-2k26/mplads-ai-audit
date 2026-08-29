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
import { useT } from '../../i18n/useT';
import { UserRole } from '../../types';
import { TranslationKeys } from '../../i18n/locales';

interface NavItem {
  path: string;
  labelKey: keyof TranslationKeys['nav'];
  icon: React.ElementType;
}

interface NavGroup {
  labelKey: keyof TranslationKeys['nav'];
  items: NavItem[];
}

// Static shape — labels resolved from t.nav at render time
const ROLE_NAV: Record<UserRole, NavGroup[]> = {
  MP: [
    {
      labelKey: 'myConstituency',
      items: [
        { path: '/mp', labelKey: 'mpOverview', icon: Home },
        { path: '/projects', labelKey: 'projectsExplorer', icon: Search },
        { path: '/maps', labelKey: 'constituencyMap', icon: MapPin },
      ],
    },
    {
      labelKey: 'financialsRisk',
      items: [
        { path: '/alerts', labelKey: 'alertsWarnings', icon: ShieldAlert },
        { path: '/risk-assessment', labelKey: 'riskSimulator', icon: Activity },
      ],
    },
    {
      labelKey: 'reports',
      items: [
        { path: '/compliance', labelKey: 'complianceStatus', icon: BarChart2 },
        { path: '/reports', labelKey: 'auditReports', icon: FileText },
      ],
    },
  ],

  DISTRICT_AUTHORITY: [
    {
      labelKey: 'districtCommand',
      items: [
        { path: '/district', labelKey: 'districtOverview', icon: Sliders },
        { path: '/projects', labelKey: 'projectsExplorer', icon: Search },
        { path: '/maps', labelKey: 'constituencyMap', icon: MapPin },
      ],
    },
    {
      labelKey: 'forensicsWatch',
      items: [
        { path: '/alerts', labelKey: 'alertsWarnings', icon: ShieldAlert },
        { path: '/cases', labelKey: 'casesDirectorate', icon: ClipboardList },
        { path: '/risk-assessment', labelKey: 'riskAssessment', icon: Activity },
      ],
    },
    {
      labelKey: 'registries',
      items: [
        { path: '/contractors', labelKey: 'contractors', icon: Users },
        { path: '/agencies', labelKey: 'agenciesOffice', icon: Briefcase },
        { path: '/compliance', labelKey: 'statutoryCompliance', icon: BarChart2 },
        { path: '/policies', labelKey: 'policiesRegistry', icon: BookOpen },
        { path: '/reports', labelKey: 'auditReports', icon: FileText },
      ],
    },
  ],

  STATE_NODAL: [
    {
      labelKey: 'stateCommand',
      items: [
        { path: '/state', labelKey: 'stateOverview', icon: Landmark },
        { path: '/district', labelKey: 'districtBreakdown', icon: Sliders },
        { path: '/projects', labelKey: 'projectsExplorer', icon: Search },
      ],
    },
    {
      labelKey: 'enforcement',
      items: [
        { path: '/alerts', labelKey: 'alertsWarnings', icon: ShieldAlert },
        { path: '/cases', labelKey: 'casesDirectorate', icon: ClipboardList },
        { path: '/risk-assessment', labelKey: 'riskAssessment', icon: Activity },
      ],
    },
    {
      labelKey: 'governance',
      items: [
        { path: '/contractors', labelKey: 'contractors', icon: Users },
        { path: '/agencies', labelKey: 'agenciesOffice', icon: Briefcase },
        { path: '/compliance', labelKey: 'complianceTracker', icon: BarChart2 },
        { path: '/policies', labelKey: 'policiesRegistry', icon: BookOpen },
        { path: '/reports', labelKey: 'auditReports', icon: FileText },
      ],
    },
  ],

  MINISTRY_DIID: [
    {
      labelKey: 'nationalCommand',
      items: [
        { path: '/ministry', labelKey: 'ministryCommand', icon: Building2 },
        { path: '/state', labelKey: 'stateTelemetry', icon: Landmark },
        { path: '/projects', labelKey: 'projectsExplorer', icon: Search },
      ],
    },
    {
      labelKey: 'intelligenceRisk',
      items: [
        { path: '/alerts', labelKey: 'nationalAlerts', icon: ShieldAlert },
        { path: '/cases', labelKey: 'casesDirectorate', icon: ClipboardList },
        { path: '/risk-assessment', labelKey: 'riskSimulator', icon: Activity },
      ],
    },
    {
      labelKey: 'policyGovernance',
      items: [
        { path: '/contractors', labelKey: 'contractors', icon: Users },
        { path: '/agencies', labelKey: 'agenciesOffice', icon: Briefcase },
        { path: '/compliance', labelKey: 'complianceTracker', icon: BarChart2 },
        { path: '/policies', labelKey: 'policiesRegistry', icon: BookOpen },
        { path: '/reports', labelKey: 'nationalReports', icon: FileText },
        { path: '/maps', labelKey: 'nationalMap', icon: MapPin },
      ],
    },
  ],

  AUDITOR: [
    {
      labelKey: 'auditOperations',
      items: [
        { path: '/reports', labelKey: 'auditReports', icon: FileText },
        { path: '/cases', labelKey: 'casesDirectorate', icon: ClipboardList },
        { path: '/compliance', labelKey: 'complianceTracker', icon: BarChart2 },
      ],
    },
    {
      labelKey: 'forensicInvestigation',
      items: [
        { path: '/projects', labelKey: 'projectsExplorer', icon: Search },
        { path: '/risk-assessment', labelKey: 'riskSimulator', icon: Activity },
        { path: '/alerts', labelKey: 'alertsFlags', icon: ShieldAlert },
      ],
    },
    {
      labelKey: 'registries',
      items: [
        { path: '/contractors', labelKey: 'contractors', icon: Users },
        { path: '/agencies', labelKey: 'agenciesOffice', icon: Briefcase },
        { path: '/policies', labelKey: 'policiesRegistry', icon: BookOpen },
        { path: '/maps', labelKey: 'nationalMap', icon: MapPin },
      ],
    },
  ],
};

// Role badge colours
const ROLE_BADGE_STYLE: Record<UserRole, string> = {
  MP: 'bg-blue-100 text-blue-800',
  DISTRICT_AUTHORITY: 'bg-[#16A34A] text-white',
  STATE_NODAL: 'bg-purple-100 text-purple-800',
  MINISTRY_DIID: 'bg-[#002449] text-white font-bold tracking-wider',
  AUDITOR: 'bg-red-100 text-red-700',
};

export function AppSidebar() {
  const { sidebarCollapsed } = useUiStore();
  const { currentRole } = useRoleStore();
  const t = useT();
  const location = useLocation();
  const currentPath = location.pathname;

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const groups = ROLE_NAV[currentRole] ?? [];
  const badgeStyle = ROLE_BADGE_STYLE[currentRole];
  const badgeLabel = t.roleBadge[currentRole];

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

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => ({ ...prev, [key]: prev[key] === false ? true : false }));
  };

  const isGroupExpanded = (key: string) => expandedGroups[key] !== false;

  return (
    <aside
      id="sidebar-wise"
      className={`fixed top-[61px] left-0 bottom-0 z-20 bg-white flex flex-col justify-between py-4 transition-all duration-300 border-r border-[#F1F0EC] select-none overflow-y-auto no-scrollbar ${
        sidebarCollapsed ? 'w-16 px-2' : 'w-64 px-4'
      }`}
    >
      <div className="space-y-4">
        {/* Role badge */}
        {!sidebarCollapsed && (
          <div className={`mx-2 px-3 py-1.5 rounded-full text-[10px] font-bold text-center ${badgeStyle}`}>
            {badgeLabel}
          </div>
        )}

        {/* Dynamic nav groups */}
        <nav className="space-y-4">
          {groups.map((group) => {
            const groupLabel = t.nav[group.labelKey] as string;
            const expanded = isGroupExpanded(group.labelKey);

            return (
              <div key={group.labelKey}>
                {!sidebarCollapsed && (
                  <button
                    onClick={() => toggleGroup(group.labelKey)}
                    className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider cursor-pointer"
                  >
                    <span>{groupLabel}</span>
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
                      const label = t.nav[item.labelKey] as string;
                      return (
                        <Link
                          to={item.path}
                          key={item.path}
                          className={navItemClass(item.path)}
                          title={sidebarCollapsed ? label : undefined}
                        >
                          <Icon className="w-5 h-5 stroke-[1.75] shrink-0" />
                          {!sidebarCollapsed && <span className="truncate">{label}</span>}
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
          <span>{t.sidebarFooter}</span>
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" title="System Live" />
        </div>
      )}
    </aside>
  );
}
