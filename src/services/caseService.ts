import { mockCases } from '../data/mock-cases';
import { CaseInvestigation, CaseStatus } from '../types';

export const caseService = {
  async getCases(filters?: {
    status?: CaseStatus | 'ALL';
    priority?: string;
    search?: string;
  }): Promise<CaseInvestigation[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    let results = [...mockCases];

    if (filters?.status && filters.status !== 'ALL') {
      results = results.filter((c) => c.status === filters.status);
    }

    if (filters?.priority && filters.priority !== 'ALL') {
      results = results.filter((c) => c.priority === filters.priority);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (c) =>
          c.caseNumber.toLowerCase().includes(q) ||
          c.projectTitle.toLowerCase().includes(q) ||
          c.assignedInvestigator.toLowerCase().includes(q)
      );
    }

    return results;
  },

  async getCaseById(id: string): Promise<CaseInvestigation | null> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return mockCases.find((c) => c.id === id || c.caseNumber === id) || null;
  },

  async updateCaseVerdict(
    id: string,
    verdict: CaseStatus,
    verdictNotes: string,
    verdictBy: string
  ): Promise<CaseInvestigation | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const targetCase = mockCases.find((c) => c.id === id || c.caseNumber === id);
    if (!targetCase) return null;

    targetCase.status = verdict;
    targetCase.verdictNotes = verdictNotes;
    targetCase.verdictBy = verdictBy;
    targetCase.verdictDate = new Date().toISOString().split('T')[0];
    targetCase.lastUpdated = new Date().toISOString().split('T')[0];

    targetCase.timeline.push({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN'),
      user: verdictBy,
      role: 'DISTRICT_COLLECTOR',
      action: `Human Verdict: ${verdict.replace('_', ' ')}`,
      notes: verdictNotes,
    });

    return { ...targetCase };
  },
};
