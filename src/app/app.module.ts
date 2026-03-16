import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ServerListComponent } from './components/server-list/server-list.component';
import { ServerDetailComponent } from './components/server-detail/server-detail.component';
import { FortigateComponent } from './components/fortigate/fortigate.component';
import { TerminalComponent } from './components/terminal/terminal.component';
import { AuditComponent } from './components/audit/audit.component';
import { HeaderComponent } from './components/header/header.component';
import { NewServerModalComponent } from './components/modals/new-server-modal/new-server-modal.component';
import { ShutdownModalComponent } from './components/modals/shutdown-modal/shutdown-modal.component';
import { EditServerModalComponent } from './components/modals/edit-server-modal/edit-server-modal.component';
import { IncidentsComponent } from './components/incidents/incidents.component';
import { UsersComponent } from './components/users/users.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { ReportsComponent } from './components/reports/reports.component';

@NgModule({
  declarations: [
    AppComponent, DashboardComponent, ServerListComponent,
    ServerDetailComponent, FortigateComponent, TerminalComponent,
    AuditComponent, HeaderComponent, NewServerModalComponent,
    ShutdownModalComponent, EditServerModalComponent,
    IncidentsComponent, UsersComponent, AlertsComponent, ReportsComponent
  ],
  imports: [BrowserModule, AppRoutingModule, RouterModule, FormsModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
