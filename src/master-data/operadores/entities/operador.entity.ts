import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

export enum EstadoOperador {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
  VACACIONES = 'VACACIONES',
  BAJA_TEMPORAL = 'BAJA_TEMPORAL',
  BAJA_DEFINITIVA = 'BAJA_DEFINITIVA',
}

export enum NivelHabilidad {
  APRENDIZ = 'APRENDIZ',
  BASICO = 'BASICO',
  INTERMEDIO = 'INTERMEDIO',
  AVANZADO = 'AVANZADO',
  EXPERTO = 'EXPERTO',
}

@Entity({ name: 'operadores' })
@Index(['codigo'], { unique: true })
@Index(['numeroEmpleado'], { unique: true })
export class Operador {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Código único del operador (ej: "OP001", "OP-MAINT-001")
   */
  @Column({ type: 'varchar', length: 50 })
  codigo: string;

  /**
   * Número de empleado en el sistema de RRHH
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  numeroEmpleado?: string;

  /**
   * Nombre completo del operador
   */
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  /**
   * Apellidos del operador
   */
  @Column({ type: 'varchar', length: 100 })
  apellidos: string;

  /**
   * Email del operador
   */
  @Column({ type: 'varchar', length: 150, nullable: true })
  email?: string;

  /**
   * Teléfono del operador
   */
  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono?: string;

  /**
   * Estado actual del operador
   */
  @Column({
    type: 'enum',
    enum: EstadoOperador,
    default: EstadoOperador.ACTIVO,
  })
  estado: EstadoOperador;

  /**
   * Nivel de habilidad general del operador
   */
  @Column({
    type: 'enum',
    enum: NivelHabilidad,
    default: NivelHabilidad.BASICO,
  })
  nivelHabilidad: NivelHabilidad;

  /**
   * Departamento o área de trabajo
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  departamento?: string;

  /**
   * Puesto o cargo del operador
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  puesto?: string;

  /**
   * ID del turno asignado (referencia a tabla turnos)
   */
  @Column({ type: 'uuid', nullable: true })
  turnoId?: string;

  /**
   * ID del centro de trabajo (referencia a tabla work_centers)
   */
  @Column({ type: 'uuid', nullable: true })
  workCenterId?: string;

  /**
   * ID del supervisor directo (referencia a otro operador)
   */
  @Column({ type: 'uuid', nullable: true })
  supervisorId?: string;

  /**
   * Fecha de ingreso a la empresa
   */
  @Column({ type: 'date', nullable: true })
  fechaIngreso?: Date;

  /**
   * Certificaciones del operador (JSON array)
   */
  @Column({ type: 'jsonb', nullable: true })
  certificaciones?: string[];

  /**
   * Habilidades específicas del operador (JSON array)
   */
  @Column({ type: 'jsonb', nullable: true })
  habilidades?: string[];

  /**
   * Máquinas que puede operar (JSON array de IDs)
   */
  @Column({ type: 'jsonb', nullable: true })
  maquinasAutorizadas?: string[];

  /**
   * Notas o comentarios adicionales
   */
  @Column({ type: 'text', nullable: true })
  notas?: string;

  /**
   * Foto del operador (URL o path)
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  foto?: string;

  /**
   * Identificación con usuario del sistema (si aplica)
   */
  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
