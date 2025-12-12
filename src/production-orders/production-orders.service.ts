import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';

import { Route } from '../master-data/routes/entities/route.entity';
import { Product } from '../master-data/products/entities/product.entity';
import { RouteOperation } from '../master-data/routes/entities/route-operation.entity';
import { CreateProductionOrderDto } from './dto/create-production-order.dto';
import { FilterProductionOrdersDto } from './dto/filter-production-order.dto';
import { UpdateProductionOrderDto } from './dto/update-production-order.dto';
import { ProductionOrderOperation, ProductionOrderOperationStatus } from './entities/product-order-operation.entity';
import { ProductionOrder, ProductionOrderStatus } from './entities/production-order.entity';

@Injectable()
export class ProductionOrdersService {
  constructor(
    @InjectRepository(ProductionOrder)
    private readonly poRepo: Repository<ProductionOrder>,
    @InjectRepository(ProductionOrderOperation)
    private readonly poOpRepo: Repository<ProductionOrderOperation>,
    @InjectRepository(Route)
    private readonly routeRepo: Repository<Route>,
    @InjectRepository(RouteOperation)
    private readonly routeOpRepo: Repository<RouteOperation>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(dto: CreateProductionOrderDto): Promise<ProductionOrder> {
    // Validar código único
    const existing = await this.poRepo.findOne({
      where: { code: dto.code.toUpperCase() },
      withDeleted: true,
    });
    if (existing) {
      throw new ConflictException('Production order code already in use');
    }

    // Traer producto
    const product = await this.productRepo.findOne({
      where: { id: dto.productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Traer ruta con operaciones
    const route = await this.routeRepo.findOne({
      where: { id: dto.routeId },
      relations: ['operations'],
    });
    if (!route) {
      throw new NotFoundException('Route not found');
    }

    // Crear OP base
    const po = this.poRepo.create({
      code: dto.code.toUpperCase(),
      externalCode: dto.externalCode,
      productId: dto.productId,
      product,
      routeId: dto.routeId,
      route,
      quantityPlanned: dto.quantityPlanned,
      quantityProduced: 0,
      unitOfMeasure: product.unitOfMeasure,
      priority: dto.priority ?? undefined,
      mainWorkCenterId: dto.mainWorkCenterId,
      shiftId: dto.shiftId,
      plannedStartDate: dto.plannedStartDate
        ? new Date(dto.plannedStartDate)
        : null,
      plannedEndDate: dto.plannedEndDate
        ? new Date(dto.plannedEndDate)
        : null,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      status: ProductionOrderStatus.PLANNED,
      notes: dto.notes,
      operations: [], // rellenamos abajo
    });

    // Generar operaciones de OP a partir de la ruta
    const routeOperations = await this.routeOpRepo.find({
      where: { routeId: route.id },
      order: { sequence: 'ASC' },
    });

    po.operations = routeOperations.map((rop) =>
      this.poOpRepo.create({
        productionOrder: po,
        routeOperationId: rop.id,
        sequence: rop.sequence,
        name: rop.name,
        workCenterId: rop.workCenterId,
        machineId: rop.machineId,
        standardTimeMinutes: rop.standardTimeMinutes,
        status: ProductionOrderOperationStatus.PENDING,
      }),
    );

    return this.poRepo.save(po);
  }

  async findAll(filter: FilterProductionOrdersDto) {
    const {
      productId,
      routeId,
      mainWorkCenterId,
      status,
      priority,
      search,
      page = 1,
      limit = 20,
    } = filter;

    const where: any = {};

    if (productId) where.productId = productId;
    if (routeId) where.routeId = routeId;
    if (mainWorkCenterId) where.mainWorkCenterId = mainWorkCenterId;
    if (status) where.status = status;
    if (priority) where.priority = priority;

    if (search) {
      where.code = ILike(`%${search}%`);
      // si quieres también externalCode, luego lo hacemos con QueryBuilder
    }

    const [data, total] = await this.poRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['product', 'route', 'mainWorkCenter', 'shift'],
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<ProductionOrder> {
    const po = await this.poRepo.findOne({
      where: { id },
      relations: ['product', 'route', 'operations', 'mainWorkCenter', 'shift'],
    });

    if (!po) {
      throw new NotFoundException(`Production order ${id} not found`);
    }

    return po;
  }

  async update(
    id: string,
    dto: UpdateProductionOrderDto,
  ): Promise<ProductionOrder> {
    const po = await this.findOne(id);

    if (dto.code && dto.code.toUpperCase() !== po.code) {
      const exists = await this.poRepo.findOne({
        where: { code: dto.code.toUpperCase() },
      });
      if (exists) {
        throw new ConflictException('Production order code already in use');
      }
      po.code = dto.code.toUpperCase();
    }

    po.externalCode = dto.externalCode ?? po.externalCode;
    po.priority = dto.priority ?? po.priority;
    po.mainWorkCenterId = dto.mainWorkCenterId ?? po.mainWorkCenterId;
    po.shiftId = dto.shiftId ?? po.shiftId;
    po.notes = dto.notes ?? po.notes;

    if (dto.quantityPlanned !== undefined) {
      po.quantityPlanned = dto.quantityPlanned;
    }

    if (dto.plannedStartDate) {
      po.plannedStartDate = new Date(dto.plannedStartDate);
    }
    if (dto.plannedEndDate) {
      po.plannedEndDate = new Date(dto.plannedEndDate);
    }
    if (dto.dueDate) {
      po.dueDate = new Date(dto.dueDate);
    }

    if (dto.status) {
      // Aquí luego podrías meter reglas de negocio de transición de estado
      po.status = dto.status;
    }

    return this.poRepo.save(po);
  }

  async updateStatus(
    id: string,
    status: ProductionOrderStatus,
  ): Promise<ProductionOrder> {
    const po = await this.findOne(id);
    // TODO: reglas de transición
    po.status = status;

    if (status === ProductionOrderStatus.IN_PROGRESS && !po.actualStartDate) {
      po.actualStartDate = new Date();
    }

    if (status === ProductionOrderStatus.COMPLETED) {
      po.actualEndDate = new Date();
    }

    return this.poRepo.save(po);
  }

  async softDelete(id: string): Promise<void> {
    await this.poRepo.softDelete(id);
  }
}
