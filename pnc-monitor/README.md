# 🖥️ PNC Monitor — Sistema de Monitoreo Real de Infraestructura

Sistema de monitoreo estilo Nagios/Zabbix para infraestructura PNC.
Monitorea **34 servidores reales** con checks automáticos cada 60 segundos.
**Compatible con Windows Docker Desktop, Linux y Mac.**

---

## ⚡ Inicio Rápido (Windows Docker Desktop)

```cmd
:: 1. Descomprime el ZIP y entra a la carpeta
cd pnc-monitor

:: 2. Levanta con Docker Compose
docker compose up -d

:: 3. Espera ~3 min mientras construye las imágenes
::    Ver progreso:
docker compose logs -f

:: 4. Abre el navegador en:
::    http://localhost   →  Frontend Angular
```

---

## 📋 Requisitos

| Requisito | Versión mínima |
|-----------|---------------|
| Docker Desktop (Windows) | 4.x o superior |
| RAM disponible para Docker | 2 GB |
| **Acceso de red a** `172.21.x.x`, `172.20.x.x`, `172.38.x.x`, `10.10.30.x` | Requerido |

> ⚠️ El servidor donde corre Docker **debe tener acceso de red** a las subredes
> de los servidores PNC. Si Docker Desktop está en tu PC y tu PC está en la
> red institucional, los checks funcionan directo.

---

## 🔍 Qué monitorea (checks 100% reales)

Cada 60 segundos el backend hace contra tus 34 servidores:

| Check | Cómo | Ejemplo |
|-------|------|---------|
| **Ping / ICMP** | `ping -c 1 <ip>` sistema real | `ping 172.21.68.101` → 4ms |
| **Puertos TCP** | Conexión TCP con timeout 3s | `:3306 MySQL` → abierto/cerrado |
| **HTTP/HTTPS** | GET real con axios | `http://172.21.68.194` → HTTP 200, 1.2s |

---

## 🌐 Arquitectura Docker (Windows compatible)

```
Navegador (http://localhost)
        │
        ▼
┌─────────────────────┐
│  pnc-monitor-frontend │  puerto 80
│  Angular + Nginx     │
│  Nginx proxea /api/  │
│  y /ws al backend    │
└──────────┬──────────┘
           │ red interna Docker (monitor-net)
           ▼
┌─────────────────────┐
│  pnc-monitor-backend │  puerto 3001 (interno)
│  Node.js             │
│  Hace ping, TCP, HTTP│
│  desde el contenedor │
└─────────────────────┘
```

> No se usa `network_mode: host` — compatible con Windows Docker Desktop.
> Nginx actúa como proxy para el WebSocket y la API REST.

---

## 🚨 Estados posibles

| Estado | Significado |
|--------|-------------|
| 🟢 `EN LÍNEA` | Ping ✓, puertos críticos abiertos, HTTP OK |
| 🔴 `CAÍDO` | Ping no responde (ICMP timeout) |
| 🟡 `DEGRADADO` | Ping OK pero puertos críticos cerrados |
| 🟡 `PARCIAL` | Ping OK, algunos puertos cerrados |
| 🟡 `ERROR HTTP` | Ping/puertos OK pero HTTP retorna 4xx/5xx |
| ⚪ `DESCONOCIDO` | Aún no se ejecutó el primer check |

---

## 🔧 Comandos útiles

```cmd
:: Ver logs del backend en tiempo real (ver checks ejecutándose)
docker logs -f pnc-monitor-backend

:: Reiniciar solo el backend (si cambias configuración)
docker compose restart backend

:: Detener todo
docker compose down

:: Detener y borrar datos históricos
docker compose down -v

:: Forzar reconstrucción de imágenes
docker compose up -d --build

:: Ver estado de los contenedores
docker compose ps
```

---

## ⚙️ Configurar intervalo de checks

Edita `docker-compose.yml`:
```yaml
environment:
  CHECK_INTERVAL_SEC: "30"   # cada 30 segundos (default: 60)
```
Luego: `docker compose restart backend`

---

## 🔌 API REST directa

```
GET  http://localhost/api/status       → Estado actual de los 34 targets
GET  http://localhost/api/alerts       → Alertas activas
POST http://localhost/api/check        → Forzar check de todos
POST http://localhost/api/check/SRV-001 → Forzar check de un servidor
GET  http://localhost/api/history/SRV-001?n=60 → Últimos 60 checks
```

---

## 📁 Estructura

```
pnc-monitor/
├── docker-compose.yml      ← Levanta todo con un comando
├── backend/
│   ├── Dockerfile
│   └── src/
│       ├── server.js       ← Express + WebSocket
│       ├── checker.js      ← Ping, TCP, HTTP reales
│       ├── store.js        ← Estado en memoria + JSON persistente
│       └── targets.js      ← 34 servidores de ACCESOS.xlsx
└── frontend/
    ├── Dockerfile
    ├── nginx.conf          ← Proxy /api/ y /ws al backend
    └── src/app/
        ├── components/monitor-dashboard/  ← Tabla estado en vivo
        ├── components/monitor-detail/     ← Historial + puertos
        └── services/monitor.service.ts    ← WebSocket client
```
