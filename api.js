/**
 * MailTraceAI API client.
 * Talks to the local FastAPI backend and fails closed to demo data.
 */
export const API_BASE = typeof window !== 'undefined' && window.location.port === '8000' ? '' : 'http://127.0.0.1:8000';
const REQUEST_TIMEOUT_MS = 4000;
const safeTimeout = typeof window !== 'undefined' ? window.setTimeout.bind(window) : setTimeout;
const safeClearTimeout = typeof window !== 'undefined' ? window.clearTimeout.bind(window) : clearTimeout;

async function requestJson(path, options = {}) {
  const controller = new AbortController();
  const timer = safeTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      throw new Error(`API ${response.status}`);
    }

    return await response.json();
  } finally {
    safeClearTimeout(timer);
  }
}

export async function checkHealth() {
  try {
    const data = await requestJson('/api/health');
    return data?.status === 'ok';
  } catch (error) {
    return false;
  }
}

export async function analyzeEmail(payload) {
  return requestJson('/api/analyze-email', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function getInvestigations() {
  return requestJson('/api/investigations');
}

export async function getInvestigation(id) {
  return requestJson(`/api/investigations/${encodeURIComponent(id)}`);
}

export async function getDashboard() {
  return requestJson('/api/dashboard');
}

export async function getThreatIntelligence(indicator) {
  return requestJson(`/api/threat-intelligence/${encodeURIComponent(indicator)}`);
}

export async function queryCopilot(question, investigationId) {
  return requestJson('/api/ai/query', {
    method: 'POST',
    body: JSON.stringify({
      question,
      investigation_id: investigationId
    })
  });
}

export async function getReport(id) {
  return requestJson(`/api/report/${encodeURIComponent(id)}`);
}
