import { WorkCenter } from 'src/master-data/machines/entities/work-center.entity';
import { Product } from 'src/master-data/products/entities/product.entity';
import { Route } from 'src/master-data/routes/entities/route.entity';
import { Shift } from 'src/master-data/schift/entities/schift.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { ProductionOrderOperation } from './product-order-operation.entity';


export enum ProductionOrderStatus {
  PLANNED = 'PLANNED',       // Planificada
  RELEASED = 'RELEASED',     // Liberada para producción
  IN_PROGRESS = 'IN_PROGRESS',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export enum ProductionOrderPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

@Entity({ name: 'production_orders' })
@Index(['code'], { unique: true })
export class ProductionOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Código de la OP (único en el MES)
   * Ej: OP-2025-000123
   */
  @Column({ type: 'varchar', length: 50 })
  code: string;

  /**
   * Código externo (ERP u otro sistema)
   */
  @Column({ name: 'external_code', type: 'varchar', length: 50, nullable: true })
  externalCode?: string | null;

  /**
   * Producto a fabricar
   */
  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  /**
   * Ruta de fabricación utilizada
   */
  @Column({ name: 'route_id', type: 'uuid' })
  routeId: string;

  @ManyToOne(() => Route, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'route_id' })
  route: Route;

  /**
   * Cantidad planificada
   */
  @Column({ name: 'quantity_planned', type: 'numeric' })
  quantityPlanned: number;

  /**
   * Cantidad producida (actualizada con los eventos de planta)
   */
  @Column({ name: 'quantity_produced', type: 'numeric', default: 0 })
  quantityProduced: number;

  /**
   * Unidad de medida (copiada del producto para referencia rápida)
   */
  @Column({ name: 'unit_of_measure', type: 'varchar', length: 20 })
  unitOfMeasure: string;

  /**
   * Estado de la OP
   */
  @Column({
    type: 'enum',
    enum: ProductionOrderStatus,
    default: ProductionOrderStatus.PLANNED,
  })
  status: ProductionOrderStatus;

  /**
   * Prioridad
   */
  @Column({
    type: 'enum',
    enum: ProductionOrderPriority,
    default: ProductionOrderPriority.NORMAL,
  })
  priority: ProductionOrderPriority;

  /**
   * Centro de trabajo principal (opcional, para visualizar en panel)
   */
  @Column({ name: 'main_work_center_id', type: 'uuid', nullable: true })
  mainWorkCenterId?: string | null;

  @ManyToOne(() => WorkCenter, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'main_work_center_id' })
  mainWorkCenter?: WorkCenter | null;

  /**
   * Turno objetivo (para planificación por turno)
   */
  @Column({ name: 'shift_id', type: 'uuid', nullable: true })
  shiftId?: string | null;

  @ManyToOne(() => Shift, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'shift_id' })
  shift?: Shift | null;

  /**
   * Fechas planificadas
   */
  @Column({ name: 'planned_start_date', type: 'timestamp', nullable: true })
  plannedStartDate?: Date | null;

  @Column({ name: 'planned_end_date', type: 'timestamp', nullable: true })
  plannedEndDate?: Date | null;

  /**
   * Fechas reales
   */
  @Column({ name: 'actual_start_date', type: 'timestamp', nullable: true })
  actualStartDate?: Date | null;

  @Column({ name: 'actual_end_date', type: 'timestamp', nullable: true })
  actualEndDate?: Date | null;

  /**
   * Fecha de entrega comprometida
   */
  @Column({ name: 'due_date', type: 'date', nullable: true })
  dueDate?: Date | null;

  /**
   * Comentarios / notas
   */
  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  /**
   * Operaciones de la OP (derivadas de la Route)
   */
  @OneToMany(
    () => ProductionOrderOperation,
    (op) => op.productionOrder,
    { cascade: true },
  )
  operations: ProductionOrderOperation[];

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
