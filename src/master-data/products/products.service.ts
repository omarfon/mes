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

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
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

    return this.productsRepo.save(product);
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
      order: { createdAt: 'DESC' },
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

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

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

    return this.productsRepo.save(product);
  }

  async toggleActive(id: string, isActive: boolean): Promise<Product> {
    const product = await this.findOne(id);
    product.isActive = isActive;
    return this.productsRepo.save(product);
  }

  async softDelete(id: string): Promise<void> {
    await this.productsRepo.softDelete(id);
  }
}
