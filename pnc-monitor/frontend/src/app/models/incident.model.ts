export type IncidentPriority = 'critical' | 'high' | 'medium' | 'low';
export type IncidentStatus   = 'open' | 'in_progress' | 'resolved' | 'closed';
export type IncidentCategory = 'hardware' | 'software' | 'network' | 'security' | 'performance' | 'planned';

export interface IncidentComment {
  id: string; time: string; user: string; text: string;
}
export interface Incident {
  id: string; title: string; description: string;
  serverId: string | null; serverName: string;
  priority: IncidentPriority; status: IncidentStatus; category: IncidentCategory;
  assignedTo: string; reportedBy: string;
  createdAt: string; updatedAt: string; resolvedAt: string | null; eta: string | null;
  comments: IncidentComment[]; affectedServices: string[]; sla: number;
}

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id:'INC-0071', title:'Alta carga CPU en BD Principal (172.21.68.101)',
    description:'El servidor bd-principal presenta CPU sostenido al 70-75%. Múltiples aplicaciones simultáneas (RVR, SIAV, Apolo, Novedades) generando carga elevada. Se requiere análisis de queries pesadas.',
    serverId:'SRV-025', serverName:'bd-principal',
    priority:'high', status:'in_progress', category:'performance',
    assignedTo:'Gerson Cabrera Rivera', reportedBy:'Sistema (auto-detect)',
    createdAt:'2025-03-12T06:00:00', updatedAt:'2025-03-12T07:30:00',
    resolvedAt:null, eta:'2025-03-12T12:00:00',
    comments:[
      {id:'c1',time:'2025-03-12T06:05:00',user:'Sistema',text:'Umbral CPU ≥ 70% detectado. Alerta automática generada.'},
      {id:'c2',time:'2025-03-12T07:30:00',user:'Gerson Cabrera Rivera',text:'Identificadas queries sin índice en bd-novedades. Aplicando EXPLAIN ANALYZE. Revisando slow_query_log.'},
    ],
    affectedServices:['mysql','postgresql'], sla:8
  },
  {
    id:'INC-0070', title:'Portal Antecedentes en Línea — Latencia elevada',
    description:'El servidor antecedentes-linea (172.21.68.194) presenta tiempos de respuesta superiores a 8 segundos. Alto volumen de consultas desde el portal público PNC.',
    serverId:'SRV-014', serverName:'antecedentes-linea',
    priority:'high', status:'open', category:'performance',
    assignedTo:'Edinw Marroquin', reportedBy:'PNC',
    createdAt:'2025-03-11T14:30:00', updatedAt:'2025-03-11T14:35:00',
    resolvedAt:null, eta:'2025-03-11T18:00:00',
    comments:[
      {id:'c3',time:'2025-03-11T14:35:00',user:'Sistema',text:'Tráfico entrante excede 1,800 Kbps. Revisar caché y pool de conexiones.'},
    ],
    affectedServices:['nginx','nodejs'], sla:4
  },
  {
    id:'INC-0069', title:'Certificado SSL por vencer — sistemas.pnc.gob.gt',
    description:'El certificado SSL del servidor dmz-publico (10.10.30.3) vence en 12 días. Requiere renovación antes del 24 de marzo de 2025.',
    serverId:'SRV-033', serverName:'dmz-publico',
    priority:'medium', status:'open', category:'planned',
    assignedTo:'SGTIC', reportedBy:'SGTIC',
    createdAt:'2025-03-12T08:00:00', updatedAt:'2025-03-12T08:00:00',
    resolvedAt:null, eta:'2025-03-20T12:00:00',
    comments:[],
    affectedServices:['nginx'], sla:72
  },
  {
    id:'INC-0068', title:'Actualización de kernel — bd-sispe-oracle',
    description:'Parche de seguridad crítico para Oracle Linux 7 en bd-sispe-oracle (172.38.0.5). Requiere ventana de mantenimiento nocturna y coordinación con DG/IG.',
    serverId:'SRV-029', serverName:'bd-sispe-oracle',
    priority:'medium', status:'in_progress', category:'planned',
    assignedTo:'Willian Ortiz Cruz', reportedBy:'SGTIC',
    createdAt:'2025-03-10T09:00:00', updatedAt:'2025-03-11T20:00:00',
    resolvedAt:null, eta:'2025-03-13T02:00:00',
    comments:[
      {id:'c4',time:'2025-03-10T09:00:00',user:'Willian Ortiz Cruz',text:'Coordinando ventana de mantenimiento con DG/IG para el 13 de marzo a las 01:00.'},
      {id:'c5',time:'2025-03-11T20:00:00',user:'Willian Ortiz Cruz',text:'Confirmada ventana. Backup completo de BD Oracle realizado y verificado.'},
    ],
    affectedServices:['oracle-db','oracle-listener'], sla:48
  },
  {
    id:'INC-0067', title:'Intentos de acceso no autorizado — GitLab',
    description:'Se detectaron 1,243 intentos fallidos de autenticación en GitLab (172.21.68.25) desde IPs externas durante 2 horas. fail2ban activado. Se requiere revisión de políticas de acceso.',
    serverId:'SRV-020', serverName:'gitlab',
    priority:'high', status:'resolved', category:'security',
    assignedTo:'SGTIC', reportedBy:'Sistema (auto-detect)',
    createdAt:'2025-03-09T22:00:00', updatedAt:'2025-03-10T01:30:00',
    resolvedAt:'2025-03-10T01:30:00', eta:null,
    comments:[
      {id:'c6',time:'2025-03-09T22:05:00',user:'Sistema',text:'fail2ban bloqueó rangos 185.220.x.x y 45.33.x.x automáticamente.'},
      {id:'c7',time:'2025-03-10T01:30:00',user:'SGTIC',text:'Bloqueo permanente en FortiGate. Revisión de usuarios activos completada. Sin accesos exitosos no autorizados.'},
    ],
    affectedServices:['gitlab-rails'], sla:4
  },
];
