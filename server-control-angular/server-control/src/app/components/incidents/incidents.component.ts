import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IncidentService } from '../../services/incident.service';
import { ServerService } from '../../services/server.service';
import { ToastService } from '../../services/toast.service';
import { Incident } from '../../models/incident.model';

@Component({ selector: 'app-incidents', templateUrl: './incidents.component.html' })
export class IncidentsComponent implements OnInit, OnDestroy {
  incidents: Incident[] = [];
  filterStatus = 'all';
  filterPriority = 'all';
  search = '';
  selected: Incident | null = null;
  showNew = false;
  newComment = '';
  newModel: Partial<Incident> = { priority: 'medium', category: 'software', sla: 24 };
  private sub!: Subscription;

  servers$ = [];
  priorities = ['critical','high','medium','low'];
  categories = ['hardware','software','network','security','performance','planned'];
  statuses = ['open','in_progress','resolved','closed'];
  users = ['Carlos Méndez','Ana Torres','M. Fernanda Ruiz','Roberto Sánchez','Luis González'];

  constructor(private incSvc: IncidentService, private srvSvc: ServerService, private toastSvc: ToastService) {}

  ngOnInit() {
    this.sub = this.incSvc.incidents$.subscribe(i => {
      this.incidents = i;
      if (this.selected) this.selected = i.find(x => x.id === this.selected!.id) || null;
    });
  }
  ngOnDestroy() { this.sub?.unsubscribe(); }

  get servers() { return this.srvSvc.getServers(); }

  get filtered() {
    return this.incidents.filter(i => {
      const ms = this.filterStatus === 'all' || i.status === this.filterStatus;
      const mp = this.filterPriority === 'all' || i.priority === this.filterPriority;
      const mq = !this.search || [i.id, i.title, i.serverName, i.assignedTo].some(v => v.toLowerCase().includes(this.search.toLowerCase()));
      return ms && mp && mq;
    });
  }

  count(f: string) {
    if (f === 'all') return this.incidents.length;
    if (['open','in_progress','resolved','closed'].includes(f)) return this.incidents.filter(i => i.status === f).length;
    return this.incidents.filter(i => i.priority === f).length;
  }

  priorityColor(p: string) {
    return p === 'critical' ? 'var(--ac-red)' : p === 'high' ? 'var(--ac-orange)' : p === 'medium' ? 'var(--ac-amber)' : 'var(--ac-green)';
  }
  priorityBg(p: string) {
    return p === 'critical' ? 'var(--tint-red-bg)' : p === 'high' ? 'rgba(251,146,60,.1)' : p === 'medium' ? 'var(--tint-amber-bg)' : 'var(--tint-green-bg)';
  }
  statusColor(s: string) {
    return s === 'open' ? 'var(--ac-red)' : s === 'in_progress' ? 'var(--ac-amber)' : s === 'resolved' ? 'var(--ac-green)' : 'var(--tx-4)';
  }
  statusLabel(s: string) {
    return s === 'open' ? 'Abierto' : s === 'in_progress' ? 'En Progreso' : s === 'resolved' ? 'Resuelto' : 'Cerrado';
  }
  catIcon(c: string) {
    const m: any = { hardware:'🖥', software:'💾', network:'🌐', security:'🛡', performance:'⚡', planned:'📅' };
    return m[c] || '◉';
  }
  fmtDate(d: string) {
    if (!d || d === '—') return '—';
    return new Date(d).toLocaleString('es-GT', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
  }
  elapsed(d: string): string {
    const ms = Date.now() - new Date(d).getTime();
    const h  = Math.floor(ms / 3600000);
    const m  = Math.floor((ms % 3600000) / 60000);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  initials(name: string) { return name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase(); }
  createIncident() {
    const id = this.incSvc.create(this.newModel, 'Carlos Méndez');
    this.showNew = false;
    this.newModel = { priority: 'medium', category: 'software', sla: 24 };
    this.toastSvc.show(`Incidente ${id} creado`);
  }

  updateStatus(inc: Incident, status: string) {
    this.incSvc.update(inc.id, { status: status as any });
    this.toastSvc.show(`Incidente actualizado a ${this.statusLabel(status)}`);
  }

  postComment() {
    if (!this.selected || !this.newComment.trim()) return;
    this.incSvc.addComment(this.selected.id, this.newComment, 'Carlos Méndez');
    this.newComment = '';
  }

  slaStatus(inc: Incident): string {
    if (inc.status === 'resolved' || inc.status === 'closed') return 'ok';
    const hoursOpen = (Date.now() - new Date(inc.createdAt).getTime()) / 3600000;
    if (hoursOpen > inc.sla) return 'breached';
    if (hoursOpen > inc.sla * 0.8) return 'warning';
    return 'ok';
  }
}
