import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Product, ProductType } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductsDto } from './dto/filter-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { AuditsService } from '../../traceability/audits/audits.service';
import { AuditAction } from '../../traceability/audits/entities/audit.entity';

const ENTITY_TYPE = 'Product';
const MODULE = 'master-data';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
    private readonly auditsService: AuditsService,
  ) {}

  async create(dto: CreateProductDto, userId?: string, ip?: string): Promise<Product> {
    const existing = await this.productsRepo.findOne({
      where: { code: dto.code.toUpperCase() },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException('Product code already in use');
    }

    const product = this.productsRepo.create({
      code: dto.code.toUpperCase(),
      name: dto.name,
      description: dto.description,
      type: dto.type ?? ProductType.FINISHED,
      unitOfMeasure: dto.unitOfMeasure ?? 'UNID',
      family: dto.family,
      subfamily: dto.subfamily,
      erpCode: dto.erpCode,
    });

    const saved = await this.productsRepo.save(product);
    await this.auditsService.create({ action: AuditAction.CREATE, entityType: ENTITY_TYPE, entityId: saved.id, userId, newValues: saved, module: MODULE, description: `Product creado`, ipAddress: ip });
    return saved;
  }

  async findAll(filter: FilterProductsDto) {
    const {
      page = 1,
      limit = 20,
      search,
      type,
      isActive,
    } = filter;

    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    if (search) {
      // Podrías hacer una búsqueda más compleja con QueryBuilder
      where.code = ILike(`%${search}%`);
      // y luego extender para nombre si quieres
    }

    const [data, total] = await this.productsRepo.findAndCount({
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

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepo.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    return product;
  }

  async update(id: string, dto: UpdateProductDto, userId?: string, ip?: string): Promise<Product> {
    const product = await this.findOne(id);
    const oldValues = { ...product };

    if (dto.code && dto.code.toUpperCase() !== product.code) {
      const exists = await this.productsRepo.findOne({
        where: { code: dto.code.toUpperCase() },
      });
      if (exists) {
        throw new ConflictException('Product code already in use');
      }
    }

    Object.assign(product, {
      code: dto.code ? dto.code.toUpperCase() : product.code,
      name: dto.name ?? product.name,
      description: dto.description ?? product.description,
      type: dto.type ?? product.type,
      unitOfMeasure: dto.unitOfMeasure ?? product.unitOfMeasure,
      family: dto.family ?? product.family,
      subfamily: dto.subfamily ?? product.subfamily,
      erpCode: dto.erpCode ?? product.erpCode,
    });

    const updated = await this.productsRepo.save(product);
    await this.auditsService.create({ action: AuditAction.UPDATE, entityType: ENTITY_TYPE, entityId: id, userId, oldValues, newValues: updated, module: MODULE, description: `Product actualizado`, ipAddress: ip });
    return updated;
  }

  async toggleActive(id: string, isActive: boolean): Promise<Product> {
    const product = await this.findOne(id);
    product.isActive = isActive;
    return this.productsRepo.save(product);
  }

  async softDelete(id: string, userId?: string, ip?: string): Promise<void> {
    await this.productsRepo.softDelete(id);
    await this.auditsService.create({ action: AuditAction.DELETE, entityType: ENTITY_TYPE, entityId: id, userId, module: MODULE, description: `Product eliminado`, ipAddress: ip });
  }
}
