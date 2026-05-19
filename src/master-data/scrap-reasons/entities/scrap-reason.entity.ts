import { AuditableEntity } from '../../../common/entities/auditable.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index
} from 'typeorm';

export enum ScrapClassification {
  PROCESS = 'PROCESS',
  MACHINE = 'MACHINE',
  MATERIAL = 'MATERIAL',
  OPERATOR = 'OPERATOR',
  DESIGN = 'DESIGN',
  OTHER = 'OTHER'
}

@Entity({ name: 'scrap_reasons' })
@Index(['code'], { unique: true })
export class ScrapReason extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50 })
  code!: string;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({
    type: 'enum',
    enum: ScrapClassification,
    default: ScrapClassification.OTHER
  })
  classification!: ScrapClassification;

  @Column({ type: 'text', default: '' })
  description!: string;

  @Column({ type: 'boolean', default: true, name: 'affects_efficiency' })
  affectsEfficiency!: boolean;

  @Column({ type: 'boolean', default: true })
  reportable!: boolean;

  @Column({ type: 'boolean', default: true })
  active!: boolean;
}
