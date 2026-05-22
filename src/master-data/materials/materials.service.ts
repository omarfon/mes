import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Material } from './entities/material.entity';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { FilterMaterialDto } from './dto/filter-material.dto';

import { AuditsService } from '../../traceability/audits/audits.service';
import { AuditAction } from '../../traceability/audits/entities/audit.entity';

const ENTITY_TYPE = 'Material';
const MODULE = 'master-data';

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(Material)
    private readonly materialsRepo: Repository<Material>,
    private readonly auditsService: AuditsService,
  ) {}

  async create(dto: CreateMaterialDto, userId?: string, ip?: string): Promise<Material> {
    const existing = await this.materialsRepo.findOne({
      where: { code: dto.code.toUpperCase() },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException('Material code already in use');
    }

    const material = this.materialsRepo.create({
      code: dto.code.toUpperCase(),
      name: dto.name,
      type: dto.type,
      uom: dto.uom,
      active: dto.active ?? true,
    });

    const saved = await this.materialsRepo.save(material);
    await this.auditsService.create({ action: AuditAction.CREATE, entityType: ENTITY_TYPE, entityId: saved.id, userId, newValues: saved, module: MODULE, description: `Material creado`, ipAddress: ip });
    return saved;
  }

  async findAll(filter: FilterMaterialDto) {
    const { page = 1, limit = 20, search, type, active } = filter;

    const where: any = {};

    if (typeof active === 'boolean') {
      where.active = active;
    }

    if (type) {
      where.type = type;
    }

    if (search) {
      where.code = ILike(`%${search}%`);
    }

    const [data, total] = await this.materialsRepo.findAndCount({
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

  async findOne(id: string): Promise<Material> {
    const material = await this.materialsRepo.findOne({ where: { id } });

    if (!material) {
      throw new NotFoundException(`Material ${id} not found`);
    }

    return material;
  }

  async update(id: string, dto: UpdateMaterialDto, userId?: string, ip?: string): Promise<Material> {
    const material = await this.findOne(id);
    const oldValues = { ...material };

    if (dto.code && dto.code.toUpperCase() !== material.code) {
      const exists = await this.materialsRepo.findOne({
        where: { code: dto.code.toUpperCase() },
      });

      if (exists) {
        throw new ConflictException('Material code already in use');
      }
    }

    Object.assign(material, {
      ...dto,
      code: dto.code ? dto.code.toUpperCase() : material.code,
    });

    const updated = await this.materialsRepo.save(material);
    await this.auditsService.create({ action: AuditAction.UPDATE, entityType: ENTITY_TYPE, entityId: id, userId, oldValues, newValues: updated, module: MODULE, description: `Material actualizado`, ipAddress: ip });
    return updated;
  }

  async remove(id: string, userId?: string, ip?: string): Promise<void> {
    const material = await this.findOne(id);
    await this.materialsRepo.softDelete(material.id);
    await this.auditsService.create({ action: AuditAction.DELETE, entityType: ENTITY_TYPE, entityId: id, userId, oldValues: material, module: MODULE, description: `Material eliminado`, ipAddress: ip });
  }

  async toggleActive(id: string, active: boolean): Promise<Material> {
    const material = await this.findOne(id);
    material.active = active;
    return this.materialsRepo.save(material);
  }
}
