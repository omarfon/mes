# Guía de Integración del Motor de Reglas

Esta guía muestra cómo integrar el motor de reglas con los módulos existentes del sistema MES.

## 📦 Paso 1: Importar el módulo de reglas

### En production-orders.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RulesEngineModule } from '../rules-engine/rules-engine.module';
// ... otros imports

@Module({
  imports: [
    TypeOrmModule.forFeature([...]),
    RulesEngineModule,  // ← Agregar aquí
    // ... otros módulos
  ],
  controllers: [...],
  providers: [...],
})
export class ProductionOrdersModule {}
```

## 🔧 Paso 2: Inyectar el servicio de eventos

### En production-orders.service.ts

```typescript
import { Injectable } from '@nestjs/common';
import { RulesEventService } from '../rules-engine/services';

@Injectable()
export class ProductionOrdersService {
  constructor(
    // ... otros repositorios
    private readonly rulesEventService: RulesEventService,  // ← Inyectar aquí
  ) {}
  
  // ... métodos existentes
}
```

## 🎯 Paso 3: Disparar eventos en los métodos clave

### Ejemplo 1: Al crear una orden

```typescript
async create(dto: CreateProductionOrderDto): Promise<ProductionOrder> {
  // ... lógica existente para crear la orden
  
  const po = this.poRepo.create({
    code: dto.code.toUpperCase(),
    productId: dto.productId,
    quantityPlanned: dto.quantityPlanned,
    status: ProductionOrderStatus.PENDING,
    // ... otros campos
  });
  
  const savedOrder = await this.poRepo.save(po);
  
  // ✅ Disparar evento para el motor de reglas
  await this.rulesEventService.onOrderCreated(savedOrder, dto.createdBy);
  
  return savedOrder;
}
```

### Ejemplo 2: Al cambiar el estado de la orden

```typescript
async updateStatus(
  id: string,
  status: ProductionOrderStatus,
  userId?: string,
): Promise<ProductionOrder> {
  const po = await this.findOne(id);
  const previousStatus = po.status;
  
  // Actualizar estado
  po.status = status;

  if (status === ProductionOrderStatus.IN_PROGRESS && !po.actualStartDate) {
    po.actualStartDate = new Date();
  }

  if (status === ProductionOrderStatus.COMPLETED) {
    po.actualEndDate = new Date();
  }

  const updatedOrder = await this.poRepo.save(po);

  // ✅ Disparar eventos según el cambio de estado
  if (status === ProductionOrderStatus.IN_PROGRESS && 
      previousStatus === ProductionOrderStatus.PENDING) {
    await this.rulesEventService.onOrderStarted(updatedOrder, userId);
  }
  
  if (status === ProductionOrderStatus.COMPLETED) {
    await this.rulesEventService.onOrderCompleted(updatedOrder, userId);
  }

  return updatedOrder;
}
```

### Ejemplo 3: Al cancelar una orden

```typescript
async cancel(id: string, reason: string, userId?: string): Promise<ProductionOrder> {
  const po = await this.findOne(id);
  
  po.status = ProductionOrderStatus.CANCELLED;
  po.cancellationReason = reason;
  po.cancelledAt = new Date();
  po.cancelledBy = userId;
  
  const cancelledOrder = await this.poRepo.save(po);
  
  // ✅ Disparar evento de cancelación
  await this.rulesEventService.triggerCustomEvent(
    RuleEventType.ORDER_CANCELLED,
    {
      entityType: 'order',
      entityId: cancelledOrder.id,
      entityData: {
        ...cancelledOrder,
        cancellationReason: reason,
      },
      userId,
    },
  );
  
  return cancelledOrder;
}
```

## 🎨 Integración con Quality Module

### En quality.service.ts

```typescript
import { Injectable } from '@nestjs/common';
import { RulesEventService } from '../rules-engine/services';

@Injectable()
export class QualityService {
  constructor(
    // ... repositorios
    private readonly rulesEventService: RulesEventService,
  ) {}

  async registerDefect(dto: CreateDefectDto): Promise<Defect> {
    // Crear el defecto
    const defect = await this.defectsRepo.save({
      ...dto,
      registeredAt: new Date(),
    });
    
    // Calcular tasa de defectos
    const defectRate = await this.calculateDefectRate(
      dto.orderId,
      dto.productCode,
    );
    
    // ✅ Disparar evento
    await this.rulesEventService.onDefectRegistered(
      defect,
      defectRate,
      dto.userId,
    );
    
    return defect;
  }

  async completeInspection(id: string, result: InspectionResult): Promise<Inspection> {
    const inspection = await this.inspectionsRepo.findOne({ where: { id } });
    
    inspection.status = result.passed ? 'COMPLETED' : 'FAILED';
    inspection.result = result;
    inspection.completedAt = new Date();
    
    const completed = await this.inspectionsRepo.save(inspection);
    
    // ✅ Disparar evento (automáticamente detecta si falló)
    await this.rulesEventService.onInspectionCompleted(
      completed,
      result.inspectedBy,
    );
    
    return completed;
  }
}
```

## 🔧 Integración con Maintenance Module

### En maintenance.service.ts

```typescript
import { Injectable } from '@nestjs/common';
import { RulesEventService } from '../rules-engine/services';

@Injectable()
export class MaintenanceService {
  constructor(
    // ... repositorios
    private readonly rulesEventService: RulesEventService,
  ) {}

  async checkMaintenanceDue(): Promise<void> {
    // Obtener máquinas con mantenimiento vencido
    const machinesWithDueMaintenance = await this.getMachinesWithDueMaintenance();
    
    for (const machine of machinesWithDueMaintenance) {
      // ✅ Disparar evento
      await this.rulesEventService.onMaintenanceDue(
        machine,
        machine.nextMaintenancePlan,
      );
    }
  }

  async registerDowntime(machineCode: string, dto: CreateDowntimeDto): Promise<Downtime> {
    const machine = await this.machinesRepo.findOne({ where: { code: machineCode } });
    
    const downtime = await this.downtimeRepo.save({
      machineCode,
      reason: dto.reason,
      startedAt: new Date(),
      ...dto,
    });
    
    // ✅ Disparar evento de máquina detenida
    await this.rulesEventService.onMachineStopped(
      machine,
      downtime,
      dto.userId,
    );
    
    // Si el paro excede cierto tiempo, disparar otro evento
    if (downtime.duration && downtime.duration > 30) {
      await this.rulesEventService.onDowntimeThresholdExceeded(
        machine,
        downtime,
        30,
        dto.userId,
      );
    }
    
    return downtime;
  }
}
```

## 📊 Integración con Inventory/Traceability

### En traceability.service.ts

```typescript
import { Injectable } from '@nestjs/common';
import { RulesEventService } from '../rules-engine/services';

@Injectable()
export class TraceabilityService {
  constructor(
    // ... repositorios
    private readonly rulesEventService: RulesEventService,
  ) {}

  async blockLot(lotNumber: string, reason: string, userId?: string): Promise<MaterialLot> {
    const lot = await this.lotsRepo.findOne({ where: { lotNumber } });
    
    lot.status = 'BLOCKED';
    lot.blockReason = reason;
    lot.blockedAt = new Date();
    lot.blockedBy = userId;
    
    const blocked = await this.lotsRepo.save(lot);
    
    // ✅ Disparar evento
    await this.rulesEventService.onLotBlocked(blocked, reason, userId);
    
    return blocked;
  }

  async checkStockLevels(): Promise<void> {
    const materials = await this.getMaterialsBelowMinStock();
    
    for (const material of materials) {
      // ✅ Disparar evento de stock bajo
      await this.rulesEventService.onStockBelowMin(
        material,
        material.currentStock,
        material.minStock,
      );
    }
  }
}
```

## 🌐 Integración vía API (para sistemas externos)

Si necesitas disparar reglas desde fuera del backend:

```http
POST /api/rules-engine/trigger
Content-Type: application/json

{
  "eventType": "ORDER_COMPLETED",
  "entityType": "order",
  "entityId": "ORD-12345",
  "entityData": {
    "orderNumber": "ORD-12345",
    "productCode": "PROD-001",
    "status": "COMPLETED",
    "quantityProduced": 100
  },
  "plantCode": "PLANT-01",
  "userId": "user123"
}
```

## 🔄 Eventos Programados (Cron Jobs)

Para eventos programados o verificaciones periódicas:

```typescript
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RulesEventService } from '../rules-engine/services';
import { RuleEventType } from '../rules-engine/types';

@Injectable()
export class ScheduledTasksService {
  constructor(
    private readonly rulesEventService: RulesEventService,
    private readonly maintenanceService: MaintenanceService,
    private readonly inventoryService: InventoryService,
  ) {}

  // Verificar mantenimiento pendiente cada día a las 6 AM
  @Cron('0 6 * * *')
  async checkMaintenanceDue() {
    const machines = await this.maintenanceService.getMachinesWithDueMaintenance();
    
    for (const machine of machines) {
      await this.rulesEventService.onMaintenanceDue(
        machine,
        machine.nextMaintenancePlan,
      );
    }
  }

  // Verificar stock cada hora
  @Cron(CronExpression.EVERY_HOUR)
  async checkStockLevels() {
    const materials = await this.inventoryService.getMaterialsBelowMinStock();
    
    for (const material of materials) {
      await this.rulesEventService.onStockBelowMin(
        material,
        material.currentStock,
        material.minStock,
      );
    }
  }

  // Verificar paros prolongados cada 15 minutos
  @Cron('*/15 * * * *')
  async checkLongDowntimes() {
    const downtimes = await this.maintenanceService.getLongRunningDowntimes(30);
    
    for (const downtime of downtimes) {
      await this.rulesEventService.onDowntimeThresholdExceeded(
        downtime.machine,
        downtime,
        30,
      );
    }
  }
}
```

## ✅ Checklist de Integración

Para cada módulo que quieras integrar:

- [ ] Importar `RulesEngineModule` en el módulo
- [ ] Inyectar `RulesEventService` en el servicio
- [ ] Identificar los puntos de integración (crear, actualizar estado, etc.)
- [ ] Llamar al método apropiado de `rulesEventService`
- [ ] Pasar los datos necesarios en el contexto
- [ ] Incluir `userId` cuando esté disponible
- [ ] Manejar errores apropiadamente (los eventos no deben romper el flujo)

## 🎯 Reglas a Configurar

Después de integrar los módulos, configura las reglas según tus necesidades:

1. Crear reglas vía API REST (`POST /api/rules-engine`)
2. Usar las reglas predefinidas de `predefined-rules.ts`
3. Habilitar/deshabilitar reglas según industria o planta
4. Configurar prioridades y cooldowns apropiados

## 🔍 Debugging

Para verificar que los eventos se están disparando:

```typescript
// En development, puedes activar logging
this.logger.debug(`Triggering rule event: ${eventType} for ${entityId}`);

// Verificar historial de ejecuciones
GET /api/rules-engine/executions/history?eventType=ORDER_COMPLETED&limit=20

// Ver estadísticas de una regla
GET /api/rules-engine/{ruleId}/stats
```

## 📚 Recursos

- [README del motor de reglas](../rules-engine/README.md)
- [Reglas predefinidas](../rules-engine/predefined-rules.ts)
- [Tipos de eventos disponibles](../rules-engine/types/rule-enums.ts)
- [API Reference](../rules-engine/controllers/rules.controller.ts)
