// ═══════════════════════════════════════════════════════════════════
//  STORE — In-memory state + JSON file persistence
//  Keeps last 24h of check history per target (rolling window)
// ═══════════════════════════════════════════════════════════════════
const fs   = require('fs');
const path = require('path');

const DATA_DIR  = process.env.DATA_DIR || '/data';
const HIST_FILE = path.join(DATA_DIR, 'history.json');
const CONF_FILE = path.join(DATA_DIR, 'config.json');
const MAX_HIST  = 288; // 24h at 5-min intervals

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// ── In-memory state ─────────────────────────────────────────────
const state = {
  // Current status of every target — updated on each check
  current: new Map(),       // id → CheckResult
  // Rolling history per target
  history: new Map(),       // id → CheckResult[]  (max MAX_HIST entries)
  // Active alerts
  alerts:  [],              // { id, targetId, type, message, firedAt, resolvedAt }
  // System config (check interval, thresholds)
  config: {
    checkIntervalSec: 60,
    pingTimeoutMs:    3000,
    httpTimeoutMs:    8000,
    alertOnDownSec:   120,  // alert after X seconds of DOWN
  }
};

// ── Load persisted data ─────────────────────────────────────────
function load() {
  try {
    if (fs.existsSync(HIST_FILE)) {
      const raw = JSON.parse(fs.readFileSync(HIST_FILE, 'utf8'));
      for (const [id, arr] of Object.entries(raw)) {
        state.history.set(id, arr.slice(-MAX_HIST));
        if (arr.length > 0) state.current.set(id, arr[arr.length - 1]);
      }
      console.log('[Store] Loaded history for', state.history.size, 'targets');
    }
    if (fs.existsSync(CONF_FILE)) {
      Object.assign(state.config, JSON.parse(fs.readFileSync(CONF_FILE, 'utf8')));
    }
  } catch (e) {
    console.warn('[Store] Could not load persisted data:', e.message);
  }
}

// ── Persist to disk (debounced) ─────────────────────────────────
let saveTimer = null;
function scheduleSave() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    try {
      const obj = {};
      for (const [id, arr] of state.history) obj[id] = arr;
      fs.writeFileSync(HIST_FILE, JSON.stringify(obj));
    } catch (e) {
      console.warn('[Store] Save failed:', e.message);
    }
  }, 5000);
}

// ── Update state after a check ──────────────────────────────────
function update(result) {
  const prev = state.current.get(result.id);
  state.current.set(result.id, result);

  // Append to history
  const hist = state.history.get(result.id) || [];
  hist.push({
    ts:      result.checkedAt,
    status:  result.status,
    alive:   result._summary.alive,
    latency: result._summary.latency,
    portsUp: result._summary.portsUp,
    portsTotal: result._summary.portsTotal,
    httpOk:  result._summary.httpOk,
    httpMs:  result._summary.httpMs,
    httpStatus: result._summary.httpStatus,
  });
  if (hist.length > MAX_HIST) hist.shift();
  state.history.set(result.id, hist);

  // Auto-alert on status changes
  handleAlerts(result, prev);

  scheduleSave();
  return result;
}

// ── Alert management ─────────────────────────────────────────────
function handleAlerts(curr, prev) {
  const id       = curr.id;
  const wasUp    = prev ? (prev.status === 'UP') : true;
  const isDown   = curr.status === 'DOWN';
  const isUp     = curr.status === 'UP';

  // New DOWN alert
  if (isDown && (wasUp || !prev)) {
    const existing = state.alerts.find(a => a.targetId === id && !a.resolvedAt);
    if (!existing) {
      state.alerts.unshift({
        alertId:   `ALT-${Date.now()}`,
        targetId:  id,
        hostname:  curr.hostname,
        ip:        curr.ip,
        type:      'HOST_DOWN',
        severity:  'critical',
        message:   `${curr.hostname} (${curr.ip}) no responde a ping`,
        firedAt:   curr.checkedAt,
        resolvedAt: null,
      });
    }
  }

  // HTTP error alert
  if (curr.http && !curr.http.ok && curr.status !== 'DOWN') {
    const key = `HTTP_${id}`;
    const existing = state.alerts.find(a => a.alertId === key && !a.resolvedAt);
    if (!existing) {
      state.alerts.unshift({
        alertId:   key,
        targetId:  id,
        hostname:  curr.hostname,
        ip:        curr.ip,
        type:      'HTTP_ERROR',
        severity:  'warning',
        message:   `${curr.hostname} HTTP ${curr.http.status || 'sin respuesta'} — ${curr.http.url}`,
        firedAt:   curr.checkedAt,
        resolvedAt: null,
      });
    }
  }

  // Auto-resolve when back UP
  if (isUp) {
    state.alerts.forEach(a => {
      if (a.targetId === id && !a.resolvedAt) {
        a.resolvedAt = curr.checkedAt;
      }
    });
    // HTTP resolve
    const httpAlert = state.alerts.find(a => a.alertId === `HTTP_${id}` && !a.resolvedAt);
    if (httpAlert && curr.http && curr.http.ok) httpAlert.resolvedAt = curr.checkedAt;
  }

  // Keep only last 500 alerts
  if (state.alerts.length > 500) state.alerts.splice(500);
}

// ── Getters ──────────────────────────────────────────────────────
function getAllCurrent()      { return Array.from(state.current.values()); }
function getHistory(id, n)   { return (state.history.get(id) || []).slice(-(n || 60)); }
function getActiveAlerts()   { return state.alerts.filter(a => !a.resolvedAt); }
function getAllAlerts(limit)  { return state.alerts.slice(0, limit || 200); }
function getConfig()         { return state.config; }
function setConfig(patch)    {
  Object.assign(state.config, patch);
  try { fs.writeFileSync(CONF_FILE, JSON.stringify(state.config, null, 2)); } catch {}
}

module.exports = { load, update, getAllCurrent, getHistory, getActiveAlerts, getAllAlerts, getConfig, setConfig, state };
