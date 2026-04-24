import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BillOfMaterial } from './bill-of-material.entity';

@Entity({ name: 'bom_lines' })
export class BomLine {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'bom_id' })
  bomId!: string;

  @ManyToOne(() => BillOfMaterial, (bom) => bom.lines, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bom_id' })
  bom!: BillOfMaterial;

  @Column({ type: 'varchar', length: 50, name: 'material_code' })
  materialCode!: string;

  @Column({ type: 'varchar', length: 200, name: 'material_name' })
  materialName!: string;

  @Column({ type: 'decimal', precision: 12, scale: 3 })
  qty!: number;

  @Column({ type: 'varchar', length: 20 })
  uom!: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0, name: 'scrap_pct' })
  scrapPct!: number;

  @Column({ type: 'varchar', length: 50, default: '' })
  phase!: string;

  @Column({ type: 'boolean', default: false })
  optional!: boolean;

  @Column({ type: 'text', default: '' })
  notes!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
