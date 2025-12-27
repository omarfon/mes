import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

export enum TipoProceso {
  MANUFACTURA = 'MANUFACTURA',
  ENSAMBLE = 'ENSAMBLE',
  INSPECCION = 'INSPECCION',
  EMPAQUE = 'EMPAQUE',
  LOGISTICA = 'LOGISTICA',
  CALIDAD = 'CALIDAD',
  MANTENIMIENTO = 'MANTENIMIENTO',
  OTRO = 'OTRO',
}

export enum EstadoProceso {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
  EN_REVISION = 'EN_REVISION',
  OBSOLETO = 'OBSOLETO',
}

@Entity({ name: 'procesos' })
@Index(['codigo'], { unique: true })
export class Proceso {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Código único del proceso (ej: "PROC-001", "ASSY-MOTOR")
   */
  @Column({ type: 'varchar', length: 50 })
  codigo: string;

  /**
   * Nombre descriptivo del proceso
   */
  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  /**
   * Descripción detallada del proceso
   */
  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  /**
   * Tipo de proceso
   */
  @Column({
    type: 'enum',
    enum: TipoProceso,
    default: TipoProceso.MANUFACTURA,
  })
  tipo: TipoProceso;

  /**
   * Estado del proceso
   */
  @Column({
    type: 'enum',
    enum: EstadoProceso,
    default: EstadoProceso.ACTIVO,
  })
  estado: EstadoProceso;

  /**
   * Versión del proceso
   */
  @Column({ type: 'varchar', length: 20, default: '1.0' })
  version: string;

  /**
   * Tiempo estándar del proceso en minutos
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  tiempoEstandarMinutos?: number;

  /**
   * Tiempo de preparación (setup) en minutos
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  tiempoSetupMinutos?: number;

  /**
   * Instrucciones de trabajo del proceso
   */
  @Column({ type: 'text', nullable: true })
  instrucciones?: string;

  /**
   * Requisitos de calidad
   */
  @Column({ type: 'text', nullable: true })
  requisitosCalidad?: string;

  /**
   * Parámetros de proceso (JSON)
   * Ej: temperatura, presión, velocidad, etc.
   */
  @Column({ type: 'jsonb', nullable: true })
  parametros?: Record<string, any>;

  /**
   * Recursos necesarios (herramientas, materiales, etc.)
   */
  @Column({ type: 'jsonb', nullable: true })
  recursos?: string[];

  /**
   * Habilidades requeridas para ejecutar el proceso
   */
  @Column({ type: 'jsonb', nullable: true })
  habilidadesRequeridas?: string[];

  /**
   * ID del centro de trabajo donde se ejecuta
   */
  @Column({ type: 'uuid', nullable: true })
  workCenterId?: string;

  /**
   * ID del producto asociado (si aplica)
   */
  @Column({ type: 'uuid', nullable: true })
  productoId?: string;

  /**
   * ID de la ruta de producción asociada
   */
  @Column({ type: 'uuid', nullable: true })
  rutaId?: string;

  /**
   * Secuencia en la ruta de producción
   */
  @Column({ type: 'int', nullable: true })
  secuencia?: number;

  /**
   * Documentos asociados (manuales, planos, etc.)
   */
  @Column({ type: 'jsonb', nullable: true })
  documentos?: Array<{
    nombre: string;
    tipo: string;
    url: string;
  }>;

  /**
   * Puntos críticos de control
   */
  @Column({ type: 'jsonb', nullable: true })
  puntosCriticos?: string[];

  /**
   * Riesgos asociados al proceso
   */
  @Column({ type: 'jsonb', nullable: true })
  riesgos?: string[];

  /**
   * Eficiencia esperada del proceso (%)
   */
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  eficienciaEsperada?: number;

  /**
   * Costo estándar del proceso
   */
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  costoEstandar?: number;

  /**
   * Notas adicionales
   */
  @Column({ type: 'text', nullable: true })
  notas?: string;

  /**
   * Proceso padre (para jerarquía de procesos)
   */
  @Column({ type: 'uuid', nullable: true })
  procesoPadreId?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
