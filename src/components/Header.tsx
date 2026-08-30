import React from 'react';
import {
  Menu,
  ChevronRight,
  Search,
  Bell,
  RefreshCw,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onOpenDesignSpec: () => void;
  onRefreshData: () => void;
  isRefreshing: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  onOpenDesignSpec,
  onRefreshData,
  isRefreshing,
  searchQuery,
  onSearchChange,
  onOpenProfile,
}) => {
  return (
    <header className="w-full bg-white px-4 sm:px-8 py-3 flex items-center justify-between">
      {/* Left: Mobile hamburger */}
      <div className="flex items-center gap-3 lg:hidden">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-full text-[#0E0E0E] hover:bg-[#F1F0EC]"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-bold text-lg tracking-tight text-[#0E0E0E]">sentinel</span>
      </div>

      {/* Center Search (Subtle, minimalist pill on desktop) */}
      <div className="hidden md:flex items-center flex-1 max-w-xs ml-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#8C8C8C] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects, MPs, states..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#F1F0EC] text-[#0E0E0E] text-xs rounded-full pl-9 pr-4 py-2 placeholder-[#8C8C8C] focus:outline-none focus:ring-1 focus:ring-[#0E0E0E]"
          />
        </div>
      </div>

      {/* Right: Wise Actions & Avatar */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Refresh icon */}
        <button
          onClick={onRefreshData}
          title="Sync CAG & ISRO Telemetry"
          className="p-2 rounded-full text-[#6B6B6B] hover:text-[#0E0E0E] hover:bg-[#F1F0EC] transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#0E0E0E]' : ''}`} />
        </button>

        {/* Wise Green Pill Button (Exact Earn US$115 equivalent) */}
        <button
          onClick={onOpenDesignSpec}
          className="bg-[#15803D] hover:bg-[#166534] text-white font-medium text-xs sm:text-sm px-4 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 shadow-none"
        >
          <span>Allocation Live ₹4,950 Cr</span>
        </button>

        {/* Wise User Avatar Pill (Exact CL circle + red notification dot + chevron) */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-1.5 p-1 hover:bg-[#F1F0EC] rounded-full transition-colors cursor-pointer"
        >
          <div className="relative w-8 h-8 rounded-full bg-[#EAE8E2] text-[#0E0E0E] font-semibold text-xs flex items-center justify-center">
            <span>AS</span>
            {/* Top right notification dot */}
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
          </div>
          <ChevronRight className="w-4 h-4 text-[#6B6B6B]" />
        </button>
      </div>
    </header>
  );
};
