import { AuditableEntity } from '../../../common/entities/auditable.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn
} from 'typeorm';

export enum WorkstationType {
  MANUAL = 'MANUAL',
  SEMI_AUTO = 'SEMI_AUTO',
  AUTOMATED = 'AUTOMATED'
}

@Entity({ name: 'workstations' })
@Index(['code'], { unique: true })
export class Workstation extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Código único de la estación de trabajo
   */
  @Column({ type: 'varchar', length: 50 })
  code!: string;

  /**
   * Nombre de la estación de trabajo
   */
  @Column({ type: 'varchar', length: 150 })
  name!: string;

  /**
   * Código del centro de trabajo (FK)
   */
  @Column({ type: 'varchar', length: 50, name: 'work_center_code', default: '' })
  workCenterCode!: string;

  /**
   * Tipo de estación
   */
  @Column({
    type: 'enum',
    enum: WorkstationType,
    default: WorkstationType.MANUAL
  })
  type!: WorkstationType;

  /**
   * Código de la máquina/asset vinculado
   */
  @Column({ type: 'varchar', length: 50, default: '' })
  asset!: string;

  /**
   * Número de puestos de operador
   */
  @Column({ type: 'int', default: 1, name: 'operator_slots' })
  operatorSlots!: number;

  /**
   * Indica si la estación está activa
   */
  @Column({ type: 'boolean', default: true })
  active!: boolean;
}
