import { AuditableEntity } from '../../../common/entities/auditable.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index
} from 'typeorm';
import { Lot } from '../../lots/entities/lot.entity';

export enum SerialStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  IN_PRODUCTION = 'IN_PRODUCTION',
  TESTED = 'TESTED',
  SHIPPED = 'SHIPPED',
  RETURNED = 'RETURNED',
  SCRAPPED = 'SCRAPPED',
  IN_WARRANTY = 'IN_WARRANTY'
}

@Entity('serials')
@Index(['serialNumber'], { unique: true })
export class Serial extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'serial_number', unique: true })
  serialNumber: string;

  @Column({ name: 'lot_id' })
  lotId: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({
    type: 'enum',
    enum: SerialStatus,
    default: SerialStatus.IN_PRODUCTION
  })
  status: SerialStatus;

  // Campos específicos para electrónicos
  @Column({ name: 'mac_address', nullable: true })
  macAddress: string;

  @Column({ name: 'imei', nullable: true })
  imei: string;

  @Column({ name: 'firmware_version', nullable: true })
  firmwareVersion: string;

  @Column({ name: 'hardware_revision', nullable: true })
  hardwareRevision: string;

  // Garantía
  @Column({ name: 'warranty_start_date', type: 'timestamp', nullable: true })
  warrantyStartDate: Date;

  @Column({ name: 'warranty_end_date', type: 'timestamp', nullable: true })
  warrantyEndDate: Date;

  @Column({ name: 'warranty_months', nullable: true })
  warrantyMonths: number;

  // Fechas de producción/envío
  @Column({ name: 'manufactured_date', type: 'timestamp', nullable: true })
  manufacturedDate: Date;

  @Column({ name: 'shipped_date', type: 'timestamp', nullable: true })
  shippedDate: Date;

  @Column({ name: 'customer_id', nullable: true })
  customerId: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  // Relaciones
  @ManyToOne(() => Lot)
  @JoinColumn({ name: 'lot_id' })
  lot: Lot;
}
