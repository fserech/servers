import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({ selector: 'app-new-server-modal', templateUrl: './new-server-modal.component.html' })
export class NewServerModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() create = new EventEmitter<any>();

  locations = ['Rack A · U1','Rack A · U3','Rack A · U7','Rack B · U1','Rack B · U4','Rack C · U2','Rack D · U1'];
  osList = ['Ubuntu 22.04 LTS','Rocky Linux 9','Debian 12','AlmaLinux 9','Windows Server 2022','CentOS Stream 9'];
  departments = ['TI','Desarrollo','Infraestructura','Seguridad TI','Administración'];
  users = ['Carlos Méndez','Ana Torres','Roberto Sánchez','M. Fernanda Ruiz','Luis González'];

  model = { hostname:'', ip:'', mac:'', location:'Rack A · U3', os:'Ubuntu 22.04 LTS', requestedBy:'Carlos Méndez', department:'TI', purpose:'' };

  submit() {
    if (!this.model.hostname || !this.model.ip || !this.model.mac) return;
    this.create.emit({ ...this.model });
  }
}
