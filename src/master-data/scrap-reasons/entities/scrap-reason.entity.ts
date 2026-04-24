import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum ScrapClassification {
  PROCESS = 'PROCESS',
  MACHINE = 'MACHINE',
  MATERIAL = 'MATERIAL',
  OPERATOR = 'OPERATOR',
  DESIGN = 'DESIGN',
  OTHER = 'OTHER',
}

@Entity({ name: 'scrap_reasons' })
@Index(['code'], { unique: true })
export class ScrapReason {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50 })
  code!: string;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({
    type: 'enum',
    enum: ScrapClassification,
    default: ScrapClassification.OTHER,
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

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
