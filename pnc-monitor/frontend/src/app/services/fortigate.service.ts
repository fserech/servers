import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FortiPolicy, INITIAL_POLICIES } from '../models/policy.model';

@Injectable({ providedIn: 'root' })
export class FortigateService {
  private _policies = new BehaviorSubject<FortiPolicy[]>(INITIAL_POLICIES);
  policies$ = this._policies.asObservable();

  getPolicies(): FortiPolicy[] { return this._policies.getValue(); }
  getById(id: string): FortiPolicy | undefined { return this._policies.getValue().find(p => p.id === id); }

  togglePolicy(id: string): void {
    this._policies.next(
      this._policies.getValue().map(p =>
        p.id === id ? { ...p, status: p.status === 'enabled' ? 'disabled' : 'enabled' } : p
      )
    );
  }
}
