import { AuditableEntity } from '../../../common/entities/auditable.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Routing } from './routing.entity';

@Entity({ name: 'routing_steps' })
export class RoutingStep extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'routing_id' })
  routingId!: string;

  @ManyToOne(() => Routing, (routing) => routing.steps, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'routing_id' })
  routing!: Routing;

  @Column({ type: 'int' })
  seq!: number;

  @Column({ type: 'varchar', length: 100, name: 'operation_code' })
  operationCode!: string;

  @Column({ type: 'varchar', length: 200, name: 'operation_name' })
  operationName!: string;

  @Column({ type: 'varchar', length: 50, name: 'work_center_code' })
  workCenterCode!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'setup_min' })
  setupMin!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'cycle_min' })
  cycleMin!: number;

  @Column({ type: 'int', default: 1, name: 'qty_per_cycle' })
  qtyPerCycle!: number;

  @Column({ type: 'boolean', default: true })
  mandatory!: boolean;

  @Column({ type: 'text', default: '' })
  notes!: string;
}
