// ═══════════════════════════════════════════════════════════════════
//  PNC MONITOR — Express + WebSocket backend
//  Real checks: ping, TCP, HTTP against all ACCESOS.xlsx targets
// ═══════════════════════════════════════════════════════════════════
require('dotenv').config();
const express = require('express');
const http    = require('http');
const { WebSocketServer } = require('ws');
const cors    = require('cors');
const cron    = require('node-cron');

const TARGETS = require('./targets');
const { checkTarget } = require('./checker');
const store   = require('./store');

const PORT     = process.env.PORT || 3001;
const INTERVAL = parseInt(process.env.CHECK_INTERVAL_SEC || '60');

// ── Express setup ────────────────────────────────────────────────
const app    = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// ── WebSocket ────────────────────────────────────────────────────
const wss = new WebSocketServer({ server });
const clients = new Set();

wss.on('connection', ws => {
  clients.add(ws);
  // Send current state immediately on connect
  ws.send(JSON.stringify({ type: 'FULL_STATE', data: buildState() }));
  ws.on('close', () => clients.delete(ws));
  ws.on('error', () => clients.delete(ws));
});

function broadcast(type, data) {
  const msg = JSON.stringify({ type, data });
  for (const ws of clients) {
    if (ws.readyState === 1) ws.send(msg);
  }
}

function buildState() {
  return {
    targets:      TARGETS.map(t => ({ id: t.id, hostname: t.hostname, ip: t.ip,
                    department: t.department, type: t.type,
                    apps: t.apps, authorizedUsers: t.authorizedUsers,
                    checks: t.checks })),
    current:      store.getAllCurrent(),
    alerts:       store.getAllAlerts(100),
    config:       store.getConfig(),
    serverTime:   new Date().toISOString(),
  };
}

// ── REST API ─────────────────────────────────────────────────────

// Health
app.get('/api/health', (_, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// All current check results
app.get('/api/status', (_, res) => res.json({
  summary: buildSummary(),
  targets: store.getAllCurrent(),
  serverTime: new Date().toISOString()
}));

// Single target detail
app.get('/api/status/:id', (req, res) => {
  const curr = store.getAllCurrent().find(c => c.id === req.params.id);
  if (!curr) return res.status(404).json({ error: 'Not found' });
  res.json(curr);
});

// History for a target
app.get('/api/history/:id', (req, res) => {
  const n = parseInt(req.query.n || '60');
  res.json({ id: req.params.id, history: store.getHistory(req.params.id, n) });
});

// Active alerts
app.get('/api/alerts', (_, res) => res.json({
  active:  store.getActiveAlerts(),
  all:     store.getAllAlerts(200)
}));

// Acknowledge alert (mark as seen in UI — doesn't resolve it)
app.post('/api/alerts/:alertId/ack', (req, res) => {
  const a = store.state.alerts.find(x => x.alertId === req.params.alertId);
  if (!a) return res.status(404).json({ error: 'Not found' });
  a.ackedAt = new Date().toISOString();
  a.ackedBy = req.body.user || 'SGTIC';
  broadcast('ALERT_UPDATE', store.getAllAlerts(100));
  res.json({ ok: true });
});

// Force immediate check of one or all targets
app.post('/api/check/:id?', async (req, res) => {
  const id = req.params.id;
  const toCheck = id ? TARGETS.filter(t => t.id === id) : TARGETS;
  if (toCheck.length === 0) return res.status(404).json({ error: 'Target not found' });
  res.json({ ok: true, queued: toCheck.map(t => t.id) });
  // Run async
  for (const t of toCheck) {
    const result = await checkTarget(t);
    store.update(result);
    broadcast('TARGET_UPDATE', result);
    broadcast('ALERT_UPDATE', store.getAllAlerts(100));
  }
});

// Config
app.get('/api/config',  (_, res) => res.json(store.getConfig()));
app.patch('/api/config', (req, res) => {
  store.setConfig(req.body);
  res.json(store.getConfig());
  broadcast('CONFIG_UPDATE', store.getConfig());
});

// Stats endpoint (dashboard summary)
app.get('/api/stats', (_, res) => res.json(buildSummary()));

function buildSummary() {
  const all = store.getAllCurrent();
  const up       = all.filter(c => c.status === 'UP').length;
  const down     = all.filter(c => c.status === 'DOWN').length;
  const degraded = all.filter(c => ['DEGRADED','PARTIAL','HTTP_ERROR'].includes(c.status)).length;
  const unknown  = TARGETS.length - all.length;
  const avgLatency = all.filter(c => c.ping?.latency != null)
    .reduce((s, c, _, a) => s + c.ping.latency / a.length, 0);
  return {
    total: TARGETS.length,
    up, down, degraded, unknown,
    avgLatencyMs: Math.round(avgLatency),
    activeAlerts: store.getActiveAlerts().length,
    lastCheck: all.length ? all[0].checkedAt : null,
  };
}

// ── CHECK ENGINE ─────────────────────────────────────────────────
let checkIndex = 0;   // stagger checks to avoid thundering herd
let isRunning  = false;

async function runChecks() {
  if (isRunning) return;
  isRunning = true;
  console.log(`[Monitor] Starting check cycle — ${TARGETS.length} targets`);

  // Run in parallel batches of 8 to avoid flooding the network
  const BATCH = 8;
  for (let i = 0; i < TARGETS.length; i += BATCH) {
    const batch = TARGETS.slice(i, i + BATCH);
    const results = await Promise.all(batch.map(t => checkTarget(t)));
    for (const result of results) {
      store.update(result);
      broadcast('TARGET_UPDATE', result);
    }
    broadcast('ALERT_UPDATE', store.getAllAlerts(100));
    broadcast('STATS_UPDATE', buildSummary());
  }

  isRunning = false;
  console.log(`[Monitor] Check cycle complete`);
}

// ── STARTUP ──────────────────────────────────────────────────────
store.load();

// Run first check immediately, then on schedule
setTimeout(runChecks, 2000);

// Schedule: every N seconds using setInterval
setInterval(runChecks, INTERVAL * 1000);

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║  PNC MONITOR BACKEND — v1.0                   ║
║  Puerto: ${PORT}                                ║
║  Targets: ${TARGETS.length} servidores                      ║
║  Intervalo de check: ${INTERVAL}s                    ║
║  REST: http://localhost:${PORT}/api/status       ║
║  WS:   ws://localhost:${PORT}                    ║
╚═══════════════════════════════════════════════╝
  `);
});
