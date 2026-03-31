// ═══════════════════════════════════════════════════════════════════
//  MONITOR SERVICE — Connects to real backend via WebSocket + REST
//  Receives live check results from the Node.js checker engine
// ═══════════════════════════════════════════════════════════════════
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface CheckResult {
  id: string;
  hostname: string;
  ip: string;
  department: string;
  type: string;
  apps: string[];
  authorizedUsers: string[];
  checkedAt: string;
  status: 'UP' | 'DOWN' | 'DEGRADED' | 'PARTIAL' | 'HTTP_ERROR' | 'UNKNOWN';
  ping: { alive: boolean; latency: number | null };
  ports: { port: number; open: boolean; latency: number }[];
  http: { ok: boolean; status: number; latency: number; url: string } | null;
  _summary: {
    alive: boolean; latency: number | null;
    portsUp: number; portsTotal: number;
    httpOk: boolean | null; httpMs: number | null; httpStatus: number | null;
  };
}

export interface MonitorAlert {
  alertId: string;
  targetId: string;
  hostname: string;
  ip: string;
  type: 'HOST_DOWN' | 'HTTP_ERROR' | 'PORT_DOWN';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  firedAt: string;
  resolvedAt: string | null;
  ackedAt?: string;
  ackedBy?: string;
}

export interface MonitorStats {
  total: number; up: number; down: number;
  degraded: number; unknown: number;
  avgLatencyMs: number; activeAlerts: number;
  lastCheck: string | null;
}

export interface HistoryPoint {
  ts: string; status: string;
  alive: boolean; latency: number | null;
  portsUp: number; portsTotal: number;
  httpOk: boolean | null; httpMs: number | null; httpStatus: number | null;
}

@Injectable({ providedIn: 'root' })
export class MonitorService {
  private ws: WebSocket | null = null;
  private reconnectTimer: any;

  // Streams
  results$   = new BehaviorSubject<CheckResult[]>([]);
  alerts$    = new BehaviorSubject<MonitorAlert[]>([]);
  stats$     = new BehaviorSubject<MonitorStats | null>(null);
  connected$ = new BehaviorSubject<boolean>(false);
  lastUpdate$ = new BehaviorSubject<string | null>(null);

  // Backend URL — override with env or use same host on port 3001
  private get apiBase() {
    // Uses nginx proxy — same origin, no CORS
    return (window as any).__BACKEND_URL__ || '';
  }
  private get wsUrl() {
    const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
    return (window as any).__WS_URL__ || `${proto}//${location.host}/ws`;
  }

  connect() {
    this.disconnect();
    try {
      this.ws = new WebSocket(this.wsUrl);

      this.ws.onopen = () => {
        this.connected$.next(true);
        console.log('[Monitor] WebSocket connected');
      };

      this.ws.onmessage = (evt) => {
        try {
          const msg = JSON.parse(evt.data);
          this.handleMessage(msg);
        } catch {}
      };

      this.ws.onclose = () => {
        this.connected$.next(false);
        this.scheduleReconnect();
      };

      this.ws.onerror = () => {
        this.connected$.next(false);
      };
    } catch (e) {
      this.scheduleReconnect();
    }
  }

  private handleMessage(msg: { type: string; data: any }) {
    this.lastUpdate$.next(new Date().toISOString());
    switch (msg.type) {
      case 'FULL_STATE':
        if (msg.data.current) this.results$.next(msg.data.current);
        if (msg.data.alerts)  this.alerts$.next(msg.data.alerts);
        break;
      case 'TARGET_UPDATE': {
        const list = [...this.results$.value];
        const idx  = list.findIndex(r => r.id === msg.data.id);
        if (idx >= 0) list[idx] = msg.data; else list.unshift(msg.data);
        this.results$.next(list);
        break;
      }
      case 'ALERT_UPDATE':
        this.alerts$.next(msg.data);
        break;
      case 'STATS_UPDATE':
        this.stats$.next(msg.data);
        break;
    }
  }

  private scheduleReconnect() {
    clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => this.connect(), 5000);
  }

  disconnect() {
    clearTimeout(this.reconnectTimer);
    if (this.ws) { try { this.ws.close(); } catch {} this.ws = null; }
  }

  // REST calls
  async fetchHistory(id: string, n = 60): Promise<HistoryPoint[]> {
    try {
      const r = await fetch(`${this.apiBase}/api/history/${id}?n=${n}`, { signal: AbortSignal.timeout(5000) });
      const j = await r.json();
      return j.history || [];
    } catch { return []; }
  }

  async forceCheck(id?: string): Promise<void> {
    const base = this.apiBase; const url = id ? `${base}/api/check/${id}` : `${base}/api/check`;
    await fetch(url, { method: 'POST' });
  }

  async ackAlert(alertId: string): Promise<void> {
    await fetch(`${this.apiBase}/api/alerts/${alertId}/ack`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: 'SGTIC' })
    });
  }

  // Helpers
  getResult(id: string): CheckResult | undefined {
    return this.results$.value.find(r => r.id === id);
  }

  statusColor(s: string) {
    return s === 'UP' ? 'var(--ac-green)' : s === 'DOWN' ? 'var(--ac-red)' :
           s === 'DEGRADED' || s === 'HTTP_ERROR' ? 'var(--ac-amber)' :
           s === 'PARTIAL' ? 'var(--ac-orange)' : 'var(--tx-4)';
  }
  statusBg(s: string) {
    return s === 'UP' ? 'var(--tint-green-bg)' : s === 'DOWN' ? 'var(--tint-red-bg)' :
           ['DEGRADED','HTTP_ERROR','PARTIAL'].includes(s) ? 'var(--tint-amber-bg)' : 'var(--bg-sunken)';
  }
  statusLabel(s: string) {
    const m: any = { UP:'EN LÍNEA', DOWN:'CAÍDO', DEGRADED:'DEGRADADO',
                     PARTIAL:'PARCIAL', HTTP_ERROR:'ERROR HTTP', UNKNOWN:'DESCONOCIDO' };
    return m[s] || s;
  }
  latencyColor(ms: number | null) {
    if (ms === null) return 'var(--tx-4)';
    return ms < 10 ? 'var(--ac-green)' : ms < 50 ? 'var(--ac-blue)' :
           ms < 200 ? 'var(--ac-amber)' : 'var(--ac-red)';
  }
}
