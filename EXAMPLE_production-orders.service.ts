/**
 * EJEMPLO DE INTEGRACIÓN: Production Orders Service
 * 
 * Este archivo muestra cómo integrar el motor de reglas
 * con el servicio de órdenes de producción.
 * 
 * PASOS PARA APLICAR:
 * 1. Importar RulesEngineModule en production-orders.module.ts
 * 2. Inyectar RulesEventService en el constructor
 * 3. Llamar a los métodos del evento en los lugares apropiados
 */

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

// ✅ NUEVO: Importar servicio de eventos del motor de reglas
import { RulesEventService } from '../rules-engine/services';

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
    
    // ✅ NUEVO: Inyectar servicio de eventos
    private readonly rulesEventService: RulesEventService,
  ) { }

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
      status: ProductionOrderStatus.PENDING,
    });

    // Crear operaciones de la OP según ruta
    if (route.operations && route.operations.length > 0) {
      const ops = route.operations.map((rop) => {
        return this.poOpRepo.create({
          productionOrder: po,
          operationId: rop.operationId,
          operation: rop.operation,
          sequence: rop.sequence,
          workCenterId: rop.workCenterId,
          setupTimeMinutes: rop.setupTimeMinutes,
          cycleTimeMinutes: rop.cycleTimeMinutes,
          quantityPlanned: dto.quantityPlanned,
          quantityCompleted: 0,
          status: ProductionOrderOperationStatus.PENDING,
        });
      });
      po.operations = ops;
    }

    const savedOrder = await this.poRepo.save(po);

    // ✅ NUEVO: Disparar evento ORDER_CREATED
    // Esto permitirá que las reglas se ejecuten automáticamente
    // Por ejemplo: verificar stock, validar máquinas, etc.
    await this.rulesEventService.onOrderCreated(
      {
        ...savedOrder,
        plantCode: savedOrder.product?.plantCode,
        productCode: savedOrder.product?.code,
      },
      dto.createdBy, // Si tienes el usuario en el DTO
    );

    return savedOrder;
  }

  async findAll(filters?: FilterProductionOrdersDto): Promise<ProductionOrder[]> {
    const qb = this.poRepo.createQueryBuilder('po');
    qb.leftJoinAndSelect('po.product', 'product');
    qb.leftJoinAndSelect('po.route', 'route');
    qb.leftJoinAndSelect('po.mainWorkCenter', 'wc');
    qb.leftJoinAndSelect('po.shift', 'shift');
    qb.leftJoinAndSelect('po.operations', 'operations');
    qb.leftJoinAndSelect('operations.operation', 'operation');
    qb.leftJoinAndSelect('operations.workCenter', 'opWc');

    if (filters?.code) {
      qb.andWhere('po.code ILIKE :code', { code: `%${filters.code}%` });
    }
    if (filters?.status) {
      qb.andWhere('po.status = :status', { status: filters.status });
    }
    if (filters?.productId) {
      qb.andWhere('po.productId = :productId', {
        productId: filters.productId,
      });
    }

    qb.orderBy('po.code', 'DESC');
    return qb.getMany();
  }

  async findOne(id: string): Promise<ProductionOrder> {
    const po = await this.poRepo.findOne({
      where: { id },
      relations: [
        'product',
        'route',
        'mainWorkCenter',
        'shift',
        'operations',
        'operations.operation',
        'operations.workCenter',
      ],
    });
    if (!po) {
      throw new NotFoundException(`ProductionOrder ${id} not found`);
    }
    return po;
  }

  async update(
    id: string,
    dto: UpdateProductionOrderDto,
  ): Promise<ProductionOrder> {
    const po = await this.findOne(id);

    if (dto.quantityPlanned !== undefined) {
      po.quantityPlanned = dto.quantityPlanned;
    }
    if (dto.plannedStartDate !== undefined) {
      po.plannedStartDate = dto.plannedStartDate
        ? new Date(dto.plannedStartDate)
        : null;
    }
    if (dto.plannedEndDate !== undefined) {
      po.plannedEndDate = dto.plannedEndDate
        ? new Date(dto.plannedEndDate)
        : null;
    }
    if (dto.dueDate !== undefined) {
      po.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
    }
    if (dto.priority !== undefined) {
      po.priority = dto.priority;
    }
    if (dto.mainWorkCenterId !== undefined) {
      po.mainWorkCenterId = dto.mainWorkCenterId;
    }
    if (dto.shiftId !== undefined) {
      po.shiftId = dto.shiftId;
    }

    return this.poRepo.save(po);
  }

  /**
   * ✅ MODIFICADO: Ahora dispara eventos del motor de reglas
   */
  async updateStatus(
    id: string,
    status: ProductionOrderStatus,
    userId?: string, // ✅ NUEVO: parámetro opcional para auditoría
  ): Promise<ProductionOrder> {
    const po = await this.findOne(id);
    const previousStatus = po.status;

    // TODO: reglas de transición
    po.status = status;

    if (status === ProductionOrderStatus.IN_PROGRESS && !po.actualStartDate) {
      po.actualStartDate = new Date();
    }

    if (status === ProductionOrderStatus.COMPLETED) {
      po.actualEndDate = new Date();
    }

    const updatedOrder = await this.poRepo.save(po);

    // ✅ NUEVO: Disparar eventos según el cambio de estado
    const orderData = {
      ...updatedOrder,
      plantCode: updatedOrder.product?.plantCode,
      productCode: updatedOrder.product?.code,
      areaCode: updatedOrder.mainWorkCenter?.areaCode,
      workCenterCode: updatedOrder.mainWorkCenter?.code,
    };

    // Evento cuando se inicia la orden
    if (status === ProductionOrderStatus.IN_PROGRESS && 
        previousStatus === ProductionOrderStatus.PENDING) {
      await this.rulesEventService.onOrderStarted(orderData, userId);
    }

    // Evento cuando se completa la orden
    // IMPORTANTE: Aquí se pueden ejecutar reglas como:
    // - "No permitir completar si hay inspecciones pendientes"
    // - "Requerir aprobación de calidad"
    // - "Validar cantidad producida vs planeada"
    if (status === ProductionOrderStatus.COMPLETED) {
      await this.rulesEventService.onOrderCompleted(orderData, userId);
    }

    return updatedOrder;
  }

  /**
   * ✅ NUEVO: Método para cancelar orden con evento
   */
  async cancel(
    id: string,
    reason: string,
    userId?: string,
  ): Promise<ProductionOrder> {
    const po = await this.findOne(id);

    po.status = ProductionOrderStatus.CANCELLED;
    // Nota: Agregar campos cancellationReason, cancelledAt, cancelledBy a la entidad
    
    const cancelled = await this.poRepo.save(po);

    // ✅ Disparar evento personalizado
    await this.rulesEventService.triggerCustomEvent(
      'ORDER_CANCELLED' as any, // Agregar a RuleEventType si se usa frecuentemente
      {
        entityType: 'order',
        entityId: cancelled.id,
        entityData: {
          ...cancelled,
          cancellationReason: reason,
          plantCode: cancelled.product?.plantCode,
          productCode: cancelled.product?.code,
        },
        userId,
      },
    );

    return cancelled;
  }

  async softDelete(id: string): Promise<void> {
    await this.poRepo.softDelete(id);
  }
}
