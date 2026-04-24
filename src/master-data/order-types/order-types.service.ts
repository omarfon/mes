import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { OrderType } from './entities/order-type.entity';
import { CreateOrderTypeDto } from './dto/create-order-type.dto';
import { UpdateOrderTypeDto } from './dto/update-order-type.dto';
import { FilterOrderTypeDto } from './dto/filter-order-type.dto';

@Injectable()
export class OrderTypesService {
  constructor(
    @InjectRepository(OrderType)
    private readonly orderTypesRepo: Repository<OrderType>,
  ) {}

  async create(dto: CreateOrderTypeDto): Promise<OrderType> {
    const existing = await this.orderTypesRepo.findOne({
      where: { code: dto.code.toUpperCase() },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException('Order type code already in use');
    }

    const orderType = this.orderTypesRepo.create({
      code: dto.code.toUpperCase(),
      name: dto.name,
      description: dto.description || '',
      priority: dto.priority,
      color: dto.color ?? '#000000',
      allowsRework: dto.allowsRework ?? false,
      requiresQA: dto.requiresQA ?? true,
      requiresRelease: dto.requiresRelease ?? false,
      active: dto.active ?? true,
    });

    return this.orderTypesRepo.save(orderType);
  }

  async findAll(filter: FilterOrderTypeDto) {
    const { page = 1, limit = 20, search, priority, active } = filter;

    const where: any = {};

    if (typeof active === 'boolean') {
      where.active = active;
    }

    if (priority) {
      where.priority = priority;
    }

    if (search) {
      where.code = ILike(`%${search}%`);
    }

    const [data, total] = await this.orderTypesRepo.findAndCount({
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

  async findOne(id: string): Promise<OrderType> {
    const orderType = await this.orderTypesRepo.findOne({ where: { id } });

    if (!orderType) {
      throw new NotFoundException(`Order type ${id} not found`);
    }

    return orderType;
  }

  async update(id: string, dto: UpdateOrderTypeDto): Promise<OrderType> {
    const orderType = await this.findOne(id);

    if (dto.code && dto.code.toUpperCase() !== orderType.code) {
      const exists = await this.orderTypesRepo.findOne({
        where: { code: dto.code.toUpperCase() },
      });

      if (exists) {
        throw new ConflictException('Order type code already in use');
      }
    }

    Object.assign(orderType, {
      ...dto,
      code: dto.code ? dto.code.toUpperCase() : orderType.code,
    });

    return this.orderTypesRepo.save(orderType);
  }

  async remove(id: string): Promise<void> {
    const orderType = await this.findOne(id);
    await this.orderTypesRepo.softDelete(orderType.id);
  }

  async toggleActive(id: string, active: boolean): Promise<OrderType> {
    const orderType = await this.findOne(id);
    orderType.active = active;
    return this.orderTypesRepo.save(orderType);
  }
}
