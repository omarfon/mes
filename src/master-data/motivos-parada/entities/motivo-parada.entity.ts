import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

export enum CategoriaParada {
  PLANIFICADA = 'PLANIFICADA',
  NO_PLANIFICADA = 'NO_PLANIFICADA',
  MANTENIMIENTO = 'MANTENIMIENTO',
  PRODUCCION = 'PRODUCCION',
  CALIDAD = 'CALIDAD',
  MATERIALES = 'MATERIALES',
  PERSONAL = 'PERSONAL',
  OTROS = 'OTROS',
}

export enum TipoParada {
  CORTA = 'CORTA',
  MEDIA = 'MEDIA',
  LARGA = 'LARGA',
}

@Entity({ name: 'motivos_parada' })
@Index(['codigo'], { unique: true })
export class MotivoParada {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Código único del motivo de parada (ej: "MP001", "MANT-PREV")
   */
  @Column({ type: 'varchar', length: 50 })
  codigo: string;

  /**
   * Nombre descriptivo del motivo
   */
  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  /**
   * Descripción detallada del motivo
   */
  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  /**
   * Categoría del motivo de parada
   */
  @Column({
    type: 'enum',
    enum: CategoriaParada,
    default: CategoriaParada.NO_PLANIFICADA,
  })
  categoria: CategoriaParada;

  /**
   * Tipo de parada según duración esperada
   */
  @Column({
    type: 'enum',
    enum: TipoParada,
    nullable: true,
  })
  tipo?: TipoParada;

  /**
   * Si requiere aprobación para registrar
   */
  @Column({ type: 'boolean', default: false })
  requiereAprobacion: boolean;

  /**
   * Si requiere comentario obligatorio al registrar
   */
  @Column({ type: 'boolean', default: false })
  requiereComentario: boolean;

  /**
   * Si requiere adjuntar evidencia
   */
  @Column({ type: 'boolean', default: false })
  requiereEvidencia: boolean;

  /**
   * Color para representación visual (hex code)
   */
  @Column({ type: 'varchar', length: 7, nullable: true })
  color?: string;

  /**
   * Icono o emoji para representación
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  icono?: string;

  /**
   * Tiempo estándar de resolución en minutos
   */
  @Column({ type: 'int', nullable: true })
  tiempoEstandardMinutos?: number;

  /**
   * Prioridad del motivo (1 más alta, 5 más baja)
   */
  @Column({ type: 'int', default: 3 })
  prioridad: number;

  /**
   * Si impacta en OEE (Overall Equipment Effectiveness)
   */
  @Column({ type: 'boolean', default: true })
  impactaOEE: boolean;

  /**
   * Departamento responsable de resolver
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  departamentoResponsable?: string;

  /**
   * Acciones correctivas sugeridas
   */
  @Column({ type: 'jsonb', nullable: true })
  accionesCorrectivas?: string[];

  /**
   * Estado activo/inactivo
   */
  @Column({ type: 'boolean', default: true })
  activo: boolean;

  /**
   * Motivo padre (para jerarquía de motivos)
   */
  @Column({ type: 'uuid', nullable: true })
  motivoPadreId?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
