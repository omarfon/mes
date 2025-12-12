import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Route } from './route.entity';
import { WorkCenter } from '../../machines/entities/work-center.entity';
import { Machine } from 'src/master-data/machines/entities/machines.entity';


@Entity({ name: 'route_operations' })
export class RouteOperation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Ruta a la que pertenece esta operación
   */
  @Column({ name: 'route_id', type: 'uuid' })
  routeId: string;

  @ManyToOne(() => Route, (route) => route.operations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'route_id' })
  route: Route;

  /**
   * Número de secuencia en la ruta
   * Ej: 10, 20, 30 para permitir huecos y reorden
   */
  @Column({ type: 'int' })
  sequence: number;

  /**
   * Descripción / nombre de la operación
   * Ej: "Cardado", "Hilatura", "Bobinado"
   */
  @Column({ type: 'varchar', length: 150 })
  name: string;

  /**
   * Centro de trabajo principal
   */
  @Column({ name: 'work_center_id', type: 'uuid', nullable: true })
  workCenterId?: string | null;

  @ManyToOne(() => WorkCenter, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'work_center_id' })
  workCenter?: WorkCenter | null;

  /**
   * Máquina sugerida (opcional)
   */
  @Column({ name: 'machine_id', type: 'uuid', nullable: true })
  machineId?: string | null;

  @ManyToOne(() => Machine, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'machine_id' })
  machine?: Machine | null;

  /**
   * Tiempo estándar de la operación (minutos por unidad de referencia)
   */
  @Column({ name: 'std_time_min', type: 'numeric', nullable: true })
  standardTimeMinutes?: number | null;

  /**
   * ¿Permite solapamiento con la siguiente operación?
   */
  @Column({ name: 'overlap_allowed', type: 'boolean', default: false })
  overlapAllowed: boolean;

  /**
   * Comentarios / notas
   */
  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
