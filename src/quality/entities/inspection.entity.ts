import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TraceNode } from '../../traceability/entities/trace-node.entity';
import { InspectionDefect } from './inspection-defect.entity';
import { User } from '../../master-data/users/entities/user.entity';

export enum InspectionType {
  RAW_MATERIAL = 'RAW_MATERIAL',
  IN_PROCESS = 'IN_PROCESS',
  FINISHED_GOOD = 'FINISHED_GOOD',
  SERIAL_ITEM = 'SERIAL_ITEM',
  CONTAINER = 'CONTAINER',
}

export enum InspectionStatus {
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  REWORK = 'REWORK',
  PENDING = 'PENDING',
}

@Entity({ name: 'quality_inspections' })
export class QualityInspection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: InspectionType })
  type: InspectionType;

  @Column({ name: 'node_id', type: 'uuid' })
  nodeId: string;

  @ManyToOne(() => TraceNode, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'node_id' })
  node: TraceNode;

  @Column({
    type: 'enum',
    enum: InspectionStatus,
    default: InspectionStatus.PENDING,
  })
  status: InspectionStatus;

  @Column({ type: 'numeric', nullable: true })
  inspectedQuantity?: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @OneToMany(() => InspectionDefect, (d) => d.inspection, { cascade: true })
  defects: InspectionDefect[];

  @Column({ name: 'inspector_id', type: 'uuid', nullable: true })
  inspectorId?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'inspector_id' })
  inspector?: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
