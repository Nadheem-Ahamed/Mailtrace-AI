export const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '▣' },
  { id: 'gmail', label: 'Gmail Inbox', icon: '✉' },
  { id: 'analyze-email', label: 'Analyze Email', icon: '✦' },
  { id: 'investigations', label: 'Investigations', icon: '◈' },
  { id: 'investigation-history', label: 'Investigation History', icon: '🕘' },
  { id: 'threat-intelligence', label: 'Threat Intelligence', icon: '◍' },
  { id: 'threat-graph', label: 'Threat Graph', icon: '⬡' },
  { id: 'forensic-timeline', label: 'Forensic Timeline', icon: '⏱' },
  { id: 'evidence', label: 'Evidence', icon: '▣' },
  { id: 'ai-copilot', label: 'AI Copilot', icon: '✧' },
  { id: 'reports', label: 'Reports', icon: '▤' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'profile', label: 'Profile', icon: '◉' },
  { id: 'settings', label: 'Settings', icon: '⚙' }
];

export const dashboardData = {
  stats: [
    { label: 'TOTAL INVESTIGATIONS', value: '248', trend: '+12 this week', icon: '▣' },
    { label: 'THREATS DETECTED', value: '37', trend: '+8 this week', icon: '⚠' },
    { label: 'HIGH RISK EMAILS', value: '14', trend: 'Needs investigation', icon: '△' },
    { label: 'ACTIVE CAMPAIGNS', value: '6', trend: 'Correlated', icon: '◍' }
  ],
  investigationRows: [
    { id: 'INV-2048', risk: 'CRITICAL', sender: 'security-alert@paypa1-support.com', threat: 'Credential Phishing', indicators: '2 URLs • 1 QR', analyzed: '2 min ago', status: 'Investigating', level: 'critical', owner: 'A. Khan', subject: 'Credential phishing campaign targeting finance', time: '2m ago' },
    { id: 'INV-1976', risk: 'HIGH', sender: 'accounts@invoice-check.net', threat: 'Malicious Link', indicators: '3 URLs', analyzed: '18 min ago', status: 'Open', level: 'high', owner: 'L. Gomez', subject: 'Suspicious invoice impersonation report', time: '18m ago' },
    { id: 'INV-1893', risk: 'MEDIUM', sender: 'support@service-mail.com', threat: 'Suspicious Sender', indicators: 'Domain mismatch', analyzed: '1 hr ago', status: 'Reviewed', level: 'medium', owner: 'S. Ahmed', subject: 'Malware-laced attachment in vendor thread', time: '46m ago' },
    { id: 'INV-1762', risk: 'CRITICAL', sender: 'finance@secure-portal.io', threat: 'Business Email Compromise', indicators: '1 IP • 2 domains', analyzed: '2 hr ago', status: 'Escalated', level: 'critical', owner: 'R. Patel', subject: 'Executive impersonation via spoofed domain', time: '1h ago' },
    { id: 'INV-1648', risk: 'LOW', sender: 'updates@internal-mail.pro', threat: 'Safe Review', indicators: '2 headers', analyzed: '3 hr ago', status: 'Closed', level: 'low', owner: 'N. Reed', subject: 'Internal replay attack from compromised mailbox', time: '2h ago' }
  ],
  threatDistribution: [
    { name: 'Phishing', value: 42, tone: 'cyan' },
    { name: 'Malware', value: 22, tone: 'purple' },
    { name: 'Quishing', value: 18, tone: 'amber' },
    { name: 'Suspicious', value: 12, tone: 'blue' },
    { name: 'Safe', value: 6, tone: 'green' }
  ],
  activity: [
    { time: '21:42', title: 'High-risk email detected', detail: 'Inbound threat matched a known credential phishing cluster.' },
    { time: '21:38', title: 'QR code extracted from attachment', detail: 'Multi-layer obfuscation and redirect chain confirmed suspicious behavior.' },
    { time: '21:31', title: 'Suspicious domain enriched', detail: 'Domain reputation and DNS metadata were correlated with active campaigns.' },
    { time: '21:24', title: 'New investigation created', detail: 'Evidence package is queued for analyst review and response orchestration.' }
  ],
  gmailAccount: 'user@gmail.com'
};

export const gmailMessages = [
  {
    id: 'gmail-001',
    senderName: 'PayPal Security',
    senderEmail: 'security-alert@paypa1-support.com',
    recipient: 'user@gmail.com',
    subject: 'Urgent Account Verification Required',
    preview: 'Your account has been temporarily restricted. Verify your information immediately to prevent suspension.',
    body: 'Dear Customer,\n\nWe detected unusual activity on your account. To prevent account suspension, verify your information immediately.\n\n[Verify Account]\n\nThank you,\nSecurity Team',
    timestamp: 'Today, 09:14 AM',
    riskScore: 92,
    riskLevel: 'CRITICAL',
    riskClass: 'critical',
    spf: 'FAIL',
    dkim: 'FAIL',
    dmarc: 'FAIL',
    urls: 2,
    qrCodes: 1,
    attachments: 1,
    domain: 'paypa1-support.com',
    status: 'Critical',
    emailType: 'Phishing'
  },
  {
    id: 'gmail-002',
    senderName: 'Microsoft Account',
    senderEmail: 'account-security@micr0soft-alert.com',
    recipient: 'user@gmail.com',
    subject: 'Unusual sign-in activity detected',
    preview: 'We detected a suspicious login attempt from a new device in another region.',
    body: 'Hello,\n\nA sign-in attempt from a new device was detected in a different region. Review recent activity to secure your account.\n\n[Review Activity]\n\nRegards,\nMicrosoft Account Team',
    timestamp: 'Today, 08:42 AM',
    riskScore: 86,
    riskLevel: 'HIGH RISK',
    riskClass: 'high',
    spf: 'FAIL',
    dkim: 'FAIL',
    dmarc: 'FAIL',
    urls: 3,
    qrCodes: 0,
    attachments: 0,
    domain: 'micr0soft-alert.com',
    status: 'High Risk',
    emailType: 'Impersonation'
  },
  {
    id: 'gmail-003',
    senderName: 'HR Department',
    senderEmail: 'hr@company-careers.net',
    recipient: 'user@gmail.com',
    subject: 'Updated employee document',
    preview: 'Please review the attached document and confirm the updated details before close of business.',
    body: 'Hi Team,\n\nPlease review the attached employee document. The updated version includes scheduling changes and required certifications.\n\nThank you,\nHR Department',
    timestamp: 'Yesterday, 05:28 PM',
    riskScore: 62,
    riskLevel: 'SUSPICIOUS',
    riskClass: 'suspicious',
    spf: 'WARN',
    dkim: 'PASS',
    dmarc: 'FAIL',
    urls: 1,
    qrCodes: 0,
    attachments: 1,
    domain: 'company-careers.net',
    status: 'Suspicious',
    emailType: 'Malware'
  },
  {
    id: 'gmail-004',
    senderName: 'Amazon',
    senderEmail: 'orders@amazon-support.net',
    recipient: 'user@gmail.com',
    subject: 'Your payment could not be processed',
    preview: 'Please update your payment information to avoid account restriction on your order history.',
    body: 'Hello,\n\nYour recent payment could not be processed. Please update your payment details to avoid delays.\n\n[Update Payment Info]\n\nAmazon Support',
    timestamp: 'Yesterday, 04:10 PM',
    riskScore: 81,
    riskLevel: 'HIGH RISK',
    riskClass: 'high',
    spf: 'FAIL',
    dkim: 'FAIL',
    dmarc: 'FAIL',
    urls: 2,
    qrCodes: 0,
    attachments: 0,
    domain: 'amazon-support.net',
    status: 'High Risk',
    emailType: 'Credential Harvesting'
  },
  {
    id: 'gmail-005',
    senderName: 'Google Workspace',
    senderEmail: 'workspace-alert@google-security.net',
    recipient: 'user@gmail.com',
    subject: 'Your storage is almost full',
    preview: 'Your account storage has reached the limit and requires additional action to avoid interruption.',
    body: 'Dear User,\n\nYour Google Workspace storage is almost full. To avoid interruption, review account usage and storage settings.\n\n[Manage Storage]\n\nGoogle Workspace Team',
    timestamp: 'Mon, 10:11 AM',
    riskScore: 52,
    riskLevel: 'MEDIUM',
    riskClass: 'medium',
    spf: 'WARN',
    dkim: 'WARN',
    dmarc: 'PASS',
    urls: 1,
    qrCodes: 0,
    attachments: 0,
    domain: 'google-security.net',
    status: 'Medium',
    emailType: 'Suspicious'
  },
  {
    id: 'gmail-006',
    senderName: 'College Administration',
    senderEmail: 'admin@college.edu',
    recipient: 'user@gmail.com',
    subject: 'Semester examination schedule',
    preview: 'Please find the updated semester examination schedule attached for your review.',
    body: 'Dear Student,\n\nPlease find the updated examination schedule attached for your review. The final timetable is available in the PDF attachment.\n\nRegards,\nCollege Administration',
    timestamp: 'Sun, 11:12 AM',
    riskScore: 14,
    riskLevel: 'SAFE',
    riskClass: 'safe',
    spf: 'PASS',
    dkim: 'PASS',
    dmarc: 'PASS',
    urls: 0,
    qrCodes: 0,
    attachments: 1,
    domain: 'college.edu',
    status: 'Safe',
    emailType: 'Routine'
  }
];

export const threatResultData = {
  title: 'Threat Result',
  summary: 'Malicious infrastructure detected across sender identity, URL behavior, and attachment handling.',
  riskScore: 92,
  riskLevel: 'CRITICAL',
  indicators: [
    'Sender domain resembles a trusted brand but does not match the official domain.',
    'Threat actor used QR-based redirection payloads to evade reputation filters.',
    'Observed redirect chain is associated with credential harvesting infrastructure.'
  ],
  findings: [
    { label: 'SPF', value: 'FAIL' },
    { label: 'DKIM', value: 'FAIL' },
    { label: 'DMARC', value: 'FAIL' },
    { label: 'Domain Reputation', value: 'SUSPICIOUS' },
    { label: 'URLs', value: '2 detected' },
    { label: 'QR Codes', value: '1 detected' },
    { label: 'Attachments', value: '1 detected' },
    { label: 'Breadcrumb Telemetry', value: 'TRIGGERED' },
    { label: 'Honeytoken Trigger', value: 'TRIGGERED' },
    { label: 'Threat Intelligence Match', value: 'SIGNAL' }
  ]
};

export const user = {
  name: 'Security Analyst',
  role: 'Security Analyst',
  email: 'analyst@mailtrace.demo'
};

export const connectedGmail = {
  name: 'Security Analyst',
  email: 'analyst@mailtrace.demo',
  provider: 'Google'
};

export const mockInvestigationHistory = [
  {
    id: 'INV-2026-0916-001',
    email: 'Urgent Account Verification Required',
    sender: 'security-alert@paypa1-support.com',
    riskScore: 92,
    riskLabel: 'Critical',
    threatType: 'Phishing + Impersonation',
    date: 'Sep 16, 2026',
    status: 'Critical',
    statusClass: 'critical',
    reportId: 'RPT-2026-00421'
  },
  {
    id: 'INV-2026-0915-004',
    email: 'Invoice Payment Overdue',
    sender: 'billing@fake-invoice.com',
    riskScore: 78,
    riskLabel: 'High',
    threatType: 'Malicious URL',
    date: 'Sep 15, 2026',
    status: 'High',
    statusClass: 'high',
    reportId: 'RPT-2026-00418'
  },
  {
    id: 'INV-2026-0914-002',
    email: 'Document Shared With You',
    sender: 'notifications@cloud-share.example',
    riskScore: 61,
    riskLabel: 'Medium',
    threatType: 'Suspicious Link',
    date: 'Sep 14, 2026',
    status: 'Medium',
    statusClass: 'medium',
    reportId: 'RPT-2026-00412'
  },
  {
    id: 'INV-2026-0913-011',
    email: 'Quarterly Benefits Update',
    sender: 'benefits@secure-payroll.co',
    riskScore: 43,
    riskLabel: 'Low',
    threatType: 'Risk Review',
    date: 'Sep 13, 2026',
    status: 'Resolved',
    statusClass: 'safe',
    reportId: 'RPT-2026-00405'
  }
];

export const mockNotifications = [
  {
    id: 'notif-001',
    category: 'Critical Threat',
    title: 'Critical phishing email detected',
    detail: 'Risk score 92/100 detected in INV-2026-0916-001.',
    time: '2 minutes ago',
    read: false,
    route: 'email-detail',
    contextId: 'INV-2026-0916-001'
  },
  {
    id: 'notif-002',
    category: 'Threat Intelligence Update',
    title: 'Threat intelligence updated',
    detail: 'New reputation information is available for suspicious domain.',
    time: '18 minutes ago',
    read: false,
    route: 'threat-intelligence',
    contextId: 'secure-verification.example'
  },
  {
    id: 'notif-003',
    category: 'Report Ready',
    title: 'Forensic report generated',
    detail: 'Investigation report INV-2026-0916-001 is ready.',
    time: '1 hour ago',
    read: true,
    route: 'report-preview',
    contextId: 'RPT-2026-00421'
  },
  {
    id: 'notif-004',
    category: 'New Investigation',
    title: 'New suspicious invoice received',
    detail: 'Review the latest high-risk malicious URL case.',
    time: '3 hours ago',
    read: true,
    route: 'investigation-history',
    contextId: 'INV-2026-0915-004'
  },
  {
    id: 'notif-005',
    category: 'System',
    title: 'Evidence integrity verified',
    detail: 'Fresh hash validation completed for collected evidence.',
    time: 'Today',
    read: true,
    route: 'evidence',
    contextId: 'EV-00421-01'
  }
];

export const profileData = {
  name: 'Security Analyst',
  email: 'analyst@mailtrace.demo',
  accountType: 'Security Analyst',
  status: 'Active',
  lastLogin: 'Sep 16, 2026 • 08:48 AM',
  investigationsCreated: 18,
  reportsGenerated: 42
};

export const defaultSettings = {
  theme: 'Dark',
  language: 'English',
  timeFormat: '24-hour',
  autoRefreshDashboard: true,
  sessionTimeout: '15 minutes',
  requireConfirmation: true,
  secureEvidenceHandling: true,
  automaticInvestigationLogging: true,
  qrQuishingDetection: true,
  emailDnaAnalysis: true,
  senderImpersonationDetection: true,
  threatIntelligenceEnrichment: true,
  campaignCorrelation: true,
  criticalThreatAlerts: true,
  investigationCompletion: true,
  threatIntelligenceUpdates: true,
  reportGenerationAlerts: true,
  dataRetention: '12 months',
  clearMockData: false,
  exportInvestigationData: false
};

export const globalSearchCatalog = [
  {
    id: 'search-investigation-001',
    type: 'Investigation',
    title: 'INV-2026-0916-001',
    subtitle: 'Urgent Account Verification Required',
    route: 'email-detail',
    keywords: ['paypal', 'urgent', 'account', 'verification', 'paypa1']
  },
  {
    id: 'search-indicator-001',
    type: 'Suspicious domain',
    title: 'secure-verification.example',
    subtitle: 'Domain impersonation indicator',
    route: 'threat-intelligence',
    keywords: ['paypal', 'secure', 'verification', 'domain', 'example']
  },
  {
    id: 'search-email-001',
    type: 'Email',
    title: 'security-alert@paypa1-support.com',
    subtitle: 'Sender impersonation pattern matched',
    route: 'gmail',
    keywords: ['paypal', 'security', 'alert', 'sender']
  },
  {
    id: 'search-report-001',
    type: 'Report',
    title: 'RPT-2026-00421',
    subtitle: 'Critical phishing and impersonation report',
    route: 'report-preview',
    keywords: ['report', 'paypal', 'critical', 'phishing']
  }
];

export const threatIntelligenceData = {
  indicator: 'paypa1-support.com',
  type: 'DOMAIN',
  riskScore: 87,
  riskLevel: 'CRITICAL',
  reputation: 'Suspicious',
  firstSeen: 'Sep 12, 2026',
  lastSeen: 'Sep 16, 2026',
  sources: ['VirusTotal', 'URLhaus', 'AbuseIPDB'],
  demoLabel: 'Demo Intelligence Data',
  domainInfo: {
    domain: 'paypa1-support.com',
    age: '12 days',
    registrar: 'Example Registrar',
    registration: 'Sep 04, 2026',
    reputation: 'Suspicious',
    similarity: 'High similarity to trusted brand',
    dnsStatus: 'Active',
    whois: 'Available'
  },
  ipInfo: {
    ip: '203.0.113.42',
    reputation: 'Suspicious',
    abuseReports: 17,
    asn: 'Demo Network',
    country: 'Demo Country',
    isp: 'Demo ISP',
    firstSeen: 'Sep 12, 2026',
    lastSeen: 'Sep 16, 2026'
  },
  geolocation: {
    region: 'Example Region',
    country: 'Demo Country',
    coordinates: 'XX.XXXX, XX.XXXX',
    network: 'Demo ISP',
    note: 'Geolocation is approximate and represents observed network infrastructure. It does not identify the attacker\'s physical location.'
  },
  threatBreakdown: [
    { label: 'Reputation', value: 'High' },
    { label: 'Domain Age', value: 'High' },
    { label: 'Threat Reports', value: 'Medium' },
    { label: 'Brand Similarity', value: 'High' },
    { label: 'Infrastructure Pattern', value: 'Medium' }
  ],
  relatedIndicators: [
    { type: 'DOMAIN', indicator: 'paypa1-support.com', risk: 'HIGH', relationship: 'Sender domain' },
    { type: 'IP', indicator: '203.0.113.42', risk: 'HIGH', relationship: 'Resolved IP' },
    { type: 'URL', indicator: 'https://paypa1-support.com/verify', risk: 'HIGH', relationship: 'Observed path' },
    { type: 'HASH', indicator: 'a84f...91d2', risk: 'MEDIUM', relationship: 'Attachment' }
  ],
  campaign: 'CAM-2026-014',
  investigationId: 'INV-2026-0916-001',
  sourceEmail: 'security@paypa1-support.com',
  detected: 'Sep 16, 2026',
  evidenceItems: 8,
  aiSummary: 'MailTrace AI identified multiple indicators associated with a potentially deceptive email. The sender domain shows characteristics of impersonation, email authentication checks failed, and the message contains suspicious links and a QR code requesting account verification.'
};

export const threatGraphData = {
  nodes: [
    { id: 'email-1', type: 'email', label: 'Suspicious Email', x: 80, y: 210 },
    { id: 'sender-1', type: 'sender', label: 'Sender', x: 210, y: 130 },
    { id: 'domain-1', type: 'domain', label: 'paypa1-support.com', x: 360, y: 130 },
    { id: 'url-1', type: 'url', label: 'URL', x: 360, y: 250 },
    { id: 'ip-1', type: 'ip', label: '203.0.113.42', x: 510, y: 120 },
    { id: 'asn-1', type: 'asn', label: 'AS64500', x: 650, y: 80 },
    { id: 'org-1', type: 'org', label: 'Demo Org', x: 790, y: 80 },
    { id: 'geo-1', type: 'geo', label: 'Approx Geo', x: 790, y: 180 },
    { id: 'case-1', type: 'case', label: 'Related Case', x: 790, y: 280 },
    { id: 'qr-1', type: 'qr', label: 'QR Code', x: 210, y: 320 },
    { id: 'attachment-1', type: 'attachment', label: 'Attachment', x: 510, y: 300 },
    { id: 'breadcrumb-1', type: 'breadcrumb', label: 'Breadcrumb', x: 650, y: 180 },
    { id: 'honeytoken-1', type: 'honeytoken', label: 'Honeytoken', x: 650, y: 300 },
    { id: 'investigation-1', type: 'investigation', label: 'INV-2026-0916-001', x: 510, y: 400 }
  ],
  edges: [
    ['email-1', 'sender-1'],
    ['sender-1', 'domain-1'],
    ['domain-1', 'url-1'],
    ['url-1', 'ip-1'],
    ['ip-1', 'asn-1'],
    ['asn-1', 'org-1'],
    ['org-1', 'geo-1'],
    ['geo-1', 'case-1'],
    ['email-1', 'qr-1'],
    ['qr-1', 'url-1'],
    ['email-1', 'attachment-1'],
    ['ip-1', 'breadcrumb-1'],
    ['breadcrumb-1', 'honeytoken-1'],
    ['honeytoken-1', 'investigation-1'],
    ['case-1', 'investigation-1']
  ],
  detail: {
    type: 'Domain',
    value: 'secure-verification.example',
    risk: 'HIGH',
    relatedEmails: 4,
    relatedUrls: 3,
    relatedIps: 1,
    campaign: 'CAM-2026-014'
  }
};

export const timelineEvents = [
  {
    id: 'evt-01',
    timestamp: '09:14:02 PM',
    category: 'Email',
    title: 'EMAIL RECEIVED',
    description: 'Suspicious email received.',
    severity: 'critical',
    relatedEvidence: ['evt-01'],
    details: 'Sender: security@paypa1-support.com'
  },
  {
    id: 'evt-02',
    timestamp: '09:14:03 PM',
    category: 'Authentication',
    title: 'HEADER PARSED',
    description: 'Email headers extracted.',
    severity: 'medium',
    relatedEvidence: ['evt-02'],
    details: 'Headers parsed successfully from the inbound message.'
  },
  {
    id: 'evt-03',
    timestamp: '09:14:03 PM',
    category: 'Authentication',
    title: 'AUTHENTICATION CHECK',
    description: 'SPF failed. DKIM failed. DMARC failed.',
    severity: 'critical',
    relatedEvidence: ['evt-02'],
    details: 'Authentication checks failed for the suspicious sender domain.'
  },
  {
    id: 'evt-04',
    timestamp: '09:14:04 PM',
    category: 'URL',
    title: 'URL EXTRACTED',
    description: '2 suspicious URLs identified.',
    severity: 'high',
    relatedEvidence: ['evt-04'],
    details: 'Two domain indicators were extracted from the message body.'
  },
  {
    id: 'evt-05',
    timestamp: '09:14:04 PM',
    category: 'QR',
    title: 'QR CODE DETECTED',
    description: '1 QR code extracted from email content.',
    severity: 'high',
    relatedEvidence: ['evt-05'],
    details: 'A QR code contained redirect content designed to bypass mailbox filters.'
  },
  {
    id: 'evt-06',
    timestamp: '09:14:05 PM',
    category: 'AI Analysis',
    title: 'SENDER ANALYSIS',
    description: 'Possible brand impersonation detected.',
    severity: 'critical',
    relatedEvidence: ['evt-06'],
    details: 'The message used a visually similar domain and urgent credential prompt.'
  },
  {
    id: 'evt-07',
    timestamp: '09:14:06 PM',
    category: 'Threat Intelligence',
    title: 'THREAT INTELLIGENCE',
    description: 'Domain and IP indicators enriched.',
    severity: 'high',
    relatedEvidence: ['evt-07'],
    details: 'Threat intelligence enriched the sending domain and IP infrastructure.'
  },
  {
    id: 'evt-08',
    timestamp: '09:14:07 PM',
    category: 'AI Analysis',
    title: 'RISK ASSESSMENT',
    description: 'Risk score calculated: 92 / 100',
    severity: 'critical',
    relatedEvidence: ['evt-08'],
    details: 'Calculated risk score indicates a critical phishing / impersonation threat.'
  },
  {
    id: 'evt-09',
    timestamp: '09:14:08 PM',
    category: 'Evidence',
    title: 'EVIDENCE PRESERVED',
    description: 'Investigation evidence fingerprint generated.',
    severity: 'medium',
    relatedEvidence: ['evt-09'],
    details: 'Evidence fingerprint was generated to support tamper-evident chain-of-custody tracking.'
  },
  {
    id: 'evt-10',
    timestamp: '02:31:52 PM',
    category: 'Breadcrumb',
    title: 'BREADCRUMB TRIGGERED',
    description: 'Controlled breadcrumb telemetry recorded after suspicious link interaction.',
    severity: 'high',
    relatedEvidence: ['BC-INV-2026-0916-001'],
    details: 'IP-based telemetry provides infrastructure or network clues. It does not prove the attacker\'s exact physical location.'
  },
  {
    id: 'evt-11',
    timestamp: '02:32:18 PM',
    category: 'Honeytoken',
    title: 'HONEYTOKEN TRIGGERED',
    description: 'Controlled decoy value was accessed in the demo investigation.',
    severity: 'critical',
    relatedEvidence: ['HT-INV-2026-0916-001'],
    details: 'The decoy value was accessed. This is controlled lab telemetry and does not identify the real attacker.'
  }
];

export const honeytokenData = {
  status: 'TRIGGERED',
  trigger_status: 'TRIGGERED',
  tokenId: 'HT-INV-2026-0916-001',
  detectionTime: '2026-09-16 14:32:18',
  trigger_timestamp: '2026-09-16 14:32:18',
  observedActivity: 'Decoy value accessed',
  purpose: 'Controlled decoy values can detect unauthorized use or interaction.',
  related_investigation: 'INV-2026-0916-001',
  graph_relationship: 'Honeytoken Event → Investigation INV-2026-0916-001',
  examples: ['Decoy invoice/reference number', 'Decoy credential', 'Decoy API key', 'Decoy database value'],
  telemetry: {
    ip: '203.0.113.42',
    userAgent: 'Chrome / Windows',
    source: 'Suspicious URL interaction',
    event: 'Controlled lab decoy access (synthetic)'
  },
  lab_label: 'Controlled Lab / Authorized Use Only',
  demoNote: 'Controlled Lab / Authorized Use Only. DEMO / CONTROLLED LAB TELEMETRY. This signal does not identify the real attacker or an exact physical location.'
};

export const breadcrumbData = {
  id: 'BC-INV-2026-0916-001',
  token_id: 'BC-INV-2026-0916-001',
  status: 'TRIGGERED',
  interaction_status: 'TRIGGERED',
  event_timestamp: '2026-09-16 14:31:52',
  firstSeen: '2026-09-16 14:31:52',
  lastSeen: '2026-09-16 14:32:18',
  ipAddress: '203.0.113.42',
  collector_exit_ip: '203.0.113.42',
  userAgent: 'Chrome / Windows',
  referrer: 'Email link',
  redirectChain: 'Email → Short URL → Suspicious Domain → Login Page',
  approximateLocation: 'Chennai, India',
  locationLabel: 'Approximate infrastructure/location context',
  warning: 'Infrastructure clue — not exact attacker location. IP-based telemetry provides infrastructure or network clues. It does not prove the attacker\'s exact physical location.',
  lab_label: 'Controlled Lab / Authorized Use Only',
  demoNote: 'Controlled Lab / Authorized Use Only. DEMO / CONTROLLED LAB TELEMETRY. No real user telemetry is collected by this frontend prototype.'
};

export const evidenceItems = [
  {
    id: 'EV-00421-01',
    type: 'EML',
    name: 'Original Email',
    source: 'Gmail Inbox',
    timestamp: '09:14 PM',
    hash: '8f4c...91a2',
    integrity: 'VERIFIED',
    relatedIndicators: ['secure-verification.example'],
    investigationId: 'INV-2026-0916-001'
  },
  {
    id: 'EV-00421-02',
    type: 'TEXT',
    name: 'Email Headers',
    source: 'Email Parser',
    timestamp: '09:14 PM',
    hash: 'a42b...fd11',
    integrity: 'VERIFIED',
    relatedIndicators: ['secure-verification.example'],
    investigationId: 'INV-2026-0916-001'
  },
  {
    id: 'EV-00421-03',
    type: 'URL',
    name: 'Suspicious URL',
    source: 'Email Body',
    timestamp: '09:14 PM',
    hash: '99a1...c77b',
    integrity: 'VERIFIED',
    relatedIndicators: ['203.0.113.42'],
    investigationId: 'INV-2026-0916-001'
  },
  {
    id: 'EV-00421-04',
    type: 'IMAGE',
    name: 'QR Image',
    source: 'Email Content',
    timestamp: '09:14 PM',
    hash: '41d9...f2ec',
    integrity: 'VERIFIED',
    relatedIndicators: ['secure-verification.example'],
    investigationId: 'INV-2026-0916-001'
  },
  {
    id: 'EV-00421-05',
    type: 'PDF',
    name: 'Attachment',
    source: 'Email',
    timestamp: '09:14 PM',
    hash: '73e2...7aab',
    integrity: 'VERIFIED',
    relatedIndicators: ['a84f...91d2'],
    investigationId: 'INV-2026-0916-001'
  },
  {
    id: 'EV-00421-06',
    type: 'JSON',
    name: 'Threat Intelligence',
    source: 'Threat Intel',
    timestamp: '09:14 PM',
    hash: '0e5c...83bf',
    integrity: 'VERIFIED',
    relatedIndicators: ['secure-verification.example'],
    investigationId: 'INV-2026-0916-001'
  },
  {
    id: 'EV-00421-07',
    type: 'JSON',
    name: 'AI Analysis',
    source: 'MailTrace AI',
    timestamp: '09:14 PM',
    hash: 'f4a8...cc21',
    integrity: 'VERIFIED',
    relatedIndicators: ['CAM-2026-014'],
    investigationId: 'INV-2026-0916-001'
  },
  {
    id: 'EV-00421-08',
    type: 'PDF',
    name: 'Investigation Report',
    source: 'MailTrace AI',
    timestamp: '09:14 PM',
    hash: 'c829...10fe',
    integrity: 'VERIFIED',
    relatedIndicators: ['CAM-2026-014'],
    investigationId: 'INV-2026-0916-001'
  }
];

export const chainOfCustody = [
  { time: '09:14:02 PM', event: 'Evidence collected' },
  { time: '09:14:03 PM', event: 'Evidence parsed' },
  { time: '09:14:05 PM', event: 'Indicators extracted' },
  { time: '09:14:08 PM', event: 'Evidence fingerprint generated' },
  { time: '09:14:09 PM', event: 'Integrity record created' }
];

export const blockchainIntegrity = {
  evidenceHash: '8f4c92a1...91a2',
  hashAlgorithm: 'SHA-256',
  blockchainStatus: '● ANCHORED',
  blockReference: '0x7a4f...e821',
  network: 'Demo Test Network',
  timestamp: 'Sep 16, 2026 • 21:14:08 IST',
  label: 'DEMO BLOCKCHAIN INTEGRITY'
};

export const forensicFindings = {
  primaryThreat: 'Phishing / Impersonation',
  attackVector: 'Email + Suspicious URL + QR',
  authentication: 'SPF / DKIM / DMARC failed',
  relatedInfrastructure: '1 Domain • 1 IP • 2 URLs',
  relatedCampaign: 'CAM-2026-014',
  evidenceCollected: '8 artifacts',
  risk: '92 / 100',
  breadcrumb: 'TRIGGERED',
  honeytoken: 'TRIGGERED'
};

export const mockReports = [
  {
    reportId: 'RPT-2026-00421',
    investigationId: 'INV-2026-0916-001',
    generatedAt: 'Sep 16, 2026 • 09:20 PM',
    status: 'Finalized',
    riskScore: 92,
    riskLevel: 'Critical',
    threat: 'Phishing / Impersonation',
    executiveSummary: 'MailTrace AI analyzed a suspicious email and identified multiple security indicators including possible sender impersonation, failed email authentication checks, suspicious URLs and a QR code. The investigation correlated observed indicators with threat intelligence data and preserved associated evidence for forensic review.',
    emailDetails: {
      from: 'security@paypa1-support.com',
      displayName: 'PayPal Security',
      to: 'user@gmail.com',
      subject: 'Your account requires immediate verification',
      received: 'Sep 16, 2026 • 09:14 PM',
      messageType: 'Suspicious Email'
    },
    riskAssessment: {
      score: '92 / 100',
      label: 'CRITICAL',
      factors: [
        { label: 'Sender Impersonation', value: 'High' },
        { label: 'SPF', value: 'Failed' },
        { label: 'DKIM', value: 'Failed' },
        { label: 'DMARC', value: 'Failed' },
        { label: 'Suspicious URLs', value: '2' },
        { label: 'QR Code', value: '1' },
        { label: 'Attachment', value: '1' },
        { label: 'Email DNA', value: 'Behavioral mismatch' },
        { label: 'Breadcrumb Telemetry', value: 'Triggered' },
        { label: 'Honeytoken Trigger', value: 'Triggered' },
        { label: 'Threat Intelligence Match', value: 'Confirmed signal' }
      ]
    },
    findings: [
      {
        title: 'Possible Sender Impersonation',
        severity: 'High',
        reference: 'EV-00421-02',
        explanation: 'The sender used a trusted brand identity while the actual domain differed from the expected PayPal infrastructure.'
      },
      {
        title: 'Suspicious URL Infrastructure',
        severity: 'High',
        reference: 'EV-00421-03',
        explanation: 'Observed URLs shared infrastructure patterns consistent with credential-harvesting behavior and brand impersonation.'
      },
      {
        title: 'QR / Quishing Indicator',
        severity: 'High',
        reference: 'EV-00421-04',
        explanation: 'A QR code embedded in the email was associated with a suspicious verification flow and potential redirection.'
      },
      {
        title: 'Email Authentication Failure',
        severity: 'High',
        reference: 'EV-00421-02',
        explanation: 'SPF, DKIM and DMARC checks all failed, reducing trust in the sender identity and increasing risk.'
      },
      {
        title: 'Potential Campaign Correlation',
        severity: 'Medium',
        reference: 'EV-00421-06',
        explanation: 'Threat intelligence linked the observed infrastructure to a broader suspicious campaign pattern.'
      },
      {
        title: 'Honeytoken Bait Trigger',
        severity: 'Critical',
        reference: 'HT-INV-2026-0916-001',
        explanation: 'A controlled decoy value was accessed at 14:32:18. This is an additional forensic signal, not proof of malicious intent or attacker identity.'
      },
      {
        title: 'Breadcrumb Trace Trigger',
        severity: 'High',
        reference: 'BC-INV-2026-0916-001',
        explanation: 'Controlled telemetry was recorded after suspicious link interaction and provides infrastructure context without proving exact physical location.'
      }
    ],
    threatIntelligence: {
      domain: 'secure-verification.example',
      ip: '203.0.113.42',
      urls: 2,
      campaign: 'CAM-2026-014',
      sources: ['VirusTotal', 'AbuseIPDB', 'URLhaus', 'WHOIS/RDAP'],
      demoLabel: 'DEMO INTELLIGENCE DATA'
    },
    geolocation: {
      region: 'Demo Region',
      country: 'Demo Country',
      network: 'Demo ISP',
      coordinates: 'XX.XXXX / XX.XXXX',
      note: 'Geolocation represents observed network infrastructure and is approximate. It does not identify an attacker\'s physical location.'
    },
    honeytoken: honeytokenData,
    breadcrumb: breadcrumbData,
    timeline: [
      { time: '09:14:02', event: 'Email received' },
      { time: '09:14:03', event: 'Headers parsed' },
      { time: '09:14:03', event: 'Authentication checked' },
      { time: '09:14:04', event: 'URLs extracted' },
      { time: '09:14:04', event: 'QR detected' },
      { time: '09:14:05', event: 'Sender analysis completed' },
      { time: '09:14:06', event: 'Threat intelligence enriched' },
      { time: '09:14:08', event: 'Risk assessment generated' },
      { time: '09:14:09', event: 'Evidence fingerprint created' },
      { time: '14:31:52', event: 'Breadcrumb triggered' },
      { time: '14:32:18', event: 'Honeytoken triggered' }
    ],
    evidence: [
      { id: 'EV-00421-01', name: 'Original Email', hash: '8f4c...91a2', integrity: '✓ VERIFIED' },
      { id: 'EV-00421-02', name: 'Email Headers', hash: 'a42b...fd11', integrity: '✓ VERIFIED' },
      { id: 'EV-00421-03', name: 'Suspicious URL', hash: '8f4c...91a2', integrity: '✓ VERIFIED' },
      { id: 'EV-00421-04', name: 'QR Image', hash: '41d9...f2ec', integrity: '✓ VERIFIED' },
      { id: 'EV-00421-05', name: 'Attachment', hash: '73e2...7aab', integrity: '✓ VERIFIED' },
      { id: 'EV-00421-06', name: 'Threat Intelligence', hash: '0e5c...83bf', integrity: '✓ VERIFIED' },
      { id: 'EV-00421-07', name: 'AI Analysis', hash: 'f4a8...cc21', integrity: '✓ VERIFIED' },
      { id: 'EV-00421-08', name: 'Investigation Metadata', hash: 'c829...10fe', integrity: '✓ VERIFIED' }
    ],
    integrity: {
      status: '● DEMO BLOCKCHAIN ANCHORED',
      algorithm: 'SHA-256',
      fingerprint: '8f4c92a1...91a2',
      blockReference: '0x7a4f...e821',
      timestamp: 'Sep 16, 2026 • 21:14:08 IST',
      note: 'Demo blockchain integrity — real blockchain integration is planned for the backend phase.'
    },
    aiSummary: 'Multiple signals indicate that this email warrants further investigation. The primary concerns are sender identity mismatch, authentication failures, suspicious URLs and QR-based verification content. Related infrastructure indicators were connected through the investigation graph.',
    recommendedActions: [
      'Treat the message as suspicious',
      'Avoid interacting with embedded links',
      'Review sender infrastructure',
      'Preserve investigation evidence',
      'Check related messages for campaign correlation'
    ],
    footer: {
      investigation: 'INV-2026-0916-001',
      report: 'RPT-2026-00421',
      generatedBy: 'MailTrace AI',
      prototypeNote: 'Prototype report — generated from demonstration data.'
    }
  },
  {
    reportId: 'RPT-2026-00418',
    investigationId: 'MT-2026-00418',
    generatedAt: 'Sep 15, 2026 • 09:10 PM',
    status: 'Finalized',
    riskScore: 81,
    riskLevel: 'High',
    threat: 'Suspicious Attachment',
    executiveSummary: 'The report reviewed a suspicious attachment with elevated risk indicators and a high likelihood of malicious execution. Evidence preservation and infrastructure review are recommended before any remediation actions.',
    emailDetails: {
      from: 'attachments@domain-shipper.net',
      displayName: 'Shipping Support',
      to: 'user@gmail.com',
      subject: 'Invoice check-in required',
      received: 'Sep 15, 2026 • 08:42 PM',
      messageType: 'Malware / Attachment'
    },
    riskAssessment: {
      score: '81 / 100',
      label: 'HIGH',
      factors: [
        { label: 'Attachment Type', value: 'Suspicious PDF' },
        { label: 'Delivery Context', value: 'High urgency' },
        { label: 'URL Follow-up', value: '1' },
        { label: 'Execution Risk', value: 'High' },
        { label: 'Email DNA', value: 'Behavioral mismatch' }
      ]
    },
    findings: [
      {
        title: 'Potential Malicious Attachment',
        severity: 'High',
        reference: 'EV-00418-05',
        explanation: 'The attachment exhibited executable-like behavior and was linked to a staged credential theft process.'
      },
      {
        title: 'Urgency-Based Social Engineering',
        severity: 'Medium',
        reference: 'EV-00418-02',
        explanation: 'The email used a pressure tactic to encourage immediate interaction without scrutiny.'
      },
      {
        title: 'Suspicious Follow-up URL',
        severity: 'High',
        reference: 'EV-00418-03',
        explanation: 'A secondary link was associated with an untrusted content-hosting page and likely credential harvesting.'
      }
    ],
    threatIntelligence: {
      domain: 'domain-shipper.net',
      ip: '198.51.100.24',
      urls: 1,
      campaign: 'CAM-2026-011',
      sources: ['VirusTotal', 'URLhaus', 'AbuseIPDB'],
      demoLabel: 'DEMO INTELLIGENCE DATA'
    },
    geolocation: {
      region: 'Demo Region',
      country: 'Demo Country',
      network: 'Demo ISP',
      coordinates: 'XX.XXXX / XX.XXXX',
      note: 'Geolocation represents observed network infrastructure and is approximate. It does not identify an attacker\'s physical location.'
    },
    timeline: [
      { time: '20:42:00', event: 'Email received' },
      { time: '20:42:04', event: 'Attachment extracted' },
      { time: '20:42:09', event: 'URL reviewed' },
      { time: '20:42:12', event: 'Risk scored' }
    ],
    evidence: [
      { id: 'EV-00418-01', name: 'Original Email', hash: 'c1a2...19fd', integrity: '✓ VERIFIED' },
      { id: 'EV-00418-02', name: 'Message Headers', hash: 'd1ea...77fe', integrity: '✓ VERIFIED' },
      { id: 'EV-00418-03', name: 'Suspicious URL', hash: '94af...0cc4', integrity: '✓ VERIFIED' },
      { id: 'EV-00418-05', name: 'Attachment', hash: '1a7d...8e2b', integrity: '✓ VERIFIED' }
    ],
    integrity: {
      status: '● DEMO BLOCKCHAIN ANCHORED',
      algorithm: 'SHA-256',
      fingerprint: 'c1a293c9...19fd',
      blockReference: '0x7ac9...4de1',
      timestamp: 'Sep 15, 2026 • 20:42:12 IST',
      note: 'Demo blockchain integrity — real blockchain integration is planned for the backend phase.'
    },
    aiSummary: 'The suspicious attachment and follow-up link indicate a likely phishing workflow that aims to lure the user into a credential submission process.',
    recommendedActions: [
      'Treat the message as suspicious',
      'Avoid opening the attachment',
      'Review related sender infrastructure',
      'Preserve evidence for follow-up' 
    ],
    footer: {
      investigation: 'MT-2026-00418',
      report: 'RPT-2026-00418',
      generatedBy: 'MailTrace AI',
      prototypeNote: 'Prototype report — generated from demonstration data.'
    }
  },
  {
    reportId: 'RPT-2026-00412',
    investigationId: 'MT-2026-00412',
    generatedAt: 'Sep 14, 2026 • 08:30 PM',
    status: 'Draft',
    riskScore: 76,
    riskLevel: 'High',
    threat: 'QR / Quishing',
    executiveSummary: 'The report captured a suspicious QR-based lure and connected it to broader campaign reuse. Additional evidence collection is recommended before the case is finalized.',
    emailDetails: {
      from: 'gift-card@instant-offers.net',
      displayName: 'Promotions Team',
      to: 'user@gmail.com',
      subject: 'Exclusive offer valid today only',
      received: 'Sep 14, 2026 • 08:20 PM',
      messageType: 'Quishing / Redirect'
    },
    riskAssessment: {
      score: '76 / 100',
      label: 'HIGH',
      factors: [
        { label: 'QR Code', value: '1' },
        { label: 'Sender Mismatch', value: 'Moderate' },
        { label: 'Redirect Chain', value: 'Observed' },
        { label: 'Brand Similarity', value: 'High' },
        { label: 'Email DNA', value: 'Behavioral drift' }
      ]
    },
    findings: [
      {
        title: 'Possible Quishing Redirect',
        severity: 'High',
        reference: 'EV-00412-04',
        explanation: 'The embedded QR code initiated a redirect path tied to a suspicious verification host.'
      },
      {
        title: 'Potential Brand Impersonation',
        severity: 'Medium',
        reference: 'EV-00412-02',
        explanation: 'The sender identity used a retail-brand style while the domain remained untrusted.'
      }
    ],
    threatIntelligence: {
      domain: 'instant-offers.net',
      ip: '198.51.100.64',
      urls: 1,
      campaign: 'CAM-2026-008',
      sources: ['URLhaus', 'VirusTotal'],
      demoLabel: 'DEMO INTELLIGENCE DATA'
    },
    geolocation: {
      region: 'Demo Region',
      country: 'Demo Country',
      network: 'Demo ISP',
      coordinates: 'XX.XXXX / XX.XXXX',
      note: 'Geolocation represents observed network infrastructure and is approximate. It does not identify an attacker\'s physical location.'
    },
    timeline: [
      { time: '20:20:00', event: 'Email received' },
      { time: '20:20:02', event: 'QR captured' },
      { time: '20:20:03', event: 'Redirect path checked' },
      { time: '20:20:05', event: 'Case drafted' }
    ],
    evidence: [
      { id: 'EV-00412-01', name: 'Original Email', hash: 'f821...7d6a', integrity: '✓ VERIFIED' },
      { id: 'EV-00412-02', name: 'Email Headers', hash: 'b33a...9ce0', integrity: '✓ VERIFIED' },
      { id: 'EV-00412-04', name: 'QR Image', hash: '3c05...d5e1', integrity: '✓ VERIFIED' }
    ],
    integrity: {
      status: '● DEMO BLOCKCHAIN ANCHORED',
      algorithm: 'SHA-256',
      fingerprint: 'f8217d6a...d3aa',
      blockReference: '0x7d9e...1a82',
      timestamp: 'Sep 14, 2026 • 20:20:05 IST',
      note: 'Demo blockchain integrity — real blockchain integration is planned for the backend phase.'
    },
    aiSummary: 'The message used a QR-based lure with moderate brand resemblance, suggesting a probable phishing workflow that may redirect to a credential harvesting endpoint.',
    recommendedActions: [
      'Treat the message as suspicious',
      'Review any related QR content',
      'Preserve evidence pending finalization',
      'Monitor for campaign reuse' 
    ],
    footer: {
      investigation: 'MT-2026-00412',
      report: 'RPT-2026-00412',
      generatedBy: 'MailTrace AI',
      prototypeNote: 'Prototype report — generated from demonstration data.'
    }
  }
];

export const reportIndexRows = mockReports.map((report) => ({
  reportId: report.reportId,
  investigationId: report.investigationId,
  threat: report.threat,
  risk: `${report.riskScore} / 100`,
  created: report.generatedAt,
  status: report.status,
  riskLevel: report.riskLevel.toLowerCase(),
  severity: report.riskLevel
}));

export const mockCopilotResponses = [
  {
    question: 'why was this email flagged?',
    keywords: ['why', 'flagged', 'risk', 'suspicious'],
    response: `This email was flagged because multiple suspicious indicators were identified.

1. Sender impersonation
The display name suggests PayPal, while the actual sender domain is different.

2. Email authentication
SPF, DKIM and DMARC checks failed.

3. Suspicious URLs
Two suspicious URLs were extracted from the message.

4. QR code
A QR code was detected in the email content.

5. Behavioral signals
The sender behavior does not closely match the available baseline.

These combined signals contributed to the current risk assessment of 92/100.`,
    relatedIndicators: ['secure-verification.example'],
    relatedEvidence: ['EV-00421-03'],
    suggestedActions: ['Investigate Indicator', 'View Timeline', 'View Evidence', 'Generate Report'],
    tags: ['Email Headers', 'Threat Intelligence', 'Email DNA', 'Timeline', 'Evidence']
  },
  {
    question: 'why is the sender suspicious?',
    keywords: ['sender', 'suspicious', 'impersonating', 'brand'],
    response: 'The display name resembles a trusted brand, but the actual sender domain differs. SPF, DKIM and DMARC also failed, increasing the likelihood of sender impersonation.',
    relatedIndicators: ['secure-verification.example'],
    relatedEvidence: ['EV-00421-02'],
    suggestedActions: ['Investigate Indicator', 'View Timeline', 'View Evidence'],
    tags: ['Email Headers', 'Threat Intelligence', 'Email DNA']
  },
  {
    question: 'which indicator is the most suspicious?',
    keywords: ['indicator', 'domain', 'most suspicious', 'suspicious'],
    response: 'The domain secure-verification.example is currently the highest-risk indicator in this demo investigation because it is associated with the suspicious URL and sender identity mismatch.',
    relatedIndicators: ['secure-verification.example'],
    relatedEvidence: ['EV-00421-06'],
    suggestedActions: ['Investigate Indicator', 'View Timeline', 'View Evidence'],
    tags: ['Threat Intelligence', 'Evidence', 'Timeline']
  },
  {
    question: 'summarize the investigation.',
    keywords: ['summarize', 'investigation', 'summary'],
    response: 'MailTrace AI analyzed one suspicious email and identified multiple indicators including authentication failures, possible sender impersonation, suspicious URLs and a QR code. Threat intelligence enrichment connected the observed domain and IP to a potentially related campaign. Eight evidence artifacts were preserved for investigation.',
    relatedIndicators: ['secure-verification.example', '203.0.113.42'],
    relatedEvidence: ['EV-00421-01', 'EV-00421-08'],
    suggestedActions: ['View Timeline', 'View Evidence', 'Generate Report'],
    tags: ['Threat Intelligence', 'Timeline', 'Evidence']
  },
  {
    question: 'what happened first?',
    keywords: ['timeline', 'first', 'happened', 'what happened'],
    response: 'The email was received at 09:14:02 PM. MailTrace then parsed the headers, checked authentication, extracted URLs and QR content, performed sender analysis and generated the risk assessment.',
    relatedIndicators: ['secure-verification.example'],
    relatedEvidence: ['EV-00421-02'],
    suggestedActions: ['View Timeline', 'Investigate Indicator', 'View Evidence'],
    tags: ['Timeline', 'Email Headers', 'Evidence']
  },
  {
    question: 'explain the risk score.',
    keywords: ['risk score', 'score', 'explain risk'],
    response: 'The current demo score of 92/100 reflects multiple contributing signals including authentication failures, sender identity mismatch, suspicious URLs, QR detection and behavioral indicators.',
    relatedIndicators: ['secure-verification.example'],
    relatedEvidence: ['EV-00421-03'],
    suggestedActions: ['Investigate Indicator', 'View Evidence', 'Generate Report'],
    tags: ['Threat Intelligence', 'Timeline', 'Evidence']
  },
  {
    question: 'evidence',
    keywords: ['evidence', 'collected', 'artifact'],
    response: 'Eight evidence artifacts were collected and preserved for this investigation, including the original email, headers, suspicious URL, QR image, attachment, intelligence record and final investigation summary. The findings support the phishing and impersonation assessment.',
    relatedIndicators: ['secure-verification.example', 'CAM-2026-014'],
    relatedEvidence: ['EV-00421-01', 'EV-00421-08'],
    suggestedActions: ['View Evidence', 'Generate Report', 'View Timeline'],
    tags: ['Evidence', 'Threat Intelligence', 'Timeline']
  },
  {
    question: 'campaign',
    keywords: ['campaign', 'correlate', 'related campaign'],
    response: 'The observed domain and infrastructure are associated with campaign CAM-2026-014. Multiple suspicious email artifacts share the same infrastructure patterns and appear to be connected through similar sender and destination behavior.',
    relatedIndicators: ['CAM-2026-014', 'secure-verification.example'],
    relatedEvidence: ['EV-00421-06', 'EV-00421-07'],
    suggestedActions: ['Investigate Indicator', 'View Timeline', 'Generate Report'],
    tags: ['Threat Intelligence', 'Timeline', 'Evidence']
  },
  {
    question: 'what happened with the breadcrumb?',
    keywords: ['breadcrumb', 'telemetry', 'honeytoken', 'decoy'],
    response: 'The breadcrumb was triggered at 14:31:52 after interaction with the suspicious email link. The captured demo telemetry includes IP 203.0.113.42 and a Chrome/Windows user agent. This provides infrastructure context for the investigation; it does not establish the attacker\'s exact physical location. The related honeytoken was triggered at 14:32:18 when the controlled decoy value was accessed.',
    relatedIndicators: ['203.0.113.42', 'BC-INV-2026-0916-001', 'HT-INV-2026-0916-001'],
    relatedEvidence: ['BC-INV-2026-0916-001', 'HT-INV-2026-0916-001'],
    suggestedActions: ['View Timeline', 'View Threat Graph', 'View Evidence', 'Generate Report'],
    tags: ['Breadcrumb Trace', 'Honeytoken', 'Timeline', 'Threat Graph']
  },
  {
    question: 'default',
    keywords: [],
    response: 'I can currently answer questions about this investigation\'s risk, indicators, evidence, timeline, campaign correlation, Breadcrumb telemetry and Honeytoken events. This is a frontend simulation only.',
    relatedIndicators: ['secure-verification.example'],
    relatedEvidence: ['EV-00421-03'],
    suggestedActions: ['Investigate Indicator', 'View Timeline', 'View Evidence'],
    tags: ['Threat Intelligence', 'Timeline', 'Evidence']
  }
];

export const investigationData = {
  investigationId: 'INV-2026-0916-001',
  sender: 'security-alert@paypa1-support.com',
  displayName: 'PayPal Security',
  recipient: 'user@gmail.com',
  subject: 'Urgent Account Verification Required',
  timestamp: 'Sep 16, 2026 • 9:14 PM',
  riskScore: 92,
  riskLevel: 'CRITICAL',
  confidence: 94,
  spf: 'FAILED',
  dkim: 'FAILED',
  dmarc: 'FAILED',
  urls: [
    {
      value: 'hxxps://secure-paypal-verification.example',
      status: 'SUSPICIOUS',
      reason: 'Domain does not match expected sender infrastructure.'
    },
    {
      value: 'hxxps://account-check.example/login',
      status: 'SUSPICIOUS',
      reason: 'Credential harvesting pattern detected in the redirect flow.'
    }
  ],
  qrCodes: 1,
  qrUrl: 'suspicious-verification.example',
  attachment: {
    name: 'invoice_2026.pdf',
    size: '428 KB',
    type: 'PDF',
    hash: 'a84f...91d2',
    analysis: 'Pending sandbox inspection'
  },
  impersonation: {
    expectedBrand: 'PayPal',
    domainSimilarity: 'High',
    authentication: ['SPF ✕', 'DKIM ✕', 'DMARC ✕'],
    finalStatus: 'POSSIBLE IMPERSONATION'
  },
  emailDNA: {
    senderBehavior: 'UNKNOWN',
    writingStyle: 'High similarity',
    sendingPattern: 'Unusual',
    recipientPattern: 'New recipient',
    infrastructurePattern: 'Suspicious',
    dnaMatch: '32%',
    status: 'BEHAVIORAL MISMATCH'
  },
  aiExplanation: 'MailTrace AI identified multiple indicators associated with a potentially deceptive email. The sender domain shows characteristics of impersonation, email authentication checks failed, and the message contains suspicious links and a QR code requesting account verification.',
  recommendedActions: [
    'Do not open the embedded links',
    'Do not submit credentials',
    'Inspect sender infrastructure',
    'Review related indicators',
    'Preserve evidence for investigation'
  ],
  threatBreakdown: [
    { label: 'Email Authentication', risk: 'High Risk', explanation: 'SPF, DKIM, and DMARC checks all failed.', icon: '◉' },
    { label: 'Sender Identity', risk: 'High Risk', explanation: 'Trusted brand name used in deceptive infrastructure.', icon: '◌' },
    { label: 'URL Analysis', risk: 'Critical', explanation: 'Credential harvesting behavior detected across multiple links.', icon: '⬢' },
    { label: 'QR Analysis', risk: 'High Risk', explanation: 'Embedded QR code redirects to a verification endpoint.', icon: '◍' },
    { label: 'Content Analysis', risk: 'Medium Risk', explanation: 'Urgent verification language increased click-through risk.', icon: '△' },
    { label: 'Attachment Analysis', risk: 'Medium Risk', explanation: 'Suspicious document included alongside impersonation context.', icon: '▣' },
    { label: 'Email DNA', risk: 'Suspicious', explanation: 'Behavioral mismatch and abnormal sending pattern observed.', icon: '◈' }
  ]
};

export const mockData = {
  user,
  connectedGmail,
  emails: gmailMessages,
  investigations: mockInvestigationHistory,
  indicators: threatIntelligenceData.relatedIndicators,
  threatIntelligence: threatIntelligenceData,
  emailDNA: investigationData.emailDNA,
  timeline: timelineEvents,
  evidence: evidenceItems,
  honeytoken: honeytokenData,
  breadcrumb: breadcrumbData,
  reports: mockReports,
  notifications: mockNotifications
};
