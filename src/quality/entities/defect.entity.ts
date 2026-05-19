import { AuditableEntity } from '../../common/entities/auditable.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';

export enum DefectSeverity {
  MINOR = 'MINOR',
  MAJOR = 'MAJOR',
  CRITICAL = 'CRITICAL'
}

@Entity({ name: 'quality_defects' })
export class Defect extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: DefectSeverity })
  severity: DefectSeverity;
}
