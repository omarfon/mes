import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateWorkCenterDto } from './dto/create-work-center.dto';
import { FilterWorkCentersDto } from './dto/filter-work-center.dto';
import { UpdateWorkCenterDto } from './dto/update-work-center.dto';
import { WorkCenter, WorkCenterType } from './entities/work-center.entity';


import { AuditsService } from '../../traceability/audits/audits.service';
import { AuditAction } from '../../traceability/audits/entities/audit.entity';

const ENTITY_TYPE = 'WorkCenter';
const MODULE = 'master-data';

@Injectable()
export class WorkCentersService {
  constructor(
    @InjectRepository(WorkCenter)
    private readonly workCentersRepo: Repository<WorkCenter>,
    private readonly auditsService: AuditsService,
  ) {}

  async create(dto: CreateWorkCenterDto, userId?: string, ip?: string): Promise<WorkCenter> {
    const existing = await this.workCentersRepo.findOne({
      where: { code: dto.code.toUpperCase() },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException('Work center code already in use');
    }

    const workCenter = this.workCentersRepo.create({
      code: dto.code.toUpperCase(),
      name: dto.name,
      description: dto.description,
      type: dto.type ?? WorkCenterType.LINE,
      area: dto.area,
      location: dto.location,
      nominalCapacity: dto.nominalCapacity,
      isActive: dto.isActive ?? true,
    });

    const saved = await this.workCentersRepo.save(workCenter);
    await this.auditsService.create({ action: AuditAction.CREATE, entityType: ENTITY_TYPE, entityId: saved.id, userId, newValues: saved, module: MODULE, description: `WorkCenter creado`, ipAddress: ip });
    return saved;
  }

  async findAll(filter: FilterWorkCentersDto) {
    const { page = 1, limit = 20, search, isActive } = filter;

    const where: any = {};

    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    if (search) {
      where.code = ILike(`%${search}%`);
      // si quieres algo más pro, luego hacemos QueryBuilder con OR a nombre/area
    }

    const [data, total] = await this.workCentersRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { fechaCreacion: 'DESC' },
      relations: ['machines'],
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<WorkCenter> {
    const wc = await this.workCentersRepo.findOne({
      where: { id },
      relations: ['machines'],
    });

    if (!wc) {
      throw new NotFoundException(`Work center ${id} not found`);
    }

    return wc;
  }

  async update(id: string, dto: UpdateWorkCenterDto, userId?: string, ip?: string): Promise<WorkCenter> {
    const wc = await this.findOne(id);
    const oldValues = { ...wc };

    if (dto.code && dto.code.toUpperCase() !== wc.code) {
      const exists = await this.workCentersRepo.findOne({
        where: { code: dto.code.toUpperCase() },
      });
      if (exists) {
        throw new ConflictException('Work center code already in use');
      }
    }

    wc.code = dto.code ? dto.code.toUpperCase() : wc.code;
    wc.name = dto.name ?? wc.name;
    wc.description = dto.description ?? wc.description;
    wc.type = dto.type ?? wc.type;
    wc.area = dto.area ?? wc.area;
    wc.location = dto.location ?? wc.location;
    wc.nominalCapacity =
      dto.nominalCapacity !== undefined
        ? dto.nominalCapacity
        : wc.nominalCapacity;

    if (dto.isActive !== undefined) {
      wc.isActive = dto.isActive;
    }

    const updated = await this.workCentersRepo.save(wc);
    await this.auditsService.create({ action: AuditAction.UPDATE, entityType: ENTITY_TYPE, entityId: id, userId, oldValues, newValues: updated, module: MODULE, description: `WorkCenter actualizado`, ipAddress: ip });
    return updated;
  }

  async toggleActive(id: string, isActive: boolean): Promise<WorkCenter> {
    const wc = await this.findOne(id);
    wc.isActive = isActive;
    return this.workCentersRepo.save(wc);
  }

  async softDelete(id: string, userId?: string, ip?: string): Promise<void> {
    await this.workCentersRepo.softDelete(id);
    await this.auditsService.create({ action: AuditAction.DELETE, entityType: ENTITY_TYPE, entityId: id, userId, module: MODULE, description: `WorkCenter eliminado`, ipAddress: ip });
  }
}
