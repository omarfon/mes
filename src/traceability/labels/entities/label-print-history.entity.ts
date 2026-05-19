import { AuditableEntity } from '../../../common/entities/auditable.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { LabelTemplate } from './label-template.entity';

export enum PrintStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PENDING = 'PENDING'
}

@Entity('label_print_history')
export class LabelPrintHistory extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'template_id' })
  templateId: string;

  @Column({ name: 'lot_id', nullable: true })
  lotId: string;

  @Column({ name: 'serial_id', nullable: true })
  serialId: string;

  @Column({ name: 'printer_name' })
  printerName: string;

  @Column({
    type: 'enum',
    enum: PrintStatus,
    default: PrintStatus.PENDING
  })
  status: PrintStatus;

  @Column({ name: 'copies_printed', default: 1 })
  copiesPrinted: number;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @Column({ type: 'jsonb', nullable: true })
  printData: any;

  // Relaciones
  @ManyToOne(() => LabelTemplate)
  @JoinColumn({ name: 'template_id' })
  template: LabelTemplate;
}
