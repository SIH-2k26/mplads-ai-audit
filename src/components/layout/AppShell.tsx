import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopHeader } from './TopHeader';
import { AppSidebar } from './AppSidebar';
import { ScrollToTop } from './ScrollToTop';
import { EvidenceDrawer } from '../domain/EvidenceDrawer';
import { AskAiAssistant } from '../domain/AskAiAssistant';
import { useUiStore } from '../../stores/useUiStore';
import { cn } from '../../lib/utils';
import { Toaster } from 'sonner';

export function AppShell() {
  const { sidebarCollapsed } = useUiStore();

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1D2939] flex flex-col font-sans">
      {/* Toast Notification Provider with Close (X) Button */}
      <Toaster position="top-right" richColors closeButton />

      {/* Top Fixed Header */}
      <TopHeader />

      {/* Sidebar + Main App Content */}
      <div className="flex flex-1">
        <AppSidebar />

        <main
          className={cn(
            'flex-1 p-4 sm:p-6 md:p-8 transition-all duration-300 min-w-0',
            sidebarCollapsed ? 'ml-16' : 'ml-64'
          )}
        >
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Interactive Elements */}
      <EvidenceDrawer />
      <AskAiAssistant />
      <ScrollToTop />
    </div>
  );
}
