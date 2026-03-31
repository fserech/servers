import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Incident, IncidentComment, INITIAL_INCIDENTS } from '../models/incident.model';

@Injectable({ providedIn: 'root' })
export class IncidentService {
  private _incidents = new BehaviorSubject<Incident[]>(INITIAL_INCIDENTS);
  incidents$ = this._incidents.asObservable();

  getAll() { return this._incidents.getValue(); }
  getById(id: string) { return this._incidents.getValue().find(i => i.id === id); }
  getOpen() { return this._incidents.getValue().filter(i => i.status === 'open' || i.status === 'in_progress'); }

  create(data: Partial<Incident>, user: string): string {
    const id = `INC-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4,'0')}`;
    const now = new Date().toISOString();
    const inc: Incident = {
      id, title: data.title!, description: data.description!,
      serverId: data.serverId || null, serverName: data.serverName || '—',
      priority: data.priority || 'medium', status: 'open',
      category: data.category || 'software',
      assignedTo: data.assignedTo || user, reportedBy: user,
      createdAt: now, updatedAt: now, resolvedAt: null,
      eta: data.eta || null, comments: [], affectedServices: data.affectedServices || [],
      sla: data.sla || 24
    };
    this._incidents.next([inc, ...this._incidents.getValue()]);
    return id;
  }

  update(id: string, data: Partial<Incident>): void {
    const now = new Date().toISOString();
    this._incidents.next(this._incidents.getValue().map(i =>
      i.id !== id ? i : { ...i, ...data, updatedAt: now,
        resolvedAt: (data.status === 'resolved' || data.status === 'closed') && !i.resolvedAt ? now : i.resolvedAt }
    ));
  }

  addComment(id: string, text: string, user: string): void {
    const now = new Date().toISOString();
    const comment: IncidentComment = {
      id: `c${Date.now()}`, time: now, user, text
    };
    this._incidents.next(this._incidents.getValue().map(i =>
      i.id !== id ? i : { ...i, updatedAt: now, comments: [...i.comments, comment] }
    ));
  }
}
