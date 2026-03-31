import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { MonitorService, CheckResult, HistoryPoint } from '../../services/monitor.service';
import { TARGETS_META } from '../../models/targets-meta';

@Component({ selector: 'app-monitor-detail', templateUrl: './monitor-detail.component.html' })
export class MonitorDetailComponent implements OnInit, OnDestroy {
  id     = '';
  result: CheckResult | undefined;
  history: HistoryPoint[] = [];
  meta: any;
  private subs: Subscription[] = [];

  constructor(private route: ActivatedRoute, private router: Router, public mon: MonitorService) {}

  ngOnInit() {
    this.id   = this.route.snapshot.paramMap.get('id')!;
    this.meta = TARGETS_META.find((t: any) => t.id === this.id);
    this.subs.push(
      this.mon.results$.subscribe(r => { this.result = r.find(x => x.id === this.id); })
    );
    this.loadHistory();
    // Refresh history every 30s
    this.subs.push(interval(30000).subscribe(() => this.loadHistory()));
  }
  ngOnDestroy() { this.subs.forEach(s => s.unsubscribe()); }

  async loadHistory() {
    this.history = await this.mon.fetchHistory(this.id, 60);
  }

  async forceCheck() {
    await this.mon.forceCheck(this.id);
  }

  get uptime(): string {
    if (!this.history.length) return '—';
    const up = this.history.filter(h => h.alive).length;
    return ((up / this.history.length) * 100).toFixed(1) + '%';
  }

  get avgLatency(): number | null {
    const valid = this.history.filter(h => h.latency != null);
    if (!valid.length) return null;
    return Math.round(valid.reduce((s, h) => s + h.latency!, 0) / valid.length);
  }

  historyBarColor(h: HistoryPoint) {
    return h.status === 'UP' ? 'var(--ac-green)' :
           h.status === 'DOWN' ? 'var(--ac-red)' : 'var(--ac-amber)';
  }

  historyBarH(h: HistoryPoint, maxMs = 500): number {
    if (!h.alive) return 40;
    const ms = h.latency || 1;
    return Math.max(4, Math.min(40, (ms / maxMs) * 40));
  }

  get maxHistLatency(): number {
    return Math.max(...this.history.map(h => h.latency || 0), 1);
  }

  portsOkStr(r: any): string { const ports = r?.ports || []; return ports.filter((p:any)=>p.open).length + ' / ' + ports.length; }
  fmtTime(ts: string) {
    return new Date(ts).toLocaleTimeString('es-GT', { hour:'2-digit', minute:'2-digit' });
  }
  fmtDate(ts: string) {
    return new Date(ts).toLocaleString('es-GT', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' });
  }
}
