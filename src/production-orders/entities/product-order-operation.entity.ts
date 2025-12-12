import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductionOrder } from './production-order.entity';
import { Machine } from 'src/master-data/machines/entities/machines.entity';
import { WorkCenter } from 'src/master-data/machines/entities/work-center.entity';
import { RouteOperation } from 'src/master-data/routes/entities/route-operation.entity';


export enum ProductionOrderOperationStatus {
  PENDING = 'PENDING',
  READY = 'READY',
  IN_PROGRESS = 'IN_PROGRESS',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED',
}

@Entity({ name: 'production_order_operations' })
export class ProductionOrderOperation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'production_order_id', type: 'uuid' })
  productionOrderId: string;

  @ManyToOne(
    () => ProductionOrder,
    (po) => po.operations,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'production_order_id' })
  productionOrder: ProductionOrder;

  /**
   * Referencia a la operación de la ruta base
   */
  @Column({ name: 'route_operation_id', type: 'uuid', nullable: true })
  routeOperationId?: string | null;

  @ManyToOne(() => RouteOperation, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'route_operation_id' })
  routeOperation?: RouteOperation | null;

  /**
   * Secuencia (10, 20, 30...) para mantener orden y permitir huecos
   */
  @Column({ type: 'int' })
  sequence: number;

  /**
   * Nombre de la operación en el contexto de la OP
   * (copiado de RouteOperation)
   */
  @Column({ type: 'varchar', length: 150 })
  name: string;

  /**
   * Centro de trabajo asignado
   */
  @Column({ name: 'work_center_id', type: 'uuid', nullable: true })
  workCenterId?: string | null;

  @ManyToOne(() => WorkCenter, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'work_center_id' })
  workCenter?: WorkCenter | null;

  /**
   * Máquina sugerida / asignada
   */
  @Column({ name: 'machine_id', type: 'uuid', nullable: true })
  machineId?: string | null;

  @ManyToOne(() => Machine, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'machine_id' })
  machine?: Machine | null;

  /**
   * Tiempo estándar en minutos para esta OP
   * (copiado de RouteOperation, pero se puede ajustar)
   */
  @Column({ name: 'std_time_min', type: 'numeric', nullable: true })
  standardTimeMinutes?: number | null;

  /**
   * Estado de la operación
   */
  @Column({
    type: 'enum',
    enum: ProductionOrderOperationStatus,
    default: ProductionOrderOperationStatus.PENDING,
  })
  status: ProductionOrderOperationStatus;

  /**
   * Fechas / horas reales de ejecución
   */
  @Column({ name: 'actual_start', type: 'timestamp', nullable: true })
  actualStart?: Date | null;

  @Column({ name: 'actual_end', type: 'timestamp', nullable: true })
  actualEnd?: Date | null;

  /**
   * Cantidades producidas asociadas a esta operación (opcional, simplificado)
   */
  @Column({ name: 'quantity_good', type: 'numeric', nullable: true })
  quantityGood?: number | null;

  @Column({ name: 'quantity_scrap', type: 'numeric', nullable: true })
  quantityScrap?: number | null;

  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
