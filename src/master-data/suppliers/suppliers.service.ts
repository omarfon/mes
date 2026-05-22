import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { FilterSupplierDto } from './dto/filter-supplier.dto';

import { AuditsService } from '../../traceability/audits/audits.service';
import { AuditAction } from '../../traceability/audits/entities/audit.entity';

const ENTITY_TYPE = 'Supplier';
const MODULE = 'master-data';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly suppliersRepo: Repository<Supplier>,
    private readonly auditsService: AuditsService,
  ) {}

  async create(dto: CreateSupplierDto, userId?: string, ip?: string): Promise<Supplier> {
    const existing = await this.suppliersRepo.findOne({
      where: { ruc: dto.ruc },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException('Supplier RUC already in use');
    }

    const supplier = this.suppliersRepo.create({
      ruc: dto.ruc,
      name: dto.name,
      contact: dto.contact || '',
      phone: dto.phone || '',
      email: dto.email || '',
      active: dto.active ?? true,
    });

    const saved = await this.suppliersRepo.save(supplier);
    await this.auditsService.create({ action: AuditAction.CREATE, entityType: ENTITY_TYPE, entityId: saved.id, userId, newValues: saved, module: MODULE, description: `Supplier creado`, ipAddress: ip });
    return saved;
  }

  async findAll(filter: FilterSupplierDto) {
    const { page = 1, limit = 20, search, active } = filter;

    const where: any = {};

    if (typeof active === 'boolean') {
      where.active = active;
    }

    if (search) {
      where.name = ILike(`%${search}%`);
    }

    const [data, total] = await this.suppliersRepo.findAndCount({
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

  async findOne(id: string): Promise<Supplier> {
    const supplier = await this.suppliersRepo.findOne({ where: { id } });

    if (!supplier) {
      throw new NotFoundException(`Supplier ${id} not found`);
    }

    return supplier;
  }

  async update(id: string, dto: UpdateSupplierDto, userId?: string, ip?: string): Promise<Supplier> {
    const supplier = await this.findOne(id);
    const oldValues = { ...supplier };

    if (dto.ruc && dto.ruc !== supplier.ruc) {
      const exists = await this.suppliersRepo.findOne({
        where: { ruc: dto.ruc },
      });

      if (exists) {
        throw new ConflictException('Supplier RUC already in use');
      }
    }

    Object.assign(supplier, dto);

    const updated = await this.suppliersRepo.save(supplier);
    await this.auditsService.create({ action: AuditAction.UPDATE, entityType: ENTITY_TYPE, entityId: id, userId, oldValues, newValues: updated, module: MODULE, description: `Supplier actualizado`, ipAddress: ip });
    return updated;
  }

  async remove(id: string, userId?: string, ip?: string): Promise<void> {
    const supplier = await this.findOne(id);
    await this.suppliersRepo.softDelete(supplier.id);
    await this.auditsService.create({ action: AuditAction.DELETE, entityType: ENTITY_TYPE, entityId: id, userId, oldValues: supplier, module: MODULE, description: `Supplier eliminado`, ipAddress: ip });
  }

  async toggleActive(id: string, active: boolean): Promise<Supplier> {
    const supplier = await this.findOne(id);
    supplier.active = active;
    return this.suppliersRepo.save(supplier);
  }
}
