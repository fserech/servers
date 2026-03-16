export type IncidentPriority = 'critical' | 'high' | 'medium' | 'low';
export type IncidentStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type IncidentCategory = 'hardware' | 'software' | 'network' | 'security' | 'performance' | 'planned';

export interface IncidentComment {
  id: string;
  time: string;
  user: string;
  text: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  serverId: string | null;
  serverName: string;
  priority: IncidentPriority;
  status: IncidentStatus;
  category: IncidentCategory;
  assignedTo: string;
  reportedBy: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  eta: string | null;
  comments: IncidentComment[];
  affectedServices: string[];
  sla: number; // hours
}

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-0042', title: 'CPU crítico en servidor de correo',
    description: 'El servidor mail-relay-01 presenta CPU al 87% y RAM al 91%. Posible ataque de spam o proceso zombie. Impacto en entrega de correos institucionales.',
    serverId: 'SRV-006', serverName: 'mail-relay-01',
    priority: 'critical', status: 'in_progress', category: 'performance',
    assignedTo: 'Carlos Méndez', reportedBy: 'Sistema (auto-detect)',
    createdAt: '2025-03-12T06:15:00', updatedAt: '2025-03-12T06:45:00',
    resolvedAt: null, eta: '2025-03-12T09:00:00',
    comments: [
      { id: 'c1', time: '2025-03-12T06:18:00', user: 'Sistema', text: 'Alerta automática generada por umbral CPU > 85%' },
      { id: 'c2', time: '2025-03-12T06:45:00', user: 'Carlos Méndez', text: 'Revisando procesos activos. Identificado proceso spamassassin consumiendo excesivos recursos. Reiniciando servicio.' },
    ],
    affectedServices: ['postfix', 'dovecot', 'spamassassin'],
    sla: 4
  },
  {
    id: 'INC-0041', title: 'Servidor de backup fuera de línea — mantenimiento',
    description: 'backup-stor-02 puesto en mantenimiento programado para reemplazo de 4 discos duros en RAID 6. Estimado 48h de downtime.',
    serverId: 'SRV-003', serverName: 'backup-stor-02',
    priority: 'medium', status: 'in_progress', category: 'planned',
    assignedTo: 'Roberto Sánchez', reportedBy: 'Roberto Sánchez',
    createdAt: '2025-01-08T22:00:00', updatedAt: '2025-01-09T10:00:00',
    resolvedAt: null, eta: '2025-01-12T14:00:00',
    comments: [
      { id: 'c3', time: '2025-01-08T22:00:00', user: 'Roberto Sánchez', text: 'Inicio de mantenimiento programado. Discos en camino.' },
      { id: 'c4', time: '2025-01-09T10:00:00', user: 'Roberto Sánchez', text: 'Discos instalados. Reconstrucción RAID en progreso (ETA 6h).' },
    ],
    affectedServices: ['rsync', 'samba'],
    sla: 72
  },
  {
    id: 'INC-0040', title: 'Fallo de autenticación SSH masivo en SRV-002',
    description: 'Se detectaron 847 intentos fallidos de SSH en 10 minutos desde IP 45.33.32.156. Posible ataque de fuerza bruta. fail2ban activado automáticamente.',
    serverId: 'SRV-002', serverName: 'web-app-prod-01',
    priority: 'high', status: 'resolved', category: 'security',
    assignedTo: 'M. Fernanda Ruiz', reportedBy: 'Sistema (auto-detect)',
    createdAt: '2025-03-10T14:30:00', updatedAt: '2025-03-10T15:15:00',
    resolvedAt: '2025-03-10T15:15:00', eta: null,
    comments: [
      { id: 'c5', time: '2025-03-10T14:30:00', user: 'Sistema', text: 'fail2ban bloqueó IP 45.33.32.156 automáticamente.' },
      { id: 'c6', time: '2025-03-10T15:15:00', user: 'M. Fernanda Ruiz', text: 'IP agregada a lista negra permanente en FortiGate. Incidente resuelto.' },
    ],
    affectedServices: ['ssh'],
    sla: 8
  },
  {
    id: 'INC-0039', title: 'Actualización de kernel programada — SRV-001',
    description: 'Actualización de seguridad de kernel en db-primary-01. Requiere reinicio. Programado en ventana de mantenimiento nocturna.',
    serverId: 'SRV-001', serverName: 'db-primary-01',
    priority: 'low', status: 'closed', category: 'planned',
    assignedTo: 'Carlos Méndez', reportedBy: 'Carlos Méndez',
    createdAt: '2025-01-09T08:00:00', updatedAt: '2025-01-10T02:30:00',
    resolvedAt: '2025-01-10T02:30:00', eta: null,
    comments: [
      { id: 'c7', time: '2025-01-10T01:00:00', user: 'Carlos Méndez', text: 'Iniciando actualización en ventana nocturna.' },
      { id: 'c8', time: '2025-01-10T02:30:00', user: 'Carlos Méndez', text: 'Actualización completada. Kernel 6.2.0-37 instalado. DB online.' },
    ],
    affectedServices: ['postgresql-15'],
    sla: 24
  }
];
