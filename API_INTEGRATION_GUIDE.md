# Guía de Integración API - Frontend Angular

## Introducción

Esta gu\u00eda documenta todos los endpoints disponibles del backend NestJS del sistema MES para integrar con tu frontend Angular.

## Configuración Base

### URL Base del API
```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

### Interceptor HTTP para JWT
```typescript
// auth.interceptor.ts
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('token');
    
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    return next.handle(req);
  }
}
```

---

## 1. Módulo de Autenticación (`/auth`)

### Login
```typescript
POST /auth/login
```

**Request:**
```json
{
  "email": "usuario@example.com",
  "password": "contraseña123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "usuario@example.com",
    "name": "Usuario"
  }
}
```

### Registro
```typescript
POST /auth/register
```

**Request:**
```json
{
  "email": "nuevo@example.com",
  "password": "contraseña123",
  "name": "Nuevo Usuario"
}
```

---

## 2. Módulo Dashboard (`/dashboard`) ⭐ NUEVO

### Obtener KPIs Principales
```typescript
GET /dashboard/kpis
```

**Response:**
```json
{
  "production": {
    "activeOrders": 15,
    "completedToday": 8,
    "plannedOrders": 23,
    "delayedOrders": 2,
    "totalQuantityProduced": 15420
  },
  "machines": {
    "total": 50,
    "active": 42,
    "inactive": 5,
    "maintenance": 3,
    "utilizationRate": 84.00
  },
  "efficiency": {
    "oee": 0,
    "performance": 0,
    "quality": 0,
    "availability": 84.00
  }
}
```

**Servicio Angular:**
```typescript
// dashboard.service.ts
@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getKPIs(): Observable<DashboardKPIs> {
    return this.http.get<DashboardKPIs>(`${this.apiUrl}/kpis`);
  }
}
```

### Obtener Tendencia de Producción
```typescript
GET /dashboard/production-trend?days=7
```

**Query Params:**
- `days` (opcional): Número de días (default: 7)

**Response:**
```json
[
  {
    "date": "2025-12-20",
    "planned": 2000,
    "produced": 1850,
    "efficiency": 92.50
  },
  {
    "date": "2025-12-21",
    "planned": 2100,
    "produced": 2050,
    "efficiency": 97.62
  }
]
```

### Órdenes por Estado
```typescript
GET /dashboard/orders-by-status
```

**Response:**
```json
[
  { "status": "PLANNED", "count": 23 },
  { "status": "IN_PROGRESS", "count": 15 },
  { "status": "COMPLETED", "count": 142 },
  { "status": "CANCELLED", "count": 3 }
]
```

---

## 3. Módulo de Notificaciones (`/notifications`) ⭐ NUEVO

### Listar Notificaciones
```typescript
GET /notifications?userId={uuid}&isRead=false&page=1&limit=20
```

**Query Params:**
- `userId` (opcional): UUID del usuario
- `isRead` (opcional): true/false
- `type` (opcional): INFO | WARNING | ERROR | SUCCESS
- `category` (opcional): PRODUCTION | MACHINE | QUALITY | MAINTENANCE | SYSTEM
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Registros por página (default: 20)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "title": "Máquina en mantenimiento",
      "message": "La máquina HIL-001 entró en mantenimiento programado",
      "type": "WARNING",
      "category": "MACHINE",
      "isRead": false,
      "relatedEntityType": "machine",
      "relatedEntityId": "uuid",
      "metadata": { "machineCode": "HIL-001" },
      "createdAt": "2025-12-27T10:30:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 20,
  "totalPages": 3,
  "hasNextPage": true,
  "hasPrevPage": false
}
```

### Crear Notificación
```typescript
POST /notifications
```

**Request:**
```json
{
  "userId": "uuid",
  "title": "Orden completada",
  "message": "La orden de producción OP-12345 ha sido completada",
  "type": "SUCCESS",
  "category": "PRODUCTION",
  "relatedEntityType": "production_order",
  "relatedEntityId": "uuid"
}
```

### Contar No Leídas
```typescript
GET /notifications/unread-count/:userId
```

**Response:**
```json
{
  "count": 12
}
```

### Marcar como Leída
```typescript
PATCH /notifications/:id/read
```

### Marcar Todas como Leídas
```typescript
PATCH /notifications/mark-all-read/:userId
```

**Servicio Angular:**
```typescript
// notifications.service.ts
@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private apiUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  getNotifications(userId: string, isRead?: boolean): Observable<PaginatedResponse<Notification>> {
    let params = new HttpParams().set('userId', userId);
    if (isRead !== undefined) {
      params = params.set('isRead', isRead.toString());
    }
    return this.http.get<PaginatedResponse<Notification>>(this.apiUrl, { params });
  }

  getUnreadCount(userId: string): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/unread-count/${userId}`);
  }

  markAsRead(id: string): Observable<Notification> {
    return this.http.patch<Notification>(`${this.apiUrl}/${id}/read`, {});
  }

  markAllAsRead(userId: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/mark-all-read/${userId}`, {});
  }
}
```

---

## 4. Órdenes de Producción (`/production-orders`)

### Listar Órdenes
```typescript
GET /production-orders?page=1&limit=20&status=IN_PROGRESS
```

**Query Params:**
- `productId`, `routeId`, `mainWorkCenterId` (UUID opcional)
- `status`: PLANNED | IN_PROGRESS | COMPLETED | CANCELLED | ON_HOLD
- `priority` (número)
- `search` (texto)
- `page`, `limit`

### Crear Orden
```typescript
POST /production-orders
```

**Request:**
```json
{
  "code": "OP-12345",
  "externalCode": "ERP-98765",
  "productId": "uuid",
  "routeId": "uuid",
  "quantityPlanned": 1000,
  "priority": 1,
  "mainWorkCenterId": "uuid",
  "shiftId": "uuid",
  "plannedStartDate": "2025-12-28T08:00:00Z",
  "plannedEndDate": "2025-12-28T16:00:00Z",
  "dueDate": "2025-12-29T00:00:00Z",
  "notes": "Orden prioritaria"
}
```

### Obtener Orden
```typescript
GET /production-orders/:id
```

### Actualizar Orden
```typescript
PATCH /production-orders/:id
```

### Actualizar Estado
```typescript
PATCH /production-orders/:id/status
```

**Request:**
```json
{
  "status": "IN_PROGRESS"
}
```

### Eliminar Orden (Soft Delete)
```typescript
DELETE /production-orders/:id
```

---

## 5. Máquinas (`/machines`)

### Listar Máquinas
```typescript
GET /machines?workCenterId={uuid}&status=ACTIVE&page=1&limit=20
```

### Crear Máquina
```typescript
POST /machines
```

**Request:**
```json
{
  "code": "HIL-001",
  "name": "Hiladora 1",
  "description": "Hiladora principal línea A",
  "type": "HILADORA",
  "model": "Toyota XYZ-2000",
  "serialNumber": "SN123456",
  "area": "Hilatura",
  "location": "Nave 1 - Fila A",
  "nominalCapacity": 500,
  "workCenterId": "uuid",
  "status": "ACTIVE",
  "isCritical": true
}
```

### Obtener Máquina
```typescript
GET /machines/:id
```

### Actualizar Máquina
```typescript
PATCH /machines/:id
```

### Cambiar Estado
```typescript
PATCH /machines/:id/status
```

**Request:**
```json
{
  "status": "MAINTENANCE"
}
```

### Eliminar Máquina
```typescript
DELETE /machines/:id
```

---

## 6. Productos (`/products`)

### Listar Productos
```typescript
GET /products?search=hilo&page=1&limit=20
```

### Crear Producto
```typescript
POST /products
```

### Obtener Producto
```typescript
GET /products/:id
```

### Actualizar Producto
```typescript
PATCH /products/:id
```

### Eliminar Producto
```typescript
DELETE /products/:id
```

---

## 7. Otros Módulos Disponibles

### Centros de Trabajo (`/work-centers`)
- CRUD completo para centros de trabajo

### Turnos (`/shifts` o `/schift`)
- CRUD completo para gestión de turnos

### Rutas de Producción (`/routes`)
- CRUD completo para rutas y operaciones

### Usuarios (`/users`)
- CRUD completo para gestión de usuarios

### Calidad (`/quality`)
- Gestión de inspecciones y controles de calidad

### Trazabilidad (`/traceability`)
- Seguimiento de productos y lotes

### Reportes (`/reports`)
- Generación de reportes y analíticas

### Monitoreo (`/monitoring`)
- Monitoreo en tiempo real de producción

---

## Interfaces TypeScript para Angular

### Tipos Comunes
```typescript
// models/pagination.model.ts
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// models/notification.model.ts
export enum NotificationType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}

export enum NotificationCategory {
  PRODUCTION = 'PRODUCTION',
  MACHINE = 'MACHINE',
  QUALITY = 'QUALITY',
  MAINTENANCE = 'MAINTENANCE',
  SYSTEM = 'SYSTEM'
}

export interface Notification {
  id: string;
  userId: string | null;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  isRead: boolean;
  relatedEntityType: string | null;
  relatedEntityId: string | null;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
}

// models/dashboard.model.ts
export interface DashboardKPIs {
  production: {
    activeOrders: number;
    completedToday: number;
    plannedOrders: number;
    delayedOrders: number;
    totalQuantityProduced: number;
  };
  machines: {
    total: number;
    active: number;
    inactive: number;
    maintenance: number;
    utilizationRate: number;
  };
  efficiency: {
    oee: number;
    performance: number;
    quality: number;
    availability: number;
  };
}

export interface ProductionTrend {
  date: string;
  planned: number;
  produced: number;
  efficiency: number;
}

// models/production-order.model.ts
export enum ProductionOrderStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ON_HOLD = 'ON_HOLD'
}

export interface ProductionOrder {
  id: string;
  code: string;
  externalCode?: string;
  productId: string;
  routeId: string;
  quantityPlanned: number;
  quantityProduced: number;
  status: ProductionOrderStatus;
  priority?: number;
  plannedStartDate?: Date;
  plannedEndDate?: Date;
  dueDate?: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// models/machine.model.ts
export enum MachineStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE'
}

export interface Machine {
  id: string;
  code: string;
  name: string;
  description?: string;
  type?: string;
  model?: string;
  serialNumber?: string;
  area?: string;
  location?: string;
  nominalCapacity?: number;
  status: MachineStatus;
  isCritical: boolean;
  workCenterId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Swagger/OpenAPI Documentation

Una vez que el servidor esté corriendo, puedes acceder a la documentación interactiva completa en:

```
http://localhost:3000/api/docs
```

Esto te permitirá:
- Ver todos los endpoints disponibles
- Probar los endpoints directamente desde el navegador
- Ver los esquemas de request/response
- Obtener ejemplos de uso

---

## Notas Importantes

1. **CORS**: Ya está configurado para aceptar peticiones desde `http://localhost:4200`
2. **Autenticación**: Todos los endpoints (excepto `/auth/login` y `/auth/register`) requieren JWT
3. **Paginación**: Los endpoints de listado usan paginación estándar con `page` y `limit`
4. **Validación**: Todos los DTOs tienen validación automática
5. **Soft Delete**: Las eliminaciones son soft deletes (no físicas)

---

## Próximos Pasos

Para implementar en tu frontend Angular:

1. Crear los servicios correspondientes en `src/app/services/`
2. Crear los modelos/interfaces en `src/app/models/`
3. Implementar el interceptor de autenticación
4. Crear los componentes para dashboard y notificaciones
5. Implementar manejo de errores global
6. Agregar loading states en las peticiones HTTP

¿Necesitas ayuda con algún módulo específico o componente Angular?
