import { mockContractors } from '../data/mock-contractors';
import { Contractor } from '../types';

export const contractorService = {
  async getContractors(search?: string): Promise<Contractor[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    let results = [...mockContractors];
    if (search) {
      const q = search.toLowerCase();
      results = results.filter((c) => c.name.toLowerCase().includes(q) || c.pan.toLowerCase().includes(q));
    }
    return results;
  },

  async getContractorById(id: string): Promise<Contractor | null> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return mockContractors.find((c) => c.id === id || c.pan === id) || null;
  },
};
