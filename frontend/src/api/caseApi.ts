// Case API — frontend/src/api/caseApi.ts

import apiClient from './apiClient';
import { USE_MOCK_API, mockDelay } from './mockAdapter';
import type {
  InvestigationCase, CaseFilters, PaginatedCases, VerdictSubmission,
} from '../types/case';
import { MOCK_CASES, MOCK_PAGINATED_CASES } from '../mocks/mockCases';

export async function getCases(filters?: CaseFilters): Promise<PaginatedCases> {
  if (USE_MOCK_API) {
    await mockDelay();
    let items = [...MOCK_CASES];
    if (filters?.status) items = items.filter((c) => c.status === filters.status);
    if (filters?.riskLevel) items = items.filter((c) => c.riskLevel === filters.riskLevel);
    if (filters?.state) items = items.filter((c) => c.state === filters.state);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (c) =>
          c.caseId.toLowerCase().includes(q) ||
          c.projectName.toLowerCase().includes(q)
      );
    }
    return { items, total: items.length, page: 1, pageSize: 20, totalPages: 1 };
  }
  const { data } = await apiClient.get<PaginatedCases>('/cases', { params: filters });
  return data;
}

export async function getCase(caseId: string): Promise<InvestigationCase> {
  if (USE_MOCK_API) {
    await mockDelay();
    const c = MOCK_CASES.find((x) => x.caseId === caseId);
    if (!c) throw new Error(`Case not found: ${caseId}`);
    return c;
  }
  const { data } = await apiClient.get<InvestigationCase>(`/cases/${caseId}`);
  return data;
}

export async function submitVerdict(submission: VerdictSubmission): Promise<InvestigationCase> {
  if (USE_MOCK_API) {
    await mockDelay(800);
    const c = MOCK_CASES.find((x) => x.caseId === submission.caseId);
    if (!c) throw new Error(`Case not found: ${submission.caseId}`);
    return {
      ...c,
      status: 'CLOSED',
      verdict: {
        verdictType: submission.verdictType,
        officerName: submission.officerName,
        officerRole: submission.officerRole,
        remarks: submission.remarks,
        submittedAt: new Date().toISOString(),
      },
    };
  }
  const { data } = await apiClient.post<InvestigationCase>(
    `/cases/${submission.caseId}/verdict`,
    submission
  );
  return data;
}
