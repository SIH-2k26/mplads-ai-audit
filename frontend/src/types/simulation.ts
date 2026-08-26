// Simulation types — frontend/src/types/simulation.ts
// Frontend only sends parameters; all calculations happen on backend.

export interface SimulationRequest {
  projectId: string;
  additionalDelayDays: number;
  costIncreasePercent: number;
  progressChangePercent: number;
  paymentDelayDays: number;
  completionDelayDays: number;
}

export interface SimulationResult {
  projectId: string;
  currentRisk: number;
  projectedRisk: number;
  riskDelta: number;
  completionProbability: number;
  costOverrunProbability: number;
  delayProbability: number;
  scenarioNarrative?: string;
  computedAt: string;
}
