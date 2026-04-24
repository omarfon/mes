# 🎯 Motor de Reglas - Resumen de Implementación e Integración

## ✅ Implementación Completa del Motor de Reglas

### 📁 Archivos Creados

#### Core del Motor
- ✅ `src/rules-engine/types/rule-enums.ts` - 24 eventos, 20+ condiciones, 15+ acciones
- ✅ `src/rules-engine/types/rule-types.ts` - Interfaces TypeScript
- ✅ `src/rules-engine/entities/rule.entity.ts` - Entidad Rule con JSONB
- ✅ `src/rules-engine/entities/rule-execution.entity.ts` - Auditoría completa
- ✅ `src/rules-engine/evaluators/condition.evaluator.ts` - Evaluador de condiciones recursivo
- ✅ `src/rules-engine/evaluators/action.executor.ts` - Ejecutor de acciones con 15+ handlers
- ✅ `src/rules-engine/services/rules.service.ts` - Lógica principal (CORREGIDO ✅)
- ✅ `src/rules-engine/services/rules-event.service.ts` - Helper para integración (NUEVO ✅)
- ✅ `src/rules-engine/controllers/rules.controller.ts` - API REST con 10 endpoints
- ✅ `src/rules-engine/predefined-rules.ts` - 7 reglas predefinidas listas para usar
- ✅ `src/rules-engine/README.md` - Documentación completa

#### Base de Datos
- ✅ `scripts/create-rules-engine-tables.sql` - Schema completo ejecutado
  - 5 tablas: rules, rule_executions, approvals, alerts, work_orders
  - 6 enums PostgreSQL
  - 14 índices para performance
  - 3 triggers para updated_at

#### Integración y Ejemplos
- ✅ `RULES_ENGINE_INTEGRATION.md` - Guía completa de integración
- ✅ `EXAMPLE_production-orders.service.ts` - Integración con órdenes de producción
- ✅ `EXAMPLE_defects.service.ts` - Integración con defectos de calidad
- ✅ `EXAMPLE_inspections.service.ts` - Integración con inspecciones
- ✅ `EXAMPLE_maintenance.service.ts` - Integración con mantenimiento + cron jobs

### 🔧 Correcciones Aplicadas
- ✅ Errores de TypeScript en `rules.service.ts` (líneas 197, 305)
  - Solución: Agregar anotación de tipo `error: unknown` en catch blocks
  - Estado: Compilación exitosa ✅

### 🎨 Arquitectura del Motor de Reglas

```
┌─────────────────────────────────────────────────────────┐
│                     EVENTO DISPARADO                     │
│  (desde producción, calidad, mantenimiento, etc.)       │
└────────────────┬────────────────────────────────────────┘
                 │
                 v
┌─────────────────────────────────────────────────────────┐
│            RulesEventService (Helper)                    │
│  - onOrderCreated()                                      │
│  - onOrderCompleted()                                    │
│  - onDefectRegistered()                                  │
│  - onInspectionCompleted()                               │
│  - onDowntimeThresholdExceeded()                         │
└────────────────┬────────────────────────────────────────┘
                 │
                 v
┌─────────────────────────────────────────────────────────┐
│              RulesService.triggerEvent()                 │
│  1. Buscar reglas aplicables (scope, evento, activas)   │
│  2. Ordenar por prioridad y execution_order             │
└────────────────┬────────────────────────────────────────┘
                 │
                 v
┌─────────────────────────────────────────────────────────┐
│         Para cada regla: executeRule()                   │
│  1. Verificar cooldown y límites diarios                │
│  2. ConditionEvaluator.evaluateConditionGroup()          │
│     - Soporta AND/OR/NOT recursivo                      │
│     - 20+ tipos de condiciones                          │
│  3. Si condiciones pasan:                               │
│     ActionExecutor.executeActions()                      │
│     - 15+ tipos de acciones                             │
│     - Ejecución ordenada con error handling             │
│  4. Actualizar estadísticas de la regla                 │
│  5. Guardar ejecución en rule_executions (audit)        │
└─────────────────────────────────────────────────────────┘
```

## 📊 Capacidades del Motor de Reglas

### Eventos Soportados (24)
- **Producción**: ORDER_CREATED, ORDER_STARTED, ORDER_COMPLETED, ORDER_CANCELLED
- **Calidad**: INSPECTION_FAILED, DEFECT_REGISTERED, LOT_BLOCKED
- **Mantenimiento**: MACHINE_STOPPED, DOWNTIME_THRESHOLD_EXCEEDED, MAINTENANCE_DUE
- **Inventario**: STOCK_BELOW_MIN, MATERIAL_RECEIVED
- **Trazabilidad**: LOT_CREATED, BATCH_SPLIT, BATCH_MERGED
- Y más...

### Tipos de Condiciones (20+)
- **Comparaciones**: FIELD_EQUALS, FIELD_GREATER_THAN, FIELD_LESS_THAN, FIELD_IN
- **Lógicas**: AND, OR, NOT (recursivo)
- **Especializadas**: 
  - HAS_PENDING_INSPECTIONS
  - DURATION_EXCEEDED
  - PERCENTAGE_EXCEEDS
  - IS_MACHINE_AVAILABLE
  - CUSTOM_QUERY (SQL con interpolación)

### Tipos de Acciones (15+)
- **Bloqueo**: BLOCK_ORDER, BLOCK_LOT, BLOCK_MACHINE, PREVENT_COMPLETION
- **Creación**: CREATE_ALERT, CREATE_WORK_ORDER, CREATE_INSPECTION
- **Aprobaciones**: REQUIRE_APPROVAL
- **Estado**: UPDATE_ORDER_STATUS, UPDATE_MACHINE_STATUS
- **Notificaciones**: SEND_EMAIL, SEND_SMS
- **Integración**: EXECUTE_WEBHOOK, LOG_EVENT

### Control Avanzado
- ✅ **Prioridad**: CRITICAL, HIGH, MEDIUM, LOW
- ✅ **Scope**: GLOBAL, PLANT, AREA, WORK_CENTER, MACHINE, PRODUCT, ORDER_TYPE
- ✅ **Cooldown**: Minutos entre ejecuciones de la misma regla
- ✅ **Límites**: Max ejecuciones por día
- ✅ **Validez**: validFrom / validTo (activación por fechas)
- ✅ **Estadísticas**: executionCount, successCount, failureCount, avgDuration

## 🎯 Reglas Predefinidas (Listas para Cargar)

### 1. RULE-QA-001: Prevenir Completar OP con Inspecciones Pendientes
```typescript
Evento: ORDER_COMPLETED
Condición: HAS_PENDING_INSPECTIONS
Acciones: 
  - PREVENT_COMPLETION
  - CREATE_ALERT
Industrias: Pharmaceutical, Food, Automotive
```

### 2. RULE-QA-002: Bloquear Lote si Defectos > 5%
```typescript
Evento: DEFECT_REGISTERED
Condición: PERCENTAGE_EXCEEDS 5%
Acciones:
  - BLOCK_LOT
  - CREATE_INSPECTION
Industrias: Todas
```

### 3. RULE-MT-001: Crear OT si Paro > 30 min
```typescript
Evento: DOWNTIME_THRESHOLD_EXCEEDED
Condición: DURATION_EXCEEDED 30 min
Acciones:
  - CREATE_WORK_ORDER
  - CREATE_ALERT
  - SEND_EMAIL
Industrias: Manufacturing, Automotive
```

### 4. RULE-TR-001: Requiere Trazabilidad por Lote
```typescript
Evento: ORDER_STARTED
Condición: requiresLotTraceability = true AND lotNumber IS NULL
Acciones:
  - BLOCK_ORDER
Industrias: Pharmaceutical, Food
```

### 5. RULE-QA-003: Requiere Aprobación de Calidad
```typescript
Evento: ORDER_COMPLETED
Condición: productCategory IN [PHARMACEUTICAL, FOOD]
Acciones:
  - REQUIRE_APPROVAL
  - PREVENT_COMPLETION
Industrias: Regulated industries
```

### 6. RULE-INV-001: Verificar Stock Antes de Iniciar
```typescript
Evento: ORDER_STARTED
Condición: CUSTOM_QUERY (verificar stock de componentes)
Acciones:
  - BLOCK_ORDER si stock insuficiente
Industrias: Todas
```

### 7. RULE-PRD-001: Verificar Disponibilidad de Máquina
```typescript
Evento: ORDER_STARTED
Condición: NOT IS_MACHINE_AVAILABLE
Acciones:
  - CREATE_ALERT
  - UPDATE_ORDER_STATUS (PENDING)
Industrias: Todas
```

## 📚 Guía de Integración Paso a Paso

### Paso 1: Importar RulesEngineModule

En cualquier módulo (ejemplo: `production-orders.module.ts`):

```typescript
import { RulesEngineModule } from '../rules-engine/rules-engine.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([...]),
    RulesEngineModule, // ← Agregar aquí
  ],
  // ...
})
export class ProductionOrdersModule {}
```

### Paso 2: Inyectar RulesEventService

En el servicio correspondiente:

```typescript
import { RulesEventService } from '../rules-engine/services';

@Injectable()
export class ProductionOrdersService {
  constructor(
    // ... otros repositorios
    private readonly rulesEventService: RulesEventService, // ← Inyectar
  ) {}
}
```

### Paso 3: Disparar Eventos en Puntos Clave

```typescript
// Al crear una orden
const order = await this.poRepo.save(newOrder);
await this.rulesEventService.onOrderCreated(order, userId);

// Al completar una orden
order.status = 'COMPLETED';
const completed = await this.poRepo.save(order);
await this.rulesEventService.onOrderCompleted(completed, userId);

// Al registrar un defecto
const defect = await this.defectRepo.save(newDefect);
const defectRate = await this.calculateDefectRate(orderId);
await this.rulesEventService.onDefectRegistered(defect, defectRate, userId);

// Al registrar paro de máquina
const downtime = await this.downtimeRepo.save(newDowntime);
await this.rulesEventService.onMachineStopped(machine, downtime, userId);
```

## 🔄 Flujo Completo de Ejemplo

### Caso: Completar Orden de Producción

```
1. Usuario intenta completar orden vía API
   POST /api/production-orders/{id}/complete

2. ProductionOrdersService.updateStatus(id, 'COMPLETED')
   ├─ Actualiza estado en BD
   └─ Dispara: rulesEventService.onOrderCompleted(order, userId)

3. RulesService.triggerEvent('ORDER_COMPLETED', context)
   ├─ Encuentra reglas aplicables:
   │  - RULE-QA-001: Prevenir si hay inspecciones pendientes
   │  - RULE-QA-003: Requiere aprobación de calidad
   └─ Ejecuta cada regla en orden de prioridad

4. RULE-QA-001 se ejecuta:
   ├─ Evalúa condición: HAS_PENDING_INSPECTIONS
   │  └─ SELECT COUNT(*) FROM inspections WHERE orderId=X AND status='PENDING'
   ├─ Si hay inspecciones pendientes:
   │  ├─ Acción 1: PREVENT_COMPLETION
   │  │  └─ UPDATE orders SET completion_prevented=true WHERE id=X
   │  └─ Acción 2: CREATE_ALERT
   │     └─ INSERT INTO alerts (type, message, orderId, severity)
   └─ Guarda ejecución en rule_executions (audit trail)

5. Si completion_prevented = true
   └─ Lanzar excepción: "Cannot complete order: pending inspections"

6. Usuario recibe error con mensaje descriptivo
   └─ Debe completar inspecciones antes de cerrar la orden
```

## 🚀 Próximos Pasos para Usar el Motor

### 1. Cargar Reglas Predefinidas

```bash
# Desde el directorio raíz del proyecto
# Las reglas están en src/rules-engine/predefined-rules.ts

# Opción A: Cargar vía API (recomendado)
POST /api/rules-engine
Content-Type: application/json
[copiar regla desde predefined-rules.ts]

# Opción B: Crear script de carga
npm run seed:rules
```

### 2. Integrar Módulos Existentes

Seguir los ejemplos en:
- `EXAMPLE_production-orders.service.ts`
- `EXAMPLE_defects.service.ts`
- `EXAMPLE_inspections.service.ts`
- `EXAMPLE_maintenance.service.ts`

### 3. Configurar Tareas Programadas (Opcional)

Para verificaciones periódicas (mantenimiento vencido, paros prolongados, stock bajo):

```typescript
// maintenance-scheduled.service.ts
@Injectable()
export class MaintenanceScheduledService {
  @Cron('*/15 * * * *') // Cada 15 minutos
  async checkLongDowntimes() {
    await this.maintenanceService.checkLongRunningDowntimes(30);
  }
  
  @Cron('0 6 * * *') // Diario a las 6 AM
  async checkMaintenanceDue() {
    await this.maintenanceService.checkMaintenanceDue();
  }
}
```

### 4. Personalizar Reglas por Industria/Planta

```typescript
// Crear regla específica para planta farmacéutica
POST /api/rules-engine
{
  "code": "RULE-PHARMA-001",
  "name": "Validación GMP para Productos Farmacéuticos",
  "eventType": "ORDER_COMPLETED",
  "scope": "PLANT",
  "scopeValue": "PHARMA-PLANT-01",
  "priority": "CRITICAL",
  "conditions": {
    "operator": "AND",
    "conditions": [
      { "type": "FIELD_EQUALS", "field": "productCategory", "value": "PHARMACEUTICAL" },
      { "type": "HAS_PENDING_INSPECTIONS" }
    ]
  },
  "actions": [
    { "type": "PREVENT_COMPLETION", "order": 1 },
    { "type": "REQUIRE_APPROVAL", "params": { "approverRole": "QA_MANAGER" }, "order": 2 },
    { "type": "CREATE_ALERT", "params": { "severity": "CRITICAL" }, "order": 3 }
  ]
}
```

## 📈 Monitoreo y Auditoría

### Ver Historial de Ejecuciones
```http
GET /api/rules-engine/executions/history?eventType=ORDER_COMPLETED&limit=50
```

### Estadísticas de una Regla
```http
GET /api/rules-engine/{ruleId}/stats
```

### Habilitar/Deshabilitar Regla
```http
PUT /api/rules-engine/{ruleId}/toggle
{ "enabled": false }
```

## ✅ Checklist Final

- [x] Motor de reglas implementado completamente
- [x] Base de datos creada y verificada
- [x] Errores de TypeScript corregidos
- [x] Helper de eventos creado (RulesEventService)
- [x] Ejemplos de integración creados (4 módulos)
- [x] Documentación completa
- [x] Reglas predefinidas listas
- [ ] Cargar reglas predefinidas vía API
- [ ] Integrar módulos reales (copiar código de ejemplos)
- [ ] Configurar tareas programadas (opcional)
- [ ] Probar flujo end-to-end

## 🎯 Valor de Negocio

El motor de reglas permite:

✅ **Flexibilidad**: Cambiar reglas sin modificar código
✅ **Cumplimiento**: Forzar políticas de calidad, trazabilidad, seguridad
✅ **Automatización**: Crear OTs, alertas, aprobaciones automáticamente
✅ **Adaptabilidad**: Reglas por industria, planta, producto, máquina
✅ **Auditoría**: Trazabilidad completa de todas las decisiones
✅ **Performance**: Ejecución eficiente con índices y cooldowns

## 📞 Soporte

Ver documentación completa en:
- `src/rules-engine/README.md`
- `RULES_ENGINE_INTEGRATION.md`

Para profundizar en alguna funcionalidad específica, consultar los archivos de ejemplo.
