import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { Product } from '../../master-data/products/entities/product.entity';
import { ProductionOrder } from '../../production-orders/entities/production-order.entity';

export enum TraceNodeType {
  MATERIAL_LOT = 'MATERIAL_LOT',    // Lote de algodón, lote de hilo, etc.
  SEMI_FINISHED_LOT = 'SEMI_FINISHED_LOT', // Tela, partes intermedias
  FINISHED_GOOD = 'FINISHED_GOOD',  // Prenda terminada (por lote)
  ITEM_SERIAL = 'ITEM_SERIAL',      // Unidad con serie (prenda individual)
  CONTAINER = 'CONTAINER',          // Caja, pallet
  PROCESS_EXECUTION = 'PROCESS_EXECUTION', // Ejecución de operación/proceso
}

@Entity({ name: 'trace_nodes' })
@Index(['code'], { unique: true })
export class TraceNode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Código identificador del nodo
   * Puede ser: código de lote, código de prenda, código de caja, etc.
   */
  @Column({ type: 'varchar', length: 80 })
  code: string;

  /**
   * Tipo del nodo (lote, pieza, prenda, contenedor, proceso, etc.)
   */
  @Column({
    type: 'enum',
    enum: TraceNodeType,
  })
  type: TraceNodeType;

  /**
   * Producto asociado (para algo físico)
   * Para PROCESS_EXECUTION puede ser opcional
   */
  @Column({ name: 'product_id', type: 'uuid', nullable: true })
  productId?: string | null;

  @ManyToOne(() => Product, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'product_id' })
  product?: Product | null;

  /**
   * OP en la que se generó este nodo (si aplica)
   */
  @Column({ name: 'production_order_id', type: 'uuid', nullable: true })
  productionOrderId?: string | null;

  @ManyToOne(() => ProductionOrder, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'production_order_id' })
  productionOrder?: ProductionOrder | null;

  /**
   * Cantidad asociada (para nodos cuantificables)
   * Ej: 100 KG de algodón, 500 prendas, etc.
   * Para ITEM_SERIAL puedes usar quantity = 1
   */
  @Column({ type: 'numeric', nullable: true })
  quantity?: number | null;

  /**
   * Unidad de medida (KG, M, UNID, etc.)
   */
  @Column({ name: 'unit_of_measure', type: 'varchar', length: 20, nullable: true })
  unitOfMeasure?: string | null;

  /**
   * Metadatos flexibles (JSON) para guardar cosas específicas:
   * talla, color, lote proveedor, etc.
   */
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any> | null;

  /**
   * Fechas
   */
  @Column({ name: 'manufacturing_date', type: 'date', nullable: true })
  manufacturingDate?: Date | null;

  @Column({ name: 'expiration_date', type: 'date', nullable: true })
  expirationDate?: Date | null;

  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date | null;
}
