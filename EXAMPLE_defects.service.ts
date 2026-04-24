/**
 * EJEMPLO DE INTEGRACIÓN: Quality Service - Defects
 * 
 * Este archivo muestra cómo integrar el motor de reglas
 * con el servicio de defectos de calidad.
 * 
 * CASOS DE USO:
 * - Bloquear lote si tasa de defectos > X%
 * - Crear alerta si hay defectos críticos
 * - Requerir aprobación de calidad
 * - Detener producción si defectos exceden umbral
 */

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Defect, DefectStatus } from './entities/defect.entity';
import { CreateDefectDto } from './dto/create-defect.dto';
import { UpdateDefectDto } from './dto/update-defect.dto';

// ✅ NUEVO: Importar servicio de eventos
import { RulesEventService } from '../../rules-engine/services';

@Injectable()
export class DefectsService {
  constructor(
    @InjectRepository(Defect)
    private defectRepository: Repository<Defect>,
    
    // ✅ NUEVO: Inyectar servicio de eventos
    private readonly rulesEventService: RulesEventService,
  ) {}

  /**
   * ✅ MODIFICADO: Ahora dispara eventos del motor de reglas
   */
  async create(createDto: CreateDefectDto): Promise<Defect> {
    const existing = await this.defectRepository.findOne({
      where: { code: createDto.code },
    });
    if (existing) {
      throw new ConflictException(`Defect with code ${createDto.code} already exists`);
    }

    const defect = this.defectRepository.create(createDto);
    const saved = await this.defectRepository.save(defect);

    // ✅ NUEVO: Calcular tasa de defectos y disparar evento
    const defectRate = await this.calculateDefectRate(
      saved.productionOrderId,
      saved.productId,
    );

    // Disparar evento DEFECT_REGISTERED
    // Esto ejecutará reglas como:
    // - "Si tasa de defectos > 5%, bloquear lote"
    // - "Si defecto crítico, crear alerta inmediata"
    // - "Si defectos acumulados > X, detener orden"
    await this.rulesEventService.onDefectRegistered(
      {
        ...saved,
        plantCode: saved.product?.plantCode,
        productCode: saved.productId,
        machineCode: saved.machineCode,
      },
      defectRate,
      createDto.registeredBy,
    );

    return saved;
  }

  /**
   * ✅ NUEVO: Método helper para calcular tasa de defectos
   */
  private async calculateDefectRate(
    productionOrderId?: string,
    productId?: string,
  ): Promise<number> {
    if (!productionOrderId && !productId) return 0;

    const query = this.defectRepository
      .createQueryBuilder('defect')
      .select('COUNT(*)', 'defectCount')
      .addSelect('SUM(defect.quantity)', 'totalDefects');

    if (productionOrderId) {
      query.where('defect.productionOrderId = :orderId', {
        orderId: productionOrderId,
      });
    } else if (productId) {
      query.where('defect.productId = :productId', { productId });
    }

    const result = await query.getRawOne();
    const totalDefects = parseInt(result?.totalDefects || '0');

    // Obtener cantidad producida de la orden
    // (esto requeriría inyectar ProductionOrdersRepository)
    // Por simplicidad, aquí retornamos un valor estimado
    const producedQuantity = 1000; // TODO: Obtener de la orden real
    
    return producedQuantity > 0 
      ? (totalDefects / producedQuantity) * 100 
      : 0;
  }

  async findAll(filters?: {
    familyId?: string;
    severityId?: string;
    status?: DefectStatus;
    productId?: string;
    productionOrderId?: string;
    inspectionId?: string;
  }): Promise<Defect[]> {
    const query = this.defectRepository
      .createQueryBuilder('defect')
      .leftJoinAndSelect('defect.family', 'family')
      .leftJoinAndSelect('defect.severity', 'severity');

    if (filters?.familyId) {
      query.andWhere('defect.familyId = :familyId', { familyId: filters.familyId });
    }

    if (filters?.severityId) {
      query.andWhere('defect.severityId = :severityId', { severityId: filters.severityId });
    }

    if (filters?.status) {
      query.andWhere('defect.status = :status', { status: filters.status });
    }

    if (filters?.productId) {
      query.andWhere('defect.productId = :productId', { productId: filters.productId });
    }

    if (filters?.productionOrderId) {
      query.andWhere('defect.productionOrderId = :productionOrderId', {
        productionOrderId: filters.productionOrderId,
      });
    }

    if (filters?.inspectionId) {
      query.andWhere('defect.inspectionId = :inspectionId', {
        inspectionId: filters.inspectionId,
      });
    }

    return query.orderBy('defect.createdAt', 'DESC').getMany();
  }

  async findOne(id: string): Promise<Defect> {
    const defect = await this.defectRepository.findOne({
      where: { id },
      relations: ['family', 'severity', 'product'],
    });
    if (!defect) {
      throw new NotFoundException(`Defect with ID ${id} not found`);
    }
    return defect;
  }

  async update(id: string, updateDto: UpdateDefectDto): Promise<Defect> {
    const defect = await this.findOne(id);

    if (updateDto.code && updateDto.code !== defect.code) {
      const existing = await this.defectRepository.findOne({
        where: { code: updateDto.code },
      });
      if (existing) {
        throw new ConflictException(`Defect with code ${updateDto.code} already exists`);
      }
    }

    Object.assign(defect, updateDto);
    return this.defectRepository.save(defect);
  }

  async updateStatus(id: string, status: DefectStatus, userId?: string): Promise<Defect> {
    const defect = await this.findOne(id);
    defect.status = status;

    const updated = await this.defectRepository.save(defect);

    // ✅ NUEVO: Disparar evento si el defecto se cierra/resuelve
    if (status === DefectStatus.RESOLVED || status === DefectStatus.CLOSED) {
      await this.rulesEventService.triggerCustomEvent(
        'DEFECT_RESOLVED' as any,
        {
          entityType: 'defect',
          entityId: updated.id,
          entityData: {
            ...updated,
            productCode: updated.productId,
          },
          userId,
        },
      );
    }

    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.defectRepository.softDelete(id);
  }
}
