import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ThemeService } from '../../services/theme.service';
import { AlertService } from '../../services/alert.service';
import { IncidentService } from '../../services/incident.service';

@Component({ selector: 'app-header', templateUrl: './header.component.html' })
export class HeaderComponent implements OnInit, OnDestroy {
  currentPath = '';
  activeAlerts = 0;
  openIncidents = 0;
  menuOpen = false;
  private subs: Subscription[] = [];

  navGroups = [
    {
      label: 'OPERACIONES',
      icon: '⬡',
      links: [
        { path: 'monitor',    label: 'Monitor',    icon: '📡', badge: '' },
        { path: 'dashboard',  label: 'Dashboard',   icon: '▦' },
        { path: 'servers',    label: 'Servidores',  icon: '🖥', badge: '' },
        { path: 'incidents',  label: 'Incidentes',  icon: '🚨', badge: 'incidents' },
        { path: 'alerts',     label: 'Alertas',     icon: '⚠',  badge: 'alerts' },
      ]
    },
    {
      label: 'SEGURIDAD',
      icon: '🛡',
      links: [
        { path: 'fortigate', label: 'FortiGate',  icon: '🔥' },
        { path: 'terminal',  label: 'Terminal',   icon: '>' },
      ]
    },
    {
      label: 'GESTIÓN',
      icon: '◈',
      links: [
        { path: 'users',   label: 'Usuarios',  icon: '👥' },
        { path: 'reports', label: 'Reportes',  icon: '📊' },
        { path: 'audit',   label: 'Auditoría', icon: '📋' },
      ]
    }
  ];

  constructor(
    public themeSvc: ThemeService,
    private router: Router,
    private alertSvc: AlertService,
    private incSvc: IncidentService
  ) {}

  ngOnInit() {
    this.subs.push(
      this.router.events.pipe(filter(e => e instanceof NavigationEnd))
        .subscribe((e: any) => {
          this.currentPath = e.urlAfterRedirects.split('/')[1];
          this.menuOpen = false; // close on navigation
        }),
      this.alertSvc.events$.subscribe(evts => this.activeAlerts = evts.filter(e => e.state === 'active').length),
      this.incSvc.incidents$.subscribe(inc => this.openIncidents = inc.filter(i => i.status === 'open' || i.status === 'in_progress').length)
    );
    this.currentPath = this.router.url.split('/')[1] || 'dashboard';
  }
  ngOnDestroy() { this.subs.forEach(s => s.unsubscribe()); }

  @HostListener('document:keydown.escape')
  onEsc() { this.menuOpen = false; }

  isActive(path: string) { return this.currentPath === path; }

  navigate(path: string) {
    this.router.navigate([path]);
    this.menuOpen = false;
  }

  getBadgeCount(badge: string): number {
    if (badge === 'alerts')    return this.activeAlerts;
    if (badge === 'incidents') return this.openIncidents;
    return 0;
  }

  get currentLabel(): string {
    for (const g of this.navGroups)
      for (const l of g.links)
        if (l.path === this.currentPath) return l.label;
    return 'Dashboard';
  }
}
