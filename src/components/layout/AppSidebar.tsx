import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  Users,
  Building2,
  Landmark,
  FileText,
  Activity,
  Briefcase
} from 'lucide-react';
import { useUiStore } from '../../stores/useUiStore';

export function AppSidebar() {
  const { sidebarCollapsed } = useUiStore();
  const location = useLocation();
  const currentPath = location.pathname;

  const [dashboardsExpanded, setDashboardsExpanded] = useState(true);
  const [forensicsExpanded, setForensicsExpanded] = useState(true);
  const [registryExpanded, setRegistryExpanded] = useState(true);

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  const navItemClass = (path: string) => {
    const active = isActive(path);
    return `w-full flex items-center gap-3.5 px-4 py-3 rounded-full text-sm font-medium transition-all text-left cursor-pointer ${
      active
        ? 'bg-[#EAE8E2] text-[#0E0E0E] font-semibold shadow-none'
        : 'text-[#0E0E0E] hover:bg-[#F1F0EC] hover:text-[#0E0E0E]'
    }`;
  };

  const dashboardItems = [
    { path: '/mp', label: 'MP Oversight', icon: Home },
    { path: '/district', label: 'District Command', icon: Sliders },
    { path: '/state', label: 'State & National', icon: Landmark },
    { path: '/ministry', label: 'Ministry Command', icon: Building2 },
  ];

  const forensicItems = [
    { path: '/projects', label: 'Projects Explorer', icon: Search },
    { path: '/risk-assessment', label: 'Risk Assessment', icon: Activity },
    { path: '/alerts', label: 'Alerts & Warnings', icon: ShieldAlert },
    { path: '/cases', label: 'Cases Directorate', icon: FileText },
  ];

  const registryItems = [
    { path: '/contractors', label: 'Contractors', icon: Users },
    { path: '/agencies', label: 'Agencies Office', icon: Briefcase },
    { path: '/maps', label: 'Constituency Map', icon: MapPin },
    { path: '/compliance', label: 'Statutory compliance', icon: BarChart2 },
    { path: '/policies', label: 'Policies Registry', icon: FileText },
    { path: '/reports', label: 'Audit Reports', icon: FileText },
  ];

  return (
    <aside
      id="sidebar-wise"
      className={`fixed top-[61px] left-0 bottom-0 z-20 bg-white flex flex-col justify-between py-6 px-4 transition-all duration-300 border-r border-[#F1F0EC] select-none overflow-y-auto no-scrollbar ${
        sidebarCollapsed ? 'w-16 px-2' : 'w-64 px-4'
      }`}
    >
      <div className="space-y-6">
        {/* Navigation Groups */}
        <nav className="space-y-4">
          
          {/* GROUP 1: DASHBOARDS */}
          <div>
            {!sidebarCollapsed && (
              <button
                onClick={() => setDashboardsExpanded(!dashboardsExpanded)}
                className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider cursor-pointer"
              >
                <span>Dashboards</span>
                {dashboardsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}
            
            {(dashboardsExpanded || sidebarCollapsed) && (
              <div className="space-y-1 mt-1">
                {dashboardItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link to={item.path} key={item.path} className={navItemClass(item.path)}>
                      <Icon className="w-5 h-5 stroke-[1.75] shrink-0" />
                      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* GROUP 2: FORENSICS & WATCH */}
          <div>
            {!sidebarCollapsed && (
              <button
                onClick={() => setForensicsExpanded(!forensicsExpanded)}
                className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider cursor-pointer"
              >
                <span>Forensics & Watch</span>
                {forensicsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}

            {(forensicsExpanded || sidebarCollapsed) && (
              <div className="space-y-1 mt-1">
                {forensicItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link to={item.path} key={item.path} className={navItemClass(item.path)}>
                      <Icon className="w-5 h-5 stroke-[1.75] shrink-0" />
                      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* GROUP 3: REGISTRIES & AUDIT */}
          <div>
            {!sidebarCollapsed && (
              <button
                onClick={() => setRegistryExpanded(!registryExpanded)}
                className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider cursor-pointer"
              >
                <span>Registries & compliance</span>
                {registryExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}

            {(registryExpanded || sidebarCollapsed) && (
              <div className="space-y-1 mt-1">
                {registryItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link to={item.path} key={item.path} className={navItemClass(item.path)}>
                      <Icon className="w-5 h-5 stroke-[1.75] shrink-0" />
                      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

        </nav>
      </div>

      {/* Footer Info */}
      {!sidebarCollapsed && (
        <div className="px-3 pt-4 border-t border-[#F1F0EC] text-[10px] text-[#6B6B6B] flex items-center justify-between shrink-0">
          <span>MPLADS Guardian v3.0</span>
          <span className="w-2 h-2 rounded-full bg-[#9FE870] animate-pulse" title="System Live" />
        </div>
      )}
    </aside>
  );
}
