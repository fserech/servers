import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ServerService } from '../../services/server.service';
import { ToastService } from '../../services/toast.service';
import { Server } from '../../models/server.model';

@Component({ selector: 'app-server-detail', templateUrl: './server-detail.component.html' })
export class ServerDetailComponent implements OnInit, OnDestroy {
  server: Server | undefined;
  shutdownTarget: Server | null = null;
  showEditModal = false;
  private subs: Subscription[] = [];

  constructor(
    private route: ActivatedRoute, private router: Router,
    private serverSvc: ServerService, private toastSvc: ToastService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.subs.push(this.serverSvc.servers$.subscribe(servers => {
      this.server = servers.find(s => s.id === id);
    }));
  }
  ngOnDestroy() { this.subs.forEach(s => s.unsubscribe()); }

  activate() {
    if (!this.server) return;
    this.serverSvc.activateServer(this.server.id);
    this.toastSvc.show(`${this.server.id} reactivado`);
  }

  onShutdown(data: { reason: string }) {
    if (!this.server) return;
    this.serverSvc.shutdownServer(this.server.id, data.reason);
    this.toastSvc.show(`${this.server.id} apagado`, 'warn');
    this.shutdownTarget = null;
  }

  onEditSave(data: Partial<Server>) {
    if (!this.server) return;
    this.serverSvc.updateServer(this.server.id, data);
    this.toastSvc.show(`${this.server.id} actualizado`);
    this.showEditModal = false;
  }

  deleteServer() {
    if (!this.server) return;
    const id = this.server.id;
    this.serverSvc.deleteServer(id);
    this.toastSvc.show(`${id} eliminado`, 'error');
    this.router.navigate(['/servers']);
  }

  goBack() { this.router.navigate(['/servers']); }

  gaugeStroke(val: number, color: string): string {
    return val > 85 ? 'var(--ac-red)' : val > 65 ? 'var(--ac-amber)' : color;
  }
  gaugeDash(val: number): string {
    const r = 22, circ = 2 * Math.PI * r;
    return `${(val / 100) * circ} ${circ - (val / 100) * circ}`;
  }
  sparkPoints(data: number[], w = 100, h = 28): string {
    if (!data || data.length < 2) return '';
    const max = Math.max(...data, 1);
    return data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h * 0.88}`).join(' ');
  }
  polyFill(data: number[], w = 100, h = 28): string {
    const pts = this.sparkPoints(data, w, h);
    return pts ? `0,${h} ${pts} ${w},${h}` : '';
  }
  formatDate(d: string): string {
    return d ? new Date(d).toLocaleString('es-GT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';
  }
  logIcon(t: string) { return t==='create'?'✦':t==='shutdown'?'⏻':t==='activate'?'▶':t==='alert'?'⚠':'✏'; }
  logBg(t: string) { return t==='create'?'var(--tint-green-bg)':t==='shutdown'?'var(--tint-red-bg)':t==='alert'?'var(--tint-amber-bg)':'var(--tint-blue-bg)'; }
  logColor(t: string) { return t==='create'?'var(--ac-green)':t==='shutdown'?'var(--ac-red)':t==='alert'?'var(--ac-amber)':t==='activate'?'var(--ac-blue)':'var(--tx-3)'; }
}
