import { AuditableEntity } from '../../../common/entities/auditable.entity';
// src/traceability/movements/entities/lot-movement.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Lot } from '../../lots/entities/lot.entity';

export enum MovementType {
  TRANSFER = 'TRANSFER',
  CONSUME = 'CONSUME',
  ADJUST = 'ADJUST',
  SCRAP = 'SCRAP',
  RECEIPT = 'RECEIPT',
  PRODUCTION = 'PRODUCTION'
}

@Entity('lot_movements')
@Index(['lotId', 'at'])
@Index(['lotCode'])
export class LotMovement extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'lot_id' })
  lotId: string;

  @ManyToOne(() => Lot, { nullable: true })
  @JoinColumn({ name: 'lot_id' })
  lot?: Lot;

  @Column({ name: 'lot_code', length: 100 })
  lotCode: string;

  @Column({
    type: 'enum',
    enum: MovementType
  })
  type: MovementType;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  qty: number;

  @Column({ length: 20, nullable: true })
  uom: string;

  @Column({ name: 'from_location', length: 200, nullable: true })
  fromLocation: string;

  @Column({ name: 'to_location', length: 200, nullable: true })
  toLocation: string;

  @Column({ name: 'order_code', length: 100, nullable: true })
  orderCode: string;

  @Column({ length: 200, nullable: true })
  operation: string;

  @Column({ name: 'machine_code', length: 100, nullable: true })
  machineCode: string;

  @Column({ name: 'shift_code', length: 10, nullable: true })
  shiftCode: string;

  @Column({ length: 200, nullable: true })
  by: string;

  @Column({ length: 500, nullable: true })
  reason: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ name: 'movement_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  at: Date;
}