import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import { Server, INITIAL_SERVERS, ServerLog } from '../models/server.model';

@Injectable({ providedIn: 'root' })
export class ServerService {
  private _servers = new BehaviorSubject<Server[]>(
    INITIAL_SERVERS.map(s => ({
      ...s,
      cpuHistory: Array.from({ length: 30 }, () => Math.max(s.cpu + Math.floor(Math.random() * 16 - 8), 2)),
      ramHistory: Array.from({ length: 30 }, () => Math.max(s.ram + Math.floor(Math.random() * 10 - 5), 5)),
      netHistory: Array.from({ length: 30 }, () => Math.max(s.net + Math.floor(Math.random() * 200 - 100), 0)),
    }))
  );

  servers$ = this._servers.asObservable();
  currentUser = 'Carlos Méndez';

  constructor() {
    // Realistic simulation: time-based patterns
    interval(2500).subscribe(() => {
      const hour = new Date().getHours();
      // Business hours (8-18): higher base load; nights: lower
      const loadFactor = (hour >= 8 && hour <= 18) ? 1 : 0.5;

      const updated = this._servers.getValue().map(s => {
        if (s.status !== 'active' && s.status !== 'critical') return s;
        const vary = (v: number, d: number, mn = 0, mx = 100) =>
          Math.min(mx, Math.max(mn, v + Math.floor((Math.random() * d * 2 - d) * loadFactor)));

        const nc = vary(s.cpu, 4), nr = vary(s.ram, 2.5), nn = vary(s.net, 120, 0, 5000);
        const nt = vary(s.temp, 1, 25, 95);
        // Critical servers stay high
        const finalCpu = s.status === 'critical' ? Math.min(99, Math.max(80, nc)) : nc;
        const finalRam = s.status === 'critical' ? Math.min(99, Math.max(82, nr)) : nr;
        const newStatus = (finalCpu >= 90 || finalRam >= 90) && s.status !== 'critical'
          ? 'critical' as const
          : (finalCpu < 85 && finalRam < 85 && s.status === 'critical' ? 'active' as const : s.status);

        return {
          ...s, cpu: finalCpu, ram: finalRam, net: nn, temp: nt,
          status: newStatus,
          netIn: Math.floor(nn * 0.6), netOut: Math.floor(nn * 0.4),
          cpuHistory: [...s.cpuHistory.slice(1), finalCpu],
          ramHistory: [...s.ramHistory.slice(1), finalRam],
          netHistory: [...s.netHistory.slice(1), nn],
        };
      });
      this._servers.next(updated);
    });
  }

  getServers(): Server[] { return this._servers.getValue(); }
  getById(id: string): Server | undefined { return this._servers.getValue().find(s => s.id === id); }

  createServer(data: Partial<Server>): string {
    const id = `SRV-${String(Math.floor(Math.random() * 900) + 100).padStart(3,'0')}`;
    const now = new Date().toISOString();
    const server: Server = {
      id, hostname: data.hostname!, ip: data.ip!, mac: data.mac!,
      location: data.location!, os: data.os!, os_version: '', kernel: '',
      requestedBy: data.requestedBy!, department: data.department!,
      purpose: data.purpose || '',
      status: 'active', environment: data.environment || 'production',
      type: data.type || 'other',
      createdAt: now, lastSeen: now,
      cpu: 5, ram: 18, disk: 10, net: 60,
      uptime: '0d 0h 0m', uptimeSecs: 0, temp: 32,
      loadAvg: [0.1, 0.1, 0.1], openPorts: [22],
      vcpus: data.vcpus || 2, ramTotal: data.ramTotal || 8, diskTotal: data.diskTotal || 100,
      netIn: 30, netOut: 30,
      shutdownReason: null, shutdownBy: null, shutdownAt: null,
      logs: [{ time: now, event: 'Servidor registrado en inventario', user: data.requestedBy!, type: 'create' }],
      services: ['ssh'], fortiPolicy: null,
      cpuHistory: Array(30).fill(5), ramHistory: Array(30).fill(18), netHistory: Array(30).fill(60),
      sshEnabled: true, tags: []
    };
    this._servers.next([server, ...this._servers.getValue()]);
    return id;
  }

  updateServer(id: string, data: Partial<Server>): void {
    const now = new Date().toISOString();
    this._servers.next(this._servers.getValue().map(s =>
      s.id !== id ? s : {
        ...s, ...data,
        logs: [...s.logs, { time: now, event: 'Datos del servidor editados', user: this.currentUser, type: 'edit' as const }]
      }
    ));
  }

  shutdownServer(id: string, reason: string): void {
    const now = new Date().toISOString();
    this._servers.next(this._servers.getValue().map(s =>
      s.id !== id ? s : {
        ...s, status: 'inactive' as const, cpu: 0, ram: 0, net: 0, temp: 0, loadAvg: [0,0,0] as [number,number,number],
        shutdownReason: reason, shutdownBy: this.currentUser, shutdownAt: now, uptime: '—',
        logs: [...s.logs, { time: now, event: `Apagado — ${reason}`, user: this.currentUser, type: 'shutdown' as const }]
      }
    ));
  }

  activateServer(id: string): void {
    const now = new Date().toISOString();
    this._servers.next(this._servers.getValue().map(s =>
      s.id !== id ? s : {
        ...s, status: 'active' as const, cpu: 8, ram: 20, net: 80, temp: 34, loadAvg: [0.2,0.2,0.1] as [number,number,number],
        shutdownReason: null, shutdownBy: null, shutdownAt: null,
        lastSeen: now, uptime: '0d 0h 0m', uptimeSecs: 0,
        cpuHistory: Array(30).fill(8), ramHistory: Array(30).fill(20), netHistory: Array(30).fill(80),
        logs: [...s.logs, { time: now, event: 'Servidor reactivado', user: this.currentUser, type: 'activate' as const }]
      }
    ));
  }

  deleteServer(id: string): void {
    this._servers.next(this._servers.getValue().filter(s => s.id !== id));
  }

  getAllLogs(): (ServerLog & { hostname: string; serverId: string })[] {
    return this._servers.getValue()
      .flatMap(s => s.logs.map(l => ({ ...l, hostname: s.hostname, serverId: s.id })))
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  }
}
