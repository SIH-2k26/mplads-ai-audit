// useRisk hook — frontend/src/hooks/useRisk.ts

import { useState, useEffect, useCallback } from 'react';
import {
  getProjectRisk, getRiskHistory, getShapExplanation,
  getEarlyWarnings, getStateRiskSummary, getRiskDistribution, getRiskTrend,
} from '../api/riskApi';
import type {
  RiskResult, RiskHistory, ShapExplanation,
  EarlyWarnings, StateRiskSummary, RiskDistribution,
} from '../types/risk';

export function useProjectRisk(projectId: string) {
  const [risk, setRisk] = useState<RiskResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjectRisk(projectId);
      setRisk(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load risk data');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { load(); }, [load]);
  return { risk, loading, error, retry: load };
}

export function useRiskHistory(projectId: string) {
  const [history, setHistory] = useState<RiskHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getRiskHistory(projectId)
      .then(setHistory)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load history'))
      .finally(() => setLoading(false));
  }, [projectId]);

  return { history, loading, error };
}

export function useShapExplanation(projectId: string) {
  const [shap, setShap] = useState<ShapExplanation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getShapExplanation(projectId)
      .then(setShap)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load SHAP data'))
      .finally(() => setLoading(false));
  }, [projectId]);

  return { shap, loading, error };
}

export function useEarlyWarnings(projectId: string) {
  const [warnings, setWarnings] = useState<EarlyWarnings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getEarlyWarnings(projectId)
      .then(setWarnings)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load predictions'))
      .finally(() => setLoading(false));
  }, [projectId]);

  return { warnings, loading, error };
}

export function useStateRiskSummary() {
  const [data, setData] = useState<StateRiskSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getStateRiskSummary()
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load state data'))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useRiskDistribution() {
  const [distribution, setDistribution] = useState<RiskDistribution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRiskDistribution().then(setDistribution).finally(() => setLoading(false));
  }, []);

  return { distribution, loading };
}

export function useRiskTrend() {
  const [trend, setTrend] = useState<{ month: string; avgRisk: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRiskTrend().then(setTrend).finally(() => setLoading(false));
  }, []);

  return { trend, loading };
}
