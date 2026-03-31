# 🖥️ Sistema de Control de Servidores — Infraestructura TI
**Angular 17 + Tailwind CSS + TypeScript**

## 📦 Stack Tecnológico
| Tecnología | Versión | Uso |
|---|---|---|
| Angular | 17 | Framework principal |
| Tailwind CSS | 3.x | Estilos utilitarios |
| TypeScript | 5.x | Tipado estático |
| RxJS | 7.x | Reactividad / BehaviorSubject |
| ApexCharts / SVG | — | Gráficas de métricas |
| Angular Router | 17 | Navegación SPA |
| Angular Forms | 17 | Formularios reactivos |

## 🚀 Instalación y Ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
ng serve --open

# 3. Compilar para producción
ng build --configuration=production
```

## 📁 Estructura del Proyecto

```
src/app/
├── models/
│   ├── server.model.ts        # Interface Server + datos iniciales
│   └── policy.model.ts        # Interface FortiPolicy + datos
├── services/
│   ├── server.service.ts      # CRUD servidores + simulación tiempo real
│   ├── fortigate.service.ts   # Gestión de políticas FortiGate
│   └── toast.service.ts       # Notificaciones globales
└── components/
    ├── header/                # Navegación principal
    ├── dashboard/             # Vista resumen + topología
    ├── server-list/           # Tabla de servidores con filtros
    ├── server-detail/         # Métricas en vivo + historial
    ├── fortigate/             # Políticas NGFW FortiGate 200F
    ├── terminal/              # Terminal SSH interactiva
    ├── audit/                 # Registro de auditoría
    └── modals/
        ├── new-server-modal/  # Formulario registro
        └── shutdown-modal/    # Motivo de apagado
```

## 🔧 Para conectar backend real

En `server.service.ts` reemplaza los datos locales con llamadas HTTP:

```typescript
import { HttpClient } from '@angular/common/http';

// GET todos los servidores
this.http.get<Server[]>('/api/servers').subscribe(...)

// POST crear servidor
this.http.post<Server>('/api/servers', data).subscribe(...)

// PATCH apagar servidor
this.http.patch(`/api/servers/${id}/shutdown`, { reason }).subscribe(...)
```

## 🛡️ Integración FortiGate real

En `fortigate.service.ts` conecta via FortiGate REST API:

```typescript
// FortiGate API endpoint
const FORTI_API = 'https://192.168.1.1/api/v2/cmdb/firewall/policy';
const headers = { 'Authorization': 'Bearer YOUR_API_TOKEN' };

this.http.get(FORTI_API, { headers }).subscribe(...)
```

## 🔒 Características de Seguridad
- Registro de auditoría completo con usuario + timestamp
- Motivo obligatorio para apagado de servidores
- Políticas FortiGate con IPS, Antivirus y AppControl
- Terminal SSH simulada para comandos administrativos
- Monitoreo de alertas por uso excesivo de CPU/RAM
