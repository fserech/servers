import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Server } from '../../../models/server.model';

@Component({
  selector: 'app-edit-server-modal',
  templateUrl: './edit-server-modal.component.html'
})
export class EditServerModalComponent implements OnInit {
  @Input() server!: Server;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Partial<Server>>();

  locations = ['Rack A · U1','Rack A · U3','Rack A · U7','Rack B · U1','Rack B · U4','Rack C · U2','Rack D · U1'];
  osList = ['Ubuntu 22.04 LTS','Rocky Linux 9','Debian 12','AlmaLinux 9','Windows Server 2022','CentOS Stream 9'];
  departments = ['TI','Desarrollo','Infraestructura','Seguridad TI','Administración'];
  users = ['Carlos Méndez','Ana Torres','Roberto Sánchez','M. Fernanda Ruiz','Luis González'];
  policies = ['POL-DB-001','POL-WEB-002','POL-BAK-003','POL-SEC-004','POL-DNS-005',''];

  model: Partial<Server> = {};

  ngOnInit(): void {
    this.model = {
      hostname: this.server.hostname,
      ip: this.server.ip,
      mac: this.server.mac,
      location: this.server.location,
      os: this.server.os,
      requestedBy: this.server.requestedBy,
      department: this.server.department,
      purpose: this.server.purpose,
      fortiPolicy: this.server.fortiPolicy || ''
    };
  }

  submit(): void {
    if (!this.model.hostname || !this.model.ip || !this.model.mac) return;
    this.save.emit({ ...this.model });
  }
}
