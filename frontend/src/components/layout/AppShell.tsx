import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopHeader } from './TopHeader';
import { AppSidebar } from './AppSidebar';
import { ScrollToTop } from './ScrollToTop';
import { EvidenceDrawer } from '../domain/EvidenceDrawer';
import { AskAiAssistant } from '../domain/AskAiAssistant';
import { WiseOfficerProfileModal } from '../WiseOfficerProfileModal';
import { useUiStore } from '../../stores/useUiStore';
import { useRoleStore } from '../../stores/useRoleStore';
import { cn } from '../../lib/utils';
import { Toaster } from 'sonner';

export function AppShell() {
  const { sidebarCollapsed } = useUiStore();
  const { setRole } = useRoleStore();
  const location = useLocation();

  // Automatically synchronize active role based on the current URL route
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/district')) {
      setRole('DISTRICT_AUTHORITY');
    } else if (path.startsWith('/mp')) {
      setRole('MP');
    } else if (path.startsWith('/state') || path.startsWith('/national')) {
      setRole('STATE_NODAL');
    } else if (path.startsWith('/ministry') || path.startsWith('/intelligence')) {
      setRole('MINISTRY_DIID');
    }
  }, [location.pathname, setRole]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-[#0E0E0E]">
      <Toaster position="top-right" richColors closeButton />

      <TopHeader />

      <div className="flex flex-1">
        <AppSidebar />

        <main
          className={cn(
            'flex-1 transition-all duration-300 min-w-0 bg-white',
            sidebarCollapsed ? 'ml-16' : 'ml-64'
          )}
        >
          <div className="mx-auto px-4 sm:px-8 py-6 max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      <EvidenceDrawer />
      <AskAiAssistant />
      <WiseOfficerProfileModal />
      <ScrollToTop />
    </div>
  );
}
