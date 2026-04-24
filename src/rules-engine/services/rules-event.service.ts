import { Injectable, Logger } from '@nestjs/common';
import { RulesService } from './rules.service';
import { RuleEventType } from '../types/rule-enums';
import { RuleContext } from '../types/rule-types';

/**
 * Helper service para facilitar la integración del motor de reglas
 * con otros módulos del sistema
 */
@Injectable()
export class RulesEventService {
  private readonly logger = new Logger(RulesEventService.name);

  constructor(private readonly rulesService: RulesService) {}

  /**
   * Dispara evento cuando se crea una orden de producción
   */
  async onOrderCreated(order: any, userId?: string): Promise<void> {
    try {
      await this.rulesService.triggerEvent(RuleEventType.ORDER_CREATED, {
        eventType: RuleEventType.ORDER_CREATED,
        entityType: 'order',
        entityId: order.id || order.orderNumber,
        entityData: order,
        timestamp: new Date(),
        plantCode: order.plantCode,
        areaCode: order.areaCode,
        workCenterCode: order.workCenterCode,
        machineCode: order.machineCode,
        productCode: order.productCode,
        orderTypeCode: order.orderTypeCode,
        userId,
      });
    } catch (error: unknown) {
      this.logger.error(
        `Error triggering ORDER_CREATED event: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Dispara evento cuando se inicia una orden de producción
   */
  async onOrderStarted(order: any, userId?: string): Promise<void> {
    try {
      await this.rulesService.triggerEvent(RuleEventType.ORDER_STARTED, {
        eventType: RuleEventType.ORDER_STARTED,
        entityType: 'order',
        entityId: order.id || order.orderNumber,
        entityData: order,
        timestamp: new Date(),
        plantCode: order.plantCode,
        areaCode: order.areaCode,
        workCenterCode: order.workCenterCode,
        machineCode: order.machineCode,
        productCode: order.productCode,
        orderTypeCode: order.orderTypeCode,
        userId,
      });
    } catch (error: unknown) {
      this.logger.error(
        `Error triggering ORDER_STARTED event: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Dispara evento cuando se completa una orden de producción
   */
  async onOrderCompleted(order: any, userId?: string): Promise<void> {
    try {
      await this.rulesService.triggerEvent(RuleEventType.ORDER_COMPLETED, {
        eventType: RuleEventType.ORDER_COMPLETED,
        entityType: 'order',
        entityId: order.id || order.orderNumber,
        entityData: order,
        timestamp: new Date(),
        plantCode: order.plantCode,
        areaCode: order.areaCode,
        workCenterCode: order.workCenterCode,
        machineCode: order.machineCode,
        productCode: order.productCode,
        orderTypeCode: order.orderTypeCode,
        userId,
      });
    } catch (error: unknown) {
      this.logger.error(
        `Error triggering ORDER_COMPLETED event: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Dispara evento cuando se registra un defecto
   */
  async onDefectRegistered(
    defect: any,
    defectRate: number,
    userId?: string,
  ): Promise<void> {
    try {
      await this.rulesService.triggerEvent(RuleEventType.DEFECT_REGISTERED, {
        eventType: RuleEventType.DEFECT_REGISTERED,
        entityType: 'defect',
        entityId: defect.id,
        entityData: {
          ...defect,
          defectRate,
        },
        timestamp: new Date(),
        plantCode: defect.plantCode,
        areaCode: defect.areaCode,
        machineCode: defect.machineCode,
        productCode: defect.productCode,
        userId,
      });
    } catch (error: unknown) {
      this.logger.error(
        `Error triggering DEFECT_REGISTERED event: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Dispara evento cuando se completa una inspección
   */
  async onInspectionCompleted(
    inspection: any,
    userId?: string,
  ): Promise<void> {
    try {
      const eventType =
        inspection.status === 'FAILED'
          ? RuleEventType.INSPECTION_FAILED
          : RuleEventType.INSPECTION_COMPLETED;

      await this.rulesService.triggerEvent(eventType, {
        eventType,
        entityType: 'inspection',
        entityId: inspection.id,
        entityData: inspection,
        timestamp: new Date(),
        plantCode: inspection.plantCode,
        areaCode: inspection.areaCode,
        productCode: inspection.productCode,
        userId,
      });
    } catch (error: unknown) {
      this.logger.error(
        `Error triggering INSPECTION event: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Dispara evento cuando una máquina se detiene
   */
  async onMachineStopped(
    machine: any,
    downtime: any,
    userId?: string,
  ): Promise<void> {
    try {
      await this.rulesService.triggerEvent(RuleEventType.MACHINE_STOPPED, {
        eventType: RuleEventType.MACHINE_STOPPED,
        entityType: 'machine',
        entityId: machine.code || machine.id,
        entityData: {
          ...machine,
          downtime,
          downtimeStartedAt: downtime.startedAt,
          downtimeDuration: downtime.duration,
          reason: downtime.reason,
        },
        timestamp: new Date(),
        plantCode: machine.plantCode,
        areaCode: machine.areaCode,
        machineCode: machine.code,
        userId,
      });
    } catch (error: unknown) {
      this.logger.error(
        `Error triggering MACHINE_STOPPED event: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Dispara evento cuando se excede un umbral de tiempo de paro
   */
  async onDowntimeThresholdExceeded(
    machine: any,
    downtime: any,
    thresholdMinutes: number,
    userId?: string,
  ): Promise<void> {
    try {
      await this.rulesService.triggerEvent(
        RuleEventType.DOWNTIME_THRESHOLD_EXCEEDED,
        {
          eventType: RuleEventType.DOWNTIME_THRESHOLD_EXCEEDED,
          entityType: 'downtime',
          entityId: downtime.id,
          entityData: {
            ...downtime,
            machine,
            downtimeStartedAt: downtime.startedAt,
            downtimeDuration: downtime.duration || 0,
            thresholdMinutes,
            reason: downtime.reason,
          },
          timestamp: new Date(),
          plantCode: machine.plantCode,
          areaCode: machine.areaCode,
          machineCode: machine.code,
          userId,
        },
      );
    } catch (error: unknown) {
      this.logger.error(
        `Error triggering DOWNTIME_THRESHOLD_EXCEEDED event: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Dispara evento cuando se crea o bloquea un lote
   */
  async onLotBlocked(lot: any, reason: string, userId?: string): Promise<void> {
    try {
      await this.rulesService.triggerEvent(RuleEventType.LOT_BLOCKED, {
        eventType: RuleEventType.LOT_BLOCKED,
        entityType: 'lot',
        entityId: lot.lotNumber || lot.id,
        entityData: {
          ...lot,
          blockReason: reason,
        },
        timestamp: new Date(),
        plantCode: lot.plantCode,
        productCode: lot.materialCode,
        userId,
      });
    } catch (error: unknown) {
      this.logger.error(
        `Error triggering LOT_BLOCKED event: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Dispara evento cuando el stock está por debajo del mínimo
   */
  async onStockBelowMin(
    material: any,
    currentStock: number,
    minStock: number,
    userId?: string,
  ): Promise<void> {
    try {
      await this.rulesService.triggerEvent(RuleEventType.STOCK_BELOW_MIN, {
        eventType: RuleEventType.STOCK_BELOW_MIN,
        entityType: 'material',
        entityId: material.code || material.id,
        entityData: {
          ...material,
          currentStock,
          minStock,
          difference: minStock - currentStock,
        },
        timestamp: new Date(),
        plantCode: material.plantCode,
        productCode: material.code,
        userId,
      });
    } catch (error: unknown) {
      this.logger.error(
        `Error triggering STOCK_BELOW_MIN event: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Dispara evento cuando hay mantenimiento pendiente
   */
  async onMaintenanceDue(
    machine: any,
    maintenancePlan: any,
    userId?: string,
  ): Promise<void> {
    try {
      await this.rulesService.triggerEvent(RuleEventType.MAINTENANCE_DUE, {
        eventType: RuleEventType.MAINTENANCE_DUE,
        entityType: 'machine',
        entityId: machine.code || machine.id,
        entityData: {
          ...machine,
          maintenancePlan,
          dueDate: maintenancePlan.dueDate,
          maintenanceType: maintenancePlan.type,
        },
        timestamp: new Date(),
        plantCode: machine.plantCode,
        areaCode: machine.areaCode,
        machineCode: machine.code,
        userId,
      });
    } catch (error: unknown) {
      this.logger.error(
        `Error triggering MAINTENANCE_DUE event: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Método genérico para disparar cualquier evento
   */
  async triggerCustomEvent(
    eventType: RuleEventType,
    context: Partial<RuleContext>,
  ): Promise<void> {
    try {
      const fullContext: RuleContext = {
        eventType,
        entityType: context.entityType || 'custom',
        entityId: context.entityId || 'unknown',
        entityData: context.entityData || {},
        timestamp: new Date(),
        ...context,
      };

      await this.rulesService.triggerEvent(eventType, fullContext);
    } catch (error: unknown) {
      this.logger.error(
        `Error triggering custom event ${eventType}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
