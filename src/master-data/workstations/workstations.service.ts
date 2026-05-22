import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Workstation } from './entities/workstation.entity';
import { CreateWorkstationDto } from './dto/create-workstation.dto';
import { UpdateWorkstationDto } from './dto/update-workstation.dto';
import { FilterWorkstationDto } from './dto/filter-workstation.dto';

import { AuditsService } from '../../traceability/audits/audits.service';
import { AuditAction } from '../../traceability/audits/entities/audit.entity';

const ENTITY_TYPE = 'Workstation';
const MODULE = 'master-data';

@Injectable()
export class WorkstationsService {
  constructor(
    @InjectRepository(Workstation)
    private readonly workstationsRepo: Repository<Workstation>,
    private readonly auditsService: AuditsService,
  ) {}

  async create(dto: CreateWorkstationDto, userId?: string, ip?: string): Promise<Workstation> {
    const existing = await this.workstationsRepo.findOne({
      where: { code: dto.code.toUpperCase() },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException('Workstation code already in use');
    }

    const workstation = this.workstationsRepo.create({
      code: dto.code.toUpperCase(),
      name: dto.name,
      workCenterCode: dto.workCenterCode?.toUpperCase() || '',
      type: dto.type,
      asset: dto.asset || '',
      operatorSlots: dto.operatorSlots ?? 1,
      active: dto.active ?? true,
    });

    const saved = await this.workstationsRepo.save(workstation);
    await this.auditsService.create({ action: AuditAction.CREATE, entityType: ENTITY_TYPE, entityId: saved.id, userId, newValues: saved, module: MODULE, description: `Workstation creado`, ipAddress: ip });
    return saved;
  }

  async findAll(filter: FilterWorkstationDto) {
    const { page = 1, limit = 20, search, workCenterCode, type, active } = filter;

    const where: any = {};

    if (typeof active === 'boolean') {
      where.active = active;
    }

    if (workCenterCode) {
      where.workCenterCode = workCenterCode.toUpperCase();
    }

    if (type) {
      where.type = type;
    }

    if (search) {
      where.code = ILike(`%${search}%`);
    }

    const [data, total] = await this.workstationsRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { fechaCreacion: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Workstation> {
    const workstation = await this.workstationsRepo.findOne({ where: { id } });

    if (!workstation) {
      throw new NotFoundException(`Workstation ${id} not found`);
    }

    return workstation;
  }

  async update(id: string, dto: UpdateWorkstationDto, userId?: string, ip?: string): Promise<Workstation> {
    const workstation = await this.findOne(id);
    const oldValues = { ...workstation };

    if (dto.code && dto.code.toUpperCase() !== workstation.code) {
      const exists = await this.workstationsRepo.findOne({
        where: { code: dto.code.toUpperCase() },
      });

      if (exists) {
        throw new ConflictException('Workstation code already in use');
      }
    }

    Object.assign(workstation, {
      ...dto,
      code: dto.code ? dto.code.toUpperCase() : workstation.code,
      workCenterCode: dto.workCenterCode ? dto.workCenterCode.toUpperCase() : workstation.workCenterCode,
    });

    const updated = await this.workstationsRepo.save(workstation);
    await this.auditsService.create({ action: AuditAction.UPDATE, entityType: ENTITY_TYPE, entityId: id, userId, oldValues, newValues: updated, module: MODULE, description: `Workstation actualizado`, ipAddress: ip });
    return updated;
  }

  async remove(id: string, userId?: string, ip?: string): Promise<void> {
    const workstation = await this.findOne(id);
    await this.workstationsRepo.softDelete(workstation.id);
    await this.auditsService.create({ action: AuditAction.DELETE, entityType: ENTITY_TYPE, entityId: id, userId, oldValues: workstation, module: MODULE, description: `Workstation eliminado`, ipAddress: ip });
  }

  async toggleActive(id: string, active: boolean): Promise<Workstation> {
    const workstation = await this.findOne(id);
    workstation.active = active;
    return this.workstationsRepo.save(workstation);
  }
}
