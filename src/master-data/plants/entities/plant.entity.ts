import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'plants' })
@Index(['code'], { unique: true })
export class Plant {
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

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
