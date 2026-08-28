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
  const { toggleSidebar, setAiAssistantOpen } = useUiStore();
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
          sentinel
        </span>
      </div>

      {/* Middle: Role & Jurisdiction Context (Slightly modified to look like File 2's clean look) */}
      <div className="hidden lg:flex items-center gap-3 ml-6 bg-[#F1F0EC] px-3.5 py-1.5 rounded-full text-xs text-[#0E0E0E]">
        <span className="font-semibold text-gray-500 uppercase tracking-wider text-[10px]">Context:</span>
        <span className="font-medium text-[#0E0E0E]">{userTitle}</span>
        <span className="text-[#6B6B6B]">•</span>
        <span className="text-[#6B6B6B] font-mono">{userJurisdiction}</span>
      </div>

      {/* Right: Actions, Language Switcher, Role Selector, and AI Copilot */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Quick Role Switcher (Select dropdown formatted as a clean pill) */}
        <div className="relative flex items-center bg-[#F1F0EC] px-3 py-1.5 rounded-full text-xs font-medium text-[#0E0E0E] border border-[#E5E3DC]">
          <span className="mr-1 text-[#6B6B6B]">Role:</span>
          <select
            value={currentRole}
            onChange={handleRoleChange}
            className="bg-transparent border-none text-[#0E0E0E] font-semibold pr-4 py-0 focus:outline-none cursor-pointer appearance-none"
          >
            <option value="DISTRICT_AUTHORITY">District Collector</option>
            <option value="MP">MP (Lok Sabha)</option>
            <option value="STATE_NODAL">State Nodal</option>
            <option value="MINISTRY_DIID">Ministry / MoSPI</option>
            <option value="AUDITOR">CAG Auditor</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#6B6B6B] absolute right-2 pointer-events-none" />
        </div>

        {/* Language Switcher Dropdown */}
        <div className="relative flex items-center bg-[#F1F0EC] px-3 py-1.5 rounded-full text-xs font-medium text-[#0E0E0E] border border-[#E5E3DC]">
          <Globe className="w-3.5 h-3.5 text-[#6B6B6B] mr-1.5" />
          <select
            value={language}
            onChange={handleLangChange}
            className="bg-transparent border-none text-[#0E0E0E] font-semibold pr-4 py-0 focus:outline-none cursor-pointer appearance-none"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="mr">मराठी</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#6B6B6B] absolute right-2 pointer-events-none" />
        </div>

        {/* AI Assistant Trigger Button (matches Wise's green accent pill action) */}
        <button
          onClick={() => setAiAssistantOpen(true)}
          className="bg-[#9FE870] hover:bg-[#8ee05c] text-[#0E0E0E] font-semibold text-xs px-4 py-2 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 shadow-none"
        >
          <Sparkles className="w-3.5 h-3.5 fill-[#0E0E0E]" />
          <span>Ask Agastya</span>
        </button>

        {/* User Initials Circle */}
        <div className="w-8 h-8 rounded-full bg-[#EAE8E2] text-[#0E0E0E] font-semibold text-xs flex items-center justify-center relative shadow-2xs">
          <span>AS</span>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
        </div>
      </div>
    </header>
  );
}
