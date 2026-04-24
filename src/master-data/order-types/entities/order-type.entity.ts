import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum OrderPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

@Entity({ name: 'order_types' })
@Index(['code'], { unique: true })
export class OrderType {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50 })
  code!: string;

  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @Column({ type: 'text', default: '' })
  description!: string;

  @Column({
    type: 'enum',
    enum: OrderPriority,
    default: OrderPriority.NORMAL,
  })
  priority!: OrderPriority;

  @Column({ type: 'varchar', length: 7, default: '#000000' })
  color!: string;

  @Column({ type: 'boolean', default: false, name: 'allows_rework' })
  allowsRework!: boolean;

  @Column({ type: 'boolean', default: true, name: 'requires_qa' })
  requiresQA!: boolean;

  @Column({ type: 'boolean', default: false, name: 'requires_release' })
  requiresRelease!: boolean;

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
