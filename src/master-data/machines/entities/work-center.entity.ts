import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { Machine } from './machines.entity';



export enum WorkCenterType {
  LINE = 'LINE',              // Línea de producción
  CELL = 'CELL',              // Célula
  MACHINE_GROUP = 'MACHINE_GROUP', // Grupo de máquinas
  AREA = 'AREA',              // Área funcional
}

@Entity({ name: 'work_centers' })
@Index(['code'], { unique: true })
export class WorkCenter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Código único del centro de trabajo
   * Ej: HIL-LIN-01, ACAB-AREA-02
   */
  @Column({ type: 'varchar', length: 50 })
  code: string;

  /**
   * Nombre descriptivo
   * Ej: "Línea de Hilatura 1", "Área de Acabados A"
   */
  @Column({ type: 'varchar', length: 100 })
  name: string;

  /**
   * Descripción opcional
   */
  @Column({ type: 'text', nullable: true })
  description?: string | null;

  /**
   * Tipo de centro de trabajo
   */
  @Column({
    type: 'enum',
    enum: WorkCenterType,
    default: WorkCenterType.LINE,
  })
  type: WorkCenterType;

  /**
   * Área / sección de planta a la que pertenece
   * (si quieres agrupar varios work centers bajo un área macro)
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  area?: string | null;

  /**
   * Ubicación física
   * Ej: "Nave 1 - Sector B"
   */
  @Column({ type: 'varchar', length: 150, nullable: true })
  location?: string | null;

  /**
   * Capacidad teórica del centro de trabajo
   * (ej. kg/hora, piezas/hora) – lo detallas en documentación funcional
   */
  @Column({ type: 'numeric', nullable: true })
  nominalCapacity?: number | null;

  /**
   * Flag de centro de trabajo activo
   */
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  /**
   * Relación 1:N con máquinas
   */
  @OneToMany(() => Machine, (machine) => machine.workCenter)
  machines: Machine[];

  /**
   * Auditoría
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  /**
   * Soft delete
   */
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date | null;
}
