import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from '../../services/alert.service';
import { ToastService } from '../../services/toast.service';
import { AlertRule, AlertEvent } from '../../models/alert.model';

@Component({ selector: 'app-alerts', templateUrl: './alerts.component.html' })
export class AlertsComponent implements OnInit, OnDestroy {
  rules: AlertRule[] = [];
  events: AlertEvent[] = [];
  tab: 'events' | 'rules' = 'events';
  editRule: AlertRule | null = null;
  private subs: Subscription[] = [];

  constructor(private alertSvc: AlertService, private toastSvc: ToastService) {}
  ngOnInit() {
    this.subs.push(
      this.alertSvc.rules$.subscribe(r => this.rules = r),
      this.alertSvc.events$.subscribe(e => this.events = e)
    );
  }
  ngOnDestroy() { this.subs.forEach(s => s.unsubscribe()); }

  get activeEvents()   { return this.events.filter(e => e.state === 'active'); }
  get ackEvents()      { return this.events.filter(e => e.state === 'acknowledged'); }
  get resolvedEvents() { return this.events.filter(e => e.state === 'resolved'); }

  sevColor(s: string) { return s==='critical'?'var(--ac-red)':s==='warning'?'var(--ac-amber)':'var(--ac-blue)'; }
  sevBg(s: string)    { return s==='critical'?'var(--tint-red-bg)':s==='warning'?'var(--tint-amber-bg)':'var(--tint-blue-bg)'; }
  stateColor(s: string){ return s==='active'?'var(--ac-red)':s==='acknowledged'?'var(--ac-amber)':'var(--ac-green)'; }
  fmtDate(d: string)  { if (!d) return '—'; return new Date(d).toLocaleString('es-GT', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }); }

  acknowledge(evt: AlertEvent) {
    this.alertSvc.acknowledge(evt.id, 'Carlos Méndez');
    this.toastSvc.show('Alerta reconocida', 'warn');
  }
  resolve(evt: AlertEvent) {
    this.alertSvc.resolveEvent(evt.id, 'Carlos Méndez');
    this.toastSvc.show('Alerta resuelta');
  }
  startEdit(r: AlertRule) { this.editRule = { ...r }; }
  toggleRule(r: AlertRule) {
    this.alertSvc.toggleRule(r.id);
    this.toastSvc.show(`Regla ${r.enabled ? 'desactivada' : 'activada'}`);
  }
  saveRule() {
    if (!this.editRule) return;
    this.alertSvc.updateRule(this.editRule.id, this.editRule);
    this.editRule = null;
    this.toastSvc.show('Regla actualizada');
  }
}
