import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Subscription } from 'rxjs';
import { ServerService } from '../../services/server.service';
import { FortigateService } from '../../services/fortigate.service';

interface TermLine { type: 'prompt'|'output'|'error'|'success'|'warn'|'sys'; text: string; }

@Component({ selector: 'app-terminal', templateUrl: './terminal.component.html' })
export class TerminalComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('termBody') termBody!: ElementRef;
  @ViewChild('termInput') termInput!: ElementRef;

  lines: TermLine[] = [
    { type: 'sys', text: 'Sistema de Control de Infraestructura TI  v2.1.0' },
    { type: 'sys', text: 'Sesión autenticada — Carlos Méndez [ADMIN]  AES-256' },
    { type: 'sys', text: 'Escriba <span style="color:#00d4ff">help</span> para ver comandos disponibles.' },
  ];
  input = '';
  history: string[] = [];
  histIdx = -1;
  private sub!: Subscription;

  constructor(private serverSvc: ServerService, private fortiSvc: FortigateService) {}
  ngOnInit() {}
  ngOnDestroy() { this.sub?.unsubscribe(); }
  ngAfterViewChecked() {
    if (this.termBody) this.termBody.nativeElement.scrollTop = this.termBody.nativeElement.scrollHeight;
  }

  exec(cmd: string): void {
    const parts = cmd.trim().split(' ');
    const c = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toUpperCase();
    this.lines.push({ type: 'prompt', text: cmd });

    const servers = this.serverSvc.getServers();
    const policies = this.fortiSvc.getPolicies();

    if (c === 'clear') { this.lines = [{ type: 'sys', text: 'Terminal limpiada.' }]; return; }

    if (c === 'help') {
      this.lines.push({ type: 'output', text: `<span style="color:#00d4ff">Comandos disponibles:</span>
  <span style="color:#7ec8ff">status</span>          Estado de todos los servidores
  <span style="color:#7ec8ff">ping [ip]</span>       Ping a un servidor
  <span style="color:#7ec8ff">info [id]</span>       Detalles de servidor  (ej: info SRV-001)
  <span style="color:#7ec8ff">top</span>             Servidores con mayor uso de CPU
  <span style="color:#7ec8ff">alerts</span>          Alertas activas de recursos
  <span style="color:#7ec8ff">uptime</span>          Tiempo activo por servidor
  <span style="color:#7ec8ff">forti [pol-id]</span>  Ver política FortiGate
  <span style="color:#7ec8ff">clear</span>           Limpiar terminal` }); return;
    }

    if (c === 'status') {
      this.lines.push({ type: 'output', text: servers.map(s =>
        `<span style="color:${s.status==='active'?'#00ff88':'#ff3535'}">${s.status==='active'?'●':'○'}</span> <span style="color:#7ec8ff">${s.id}</span>  ${s.hostname.padEnd(24)}${s.ip.padEnd(18)}<span style="color:${s.status==='active'?'#00ff88':'#ff3535'}">${s.status.toUpperCase()}</span>`
      ).join('\n') }); return;
    }

    if (c === 'uptime') {
      const actv = servers.filter(s => s.status === 'active');
      this.lines.push({ type: 'output', text: actv.map(s =>
        `<span style="color:#7ec8ff">${s.id}</span>  ${s.hostname.padEnd(24)}<span style="color:#f59e0b">↑ ${s.uptime}</span>`
      ).join('\n') }); return;
    }

    if (c === 'top') {
      const sorted = [...servers].filter(s => s.status === 'active').sort((a, b) => b.cpu - a.cpu);
      this.lines.push({ type: 'output', text:
        `<span style="color:#445">ID         HOSTNAME                 CPU    RAM    NET Kbps</span>\n` +
        sorted.map(s =>
          `<span style="color:#7ec8ff">${s.id}</span>  ${s.hostname.padEnd(24)}<span style="color:${s.cpu>75?'#ff3535':'#00ff88'}">${(s.cpu+'%').padEnd(7)}</span><span style="color:#a78bfa">${(s.ram+'%').padEnd(7)}</span>${s.net}`
        ).join('\n') }); return;
    }

    if (c === 'alerts') {
      const alerts = servers.filter(s => s.status === 'active' && (s.cpu > 80 || s.ram > 80));
      if (!alerts.length) { this.lines.push({ type: 'success', text: '✓ Sin alertas activas.' }); return; }
      this.lines.push({ type: 'warn', text: alerts.map(s =>
        `⚠ ${s.id} ${s.hostname}:${s.cpu > 80 ? ` CPU ${s.cpu}%` : ''}${s.ram > 80 ? ` RAM ${s.ram}%` : ''}`
      ).join('\n') }); return;
    }

    if (c === 'ping') {
      const ip = parts[1] || '';
      const s = servers.find(x => x.ip === ip);
      if (!s) { this.lines.push({ type: 'error', text: `ping: ${ip}: No encontrado en inventario` }); return; }
      if (s.status !== 'active') { this.lines.push({ type: 'warn', text: `PING ${ip}: Request timeout — servidor INACTIVO` }); return; }
      const ms1 = (Math.random() * 9 + 1).toFixed(1), ms2 = (Math.random() * 9 + 1).toFixed(1);
      this.lines.push({ type: 'output', text:
        `PING ${ip} (${s.hostname}): 56 bytes de datos.\n64 bytes de ${ip}: icmp_seq=0 ttl=64 <span style="color:#00ff88">tiempo=${ms1} ms</span>\n64 bytes de ${ip}: icmp_seq=1 ttl=64 <span style="color:#00ff88">tiempo=${ms2} ms</span>\n<span style="color:#445">— 2 transmitidos, 2 recibidos, 0% pérdida</span>`
      }); return;
    }

    if (c === 'info') {
      const s = servers.find(x => x.id === arg);
      if (!s) { this.lines.push({ type: 'error', text: `info: ${arg}: No encontrado` }); return; }
      this.lines.push({ type: 'output', text:
        `<span style="color:#00d4ff">══ ${s.hostname} (${s.id}) ══</span>\nIP: ${s.ip}  MAC: ${s.mac}  OS: ${s.os}\nUbicación: ${s.location}  Solicitante: ${s.requestedBy}\nEstado: <span style="color:${s.status==='active'?'#00ff88':'#ff3535'}">${s.status.toUpperCase()}</span>${s.status==='active'?`  CPU:${s.cpu}%  RAM:${s.ram}%  Uptime:${s.uptime}`:'\nApagado: '+(s.shutdownReason||'N/A')}`
      }); return;
    }

    if (c === 'forti') {
      const pol = policies.find(x => x.id === arg);
      if (!pol) { this.lines.push({ type: 'error', text: `forti: ${arg}: No encontrada. Ej: forti POL-DB-001` }); return; }
      this.lines.push({ type: 'output', text:
        `<span style="color:#f59e0b">══ FortiGate Policy: ${pol.id} ══</span>\nNombre: ${pol.name}\nAcción: <span style="color:${pol.action==='ALLOW'?'#00ff88':'#ff3535'}">${pol.action}</span>  Estado: ${pol.status}\nSrc: ${pol.srcAddr} [${pol.srcZone}] → Dst: ${pol.dstAddr} [${pol.dstZone}]\nServicio: ${pol.service}\nIPS: ${pol.ipsProfile}  Log: ${pol.logTraffic?'ON':'OFF'}\nHits: ${pol.hits.toLocaleString()}`
      }); return;
    }

    this.lines.push({ type: 'error', text: `${c}: comando no reconocido. Escriba 'help'.` });
  }

  onKey(e: KeyboardEvent): void {
    if (e.key === 'Enter' && this.input.trim()) {
      this.exec(this.input); this.history.unshift(this.input); this.histIdx = -1; this.input = '';
    } else if (e.key === 'ArrowUp') {
      this.histIdx = Math.min(this.histIdx + 1, this.history.length - 1);
      this.input = this.history[this.histIdx] || '';
    } else if (e.key === 'ArrowDown') {
      this.histIdx = Math.max(this.histIdx - 1, -1);
      this.input = this.histIdx === -1 ? '' : this.history[this.histIdx] || '';
    }
  }

  quickRun(cmd: string) { this.exec(cmd); this.history.unshift(cmd); }
  focus() { this.termInput?.nativeElement?.focus(); }
}
