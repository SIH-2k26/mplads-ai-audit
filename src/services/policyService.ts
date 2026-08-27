import { mockPolicies } from '../data/mock-policies';
import { PolicyRule } from '../types';

export const policyService = {
  async getPolicies(search?: string): Promise<PolicyRule[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    let results = [...mockPolicies];
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.documentName.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.section.toLowerCase().includes(q)
      );
    }
    return results;
  },

  async getPolicyById(id: string): Promise<PolicyRule | null> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return mockPolicies.find((p) => p.id === id || p.code === id) || null;
  },
};
