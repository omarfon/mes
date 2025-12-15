import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { QualityInspection } from './inspection.entity';
import { Defect } from './defect.entity';

@Entity({ name: 'inspection_defects' })
export class InspectionDefect {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'inspection_id', type: 'uuid' })
  inspectionId: string;

  @ManyToOne(() => QualityInspection, (i) => i.defects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'inspection_id' })
  inspection: QualityInspection;

  @Column({ name: 'defect_id', type: 'uuid' })
  defectId: string;

  @ManyToOne(() => Defect, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'defect_id' })
  defect: Defect;

  @Column({ type: 'numeric', default: 1 })
  quantity: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;
}
