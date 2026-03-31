export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertState    = 'active' | 'acknowledged' | 'resolved';

export interface AlertRule {
  id: string;
  name: string;
  metric: 'cpu' | 'ram' | 'disk' | 'temp' | 'net' | 'uptime';
  operator: '>' | '<' | '>=' | '<=';
  threshold: number;
  severity: AlertSeverity;
  enabled: boolean;
  notifyEmail: boolean;
  appliesTo: 'all' | string; // serverId
}

export interface AlertEvent {
  id: string;
  ruleId: string;
  ruleName: string;
  serverId: string;
  serverName: string;
  severity: AlertSeverity;
  state: AlertState;
  message: string;
  value: number;
  threshold: number;
  metric: string;
  firedAt: string;
  acknowledgedAt: string | null;
  acknowledgedBy: string | null;
  resolvedAt: string | null;
}

export const DEFAULT_RULES: AlertRule[] = [
  { id: 'RUL-001', name: 'CPU Crítico',      metric: 'cpu',  operator: '>=', threshold: 90, severity: 'critical', enabled: true,  notifyEmail: true,  appliesTo: 'all' },
  { id: 'RUL-002', name: 'CPU Alto',         metric: 'cpu',  operator: '>=', threshold: 80, severity: 'warning',  enabled: true,  notifyEmail: false, appliesTo: 'all' },
  { id: 'RUL-003', name: 'RAM Crítica',      metric: 'ram',  operator: '>=', threshold: 90, severity: 'critical', enabled: true,  notifyEmail: true,  appliesTo: 'all' },
  { id: 'RUL-004', name: 'RAM Alta',         metric: 'ram',  operator: '>=', threshold: 80, severity: 'warning',  enabled: true,  notifyEmail: false, appliesTo: 'all' },
  { id: 'RUL-005', name: 'Disco Lleno',      metric: 'disk', operator: '>=', threshold: 85, severity: 'warning',  enabled: true,  notifyEmail: true,  appliesTo: 'all' },
  { id: 'RUL-006', name: 'Temperatura Alta', metric: 'temp', operator: '>=', threshold: 70, severity: 'critical', enabled: true,  notifyEmail: true,  appliesTo: 'all' },
];
