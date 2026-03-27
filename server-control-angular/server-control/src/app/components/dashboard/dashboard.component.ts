import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ServerService } from '../../services/server.service';
import { FortigateService } from '../../services/fortigate.service';
import { IncidentService } from '../../services/incident.service';
import { AlertService } from '../../services/alert.service';
import { Server } from '../../models/server.model';

@Component({ selector: 'app-dashboard', templateUrl: './dashboard.component.html' })
export class DashboardComponent implements OnInit, OnDestroy {
  servers: Server[] = [];
  topoExpanded = false;
  private subs: Subscription[] = [];

  get active()       { return this.servers.filter(s => s.status === 'active'); }
  get critical()     { return this.servers.filter(s => s.status === 'critical'); }
  get inactive()     { return this.servers.filter(s => s.status === 'inactive' || s.status === 'maintenance'); }
  get activePolicies(){ return this.fortiSvc.getPolicies().filter(p => p.status === 'enabled').length; }
  get recentLogs()   { return this.serverSvc.getAllLogs().slice(0, 16); }
  get openIncidents(){ return this.incSvc.getOpen().length; }
  get activeAlerts() { return this.alertSvc.getActiveEvents(); }
  get criticalAlerts(){ return this.activeAlerts.filter(a => a.severity === 'critical'); }

  get avgCpu() {
    const a = [...this.active, ...this.critical];
    return a.length ? Math.round(a.reduce((s,v)=>s+v.cpu,0)/a.length) : 0;
  }
  get avgRam() {
    const a = [...this.active, ...this.critical];
    return a.length ? Math.round(a.reduce((s,v)=>s+v.ram,0)/a.length) : 0;
  }

  constructor(
    public serverSvc: ServerService,
    public fortiSvc: FortigateService,
    public incSvc: IncidentService,
    public alertSvc: AlertService,
    public router: Router
  ) {}

  ngOnInit() {
    this.subs.push(this.serverSvc.servers$.subscribe(s => this.servers = s));
  }
  ngOnDestroy() { this.subs.forEach(s => s.unsubscribe()); }

  goToServer(s: Server) { this.router.navigate(['/servers', s.id]); }
  nodeXL(i: number) { return 400 + 200 * Math.cos(i / this.servers.length * 2 * Math.PI - Math.PI/2); }
  nodeYL(i: number) { return 200 + 175 * Math.sin(i / this.servers.length * 2 * Math.PI - Math.PI/2); }
  nodeX(i: number) { return 160 + 88 * Math.cos(i / this.servers.length * 2 * Math.PI - Math.PI/2); }
  nodeY(i: number) { return 105 + 88 * Math.sin(i / this.servers.length * 2 * Math.PI - Math.PI/2); }

  statusColor(s: string) {
    return s==='active'?'var(--ac-green)':s==='critical'?'var(--ac-red)':s==='maintenance'?'var(--ac-amber)':'var(--tx-4)';
  }
  statusDotClass(s: string) {
    return s==='active'?'dot-green':s==='critical'?'dot-red':s==='maintenance'?'dot-amber':'';
  }
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
