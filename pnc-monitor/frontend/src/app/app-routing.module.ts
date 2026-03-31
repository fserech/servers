import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ServerListComponent } from './components/server-list/server-list.component';
import { ServerDetailComponent } from './components/server-detail/server-detail.component';
import { FortigateComponent } from './components/fortigate/fortigate.component';
import { TerminalComponent } from './components/terminal/terminal.component';
import { AuditComponent } from './components/audit/audit.component';
import { IncidentsComponent } from './components/incidents/incidents.component';
import { UsersComponent } from './components/users/users.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { MonitorDashboardComponent } from './components/monitor-dashboard/monitor-dashboard.component';
import { MonitorDetailComponent } from './components/monitor-detail/monitor-detail.component';
import { ReportsComponent } from './components/reports/reports.component';

const routes: Routes = [
  { path: '',          redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'servers',   component: ServerListComponent },
  { path: 'servers/:id', component: ServerDetailComponent },
  { path: 'incidents', component: IncidentsComponent },
  { path: 'alerts',    component: AlertsComponent },
  { path: 'fortigate', component: FortigateComponent },
  { path: 'users',     component: UsersComponent },
  { path: 'reports',   component: ReportsComponent },
  { path: 'terminal',  component: TerminalComponent },
  { path: 'monitor',    component: MonitorDashboardComponent },
  { path: 'monitor/:id', component: MonitorDetailComponent },
  { path: 'audit',     component: AuditComponent },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
