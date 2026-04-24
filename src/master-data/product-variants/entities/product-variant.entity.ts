import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'product_variants' })
@Index(['sku'], { unique: true })
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  sku!: string;

  @Column({ type: 'varchar', length: 50, name: 'product_code' })
  productCode!: string;

  @Column({ type: 'varchar', length: 100, default: '' })
  color!: string;

  @Column({ type: 'varchar', length: 100, default: '' })
  size!: string;

  @Column({ type: 'varchar', length: 100, default: '' })
  presentation!: string;

  @Column({ type: 'varchar', length: 100, default: '' })
  barcode!: string;

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true, name: 'net_weight' })
  netWeight?: number | null;

  @Column({ type: 'varchar', length: 20, default: 'kg', name: 'weight_unit' })
  weightUnit!: string;

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
