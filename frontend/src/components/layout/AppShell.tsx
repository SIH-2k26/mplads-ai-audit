import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopHeader } from './TopHeader';
import { AppSidebar } from './AppSidebar';
import { ScrollToTop } from './ScrollToTop';
import { EvidenceDrawer } from '../domain/EvidenceDrawer';
import { AskAiAssistant } from '../domain/AskAiAssistant';
import { WiseOfficerProfileModal } from '../WiseOfficerProfileModal';
import { PlatformLoadingScreen } from '../common/PlatformLoadingScreen';
import { useUiStore } from '../../stores/useUiStore';
import { useRoleStore } from '../../stores/useRoleStore';
import { cn } from '../../lib/utils';
import { Toaster } from 'sonner';

export function AppShell() {
  const { sidebarCollapsed } = useUiStore();
  const { setRole } = useRoleStore();
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(true);

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

  // Loading transition screen between landing page and dashboard routes
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const getRoleTitle = (pathname: string) => {
    if (pathname.startsWith('/district')) return 'District Command Cockpit';
    if (pathname.startsWith('/mp')) return 'Member of Parliament View';
    if (pathname.startsWith('/state') || pathname.startsWith('/national')) return 'State Nodal Authority';
    if (pathname.startsWith('/ministry') || pathname.startsWith('/intelligence')) return 'Ministry DIID National Centre';
    if (pathname.startsWith('/projects')) return 'National Projects Explorer';
    if (pathname.startsWith('/cases')) return 'Forensic Investigation Workspace';
    if (pathname.startsWith('/alerts')) return 'Early Warning Signals Feed';
    if (pathname.startsWith('/reports')) return 'Audit & Compliance Registry';
    if (pathname.startsWith('/risk-assessment')) return 'Explainable Risk Simulator';
    return 'SANCHAY Operational Cockpit';
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-[#0E0E0E] relative">
      {/* Loading Transition Screen (Instant solid mount, zero glimpse) */}
      <PlatformLoadingScreen
        isLoading={isTransitioning}
        roleTitle={getRoleTitle(location.pathname)}
      />

      <Toaster position="top-right" richColors closeButton />

      <div className={`flex flex-col min-h-screen transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
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
      </div>

      <EvidenceDrawer />
      <AskAiAssistant />
      <WiseOfficerProfileModal />
      <ScrollToTop />
    </div>
  );
}
