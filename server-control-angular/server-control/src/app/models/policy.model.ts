export interface FortiPolicy {
  id: string;
  name: string;
  srcZone: string;
  dstZone: string;
  srcAddr: string;
  dstAddr: string;
  service: string;
  action: 'ALLOW' | 'DENY';
  nat: boolean;
  logTraffic: boolean;
  ipsProfile: string;
  avProfile: string;
  appCtrl: string;
  status: 'enabled' | 'disabled';
  hits: number;
  lastHit: string;
  schedule: string;
  comments: string;
  linkedServer: string | null;
}

export const INITIAL_POLICIES: FortiPolicy[] = [
  {
    id: 'POL-DB-001', name: 'DB-Servers-Access',
    srcZone: 'LAN-CORP', dstZone: 'SERVER-FARM',
    srcAddr: '192.168.1.0/24', dstAddr: '192.168.10.11',
    service: 'TCP/5432, TCP/22', action: 'ALLOW', nat: false, logTraffic: true,
    ipsProfile: 'IPS-HIGH', avProfile: '—', appCtrl: '—', status: 'enabled',
    hits: 142830, lastHit: '2025-03-11T08:45:00', schedule: 'always',
    comments: 'Acceso a base de datos PostgreSQL desde red corporativa interna. Solo personal autorizado.',
    linkedServer: 'SRV-001'
  },
  {
    id: 'POL-WEB-002', name: 'WebProd-Inbound',
    srcZone: 'WAN', dstZone: 'SERVER-FARM',
    srcAddr: 'all', dstAddr: '192.168.10.20',
    service: 'TCP/80, TCP/443', action: 'ALLOW', nat: true, logTraffic: true,
    ipsProfile: 'IPS-WEB', avProfile: 'AV-WEB', appCtrl: 'AppCtrl-Web', status: 'enabled',
    hits: 984521, lastHit: '2025-03-11T09:01:00', schedule: 'always',
    comments: 'Tráfico HTTP/HTTPS público hacia servidor de producción web. NAT activado. IPS y AV habilitados.',
    linkedServer: 'SRV-002'
  },
  {
    id: 'POL-BAK-003', name: 'Backup-Replication',
    srcZone: 'SERVER-FARM', dstZone: 'BACKUP-ZONE',
    srcAddr: '192.168.10.0/24', dstAddr: '192.168.10.35',
    service: 'TCP/445, TCP/873', action: 'ALLOW', nat: false, logTraffic: true,
    ipsProfile: 'IPS-MED', avProfile: '—', appCtrl: '—', status: 'disabled',
    hits: 28043, lastHit: '2025-01-08T23:44:00', schedule: 'Backup-Schedule',
    comments: 'Replicación SMB/Rsync suspendida temporalmente por mantenimiento de hardware.',
    linkedServer: 'SRV-003'
  },
  {
    id: 'POL-SEC-004', name: 'SIEM-Collector',
    srcZone: 'ALL-ZONES', dstZone: 'MGMT-ZONE',
    srcAddr: 'all', dstAddr: '192.168.10.50',
    service: 'UDP/514, TCP/1514, TCP/9200', action: 'ALLOW', nat: false, logTraffic: false,
    ipsProfile: '—', avProfile: '—', appCtrl: '—', status: 'enabled',
    hits: 5671092, lastHit: '2025-03-11T09:02:00', schedule: 'always',
    comments: 'Recolección centralizada de syslog, agentes Wazuh y API Elasticsearch para SIEM institucional.',
    linkedServer: 'SRV-004'
  },
  {
    id: 'POL-DNS-005', name: 'DNS-Internal',
    srcZone: 'ALL-INTERNAL', dstZone: 'SERVER-FARM',
    srcAddr: '192.168.0.0/16', dstAddr: '192.168.10.5',
    service: 'UDP/53, TCP/53', action: 'ALLOW', nat: false, logTraffic: false,
    ipsProfile: '—', avProfile: '—', appCtrl: '—', status: 'enabled',
    hits: 3298441, lastHit: '2025-03-11T09:02:00', schedule: 'always',
    comments: 'Resolución de nombres DNS internos para toda la red institucional.',
    linkedServer: 'SRV-005'
  },
  {
    id: 'POL-DENY-099', name: 'Block-WAN-SSH',
    srcZone: 'WAN', dstZone: 'SERVER-FARM',
    srcAddr: 'all', dstAddr: '192.168.10.0/24',
    service: 'TCP/22', action: 'DENY', nat: false, logTraffic: true,
    ipsProfile: '—', avProfile: '—', appCtrl: '—', status: 'enabled',
    hits: 8847, lastHit: '2025-03-11T08:58:00', schedule: 'always',
    comments: 'Bloqueo explícito de SSH desde Internet. Política de seguridad institucional obligatoria.',
    linkedServer: null
  },
  {
    id: 'POL-LOG-077', name: 'Monitor-Outbound',
    srcZone: 'SERVER-FARM', dstZone: 'WAN',
    srcAddr: '192.168.10.0/24', dstAddr: 'all',
    service: 'all', action: 'ALLOW', nat: true, logTraffic: true,
    ipsProfile: 'IPS-OUT', avProfile: 'AV-STD', appCtrl: 'AppCtrl-All', status: 'enabled',
    hits: 241088, lastHit: '2025-03-11T09:02:00', schedule: 'always',
    comments: 'Monitoreo y log de todo el tráfico saliente desde servidores hacia Internet.',
    linkedServer: null
  }
];
