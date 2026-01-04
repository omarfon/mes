# Módulo de Auditoría - Traceability

## Descripción

El módulo de auditoría proporciona un sistema completo de registro y consulta de todas las acciones realizadas en el sistema de trazabilidad. Permite rastrear quién, cuándo y qué cambios se realizaron en las entidades del sistema.

## Endpoints Disponibles

### 1. Crear Registro de Auditoría
```http
POST /api/traceability/audits
Authorization: Bearer {token}
Content-Type: application/json

{
  "action": "CREATE",
  "entityType": "lot",
  "entityId": "123e4567-e89b-12d3-a456-426614174000",
  "userId": "user-uuid",
  "oldValues": null,
  "newValues": {
    "lotNumber": "LOT-2024-001",
    "quantity": 100
  },
  "description": "Creación de nuevo lote",
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "module": "production",
  "metadata": {
    "workCenter": "WC-01"
  }
}
```

**Respuesta:**
```json
{
  "id": "audit-uuid",
  "action": "CREATE",
  "entityType": "lot",
  "entityId": "123e4567-e89b-12d3-a456-426614174000",
  "userId": "user-uuid",
  "user": {
    "id": "user-uuid",
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com"
  },
  "oldValues": null,
  "newValues": {
    "lotNumber": "LOT-2024-001",
    "quantity": 100
  },
  "description": "Creación de nuevo lote",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### 2. Obtener Todos los Registros con Filtros
```http
GET /api/traceability/audits?action=CREATE&entityType=lot&page=1&limit=20
Authorization: Bearer {token}
```

**Parámetros de Query:**
- `action` (opcional): Tipo de acción (CREATE, UPDATE, DELETE, etc.)
- `entityType` (opcional): Tipo de entidad
- `entityId` (opcional): ID de la entidad
- `userId` (opcional): ID del usuario
- `module` (opcional): Módulo del sistema
- `startDate` (opcional): Fecha inicio (ISO 8601)
- `endDate` (opcional): Fecha fin (ISO 8601)
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Resultados por página (default: 20)

**Respuesta:**
```json
{
  "data": [
    {
      "id": "audit-uuid",
      "action": "CREATE",
      "entityType": "lot",
      "entityId": "lot-uuid",
      "user": {
        "id": "user-uuid",
        "firstName": "Juan",
        "lastName": "Pérez",
        "email": "juan@example.com"
      },
      "description": "Creación de nuevo lote",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 20,
  "totalPages": 8
}
```

### 3. Obtener Registro por ID
```http
GET /api/traceability/audits/{id}
Authorization: Bearer {token}
```

### 4. Obtener Auditoría de una Entidad Específica
```http
GET /api/traceability/audits/entity/{entityType}/{entityId}
Authorization: Bearer {token}
```

**Ejemplo:**
```http
GET /api/traceability/audits/entity/lot/123e4567-e89b-12d3-a456-426614174000
```

**Respuesta:**
```json
[
  {
    "id": "audit-1",
    "action": "CREATE",
    "description": "Creación del lote",
    "createdAt": "2024-01-15T10:00:00Z"
  },
  {
    "id": "audit-2",
    "action": "UPDATE",
    "description": "Actualización de cantidad",
    "oldValues": { "quantity": 100 },
    "newValues": { "quantity": 95 },
    "createdAt": "2024-01-15T11:30:00Z"
  },
  {
    "id": "audit-3",
    "action": "BLOCK",
    "description": "Lote bloqueado por control de calidad",
    "createdAt": "2024-01-15T14:00:00Z"
  }
]
```

### 5. Obtener Auditoría de un Usuario
```http
GET /api/traceability/audits/user/{userId}?limit=50
Authorization: Bearer {token}
```

### 6. Obtener Actividad Detallada de un Usuario
```http
GET /api/traceability/audits/user/{userId}/activity?days=30
Authorization: Bearer {token}
```

**Respuesta:**
```json
{
  "recentActivity": [
    {
      "id": "audit-uuid",
      "action": "CREATE",
      "entityType": "lot",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "actionStats": [
    {
      "action": "CREATE",
      "count": 45
    },
    {
      "action": "UPDATE",
      "count": 120
    },
    {
      "action": "VIEW",
      "count": 350
    }
  ]
}
```

### 7. Estadísticas por Tipo de Acción
```http
GET /api/traceability/audits/stats/by-action
Authorization: Bearer {token}
```

**Respuesta:**
```json
[
  {
    "action": "CREATE",
    "count": 450
  },
  {
    "action": "UPDATE",
    "count": 1200
  },
  {
    "action": "DELETE",
    "count": 50
  }
]
```

### 8. Estadísticas por Tipo de Entidad
```http
GET /api/traceability/audits/stats/by-entity-type
Authorization: Bearer {token}
```

**Respuesta:**
```json
[
  {
    "entityType": "lot",
    "count": 850
  },
  {
    "entityType": "serial",
    "count": 650
  },
  {
    "entityType": "movement",
    "count": 1200
  }
]
```

### 9. Línea de Tiempo de Actividad
```http
GET /api/traceability/audits/timeline?days=7
Authorization: Bearer {token}
```

**Respuesta:**
```json
[
  {
    "date": "2024-01-15",
    "count": 125
  },
  {
    "date": "2024-01-16",
    "count": 98
  },
  {
    "date": "2024-01-17",
    "count": 145
  }
]
```

## Tipos de Acciones (AuditAction)

```typescript
enum AuditAction {
  CREATE = 'CREATE',          // Creación
  UPDATE = 'UPDATE',          // Actualización
  DELETE = 'DELETE',          // Eliminación
  VIEW = 'VIEW',              // Visualización
  EXPORT = 'EXPORT',          // Exportación
  IMPORT = 'IMPORT',          // Importación
  APPROVE = 'APPROVE',        // Aprobación
  REJECT = 'REJECT',          // Rechazo
  BLOCK = 'BLOCK',            // Bloqueo
  UNBLOCK = 'UNBLOCK',        // Desbloqueo
}
```

## Modelo de Datos

### Entidad Audit

```typescript
{
  id: string;                 // UUID
  action: AuditAction;        // Tipo de acción
  entityType: string;         // Tipo de entidad (lot, serial, etc.)
  entityId: string;           // ID de la entidad
  userId: string;             // ID del usuario que realizó la acción
  user: {                     // Información del usuario
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  oldValues: any;             // Valores anteriores (JSON)
  newValues: any;             // Valores nuevos (JSON)
  description: string;        // Descripción de la acción
  ipAddress: string;          // IP del cliente
  userAgent: string;          // User agent del navegador
  module: string;             // Módulo del sistema
  metadata: any;              // Metadatos adicionales (JSON)
  createdAt: Date;            // Fecha de creación
}
```

## Casos de Uso

### 1. Registrar Creación de Lote
```typescript
const audit = await auditsService.create({
  action: AuditAction.CREATE,
  entityType: 'lot',
  entityId: lot.id,
  userId: currentUser.id,
  newValues: {
    lotNumber: lot.lotNumber,
    quantity: lot.quantity,
    productId: lot.productId
  },
  description: `Creado lote ${lot.lotNumber}`,
  module: 'production'
});
```

### 2. Registrar Actualización con Comparación
```typescript
const audit = await auditsService.create({
  action: AuditAction.UPDATE,
  entityType: 'lot',
  entityId: lot.id,
  userId: currentUser.id,
  oldValues: {
    quantity: oldQuantity,
    status: oldStatus
  },
  newValues: {
    quantity: newQuantity,
    status: newStatus
  },
  description: `Actualizado lote ${lot.lotNumber}`,
  module: 'production'
});
```

### 3. Ver Historial Completo de una Entidad
```typescript
const history = await auditsService.findByEntity('lot', lotId);
// Retorna todos los cambios realizados en ese lote
```

### 4. Analizar Actividad de Usuario
```typescript
const activity = await auditsService.getUserActivity(userId, 30);
// Retorna actividad de los últimos 30 días
```

## Integración con Frontend

Ver los archivos de ejemplo:
- `angular-services-examples/features/audits.service.ts` - Servicio Angular
- `angular-services-examples/features/audit-log.component.ts` - Componente de ejemplo
- `angular-services-examples/features/audit-log.component.html` - Template HTML

## Características

✅ **Registro automático** de todas las acciones
✅ **Filtrado avanzado** por múltiples criterios
✅ **Historial completo** de entidades
✅ **Análisis de actividad** por usuario
✅ **Estadísticas y reportes** agregados
✅ **Paginación** eficiente
✅ **Relación con usuarios** para información detallada
✅ **Metadatos flexibles** (JSON)
✅ **Timestamps automáticos**
✅ **Índices optimizados** para consultas rápidas

## Notas de Implementación

1. El módulo está completamente integrado con el sistema de autenticación JWT
2. Todos los endpoints requieren autenticación
3. La entidad tiene relación opcional con User para obtener información detallada
4. Los campos oldValues, newValues y metadata usan tipo JSONB para flexibilidad
5. Los índices están optimizados para consultas frecuentes por entidad, usuario y fecha
