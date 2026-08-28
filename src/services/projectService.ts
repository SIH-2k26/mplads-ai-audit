import { mockProjects } from '../data/mock-projects';
import { Project } from '../types';

export const projectService = {
  async getProjects(filters?: {
    district?: string;
    category?: string;
    status?: string;
    riskLevel?: string;
    search?: string;
  }): Promise<Project[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));

    let results = [...mockProjects];

    if (filters?.district && filters.district !== 'ALL') {
      results = results.filter(
        (p) =>
          p.district.toLowerCase() ===
          filters.district?.toLowerCase()
      );
    }

    if (filters?.category && filters.category !== 'ALL') {
      results = results.filter(
        (p) =>
          p.category.toLowerCase() ===
          filters.category?.toLowerCase()
      );
    }

    if (filters?.status && filters.status !== 'ALL') {
      results = results.filter(
        (p) => p.status === filters.status
      );
    }

    if (filters?.riskLevel && filters.riskLevel !== 'ALL') {
      results = results.filter((p) => {
        if (filters.riskLevel === 'CRITICAL')
          return p.currentRiskScore >= 80;

        if (filters.riskLevel === 'HIGH')
          return (
            p.currentRiskScore >= 60 &&
            p.currentRiskScore < 80
          );

        if (filters.riskLevel === 'MEDIUM')
          return (
            p.currentRiskScore >= 35 &&
            p.currentRiskScore < 60
          );

        if (filters.riskLevel === 'LOW')
          return p.currentRiskScore < 35;

        return true;
      });
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();

      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.contractor.name.toLowerCase().includes(q) ||
          p.implementingAgency.name
            .toLowerCase()
            .includes(q) ||
          p.location.wardOrVillage
            .toLowerCase()
            .includes(q)
      );
    }

    return results;
  },

  async getProjectById(id: string): Promise<Project | null> {
    await new Promise((resolve) => setTimeout(resolve, 50));

    const project = mockProjects.find(
      (p) => p.id === id || p.code === id
    );

    return project || null;
  },

  async getProjectsSummary(district?: string) {
    const projects = await this.getProjects({ district });

    const totalCount = projects.length;

    const activeCount = projects.filter(
      (p) =>
        p.status === 'WORK_IN_PROGRESS' ||
        p.status === 'TENDER_ISSUED'
    ).length;

    const completedCount = projects.filter(
      (p) => p.status === 'COMPLETED'
    ).length;

    const atRiskCount = projects.filter(
      (p) => p.currentRiskScore >= 60
    ).length;

    const criticalCount = projects.filter(
      (p) => p.currentRiskScore >= 80
    ).length;

    const delayedCount = projects.filter(
      (p) =>
        p.timeline.some(
          (t) => t.status === 'DELAYED'
        )
    ).length;

    const totalSanctioned = projects.reduce(
      (acc, p) => acc + p.sanctionedAmount,
      0
    );

    const totalExpended = projects.reduce(
      (acc, p) => acc + p.expenditure,
      0
    );

    const totalUtilisation =
      totalSanctioned > 0
        ? (totalExpended / totalSanctioned) * 100
        : 0;

    return {
      totalCount,
      activeCount,
      completedCount,
      atRiskCount,
      criticalCount,
      delayedCount,
      totalSanctioned,
      totalExpended,
      totalUtilisation,
    };
  },
};
