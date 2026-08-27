// Alert API — frontend/src/api/alertApi.ts

import apiClient from './apiClient';
import { USE_MOCK_API, mockDelay } from './mockAdapter';
import type { Alert, AlertFilters, PaginatedAlerts } from '../types/alert';
import { MOCK_ALERTS, MOCK_PAGINATED_ALERTS } from '../mocks/mockAlerts';

export async function getAlerts(filters?: AlertFilters): Promise<PaginatedAlerts> {
  if (USE_MOCK_API) {
    await mockDelay();
    let items = [...MOCK_ALERTS];
    if (filters?.severity) items = items.filter((a) => a.severity === filters.severity);
    if (filters?.status) items = items.filter((a) => a.status === filters.status);
    if (filters?.state) items = items.filter((a) => a.state === filters.state);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (a) =>
          a.alertId.toLowerCase().includes(q) ||
          a.projectName.toLowerCase().includes(q) ||
          a.alertType.toLowerCase().includes(q)
      );
    }
    return { items, total: items.length, page: 1, pageSize: 20, totalPages: 1 };
  }
  const { data } = await apiClient.get<PaginatedAlerts>('/alerts', { params: filters });
  return data;
}

export async function getAlert(alertId: string): Promise<Alert> {
  if (USE_MOCK_API) {
    await mockDelay();
    const alert = MOCK_ALERTS.find((a) => a.alertId === alertId);
    if (!alert) throw new Error(`Alert not found: ${alertId}`);
    return alert;
  }
  const { data } = await apiClient.get<Alert>(`/alerts/${alertId}`);
  return data;
}

export async function updateAlertStatus(
  alertId: string,
  status: string
): Promise<Alert> {
  if (USE_MOCK_API) {
    await mockDelay();
    const alert = MOCK_ALERTS.find((a) => a.alertId === alertId);
    if (!alert) throw new Error(`Alert not found: ${alertId}`);
    return { ...alert, status: status as Alert['status'] };
  }
  const { data } = await apiClient.patch<Alert>(`/alerts/${alertId}/status`, { status });
  return data;
}

export async function getRecentAlerts(limit = 5): Promise<Alert[]> {
  if (USE_MOCK_API) {
    await mockDelay(200);
    return MOCK_ALERTS.slice(0, limit);
  }
  const { data } = await apiClient.get<Alert[]>('/alerts/recent', { params: { limit } });
  return data;
}
