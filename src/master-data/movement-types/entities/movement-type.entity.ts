import { AuditableEntity } from '../../../common/entities/auditable.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index
} from 'typeorm';

export enum MovementCategory {
  CONSUMPTION = 'CONSUMPTION',
  SCRAP = 'SCRAP',
  TRANSFER = 'TRANSFER',
  RETURN = 'RETURN',
  ADJUSTMENT = 'ADJUSTMENT',
  RECEIPT = 'RECEIPT'
}

export enum MovementDirection {
  IN = 'IN',
  OUT = 'OUT',
  TRANSFER = 'TRANSFER'
}

@Entity({ name: 'movement_types' })
@Index(['code'], { unique: true })
export class MovementType extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50 })
  code!: string;

  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @Column({
    type: 'enum',
    enum: MovementCategory
  })
  category!: MovementCategory;

  @Column({
    type: 'enum',
    enum: MovementDirection
  })
  direction!: MovementDirection;

  @Column({ type: 'boolean', default: true, name: 'affects_stock' })
  affectsStock!: boolean;

  @Column({ type: 'boolean', default: false, name: 'requires_lot' })
  requiresLot!: boolean;

  @Column({ type: 'boolean', default: false, name: 'requires_reason' })
  requiresReason!: boolean;

  @Column({ type: 'boolean', default: false, name: 'auto_consumed' })
  autoConsumed!: boolean;

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @Column({ type: 'text', default: '' })
  notes!: string;
}
