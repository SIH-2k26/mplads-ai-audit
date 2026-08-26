// Agent API — frontend/src/api/agentApi.ts

import apiClient from './apiClient';
import { USE_MOCK_API, mockDelay } from './mockAdapter';
import type { AllAgentResults } from '../types/agent';
import { getMockAgentResults } from '../mocks/mockAgents';

export async function getProjectAgents(projectId: string): Promise<AllAgentResults> {
  if (USE_MOCK_API) {
    await mockDelay(600);
    return getMockAgentResults(projectId);
  }
  const { data } = await apiClient.get<AllAgentResults>(
    `/projects/${encodeURIComponent(projectId)}/agents`
  );
  return data;
}
