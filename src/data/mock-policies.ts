import { PolicyRule } from '../types';

export const mockPolicies: PolicyRule[] = [
  {
    id: 'POL-001',
    code: 'MPLADS-2023-SEC4.2',
    documentName: 'MPLADS Revised Guidelines 2023',
    section: 'Section 4.2',
    page: 37,
    title: 'Cost Estimation & Schedule of Rates (SoR) Compliance',
    effectiveDate: '2023-04-01',
    issuingAuthority: 'Ministry of Statistics and Programme Implementation (MoSPI)',
    severity: 'CRITICAL',
    applicability: 'All Works exceeding ₹10 Lakhs',
    summary: 'Estimates must strictly conform to current State PWD / CPWD Schedule of Rates. Deviations exceeding 15% require State Technical Sanction Committee approval.',
    textSnippet: '4.2.1 The Technical Sanction for all MPLADS works shall be accorded by the competent engineering authority strictly as per the prevailing District/State Schedule of Rates (SoR). No item of work shall be approved with rates inflated beyond 10% of standard baseline unless accompanied by a written geotechnical or structural justification.',
    requiredEvidence: [
      'Detailed Technical Estimate signed by Executive Engineer',
      'Comparative SoR deviation matrix',
      'District Collector Sanction Order'
    ]
  },
  {
    id: 'POL-002',
    code: 'MPLADS-2023-SEC3.8',
    documentName: 'MPLADS Revised Guidelines 2023',
    section: 'Section 3.8',
    page: 24,
    title: 'Prohibition of Work Duplication & Asset Geotagging',
    effectiveDate: '2023-04-01',
    issuingAuthority: 'MoSPI / DIID',
    severity: 'CRITICAL',
    applicability: 'All Works',
    summary: 'No work shall be sanctioned on an asset or site where another Central/State sponsored scheme has executed similar works within the preceding 3 financial years.',
    textSnippet: '3.8.3 District Authority must ensure de-duplication against PMGSY, Jal Jeevan Mission, AMRUT, and State Budget works through GIS geo-tagging and site asset registry checks before issuing administrative sanction.',
    requiredEvidence: [
      'Site GIS Coordinates with ±5m precision',
      'Pre-work Geo-tagged photograph',
      'Certificate of Non-Duplication from District Planning Officer'
    ]
  },
  {
    id: 'POL-003',
    code: 'GFR-2017-R149',
    documentName: 'General Financial Rules (GFR) 2017',
    section: 'Rule 149',
    page: 54,
    title: 'Public Procurement through GeM and Open Tender Thresholds',
    effectiveDate: '2017-02-11',
    issuingAuthority: 'Ministry of Finance, Department of Expenditure',
    severity: 'HIGH',
    applicability: 'All Goods and Services Procurement above ₹5 Lakh',
    summary: 'Works and supply contracts exceeding ₹5.00 Lakhs must be procured via open e-procurement or Government e-Marketplace (GeM) with minimum 21 days tender exposure.',
    textSnippet: 'Rule 149. The procurement of Goods and Services by Ministries or Departments will be mandatory for Goods or Services available on GeM. Any contract splitting to evade open e-tendering constitutes a severe procedural violation.',
    requiredEvidence: [
      'e-Procurement Portal Bid Notice ID',
      'Comparative Bid Evaluation Matrix',
      'Contractor Work Order'
    ]
  },
  {
    id: 'POL-004',
    code: 'MPLADS-2023-SEC5.4',
    documentName: 'MPLADS Revised Guidelines 2023',
    section: 'Section 5.4',
    page: 49,
    title: 'Utilisation Certificate (UC) & Milestone Release Protocol',
    effectiveDate: '2023-04-01',
    issuingAuthority: 'MoSPI',
    severity: 'HIGH',
    applicability: 'Multi-installment Work Releases',
    summary: 'Subsequent installment release is prohibited unless 80% of prior funds are spent and audited Utilisation Certificates (Form GFR-12C) with inspection photos are uploaded.',
    textSnippet: '5.4.2 The District Authority shall release the 2nd installment only upon receipt of Physical Inspection Report confirming >50% completion and Utilisation Certificate for at least 80% of the first installment from the implementing agency.',
    requiredEvidence: [
      'GFR-12C Utilisation Certificate signed by Agency Finance Officer',
      'Inspection report with dated geo-tagged photos',
      'Treasury expenditure statement'
    ]
  },
  {
    id: 'POL-005',
    code: 'MPLADS-2023-SEC2.3',
    documentName: 'MPLADS Revised Guidelines 2023',
    section: 'Section 2.3',
    page: 15,
    title: 'Mandatory SC/ST Community Area Allocation (15% / 7.5%)',
    effectiveDate: '2023-04-01',
    issuingAuthority: 'MoSPI',
    severity: 'MEDIUM',
    applicability: 'Annual MP Constituency Allocation',
    summary: 'At least 15% of annual funds must be allocated for SC inhabited areas and 7.5% for ST inhabited areas in each parliamentary constituency.',
    textSnippet: '2.3.1 MPs shall recommend works costing at least 15% of MPLADS entitlement per annum for areas inhabited by Scheduled Caste population and 7.5% for areas inhabited by Scheduled Tribe population.',
    requiredEvidence: [
      'Constituency demographic classification certificate',
      'Annual SC/ST expenditure ledger'
    ]
  },
  {
    id: 'POL-006',
    code: 'CVC-2021-VIG09',
    documentName: 'Central Vigilance Commission (CVC) Procurement Guidelines',
    section: 'Clause 9.4',
    page: 18,
    title: 'Contractor Cartelization & Excessive Local Concentration',
    effectiveDate: '2021-08-15',
    issuingAuthority: 'Central Vigilance Commission',
    severity: 'CRITICAL',
    applicability: 'District-level Infrastructure Works',
    summary: 'Single contractor executing more than 40% of civil works across a single implementing agency within 12 months requires independent vigilance audit.',
    textSnippet: '9.4.1 Implementing agencies must monitor bidder concentration. If a single entity or syndicate secures disproportionate works across contiguous blocks without competitive bidding variation, a pre-audit vigilance review is mandatory.',
    requiredEvidence: [
      'District Contractor Tender Win/Loss Log',
      'Bank Guarantee verification report',
      'Independent Quality Monitor (IQM) assessment'
    ]
  }
];
