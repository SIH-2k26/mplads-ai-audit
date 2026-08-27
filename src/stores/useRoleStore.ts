import { create } from 'zustand';
import { UserRole } from '../types';

interface RoleState {
  currentRole: UserRole;
  userTitle: string;
  userJurisdiction: string;
  selectedState: string;
  selectedDistrict: string;
  selectedConstituency: string;
  setRole: (role: UserRole) => void;
  setDistrict: (district: string) => void;
  setState: (state: string) => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  currentRole: 'DISTRICT_AUTHORITY',
  userTitle: 'District Magistrate & Collector',
  userJurisdiction: 'Pune District, Maharashtra',
  selectedState: 'Maharashtra',
  selectedDistrict: 'Pune',
  selectedConstituency: 'Pune Parliamentary Constituency',

  setRole: (role: UserRole) => {
    switch (role) {
      case 'MP':
        set({
          currentRole: 'MP',
          userTitle: 'Member of Parliament (Lok Sabha)',
          userJurisdiction: 'Pune Parliamentary Constituency',
        });
        break;
      case 'DISTRICT_AUTHORITY':
        set({
          currentRole: 'DISTRICT_AUTHORITY',
          userTitle: 'District Magistrate & Collector',
          userJurisdiction: 'Pune District, Maharashtra',
        });
        break;
      case 'STATE_NODAL':
        set({
          currentRole: 'STATE_NODAL',
          userTitle: 'State Nodal Authority (Planning Dept)',
          userJurisdiction: 'Government of Maharashtra',
        });
        break;
      case 'MINISTRY_DIID':
        set({
          currentRole: 'MINISTRY_DIID',
          userTitle: 'Director General / DIID Oversight',
          userJurisdiction: 'Ministry of Statistics & Programme Implementation (MoSPI), New Delhi',
        });
        break;
    }
  },

  setDistrict: (district: string) => set({ selectedDistrict: district }),
  setState: (state: string) => set({ selectedState: state }),
}));
