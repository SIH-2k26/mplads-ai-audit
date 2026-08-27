import { mockAlerts } from '../data/mock-alerts';
import { Alert, AlertSeverity, AlertType } from '../types';

export const alertService = {
  async getAlerts(filters?: {
    severity?: AlertSeverity | 'ALL';
    type?: AlertType | 'ALL';
    status?: string;
    district?: string;
    search?: string;
  }): Promise<Alert[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    let results = [...mockAlerts];

    if (filters?.severity && filters.severity !== 'ALL') {
      results = results.filter((a) => a.severity === filters.severity);
    }

    if (filters?.type && filters.type !== 'ALL') {
      results = results.filter((a) => a.type === filters.type);
    }

    if (filters?.status && filters.status !== 'ALL') {
      results = results.filter((a) => a.status === filters.status);
    }

    if (filters?.district && filters.district !== 'ALL') {
      results = results.filter((a) => a.district.toLowerCase() === filters.district?.toLowerCase());
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (a) =>
          a.projectTitle.toLowerCase().includes(q) ||
          a.projectCode.toLowerCase().includes(q) ||
          a.whyFlagged.toLowerCase().includes(q)
      );
    }

    return results;
  },

  async getAlertById(id: string): Promise<Alert | null> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return mockAlerts.find((a) => a.id === id) || null;
  },

  async getAlertSummary() {
    const alerts = await this.getAlerts();
    return {
      total: alerts.length,
      critical: alerts.filter((a) => a.severity === 'CRITICAL').length,
      high: alerts.filter((a) => a.severity === 'HIGH').length,
      slaBreaches: alerts.filter((a) => a.type === 'SLA_BREACH' || a.slaDaysRemaining <= 2).length,
      active: alerts.filter((a) => a.status === 'ACTIVE').length,
    };
  },
};
