import React from 'react';
import {
  Menu,
  ChevronDown,
  Search,
  Bell,
  RefreshCw,
  Sparkles,
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUiStore } from '../../stores/useUiStore';
import { useRoleStore } from '../../stores/useRoleStore';
import { useLanguageStore } from '../../stores/useLanguageStore';
import { SUPPORTED_LANGUAGES } from '../../i18n/types';
import { useT } from '../../i18n/useT';
import { UserRole } from '../../types';

const ROLE_DASHBOARD_MAP: Record<UserRole, string> = {
  DISTRICT_AUTHORITY: '/district',
  MP: '/mp',
  STATE_NODAL: '/state',
  MINISTRY_DIID: '/ministry',
  AUDITOR: '/reports',
};

export function TopHeader() {
  const navigate = useNavigate();
  const t = useT();
  const { toggleSidebar, setAiAssistantOpen, setProfileModalOpen } = useUiStore();
  const { currentRole, userTitle, userJurisdiction, setRole } = useRoleStore();
  const { language, setLanguage } = useLanguageStore();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value as UserRole;
    setRole(role);
    navigate(ROLE_DASHBOARD_MAP[role]);
  };

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as any);
  };

  return (
    <header className="w-full bg-white px-4 sm:px-8 py-3 flex items-center justify-between border-b border-[#F1F0EC] sticky top-0 z-30 select-none">
      {/* Left: Hamburger & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full text-[#0E0E0E] hover:bg-[#F1F0EC] transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-bold text-lg tracking-tight text-[#0E0E0E] lowercase leading-none">
          {t.brand}
        </span>
      </div>

      {/* Middle: Role & Jurisdiction Context */}
      <div className="hidden lg:flex items-center gap-3 ml-6 bg-[#F1F0EC] px-3.5 py-1.5 rounded-full text-xs text-[#0E0E0E]">
        <span className="font-semibold text-gray-500 uppercase tracking-wider text-[10px]">{t.header.context}:</span>
        <span className="font-medium text-[#0E0E0E]">{userTitle}</span>
        <span className="text-[#6B6B6B]">•</span>
        <span className="text-[#6B6B6B] font-mono">{userJurisdiction}</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Role Switcher */}
        <div className="relative flex items-center bg-[#F1F0EC] px-3 py-1.5 rounded-full text-xs font-medium text-[#0E0E0E] border border-[#E5E3DC]">
          <span className="mr-1 text-[#6B6B6B]">{t.header.role}:</span>
          <select
            value={currentRole}
            onChange={handleRoleChange}
            className="bg-transparent border-none text-[#0E0E0E] font-semibold pr-4 py-0 focus:outline-none cursor-pointer appearance-none"
          >
            <option value="DISTRICT_AUTHORITY">{t.roles.DISTRICT_AUTHORITY}</option>
            <option value="MP">{t.roles.MP}</option>
            <option value="STATE_NODAL">{t.roles.STATE_NODAL}</option>
            <option value="MINISTRY_DIID">{t.roles.MINISTRY_DIID}</option>
            <option value="AUDITOR">{t.roles.AUDITOR}</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#6B6B6B] absolute right-2 pointer-events-none" />
        </div>

        {/* Language Switcher */}
        <div className="relative flex items-center bg-[#F1F0EC] px-3 py-1.5 rounded-full text-xs font-medium text-[#0E0E0E] border border-[#E5E3DC]">
          <Globe className="w-3.5 h-3.5 text-[#6B6B6B] mr-1.5" />
          <select
            value={language}
            onChange={handleLangChange}
            className="bg-transparent border-none text-[#0E0E0E] font-semibold pr-4 py-0 focus:outline-none cursor-pointer appearance-none"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.nativeName}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#6B6B6B] absolute right-2 pointer-events-none" />
        </div>

        {/* Ask Agastya */}
        <button
          onClick={() => setAiAssistantOpen(true)}
          className="bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold text-xs px-4 py-2 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 shadow-none"
        >
          <Sparkles className="w-3.5 h-3.5 fill-white" />
          <span>{t.header.askAgastya}</span>
        </button>

        {/* User Avatar Button */}
        <button
          onClick={() => setProfileModalOpen(true)}
          title="Officer Profile & Clearance Dossier"
          className="w-8 h-8 rounded-full bg-[#002449] text-white font-bold text-xs flex items-center justify-center relative shadow-2xs hover:bg-[#001B36] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#002449]/30"
        >
          <span>AS</span>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" title="Online & Verified" />
        </button>
      </div>
    </header>
  );
}
