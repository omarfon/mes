import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Entity({ name: 'turnos' })
@Index(['codigo'], { unique: true })
export class Turno {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Código único del turno (ej: "T1", "MAÑANA", "NOCHE")
   */
  @Column({ type: 'varchar', length: 50 })
  codigo: string;

  /**
   * Nombre descriptivo del turno
   */
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  /**
   * Hora de inicio del turno (formato HH:mm)
   */
  @Column({ type: 'time' })
  horaInicio: string;

  /**
   * Hora de fin del turno (formato HH:mm)
   */
  @Column({ type: 'time' })
  horaFin: string;

  /**
   * Duración en horas del turno
   */
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  duracionHoras?: number;

  /**
   * Descripción adicional del turno
   */
  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  /**
   * Estado activo/inactivo del turno
   */
  @Column({ type: 'boolean', default: true })
  activo: boolean;

  /**
   * Días de la semana en los que aplica el turno
   * (JSON array: [1,2,3,4,5] para Lunes a Viernes)
   */
  @Column({ type: 'jsonb', nullable: true })
  diasSemana?: number[];

  /**
   * Color para representación visual (hex code)
   */
  @Column({ type: 'varchar', length: 7, nullable: true })
  color?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
