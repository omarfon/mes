import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Area } from './entities/area.entity';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { FilterAreaDto } from './dto/filter-area.dto';
import { AuditsService } from '../../traceability/audits/audits.service';
import { AuditAction } from '../../traceability/audits/entities/audit.entity';

const ENTITY_TYPE = 'Area';
const MODULE = 'master-data';

@Injectable()
export class AreasService {
  constructor(
    @InjectRepository(Area)
    private readonly areasRepo: Repository<Area>,
    private readonly auditsService: AuditsService,
  ) {}

  async create(dto: CreateAreaDto, userId?: string, ip?: string): Promise<Area> {
    const existing = await this.areasRepo.findOne({
      where: { code: dto.code.toUpperCase() },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException('Area code already in use');
    }

    const area = this.areasRepo.create({
      code: dto.code.toUpperCase(),
      name: dto.name,
      plantCode: dto.plantCode.toUpperCase(),
      type: dto.type,
      description: dto.description,
      active: dto.active ?? true,
    });

    const saved = await this.areasRepo.save(area);
    await this.auditsService.create({ action: AuditAction.CREATE, entityType: ENTITY_TYPE, entityId: saved.id, userId, newValues: saved, module: MODULE, description: `Área creada: ${saved.name} (${saved.code})`, ipAddress: ip });
    return saved;
  }

  async findAll(filter: FilterAreaDto) {
    const { page = 1, limit = 20, search, plantCode, type, active } = filter;

    const where: any = {};

    if (typeof active === 'boolean') {
      where.active = active;
    }

    if (plantCode) {
      where.plantCode = plantCode.toUpperCase();
    }

    if (type) {
      where.type = type;
    }

    if (search) {
      where.code = ILike(`%${search}%`);
    }

    const [data, total] = await this.areasRepo.findAndCount({
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

  async findOne(id: string): Promise<Area> {
    const area = await this.areasRepo.findOne({ where: { id } });

    if (!area) {
      throw new NotFoundException(`Area ${id} not found`);
    }

    return area;
  }

  async update(id: string, dto: UpdateAreaDto, userId?: string, ip?: string): Promise<Area> {
    const area = await this.findOne(id);
    const oldValues = { ...area };

    if (dto.code && dto.code.toUpperCase() !== area.code) {
      const exists = await this.areasRepo.findOne({
        where: { code: dto.code.toUpperCase() },
      });

      if (exists) {
        throw new ConflictException('Area code already in use');
      }
    }

    Object.assign(area, {
      ...dto,
      code: dto.code ? dto.code.toUpperCase() : area.code,
      plantCode: dto.plantCode ? dto.plantCode.toUpperCase() : area.plantCode,
    });

    const updated = await this.areasRepo.save(area);
    await this.auditsService.create({ action: AuditAction.UPDATE, entityType: ENTITY_TYPE, entityId: id, userId, oldValues, newValues: updated, module: MODULE, description: `Área actualizada: ${updated.name} (${updated.code})`, ipAddress: ip });
    return updated;
  }

  async remove(id: string, userId?: string, ip?: string): Promise<void> {
    const area = await this.findOne(id);
    await this.areasRepo.softDelete(area.id);
    await this.auditsService.create({ action: AuditAction.DELETE, entityType: ENTITY_TYPE, entityId: id, userId, oldValues: area, module: MODULE, description: `Área eliminada: ${area.name} (${area.code})`, ipAddress: ip });
  }

  async toggleActive(id: string, active: boolean): Promise<Area> {
    const area = await this.findOne(id);
    area.active = active;
    return this.areasRepo.save(area);
  }
}
