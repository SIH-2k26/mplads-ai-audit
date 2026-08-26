// Contractor API — frontend/src/api/contractorApi.ts

import apiClient from './apiClient';
import { USE_MOCK_API, mockDelay } from './mockAdapter';
import type { Contractor, ContractorFilters } from '../types/contractor';
import { MOCK_CONTRACTORS } from '../mocks/mockContractors';

export async function getContractors(filters?: ContractorFilters): Promise<Contractor[]> {
  if (USE_MOCK_API) {
    await mockDelay();
    let items = [...MOCK_CONTRACTORS];
    if (filters?.riskLevel) items = items.filter((c) => c.riskLevel === filters.riskLevel);
    if (filters?.state) items = items.filter((c) => c.states.includes(filters.state!));
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (c) =>
          c.contractorName.toLowerCase().includes(q) ||
          c.contractorId.toLowerCase().includes(q)
      );
    }
    return items;
  }
  const { data } = await apiClient.get<Contractor[]>('/contractors', { params: filters });
  return data;
}

export async function getContractor(contractorId: string): Promise<Contractor> {
  if (USE_MOCK_API) {
    await mockDelay();
    const c = MOCK_CONTRACTORS.find((x) => x.contractorId === contractorId);
    if (!c) throw new Error(`Contractor not found: ${contractorId}`);
    return c;
  }
  const { data } = await apiClient.get<Contractor>(`/contractors/${contractorId}`);
  return data;
}
