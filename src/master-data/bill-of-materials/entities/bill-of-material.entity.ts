import { AuditableEntity } from '../../../common/entities/auditable.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany
} from 'typeorm';
import { BomLine } from './bom-line.entity';

@Entity({ name: 'bill_of_materials' })
@Index(['code'], { unique: true })
export class BillOfMaterial extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50 })
  code!: string;

  @Column({ type: 'varchar', length: 50, name: 'product_code' })
  productCode!: string;

  @Column({ type: 'varchar', length: 200, name: 'product_name' })
  productName!: string;

  @Column({ type: 'varchar', length: 20, default: '1.0' })
  version!: string;

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 1, name: 'base_qty' })
  baseQty!: number;

  @Column({ type: 'varchar', length: 20, name: 'base_uom' })
  baseUom!: string;

  @Column({ type: 'date', nullable: true, name: 'valid_from' })
  validFrom?: Date;

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @OneToMany(() => BomLine, (line) => line.bom, { cascade: true })
  lines!: BomLine[];
}
