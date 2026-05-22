import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Plant } from './entities/plant.entity';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { FilterPlantDto } from './dto/filter-plant.dto';
import { AuditsService } from '../../traceability/audits/audits.service';
import { AuditAction } from '../../traceability/audits/entities/audit.entity';

const ENTITY_TYPE = 'Plant';
const MODULE = 'master-data';

@Injectable()
export class PlantsService {
  constructor(
    @InjectRepository(Plant)
    private readonly plantsRepo: Repository<Plant>,
    private readonly auditsService: AuditsService,
  ) {}

  async create(dto: CreatePlantDto, userId?: string, ip?: string): Promise<Plant> {
    const existing = await this.plantsRepo.findOne({
      where: { code: dto.code.toUpperCase() },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException('Plant code already in use');
    }

    const plant = this.plantsRepo.create({
      code: dto.code.toUpperCase(),
      name: dto.name,
      country: dto.country,
      city: dto.city,
      timezone: dto.timezone ?? 'UTC',
      active: dto.active ?? true,
    });

    const saved = await this.plantsRepo.save(plant);

    await this.auditsService.create({
      action: AuditAction.CREATE,
      entityType: ENTITY_TYPE,
      entityId: saved.id,
      userId,
      newValues: saved,
      module: MODULE,
      description: `Planta creada: ${saved.name} (${saved.code})`,
      ipAddress: ip,
    });

    return saved;
  }

  async findAll(filter: FilterPlantDto) {
    const { page = 1, limit = 20, search, active } = filter;

    const where: any = {};

    if (typeof active === 'boolean') {
      where.active = active;
    }

    if (search) {
      where.code = ILike(`%${search}%`);
    }

    const [data, total] = await this.plantsRepo.findAndCount({
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

  async findOne(id: string): Promise<Plant> {
    const plant = await this.plantsRepo.findOne({ where: { id } });

    if (!plant) {
      throw new NotFoundException(`Plant ${id} not found`);
    }

    return plant;
  }

  async update(id: string, dto: UpdatePlantDto, userId?: string, ip?: string): Promise<Plant> {
    const plant = await this.findOne(id);
    const oldValues = { ...plant };

    if (dto.code && dto.code.toUpperCase() !== plant.code) {
      const exists = await this.plantsRepo.findOne({
        where: { code: dto.code.toUpperCase() },
      });

      if (exists) {
        throw new ConflictException('Plant code already in use');
      }
    }

    Object.assign(plant, {
      ...dto,
      code: dto.code ? dto.code.toUpperCase() : plant.code,
    });

    const updated = await this.plantsRepo.save(plant);

    await this.auditsService.create({
      action: AuditAction.UPDATE,
      entityType: ENTITY_TYPE,
      entityId: id,
      userId,
      oldValues,
      newValues: updated,
      module: MODULE,
      description: `Planta actualizada: ${updated.name} (${updated.code})`,
      ipAddress: ip,
    });

    return updated;
  }

  async remove(id: string, userId?: string, ip?: string): Promise<void> {
    const plant = await this.findOne(id);
    await this.plantsRepo.softDelete(plant.id);

    await this.auditsService.create({
      action: AuditAction.DELETE,
      entityType: ENTITY_TYPE,
      entityId: id,
      userId,
      oldValues: plant,
      module: MODULE,
      description: `Planta eliminada: ${plant.name} (${plant.code})`,
      ipAddress: ip,
    });
  }

  async toggleActive(id: string, active: boolean): Promise<Plant> {
    const plant = await this.findOne(id);
    plant.active = active;
    return this.plantsRepo.save(plant);
  }
}
