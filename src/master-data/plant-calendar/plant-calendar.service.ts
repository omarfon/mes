import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlantCalendar } from './entities/plant-calendar.entity';
import { CreatePlantCalendarDto } from './dto/create-plant-calendar.dto';
import { UpdatePlantCalendarDto } from './dto/update-plant-calendar.dto';
import { FilterPlantCalendarDto } from './dto/filter-plant-calendar.dto';

import { AuditsService } from '../../traceability/audits/audits.service';
import { AuditAction } from '../../traceability/audits/entities/audit.entity';

const ENTITY_TYPE = 'PlantCalendar';
const MODULE = 'master-data';

@Injectable()
export class PlantCalendarService {
  constructor(
    @InjectRepository(PlantCalendar)
    private readonly calendarRepo: Repository<PlantCalendar>,
    private readonly auditsService: AuditsService,
  ) {}

  async create(dto: CreatePlantCalendarDto, userId?: string, ip?: string): Promise<PlantCalendar> {
    const calendar = this.calendarRepo.create({
      ...dto,
      plantCode: dto.plantCode.toUpperCase(),
      notes: dto.notes || '',
    });

    const saved = await this.calendarRepo.save(calendar);
    await this.auditsService.create({ action: AuditAction.CREATE, entityType: ENTITY_TYPE, entityId: saved.id, userId, newValues: saved, module: MODULE, description: `PlantCalendar creado`, ipAddress: ip });
    return saved;
  }

  async findAll(filter: FilterPlantCalendarDto) {
    const { page = 1, limit = 20, plantCode, type } = filter;

    const where: any = {};

    if (plantCode) {
      where.plantCode = plantCode.toUpperCase();
    }

    if (type) {
      where.type = type;
    }

    const [data, total] = await this.calendarRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { date: 'ASC' },
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<PlantCalendar> {
    const calendar = await this.calendarRepo.findOne({ where: { id } });

    if (!calendar) {
      throw new NotFoundException(`Plant calendar ${id} not found`);
    }

    return calendar;
  }

  async update(id: string, dto: UpdatePlantCalendarDto, userId?: string, ip?: string): Promise<PlantCalendar> {
    const calendar = await this.findOne(id);
    const oldValues = { ...calendar };

    Object.assign(calendar, {
      ...dto,
      plantCode: dto.plantCode ? dto.plantCode.toUpperCase() : calendar.plantCode,
    });

    const updated = await this.calendarRepo.save(calendar);
    await this.auditsService.create({ action: AuditAction.UPDATE, entityType: ENTITY_TYPE, entityId: id, userId, oldValues, newValues: updated, module: MODULE, description: `PlantCalendar actualizado`, ipAddress: ip });
    return updated;
  }

  async remove(id: string, userId?: string, ip?: string): Promise<void> {
    const calendar = await this.findOne(id);
    await this.calendarRepo.softDelete(calendar.id);
    await this.auditsService.create({ action: AuditAction.DELETE, entityType: ENTITY_TYPE, entityId: id, userId, oldValues: calendar, module: MODULE, description: `PlantCalendar eliminado`, ipAddress: ip });
  }
}
