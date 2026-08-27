import { mockDistricts, mockStates } from '../data/mock-geo';
import {
  mockPortfolioDistribution,
  mockNationalRiskTrend,
  mockFinancialVsPhysicalTrajectory,
  mockSystemicRiskCategories,
} from '../data/mock-analytics';

export const analyticsService = {
  async getDistricts(state?: string) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return mockDistricts;
  },

  async getStates() {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return mockStates;
  },

  async getNationalOverview() {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return {
      totalProjects: 7842,
      activeProjects: 5218,
      highRiskProjects: 1104,
      criticalProjects: 287,
      totalSanctionedAmount: 38120000000, // ₹3,812 Cr
      nationalUtilisationRate: 74.2,
      delayedProjectsCount: 416,
      openCasesCount: 192,
    };
  },

  async getStateOverview(stateCode: string = 'MH') {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return {
      stateName: 'Maharashtra',
      totalProjects: 2481,
      totalSanctionedAmount: 12480000000, // ₹1,248 Cr
      totalUtilisedAmount: 8930000000,   // ₹893 Cr
      utilisationRate: 71.6,
      highRiskCount: 184,
      criticalCount: 42,
      delayedCount: 91,
      duplicateClusters: 23,
      contractorConcentrationDistricts: 12,
    };
  },

  async getPortfolioDistribution() {
    await new Promise((resolve) => setTimeout(resolve, 40));
    return mockPortfolioDistribution;
  },

  async getNationalRiskTrend() {
    await new Promise((resolve) => setTimeout(resolve, 40));
    return mockNationalRiskTrend;
  },

  async getTrajectoryComparison() {
    await new Promise((resolve) => setTimeout(resolve, 40));
    return mockFinancialVsPhysicalTrajectory;
  },

  async getSystemicRisks() {
    await new Promise((resolve) => setTimeout(resolve, 40));
    return mockSystemicRiskCategories;
  },
};
