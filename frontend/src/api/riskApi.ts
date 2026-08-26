// Risk API — frontend/src/api/riskApi.ts

import apiClient from './apiClient';
import { USE_MOCK_API, mockDelay } from './mockAdapter';
import type {
  RiskResult, RiskHistory, ShapExplanation,
  EarlyWarnings, StateRiskSummary, RiskDistribution,
} from '../types/risk';
import {
  getMockRisk, getMockRiskHistory, getMockShap,
  getMockEarlyWarnings, MOCK_STATE_RISK, MOCK_RISK_DISTRIBUTION, MOCK_RISK_TREND,
} from '../mocks/mockRisk';

export async function getProjectRisk(projectId: string): Promise<RiskResult> {
  if (USE_MOCK_API) {
    await mockDelay();
    return getMockRisk(projectId);
  }
  const { data } = await apiClient.get<RiskResult>(
    `/projects/${encodeURIComponent(projectId)}/risk`
  );
  return data;
}

export async function getRiskHistory(projectId: string): Promise<RiskHistory> {
  if (USE_MOCK_API) {
    await mockDelay();
    return getMockRiskHistory(projectId);
  }
  const { data } = await apiClient.get<RiskHistory>(
    `/projects/${encodeURIComponent(projectId)}/risk/history`
  );
  return data;
}

export async function getShapExplanation(projectId: string): Promise<ShapExplanation> {
  if (USE_MOCK_API) {
    await mockDelay();
    return getMockShap(projectId);
  }
  const { data } = await apiClient.get<ShapExplanation>(
    `/projects/${encodeURIComponent(projectId)}/risk/explain`
  );
  return data;
}

export async function getEarlyWarnings(projectId: string): Promise<EarlyWarnings> {
  if (USE_MOCK_API) {
    await mockDelay();
    return getMockEarlyWarnings(projectId);
  }
  const { data } = await apiClient.get<EarlyWarnings>(
    `/projects/${encodeURIComponent(projectId)}/risk/warnings`
  );
  return data;
}

export async function getStateRiskSummary(): Promise<StateRiskSummary[]> {
  if (USE_MOCK_API) {
    await mockDelay(200);
    return MOCK_STATE_RISK;
  }
  const { data } = await apiClient.get<StateRiskSummary[]>('/risk/states');
  return data;
}

export async function getRiskDistribution(): Promise<RiskDistribution> {
  if (USE_MOCK_API) {
    await mockDelay(200);
    return MOCK_RISK_DISTRIBUTION;
  }
  const { data } = await apiClient.get<RiskDistribution>('/risk/distribution');
  return data;
}

export async function getRiskTrend(): Promise<{ month: string; avgRisk: number }[]> {
  if (USE_MOCK_API) {
    await mockDelay(200);
    return MOCK_RISK_TREND;
  }
  const { data } = await apiClient.get('/risk/trend');
  return data;
}
