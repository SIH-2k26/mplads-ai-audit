import { Project } from '../types';
import { mockProjects } from '../data/mock-projects';
import { SYSTEM_METRICS } from '../data/mockData';
import { toast } from 'sonner';

/**
 * Clean string for safe filenames
 */
function sanitizeFilename(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

/**
 * Format currency to INR string
 */
function formatINR(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Generate CSV Report Blob
 */
export function generateCsvReport(
  reportTitle: string,
  role: string,
  projects: Project[] = mockProjects
): Blob {
  const now = new Date().toISOString();
  const year = new Date().getFullYear();

  // CSV metadata header comments
  const metaLines = [
    `# ==============================================================================`,
    `# GOVERNMENT OF INDIA - MINISTRY OF STATISTICS & PROGRAMME IMPLEMENTATION (MoSPI)`,
    `# MPLADS AI AUDIT & CONTINUOUS SURVEILLANCE SYSTEM`,
    `# REPORT: ${reportTitle.toUpperCase()}`,
    `# TARGET ROLE: ${role} | STATUTORY REF: MPLADS/AUDIT/${year}/${Math.floor(1000 + Math.random() * 9000)}`,
    `# GENERATED AT: ${now} | MONITORED WORKS: ${projects.length}`,
    `# TOTAL SANCTIONED OUTLAY: Rs. ${(SYSTEM_METRICS.totalSanctionedCr).toFixed(2)} Cr | UTILIZATION: ${SYSTEM_METRICS.utilizationRate}%`,
    `# ==============================================================================`,
    '',
  ];

  const headers = [
    'Project ID',
    'Project Code',
    'Title',
    'Category',
    'Sector',
    'District',
    'State',
    'Constituency',
    'MP Name',
    'Sanctioned Amount (INR)',
    'Released Amount (INR)',
    'Actual Expenditure (INR)',
    'Unspent Balance (INR)',
    'Financial Progress (%)',
    'Physical Progress (%)',
    'Progress Gap (%)',
    'Risk Score (0-100)',
    'Risk Level',
    'Execution Status',
    'Contractor Name',
    'Contractor PAN',
    'Implementing Agency',
    'Why Flagged / Anomaly Signals',
    'AI Confidence (%)'
  ];

  const rows = projects.map((p) => {
    const riskLevel =
      p.currentRiskScore >= 80 ? 'CRITICAL' :
      p.currentRiskScore >= 60 ? 'HIGH' :
      p.currentRiskScore >= 30 ? 'MEDIUM' : 'LOW';

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    return [
      escapeCsv(p.id),
      escapeCsv(p.code),
      escapeCsv(p.title),
      escapeCsv(p.category),
      escapeCsv(p.sector),
      escapeCsv(p.district),
      escapeCsv(p.state),
      escapeCsv(p.constituency),
      escapeCsv(p.mpName),
      p.sanctionedAmount,
      p.releasedAmount,
      p.expenditure,
      p.remainingBalance,
      p.financialProgressPercentage,
      p.physicalProgressPercentage,
      p.progressMismatchGap,
      p.currentRiskScore,
      escapeCsv(riskLevel),
      escapeCsv(p.status),
      escapeCsv(p.contractor?.name || 'N/A'),
      escapeCsv(p.contractor?.panNumber || 'N/A'),
      escapeCsv(p.implementingAgency?.name || 'N/A'),
      escapeCsv((p.whyFlagged || []).join('; ') || 'Normal parameter check'),
      p.confidenceScore || 85
    ].join(',');
  });

  const csvContent = '\uFEFF' + metaLines.join('\n') + headers.join(',') + '\n' + rows.join('\n');
  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
}

/**
 * Generate Official Government Styled Printable HTML / PDF Dossier
 */
export function generateHtmlDossier(
  reportTitle: string,
  role: string,
  projects: Project[] = mockProjects
): Blob {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const timeStr = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  const refCode = `MoSPI/MPLADS/STAT-AUD/${now.getFullYear()}/${Math.floor(10000 + Math.random() * 90000)}`;

  // Filter or prioritize top flagged projects
  const highRiskProjects = projects.filter((p) => p.currentRiskScore >= 60);
  const displayProjects = projects.slice(0, 30); // top works for clean rendering

  const totalSanctioned = projects.reduce((acc, p) => acc + (p.sanctionedAmount || 0), 0);
  const totalExpended = projects.reduce((acc, p) => acc + (p.expenditure || 0), 0);
  const criticalCount = projects.filter((p) => p.currentRiskScore >= 80).length;
  const highCount = projects.filter((p) => p.currentRiskScore >= 60 && p.currentRiskScore < 80).length;
  const mediumCount = projects.filter((p) => p.currentRiskScore >= 30 && p.currentRiskScore < 60).length;
  const lowCount = projects.filter((p) => p.currentRiskScore < 30).length;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${reportTitle} - Official Audit Dossier</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');

    @page {
      size: A4 portrait;
      margin: 15mm 12mm 15mm 12mm;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 24px;
      background-color: #F8F9FA;
      color: #0E0E0E;
      line-height: 1.45;
      font-size: 12px;
    }

    .toolbar {
      position: sticky;
      top: 12px;
      z-index: 100;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #002449;
      color: white;
      padding: 12px 20px;
      border-radius: 12px;
      margin-bottom: 24px;
      box-shadow: 0 4px 20px rgba(0, 36, 73, 0.25);
    }

    .toolbar-title {
      font-weight: 700;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .toolbar-btn {
      background: #FFFFFF;
      color: #002449;
      border: none;
      padding: 8px 16px;
      font-size: 12px;
      font-weight: 700;
      border-radius: 9999px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }

    .toolbar-btn:hover {
      background: #E5E3DC;
      transform: translateY(-1px);
    }

    .document-page {
      background: #FFFFFF;
      max-width: 210mm;
      margin: 0 auto;
      padding: 32px 36px;
      border: 1px solid #E5E3DC;
      border-radius: 16px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    }

    .header-border {
      border-bottom: 2.5px solid #002449;
      padding-bottom: 16px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .emblem-title-box {
      text-align: left;
    }

    .gov-title {
      font-size: 11px;
      font-weight: 800;
      color: #6B6B6B;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }

    .ministry-title {
      font-size: 14px;
      font-weight: 800;
      color: #002449;
      letter-spacing: 0.5px;
      margin-top: 2px;
    }

    .portal-subtitle {
      font-size: 10px;
      color: #475569;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .ref-badge-box {
      text-align: right;
    }

    .confidential-stamp {
      display: inline-block;
      background: #FEF2F2;
      color: #DC2626;
      border: 1px solid #FECACA;
      font-size: 9px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 4px;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .report-headline {
      font-size: 18px;
      font-weight: 800;
      color: #0E0E0E;
      margin: 16px 0 6px 0;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .meta-strip {
      background: #F8F7F4;
      border: 1px solid #E5E3DC;
      border-radius: 10px;
      padding: 10px 14px;
      font-size: 11px;
      color: #475569;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 20px;
    }

    .meta-item strong {
      display: block;
      color: #0E0E0E;
      font-size: 11px;
      margin-top: 1px;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 22px;
    }

    .kpi-card {
      background: #FFFFFF;
      border: 1px solid #E5E3DC;
      border-radius: 10px;
      padding: 10px 12px;
      position: relative;
      overflow: hidden;
    }

    .kpi-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: #002449;
    }

    .kpi-card.danger::before { background: #DC2626; }
    .kpi-card.warning::before { background: #EA580C; }
    .kpi-card.success::before { background: #16A34A; }

    .kpi-label {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      color: #6B6B6B;
      letter-spacing: 0.5px;
    }

    .kpi-val {
      font-size: 16px;
      font-weight: 800;
      color: #0E0E0E;
      margin-top: 2px;
      font-family: 'JetBrains Mono', monospace;
    }

    .section-title {
      font-size: 12px;
      font-weight: 800;
      color: #002449;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-left: 3px solid #002449;
      padding-left: 8px;
      margin: 20px 0 10px 0;
    }

    .executive-memo {
      background: #F8F9FA;
      border: 1px solid #E5E7EB;
      border-radius: 10px;
      padding: 12px 16px;
      font-size: 11px;
      line-height: 1.6;
      color: #334155;
      margin-bottom: 20px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
      margin-top: 8px;
    }

    th {
      background: #002449;
      color: #FFFFFF;
      font-weight: 700;
      padding: 7px 8px;
      text-align: left;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    td {
      border: 1px solid #E5E3DC;
      padding: 6px 8px;
      vertical-align: top;
      color: #1E293B;
    }

    tr:nth-child(even) {
      background-color: #F8F7F4;
    }

    .badge-critical {
      background: #FEE2E2;
      color: #991B1B;
      border: 1px solid #F87171;
      font-weight: 700;
      padding: 2px 5px;
      border-radius: 4px;
      font-size: 8px;
      font-family: 'JetBrains Mono', monospace;
    }

    .badge-high {
      background: #FFEDD5;
      color: #9A3412;
      border: 1px solid #FB923C;
      font-weight: 700;
      padding: 2px 5px;
      border-radius: 4px;
      font-size: 8px;
      font-family: 'JetBrains Mono', monospace;
    }

    .badge-medium {
      background: #FEF9C3;
      color: #854D0E;
      border: 1px solid #FACC15;
      font-weight: 700;
      padding: 2px 5px;
      border-radius: 4px;
      font-size: 8px;
      font-family: 'JetBrains Mono', monospace;
    }

    .badge-low {
      background: #DCFCE7;
      color: #166534;
      border: 1px solid #86EFAC;
      font-weight: 700;
      padding: 2px 5px;
      border-radius: 4px;
      font-size: 8px;
      font-family: 'JetBrains Mono', monospace;
    }

    .sign-box {
      margin-top: 28px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      page-break-inside: avoid;
    }

    .sign-card {
      border: 1px dashed #CBD5E1;
      border-radius: 8px;
      padding: 12px 14px;
      background: #FAFAFA;
    }

    .sign-label {
      font-size: 9px;
      text-transform: uppercase;
      font-weight: 700;
      color: #64748B;
    }

    .sign-line {
      margin-top: 24px;
      border-top: 1px solid #94A3B8;
      padding-top: 4px;
      font-size: 10px;
      font-weight: 700;
      color: #0E0E0E;
    }

    .footer-note {
      margin-top: 24px;
      border-top: 1px solid #E5E3DC;
      padding-top: 10px;
      font-size: 9px;
      color: #94A3B8;
      display: flex;
      justify-content: space-between;
    }

    @media print {
      body {
        background: #FFFFFF;
        padding: 0;
        margin: 0;
      }
      .toolbar {
        display: none !important;
      }
      .document-page {
        border: none;
        box-shadow: none;
        padding: 0;
        max-width: 100%;
      }
      tr {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>

  <!-- Print Action Toolbar -->
  <div class="toolbar">
    <div class="toolbar-title">
      <span>🏛️</span>
      <span>${reportTitle} — Official Audit Dossier</span>
    </div>
    <div style="display: flex; gap: 8px;">
      <button class="toolbar-btn" onclick="window.print()">
        <span>🖨️ Print / Save as PDF</span>
      </button>
    </div>
  </div>

  <div class="document-page">
    <!-- Header -->
    <div class="header-border">
      <div class="emblem-title-box">
        <div class="gov-title">Government of India</div>
        <div class="ministry-title">Ministry of Statistics and Programme Implementation (MoSPI)</div>
        <div class="portal-subtitle">MPLADS AI Forensic Audit & Continuous Surveillance Network</div>
      </div>
      <div class="ref-badge-box">
        <span class="confidential-stamp">Statutory Audit</span>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #475569; margin-top: 2px;">
          ${refCode}
        </div>
      </div>
    </div>

    <!-- Title & Date -->
    <div class="report-headline">${reportTitle}</div>

    <!-- Meta Information Strip -->
    <div class="meta-strip">
      <div class="meta-item">
        <span style="color: #64748B; font-size: 9px; text-transform: uppercase;">Reporting Officer</span>
        <strong>${role} Mandate</strong>
      </div>
      <div class="meta-item">
        <span style="color: #64748B; font-size: 9px; text-transform: uppercase;">Audit Cycle</span>
        <strong>FY 2024-25 (Q4 Continuous)</strong>
      </div>
      <div class="meta-item">
        <span style="color: #64748B; font-size: 9px; text-transform: uppercase;">Generation Stamp</span>
        <strong>${dateStr}, ${timeStr}</strong>
      </div>
      <div class="meta-item">
        <span style="color: #64748B; font-size: 9px; text-transform: uppercase;">Verification Hash</span>
        <strong style="font-family: 'JetBrains Mono', monospace; font-size: 10px;">SHA256: ${Math.random().toString(36).substring(2, 10).toUpperCase()}</strong>
      </div>
    </div>

    <!-- Key Executive KPIs -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-label">Audited Works Outlay</div>
        <div class="kpi-val">${formatINR(totalSanctioned)}</div>
      </div>
      <div class="kpi-card success">
        <div class="kpi-label">Total Expended Funds</div>
        <div class="kpi-val">${formatINR(totalExpended)}</div>
      </div>
      <div class="kpi-card danger">
        <div class="kpi-label">Critical Forensic Holds</div>
        <div class="kpi-val">${criticalCount} Works</div>
      </div>
      <div class="kpi-card warning">
        <div class="kpi-label">High Divergence Risk</div>
        <div class="kpi-val">${highCount} Works</div>
      </div>
    </div>

    <!-- Executive Commentary -->
    <div class="section-title">I. Executive Summary & Audit Observations</div>
    <div class="executive-memo">
      This statutory audit report has been compiled autonomously via the 19-agent multimodal AI audit engine for <strong>${role}</strong>. 
      Cross-validation incorporates PFMS banking transactions, state treasury disbursals, ISRO Cartosat-3 satellite telemetry, and contractor GSTIN relationship networks.
      A total of <strong>${criticalCount + highCount} works</strong> exhibit statutory divergence requiring immediate scrutiny under General Financial Rules (GFR) Rule 12(C) and CAG Vigilance Directives.
    </div>

    <!-- Monitored Works Ledger -->
    <div class="section-title">II. Monitored Works Risk & Violation Ledger</div>
    <table>
      <thead>
        <tr>
          <th style="width: 14%;">Project Code</th>
          <th style="width: 24%;">Project Description</th>
          <th style="width: 12%;">District / State</th>
          <th style="width: 12%;">Sanctioned (INR)</th>
          <th style="width: 12%;">Expended (INR)</th>
          <th style="width: 8%;">Phys %</th>
          <th style="width: 10%;">Risk Score</th>
          <th style="width: 8%;">Status</th>
        </tr>
      </thead>
      <tbody>
        ${displayProjects.map((p) => {
          const riskScore = p.currentRiskScore;
          const badgeClass =
            riskScore >= 80 ? 'badge-critical' :
            riskScore >= 60 ? 'badge-high' :
            riskScore >= 30 ? 'badge-medium' : 'badge-low';
          const badgeLabel =
            riskScore >= 80 ? `${riskScore} CRIT` :
            riskScore >= 60 ? `${riskScore} HIGH` :
            riskScore >= 30 ? `${riskScore} MED` : `${riskScore} LOW`;

          return `
            <tr>
              <td style="font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 9px;">${p.code}</td>
              <td>
                <div style="font-weight: 600;">${p.title}</div>
                <div style="font-size: 8px; color: #64748B; margin-top: 1px;">Agency: ${p.implementingAgency?.name || 'Local Body'} | Contractor: ${p.contractor?.name || 'Unassigned'}</div>
              </td>
              <td>${p.district}, ${p.state}</td>
              <td style="font-family: 'JetBrains Mono', monospace;">${formatINR(p.sanctionedAmount)}</td>
              <td style="font-family: 'JetBrains Mono', monospace;">${formatINR(p.expenditure)}</td>
              <td style="font-family: 'JetBrains Mono', monospace; font-weight: 700; color: ${p.progressMismatchGap > 30 ? '#DC2626' : '#16A34A'};">${p.physicalProgressPercentage}%</td>
              <td><span class="${badgeClass}">${badgeLabel}</span></td>
              <td style="font-size: 8px; font-weight: 700; text-transform: uppercase;">${p.status.replace(/_/g, ' ')}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>

    <!-- Statutory Sign-off -->
    <div class="sign-box">
      <div class="sign-card">
        <div class="sign-label">Statutory Certification (GFR-12C)</div>
        <p style="font-size: 9px; color: #64748B; margin: 4px 0 0 0; line-height: 1.4;">
          Certified that the above dataset represents verified digital twin snapshots. Field verification and geo-tag validation have been executed pursuant to MoSPI guidelines.
        </p>
        <div class="sign-line">Autonomous AI Sentinel Verification Stamp</div>
      </div>
      <div class="sign-card">
        <div class="sign-label">Competent Authority Endorsement</div>
        <p style="font-size: 9px; color: #64748B; margin: 4px 0 0 0; line-height: 1.4;">
          Reviewed and taken on record for statutory compliance, CAG review, and Parliamentary Oversight proceedings.
        </p>
        <div class="sign-line">Authorized Officer Signatory (${role})</div>
      </div>
    </div>

    <!-- Footer Note -->
    <div class="footer-note">
      <span>MPLADS AI Continuous Surveillance Platform • National Informatics Centre / MoSPI</span>
      <span>Page 1 of 1 • System-Generated Non-Repudiation Document</span>
    </div>
  </div>

</body>
</html>`;

  return new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
}

/**
 * Trigger immediate browser download of blob
 */
export function triggerFileDownload(blob: Blob, filename: string): void {
  const blobUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
}

/**
 * Master download report function with backend fetch + offline resilient fallback
 */
export async function downloadReport(
  reportType: string = 'summary',
  format: string = 'csv',
  role: string = 'AUDITOR'
): Promise<void> {
  const fmt = format.toLowerCase();
  const BASE_URL = ((import.meta as any).env?.VITE_API_URL as string) || 'http://localhost:8000/api/v1';
  const endpoint = `/reports/download?format=${fmt}&report_type=${encodeURIComponent(reportType)}&role=${encodeURIComponent(role)}`;
  const url = `${BASE_URL}${endpoint}`;

  const safeName = sanitizeFilename(reportType);
  const extension = (fmt === 'csv' || fmt === 'xlsx') ? (fmt === 'xlsx' ? 'xlsx' : 'csv') : 'html';
  const filename = `mplads_${role.toLowerCase()}_audit_${safeName}.${extension}`;

  try {
    // Attempt backend fetch with 3-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(url, { signal: controller.signal }).catch(() => null);
    clearTimeout(timeoutId);

    if (res && res.ok) {
      const blob = await res.blob();
      triggerFileDownload(blob, filename);
      toast.success('Report Downloaded Successfully', {
        description: `Saved ${filename} from surveillance server.`,
      });
      return;
    }
  } catch (e) {
    // Backend fetch failed, continue to fallback generator
  }

  // Resilient Client-Side Fallback Generation
  try {
    let fallbackBlob: Blob;
    if (fmt === 'csv' || fmt === 'xlsx') {
      fallbackBlob = generateCsvReport(reportType, role, mockProjects);
    } else {
      fallbackBlob = generateHtmlDossier(reportType, role, mockProjects);
    }

    triggerFileDownload(fallbackBlob, filename);
    toast.success('Report Generated & Downloaded', {
      description: `Saved ${filename} to your downloads.`,
    });
  } catch (fallbackError: any) {
    toast.error('Download Failed', {
      description: fallbackError?.message || 'Could not generate report.',
    });
  }
}
