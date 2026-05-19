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

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(Material)
    private readonly materialsRepo: Repository<Material>,
  ) {}

  async create(dto: CreateMaterialDto): Promise<Material> {
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

    return this.materialsRepo.save(material);
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

  async update(id: string, dto: UpdateMaterialDto): Promise<Material> {
    const material = await this.findOne(id);

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

    return this.materialsRepo.save(material);
  }

  async remove(id: string): Promise<void> {
    const material = await this.findOne(id);
    await this.materialsRepo.softDelete(material.id);
  }

  async toggleActive(id: string, active: boolean): Promise<Material> {
    const material = await this.findOne(id);
    material.active = active;
    return this.materialsRepo.save(material);
  }
}
