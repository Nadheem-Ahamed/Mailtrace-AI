import {
  navItems,
  dashboardData,
  user,
  gmailMessages,
  threatResultData,
  investigationData,
  threatIntelligenceData,
  threatGraphData,
  timelineEvents,
  evidenceItems,
  honeytokenData,
  breadcrumbData,
  chainOfCustody,
  blockchainIntegrity,
  forensicFindings,
  mockCopilotResponses,
  mockReports,
  reportIndexRows,
  mockInvestigationHistory,
  mockNotifications,
  profileData,
  defaultSettings,
  globalSearchCatalog
} from './data/mockData.js';
import {
  analyzeEmail,
  checkHealth,
  getDashboard,
  getThreatIntelligence,
  queryCopilot
} from './api.js';

const appEl = document.getElementById('app');

const state = {
  isLoggedIn: false,
  isAuthenticated: false,
  authLoading: false,
  authSuccess: false,
  oauthTimerId: null,
  currentPage: 'dashboard',
  currentModal: null,
  sidebarOpen: false,
  searchTerm: '',
  notifications: mockNotifications.filter((notification) => !notification.read).length,
  notificationDropdownOpen: false,
  userMenuOpen: false,
  notificationFilter: 'All',
  investigationHistoryFilter: 'All',
  investigationHistorySearch: '',
  searchQuery: '',
  searchOverlayOpen: false,
  gmailConnected: false,
  connectedGmail: {
    name: 'Security Analyst',
    email: 'analyst@mailtrace.demo',
    provider: 'Google'
  },
  selectedEmailId: 'gmail-001',
  analysisProgress: 0,
  scanTimer: null,
  analysisScanStarted: false,
  selectedThreatIndicator: threatIntelligenceData.indicator,
  selectedGraphNodeId: 'domain-1',
  showMapPanel: false,
  selectedTimelineEventId: timelineEvents[0].id,
  selectedEvidenceId: evidenceItems[0].id,
  timelineFilter: 'All',
  timelineSearch: '',
  evidenceDrawerOpen: true,
  integrityVerified: false,
  integrityLoading: false,
  aiCopilotMessages: [],
  aiCopilotRecentQuestions: [],
  aiCopilotLoading: false,
  aiCopilotError: false,
  aiCopilotInput: '',
  currentInvestigationId: investigationData.investigationId,
  pdfExporting: false,
  activeInvestigation: {
    investigationId: investigationData.investigationId,
    risk: 92,
    threat: 'Critical',
    sender: investigationData.sender,
    subject: investigationData.subject,
    domain: 'paypa1-support.com',
    ip: '203.0.113.42',
    threatTypes: ['Phishing', 'Sender Impersonation', 'Suspicious URL', 'QR / Quishing'],
    status: 'Critical'
  },
  selectedReportId: 'RPT-2026-00421',
  reportSearch: '',
  reportStatusFilter: 'All',
  reportSelection: 'MT-2026-00421',
  settings: { ...defaultSettings },
  profile: { ...profileData },
  investigationHistory: [...mockInvestigationHistory],
  notificationsList: mockNotifications.map((item) => ({ ...item })),
  backendStatus: 'checking',
  backendLabel: 'Checking backend...',
  pendingAnalysisPayload: null,
  analysisSource: 'demo'
};

const normalizePageId = (pageId) => (pageId === 'analyze-email' ? 'analysis' : pageId);

const getReportByInvestigationId = (investigationId) => {
  const normalizedId = String(investigationId || '').trim();
  return mockReports.find((report) => report.investigationId === normalizedId) || mockReports[0];
};

const getActiveReport = () => {
  const report = mockReports.find((item) => item.reportId === state.selectedReportId)
    || getReportByInvestigationId(state.currentInvestigationId)
    || mockReports[0];
  state.selectedReportId = report.reportId;
  state.currentInvestigationId = report.investigationId;
  return report;
};

const getCurrentReportRoute = (report = getActiveReport()) => `/reports/${encodeURIComponent(report.investigationId)}`;

const copyTextToClipboard = async (value) => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const helper = document.createElement('textarea');
  helper.value = value;
  helper.setAttribute('readonly', '');
  helper.style.position = 'fixed';
  helper.style.opacity = '0';
  document.body.appendChild(helper);
  helper.select();
  document.execCommand('copy');
  helper.remove();
};

const generatePdfReport = (report = getActiveReport()) => {
  if (!window.jspdf?.jsPDF) {
    throw new Error('jsPDF is not loaded.');
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 42;
  const contentWidth = pageWidth - (margin * 2);
  const colors = {
    navy: [8, 18, 32],
    navyLight: [17, 32, 52],
    cyan: [63, 176, 221],
    cyanSoft: [225, 247, 255],
    ink: [25, 39, 58],
    muted: [93, 111, 132],
    line: [210, 220, 231],
    panel: [246, 249, 252],
    critical: [190, 56, 63],
    warning: [169, 112, 24],
    white: [255, 255, 255]
  };
  const investigationId = report?.investigationId || investigationData.investigationId || 'INV-2026-0916-001';
  const generatedAt = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  let y = 0;

  const setFont = (size, style = 'normal', color = colors.ink) => {
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
  };

  const footer = () => {
    doc.setDrawColor(...colors.line);
    doc.line(margin, pageHeight - 38, pageWidth - margin, pageHeight - 38);
    setFont(8, 'normal', colors.muted);
    doc.text('MAILTRACE AI  /  CONTROLLED DEMO INVESTIGATION', margin, pageHeight - 23);
    doc.text(`Page ${doc.internal.getCurrentPageInfo().pageNumber}`, pageWidth - margin, pageHeight - 23, { align: 'right' });
  };

  const startPage = (showHeader = true) => {
    doc.setFillColor(...colors.white);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    if (showHeader) {
      doc.setFillColor(...colors.navy);
      doc.rect(0, 0, pageWidth, 54, 'F');
      setFont(12, 'bold', colors.white);
      doc.text('MAILTRACE AI', margin, 25);
      setFont(8, 'normal', colors.cyanSoft);
      doc.text('FORENSIC INVESTIGATION REPORT', margin, 40);
      setFont(8, 'normal', colors.cyanSoft);
      doc.text(investigationId, pageWidth - margin, 31, { align: 'right' });
      y = 82;
    } else {
      y = margin;
    }
  };

  const newPage = () => {
    footer();
    doc.addPage();
    startPage(true);
  };

  const ensure = (height) => {
    if (y + height > pageHeight - 58) newPage();
  };

  const wrapped = (text, width, size = 9.5, style = 'normal', color = colors.ink) => {
    setFont(size, style, color);
    return doc.splitTextToSize(String(text || 'N/A'), width);
  };

  const drawSectionTitle = (title, subtitle = '') => {
    ensure(42);
    setFont(15, 'bold', colors.navy);
    doc.text(title.toUpperCase(), margin, y);
    doc.setDrawColor(...colors.cyan);
    doc.setLineWidth(2);
    doc.line(margin, y + 9, margin + 42, y + 9);
    doc.setLineWidth(1);
    if (subtitle) {
      setFont(8.5, 'normal', colors.muted);
      doc.text(subtitle, margin + 52, y + 8);
    }
    y += 30;
  };

  const drawParagraph = (text, width = contentWidth, size = 9.5, color = colors.ink) => {
    const lines = wrapped(text, width, size, 'normal', color);
    ensure((lines.length * 13) + 8);
    lines.forEach((line) => {
      doc.text(line, margin, y);
      y += 13;
    });
    y += 6;
  };

  const drawKeyValueRows = (rows, columns = 2) => {
    const gap = 10;
    const cellWidth = (contentWidth - (gap * (columns - 1))) / columns;
    rows.forEach((row, index) => {
      if (index % columns === 0) {
        const rowItems = rows.slice(index, index + columns);
        const heights = rowItems.map(([label, value]) => Math.max(34, wrapped(value, cellWidth - 20, 9).length * 12 + 20));
        const rowHeight = Math.max(...heights);
        ensure(rowHeight + 8);
        rowItems.forEach(([label, value], columnIndex) => {
          const x = margin + columnIndex * (cellWidth + gap);
          doc.setFillColor(...colors.panel);
          doc.setDrawColor(...colors.line);
          doc.roundedRect(x, y, cellWidth, rowHeight, 5, 5, 'FD');
          setFont(7.5, 'bold', colors.muted);
          doc.text(String(label).toUpperCase(), x + 10, y + 13);
          const valueLines = wrapped(value, cellWidth - 20, 9, 'bold', colors.ink);
          valueLines.slice(0, 3).forEach((line, lineIndex) => doc.text(line, x + 10, y + 27 + (lineIndex * 11)));
        });
        y += rowHeight + 8;
      }
    });
  };

  const drawTable = (headers, rows, widths) => {
    const tableWidth = widths.reduce((sum, width) => sum + width, 0);
    ensure(34);
    let x = margin;
    doc.setFillColor(...colors.navyLight);
    doc.rect(margin, y, tableWidth, 25, 'F');
    headers.forEach((header, index) => {
      setFont(7.5, 'bold', colors.white);
      doc.text(header.toUpperCase(), x + 7, y + 16);
      x += widths[index];
    });
    y += 25;
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
      const row = rows[rowIndex];
      const lineSets = row.map((cell, index) => wrapped(cell, widths[index] - 14, 8.2));
      const rowHeight = Math.max(26, Math.max(...lineSets.map((lines) => lines.length)) * 10 + 12);
      if (y + rowHeight > pageHeight - 58) {
        newPage();
        drawTable(headers, rows.slice(rowIndex), widths);
        return;
      }
      x = margin;
      doc.setFillColor(...(rowIndex % 2 === 0 ? colors.white : colors.panel));
      doc.setDrawColor(...colors.line);
      doc.rect(margin, y, tableWidth, rowHeight, 'FD');
      row.forEach((cell, index) => {
        setFont(8.2, index === 0 ? 'bold' : 'normal', index === 0 ? colors.navy : colors.ink);
        lineSets[index].forEach((line, lineIndex) => doc.text(line, x + 7, y + 15 + (lineIndex * 10)));
        x += widths[index];
      });
      y += rowHeight;
    }
    y += 12;
  };

  startPage(false);
  doc.setFillColor(...colors.navy);
  doc.rect(0, 0, pageWidth, 210, 'F');
  doc.setFillColor(...colors.cyan);
  doc.rect(0, 0, 8, 210, 'F');
  setFont(15, 'bold', colors.cyanSoft);
  doc.text('MAILTRACE AI', margin, 52);
  setFont(9, 'normal', colors.cyanSoft);
  doc.text('SECURITY OPERATIONS CENTER  /  FORENSIC ANALYSIS', margin, 70);
  setFont(27, 'bold', colors.white);
  doc.text('FORENSIC INVESTIGATION', margin, 116);
  doc.text('REPORT', margin, 148);
  setFont(9, 'normal', colors.cyanSoft);
  doc.text('Prepared from controlled demonstration data', margin, 177);

  y = 244;
  drawKeyValueRows([
    ['Investigation ID', investigationId],
    ['Generated', generatedAt],
    ['Sender', investigationData.sender],
    ['Subject', investigationData.subject],
    ['Status', report.status],
    ['Evidence', `${report.evidence.length} preserved artifacts`]
  ]);

  ensure(122);
  const riskX = margin;
  const riskY = y;
  const riskWidth = contentWidth;
  doc.setFillColor(...colors.panel);
  doc.setDrawColor(...colors.line);
  doc.roundedRect(riskX, riskY, riskWidth, 108, 6, 6, 'FD');
  setFont(8, 'bold', colors.muted);
  doc.text('RISK SCORE', riskX + 16, riskY + 22);
  setFont(31, 'bold', colors.navy);
  doc.text(`${report.riskScore} / 100`, riskX + 16, riskY + 58);
  doc.setFillColor(...colors.critical);
  doc.roundedRect(riskX + 16, riskY + 73, riskWidth - 32, 10, 5, 5, 'F');
  doc.setFillColor(...colors.cyan);
  doc.roundedRect(riskX + 16, riskY + 73, (riskWidth - 32) * (report.riskScore / 100), 10, 5, 5, 'F');
  setFont(12, 'bold', colors.critical);
  doc.text(String(report.riskLevel).toUpperCase(), riskX + riskWidth - 16, riskY + 42, { align: 'right' });
  setFont(8.5, 'normal', colors.muted);
  doc.text('Composite forensic indicators. Signals do not automatically prove malicious intent.', riskX + riskWidth - 16, riskY + 60, { align: 'right' });
  y += 128;

  drawSectionTitle('Executive Summary');
  drawParagraph(report.executiveSummary);

  newPage();
  drawSectionTitle('Email & Authentication Analysis');
  drawKeyValueRows([
    ['From', investigationData.sender],
    ['Display Name', investigationData.displayName],
    ['Recipient', investigationData.recipient],
    ['Received', investigationData.timestamp],
    ['SPF', investigationData.spf],
    ['DKIM', investigationData.dkim],
    ['DMARC', investigationData.dmarc],
    ['Impersonation', investigationData.impersonation.finalStatus]
  ]);
  drawParagraph(investigationData.aiExplanation);

  drawSectionTitle('Threat Detection Findings');
  drawTable(['Finding', 'Severity', 'Reference'], report.findings.map((finding) => [finding.title, finding.severity, finding.reference]), [270, 90, 120]);
  report.findings.slice(0, 4).forEach((finding) => drawParagraph(`${finding.title}: ${finding.explanation}`, contentWidth, 8.7, colors.muted));

  drawSectionTitle('QR / Quishing Analysis');
  drawKeyValueRows([
    ['Detected QR Codes', String(investigationData.qrCodes)],
    ['QR URL', investigationData.qrUrl],
    ['Attachment', investigationData.attachment.name],
    ['Attachment Analysis', investigationData.attachment.analysis]
  ]);
  drawParagraph('The QR content is associated with a suspicious verification flow and redirect behavior.');

  drawSectionTitle('Email DNA Analysis');
  drawKeyValueRows([
    ['DNA Match', investigationData.emailDNA.dnaMatch],
    ['Sender Behavior', investigationData.emailDNA.senderBehavior],
    ['Writing Style', investigationData.emailDNA.writingStyle],
    ['Sending Pattern', investigationData.emailDNA.sendingPattern],
    ['Recipient Pattern', investigationData.emailDNA.recipientPattern],
    ['Status', investigationData.emailDNA.status]
  ]);

  newPage();
  drawSectionTitle('Threat Intelligence');
  drawKeyValueRows([
    ['Domain', report.threatIntelligence.domain],
    ['IP', report.threatIntelligence.ip],
    ['Campaign', report.threatIntelligence.campaign],
    ['URL Count', String(report.threatIntelligence.urls)],
    ['Sources', report.threatIntelligence.sources.join(', ')],
    ['Infrastructure Context', report.geolocation.note]
  ]);
  drawTable(['Type', 'Indicator', 'Risk', 'Relationship'], threatIntelligenceData.relatedIndicators.map((item) => [item.type, item.indicator, item.risk, item.relationship]), [65, 190, 65, 160]);

  drawSectionTitle('Honeytoken Findings', 'ACTIVE DEFENSE SIGNAL  /  CONTROLLED LAB TELEMETRY');
  drawKeyValueRows([
    ['Token ID', report.honeytoken?.tokenId || honeytokenData.tokenId],
    ['Status', report.honeytoken?.status || honeytokenData.status],
    ['Trigger Time', report.honeytoken?.detectionTime || honeytokenData.detectionTime],
    ['Observed Activity', report.honeytoken?.observedActivity || honeytokenData.observedActivity],
    ['Telemetry', `${honeytokenData.telemetry.ip} / ${honeytokenData.telemetry.userAgent}`],
    ['Source', honeytokenData.telemetry.source]
  ]);
  drawParagraph(report.honeytoken?.demoNote || honeytokenData.demoNote, contentWidth, 8.5, colors.warning);

  drawSectionTitle('Breadcrumb Trace Findings', 'CONTROLLED TELEMETRY  /  INFRASTRUCTURE CONTEXT');
  drawKeyValueRows([
    ['Breadcrumb ID', report.breadcrumb?.id || breadcrumbData.id],
    ['Status', report.breadcrumb?.status || breadcrumbData.status],
    ['First Seen', report.breadcrumb?.firstSeen || breadcrumbData.firstSeen],
    ['Last Seen', report.breadcrumb?.lastSeen || breadcrumbData.lastSeen],
    ['IP Address', report.breadcrumb?.ipAddress || breadcrumbData.ipAddress],
    ['User Agent', report.breadcrumb?.userAgent || breadcrumbData.userAgent],
    ['Referrer', report.breadcrumb?.referrer || breadcrumbData.referrer],
    ['Approximate Location', report.breadcrumb?.approximateLocation || breadcrumbData.approximateLocation]
  ]);
  drawParagraph(`Redirect Chain: ${report.breadcrumb?.redirectChain || breadcrumbData.redirectChain}`);
  drawParagraph(report.breadcrumb?.warning || breadcrumbData.warning, contentWidth, 8.5, colors.warning);

  newPage();
  drawSectionTitle('Threat Graph Relationships');
  const graphRows = threatGraphData.edges.map(([fromId, toId]) => {
    const from = threatGraphData.nodes.find((node) => node.id === fromId);
    const to = threatGraphData.nodes.find((node) => node.id === toId);
    return [from?.label || fromId, 'CONNECTED TO', to?.label || toId];
  });
  drawTable(['Source', 'Relationship', 'Destination'], graphRows, [190, 110, 190]);
  drawParagraph('The graph correlates the suspicious email, sender, domain, URL, IP, Breadcrumb Event, Honeytoken Event and the active investigation using the existing demo relationships.', contentWidth, 8.7, colors.muted);

  drawSectionTitle('Forensic Timeline');
  drawTable(['Time', 'Event'], report.timeline.map((item) => [item.time, item.event]), [110, 380]);

  drawSectionTitle('Evidence Summary');
  drawTable(['Artifact ID', 'Evidence', 'Hash', 'Integrity'], report.evidence.map((item) => [item.id, item.name, item.hash, item.integrity]), [105, 175, 105, 105]);
  drawParagraph(`${report.integrity.status}. ${report.integrity.note}`, contentWidth, 8.7, colors.muted);

  drawSectionTitle('AI Analyst Explanation');
  drawParagraph(report.aiSummary);
  drawSectionTitle('Final Investigation Summary');
  drawParagraph(`Investigation ${investigationId} remains classified as ${report.riskLevel} with a risk score of ${report.riskScore}/100. The preserved evidence and connected forensic signals support continued analyst review. Honeytoken and Breadcrumb activity are controlled demonstration telemetry and do not identify a real attacker or prove exact physical location.`);
  drawKeyValueRows([
    ['Risk Level', report.riskAssessment.label],
    ['Recommended Action', report.recommendedActions[0]],
    ['Integrity', report.integrity.status],
    ['Report Status', report.status]
  ]);

  footer();
  doc.save(`MailTraceAI_Forensic_Report_${investigationId}.pdf`);
};

const shareCurrentReport = async () => {
  const report = getActiveReport();
  const shareUrl = `${window.location.origin}/reports/${report.investigationId}`;
  const shareData = {
    title: 'MailTrace AI Forensic Report',
    text: `Investigation ${report.investigationId} — Risk ${report.riskScore}/100 ${report.riskLevel}`,
    url: shareUrl
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      showToast('Report shared successfully.');
      return;
    }
  } catch (error) {
    if (error?.name !== 'AbortError') {
      console.warn('Native share failed, using fallback copy flow.', error);
    } else {
      showToast('Share canceled.');
      return;
    }
  }

  try {
    await copyTextToClipboard(shareUrl);
    showToast('Report link copied.');
  } catch (error) {
    console.error('Clipboard copy failed for share URL.', error);
    showToast('Copy failed. Use the report link from the share dialog.');
  }
};

const resolveRouteFromLocation = () => {
  const pathname = window.location.pathname || '/';
  const directMatch = pathname.match(/^\/reports\/([^/]+)$/i);
  if (directMatch) {
    const investigationId = decodeURIComponent(directMatch[1]);
    const matchedReport = getReportByInvestigationId(investigationId);
    if (matchedReport) {
      state.selectedReportId = matchedReport.reportId;
      state.currentInvestigationId = matchedReport.investigationId;
      state.currentPage = 'report-preview';
      state.isLoggedIn = true;
      state.isAuthenticated = true;
      state.gmailConnected = true;
      return true;
    }
  }

  const searchId = new URLSearchParams(window.location.search).get('id');
  if (searchId) {
    const matchedReport = getReportByInvestigationId(searchId);
    if (matchedReport) {
      state.selectedReportId = matchedReport.reportId;
      state.currentInvestigationId = matchedReport.investigationId;
      state.currentPage = 'report-preview';
      state.isLoggedIn = true;
      state.isAuthenticated = true;
      state.gmailConnected = true;
      return true;
    }
  }

  return false;
};

const syncRouteToCurrentReport = () => {
  if (state.currentPage !== 'report-preview') return;
  const report = getActiveReport();
  const route = `${window.location.origin}/reports/${report.investigationId}`;
  const nextPath = `/reports/${encodeURIComponent(report.investigationId)}`;
  if (window.location.pathname !== nextPath) {
    window.history.pushState({}, '', nextPath);
  }
  return route;
};

const investigationWorkflowPages = [
  'email-detail',
  'analysis',
  'threat-result',
  'threat-intelligence',
  'threat-graph',
  'forensic-timeline',
  'evidence',
  'ai-copilot',
  'report-preview',
  'investigation-complete'
];

const formatPageTitle = (pageId) => navItems.find((item) => item.id === normalizePageId(pageId))?.label || 'Dashboard';

function getInvestigationStep(pageId = state.currentPage) {
  const normalized = normalizePageId(pageId);
  const index = investigationWorkflowPages.indexOf(normalized);
  return index >= 0 ? index : 0;
}

function getInvestigationPrevPage(pageId = state.currentPage) {
  const normalized = normalizePageId(pageId);
  const currentIndex = investigationWorkflowPages.indexOf(normalized);
  if (currentIndex <= 0) return null;
  return investigationWorkflowPages[currentIndex - 1];
}

function getInvestigationNextPage(pageId = state.currentPage) {
  const normalized = normalizePageId(pageId);
  const currentIndex = investigationWorkflowPages.indexOf(normalized);
  if (currentIndex < 0) return null;
  return investigationWorkflowPages[currentIndex + 1] || null;
}

function renderInvestigationStepper(pageId = state.currentPage) {
  if (!investigationWorkflowPages.includes(normalizePageId(pageId))) return '';

  const steps = [
    'Analysis',
    'Threat Intel',
    'Threat Graph',
    'Timeline',
    'Evidence',
    'AI Copilot',
    'Report'
  ];

  const currentStep = Math.max(0, getInvestigationStep(pageId) - 1);
  const isMobile = window.innerWidth <= 767;

  if (isMobile) {
    const mobileLabel = steps[Math.min(currentStep, steps.length - 1)] || 'Report';
    const progress = ((currentStep + 1) / steps.length) * 100;

    return `
      <div class="investigation-stepper mobile-stepper">
        <div class="stepper-mobile-header">
          <span>Step ${Math.min(currentStep + 1, steps.length)} of ${steps.length}</span>
          <strong>${mobileLabel}</strong>
        </div>
        <div class="stepper-track"><span style="width:${progress}%"></span></div>
      </div>
    `;
  }

  return `
    <div class="investigation-stepper desktop-stepper" aria-label="Investigation progress">
      ${steps.map((step, index) => {
        const base = index < currentStep ? 'complete' : index === currentStep ? 'current' : 'future';
        const suffix = index < currentStep ? '✓' : index === currentStep ? '●' : '';
        return `
          <div class="stepper-step ${base}">
            <span class="stepper-mark">${suffix || (index + 1)}</span>
            <span>${step}</span>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderInvestigationNav(pageId = state.currentPage) {
  if (!investigationWorkflowPages.includes(normalizePageId(pageId))) return '';

  const prevPage = getInvestigationPrevPage(pageId);
  const nextPage = getInvestigationNextPage(pageId);

  const prevLabel = pageId === 'email-detail' ? 'Back to Inbox' : pageId === 'report-preview' ? 'AI Copilot' : 'Previous';
  const nextLabel = pageId === 'analysis' ? 'View Investigation Result' : pageId === 'report-preview' ? 'Complete Investigation' : 'Continue';

  return `
    <div class="investigation-nav">
      ${prevPage ? `<button class="ghost-btn" type="button" data-investigation-nav="prev">${prevLabel}</button>` : ''}
      ${nextPage ? `<button class="primary-btn" type="button" data-investigation-nav="next">${nextLabel}</button>` : ''}
    </div>
  `;
}

function getSelectedEmail() {
  return gmailMessages.find((item) => item.id === state.selectedEmailId) || gmailMessages[0];
}

function collectAnalysisPayload() {
  const email = getSelectedEmail();
  const sender = document.getElementById('mailSender')?.value || email.senderEmail;
  const body = document.getElementById('mailBody')?.value || email.body;
  const urls = [];
  if (email.urls) {
    urls.push(`https://${email.domain}/verify`);
  }
  const attachments = email.attachments ? ['invoice_2026.pdf'] : [];
  return {
    sender,
    subject: email.subject,
    body,
    urls,
    attachments
  };
}

function assignObject(target, source) {
  if (!source || typeof source !== 'object') return;
  Object.keys(source).forEach((key) => {
    target[key] = source[key];
  });
}

function applyAnalysisResult(data) {
  if (!data) return;

  investigationData.investigationId = data.investigation_id || investigationData.investigationId;
  investigationData.sender = data.sender || investigationData.sender;
  investigationData.subject = data.subject || investigationData.subject;
  investigationData.timestamp = data.timestamp || investigationData.timestamp;
  investigationData.riskScore = data.risk_score ?? investigationData.riskScore;
  investigationData.riskLevel = data.risk_level || investigationData.riskLevel;
  investigationData.aiExplanation = data.aiExplanation || data.summary || investigationData.aiExplanation;
  if (data.recommendedActions) investigationData.recommendedActions = data.recommendedActions;
  if (data.authentication) {
    investigationData.spf = data.authentication.spf || investigationData.spf;
    investigationData.dkim = data.authentication.dkim || investigationData.dkim;
    investigationData.dmarc = data.authentication.dmarc || investigationData.dmarc;
  }
  if (data.urls || data.suspicious_urls) {
    investigationData.urls = data.urls || data.suspicious_urls;
  }
  if (data.qr) {
    investigationData.qrCodes = data.qr.count ?? investigationData.qrCodes;
    investigationData.qrUrl = data.qr.url || investigationData.qrUrl;
  }
  if (data.qr_detection) {
    investigationData.qrCodes = data.qr_detection.count ?? investigationData.qrCodes;
    investigationData.qrUrl = data.qr_detection.url || investigationData.qrUrl;
  }
  if (data.email_dna) assignObject(investigationData.emailDNA, data.email_dna);
  if (data.attachment) assignObject(investigationData.attachment, data.attachment);
  investigationData.riskScoring = data.risk_scoring || investigationData.riskScoring;

  if (data.honeytoken_status) honeytokenData.status = data.honeytoken_status;
  if (data.breadcrumb_status) breadcrumbData.status = data.breadcrumb_status;
  if (data.honeytoken) assignObject(honeytokenData, data.honeytoken);
  if (data.breadcrumb) assignObject(breadcrumbData, data.breadcrumb);
  if (data.threat_intelligence) assignObject(threatIntelligenceData, data.threat_intelligence);

  threatResultData.riskScore = investigationData.riskScore;
  threatResultData.riskLevel = investigationData.riskLevel;
  threatResultData.summary = data.summary || threatResultData.summary;
  if (Array.isArray(data.threats)) {
    threatResultData.indicators = data.threats.map((t) => `Detected threat signature: ${t}`);
  }
  threatResultData.findings = [
    { label: 'SPF', value: investigationData.spf },
    { label: 'DKIM', value: investigationData.dkim },
    { label: 'DMARC', value: investigationData.dmarc },
    { label: 'Domain Reputation', value: 'SUSPICIOUS' },
    { label: 'URLs', value: `${(investigationData.urls || []).length} detected` },
    { label: 'QR Codes', value: `${investigationData.qrCodes} detected` },
    { label: 'Attachments', value: investigationData.attachment ? '1 detected' : 'None' },
    { label: 'Breadcrumb Telemetry', value: breadcrumbData.status },
    { label: 'Honeytoken Trigger', value: honeytokenData.status },
    { label: 'Threat Intelligence Match', value: 'SIGNAL' }
  ];
  if (data.threat_graph?.nodes) {
    threatGraphData.nodes = data.threat_graph.nodes;
    threatGraphData.edges = data.threat_graph.edges || threatGraphData.edges;
  }
  if (Array.isArray(data.timeline) && data.timeline.length) {
    timelineEvents.splice(0, timelineEvents.length, ...data.timeline);
  }
  if (Array.isArray(data.evidence) && data.evidence.length) {
    evidenceItems.splice(0, evidenceItems.length, ...data.evidence);
  }

  forensicFindings.risk = `${investigationData.riskScore} / 100`;
  forensicFindings.honeytoken = honeytokenData.status;
  forensicFindings.breadcrumb = breadcrumbData.status;

  const report = mockReports[0];
  report.investigationId = investigationData.investigationId;
  report.riskScore = investigationData.riskScore;
  report.riskLevel = investigationData.riskLevel;
  report.executiveSummary = data.summary || report.executiveSummary;
  report.emailDetails.from = investigationData.sender;
  report.emailDetails.subject = investigationData.subject;
  report.riskAssessment.score = `${investigationData.riskScore} / 100`;
  report.riskAssessment.label = investigationData.riskLevel;
  if (data.honeytoken) report.honeytoken = honeytokenData;
  if (data.breadcrumb) report.breadcrumb = breadcrumbData;
  if (report.footer) report.footer.investigation = investigationData.investigationId;

  state.currentInvestigationId = investigationData.investigationId;
  state.selectedReportId = report.reportId;
  state.selectedThreatIndicator = threatIntelligenceData.indicator;
  state.selectedGraphNodeId = 'domain-1';
  state.selectedTimelineEventId = timelineEvents[0]?.id || state.selectedTimelineEventId;
  state.selectedEvidenceId = evidenceItems[0]?.id || state.selectedEvidenceId;
  state.activeInvestigation = {
    investigationId: investigationData.investigationId,
    risk: investigationData.riskScore,
    threat: investigationData.riskLevel,
    sender: investigationData.sender,
    subject: investigationData.subject,
    domain: data.domain || 'paypa1-support.com',
    ip: data.ip || '203.0.113.42',
    threatTypes: data.threats || ['Phishing', 'Sender Impersonation', 'Suspicious URL', 'QR / Quishing'],
    status: investigationData.riskLevel
  };
}

async function refreshBackendStatus() {
  const online = await checkHealth();
  const nextStatus = online ? 'connected' : 'offline';
  const nextLabel = online ? 'Backend Connected' : 'Backend Offline — Using Demo Data';
  const changed = state.backendStatus !== nextStatus;
  state.backendStatus = nextStatus;
  state.backendLabel = nextLabel;
  return changed;
}

function filterInvestigationRows(rows) {
  const term = state.searchTerm.trim().toLowerCase();
  if (!term) return rows;

  return rows.filter((row) => {
    return [row.id, row.subject, row.owner, row.status].some((field) =>
      String(field).toLowerCase().includes(term)
    );
  });
}

function filterGmailMessages(rows) {
  const term = state.searchTerm.trim().toLowerCase();
  if (!term) return rows;

  return rows.filter((row) => {
    return [row.senderName, row.senderEmail, row.subject, row.preview, row.emailType, row.status].some((field) =>
      String(field).toLowerCase().includes(term)
    );
  });
}

function dismissToast() {
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.classList.remove('show');
    window.setTimeout(() => existingToast.remove(), 220);
  }
  window.clearTimeout(showToast.timer);
}

function showToast(message) {
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove('show');
    window.setTimeout(() => toast.remove(), 220);
  }, 3000);
}

function getVisibleTimelineEvents() {
  const term = state.timelineSearch.trim().toLowerCase();

  return timelineEvents.filter((event) => {
    const matchesFilter = state.timelineFilter === 'All' || event.category === state.timelineFilter;
    if (!matchesFilter) return false;

    if (!term) return true;

    const haystack = `${event.title} ${event.description} ${event.category} ${event.details}`.toLowerCase();
    return haystack.includes(term);
  });
}

function getCopilotResponse(question) {
  const normalized = question.trim().toLowerCase();
  if (!normalized) {
    return {
      response: 'I can currently answer questions about this investigation\'s risk, indicators, evidence, timeline and campaign correlation. This is a frontend simulation only.',
      relatedIndicators: ['secure-verification.example'],
      relatedEvidence: ['EV-00421-03'],
      suggestedActions: ['Investigate Indicator', 'View Timeline', 'View Evidence'],
      tags: ['Threat Intelligence', 'Timeline', 'Evidence']
    };
  }

  const exactMatch = mockCopilotResponses.find((entry) => entry.question !== 'default' && normalized === entry.question.toLowerCase());
  const match = exactMatch || mockCopilotResponses.find((entry) => {
    if (entry.question === 'default') return false;
    return entry.keywords.some((keyword) => normalized.includes(keyword)) || normalized.includes(entry.question.toLowerCase());
  }) || mockCopilotResponses[mockCopilotResponses.length - 1];

  return match;
}

function addRecentQuestion(question) {
  const safeQuestion = question.trim();
  if (!safeQuestion) return;

  const nextQuestions = [safeQuestion, ...state.aiCopilotRecentQuestions.filter((item) => item !== safeQuestion)].slice(0, 4);
  state.aiCopilotRecentQuestions = nextQuestions;

  try {
    window.localStorage.setItem('mailtraceCopilotHistory', JSON.stringify(nextQuestions));
  } catch (error) {
    // localStorage may be unavailable in some demo contexts.
  }
}

function hydrateRecentQuestions() {
  try {
    const raw = window.localStorage.getItem('mailtraceCopilotHistory');
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length) {
      state.aiCopilotRecentQuestions = parsed.slice(0, 4);
    }
  } catch (error) {
    state.aiCopilotRecentQuestions = [];
  }
}

function getReportById(reportId) {
  return mockReports.find((report) => report.reportId === reportId) || mockReports[0];
}

function getFilteredReports() {
  const term = state.reportSearch.trim().toLowerCase();
  return reportIndexRows.filter((report) => {
    const matchesFilter = state.reportStatusFilter === 'All' || report.status === state.reportStatusFilter || report.severity === state.reportStatusFilter || report.riskLevel === state.reportStatusFilter;
    if (!matchesFilter) return false;
    if (!term) return true;

    return [report.reportId, report.investigationId, report.threat, report.status].some((field) =>
      String(field).toLowerCase().includes(term)
    );
  });
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

async function handleCopilotSubmit(questionText) {
  const input = typeof questionText === 'string' ? questionText : (document.getElementById('copilotInput')?.value || '').trim();

  if (!input) {
    state.aiCopilotError = true;
    render();
    return;
  }

  state.aiCopilotError = false;
  state.aiCopilotLoading = true;
  state.aiCopilotInput = '';
  render();

  let response = getCopilotResponse(input);
  try {
    const apiResponse = await queryCopilot(input, state.currentInvestigationId);
    if (apiResponse?.response) {
      response = apiResponse;
      state.backendStatus = 'connected';
      state.backendLabel = 'Backend Connected';
    }
  } catch (error) {
    state.backendStatus = 'offline';
    state.backendLabel = 'Backend Offline — Using Demo Data';
  }

  const userQuestion = { role: 'user', text: input };
  const assistantResponse = {
    role: 'assistant',
    text: response.response,
    relatedIndicators: response.relatedIndicators,
    relatedEvidence: response.relatedEvidence,
    suggestedActions: response.suggestedActions,
    tags: response.tags
  };

  state.aiCopilotMessages = [...state.aiCopilotMessages, userQuestion, assistantResponse];
  state.aiCopilotLoading = false;
  addRecentQuestion(input);
  render();
}

function markNotificationRead(notificationId) {
  const target = state.notificationsList.find((notification) => notification.id === notificationId);
  if (!target) return;

  target.read = true;
  state.notifications = getNotificationCount();
  render();
  showToast('Notification marked as read');
}

function markAllNotificationsRead() {
  state.notificationsList = state.notificationsList.map((notification) => ({ ...notification, read: true }));
  state.notifications = 0;
  render();
  showToast('All notifications marked as read');
}

function saveSettingsFromForm() {
  document.querySelectorAll('[data-setting]').forEach((toggle) => {
    const key = toggle.dataset.setting;
    state.settings[key] = toggle.checked;
  });

  document.querySelectorAll('[data-setting-select]').forEach((select) => {
    const key = select.dataset.settingSelect;
    state.settings[key] = select.value;
  });

  showToast('Settings saved successfully');
}

function handleGoogleOAuth() {
  if (state.authLoading) return;

  const emailInput = document.getElementById('loginEmail');
  const nextEmail = (emailInput?.value || state.connectedGmail.email || 'analyst@mailtrace.demo').trim() || 'analyst@mailtrace.demo';
  state.connectedGmail = { ...state.connectedGmail, email: nextEmail };
  state.authLoading = true;
  state.authSuccess = false;
  dismissToast();
  renderLogin();

  if (state.oauthTimerId) {
    window.clearTimeout(state.oauthTimerId);
  }

  state.oauthTimerId = window.setTimeout(() => {
    state.authLoading = false;
    state.authSuccess = true;
    state.isLoggedIn = true;
    state.isAuthenticated = true;
    state.gmailConnected = true;
    state.currentPage = 'gmail';
    state.oauthTimerId = null;
    render();
    showToast('Google account connected successfully');
  }, 1200);
}

function renderLogin() {
  const connectedEmail = state.connectedGmail.email || 'analyst@mailtrace.demo';

  appEl.innerHTML = `
    <div class="auth-shell">
      <div class="auth-card">
        <div class="logo-lockup">
          <div class="logo-mark">M</div>
          <div class="logo-text">MailTrace AI</div>
        </div>

        <p class="auth-subtitle">AI-Powered Email Threat Detection &amp; Digital Forensics</p>

        <div class="auth-intro">
          <h1>Sign in to MailTrace AI</h1>
        </div>

        <form class="auth-form" id="loginForm">
          <div class="form-field">
            <label for="loginEmail">Email address</label>
            <input id="loginEmail" name="email" type="email" value="${connectedEmail}" placeholder="Enter your email address" autocomplete="email" />
          </div>

          <button class="primary-btn auth-submit-btn" type="submit" ${state.authLoading ? 'disabled' : ''}>
            ${state.authLoading ? 'Connecting to Google...' : 'Continue'}
          </button>

          <div class="auth-divider"><span>or</span></div>

          <button class="google-btn auth-google-btn" type="button" id="googleLoginBtn" ${state.authLoading ? 'disabled' : ''}>
            <span class="google-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.2-.9 2.3-1.9 3l3.1 2.4c1.8-1.7 2.9-4.1 2.9-7.1 0-.7-.1-1.4-.2-2H12z"/>
                <path fill="#34A853" d="M12 21c2.6 0 4.8-.9 6.4-2.4l-3.1-2.4c-.9.6-2 .9-3.3.9-2.5 0-4.7-1.7-5.4-4H.7v2.6C2.3 18.8 6.7 21 12 21z"/>
                <path fill="#FBBC05" d="M6.6 17c-.4-.8-.6-1.7-.6-2.7s.2-1.9.6-2.7V8.9H2.6C1.8 10.4 1.3 11.7 1.3 13s.5 2.6 1.3 3.5L6.6 17z"/>
                <path fill="#4285F4" d="M12 4.1c1.4 0 2.7.5 3.7 1.5l2.8-2.8C16.8.9 14.6 0 12 0 7.7 0 3.3 2.2.7 5.5l3.9 3.1C5.4 6 7.6 4.1 12 4.1z"/>
              </svg>
            </span>
            ${state.authLoading ? 'Connecting to Google...' : 'Continue with Google'}
          </button>
        </form>

        <div class="auth-note">
          <h3>Secure Gmail Connection</h3>
          <p>MailTrace AI uses Google OAuth to securely connect your Gmail account. We never ask for or store your Google password.</p>
        </div>

        <div class="auth-info">
          <h3>Why Google OAuth?</h3>
          <ul>
            <li>Secure authentication</li>
            <li>No Google password stored by MailTrace AI</li>
            <li>User-controlled Gmail access</li>
            <li>OAuth-based authorization</li>
          </ul>
        </div>

        ${state.authSuccess ? '<div class="auth-status">Google account connected successfully</div>' : ''}
      </div>
    </div>
  `;

  document.getElementById('loginForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    handleGoogleOAuth();
  });

  document.getElementById('googleLoginBtn')?.addEventListener('click', () => {
    handleGoogleOAuth();
  });
}

function getNotificationCount() {
  return state.notificationsList.filter((item) => !item.read).length;
}

function getFilteredNotifications() {
  const filter = state.notificationFilter;
  return state.notificationsList.filter((item) => filter === 'All' || item.category === filter);
}

function getFilteredInvestigationHistory() {
  const term = state.investigationHistorySearch.trim().toLowerCase();
  return state.investigationHistory.filter((item) => {
    const matchesFilter = state.investigationHistoryFilter === 'All' || item.status === state.investigationHistoryFilter || item.riskLabel === state.investigationHistoryFilter;
    if (!matchesFilter) return false;
    if (!term) return true;

    return [item.id, item.email, item.sender, item.threatType, item.status].some((field) => String(field).toLowerCase().includes(term));
  });
}

function getSearchResults() {
  const query = state.searchQuery.trim().toLowerCase();
  if (!query) return [];

  return globalSearchCatalog.filter((entry) => {
    return entry.keywords.some((keyword) => keyword.toLowerCase().includes(query)) || entry.title.toLowerCase().includes(query) || entry.subtitle.toLowerCase().includes(query);
  });
}

function renderSearchOverlay() {
  const results = getSearchResults();

  return `
    <div class="modal ${state.currentModal === 'global-search' ? 'open' : ''}" role="dialog" aria-modal="true" aria-labelledby="globalSearchTitle">
      <div class="modal-header">
        <h3 id="globalSearchTitle">Global Search</h3>
        <button class="close-btn" type="button" id="closeSearchOverlayBtn" aria-label="Close search">✕</button>
      </div>
      <div class="modal-body search-overlay-body">
        <div class="search-overlay-input-wrap">
          <span class="search-icon">⌕</span>
          <input id="searchOverlayInput" type="search" placeholder="Search investigations, emails, indicators or reports" value="${state.searchQuery}" />
        </div>
        <div class="search-overlay-results">
          ${results.length ? results.map((item) => `
            <button class="search-result-item" type="button" data-search-route="${item.route}" data-search-id="${item.id}">
              <span class="search-result-type">${item.type}</span>
              <strong>${item.title}</strong>
              <small>${item.subtitle}</small>
            </button>
          `).join('') : `
            <div class="empty-state compact-empty">
              <div class="empty-state__card">
                <div class="empty-state__icon">⌕</div>
                <h3>No search results</h3>
                <p>Try a different keyword.</p>
              </div>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}

function renderInvestigationsPage() {
  const rows = state.investigationHistory.filter((item) => {
    const matchesFilter = state.investigationHistoryFilter === 'All' || item.status === state.investigationHistoryFilter || item.riskLabel === state.investigationHistoryFilter;
    if (!matchesFilter) return false;

    const term = state.investigationHistorySearch.trim().toLowerCase();
    if (!term) return true;

    return [item.id, item.email, item.sender, item.threatType, item.status].some((field) => String(field).toLowerCase().includes(term));
  });

  const summaryCards = [
    { label: 'Total Investigations', value: state.investigationHistory.length },
    { label: 'Critical Threats', value: state.investigationHistory.filter((item) => item.riskLabel === 'Critical').length },
    { label: 'High Risk', value: state.investigationHistory.filter((item) => item.riskLabel === 'High').length },
    { label: 'Resolved', value: state.investigationHistory.filter((item) => item.status === 'Resolved').length }
  ];

  return `
    <div class="page-section">
      <div class="overview-header history-header">
        <div>
          <div class="eyebrow">Case Management</div>
          <h2>Investigations</h2>
          <p class="section-subtitle">Review active phishing and impersonation investigations across the current mailbox dataset.</p>
        </div>
      </div>

      <div class="metric-grid compact-grid">
        ${summaryCards.map((card) => `
          <div class="metric-card">
            <div class="metric-card__top">
              <span class="metric-card__label">${card.label}</span>
            </div>
            <div class="metric-card__value">${card.value}</div>
          </div>
        `).join('')}
      </div>

      <div class="panel history-panel">
        <div class="panel-header history-controls">
          <div class="history-search-wrap">
            <span class="search-icon">⌕</span>
            <input id="investigationSearchInput" type="search" placeholder="Search investigations..." value="${state.investigationHistorySearch}" />
          </div>
          <div class="filter-tags">
            ${['All', 'Critical', 'High', 'Medium', 'Low', 'Resolved'].map((filter) => `
              <button class="filter-chip ${state.investigationHistoryFilter === filter ? 'active' : ''}" type="button" data-investigation-filter="${filter}">${filter}</button>
            `).join('')}
          </div>
        </div>

        <div class="table-wrap">
          <table class="data-table history-table">
            <thead>
              <tr>
                <th>Investigation ID</th>
                <th>Email / Subject</th>
                <th>Sender</th>
                <th>Risk Score</th>
                <th>Threat Type</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${rows.length ? rows.map((row) => `
                <tr class="history-row">
                  <td class="mono-text">${row.id}</td>
                  <td>${row.email}</td>
                  <td class="mono-text">${row.sender}</td>
                  <td><span class="risk-badge ${row.riskLabel.toLowerCase()}">${row.riskScore}/100</span></td>
                  <td>${row.threatType}</td>
                  <td>${row.date}</td>
                  <td><span class="status-pill ${row.statusClass}">${row.status}</span></td>
                  <td>
                    <div class="table-actions">
                      <button class="ghost-btn compact-btn investigation-open-btn" type="button" data-investigation-id="${row.id}" data-report-id="${row.reportId}">View Case</button>
                    </div>
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="8">
                    <div class="empty-state compact-empty">
                      <div class="empty-state__card">
                        <div class="empty-state__icon">◌</div>
                        <h3>No investigations found</h3>
                        <p>Try changing your filters or search query.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderPlaceholder(title) {
  return `
    <div class="placeholder">
      <div class="placeholder-box">
        <h2>${title}</h2>
        <p>This workspace is using investigation ${state.currentInvestigationId}. Open Dashboard or Investigations from the sidebar to continue.</p>
      </div>
    </div>
  `;
}

function renderInvestigationHistoryPage() {
  const rows = getFilteredInvestigationHistory();
  const summaryCards = [
    { label: 'Total Investigations', value: mockInvestigationHistory.length },
    { label: 'Critical Threats', value: mockInvestigationHistory.filter((item) => item.riskLabel === 'Critical').length },
    { label: 'High Risk', value: mockInvestigationHistory.filter((item) => item.riskLabel === 'High').length },
    { label: 'Resolved', value: mockInvestigationHistory.filter((item) => item.status === 'Resolved').length }
  ];

  return `
    <div class="page-section">
      <div class="overview-header history-header">
        <div>
          <div class="eyebrow">Case Management</div>
          <h2>Investigation History</h2>
          <p class="section-subtitle">Review and manage previous email security investigations</p>
        </div>
      </div>

      <div class="metric-grid compact-grid">
        ${summaryCards.map((card) => `
          <div class="metric-card">
            <div class="metric-card__top">
              <span class="metric-card__label">${card.label}</span>
            </div>
            <div class="metric-card__value">${card.value}</div>
          </div>
        `).join('')}
      </div>

      <div class="panel history-panel">
        <div class="panel-header history-controls">
          <div class="history-search-wrap">
            <span class="search-icon">⌕</span>
            <input id="investigationHistorySearchInput" type="search" placeholder="Search investigations..." value="${state.investigationHistorySearch}" />
          </div>
          <div class="filter-tags">
            ${['All', 'Critical', 'High', 'Medium', 'Low', 'Resolved'].map((filter) => `
              <button class="filter-chip ${state.investigationHistoryFilter === filter ? 'active' : ''}" type="button" data-investigation-filter="${filter}">${filter}</button>
            `).join('')}
          </div>
        </div>

        <div class="table-wrap">
          <table class="data-table history-table">
            <thead>
              <tr>
                <th>Investigation ID</th>
                <th>Email / Subject</th>
                <th>Sender</th>
                <th>Risk Score</th>
                <th>Threat Type</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${rows.length ? rows.map((row) => `
                <tr class="history-row">
                  <td class="mono-text">${row.id}</td>
                  <td>${row.email}</td>
                  <td class="mono-text">${row.sender}</td>
                  <td><span class="risk-badge ${row.riskLabel.toLowerCase()}">${row.riskScore}/100</span></td>
                  <td>${row.threatType}</td>
                  <td>${row.date}</td>
                  <td><span class="status-pill ${row.statusClass}">${row.status}</span></td>
                  <td>
                    <div class="table-actions">
                      <button class="ghost-btn compact-btn history-view-btn" type="button" data-investigation-id="${row.id}" data-report-id="${row.reportId}">View Investigation</button>
                      <button class="ghost-btn compact-btn history-report-btn" type="button" data-report-id="${row.reportId}">View Report</button>
                      <button class="ghost-btn compact-btn history-delete-btn" type="button" data-investigation-id="${row.id}">Archive</button>
                    </div>
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="8">
                    <div class="empty-state compact-empty">
                      <div class="empty-state__card">
                        <div class="empty-state__icon">◌</div>
                        <h3>No investigations found</h3>
                        <p>Try changing your filters or search query.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderNotificationsPage() {
  const notifications = getFilteredNotifications();

  return `
    <div class="page-section">
      <div class="overview-header history-header">
        <div>
          <div class="eyebrow">Account</div>
          <h2>Security Notifications</h2>
        </div>
        <div class="notification-actions-row">
          <button class="ghost-btn" type="button" id="markAllNotificationsReadBtn">Mark all as read</button>
        </div>
      </div>

      <div class="panel notification-panel">
        <div class="panel-header history-controls">
          <div class="filter-tags">
            ${['All', 'Critical Threat', 'New Investigation', 'Threat Intelligence Update', 'System', 'Report Ready'].map((filter) => `
              <button class="filter-chip ${state.notificationFilter === filter ? 'active' : ''}" type="button" data-notification-filter="${filter}">${filter}</button>
            `).join('')}
          </div>
        </div>

        <div class="notification-list">
          ${notifications.length ? notifications.map((notification) => `
            <div class="notification-item ${notification.read ? 'read' : 'unread'}">
              <div class="notification-icon">${notification.category === 'Critical Threat' ? '⚠' : notification.category === 'Report Ready' ? '▤' : notification.category === 'System' ? '⚙' : notification.category === 'New Investigation' ? '◈' : '◍'}</div>
              <div class="notification-content">
                <div class="notification-category-row">
                  <span class="notification-category">${notification.category}</span>
                  <span class="notification-time">${notification.time}</span>
                </div>
                <h3>${notification.title}</h3>
                <p>${notification.detail}</p>
              </div>
              <div class="notification-actions">
                <button class="ghost-btn compact-btn" type="button" data-notification-read="${notification.id}">${notification.read ? 'Read' : 'Mark as read'}</button>
              </div>
            </div>
          `).join('') : `
            <div class="empty-state compact-empty">
              <div class="empty-state__card">
                <div class="empty-state__icon">🔔</div>
                <h3>No notifications</h3>
                <p>You’re all caught up.</p>
              </div>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}

function renderProfilePage() {
  return `
    <div class="page-section profile-page">
      <div class="profile-header-card panel">
        <div class="profile-summary">
          <div class="avatar large-avatar">${profileData.name.charAt(0)}</div>
          <div>
            <div class="eyebrow">Account</div>
            <h2>${profileData.name}</h2>
            <p>${profileData.email}</p>
          </div>
        </div>
        <div class="profile-stat-grid">
          <div class="mini-stat"><span>Account Type</span><strong>${profileData.accountType}</strong></div>
          <div class="mini-stat"><span>Status</span><strong>${profileData.status}</strong></div>
          <div class="mini-stat"><span>Last Login</span><strong>${profileData.lastLogin}</strong></div>
          <div class="mini-stat"><span>Investigations</span><strong>${profileData.investigationsCreated}</strong></div>
          <div class="mini-stat"><span>Reports</span><strong>${profileData.reportsGenerated}</strong></div>
        </div>
      </div>

      <div class="profile-grid">
        <div class="panel">
          <div class="panel-header compact">
            <div>
              <div class="panel-kicker">Connected Account</div>
              <h3>Connected Gmail Account</h3>
            </div>
          </div>
          <div class="gmail-connect-card profile-card">
            <div class="google-mark">G</div>
            <div>
              <div class="profile-email">${profileData.email}</div>
              <div class="connection-indicator green">● Connected</div>
            </div>
          </div>
          <div class="profile-actions">
            <button class="secondary-btn" type="button" id="manageGmailConnectionBtn">Manage Connection</button>
            <button class="ghost-btn" type="button" id="disconnectGmailBtn">Disconnect</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSettingsPage() {
  const toggle = (key, label, hint = '') => `
    <label class="setting-row">
      <div>
        <strong>${label}</strong>
        ${hint ? `<small>${hint}</small>` : ''}
      </div>
      <span class="toggle-wrap">
        <input type="checkbox" data-setting="${key}" ${state.settings[key] ? 'checked' : ''} />
        <span class="toggle-slider"></span>
      </span>
    </label>
  `;

  return `
    <div class="page-section settings-page">
      <div class="overview-header history-header">
        <div>
          <div class="eyebrow">Preferences</div>
          <h2>Settings</h2>
        </div>
      </div>

      <div class="settings-layout">
        <div class="panel settings-panel">
          <div class="settings-section">
            <h3>General</h3>
            <div class="settings-list">
              <label class="setting-row select-row">
                <div><strong>Theme</strong></div>
                <select data-setting-select="theme">
                  <option value="Dark" ${state.settings.theme === 'Dark' ? 'selected' : ''}>Dark</option>
                  <option value="Light" ${state.settings.theme === 'Light' ? 'selected' : ''}>Light</option>
                </select>
              </label>
              <label class="setting-row select-row">
                <div><strong>Language</strong></div>
                <select data-setting-select="language">
                  <option value="English" ${state.settings.language === 'English' ? 'selected' : ''}>English</option>
                  <option value="Spanish" ${state.settings.language === 'Spanish' ? 'selected' : ''}>Spanish</option>
                </select>
              </label>
              <label class="setting-row select-row">
                <div><strong>Time format</strong></div>
                <select data-setting-select="timeFormat">
                  <option value="24-hour" ${state.settings.timeFormat === '24-hour' ? 'selected' : ''}>24-hour</option>
                  <option value="12-hour" ${state.settings.timeFormat === '12-hour' ? 'selected' : ''}>12-hour</option>
                </select>
              </label>
              ${toggle('autoRefreshDashboard', 'Auto refresh dashboard')}
            </div>
          </div>

          <div class="settings-section">
            <h3>Security</h3>
            <div class="settings-list">
              <label class="setting-row select-row">
                <div><strong>Session timeout</strong></div>
                <select data-setting-select="sessionTimeout">
                  <option value="15 minutes" ${state.settings.sessionTimeout === '15 minutes' ? 'selected' : ''}>15 minutes</option>
                  <option value="30 minutes" ${state.settings.sessionTimeout === '30 minutes' ? 'selected' : ''}>30 minutes</option>
                  <option value="60 minutes" ${state.settings.sessionTimeout === '60 minutes' ? 'selected' : ''}>60 minutes</option>
                </select>
              </label>
              ${toggle('requireConfirmation', 'Require confirmation before destructive actions')}
              ${toggle('secureEvidenceHandling', 'Secure evidence handling')}
              ${toggle('automaticInvestigationLogging', 'Automatic investigation logging')}
            </div>
          </div>

          <div class="settings-section">
            <h3>Email Analysis</h3>
            <div class="settings-list">
              ${toggle('qrQuishingDetection', 'Enable QR / Quishing detection')}
              ${toggle('emailDnaAnalysis', 'Enable Email DNA analysis')}
              ${toggle('senderImpersonationDetection', 'Enable sender impersonation detection')}
              ${toggle('threatIntelligenceEnrichment', 'Enable threat intelligence enrichment')}
              ${toggle('campaignCorrelation', 'Enable campaign correlation')}
            </div>
          </div>

          <div class="settings-section">
            <h3>Notifications</h3>
            <div class="settings-list">
              ${toggle('criticalThreatAlerts', 'Critical threat alerts')}
              ${toggle('investigationCompletion', 'Investigation completion')}
              ${toggle('threatIntelligenceUpdates', 'Threat intelligence updates')}
              ${toggle('reportGenerationAlerts', 'Report generation alerts')}
            </div>
          </div>

          <div class="settings-section">
            <h3>Data & Privacy</h3>
            <div class="settings-list">
              <label class="setting-row select-row">
                <div><strong>Data retention period</strong></div>
                <select data-setting-select="dataRetention">
                  <option value="12 months" ${state.settings.dataRetention === '12 months' ? 'selected' : ''}>12 months</option>
                  <option value="18 months" ${state.settings.dataRetention === '18 months' ? 'selected' : ''}>18 months</option>
                  <option value="24 months" ${state.settings.dataRetention === '24 months' ? 'selected' : ''}>24 months</option>
                </select>
              </label>
              ${toggle('clearMockData', 'Clear mock investigation data')}
              ${toggle('exportInvestigationData', 'Export investigation data')}
            </div>
          </div>
        </div>
      </div>

      <div class="settings-footer">
        <button class="primary-btn" type="button" id="saveSettingsBtn">Save Changes</button>
      </div>
    </div>
  `;
}

function renderDashboardContent() {
  const rows = filterInvestigationRows(dashboardData.investigationRows);

  return `
    <div class="overview-header">
      <div>
        <div class="eyebrow">Security Overview</div>
        <h2>Monitor suspicious emails, investigate threats and trace attack infrastructure.</h2>
      </div>
      <div class="date-chip">${new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
    </div>

    <div class="metric-grid">
      ${dashboardData.stats
        .map(
          (stat) => `
            <div class="metric-card">
              <div class="metric-card__top">
                <span class="metric-card__label">${stat.label}</span>
                <span class="metric-icon">${stat.icon}</span>
              </div>
              <div class="metric-card__value" data-count="${stat.value.replace(/[^0-9]/g, '')}">${stat.value}</div>
              <div class="metric-card__trend">${stat.trend}</div>
            </div>
          `
        )
        .join('')}
    </div>

    <div class="dashboard-main-grid">
      <section class="panel panel-chart">
        <div class="panel-header">
          <div>
            <div class="panel-kicker">Threat Activity</div>
            <h3>Email Analysis Activity</h3>
          </div>
          <div class="legend-inline">
            <span><i class="legend-dot cyan"></i>Analyzed</span>
            <span><i class="legend-dot violet"></i>Threats</span>
            <span><i class="legend-dot red"></i>High Risk</span>
          </div>
        </div>

        <div class="chart-wrap">
          <svg viewBox="0 0 640 230" class="trend-chart" preserveAspectRatio="none" aria-label="Threat activity chart">
            <g class="chart-grid">
              <line x1="0" y1="30" x2="640" y2="30" />
              <line x1="0" y1="80" x2="640" y2="80" />
              <line x1="0" y1="130" x2="640" y2="130" />
              <line x1="0" y1="180" x2="640" y2="180" />
            </g>
            <path d="M0,175 C80,150 100,160 150,120 S240,50 290,95 S370,155 420,110 S520,45 640,70 L640,230 L0,230 Z" fill="rgba(104,213,255,0.18)" opacity="0.8"></path>
            <path d="M0,175 C80,150 100,160 150,120 S240,50 290,95 S370,155 420,110 S520,45 640,70" stroke="#7fd7ff" fill="none" stroke-width="2.5" stroke-linecap="round"></path>
            <path d="M0,145 C80,155 100,120 150,110 S240,66 290,88 S370,133 420,120 S520,80 640,100" stroke="#8b7cff" fill="none" stroke-width="2.5" stroke-linecap="round" opacity="0.9"></path>
            <path d="M0,192 C80,182 100,170 150,167 S240,138 290,148 S370,152 420,145 S520,128 640,136" stroke="#ff7d7d" fill="none" stroke-width="2.3" stroke-linecap="round" opacity="0.9"></path>
          </svg>
        </div>
      </section>

      <aside class="panel panel-chart panel-donut">
        <div class="panel-header compact">
          <div>
            <div class="panel-kicker">Threat Distribution</div>
            <h3>Attack Mix</h3>
          </div>
        </div>

        <div class="donut-wrap">
          <div class="donut-chart">
            <div class="donut-center">
              <strong>37</strong>
              <span>Threats</span>
            </div>
          </div>
          <div class="donut-legend">
            ${dashboardData.threatDistribution
              .map(
                (item) => `
                  <div class="legend-row">
                    <span class="legend-label"><i class="legend-dot ${item.tone}"></i>${item.name}</span>
                    <span>${item.value}%</span>
                  </div>
                `
              )
              .join('')}
          </div>
        </div>
      </aside>
    </div>

    <div class="content-grid">
      <section class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-kicker">Approach</div>
            <h3>Recent Investigations</h3>
          </div>
          <button class="text-action" id="viewAllReportsBtn" type="button">View All Investigations →</button>
        </div>

        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Risk</th>
                <th>Email / Sender</th>
                <th>Threat</th>
                <th>Indicators</th>
                <th>Analyzed</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${rows
                .map(
                  (row) => `
                    <tr>
                      <td><span class="risk-badge ${row.level}">${row.risk}</span></td>
                      <td class="sender-cell"><span class="sender-email">${row.sender}</span></td>
                      <td>${row.threat}</td>
                      <td>${row.indicators}</td>
                      <td>${row.analyzed}</td>
                      <td><span class="inline-status ${row.status.toLowerCase().replace(/\s+/g, '-')}">${row.status}</span></td>
                    </tr>
                  `
                )
                .join('') || '<tr><td colspan="6">No matching investigations were found.</td></tr>'}
            </tbody>
          </table>
        </div>
      </section>

      <aside class="panel panel-stack">
        <div class="panel-header compact">
          <div>
            <div class="panel-kicker">Threat Feed</div>
            <h3>Security Activity</h3>
          </div>
        </div>

        <div class="timeline-list">
          ${dashboardData.activity
            .map(
              (event) => `
                <div class="timeline-item">
                  <div class="timeline-time">${event.time}</div>
                  <div class="timeline-rail"><span class="timeline-dot"></span></div>
                  <div class="timeline-body">
                    <h4>${event.title}</h4>
                    <p>${event.detail}</p>
                  </div>
                </div>
              `
            )
            .join('')}
        </div>
      </aside>
    </div>

    <div class="bottom-grid">
      <div class="panel gmail-panel">
        <div class="panel-header compact">
          <div>
            <div class="panel-kicker">Integration</div>
            <h3>${state.gmailConnected ? 'Gmail Connected' : 'Connect Gmail'}</h3>
          </div>
          <span class="connection-indicator">● ${state.gmailConnected ? 'Connected' : 'Not connected'}</span>
        </div>

        <div class="gmail-mailbox ${state.gmailConnected ? '' : 'gmail-mailbox--disconnected'}">${state.gmailConnected ? dashboardData.gmailAccount : 'No Gmail account connected'}</div>
        <div class="gmail-copy">${state.gmailConnected ? 'Inbox monitoring ready' : 'Connect a Google account to enable email intelligence.'}</div>
        <button class="secondary-btn" type="button" id="${state.gmailConnected ? 'gmailSyncBtn' : 'gmailConnectBtn'}">${state.gmailConnected ? 'Open Inbox' : 'Connect Gmail'}</button>
      </div>

      <div class="panel action-panel">
        <div class="action-icon">✉</div>
        <div class="action-copy">
          <div class="panel-kicker">Investigation</div>
          <h3>Investigate a suspicious email</h3>
        </div>
        <div class="action-buttons">
          <button class="secondary-btn" type="button" id="uploadEmailBtn">Upload Email</button>
          <button class="primary-btn" type="button" id="quickActionBtn">${state.gmailConnected ? 'Open Gmail' : 'Connect Gmail'}</button>
        </div>
      </div>

      <div class="panel status-panel">
        <div class="panel-header compact">
          <div>
            <div class="panel-kicker">System Status</div>
            <h3>MailTrace Security Status</h3>
          </div>
        </div>

        <div class="status-list">
          <div class="status-row"><span>Email Parser</span><span class="online-pill">ONLINE</span></div>
          <div class="status-row"><span>Threat Intelligence</span><span class="online-pill">ONLINE</span></div>
          <div class="status-row"><span>AI Analysis</span><span class="online-pill">ONLINE</span></div>
          <div class="status-row"><span>Forensic Engine</span><span class="online-pill">ONLINE</span></div>
        </div>
      </div>
    </div>
  `;
}

function renderGmailInboxPage() {
  if (!state.gmailConnected) {
    return `
      <div class="empty-state">
        <div class="empty-state__card">
          <div class="empty-state__icon">✉</div>
          <h2>Connect your Gmail</h2>
          <p>Secure your inbox with MailTrace AI to monitor suspicious messages in real time.</p>
          <button class="primary-btn" type="button" id="gmailConnectEntryBtn">Connect Gmail</button>
        </div>
      </div>
    `;
  }

  const filteredMessages = filterGmailMessages(gmailMessages);
  const tabs = ['Inbox', 'Starred', 'Sent', 'Spam', 'Trash'];

  return `
    <div class="gmail-layout">
      <section class="panel gmail-list-panel">
        <div class="panel-header gmail-header">
          <div>
            <div class="panel-kicker">Mail Security</div>
            <h3>Gmail Inbox</h3>
          </div>
          <div class="gmail-toolbar-actions">
            <button class="secondary-btn" type="button" id="gmailUploadBtn">Upload Email</button>
          </div>
        </div>

        <div class="gmail-tabs">
          ${tabs.map((tab) => `
            <button class="gmail-tab ${tab === 'Inbox' ? 'active' : ''}" type="button">${tab}</button>
          `).join('')}
        </div>

        <div class="gmail-search-wrap">
          <span class="search-icon">⌕</span>
          <input id="emailSearchInput" type="search" placeholder="Search all mail and threats" value="${state.searchTerm}" />
        </div>

        <div class="warning-banner">
          <span>⚠</span>
          <strong>Urgent Account Verification Required</strong>
          <small>Critical phishing pattern detected</small>
        </div>

        <div class="gmail-list">
          ${filteredMessages
            .map(
              (message) => `
                <button class="mail-row ${state.selectedEmailId === message.id ? 'selected' : ''}" data-email-id="${message.id}" type="button">
                  <div class="mail-row__sender">${message.senderName}</div>
                  <div class="mail-row__content">
                    <div class="mail-row__subject">${message.subject}</div>
                    <div class="mail-row__preview">${message.preview}</div>
                  </div>
                  <div class="mail-row__meta">
                    <span class="mail-row__time">${message.timestamp}</span>
                    <span class="risk-badge ${message.riskClass}">${message.riskLevel}</span>
                  </div>
                </button>
              `
            )
            .join('') || '<div class="mail-empty">No emails match your current search.</div>'}
        </div>
      </section>

      <aside class="panel gmail-side-panel">
        <div class="panel-header compact">
          <div>
            <div class="panel-kicker">Threat Summary</div>
            <h3>Inbox Risk Overview</h3>
          </div>
        </div>

        <div class="gmail-score-card">
          <strong>24</strong>
          <span>Messages flagged</span>
        </div>

        <div class="mini-stat-grid">
          <div class="mini-stat">
            <span>Phishing</span>
            <strong>11</strong>
          </div>
          <div class="mini-stat">
            <span>Malware</span>
            <strong>7</strong>
          </div>
          <div class="mini-stat">
            <span>QR</span>
            <strong>3</strong>
          </div>
          <div class="mini-stat">
            <span>Clean</span>
            <strong>6</strong>
          </div>
        </div>

        <div class="gmail-side-actions">
          <button class="primary-btn" type="button" id="openGmailInboxBtn">Analyze Inbox</button>
        </div>
      </aside>
    </div>
  `;
}

function renderEmailDetailPage() {
  const email = getSelectedEmail();

  return `
    <div class="investigation-shell">
      <div class="investigation-header">
        <div class="investigation-header__left">
          <button class="ghost-btn" type="button" id="backToInboxBtn">← Back to Inbox</button>
          <div>
            <div class="panel-kicker">Email Investigation</div>
            <h2>Email Investigation</h2>
          </div>
        </div>

        <div class="investigation-header__meta">
          <div class="investigation-meta-block">
            <span class="meta-label">Investigation ID</span>
            <strong>${investigationData.investigationId}</strong>
          </div>
          <div class="investigation-status">
            <span class="dot-green"></span>
            Active Investigation
          </div>
        </div>
      </div>

      <div class="analysis-tabs">
        ${['Overview', 'Headers', 'URLs', 'Attachments', 'QR Analysis', 'Email DNA', 'Evidence'].map((tab) => `
          <button class="analysis-tab ${tab === 'Overview' ? 'active' : ''}" type="button">${tab}</button>
        `).join('')}
      </div>

      <div class="investigation-layout">
        <section class="panel investigation-main-panel">
          <div class="sender-row">
            <div class="sender-row__meta">
              <span class="meta-label">From</span>
              <strong class="mono-text">${investigationData.sender}</strong>
            </div>
            <div class="sender-warning">
              <span>⚠</span>
              POSSIBLE IMPERSONATION
            </div>
          </div>

          <div class="sender-identity-grid">
            <div class="identity-block">
              <span class="meta-label">Display Name</span>
              <strong>${investigationData.displayName}</strong>
            </div>
            <div class="identity-block">
              <span class="meta-label">To</span>
              <strong class="mono-text">${investigationData.recipient}</strong>
            </div>
            <div class="identity-block">
              <span class="meta-label">Received</span>
              <strong>${investigationData.timestamp}</strong>
            </div>
            <div class="identity-block wide">
              <span class="meta-label">Subject</span>
              <strong>${investigationData.subject}</strong>
            </div>
          </div>

          <div class="section-panel">
            <div class="section-header">
              <h3>EMAIL CONTENT</h3>
            </div>
            <div class="email-content-box">
              <pre>${email.body}</pre>
              <button class="suspicious-link" type="button" aria-label="Suspicious URL detected">Suspicious URL detected</button>
            </div>
          </div>

          <div class="section-panel">
            <div class="section-header">
              <h3>SUSPICIOUS INDICATORS</h3>
            </div>
            <div class="indicator-stack">
              ${investigationData.urls
                .map(
                  (url) => `
                    <div class="indicator-item">
                      <div class="indicator-item__left">
                        <span class="mono-text">${url.value}</span>
                        <div class="indicator-meta-line">
                          <span class="indicator-status">Status: ${url.status}</span>
                          <span class="indicator-reason">Reason: ${url.reason}</span>
                        </div>
                      </div>
                      <div class="indicator-actions">
                        <button class="ghost-btn compact-btn" type="button">Inspect</button>
                        <button class="ghost-btn compact-btn" type="button">Copy Indicator</button>
                      </div>
                    </div>
                  `
                )
                .join('')}
            </div>
          </div>

          <div class="section-panel">
            <div class="section-header">
              <h3>QR / QUISHING ANALYSIS</h3>
            </div>
            <div class="qr-card">
              <div class="qr-placeholder" aria-label="QR code placeholder">
                <div class="qr-grid"></div>
              </div>
              <div class="qr-details">
                <div class="qr-row"><span>Detected:</span><strong>${investigationData.qrCodes} QR Code</strong></div>
                <div class="qr-row"><span>Status:</span><strong class="status-critical">SUSPICIOUS</strong></div>
                <div class="qr-row"><span>Embedded URL:</span><strong class="mono-text">${investigationData.qrUrl}</strong></div>
                <div class="qr-row"><span>Detection:</span><strong>QR code extracted from email content.</strong></div>
                <button class="ghost-btn compact-btn" type="button">Inspect QR</button>
              </div>
            </div>
          </div>

          <div class="section-panel">
            <div class="section-header">
              <h3>ATTACHMENTS</h3>
            </div>
            <div class="attachment-card">
              <div class="attachment-card__top">
                <div class="attachment-file">
                  <span class="file-badge">PDF</span>
                  <strong>${investigationData.attachment.name}</strong>
                </div>
                <span class="status-critical">SUSPICIOUS</span>
              </div>
              <div class="attachment-meta-grid">
                <div><span>Size</span><strong>${investigationData.attachment.size}</strong></div>
                <div><span>File Type</span><strong>${investigationData.attachment.type}</strong></div>
                <div><span>Hash</span><strong class="mono-text">${investigationData.attachment.hash}</strong></div>
                <div><span>Analysis</span><strong>${investigationData.attachment.analysis}</strong></div>
              </div>
              <button class="ghost-btn" type="button">View Evidence</button>
            </div>
          </div>
        </section>

        <aside class="panel investigation-side-panel">
          <div class="risk-card">
            <div class="risk-card__header">
              <div class="panel-kicker">MailTrace Risk Assessment</div>
              <h3>Risk Score</h3>
            </div>
            <div class="risk-ring" aria-label="Risk score 92 percent">
              <div class="risk-ring__inner">
                <strong>92</strong>
                <span>/ 100</span>
              </div>
            </div>
            <div class="risk-label">CRITICAL</div>
            <div class="confidence-line">Confidence: <strong>Demo confidence — 94%</strong></div>
            <div class="risk-reasons">
              <div class="reason-item"><span class="reason-icon">◌</span> Sender domain resembles a trusted brand</div>
              <div class="reason-item"><span class="reason-icon">◍</span> SPF authentication failed</div>
              <div class="reason-item"><span class="reason-icon">◉</span> DKIM authentication failed</div>
              <div class="reason-item"><span class="reason-icon">△</span> Suspicious URL detected</div>
              <div class="reason-item"><span class="reason-icon">◈</span> QR code detected</div>
              <div class="reason-item"><span class="reason-icon">✦</span> Urgent credential-verification language</div>
            </div>
          </div>

          <div class="summary-section">
            <div class="section-header compact-header">
              <h3>EMAIL AUTHENTICATION</h3>
            </div>
            <div class="auth-grid">
              <div class="auth-item failed">
                <span>SPF</span>
                <strong>FAILED</strong>
                <small>Sender policy check failed</small>
              </div>
              <div class="auth-item failed">
                <span>DKIM</span>
                <strong>FAILED</strong>
                <small>Signature verification failed</small>
              </div>
              <div class="auth-item failed">
                <span>DMARC</span>
                <strong>FAILED</strong>
                <small>Domain alignment failed</small>
              </div>
            </div>
            <button class="ghost-btn compact-btn auth-detail-btn" type="button">View Authentication Details</button>
          </div>

          <div class="summary-section">
            <div class="section-header compact-header">
              <h3>SENDER IDENTITY ANALYSIS</h3>
            </div>
            <div class="identity-card">
              <div class="identity-card__line"><span>Display Name</span><strong>${investigationData.displayName}</strong></div>
              <div class="identity-card__line"><span>Actual Address</span><strong class="mono-text">${investigationData.sender}</strong></div>
              <div class="identity-card__line"><span>Expected Brand</span><strong>${investigationData.impersonation.expectedBrand}</strong></div>
              <div class="identity-card__line"><span>Domain Similarity</span><strong>${investigationData.impersonation.domainSimilarity}</strong></div>
              <div class="identity-card__line"><span>Authentication</span><strong>${investigationData.impersonation.authentication.join(' ')}</strong></div>
              <div class="identity-compare">
                <span>PayPal</span>
                <span class="compare-arrow">↓</span>
                <span class="suspicious-domain mono-text">paypa1-support.com</span>
              </div>
              <div class="identity-final">${investigationData.impersonation.finalStatus}</div>
            </div>
          </div>

          <div class="summary-section">
            <div class="section-header compact-header">
              <h3>EMAIL DNA FINGERPRINT</h3>
            </div>
            <div class="dna-card">
              <div class="dna-radar" aria-label="Email DNA radar chart">
                <div class="radar-core"></div>
                <span class="r1"></span>
                <span class="r2"></span>
                <span class="r3"></span>
                <span class="r4"></span>
                <span class="r5"></span>
                <span class="needle"></span>
              </div>
              <div class="dna-metrics">
                <div><span>Sender Behavior</span><strong>${investigationData.emailDNA.senderBehavior}</strong></div>
                <div><span>Writing Style</span><strong>${investigationData.emailDNA.writingStyle}</strong></div>
                <div><span>Sending Pattern</span><strong>${investigationData.emailDNA.sendingPattern}</strong></div>
                <div><span>Recipient Pattern</span><strong>${investigationData.emailDNA.recipientPattern}</strong></div>
                <div><span>Infrastructure Pattern</span><strong>${investigationData.emailDNA.infrastructurePattern}</strong></div>
              </div>
              <div class="dna-footer">
                <div class="dna-match"><span>DNA Match:</span><strong>${investigationData.emailDNA.dnaMatch}</strong></div>
                <div class="dna-status">${investigationData.emailDNA.status}</div>
              </div>
            </div>
          </div>

          <div class="detail-action-wrap">
            <button class="primary-btn" type="button" id="detailAnalyzeBtn">Analyze Email</button>
          </div>
        </aside>
      </div>
    </div>
  `;
}

function renderAnalysisScanningPage() {
  const stages = [
    'Parsing email',
    'Checking SPF',
    'Checking DKIM',
    'Checking DMARC',
    'Extracting URLs',
    'Scanning QR codes',
    'Analyzing attachments',
    'Running Email DNA analysis',
    'Checking sender impersonation',
    'Querying threat intelligence',
    'Correlating indicators',
    'Building threat graph',
    'Calculating risk score'
  ];

  const progressIndex = Math.min(stages.length - 1, Math.max(0, Math.floor(state.analysisProgress / 100 * stages.length)));

  return `
    <div class="scan-shell">
      <div class="scan-card">
        <div class="scan-icon-wrap">
          <div class="scan-icon">✦</div>
        </div>
        <h2>${state.analysisProgress >= 100 ? 'Analysis Complete' : 'Analyzing Email'}</h2>
        <p>${state.analysisProgress >= 100 ? 'Demo Analysis complete. Threat assessment is ready.' : 'MailTrace AI is examining the message for security threats.'}</p>

        <div class="scan-pipeline">
          ${stages.map((stage, index) => {
            const isDone = index < progressIndex;
            const isActive = index === progressIndex && state.analysisProgress < 100;
            const stateClass = isDone ? 'complete' : isActive ? 'active' : 'pending';
            return `<div class="scan-stage ${stateClass}"><span>${isDone ? '✓' : isActive ? '●' : '○'}</span><span>${stage}</span></div>`;
          }).join('')}
        </div>

        <div class="scan-progress-meta">
          <span>Analysis Progress</span>
          <strong id="scanProgressValue">${state.analysisProgress}%</strong>
        </div>
        <div class="scan-progress-bar">
          <div class="scan-progress-fill" style="width: ${state.analysisProgress}%"></div>
        </div>
        <div class="demo-tag small-demo">Demo Analysis</div>
      </div>
    </div>
  `;
}

function renderThreatResultPage() {
  const score = investigationData.riskScore;
  const level = investigationData.riskLevel;
  const threats = state.activeInvestigation.threatTypes || ['Phishing', 'Sender Impersonation', 'Suspicious URL', 'QR / Quishing'];
  const riskFactors = (investigationData.riskScoring?.layers || []).map((layer) => ({
    label: layer.name,
    value: layer.score
  }));
  const fallbackFactors = [
    { label: 'Sender Impersonation', value: 92 },
    { label: 'URL Reputation', value: 88 },
    { label: 'Authentication', value: 96 },
    { label: 'QR Detection', value: 81 },
    { label: 'Email DNA', value: 74 },
    { label: 'Content Analysis', value: 67 }
  ];
  const factors = riskFactors.length ? riskFactors : fallbackFactors;

  return `
    <div class="result-shell">
      <div class="panel result-top-panel result-top-panel--new">
        <div class="result-top-copy">
          <div class="panel-kicker">Threat Analysis Complete</div>
          <h2>Threat Analysis Complete</h2>
          <div class="result-inline-meta">
            <span>Investigation: <strong>${investigationData.investigationId}</strong></span>
            <span class="status-live"><span class="dot-green"></span> Investigation Ready</span>
          </div>
        </div>
        <div class="result-score">
          <strong>${score}</strong>
          <span>/100</span>
          <small>${level} RISK</small>
        </div>
      </div>

      <div class="result-summary-card">
        <p>${threatResultData.summary || investigationData.aiExplanation}</p>
        <div class="demo-inline"><span>Demo confidence indicator</span></div>
      </div>

      <div class="result-grid">
        <section class="panel result-panel">
          <div class="panel-header compact">
            <div>
              <div class="panel-kicker">Detection Summary</div>
              <h3>Threat Summary</h3>
            </div>
          </div>

          <div class="summary-grid">
            ${threats.map((threat) => `<div class="summary-chip"><span>${threat.toUpperCase()}</span><strong>Detected</strong></div>`).join('')}
            <div class="summary-chip"><span>SPF</span><strong>${investigationData.spf}</strong></div>
            <div class="summary-chip"><span>DKIM</span><strong>${investigationData.dkim}</strong></div>
            <div class="summary-chip"><span>DMARC</span><strong>${investigationData.dmarc}</strong></div>
            <div class="summary-chip"><span>Honeytoken</span><strong>${honeytokenData.status}</strong></div>
            <div class="summary-chip"><span>Breadcrumb</span><strong>${breadcrumbData.status}</strong></div>
            <div class="summary-chip"><span>Risk Score</span><strong>${score} / 100</strong></div>
          </div>

          <div class="breakdown-list">
            ${factors.map((factor) => `
              <div class="breakdown-item">
                <div class="breakdown-item__left">
                  <div>
                    <strong>${factor.label}</strong>
                  </div>
                </div>
                <div class="risk-bar-wrap">
                  <span class="risk-bar" style="width: ${factor.value}%"></span>
                </div>
                <span class="breakdown-status">${factor.value}%</span>
              </div>
            `).join('')}
          </div>

          <div class="result-telemetry-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; margin-top: 18px;">
            <div class="telemetry-box" style="background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border-color); border-radius: 8px; padding: 14px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
                <strong style="color:var(--text-primary); font-size:0.85rem;">🍯 HONEYTOKEN TELEMETRY</strong>
                <span style="background:rgba(239,68,68,0.15); color:#ef4444; padding:2px 8px; border-radius:4px; font-size:0.72rem; font-weight:700;">${honeytokenData.status}</span>
              </div>
              <div style="font-size:0.76rem; color:var(--text-muted); line-height:1.6;">
                <div><span style="color:var(--text-secondary);">Token ID:</span> <code style="color:var(--cyan);">${honeytokenData.tokenId}</code></div>
                <div><span style="color:var(--text-secondary);">Trigger Timestamp:</span> ${honeytokenData.trigger_timestamp || honeytokenData.detectionTime}</div>
                <div><span style="color:var(--text-secondary);">Related Investigation:</span> ${honeytokenData.related_investigation || investigationData.investigationId}</div>
              </div>
              <div style="margin-top:8px; font-size:0.7rem; color:#f59e0b; background:rgba(245,158,11,0.08); padding:5px 8px; border-radius:4px;">
                🛡 Controlled Lab / Authorized Use Only
              </div>
            </div>

            <div class="telemetry-box" style="background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border-color); border-radius: 8px; padding: 14px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
                <strong style="color:var(--text-primary); font-size:0.85rem;">📍 BREADCRUMB TELEMETRY</strong>
                <span style="background:rgba(239,68,68,0.15); color:#ef4444; padding:2px 8px; border-radius:4px; font-size:0.72rem; font-weight:700;">${breadcrumbData.status}</span>
              </div>
              <div style="font-size:0.76rem; color:var(--text-muted); line-height:1.6;">
                <div><span style="color:var(--text-secondary);">Token ID:</span> <code style="color:var(--cyan);">${breadcrumbData.token_id || breadcrumbData.id}</code></div>
                <div><span style="color:var(--text-secondary);">Event Timestamp:</span> ${breadcrumbData.event_timestamp || breadcrumbData.firstSeen}</div>
                <div><span style="color:var(--text-secondary);">Collector/Exit IP:</span> ${breadcrumbData.collector_exit_ip || breadcrumbData.ipAddress}</div>
                <div><span style="color:var(--text-secondary);">User Agent:</span> ${breadcrumbData.userAgent}</div>
                <div><span style="color:var(--text-secondary);">Redirect Chain:</span> ${breadcrumbData.redirectChain}</div>
                <div><span style="color:var(--text-secondary);">Geolocation Context:</span> ${breadcrumbData.approximateLocation}</div>
              </div>
              <div style="margin-top:8px; font-size:0.7rem; color:#f59e0b; background:rgba(245,158,11,0.08); padding:5px 8px; border-radius:4px;">
                ℹ Infrastructure clue — not exact attacker location
              </div>
            </div>
          </div>
        </section>

        <aside class="panel result-aside-panel">
          <div class="panel-header compact">
            <div>
              <div class="panel-kicker">Why MailTrace AI Flagged This Email</div>
              <h3>AI Explanation</h3>
            </div>
          </div>
          <p class="ai-explanation">${investigationData.aiExplanation}</p>
          <button class="ghost-btn compact-btn" type="button" id="viewEvidenceBtn">View Detailed Evidence →</button>

          <div class="action-card">
            <div class="panel-kicker">Recommended Action</div>
            <h3>⚠ Treat this email as suspicious.</h3>
            <ul>
              ${investigationData.recommendedActions.map((action) => `<li>${action}</li>`).join('')}
            </ul>
            <div class="threat-action-buttons">
              <button class="primary-btn" type="button" id="investigateFurtherBtn">View Investigation</button>
              <button class="ghost-btn" type="button" id="generateReportBtn">Generate Forensic Report</button>
            </div>
          </div>
        </aside>
      </div>

      <div class="result-nav-row">
        <button class="ghost-btn" type="button" id="resultBackToInvestigationBtn">← Back to Investigation</button>
        <button class="ghost-btn" type="button" id="resultThreatIntelBtn">Threat Intelligence →</button>
        <button class="ghost-btn" type="button" id="resultThreatGraphBtn">Threat Graph →</button>
        <button class="ghost-btn" type="button" id="resultTimelineBtn">Forensic Timeline →</button>
        <button class="ghost-btn" type="button" id="resultAiCopilotBtn">AI Copilot →</button>
        <button class="primary-btn" type="button" id="resultGenerateReportBtn">Generate Report</button>
      </div>
    </div>
  `;
}

function renderThreatIntelligencePage() {
  const selectedIndicator = threatIntelligenceData.relatedIndicators.find(
    (item) => item.indicator === state.selectedThreatIndicator
  ) || threatIntelligenceData.relatedIndicators[0];

  return `
    <div class="threat-intel-shell">
      <div class="intel-header">
        <div>
          <div class="panel-kicker">Threat Intelligence</div>
          <h2>Threat Intelligence</h2>
          <p>“Enrich suspicious indicators with external security intelligence.”</p>
        </div>
        <div class="intel-status-pill"><span class="dot-green"></span> Intelligence Engine Online</div>
      </div>

      <div class="intel-toolbar">
        <div class="intel-search-wrap">
          <span class="search-icon">⌕</span>
          <input id="intelSearchInput" type="search" placeholder="Search IP, domain, URL or file hash" value="${state.searchTerm || threatIntelligenceData.indicator}" />
        </div>
        <button class="primary-btn" type="button" id="intelInvestigateBtn">Investigate</button>
      </div>

      <div class="intel-demo-tag">Demo Intelligence Data</div>

      <div class="metric-grid compact-metric-grid">
        <div class="metric-card compact-card">
          <div class="metric-card__label">Indicators Analyzed</div>
          <div class="metric-card__value">1,284</div>
        </div>
        <div class="metric-card compact-card">
          <div class="metric-card__label">High Risk</div>
          <div class="metric-card__value">86</div>
        </div>
        <div class="metric-card compact-card">
          <div class="metric-card__label">Domains Flagged</div>
          <div class="metric-card__value">42</div>
        </div>
        <div class="metric-card compact-card">
          <div class="metric-card__label">IP Addresses</div>
          <div class="metric-card__value">31</div>
        </div>
      </div>

      <div class="intel-layout">
        <section class="intel-main">
          <div class="panel intel-panel">
            <div class="panel-header compact">
              <div>
                <div class="panel-kicker">Indicator</div>
                <h3>${threatIntelligenceData.indicator}</h3>
              </div>
              <span class="risk-badge critical">${threatIntelligenceData.riskLevel}</span>
            </div>

            <div class="intel-result-grid">
              <div class="intel-result-row"><span>Type</span><strong>${threatIntelligenceData.type}</strong></div>
              <div class="intel-result-row"><span>Risk</span><strong>${threatIntelligenceData.riskLevel}</strong></div>
              <div class="intel-result-row"><span>Reputation</span><strong>${threatIntelligenceData.reputation}</strong></div>
              <div class="intel-result-row"><span>First Seen</span><strong>${threatIntelligenceData.firstSeen}</strong></div>
              <div class="intel-result-row"><span>Last Seen</span><strong>${threatIntelligenceData.lastSeen}</strong></div>
              <div class="intel-result-row"><span>Sources</span><strong>${threatIntelligenceData.sources.join(', ')}</strong></div>
            </div>
          </div>

          <div class="panel intel-panel">
            <div class="panel-header compact">
              <div>
                <div class="panel-kicker">Intelligence Sources</div>
                <h3>INTELLIGENCE SOURCES</h3>
              </div>
            </div>
            <div class="source-grid">
              <div class="source-card"><div class="source-icon">V</div><div><strong>VirusTotal</strong><small>Threat context and reputation signals</small></div><span>Demo Connected</span></div>
              <div class="source-card"><div class="source-icon">A</div><div><strong>AbuseIPDB</strong><small>IP abuse and infrastructure reports</small></div><span>Demo Connected</span></div>
              <div class="source-card"><div class="source-icon">U</div><div><strong>URLhaus</strong><small>Malicious URL and host enrichment</small></div><span>Demo Connected</span></div>
              <div class="source-card"><div class="source-icon">W</div><div><strong>WHOIS / RDAP</strong><small>Domain ownership and registration context</small></div><span>Demo Connected</span></div>
              <div class="source-card"><div class="source-icon">M</div><div><strong>MISP</strong><small>Campaign and observability sharing</small></div><span>Demo Connected</span></div>
            </div>
          </div>

          <div class="panel intel-panel">
            <div class="panel-header compact">
              <div>
                <div class="panel-kicker">Domain Analysis</div>
                <h3>DOMAIN ANALYSIS</h3>
              </div>
            </div>
            <div class="analysis-grid two-col">
              <div class="analysis-row"><span>Domain</span><strong class="mono-text">${threatIntelligenceData.domainInfo.domain}</strong></div>
              <div class="analysis-row"><span>Domain Age</span><strong>${threatIntelligenceData.domainInfo.age}</strong></div>
              <div class="analysis-row"><span>Registrar</span><strong>${threatIntelligenceData.domainInfo.registrar}</strong></div>
              <div class="analysis-row"><span>Registration</span><strong>${threatIntelligenceData.domainInfo.registration}</strong></div>
              <div class="analysis-row"><span>Reputation</span><strong>${threatIntelligenceData.domainInfo.reputation}</strong></div>
              <div class="analysis-row"><span>Similarity</span><strong>${threatIntelligenceData.domainInfo.similarity}</strong></div>
              <div class="analysis-row"><span>DNS Status</span><strong>${threatIntelligenceData.domainInfo.dnsStatus}</strong></div>
              <div class="analysis-row"><span>WHOIS / RDAP</span><strong>${threatIntelligenceData.domainInfo.whois}</strong></div>
            </div>
          </div>

          <div class="panel intel-panel">
            <div class="panel-header compact">
              <div>
                <div class="panel-kicker">IP Intelligence</div>
                <h3>IP INTELLIGENCE</h3>
              </div>
            </div>
            <div class="analysis-grid two-col">
              <div class="analysis-row"><span>IP</span><strong class="mono-text">${threatIntelligenceData.ipInfo.ip}</strong></div>
              <div class="analysis-row"><span>Reputation</span><strong>${threatIntelligenceData.ipInfo.reputation}</strong></div>
              <div class="analysis-row"><span>Abuse Reports</span><strong>${threatIntelligenceData.ipInfo.abuseReports}</strong></div>
              <div class="analysis-row"><span>ASN</span><strong>${threatIntelligenceData.ipInfo.asn}</strong></div>
              <div class="analysis-row"><span>Country</span><strong>${threatIntelligenceData.ipInfo.country}</strong></div>
              <div class="analysis-row"><span>ISP</span><strong>${threatIntelligenceData.ipInfo.isp}</strong></div>
              <div class="analysis-row"><span>First Seen</span><strong>${threatIntelligenceData.ipInfo.firstSeen}</strong></div>
              <div class="analysis-row"><span>Last Seen</span><strong>${threatIntelligenceData.ipInfo.lastSeen}</strong></div>
            </div>
          </div>

          <div class="panel intel-panel">
            <div class="panel-header compact">
              <div>
                <div class="panel-kicker">Related Indicators</div>
                <h3>RELATED INDICATORS</h3>
              </div>
            </div>
            <div class="related-table-wrap">
              <table class="data-table related-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Indicator</th>
                    <th>Risk</th>
                    <th>Relationship</th>
                  </tr>
                </thead>
                <tbody>
                  ${threatIntelligenceData.relatedIndicators
                    .map(
                      (item) => `
                        <tr data-related-indicator="${item.indicator}" class="related-row ${state.selectedThreatIndicator === item.indicator ? 'selected' : ''}">
                          <td>${item.type}</td>
                          <td class="mono-text">${item.indicator}</td>
                          <td><span class="risk-badge ${item.risk === 'HIGH' ? 'high' : 'medium'}">${item.risk}</span></td>
                          <td>${item.relationship}</td>
                        </tr>
                      `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <aside class="intel-side">
          <div class="panel intel-side-panel">
            <div class="panel-header compact">
              <div>
                <div class="panel-kicker">Approximate Geolocation</div>
                <h3>APPROXIMATE GEOLOCATION</h3>
              </div>
            </div>
            <div class="map-card">
              <div class="map-surface">
                <div class="map-pin"></div>
              </div>
              <div class="map-meta">
                <div class="map-meta-row"><span>Location</span><strong>${threatIntelligenceData.geolocation.region}</strong></div>
                <div class="map-meta-row"><span>Country</span><strong>${threatIntelligenceData.geolocation.country}</strong></div>
                <div class="map-meta-row"><span>Coordinates</span><strong class="mono-text">${threatIntelligenceData.geolocation.coordinates}</strong></div>
                <div class="map-meta-row"><span>Network</span><strong>${threatIntelligenceData.geolocation.network}</strong></div>
              </div>
            </div>
            <p class="geo-note">“Geolocation is approximate and represents observed network infrastructure. It does not identify the attacker's physical location.”</p>
            <button class="primary-btn" type="button" id="viewMapBtn">View on Map</button>
          </div>

          <div class="panel intel-side-panel">
            <div class="panel-header compact">
              <div>
                <div class="panel-kicker">Indicator Risk</div>
                <h3>INDICATOR RISK</h3>
              </div>
            </div>
            <div class="risk-card risk-card--compact">
              <div class="risk-ring risk-ring--small" aria-label="Risk score 87 percent">
                <div class="risk-ring__inner"><strong>87</strong><span>/ 100</span></div>
              </div>
              <div class="risk-label">HIGH RISK</div>
              <div class="risk-breakdown-list">
                ${threatIntelligenceData.threatBreakdown
                  .map(
                    (item) => `
                      <div class="risk-breakdown-row">
                        <span>${item.label}</span>
                        <strong>${item.value}</strong>
                      </div>
                    `
                  )
                  .join('')}
              </div>
            </div>
          </div>

          <div class="panel intel-side-panel">
            <div class="panel-header compact">
              <div>
                <div class="panel-kicker">Forensic Context</div>
                <h3>FORENSIC CONTEXT</h3>
              </div>
            </div>
            <div class="forensic-list">
              <div><span>Source Email</span><strong class="mono-text">${threatIntelligenceData.sourceEmail}</strong></div>
              <div><span>Investigation</span><strong>${threatIntelligenceData.investigationId}</strong></div>
              <div><span>Detected</span><strong>${threatIntelligenceData.detected}</strong></div>
              <div><span>Related Campaign</span><strong>${threatIntelligenceData.campaign}</strong></div>
              <div><span>Evidence Items</span><strong>${threatIntelligenceData.evidenceItems}</strong></div>
            </div>
            <button class="ghost-btn" type="button" id="viewInThreatGraphBtn">View in Threat Graph →</button>
          </div>
        </aside>
      </div>
    </div>
  `;
}

function renderAICopilotPage() {
  const recentQuestions = state.aiCopilotRecentQuestions.length
    ? state.aiCopilotRecentQuestions
    : ['Why was this email flagged?', 'Explain the sender', 'Summarize the investigation'];

  const suggestedQuestions = [
    'Why was this email flagged?',
    'Which indicators are suspicious?',
    'Is the sender impersonating a trusted brand?',
    'What happened during the investigation?',
    'What evidence was collected?',
    'Explain the risk score',
    'What happened with the breadcrumb?'
  ];

  return `
    <div class="ai-copilot-shell">
      <div class="ai-copilot-header">
        <div>
          <div class="panel-kicker">AI Analyst Copilot</div>
          <h2>AI Analyst Copilot</h2>
          <p>“Ask questions about an investigation using MailTrace AI evidence.”</p>
        </div>
        <div class="copilot-status-pill"><span class="dot-green"></span> Copilot Online</div>
      </div>

      <div class="ai-copilot-layout">
        <section class="panel ai-copilot-chat-panel">
          <div class="copilot-chat-header">
            <div>
              <div class="copilot-brand">MailTrace AI</div>
              <div class="copilot-subbrand">AI Analyst Copilot</div>
            </div>
            <div class="copilot-header-status">
              <span class="dot-green"></span>
              <span>Analysis Context Loaded</span>
            </div>
          </div>

          <div class="copilot-context-note">“Responses are generated from the current investigation data.”</div>

          <div class="copilot-chat-toolbar">
            <button class="ghost-btn" type="button" id="copilotClearChatBtn">Clear Chat</button>
            <div class="investigation-selector">Investigation: <strong>${state.currentInvestigationId}</strong></div>
          </div>

          <div class="copilot-chat-body">
            ${state.aiCopilotMessages.length === 0 && !state.aiCopilotLoading && !state.aiCopilotError ? `
              <div class="copilot-welcome">
                <div class="copilot-welcome-icon">✦</div>
                <h3>How can I help investigate this email?</h3>
                <p>I can explain threats, indicators, evidence and investigation events.</p>
                <div class="suggestion-grid">
                  ${suggestedQuestions
                    .map(
                      (question) => `
                        <button class="copilot-suggest-btn" type="button" data-question="${question}">${question}</button>
                      `
                    )
                    .join('')}
                </div>
              </div>
            ` : ''}

            ${state.aiCopilotMessages
              .map(
                (message) => `
                  <div class="copilot-message ${message.role === 'user' ? 'user' : 'assistant'}">
                    ${message.role === 'user' ? `<div class="copilot-msg-badge user-badge">You</div>` : `<div class="copilot-msg-badge assistant-badge">MailTrace AI</div>`}
                    <div class="copilot-msg-body">
                      ${message.role === 'assistant' ? `
                        <div class="demo-ai-tag">DEMO AI RESPONSE</div>
                        <div class="copilot-ai-text">
                          ${String(message.text).replace(/\n/g, '<br>')}
                        </div>
                        ${message.relatedIndicators?.length ? `
                          <div class="copilot-inline-chips">
                            <span class="copilot-inline-label">Related Indicator</span>
                            ${message.relatedIndicators.map((indicator) => `<button class="copilot-link-chip" type="button" data-target="indicator" data-value="${indicator}">${indicator}</button>`).join('')}
                          </div>
                        ` : ''}
                        ${message.relatedEvidence?.length ? `
                          <div class="copilot-inline-chips">
                            <span class="copilot-inline-label">Related Evidence</span>
                            ${message.relatedEvidence.map((item) => `<button class="copilot-link-chip" type="button" data-target="evidence" data-value="${item}">${item}</button>`).join('')}
                          </div>
                        ` : ''}
                        ${message.tags?.length ? `
                          <div class="copilot-source-row">
                            <span>Based on:</span>
                            ${message.tags.map((tag) => `<button class="copilot-tag" type="button" data-target="source" data-value="${tag}">${tag}</button>`).join('')}
                          </div>
                        ` : ''}
                        ${message.suggestedActions?.length ? `
                          <div class="copilot-action-row">
                            ${message.suggestedActions.map((action) => `<button class="ghost-btn compact-btn copilot-action-btn" type="button" data-action="${action}">${action}</button>`).join('')}
                          </div>
                        ` : ''}
                      ` : `
                        <div class="copilot-user-text">${message.text}</div>
                      `}
                    </div>
                  </div>
                `
              )
              .join('')}

            ${state.aiCopilotLoading ? `
              <div class="copilot-message assistant">
                <div class="copilot-msg-badge assistant-badge">MailTrace AI</div>
                <div class="copilot-msg-body">
                  <div class="demo-ai-tag">DEMO AI RESPONSE</div>
                  <div class="loading-state">
                    <span>Analyzing investigation...</span>
                    <div class="loading-dots"><span></span><span></span><span></span></div>
                  </div>
                </div>
              </div>
            ` : ''}

            ${state.aiCopilotError ? `
              <div class="copilot-message assistant error-message">
                <div class="copilot-msg-badge assistant-badge">MailTrace AI</div>
                <div class="copilot-msg-body">
                  <div class="copilot-error-text">Copilot could not process the request.</div>
                  <div class="copilot-error-actions">
                    <button class="primary-btn" type="button" id="copilotRetryBtn">Try Again</button>
                    <button class="ghost-btn" type="button" id="copilotViewInvestigationBtn">View Investigation</button>
                  </div>
                </div>
              </div>
            ` : ''}
          </div>

          <form class="copilot-input-bar" id="copilotInquiryForm">
            <button class="ghost-btn icon-btn" type="button" aria-label="Attach evidence" id="copilotAttachBtn">📎</button>
            <input id="copilotInput" type="text" placeholder="Ask about this investigation..." value="${state.aiCopilotInput}" />
            <button class="ghost-btn icon-btn" type="button" aria-label="Voice input" id="copilotVoiceBtn">◉</button>
            <button class="primary-btn" type="submit" id="copilotSendBtn">Send</button>
          </form>
        </section>

        <aside class="panel ai-copilot-context-panel">
          <div class="context-panel-header">
            <div class="panel-kicker">Investigation Context</div>
            <h3>INVESTIGATION CONTEXT</h3>
          </div>

          <div class="context-summary">
            <div class="context-row"><span>Investigation</span><strong>${state.currentInvestigationId}</strong></div>
            <div class="context-row"><span>Risk</span><strong>${investigationData.riskScore} / 100</strong></div>
            <div class="context-row"><span>Severity</span><strong>${investigationData.riskLevel}</strong></div>
            <div class="context-row"><span>Threat</span><strong>${(state.activeInvestigation.threatTypes || []).slice(0, 2).join(' / ') || 'Phishing / Impersonation'}</strong></div>
            <div class="context-row"><span>Indicators</span><strong>6</strong></div>
            <div class="context-row"><span>Evidence</span><strong>8</strong></div>
            <div class="context-row"><span>Campaign</span><strong>CAM-2026-014</strong></div>
            <div class="context-row"><span>Breadcrumb</span><strong>${breadcrumbData.status}</strong></div>
            <div class="context-row"><span>Honeytoken</span><strong>${honeytokenData.status}</strong></div>
          </div>

          <div class="context-block">
            <div class="panel-kicker">Key Indicators</div>
            <div class="quick-indicator-list">
              <button class="quick-indicator" type="button" data-indicator="secure-verification.example">Domain<br><strong>secure-verification.example</strong></button>
              <button class="quick-indicator" type="button" data-indicator="203.0.113.42">IP<br><strong>203.0.113.42</strong></button>
              <button class="quick-indicator" type="button" data-indicator="2 URLs">URLs<br><strong>2</strong></button>
              <button class="quick-indicator" type="button" data-indicator="1 QR Code">QR Codes<br><strong>1</strong></button>
              <button class="quick-indicator" type="button" data-indicator="1 Attachment">Attachment<br><strong>1</strong></button>
              <button class="quick-indicator" type="button" data-indicator="${breadcrumbData.id}">Breadcrumb<br><strong>TRIGGERED</strong></button>
              <button class="quick-indicator" type="button" data-indicator="${honeytokenData.tokenId}">Honeytoken<br><strong>TRIGGERED</strong></button>
            </div>
          </div>

          <div class="context-block">
            <div class="panel-kicker">Copilot Capabilities</div>
            <ul class="capabilities-list">
              <li>✓ Explain risk</li>
              <li>✓ Summarize evidence</li>
              <li>✓ Analyze indicators</li>
              <li>✓ Explain timeline</li>
              <li>✓ Correlate threats</li>
              <li>✓ Explain Breadcrumb and Honeytoken signals</li>
              <li>✓ Summarize campaigns</li>
              <li>✓ Prepare investigation notes</li>
            </ul>
          </div>

          <div class="context-block">
            <div class="panel-kicker">Recent Questions</div>
            <div class="recent-questions-list">
              ${recentQuestions
                .map(
                  (question, index) => `
                    <button class="recent-question" type="button" data-question="${question}">
                      <span>${question}</span>
                      <small>${index === 0 ? '2 min ago' : index === 1 ? '5 min ago' : '8 min ago'}</small>
                    </button>
                  `
                )
                .join('')}
            </div>
          </div>

          <div class="context-block context-actions-block">
            <button class="primary-btn" type="button" id="copilotSummaryBtn">Create Investigation Summary</button>
            <div class="ai-response-confidence">
              <span>AI RESPONSE CONFIDENCE</span>
              <strong>Demo</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  `;
}

function renderReportsPage() {
  const reports = getFilteredReports();
  const summaryMetrics = [
    { label: 'TOTAL REPORTS', value: '42', tone: 'cyan' },
    { label: 'CRITICAL REPORTS', value: '8', tone: 'red' },
    { label: 'OPEN INVESTIGATIONS', value: '6', tone: 'amber' },
    { label: 'REPORTS THIS MONTH', value: '17', tone: 'purple' }
  ];

  return `
    <div class="reports-shell">
      <div class="reports-header">
        <div>
          <div class="panel-kicker">Forensic Reports</div>
          <h2>Forensic Reports</h2>
          <p>“Generate and review investigation reports from collected evidence.”</p>
        </div>
        <div class="reports-header-actions">
          <button class="primary-btn" type="button" id="newReportBtn">+ New Report</button>
        </div>
      </div>

      <div class="report-summary-grid">
        ${summaryMetrics
          .map(
            (item) => `
              <div class="metric-card compact-card">
                <div class="metric-card__label">${item.label}</div>
                <div class="metric-card__value">${item.value}</div>
              </div>
            `
          )
          .join('')}
      </div>

      <div class="panel report-list-panel">
        <div class="report-toolbar">
          <div class="report-search-wrap">
            <span class="search-icon">⌕</span>
            <input id="reportSearchInput" type="search" placeholder="Search Reports" value="${state.reportSearch}" />
          </div>
          <div class="report-filter-row">
            ${['All', 'Critical', 'High', 'Medium', 'Draft', 'Finalized']
              .map(
                (filter) => `
                  <button class="ghost-btn report-filter-btn ${state.reportStatusFilter === filter ? 'active' : ''}" type="button" data-report-filter="${filter}">${filter}</button>
                `
              )
              .join('')}
          </div>
        </div>

        <div class="table-wrap">
          <table class="data-table report-table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Investigation</th>
                <th>Threat</th>
                <th>Risk</th>
                <th>Created</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${reports
                .map(
                  (report) => `
                    <tr>
                      <td>${report.reportId}</td>
                      <td>${report.investigationId}</td>
                      <td>${report.threat}</td>
                      <td>${report.risk}</td>
                      <td>${report.created}</td>
                      <td><span class="inline-status ${report.status.toLowerCase() === 'draft' ? 'draft' : 'finalized'}">${report.status}</span></td>
                      <td><button class="ghost-btn compact-btn report-view-btn" type="button" data-report-id="${report.reportId}">View</button></td>
                    </tr>
                  `
                )
                .join('') || '<tr><td colspan="7">No reports match the selected search or filter.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderReportPreviewPage() {
  const report = getReportById(state.selectedReportId);

  return `
    <div class="report-preview-shell">
      <div class="report-preview-header">
        <div>
          <div class="panel-kicker">FORENSIC INVESTIGATION REPORT</div>
          <h2>MailTrace AI</h2>
          <p>AI-Powered Email Threat Detection &amp; Forensics</p>
        </div>
        <div class="report-preview-actions">
          <button class="ghost-btn" type="button" id="reportBackBtn">Back</button>
          <button class="ghost-btn" type="button" id="reportPrintBtn">Print Report</button>
          <button class="ghost-btn" type="button" id="reportExportBtn" ${state.pdfExporting ? 'disabled' : ''}>${state.pdfExporting ? 'Generating PDF...' : 'Export PDF'}</button>
          <button class="primary-btn" type="button" id="reportShareBtn">Share Report</button>
        </div>
      </div>

      <div class="report-canvas">
        <div class="report-header-meta">
          <div><span>Report ID:</span><strong>${report.reportId}</strong></div>
          <div><span>Investigation ID:</span><strong>${report.investigationId}</strong></div>
          <div><span>Generated:</span><strong>${report.generatedAt}</strong></div>
          <div><span>Status:</span><strong>${report.status.toUpperCase()}</strong></div>
        </div>

        <section class="report-section">
          <h3>EXECUTIVE SUMMARY</h3>
          <div class="report-panel-content">
            <p>${report.executiveSummary}</p>
            <span class="demo-badge">DEMO INVESTIGATION DATA</span>
          </div>
        </section>

        <div class="report-grid-two">
          <section class="report-section">
            <h3>EMAIL INFORMATION</h3>
            <div class="report-detail-grid">
              <div><span>From</span><strong>${report.emailDetails.from}</strong></div>
              <div><span>Display Name</span><strong>${report.emailDetails.displayName}</strong></div>
              <div><span>To</span><strong>${report.emailDetails.to}</strong></div>
              <div><span>Subject</span><strong>${report.emailDetails.subject}</strong></div>
              <div><span>Received</span><strong>${report.emailDetails.received}</strong></div>
              <div><span>Message Type</span><strong>${report.emailDetails.messageType}</strong></div>
            </div>
          </section>

          <section class="report-section">
            <h3>RISK ASSESSMENT</h3>
            <div class="report-risk-box">
              <div class="report-risk-score">
                <strong>${report.riskAssessment.score}</strong>
                <span>${report.riskAssessment.label}</span>
              </div>
              <div class="report-risk-factors">
                ${report.riskAssessment.factors.map((factor) => `
                  <div class="risk-factor-row">
                    <span>${factor.label}</span>
                    <strong>${factor.value}</strong>
                  </div>
                `).join('')}
              </div>
            </div>
          </section>
        </div>

        <section class="report-section">
          <h3>THREAT FINDINGS</h3>
          <div class="findings-list">
            ${report.findings.map((finding, index) => `
              <div class="finding-item">
                <div class="finding-head">
                  <strong>Finding ${String(index + 1).padStart(2, '0')}</strong>
                  <span class="severity-pill ${finding.severity.toLowerCase()}">${finding.severity}</span>
                </div>
                <h4>${finding.title}</h4>
                <div class="finding-meta">
                  <span>Evidence: ${finding.reference}</span>
                </div>
                <p>${finding.explanation}</p>
              </div>
            `).join('')}
          </div>
        </section>

        <div class="report-grid-two">
          <section class="report-section">
            <h3>HONEYTOKEN FINDINGS</h3>
            <div class="report-detail-grid compact-grid">
              <div><span>Token ID</span><strong>${report.honeytoken?.tokenId || honeytokenData.tokenId}</strong></div>
              <div><span>Status</span><strong>${report.honeytoken?.status || honeytokenData.status}</strong></div>
              <div><span>Trigger Time</span><strong>${report.honeytoken?.detectionTime || honeytokenData.detectionTime}</strong></div>
              <div class="span-two"><span>Observed Activity</span><strong>${report.honeytoken?.observedActivity || honeytokenData.observedActivity}</strong></div>
              <div class="span-two"><span>Telemetry</span><strong>${report.honeytoken?.telemetry.ip || honeytokenData.telemetry.ip} · ${report.honeytoken?.telemetry.userAgent || honeytokenData.telemetry.userAgent} · ${report.honeytoken?.telemetry.source || honeytokenData.telemetry.source}</strong></div>
            </div>
            <span class="demo-badge smaller">${report.honeytoken?.demoNote || honeytokenData.demoNote}</span>
          </section>

          <section class="report-section">
            <h3>BREADCRUMB FINDINGS</h3>
            <div class="report-detail-grid compact-grid">
              <div><span>Breadcrumb ID</span><strong>${report.breadcrumb?.id || breadcrumbData.id}</strong></div>
              <div><span>Status</span><strong>${report.breadcrumb?.status || breadcrumbData.status}</strong></div>
              <div><span>First Seen</span><strong>${report.breadcrumb?.firstSeen || breadcrumbData.firstSeen}</strong></div>
              <div><span>Last Seen</span><strong>${report.breadcrumb?.lastSeen || breadcrumbData.lastSeen}</strong></div>
              <div><span>IP</span><strong>${report.breadcrumb?.ipAddress || breadcrumbData.ipAddress}</strong></div>
              <div><span>User Agent</span><strong>${report.breadcrumb?.userAgent || breadcrumbData.userAgent}</strong></div>
              <div><span>Referrer</span><strong>${report.breadcrumb?.referrer || breadcrumbData.referrer}</strong></div>
              <div class="span-two"><span>Redirect Chain</span><strong>${report.breadcrumb?.redirectChain || breadcrumbData.redirectChain}</strong></div>
              <div class="span-two"><span>${report.breadcrumb?.locationLabel || breadcrumbData.locationLabel}</span><strong>${report.breadcrumb?.approximateLocation || breadcrumbData.approximateLocation}</strong></div>
            </div>
            <p class="geo-note">${report.breadcrumb?.warning || breadcrumbData.warning}</p>
          </section>
        </div>

        <div class="report-grid-two">
          <section class="report-section">
            <h3>THREAT INTELLIGENCE</h3>
            <div class="report-detail-grid compact-grid">
              <div><span>Domain</span><strong>${report.threatIntelligence.domain}</strong></div>
              <div><span>IP</span><strong>${report.threatIntelligence.ip}</strong></div>
              <div><span>URLs</span><strong>${report.threatIntelligence.urls}</strong></div>
              <div><span>Related Campaign</span><strong>${report.threatIntelligence.campaign}</strong></div>
              <div class="span-two"><span>Sources</span><strong>${report.threatIntelligence.sources.join(', ')}</strong></div>
            </div>
            <span class="demo-badge smaller">${report.threatIntelligence.demoLabel}</span>
          </section>

          <section class="report-section">
            <h3>APPROXIMATE INFRASTRUCTURE GEOLOCATION</h3>
            <div class="report-detail-grid compact-grid">
              <div><span>Region</span><strong>${report.geolocation.region}</strong></div>
              <div><span>Country</span><strong>${report.geolocation.country}</strong></div>
              <div><span>Network</span><strong>${report.geolocation.network}</strong></div>
              <div><span>Coordinates</span><strong>${report.geolocation.coordinates}</strong></div>
            </div>
            <p class="geo-note">${report.geolocation.note}</p>
          </section>
        </div>

        <div class="report-grid-two">
          <section class="report-section">
            <h3>FORENSIC TIMELINE SUMMARY</h3>
            <div class="timeline-summary-list">
              ${report.timeline.map((item) => `
                <div class="timeline-summary-row">
                  <span>${item.time}</span>
                  <strong>${item.event}</strong>
                </div>
              `).join('')}
            </div>
            <button class="ghost-btn compact-btn report-goto-timeline-btn" type="button">View Full Timeline</button>
          </section>

          <section class="report-section">
            <h3>EVIDENCE INVENTORY</h3>
            <div class="evidence-summary-list">
              <div class="inventory-count">${report.evidence.length} Evidence Artifacts</div>
              ${report.evidence.map((item) => `
                <div class="evidence-summary-row">
                  <div>
                    <strong>${item.name}</strong>
                    <span>${item.id}</span>
                  </div>
                  <div class="evidence-summary-right">
                    <small>${item.hash}</small>
                    <span>${item.integrity}</span>
                  </div>
                </div>
              `).join('')}
            </div>
            <button class="ghost-btn compact-btn report-goto-evidence-btn" type="button">View Evidence</button>
          </section>
        </div>

        <div class="report-grid-two">
          <section class="report-section">
            <h3>EVIDENCE INTEGRITY</h3>
            <div class="integrity-summary-box">
              <div class="integrity-status-line">${report.integrity.status}</div>
              <div class="integrity-grid-list">
                <div><span>Algorithm</span><strong>${report.integrity.algorithm}</strong></div>
                <div><span>Evidence Fingerprint</span><strong>${report.integrity.fingerprint}</strong></div>
                <div><span>Block Reference</span><strong>${report.integrity.blockReference}</strong></div>
                <div><span>Timestamp</span><strong>${report.integrity.timestamp}</strong></div>
              </div>
              <p>${report.integrity.note}</p>
            </div>
          </section>

          <section class="report-section">
            <h3>AI ANALYST SUMMARY</h3>
            <div class="ai-summary-box">
              <p>${report.aiSummary}</p>
              <div class="based-on-line"><span>Based on:</span> <strong>Email Analysis</strong>, <strong>Threat Intelligence</strong>, <strong>Threat Graph</strong>, <strong>Forensic Timeline</strong>, <strong>Evidence</strong></div>
              <button class="ghost-btn compact-btn report-open-copilot-btn" type="button">Open AI Copilot</button>
            </div>
          </section>
        </div>

        <section class="report-section">
          <h3>RECOMMENDED ACTIONS</h3>
          <div class="recommended-actions-list">
            ${report.recommendedActions.map((action) => `<li>${action}</li>`).join('')}
          </div>
          <div class="report-action-row">
            <button class="primary-btn" type="button" id="reportInvestigateFurtherBtn">Investigate Further</button>
            <button class="ghost-btn" type="button" id="reportCloseInvestigationBtn">Close Investigation</button>
          </div>
        </section>

        <footer class="report-footer">
          <div class="report-footer-brand">
            <strong>MailTrace AI</strong>
            <span>AI-Powered Email Threat Detection &amp; Forensics</span>
          </div>
          <div class="report-footer-meta">
            <div><span>Investigation:</span><strong>${report.footer.investigation}</strong></div>
            <div><span>Report:</span><strong>${report.footer.report}</strong></div>
            <div><span>Generated by:</span><strong>${report.footer.generatedBy}</strong></div>
          </div>
          <div class="prototype-note">${report.footer.prototypeNote}</div>
        </footer>
      </div>
    </div>
  `;
}

function renderInvestigationCompletePage() {
  return `
    <div class="investigation-complete-shell">
      <div class="panel investigation-complete-card">
        <div class="investigation-complete-icon">✓</div>
        <div class="panel-kicker">Case Closure</div>
        <h2>Investigation Complete</h2>
        <p class="section-subtitle">The phishing impersonation case targeting PayPal support has been fully reviewed and documented.</p>

        <div class="summary-grid">
          <div class="summary-chip">
            <span>Investigation</span>
            <strong>${state.currentInvestigationId}</strong>
          </div>
          <div class="summary-chip">
            <span>Risk score</span>
            <strong>${investigationData.riskScore} / 100</strong>
          </div>
          <div class="summary-chip">
            <span>Threat type</span>
            <strong>Phishing / Impersonation</strong>
          </div>
          <div class="summary-chip">
            <span>Status</span>
            <strong>Resolved</strong>
          </div>
        </div>

        <div class="action-card">
          <h3>Case summary</h3>
          <ul>
            <li>Sender domain impersonation was confirmed against the PayPal brand.</li>
            <li>Authentication failures for SPF, DKIM, and DMARC were recorded.</li>
            <li>Threat infrastructure was correlated to a suspicious domain and QR redirect flow.</li>
            <li>Evidence and forensic timeline were preserved and linked to the final report.</li>
          </ul>
          <div class="threat-action-buttons">
            <button class="primary-btn" type="button" id="completeDashboardBtn">Back to Dashboard</button>
            <button class="secondary-btn" type="button" id="completeReportsBtn">View Reports</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderThreatGraphPage() {
  const selectedNode = threatGraphData.nodes.find((node) => node.id === state.selectedGraphNodeId) || threatGraphData.nodes[0];

  return `
    <div class="threat-graph-shell">
      <div class="graph-header">
        <div>
          <div class="panel-kicker">Threat Graph</div>
          <h2>Threat Graph</h2>
          <p>“Correlate emails, domains, URLs, IPs and campaigns.”</p>
        </div>
      </div>

      <div class="graph-controls">
        <div class="graph-filter-group">
          <span>Investigation:</span>
          <strong>${investigationData.investigationId}</strong>
        </div>
        <div class="graph-filter-group">
          <span>Filter:</span>
          <strong>All</strong>
        </div>
        <div class="graph-filter-group">
          <span>Time Range:</span>
          <strong>Last 30 Days</strong>
        </div>
        <button class="ghost-btn" type="button" id="resetGraphBtn">Reset View</button>
      </div>

      <div class="graph-layout">
        <section class="panel graph-panel">
          <svg viewBox="0 0 900 460" class="graph-svg" role="img" aria-label="Threat graph visualization">
            ${threatGraphData.edges
              .map(
                ([fromId, toId]) => {
                  const from = threatGraphData.nodes.find((node) => node.id === fromId);
                  const to = threatGraphData.nodes.find((node) => node.id === toId);
                  if (!from || !to) return '';
                  return `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" class="graph-edge" />`;
                }
              )
              .join('')}
            ${threatGraphData.nodes
              .map(
                (node) => `
                  <g class="graph-node ${node.id === selectedNode.id ? 'selected' : ''}" data-node-id="${node.id}" tabindex="0">
                    <circle cx="${node.x}" cy="${node.y}" r="36" class="node-shape node-${node.type}" />
                    <text x="${node.x}" y="${node.y + 4}" text-anchor="middle" class="node-label">${node.label}</text>
                  </g>
                `
              )
              .join('')}
          </svg>
        </section>

        <aside class="panel graph-side-panel">
          <div class="panel-header compact">
            <div>
              <div class="panel-kicker">Node Details</div>
              <h3>NODE DETAILS</h3>
            </div>
          </div>
          <div class="node-detail-card">
            <div class="node-detail-row"><span>Type</span><strong>${selectedNode.type === 'domain' ? 'Domain' : selectedNode.type === 'ip' ? 'IP' : selectedNode.type === 'url' ? 'URL' : selectedNode.type === 'campaign' ? 'Campaign' : selectedNode.type === 'attachment' ? 'Attachment' : selectedNode.type === 'qr' ? 'QR Code' : selectedNode.type === 'breadcrumb' ? 'Breadcrumb Event' : selectedNode.type === 'honeytoken' ? 'Honeytoken Event' : selectedNode.type === 'investigation' ? 'Investigation' : selectedNode.type === 'email' ? 'Email' : selectedNode.type === 'asn' ? 'ASN' : selectedNode.type === 'org' ? 'Organization' : selectedNode.type === 'geo' ? 'Approximate Geo' : selectedNode.type === 'case' ? 'Related Case' : 'Sender'}</strong></div>
            <div class="node-detail-row"><span>Value</span><strong class="mono-text">${selectedNode.label}</strong></div>
            <div class="node-detail-row"><span>Risk</span><strong>${selectedNode.type === 'domain' || selectedNode.type === 'ip' || selectedNode.type === 'honeytoken' ? 'HIGH' : 'MEDIUM'}</strong></div>
            <div class="node-detail-row"><span>Related Emails</span><strong>${selectedNode.type === 'domain' ? 4 : 2}</strong></div>
            <div class="node-detail-row"><span>Related URLs</span><strong>${selectedNode.type === 'domain' ? 3 : 1}</strong></div>
            <div class="node-detail-row"><span>Related IPs</span><strong>${selectedNode.type === 'domain' ? 1 : 0}</strong></div>
            <div class="node-detail-row"><span>Campaign</span><strong>${selectedNode.type === 'campaign' ? selectedNode.label : 'CAM-2026-014'}</strong></div>
          </div>

          <div class="graph-actions">
            <button class="primary-btn" type="button" id="graphInvestigateBtn">Investigate</button>
            <button class="ghost-btn" type="button" id="graphIntelligenceBtn">View Intelligence</button>
            <div class="zoom-row">
              <button class="ghost-btn" type="button" id="zoomInBtn">Zoom In</button>
              <button class="ghost-btn" type="button" id="zoomOutBtn">Zoom Out</button>
              <button class="ghost-btn" type="button" id="resetZoomBtn">Reset</button>
            </div>
          </div>
        </aside>
      </div>

      <div class="panel campaign-panel">
        <div class="panel-header compact">
          <div>
            <div class="panel-kicker">Campaign Correlation</div>
            <h3>CAMPAIGN CORRELATION</h3>
          </div>
        </div>

        <div class="campaign-grid">
          <div class="campaign-row"><span>Campaign</span><strong>${threatIntelligenceData.campaign}</strong></div>
          <div class="campaign-row"><span>Related Emails</span><strong>4</strong></div>
          <div class="campaign-row"><span>Shared Domains</span><strong>2</strong></div>
          <div class="campaign-row"><span>Shared URLs</span><strong>3</strong></div>
          <div class="campaign-row"><span>Shared IPs</span><strong>1</strong></div>
          <div class="campaign-row"><span>First Observed</span><strong>Sep 12, 2026</strong></div>
          <div class="campaign-row"><span>Last Observed</span><strong>Sep 16, 2026</strong></div>
          <div class="campaign-row"><span>Status</span><strong class="active-investigation">ACTIVE INVESTIGATION</strong></div>
        </div>

        <p class="campaign-note">“Multiple suspicious emails share infrastructure indicators and may belong to the same campaign.”</p>
      </div>

      <div class="graph-footer-actions">
        <button class="ghost-btn" type="button" id="graphBackToInvestigationBtn">← Back to Investigation</button>
      </div>
    </div>
  `;
}

function renderForensicTimelinePage() {
  const selectedEvent = timelineEvents.find((event) => event.id === state.selectedTimelineEventId) || timelineEvents[0];
  const selectedEvidence = evidenceItems.find((item) => item.id === state.selectedEvidenceId) || evidenceItems[0];
  const visibleEvents = getVisibleTimelineEvents();

  return `
    <div class="timeline-shell">
      <div class="timeline-header">
        <div>
          <div class="panel-kicker">Forensic Timeline</div>
          <h2>Investigation Timeline</h2>
          <p>“Chronological forensic reconstruction of suspicious activity from receipt to analysis.”</p>
        </div>
        <div class="timeline-header-actions">
          <button class="ghost-btn" type="button" id="timelineThreatIntelBtn">Threat Intelligence →</button>
          <button class="ghost-btn" type="button" id="timelineThreatGraphBtn">Threat Graph →</button>
          <button class="ghost-btn" type="button" id="timelineEvidenceBtn">Evidence →</button>
          <button class="primary-btn" type="button" id="prepareForensicReportBtn">Prepare Report</button>
        </div>
      </div>

      <div class="panel timeline-controls-panel">
        <div class="timeline-filter-row">
          <div class="timeline-filter-group">
            ${['All', 'Email', 'Authentication', 'URL', 'QR', 'AI Analysis', 'Threat Intelligence', 'Breadcrumb', 'Honeytoken', 'Evidence']
              .map(
                (filter) => `
                  <button class="ghost-btn timeline-filter-btn ${state.timelineFilter === filter ? 'active' : ''}" type="button" data-filter="${filter}">${filter}</button>
                `
              )
              .join('')}
          </div>
          <div class="intel-search-wrap timeline-search-wrap">
            <span class="search-icon">⌕</span>
            <input id="timelineSearchInput" type="search" placeholder="Search timeline events" value="${state.timelineSearch}" />
          </div>
          <button class="ghost-btn" type="button" id="exportTimelineBtn">Export Timeline</button>
        </div>
      </div>

      <div class="timeline-layout">
        <section class="panel timeline-panel">
          <div class="panel-header compact">
            <div>
              <div class="panel-kicker">Event Log</div>
              <h3>EVENT LOG</h3>
            </div>
          </div>

          <div class="timeline-event-list">
            ${visibleEvents
              .map(
                (event) => `
                  <button class="timeline-event-item ${selectedEvent.id === event.id ? 'selected' : ''}" type="button" data-event-id="${event.id}">
                    <div class="timeline-item-time">${event.timestamp}</div>
                    <div class="timeline-item-rail"><span class="timeline-dot"></span></div>
                    <div class="timeline-item-copy">
                      <div class="timeline-item-header">
                        <span class="timeline-category">${event.category}</span>
                        <span class="severity-badge ${event.severity}">${event.severity.toUpperCase()}</span>
                      </div>
                      <h4>${event.title}</h4>
                      <p>${event.description}</p>
                    </div>
                  </button>
                `
              )
              .join('') || '<div class="timeline-empty">No timeline events match the current search or filter.</div>'}
          </div>
        </section>

        <aside class="panel timeline-detail-panel">
          <div class="panel-header compact">
            <div>
              <div class="panel-kicker">Event Details</div>
              <h3>SELECTED EVENT</h3>
            </div>
          </div>

          <div class="selected-event-card">
            <div class="selected-event-meta">
              <span>${selectedEvent.category}</span>
              <span class="severity-badge ${selectedEvent.severity}">${selectedEvent.severity.toUpperCase()}</span>
            </div>
            <h3>${selectedEvent.title}</h3>
            <p class="selected-event-time">${selectedEvent.timestamp}</p>
            <p>${selectedEvent.details}</p>
          </div>

          <div class="relationship-box">
            <div class="panel-kicker">Related Evidence</div>
            <div class="relationship-badges">
              ${selectedEvent.relatedEvidence
                .map((evidence) => `<span class="relationship-pill">${evidence}</span>`)
                .join('')}
            </div>
          </div>

          <div class="chain-card">
            <div class="panel-header compact">
              <div>
                <div class="panel-kicker">Chain of Custody</div>
                <h3>CHAIN OF CUSTODY</h3>
              </div>
            </div>
            <div class="chain-grid">
              ${chainOfCustody
                .map(
                  (item) => `
                    <div class="chain-row">
                      <span>${item.time}</span>
                      <strong>${item.event}</strong>
                    </div>
                  `
                )
                .join('')}
            </div>
          </div>

          <div class="integrity-card">
            <div class="integrity-card-header">
              <div>
                <div class="panel-kicker">Evidence Integrity</div>
                <h3>${blockchainIntegrity.label}</h3>
              </div>
              <span class="integrity-status ${state.integrityVerified ? 'verified' : ''}">${state.integrityVerified ? 'VERIFIED' : 'PENDING'}</span>
            </div>
            <div class="integrity-grid">
              <div class="integrity-row"><span>Algorithm</span><strong>${blockchainIntegrity.hashAlgorithm}</strong></div>
              <div class="integrity-row"><span>Anchor</span><strong>${blockchainIntegrity.blockReference}</strong></div>
              <div class="integrity-row"><span>Network</span><strong>${blockchainIntegrity.network}</strong></div>
              <div class="integrity-row"><span>Timestamp</span><strong>${blockchainIntegrity.timestamp}</strong></div>
            </div>
            <button class="primary-btn integrity-btn" type="button" id="verifyIntegrityBtn">
              ${state.integrityLoading ? 'Verifying evidence fingerprint...' : 'Verify Integrity'}
            </button>
          </div>
        </aside>
      </div>

      <div class="forensic-bottom-grid">
        <section class="panel forensic-evidence-panel">
          <div class="panel-header compact">
            <div>
              <div class="panel-kicker">Digital Evidence</div>
              <h3>RECORDED EVIDENCE</h3>
            </div>
          </div>

          <div class="evidence-table-wrap">
            <table class="data-table evidence-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Source</th>
                  <th>Hash</th>
                  <th>Integrity</th>
                </tr>
              </thead>
              <tbody>
                ${evidenceItems
                  .map(
                    (item) => `
                      <tr class="evidence-row ${state.selectedEvidenceId === item.id ? 'selected' : ''}" data-evidence-id="${item.id}">
                        <td>${item.id}</td>
                        <td>${item.type}</td>
                        <td>${item.source}</td>
                        <td class="mono-text">${item.hash}</td>
                        <td><span class="status-pill verified">${item.integrity}</span></td>
                      </tr>
                    `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
          <div class="evidence-actions-row">
            <button class="ghost-btn" type="button" id="viewRawEvidenceBtn">View Raw Evidence</button>
            <button class="ghost-btn" type="button" id="timelineEvidenceBtn">Open Evidence</button>
          </div>
        </section>

        <aside class="panel forensic-findings-panel">
          <div class="panel-header compact">
            <div>
              <div class="panel-kicker">Forensic Findings</div>
              <h3>INVESTIGATION SUMMARY</h3>
            </div>
          </div>

          <div class="forensic-findings-grid">
            <div class="finding-row"><span>Primary Threat</span><strong>${forensicFindings.primaryThreat}</strong></div>
            <div class="finding-row"><span>Attack Vector</span><strong>${forensicFindings.attackVector}</strong></div>
            <div class="finding-row"><span>Authentication</span><strong>${forensicFindings.authentication}</strong></div>
            <div class="finding-row"><span>Infrastructure</span><strong>${forensicFindings.relatedInfrastructure}</strong></div>
            <div class="finding-row"><span>Campaign</span><strong>${forensicFindings.relatedCampaign}</strong></div>
            <div class="finding-row"><span>Evidence Items</span><strong>${forensicFindings.evidenceCollected}</strong></div>
            <div class="finding-row"><span>Risk</span><strong>${forensicFindings.risk}</strong></div>
          </div>
        </aside>
      </div>
    </div>
  `;
}

function renderEvidencePage() {
  const selectedEvidence = evidenceItems.find((item) => item.id === state.selectedEvidenceId) || evidenceItems[0];

  return `
    <div class="evidence-shell">
      <div class="timeline-header">
        <div>
          <div class="panel-kicker">Evidence</div>
          <h2>Digital Evidence</h2>
          <p>“Tamper-evident representation of collected forensics for the active investigation.”</p>
        </div>
        <div class="timeline-header-actions">
          <button class="ghost-btn" type="button" id="timelineThreatIntelBtn">Threat Intelligence →</button>
          <button class="ghost-btn" type="button" id="timelineThreatGraphBtn">Threat Graph →</button>
          <button class="ghost-btn" type="button" id="resultTimelineBtn">Forensic Timeline →</button>
        </div>
      </div>

      <div class="evidence-layout">
        <section class="panel evidence-panel">
          <div class="panel-header compact">
            <div>
              <div class="panel-kicker">Artifacts</div>
              <h3>ARTIFACTS</h3>
            </div>
          </div>

          <div class="evidence-table-wrap">
            <table class="data-table evidence-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Source</th>
                  <th>Hash</th>
                  <th>Integrity</th>
                </tr>
              </thead>
              <tbody>
                ${evidenceItems
                  .map(
                    (item) => `
                      <tr class="evidence-row ${state.selectedEvidenceId === item.id ? 'selected' : ''}" data-evidence-id="${item.id}">
                        <td>${item.id}</td>
                        <td>${item.type}</td>
                        <td>${item.name}</td>
                        <td>${item.source}</td>
                        <td class="mono-text">${item.hash}</td>
                        <td><span class="status-pill verified">${item.integrity}</span></td>
                      </tr>
                    `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </section>

        <aside class="panel evidence-detail-panel">
          <div class="panel-header compact">
            <div>
              <div class="panel-kicker">Artifact Details</div>
              <h3>SELECTED EVIDENCE</h3>
            </div>
          </div>

          <div class="selected-evidence-card">
            <div class="selected-evidence-meta">
              <span>${selectedEvidence.type}</span>
              <span class="status-pill verified">${selectedEvidence.integrity}</span>
            </div>
            <h3>${selectedEvidence.name}</h3>
            <div class="evidence-detail-grid">
              <div class="evidence-detail-row"><span>ID</span><strong>${selectedEvidence.id}</strong></div>
              <div class="evidence-detail-row"><span>Source</span><strong>${selectedEvidence.source}</strong></div>
              <div class="evidence-detail-row"><span>Timestamp</span><strong>${selectedEvidence.timestamp}</strong></div>
              <div class="evidence-detail-row"><span>Hash</span><strong class="mono-text">${selectedEvidence.hash}</strong></div>
              <div class="evidence-detail-row"><span>Investigation</span><strong>${selectedEvidence.investigationId}</strong></div>
              <div class="evidence-detail-row"><span>Indicator</span><strong>${selectedEvidence.relatedIndicators[0]}</strong></div>
            </div>
            <div class="evidence-detail-actions">
              <button class="primary-btn" type="button" id="viewRawEvidenceBtn">View Raw Evidence</button>
              <button class="ghost-btn" type="button" id="copyHashBtn">Copy Hash</button>
            </div>
          </div>

          <div class="integrity-card">
            <div class="integrity-card-header">
              <div>
                <div class="panel-kicker">Demo Blockchain Integrity</div>
                <h3>${blockchainIntegrity.label}</h3>
              </div>
              <span class="integrity-status ${state.integrityVerified ? 'verified' : ''}">${state.integrityVerified ? 'VERIFIED' : 'PENDING'}</span>
            </div>
            <div class="integrity-grid">
              <div class="integrity-row"><span>Hash</span><strong>${blockchainIntegrity.evidenceHash}</strong></div>
              <div class="integrity-row"><span>Algorithm</span><strong>${blockchainIntegrity.hashAlgorithm}</strong></div>
              <div class="integrity-row"><span>Status</span><strong>${blockchainIntegrity.blockchainStatus}</strong></div>
              <div class="integrity-row"><span>Block</span><strong>${blockchainIntegrity.blockReference}</strong></div>
            </div>
            <button class="primary-btn integrity-btn" type="button" id="verifyIntegrityBtn">
              ${state.integrityLoading ? 'Verifying evidence fingerprint...' : 'Verify Integrity'}
            </button>
          </div>
        </aside>
      </div>

      <div class="forensic-signal-grid">
        <section class="panel forensic-signal-panel">
          <div class="panel-header compact">
            <div>
              <div class="panel-kicker">Active Defense Signal</div>
              <h3>HONEYTOKEN BAIT SYSTEM</h3>
            </div>
            <span class="status-pill critical">${honeytokenData.status}</span>
          </div>
          <span class="demo-badge">DEMO / CONTROLLED LAB TELEMETRY</span>
          <p class="signal-purpose">${honeytokenData.purpose}</p>
          <div class="signal-detail-grid">
            <div><span>Triggered Token</span><strong class="mono-text">${honeytokenData.tokenId}</strong></div>
            <div><span>Detection Time</span><strong>${honeytokenData.detectionTime}</strong></div>
            <div><span>Observed Activity</span><strong>${honeytokenData.observedActivity}</strong></div>
            <div><span>IP</span><strong>${honeytokenData.telemetry.ip}</strong></div>
            <div><span>User Agent</span><strong>${honeytokenData.telemetry.userAgent}</strong></div>
            <div><span>Source</span><strong>${honeytokenData.telemetry.source}</strong></div>
          </div>
          <div class="signal-note"><strong>Why this matters</strong><span>A triggered honeytoken can provide an additional forensic signal that a decoy value was accessed or used.</span></div>
          <p class="signal-warning">${honeytokenData.demoNote}</p>
        </section>

        <section class="panel forensic-signal-panel">
          <div class="panel-header compact">
            <div>
              <div class="panel-kicker">Controlled Telemetry</div>
              <h3>BREADCRUMB TRACE</h3>
            </div>
            <span class="status-pill critical">${breadcrumbData.status}</span>
          </div>
          <span class="demo-badge">DEMO / CONTROLLED LAB TELEMETRY</span>
          <p class="signal-purpose">Controlled telemetry associated with the suspicious email/link interaction and correlated to this investigation.</p>
          <div class="signal-detail-grid">
            <div><span>Breadcrumb ID</span><strong class="mono-text">${breadcrumbData.id}</strong></div>
            <div><span>First Seen</span><strong>${breadcrumbData.firstSeen}</strong></div>
            <div><span>Last Seen</span><strong>${breadcrumbData.lastSeen}</strong></div>
            <div><span>IP Address</span><strong>${breadcrumbData.ipAddress}</strong></div>
            <div><span>User Agent</span><strong>${breadcrumbData.userAgent}</strong></div>
            <div><span>Referrer</span><strong>${breadcrumbData.referrer}</strong></div>
            <div class="span-two"><span>Redirect Chain</span><strong>${breadcrumbData.redirectChain}</strong></div>
            <div class="span-two"><span>${breadcrumbData.locationLabel}</span><strong>${breadcrumbData.approximateLocation}</strong></div>
          </div>
          <p class="signal-warning">${breadcrumbData.warning}</p>
        </section>
      </div>
    </div>
  `;
}

function renderModalContent() {
  if (!state.currentModal) return '';

  if (state.currentModal === 'analysis') {
    const email = getSelectedEmail();
    return `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <div class="modal-header">
          <h3 id="modalTitle">Analyze New Email</h3>
          <button class="close-btn" type="button" id="closeModalBtn" aria-label="Close modal">✕</button>
        </div>

        <form class="modal-form" id="analysisForm">
          <div class="form-field">
            <label for="mailSender">Sender</label>
            <input id="mailSender" type="text" placeholder="sender@domain.com" value="${email.senderEmail}" />
          </div>

          <div class="form-field">
            <label for="mailBody">Email content</label>
            <textarea id="mailBody" placeholder="Paste the email body or suspicious message here...">${email.body}</textarea>
          </div>

          <div class="modal-actions">
            <button class="ghost-btn" type="button" id="cancelModalBtn">Cancel</button>
            <button class="primary-btn" type="submit">Run Analysis</button>
          </div>
        </form>
      </div>
    `;
  }

  if (state.currentModal === 'gmail-connect') {
    return `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="gmailConnectTitle">
        <div class="modal-header">
          <h3 id="gmailConnectTitle">Connect your Gmail</h3>
          <button class="close-btn" type="button" id="closeModalBtn" aria-label="Close modal">✕</button>
        </div>

        <div class="gmail-connect-card">
          <div class="google-mark">G</div>
          <h4>Secure inbox analysis with Google</h4>
          <p>Your inbox activity, suspicious senders and phishing indicators will be analyzed by MailTrace AI.</p>
          <button class="primary-btn auth-google-btn" type="button" id="connectGoogleBtn">Continue with Google</button>
        </div>
      </div>
    `;
  }

  if (state.currentModal === 'upload') {
    return `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="uploadTitle">
        <div class="modal-header">
          <h3 id="uploadTitle">Upload suspicious message</h3>
          <button class="close-btn" type="button" id="closeModalBtn" aria-label="Close modal">✕</button>
        </div>

        <form class="modal-form" id="uploadEmailForm">
          <div class="form-field">
            <label for="uploadFile">Select file</label>
            <input id="uploadFile" type="file" accept=".eml,.msg,.png,.jpg,.jpeg" />
          </div>

          <div class="form-field">
            <label for="uploadNotes">Optional notes</label>
            <textarea id="uploadNotes" placeholder="Add context such as sender, subject, suspicious behavior or file source."></textarea>
          </div>

          <div class="modal-actions">
            <button class="ghost-btn" type="button" id="cancelModalBtn">Cancel</button>
            <button class="primary-btn" type="submit">Analyze File</button>
          </div>
        </form>
      </div>
    `;
  }

  if (state.currentModal === 'intel-map') {
    return `
      <div class="modal map-modal" role="dialog" aria-modal="true" aria-labelledby="intelMapTitle">
        <div class="modal-header">
          <h3 id="intelMapTitle">Approximate Infrastructure Map</h3>
          <button class="close-btn" type="button" id="closeModalBtn" aria-label="Close modal">✕</button>
        </div>

        <div class="map-modal-body">
          <div class="map-surface map-surface--large">
            <div class="map-pin map-pin--large"></div>
          </div>
          <div class="map-meta">
            <div class="map-meta-row"><span>Location</span><strong>${threatIntelligenceData.geolocation.region}</strong></div>
            <div class="map-meta-row"><span>Country</span><strong>${threatIntelligenceData.geolocation.country}</strong></div>
            <div class="map-meta-row"><span>Coordinates</span><strong class="mono-text">${threatIntelligenceData.geolocation.coordinates}</strong></div>
            <div class="map-meta-row"><span>Network</span><strong>${threatIntelligenceData.geolocation.network}</strong></div>
          </div>
        </div>
      </div>
    `;
  }

  if (state.currentModal === 'raw-evidence') {
    const selectedEvidence = evidenceItems.find((item) => item.id === state.selectedEvidenceId) || evidenceItems[0];
    return `
      <div class="modal raw-evidence-modal" role="dialog" aria-modal="true" aria-labelledby="rawEvidenceTitle">
        <div class="modal-header">
          <h3 id="rawEvidenceTitle">Raw Evidence</h3>
          <button class="close-btn" type="button" id="closeModalBtn" aria-label="Close modal">✕</button>
        </div>

        <div class="modal-body raw-evidence-body">
          <p><strong>Evidence ID:</strong> ${selectedEvidence.id}</p>
          <p><strong>Type:</strong> ${selectedEvidence.type}</p>
          <pre>Received: ${selectedEvidence.timestamp}
Source: ${selectedEvidence.source}
Hash: ${selectedEvidence.hash}
Investigation: ${selectedEvidence.investigationId}
Indicator: ${selectedEvidence.relatedIndicators[0]}

Safe demo content:
This is a mock evidence artifact intended for frontend validation only. It does not represent a live forensic collection from a production environment.</pre>
        </div>
      </div>
    `;
  }

  if (state.currentModal === 'report-prep') {
    return `
      <div class="modal report-modal" role="dialog" aria-modal="true" aria-labelledby="reportPrepTitle">
        <div class="modal-header">
          <h3 id="reportPrepTitle">Prepare Forensic Report</h3>
          <button class="close-btn" type="button" id="closeModalBtn" aria-label="Close modal">✕</button>
        </div>
        <div class="modal-body report-modal-body">
          <p>8 evidence artifacts are ready for report generation.</p>
          <div class="modal-actions">
            <button class="ghost-btn" type="button" id="cancelModalBtn">Cancel</button>
            <button class="primary-btn" type="button" id="generateReportBtn">Generate Report</button>
          </div>
        </div>
      </div>
    `;
  }

  if (state.currentModal === 'new-report') {
    return `
      <div class="modal report-modal" role="dialog" aria-modal="true" aria-labelledby="newReportTitle">
        <div class="modal-header">
          <h3 id="newReportTitle">SELECT INVESTIGATION</h3>
          <button class="close-btn" type="button" id="closeModalBtn" aria-label="Close modal">✕</button>
        </div>
        <div class="modal-body report-modal-body">
          <div class="new-report-options">
            ${[
              { id: 'MT-2026-00421', label: 'Critical • 92/100' },
              { id: 'MT-2026-00418', label: 'High • 81/100' },
              { id: 'MT-2026-00412', label: 'High • 76/100' }
            ].map(
              (option) => `
                <label class="report-choice ${state.reportSelection === option.id ? 'selected' : ''}">
                  <input type="radio" name="reportSelection" value="${option.id}" ${state.reportSelection === option.id ? 'checked' : ''} />
                  <span>${option.id}</span>
                  <small>${option.label}</small>
                </label>
              `
            ).join('')}
          </div>
          <div class="modal-actions">
            <button class="ghost-btn" type="button" id="cancelModalBtn">Cancel</button>
            <button class="primary-btn" type="button" id="generateNewReportBtn">Generate Report</button>
          </div>
        </div>
      </div>
    `;
  }

  if (state.currentModal === 'share-report') {
    const report = getActiveReport();
    const shareUrl = `${window.location.origin}/reports/${report.investigationId}`;
    return `
      <div class="modal report-modal" role="dialog" aria-modal="true" aria-labelledby="shareReportTitle">
        <div class="modal-header">
          <h3 id="shareReportTitle">Share Forensic Report</h3>
          <button class="close-btn" type="button" id="closeModalBtn" aria-label="Close modal">✕</button>
        </div>
        <div class="modal-body report-modal-body">
          <div class="share-row">
            <span>Report</span>
            <strong>${report.investigationId}</strong>
          </div>
          <div class="share-row share-link-box">
            <span>URL</span>
            <strong class="share-link-value">${shareUrl}</strong>
          </div>
          <div class="modal-actions share-actions">
            <button class="primary-btn" type="button" id="copyReportLinkBtn">Copy Link</button>
            <button class="ghost-btn" type="button" id="nativeShareReportBtn">Share via device</button>
          </div>
        </div>
      </div>
    `;
  }

  if (state.currentModal === 'disconnect-gmail') {
    return `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="disconnectTitle">
        <div class="modal-header">
          <h3 id="disconnectTitle">Disconnect Gmail account?</h3>
          <button class="close-btn" type="button" id="closeModalBtn" aria-label="Close modal">✕</button>
        </div>
        <div class="modal-body disconnect-body">
          <p>MailTrace AI will no longer be able to access the connected mailbox.</p>
          <div class="modal-actions">
            <button class="ghost-btn" type="button" id="cancelModalBtn">Cancel</button>
            <button class="primary-btn" type="button" id="confirmDisconnectGmailBtn">Disconnect</button>
          </div>
        </div>
      </div>
    `;
  }

  return '';
}

function startAnalysisScan() {
  if (state.analysisScanStarted) return;

  state.analysisScanStarted = true;
  state.analysisProgress = 0;
  window.clearInterval(state.scanTimer);

  const payload = state.pendingAnalysisPayload || collectAnalysisPayload();
  state.pendingAnalysisPayload = payload;

  const analysisPromise = analyzeEmail(payload)
    .then((data) => {
      applyAnalysisResult(data);
      state.analysisSource = 'api';
      state.backendStatus = 'connected';
      state.backendLabel = 'Backend Connected';
      return data;
    })
    .catch(() => {
      state.analysisSource = 'demo';
      state.backendStatus = 'offline';
      state.backendLabel = 'Backend Offline — Using Demo Data';
      return null;
    });

  state.scanTimer = window.setInterval(() => {
    const cap = 90;
    state.analysisProgress = Math.min(cap, state.analysisProgress + 6);
    render();
  }, 220);

  analysisPromise.finally(() => {
    window.clearInterval(state.scanTimer);
    state.analysisProgress = 100;
    render();
    window.setTimeout(() => {
      state.currentPage = 'threat-result';
      state.analysisScanStarted = false;
      state.analysisProgress = 0;
      state.pendingAnalysisPayload = null;
      render();
    }, 450);
  });
}

function renderAppShell() {
  const currentPageId = normalizePageId(state.currentPage);
  const connectedUser = state.connectedGmail || user;

  const currentTitle =
    currentPageId === 'email-detail'
      ? 'Email Investigation'
      : currentPageId === 'analysis'
        ? 'Analyze Email'
        : currentPageId === 'threat-result'
          ? 'Threat Result'
          : currentPageId === 'threat-intelligence'
            ? 'Threat Intelligence'
            : currentPageId === 'threat-graph'
              ? 'Threat Graph'
              : currentPageId === 'forensic-timeline'
                ? 'Forensic Timeline'
                : currentPageId === 'evidence'
                  ? 'Evidence'
                  : currentPageId === 'ai-copilot'
                    ? 'AI Analyst Copilot'
                    : currentPageId === 'reports'
                      ? 'Forensic Reports'
                      : currentPageId === 'report-preview'
                        ? 'Report Preview'
                        : currentPageId === 'investigation-complete'
                          ? 'Investigation Complete'
                          : currentPageId === 'investigation-history'
                            ? 'Investigation History'
                            : currentPageId === 'notifications'
                              ? 'Security Notifications'
                              : currentPageId === 'profile'
                                ? 'Profile'
                                : currentPageId === 'settings'
                                  ? 'Settings'
                                  : formatPageTitle(currentPageId);

  const notificationsList = state.notificationsList.slice(0, 3);
  const unreadCount = getNotificationCount();

  const pageContent = (
    currentPageId === 'dashboard'
      ? renderDashboardContent()
      : currentPageId === 'gmail'
        ? renderGmailInboxPage()
        : currentPageId === 'email-detail'
          ? renderEmailDetailPage()
          : currentPageId === 'analysis'
            ? renderAnalysisScanningPage()
            : currentPageId === 'threat-result'
              ? renderThreatResultPage()
              : currentPageId === 'threat-intelligence'
                ? renderThreatIntelligencePage()
                : currentPageId === 'threat-graph'
                  ? renderThreatGraphPage()
                  : currentPageId === 'forensic-timeline'
                    ? renderForensicTimelinePage()
                    : currentPageId === 'evidence'
                      ? renderEvidencePage()
                      : currentPageId === 'ai-copilot'
                        ? renderAICopilotPage()
                        : currentPageId === 'reports'
                          ? renderReportsPage()
                          : currentPageId === 'report-preview'
                            ? renderReportPreviewPage()
                            : currentPageId === 'investigation-complete'
                              ? renderInvestigationCompletePage()
                              : currentPageId === 'investigations'
                                ? renderInvestigationsPage()
                                : currentPageId === 'investigation-history'
                                  ? renderInvestigationHistoryPage()
                                  : currentPageId === 'notifications'
                                    ? renderNotificationsPage()
                                    : currentPageId === 'profile'
                                      ? renderProfilePage()
                                      : currentPageId === 'settings'
                                        ? renderSettingsPage()
                                        : renderPlaceholder(formatPageTitle(currentPageId))
  );

  const isWorkflowPage = investigationWorkflowPages.includes(currentPageId);

  return `
    <div class="app-shell">
      <div class="sidebar-backdrop ${state.sidebarOpen ? 'open' : ''}" id="sidebarBackdrop"></div>

      <aside class="sidebar ${state.sidebarOpen ? 'open' : ''}">
        <div class="sidebar-header">
          <div class="sidebar-logo">M</div>
          <div class="sidebar-title">MailTrace AI</div>
          <button class="close-sidebar-btn" type="button" id="closeSidebarBtn" aria-label="Close navigation">✕</button>
        </div>

        <nav class="nav-list" aria-label="Sidebar navigation">
          ${navItems
            .map(
              (item) => `
                <button class="nav-item ${normalizePageId(item.id) === normalizePageId(state.currentPage) ? 'active' : ''}" data-page="${item.id}" type="button">
                  <span class="nav-icon">${item.icon}</span>
                  <span>${item.label}</span>
                </button>
              `
            )
            .join('')}
        </nav>
      </aside>

      <main class="main-panel">
        <header class="topbar">
          <div class="mobile-header-left">
            <button class="icon-btn mobile-menu-btn" type="button" id="mobileMenuBtn" aria-label="Open navigation">☰</button>
            <div class="page-title-wrap">
              <span class="mobile-brand">MailTrace AI</span>
              <h1 class="page-title">${currentTitle}</h1>
            </div>
          </div>

          <div class="top-actions">
            <button class="icon-btn header-search-btn" type="button" id="headerSearchBtn" aria-label="Global search">
              ⌕
            </button>

            <div class="notification-wrap">
              <button class="icon-btn" type="button" id="notificationBtn" aria-label="Notifications">
                🔔
                ${unreadCount > 0 ? '<span class="notify-dot"></span>' : ''}
              </button>
              <div class="header-dropdown notifications-dropdown ${state.notificationDropdownOpen ? 'open' : ''}">
                ${notificationsList.length ? notificationsList.map((notification) => `
                  <button class="notification-dropdown-item ${notification.read ? 'read' : 'unread'}" type="button" data-notification-id="${notification.id}">
                    <strong>${notification.title}</strong>
                    <small>${notification.detail}</small>
                  </button>
                `).join('') : '<div class="empty-inline">No notifications</div>'}
                <button class="dropdown-link" type="button" id="viewAllNotificationsBtn">View all notifications</button>
              </div>
            </div>

            <div class="profile-menu-wrap">
              <button class="profile-pill" type="button" id="userMenuToggle">
                <div class="avatar">${connectedUser.name.charAt(0)}</div>
                <div>
                  <div style="font-size:0.82rem; font-weight:600;">${connectedUser.name}</div>
                  <div style="font-size:0.72rem; color:var(--text-muted);">${connectedUser.provider || user.role}</div>
                </div>
              </button>

              <div class="header-dropdown user-dropdown ${state.userMenuOpen ? 'open' : ''}">
                <div class="user-menu-header">
                  <div class="avatar">${connectedUser.name.charAt(0)}</div>
                  <div>
                    <strong>${connectedUser.name}</strong>
                    <small>${connectedUser.email}</small>
                  </div>
                </div>
                <button class="dropdown-link" type="button" data-page="profile">Profile</button>
                <button class="dropdown-link" type="button" data-page="settings">Settings</button>
                <button class="dropdown-link" type="button" data-page="notifications">Notifications</button>
                <button class="dropdown-link" type="button" data-page="investigation-history">Investigation History</button>
                <button class="dropdown-link danger" type="button" id="signOutBtn">Sign Out</button>
              </div>
            </div>

            <span class="backend-status-badge ${state.backendStatus === 'connected' ? 'connected' : 'offline'}" id="backendStatusBadge" title="${state.backendLabel}">
              <span class="status-dot"></span>
              <span>${state.backendLabel}</span>
            </span>

            <span class="gmail-status">${state.gmailConnected ? 'Gmail connected' : 'Connect Gmail'}</span>
          </div>
        </header>

        <section id="pageContent" class="page-content">
          ${isWorkflowPage ? renderInvestigationStepper(currentPageId) : ''}
          ${pageContent}
          ${isWorkflowPage ? renderInvestigationNav(currentPageId) : ''}
        </section>
      </main>
    </div>

    <div class="modal-backdrop ${state.currentModal ? 'open' : ''}" id="appModal">
      ${renderModalContent()}
    </div>

    ${state.searchOverlayOpen ? renderSearchOverlay() : ''}
  `;
}

function render() {
  if (window.location.pathname.startsWith('/reports')) {
    resolveRouteFromLocation();
  }

  if (!state.isLoggedIn && !state.isAuthenticated) {
    renderLogin();
    return;
  }

  if (state.currentPage === 'report-preview') {
    syncRouteToCurrentReport();
  }

  appEl.innerHTML = renderAppShell();

  document.querySelectorAll('.nav-item').forEach((button) => {
    button.addEventListener('click', () => {
      state.currentPage = normalizePageId(button.dataset.page);
      state.sidebarOpen = false;
      if (state.currentPage === 'dashboard') {
        state.searchTerm = '';
      }
      state.currentModal = null;
      if (state.currentPage === 'analysis') {
        state.analysisScanStarted = false;
        startAnalysisScan();
      }
      render();
    });
  });

  const searchInput = document.getElementById('globalSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      state.searchTerm = event.target.value.trim();
      const normalized = state.searchTerm.toLowerCase();
      const matchesIndicator = [
        threatIntelligenceData.indicator,
        threatIntelligenceData.ipInfo.ip,
        threatIntelligenceData.campaign,
        threatIntelligenceData.relatedIndicators[0].indicator,
        threatIntelligenceData.relatedIndicators[1].indicator,
        threatIntelligenceData.relatedIndicators[2].indicator,
        threatIntelligenceData.relatedIndicators[3].indicator
      ].find((entry) => entry.toLowerCase().includes(normalized));

      if (normalized && matchesIndicator) {
        state.currentPage = 'threat-intelligence';
        state.selectedThreatIndicator = matchesIndicator;
      }

      render();
    });
  }

  document.getElementById('notificationBtn')?.addEventListener('click', () => {
    state.notificationDropdownOpen = !state.notificationDropdownOpen;
    state.userMenuOpen = false;
    render();
  });

  document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
    state.sidebarOpen = true;
    render();
  });

  document.getElementById('closeSidebarBtn')?.addEventListener('click', () => {
    state.sidebarOpen = false;
    render();
  });

  document.getElementById('sidebarBackdrop')?.addEventListener('click', () => {
    state.sidebarOpen = false;
    render();
  });

  document.querySelectorAll('[data-investigation-nav]').forEach((button) => {
    button.addEventListener('click', () => {
      const direction = button.dataset.investigationNav;
      const targetPage = direction === 'prev' ? getInvestigationPrevPage(state.currentPage) : getInvestigationNextPage(state.currentPage);
      if (!targetPage) return;
      state.currentPage = targetPage;
      state.sidebarOpen = false;
      render();
    });
  });

  document.getElementById('headerSearchBtn')?.addEventListener('click', () => {
    state.searchOverlayOpen = true;
    state.currentModal = null;
    render();
  });

  document.getElementById('closeSearchOverlayBtn')?.addEventListener('click', () => {
    state.searchOverlayOpen = false;
    state.searchQuery = '';
    render();
  });

  document.getElementById('searchOverlayInput')?.addEventListener('input', (event) => {
    state.searchQuery = event.target.value.trim();
    render();
  });

  document.querySelectorAll('.search-result-item').forEach((item) => {
    item.addEventListener('click', () => {
      const route = item.dataset.searchRoute;
      const result = globalSearchCatalog.find((entry) => entry.id === item.dataset.searchId);
      if (route) {
        state.currentPage = route;
      }
      state.searchOverlayOpen = false;
      state.searchQuery = '';
      if (result && result.type === 'Report') {
        state.selectedReportId = result.title;
      }
      render();
    });
  });

  document.getElementById('viewAllNotificationsBtn')?.addEventListener('click', () => {
    state.notificationDropdownOpen = false;
    state.currentPage = 'notifications';
    render();
  });

  document.querySelectorAll('.notification-dropdown-item').forEach((item) => {
    item.addEventListener('click', () => {
      const notificationId = item.dataset.notificationId;
      if (notificationId) {
        markNotificationRead(notificationId);
      }
    });
  });

  document.getElementById('userMenuToggle')?.addEventListener('click', () => {
    state.userMenuOpen = !state.userMenuOpen;
    state.notificationDropdownOpen = false;
    render();
  });

  document.querySelectorAll('.dropdown-link[data-page]').forEach((button) => {
    button.addEventListener('click', () => {
      const page = button.dataset.page;
      state.userMenuOpen = false;
      state.notificationDropdownOpen = false;
      state.currentPage = page;
      render();
    });
  });

  document.getElementById('signOutBtn')?.addEventListener('click', () => {
    if (state.oauthTimerId) {
      window.clearTimeout(state.oauthTimerId);
      state.oauthTimerId = null;
    }
    dismissToast();
    state.isLoggedIn = false;
    state.isAuthenticated = false;
    state.authLoading = false;
    state.authSuccess = false;
    state.gmailConnected = false;
    state.connectedGmail = { name: 'Security Analyst', email: 'analyst@mailtrace.demo', provider: 'Google' };
    state.currentPage = 'dashboard';
    state.currentModal = null;
    state.userMenuOpen = false;
    render();
  });

  document.querySelectorAll('[data-notification-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      state.notificationFilter = button.dataset.notificationFilter;
      render();
    });
  });

  document.querySelectorAll('[data-notification-read]').forEach((button) => {
    button.addEventListener('click', () => {
      markNotificationRead(button.dataset.notificationRead);
    });
  });

  document.getElementById('markAllNotificationsReadBtn')?.addEventListener('click', () => {
    markAllNotificationsRead();
  });

  document.querySelectorAll('[data-investigation-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      state.investigationHistoryFilter = button.dataset.investigationFilter;
      render();
    });
  });

  document.getElementById('investigationSearchInput')?.addEventListener('input', (event) => {
    state.investigationHistorySearch = event.target.value.trim();
    render();
  });

  document.getElementById('investigationHistorySearchInput')?.addEventListener('input', (event) => {
    state.investigationHistorySearch = event.target.value.trim();
    render();
  });

  document.querySelectorAll('.investigation-open-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const investigationId = button.dataset.investigationId;
      if (investigationId) {
        state.currentPage = 'email-detail';
        state.selectedEmailId = 'gmail-001';
        render();
      }
    });
  });

  document.querySelectorAll('.history-view-btn').forEach((button) => {
    button.addEventListener('click', () => {
      state.currentPage = 'email-detail';
      state.selectedEmailId = 'gmail-001';
      render();
    });
  });

  document.querySelectorAll('.history-report-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const reportId = button.dataset.reportId;
      if (reportId) {
        state.selectedReportId = reportId;
        state.currentPage = 'report-preview';
        render();
      }
    });
  });

  document.querySelectorAll('.history-delete-btn').forEach((button) => {
    button.addEventListener('click', () => {
      state.currentModal = 'disconnect-gmail';
      render();
    });
  });

  document.getElementById('manageGmailConnectionBtn')?.addEventListener('click', () => {
    state.currentModal = 'gmail-connect';
    render();
  });

  document.getElementById('disconnectGmailBtn')?.addEventListener('click', () => {
    state.currentModal = 'disconnect-gmail';
    render();
  });

  document.getElementById('confirmDisconnectGmailBtn')?.addEventListener('click', () => {
    state.gmailConnected = false;
    state.currentModal = null;
    state.currentPage = 'profile';
    render();
    showToast('Gmail connection updated');
  });

  document.getElementById('saveSettingsBtn')?.addEventListener('click', () => {
    saveSettingsFromForm();
  });

  if (state.currentPage === 'reports' || state.currentPage === 'report-preview') {
    document.getElementById('newReportBtn')?.addEventListener('click', () => {
      state.currentModal = 'new-report';
      render();
    });

    document.getElementById('reportSearchInput')?.addEventListener('input', (event) => {
      state.reportSearch = event.target.value;
      render();
    });

    document.querySelectorAll('.report-filter-btn').forEach((button) => {
      button.addEventListener('click', () => {
        state.reportStatusFilter = button.dataset.reportFilter;
        render();
      });
    });

    document.querySelectorAll('.report-view-btn').forEach((button) => {
      button.addEventListener('click', () => {
        state.selectedReportId = button.dataset.reportId;
        state.currentPage = 'report-preview';
        render();
      });
    });

    document.getElementById('reportBackBtn')?.addEventListener('click', () => {
      state.currentPage = 'reports';
      render();
    });

    document.getElementById('reportPrintBtn')?.addEventListener('click', () => {
      window.print();
    });

    document.getElementById('reportExportBtn')?.addEventListener('click', async () => {
      try {
        state.pdfExporting = true;
        render();
        const report = getActiveReport();
        generatePdfReport(report);
        showToast('PDF report downloaded successfully.');
      } catch (error) {
        console.error('Unable to generate PDF report.', error);
        showToast('Unable to generate PDF. Please try again.');
      } finally {
        state.pdfExporting = false;
        render();
      }
    });

    document.getElementById('reportShareBtn')?.addEventListener('click', () => {
      state.currentModal = 'share-report';
      render();
    });

    document.getElementById('reportInvestigateFurtherBtn')?.addEventListener('click', () => {
      state.currentPage = 'threat-intelligence';
      render();
    });

    document.getElementById('reportCloseInvestigationBtn')?.addEventListener('click', () => {
      state.currentPage = 'dashboard';
      render();
    });

    document.getElementById('completeDashboardBtn')?.addEventListener('click', () => {
      state.currentPage = 'dashboard';
      render();
    });

    document.getElementById('completeReportsBtn')?.addEventListener('click', () => {
      state.currentPage = 'reports';
      render();
    });

    document.querySelector('.report-goto-timeline-btn')?.addEventListener('click', () => {
      state.currentPage = 'forensic-timeline';
      render();
    });

    document.querySelector('.report-goto-evidence-btn')?.addEventListener('click', () => {
      state.currentPage = 'evidence';
      render();
    });

    document.querySelector('.report-open-copilot-btn')?.addEventListener('click', () => {
      state.currentPage = 'ai-copilot';
      render();
    });

    document.getElementById('copyReportLinkBtn')?.addEventListener('click', async () => {
      const report = getActiveReport();
      const link = `${window.location.origin}/reports/${report.investigationId}`;
      try {
        await copyTextToClipboard(link);
        showToast('Report link copied.');
      } catch (error) {
        console.error('Clipboard copy failed for share URL.', error);
        showToast('Copy failed. Use the report link from the share dialog.');
      }
      state.currentModal = null;
      render();
    });

    document.getElementById('nativeShareReportBtn')?.addEventListener('click', async () => {
      await shareCurrentReport();
      state.currentModal = null;
      render();
    });

    document.getElementById('generateNewReportBtn')?.addEventListener('click', () => {
      const selected = document.querySelector('input[name="reportSelection"]:checked')?.value || 'MT-2026-00421';
      const report = mockReports.find((item) => item.investigationId === selected) || mockReports[0];
      state.reportSelection = selected;
      state.selectedReportId = report.reportId;
      state.currentModal = null;
      state.currentPage = 'report-preview';
      render();
    });
  }

  if (state.currentPage === 'ai-copilot') {
    hydrateRecentQuestions();

    document.querySelectorAll('.copilot-suggest-btn').forEach((button) => {
      button.addEventListener('click', () => {
        const question = button.dataset.question;
        if (question) {
          handleCopilotSubmit(question);
        }
      });
    });

    document.getElementById('copilotInquiryForm')?.addEventListener('submit', (event) => {
      event.preventDefault();
      handleCopilotSubmit();
    });

    document.getElementById('copilotClearChatBtn')?.addEventListener('click', () => {
      state.aiCopilotMessages = [];
      state.aiCopilotError = false;
      state.aiCopilotLoading = false;
      render();
    });

    document.getElementById('copilotAttachBtn')?.addEventListener('click', () => {
      state.currentModal = 'upload';
      render();
    });

    document.getElementById('copilotVoiceBtn')?.addEventListener('click', () => {
      showToast('Voice input is not available in this frontend demo.');
    });

    document.getElementById('copilotSummaryBtn')?.addEventListener('click', () => {
      state.currentPage = 'reports';
      render();
    });

    document.getElementById('copilotRetryBtn')?.addEventListener('click', () => {
      state.aiCopilotError = false;
      render();
    });

    document.getElementById('copilotViewInvestigationBtn')?.addEventListener('click', () => {
      state.currentPage = 'threat-result';
      render();
    });

    document.querySelectorAll('.copilot-link-chip').forEach((button) => {
      button.addEventListener('click', () => {
        const target = button.dataset.target;
        const value = button.dataset.value;

        if (target === 'indicator') {
          state.selectedThreatIndicator = value;
          state.currentPage = 'threat-intelligence';
          render();
          return;
        }

        if (target === 'evidence') {
          state.selectedEvidenceId = value;
          state.currentPage = 'evidence';
          render();
          return;
        }

        if (target === 'source' && value === 'Timeline') {
          state.currentPage = 'forensic-timeline';
          render();
        }
      });
    });

    document.querySelectorAll('.copilot-action-btn').forEach((button) => {
      const action = button.dataset.action;
      button.addEventListener('click', () => {
        if (action === 'Investigate Indicator') {
          state.currentPage = 'threat-intelligence';
        } else if (action === 'View Timeline') {
          state.currentPage = 'forensic-timeline';
        } else if (action === 'View Evidence') {
          state.currentPage = 'evidence';
        } else if (action === 'Generate Report') {
          state.currentPage = 'reports';
        }
        render();
      });
    });

    document.querySelectorAll('.quick-indicator').forEach((button) => {
      button.addEventListener('click', () => {
        const indicator = button.dataset.indicator;
        if (indicator.includes('secure-verification.example') || indicator.includes('203.0.113.42')) {
          state.currentPage = 'threat-intelligence';
          state.selectedThreatIndicator = indicator.includes('203.0.113.42') ? '203.0.113.42' : 'secure-verification.example';
        } else if (indicator.includes('URL')) {
          state.currentPage = 'threat-intelligence';
        } else if (indicator.includes('QR')) {
          state.currentPage = 'threat-intelligence';
        } else if (indicator.includes('Attachment')) {
          state.currentPage = 'evidence';
        }
        render();
      });
    });

    document.querySelectorAll('.recent-question').forEach((button) => {
      button.addEventListener('click', () => {
        const question = button.dataset.question;
        if (question) {
          handleCopilotSubmit(question);
        }
      });
    });
  }

  document.getElementById('quickActionBtn')?.addEventListener('click', () => {
    state.currentModal = state.gmailConnected ? null : 'gmail-connect';
    if (state.gmailConnected) {
      state.currentPage = 'gmail';
    }
    render();
  });

  document.getElementById('uploadEmailBtn')?.addEventListener('click', () => {
    state.currentModal = 'upload';
    render();
  });

  document.getElementById('gmailSyncBtn')?.addEventListener('click', () => {
    state.currentPage = 'gmail';
    render();
  });

  document.getElementById('gmailConnectBtn')?.addEventListener('click', () => {
    state.currentModal = 'gmail-connect';
    render();
  });

  document.getElementById('closeModalBtn')?.addEventListener('click', () => {
    state.currentModal = null;
    render();
  });

  document.getElementById('cancelModalBtn')?.addEventListener('click', () => {
    state.currentModal = null;
    render();
  });

  document.getElementById('analysisForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="loader" aria-label="Loading"></span>';

    window.setTimeout(() => {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }

      state.currentModal = null;
      state.currentPage = 'analysis';
      state.analysisScanStarted = false;
      startAnalysisScan();
      render();
      showToast('Threat analysis complete. Malicious activity confirmed.');
    }, 1200);
  });

  if (state.currentPage === 'investigation-complete') {
    document.getElementById('completeDashboardBtn')?.addEventListener('click', () => {
      state.currentPage = 'dashboard';
      render();
    });

    document.getElementById('completeReportsBtn')?.addEventListener('click', () => {
      state.currentPage = 'reports';
      render();
    });
  }

  document.getElementById('viewAllReportsBtn')?.addEventListener('click', () => {
    state.currentPage = 'reports';
    render();
  });

  document.getElementById('gmailConnectEntryBtn')?.addEventListener('click', () => {
    state.currentModal = 'gmail-connect';
    render();
  });

  document.getElementById('connectGoogleBtn')?.addEventListener('click', () => {
    state.gmailConnected = true;
    state.currentPage = 'gmail';
    state.currentModal = null;
    render();
    showToast('Gmail connected successfully.');
  });

  document.getElementById('gmailUploadBtn')?.addEventListener('click', () => {
    state.currentModal = 'upload';
    render();
  });

  document.getElementById('openGmailInboxBtn')?.addEventListener('click', () => {
    state.currentPage = 'gmail';
    render();
  });

  document.getElementById('uploadEmailForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    state.currentModal = null;
    state.currentPage = 'analysis';
    state.analysisScanStarted = false;
    startAnalysisScan();
    render();
    showToast('Email uploaded and queued for analysis.');
  });

  document.getElementById('emailSearchInput')?.addEventListener('input', (event) => {
    state.searchTerm = event.target.value;
    render();
  });

  document.querySelectorAll('.mail-row').forEach((row) => {
    row.addEventListener('click', () => {
      state.selectedEmailId = row.dataset.emailId;
      state.currentPage = 'email-detail';
      render();
    });
  });

  document.getElementById('backToInboxBtn')?.addEventListener('click', () => {
    state.currentPage = 'gmail';
    render();
  });

  document.getElementById('detailAnalyzeBtn')?.addEventListener('click', () => {
    state.currentPage = 'analysis';
    state.analysisScanStarted = false;
    startAnalysisScan();
    render();
  });

  document.getElementById('resultInboxBtn')?.addEventListener('click', () => {
    state.currentPage = 'gmail';
    render();
  });

  document.getElementById('resultAnalyzeAgainBtn')?.addEventListener('click', () => {
    state.currentPage = 'analysis';
    state.analysisScanStarted = false;
    startAnalysisScan();
    render();
  });

  document.getElementById('resultBackToInvestigationBtn')?.addEventListener('click', () => {
    state.currentPage = 'email-detail';
    render();
  });

  document.getElementById('resultThreatIntelBtn')?.addEventListener('click', () => {
    state.currentPage = 'threat-intelligence';
    render();
  });

  document.getElementById('resultThreatGraphBtn')?.addEventListener('click', () => {
    state.currentPage = 'threat-graph';
    render();
  });

  document.getElementById('resultEvidenceBtn')?.addEventListener('click', () => {
    state.currentPage = 'evidence';
    render();
  });

  document.getElementById('resultTimelineBtn')?.addEventListener('click', () => {
    state.currentPage = 'forensic-timeline';
    render();
  });

  document.getElementById('timelineThreatIntelBtn')?.addEventListener('click', () => {
    state.currentPage = 'threat-intelligence';
    render();
  });

  document.getElementById('timelineThreatGraphBtn')?.addEventListener('click', () => {
    state.currentPage = 'threat-graph';
    render();
  });

  document.getElementById('timelineEvidenceBtn')?.addEventListener('click', () => {
    state.currentPage = 'evidence';
    render();
  });

  document.getElementById('timelineReportsBtn')?.addEventListener('click', () => {
    state.currentPage = 'reports';
    render();
  });

  document.getElementById('prepareForensicReportBtn')?.addEventListener('click', () => {
    state.currentModal = 'report-prep';
    render();
  });

  document.getElementById('exportTimelineBtn')?.addEventListener('click', () => {
    showToast('Timeline exported for review.');
  });

  document.getElementById('resultAiCopilotBtn')?.addEventListener('click', () => {
    state.currentPage = 'ai-copilot';
    render();
  });

  document.getElementById('resultGenerateReportBtn')?.addEventListener('click', () => {
    state.currentPage = 'reports';
    render();
  });

  document.getElementById('investigateFurtherBtn')?.addEventListener('click', () => {
    state.currentPage = 'investigations';
    render();
  });

  document.getElementById('generateReportBtn')?.addEventListener('click', () => {
    state.currentPage = 'reports';
    render();
  });

  document.getElementById('viewEvidenceBtn')?.addEventListener('click', () => {
    showToast('Detailed evidence view is mocked for this prototype.');
  });

  document.querySelector('.suspicious-link')?.addEventListener('click', () => {
    showToast('Suspicious URL detected');
  });

  document.querySelectorAll('.timeline-filter-btn').forEach((button) => {
    button.addEventListener('click', () => {
      state.timelineFilter = button.dataset.filter;
      const visible = getVisibleTimelineEvents();
      if (visible.length) {
        state.selectedTimelineEventId = visible[0].id;
      }
      render();
    });
  });

  document.getElementById('timelineSearchInput')?.addEventListener('input', (event) => {
    state.timelineSearch = event.target.value;
    const visible = getVisibleTimelineEvents();
    if (visible.length) {
      state.selectedTimelineEventId = visible[0].id;
    }
    render();
  });

  document.querySelectorAll('.timeline-event-item').forEach((item) => {
    item.addEventListener('click', () => {
      state.selectedTimelineEventId = item.dataset.eventId;
      state.evidenceDrawerOpen = true;
      const match = evidenceItems.find((entry) => entry.name.toLowerCase().includes('header') || entry.name.toLowerCase().includes('email'));
      if (match) state.selectedEvidenceId = match.id;
      render();
    });
  });

  document.querySelectorAll('.evidence-view-btn, .evidence-row').forEach((item) => {
    item.addEventListener('click', (event) => {
      const evidenceId = event.currentTarget.dataset.evidenceId || item.dataset.evidenceId;
      if (evidenceId) {
        state.selectedEvidenceId = evidenceId;
        state.evidenceDrawerOpen = true;
        render();
      }
    });
  });

  document.getElementById('evidenceDrawerCloseBtn')?.addEventListener('click', () => {
    state.evidenceDrawerOpen = false;
    render();
  });

  document.getElementById('closeEvidenceDrawerBtn')?.addEventListener('click', () => {
    state.evidenceDrawerOpen = false;
    render();
  });

  document.getElementById('copyHashBtn')?.addEventListener('click', async () => {
    const selectedEvidence = evidenceItems.find((item) => item.id === state.selectedEvidenceId) || evidenceItems[0];
    try {
      await navigator.clipboard.writeText(selectedEvidence.hash);
      showToast('Hash copied to clipboard.');
    } catch (error) {
      showToast('Copy is unavailable in this demo environment.');
    }
  });

  document.getElementById('viewRawEvidenceBtn')?.addEventListener('click', () => {
    state.currentModal = 'raw-evidence';
    render();
  });

  document.getElementById('generateReportBtn')?.addEventListener('click', () => {
    state.currentModal = null;
    state.currentPage = 'reports';
    render();
  });

  document.getElementById('verifyIntegrityBtn')?.addEventListener('click', () => {
    state.integrityLoading = true;
    render();

    window.setTimeout(() => {
      state.integrityLoading = false;
      state.integrityVerified = true;
      render();
      showToast('Integrity verified.');
    }, 1200);
  });

  document.querySelectorAll('.relationship-node').forEach((node) => {
    node.addEventListener('click', () => {
      const evidenceId = node.dataset.evidenceId;
      if (evidenceId) {
        state.selectedEvidenceId = evidenceId;
        state.evidenceDrawerOpen = true;
        render();
      }
    });
  });

  document.getElementById('intelInvestigateBtn')?.addEventListener('click', () => {
    const input = document.getElementById('intelSearchInput');
    const query = (input?.value || '').trim();
    if (!query) {
      state.selectedThreatIndicator = threatIntelligenceData.indicator;
      render();
      return;
    }

    const matches = [
      threatIntelligenceData.indicator,
      threatIntelligenceData.ipInfo.ip,
      threatIntelligenceData.campaign,
      ...threatIntelligenceData.relatedIndicators.map((item) => item.indicator)
    ].find((entry) => entry.toLowerCase().includes(query.toLowerCase()));

    if (matches) {
      state.selectedThreatIndicator = matches;
      state.currentPage = 'threat-intelligence';
      render();
    } else {
      showToast('No matching threat intelligence result was found in the demo dataset.');
    }
  });

  document.getElementById('viewMapBtn')?.addEventListener('click', () => {
    state.currentModal = 'intel-map';
    render();
  });

  document.getElementById('viewInThreatGraphBtn')?.addEventListener('click', () => {
    state.currentPage = 'threat-graph';
    render();
  });

  document.querySelectorAll('.related-row').forEach((row) => {
    row.addEventListener('click', () => {
      const indicator = row.dataset.relatedIndicator;
      if (indicator) {
        state.selectedThreatIndicator = indicator;
        state.currentPage = 'threat-intelligence';
        render();
      }
    });
  });

  document.querySelectorAll('.graph-node').forEach((node) => {
    node.addEventListener('click', () => {
      state.selectedGraphNodeId = node.dataset.nodeId;
      render();
    });
  });

  document.getElementById('resetGraphBtn')?.addEventListener('click', () => {
    state.selectedGraphNodeId = 'domain-1';
    render();
  });

  document.getElementById('graphInvestigateBtn')?.addEventListener('click', () => {
    state.currentPage = 'threat-intelligence';
    render();
  });

  document.getElementById('graphIntelligenceBtn')?.addEventListener('click', () => {
    state.currentPage = 'threat-intelligence';
    render();
  });

  document.getElementById('zoomInBtn')?.addEventListener('click', () => {
    showToast('Zoom in is mocked for the prototype.');
  });

  document.getElementById('zoomOutBtn')?.addEventListener('click', () => {
    showToast('Zoom out is mocked for the prototype.');
  });

  document.getElementById('resetZoomBtn')?.addEventListener('click', () => {
    showToast('Graph view reset to the default layout.');
  });

  document.getElementById('graphBackToInvestigationBtn')?.addEventListener('click', () => {
    state.currentPage = 'email-detail';
    render();
  });
}

render();
refreshBackendStatus().then(() => {
  render();
});
