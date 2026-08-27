// Project API — frontend/src/api/projectApi.ts

import apiClient from './apiClient';
import { USE_MOCK_API, mockDelay } from './mockAdapter';
import type {
  Project, ProjectSummary, ProjectFilters,
  PaginatedProjects, DashboardStats,
} from '../types/project';
import {
  MOCK_PROJECTS, MOCK_DASHBOARD_STATS, MOCK_PAGINATED_PROJECTS,
} from '../mocks/mockProjects';

export async function getDashboardStats(): Promise<DashboardStats> {
  if (USE_MOCK_API) {
    await mockDelay();
    return MOCK_DASHBOARD_STATS;
  }
  const { data } = await apiClient.get<DashboardStats>('/dashboard/stats');
  return data;
}

export async function getProjects(filters?: ProjectFilters): Promise<PaginatedProjects> {
  if (USE_MOCK_API) {
    await mockDelay();
    let items = [...MOCK_PROJECTS] as ProjectSummary[];
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (p) =>
          p.projectId.toLowerCase().includes(q) ||
          p.projectName.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q)
      );
    }
    if (filters?.state) items = items.filter((p) => p.state === filters.state);
    if (filters?.riskLevel) items = items.filter((p) => p.riskLevel === filters.riskLevel);
    if (filters?.status) items = items.filter((p) => p.status === filters.status);
    return { items, total: items.length, page: 1, pageSize: 20, totalPages: 1 };
  }
  const { data } = await apiClient.get<PaginatedProjects>('/projects', { params: filters });
  return data;
}

export async function getProject(projectId: string): Promise<Project> {
  if (USE_MOCK_API) {
    await mockDelay();
    const project = MOCK_PROJECTS.find((p) => p.projectId === projectId);
    if (!project) throw new Error(`Project not found: ${projectId}`);
    return project;
  }
  const { data } = await apiClient.get<Project>(`/projects/${encodeURIComponent(projectId)}`);
  return data;
}

export async function getRecentProjects(limit = 5): Promise<ProjectSummary[]> {
  if (USE_MOCK_API) {
    await mockDelay(200);
    return MOCK_PROJECTS.slice(0, limit);
  }
  const { data } = await apiClient.get<ProjectSummary[]>('/projects/recent', {
    params: { limit },
  });
  return data;
}
