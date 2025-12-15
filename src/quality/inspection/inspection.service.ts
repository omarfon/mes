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
import { AddDefectDto } from '../dto/add-deffect.dto';
import { CreateInspectionDto } from '../dto/create-inspection.dto';
import { FilterInspectionsDto } from '../dto/filter-inspection.dto';



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
  ) {}

  async createInspection(dto: CreateInspectionDto) {
    const node = await this.traceRepo.findOne({ where: { id: dto.nodeId } });

    if (!node) {
      throw new NotFoundException('Trace node not found');
    }

    const insp = this.inspectionRepo.create({
      type: dto.type,
      nodeId: node.id,
      inspectedQuantity: dto.inspectedQuantity,
      notes: dto.notes,
    });

    return this.inspectionRepo.save(insp);
  }

  async addDefect(inspectionId: string, dto: AddDefectDto) {
    const insp = await this.inspectionRepo.findOne({
      where: { id: inspectionId },
    });
    if (!insp) throw new NotFoundException('Inspection not found');

    const defect = await this.defectRepo.findOne({
      where: { id: dto.defectId },
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
    if (defect.severity === 'CRITICAL') {
      insp.status = InspectionStatus.FAILED;
      await this.inspectionRepo.save(insp);
    }

    return inspDef;
  }

  async updateStatus(id: string, status: InspectionStatus) {
    const insp = await this.inspectionRepo.findOne({ where: { id } });
    if (!insp) throw new NotFoundException('Inspection not found');

    insp.status = status;
    return this.inspectionRepo.save(insp);
  }

  async findAll(filter: FilterInspectionsDto) {
    const { type, status, nodeId, page = 1, limit = 20 } = filter;

    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;
    if (nodeId) where.nodeId = nodeId;

    const [data, total] = await this.inspectionRepo.findAndCount({
      where,
      take: limit,
      skip: (page - 1) * limit,
      relations: ['defects', 'defects.defect', 'node'],
      order: { createdAt: 'DESC' },
    });

    return { data, total, page, limit };
  }

  async getOne(id: string) {
    const insp = await this.inspectionRepo.findOne({
      where: { id },
      relations: ['defects', 'defects.defect', 'node'],
    });
    if (!insp) throw new NotFoundException('Inspection not found');

    return insp;
  }
}
