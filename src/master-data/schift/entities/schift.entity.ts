import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'shifts' })
@Index(['code'], { unique: true })
export class Shift {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Código único del turno
   * Ej: T1, T2, N1
   */
  @Column({ type: 'varchar', length: 20 })
  code: string;

  /**
   * Nombre descriptivo del turno
   * Ej: "Turno Mañana", "Turno Noche"
   */
  @Column({ type: 'varchar', length: 100 })
  name: string;

  /**
   * Descripción opcional
   */
  @Column({ type: 'text', nullable: true })
  description?: string | null;

  /**
   * Hora de inicio (HH:mm:ss)
   */
  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  /**
   * Hora de fin (HH:mm:ss)
   * Puede ser menor que startTime si cruza medianoche,
   * eso lo manejas en la lógica de negocio.
   */
  @Column({ name: 'end_time', type: 'time' })
  endTime: string;

  /**
   * ¿El turno cruza la medianoche?
   * Ej: 22:00 - 06:00 => true
   */
  @Column({ name: 'crosses_midnight', type: 'boolean', default: false })
  crossesMidnight: boolean;

  /**
   * Minutos de break / refrigerio
   */
  @Column({ name: 'break_minutes', type: 'int', default: 0 })
  breakMinutes: number;

  /**
   * Flag activo/inactivo
   */
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  /**
   * Auditoría
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date | null;
}
