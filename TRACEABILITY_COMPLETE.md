# 🔍 Trazabilidad - Implementación Completa

## 📋 Resumen

Este documento contiene la implementación completa del módulo de **Trazabilidad** para el MES, incluyendo seguimiento de lotes, movimientos, genealogía, seriales, cuarentena, ubicaciones, etiquetas y auditoría.

---

## 🏗️ Arquitectura del Sistema

```
Traceability Module
├── Lots (Lotes)
├── Lot Movements (Movimientos)
├── Genealogy (Genealogía/Árbol)
├── Serials/Units (Seriales/Unidades)
├── Quarantine/Blocks (Cuarentena/Bloqueos)
├── Locations/Map (Ubicaciones/Mapa)
├── Advanced Search (Búsqueda avanzada)
├── Labels/Printing (Etiquetas/Impresión)
└── Audit/Events (Auditoría/Eventos)
```

---

## 1️⃣ Lots Module (Lotes)

### Entity: `lot.entity.ts`

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum LotStatus {
  CREATED = 'CREATED',
  IN_PRODUCTION = 'IN_PRODUCTION',
  COMPLETED = 'COMPLETED',
  IN_QUARANTINE = 'IN_QUARANTINE',
  RELEASED = 'RELEASED',
  BLOCKED = 'BLOCKED',
  SCRAPPED = 'SCRAPPED',
  SHIPPED = 'SHIPPED',
}

@Entity('lots')
@Index(['lotNumber'], { unique: true })
@Index(['productId', 'status'])
export class Lot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'lot_number', length: 100, unique: true })
  lotNumber: string;

  @Column({ name: 'internal_code', length: 100, nullable: true })
  internalCode: string;

  @Column({ name: 'external_code', length: 100, nullable: true })
  externalCode: string; // Cliente/proveedor code

  @Column({ type: 'uuid', name: 'product_id' })
  productId: string;

  @Column({ name: 'product_code', length: 100 })
  productCode: string;

  @Column({ name: 'product_name', length: 200 })
  productName: string;

  @Column({
    type: 'enum',
    enum: LotStatus,
    default: LotStatus.CREATED,
  })
  status: LotStatus;

  @Column({ name: 'quantity_initial', type: 'decimal', precision: 15, scale: 4 })
  quantityInitial: number;

  @Column({ name: 'quantity_current', type: 'decimal', precision: 15, scale: 4 })
  quantityCurrent: number;

  @Column({ name: 'quantity_reserved', type: 'decimal', precision: 15, scale: 4, default: 0 })
  quantityReserved: number;

  @Column({ name: 'quantity_blocked', type: 'decimal', precision: 15, scale: 4, default: 0 })
  quantityBlocked: number;

  @Column({ length: 20, nullable: true })
  unit: string;

  @Column({ name: 'parent_lot_id', type: 'uuid', nullable: true })
  parentLotId: string;

  @Column({ name: 'parent_lot_number', length: 100, nullable: true })
  parentLotNumber: string;

  @Column({ name: 'work_order_id', type: 'uuid', nullable: true })
  workOrderId: string;

  @Column({ name: 'work_order_code', length: 100, nullable: true })
  workOrderCode: string;

  @Column({ name: 'location_id', type: 'uuid', nullable: true })
  locationId: string;

  @Column({ name: 'location_code', length: 100, nullable: true })
  locationCode: string;

  @Column({ name: 'location_name', length: 200, nullable: true })
  locationName: string;

  @Column({ name: 'supplier_id', type: 'uuid', nullable: true })
  supplierId: string;

  @Column({ name: 'supplier_name', length: 200, nullable: true })
  supplierName: string;

  @Column({ name: 'supplier_lot', length: 100, nullable: true })
  supplierLot: string;

  @Column({ name: 'manufacture_date', type: 'date', nullable: true })
  manufactureDate: Date;

  @Column({ name: 'expiry_date', type: 'date', nullable: true })
  expiryDate: Date;

  @Column({ name: 'receipt_date', type: 'date', nullable: true })
  receiptDate: Date;

  @Column({ name: 'is_blocked', type: 'boolean', default: false })
  isBlocked: boolean;

  @Column({ name: 'block_reason', length: 500, nullable: true })
  blockReason: string;

  @Column({ name: 'is_in_quarantine', type: 'boolean', default: false })
  isInQuarantine: boolean;

  @Column({ name: 'quarantine_reason', length: 500, nullable: true })
  quarantineReason: string;

  @Column({ name: 'quality_status', length: 50, nullable: true })
  qualityStatus: string; // PENDING, APPROVED, REJECTED

  @Column({ name: 'quality_inspector_id', type: 'uuid', nullable: true })
  qualityInspectorId: string;

  @Column({ name: 'quality_inspection_date', type: 'timestamp', nullable: true })
  qualityInspectionDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'jsonb', nullable: true })
  attributes: any; // Atributos personalizados

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'created_by_id', type: 'uuid', nullable: true })
  createdById: string;

  @Column({ name: 'created_by_name', length: 200, nullable: true })
  createdByName: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### DTOs

```typescript
// create-lot.dto.ts
import { IsDateString, IsDecimal, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { LotStatus } from '../entities/lot.entity';

export class CreateLotDto {
  @IsString()
  @IsNotEmpty()
  lotNumber: string;

  @IsString()
  @IsOptional()
  internalCode?: string;

  @IsString()
  @IsOptional()
  externalCode?: string;

  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  productCode: string;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsEnum(LotStatus)
  @IsOptional()
  status?: LotStatus;

  @IsNumber()
  @IsNotEmpty()
  quantityInitial: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsUUID()
  @IsOptional()
  parentLotId?: string;

  @IsUUID()
  @IsOptional()
  workOrderId?: string;

  @IsUUID()
  @IsOptional()
  locationId?: string;

  @IsUUID()
  @IsOptional()
  supplierId?: string;

  @IsString()
  @IsOptional()
  supplierLot?: string;

  @IsDateString()
  @IsOptional()
  manufactureDate?: string;

  @IsDateString()
  @IsOptional()
  expiryDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsOptional()
  attributes?: any;

  @IsOptional()
  metadata?: any;
}

// update-lot-status.dto.ts
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LotStatus } from '../entities/lot.entity';

export class UpdateLotStatusDto {
  @IsEnum(LotStatus)
  @IsNotEmpty()
  status: LotStatus;

  @IsString()
  @IsOptional()
  reason?: string;
}

// block-lot.dto.ts
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class BlockLotDto {
  @IsBoolean()
  @IsNotEmpty()
  isBlocked: boolean;

  @IsString()
  @IsNotEmpty()
  reason: string;
}

// quarantine-lot.dto.ts
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class QuarantineLotDto {
  @IsBoolean()
  @IsNotEmpty()
  isInQuarantine: boolean;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
```

### Service: `lots.service.ts`

```typescript
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Lot, LotStatus } from './entities/lot.entity';
import { CreateLotDto } from './dto/create-lot.dto';
import { UpdateLotDto } from './dto/update-lot.dto';
import { UpdateLotStatusDto } from './dto/update-lot-status.dto';
import { BlockLotDto } from './dto/block-lot.dto';
import { QuarantineLotDto } from './dto/quarantine-lot.dto';

@Injectable()
export class LotsService {
  constructor(
    @InjectRepository(Lot)
    private readonly lotRepository: Repository<Lot>,
  ) {}

  async create(createDto: CreateLotDto): Promise<Lot> {
    // Check if lot number already exists
    const existing = await this.lotRepository.findOne({
      where: { lotNumber: createDto.lotNumber },
    });

    if (existing) {
      throw new BadRequestException(`Lot number ${createDto.lotNumber} already exists`);
    }

    const lot = this.lotRepository.create({
      ...createDto,
      quantityCurrent: createDto.quantityInitial,
      status: createDto.status || LotStatus.CREATED,
    });

    return await this.lotRepository.save(lot);
  }

  async findAll(filters?: any): Promise<Lot[]> {
    const where: any = {};

    if (filters?.productId) where.productId = filters.productId;
    if (filters?.status) where.status = filters.status;
    if (filters?.locationId) where.locationId = filters.locationId;
    if (filters?.isBlocked !== undefined) where.isBlocked = filters.isBlocked;
    if (filters?.isInQuarantine !== undefined) where.isInQuarantine = filters.isInQuarantine;

    if (filters?.search) {
      return await this.lotRepository.find({
        where: [
          { lotNumber: Like(`%${filters.search}%`) },
          { internalCode: Like(`%${filters.search}%`) },
          { externalCode: Like(`%${filters.search}%`) },
          { productCode: Like(`%${filters.search}%`) },
        ],
        order: { createdAt: 'DESC' },
      });
    }

    return await this.lotRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Lot> {
    const lot = await this.lotRepository.findOne({ where: { id } });

    if (!lot) {
      throw new NotFoundException(`Lot with ID ${id} not found`);
    }

    return lot;
  }

  async findByLotNumber(lotNumber: string): Promise<Lot> {
    const lot = await this.lotRepository.findOne({ where: { lotNumber } });

    if (!lot) {
      throw new NotFoundException(`Lot ${lotNumber} not found`);
    }

    return lot;
  }

  async update(id: string, updateDto: UpdateLotDto): Promise<Lot> {
    const lot = await this.findOne(id);

    Object.assign(lot, updateDto);

    return await this.lotRepository.save(lot);
  }

  async updateStatus(id: string, statusDto: UpdateLotStatusDto): Promise<Lot> {
    const lot = await this.findOne(id);

    lot.status = statusDto.status;

    if (statusDto.reason && lot.metadata) {
      lot.metadata = {
        ...lot.metadata,
        statusChangeReason: statusDto.reason,
        statusChangedAt: new Date(),
      };
    }

    return await this.lotRepository.save(lot);
  }

  async block(id: string, blockDto: BlockLotDto): Promise<Lot> {
    const lot = await this.findOne(id);

    lot.isBlocked = blockDto.isBlocked;
    lot.blockReason = blockDto.reason;

    if (blockDto.isBlocked) {
      lot.quantityBlocked = lot.quantityCurrent - lot.quantityReserved;
    } else {
      lot.quantityBlocked = 0;
    }

    return await this.lotRepository.save(lot);
  }

  async quarantine(id: string, quarantineDto: QuarantineLotDto): Promise<Lot> {
    const lot = await this.findOne(id);

    lot.isInQuarantine = quarantineDto.isInQuarantine;
    lot.quarantineReason = quarantineDto.reason;

    if (quarantineDto.isInQuarantine) {
      lot.status = LotStatus.IN_QUARANTINE;
    }

    return await this.lotRepository.save(lot);
  }

  async updateQuantity(id: string, quantity: number): Promise<Lot> {
    const lot = await this.findOne(id);

    lot.quantityCurrent = quantity;

    if (lot.quantityCurrent < 0) {
      throw new BadRequestException('Quantity cannot be negative');
    }

    return await this.lotRepository.save(lot);
  }

  async remove(id: string): Promise<void> {
    const lot = await this.findOne(id);
    await this.lotRepository.remove(lot);
  }
}
```

---

## 2️⃣ Lot Movements Module (Movimientos)

### Entity: `lot-movement.entity.ts`

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum MovementType {
  RECEIPT = 'RECEIPT',
  PRODUCTION = 'PRODUCTION',
  CONSUMPTION = 'CONSUMPTION',
  TRANSFER = 'TRANSFER',
  ADJUSTMENT = 'ADJUSTMENT',
  SCRAP = 'SCRAP',
  RETURN = 'RETURN',
  SHIPMENT = 'SHIPMENT',
  SPLIT = 'SPLIT',
  MERGE = 'MERGE',
}

@Entity('lot_movements')
@Index(['lotId', 'movementDate'])
@Index(['fromLocationId'])
@Index(['toLocationId'])
export class LotMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'lot_id' })
  lotId: string;

  @Column({ name: 'lot_number', length: 100 })
  lotNumber: string;

  @Column({
    type: 'enum',
    enum: MovementType,
  })
  type: MovementType;

  @Column({ type: 'decimal', precision: 15, scale: 4 })
  quantity: number;

  @Column({ length: 20, nullable: true })
  unit: string;

  @Column({ name: 'from_location_id', type: 'uuid', nullable: true })
  fromLocationId: string;

  @Column({ name: 'from_location_code', length: 100, nullable: true })
  fromLocationCode: string;

  @Column({ name: 'to_location_id', type: 'uuid', nullable: true })
  toLocationId: string;

  @Column({ name: 'to_location_code', length: 100, nullable: true })
  toLocationCode: string;

  @Column({ name: 'work_order_id', type: 'uuid', nullable: true })
  workOrderId: string;

  @Column({ name: 'work_order_code', length: 100, nullable: true })
  workOrderCode: string;

  @Column({ name: 'related_lot_id', type: 'uuid', nullable: true })
  relatedLotId: string; // For split/merge/consumption

  @Column({ name: 'related_lot_number', length: 100, nullable: true })
  relatedLotNumber: string;

  @Column({ name: 'movement_date', type: 'timestamp' })
  movementDate: Date;

  @Column({ name: 'reference_document', length: 200, nullable: true })
  referenceDocument: string;

  @Column({ length: 500, nullable: true })
  reason: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'performed_by_id', type: 'uuid', nullable: true })
  performedById: string;

  @Column({ name: 'performed_by_name', length: 200, nullable: true })
  performedByName: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
```

### DTOs

```typescript
// create-lot-movement.dto.ts
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { MovementType } from '../entities/lot-movement.entity';

export class CreateLotMovementDto {
  @IsUUID()
  @IsNotEmpty()
  lotId: string;

  @IsString()
  @IsNotEmpty()
  lotNumber: string;

  @IsEnum(MovementType)
  @IsNotEmpty()
  type: MovementType;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsUUID()
  @IsOptional()
  fromLocationId?: string;

  @IsUUID()
  @IsOptional()
  toLocationId?: string;

  @IsUUID()
  @IsOptional()
  workOrderId?: string;

  @IsUUID()
  @IsOptional()
  relatedLotId?: string;

  @IsDateString()
  @IsOptional()
  movementDate?: string;

  @IsString()
  @IsOptional()
  referenceDocument?: string;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsUUID()
  @IsOptional()
  performedById?: string;

  @IsString()
  @IsOptional()
  performedByName?: string;

  @IsOptional()
  metadata?: any;
}
```

### Service: `lot-movements.service.ts`

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { LotMovement, MovementType } from './entities/lot-movement.entity';
import { CreateLotMovementDto } from './dto/create-lot-movement.dto';

@Injectable()
export class LotMovementsService {
  constructor(
    @InjectRepository(LotMovement)
    private readonly movementRepository: Repository<LotMovement>,
  ) {}

  async create(createDto: CreateLotMovementDto): Promise<LotMovement> {
    const movement = this.movementRepository.create({
      ...createDto,
      movementDate: createDto.movementDate ? new Date(createDto.movementDate) : new Date(),
    });

    return await this.movementRepository.save(movement);
  }

  async findByLotId(lotId: string): Promise<LotMovement[]> {
    return await this.movementRepository.find({
      where: { lotId },
      order: { movementDate: 'DESC' },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<LotMovement[]> {
    return await this.movementRepository.find({
      where: {
        movementDate: Between(startDate, endDate),
      },
      order: { movementDate: 'DESC' },
    });
  }

  async findByLocation(locationId: string): Promise<LotMovement[]> {
    return await this.movementRepository.find({
      where: [
        { fromLocationId: locationId },
        { toLocationId: locationId },
      ],
      order: { movementDate: 'DESC' },
    });
  }

  async findByType(type: MovementType): Promise<LotMovement[]> {
    return await this.movementRepository.find({
      where: { type },
      order: { movementDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<LotMovement> {
    const movement = await this.movementRepository.findOne({ where: { id } });

    if (!movement) {
      throw new NotFoundException(`Movement with ID ${id} not found`);
    }

    return movement;
  }
}
```

---

## 3️⃣ Genealogy Module (Genealogía)

### Entity: `genealogy.entity.ts`

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum RelationType {
  PARENT = 'PARENT',          // Padre directo
  CHILD = 'CHILD',            // Hijo directo
  COMPONENT = 'COMPONENT',    // Componente usado
  CONSUMED = 'CONSUMED',      // Material consumido
  PRODUCED = 'PRODUCED',      // Producto generado
  SIBLING = 'SIBLING',        // Hermano (mismo padre)
}

@Entity('genealogy')
@Index(['sourceLotId', 'targetLotId'])
@Index(['sourceLotNumber'])
@Index(['targetLotNumber'])
export class Genealogy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'source_lot_id' })
  sourceLotId: string;

  @Column({ name: 'source_lot_number', length: 100 })
  sourceLotNumber: string;

  @Column({ type: 'uuid', name: 'target_lot_id' })
  targetLotId: string;

  @Column({ name: 'target_lot_number', length: 100 })
  targetLotNumber: string;

  @Column({
    type: 'enum',
    enum: RelationType,
  })
  relationType: RelationType;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  quantity: number;

  @Column({ length: 20, nullable: true })
  unit: string;

  @Column({ name: 'work_order_id', type: 'uuid', nullable: true })
  workOrderId: string;

  @Column({ name: 'work_order_code', length: 100, nullable: true })
  workOrderCode: string;

  @Column({ name: 'operation_id', type: 'uuid', nullable: true })
  operationId: string;

  @Column({ name: 'operation_name', length: 200, nullable: true })
  operationName: string;

  @Column({ name: 'relation_date', type: 'timestamp' })
  relationDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'created_by_id', type: 'uuid', nullable: true })
  createdById: string;

  @Column({ name: 'created_by_name', length: 200, nullable: true })
  createdByName: string;
}
```

### Service: `genealogy.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genealogy, RelationType } from './entities/genealogy.entity';

@Injectable()
export class GenealogyService {
  constructor(
    @InjectRepository(Genealogy)
    private readonly genealogyRepository: Repository<Genealogy>,
  ) {}

  async createRelation(
    sourceLotId: string,
    sourceLotNumber: string,
    targetLotId: string,
    targetLotNumber: string,
    relationType: RelationType,
    quantity?: number,
    workOrderId?: string,
  ): Promise<Genealogy> {
    const genealogy = this.genealogyRepository.create({
      sourceLotId,
      sourceLotNumber,
      targetLotId,
      targetLotNumber,
      relationType,
      quantity,
      workOrderId,
      relationDate: new Date(),
    });

    return await this.genealogyRepository.save(genealogy);
  }

  async getParents(lotId: string): Promise<Genealogy[]> {
    return await this.genealogyRepository.find({
      where: {
        targetLotId: lotId,
        relationType: RelationType.PARENT,
      },
    });
  }

  async getChildren(lotId: string): Promise<Genealogy[]> {
    return await this.genealogyRepository.find({
      where: {
        sourceLotId: lotId,
        relationType: RelationType.CHILD,
      },
    });
  }

  async getComponents(lotId: string): Promise<Genealogy[]> {
    return await this.genealogyRepository.find({
      where: {
        targetLotId: lotId,
        relationType: RelationType.COMPONENT,
      },
    });
  }

  async getConsumption(lotId: string): Promise<Genealogy[]> {
    return await this.genealogyRepository.find({
      where: {
        sourceLotId: lotId,
        relationType: RelationType.CONSUMED,
      },
    });
  }

  async getFullTree(lotId: string, maxDepth: number = 10): Promise<any> {
    // Recursive tree building
    const buildTree = async (currentLotId: string, depth: number = 0): Promise<any> => {
      if (depth >= maxDepth) return null;

      const parents = await this.getParents(currentLotId);
      const children = await this.getChildren(currentLotId);
      const components = await this.getComponents(currentLotId);

      return {
        lotId: currentLotId,
        depth,
        parents: await Promise.all(
          parents.map(async (p) => ({
            ...p,
            tree: await buildTree(p.sourceLotId, depth + 1),
          })),
        ),
        children: await Promise.all(
          children.map(async (c) => ({
            ...c,
            tree: await buildTree(c.targetLotId, depth + 1),
          })),
        ),
        components: components,
      };
    };

    return await buildTree(lotId);
  }

  async traceUpstream(lotId: string): Promise<Genealogy[]> {
    // Get all parents recursively (where did materials come from?)
    const upstream: Genealogy[] = [];
    const visited = new Set<string>();

    const traverse = async (currentLotId: string) => {
      if (visited.has(currentLotId)) return;
      visited.add(currentLotId);

      const parents = await this.genealogyRepository.find({
        where: [
          { targetLotId: currentLotId, relationType: RelationType.PARENT },
          { targetLotId: currentLotId, relationType: RelationType.COMPONENT },
          { targetLotId: currentLotId, relationType: RelationType.CONSUMED },
        ],
      });

      for (const parent of parents) {
        upstream.push(parent);
        await traverse(parent.sourceLotId);
      }
    };

    await traverse(lotId);
    return upstream;
  }

  async traceDownstream(lotId: string): Promise<Genealogy[]> {
    // Get all children recursively (where did this material go?)
    const downstream: Genealogy[] = [];
    const visited = new Set<string>();

    const traverse = async (currentLotId: string) => {
      if (visited.has(currentLotId)) return;
      visited.add(currentLotId);

      const children = await this.genealogyRepository.find({
        where: [
          { sourceLotId: currentLotId, relationType: RelationType.CHILD },
          { sourceLotId: currentLotId, relationType: RelationType.PRODUCED },
        ],
      });

      for (const child of children) {
        downstream.push(child);
        await traverse(child.targetLotId);
      }
    };

    await traverse(lotId);
    return downstream;
  }
}
```

---

## 4️⃣ Serials/Units Module

### Entity: `serial-unit.entity.ts`

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum SerialStatus {
  CREATED = 'CREATED',
  IN_PRODUCTION = 'IN_PRODUCTION',
  COMPLETED = 'COMPLETED',
  SHIPPED = 'SHIPPED',
  IN_SERVICE = 'IN_SERVICE',
  RETURNED = 'RETURNED',
  SCRAPPED = 'SCRAPPED',
}

@Entity('serial_units')
@Index(['serialNumber'], { unique: true })
@Index(['lotId'])
export class SerialUnit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'serial_number', length: 100, unique: true })
  serialNumber: string;

  @Column({ type: 'uuid', name: 'lot_id' })
  lotId: string;

  @Column({ name: 'lot_number', length: 100 })
  lotNumber: string;

  @Column({ type: 'uuid', name: 'product_id' })
  productId: string;

  @Column({ name: 'product_code', length: 100 })
  productCode: string;

  @Column({
    type: 'enum',
    enum: SerialStatus,
    default: SerialStatus.CREATED,
  })
  status: SerialStatus;

  @Column({ name: 'mac_address', length: 100, nullable: true })
  macAddress: string;

  @Column({ name: 'imei', length: 100, nullable: true })
  imei: string;

  @Column({ name: 'firmware_version', length: 50, nullable: true })
  firmwareVersion: string;

  @Column({ name: 'hardware_revision', length: 50, nullable: true })
  hardwareRevision: string;

  @Column({ name: 'location_id', type: 'uuid', nullable: true })
  locationId: string;

  @Column({ name: 'customer_id', type: 'uuid', nullable: true })
  customerId: string;

  @Column({ name: 'customer_name', length: 200, nullable: true })
  customerName: string;

  @Column({ name: 'manufacture_date', type: 'date', nullable: true })
  manufactureDate: Date;

  @Column({ name: 'shipment_date', type: 'date', nullable: true })
  shipmentDate: Date;

  @Column({ name: 'warranty_expiry_date', type: 'date', nullable: true })
  warrantyExpiryDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  attributes: any;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

---

## 5️⃣ Locations Module

### Entity: `location.entity.ts`

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum LocationType {
  WAREHOUSE = 'WAREHOUSE',
  PRODUCTION_AREA = 'PRODUCTION_AREA',
  QUARANTINE = 'QUARANTINE',
  SCRAP = 'SCRAP',
  SHIPPING = 'SHIPPING',
  RECEIVING = 'RECEIVING',
  STORAGE = 'STORAGE',
  STAGING = 'STAGING',
}

@Entity('locations')
@Index(['locationCode'], { unique: true })
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'location_code', length: 100, unique: true })
  locationCode: string;

  @Column({ name: 'location_name', length: 200 })
  locationName: string;

  @Column({
    type: 'enum',
    enum: LocationType,
  })
  type: LocationType;

  @Column({ name: 'parent_location_id', type: 'uuid', nullable: true })
  parentLocationId: string;

  @Column({ name: 'parent_location_code', length: 100, nullable: true })
  parentLocationCode: string;

  @Column({ name: 'warehouse_id', type: 'uuid', nullable: true })
  warehouseId: string;

  @Column({ name: 'warehouse_code', length: 100, nullable: true })
  warehouseCode: string;

  @Column({ length: 200, nullable: true })
  aisle: string;

  @Column({ length: 200, nullable: true })
  rack: string;

  @Column({ length: 200, nullable: true })
  shelf: string;

  @Column({ length: 200, nullable: true })
  bin: string;

  @Column({ name: 'capacity_quantity', type: 'decimal', precision: 15, scale: 4, nullable: true })
  capacityQuantity: number;

  @Column({ name: 'capacity_unit', length: 20, nullable: true })
  capacityUnit: string;

  @Column({ name: 'current_quantity', type: 'decimal', precision: 15, scale: 4, default: 0 })
  currentQuantity: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'is_blocked', type: 'boolean', default: false })
  isBlocked: boolean;

  @Column({ name: 'coordinates_x', type: 'decimal', precision: 10, scale: 2, nullable: true })
  coordinatesX: number;

  @Column({ name: 'coordinates_y', type: 'decimal', precision: 10, scale: 2, nullable: true })
  coordinatesY: number;

  @Column({ name: 'coordinates_z', type: 'decimal', precision: 10, scale: 2, nullable: true })
  coordinatesZ: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

---

## 6️⃣ Labels Module (Etiquetas/Impresión)

### Entity: `label-template.entity.ts`

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum LabelFormat {
  ZPL = 'ZPL',           // Zebra
  EPL = 'EPL',           // Eltron
  PDF = 'PDF',
  HTML = 'HTML',
}

@Entity('label_templates')
export class LabelTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'template_code', length: 100, unique: true })
  templateCode: string;

  @Column({ name: 'template_name', length: 200 })
  templateName: string;

  @Column({
    type: 'enum',
    enum: LabelFormat,
  })
  format: LabelFormat;

  @Column({ name: 'label_type', length: 50 })
  labelType: string; // LOT, SERIAL, SHIPPING, etc.

  @Column({ name: 'width_mm', type: 'int' })
  widthMm: number;

  @Column({ name: 'height_mm', type: 'int' })
  heightMm: number;

  @Column({ type: 'text' })
  template: string; // ZPL/EPL/HTML template

  @Column({ type: 'jsonb', nullable: true })
  fields: any; // Required fields

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### Entity: `label-print-history.entity.ts`

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('label_print_history')
export class LabelPrintHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'template_id' })
  templateId: string;

  @Column({ name: 'template_code', length: 100 })
  templateCode: string;

  @Column({ name: 'entity_type', length: 50 })
  entityType: string; // LOT, SERIAL, etc.

  @Column({ type: 'uuid', name: 'entity_id' })
  entityId: string;

  @Column({ name: 'entity_code', length: 100 })
  entityCode: string;

  @Column({ name: 'copies', type: 'int', default: 1 })
  copies: number;

  @Column({ name: 'printer_name', length: 200, nullable: true })
  printerName: string;

  @Column({ type: 'jsonb', nullable: true })
  data: any; // Data sent to printer

  @Column({ name: 'printed_by_id', type: 'uuid', nullable: true })
  printedById: string;

  @Column({ name: 'printed_by_name', length: 200, nullable: true })
  printedByName: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
```

---

## 7️⃣ Traceability Events Module (Auditoría)

### Entity: `traceability-event.entity.ts`

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum EventType {
  LOT_CREATED = 'LOT_CREATED',
  LOT_UPDATED = 'LOT_UPDATED',
  LOT_BLOCKED = 'LOT_BLOCKED',
  LOT_UNBLOCKED = 'LOT_UNBLOCKED',
  LOT_QUARANTINED = 'LOT_QUARANTINED',
  LOT_RELEASED = 'LOT_RELEASED',
  QUANTITY_ADJUSTED = 'QUANTITY_ADJUSTED',
  MOVEMENT_CREATED = 'MOVEMENT_CREATED',
  LOCATION_CHANGED = 'LOCATION_CHANGED',
  STATUS_CHANGED = 'STATUS_CHANGED',
  GENEALOGY_LINKED = 'GENEALOGY_LINKED',
  SERIAL_CREATED = 'SERIAL_CREATED',
  LABEL_PRINTED = 'LABEL_PRINTED',
}

@Entity('traceability_events')
@Index(['lotId', 'eventDate'])
@Index(['eventType'])
export class TraceabilityEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: EventType,
  })
  eventType: EventType;

  @Column({ name: 'entity_type', length: 50 })
  entityType: string; // LOT, SERIAL, MOVEMENT, etc.

  @Column({ type: 'uuid', name: 'entity_id' })
  entityId: string;

  @Column({ name: 'entity_code', length: 100 })
  entityCode: string;

  @Column({ type: 'uuid', name: 'lot_id', nullable: true })
  lotId: string;

  @Column({ name: 'lot_number', length: 100, nullable: true })
  lotNumber: string;

  @Column({ name: 'event_date', type: 'timestamp' })
  eventDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  oldValues: any;

  @Column({ type: 'jsonb', nullable: true })
  newValues: any;

  @Column({ length: 500, nullable: true })
  description: string;

  @Column({ name: 'performed_by_id', type: 'uuid', nullable: true })
  performedById: string;

  @Column({ name: 'performed_by_name', length: 200, nullable: true })
  performedByName: string;

  @Column({ name: 'ip_address', length: 50, nullable: true })
  ipAddress: string;

  @Column({ name: 'user_agent', length: 500, nullable: true })
  userAgent: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
```

---

## 8️⃣ Main Traceability Module (Agregador)

### Service: `traceability.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { LotsService } from '../lots/lots.service';
import { LotMovementsService } from '../lot-movements/lot-movements.service';
import { GenealogyService } from '../genealogy/genealogy.service';
import { SerialUnitsService } from '../serial-units/serial-units.service';
import { LocationsService } from '../locations/locations.service';

@Injectable()
export class TraceabilityService {
  constructor(
    private readonly lotsService: LotsService,
    private readonly movementsService: LotMovementsService,
    private readonly genealogyService: GenealogyService,
    private readonly serialsService: SerialUnitsService,
    private readonly locationsService: LocationsService,
  ) {}

  async getCompleteTraceability(lotId: string): Promise<any> {
    // Get lot details
    const lot = await this.lotsService.findOne(lotId);

    // Get all movements
    const movements = await this.movementsService.findByLotId(lotId);

    // Get genealogy (upstream and downstream)
    const upstream = await this.genealogyService.traceUpstream(lotId);
    const downstream = await this.genealogyService.traceDownstream(lotId);
    const fullTree = await this.genealogyService.getFullTree(lotId);

    // Get serials if applicable
    const serials = await this.serialsService.findByLotId(lotId);

    // Get current location details
    let location = null;
    if (lot.locationId) {
      location = await this.locationsService.findOne(lot.locationId);
    }

    return {
      lot,
      movements,
      genealogy: {
        upstream,
        downstream,
        fullTree,
      },
      serials,
      location,
    };
  }

  async advancedSearch(filters: any): Promise<any[]> {
    const results = await this.lotsService.findAll(filters);

    // Enrich with additional data
    const enriched = await Promise.all(
      results.map(async (lot) => {
        const movements = await this.movementsService.findByLotId(lot.id);
        const serialCount = await this.serialsService.countByLotId(lot.id);

        return {
          ...lot,
          movementCount: movements.length,
          serialCount,
          lastMovement: movements[0] || null,
        };
      }),
    );

    return enriched;
  }

  async traceBySerial(serialNumber: string): Promise<any> {
    const serial = await this.serialsService.findBySerialNumber(serialNumber);
    return await this.getCompleteTraceability(serial.lotId);
  }
}
```

### Controller: `traceability.controller.ts`

```typescript
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TraceabilityService } from './traceability.service';

@ApiTags('Traceability')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('traceability')
export class TraceabilityController {
  constructor(private readonly traceabilityService: TraceabilityService) {}

  @Get('lot/:lotId/complete')
  getCompleteTraceability(@Param('lotId') lotId: string) {
    return this.traceabilityService.getCompleteTraceability(lotId);
  }

  @Get('serial/:serialNumber')
  traceBySerial(@Param('serialNumber') serialNumber: string) {
    return this.traceabilityService.traceBySerial(serialNumber);
  }

  @Get('search')
  advancedSearch(@Query() filters: any) {
    return this.traceabilityService.advancedSearch(filters);
  }
}
```

---

## 📡 API Endpoints Summary

### Lots
- `POST /lots` - Crear lote
- `GET /lots` - Listar lotes (con filtros)
- `GET /lots/:id` - Obtener lote
- `GET /lots/number/:lotNumber` - Buscar por número
- `PATCH /lots/:id` - Actualizar lote
- `PATCH /lots/:id/status` - Cambiar estado
- `PATCH /lots/:id/block` - Bloquear/desbloquear
- `PATCH /lots/:id/quarantine` - Cuarentena
- `PATCH /lots/:id/quantity` - Ajustar cantidad
- `DELETE /lots/:id` - Eliminar

### Movements
- `POST /lot-movements` - Crear movimiento
- `GET /lot-movements/lot/:lotId` - Movimientos de un lote
- `GET /lot-movements/location/:locationId` - Movimientos de ubicación
- `GET /lot-movements/date-range?start=X&end=Y` - Por rango de fechas
- `GET /lot-movements/type/:type` - Por tipo

### Genealogy
- `POST /genealogy/link` - Crear relación
- `GET /genealogy/parents/:lotId` - Obtener padres
- `GET /genealogy/children/:lotId` - Obtener hijos
- `GET /genealogy/components/:lotId` - Componentes usados
- `GET /genealogy/tree/:lotId` - Árbol completo
- `GET /genealogy/upstream/:lotId` - Trace upstream (origen)
- `GET /genealogy/downstream/:lotId` - Trace downstream (destino)

### Serials/Units
- `POST /serial-units` - Crear serial
- `GET /serial-units/lot/:lotId` - Seriales de un lote
- `GET /serial-units/:serialNumber` - Buscar por serial
- `PATCH /serial-units/:id/status` - Cambiar estado
- `GET /serial-units/customer/:customerId` - Por cliente

### Locations
- `POST /locations` - Crear ubicación
- `GET /locations` - Listar ubicaciones
- `GET /locations/:id` - Obtener ubicación
- `GET /locations/type/:type` - Por tipo
- `GET /locations/map` - Mapa de ubicaciones
- `PATCH /locations/:id/block` - Bloquear ubicación

### Labels
- `POST /label-templates` - Crear plantilla
- `GET /label-templates` - Listar plantillas
- `POST /labels/print` - Imprimir etiqueta
- `GET /labels/history/:entityId` - Historial de impresiones

### Traceability (Agregador Principal)
- `GET /traceability/lot/:lotId/complete` - **Trazabilidad completa**
- `GET /traceability/serial/:serialNumber` - Trace por serial
- `GET /traceability/search` - Búsqueda avanzada
- `GET /traceability/events/:lotId` - Eventos de auditoría

---

## 🚀 Comandos para Generar Módulos

```bash
# Lots
nest g resource lots --no-spec

# Lot Movements
nest g resource lot-movements --no-spec

# Genealogy
nest g resource genealogy --no-spec

# Serial Units
nest g resource serial-units --no-spec

# Locations
nest g resource locations --no-spec

# Label Templates
nest g resource label-templates --no-spec

# Traceability Events
nest g resource traceability-events --no-spec

# Main Traceability Module
nest g module traceability
nest g service traceability --no-spec
nest g controller traceability --no-spec
```

---

## ✅ Checklist de Implementación

- [ ] Crear módulo Lots (lotes)
- [ ] Crear módulo Lot Movements (movimientos)
- [ ] Crear módulo Genealogy (genealogía)
- [ ] Crear módulo Serial Units (seriales)
- [ ] Crear módulo Locations (ubicaciones)
- [ ] Crear módulo Label Templates (etiquetas)
- [ ] Crear módulo Traceability Events (eventos)
- [ ] Crear módulo Traceability (agregador)
- [ ] Configurar relaciones en AppModule
- [ ] Generar y ejecutar migraciones
- [ ] Implementar búsqueda avanzada con filtros
- [ ] Crear servicios Angular frontend
- [ ] Implementar visualización de árbol genealógico
- [ ] Integrar con impresoras de etiquetas

---

## 📝 Notas Importantes

1. **Genealogía**: El árbol genealógico puede crecer mucho - limitar profundidad
2. **Movimientos**: Alto volumen de datos - considerar particiones por fecha
3. **Seriales**: Para productos con tracking unitario (electrónica, etc.)
4. **Ubicaciones**: Estructura jerárquica (Almacén > Pasillo > Rack > Estante > Bin)
5. **Etiquetas**: Integración con impresoras Zebra/Datamax vía ZPL/EPL
6. **Performance**: Indexar bien las tablas por lotNumber, serialNumber, fechas

¿Quieres que implemente estos módulos ahora?
