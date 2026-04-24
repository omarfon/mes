import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'standard_times' })
export class StandardTime {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, name: 'operation_code' })
  operationCode!: string;

  @Column({ type: 'varchar', length: 200, name: 'operation_name' })
  operationName!: string;

  @Column({ type: 'varchar', length: 50, name: 'product_code' })
  productCode!: string;

  @Column({ type: 'varchar', length: 50, name: 'work_center_code' })
  workCenterCode!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'setup_min' })
  setupMin!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'cycle_min' })
  cycleMin!: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, default: 0, name: 'time_per_unit_min' })
  timePerUnitMin!: number;

  @Column({ type: 'int', default: 1, name: 'batch_size' })
  batchSize!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 100, name: 'efficiency_pct' })
  efficiencyPct!: number;

  @Column({ type: 'varchar', length: 50, name: 'valid_from', default: '' })
  validFrom!: string;

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
