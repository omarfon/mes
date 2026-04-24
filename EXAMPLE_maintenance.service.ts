/**
 * EJEMPLO DE INTEGRACIÓN: Maintenance Service
 * 
 * Este archivo muestra cómo integrar el motor de reglas
 * con el módulo de mantenimiento.
 * 
 * CASOS DE USO:
 * - Crear OT automáticamente cuando paro > N minutos
 * - Alertar cuando hay mantenimiento vencido
 * - Bloquear máquina si mantenimiento crítico pendiente
 * - Notificar por email/SMS cuando se excede tiempo de paro
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';

// ✅ NUEVO: Importar servicio de eventos
import { RulesEventService } from '../rules-engine/services';

// Interfaces de ejemplo (ajustar según tus entidades reales)
interface Machine {
  id: string;
  code: string;
  name: string;
  plantCode?: string;
  areaCode?: string;
  status: 'AVAILABLE' | 'IN_USE' | 'STOPPED' | 'MAINTENANCE' | 'BLOCKED';
  nextMaintenanceDate?: Date;
}

interface Downtime {
  id: string;
  machineCode: string;
  reason: string;
  startedAt: Date;
  endedAt?: Date;
  duration?: number; // en minutos
  status: 'ONGOING' | 'RESOLVED';
}

interface MaintenancePlan {
  id: string;
  machineCode: string;
  type: 'PREVENTIVE' | 'CORRECTIVE' | 'PREDICTIVE';
  frequency: number;
  dueDate: Date;
  status: 'SCHEDULED' | 'OVERDUE' | 'COMPLETED';
}

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectRepository(Machine)
    private readonly machinesRepo: Repository<Machine>,
    
    @InjectRepository(Downtime)
    private readonly downtimeRepo: Repository<Downtime>,
    
    @InjectRepository(MaintenancePlan)
    private readonly maintenancePlanRepo: Repository<MaintenancePlan>,
    
    // ✅ NUEVO: Inyectar servicio de eventos
    private readonly rulesEventService: RulesEventService,
  ) {}

  /**
   * ✅ MODIFICADO: Registrar paro de máquina con eventos
   */
  async registerDowntime(
    machineCode: string,
    dto: {
      reason: string;
      description?: string;
      userId?: string;
    },
  ): Promise<Downtime> {
    const machine = await this.machinesRepo.findOne({ 
      where: { code: machineCode } 
    });
    
    if (!machine) {
      throw new NotFoundException(`Machine ${machineCode} not found`);
    }

    // Crear registro de paro
    const downtime = this.downtimeRepo.create({
      machineCode,
      reason: dto.reason,
      description: dto.description,
      startedAt: new Date(),
      status: 'ONGOING',
    });

    // Actualizar estado de la máquina
    machine.status = 'STOPPED';
    await this.machinesRepo.save(machine);

    const saved = await this.downtimeRepo.save(downtime);

    // ✅ NUEVO: Disparar evento de máquina detenida
    await this.rulesEventService.onMachineStopped(
      {
        ...machine,
        plantCode: machine.plantCode,
        areaCode: machine.areaCode,
      },
      saved,
      dto.userId,
    );

    return saved;
  }

  /**
   * ✅ NUEVO: Método para verificar paros prolongados
   * Se puede ejecutar periódicamente (cada 5-15 minutos)
   */
  async checkLongRunningDowntimes(thresholdMinutes: number = 30): Promise<void> {
    const ongoingDowntimes = await this.downtimeRepo.find({
      where: { status: 'ONGOING' },
    });

    const now = new Date();

    for (const downtime of ongoingDowntimes) {
      const durationMs = now.getTime() - new Date(downtime.startedAt).getTime();
      const durationMinutes = Math.floor(durationMs / 1000 / 60);

      // Si el paro excede el umbral, disparar evento
      if (durationMinutes >= thresholdMinutes) {
        const machine = await this.machinesRepo.findOne({
          where: { code: downtime.machineCode },
        });

        if (machine) {
          // ✅ Disparar evento DOWNTIME_THRESHOLD_EXCEEDED
          // Esto ejecutará reglas como:
          // - "RULE-MT-001: Si paro > 30 min, crear OT + enviar email"
          // - "Si paro > 60 min, notificar a gerencia"
          // - "Si paro > 120 min, escalar a nivel corporativo"
          await this.rulesEventService.onDowntimeThresholdExceeded(
            machine,
            {
              ...downtime,
              duration: durationMinutes,
            },
            thresholdMinutes,
          );
        }
      }
    }
  }

  /**
   * ✅ MODIFICADO: Resolver paro de máquina
   */
  async resolveDowntime(
    id: string,
    resolution: {
      notes?: string;
      userId?: string;
    },
  ): Promise<Downtime> {
    const downtime = await this.downtimeRepo.findOne({ where: { id } });
    
    if (!downtime) {
      throw new NotFoundException(`Downtime ${id} not found`);
    }

    const now = new Date();
    const durationMs = now.getTime() - new Date(downtime.startedAt).getTime();
    const durationMinutes = Math.floor(durationMs / 1000 / 60);

    downtime.endedAt = now;
    downtime.duration = durationMinutes;
    downtime.status = 'RESOLVED';
    downtime.resolutionNotes = resolution.notes;

    // Actualizar estado de la máquina
    const machine = await this.machinesRepo.findOne({
      where: { code: downtime.machineCode },
    });
    
    if (machine) {
      machine.status = 'AVAILABLE';
      await this.machinesRepo.save(machine);
    }

    const resolved = await this.downtimeRepo.save(downtime);

    // ✅ NUEVO: Disparar evento personalizado de paro resuelto
    await this.rulesEventService.triggerCustomEvent(
      'DOWNTIME_RESOLVED' as any,
      {
        entityType: 'downtime',
        entityId: resolved.id,
        entityData: {
          ...resolved,
          duration: durationMinutes,
          machine,
        },
        machineCode: downtime.machineCode,
        userId: resolution.userId,
      },
    );

    return resolved;
  }

  /**
   * ✅ NUEVO: Verificar mantenimientos vencidos
   * Se ejecuta periódicamente (diario o cada hora)
   */
  async checkMaintenanceDue(): Promise<void> {
    const now = new Date();
    
    // Obtener planes de mantenimiento vencidos
    const overduePlans = await this.maintenancePlanRepo.find({
      where: {
        dueDate: LessThan(now),
        status: 'SCHEDULED',
      },
    });

    for (const plan of overduePlans) {
      const machine = await this.machinesRepo.findOne({
        where: { code: plan.machineCode },
      });

      if (machine) {
        // Marcar como vencido
        plan.status = 'OVERDUE';
        await this.maintenancePlanRepo.save(plan);

        // ✅ Disparar evento MAINTENANCE_DUE
        // Esto ejecutará reglas como:
        // - "Crear alerta de mantenimiento vencido"
        // - "Enviar notificación al supervisor"
        // - "Si mantenimiento crítico, bloquear máquina"
        await this.rulesEventService.onMaintenanceDue(
          machine,
          plan,
        );
      }
    }
  }

  /**
   * ✅ NUEVO: Completar mantenimiento
   */
  async completeMaintenancePlan(
    id: string,
    completion: {
      notes?: string;
      performedBy?: string;
      userId?: string;
    },
  ): Promise<MaintenancePlan> {
    const plan = await this.maintenancePlanRepo.findOne({ where: { id } });
    
    if (!plan) {
      throw new NotFoundException(`Maintenance plan ${id} not found`);
    }

    plan.status = 'COMPLETED';
    plan.completedAt = new Date();
    plan.completedBy = completion.performedBy;
    plan.notes = completion.notes;

    const completed = await this.maintenancePlanRepo.save(plan);

    // ✅ Disparar evento personalizado
    await this.rulesEventService.triggerCustomEvent(
      'MAINTENANCE_COMPLETED' as any,
      {
        entityType: 'maintenance',
        entityId: completed.id,
        entityData: completed,
        machineCode: completed.machineCode,
        userId: completion.userId,
      },
    );

    return completed;
  }

  /**
   * ✅ NUEVO: Obtener máquinas con mantenimiento vencido
   * (usado por el motor de reglas)
   */
  async getMachinesWithDueMaintenance(): Promise<Array<Machine & { nextMaintenancePlan: MaintenancePlan }>> {
    const now = new Date();
    
    const overduePlans = await this.maintenancePlanRepo.find({
      where: {
        dueDate: LessThan(now),
        status: 'SCHEDULED',
      },
    });

    const result = [];
    
    for (const plan of overduePlans) {
      const machine = await this.machinesRepo.findOne({
        where: { code: plan.machineCode },
      });
      
      if (machine) {
        result.push({
          ...machine,
          nextMaintenancePlan: plan,
        });
      }
    }

    return result;
  }

  /**
   * ✅ NUEVO: Obtener paros en curso que exceden cierto tiempo
   * (usado por el motor de reglas o chequeos programados)
   */
  async getLongRunningDowntimes(thresholdMinutes: number): Promise<Array<Downtime & { machine: Machine }>> {
    const ongoingDowntimes = await this.downtimeRepo.find({
      where: { status: 'ONGOING' },
    });

    const now = new Date();
    const result = [];

    for (const downtime of ongoingDowntimes) {
      const durationMs = now.getTime() - new Date(downtime.startedAt).getTime();
      const durationMinutes = Math.floor(durationMs / 1000 / 60);

      if (durationMinutes >= thresholdMinutes) {
        const machine = await this.machinesRepo.findOne({
          where: { code: downtime.machineCode },
        });

        if (machine) {
          result.push({
            ...downtime,
            duration: durationMinutes,
            machine,
          });
        }
      }
    }

    return result;
  }
}

/**
 * EJEMPLO DE SCHEDULED TASKS SERVICE
 * 
 * Este servicio ejecuta tareas programadas para verificar
 * condiciones y disparar eventos del motor de reglas
 */

import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class MaintenanceScheduledService {
  constructor(
    private readonly maintenanceService: MaintenanceService,
  ) {}

  /**
   * Verificar mantenimientos vencidos cada día a las 6:00 AM
   */
  @Cron('0 6 * * *')
  async checkMaintenanceDueDaily() {
    console.log('Checking for overdue maintenance plans...');
    await this.maintenanceService.checkMaintenanceDue();
  }

  /**
   * Verificar paros prolongados cada 15 minutos
   */
  @Cron('*/15 * * * *')
  async checkLongDowntimesEvery15Min() {
    console.log('Checking for long-running downtimes (>30 min)...');
    await this.maintenanceService.checkLongRunningDowntimes(30);
  }

  /**
   * Verificar paros críticos cada 5 minutos
   */
  @Cron('*/5 * * * *')
  async checkCriticalDowntimesEvery5Min() {
    console.log('Checking for critical downtimes (>60 min)...');
    await this.maintenanceService.checkLongRunningDowntimes(60);
  }
}
