// System API — frontend/src/api/systemApi.ts

import apiClient from './apiClient';
import { USE_MOCK_API, mockDelay } from './mockAdapter';
import type { SystemHealth } from '../types/system';

const MOCK_SYSTEM_HEALTH: SystemHealth = {
  overallStatus: 'UP',
  backend: { name: 'FastAPI Backend', status: 'UP', latencyMs: 12, version: '0.1.0-dev', lastChecked: new Date().toISOString() },
  database: { name: 'PostgreSQL', status: 'UP', latencyMs: 3, version: '15.4', lastChecked: new Date().toISOString() },
  vectorDatabase: { name: 'ChromaDB', status: 'UP', latencyMs: 8, version: '0.4.x', lastChecked: new Date().toISOString() },
  neo4j: { name: 'Neo4j Graph DB', status: 'UP', latencyMs: 15, version: '5.x', lastChecked: new Date().toISOString() },
  mlService: { name: 'ML Risk Engine', status: 'UP', latencyMs: 45, version: '2.1.0', lastChecked: new Date().toISOString() },
  ragService: { name: 'RAG / Policy Engine', status: 'UP', latencyMs: 120, version: '1.0.0', lastChecked: new Date().toISOString() },
  modelVersion: 'XGBoost-v2.1 / LightGBM-v3.0',
  riskEngineVersion: '2.1.0',
  ruleVersion: 'MPLADS-2022-R4',
  embeddingVersion: 'sentence-transformers/all-MiniLM-L6-v2',
  lastDataUpdate: '2024-11-15T06:00:00Z',
  checkedAt: new Date().toISOString(),
};

export async function getSystemHealth(): Promise<SystemHealth> {
  if (USE_MOCK_API) {
    await mockDelay(300);
    return MOCK_SYSTEM_HEALTH;
  }
  const { data } = await apiClient.get<SystemHealth>('/system/health');
  return data;
}
