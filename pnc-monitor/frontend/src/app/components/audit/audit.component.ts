import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ServerService } from '../../services/server.service';

@Component({ selector: 'app-audit', templateUrl: './audit.component.html' })
export class AuditComponent implements OnInit, OnDestroy {
  logs: any[] = [];
  private sub!: Subscription;

  constructor(private serverSvc: ServerService) {}
  ngOnInit() { this.sub = this.serverSvc.servers$.subscribe(() => this.logs = this.serverSvc.getAllLogs()); }
  ngOnDestroy() { this.sub?.unsubscribe(); }

  fmtDate(d: string) {
    return new Date(d).toLocaleString('es-GT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
  logColor(t: string) {
    return t === 'create' ? 'var(--accent-green)' : t === 'shutdown' ? 'var(--accent-red)' : t === 'activate' ? 'var(--accent-blue)' : 'var(--accent-amber)';
  }
}
