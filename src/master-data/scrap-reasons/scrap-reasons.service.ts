import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { ScrapReason } from './entities/scrap-reason.entity';
import { CreateScrapReasonDto } from './dto/create-scrap-reason.dto';
import { UpdateScrapReasonDto } from './dto/update-scrap-reason.dto';
import { FilterScrapReasonDto } from './dto/filter-scrap-reason.dto';

import { AuditsService } from '../../traceability/audits/audits.service';
import { AuditAction } from '../../traceability/audits/entities/audit.entity';

const ENTITY_TYPE = 'ScrapReason';
const MODULE = 'master-data';

@Injectable()
export class ScrapReasonsService {
  constructor(
    @InjectRepository(ScrapReason)
    private readonly scrapReasonsRepo: Repository<ScrapReason>,
    private readonly auditsService: AuditsService,
  ) {}

  async create(dto: CreateScrapReasonDto, userId?: string, ip?: string): Promise<ScrapReason> {
    const existing = await this.scrapReasonsRepo.findOne({
      where: { code: dto.code.toUpperCase() },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException('Scrap reason code already in use');
    }

    const scrapReason = this.scrapReasonsRepo.create({
      code: dto.code.toUpperCase(),
      name: dto.name,
      classification: dto.classification,
      description: dto.description || '',
      affectsEfficiency: dto.affectsEfficiency ?? true,
      reportable: dto.reportable ?? true,
      active: dto.active ?? true,
    });

    const saved = await this.scrapReasonsRepo.save(scrapReason);
    await this.auditsService.create({ action: AuditAction.CREATE, entityType: ENTITY_TYPE, entityId: saved.id, userId, newValues: saved, module: MODULE, description: `ScrapReason creado`, ipAddress: ip });
    return saved;
  }

  async findAll(filter: FilterScrapReasonDto) {
    const { page = 1, limit = 20, search, classification, active } = filter;

    const where: any = {};

    if (typeof active === 'boolean') {
      where.active = active;
    }

    if (classification) {
      where.classification = classification;
    }

    if (search) {
      where.code = ILike(`%${search}%`);
    }

    const [data, total] = await this.scrapReasonsRepo.findAndCount({
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

  async findOne(id: string): Promise<ScrapReason> {
    const scrapReason = await this.scrapReasonsRepo.findOne({ where: { id } });

    if (!scrapReason) {
      throw new NotFoundException(`Scrap reason ${id} not found`);
    }

    return scrapReason;
  }

  async update(id: string, dto: UpdateScrapReasonDto, userId?: string, ip?: string): Promise<ScrapReason> {
    const scrapReason = await this.findOne(id);
    const oldValues = { ...scrapReason };

    if (dto.code && dto.code.toUpperCase() !== scrapReason.code) {
      const exists = await this.scrapReasonsRepo.findOne({
        where: { code: dto.code.toUpperCase() },
      });

      if (exists) {
        throw new ConflictException('Scrap reason code already in use');
      }
    }

    Object.assign(scrapReason, {
      ...dto,
      code: dto.code ? dto.code.toUpperCase() : scrapReason.code,
    });

    const updated = await this.scrapReasonsRepo.save(scrapReason);
    await this.auditsService.create({ action: AuditAction.UPDATE, entityType: ENTITY_TYPE, entityId: id, userId, oldValues, newValues: updated, module: MODULE, description: `ScrapReason actualizado`, ipAddress: ip });
    return updated;
  }

  async remove(id: string, userId?: string, ip?: string): Promise<void> {
    const scrapReason = await this.findOne(id);
    await this.scrapReasonsRepo.softDelete(scrapReason.id);
    await this.auditsService.create({ action: AuditAction.DELETE, entityType: ENTITY_TYPE, entityId: id, userId, oldValues: scrapReason, module: MODULE, description: `ScrapReason eliminado`, ipAddress: ip });
  }

  async toggleActive(id: string, active: boolean): Promise<ScrapReason> {
    const scrapReason = await this.findOne(id);
    scrapReason.active = active;
    return this.scrapReasonsRepo.save(scrapReason);
  }
}
