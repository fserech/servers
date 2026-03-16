import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ServerService } from '../../services/server.service';
import { ToastService } from '../../services/toast.service';
import { Server } from '../../models/server.model';

@Component({ selector: 'app-server-list', templateUrl: './server-list.component.html' })
export class ServerListComponent implements OnInit, OnDestroy {
  servers: Server[] = [];
  search = '';
  filterStatus = 'all';
  showNewModal = false;
  shutdownTarget: Server | null = null;
  editTarget: Server | null = null;
  deleteTarget: Server | null = null;
  private sub!: Subscription;

  constructor(private serverSvc: ServerService, private toastSvc: ToastService, private router: Router) {}

  ngOnInit() { this.sub = this.serverSvc.servers$.subscribe(s => this.servers = s); }
  ngOnDestroy() { this.sub?.unsubscribe(); }

  get filtered(): Server[] {
    return this.servers.filter(s => {
      const ms = this.filterStatus==='all' || (this.filterStatus==='active'&&(s.status==='active'||s.status==='critical')) || (this.filterStatus==='inactive'&&(s.status==='inactive'||s.status==='maintenance')) || s.status===this.filterStatus;
      const mq = !this.search || [s.hostname, s.ip, s.mac, s.id, s.requestedBy, s.location]
        .some(v => v.toLowerCase().includes(this.search.toLowerCase()));
      return ms && mq;
    });
  }
  count(f: string) { if (f==='all') return this.servers.length; if (f==='active') return this.servers.filter(s=>s.status==='active'||s.status==='critical').length; if (f==='inactive') return this.servers.filter(s=>s.status==='inactive'||s.status==='maintenance').length; return this.servers.filter(s=>s.status===f).length; }

  openDetail(s: Server) { this.router.navigate(['/servers', s.id]); }

  onNewServer(data: any) {
    const id = this.serverSvc.createServer(data);
    this.showNewModal = false;
    this.toastSvc.show(`${id} registrado exitosamente`);
  }

  onEditServer(data: Partial<Server>) {
    if (!this.editTarget) return;
    this.serverSvc.updateServer(this.editTarget.id, data);
    this.toastSvc.show(`${this.editTarget.id} actualizado`);
    this.editTarget = null;
  }

  onShutdown(data: { reason: string }) {
    if (!this.shutdownTarget) return;
    this.serverSvc.shutdownServer(this.shutdownTarget.id, data.reason);
    this.toastSvc.show(`${this.shutdownTarget.id} apagado`, 'warn');
    this.shutdownTarget = null;
  }

  activate(s: Server) {
    this.serverSvc.activateServer(s.id);
    this.toastSvc.show(`${s.id} reactivado`);
  }

  confirmDelete() {
    if (!this.deleteTarget) return;
    this.serverSvc.deleteServer(this.deleteTarget.id);
    this.toastSvc.show(`${this.deleteTarget.id} eliminado`, 'error');
    this.deleteTarget = null;
  }
}
