import { Machine } from 'src/master-data/machines/entities/machines.entity';
import { AuditableEntity } from '../../../common/entities/auditable.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index
} from 'typeorm';


export enum WorkCenterType {
  LINE = 'LINE',              // Línea de producción
  CELL = 'CELL',              // Célula
  MACHINE_GROUP = 'MACHINE_GROUP', // Grupo de máquinas
  AREA = 'AREA',              // Área funcional
}

@Entity({ name: 'work_centers' })
@Index(['code'], { unique: true })
export class WorkCenter extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({
    type: 'enum',
    enum: WorkCenterType,
    default: WorkCenterType.LINE
  })
  type: WorkCenterType;

  @Column({ type: 'varchar', length: 100, nullable: true })
  area?: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  location?: string | null;

  @Column({ type: 'numeric', nullable: true })
  nominalCapacity?: number | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => Machine, (machine) => machine.workCenter)
  machines: Machine[];
}
