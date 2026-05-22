import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { ShiftGroup } from './entities/shift-group.entity';
import { CreateShiftGroupDto } from './dto/create-shift-group.dto';
import { UpdateShiftGroupDto } from './dto/update-shift-group.dto';
import { FilterShiftGroupDto } from './dto/filter-shift-group.dto';

import { AuditsService } from '../../traceability/audits/audits.service';
import { AuditAction } from '../../traceability/audits/entities/audit.entity';

const ENTITY_TYPE = 'ShiftGroup';
const MODULE = 'master-data';

@Injectable()
export class ShiftGroupsService {
  constructor(
    @InjectRepository(ShiftGroup)
    private readonly shiftGroupsRepo: Repository<ShiftGroup>,
    private readonly auditsService: AuditsService,
  ) {}

  async create(dto: CreateShiftGroupDto, userId?: string, ip?: string): Promise<ShiftGroup> {
    const existing = await this.shiftGroupsRepo.findOne({
      where: { code: dto.code.toUpperCase() },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException('Shift group code already in use');
    }

    const shiftGroup = this.shiftGroupsRepo.create({
      code: dto.code.toUpperCase(),
      name: dto.name,
      plantCode: dto.plantCode.toUpperCase(),
      shiftCodes: dto.shiftCodes || '',
      supervisorCode: dto.supervisorCode || '',
      headcount: dto.headcount ?? 0,
      notes: dto.notes || '',
      active: dto.active ?? true,
    });

    const saved = await this.shiftGroupsRepo.save(shiftGroup);
    await this.auditsService.create({ action: AuditAction.CREATE, entityType: ENTITY_TYPE, entityId: saved.id, userId, newValues: saved, module: MODULE, description: `ShiftGroup creado`, ipAddress: ip });
    return saved;
  }

  async findAll(filter: FilterShiftGroupDto) {
    const { page = 1, limit = 20, search, plantCode, active } = filter;

    const where: any = {};

    if (typeof active === 'boolean') {
      where.active = active;
    }

    if (plantCode) {
      where.plantCode = plantCode.toUpperCase();
    }

    if (search) {
      where.code = ILike(`%${search}%`);
    }

    const [data, total] = await this.shiftGroupsRepo.findAndCount({
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

  async findOne(id: string): Promise<ShiftGroup> {
    const shiftGroup = await this.shiftGroupsRepo.findOne({ where: { id } });

    if (!shiftGroup) {
      throw new NotFoundException(`Shift group ${id} not found`);
    }

    return shiftGroup;
  }

  async update(id: string, dto: UpdateShiftGroupDto, userId?: string, ip?: string): Promise<ShiftGroup> {
    const shiftGroup = await this.findOne(id);
    const oldValues = { ...shiftGroup };

    if (dto.code && dto.code.toUpperCase() !== shiftGroup.code) {
      const exists = await this.shiftGroupsRepo.findOne({
        where: { code: dto.code.toUpperCase() },
      });

      if (exists) {
        throw new ConflictException('Shift group code already in use');
      }
    }

    Object.assign(shiftGroup, {
      ...dto,
      code: dto.code ? dto.code.toUpperCase() : shiftGroup.code,
      plantCode: dto.plantCode ? dto.plantCode.toUpperCase() : shiftGroup.plantCode,
    });

    const updated = await this.shiftGroupsRepo.save(shiftGroup);
    await this.auditsService.create({ action: AuditAction.UPDATE, entityType: ENTITY_TYPE, entityId: id, userId, oldValues, newValues: updated, module: MODULE, description: `ShiftGroup actualizado`, ipAddress: ip });
    return updated;
  }

  async remove(id: string, userId?: string, ip?: string): Promise<void> {
    const shiftGroup = await this.findOne(id);
    await this.shiftGroupsRepo.softDelete(shiftGroup.id);
    await this.auditsService.create({ action: AuditAction.DELETE, entityType: ENTITY_TYPE, entityId: id, userId, oldValues: shiftGroup, module: MODULE, description: `ShiftGroup eliminado`, ipAddress: ip });
  }

  async toggleActive(id: string, active: boolean): Promise<ShiftGroup> {
    const shiftGroup = await this.findOne(id);
    shiftGroup.active = active;
    return this.shiftGroupsRepo.save(shiftGroup);
  }
}
