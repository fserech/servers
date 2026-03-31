import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { SystemUser } from '../../models/user.model';

@Component({ selector: 'app-users', templateUrl: './users.component.html' })
export class UsersComponent implements OnInit, OnDestroy {
  users: SystemUser[] = [];
  selected: SystemUser | null = null;
  showNew = false;
  newModel: Partial<SystemUser> = { role: 'readonly' };
  private sub!: Subscription;
  roles = ['admin','operator','auditor','readonly'];
  departments = ['TI','Desarrollo','Infraestructura','Seguridad TI','Administración'];

  constructor(private userSvc: UserService, private toastSvc: ToastService) {}
  ngOnInit() { this.sub = this.userSvc.users$.subscribe(u => { this.users = u; if (this.selected) this.selected = u.find(x=>x.id===this.selected!.id)||null; }); }
  ngOnDestroy() { this.sub?.unsubscribe(); }

  roleColor(r: string) { return r==='admin'?'var(--ac-red)':r==='operator'?'var(--ac-blue)':r==='auditor'?'var(--ac-amber)':'var(--tx-4)'; }
  roleBg(r: string)    { return r==='admin'?'var(--tint-red-bg)':r==='operator'?'var(--tint-blue-bg)':r==='auditor'?'var(--tint-amber-bg)':'var(--bg-sunken)'; }
  roleLabel(r: string) { return r==='admin'?'Administrador':r==='operator'?'Operador':r==='auditor'?'Auditor':'Solo Lectura'; }
  fmtDate(d: string)   { if (!d || d==='—') return '—'; return new Date(d).toLocaleString('es-GT', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }); }

  get activeCount() { return this.users.filter(u=>u.active).length; }
  get mfaCount() { return this.users.filter(u=>u.mfaEnabled).length; }
  get adminCount() { return this.users.filter(u=>u.role==='admin').length; }
  createUser() {
    this.userSvc.create(this.newModel);
    this.showNew = false;
    this.newModel = { role: 'readonly' };
    this.toastSvc.show('Usuario creado exitosamente');
  }

  toggleActive(u: SystemUser) {
    this.userSvc.toggleActive(u.id);
    this.toastSvc.show(`Usuario ${u.active ? 'desactivado' : 'activado'}`);
  }
}
