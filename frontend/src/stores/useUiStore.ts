import { create } from 'zustand';
import { Alert, Project } from '../types';

interface UiState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  globalSearchOpen: boolean;
  setGlobalSearchOpen: (open: boolean) => void;

  aiAssistantOpen: boolean;
  setAiAssistantOpen: (open: boolean) => void;

  profileModalOpen: boolean;
  setProfileModalOpen: (open: boolean) => void;

  platformLoading: boolean;
  platformLoadingTitle: string;
  startPlatformLoading: (roleTitle?: string) => void;
  stopPlatformLoading: () => void;

  activeEvidenceDrawerItem: {
    isOpen: boolean;
    title: string;
    project?: Project | null;
    alert?: Alert | null;
  };

  openEvidenceDrawer: (
    payload: {
      title: string;
      project?: Project | null;
      alert?: Alert | null;
    }
  ) => void;

  closeEvidenceDrawer: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarCollapsed: false,

  toggleSidebar: () =>
    set((s) => ({
      sidebarCollapsed: !s.sidebarCollapsed,
    })),

  setSidebarCollapsed: (collapsed) =>
    set({
      sidebarCollapsed: collapsed,
    }),

  globalSearchOpen: false,

  setGlobalSearchOpen: (open) =>
    set({
      globalSearchOpen: open,
    }),

  aiAssistantOpen: false,

  setAiAssistantOpen: (open) =>
    set({
      aiAssistantOpen: open,
    }),

  profileModalOpen: false,

  setProfileModalOpen: (open) =>
    set({
      profileModalOpen: open,
    }),

  platformLoading: false,
  platformLoadingTitle: 'District Command Cockpit',

  startPlatformLoading: (roleTitle = 'District Command Cockpit') => {
    set({
      platformLoading: true,
      platformLoadingTitle: roleTitle,
    });
    setTimeout(() => {
      set({ platformLoading: false });
    }, 1800);
  },

  stopPlatformLoading: () =>
    set({
      platformLoading: false,
    }),

  activeEvidenceDrawerItem: {
    isOpen: false,
    title: '',
    project: null,
    alert: null,
  },

  openEvidenceDrawer: (payload) =>
    set({
      activeEvidenceDrawerItem: {
        isOpen: true,
        title: payload.title,
        project: payload.project || null,
        alert: payload.alert || null,
      },
    }),

  closeEvidenceDrawer: () =>
    set({
      activeEvidenceDrawerItem: {
        isOpen: false,
        title: '',
        project: null,
        alert: null,
      },
    }),
}));
