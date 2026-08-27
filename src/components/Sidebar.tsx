import React, { useState } from 'react';
import {
  Home,
  CreditCard,
  ListOrdered,
  ArrowLeftRight,
  Users,
  BarChart2,
  ChevronDown,
  ChevronUp,
  Clock,
  Lock,
  FileCheck2,
  Send,
  HelpCircle,
  Settings,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  flaggedCount?: number;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  flaggedCount = 38,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const [paymentsExpanded, setPaymentsExpanded] = useState<boolean>(true);

  const navItems = [
    { id: 'overview', label: 'Home', icon: Home },
    { id: 'fund-cards', label: 'Cards', icon: CreditCard },
    { id: 'flagged-projects', label: 'Transactions', icon: ListOrdered, badge: flaggedCount },
  ];

  const subPaymentsItems = [
    { id: 'scheduled-audits', label: 'Scheduled', icon: Clock },
    { id: 'disbursal-freezes', label: 'Direct Debits', icon: Lock },
    { id: 'recurring-audits', label: 'Recurring card payments', icon: Clock },
    { id: 'payment-requests', label: 'Payment requests', icon: FileCheck2 },
    { id: 'bill-splits', label: 'Bill splits', icon: ArrowLeftRight },
  ];

  const bottomNavItems = [
    { id: 'recipients', label: 'Recipients', icon: Users },
    { id: 'insights', label: 'Insights', icon: BarChart2 },
  ];

  const handleNavClick = (id: string) => {
    onSelectView(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        id="sidebar-wise"
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 w-64 bg-white flex flex-col justify-between py-6 px-4 transition-transform duration-200 border-r border-[#F1F0EC] lg:border-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Section */}
        <div className="space-y-6">
          {/* Wise-Style Wordmark Logo */}
          <div className="flex items-center justify-between px-2 pt-1 pb-2">
            <button
              onClick={() => handleNavClick('overview')}
              className="flex items-center gap-2 text-left group cursor-pointer focus:outline-none"
            >
              {/* Geometric Flag/Lightning Symbol */}
              <div className="w-8 h-8 flex items-center justify-center text-[#0E0E0E]">
                <svg
                  viewBox="0 0 24 24"
                  className="w-7 h-7 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4 3h16l-7 18h-4l3-8H5l3-10z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-[#0E0E0E] lowercase leading-none">
                  sentinel
                </span>
                <span className="text-[10px] text-[#6B6B6B] font-medium tracking-wide uppercase mt-0.5">
                  MPLADS • MoSPI
                </span>
              </div>
            </button>

            {/* Mobile Close */}
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-full text-[#6B6B6B] hover:text-[#0E0E0E] hover:bg-[#F1F0EC] lg:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Items (Exact Wise Spacing & Rounded Pill Active States) */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-sm font-medium transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#EAE8E2] text-[#0E0E0E] font-semibold'
                      : 'text-[#0E0E0E] hover:bg-[#F1F0EC] hover:text-[#0E0E0E]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon className="w-5 h-5 stroke-[1.75]" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && item.badge > 0 && (
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[#0E0E0E] text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Expandable Group: Payments (Matching Wise reference) */}
            <div className="pt-1">
              <button
                onClick={() => setPaymentsExpanded(!paymentsExpanded)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-sm font-medium transition-all text-left cursor-pointer text-[#0E0E0E] hover:bg-[#F1F0EC]`}
              >
                <div className="flex items-center gap-3.5">
                  <ArrowLeftRight className="w-5 h-5 stroke-[1.75]" />
                  <span>Payments</span>
                </div>
                {paymentsExpanded ? (
                  <ChevronUp className="w-4 h-4 text-[#6B6B6B]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#6B6B6B]" />
                )}
              </button>

              {/* Collapsed Sub-items (Indented in lighter gray) */}
              {paymentsExpanded && (
                <div className="pl-12 pr-2 py-1 space-y-1 transition-all">
                  {subPaymentsItems.map((sub) => {
                    const isSubActive = currentView === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => handleNavClick(sub.id)}
                        className={`w-full text-left py-2 px-3 rounded-full text-sm transition-colors block cursor-pointer ${
                          isSubActive
                            ? 'text-[#0E0E0E] font-semibold bg-[#EAE8E2]'
                            : 'text-[#6B6B6B] hover:text-[#0E0E0E] hover:bg-[#F1F0EC]'
                        }`}
                      >
                        {sub.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Nav Items */}
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-sm font-medium transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#EAE8E2] text-[#0E0E0E] font-semibold'
                      : 'text-[#0E0E0E] hover:bg-[#F1F0EC] hover:text-[#0E0E0E]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon className="w-5 h-5 stroke-[1.75]" />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info in sidebar */}
        <div className="px-3 pt-4 border-t border-[#F1F0EC] text-xs text-[#6B6B6B] flex items-center justify-between">
          <span>MPLADS Sentinel v2.4</span>
          <span className="w-2 h-2 rounded-full bg-[#9FE870]" title="System Live" />
        </div>
      </aside>
    </>
  );
};
