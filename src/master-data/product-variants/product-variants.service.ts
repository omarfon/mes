import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { ProductVariant } from './entities/product-variant.entity';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { FilterProductVariantDto } from './dto/filter-product-variant.dto';

import { AuditsService } from '../../traceability/audits/audits.service';
import { AuditAction } from '../../traceability/audits/entities/audit.entity';

const ENTITY_TYPE = 'ProductVariant';
const MODULE = 'master-data';

@Injectable()
export class ProductVariantsService {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly variantsRepo: Repository<ProductVariant>,
    private readonly auditsService: AuditsService,
  ) {}

  async create(dto: CreateProductVariantDto, userId?: string, ip?: string): Promise<ProductVariant> {
    const existing = await this.variantsRepo.findOne({
      where: { sku: dto.sku.toUpperCase() },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException('SKU already in use');
    }

    const variant = this.variantsRepo.create({
      sku: dto.sku.toUpperCase(),
      productCode: dto.productCode.toUpperCase(),
      color: dto.color || '',
      size: dto.size || '',
      presentation: dto.presentation || '',
      barcode: dto.barcode || '',
      netWeight: dto.netWeight ?? null,
      weightUnit: dto.weightUnit || 'kg',
      active: dto.active ?? true,
    });

    const saved = await this.variantsRepo.save(variant);
    await this.auditsService.create({ action: AuditAction.CREATE, entityType: ENTITY_TYPE, entityId: saved.id, userId, newValues: saved, module: MODULE, description: `ProductVariant creado`, ipAddress: ip });
    return saved;
  }

  async findAll(filter: FilterProductVariantDto) {
    const { page = 1, limit = 20, search, productCode, active } = filter;

    const where: any = {};

    if (typeof active === 'boolean') {
      where.active = active;
    }

    if (productCode) {
      where.productCode = productCode.toUpperCase();
    }

    if (search) {
      where.sku = ILike(`%${search}%`);
    }

    const [data, total] = await this.variantsRepo.findAndCount({
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

  async findOne(id: string): Promise<ProductVariant> {
    const variant = await this.variantsRepo.findOne({ where: { id } });

    if (!variant) {
      throw new NotFoundException(`Product variant ${id} not found`);
    }

    return variant;
  }

  async update(id: string, dto: UpdateProductVariantDto, userId?: string, ip?: string): Promise<ProductVariant> {
    const variant = await this.findOne(id);
    const oldValues = { ...variant };

    if (dto.sku && dto.sku.toUpperCase() !== variant.sku) {
      const exists = await this.variantsRepo.findOne({
        where: { sku: dto.sku.toUpperCase() },
      });

      if (exists) {
        throw new ConflictException('SKU already in use');
      }
    }

    Object.assign(variant, {
      ...dto,
      sku: dto.sku ? dto.sku.toUpperCase() : variant.sku,
      productCode: dto.productCode ? dto.productCode.toUpperCase() : variant.productCode,
    });

    const updated = await this.variantsRepo.save(variant);
    await this.auditsService.create({ action: AuditAction.UPDATE, entityType: ENTITY_TYPE, entityId: id, userId, oldValues, newValues: updated, module: MODULE, description: `ProductVariant actualizado`, ipAddress: ip });
    return updated;
  }

  async remove(id: string, userId?: string, ip?: string): Promise<void> {
    const variant = await this.findOne(id);
    await this.variantsRepo.softDelete(variant.id);
    await this.auditsService.create({ action: AuditAction.DELETE, entityType: ENTITY_TYPE, entityId: id, userId, oldValues: variant, module: MODULE, description: `ProductVariant eliminado`, ipAddress: ip });
  }

  async toggleActive(id: string, active: boolean): Promise<ProductVariant> {
    const variant = await this.findOne(id);
    variant.active = active;
    return this.variantsRepo.save(variant);
  }
}
