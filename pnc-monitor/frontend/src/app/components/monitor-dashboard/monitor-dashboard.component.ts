import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MonitorService, CheckResult, MonitorAlert } from '../../services/monitor.service';

@Component({ selector: 'app-monitor-dashboard', templateUrl: './monitor-dashboard.component.html' })
export class MonitorDashboardComponent implements OnInit, OnDestroy {
  results:  CheckResult[]   = [];
  alerts:   MonitorAlert[]  = [];
  connected = false;
  lastUpdate: string | null = null;
  forcing   = false;
  search    = '';
  filterType = 'all';
  filterStatus = 'all';
  private subs: Subscription[] = [];

  constructor(public mon: MonitorService, private router: Router) {}

  ngOnInit() {
    this.mon.connect();
    this.subs.push(
      this.mon.results$.subscribe(r  => this.results   = r),
      this.mon.alerts$.subscribe(a   => this.alerts    = a),
      this.mon.connected$.subscribe(c => this.connected = c),
      this.mon.lastUpdate$.subscribe(u => this.lastUpdate = u),
    );
  }
  ngOnDestroy() { this.subs.forEach(s => s.unsubscribe()); }

  get up()       { return this.results.filter(r => r.status === 'UP').length; }
  get down()     { return this.results.filter(r => r.status === 'DOWN').length; }
  get degraded() { return this.results.filter(r => ['DEGRADED','PARTIAL','HTTP_ERROR'].includes(r.status)).length; }
  get unknown()  { return this.results.filter(r => !r.status || r.status === 'UNKNOWN').length; }
  get activeAlerts() { return this.alerts.filter(a => !a.resolvedAt); }
  get criticalAlerts() { return this.activeAlerts.filter(a => a.severity === 'critical'); }

  get avgLatency(): number {
    const valid = this.results.filter(r => r.ping?.latency != null);
    return valid.length ? Math.round(valid.reduce((s,r) => s + r.ping.latency!, 0) / valid.length) : 0;
  }

  get filtered(): CheckResult[] {
    return this.results.filter(r => {
      const ms = this.filterStatus === 'all' || r.status === this.filterStatus ||
        (this.filterStatus === 'DOWN_ALL' && ['DOWN','DEGRADED','PARTIAL','HTTP_ERROR'].includes(r.status));
      const mt = this.filterType === 'all' || r.type === this.filterType;
      const mq = !this.search || [r.hostname, r.ip, ...(r.apps||[])].some(v =>
        v?.toLowerCase().includes(this.search.toLowerCase()));
      return ms && mt && mq;
    });
  }

  countStatus(s: string) {
    if (s === 'DOWN_ALL') return this.results.filter(r => ['DOWN','DEGRADED','PARTIAL','HTTP_ERROR'].includes(r.status)).length;
    return this.results.filter(r => r.status === s).length;
  }

  async forceCheckAll() {
    this.forcing = true;
    await this.mon.forceCheck();
    setTimeout(() => this.forcing = false, 3000);
  }

  goDetail(id: string) { this.router.navigate(['/monitor', id]); }

  fmtTime(ts: string | null) {
    if (!ts) return '—';
    return new Date(ts).toLocaleTimeString('es-GT', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
  }
  fmtDate(ts: string) {
    return new Date(ts).toLocaleString('es-GT', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' });
  }

  portColor(port: number, open: boolean) {
    if (!open) return 'var(--ac-red)';
    return port===22?'var(--ac-amber)':port===80?'var(--ac-blue)':
           port===443?'var(--ac-green)':port===3306||port===5432||port===1521?'var(--ac-purple)':'var(--tx-3)';
  }
  portBg(port: number, open: boolean) {
    if (!open) return 'var(--tint-red-bg)';
    return port===22?'var(--tint-amber-bg)':port===80?'var(--tint-blue-bg)':
           port===443?'var(--tint-green-bg)':port===3306||port===5432||port===1521?'rgba(168,85,247,.1)':'var(--bg-sunken)';
  }
}
