// Mock Cases — frontend/src/mocks/mockCases.ts

import type { InvestigationCase, PaginatedCases } from '../types/case';

export const MOCK_CASES: InvestigationCase[] = [
  {
    caseId: 'CASE-2024-0041',
    projectId: 'MPLADS/MP/2021/2204',
    projectName: 'Renovation of PHC Building, Sehore',
    state: 'Madhya Pradesh',
    district: 'Sehore',
    riskScore: 91,
    riskLevel: 'CRITICAL',
    primaryConcern: 'Project lapsed with 98% financial utilization at 45% physical progress.',
    status: 'UNDER_INVESTIGATION',
    assignedTo: 'Shri R.K. Verma, District Collector',
    createdAt: '2024-10-02T08:00:00Z',
    updatedAt: '2024-10-28T15:00:00Z',
    policyEvidence: [
      {
        applicableRule: 'MPLADS Guidelines 2016, Para 9.4',
        sourceDocument: 'MPLADS_Guidelines_2016.pdf',
        section: 'Completion and Lapse',
        page: '34',
        effectiveDate: '2016-01-01',
        evidence:
          'Work should be completed within the stipulated period failing which the ' +
          'sanctioned amount is liable to be returned to the MPLADS fund.',
        confidence: 0.96,
      },
      {
        applicableRule: 'CAG Report 2023, Para 4.8',
        sourceDocument: 'CAG_Report_MPLADS_2023.pdf',
        section: 'Financial Irregularities',
        page: '112',
        effectiveDate: '2023-03-31',
        evidence:
          'In cases where expenditure has been released without corresponding physical progress, ' +
          'the implementing agency is required to explain the utilization or refund the excess amount.',
        confidence: 0.88,
      },
    ],
    agencyHistory: 'Health Department MP: 12 projects, 3 HIGH risk, 67% completion rate.',
    contractorHistory: 'M/s Central India Construction: 7 projects, 2 CRITICAL risk, 43% on-time completion.',
    geographicInfo: 'Sehore district has 8 high-risk MPLADS projects — 3rd highest risk district in MP.',
  },
  {
    caseId: 'CASE-2024-0042',
    projectId: 'MPLADS/UP/2022/1042',
    projectName: 'Construction of CC Road, Ward 5, Lucknow',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    riskScore: 82,
    riskLevel: 'HIGH',
    primaryConcern: 'Payment/progress mismatch — 92.5% funds utilized at 37% physical progress.',
    status: 'PENDING_REVIEW',
    assignedTo: 'Ms. Priya Sharma, SDM Lucknow',
    createdAt: '2024-11-11T09:00:00Z',
    updatedAt: '2024-11-14T12:30:00Z',
  },
  {
    caseId: 'CASE-2024-0038',
    projectId: 'MPLADS/WB/2022/1567',
    projectName: 'Flood Protection Wall, Murshidabad',
    state: 'West Bengal',
    district: 'Murshidabad',
    riskScore: 78,
    riskLevel: 'HIGH',
    primaryConcern: 'Expenditure recorded during work suspension period.',
    status: 'OPEN',
    createdAt: '2024-10-22T10:00:00Z',
    updatedAt: '2024-10-22T10:00:00Z',
  },
  {
    caseId: 'CASE-2024-0031',
    projectId: 'MPLADS/MH/2022/0891',
    projectName: 'Construction of Anganwadi Centre, Nashik Rural',
    state: 'Maharashtra',
    district: 'Nashik',
    riskScore: 28,
    riskLevel: 'LOW',
    primaryConcern: 'Single-bidder procurement on completed project.',
    status: 'CLOSED',
    assignedTo: 'Auto-resolved',
    createdAt: '2024-08-21T11:00:00Z',
    updatedAt: '2024-09-05T14:00:00Z',
    verdict: {
      verdictType: 'FALSE_POSITIVE',
      officerName: 'Shri A.B. Kulkarni',
      officerRole: 'DM Nashik',
      remarks: 'Project completed satisfactorily. Single bidder due to specialized nature of work. No irregularity found.',
      submittedAt: '2024-09-05T14:00:00Z',
    },
  },
];

export const MOCK_PAGINATED_CASES: PaginatedCases = {
  items: MOCK_CASES,
  total: MOCK_CASES.length,
  page: 1,
  pageSize: 20,
  totalPages: 1,
};
