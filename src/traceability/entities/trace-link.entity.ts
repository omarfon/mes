import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { TraceNode } from './trace-node.entity';

export enum TraceLinkType {
  TRANSFORMATION = 'TRANSFORMATION', // MP -> Intermedio -> Terminado
  CONSUMPTION = 'CONSUMPTION',       // Consumo parcial
  SPLIT = 'SPLIT',                   // Un nodo se divide en varios
  MERGE = 'MERGE',                   // Varios nodos se combinan en uno
  PACKING = 'PACKING',               // Piezas se empacan en cajas
  MOVEMENT = 'MOVEMENT',             // Movimiento entre contenedores / ubicaciones
}

@Entity({ name: 'trace_links' })
export class TraceLink {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'parent_node_id', type: 'uuid' })
  parentNodeId: string;

  @ManyToOne(() => TraceNode, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_node_id' })
  parentNode: TraceNode;

  @Column({ name: 'child_node_id', type: 'uuid' })
  childNodeId: string;

  @ManyToOne(() => TraceNode, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'child_node_id' })
  childNode: TraceNode;

  @Column({
    type: 'enum',
    enum: TraceLinkType,
    default: TraceLinkType.TRANSFORMATION,
  })
  type: TraceLinkType;

  /**
   * Cantidad del nodo padre implicada en esta relación (si aplica)
   */
  @Column({ name: 'quantity_used', type: 'numeric', nullable: true })
  quantityUsed?: number | null;

  /**
   * Referencia opcional al proceso/operación que genera el vínculo
   * Ej: ID de ProductionOrderOperation
   */
  @Column({ name: 'process_ref_id', type: 'uuid', nullable: true })
  processRefId?: string | null;

  @Column({ name: 'process_ref_type', type: 'varchar', length: 50, nullable: true })
  processRefType?: string | null; // ej: 'PO_OPERATION'

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
