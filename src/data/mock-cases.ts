import { CaseInvestigation } from '../types';

export const mockCases: CaseInvestigation[] = [
  {
    id: 'CASE-2026-0182',
    caseNumber: 'INV/MH-PUN/2026/0182',
    projectId: 'P-1023',
    projectCode: 'MPLADS-MH-PUN-2026-1023',
    projectTitle: 'Construction of Multipurpose Community Hall & Skill Centre — Ward 17',
    district: 'Pune',
    state: 'Maharashtra',
    riskScore: 86,
    priority: 'CRITICAL',
    status: 'UNDER_INVESTIGATION',
    createdDate: '2026-08-20',
    lastUpdated: '2026-08-26',
    assignedInvestigator: 'Dr. Ramesh Deshmukh (Addl. Collector & Vigilance Officer)',
    whyFlagged: 'Project cost is 38.2% above comparable community hall civil works in Pune district, combined with an anomalous 92.5% fund disbursement while physical progress is lagging at 31.0%.',
    evidenceCount: 4,

    applicableRule: {
      ruleId: 'POL-001',
      title: 'MPLADS Revised Guidelines 2023 §4.2: Schedule of Rates (SoR) Ceiling & Cost Benchmarks',
      section: 'Section 4.2',
      page: 37,
      documentUrl: '/policies#POL-001'
    },

    peerComparison: {
      expectedRange: '₹28.00L – ₹33.50L',
      actualAmount: '₹42.00L',
      peerDeviation: '+38.2% above median',
      sampleSize: 24
    },

    evidenceList: [
      {
        title: 'Treasury Payment Voucher No. 991',
        type: 'FINANCIAL_RECORD',
        reference: 'VOUCHER/PUN/2026/991',
        timestamp: '2026-02-10',
        source: 'District Treasury Portal'
      },
      {
        title: 'Technical Sanction Rate Analysis Memo',
        type: 'TECHNICAL_ESTIMATE',
        reference: 'TS/HAV/2025/112',
        timestamp: '2025-07-12',
        source: 'Executive Engineer PWD Division 1'
      },
      {
        title: 'On-site Geo-Tagged Photo Inspection Batch #3',
        type: 'FIELD_EVIDENCE',
        reference: 'INSP/2026/06/P1023',
        timestamp: '2026-06-25',
        source: 'District Mobile Monitoring App'
      },
      {
        title: 'Tender Comparative Bid Matrix T882',
        type: 'PROCUREMENT_LOG',
        reference: 'TENDER/MH-PUN-772',
        timestamp: '2025-08-20',
        source: 'Maharashtra Mahatenders Portal'
      }
    ],

    verdictNotes: 'Preliminary field verification conducted on 24 August 2026 confirms foundation plinth only. Explanation sought from Executive Engineer regarding 2nd installment clearance.',
    verdictDate: undefined,
    verdictBy: undefined,

    timeline: [
      {
        id: 'AUD-1',
        timestamp: '2026-08-20 14:30',
        user: 'AI Risk Engine',
        role: 'SYSTEM',
        action: 'Anomaly Detection & Case Auto-Provisioning',
        notes: 'Composite risk score exceeded 80 (Current: 86). Anomaly vectors: Cost (+38%) and Progress Mismatch (+61.5%).'
      },
      {
        id: 'AUD-2',
        timestamp: '2026-08-21 09:15',
        user: 'Vikram Joshi (District Planning Officer)',
        role: 'DISTRICT_OFFICER',
        action: 'Case Accepted & Assigned',
        notes: 'Assigned to Dr. Ramesh Deshmukh (Vigilance) with priority HIGH/CRITICAL.'
      },
      {
        id: 'AUD-3',
        timestamp: '2026-08-24 16:00',
        user: 'Dr. Ramesh Deshmukh',
        role: 'INVESTIGATOR',
        action: 'Field Inspection Notice Issued',
        notes: 'Notice dispatched to Executive Engineer Zilla Parishad and M/s Sahyadri Buildtech.'
      }
    ]
  },

  {
    id: 'CASE-2026-0148',
    caseNumber: 'INV/KA-BLR/2026/0148',
    projectId: 'P-0871',
    projectCode: 'MPLADS-MH-PUN-2026-0871',
    projectTitle: 'Bituminous Road Improvement & Concrete Guttering — Haveli Link Road',
    district: 'Pune',
    state: 'Maharashtra',
    riskScore: 84,
    priority: 'CRITICAL',
    status: 'UNDER_INVESTIGATION',
    createdDate: '2026-08-18',
    lastUpdated: '2026-08-25',
    assignedInvestigator: 'Smt. Priya Nair (State Audit Directorate)',
    whyFlagged: 'Single quotation bypass and contractor cartel cluster: Bidder 1 and Bidder 2 submitted bids from identical digital IP address with shared corporate secretary.',
    evidenceCount: 3,

    applicableRule: {
      ruleId: 'GFR-2017-R149',
      title: 'General Financial Rules (GFR) 2017 Rule 149 & CVC Procurement Circular 09/2021',
      section: 'Rule 149',
      page: 54,
      documentUrl: '/policies#POL-003'
    },

    peerComparison: {
      expectedRange: '₹46.00L – ₹53.00L',
      actualAmount: '₹58.00L',
      peerDeviation: '+17.2% with tender bypass',
      sampleSize: 18
    },

    evidenceList: [
      {
        title: 'Bid Submission Digital Hash & IP Logs',
        type: 'DIGITAL_FORENSICS',
        reference: 'MAHATENDERS/IP/2025/0871',
        timestamp: '2025-06-20',
        source: 'State NIC E-Procurement Cell'
      },
      {
        title: 'MCA Corporate Registration Cross-Match',
        type: 'COMPANY_REGISTRY',
        reference: 'MCA21/DIR/99201',
        timestamp: '2026-08-19',
        source: 'Ministry of Corporate Affairs'
      }
    ],

    timeline: [
      {
        id: 'AUD-11',
        timestamp: '2026-08-18 11:00',
        user: 'AI Risk Engine',
        role: 'SYSTEM',
        action: 'Tender Cartel Flag Triggered',
        notes: 'Bidder IP match confidence 97.4%.'
      },
      {
        id: 'AUD-12',
        timestamp: '2026-08-19 10:30',
        user: 'Smt. Priya Nair',
        role: 'INVESTIGATOR',
        action: 'Subpoena Sent to Bank for BG Verification',
        notes: 'Requested bank guarantee issuance log from Bank of Maharashtra Haveli Branch.'
      }
    ]
  },

  {
    id: 'CASE-2026-0099',
    caseNumber: 'INV/MH-NSK/2026/0099',
    projectId: 'P-0912',
    projectCode: 'MPLADS-MH-PUN-2026-0912',
    projectTitle: 'Installation of Solar Powered Drinking Water RO Purification Plants',
    district: 'Pune',
    state: 'Maharashtra',
    riskScore: 68,
    priority: 'HIGH',
    status: 'RESOLVED',
    createdDate: '2026-07-10',
    lastUpdated: '2026-08-15',
    assignedInvestigator: 'Shri Aniket Shinde (MJP Vigilance)',
    whyFlagged: 'Supply milestone delay exceeding 60 days without contractual penalty invocation.',
    evidenceCount: 2,

    applicableRule: {
      ruleId: 'POL-004',
      title: 'MPLADS Revised Guidelines 2023 §5.4: Milestone Release Protocol',
      section: 'Section 5.4',
      page: 49,
      documentUrl: '/policies#POL-004'
    },

    peerComparison: {
      expectedRange: '₹29.00L – ₹34.00L',
      actualAmount: '₹32.50L',
      peerDeviation: '+4.8% (Normal Cost)',
      sampleSize: 30
    },

    evidenceList: [
      {
        title: 'Customs Clearance Delay Certificate',
        type: 'CUSTOMS_DOCUMENT',
        reference: 'JNPT/CUST/2026/4102',
        timestamp: '2026-07-28',
        source: 'Customs Commissionerate, Mumbai'
      }
    ],

    verdictNotes: 'Delay was verified to be caused by international port container strike affecting filtration membranes. Force majeure extension of 45 days granted without financial penalty. Remaining 2 plants successfully delivered on 12 August 2026.',
    verdictDate: '2026-08-15',
    verdictBy: 'District Collector, Pune',

    timeline: [
      {
        id: 'AUD-21',
        timestamp: '2026-07-10 09:00',
        user: 'AI Risk Engine',
        role: 'SYSTEM',
        action: 'SLA Delay Alert',
        notes: 'Milestone delivery breached by 62 days.'
      },
      {
        id: 'AUD-22',
        timestamp: '2026-08-15 15:30',
        user: 'District Collector',
        role: 'DISTRICT_COLLECTOR',
        action: 'Human Verdict: RESOLVED (Force Majeure Validated)',
        notes: 'Case marked resolved. Verified membrane delivery on site.'
      }
    ]
  }
];
