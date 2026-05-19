import { AuditableEntity } from '../../../common/entities/auditable.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index
} from 'typeorm';

@Entity({ name: 'plants' })
@Index(['code'], { unique: true })
export class Plant extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Código único de la planta
   */
  @Column({ type: 'varchar', length: 50 })
  code!: string;

  /**
   * Nombre de la planta
   */
  @Column({ type: 'varchar', length: 150 })
  name!: string;

  /**
   * País donde se ubica la planta
   */
  @Column({ type: 'varchar', length: 100 })
  country!: string;

  /**
   * Ciudad donde se ubica la planta
   */
  @Column({ type: 'varchar', length: 100 })
  city!: string;

  /**
   * Zona horaria (ej: 'America/Lima', 'UTC')
   */
  @Column({ type: 'varchar', length: 100, default: 'UTC' })
  timezone!: string;

  /**
   * Indica si la planta está activa
   */
  @Column({ type: 'boolean', default: true })
  active!: boolean;
}
