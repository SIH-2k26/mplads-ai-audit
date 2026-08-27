// Sidebar — frontend/src/components/layout/Sidebar.tsx

import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FolderKanban, Bell, Shield, Users,
  Building2, FlaskConical, Server, ChevronRight, ShieldAlert,
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/projects', label: 'Projects', icon: FolderKanban },
  { path: '/alerts', label: 'Alerts', icon: Bell },
  { path: '/cases', label: 'Investigations', icon: Shield },
  { path: '/contractors', label: 'Contractors', icon: Users },
  { path: '/agencies', label: 'Agencies', icon: Building2 },
  { path: '/simulation', label: 'Simulation', icon: FlaskConical },
  { path: '/system', label: 'System', icon: Server },
];

export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-screen w-60 bg-slate-900 flex flex-col z-40 border-r border-slate-800">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <ShieldAlert className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-white text-sm font-semibold leading-tight">MPLADS Guardian</p>
          <p className="text-slate-400 text-xs leading-tight">AI Risk Assessment</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Mock API indicator */}
      <div className="px-4 py-3 border-t border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className={`w-2 h-2 rounded-full ${import.meta.env.VITE_USE_MOCK_API === 'true' ? 'bg-amber-400' : 'bg-green-400'}`} />
          <span>
            {import.meta.env.VITE_USE_MOCK_API === 'true' ? 'Mock API Active' : 'Live Backend'}
          </span>
        </div>
        <p className="text-xs text-slate-600 mt-1">SIH 2026 — Dev Build</p>
      </div>
    </aside>
  );
}
