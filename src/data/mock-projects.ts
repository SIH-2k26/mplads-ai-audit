import { Project } from '../types';

export const mockProjects: Project[] = [
  {
    id: 'P-1023',
    code: 'MPLADS-MH-PUN-2026-1023',
    title: 'Construction of Multipurpose Community Hall & Skill Centre — Ward 17',
    category: 'Community',
    sector: 'Social Infrastructure & Community Assets',
    mpName: 'Shri Girish Bapat / MP Pune',
    constituency: 'Pune Parliamentary Constituency',
    district: 'Pune',
    state: 'Maharashtra',
    financialYear: '2026-27',

    sanctionedAmount: 4200000,   // ₹42.0 Lakhs
    releasedAmount: 3885000,     // ₹38.85 Lakhs (92.5%)
    expenditure: 3885000,
    remainingBalance: 315000,
    utilisationPercentage: 92.5,

    physicalProgressPercentage: 31.0,
    financialProgressPercentage: 92.5,
    progressMismatchGap: 61.5,   // Serious gap

    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 86,
    futureRiskScore: 74,
    systemicRiskScore: 68,
    confidenceScore: 91,
    evidenceCoverage: 88,

    whyFlagged: [
      'Cost is 38% above comparable community hall projects in Pune District and western Maharashtra.',
      'Critical Financial vs Physical mismatch: 92.5% funds disbursed while verified physical completion is only 31.0%.',
      'Contractor concentration alert: M/s Sahyadri Buildtech has received 4 out of 6 recent civil works in this block.',
      'Potential duplicate work similarity: 74% structural and geographic overlap with ZP scheme sanctioned in 2024.'
    ],

    riskFingerprint: {
      cost: 88,
      financial: 92,
      procurement: 79,
      execution: 68,
      delay: 74,
      contractor: 84,
      duplicate: 74,
      compliance: 81,
      historical: 65
    },

    contractor: {
      id: 'CONT-8812',
      name: 'M/s Sahyadri Buildtech Infrastructure Pvt Ltd',
      panNumber: 'AABCS8812K',
      riskScore: 84,
      activeContractsInDistrict: 8
    },

    implementingAgency: {
      id: 'AGN-01',
      name: 'Pune Zilla Parishad - Rural Engineering Dept',
      department: 'Rural Development & Panchayati Raj',
      delayRate: 64
    },

    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Ward 17, Hadapsar Extension',
      block: 'Haveli Taluka',
      address: 'Survey No. 44/2, Near Gram Panchayat Office, Hadapsar, Pune - 411028'
    },

    timeline: [
      { id: 'TM-1', step: 'MP Recommendation', date: '2025-05-10', status: 'COMPLETED', notes: 'Recommended for Youth Skill & Community Welfare' },
      { id: 'TM-2', step: 'Administrative Sanction', date: '2025-06-18', status: 'COMPLETED', amount: 4200000, notes: 'Collector Sanction Order No. PUN/MPLADS/2025/441' },
      { id: 'TM-3', step: 'Technical Sanction & Tender', date: '2025-07-25', status: 'COMPLETED', notes: 'Tender floated via e-Tender MH-PUN-772' },
      { id: 'TM-4', step: 'Work Order Awarded', date: '2025-08-30', status: 'COMPLETED', notes: 'Awarded to M/s Sahyadri Buildtech' },
      { id: 'TM-5', step: 'First Installment Released (50%)', date: '2025-09-15', status: 'COMPLETED', amount: 2100000 },
      { id: 'TM-6', step: 'Second Installment Released (42.5%)', date: '2026-02-10', status: 'COMPLETED', amount: 1785000, notes: 'Released without verifying physical roof slab completion' },
      { id: 'TM-7', step: 'Plinth & Foundation Stage', date: '2026-04-15', status: 'DELAYED', delayDays: 78, notes: 'Work stalled due to material shortage' },
      { id: 'TM-8', step: 'Final Completion & Handover', date: '2026-09-30', status: 'PENDING', notes: 'Scheduled handover date (High risk of SLA breach)' }
    ],

    payments: [
      { id: 'PAY-101', installmentNo: 1, amountRupees: 2100000, date: '2025-09-15', payee: 'M/s Sahyadri Buildtech', status: 'VERIFIED', ucSubmitted: true, ucReference: 'UC/2025/HAV-102' },
      { id: 'PAY-102', installmentNo: 2, amountRupees: 1785000, date: '2026-02-10', payee: 'M/s Sahyadri Buildtech', status: 'PENDING_UC', ucSubmitted: false }
    ],

    documents: [
      { id: 'DOC-1', title: 'Administrative Sanction Order PUN-2025-441.pdf', type: 'SANCTION_ORDER', uploadedDate: '2025-06-18', fileSize: '2.4 MB', verifiedByAi: true, flagCount: 0, hash: 'sha256:7f83b1...' },
      { id: 'DOC-2', title: 'Detailed Technical Estimate & SoR Rate Analysis.pdf', type: 'TECHNICAL_ESTIMATE', uploadedDate: '2025-07-12', fileSize: '8.1 MB', verifiedByAi: true, flagCount: 2, hash: 'sha256:4a99c2...' },
      { id: 'DOC-3', title: 'E-Tender Comparative Bid Matrix T882.pdf', type: 'TENDER_NOTICE', uploadedDate: '2025-08-20', fileSize: '1.8 MB', verifiedByAi: true, flagCount: 1, hash: 'sha256:e3b0c4...' },
      { id: 'DOC-4', title: 'Site Inspection Report & Geotagged Photo Batch 3.pdf', type: 'GEO_TAGGED_PHOTO', uploadedDate: '2026-06-25', fileSize: '14.2 MB', verifiedByAi: true, flagCount: 3, hash: 'sha256:91b8d5...' }
    ],

    costBenchmark: {
      projectCost: 4200000,
      peerMedian: 3040000,
      peerMean: 3120000,
      expectedRange: [2800000, 3350000],
      deviationPercentage: 38.2,
      peerPercentile: 96.4,
      peerSampleCount: 24
    },

    applicableRules: [
      {
        ruleId: 'POL-001',
        documentTitle: 'MPLADS Revised Guidelines 2023',
        section: 'Section 4.2',
        page: 37,
        summary: 'Estimates must strictly conform to current State PWD / CPWD Schedule of Rates. Deviations >15% require Technical Sanction Committee sign-off.',
        quote: 'No item of work shall be approved with rates inflated beyond 10% of standard baseline unless accompanied by a written geotechnical or structural justification.',
        severity: 'CRITICAL',
        url: '/policies#POL-001'
      },
      {
        ruleId: 'POL-004',
        documentTitle: 'MPLADS Revised Guidelines 2023',
        section: 'Section 5.4',
        page: 49,
        summary: '2nd installment release requires verified 50% physical completion and formal UC submission for installment 1.',
        quote: 'The District Authority shall release the 2nd installment only upon receipt of Physical Inspection Report confirming >50% completion.',
        severity: 'HIGH',
        url: '/policies#POL-004'
      }
    ],

    evidenceItems: [
      { id: 'EVD-1', type: 'DATA', title: 'Disbursement vs Progress Ledger', detail: 'Disbursed amount ₹38.85L (92.5%) against actual on-ground physical measurement of 31.0%.', sourceDoc: 'Treasury Voucher MH-PUN-2026-991', timestamp: '2026-08-20', confidenceScore: 99, verified: true },
      { id: 'EVD-2', type: 'BENCHMARK', title: 'District Cost Deviation Matrix', detail: 'Similar 2,400 sq.ft hall constructions in Pune/Nashik average ₹30.40 Lakhs (Deviation: +38.2%).', sourceDoc: 'MoSPI National Cost Engine', timestamp: '2026-08-22', confidenceScore: 94, verified: true },
      { id: 'EVD-3', type: 'POLICY', title: 'MPLADS Guidelines 2023 §4.2 Breach', detail: 'Sanction approved at ₹1,750/sq.ft vs PWD approved SoR baseline of ₹1,270/sq.ft without justification memo.', sourceDoc: 'Section 4.2, Page 37', timestamp: '2026-08-24', confidenceScore: 91, verified: true },
      { id: 'EVD-4', type: 'DOCUMENT', title: 'Site Geotagged Photo Discrepancy', detail: 'Inspection photos dated 25 June 2026 show only foundation pillar casting; no brickwork or slab present.', sourceDoc: 'Inspection Photo Batch #3', timestamp: '2026-06-25', confidenceScore: 96, verified: true }
    ],

    relationships: [
      { targetId: 'MP-PUN', targetName: 'Shri Girish Bapat (MP)', targetType: 'MP', relationType: 'RECOMMENDED_BY', weight: 1.0 },
      { targetId: 'CONT-8812', targetName: 'M/s Sahyadri Buildtech Infrastructure Pvt Ltd', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 0.85, notes: 'Won 4 of 6 tenders in Haveli Block' },
      { targetId: 'AGN-01', targetName: 'Pune Zilla Parishad - Rural Engineering Dept', targetType: 'AGENCY', relationType: 'IMPLEMENTED_BY', weight: 0.9 },
      { targetId: 'P-0871', targetName: 'Road Improvement - Haveli Link (P-0871)', targetType: 'SIMILAR_PROJECT', relationType: 'DUPLICATE_OF', weight: 0.74, notes: 'Shared vendor & adjacent site' }
    ],

    dataFreshness: {
      lastUpdated: '2026-08-24T14:30:00Z',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 61,
      isStale: true
    }
  },

  {
    id: 'P-0871',
    code: 'MPLADS-MH-PUN-2026-0871',
    title: 'Bituminous Road Improvement & Concrete Guttering — Haveli Link Road',
    category: 'Roads',
    sector: 'Rural Connectivity & Transport',
    mpName: 'Shri Girish Bapat / MP Pune',
    constituency: 'Pune Parliamentary Constituency',
    district: 'Pune',
    state: 'Maharashtra',
    financialYear: '2026-27',

    sanctionedAmount: 5800000,   // ₹58.0 Lakhs
    releasedAmount: 5046000,     // 87.0%
    expenditure: 5046000,
    remainingBalance: 754000,
    utilisationPercentage: 87.0,

    physicalProgressPercentage: 51.0,
    financialProgressPercentage: 87.0,
    progressMismatchGap: 36.0,

    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 84,
    futureRiskScore: 78,
    systemicRiskScore: 72,
    confidenceScore: 89,
    evidenceCoverage: 85,

    whyFlagged: [
      'Tender bypass: Single quotation accepted without 21-day open e-tender notice on state portal.',
      'High financial disbursement (87%) vs physical progress (51%) with 36% gap.',
      'Contractor cartel overlap: Bidder 2 and Bidder 3 registered to identical GST/PAN phone contact.'
    ],

    riskFingerprint: {
      cost: 72,
      financial: 86,
      procurement: 94,
      execution: 71,
      delay: 62,
      contractor: 88,
      duplicate: 45,
      compliance: 89,
      historical: 70
    },

    contractor: {
      id: 'CONT-8812',
      name: 'M/s Sahyadri Buildtech Infrastructure Pvt Ltd',
      panNumber: 'AABCS8812K',
      riskScore: 84,
      activeContractsInDistrict: 8
    },

    implementingAgency: {
      id: 'AGN-04',
      name: 'Public Works Department (PWD) Division 1, Pune',
      department: 'Public Works',
      delayRate: 88
    },

    location: {
      lat: 18.4905,
      lng: 73.9122,
      wardOrVillage: 'Haveli Gram Panchayat Boundary',
      block: 'Haveli',
      address: 'Haveli-Uruli Link KM 4/200 to 6/800, Pune - 412201'
    },

    timeline: [
      { id: 'TM-1', step: 'Recommendation', date: '2025-04-12', status: 'COMPLETED' },
      { id: 'TM-2', step: 'Sanction', date: '2025-05-20', status: 'COMPLETED', amount: 5800000 },
      { id: 'TM-3', step: 'Tender Issued', date: '2025-06-15', status: 'COMPLETED' },
      { id: 'TM-4', step: 'Work Commenced', date: '2025-08-01', status: 'COMPLETED' },
      { id: 'TM-5', step: 'Progress Inspection', date: '2026-03-10', status: 'DELAYED', delayDays: 45 },
      { id: 'TM-6', step: 'Estimated Completion', date: '2026-10-15', status: 'IN_PROGRESS' }
    ],

    payments: [
      { id: 'PAY-201', installmentNo: 1, amountRupees: 2900000, date: '2025-08-15', payee: 'M/s Sahyadri Buildtech', status: 'VERIFIED', ucSubmitted: true },
      { id: 'PAY-202', installmentNo: 2, amountRupees: 2146000, date: '2026-03-20', payee: 'M/s Sahyadri Buildtech', status: 'PENDING_UC', ucSubmitted: false }
    ],

    documents: [
      { id: 'DOC-11', title: 'Road Sanction Order 2025.pdf', type: 'SANCTION_ORDER', uploadedDate: '2025-05-20', fileSize: '1.9 MB', verifiedByAi: true, flagCount: 0, hash: 'sha256:a1...' },
      { id: 'DOC-12', title: 'Tender Evaluation Minutes.pdf', type: 'TENDER_NOTICE', uploadedDate: '2025-06-28', fileSize: '3.4 MB', verifiedByAi: true, flagCount: 2, hash: 'sha256:b2...' }
    ],

    costBenchmark: {
      projectCost: 5800000,
      peerMedian: 4950000,
      peerMean: 5100000,
      expectedRange: [4600000, 5300000],
      deviationPercentage: 17.2,
      peerPercentile: 88.0,
      peerSampleCount: 18
    },

    applicableRules: [
      {
        ruleId: 'GFR-2017-R149',
        documentTitle: 'General Financial Rules (GFR) 2017',
        section: 'Rule 149',
        page: 54,
        summary: 'Contracts exceeding ₹5 Lakhs must be procured via open e-tender with minimum 21 days exposure.',
        quote: 'Any contract splitting to evade open e-tendering constitutes a severe procedural violation.',
        severity: 'HIGH',
        url: '/policies#POL-003'
      }
    ],

    evidenceItems: [
      { id: 'EVD-11', type: 'MODEL', title: 'Tender Submission IP and Phone Match', detail: 'Bidder 1 and Bidder 2 submitted bids from identical IP address within 8 minutes.', sourceDoc: 'e-Procurement Audit Log', timestamp: '2026-08-15', confidenceScore: 97, verified: true }
    ],

    relationships: [
      { targetId: 'CONT-8812', targetName: 'M/s Sahyadri Buildtech Infrastructure Pvt Ltd', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 0.9 }
    ],

    dataFreshness: {
      lastUpdated: '2026-08-25T10:00:00Z',
      financialDataAgeDays: 1,
      physicalDataAgeDays: 14,
      isStale: false
    }
  },

  {
    id: 'P-0912',
    code: 'MPLADS-MH-PUN-2026-0912',
    title: 'Installation of Solar Powered Drinking Water RO Purification Plants (5 Units)',
    category: 'Water',
    sector: 'Drinking Water & Rural Health',
    mpName: 'Shri Girish Bapat / MP Pune',
    constituency: 'Pune Parliamentary Constituency',
    district: 'Pune',
    state: 'Maharashtra',
    financialYear: '2026-27',

    sanctionedAmount: 3250000,   // ₹32.5 Lakhs
    releasedAmount: 2600000,
    expenditure: 2600000,
    remainingBalance: 650000,
    utilisationPercentage: 80.0,

    physicalProgressPercentage: 70.0,
    financialProgressPercentage: 80.0,
    progressMismatchGap: 10.0,

    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 68,
    futureRiskScore: 60,
    systemicRiskScore: 55,
    confidenceScore: 84,
    evidenceCoverage: 79,

    whyFlagged: [
      'High delay probability: Vendor has supplied 3 of 5 RO membranes with 90-day lead time delay.',
      'Groundwater depth test compliance report missing prior to boring installation.'
    ],

    riskFingerprint: {
      cost: 45,
      financial: 52,
      procurement: 50,
      execution: 68,
      delay: 84,
      contractor: 40,
      duplicate: 25,
      compliance: 72,
      historical: 35
    },

    contractor: {
      id: 'CONT-3310',
      name: 'Vanguard Solar & CleanTech Solutions',
      panNumber: 'AABCV3310T',
      riskScore: 18,
      activeContractsInDistrict: 3
    },

    implementingAgency: {
      id: 'AGN-03',
      name: 'Maharashtra Jeevan Pradhikaran (MJP) - Water Division',
      department: 'Water Supply & Sanitation',
      delayRate: 45
    },

    location: {
      lat: 18.5789,
      lng: 73.7402,
      wardOrVillage: 'Wagholi & Alandi Rural Habitations',
      block: 'Haveli & Khed',
      address: 'ZP Schools & Public Chowks in Wagholi, Pune - 412207'
    },

    timeline: [
      { id: 'TM-1', step: 'Recommendation', date: '2025-06-01', status: 'COMPLETED' },
      { id: 'TM-2', step: 'Sanction', date: '2025-07-15', status: 'COMPLETED', amount: 3250000 },
      { id: 'TM-3', step: 'Equipment Supply', date: '2025-11-20', status: 'DELAYED', delayDays: 62 },
      { id: 'TM-4', step: 'Commissioning', date: '2026-09-15', status: 'IN_PROGRESS' }
    ],

    payments: [
      { id: 'PAY-301', installmentNo: 1, amountRupees: 2600000, date: '2025-08-20', payee: 'Vanguard Solar', status: 'VERIFIED', ucSubmitted: true }
    ],

    documents: [
      { id: 'DOC-21', title: 'Water Scheme Sanction Order.pdf', type: 'SANCTION_ORDER', uploadedDate: '2025-07-15', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'sha256:c3...' }
    ],

    costBenchmark: {
      projectCost: 3250000,
      peerMedian: 3100000,
      peerMean: 3150000,
      expectedRange: [2900000, 3400000],
      deviationPercentage: 4.8,
      peerPercentile: 58.0,
      peerSampleCount: 30
    },

    applicableRules: [
      {
        ruleId: 'POL-004',
        documentTitle: 'MPLADS Revised Guidelines 2023',
        section: 'Section 5.4',
        page: 49,
        summary: 'Utilisation Certificate milestone protocol.',
        quote: 'Second release contingent upon 80% expenditure audit.',
        severity: 'MEDIUM'
      }
    ],

    evidenceItems: [
      { id: 'EVD-21', type: 'DATA', title: 'Supply Delivery Challan Delayed', detail: 'Vendor delivery delayed by 62 days due to imported reverse-osmosis filtration unit backlog.', sourceDoc: 'MJP Store Entry Ledger', timestamp: '2026-07-10', confidenceScore: 88, verified: true }
    ],

    relationships: [
      { targetId: 'CONT-3310', targetName: 'Vanguard Solar & CleanTech Solutions', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 0.6 }
    ],

    dataFreshness: {
      lastUpdated: '2026-08-26T09:15:00Z',
      financialDataAgeDays: 4,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },

  {
    id: 'P-1031',
    code: 'MPLADS-MH-PUN-2026-1031',
    title: 'Upgradation & Medical Equipment Supply for Primary Health Sub-Centre',
    category: 'Health',
    sector: 'Public Health & Diagnostic Care',
    mpName: 'Shri Girish Bapat / MP Pune',
    constituency: 'Pune Parliamentary Constituency',
    district: 'Pune',
    state: 'Maharashtra',
    financialYear: '2026-27',

    sanctionedAmount: 2400000,   // ₹24.0 Lakhs
    releasedAmount: 2400000,
    expenditure: 2400000,
    remainingBalance: 0,
    utilisationPercentage: 100.0,

    physicalProgressPercentage: 90.0,
    financialProgressPercentage: 100.0,
    progressMismatchGap: 10.0,

    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 54,
    futureRiskScore: 42,
    systemicRiskScore: 38,
    confidenceScore: 82,
    evidenceCoverage: 76,

    whyFlagged: [
      'Missing Final Utilisation Certificate (GFR-12C) for ₹24.0 Lakhs full release past 90-day deadline.',
      'Equipment serial number warranty verification pending from District Health Officer.'
    ],

    riskFingerprint: {
      cost: 28,
      financial: 42,
      procurement: 35,
      execution: 30,
      delay: 48,
      contractor: 25,
      duplicate: 15,
      compliance: 79,
      historical: 20
    },

    contractor: {
      id: 'CONT-5401',
      name: 'Shree Ganesh Civil Engineers & Associates',
      panNumber: 'AACCG5401M',
      riskScore: 28,
      activeContractsInDistrict: 4
    },

    implementingAgency: {
      id: 'AGN-02',
      name: 'Pune Municipal Corporation (PMC) - City Infrastructure Cell',
      department: 'Urban Development',
      delayRate: 22
    },

    location: {
      lat: 18.5089,
      lng: 73.8322,
      wardOrVillage: 'Kothrud Health Centre Sub-centre',
      block: 'Pune Urban',
      address: 'Near Gandhi Bhavan, Kothrud, Pune - 411038'
    },

    timeline: [
      { id: 'TM-1', step: 'Sanction', date: '2025-05-15', status: 'COMPLETED', amount: 2400000 },
      { id: 'TM-2', step: 'Procurement', date: '2025-08-10', status: 'COMPLETED' },
      { id: 'TM-3', step: 'Installation', date: '2026-01-20', status: 'COMPLETED' },
      { id: 'TM-4', step: 'UC Submission', date: '2026-05-15', status: 'DELAYED', delayDays: 95 }
    ],

    payments: [
      { id: 'PAY-401', installmentNo: 1, amountRupees: 2400000, date: '2025-09-01', payee: 'Shree Ganesh Engineers', status: 'PENDING_UC', ucSubmitted: false }
    ],

    documents: [
      { id: 'DOC-31', title: 'Health Subcentre Sanction.pdf', type: 'SANCTION_ORDER', uploadedDate: '2025-05-15', fileSize: '1.2 MB', verifiedByAi: true, flagCount: 0, hash: 'sha256:d4...' }
    ],

    costBenchmark: {
      projectCost: 2400000,
      peerMedian: 2350000,
      peerMean: 2420000,
      expectedRange: [2100000, 2600000],
      deviationPercentage: 2.1,
      peerPercentile: 52.0,
      peerSampleCount: 15
    },

    applicableRules: [
      {
        ruleId: 'POL-004',
        documentTitle: 'MPLADS Revised Guidelines 2023',
        section: 'Section 5.4',
        page: 49,
        summary: 'Mandatory UC submission within 90 days of completion.',
        quote: 'Audited Utilisation Certificate must be furnished to District Authority.',
        severity: 'HIGH'
      }
    ],

    evidenceItems: [
      { id: 'EVD-31', type: 'DATA', title: 'Overdue UC Notice Generated', detail: 'Automated notice sent to PMC Health Cell on 15 July 2026 for overdue GFR-12C.', sourceDoc: 'MPLADS Portal Audit Trigger', timestamp: '2026-07-15', confidenceScore: 99, verified: true }
    ],

    relationships: [
      { targetId: 'CONT-5401', targetName: 'Shree Ganesh Civil Engineers & Associates', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 0.5 }
    ],

    dataFreshness: {
      lastUpdated: '2026-08-25T16:00:00Z',
      financialDataAgeDays: 3,
      physicalDataAgeDays: 8,
      isStale: false
    }
  },

  {
    id: 'P-0744',
    code: 'MPLADS-MH-PUN-2026-0744',
    title: 'Construction of STEM Robotics & Science Innovation Lab in ZP High School',
    category: 'Education',
    sector: 'School Education & Digital Literacy',
    mpName: 'Shri Girish Bapat / MP Pune',
    constituency: 'Pune Parliamentary Constituency',
    district: 'Pune',
    state: 'Maharashtra',
    financialYear: '2026-27',

    sanctionedAmount: 1800000,   // ₹18.0 Lakhs
    releasedAmount: 1800000,
    expenditure: 1780000,
    remainingBalance: 20000,
    utilisationPercentage: 98.9,

    physicalProgressPercentage: 100.0,
    financialProgressPercentage: 98.9,
    progressMismatchGap: 0.0,

    status: 'COMPLETED',
    currentRiskScore: 18,
    futureRiskScore: 12,
    systemicRiskScore: 15,
    confidenceScore: 96,
    evidenceCoverage: 95,

    whyFlagged: [],

    riskFingerprint: {
      cost: 15,
      financial: 12,
      procurement: 18,
      execution: 14,
      delay: 10,
      contractor: 20,
      duplicate: 8,
      compliance: 12,
      historical: 10
    },

    contractor: {
      id: 'CONT-5401',
      name: 'Shree Ganesh Civil Engineers & Associates',
      panNumber: 'AACCG5401M',
      riskScore: 28,
      activeContractsInDistrict: 4
    },

    implementingAgency: {
      id: 'AGN-02',
      name: 'Pune Municipal Corporation (PMC) - City Infrastructure Cell',
      department: 'Urban Development',
      delayRate: 22
    },

    location: {
      lat: 18.5312,
      lng: 73.8445,
      wardOrVillage: 'Shivajinagar ZP School Campus',
      block: 'Pune Urban',
      address: 'Ghole Road, Shivajinagar, Pune - 411005'
    },

    timeline: [
      { id: 'TM-1', step: 'Sanction', date: '2025-04-10', status: 'COMPLETED', amount: 1800000 },
      { id: 'TM-2', step: 'Tender & Award', date: '2025-05-25', status: 'COMPLETED' },
      { id: 'TM-3', step: 'Lab Equipment Setup', date: '2025-09-10', status: 'COMPLETED' },
      { id: 'TM-4', step: 'Final Handover & Inauguration', date: '2025-12-05', status: 'COMPLETED' }
    ],

    payments: [
      { id: 'PAY-501', installmentNo: 1, amountRupees: 900000, date: '2025-06-10', payee: 'Shree Ganesh Engineers', status: 'VERIFIED', ucSubmitted: true },
      { id: 'PAY-502', installmentNo: 2, amountRupees: 880000, date: '2025-11-28', payee: 'Shree Ganesh Engineers', status: 'VERIFIED', ucSubmitted: true }
    ],

    documents: [
      { id: 'DOC-41', title: 'STEM Lab Handover Certificate & Geotagged Album.pdf', type: 'INSPECTION_REPORT', uploadedDate: '2025-12-05', fileSize: '5.2 MB', verifiedByAi: true, flagCount: 0, hash: 'sha256:e5...' }
    ],

    costBenchmark: {
      projectCost: 1800000,
      peerMedian: 1850000,
      peerMean: 1820000,
      expectedRange: [1650000, 1950000],
      deviationPercentage: -2.7,
      peerPercentile: 45.0,
      peerSampleCount: 22
    },

    applicableRules: [
      {
        ruleId: 'POL-005',
        documentTitle: 'MPLADS Revised Guidelines 2023',
        section: 'Section 2.3',
        page: 15,
        summary: 'SC/ST and educational priority alignment.',
        quote: 'Educational labs qualify under priority durable community assets.',
        severity: 'MEDIUM'
      }
    ],

    evidenceItems: [
      { id: 'EVD-41', type: 'DATA', title: 'Geo-verified Inspection Complete', detail: 'Executive Engineer signed completion certificate with 12 high-resolution geo-tagged photographs.', sourceDoc: 'Pune Collectorate Verification File', timestamp: '2025-12-08', confidenceScore: 98, verified: true }
    ],

    relationships: [
      { targetId: 'CONT-5401', targetName: 'Shree Ganesh Civil Engineers & Associates', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 0.4 }
    ],

    dataFreshness: {
      lastUpdated: '2026-08-20T10:00:00Z',
      financialDataAgeDays: 6,
      physicalDataAgeDays: 6,
      isStale: false
    }
  },

  {
    id: 'P-0655',
    code: 'MPLADS-MH-PUN-2026-0655',
    title: 'Modern Public Sanitation Complex with Bio-Digester — Saswad Bus Terminus',
    category: 'Sanitation',
    sector: 'Swachh Bharat & Public Sanitation',
    mpName: 'Shri Girish Bapat / MP Pune',
    constituency: 'Pune Parliamentary Constituency',
    district: 'Pune',
    state: 'Maharashtra',
    financialYear: '2026-27',

    sanctionedAmount: 1500000,   // ₹15.0 Lakhs
    releasedAmount: 1500000,
    expenditure: 1485000,
    remainingBalance: 15000,
    utilisationPercentage: 99.0,

    physicalProgressPercentage: 100.0,
    financialProgressPercentage: 99.0,
    progressMismatchGap: 0.0,

    status: 'COMPLETED',
    currentRiskScore: 24,
    futureRiskScore: 18,
    systemicRiskScore: 20,
    confidenceScore: 93,
    evidenceCoverage: 91,

    whyFlagged: [],

    riskFingerprint: {
      cost: 22,
      financial: 20,
      procurement: 25,
      execution: 18,
      delay: 28,
      contractor: 22,
      duplicate: 10,
      compliance: 15,
      historical: 18
    },

    contractor: {
      id: 'CONT-5401',
      name: 'Shree Ganesh Civil Engineers & Associates',
      panNumber: 'AACCG5401M',
      riskScore: 28,
      activeContractsInDistrict: 4
    },

    implementingAgency: {
      id: 'AGN-01',
      name: 'Pune Zilla Parishad - Rural Engineering Dept',
      department: 'Rural Development & Panchayati Raj',
      delayRate: 64
    },

    location: {
      lat: 18.3412,
      lng: 74.0321,
      wardOrVillage: 'Saswad MSRTC Bus Station',
      block: 'Purandar',
      address: 'Saswad Main Road, Purandar Taluka, Pune - 412301'
    },

    timeline: [
      { id: 'TM-1', step: 'Sanction', date: '2025-03-15', status: 'COMPLETED', amount: 1500000 },
      { id: 'TM-2', step: 'Construction Completed', date: '2025-10-20', status: 'COMPLETED' }
    ],

    payments: [
      { id: 'PAY-601', installmentNo: 1, amountRupees: 1485000, date: '2025-11-10', payee: 'Shree Ganesh Engineers', status: 'VERIFIED', ucSubmitted: true }
    ],

    documents: [
      { id: 'DOC-51', title: 'Bio-Digester Sanitation Completion.pdf', type: 'UTILISATION_CERTIFICATE', uploadedDate: '2025-11-15', fileSize: '2.1 MB', verifiedByAi: true, flagCount: 0, hash: 'sha256:f6...' }
    ],

    costBenchmark: {
      projectCost: 1500000,
      peerMedian: 1450000,
      peerMean: 1480000,
      expectedRange: [1350000, 1600000],
      deviationPercentage: 3.4,
      peerPercentile: 56.0,
      peerSampleCount: 19
    },

    applicableRules: [
      {
        ruleId: 'POL-002',
        documentTitle: 'MPLADS Revised Guidelines 2023',
        section: 'Section 3.8',
        page: 24,
        summary: 'Asset Geotagging & Site verification.',
        quote: 'Asset must be mapped on national GIS database with barcode plaque.',
        severity: 'MEDIUM'
      }
    ],

    evidenceItems: [
      { id: 'EVD-51', type: 'DATA', title: 'Asset Tagged on GIS Portal', detail: 'Asset ID MPLADS-MH-PUN-SAN-0655 mapped to National Geo-Spatial Registry.', sourceDoc: 'MoSPI Asset Registry', timestamp: '2025-11-20', confidenceScore: 99, verified: true }
    ],

    relationships: [
      { targetId: 'CONT-5401', targetName: 'Shree Ganesh Civil Engineers & Associates', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 0.4 }
    ],

    dataFreshness: {
      lastUpdated: '2026-08-18T12:00:00Z',
      financialDataAgeDays: 8,
      physicalDataAgeDays: 8,
      isStale: false
    }
  }
];
