import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ServerService } from '../../services/server.service';
import { FortigateService } from '../../services/fortigate.service';
import { IncidentService } from '../../services/incident.service';
import { AlertService } from '../../services/alert.service';
import { MonitorService, CheckResult } from '../../services/monitor.service';
import { Server } from '../../models/server.model';
import { TARGETS_META } from '../../models/targets-meta';

@Component({ selector: 'app-dashboard', templateUrl: './dashboard.component.html' })
export class DashboardComponent implements OnInit, OnDestroy {
  servers: Server[] = [];
  monitorResults: CheckResult[] = [];
  topoExpanded = false;
  selectedNode: any = null;   // clicked node popup data
  private subs: Subscription[] = [];

  get active()        { return this.servers.filter(s => s.status === 'active'); }
  get critical()      { return this.servers.filter(s => s.status === 'critical'); }
  get inactive()      { return this.servers.filter(s => s.status === 'inactive' || s.status === 'maintenance'); }
  get activePolicies(){ return this.fortiSvc.getPolicies().filter(p => p.status === 'enabled').length; }
  get recentLogs()    { return this.serverSvc.getAllLogs().slice(0, 16); }
  get openIncidents() { return this.incSvc.getOpen().length; }
  get activeAlerts()  { return this.alertSvc.getActiveEvents(); }
  get criticalAlerts(){ return this.activeAlerts.filter(a => a.severity === 'critical'); }
  get avgCpu() {
    const a = [...this.active, ...this.critical];
    return a.length ? Math.round(a.reduce((s,v)=>s+v.cpu,0)/a.length) : 0;
  }
  get avgRam() {
    const a = [...this.active, ...this.critical];
    return a.length ? Math.round(a.reduce((s,v)=>s+v.ram,0)/a.length) : 0;
  }

  get monUp()       { return this.monitorResults.filter(r => r.status === 'UP').length; }
  get monDown()     { return this.monitorResults.filter(r => r.status === 'DOWN').length; }
  get monDegraded() { return this.monitorResults.filter(r => ['DEGRADED','PARTIAL','HTTP_ERROR'].includes(r.status)).length; }
  get monUnknown()  { return this.topoNodes.length - this.monitorResults.length; }
  get monStatusBadges() {
    return [
      {l:'En Línea', n:this.monUp,       c:'#34d399', bg:'rgba(52,211,153,.1)',  br:'rgba(52,211,153,.3)'},
      {l:'Caídos',   n:this.monDown,     c:'#f87171', bg:'rgba(248,113,113,.1)', br:'rgba(248,113,113,.3)'},
      {l:'Alertas',  n:this.monDegraded, c:'#fbbf24', bg:'rgba(251,191,36,.08)', br:'rgba(251,191,36,.25)'},
    ];
  }

  // All 34 targets for topology (from TARGETS_META)
  get topoNodes() { return TARGETS_META; }

  // Get real monitor status for a node by id
  getMonResult(id: string): CheckResult | undefined {
    return this.monitorResults.find(r => r.id === id);
  }

  // Node color based on REAL monitor status
  topoNodeColor(id: string): string {
    const r = this.getMonResult(id);
    if (!r) return '#555e6e';                                          // unknown — gray
    if (r.status === 'UP')          return '#34d399';                  // green
    if (r.status === 'DOWN')        return '#f87171';                  // red
    if (['DEGRADED','PARTIAL','HTTP_ERROR'].includes(r.status)) return '#fbbf24'; // amber
    return '#555e6e';
  }

  topoNodeBg(id: string): string {
    const r = this.getMonResult(id);
    if (!r) return 'rgba(85,94,110,.12)';
    if (r.status === 'UP')          return 'rgba(52,211,153,.12)';
    if (r.status === 'DOWN')        return 'rgba(248,113,113,.18)';
    if (['DEGRADED','PARTIAL','HTTP_ERROR'].includes(r.status)) return 'rgba(251,191,36,.12)';
    return 'rgba(85,94,110,.12)';
  }

  topoNodeStroke(id: string): string {
    const r = this.getMonResult(id);
    if (!r) return '#555e6e';
    if (r.status === 'UP')   return '#34d399';
    if (r.status === 'DOWN') return '#f87171';
    if (['DEGRADED','PARTIAL','HTTP_ERROR'].includes(r.status)) return '#fbbf24';
    return '#555e6e';
  }

  isNodeDown(id: string): boolean {
    const r = this.getMonResult(id);
    return r?.status === 'DOWN';
  }

  // Icon type per server type
  nodeIcon(type: string): string {
    const m: any = { database:'db', web:'globe', api:'globe', infra:'server', file:'server', dns:'globe', security:'server' };
    return m[type] || 'server';
  }

  // Click on topology node → show popup
  selectNode(meta: any, event: MouseEvent) {
    event.stopPropagation();
    const result = this.getMonResult(meta.id);
    this.selectedNode = { ...meta, result };
  }
  closeNode() { this.selectedNode = null; }

  constructor(
    public serverSvc: ServerService,
    public fortiSvc: FortigateService,
    public incSvc: IncidentService,
    public alertSvc: AlertService,
    public mon: MonitorService,
    public router: Router
  ) {}

  ngOnInit() {
    this.subs.push(
      this.serverSvc.servers$.subscribe(s => this.servers = s),
      this.mon.results$.subscribe(r => this.monitorResults = r)
    );
    // Connect monitor if not already connected
    if (!this.mon.connected$.value) this.mon.connect();
  }
  ngOnDestroy() { this.subs.forEach(s => s.unsubscribe()); }

  goToServer(s: Server) { this.router.navigate(['/servers', s.id]); }
  goToMonitor(id: string) {
    this.closeNode();
    this.topoExpanded = false;
    this.router.navigate(['/monitor', id]);
  }

  // Topology math — 34 nodes in a force-spread layout
  // Use spiral/grid layout instead of single circle to avoid overcrowding
  topoX(i: number, total: number, cx: number, r: number): number {
    // Multi-ring: inner 10, outer 24
    if (i < 10) {
      return cx + (r * 0.5) * Math.cos(i / 10 * 2 * Math.PI - Math.PI/2);
    }
    return cx + r * Math.cos((i - 10) / (total - 10) * 2 * Math.PI - Math.PI/2);
  }
  topoY(i: number, total: number, cy: number, r: number): number {
    if (i < 10) {
      return cy + (r * 0.5) * Math.sin(i / 10 * 2 * Math.PI - Math.PI/2);
    }
    return cy + r * Math.sin((i - 10) / (total - 10) * 2 * Math.PI - Math.PI/2);
  }

  midX(i: number, cx: number, cy: number, nx: number, ny: number) { return cx + (nx - cx) * 0.55; }
  midY(i: number, cx: number, cy: number, nx: number, ny: number) { return cy + (ny - cy) * 0.55; }

  // Legacy (still used by server cards)
  nodeX(i: number) { return 160 + 88 * Math.cos(i / this.servers.length * 2 * Math.PI - Math.PI/2); }
  nodeY(i: number) { return 105 + 88 * Math.sin(i / this.servers.length * 2 * Math.PI - Math.PI/2); }
  nodeXL(i: number) { return 400 + 200 * Math.cos(i / this.servers.length * 2 * Math.PI - Math.PI/2); }
  nodeYL(i: number) { return 200 + 175 * Math.sin(i / this.servers.length * 2 * Math.PI - Math.PI/2); }

  statusColor(s: string) {
    return s==='active'?'var(--ac-green)':s==='critical'?'var(--ac-red)':s==='maintenance'?'var(--ac-amber)':'var(--tx-4)';
  }
  statusDotClass(s: string) { return s==='active'?'dot-green':s==='critical'?'dot-red':s==='maintenance'?'dot-amber':''; }
  statusLabel(s: string) {
    return s==='active'?'EN LÍNEA':s==='critical'?'CRÍTICO':s==='maintenance'?'MANT.':'FUERA DE LÍNEA';
  }
  nodeColor(s: Server) {
    return s.status==='active'?'var(--ac-green)':s.status==='critical'?'var(--ac-red)':s.status==='maintenance'?'var(--ac-amber)':'var(--tx-4)';
  }
  nodeStroke(s: Server) {
    return s.status==='active'?'var(--tint-green-bg)':s.status==='critical'?'var(--tint-red-bg)':s.status==='maintenance'?'var(--tint-amber-bg)':'var(--bg-sunken)';
  }

  formatDate(d: string) {
    if (!d) return '—';
    return new Date(d).toLocaleString('es-GT', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' });
  }
  logIcon(t: string) { return t==='create'?'✦':t==='shutdown'?'⏻':t==='activate'?'▶':t==='alert'?'⚠':t==='edit'?'✏':'·'; }
  logColor(t: string) {
    return t==='create'?'var(--ac-green)':t==='shutdown'?'var(--ac-red)':t==='alert'?'var(--ac-amber)':t==='activate'?'var(--ac-blue)':'var(--tx-3)';
  }
  logBg(t: string) {
    return t==='create'?'var(--tint-green-bg)':t==='shutdown'?'var(--tint-red-bg)':t==='alert'?'var(--tint-amber-bg)':'var(--tint-blue-bg)';
  }
  sparkPoints(h: number[], w: number, ht: number): string {
    if (!h?.length) return '';
    const mx = Math.max(...h, 1), mn = Math.min(...h, 0);
    return h.map((v,i) => `${(i/(h.length-1))*w},${ht-(((v-mn)/(mx-mn||1))*(ht-4)+2)}`).join(' ');
  }
  polyFill(h: number[], w: number, ht: number): string {
    if (!h?.length) return '';
    const pts = this.sparkPoints(h, w, ht);
    return `0,${ht} ${pts} ${w},${ht}`;
  }
}
