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

import { AuditsService } from '../../traceability/audits/audits.service';
import { AuditAction } from '../../traceability/audits/entities/audit.entity';

const ENTITY_TYPE = 'OrderType';
const MODULE = 'master-data';

@Injectable()
export class OrderTypesService {
  constructor(
    @InjectRepository(OrderType)
    private readonly orderTypesRepo: Repository<OrderType>,
    private readonly auditsService: AuditsService,
  ) {}

  async create(dto: CreateOrderTypeDto, userId?: string, ip?: string): Promise<OrderType> {
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

    const saved = await this.orderTypesRepo.save(orderType);
    await this.auditsService.create({ action: AuditAction.CREATE, entityType: ENTITY_TYPE, entityId: saved.id, userId, newValues: saved, module: MODULE, description: `OrderType creado`, ipAddress: ip });
    return saved;
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
      order: { fechaCreacion: 'DESC' },
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

  async update(id: string, dto: UpdateOrderTypeDto, userId?: string, ip?: string): Promise<OrderType> {
    const orderType = await this.findOne(id);
    const oldValues = { ...orderType };

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

    const updated = await this.orderTypesRepo.save(orderType);
    await this.auditsService.create({ action: AuditAction.UPDATE, entityType: ENTITY_TYPE, entityId: id, userId, oldValues, newValues: updated, module: MODULE, description: `OrderType actualizado`, ipAddress: ip });
    return updated;
  }

  async remove(id: string, userId?: string, ip?: string): Promise<void> {
    const orderType = await this.findOne(id);
    await this.orderTypesRepo.softDelete(orderType.id);
    await this.auditsService.create({ action: AuditAction.DELETE, entityType: ENTITY_TYPE, entityId: id, userId, oldValues: orderType, module: MODULE, description: `OrderType eliminado`, ipAddress: ip });
  }

  async toggleActive(id: string, active: boolean): Promise<OrderType> {
    const orderType = await this.findOne(id);
    orderType.active = active;
    return this.orderTypesRepo.save(orderType);
  }
}
