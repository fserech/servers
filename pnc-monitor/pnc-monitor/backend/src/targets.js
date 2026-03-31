// ═══════════════════════════════════════════════════════════════════
//  TARGETS — Servidores reales extraídos de ACCESOS.xlsx
//  Cada entrada define: IP, nombre, qué verificar, puertos, URL HTTP
// ═══════════════════════════════════════════════════════════════════

const TARGETS = [
  // ── APLICACIONES / DESARROLLO ──────────────────────────────────
  {
    id: 'SRV-001', hostname: 'apolo',               ip: '172.21.68.12',
    department: 'Desarrollo', type: 'web',
    checks: { ping: true, ports: [22, 80, 443, 8080], http: 'http://172.21.68.12' },
    apps: ['Sistema Juzgados Turno'], authorizedUsers: ['Juzgados de Turno','SGTIC']
  },
  {
    id: 'SRV-002', hostname: 'dav',                 ip: '172.21.68.152',
    department: 'Desarrollo', type: 'web',
    checks: { ping: true, ports: [22, 80, 443], http: 'http://172.21.68.152' },
    apps: ['DAV'], authorizedUsers: ['SGTIC']
  },
  {
    id: 'SRV-003', hostname: 'emision-antecedentes', ip: '172.21.68.161',
    department: 'Desarrollo', type: 'web',
    checks: { ping: true, ports: [22, 80, 443, 8443], http: 'http://172.21.68.161' },
    apps: ['Emisión Antecedentes','Citripio'], authorizedUsers: ['SGTIC']
  },
  {
    id: 'SRV-004', hostname: 'gestion-usuarios',    ip: '172.21.68.112',
    department: 'Desarrollo', type: 'infra',
    checks: { ping: true, ports: [22, 80, 443, 389, 636], http: null },
    apps: ['Gestión de Usuarios','LDAP'], authorizedUsers: ['SGTIC']
  },
  {
    id: 'SRV-005', hostname: 'escritorio-policial', ip: '172.21.68.154',
    department: 'Desarrollo', type: 'web',
    checks: { ping: true, ports: [22, 80, 443], http: 'http://172.21.68.154' },
    apps: ['Escritorio Policial'], authorizedUsers: ['SGP','SGTIC']
  },
  {
    id: 'SRV-006', hostname: 'expertaje-citas',     ip: '172.21.68.193',
    department: 'Desarrollo', type: 'web',
    checks: { ping: true, ports: [22, 80, 443, 8080], http: 'http://172.21.68.193' },
    apps: ['Citas Expertajes'], authorizedUsers: ['Expertaje-SGIC','SGTIC']
  },
  {
    id: 'SRV-007', hostname: 'flota-vehicular',     ip: '172.21.69.37',
    department: 'Desarrollo', type: 'web',
    checks: { ping: true, ports: [22, 80, 443, 8080], http: 'http://172.21.69.37' },
    apps: ['Flota Vehicular'], authorizedUsers: ['SGAL','SGTIC']
  },
  {
    id: 'SRV-008', hostname: 'gestor-documental',   ip: '172.20.10.122',
    department: 'Desarrollo', type: 'file',
    checks: { ping: true, ports: [22, 80, 443, 8080], http: 'http://172.20.10.122' },
    apps: ['Gestor Documental'], authorizedUsers: ['SGED','SGTIC','Secretaria General-DG']
  },
  {
    id: 'SRV-009', hostname: 'monitor-infra',       ip: '172.21.69.18',
    department: 'Infraestructura', type: 'infra',
    checks: { ping: true, ports: [22, 80, 443, 3000, 10051], http: 'http://172.21.69.18:3000' },
    apps: ['Zabbix','Grafana'], authorizedUsers: ['SGTIC']
  },
  {
    id: 'SRV-010', hostname: 'ldap-directorio',     ip: '172.21.68.212',
    department: 'Infraestructura', type: 'infra',
    checks: { ping: true, ports: [22, 389, 636, 88], http: null },
    apps: ['LDAP Directorio Activo'], authorizedUsers: ['SGTIC']
  },
  {
    id: 'SRV-011', hostname: 'novedades',           ip: '172.21.68.155',
    department: 'Desarrollo', type: 'web',
    checks: { ping: true, ports: [22, 80, 443, 8080], http: 'http://172.21.68.155' },
    apps: ['Sistema de Novedades','Línea 110'], authorizedUsers: ['SGO-Novedades-110','SGTIC']
  },
  {
    id: 'SRV-012', hostname: 'orca',                ip: '172.21.68.228',
    department: 'Desarrollo', type: 'web',
    checks: { ping: true, ports: [22, 80, 443, 8443], http: 'http://172.21.68.228' },
    apps: ['ORCA'], authorizedUsers: ['SGIC','SGTIC']
  },
  {
    id: 'SRV-013', hostname: 'osticket',            ip: '172.20.10.121',
    department: 'Infraestructura', type: 'web',
    checks: { ping: true, ports: [22, 80, 443, 3306], http: 'http://172.20.10.121' },
    apps: ['OSTicket','Helpdesk'], authorizedUsers: ['SGTIC']
  },
  {
    id: 'SRV-014', hostname: 'antecedentes-linea',  ip: '172.21.68.194',
    department: 'Desarrollo', type: 'web',
    checks: { ping: true, ports: [22, 80, 443], http: 'http://172.21.68.194' },
    apps: ['Antecedentes Policiales en Línea'], authorizedUsers: ['PNC']
  },
  {
    id: 'SRV-015', hostname: 'rvr',                 ip: '172.21.68.150',
    department: 'Desarrollo', type: 'web',
    checks: { ping: true, ports: [22, 80, 443, 8080, 8443], http: 'http://172.21.68.150' },
    apps: ['RVR - Registro Vehículos Robados'], authorizedUsers: ['Rvr-SGIC','SGTIC']
  },
  {
    id: 'SRV-016', hostname: 'sae',                 ip: '172.20.10.52',
    department: 'Desarrollo', type: 'web',
    checks: { ping: true, ports: [22, 80, 443, 8080], http: 'http://172.20.10.52' },
    apps: ['SAE - Armas y Explosivos'], authorizedUsers: ['Didade-SGIC','SGTIC']
  },
  {
    id: 'SRV-017', hostname: 'sapo-g',              ip: '172.21.68.170',
    department: 'Desarrollo', type: 'web',
    checks: { ping: true, ports: [22, 80, 443, 8080, 8443], http: 'http://172.21.68.170' },
    apps: ['SAPO-G Antecedentes'], authorizedUsers: ['Gacri-SGIC','SGTIC']
  },
  {
    id: 'SRV-018', hostname: 'siav-app',            ip: '172.21.68.151',
    department: 'Desarrollo', type: 'web',
    checks: { ping: true, ports: [22, 80, 443, 8080], http: 'http://172.21.68.151' },
    apps: ['SIAV - Atención Víctima'], authorizedUsers: ['Oav-SGO','SGTIC']
  },
  {
    id: 'SRV-019', hostname: 'sispe-app',           ip: '172.21.68.22',
    department: 'Desarrollo', type: 'web',
    checks: { ping: true, ports: [22, 80, 443, 8080, 1521], http: 'http://172.21.68.22' },
    apps: ['SISPE App'], authorizedUsers: ['PNC']
  },
  {
    id: 'SRV-020', hostname: 'gitlab',              ip: '172.21.68.25',
    department: 'Infraestructura', type: 'infra',
    checks: { ping: true, ports: [22, 80, 443, 2222], http: 'http://172.21.68.25' },
    apps: ['GitLab CE'], authorizedUsers: ['SGTIC']
  },
  // ── WEBSERVICES / APIs ──────────────────────────────────────────
  {
    id: 'SRV-021', hostname: 'ws-api-consultas',    ip: '172.21.68.38',
    department: 'Desarrollo', type: 'api',
    checks: { ping: true, ports: [22, 80, 443, 8080], http: 'http://172.21.68.38' },
    apps: ['ws-api-consultas'], authorizedUsers: ['RAP','SGSP','DMED-SGAL','SGTIC']
  },
  {
    id: 'SRV-022', hostname: 'ws-autentica',        ip: '172.21.68.229',
    department: 'Infraestructura', type: 'api',
    checks: { ping: true, ports: [22, 80, 443, 8080], http: 'http://172.21.68.229' },
    apps: ['ws-autentica'], authorizedUsers: ['SGTIC']
  },
  {
    id: 'SRV-023', hostname: 'ws-bancos',           ip: '172.21.68.111',
    department: 'Desarrollo', type: 'api',
    checks: { ping: true, ports: [22, 80, 443, 8080, 8443], http: null },
    apps: ['ws-bancos'], authorizedUsers: ['SGTIC','Bancos']
  },
  {
    id: 'SRV-024', hostname: 'ws-renap',            ip: '172.21.68.109',
    department: 'Desarrollo', type: 'api',
    checks: { ping: true, ports: [22, 80, 443, 8080], http: null },
    apps: ['WsRenap'], authorizedUsers: ['SGTIC']
  },
  // ── BASES DE DATOS ──────────────────────────────────────────────
  {
    id: 'SRV-025', hostname: 'bd-principal',        ip: '172.21.68.101',
    department: 'Base de Datos', type: 'database',
    checks: { ping: true, ports: [22, 3306, 5432], http: null },
    apps: ['MySQL','PostgreSQL - RVR/Apolo/SIAV/Novedades'], authorizedUsers: ['SGTIC']
  },
  {
    id: 'SRV-026', hostname: 'bd-autentica',        ip: '172.21.68.102',
    department: 'Base de Datos', type: 'database',
    checks: { ping: true, ports: [22, 3306], http: null },
    apps: ['bd-autentica'], authorizedUsers: ['SGTIC']
  },
  {
    id: 'SRV-027', hostname: 'bd-logs',             ip: '172.21.68.103',
    department: 'Base de Datos', type: 'database',
    checks: { ping: true, ports: [22, 3306], http: null },
    apps: ['MySQL logs - C3PO/Mega/R2D2'], authorizedUsers: ['SGTIC']
  },
  {
    id: 'SRV-028', hostname: 'bd-sapo',             ip: '172.21.68.202',
    department: 'Base de Datos', type: 'database',
    checks: { ping: true, ports: [22, 3306, 5432], http: null },
    apps: ['bd-sapo','bd-sapo-antpol','bd-sapo-bnc'], authorizedUsers: ['SGTIC']
  },
  {
    id: 'SRV-029', hostname: 'bd-sispe-oracle',     ip: '172.38.0.5',
    department: 'Base de Datos', type: 'database',
    checks: { ping: true, ports: [22, 1521, 5500], http: null },
    apps: ['Oracle DB - SISPE'], authorizedUsers: ['DG/IG']
  },
  {
    id: 'SRV-030', hostname: 'bd-policiales',       ip: '172.21.69.33',
    department: 'Base de Datos', type: 'database',
    checks: { ping: true, ports: [22, 3306], http: null },
    apps: ['bd-policiales','bd-extravios'], authorizedUsers: ['SGTIC']
  },
  {
    id: 'SRV-031', hostname: 'bd-flota-vehicular',  ip: '172.21.69.38',
    department: 'Base de Datos', type: 'database',
    checks: { ping: true, ports: [22, 3306], http: null },
    apps: ['Bd-FlotaV'], authorizedUsers: ['SGTIC','Josue Ischiu']
  },
  {
    id: 'SRV-032', hostname: 'bd-sae',              ip: '172.20.10.53',
    department: 'Base de Datos', type: 'database',
    checks: { ping: true, ports: [22, 3306], http: null },
    apps: ['Bd-sae'], authorizedUsers: ['SGTIC']
  },
  // ── DMZ ────────────────────────────────────────────────────────
  {
    id: 'SRV-033', hostname: 'dmz-publico',         ip: '10.10.30.3',
    department: 'Infraestructura', type: 'web',
    checks: { ping: true, ports: [22, 80, 443], http: 'https://sistemas.pnc.gob.gt' },
    apps: ['sistemas.pnc.gob.gt'], authorizedUsers: ['NACIONAL']
  },
  {
    id: 'SRV-034', hostname: 'pmx-dmz-fisico',      ip: '10.10.30.2',
    department: 'Infraestructura', type: 'infra',
    checks: { ping: true, ports: [22, 8006, 443], http: null },
    apps: ['Proxmox VE - DMZ'], authorizedUsers: ['SGTIC']
  },
];

module.exports = TARGETS;
