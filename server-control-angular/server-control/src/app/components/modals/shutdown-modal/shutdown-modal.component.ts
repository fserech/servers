import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Server } from '../../../models/server.model';

@Component({ selector: 'app-shutdown-modal', templateUrl: './shutdown-modal.component.html' })
export class ShutdownModalComponent {
  @Input() server!: Server;
  @Output() close = new EventEmitter<void>();
  @Output() shutdown = new EventEmitter<{ reason: string }>();

  reasons = ['Mantenimiento programado','Fallo de hardware','Vulnerabilidad de seguridad','Actualización de SO / Firmware','Descomisionado','Migración de carga','Ahorro energético','Incidente de seguridad','Otro'];
  selectedReason = 'Mantenimiento programado';
  detail = '';

  confirm() {
    const reason = this.detail ? `${this.selectedReason} — ${this.detail}` : this.selectedReason;
    this.shutdown.emit({ reason });
  }
}
