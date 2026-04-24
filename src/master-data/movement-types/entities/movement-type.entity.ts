import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum MovementCategory {
  CONSUMPTION = 'CONSUMPTION',
  SCRAP = 'SCRAP',
  TRANSFER = 'TRANSFER',
  RETURN = 'RETURN',
  ADJUSTMENT = 'ADJUSTMENT',
  RECEIPT = 'RECEIPT',
}

export enum MovementDirection {
  IN = 'IN',
  OUT = 'OUT',
  TRANSFER = 'TRANSFER',
}

@Entity({ name: 'movement_types' })
@Index(['code'], { unique: true })
export class MovementType {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50 })
  code!: string;

  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @Column({
    type: 'enum',
    enum: MovementCategory,
  })
  category!: MovementCategory;

  @Column({
    type: 'enum',
    enum: MovementDirection,
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

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
