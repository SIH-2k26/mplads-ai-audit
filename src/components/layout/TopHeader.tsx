import React from 'react';
import { Shield, Bell, Search, User, ChevronDown, Check, Clock, Sparkles } from 'lucide-react';
import { useRoleStore } from '../../stores/useRoleStore';
import { UserRole } from '../../types';
import { useUiStore } from '../../stores/useUiStore';
import { Link, useNavigate } from 'react-router-dom';

export function TopHeader() {
  const { currentRole, setRole, userTitle, userJurisdiction } = useRoleStore();
  const { setAiAssistantOpen } = useUiStore();
  const navigate = useNavigate();
  const [roleMenuOpen, setRoleMenuOpen] = React.useState(false);

  const roleOptions: Array<{ role: UserRole; label: string; desc: string; path: string }> = [
    { role: 'MP', label: 'Member of Parliament (MP)', desc: 'Constituency Development & Progress Overview', path: '/mp' },
    { role: 'DISTRICT_AUTHORITY', label: 'District Authority / Collector', desc: 'Operational Command, Pre-sanctions & SLA Interventions', path: '/district' },
    { role: 'STATE_NODAL', label: 'State Nodal Authority (SNA)', desc: 'Statewide Risk Heatmap & Systemic Patterns', path: '/state' },
    { role: 'MINISTRY_DIID', label: 'Ministry / DIID (MoSPI)', desc: 'National Executive Oversight & Audit Directorate', path: '/ministry' },
  ];

  const handleSelectRole = (option: typeof roleOptions[0]) => {
    setRole(option.role);
    setRoleMenuOpen(false);
    navigate(option.path);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#D9D5CC] bg-white px-4 sm:px-6 shadow-subtle">
      {/* Product Branding & National Identity */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-[4px] bg-[#18324A] text-white shadow-subtle border border-[#102A43]">
            <Shield className="h-5 w-5 text-[#E7A943]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#18324A] font-sans">
                AGASTYA
              </span>
              <span className="rounded bg-[#C98219]/10 px-1.5 py-0.2 text-[9px] font-bold text-[#C98219] border border-[#C98219]/30 font-mono">
                MPLADS INTELLIGENCE
              </span>
            </div>
            <p className="text-[10px] text-[#667085]">
              Ministry of Statistics & Programme Implementation (MoSPI) • PS-26102
            </p>
          </div>
        </Link>
      </div>

      {/* Center/Right Controls */}
      <div className="flex items-center gap-3">
        {/* Data Freshness Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 rounded-[4px] bg-[#F7F5F0] border border-[#D9D5CC] px-2.5 py-1 text-[11px] text-[#667085]">
          <span className="h-2 w-2 rounded-full bg-[#2F7658] animate-pulse" />
          <span>Ledger Sync: <strong>Today, 08:30 IST</strong></span>
        </div>

        {/* Global Role Switcher Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 rounded-[4px] border border-[#D9D5CC] bg-[#FAFAF7] px-3 py-1.5 text-xs font-medium text-[#18324A] hover:bg-[#EDE8DE] transition-colors"
          >
            <span className="h-2 w-2 rounded-full bg-[#C98219]" />
            <div className="text-left hidden sm:block">
              <span className="text-[10px] text-[#667085] uppercase tracking-wider block font-bold">Acting Authority</span>
              <span className="font-bold text-xs leading-none">{userTitle.split('/')[0]}</span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-[#667085] ml-1" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-[6px] border border-[#D9D5CC] bg-white p-1.5 shadow-dropdown z-50 animate-in fade-in-50 duration-150">
              <div className="px-3 py-2 border-b border-[#EDE8DE] mb-1">
                <span className="text-[10px] uppercase font-bold text-[#667085] tracking-wider block">
                  Switch Active Governance Lens
                </span>
                <span className="text-xs text-[#1D2939] font-medium">{userJurisdiction}</span>
              </div>
              <div className="space-y-1">
                {roleOptions.map((opt) => (
                  <button
                    key={opt.role}
                    type="button"
                    onClick={() => handleSelectRole(opt)}
                    className={`flex w-full items-start justify-between rounded-[4px] p-2.5 text-left text-xs transition-colors ${
                      currentRole === opt.role
                        ? 'bg-[#18324A] text-white font-semibold'
                        : 'hover:bg-[#F7F5F0] text-[#1D2939]'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{opt.label}</div>
                      <div className={`text-[10px] leading-tight mt-0.5 ${currentRole === opt.role ? 'text-gray-200' : 'text-[#667085]'}`}>
                        {opt.desc}
                      </div>
                    </div>
                    {currentRole === opt.role && <Check className="h-4 w-4 text-[#E7A943] mt-0.5 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <Link
          to="/alerts"
          className="relative rounded-[4px] border border-[#D9D5CC] p-2 text-[#18324A] hover:bg-[#EDE8DE] transition-colors"
          title="Active Risk Alerts"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#B44343] text-[9px] font-bold text-white">
            4
          </span>
        </Link>

        {/* User Badge */}
        <div className="hidden md:flex items-center gap-2 pl-2 border-l border-[#D9D5CC]">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EDE8DE] text-[#18324A] font-bold text-xs border border-[#D9D5CC]">
            <User className="h-4 w-4" />
          </div>
          <div className="text-left leading-tight text-xs">
            <span className="font-bold text-[#18324A] block">Dr. R. Deshmukh</span>
            <span className="text-[10px] text-[#667085]">Verified Official</span>
          </div>
        </div>
      </div>
    </header>
  );
}
