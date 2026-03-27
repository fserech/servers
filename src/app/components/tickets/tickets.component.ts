import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ServerService } from '../../services/server.service';
import { ToastService } from '../../services/toast.service';
import { Server, Ticket } from '../../models/server.model';

@Component({ selector: 'app-tickets', templateUrl: './tickets.component.html' })
export class TicketsComponent implements OnInit, OnDestroy {
  tickets: Ticket[]  = [];
  servers: Server[]  = [];
  selected: Ticket | null = null;
  showNew = false;
  comment = '';
  filterStatus = 'all';
  private subs: Subscription[] = [];

  newTicket = { title:'', serverId:'', serverIp:'', priority:'medium' as Ticket['priority'], category:'Hardware', description:'', assignedTo:'Gerson Cabrera Rivera' };
  categories = ['Hardware','Software','Red','Almacenamiento','Rendimiento','Acceso','Seguridad','Mantenimiento'];
  users = ['Gerson Cabrera Rivera','Willian Ortiz Cruz','Axel Onelio Ramirez Muñoz','Edwin Marroquin Mota','Christian Catu','Jairo Castillo'];

  get filtered() {
    return (this.filterStatus === 'all' ? this.tickets : this.tickets.filter(t => t.status === this.filterStatus))
      .sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  get selectedComments(): any[] {
    if (!this.selected) return [];
    const t = this.tickets.find(x => x.id === this.selected!.id) as any;
    return t?.comments || [];
  }

  get selectedCommentsCount(): number { return this.selectedComments.length; }

  prioColor(p: string)   { return p==='critical'?'red':p==='high'?'amber':p==='medium'?'blue':'green'; }
  statusColor(s: string) { return s==='open'?'red':s==='in-progress'?'amber':s==='resolved'?'green':'gray'; }
  statusLabel(s: string) { return s==='open'?'ABIERTO':s==='in-progress'?'EN PROGRESO':s==='resolved'?'RESUELTO':'CERRADO'; }
  fmtDate(d: string)     { return new Date(d).toLocaleString('es-GT',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}); }

  constructor(public svc: ServerService, private toast: ToastService) {}

  ngOnInit() {
    this.subs.push(
      this.svc.tickets$.subscribe(t => {
        this.tickets = t;
        if (this.selected) this.selected = t.find(x => x.id === this.selected!.id) || this.selected;
      }),
      this.svc.servers$.subscribe(s => this.servers = s),
    );
  }
  ngOnDestroy() { this.subs.forEach(s => s.unsubscribe()); }

  selectServer() {
    const srv = this.servers.find(s => s.id === this.newTicket.serverId);
    this.newTicket.serverIp = srv?.ip || '';
  }

  createTicket() {
    if (!this.newTicket.title || !this.newTicket.serverId) return;
    this.svc.createTicket({ ...this.newTicket, status: 'open' });
    this.toast.show('Ticket creado', 'success');
    this.showNew = false;
    this.newTicket = { title:'', serverId:'', serverIp:'', priority:'medium', category:'Hardware', description:'', assignedTo:'Gerson Cabrera Rivera' };
  }

  updateStatus(id: string, status: Ticket['status']) {
    this.svc.updateTicketStatus(id, status);
    this.toast.show('Estado actualizado', 'success');
  }

  addComment() {
    if (!this.comment.trim() || !this.selected) return;
    this.svc.addTicketComment(this.selected.id, 'Gerson Cabrera Rivera', this.comment);
    this.comment = '';
  }
}
