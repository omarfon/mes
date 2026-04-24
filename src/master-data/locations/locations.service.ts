import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { FilterLocationDto } from './dto/filter-location.dto';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationsRepo: Repository<Location>,
  ) {}

  async create(dto: CreateLocationDto): Promise<Location> {
    const existing = await this.locationsRepo.findOne({
      where: { code: dto.code.toUpperCase() },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException('Location code already in use');
    }

    const location = this.locationsRepo.create({
      code: dto.code.toUpperCase(),
      name: dto.name,
      type: dto.type,
      parentCode: dto.parentCode ? dto.parentCode.toUpperCase() : undefined,
      active: dto.active ?? true,
    });

    return this.locationsRepo.save(location);
  }

  async findAll(filter: FilterLocationDto) {
    const { page = 1, limit = 20, search, type, parentCode, active } = filter;

    const where: any = {};

    if (typeof active === 'boolean') {
      where.active = active;
    }

    if (type) {
      where.type = type;
    }

    if (parentCode) {
      where.parentCode = parentCode.toUpperCase();
    }

    if (search) {
      where.code = ILike(`%${search}%`);
    }

    const [data, total] = await this.locationsRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Location> {
    const location = await this.locationsRepo.findOne({ where: { id } });

    if (!location) {
      throw new NotFoundException(`Location ${id} not found`);
    }

    return location;
  }

  async update(id: string, dto: UpdateLocationDto): Promise<Location> {
    const location = await this.findOne(id);

    if (dto.code && dto.code.toUpperCase() !== location.code) {
      const exists = await this.locationsRepo.findOne({
        where: { code: dto.code.toUpperCase() },
      });

      if (exists) {
        throw new ConflictException('Location code already in use');
      }
    }

    Object.assign(location, {
      ...dto,
      code: dto.code ? dto.code.toUpperCase() : location.code,
      parentCode: dto.parentCode !== undefined 
        ? (dto.parentCode ? dto.parentCode.toUpperCase() : undefined)
        : location.parentCode,
    });

    return this.locationsRepo.save(location);
  }

  async remove(id: string): Promise<void> {
    const location = await this.findOne(id);
    await this.locationsRepo.softDelete(location.id);
  }

  async toggleActive(id: string, active: boolean): Promise<Location> {
    const location = await this.findOne(id);
    location.active = active;
    return this.locationsRepo.save(location);
  }
}
