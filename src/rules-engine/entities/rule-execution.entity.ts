import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ExecutionResult } from '../types/rule-enums';
import {
  RuleContext,
  ConditionEvaluationResult,
  ActionExecutionResult,
} from '../types/rule-types';
import { Rule } from './rule.entity';

@Entity({ name: 'rule_executions' })
@Index(['ruleId', 'executedAt'])
@Index(['eventType'])
@Index(['result'])
@Index(['executedAt'])
export class RuleExecution {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'rule_id' })
  ruleId!: string;

  @Column({ type: 'varchar', length: 50, name: 'rule_code' })
  ruleCode!: string;

  @Column({ type: 'varchar', length: 200, name: 'rule_name' })
  ruleName!: string;

  // Contexto de ejecución
  @Column({ type: 'varchar', length: 100, name: 'event_type' })
  eventType!: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'entity_type' })
  entityType?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'entity_id' })
  entityId?: string;

  @Column({ type: 'jsonb', nullable: true })
  context?: Partial<RuleContext>;

  // Resultados de evaluación
  @Column({ type: 'boolean', name: 'conditions_passed' })
  conditionsPassed!: boolean;

  @Column({ type: 'jsonb', nullable: true, name: 'condition_results' })
  conditionResults?: ConditionEvaluationResult[];

  // Resultados de acciones
  @Column({ type: 'boolean', name: 'actions_executed' })
  actionsExecuted!: boolean;

  @Column({ type: 'jsonb', nullable: true, name: 'action_results' })
  actionResults?: ActionExecutionResult[];

  // Resultado general
  @Column({
    type: 'enum',
    enum: ExecutionResult,
  })
  result!: ExecutionResult;

  @Column({ type: 'text', nullable: true, name: 'error_message' })
  errorMessage?: string;

  @Column({ type: 'text', nullable: true, name: 'error_stack' })
  errorStack?: string;

  // Tiempos
  @Column({ type: 'timestamp', name: 'started_at' })
  startedAt!: Date;

  @Column({ type: 'timestamp', name: 'completed_at' })
  completedAt!: Date;

  @Column({ type: 'int', name: 'duration_ms' })
  durationMs!: number;

  // Metadatos
  @Column({ type: 'varchar', length: 100, nullable: true, name: 'executed_by' })
  executedBy?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn({ name: 'executed_at' })
  executedAt!: Date;

  // Relaciones
  @ManyToOne(() => Rule, (rule) => rule.executions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rule_id' })
  rule?: Rule;
}
