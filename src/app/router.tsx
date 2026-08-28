import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { LandingPage } from '../pages/LandingPage';
import { MpDashboardPage } from '../pages/MpDashboardPage';
import { DistrictDashboardPage } from '../pages/DistrictDashboardPage';
import { StateDashboardPage } from '../pages/StateDashboardPage';
import { MinistryDashboardPage } from '../pages/MinistryDashboardPage';
import { ProjectTwinPage } from '../pages/ProjectTwinPage';
import { ProjectsExplorerPage } from '../pages/ProjectsExplorerPage';
import { AlertsPage } from '../pages/AlertsPage';
import { CasesPage } from '../pages/CasesPage';
import { CaseDetailPage } from '../pages/CaseDetailPage';
import { ContractorsPage } from '../pages/ContractorsPage';
import { AgenciesPage } from '../pages/AgenciesPage';
import { MapsPage } from '../pages/MapsPage';
import { CompliancePage } from '../pages/CompliancePage';
import { PoliciesPage } from '../pages/PoliciesPage';
import { ReportsPage } from '../pages/ReportsPage';
import { RiskAssessmentPage } from '../pages/RiskAssessmentPage';
import { ArachneRiskMatrixPage } from '../pages/ArachneRiskMatrixPage';
import { DesignSystemPage } from '../pages/DesignSystemPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        path: 'mp',
        element: <MpDashboardPage />,
      },
      {
        path: 'district',
        element: <DistrictDashboardPage />,
      },
      {
        path: 'state',
        element: <StateDashboardPage />,
      },
      {
        path: 'national',
        element: <StateDashboardPage />,
      },
      {
        path: 'ministry',
        element: <MinistryDashboardPage />,
      },
      {
        path: 'intelligence',
        element: <MinistryDashboardPage />,
      },
      {
        path: 'risk-assessment',
        element: <RiskAssessmentPage />,
      },
      {
        path: 'arachne-audit',
        element: <ArachneRiskMatrixPage />,
      },
      {
        path: 'procurement-intelligence',
        element: <ArachneRiskMatrixPage />,
      },
      {
        path: 'simulate',
        element: <RiskAssessmentPage />,
      },
      {
        path: 'projects',
        element: <ProjectsExplorerPage />,
      },
      {
        path: 'projects/:id',
        element: <ProjectTwinPage />,
      },
      {
        path: 'alerts',
        element: <AlertsPage />,
      },
      {
        path: 'alerts/:id',
        element: <AlertsPage />,
      },
      {
        path: 'early-warning',
        element: <AlertsPage />,
      },
      {
        path: 'cases',
        element: <CasesPage />,
      },
      {
        path: 'cases/:id',
        element: <CaseDetailPage />,
      },
      {
        path: 'contractors',
        element: <ContractorsPage />,
      },
      {
        path: 'contractors/:id',
        element: <ContractorsPage />,
      },
      {
        path: 'agencies',
        element: <AgenciesPage />,
      },
      {
        path: 'agencies/:id',
        element: <AgenciesPage />,
      },
      {
        path: 'maps',
        element: <MapsPage />,
      },
      {
        path: 'compliance',
        element: <CompliancePage />,
      },
      {
        path: 'governance',
        element: <CompliancePage />,
      },
      {
        path: 'policies',
        element: <PoliciesPage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      {
        path: 'audit',
        element: <ReportsPage />,
      },
      {
        path: 'design-system',
        element: <DesignSystemPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
