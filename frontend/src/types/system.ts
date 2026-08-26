// System health types — frontend/src/types/system.ts

export type ServiceStatus = 'UP' | 'DOWN' | 'DEGRADED' | 'UNKNOWN';

export interface ServiceHealth {
  name: string;
  status: ServiceStatus;
  latencyMs?: number;
  version?: string;
  lastChecked: string;
  details?: string;
}

export interface SystemHealth {
  overallStatus: ServiceStatus;
  backend: ServiceHealth;
  database: ServiceHealth;
  vectorDatabase: ServiceHealth;
  neo4j: ServiceHealth;
  mlService: ServiceHealth;
  ragService: ServiceHealth;
  modelVersion?: string;
  riskEngineVersion?: string;
  ruleVersion?: string;
  embeddingVersion?: string;
  lastDataUpdate?: string;
  checkedAt: string;
}
