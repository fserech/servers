import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FortigateService } from '../../services/fortigate.service';
import { ServerService } from '../../services/server.service';
import { ToastService } from '../../services/toast.service';
import { FortiPolicy } from '../../models/policy.model';
import { Server } from '../../models/server.model';

@Component({ selector: 'app-fortigate', templateUrl: './fortigate.component.html' })
export class FortigateComponent implements OnInit, OnDestroy {
  policies: FortiPolicy[] = [];
  servers: Server[] = [];
  selected: FortiPolicy | null = null;
  search = '';
  filterAction = 'all';
  now = new Date().toISOString();
  private subs: Subscription[] = [];

  zones = [
    { id: 'WAN', desc: 'Internet · Upstream', color: '#ff3535', icon: '🌐' },
    { id: 'LAN-CORP', desc: 'Red Corporativa', color: '#00d4ff', icon: '🏢' },
    { id: 'SERVER-FARM', desc: 'Granja Servidores', color: '#f59e0b', icon: '⬡' },
    { id: 'MGMT-ZONE', desc: 'Gestión · SIEM', color: '#a78bfa', icon: '◉' },
    { id: 'BACKUP-ZONE', desc: 'Respaldos', color: '#00ff88', icon: '💾' },
  ];

  constructor(public fortiSvc: FortigateService, private serverSvc: ServerService, private toastSvc: ToastService) {}

  ngOnInit() {
    this.subs.push(
      this.fortiSvc.policies$.subscribe(p => this.policies = p),
      this.serverSvc.servers$.subscribe(s => this.servers = s)
    );
  }
  ngOnDestroy() { this.subs.forEach(s => s.unsubscribe()); }

  get filtered(): FortiPolicy[] {
    return this.policies.filter(p => {
      const ma = this.filterAction === 'all' || p.action === this.filterAction || p.status === this.filterAction;
      const mq = !this.search || [p.id, p.name, p.srcAddr, p.dstAddr, p.service, p.srcZone, p.dstZone]
        .some(v => v.toLowerCase().includes(this.search.toLowerCase()));
      return ma && mq;
    });
  }

  get enabledCount() { return this.policies.filter(p => p.status === 'enabled').length; }
  get deniedCount() { return this.policies.filter(p => p.action === 'DENY').length; }

  zoneCount(zone: string) { return this.policies.filter(p => p.srcZone === zone || p.dstZone === zone).length; }
  linkedServer(id: string | null): Server | undefined { return id ? this.servers.find(s => s.id === id) : undefined; }

  toggle(pol: FortiPolicy) {
    this.fortiSvc.togglePolicy(pol.id);
    if (this.selected?.id === pol.id)
      this.selected = { ...pol, status: pol.status === 'enabled' ? 'disabled' : 'enabled' };
    this.toastSvc.show('Política actualizada', 'warn');
  }

  fmt(n: number): string { return n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' : String(n); }
  fmtDate(d: string): string { return d ? new Date(d).toLocaleString('es-GT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'; }
}
