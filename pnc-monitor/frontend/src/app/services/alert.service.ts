import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import { AlertRule, AlertEvent, DEFAULT_RULES } from '../models/alert.model';
import { ServerService } from './server.service';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private _rules   = new BehaviorSubject<AlertRule[]>(DEFAULT_RULES);
  private _events  = new BehaviorSubject<AlertEvent[]>([]);
  rules$  = this._rules.asObservable();
  events$ = this._events.asObservable();

  constructor(private serverSvc: ServerService) {
    interval(5000).subscribe(() => this.evaluate());
  }

  private evaluate(): void {
    const servers = this.serverSvc.getServers();
    const rules   = this._rules.getValue().filter(r => r.enabled);
    const active  = this._events.getValue().filter(e => e.state === 'active');

    for (const srv of servers) {
      if (srv.status === 'inactive' || srv.status === 'maintenance') continue;
      for (const rule of rules) {
        if (rule.appliesTo !== 'all' && rule.appliesTo !== srv.id) continue;
        const val = (srv as any)[rule.metric] as number;
        const triggered = this.check(val, rule.operator, rule.threshold);
        const key = `${rule.id}-${srv.id}`;
        const existing = active.find(e => e.ruleId === rule.id && e.serverId === srv.id);

        if (triggered && !existing) {
          const evt: AlertEvent = {
            id: `EVT-${Date.now()}`, ruleId: rule.id, ruleName: rule.name,
            serverId: srv.id, serverName: srv.hostname,
            severity: rule.severity, state: 'active',
            message: `${rule.name}: ${rule.metric.toUpperCase()} = ${val}${rule.metric==='temp'?'°C':'%'} (umbral: ${rule.threshold})`,
            value: val, threshold: rule.threshold, metric: rule.metric,
            firedAt: new Date().toISOString(),
            acknowledgedAt: null, acknowledgedBy: null, resolvedAt: null
          };
          this._events.next([evt, ...this._events.getValue()]);
        } else if (!triggered && existing) {
          this.resolveEvent(existing.id, 'auto-resolve');
        }
      }
    }
  }

  private check(val: number, op: string, thr: number): boolean {
    switch (op) {
      case '>':  return val > thr;
      case '>=': return val >= thr;
      case '<':  return val < thr;
      case '<=': return val <= thr;
      default:   return false;
    }
  }

  getActiveEvents() { return this._events.getValue().filter(e => e.state === 'active'); }
  getAllEvents()    { return this._events.getValue(); }

  acknowledge(id: string, user: string): void {
    this._events.next(this._events.getValue().map(e =>
      e.id !== id ? e : { ...e, state: 'acknowledged' as const, acknowledgedAt: new Date().toISOString(), acknowledgedBy: user }
    ));
  }

  resolveEvent(id: string, user: string): void {
    this._events.next(this._events.getValue().map(e =>
      e.id !== id ? e : { ...e, state: 'resolved' as const, resolvedAt: new Date().toISOString() }
    ));
  }

  updateRule(id: string, data: Partial<AlertRule>): void {
    this._rules.next(this._rules.getValue().map(r => r.id !== id ? r : { ...r, ...data }));
  }

  toggleRule(id: string): void {
    this._rules.next(this._rules.getValue().map(r => r.id !== id ? r : { ...r, enabled: !r.enabled }));
  }
}
