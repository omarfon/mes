import { AuditableEntity } from '../../../common/entities/auditable.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn
} from 'typeorm';

export enum EstadoOrden {
  PENDIENTE = 'PENDIENTE',
  EN_PROCESO = 'EN_PROCESO',
  PAUSADA = 'PAUSADA',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA'
}

export enum PrioridadOrden {
  BAJA = 'BAJA',
  NORMAL = 'NORMAL',
  ALTA = 'ALTA',
  URGENTE = 'URGENTE'
}

@Entity({ name: 'ordenes_produccion' })
@Index(['numeroOrden'], { unique: true })
export class OrdenProduccion extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Número de orden único (ej: "OP-2025-001")
   */
  @Column({ type: 'varchar', length: 50, name: 'numero_orden' })
  numeroOrden: string;

  /**
   * ID del producto a fabricar
   */
  @Column({ type: 'uuid', name: 'producto_id' })
  productoId: string;

  /**
   * Código del producto (desnormalizado para consultas rápidas)
   */
  @Column({ type: 'varchar', length: 100, name: 'producto_codigo', nullable: true })
  productoCodigo: string;

  /**
   * Nombre del producto (desnormalizado)
   */
  @Column({ type: 'varchar', length: 200, name: 'producto_nombre', nullable: true })
  productoNombre: string;

  /**
   * Cantidad planificada a producir
   */
  @Column({ type: 'decimal', precision: 12, scale: 3, name: 'cantidad_planificada' })
  cantidadPlanificada: number;

  /**
   * Cantidad producida hasta el momento
   */
  @Column({ type: 'decimal', precision: 12, scale: 3, name: 'cantidad_producida', default: 0 })
  cantidadProducida: number;

  /**
   * Cantidad rechazada por calidad
   */
  @Column({ type: 'decimal', precision: 12, scale: 3, name: 'cantidad_rechazada', default: 0 })
  cantidadRechazada: number;

  /**
   * Unidad de medida
   */
  @Column({ type: 'varchar', length: 50, name: 'unidad_medida' })
  unidadMedida: string;

  /**
   * Estado actual de la orden
   */
  @Column({
    type: 'enum',
    enum: EstadoOrden,
    default: EstadoOrden.PENDIENTE
  })
  estado: EstadoOrden;

  /**
   * Prioridad de la orden
   */
  @Column({
    type: 'enum',
    enum: PrioridadOrden,
    default: PrioridadOrden.NORMAL
  })
  prioridad: PrioridadOrden;

  /**
   * Fecha planificada de inicio
   */
  @Column({ type: 'timestamp', name: 'fecha_inicio_planificada', nullable: true })
  fechaInicioPlanificada: Date;

  /**
   * Fecha planificada de fin
   */
  @Column({ type: 'timestamp', name: 'fecha_fin_planificada', nullable: true })
  fechaFinPlanificada: Date;

  /**
   * Fecha real de inicio
   */
  @Column({ type: 'timestamp', name: 'fecha_inicio_real', nullable: true })
  fechaInicioReal: Date;

  /**
   * Fecha real de fin
   */
  @Column({ type: 'timestamp', name: 'fecha_fin_real', nullable: true })
  fechaFinReal: Date;

  /**
   * ID de la ruta de producción
   */
  @Column({ type: 'uuid', name: 'ruta_id', nullable: true })
  rutaId: string;

  /**
   * ID del centro de trabajo asignado
   */
  @Column({ type: 'uuid', name: 'work_center_id', nullable: true })
  workCenterId: string;

  /**
   * ID del turno asignado
   */
  @Column({ type: 'uuid', name: 'turno_id', nullable: true })
  turnoId: string;

  /**
   * Número de lote
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  lote: string;

  /**
   * Cliente o pedido asociado
   */
  @Column({ type: 'varchar', length: 200, nullable: true })
  cliente: string;

  /**
   * Referencia del pedido de cliente
   */
  @Column({ type: 'varchar', length: 100, name: 'pedido_cliente', nullable: true })
  pedidoCliente: string;

  /**
   * Notas o instrucciones especiales
   */
  @Column({ type: 'text', nullable: true })
  notas: string;

  /**
   * Documentos adjuntos (JSON)
   */
  @Column({ type: 'jsonb', nullable: true })
  documentos: any;

  /**
   * Parámetros técnicos (JSON)
   */
  @Column({ type: 'jsonb', nullable: true })
  parametros: any;

  /**
   * Porcentaje de avance (calculado)
   */
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  progreso: number;

  /**
   * Usuario que creó la orden
   */
  @Column({ type: 'uuid', name: 'creado_por', nullable: true })
  creadoPor: string;

  /**
   * Campos de auditoría
   */
}
