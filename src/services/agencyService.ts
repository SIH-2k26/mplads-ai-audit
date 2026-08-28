import { mockAgencies } from '../data/mock-agencies';
import { ImplementingAgency } from '../types';

export const agencyService = {
  async getAgencies(search?: string): Promise<ImplementingAgency[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    let results = [...mockAgencies];
    if (search) {
      const q = search.toLowerCase();
      results = results.filter((a) => a.name.toLowerCase().includes(q) || a.department.toLowerCase().includes(q));
    }
    return results;
  },

  async getAgencyById(id: string): Promise<ImplementingAgency | null> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return mockAgencies.find((a) => a.id === id) || null;
  },
};
