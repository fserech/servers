import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SystemUser, SYSTEM_USERS } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _users = new BehaviorSubject<SystemUser[]>(SYSTEM_USERS);
  users$ = this._users.asObservable();

  getAll() { return this._users.getValue(); }
  getById(id: string) { return this._users.getValue().find(u => u.id === id); }
  getActive() { return this._users.getValue().filter(u => u.active); }

  create(data: Partial<SystemUser>): void {
    const id = `USR-${String(this._users.getValue().length + 1).padStart(3,'0')}`;
    const user: SystemUser = {
      id, name: data.name!, email: data.email!, role: data.role || 'readonly',
      department: data.department!, avatar: data.name!.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase(),
      active: true, lastLogin: '—', createdAt: new Date().toISOString(),
      mfaEnabled: false, loginCount: 0, permissions: []
    };
    this._users.next([...this._users.getValue(), user]);
  }

  update(id: string, data: Partial<SystemUser>): void {
    this._users.next(this._users.getValue().map(u => u.id !== id ? u : { ...u, ...data }));
  }

  toggleActive(id: string): void {
    this._users.next(this._users.getValue().map(u => u.id !== id ? u : { ...u, active: !u.active }));
  }
}
