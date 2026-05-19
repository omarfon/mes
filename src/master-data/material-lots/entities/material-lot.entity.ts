import { AuditableEntity } from '../../../common/entities/auditable.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index
} from 'typeorm';

export enum LotStatus {
  AVAILABLE = 'AVAILABLE',
  QUARANTINE = 'QUARANTINE',
  CONSUMED = 'CONSUMED',
  EXPIRED = 'EXPIRED',
  REJECTED = 'REJECTED'
}

@Entity({ name: 'material_lots' })
@Index(['lotNumber'], { unique: true })
export class MaterialLot extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, unique: true, name: 'lot_number' })
  lotNumber!: string;

  @Column({ type: 'varchar', length: 50, name: 'material_code' })
  materialCode!: string;

  @Column({ type: 'varchar', length: 200, name: 'material_name' })
  materialName!: string;

  @Column({ type: 'varchar', length: 50, default: '', name: 'supplier_code' })
  supplierCode!: string;

  @Column({ type: 'varchar', length: 100, default: '', name: 'supplier_lot' })
  supplierLot!: string;

  @Column({ type: 'date', name: 'received_date' })
  receivedDate!: Date;

  @Column({ type: 'date', nullable: true, name: 'expiry_date' })
  expiryDate?: Date;

  @Column({ type: 'decimal', precision: 12, scale: 3, name: 'initial_qty' })
  initialQty!: number;

  @Column({ type: 'decimal', precision: 12, scale: 3, name: 'available_qty' })
  availableQty!: number;

  @Column({ type: 'varchar', length: 20 })
  uom!: string;

  @Column({ type: 'varchar', length: 50, default: '', name: 'location_code' })
  locationCode!: string;

  @Column({
    type: 'enum',
    enum: LotStatus,
    default: LotStatus.AVAILABLE
  })
  status!: LotStatus;

  @Column({ type: 'text', default: '' })
  notes!: string;
}
