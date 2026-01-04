import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DefectFamily } from '../../families/entities/defect-family.entity';
import { Severity } from '../../severities/entities/severity.entity';

export enum DefectStatus {
  OPEN = 'OPEN',
  IN_REVIEW = 'IN_REVIEW',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

@Entity('quality_defects')
export class Defect {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'family' })
  familyId: string;

  @Column({ name: 'severity' })
  severityId: string;

  @Column({
    type: 'enum',
    enum: DefectStatus,
    default: DefectStatus.OPEN,
  })
  status: DefectStatus;

  @Column({ name: 'product_id', nullable: true })
  productId: string;

  @Column({ name: 'production_order_id', nullable: true })
  productionOrderId: string;

  @Column({ name: 'inspection_id', nullable: true })
  inspectionId: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ name: 'detected_by', nullable: true })
  detectedBy: string;

  @Column({ name: 'detected_at', type: 'timestamp', nullable: true })
  detectedAt: Date;

  @Column({ name: 'resolved_by', nullable: true })
  resolvedBy: string;

  @Column({ name: 'resolved_at', type: 'timestamp', nullable: true })
  resolvedAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => DefectFamily)
  @JoinColumn({ name: 'family' })
  family: DefectFamily;

  @ManyToOne(() => Severity)
  @JoinColumn({ name: 'severity' })
  severity: Severity;
}
