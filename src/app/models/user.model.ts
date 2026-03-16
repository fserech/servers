export type UserRole = 'admin' | 'operator' | 'auditor' | 'readonly';

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar: string; // initials
  active: boolean;
  lastLogin: string;
  createdAt: string;
  permissions: string[];
  mfaEnabled: boolean;
  loginCount: number;
}

export const SYSTEM_USERS: SystemUser[] = [
  { id: 'USR-001', name: 'Carlos Méndez', email: 'cmendes@empresa.gt', role: 'admin',
    department: 'TI', avatar: 'CM', active: true, lastLogin: new Date().toISOString(),
    createdAt: '2024-01-15T08:00:00', mfaEnabled: true, loginCount: 342,
    permissions: ['server.create','server.edit','server.delete','server.shutdown','incident.all','user.all','report.all'] },
  { id: 'USR-002', name: 'Ana Torres', email: 'atorres@empresa.gt', role: 'operator',
    department: 'Desarrollo', avatar: 'AT', active: true, lastLogin: '2025-03-11T16:30:00',
    createdAt: '2024-03-01T09:00:00', mfaEnabled: true, loginCount: 218,
    permissions: ['server.create','server.edit','server.shutdown','incident.create','incident.edit'] },
  { id: 'USR-003', name: 'M. Fernanda Ruiz', email: 'fruiz@empresa.gt', role: 'operator',
    department: 'Seguridad TI', avatar: 'FR', active: true, lastLogin: '2025-03-12T07:00:00',
    createdAt: '2024-06-15T10:00:00', mfaEnabled: true, loginCount: 189,
    permissions: ['server.view','server.edit','incident.all','report.view'] },
  { id: 'USR-004', name: 'Roberto Sánchez', email: 'rsanchez@empresa.gt', role: 'operator',
    department: 'Infraestructura', avatar: 'RS', active: true, lastLogin: '2025-03-10T09:15:00',
    createdAt: '2024-02-20T08:00:00', mfaEnabled: false, loginCount: 156,
    permissions: ['server.create','server.edit','server.shutdown','incident.create'] },
  { id: 'USR-005', name: 'Luis González', email: 'lgonzalez@empresa.gt', role: 'auditor',
    department: 'TI', avatar: 'LG', active: true, lastLogin: '2025-03-08T11:00:00',
    createdAt: '2024-05-01T08:00:00', mfaEnabled: false, loginCount: 89,
    permissions: ['server.view','incident.view','report.all','audit.view'] },
  { id: 'USR-006', name: 'Patricia Lima', email: 'plima@empresa.gt', role: 'readonly',
    department: 'Administración', avatar: 'PL', active: false, lastLogin: '2025-02-14T10:00:00',
    createdAt: '2024-08-01T08:00:00', mfaEnabled: false, loginCount: 22,
    permissions: ['server.view','report.view'] },
];
