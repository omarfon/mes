import { AuditableEntity } from '../../common/entities/auditable.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany
} from 'typeorm';
import {
  RuleEventType,
  RulePriority,
  RuleStatus,
  RuleScope,
  LogicalOperator
} from '../types/rule-enums';
import type { ConditionGroup, ActionDefinition } from '../types/rule-types';
import { RuleExecution } from './rule-execution.entity';

@Entity({ name: 'rules' })
@Index(['code'], { unique: true })
@Index(['eventType'])
@Index(['status'])
@Index(['scope', 'scopeValue'])
export class Rule extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code!: string;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  // Evento que dispara la regla
  @Column({
    type: 'enum',
    enum: RuleEventType
  })
  eventType!: RuleEventType;

  // Prioridad de ejecución
  @Column({
    type: 'enum',
    enum: RulePriority,
    default: RulePriority.MEDIUM
  })
  priority!: RulePriority;

  // Orden de ejecución (menor número = mayor prioridad)
  @Column({ type: 'int', default: 100 })
  executionOrder!: number;

  // Ámbito de aplicación
  @Column({
    type: 'enum',
    enum: RuleScope,
    default: RuleScope.GLOBAL
  })
  scope!: RuleScope;

  @Column({ type: 'varchar', length: 100, nullable: true })
  scopeValue?: string; // Ej: código de planta, área, máquina, producto, etc.

  // Condiciones (almacenadas como JSON)
  @Column({
    type: 'jsonb',
    nullable: true
  })
  conditions?: ConditionGroup;

  // Operador raíz de condiciones (si hay múltiples grupos)
  @Column({
    type: 'enum',
    enum: LogicalOperator,
    default: LogicalOperator.AND
  })
  conditionsOperator!: LogicalOperator;

  // Acciones a ejecutar
  @Column({
    type: 'jsonb'
  })
  actions!: ActionDefinition[];

  // Estado de la regla
  @Column({
    type: 'enum',
    enum: RuleStatus,
    default: RuleStatus.ACTIVE
  })
  status!: RuleStatus;

  // Control de ejecución
  @Column({ type: 'boolean', default: true })
  enabled!: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'valid_from' })
  validFrom?: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'valid_to' })
  validTo?: Date;

  // Límites de ejecución
  @Column({ type: 'int', nullable: true, name: 'max_executions_per_day' })
  maxExecutionsPerDay?: number;

  @Column({ type: 'int', nullable: true, name: 'cooldown_minutes' })
  cooldownMinutes?: number; // Tiempo mínimo entre ejecuciones

  // Estadísticas
  @Column({ type: 'int', default: 0, name: 'execution_count' })
  executionCount!: number;

  @Column({ type: 'timestamp', nullable: true, name: 'last_executed_at' })
  lastExecutedAt?: Date;

  @Column({ type: 'int', default: 0, name: 'success_count' })
  successCount!: number;

  @Column({ type: 'int', default: 0, name: 'failure_count' })
  failureCount!: number;

  // Metadatos adicionales
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  // Auditoría
  @Column({ type: 'varchar', length: 100, nullable: true, name: 'created_by' })
  createdBy?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'updated_by' })
  updatedBy?: string;

  // Relaciones
  @OneToMany(() => RuleExecution, (execution) => execution.rule)
  executions?: RuleExecution[];

  // Métodos de utilidad
  isValid(): boolean {
    if (!this.enabled || this.status !== RuleStatus.ACTIVE) {
      return false;
    }

    const now = new Date();
    if (this.validFrom && now < this.validFrom) {
      return false;
    }
    if (this.validTo && now > this.validTo) {
      return false;
    }

    return true;
  }

  canExecute(): boolean {
    if (!this.isValid()) {
      return false;
    }

    // Check cooldown
    if (this.cooldownMinutes && this.lastExecutedAt) {
      const cooldownMs = this.cooldownMinutes * 60 * 1000;
      const timeSinceLastExecution = Date.now() - this.lastExecutedAt.getTime();
      if (timeSinceLastExecution < cooldownMs) {
        return false;
      }
    }

    // Check daily limit (esto requeriría consultar las ejecuciones del día)
    // Se implementa en el servicio

    return true;
  }
}
