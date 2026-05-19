import { AuditableEntity } from '../../../common/entities/auditable.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index
} from 'typeorm';

@Entity({ name: 'shift_groups' })
@Index(['code'], { unique: true })
export class ShiftGroup extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50 })
  code!: string;

  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @Column({ type: 'varchar', length: 50, name: 'plant_code' })
  plantCode!: string;

  /**
   * CSV de códigos de turnos (T1,T2,T3)
   */
  @Column({ type: 'varchar', length: 200, name: 'shift_codes', default: '' })
  shiftCodes!: string;

  @Column({ type: 'varchar', length: 50, name: 'supervisor_code', default: '' })
  supervisorCode!: string;

  @Column({ type: 'int', default: 0 })
  headcount!: number;

  @Column({ type: 'text', default: '' })
  notes!: string;

  @Column({ type: 'boolean', default: true })
  active!: boolean;
}
