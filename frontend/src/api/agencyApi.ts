// Agency API — frontend/src/api/agencyApi.ts

import apiClient from './apiClient';
import { USE_MOCK_API, mockDelay } from './mockAdapter';
import type { Agency, AgencyFilters } from '../types/agency';
import { MOCK_AGENCIES } from '../mocks/mockAgencies';

export async function getAgencies(filters?: AgencyFilters): Promise<Agency[]> {
  if (USE_MOCK_API) {
    await mockDelay();
    let items = [...MOCK_AGENCIES];
    if (filters?.riskLevel) items = items.filter((a) => a.riskLevel === filters.riskLevel);
    if (filters?.state) items = items.filter((a) => a.state === filters.state);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (a) =>
          a.agencyName.toLowerCase().includes(q) ||
          a.agencyId.toLowerCase().includes(q)
      );
    }
    return items;
  }
  const { data } = await apiClient.get<Agency[]>('/agencies', { params: filters });
  return data;
}

export async function getAgency(agencyId: string): Promise<Agency> {
  if (USE_MOCK_API) {
    await mockDelay();
    const a = MOCK_AGENCIES.find((x) => x.agencyId === agencyId);
    if (!a) throw new Error(`Agency not found: ${agencyId}`);
    return a;
  }
  const { data } = await apiClient.get<Agency>(`/agencies/${agencyId}`);
  return data;
}
