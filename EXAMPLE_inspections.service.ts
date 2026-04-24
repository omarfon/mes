/**
 * EJEMPLO DE INTEGRACIÓN: Quality Service - Inspections
 * 
 * Este archivo muestra cómo integrar el motor de reglas
 * con el servicio de inspecciones de calidad.
 * 
 * CASOS DE USO:
 * - No permitir completar OP si hay inspecciones pendientes
 * - Crear inspecciones automáticas según tipo de producto
 * - Requerir aprobación de calidad antes de liberar
 * - Bloquear lote si inspección falla
 */

import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  QualityInspection,
  InspectionStatus,
} from '../entities/inspection.entity';
import { TraceNode } from '../../traceability/entities/trace-node.entity';
import { Defect } from '../entities/defect.entity';
import { InspectionDefect } from '../entities/inspection-defect.entity';
import { AddDefectDto } from './dto/add-defect.dto';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';

// ✅ NUEVO: Importar servicio de eventos
import { RulesEventService } from '../../rules-engine/services';

@Injectable()
export class InspectionsService {
  constructor(
    @InjectRepository(QualityInspection)
    private readonly inspectionRepo: Repository<QualityInspection>,

    @InjectRepository(Defect)
    private readonly defectRepo: Repository<Defect>,

    @InjectRepository(InspectionDefect)
    private readonly inspDefRepo: Repository<InspectionDefect>,

    @InjectRepository(TraceNode)
    private readonly traceRepo: Repository<TraceNode>,
    
    // ✅ NUEVO: Inyectar servicio de eventos
    private readonly rulesEventService: RulesEventService,
  ) {}

  async createInspection(dto: CreateInspectionDto, userId?: string) {
    const node = await this.traceRepo.findOne({ 
      where: { id: dto.nodeId },
      relations: ['productionOrder', 'product'],
    });

    if (!node) {
      throw new NotFoundException('Trace node not found');
    }

    const insp = this.inspectionRepo.create({
      type: dto.type,
      nodeId: node.id,
      inspectedQuantity: dto.inspectedQuantity,
      notes: dto.notes,
      status: InspectionStatus.PENDING,
    });

    const saved = await this.inspectionRepo.save(insp);

    // ✅ NUEVO: Disparar evento de inspección creada
    await this.rulesEventService.triggerCustomEvent(
      'INSPECTION_CREATED' as any,
      {
        entityType: 'inspection',
        entityId: saved.id,
        entityData: {
          ...saved,
          productionOrderId: node.productionOrderId,
          productCode: node.product?.code,
          plantCode: node.product?.plantCode,
        },
        userId,
      },
    );

    return saved;
  }

  async addDefect(inspectionId: string, dto: AddDefectDto, userId?: string) {
    const insp = await this.inspectionRepo.findOne({
      where: { id: inspectionId },
      relations: ['node', 'node.product'],
    });
    if (!insp) throw new NotFoundException('Inspection not found');

    const defect = await this.defectRepo.findOne({
      where: { id: dto.defectId },
      relations: ['severity'],
    });
    if (!defect) throw new NotFoundException('Defect not found');

    const inspDef = this.inspDefRepo.create({
      inspectionId,
      defectId: dto.defectId,
      quantity: dto.quantity,
      notes: dto.notes,
    });

    await this.inspDefRepo.save(inspDef);

    // Si hay defectos críticos, fallar automáticamente la inspección
    if (defect.severity?.code === 'CRITICAL') {
      insp.status = InspectionStatus.FAILED;
      await this.inspectionRepo.save(insp);

      // ✅ NUEVO: Disparar evento de inspección fallida
      await this.rulesEventService.onInspectionCompleted(
        {
          ...insp,
          productCode: insp.node?.product?.code,
          plantCode: insp.node?.product?.plantCode,
        },
        userId,
      );
    }

    return inspDef;
  }

  /**
   * ✅ MODIFICADO: Ahora dispara eventos al cambiar estado
   */
  async updateStatus(
    id: string, 
    status: InspectionStatus,
    userId?: string,
  ): Promise<QualityInspection> {
    const insp = await this.inspectionRepo.findOne({ 
      where: { id },
      relations: ['node', 'node.product', 'node.productionOrder'],
    });
    if (!insp) throw new NotFoundException('Inspection not found');

    const previousStatus = insp.status;
    insp.status = status;
    
    const updated = await this.inspectionRepo.save(insp);

    // ✅ NUEVO: Disparar eventos al completar/fallar inspección
    // Esto ejecutará reglas como:
    // - "RULE-QA-001: No permitir completar OP si hay inspecciones pendientes"
    // - "Si inspección falla, bloquear lote automáticamente"
    // - "Requerir aprobación de supervisor si hay defectos"
    if (status === InspectionStatus.COMPLETED || status === InspectionStatus.FAILED) {
      await this.rulesEventService.onInspectionCompleted(
        {
          ...updated,
          productCode: insp.node?.product?.code,
          plantCode: insp.node?.product?.plantCode,
          productionOrderId: insp.node?.productionOrderId,
        },
        userId,
      );
    }

    return updated;
  }

  /**
   * ✅ NUEVO: Método para completar inspección con resultado detallado
   */
  async completeInspection(
    id: string,
    result: {
      passed: boolean;
      inspectedQuantity: number;
      approvedQuantity: number;
      rejectedQuantity: number;
      notes?: string;
      inspectedBy: string;
    },
  ): Promise<QualityInspection> {
    const insp = await this.inspectionRepo.findOne({ 
      where: { id },
      relations: ['node', 'node.product', 'node.productionOrder'],
    });
    if (!insp) throw new NotFoundException('Inspection not found');

    // Actualizar inspección con resultados
    insp.status = result.passed 
      ? InspectionStatus.COMPLETED 
      : InspectionStatus.FAILED;
    insp.inspectedQuantity = result.inspectedQuantity;
    insp.approvedQuantity = result.approvedQuantity;
    insp.rejectedQuantity = result.rejectedQuantity;
    insp.notes = result.notes;
    insp.inspectedBy = result.inspectedBy;
    insp.inspectedAt = new Date();
    
    const completed = await this.inspectionRepo.save(insp);

    // ✅ Disparar evento (automáticamente detecta si pasó o falló)
    await this.rulesEventService.onInspectionCompleted(
      {
        ...completed,
        productCode: insp.node?.product?.code,
        plantCode: insp.node?.product?.plantCode,
        productionOrderId: insp.node?.productionOrderId,
      },
      result.inspectedBy,
    );

    return completed;
  }

  async updateInspection(id: string, dto: UpdateInspectionDto) {
    const insp = await this.inspectionRepo.findOne({ where: { id } });
    if (!insp) throw new NotFoundException('Inspection not found');

    Object.assign(insp, dto);
    return this.inspectionRepo.save(insp);
  }

  async remove(id: string) {
    const insp = await this.inspectionRepo.findOne({ where: { id } });
    if (!insp) throw new NotFoundException('Inspection not found');
    
    return this.inspectionRepo.softRemove(insp);
  }

  /**
   * ✅ NUEVO: Verificar si una orden tiene inspecciones pendientes
   * Este método puede ser usado por el motor de reglas
   */
  async hasPendingInspections(productionOrderId: string): Promise<boolean> {
    const count = await this.inspectionRepo
      .createQueryBuilder('inspection')
      .leftJoin('inspection.node', 'node')
      .where('node.productionOrderId = :orderId', { orderId: productionOrderId })
      .andWhere('inspection.status = :status', { 
        status: InspectionStatus.PENDING 
      })
      .getCount();

    return count > 0;
  }
}
