export interface ServerLog {
  time: string;
  event: string;
  user: string;
  type: 'create' | 'shutdown' | 'activate' | 'info' | 'alert' | 'edit';
}

export interface Server {
  id: string;
  hostname: string;
  ip: string;
  mac: string;
  location: string;
  os: string;
  requestedBy: string;
  department: string;
  purpose: string;
  status: 'active' | 'inactive' | 'maintenance' | 'critical';
  environment: 'production' | 'staging' | 'development' | 'backup';
  type: 'web' | 'database' | 'backup' | 'security' | 'dns' | 'mail' | 'file' | 'other';
  createdAt: string;
  lastSeen: string;
  cpu: number;
  ram: number;
  disk: number;
  net: number;
  uptime: string;
  uptimeSecs: number;
  temp: number;
  loadAvg: [number, number, number];
  openPorts: number[];
  shutdownReason: string | null;
  shutdownBy: string | null;
  shutdownAt: string | null;
  logs: ServerLog[];
  services: string[];
  fortiPolicy: string | null;
  cpuHistory: number[];
  ramHistory: number[];
  netHistory: number[];
  netIn: number;
  netOut: number;
  sshEnabled: boolean;
  os_version: string;
  kernel: string;
  vcpus: number;
  ramTotal: number;  // GB
  diskTotal: number; // GB
  tags: string[];
}

export const INITIAL_SERVERS: Server[] = [
  {
    id: 'SRV-001', hostname: 'db-primary-01', ip: '192.168.10.11',
    mac: '00:1A:2B:3C:4D:5E', location: 'Rack A · U3', os: 'Ubuntu 22.04 LTS',
    os_version: '22.04.3', kernel: '6.2.0-37-generic',
    requestedBy: 'Carlos Méndez', department: 'TI',
    purpose: 'Base de datos PostgreSQL principal — ERP institucional',
    status: 'active', environment: 'production', type: 'database',
    createdAt: '2024-11-15T08:30:00', lastSeen: new Date().toISOString(),
    cpu: 68, ram: 74, disk: 45, net: 820, uptime: '47d 3h 22m', uptimeSecs: 4083720,
    temp: 62, loadAvg: [2.4, 2.1, 1.9],
    openPorts: [22, 5432, 9100],
    vcpus: 8, ramTotal: 32, diskTotal: 500,
    netIn: 420, netOut: 400,
    shutdownReason: null, shutdownBy: null, shutdownAt: null,
    logs: [
      { time: '2024-11-15T08:30:00', event: 'Servidor registrado en inventario', user: 'Carlos Méndez', type: 'create' },
      { time: '2025-01-10T14:22:00', event: 'Actualización de kernel aplicada', user: 'Carlos Méndez', type: 'info' },
      { time: '2025-02-18T09:10:00', event: 'Alerta CPU superó 85%', user: 'Sistema', type: 'alert' },
    ],
    services: ['postgresql-15', 'node_exporter', 'ssh', 'fail2ban', 'ufw'],
    fortiPolicy: 'POL-DB-001',
    cpuHistory: [], ramHistory: [], netHistory: [],
    sshEnabled: true, tags: ['crítico', 'ERP', 'base-de-datos']
  },
  {
    id: 'SRV-002', hostname: 'web-app-prod-01', ip: '192.168.10.20',
    mac: '00:1A:2B:3C:4D:6F', location: 'Rack A · U7', os: 'Rocky Linux 9',
    os_version: '9.3', kernel: '5.14.0-362.el9',
    requestedBy: 'Ana Torres', department: 'Desarrollo',
    purpose: 'Servidor web producción — Angular + Node.js API',
    status: 'active', environment: 'production', type: 'web',
    createdAt: '2024-12-01T10:00:00', lastSeen: new Date().toISOString(),
    cpu: 42, ram: 55, disk: 60, net: 1240, uptime: '31d 11h 05m', uptimeSecs: 2719500,
    temp: 51, loadAvg: [1.2, 1.4, 1.1],
    openPorts: [22, 80, 443, 3000, 9100],
    vcpus: 4, ramTotal: 16, diskTotal: 200,
    netIn: 840, netOut: 400,
    shutdownReason: null, shutdownBy: null, shutdownAt: null,
    logs: [
      { time: '2024-12-01T10:00:00', event: 'Servidor registrado', user: 'Ana Torres', type: 'create' },
      { time: '2025-01-20T16:30:00', event: 'Deploy v2.4.1 aplicado', user: 'Ana Torres', type: 'info' },
    ],
    services: ['nginx', 'nodejs-18', 'pm2', 'ssh', 'firewalld', 'node_exporter'],
    fortiPolicy: 'POL-WEB-002',
    cpuHistory: [], ramHistory: [], netHistory: [],
    sshEnabled: true, tags: ['producción', 'web', 'API']
  },
  {
    id: 'SRV-003', hostname: 'backup-stor-02', ip: '192.168.10.35',
    mac: '00:1A:2B:3C:4D:7A', location: 'Rack B · U1', os: 'Debian 12',
    os_version: '12.4', kernel: '6.1.0-18-amd64',
    requestedBy: 'Roberto Sánchez', department: 'Infraestructura',
    purpose: 'Almacenamiento y respaldo institucional NAS/Rsync',
    status: 'maintenance', environment: 'backup', type: 'backup',
    createdAt: '2024-09-20T14:00:00', lastSeen: '2025-01-08T23:45:00',
    cpu: 0, ram: 0, disk: 82, net: 0, uptime: '—', uptimeSecs: 0,
    temp: 0, loadAvg: [0, 0, 0],
    openPorts: [22, 445, 873],
    vcpus: 4, ramTotal: 8, diskTotal: 8000,
    netIn: 0, netOut: 0,
    shutdownReason: 'Mantenimiento — Reemplazo de discos duros',
    shutdownBy: 'Roberto Sánchez', shutdownAt: '2025-01-08T23:45:00',
    logs: [
      { time: '2024-09-20T14:00:00', event: 'Servidor registrado', user: 'Roberto Sánchez', type: 'create' },
      { time: '2025-01-08T23:45:00', event: 'Apagado — Mantenimiento programado', user: 'Roberto Sánchez', type: 'shutdown' },
    ],
    services: ['rsync', 'samba', 'ssh'],
    fortiPolicy: 'POL-BAK-003',
    cpuHistory: [], ramHistory: [], netHistory: [],
    sshEnabled: false, tags: ['backup', 'NAS', 'mantenimiento']
  },
  {
    id: 'SRV-004', hostname: 'siem-monitor-01', ip: '192.168.10.50',
    mac: '00:1A:2B:3C:4D:8B', location: 'Rack C · U2', os: 'Rocky Linux 9',
    os_version: '9.3', kernel: '5.14.0-362.el9',
    requestedBy: 'M. Fernanda Ruiz', department: 'Seguridad TI',
    purpose: 'SIEM Wazuh / ELK Stack — Monitoreo centralizado',
    status: 'active', environment: 'production', type: 'security',
    createdAt: '2025-01-10T09:00:00', lastSeen: new Date().toISOString(),
    cpu: 23, ram: 38, disk: 30, net: 456, uptime: '12d 7h 48m', uptimeSecs: 1067280,
    temp: 44, loadAvg: [0.8, 0.9, 0.7],
    openPorts: [22, 1514, 9200, 5601, 514],
    vcpus: 8, ramTotal: 64, diskTotal: 2000,
    netIn: 250, netOut: 206,
    shutdownReason: null, shutdownBy: null, shutdownAt: null,
    logs: [
      { time: '2025-01-10T09:00:00', event: 'Servidor registrado', user: 'M. Fernanda Ruiz', type: 'create' },
    ],
    services: ['wazuh-manager', 'elasticsearch', 'kibana', 'logstash', 'ssh'],
    fortiPolicy: 'POL-SEC-004',
    cpuHistory: [], ramHistory: [], netHistory: [],
    sshEnabled: true, tags: ['SIEM', 'seguridad', 'monitoreo']
  },
  {
    id: 'SRV-005', hostname: 'dns-internal-01', ip: '192.168.10.5',
    mac: '00:1A:2B:3C:4D:9C', location: 'Rack A · U1', os: 'AlmaLinux 9',
    os_version: '9.3', kernel: '5.14.0-362.el9',
    requestedBy: 'Luis González', department: 'TI',
    purpose: 'DNS interno institucional BIND9',
    status: 'active', environment: 'production', type: 'dns',
    createdAt: '2024-08-01T07:00:00', lastSeen: new Date().toISOString(),
    cpu: 12, ram: 28, disk: 18, net: 310, uptime: '89d 2h 15m', uptimeSecs: 7704900,
    temp: 38, loadAvg: [0.3, 0.2, 0.2],
    openPorts: [22, 53],
    vcpus: 2, ramTotal: 4, diskTotal: 100,
    netIn: 160, netOut: 150,
    shutdownReason: null, shutdownBy: null, shutdownAt: null,
    logs: [
      { time: '2024-08-01T07:00:00', event: 'Servidor registrado', user: 'Luis González', type: 'create' },
    ],
    services: ['bind9', 'ssh', 'chrony'],
    fortiPolicy: 'POL-DNS-005',
    cpuHistory: [], ramHistory: [], netHistory: [],
    sshEnabled: true, tags: ['DNS', 'infraestructura', 'crítico']
  },
  {
    id: 'SRV-006', hostname: 'mail-relay-01', ip: '192.168.10.60',
    mac: '00:1A:2B:3C:4D:AA', location: 'Rack B · U4', os: 'Ubuntu 22.04 LTS',
    os_version: '22.04.3', kernel: '6.2.0-37-generic',
    requestedBy: 'Carlos Méndez', department: 'TI',
    purpose: 'Relay SMTP institucional — Postfix + Dovecot',
    status: 'critical', environment: 'production', type: 'mail',
    createdAt: '2024-10-05T11:00:00', lastSeen: new Date().toISOString(),
    cpu: 87, ram: 91, disk: 73, net: 2100, uptime: '3d 14h 30m', uptimeSecs: 310200,
    temp: 78, loadAvg: [4.2, 3.8, 3.5],
    openPorts: [22, 25, 465, 587, 993, 110],
    vcpus: 4, ramTotal: 16, diskTotal: 500,
    netIn: 1400, netOut: 700,
    shutdownReason: null, shutdownBy: null, shutdownAt: null,
    logs: [
      { time: '2024-10-05T11:00:00', event: 'Servidor registrado', user: 'Carlos Méndez', type: 'create' },
      { time: '2025-03-12T06:15:00', event: '⚠ CPU crítico 87% — Posible spam storm', user: 'Sistema', type: 'alert' },
      { time: '2025-03-12T06:18:00', event: '⚠ RAM crítica 91%', user: 'Sistema', type: 'alert' },
    ],
    services: ['postfix', 'dovecot', 'spamassassin', 'clamav', 'ssh'],
    fortiPolicy: 'POL-WEB-002',
    cpuHistory: [], ramHistory: [], netHistory: [],
    sshEnabled: true, tags: ['correo', 'SMTP', 'crítico']
  },
  {
    id: 'SRV-007', hostname: 'file-srv-nfs-01', ip: '192.168.10.70',
    mac: '00:1A:2B:3C:4D:BB', location: 'Rack D · U1', os: 'Debian 12',
    os_version: '12.4', kernel: '6.1.0-18-amd64',
    requestedBy: 'Ana Torres', department: 'Administración',
    purpose: 'Servidor de archivos compartidos NFS/SMB',
    status: 'active', environment: 'production', type: 'file',
    createdAt: '2025-01-25T08:00:00', lastSeen: new Date().toISOString(),
    cpu: 18, ram: 34, disk: 65, net: 680, uptime: '22d 6h 10m', uptimeSecs: 1921800,
    temp: 42, loadAvg: [0.6, 0.5, 0.4],
    openPorts: [22, 111, 2049, 445],
    vcpus: 4, ramTotal: 16, diskTotal: 4000,
    netIn: 380, netOut: 300,
    shutdownReason: null, shutdownBy: null, shutdownAt: null,
    logs: [
      { time: '2025-01-25T08:00:00', event: 'Servidor registrado', user: 'Ana Torres', type: 'create' },
    ],
    services: ['nfs-kernel-server', 'samba', 'ssh', 'quota'],
    fortiPolicy: null,
    cpuHistory: [], ramHistory: [], netHistory: [],
    sshEnabled: true, tags: ['archivos', 'NFS', 'SMB']
  }
];
