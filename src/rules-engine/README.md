# Motor de Reglas (Rules Engine)

Sistema configurable de reglas de negocio para el MES que permite definir condiciones y acciones automatizadas basadas en eventos.

## 📋 Características

- ✅ **Reglas configurables** basadas en eventos del sistema
- ✅ **Condiciones flexibles** con operadores lógicos (AND, OR, NOT)
- ✅ **Acciones automatizadas** (bloqueos, alertas, notificaciones, creación de OTs, etc.)
- ✅ **Ámbitos de aplicación** (global, planta, área, máquina, producto, etc.)
- ✅ **Priorización** y orden de ejecución
- ✅ **Límites y cooldown** para evitar ejecuciones excesivas
- ✅ **Historial completo** de ejecuciones
- ✅ **Estadísticas** de rendimiento por regla

## 🏗️ Arquitectura

### Componentes principales

```
rules-engine/
├── entities/           # Entidades TypeORM (Rule, RuleExecution)
├── dto/                # DTOs de validación
├── types/              # Enums y tipos TypeScript
├── evaluators/         # Lógica de evaluación
│   ├── condition.evaluator.ts  # Evalúa condiciones
│   └── action.executor.ts      # Ejecuta acciones
├── services/           # Servicios de negocio
├── controllers/        # Controladores REST
└── predefined-rules.ts # Reglas predefinidas del sistema
```

### Flujo de ejecución

1. **Evento** → Se dispara un evento en el sistema (ej: ORDER_COMPLETED)
2. **Búsqueda** → Se buscan reglas aplicables al evento y contexto
3. **Evaluación** → Se evalúan las condiciones de cada regla
4. **Ejecución** → Si las condiciones pasan, se ejecutan las acciones
5. **Registro** → Se guarda el resultado en el historial

## 🚀 Instalación

### 1. Crear tablas en la base de datos

```powershell
cd scripts
.\setup-rules-engine.ps1
```

O manualmente:
```bash
docker exec -i mes_postgres psql -U mes_user -d mes_db -f scripts/create-rules-engine-tables.sql
```

### 2. Verificar instalación

```bash
# Verificar que las tablas existen
docker exec -i mes_postgres psql -U mes_user -d mes_db -c "\dt rules*"

# Deberías ver:
# - rules
# - rule_executions
# - approvals
# - alerts
```

## 📖 Uso

### Tipos de Eventos

```typescript
RuleEventType {
  // Órdenes de Producción
  ORDER_CREATED, ORDER_STARTED, ORDER_PAUSED, 
  ORDER_RESUMED, ORDER_COMPLETED, ORDER_CANCELLED,
  
  // Calidad
  INSPECTION_CREATED, INSPECTION_COMPLETED, INSPECTION_FAILED,
  DEFECT_REGISTERED, DEFECT_RATE_EXCEEDED,
  
  // Máquinas
  MACHINE_STOPPED, MACHINE_RUNNING, DOWNTIME_THRESHOLD_EXCEEDED,
  
  // Inventario/Lotes
  LOT_CREATED, LOT_CONSUMED, LOT_BLOCKED, STOCK_BELOW_MIN,
  
  // Mantenimiento
  MAINTENANCE_DUE, MAINTENANCE_COMPLETED,
  
  // Programados
  SCHEDULED_CHECK, TIME_BASED_TRIGGER
}
```

### Tipos de Condiciones

```typescript
RuleConditionType {
  // Comparaciones
  FIELD_EQUALS, FIELD_NOT_EQUALS, FIELD_GREATER_THAN, 
  FIELD_LESS_THAN, FIELD_IN, FIELD_CONTAINS, FIELD_IS_NULL,
  
  // Estado del sistema
  HAS_PENDING_INSPECTIONS, HAS_ACTIVE_ALERTS,
  IS_LOT_BLOCKED, IS_MACHINE_AVAILABLE,
  
  // Tiempo
  DURATION_EXCEEDED, WITHIN_TIME_RANGE, WEEKDAY_IS,
  
  // Porcentajes
  PERCENTAGE_EXCEEDS, PERCENTAGE_BELOW,
  
  // Custom
  CUSTOM_QUERY, CUSTOM_FUNCTION
}
```

### Tipos de Acciones

```typescript
RuleActionType {
  // Bloqueos
  BLOCK_ORDER, BLOCK_LOT, BLOCK_MACHINE, 
  PREVENT_COMPLETION, REQUIRE_APPROVAL,
  
  // Creación
  CREATE_ALERT, CREATE_NOTIFICATION, 
  CREATE_WORK_ORDER, CREATE_INSPECTION,
  
  // Actualizaciones
  UPDATE_ORDER_STATUS, UPDATE_MACHINE_STATUS,
  UPDATE_LOT_STATUS, UPDATE_FIELD_VALUE,
  
  // Notificaciones
  SEND_EMAIL, SEND_SMS, SEND_PUSH_NOTIFICATION,
  
  // Logging
  LOG_EVENT, LOG_METRIC,
  
  // Custom
  EXECUTE_WEBHOOK, EXECUTE_CUSTOM_FUNCTION
}
```

## 📝 Ejemplos de Reglas

### Ejemplo 1: No permitir finalizar orden con inspecciones pendientes

```typescript
{
  code: 'RULE-QA-001',
  name: 'Prevenir completación si hay inspección pendiente',
  eventType: RuleEventType.ORDER_COMPLETED,
  priority: RulePriority.HIGH,
  scope: RuleScope.GLOBAL,
  conditions: {
    operator: LogicalOperator.AND,
    conditions: [
      {
        type: RuleConditionType.HAS_PENDING_INSPECTIONS,
      },
    ],
  },
  actions: [
    {
      type: RuleActionType.PREVENT_COMPLETION,
      params: {
        blockReason: 'Inspecciones de calidad pendientes',
      },
    },
    {
      type: RuleActionType.CREATE_ALERT,
      params: {
        title: 'Completación bloqueada',
        message: 'La orden {{entityId}} tiene inspecciones pendientes',
        severity: 'HIGH',
      },
    },
  ],
}
```

### Ejemplo 2: Bloquear lote si tasa de defectos > 5%

```typescript
{
  code: 'RULE-QA-002',
  name: 'Bloquear lote por alta tasa de defectos',
  eventType: RuleEventType.DEFECT_REGISTERED,
  priority: RulePriority.CRITICAL,
  conditions: {
    operator: LogicalOperator.AND,
    conditions: [
      {
        type: RuleConditionType.PERCENTAGE_EXCEEDS,
        field: 'entityData.defectRate',
        value: 5.0,
      },
    ],
  },
  actions: [
    {
      type: RuleActionType.BLOCK_LOT,
      params: {
        blockReason: 'Tasa de defectos superior al 5%',
      },
    },
    {
      type: RuleActionType.CREATE_INSPECTION,
      params: {
        inspectionType: 'QUALITY_AUDIT',
      },
    },
  ],
}
```

### Ejemplo 3: Crear OT si paro > 30 minutos

```typescript
{
  code: 'RULE-MT-001',
  name: 'Crear OT por paro prolongado',
  eventType: RuleEventType.DOWNTIME_THRESHOLD_EXCEEDED,
  priority: RulePriority.HIGH,
  conditions: {
    operator: LogicalOperator.AND,
    conditions: [
      {
        type: RuleConditionType.DURATION_EXCEEDED,
        field: 'entityData.downtimeStartedAt',
        value: 30, // minutos
      },
    ],
  },
  actions: [
    {
      type: RuleActionType.CREATE_WORK_ORDER,
      params: {
        workOrderType: 'CORRECTIVE',
        priority: 'HIGH',
        description: 'Máquina {{machineCode}} detenida más de 30 min',
      },
    },
  ],
  cooldownMinutes: 60, // No generar otra OT durante 1 hora
}
```

## 🔌 API REST

### Crear regla
```http
POST /api/rules-engine
Content-Type: application/json

{
  "code": "RULE-CUSTOM-001",
  "name": "Mi regla personalizada",
  "eventType": "ORDER_STARTED",
  "priority": "HIGH",
  "scope": "GLOBAL",
  "conditions": { ... },
  "actions": [ ... ]
}
```

### Listar reglas
```http
GET /api/rules-engine?eventType=ORDER_COMPLETED&enabled=true
```

### Disparar evento (ejecutar reglas aplicables)
```http
POST /api/rules-engine/trigger
Content-Type: application/json

{
  "eventType": "ORDER_COMPLETED",
  "entityType": "order",
  "entityId": "ORD-12345",
  "entityData": {
    "status": "COMPLETED",
    "productCode": "PROD-001"
  },
  "plantCode": "PLANT-01",
  "userId": "user123"
}
```

### Ver historial de ejecuciones
```http
GET /api/rules-engine/executions/history?ruleCode=RULE-QA-001&limit=50
```

### Estadísticas de una regla
```http
GET /api/rules-engine/{id}/stats
```

## 🔧 Integración con el Sistema

### Disparar eventos desde tu código

```typescript
import { RulesService } from './rules-engine/services/rules.service';
import { RuleEventType } from './rules-engine/types/rule-enums';

@Injectable()
export class ProductionOrdersService {
  constructor(private readonly rulesService: RulesService) {}

  async completeOrder(orderId: string) {
    const order = await this.findOrder(orderId);
    
    // ... lógica de completar orden ...
    
    // Disparar evento para el motor de reglas
    await this.rulesService.triggerEvent(
      RuleEventType.ORDER_COMPLETED,
      {
        eventType: RuleEventType.ORDER_COMPLETED,
        entityType: 'order',
        entityId: order.id,
        entityData: order,
        timestamp: new Date(),
        plantCode: order.plantCode,
        productCode: order.productCode,
      }
    );
  }
}
```

## 🎯 Casos de Uso por Industria

### Farmacéutica
- ✅ Trazabilidad obligatoria por lote
- ✅ Aprobación de calidad antes de liberar lotes
- ✅ Documentación automática de desviaciones
- ✅ Validación de condiciones ambientales

### Alimentos
- ✅ Control de fechas de caducidad
- ✅ Trazabilidad de alérgenos
- ✅ Verificación de temperaturas
- ✅ Bloqueo automático por defectos críticos

### Automotriz
- ✅ Verificación de torques y especificaciones
- ✅ Trazabilidad de componentes críticos
- ✅ OEE por línea de producción
- ✅ Mantenimiento preventivo automático

### Electrónica
- ✅ Trazabilidad por número de serie
- ✅ Control de componentes ESD
- ✅ Validación de pruebas eléctricas
- ✅ Gestión de versiones de firmware

## 📊 Monitoreo y Mantenimiento

### Consultas útiles

```sql
-- Reglas más ejecutadas
SELECT rule_code, COUNT(*) as executions
FROM rule_executions
WHERE executed_at > NOW() - INTERVAL '7 days'
GROUP BY rule_code
ORDER BY executions DESC
LIMIT 10;

-- Reglas con más fallos
SELECT r.code, r.name, r.failure_count, r.success_count
FROM rules r
WHERE r.failure_count > 0
ORDER BY r.failure_count DESC;

-- Ejecuciones recientes con errores
SELECT re.rule_code, re.event_type, re.error_message, re.executed_at
FROM rule_executions re
WHERE re.result = 'ERROR'
ORDER BY re.executed_at DESC
LIMIT 20;
```

### Mejores prácticas

1. **Prioridad correcta**: Asigna CRITICAL solo a reglas de seguridad/cumplimiento
2. **Cooldown apropiado**: Evita spam de alertas con cooldownMinutes
3. **Límites diarios**: Usa maxExecutionsPerDay para prevenir loops infinitos
4. **Condiciones específicas**: Condiciones demasiado amplias causan ejecuciones innecesarias
5. **Acciones idempotentes**: Las acciones deben poder ejecutarse múltiples veces sin efectos adversos
6. **Logging adecuado**: Siempre incluye LOG_EVENT para auditoría
7. **Testing**: Prueba reglas en DRAFT antes de activarlas

## 🔐 Seguridad

- Las consultas custom (CUSTOM_QUERY) son potencialmente peligrosas → validar en producción
- Las acciones UPDATE_FIELD_VALUE requieren validación de tabla/campo contra whitelist
- Los webhooks (EXECUTE_WEBHOOK) deben autenticarse adecuadamente
- Limitar quién puede crear/modificar reglas CRITICAL

## 🚦 Roadmap

- [ ] Editor visual de reglas en el frontend
- [ ] Simulador de reglas (dry-run)
- [ ] Plantillas de reglas por industria
- [ ] Machine learning para sugerencias de reglas
- [ ] Integración con sistemas externos (SAP, MRP)
- [ ] Versionado de reglas
- [ ] A/B testing de reglas

## 📚 Referencias

- [Documentación completa](./RULES_ENGINE_GUIDE.md)
- [Ejemplos de reglas predefinidas](./predefined-rules.ts)
- [API Reference](./API_REFERENCE.md)

## 🤝 Contribuir

Para agregar nuevos tipos de condiciones o acciones:

1. Agregar enum en `types/rule-enums.ts`
2. Implementar evaluador en `evaluators/condition.evaluator.ts`
3. Implementar ejecutor en `evaluators/action.executor.ts`
4. Actualizar documentación

---

**Desarrollado para el sistema MES** | Motor de reglas configurable y extensible
