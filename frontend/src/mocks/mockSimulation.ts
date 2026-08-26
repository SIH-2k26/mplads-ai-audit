// Mock Simulation — frontend/src/mocks/mockSimulation.ts
// Frontend sends request parameters; backend computes the result.
// This mock simulates what backend would return.

import type { SimulationRequest, SimulationResult } from '../types/simulation';

export function getMockSimulationResult(request: SimulationRequest): SimulationResult {
  // NOTE: These are placeholder values for UI testing only.
  // Real calculations must come from backend.
  const baseRisk = 45;
  const delayImpact = request.additionalDelayDays * 0.08;
  const costImpact = request.costIncreasePercent * 0.6;
  const progressImpact = request.progressChangePercent * -0.3;
  const paymentImpact = request.paymentDelayDays * 0.05;

  const projectedRisk = Math.min(
    100,
    Math.max(0, baseRisk + delayImpact + costImpact + progressImpact + paymentImpact)
  );

  return {
    projectId: request.projectId,
    currentRisk: baseRisk,
    projectedRisk: Math.round(projectedRisk),
    riskDelta: Math.round(projectedRisk - baseRisk),
    completionProbability: Math.max(0, 1 - projectedRisk / 100 - 0.1),
    costOverrunProbability: Math.min(1, projectedRisk / 100 + costImpact / 100),
    delayProbability: Math.min(1, projectedRisk / 100 + delayImpact / 100),
    scenarioNarrative:
      `Under the simulated scenario (${request.additionalDelayDays} additional days delay, ` +
      `${request.costIncreasePercent}% cost increase), the projected risk score increases ` +
      `to ${Math.round(projectedRisk)}. This is a frontend simulation placeholder — ` +
      `real projections will be computed by the backend ML model.`,
    computedAt: new Date().toISOString(),
  };
}
