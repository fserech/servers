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
  os_version: string;
  kernel: string;
  requestedBy: string;
  department: string;
  purpose: string;
  status: 'active' | 'inactive' | 'maintenance' | 'critical';
  environment: 'production' | 'staging' | 'development' | 'backup';
  type: 'web' | 'database' | 'backup' | 'security' | 'dns' | 'mail' | 'file' | 'other' | 'api' | 'infra';
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
  portLabels?: { [port: number]: string };
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
  vcpus: number;
  ramTotal: number;
  diskTotal: number;
  tags: string[];
  authorizedUsers?: string[];
  applications?: string[];
}

// ──────────────────────────────────────────────────────────────
//  DATOS REALES — Extraídos de ACCESOS.xlsx
//  Hoja DESARROLLO + Hoja BASE DE DATOS
// ──────────────────────────────────────────────────────────────
const NOW = new Date().toISOString();
const D30 = (d: number) => Array.from({length:30},()=>d+Math.floor(Math.random()*10-5)).map(v=>Math.max(2,Math.min(98,v)));

export const INITIAL_SERVERS: Server[] = [

  // ── APLICACIONES / DESARROLLO ──────────────────────────────

  {
    id:'SRV-001', hostname:'apolo', ip:'172.21.68.12',
    mac:'00:50:56:A1:00:01', location:'Rack A · Slot 01', os:'CentOS 7',
    os_version:'7.9', kernel:'3.10.0-1160', requestedBy:'SGTIC', department:'Desarrollo',
    purpose:'Apolo — Sistema de Juzgados de Turno',
    status:'active', environment:'production', type:'web',
    createdAt:'2022-03-10T08:00:00', lastSeen:NOW,
    cpu:45, ram:58, disk:42, net:620, uptime:'210d 4h 12m', uptimeSecs:18147120,
    temp:52, loadAvg:[1.4,1.3,1.1],
    openPorts:[22,80,443,8080],
    portLabels:{22:'SSH',80:'HTTP',443:'HTTPS',8080:'App-Apolo'},
    shutdownReason:null, shutdownBy:null, shutdownAt:null,
    logs:[{time:'2022-03-10T08:00:00',event:'Servidor registrado',user:'SGTIC',type:'create'}],
    services:['nginx','tomcat','ssh','firewalld'],
    fortiPolicy:'POL-WEB-001', cpuHistory:D30(45), ramHistory:D30(58), netHistory:D30(620),
    netIn:350, netOut:270, sshEnabled:true, vcpus:4, ramTotal:16, diskTotal:200,
    tags:['juzgados','turno','producción'],
    authorizedUsers:['Juzgados de Turno','SGTIC'],
    applications:['Sistema Juzgados Turno']
  },

  {
    id:'SRV-002', hostname:'dav', ip:'172.21.68.152',
    mac:'00:50:56:A1:00:02', location:'Rack A · Slot 02', os:'Ubuntu 20.04 LTS',
    os_version:'20.04.6', kernel:'5.4.0-182', requestedBy:'SGTIC', department:'Desarrollo',
    purpose:'DAV — Servidor de aplicación interna',
    status:'active', environment:'development', type:'web',
    createdAt:'2022-06-15T09:00:00', lastSeen:NOW,
    cpu:28, ram:40, disk:30, net:310, uptime:'98d 7h 30m', uptimeSecs:8487000,
    temp:44, loadAvg:[0.8,0.7,0.6],
    openPorts:[22,80,443],
    portLabels:{22:'SSH',80:'HTTP',443:'HTTPS'},
    shutdownReason:null, shutdownBy:null, shutdownAt:null,
    logs:[{time:'2022-06-15T09:00:00',event:'Servidor registrado',user:'SGTIC',type:'create'}],
    services:['apache2','ssh','ufw'],
    fortiPolicy:null, cpuHistory:D30(28), ramHistory:D30(40), netHistory:D30(310),
    netIn:180, netOut:130, sshEnabled:true, vcpus:2, ramTotal:8, diskTotal:100,
    tags:['desarrollo','interno'],
    authorizedUsers:['SGTIC'],
    applications:['DAV']
  },

  {
    id:'SRV-003', hostname:'emision-antecedentes', ip:'172.21.68.161',
    mac:'00:50:56:A1:00:03', location:'Rack A · Slot 03', os:'Ubuntu 20.04 LTS',
    os_version:'20.04.6', kernel:'5.4.0-182', requestedBy:'SGTIC', department:'Desarrollo',
    purpose:'Emisión de Antecedentes Policiales / Citripio',
    status:'active', environment:'production', type:'web',
    createdAt:'2021-09-01T08:00:00', lastSeen:NOW,
    cpu:55, ram:62, disk:48, net:840, uptime:'320d 2h 15m', uptimeSecs:27651900,
    temp:55, loadAvg:[1.8,1.6,1.4],
    openPorts:[22,80,443,8443],
    portLabels:{22:'SSH',80:'HTTP',443:'HTTPS',8443:'Antecedentes-App'},
    shutdownReason:null, shutdownBy:null, shutdownAt:null,
    logs:[{time:'2021-09-01T08:00:00',event:'Servidor registrado',user:'SGTIC',type:'create'}],
    services:['nginx','nodejs','ssh','firewalld'],
    fortiPolicy:'POL-WEB-003', cpuHistory:D30(55), ramHistory:D30(62), netHistory:D30(840),
    netIn:500, netOut:340, sshEnabled:true, vcpus:4, ramTotal:16, diskTotal:200,
    tags:['antecedentes','citripio','producción'],
    authorizedUsers:['SGTIC'],
    applications:['Emisión Antecedentes','Citripio']
  },

  {
    id:'SRV-004', hostname:'gestion-usuarios', ip:'172.21.68.112',
    mac:'00:50:56:A1:00:04', location:'Rack A · Slot 04', os:'CentOS 7',
    os_version:'7.9', kernel:'3.10.0-1160', requestedBy:'SGTIC', department:'Desarrollo',
    purpose:'Gestión de Usuarios — LDAP Frontend',
    status:'active', environment:'production', type:'infra',
    createdAt:'2021-05-10T08:00:00', lastSeen:NOW,
    cpu:22, ram:35, disk:25, net:280, uptime:'180d 11h 00m', uptimeSecs:15573600,
    temp:40, loadAvg:[0.5,0.4,0.4],
    openPorts:[22,80,443,389,636],
    portLabels:{22:'SSH',80:'HTTP',443:'HTTPS',389:'LDAP',636:'LDAPS'},
    shutdownReason:null, shutdownBy:null, shutdownAt:null,
    logs:[{time:'2021-05-10T08:00:00',event:'Servidor registrado',user:'SGTIC',type:'create'}],
    services:['nginx','openldap','ssh'],
    fortiPolicy:'POL-LDAP-004', cpuHistory:D30(22), ramHistory:D30(35), netHistory:D30(280),
    netIn:150, netOut:130, sshEnabled:true, vcpus:2, ramTotal:8, diskTotal:100,
    tags:['LDAP','usuarios','crítico'],
    authorizedUsers:['SGTIC'],
    applications:['Gestión de Usuarios','LDAP']
  },

  {
    id:'SRV-005', hostname:'escritorio-policial', ip:'172.21.68.154',
    mac:'00:50:56:A1:00:05', location:'Rack A · Slot 05', os:'Ubuntu 22.04 LTS',
    os_version:'22.04.3', kernel:'6.2.0-37', requestedBy:'SGTIC', department:'Desarrollo',
    purpose:'Escritorio Policial — Portal operativo PNC',
    status:'active', environment:'production', type:'web',
    createdAt:'2022-01-15T08:00:00', lastSeen:NOW,
    cpu:62, ram:70, disk:55, net:1100, uptime:'145d 3h 20m', uptimeSecs:12530400,
    temp:58, loadAvg:[2.1,1.9,1.7],
    openPorts:[22,80,443],
    portLabels:{22:'SSH',80:'HTTP',443:'HTTPS'},
    shutdownReason:null, shutdownBy:null, shutdownAt:null,
    logs:[{time:'2022-01-15T08:00:00',event:'Servidor registrado',user:'SGTIC',type:'create'}],
    services:['nginx','php-fpm','ssh','firewalld'],
    fortiPolicy:'POL-WEB-005', cpuHistory:D30(62), ramHistory:D30(70), netHistory:D30(1100),
    netIn:650, netOut:450, sshEnabled:true, vcpus:4, ramTotal:16, diskTotal:200,
    tags:['escritorio','PNC','producción'],
    authorizedUsers:['SGP','SGTIC'],
    applications:['Escritorio Policial']
  },

  {
    id:'SRV-006', hostname:'expertaje-citas', ip:'172.21.68.193',
    mac:'00:50:56:A1:00:06', location:'Rack B · Slot 01', os:'Ubuntu 20.04 LTS',
    os_version:'20.04.6', kernel:'5.4.0-182', requestedBy:'SGTIC', department:'Desarrollo',
    purpose:'Sistema de Gestión para Citas de Expertajes',
    status:'active', environment:'production', type:'web',
    createdAt:'2022-08-01T08:00:00', lastSeen:NOW,
    cpu:30, ram:42, disk:28, net:350, uptime:'110d 5h 10m', uptimeSecs:9510600,
    temp:45, loadAvg:[0.9,0.8,0.7],
    openPorts:[22,80,443,8080],
    portLabels:{22:'SSH',80:'HTTP',443:'HTTPS',8080:'Citas-App'},
    shutdownReason:null, shutdownBy:null, shutdownAt:null,
    logs:[{time:'2022-08-01T08:00:00',event:'Servidor registrado',user:'SGTIC',type:'create'}],
    services:['tomcat','nginx','ssh'],
    fortiPolicy:null, cpuHistory:D30(30), ramHistory:D30(42), netHistory:D30(350),
    netIn:200, netOut:150, sshEnabled:true, vcpus:2, ramTotal:8, diskTotal:100,
    tags:['expertaje','citas'],
    authorizedUsers:['Expertaje-SGIC','SGTIC'],
    applications:['Citas Expertajes']
  },

  {
    id:'SRV-007', hostname:'flota-vehicular', ip:'172.21.69.37',
    mac:'00:50:56:A1:00:07', location:'Rack B · Slot 02', os:'CentOS 7',
    os_version:'7.9', kernel:'3.10.0-1160', requestedBy:'SGTIC', department:'Desarrollo',
    purpose:'Sistema de Flota Vehicular Institucional',
    status:'active', environment:'production', type:'web',
    createdAt:'2021-11-20T08:00:00', lastSeen:NOW,
    cpu:38, ram:50, disk:44, net:480, uptime:'230d 8h 45m', uptimeSecs:19895100,
    temp:48, loadAvg:[1.1,1.0,0.9],
    openPorts:[22,80,443,8080],
    portLabels:{22:'SSH',80:'HTTP',443:'HTTPS',8080:'Flota-App'},
    shutdownReason:null, shutdownBy:null, shutdownAt:null,
    logs:[{time:'2021-11-20T08:00:00',event:'Servidor registrado',user:'SGTIC',type:'create'}],
    services:['tomcat','apache2','ssh','firewalld'],
    fortiPolicy:null, cpuHistory:D30(38), ramHistory:D30(50), netHistory:D30(480),
    netIn:280, netOut:200, sshEnabled:true, vcpus:2, ramTotal:8, diskTotal:150,
    tags:['flota','vehicular'],
    authorizedUsers:['SGAL','SGTIC'],
    applications:['Flota Vehicular']
  },

  {
    id:'SRV-008', hostname:'gestor-documental', ip:'172.20.10.122',
    mac:'00:50:56:A1:00:08', location:'Rack B · Slot 03', os:'Ubuntu 20.04 LTS',
    os_version:'20.04.6', kernel:'5.4.0-182', requestedBy:'SGTIC', department:'Desarrollo',
    purpose:'Gestor Documental Institucional SGED',
    status:'active', environment:'production', type:'file',
    createdAt:'2021-07-05T08:00:00', lastSeen:NOW,
    cpu:42, ram:55, disk:70, net:720, uptime:'270d 6h 30m', uptimeSecs:23337000,
    temp:50, loadAvg:[1.3,1.2,1.0],
    openPorts:[22,80,443,8080,9090],
    portLabels:{22:'SSH',80:'HTTP',443:'HTTPS',8080:'GestDoc-App',9090:'Admin'},
    shutdownReason:null, shutdownBy:null, shutdownAt:null,
    logs:[{time:'2021-07-05T08:00:00',event:'Servidor registrado',user:'SGTIC',type:'create'}],
    services:['alfresco','nginx','ssh','postgresql'],
    fortiPolicy:'POL-DOC-008', cpuHistory:D30(42), ramHistory:D30(55), netHistory:D30(720),
    netIn:420, netOut:300, sshEnabled:true, vcpus:4, ramTotal:16, diskTotal:500,
    tags:['documental','SGED','producción'],
    authorizedUsers:['SGED','SGTIC','Secretaria General-DG'],
    applications:['Gestor Documental']
  },

  {
    id:'SRV-009', hostname:'monitor-infra', ip:'172.21.69.18',
    mac:'00:50:56:A1:00:09', location:'Rack C · Slot 01', os:'Ubuntu 22.04 LTS',
    os_version:'22.04.3', kernel:'6.2.0-37', requestedBy:'SGTIC', department:'Infraestructura',
    purpose:'Monitor de Infraestructura — Zabbix / Grafana',
    status:'active', environment:'production', type:'infra',
    createdAt:'2022-02-14T08:00:00', lastSeen:NOW,
    cpu:35, ram:52, disk:40, net:560, uptime:'300d 1h 00m', uptimeSecs:25923600,
    temp:47, loadAvg:[1.0,0.9,0.8],
    openPorts:[22,80,443,3000,10050,10051],
    portLabels:{22:'SSH',80:'HTTP',443:'HTTPS',3000:'Grafana',10050:'Zabbix-Agent',10051:'Zabbix-Server'},
    shutdownReason:null, shutdownBy:null, shutdownAt:null,
    logs:[{time:'2022-02-14T08:00:00',event:'Servidor registrado',user:'SGTIC',type:'create'}],
    services:['zabbix-server','grafana','nginx','ssh'],
    fortiPolicy:null, cpuHistory:D30(35), ramHistory:D30(52), netHistory:D30(560),
    netIn:300, netOut:260, sshEnabled:true, vcpus:4, ramTotal:16, diskTotal:200,
    tags:['monitoreo','zabbix','grafana','infraestructura'],
    authorizedUsers:['SGTIC'],
    applications:['Zabbix','Grafana','Monitor Infraestructura']
  },

  {
    id:'SRV-010', hostname:'ldap-directorio', ip:'172.21.68.212',
    mac:'00:50:56:A1:00:10', location:'Rack C · Slot 02', os:'Ubuntu 20.04 LTS',
    os_version:'20.04.6', kernel:'5.4.0-182', requestedBy:'SGTIC', department:'Infraestructura',
    purpose:'LDAP — Directorio Activo para Registro de Usuarios PNC',
    status:'active', environment:'production', type:'infra',
    createdAt:'2020-08-10T08:00:00', lastSeen:NOW,
    cpu:18, ram:30, disk:22, net:240, uptime:'400d 9h 20m', uptimeSecs:34598400,
    temp:38, loadAvg:[0.4,0.3,0.3],
    openPorts:[22,389,636,88,464],
    portLabels:{22:'SSH',389:'LDAP',636:'LDAPS',88:'Kerberos',464:'Kerberos-pwd'},
    shutdownReason:null, shutdownBy:null, shutdownAt:null,
    logs:[{time:'2020-08-10T08:00:00',event:'Servidor registrado',user:'SGTIC',type:'create'}],
    services:['openldap','krb5-kdc','ssh','firewalld'],
    fortiPolicy:'POL-LDAP-010', cpuHistory:D30(18), ramHistory:D30(30), netHistory:D30(240),
    netIn:130, netOut:110, sshEnabled:true, vcpus:2, ramTotal:8, diskTotal:100,
    tags:['LDAP','directorio','crítico','autenticación'],
    authorizedUsers:['SGTIC'],
    applications:['LDAP Directorio Activo']
  },

  {
    id:'SRV-011', hostname:'novedades', ip:'172.21.68.155',
    mac:'00:50:56:A1:00:11', location:'Rack C · Slot 03', os:'Ubuntu 20.04 LTS',
    os_version:'20.04.6', kernel:'5.4.0-182', requestedBy:'SGTIC', department:'Desarrollo',
    purpose:'Sistema de Novedades Policiales — Línea 110',
    status:'active', environment:'production', type:'web',
    createdAt:'2021-03-15T08:00:00', lastSeen:NOW,
    cpu:48, ram:60, disk:50, net:750, uptime:'195d 12h 00m', uptimeSecs:16894800,
    temp:52, loadAvg:[1.5,1.4,1.2],
    openPorts:[22,80,443,8080],
    portLabels:{22:'SSH',80:'HTTP',443:'HTTPS',8080:'Novedades-App'},
    shutdownReason:null, shutdownBy:null, shutdownAt:null,
    logs:[{time:'2021-03-15T08:00:00',event:'Servidor registrado',user:'SGTIC',type:'create'}],
    services:['tomcat','nginx','ssh','firewalld'],
    fortiPolicy:'POL-WEB-011', cpuHistory:D30(48), ramHistory:D30(60), netHistory:D30(750),
    netIn:420, netOut:330, sshEnabled:true, vcpus:4, ramTotal:16, diskTotal:200,
    tags:['novedades','110','producción'],
    authorizedUsers:['SGO-Novedades-110','SGTIC'],
    applications:['Sistema de Novedades','Línea 110']
  },

  {
    id:'SRV-012', hostname:'orca', ip:'172.21.68.228',
    mac:'00:50:56:A1:00:12', location:'Rack C · Slot 04', os:'CentOS 7',
    os_version:'7.9', kernel:'3.10.0-1160', requestedBy:'SGTIC', department:'Desarrollo',
    purpose:'ORCA — Sistema de Inteligencia Criminal (SGIC)',
    status:'active', environment:'production', type:'web',
    createdAt:'2021-06-20T08:00:00', lastSeen:NOW,
    cpu:52, ram:65, disk:58, net:880, uptime:'250d 7h 15m', uptimeSecs:21610500,
    temp:55, loadAvg:[1.7,1.5,1.3],
    openPorts:[22,80,443,8443],
    portLabels:{22:'SSH',80:'HTTP',443:'HTTPS',8443:'ORCA-App'},
    shutdownReason:null, shutdownBy:null, shutdownAt:null,
    logs:[{time:'2021-06-20T08:00:00',event:'Servidor registrado',user:'SGTIC',type:'create'}],
    services:['tomcat','apache2','ssh','firewalld'],
    fortiPolicy:'POL-SEC-012', cpuHistory:D30(52), ramHistory:D30(65), netHistory:D30(880),
    netIn:500, netOut:380, sshEnabled:true, vcpus:4, ramTotal:16, diskTotal:300,
    tags:['ORCA','inteligencia','SGIC','producción'],
    authorizedUsers:['SGIC','SGTIC'],
    applications:['ORCA']
  },

  {
    id:'SRV-013', hostname:'osticket', ip:'172.20.10.121',
    mac:'00:50:56:A1:00:13', location:'Rack D · Slot 01', os:'Ubuntu 20.04 LTS',
    os_version:'20.04.6', kernel:'5.4.0-182', requestedBy:'SGTIC', department:'Infraestructura',
    purpose:'OSTicket — Mesa de Ayuda / Helpdesk Institucional',
    status:'active', environment:'production', type:'web',
    createdAt:'2021-01-10T08:00:00', lastSeen:NOW,
    cpu:25, ram:38, disk:35, net:320, uptime:'350d 3h 40m', uptimeSecs:30239400,
    temp:42, loadAvg:[0.7,0.6,0.5],
    openPorts:[22,80,443,3306],
    portLabels:{22:'SSH',80:'HTTP',443:'HTTPS',3306:'MySQL'},
    shutdownReason:null, shutdownBy:null, shutdownAt:null,
    logs:[{time:'2021-01-10T08:00:00',event:'Servidor registrado',user:'SGTIC',type:'create'}],
    services:['apache2','mysql','php','ssh'],
    fortiPolicy:null, cpuHistory:D30(25), ramHistory:D30(38), netHistory:D30(320),
    netIn:180, netOut:140, sshEnabled:true, vcpus:2, ramTotal:8, diskTotal:150,
    tags:['helpdesk','osticket','soporte'],
    authorizedUsers:['SGTIC'],
    applications:['OSTicket','Helpdesk']
  },

  {
    id:'SRV-014', hostname:'antecedentes-linea', ip:'172.21.68.194',
    mac:'00:50:56:A1:00:14', location:'Rack D · Slot 02', os:'Ubuntu 22.04 LTS',
    os_version:'22.04.3', kernel:'6.2.0-37', requestedBy:'SGTIC', department:'Desarrollo',
    purpose:'Antecedentes Policiales en Línea — Portal Público PNC',
    status:'active', environment:'production', type:'web',
    createdAt:'2022-04-01T08:00:00', lastSeen:NOW,
    cpu:72, ram:78, disk:60, net:1800, uptime:'180d 0h 00m', uptimeSecs:15552000,
    temp:62, loadAvg:[2.5,2.3,2.0],
    openPorts:[22,80,443],
    portLabels:{22:'SSH',80:'HTTP',443:'HTTPS'},
    shutdownReason:null, shutdownBy:null, shutdownAt:null,
    logs:[{time:'2022-04-01T08:00:00',event:'Servidor registrado',user:'SGTIC',type:'create'}],
    services:['nginx','nodejs','ssh','firewalld'],
    fortiPolicy:'POL-PUB-014', cpuHistory:D30(72), ramHistory:D30(78), netHistory:D30(1800),
    netIn:1100, netOut:700, sshEnabled:true, vcpus:8, ramTotal:32, diskTotal:500,
    tags:['antecedentes','público','PNC','alta-demanda'],
    authorizedUsers:['PNC'],
    applications:['Antecedentes Policiales en Línea']
  },

  {
    id:'SRV-015', hostname:'rvr', ip:'172.21.68.150',
    mac:'00:50:56:A1:00:15', location:'Rack D · Slot 03', os:'CentOS 7',
    os_version:'7.9', kernel:'3.10.0-1160', requestedBy:'SGTIC', department:'Desarrollo',
    purpose:'Registro de Vehículos Robados (RVR)',
    status:'active', environment:'production', type:'web',
    createdAt:'2020-11-10T08:00:00', lastSeen:NOW,
    cpu:40, ram:52, disk:48, net:580, uptime:'280d 10h 20m', uptimeSecs:24220800,
    temp:48, loadAvg:[1.2,1.1,0.9],
    openPorts:[22,80,443,8080,8443],
    portLabels:{22:'SSH',80:'HTTP',443:'HTTPS',8080:'RVR-App',8443:'RVR-Secure'},
    shutdownReason:null, shutdownBy:null, shutdownAt:null,
    logs:[{time:'2020-11-10T08:00:00',event:'Servidor registrado',user:'SGTIC',type:'create'}],
    services:['tomcat','apache2','ssh','firewalld'],
    fortiPolicy:'POL-SEC-015', cpuHistory:D30(40), ramHistory:D30(52), netHistory:D30(580),
    netIn:340, netOut:240, sshEnabled:true, vcpus:4, ramTotal:16, diskTotal:200,
    tags:['RVR','vehículos','robados','SGIC'],
    authorizedUsers:['Rvr-SGIC','SGTIC'],
    applications:['RVR - Registro Vehículos Robados']
  },

  {
    id:'SRV-016', hostname:'sae', ip:'172.20.10.52',
    mac:'00:50:56:A1:00:16', location:'Rack E · Slot 01', os:'Ubuntu 20.04 LTS',
    os_version:'20.04.6', kernel:'5.4.0-182', requestedBy:'SGTIC', department:'Desarrollo',
    purpose:'Sistema de Armas y Explosivos (SAE)',
    status:'active', environment:'production', type:'web',
    createdAt:'2021-08-20T08:00:00', lastSeen:NOW,
    cpu:33, ram:45, disk:38, net:420, uptime:'220d 14h 00m', uptimeSecs:19058400,
    temp:46, loadAvg:[0.9,0.8,0.7],
    openPorts:[22,80,443,8080],
    portLabels:{22:'SSH',80:'HTTP',443:'HTTPS',8080:'SAE-App'},
    shutdownReason:null, shutdownBy:null, shutdownAt:null,
    logs:[{time:'2021-08-20T08:00:00',event:'Servidor registrado',user:'SGTIC',type:'create'}],
    services:['tomcat','nginx','ssh','firewalld'],
    fortiPolicy:'POL-SEC-016', cpuHistory:D30(33), ramHistory:D30(45), netHistory:D30(420),
    netIn:240, netOut:180, sshEnabled:true, vcpus:2, ramTotal:8, diskTotal:150,
    tags:['SAE','armas','explosivos','DIDADE'],
    authorizedUsers:['Didade-SGIC','SGTIC'],
    applications:['SAE - Armas y Explosivos']
  },

  {
    id:'SRV-017', hostname:'sapo-g', ip:'172.21.68.170',
    mac:'00:50:56:A1:00:17', location:'Rack E · Slot 02', os:'Ubuntu 22.04 LTS',
    os_version:'22.04.3', kernel:'6.2.0-37', requestedBy:'SGTIC', department:'Desarrollo',
    purpose:'Gestión de Antecedentes Policiales (SAPO-G)',
    status:'active', environment:'production', type:'web',
    createdAt:'2021-10-05T08:00:00', lastSeen:NOW,
    cpu:58, ram:68, disk:55, net:920, uptime:'260d 9h 30m', uptimeSecs:22490200,
    temp:56, loadAvg:[1.9,1.7,1.5],
    openPorts:[22,80,443,8080,8443],
    portLabels:{22:'SSH',80:'HTTP',443:'HTTPS',8080:'SAPO-App',8443:'SAPO-Secure'},
    shutdownReason:null, shutdownBy:null, shutdownAt:null,
    logs:[{time:'2021-10-05T08:00:00',event:'Servidor registrado',user:'SGTIC',type:'create'}],
    services:['tomcat','nginx','ssh','firewalld'],
    fortiPolicy:'POL-SEC-017', cpuHistory:D30(58), ramHistory:D30(68), netHistory:D30(920),
    netIn:550, netOut:370, sshEnabled:true, vcpus:4, ramTotal:16, diskTotal:300,
    tags:['SAPO','antecedentes','GACRI','producción'],
    authorizedUsers:['Gacri-SGIC','SGTIC'],
    applications:['SAPO-G Antecedentes']
  },

  {
    id:'SRV-018', hostname:'siav-app', ip:'172.21.68.151',
    mac:'00:50:56:A1:00:18', location:'Rack E · Slot 03', os:'Ubuntu 20.04 LTS',
    os_version:'20.04.6', kernel:'5.4.0-182', requestedBy:'SGTIC', department:'Desarrollo',
    purpose:'Sistema Atención a Víctima (SIAV) — Aplicación',
    status:'active', environment:'production', type:'web',
    createdAt:'2021-12-01T08:00:00', lastSeen:NOW,
    cpu:35, ram:48, disk:40, net:480, uptime:'200d 6h 00m', uptimeSecs:17300000,
    temp:46, loadAvg:[1.0,0.9,0.8],
    openPorts:[22,80,443,8080],
    portLabels:{22:'SSH',80:'HTTP',443:'HTTPS',8080:'SIAV-App'},
    shutdownReason:null, shutdownBy:null, shutdownAt:null,
    logs:[{time:'2021-12-01T08:00:00',event:'Servidor registrado',user:'SGTIC',type:'create'}],
    services:['tomcat','nginx','ssh'],
    fortiPolicy:null, cpuHistory:D30(35), ramHistory:D30(48), netHistory:D30(480),
    netIn:280, netOut:200, sshEnabled:true, vcpus:2, ramTotal:8, diskTotal:150,
    tags:['SIAV','víctima','OAV'],
    authorizedUsers:['Oav-SGO','SGTIC'],
    applications:['SIAV - Atención Víctima']
  },

  {
    id:'SRV-019', hostname:'sispe-app', ip:'172.21.68.22',
    mac:'00:50:56:A1:00:19', location:'Rack F · Slot 01', os:'Oracle Linux 7',
    os_version:'7.9', kernel:'5.4.17-2102', requestedBy:'SGTIC', department:'Desarrollo',
    purpose:'SISPE — Sistema de Seguridad Policial Electrónica (App + WS)',
    status:'active', environment:'production', type:'web',
    createdAt:'2020-06-15T08:00:00', lastSeen:NOW,
    cpu:65, ram:72, disk:60, net:1200, uptime:'380d 5h 30m', uptimeSecs:32839800,
    temp:60, loadAvg:[2.2,2.0,1.8],
    openPorts:[22,80,443,8080,1521],
    portLabels:{22:'SSH',80:'HTTP',443:'HTTPS',8080:'SISPE-App',1521:'Oracle-DB'},
    shutdownReason:null, shutdownBy:null, shutdownAt:null,
    logs:[{time:'2020-06-15T08:00:00',event:'Servidor registrado',user:'SGTIC',type:'create'}],
    services:['oracle-db','tomcat','nginx','ssh'],
    fortiPolicy:'POL-WEB-019', cpuHistory:D30(65), ramHistory:D30(72), netHistory:D30(1200),
    netIn:720, netOut:480, sshEnabled:true, vcpus:8, ramTotal:32, diskTotal:500,
    tags:['SISPE','PNC','crítico','Oracle'],
    authorizedUsers:['PNC'],
    applications:['SISPE App','Webservice SISPE']
  },

  {
    id:'SRV-020', hostname:'gitlab', ip:'172.21.68.25',
    mac:'00:50:56:A1:00:20', location:'Rack F · Slot 02', os:'Ubuntu 22.04 LTS',
    os_version:'22.04.3', kernel:'6.2.0-37', requestedBy:'SGTIC', department:'Infraestructura',
    purpose:'GitLab CE — Repositorios de código fuente institucional',
    status:'active', environment:'production', type:'infra',
    createdAt:'2022-09-01T08:00:00', lastSeen:NOW,
    cpu:42, ram:65, disk:68, net:680, uptime:'160d 7h 10m', uptimeSecs:13851000,
    temp:50, loadAvg:[1.3,1.2,1.0],
    openPorts:[22,80,443,2222],
    portLabels:{22:'SSH-Admin',80:'HTTP',443:'HTTPS',2222:'Git-SSH'},
    shutdownReason:null, shutdownBy:null, shutdownAt:null,
    logs:[{time:'2022-09-01T08:00:00',event:'Servidor registrado',user:'SGTIC',type:'create'}],
    services:['gitlab-rails','nginx','postgresql','redis','ssh'],
    fortiPolicy:null, cpuHistory:D30(42), ramHistory:D30(65), netHistory:D30(680),
    netIn:380, netOut:300, sshEnabled:true, vcpus:4, ramTotal:16, diskTotal:500,
    tags:['gitlab','código','DevOps','infraestructura'],
    authorizedUsers:['SGTIC'],
    applications:['GitLab CE']
  },

  // ── WEBSERVICES / APIs ──────────────────────────────────────

  {
    id:'SRV-021', hostname:'ws-api-consultas', ip:'172.21.68.38',
    mac:'00:50:56:A2:00:01', location:'Rack G · Slot 01', os:'Ubuntu 20.04 LTS',
    os_version:'20.04.6', kernel:'5.4.0-182', requestedBy:'SGTIC', department:'Desarrollo',
    purpose:'WS API Consultas — Webservice de consultas institucionales',
    status:'active', environment:'production', type:'api',
    createdAt:'2021-04-10T08:00:00', lastSeen:NOW,
    cpu:38, ram:48, disk:30, net:580, uptime:'240d 8h 00m', uptimeSecs:20764800,
    temp:46, loadAvg:[1.1,1.0,0.8],
    openPorts:[22,80,443,8080,8443],
    portLabels:{22:'SSH',80:'HTTP',443:'HTTPS',8080:'WS-App',8443:'WS-Secure'},
    shutdownReason:null, shutdownBy:null, shutdownAt:null,
    logs:[{time:'2021-04-10T08:00:00',event:'Servidor registrado',user:'SGTIC',type:'create'}],
    services:['tomcat','nginx','ssh'],
    fortiPolicy:'POL-API-021', cpuHistory:D30(38), ramHistory:D30(48), netHistory:D30(580),
    netIn:340, netOut:240, sshEnabled:true, vcpus:4, ramTotal:16, diskTotal:200,
    tags:['API','webservice','consultas'],
    authorizedUsers:['RAP','SGSP','DMED-SGAL','SGTIC'],
    applications:['ws-api-consultas']
  },

  {
    id:'SRV-022', hostname:'ws-autentica', ip:'172.21.68.229',
    mac:'00:50:56:A2:00:02', location:'Rack G · Slot 02', os:'Ubuntu 20.04 LTS',
    os_version:'20.04.6', kernel:'5.4.0-182', requestedBy:'SGTIC', department:'Infraestructura',
    purpose:'WS Autentica — Servicio de autenticación centralizada',
    status:'active', environment:'production', type:'api',
    createdAt:'2021-02-01T08:00:00', lastSeen:NOW,
    cpu:20, ram:32, disk:22, net:350, uptime:'360d 3h 20m', uptimeSecs:31107600,
    temp:40, loadAvg:[0.6,0.5,0.4],
    openPorts:[22,80,443,8080],
    portLabels:{22:'SSH',80:'HTTP',443:'HTTPS',8080:'Auth-API'},
    shutdownReason:null, shutdownBy:null, shutdownAt:null,
    logs:[{time:'2021-02-01T08:00:00',event:'Servidor registrado',user:'SGTIC',type:'create'}],
    services:['tomcat','nginx','ssh'],
    fortiPolicy:'POL-API-022', cpuHistory:D30(20), ramHistory:D30(32), netHistory:D30(350),
    netIn:200, netOut:150, sshEnabled:true, vcpus:2, ramTotal:8, diskTotal:100,
    tags:['autenticación','API','crítico'],
    authorizedUsers:['SGTIC'],
    applications:['ws-autentica']
  },

  {
    id:'SRV-023', hostname:'ws-bancos', ip:'172.21.68.111',
    mac:'00:50:56:A2:00:03', location:'Rack G · Slot 03', os:'CentOS 7',
    os_version:'7.9', kernel:'3.10.0-1160', requestedBy:'SGTIC', department:'Desarrollo',
    purpose:'WS Bancos — Integración bancaria (pagos/recibos)',
    status:'active', environment:'production', type:'api',
    createdAt:'2020-10-15T08:00:00', lastSeen:NOW,
    cpu:28, ram:40, disk:25, net:420, uptime:'310d 5h 00m', uptimeSecs:26802000,
    temp:44, loadAvg:[0.8,0.7,0.6],
    openPorts:[22,80,443,8080,8443],
    portLabels:{22:'SSH',80:'HTTP',443:'HTTPS',8080:'Bancos-WS',8443:'Bancos-Secure'},
    shutdownReason:null, shutdownBy:null, shutdownAt:null,
    logs:[{time:'2020-10-15T08:00:00',event:'Servidor registrado',user:'SGTIC',type:'create'}],
    services:['tomcat','apache2','ssh'],
    fortiPolicy:'POL-API-023', cpuHistory:D30(28), ramHistory:D30(40), netHistory:D30(420),
    netIn:240, netOut:180, sshEnabled:true, vcpus:2, ramTotal:8, diskTotal:100,
    tags:['bancos','pagos','API','integración'],
    authorizedUsers:['SGTIC','Bancos'],
    applications:['ws-bancos','ws-bancos-bi']
  },

  {
    id:'SRV-024', hostname:'ws-renap', ip:'172.21.68.109',
    mac:'00:50:56:A2:00:04', location:'Rack G · Slot 04', os:'Ubuntu 20.04 LTS',
    os_version:'20.04.6', kernel:'5.4.0-182', requestedBy:'SGTIC', department:'Desarrollo',
    purpose:'WsRenap — Integración con RENAP (Registro Nacional de Personas)',
    status:'active', environment:'production', type:'api',
    createdAt:'2021-03-20T08:00:00', lastSeen:NOW,
    cpu:22, ram:35, disk:20, net:310, uptime:'290d 4h 15m', uptimeSecs:25070100,
    temp:41, loadAvg:[0.6,0.5,0.5],
    openPorts:[22,80,443,8080],
    portLabels:{22:'SSH',80:'HTTP',443:'HTTPS',8080:'RENAP-WS'},
    shutdownReason:null, shutdownBy:null, shutdownAt:null,
    logs:[{time:'2021-03-20T08:00:00',event:'Servidor registrado',user:'SGTIC',type:'create'}],
    services:['tomcat','nginx','ssh'],
    fortiPolicy:'POL-API-024', cpuHistory:D30(22), ramHistory:D30(35), netHistory:D30(310),
    netIn:180, netOut:130, sshEnabled:true, vcpus:2, ramTotal:8, diskTotal:100,
    tags:['RENAP','integración','API'],
    authorizedUsers:['SGTIC'],
    applications:['WsRenap']
  },

  // ── BASE DE DATOS ───────────────────────────────────────────

  {
    id:'SRV-025', hostname:'bd-principal', ip:'172.21.68.101',
    mac:'00:50:56:B1:00:01', location:'Rack H · Slot 01', os:'CentOS 7',
    os_version:'7.9', kernel:'3.10.0-1160', requestedBy:'SGTIC', department:'Base de Datos',
    purpose:'BD Principal — RVR, Apolo, SIAV, API-SAT, Expertajes, Novedades, OAV-Hist',
    status:'active', environment:'production', type:'database',
    createdAt:'2020-01-15T08:00:00', lastSeen:NOW,
    cpu:70, ram:78, disk:65, net:1400, uptime:'450d 2h 10m', uptimeSecs:38887200,
    temp:65, loadAvg:[2.8,2.5,2.2],
    openPorts:[22,3306,5432],
    portLabels:{22:'SSH',3306:'MySQL',5432:'PostgreSQL'},
    shutdownReason:null, shutdownBy:null, shutdownAt:null,
    logs:[{time:'2020-01-15T08:00:00',event:'Servidor registrado',user:'SGTIC',type:'create'}],
    services:['mysql','postgresql','ssh','firewalld'],
    fortiPolicy:'POL-DB-025', cpuHistory:D30(70), ramHistory:D30(78), netHistory:D30(1400),
    netIn:850, netOut:550, sshEnabled:true, vcpus:8, ramTotal:64, diskTotal:2000,
    tags:['BD','crítico','producción','MySQL','PostgreSQL'],
    authorizedUsers:['SGTIC'],
    applications:['bd-acepol-his','bd-api-sat-log','bd-apol101','bd-expertajes','bd-novedades','bd-oav-hist','bd-rvr','bd-siav','srv-bd-virtual-principal']
  },

  {
    id:'SRV-026', hostname:'bd-autentica', ip:'172.21.68.102',
    mac:'00:50:56:B1:00:02', location:'Rack H · Slot 02', os:'CentOS 7',
    os_version:'7.9', kernel:'3.10.0-1160', requestedBy:'SGTIC', department:'Base de Datos',
    purpose:'BD Autentica — Base de datos del sistema de autenticación',
    status:'active', environment:'production', type:'database',
    createdAt:'2021-02-01T08:00:00', lastSeen:NOW,
    cpu:25, ram:40, disk:30, net:380, uptime:'360d 8h 00m', uptimeSecs:31132800,
    temp:44, loadAvg:[0.7,0.6,0.5],
    openPorts:[22,3306],
    portLabels:{22:'SSH',3306:'MySQL'},
    shutdownReason:null, shutdownBy:null, shutdownAt:null,
    logs:[{time:'2021-02-01T08:00:00',event:'Servidor registrado',user:'SGTIC',type:'create'}],
    services:['mysql','ssh','firewalld'],
    fortiPolicy:'POL-DB-026', cpuHistory:D30(25), ramHistory:D30(40), netHistory:D30(380),
    netIn:220, netOut:160, sshEnabled:true, vcpus:4, ramTotal:16, diskTotal:500,
    tags:['BD','autenticación','crítico'],
    authorizedUsers:['SGTIC'],
    applications:['bd-autentica']
  },

  {
    id:'SRV-027', hostname:'bd-logs', ip:'172.21.68.103',
    mac:'00:50:56:B1:00:03', location:'Rack H · Slot 03', os:'CentOS 7',
    os_version:'7.9', kernel:'3.10.0-1160', requestedBy:'SGTIC', department:'Base de Datos',
    purpose:'BD Logs — Auditoría y logs: C3PO, Mega, R2D2, MySQL-log',
    status:'active', environment:'production', type:'database',
    createdAt:'2021-03-10T08:00:00', lastSeen:NOW,
    cpu:30, ram:45, disk:72, net:450, uptime:'340d 11h 20m', uptimeSecs:29419200,
    temp:46, loadAvg:[0.9,0.8,0.7],
    openPorts:[22,3306],
    portLabels:{22:'SSH',3306:'MySQL'},
    shutdownReason:null, shutdownBy:null, shutdownAt:null,
    logs:[{time:'2021-03-10T08:00:00',event:'Servidor registrado',user:'SGTIC',type:'create'}],
    services:['mysql','ssh','firewalld'],
    fortiPolicy:'POL-DB-027', cpuHistory:D30(30), ramHistory:D30(45), netHistory:D30(450),
    netIn:260, netOut:190, sshEnabled:true, vcpus:4, ramTotal:32, diskTotal:4000,
    tags:['BD','logs','auditoría'],
    authorizedUsers:['SGTIC'],
    applications:['audit-ws-c3po','audit-ws-mega','audit-ws-r2d2','log-mysql']
  },

  {
    id:'SRV-028', hostname:'bd-sapo', ip:'172.21.68.202',
    mac:'00:50:56:B1:00:04', location:'Rack H · Slot 04', os:'Ubuntu 20.04 LTS',
    os_version:'20.04.6', kernel:'5.4.0-182', requestedBy:'SGTIC', department:'Base de Datos',
    purpose:'BD SAPO — Antecedentes, BNC, registro de antecedentes policiales',
    status:'active', environment:'production', type:'database',
    createdAt:'2020-09-01T08:00:00', lastSeen:NOW,
    cpu:55, ram:68, disk:58, net:820, uptime:'380d 4h 00m', uptimeSecs:32860800,
    temp:58, loadAvg:[1.8,1.6,1.4],
    openPorts:[22,3306,5432],
    portLabels:{22:'SSH',3306:'MySQL',5432:'PostgreSQL'},
    shutdownReason:null, shutdownBy:null, shutdownAt:null,
    logs:[{time:'2020-09-01T08:00:00',event:'Servidor registrado',user:'SGTIC',type:'create'}],
    services:['mysql','postgresql','ssh','firewalld'],
    fortiPolicy:'POL-DB-028', cpuHistory:D30(55), ramHistory:D30(68), netHistory:D30(820),
    netIn:480, netOut:340, sshEnabled:true, vcpus:8, ramTotal:64, diskTotal:2000,
    tags:['BD','SAPO','antecedentes','crítico'],
    authorizedUsers:['SGTIC'],
    applications:['bd-pnc202','bd-sapo-antpol','bd-sapo-bnc','bd-sapo']
  },

  {
    id:'SRV-029', hostname:'bd-sispe-oracle', ip:'172.38.0.5',
    mac:'00:50:56:B1:00:05', location:'Rack I · Slot 01', os:'Oracle Linux 7',
    os_version:'7.9', kernel:'5.4.17-2102', requestedBy:'SGTIC', department:'Base de Datos',
    purpose:'BD SISPE Oracle — Base de datos Oracle para SISPE',
    status:'active', environment:'production', type:'database',
    createdAt:'2019-06-10T08:00:00', lastSeen:NOW,
    cpu:60, ram:75, disk:62, net:980, uptime:'500d 1h 30m', uptimeSecs:43207800,
    temp:62, loadAvg:[2.0,1.8,1.6],
    openPorts:[22,1521,5500],
    portLabels:{22:'SSH',1521:'Oracle-DB',5500:'Oracle-EM'},
    shutdownReason:null, shutdownBy:null, shutdownAt:null,
    logs:[{time:'2019-06-10T08:00:00',event:'Servidor registrado',user:'SGTIC',type:'create'}],
    services:['oracle-db','oracle-listener','ssh'],
    fortiPolicy:'POL-DB-029', cpuHistory:D30(60), ramHistory:D30(75), netHistory:D30(980),
    netIn:580, netOut:400, sshEnabled:true, vcpus:8, ramTotal:128, diskTotal:4000,
    tags:['BD','Oracle','SISPE','crítico','DG'],
    authorizedUsers:['DG/IG'],
    applications:['Bd sispe Oracle']
  },

  {
    id:'SRV-030', hostname:'bd-policiales', ip:'172.21.69.33',
    mac:'00:50:56:B1:00:06', location:'Rack I · Slot 02', os:'CentOS 7',
    os_version:'7.9', kernel:'3.10.0-1160', requestedBy:'SGTIC', department:'Base de Datos',
    purpose:'BD Policiales en Línea y Extravíos',
    status:'active', environment:'production', type:'database',
    createdAt:'2020-12-01T08:00:00', lastSeen:NOW,
    cpu:45, ram:58, disk:52, net:660, uptime:'350d 7h 30m', uptimeSecs:30253800,
    temp:50, loadAvg:[1.4,1.3,1.1],
    openPorts:[22,3306],
    portLabels:{22:'SSH',3306:'MySQL'},
    shutdownReason:null, shutdownBy:null, shutdownAt:null,
    logs:[{time:'2020-12-01T08:00:00',event:'Servidor registrado',user:'SGTIC',type:'create'}],
    services:['mysql','ssh','firewalld'],
    fortiPolicy:'POL-DB-030', cpuHistory:D30(45), ramHistory:D30(58), netHistory:D30(660),
    netIn:380, netOut:280, sshEnabled:true, vcpus:4, ramTotal:32, diskTotal:2000,
    tags:['BD','policiales','extravíos'],
    authorizedUsers:['SGTIC'],
    applications:['Bd policiales en línea','Bd-Extravíos']
  },

  {
    id:'SRV-031', hostname:'bd-flota-vehicular', ip:'172.21.69.38',
    mac:'00:50:56:B1:00:07', location:'Rack I · Slot 03', os:'Ubuntu 20.04 LTS',
    os_version:'20.04.6', kernel:'5.4.0-182', requestedBy:'SGTIC', department:'Base de Datos',
    purpose:'BD Flota Vehicular',
    status:'active', environment:'production', type:'database',
    createdAt:'2021-11-20T08:00:00', lastSeen:NOW,
    cpu:28, ram:42, disk:38, net:350, uptime:'220d 5h 00m', uptimeSecs:19026000,
    temp:44, loadAvg:[0.8,0.7,0.6],
    openPorts:[22,3306],
    portLabels:{22:'SSH',3306:'MySQL'},
    shutdownReason:null, shutdownBy:null, shutdownAt:null,
    logs:[{time:'2021-11-20T08:00:00',event:'Servidor registrado',user:'SGTIC',type:'create'}],
    services:['mysql','ssh','firewalld'],
    fortiPolicy:null, cpuHistory:D30(28), ramHistory:D30(42), netHistory:D30(350),
    netIn:200, netOut:150, sshEnabled:true, vcpus:2, ramTotal:16, diskTotal:500,
    tags:['BD','flota'],
    authorizedUsers:['SGTIC','Josue Ischiu'],
    applications:['Bd-FlotaV']
  },

  {
    id:'SRV-032', hostname:'bd-sae', ip:'172.20.10.53',
    mac:'00:50:56:B1:00:08', location:'Rack J · Slot 01', os:'Ubuntu 20.04 LTS',
    os_version:'20.04.6', kernel:'5.4.0-182', requestedBy:'SGTIC', department:'Base de Datos',
    purpose:'BD SAE — Base de datos Sistema Armas y Explosivos',
    status:'active', environment:'production', type:'database',
    createdAt:'2021-08-20T08:00:00', lastSeen:NOW,
    cpu:22, ram:35, disk:30, net:280, uptime:'220d 3h 00m', uptimeSecs:19018800,
    temp:40, loadAvg:[0.6,0.5,0.4],
    openPorts:[22,3306],
    portLabels:{22:'SSH',3306:'MySQL'},
    shutdownReason:null, shutdownBy:null, shutdownAt:null,
    logs:[{time:'2021-08-20T08:00:00',event:'Servidor registrado',user:'SGTIC',type:'create'}],
    services:['mysql','ssh','firewalld'],
    fortiPolicy:null, cpuHistory:D30(22), ramHistory:D30(35), netHistory:D30(280),
    netIn:160, netOut:120, sshEnabled:true, vcpus:2, ramTotal:8, diskTotal:500,
    tags:['BD','SAE'],
    authorizedUsers:['SGTIC'],
    applications:['Bd-sae']
  },

  {
    id:'SRV-033', hostname:'dmz-publico', ip:'10.10.30.3',
    mac:'00:50:56:C1:00:01', location:'Rack DMZ · Slot 01', os:'Ubuntu 22.04 LTS',
    os_version:'22.04.3', kernel:'6.2.0-37', requestedBy:'SGTIC', department:'Infraestructura',
    purpose:'DMZ Público — sistemas.pnc.gob.gt (Portal Nacional)',
    status:'active', environment:'production', type:'web',
    createdAt:'2020-05-01T08:00:00', lastSeen:NOW,
    cpu:68, ram:72, disk:55, net:2200, uptime:'400d 6h 00m', uptimeSecs:34599600,
    temp:63, loadAvg:[2.4,2.2,2.0],
    openPorts:[22,80,443],
    portLabels:{22:'SSH',80:'HTTP',443:'HTTPS'},
    shutdownReason:null, shutdownBy:null, shutdownAt:null,
    logs:[{time:'2020-05-01T08:00:00',event:'Servidor registrado',user:'SGTIC',type:'create'}],
    services:['nginx','php-fpm','ssh','fail2ban','ufw'],
    fortiPolicy:'POL-DMZ-033', cpuHistory:D30(68), ramHistory:D30(72), netHistory:D30(2200),
    netIn:1400, netOut:800, sshEnabled:true, vcpus:4, ramTotal:16, diskTotal:200,
    tags:['DMZ','público','nacional','PNC.GOB.GT'],
    authorizedUsers:['NACIONAL'],
    applications:['sistemas.pnc.gob.gt']
  },

  {
    id:'SRV-034', hostname:'pmx-dmz-fisico', ip:'10.10.30.2',
    mac:'00:50:56:C1:00:02', location:'Rack DMZ · Slot 02', os:'Proxmox VE 8',
    os_version:'8.1', kernel:'6.5.13-5-pve', requestedBy:'SGTIC', department:'Infraestructura',
    purpose:'PMX DMZ Físico — Hipervisor Proxmox zona DMZ',
    status:'active', environment:'production', type:'infra',
    createdAt:'2021-01-20T08:00:00', lastSeen:NOW,
    cpu:35, ram:55, disk:48, net:780, uptime:'330d 9h 00m', uptimeSecs:28544400,
    temp:52, loadAvg:[1.1,1.0,0.9],
    openPorts:[22,8006,443,5900],
    portLabels:{22:'SSH',8006:'Proxmox-WebUI',443:'HTTPS',5900:'VNC'},
    shutdownReason:null, shutdownBy:null, shutdownAt:null,
    logs:[{time:'2021-01-20T08:00:00',event:'Servidor registrado',user:'SGTIC',type:'create'}],
    services:['pve-manager','corosync','ssh'],
    fortiPolicy:null, cpuHistory:D30(35), ramHistory:D30(55), netHistory:D30(780),
    netIn:440, netOut:340, sshEnabled:true, vcpus:32, ramTotal:256, diskTotal:8000,
    tags:['Proxmox','hipervisor','DMZ','infraestructura'],
    authorizedUsers:['SGTIC'],
    applications:['PMX DMZ Físico']
  },

];
