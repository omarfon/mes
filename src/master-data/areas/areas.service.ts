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

@Injectable()
export class AreasService {
  constructor(
    @InjectRepository(Area)
    private readonly areasRepo: Repository<Area>,
  ) {}

  async create(dto: CreateAreaDto): Promise<Area> {
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

    return this.areasRepo.save(area);
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

  async update(id: string, dto: UpdateAreaDto): Promise<Area> {
    const area = await this.findOne(id);

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

    return this.areasRepo.save(area);
  }

  async remove(id: string): Promise<void> {
    const area = await this.findOne(id);
    await this.areasRepo.softDelete(area.id);
  }

  async toggleActive(id: string, active: boolean): Promise<Area> {
    const area = await this.findOne(id);
    area.active = active;
    return this.areasRepo.save(area);
  }
}
