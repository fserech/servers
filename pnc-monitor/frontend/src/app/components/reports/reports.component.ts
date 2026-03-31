import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ServerService } from '../../services/server.service';
import { IncidentService } from '../../services/incident.service';
import { AlertService } from '../../services/alert.service';
import { Server } from '../../models/server.model';

@Component({ selector: 'app-reports', templateUrl: './reports.component.html' })
export class ReportsComponent implements OnInit, OnDestroy {
  servers: Server[] = [];
  today = new Date().toISOString();
  private subs: Subscription[] = [];

  constructor(
    private srvSvc: ServerService,
    private incSvc: IncidentService,
    private alertSvc: AlertService
  ) {}

  ngOnInit() {
    this.subs.push(this.srvSvc.servers$.subscribe(s => this.servers = s));
  }
  ngOnDestroy() { this.subs.forEach(s => s.unsubscribe()); }

  get active()    { return this.servers.filter(s => s.status === 'active').length; }
  get critical()  { return this.servers.filter(s => s.status === 'critical').length; }
  get inactive()  { return this.servers.filter(s => s.status === 'inactive' || s.status === 'maintenance').length; }
  get incidents() { return this.incSvc.getAll(); }
  get alertEvts() { return this.alertSvc.getAllEvents(); }

  get avgCpu() {
    const a = this.servers.filter(s => s.status === 'active' || s.status === 'critical');
    return a.length ? Math.round(a.reduce((s,v) => s + v.cpu, 0) / a.length) : 0;
  }
  get avgRam() {
    const a = this.servers.filter(s => s.status === 'active' || s.status === 'critical');
    return a.length ? Math.round(a.reduce((s,v) => s + v.ram, 0) / a.length) : 0;
  }
  get avgDisk() {
    const a = this.servers.filter(s => s.status === 'active' || s.status === 'critical');
    return a.length ? Math.round(a.reduce((s,v) => s + v.disk, 0) / a.length) : 0;
  }

  get byDept(): {dept:string; count:number; active:number}[] {
    const map = new Map<string, {count:number; active:number}>();
    for (const s of this.servers) {
      const d = map.get(s.department) || { count:0, active:0 };
      d.count++;
      if (s.status === 'active' || s.status === 'critical') d.active++;
      map.set(s.department, d);
    }
    return Array.from(map.entries()).map(([dept, v]) => ({ dept, ...v })).sort((a,b) => b.count - a.count);
  }

  get byEnv(): {env:string; count:number}[] {
    const map = new Map<string, number>();
    for (const s of this.servers) map.set(s.environment, (map.get(s.environment)||0)+1);
    return Array.from(map.entries()).map(([env, count]) => ({env, count}));
  }

  get openInc()     { return this.incidents.filter(i => i.status==='open'||i.status==='in_progress').length; }
  get resolvedInc() { return this.incidents.filter(i => i.status==='resolved'||i.status==='closed').length; }
  get criticalInc() { return this.incidents.filter(i => i.priority==='critical').length; }

  incByPriority(p: string) { return this.incidents.filter(i => i.priority === p).length; }

  exportCSV() {
    const rows = [
      ['ID','Hostname','IP','Estado','Entorno','CPU%','RAM%','Disco%','Temperatura','Solicitante','Departamento'],
      ...this.servers.map(s => [s.id, s.hostname, s.ip, s.status, s.environment, s.cpu, s.ram, s.disk, s.temp, s.requestedBy, s.department])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `inventario-servidores-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }

  pct(v: number, total: number) { return total ? Math.round(v*100/total) : 0; }
  fmtDate(d: string) { return new Date(d).toLocaleString('es-GT', { day:'2-digit', month:'short', year:'numeric' }); }
  barW(v: number, max: number) { return max ? Math.round((v/max)*100) : 0; }
}
