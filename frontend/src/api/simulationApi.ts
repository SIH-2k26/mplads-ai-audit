// Simulation API — frontend/src/api/simulationApi.ts
// Frontend sends parameters only. Backend performs all calculations.

import apiClient from './apiClient';
import { USE_MOCK_API, mockDelay } from './mockAdapter';
import type { SimulationRequest, SimulationResult } from '../types/simulation';
import { getMockSimulationResult } from '../mocks/mockSimulation';

export async function runSimulation(request: SimulationRequest): Promise<SimulationResult> {
  if (USE_MOCK_API) {
    await mockDelay(1200); // simulate backend computation time
    return getMockSimulationResult(request);
  }
  const { data } = await apiClient.post<SimulationResult>('/simulation/run', request);
  return data;
}
