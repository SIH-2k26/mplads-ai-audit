import { mockCases } from '../data/mock-cases';
import { CaseInvestigation, CaseStatus } from '../types';

export interface ModelFeedbackEntry {
  id: string;
  caseId: string;
  projectId: string;
  projectTitle: string;
  riskScore: number;
  modelVersion: string;
  decision: CaseStatus;
  officer: string;
  reason: string;
  timestamp: string;
}

export const modelFeedbackLog: ModelFeedbackEntry[] = [
  {
    id: 'FB-001',
    caseId: 'CASE-2026-0182',
    projectId: 'P-1023',
    projectTitle: 'Ward 17 Community Hall Complex',
    riskScore: 86,
    modelVersion: 'v1.4-ensemble',
    decision: 'CONFIRMED_ISSUE',
    officer: 'Dr. Ramesh Deshmukh (Addl. Collector)',
    reason: 'Single tender collusion confirmed with local syndicate; cost deviation unjustified.',
    timestamp: '2026-08-20T14:20:00Z',
  },
  {
    id: 'FB-002',
    caseId: 'CASE-2026-0144',
    projectId: 'P-0412',
    projectTitle: 'STEM Smart Classroom Phase I',
    riskScore: 64,
    modelVersion: 'v1.4-ensemble',
    decision: 'FALSE_POSITIVE',
    officer: 'S. Kulkarni (Vigilance Officer)',
    reason: 'Site-specific bedrock foundation excavation cost variance justified by PWD Technical Sanction Memo.',
    timestamp: '2026-08-22T09:15:00Z',
  },
];

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

    // Append to model feedback loop dataset for continuous ML learning
    modelFeedbackLog.unshift({
      id: `FB-${Date.now()}`,
      caseId: targetCase.id,
      projectId: targetCase.projectId,
      projectTitle: targetCase.projectTitle,
      riskScore: targetCase.riskScore,
      modelVersion: 'v1.4-ensemble',
      decision: verdict,
      officer: verdictBy,
      reason: verdictNotes,
      timestamp: new Date().toISOString(),
    });

    return { ...targetCase };
  },

  getModelFeedbackLog(): ModelFeedbackEntry[] {
    return [...modelFeedbackLog];
  },
};
