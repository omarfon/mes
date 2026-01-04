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
  externalCode: string;

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
  qualityStatus: string;

  @Column({ name: 'quality_inspector_id', type: 'uuid', nullable: true })
  qualityInspectorId: string;

  @Column({ name: 'quality_inspection_date', type: 'timestamp', nullable: true })
  qualityInspectionDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'jsonb', nullable: true })
  attributes: any;

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
