import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { MovementType } from './entities/movement-type.entity';
import { CreateMovementTypeDto } from './dto/create-movement-type.dto';
import { UpdateMovementTypeDto } from './dto/update-movement-type.dto';
import { FilterMovementTypeDto } from './dto/filter-movement-type.dto';

@Injectable()
export class MovementTypesService {
  constructor(
    @InjectRepository(MovementType)
    private readonly movementTypesRepo: Repository<MovementType>,
  ) {}

  async create(dto: CreateMovementTypeDto): Promise<MovementType> {
    const existing = await this.movementTypesRepo.findOne({
      where: { code: dto.code.toUpperCase() },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException('Movement type code already in use');
    }

    const movementType = this.movementTypesRepo.create({
      code: dto.code.toUpperCase(),
      name: dto.name,
      category: dto.category,
      direction: dto.direction,
      affectsStock: dto.affectsStock ?? true,
      requiresLot: dto.requiresLot ?? false,
      requiresReason: dto.requiresReason ?? false,
      autoConsumed: dto.autoConsumed ?? false,
      active: dto.active ?? true,
      notes: dto.notes || '',
    });

    return this.movementTypesRepo.save(movementType);
  }

  async findAll(filter: FilterMovementTypeDto) {
    const { page = 1, limit = 20, search, category, direction, active } = filter;

    const where: any = {};

    if (typeof active === 'boolean') {
      where.active = active;
    }

    if (category) {
      where.category = category;
    }

    if (direction) {
      where.direction = direction;
    }

    if (search) {
      where.code = ILike(`%${search}%`);
    }

    const [data, total] = await this.movementTypesRepo.findAndCount({
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

  async findOne(id: string): Promise<MovementType> {
    const movementType = await this.movementTypesRepo.findOne({ where: { id } });

    if (!movementType) {
      throw new NotFoundException(`Movement type ${id} not found`);
    }

    return movementType;
  }

  async update(id: string, dto: UpdateMovementTypeDto): Promise<MovementType> {
    const movementType = await this.findOne(id);

    if (dto.code && dto.code.toUpperCase() !== movementType.code) {
      const exists = await this.movementTypesRepo.findOne({
        where: { code: dto.code.toUpperCase() },
      });

      if (exists) {
        throw new ConflictException('Movement type code already in use');
      }
    }

    Object.assign(movementType, {
      ...dto,
      code: dto.code ? dto.code.toUpperCase() : movementType.code,
    });

    return this.movementTypesRepo.save(movementType);
  }

  async remove(id: string): Promise<void> {
    const movementType = await this.findOne(id);
    await this.movementTypesRepo.softDelete(movementType.id);
  }

  async toggleActive(id: string, active: boolean): Promise<MovementType> {
    const movementType = await this.findOne(id);
    movementType.active = active;
    return this.movementTypesRepo.save(movementType);
  }
}
