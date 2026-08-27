import React from 'react';
import { Shield, Bell, Search, User, ChevronDown, Check, Clock, Sparkles } from 'lucide-react';
import { useRoleStore } from '../../stores/useRoleStore';
import { UserRole } from '../../types';
import { useUiStore } from '../../stores/useUiStore';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LanguageSelector } from '../common/LanguageSelector';

export function TopHeader() {
  const { currentRole, setRole, userTitle, userJurisdiction } = useRoleStore();
  const { setAiAssistantOpen } = useUiStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [roleMenuOpen, setRoleMenuOpen] = React.useState(false);

  // Sync role store with current URL route if user navigates directly
  React.useEffect(() => {
    if (location.pathname === '/mp' && currentRole !== 'MP') {
      setRole('MP');
    } else if (location.pathname === '/district' && currentRole !== 'DISTRICT_AUTHORITY') {
      setRole('DISTRICT_AUTHORITY');
    } else if (location.pathname === '/state' && currentRole !== 'STATE_NODAL') {
      setRole('STATE_NODAL');
    } else if (location.pathname === '/ministry' && currentRole !== 'MINISTRY_DIID') {
      setRole('MINISTRY_DIID');
    } else if (location.pathname === '/cases' && currentRole !== 'AUDITOR') {
      setRole('AUDITOR');
    }
  }, [location.pathname, currentRole, setRole]);

  const roleOptions: Array<{ role: UserRole; label: string; desc: string; path: string }> = [
    {
      role: 'MP',
      label: 'Member of Parliament (Lok Sabha)',
      desc: 'Constituency project monitoring, fund utilisation & early-warning intelligence',
      path: '/mp',
    },
    {
      role: 'DISTRICT_AUTHORITY',
      label: 'District Magistrate & Collector',
      desc: 'Operational command, compliance monitoring & intervention management',
      path: '/district',
    },
    {
      role: 'STATE_NODAL',
      label: 'State Nodal Authority (Planning Dept.)',
      desc: 'Systemic risk intelligence & cross-district performance benchmarking',
      path: '/state',
    },
    {
      role: 'MINISTRY_DIID',
      label: 'Director General / Ministry Authority',
      desc: 'Executive risk intelligence, policy compliance & national investigation oversight',
      path: '/ministry',
    },
    {
      role: 'AUDITOR',
      label: 'Senior Vigilance & Audit Officer (CAG / CVC)',
      desc: 'Deep investigation dockets, RAG evidence citations, critic verification & learning loop',
      path: '/cases',
    },
  ];

  const handleSelectRole = (option: typeof roleOptions[0]) => {
    setRole(option.role);
    setRoleMenuOpen(false);
    navigate(option.path);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#D9DFE3] bg-white px-4 sm:px-6 shadow-subtle">
      {/* Product Branding & National Identity */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-[4px] bg-[#15324A] text-white shadow-subtle border border-[#0F2638]">
            <Shield className="h-5 w-5 text-[#E5B45A]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#15324A] font-sans">
                AGASTYA
              </span>
              <span className="rounded bg-[#D99018]/15 px-1.5 py-0.2 text-[9px] font-bold text-[#D99018] border border-[#D99018]/30 font-mono">
                MPLADS AI AUDIT
              </span>
            </div>
            <p className="text-[10px] text-[#647383]">
              Government of India • Ministry of Statistics & Programme Implementation (MoSPI)
            </p>
          </div>
        </Link>
      </div>

      {/* Center/Right Controls */}
      <div className="flex items-center gap-3">
        {/* Data Source Transparency Banner */}
        <div className="hidden lg:flex items-center gap-1.5 rounded-[4px] bg-[#FAFAF7] border border-[#D9DFE3] px-2.5 py-1 text-[11px] text-[#647383]">
          <span className="h-2 w-2 rounded-full bg-[#2E8064] animate-pulse" />
          <span>DATA MODE: <strong>PUBLIC BENCHMARK & SIMULATED TELEMETRY</strong></span>
        </div>

        {/* 22 Eighth Schedule Languages Selector */}
        <LanguageSelector variant="header" />

        {/* Global Role Switcher Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 rounded-[4px] border border-[#15324A] bg-[#15324A] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#0F2638] transition-colors shadow-subtle"
          >
            <span className="h-2 w-2 rounded-full bg-[#E5B45A] animate-pulse" />
            <div className="text-left hidden sm:block">
              <span className="text-[9px] text-[#E5B45A] uppercase tracking-wider block font-bold font-mono">
                Acting Authority
              </span>
              <span className="font-bold text-xs leading-none text-white">{userTitle.split('/')[0]}</span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-[#E5B45A] ml-1" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-92 rounded-[6px] border border-[#D9DFE3] bg-white p-2 shadow-2xl z-50 animate-in fade-in-50 duration-150">
              <div className="px-3 py-2 border-b border-[#D9DFE3] mb-1 bg-[#FAFAF7] rounded-[4px]">
                <span className="text-[10px] uppercase font-mono font-bold text-[#15324A] tracking-wider block">
                  Switch Active Governance Lens
                </span>
                <span className="text-xs text-[#647383] font-medium block truncate">{userJurisdiction}</span>
              </div>
              <div className="space-y-1 mt-1">
                {roleOptions.map((opt) => (
                  <button
                    key={opt.role}
                    type="button"
                    onClick={() => handleSelectRole(opt)}
                    className={`flex w-full items-start justify-between rounded-[4px] p-2.5 text-left text-xs transition-colors ${
                      currentRole === opt.role
                        ? 'bg-[#15324A] text-white font-semibold'
                        : 'hover:bg-[#FAFAF7] text-[#172B3A]'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{opt.label}</div>
                      <div
                        className={`text-[10px] leading-tight mt-0.5 ${
                          currentRole === opt.role ? 'text-gray-200' : 'text-[#647383]'
                        }`}
                      >
                        {opt.desc}
                      </div>
                    </div>
                    {currentRole === opt.role && (
                      <Check className="h-4 w-4 text-[#E5B45A] mt-0.5 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <Link
          to="/alerts"
          className="relative rounded-[4px] border border-[#D9DFE3] p-2 text-[#15324A] hover:bg-[#FAFAF7] transition-colors"
          title="Active Risk Alerts"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C94B4B] text-[9px] font-bold text-white font-mono">
            4
          </span>
        </Link>

        {/* User Profile Badge */}
        <div className="hidden md:flex items-center gap-2 pl-2 border-l border-[#D9DFE3]">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FAFAF7] text-[#15324A] font-bold text-xs border border-[#D9DFE3]">
            <User className="h-4 w-4" />
          </div>
          <div className="text-left leading-tight text-xs">
            <span className="font-bold text-[#15324A] block">Dr. R. Deshmukh</span>
            <span className="text-[10px] text-[#647383]">Official Oversight</span>
          </div>
        </div>
      </div>
    </header>
  );
}
