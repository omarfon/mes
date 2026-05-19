import { AuditableEntity } from '../../../common/entities/auditable.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index
} from 'typeorm';

export enum EstadoDespacho {
  PENDIENTE = 'PENDIENTE',
  EN_PREPARACION = 'EN_PREPARACION',
  LISTO = 'LISTO',
  EN_TRANSITO = 'EN_TRANSITO',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO'
}

export enum TipoDespacho {
  CLIENTE = 'CLIENTE',
  INTERNO = 'INTERNO',
  TRANSFERENCIA = 'TRANSFERENCIA'
}

@Entity({ name: 'despachos' })
@Index(['numeroDespacho'], { unique: true })
export class Despacho extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Número único de despacho
   */
  @Column({ type: 'varchar', length: 50, name: 'numero_despacho' })
  numeroDespacho: string;

  /**
   * ID de la orden de producción asociada
   */
  @Column({ type: 'uuid', name: 'orden_id', nullable: true })
  ordenId: string;

  /**
   * Tipo de despacho
   */
  @Column({
    type: 'enum',
    enum: TipoDespacho,
    default: TipoDespacho.CLIENTE
  })
  tipo: TipoDespacho;

  /**
   * Estado del despacho
   */
  @Column({
    type: 'enum',
    enum: EstadoDespacho,
    default: EstadoDespacho.PENDIENTE
  })
  estado: EstadoDespacho;

  /**
   * Destino o cliente
   */
  @Column({ type: 'varchar', length: 200 })
  destino: string;

  /**
   * Dirección de entrega
   */
  @Column({ type: 'text', nullable: true })
  direccion: string;

  /**
   * Contacto en destino
   */
  @Column({ type: 'varchar', length: 150, nullable: true })
  contacto: string;

  /**
   * Teléfono de contacto
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  telefono: string;

  /**
   * Fecha programada de despacho
   */
  @Column({ type: 'timestamp', name: 'fecha_programada', nullable: true })
  fechaProgramada: Date;

  /**
   * Fecha real de despacho
   */
  @Column({ type: 'timestamp', name: 'fecha_despacho', nullable: true })
  fechaDespacho: Date;

  /**
   * Fecha de entrega
   */
  @Column({ type: 'timestamp', name: 'fecha_entrega', nullable: true })
  fechaEntrega: Date;

  /**
   * Items del despacho (JSON)
   */
  @Column({ type: 'jsonb' })
  items: any;

  /**
   * Cantidad total de items
   */
  @Column({ type: 'integer', name: 'cantidad_items', default: 0 })
  cantidadItems: number;

  /**
   * Peso total (kg)
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'peso_total', nullable: true })
  pesoTotal: number;

  /**
   * Volumen total (m3)
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'volumen_total', nullable: true })
  volumenTotal: number;

  /**
   * Transportista
   */
  @Column({ type: 'varchar', length: 150, nullable: true })
  transportista: string;

  /**
   * Número de guía o tracking
   */
  @Column({ type: 'varchar', length: 100, name: 'numero_guia', nullable: true })
  numeroGuia: string;

  /**
   * Vehículo o placa
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  vehiculo: string;

  /**
   * Conductor
   */
  @Column({ type: 'varchar', length: 150, nullable: true })
  conductor: string;

  /**
   * Documentos adjuntos (JSON)
   */
  @Column({ type: 'jsonb', nullable: true })
  documentos: any;

  /**
   * Observaciones
   */
  @Column({ type: 'text', nullable: true })
  observaciones: string;

  /**
   * Usuario que preparó el despacho
   */
  @Column({ type: 'uuid', name: 'preparado_por', nullable: true })
  preparadoPor: string;

  /**
   * Usuario que autorizó el despacho
   */
  @Column({ type: 'uuid', name: 'autorizado_por', nullable: true })
  autorizadoPor: string;

  /**
   * Campos de auditoría
   */
}
