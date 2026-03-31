// ═══════════════════════════════════════════════════════════════════
//  CHECKER — Pure Node.js network checks
//  NO system dependencies (no ping binary, no iputils, no root)
//  Works in any Docker container on any OS
//
//  "Ping" strategy: TCP connect to the first available port.
//  If TCP connects → host is reachable. Latency = TCP handshake time.
//  This is how many professional monitors work (CloudFlare, UptimeRobot).
// ═══════════════════════════════════════════════════════════════════
const net   = require('net');
const https = require('https');
const axios = require('axios');

// ── TCP CONNECT CHECK ────────────────────────────────────────────
// Returns { open, latency } for a single port
function tcpCheck(ip, port, timeoutMs = 3000) {
  return new Promise(resolve => {
    const start  = Date.now();
    const socket = new net.Socket();
    let settled  = false;

    const done = (open) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve({ port, open, latency: Date.now() - start });
    };

    socket.setTimeout(timeoutMs);
    socket.connect(port, ip, () => done(true));
    socket.on('error',   () => done(false));
    socket.on('timeout', () => done(false));
  });
}

// ── HOST REACHABILITY (replaces ICMP ping) ───────────────────────
// Tries ports in priority order — first open one = host alive
// Returns { alive, latency, method }
async function hostCheck(ip, ports, timeoutMs = 3000) {
  // Try all ports in parallel, take the fastest success
  const results = await Promise.all(
    ports.map(p => tcpCheck(ip, p, timeoutMs))
  );

  const first = results.find(r => r.open);
  if (first) {
    return { alive: true, latency: first.latency, method: `tcp:${first.port}` };
  }

  // All ports closed — try the first port with a longer timeout as last resort
  const slow = await tcpCheck(ip, ports[0], timeoutMs * 2);
  return slow.open
    ? { alive: true,  latency: slow.latency, method: `tcp:${slow.port}` }
    : { alive: false, latency: null, method: 'all_closed' };
}

// ── HTTP / HTTPS CHECK ───────────────────────────────────────────
async function httpCheck(url, timeoutMs = 8000) {
  const start = Date.now();
  try {
    const res = await axios.get(url, {
      timeout: timeoutMs,
      maxRedirects: 3,
      validateStatus: () => true,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      headers: { 'User-Agent': 'PNC-Monitor/1.0' }
    });
    return {
      ok:      res.status >= 100 && res.status < 500,
      status:  res.status,
      latency: Date.now() - start,
      url
    };
  } catch (e) {
    return {
      ok:      false,
      status:  0,
      latency: Date.now() - start,
      url,
      error:   e.code || e.message
    };
  }
}

// ── FULL CHECK FOR ONE TARGET ────────────────────────────────────
async function checkTarget(target) {
  const ts    = new Date().toISOString();
  const ports = target.checks.ports || [];

  // Determine probe ports for host-alive check
  // Prefer SSH(22), then HTTP(80), then HTTPS(443), then first available
  const probePorts = [22, 80, 443, ...ports]
    .filter((v, i, a) => a.indexOf(v) === i)  // deduplicate
    .slice(0, 4);                              // max 4 probes

  // 1. Host alive check (parallel TCP probes)
  const host = await hostCheck(target.ip, probePorts, 3000);

  // 2. Individual port checks (parallel)
  const portResults = await Promise.all(
    ports.map(p => tcpCheck(target.ip, p, 3000))
  );

  // 3. HTTP check (if configured)
  let httpResult = null;
  if (target.checks.http && host.alive) {
    httpResult = await httpCheck(target.checks.http, 8000);
  }

  // ── Determine overall status ───────────────────────────────────
  const criticalPorts = [22, 80, 443, 3306, 5432, 1521, 389, 8080];
  const critDown = portResults.filter(p =>
    criticalPorts.includes(p.port) && !p.open
  );

  let status = 'UP';
  if (!host.alive)                      status = 'DOWN';
  else if (critDown.length > 0)         status = 'DEGRADED';
  else if (portResults.some(p => !p.open)) status = 'PARTIAL';
  if (httpResult && !httpResult.ok && status === 'UP') status = 'HTTP_ERROR';

  return {
    id:         target.id,
    hostname:   target.hostname,
    ip:         target.ip,
    department: target.department,
    type:       target.type,
    apps:       target.apps,
    authorizedUsers: target.authorizedUsers,
    checkedAt:  ts,
    status,
    ping: { alive: host.alive, latency: host.latency, method: host.method },
    ports: portResults,
    http:  httpResult,
    _summary: {
      alive:      host.alive,
      latency:    host.latency,
      portsUp:    portResults.filter(p => p.open).length,
      portsTotal: portResults.length,
      httpOk:     httpResult?.ok    ?? null,
      httpMs:     httpResult?.latency ?? null,
      httpStatus: httpResult?.status  ?? null,
    }
  };
}

module.exports = { tcpCheck, hostCheck, httpCheck, checkTarget };
