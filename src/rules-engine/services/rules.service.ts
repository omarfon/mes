import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Rule } from '../entities/rule.entity';
import { RuleExecution } from '../entities/rule-execution.entity';
import { CreateRuleDto, UpdateRuleDto } from '../dto';
import {
  RuleEventType,
  ExecutionResult,
  RuleStatus,
} from '../types/rule-enums';
import {
  RuleContext,
  RuleExecutionResult,
} from '../types/rule-types';
import { ConditionEvaluator } from '../evaluators/condition.evaluator';
import { ActionExecutor } from '../evaluators/action.executor';

@Injectable()
export class RulesService {
  private readonly logger = new Logger(RulesService.name);

  constructor(
    @InjectRepository(Rule)
    private readonly rulesRepository: Repository<Rule>,
    @InjectRepository(RuleExecution)
    private readonly executionsRepository: Repository<RuleExecution>,
    private readonly conditionEvaluator: ConditionEvaluator,
    private readonly actionExecutor: ActionExecutor,
  ) {}

  /**
   * Crea una nueva regla
   */
  async create(dto: CreateRuleDto): Promise<Rule> {
    const rule = this.rulesRepository.create({
      ...dto,
      validFrom: dto.validFrom ? new Date(dto.validFrom) : undefined,
      validTo: dto.validTo ? new Date(dto.validTo) : undefined,
    });

    return this.rulesRepository.save(rule);
  }

  /**
   * Actualiza una regla
   */
  async update(id: string, dto: UpdateRuleDto): Promise<Rule> {
    const rule = await this.findOne(id);

    Object.assign(rule, {
      ...dto,
      validFrom: dto.validFrom ? new Date(dto.validFrom) : rule.validFrom,
      validTo: dto.validTo ? new Date(dto.validTo) : rule.validTo,
    });

    return this.rulesRepository.save(rule);
  }

  /**
   * Encuentra una regla por ID
   */
  async findOne(id: string): Promise<Rule> {
    const rule = await this.rulesRepository.findOne({ where: { id } });
    if (!rule) {
      throw new NotFoundException(`Rule with ID ${id} not found`);
    }
    return rule;
  }

  /**
   * Encuentra una regla por código
   */
  async findByCode(code: string): Promise<Rule> {
    const rule = await this.rulesRepository.findOne({ where: { code } });
    if (!rule) {
      throw new NotFoundException(`Rule with code ${code} not found`);
    }
    return rule;
  }

  /**
   * Lista todas las reglas
   */
  async findAll(filters?: {
    eventType?: RuleEventType;
    status?: RuleStatus;
    scope?: string;
    enabled?: boolean;
  }): Promise<Rule[]> {
    const query = this.rulesRepository.createQueryBuilder('rule');

    if (filters?.eventType) {
      query.andWhere('rule.eventType = :eventType', {
        eventType: filters.eventType,
      });
    }

    if (filters?.status) {
      query.andWhere('rule.status = :status', { status: filters.status });
    }

    if (filters?.scope) {
      query.andWhere('rule.scope = :scope', { scope: filters.scope });
    }

    if (filters?.enabled !== undefined) {
      query.andWhere('rule.enabled = :enabled', { enabled: filters.enabled });
    }

    query.orderBy('rule.executionOrder', 'ASC');
    query.addOrderBy('rule.priority', 'DESC');

    return query.getMany();
  }

  /**
   * Encuentra reglas aplicables a un evento
   */
  async findApplicableRules(
    eventType: RuleEventType,
    context: Partial<RuleContext>,
  ): Promise<Rule[]> {
    const query = this.rulesRepository
      .createQueryBuilder('rule')
      .where('rule.eventType = :eventType', { eventType })
      .andWhere('rule.enabled = :enabled', { enabled: true })
      .andWhere('rule.status = :status', { status: RuleStatus.ACTIVE });

    // Filtrar por scope
    query.andWhere(
      `(
        rule.scope = 'GLOBAL' OR
        (rule.scope = 'PLANT' AND rule.scopeValue = :plantCode) OR
        (rule.scope = 'AREA' AND rule.scopeValue = :areaCode) OR
        (rule.scope = 'WORK_CENTER' AND rule.scopeValue = :workCenterCode) OR
        (rule.scope = 'MACHINE' AND rule.scopeValue = :machineCode) OR
        (rule.scope = 'PRODUCT' AND rule.scopeValue = :productCode) OR
        (rule.scope = 'ORDER_TYPE' AND rule.scopeValue = :orderTypeCode)
      )`,
      {
        plantCode: context.plantCode || null,
        areaCode: context.areaCode || null,
        workCenterCode: context.workCenterCode || null,
        machineCode: context.machineCode || null,
        productCode: context.productCode || null,
        orderTypeCode: context.orderTypeCode || null,
      },
    );

    // Filtrar por fechas de validez
    const now = new Date();
    query.andWhere(
      '(rule.validFrom IS NULL OR rule.validFrom <= :now)',
      { now },
    );
    query.andWhere(
      '(rule.validTo IS NULL OR rule.validTo >= :now)',
      { now },
    );

    // Ordenar por prioridad
    query.orderBy('rule.executionOrder', 'ASC');
    query.addOrderBy('rule.priority', 'DESC');

    return query.getMany();
  }

  /**
   * Dispara reglas para un evento
   */
  async triggerEvent(
    eventType: RuleEventType,
    context: RuleContext,
  ): Promise<RuleExecutionResult[]> {
    this.logger.log(
      `Triggering event ${eventType} for ${context.entityType} ${context.entityId}`,
    );

    // Encontrar reglas aplicables
    const rules = await this.findApplicableRules(eventType, context);
    
    if (rules.length === 0) {
      this.logger.debug(`No rules found for event ${eventType}`);
      return [];
    }

    this.logger.log(`Found ${rules.length} applicable rules`);

    // Ejecutar cada regla
    const results: RuleExecutionResult[] = [];
    for (const rule of rules) {
      try {
        const result = await this.executeRule(rule, context);
        results.push(result);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.logger.error(
          `Error executing rule ${rule.code}: ${errorMessage}`,
        );
      }
    }

    return results;
  }

  /**
   * Ejecuta una regla específica
   */
  async executeRule(
    rule: Rule,
    context: RuleContext,
  ): Promise<RuleExecutionResult> {
    const startTime = Date.now();
    
    this.logger.log(`Executing rule ${rule.code}: ${rule.name}`);

    // Verificar si puede ejecutarse (cooldown, límites diarios, etc.)
    if (!rule.canExecute()) {
      this.logger.debug(`Rule ${rule.code} cannot execute (cooldown or limits)`);
      return this.createSkippedResult(rule, context, startTime);
    }

    // Verificar límite diario
    if (rule.maxExecutionsPerDay) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayExecutions = await this.executionsRepository.count({
        where: {
          ruleId: rule.id,
          executedAt: Between(today, tomorrow),
        },
      });

      if (todayExecutions >= rule.maxExecutionsPerDay) {
        this.logger.debug(
          `Rule ${rule.code} reached daily execution limit (${rule.maxExecutionsPerDay})`,
        );
        return this.createSkippedResult(rule, context, startTime);
      }
    }

    const result: RuleExecutionResult = {
      ruleId: rule.id,
      ruleCode: rule.code,
      ruleName: rule.name,
      triggered: true,
      conditionsPassed: false,
      actionsExecuted: false,
      conditionResults: [],
      actionResults: [],
      startedAt: new Date(startTime),
      completedAt: new Date(),
      duration: 0,
      context: {
        eventType: context.eventType,
        entityType: context.entityType,
        entityId: context.entityId,
      },
    };

    try {
      // Evaluar condiciones si existen
      if (rule.conditions) {
        const conditionResult = await this.conditionEvaluator.evaluateConditionGroup(
          rule.conditions,
          context,
        );
        
        result.conditionsPassed = conditionResult.passed;
        result.conditionResults = conditionResult.results;

        this.logger.debug(
          `Rule ${rule.code} conditions: ${conditionResult.passed ? 'PASSED' : 'FAILED'}`,
        );
      } else {
        // Sin condiciones = siempre pasa
        result.conditionsPassed = true;
      }

      // Ejecutar acciones si las condiciones pasaron
      if (result.conditionsPassed) {
        this.logger.log(`Executing ${rule.actions.length} actions for rule ${rule.code}`);
        
        result.actionResults = await this.actionExecutor.executeActions(
          rule.actions,
          context,
        );
        
        result.actionsExecuted = result.actionResults.every((r) => r.success);

        this.logger.log(
          `Rule ${rule.code} actions: ${result.actionsExecuted ? 'SUCCESS' : 'PARTIAL/FAILED'}`,
        );
      }

      // Actualizar estadísticas de la regla
      await this.updateRuleStats(rule, result.actionsExecuted);

      // Guardar ejecución en historial
      await this.saveExecution(rule, context, result);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorObj = error instanceof Error ? error : new Error(String(error));
      
      this.logger.error(`Error in rule ${rule.code}: ${errorMessage}`);
      result.error = errorMessage;
      
      await this.updateRuleStats(rule, false);
      await this.saveExecution(rule, context, result, errorObj);
    }

    result.completedAt = new Date();
    result.duration = Date.now() - startTime;

    return result;
  }

  /**
   * Elimina una regla (soft delete)
   */
  async remove(id: string): Promise<void> {
    const rule = await this.findOne(id);
    await this.rulesRepository.softRemove(rule);
  }

  /**
   * Habilita/deshabilita una regla
   */
  async toggleEnabled(id: string, enabled: boolean): Promise<Rule> {
    const rule = await this.findOne(id);
    rule.enabled = enabled;
    return this.rulesRepository.save(rule);
  }

  /**
   * Obtiene el historial de ejecuciones
   */
  async getExecutionHistory(
    filters?: {
      ruleId?: string;
      ruleCode?: string;
      eventType?: string;
      result?: ExecutionResult;
      from?: Date;
      to?: Date;
      limit?: number;
    },
  ): Promise<RuleExecution[]> {
    const query = this.executionsRepository.createQueryBuilder('execution');

    if (filters?.ruleId) {
      query.andWhere('execution.ruleId = :ruleId', { ruleId: filters.ruleId });
    }

    if (filters?.ruleCode) {
      query.andWhere('execution.ruleCode = :ruleCode', {
        ruleCode: filters.ruleCode,
      });
    }

    if (filters?.eventType) {
      query.andWhere('execution.eventType = :eventType', {
        eventType: filters.eventType,
      });
    }

    if (filters?.result) {
      query.andWhere('execution.result = :result', { result: filters.result });
    }

    if (filters?.from) {
      query.andWhere('execution.executedAt >= :from', { from: filters.from });
    }

    if (filters?.to) {
      query.andWhere('execution.executedAt <= :to', { to: filters.to });
    }

    query.orderBy('execution.executedAt', 'DESC');
    
    if (filters?.limit) {
      query.take(filters.limit);
    } else {
      query.take(100);
    }

    return query.getMany();
  }

  /**
   * Obtiene estadísticas de una regla
   */
  async getRuleStats(ruleId: string): Promise<{
    totalExecutions: number;
    successCount: number;
    failureCount: number;
    successRate: number;
    lastExecutedAt?: Date;
    avgDuration: number;
  }> {
    const rule = await this.findOne(ruleId);

    const executions = await this.executionsRepository
      .createQueryBuilder('execution')
      .where('execution.ruleId = :ruleId', { ruleId })
      .select('AVG(execution.durationMs)', 'avgDuration')
      .getRawOne();

    const avgDuration = parseFloat(executions.avgDuration) || 0;
    const successRate =
      rule.executionCount > 0
        ? (rule.successCount / rule.executionCount) * 100
        : 0;

    return {
      totalExecutions: rule.executionCount,
      successCount: rule.successCount,
      failureCount: rule.failureCount,
      successRate: Math.round(successRate * 100) / 100,
      lastExecutedAt: rule.lastExecutedAt,
      avgDuration: Math.round(avgDuration),
    };
  }

  // ========== Métodos privados ==========

  private async updateRuleStats(rule: Rule, success: boolean): Promise<void> {
    rule.executionCount++;
    if (success) {
      rule.successCount++;
    } else {
      rule.failureCount++;
    }
    rule.lastExecutedAt = new Date();

    await this.rulesRepository.save(rule);
  }

  private async saveExecution(
    rule: Rule,
    context: RuleContext,
    result: RuleExecutionResult,
    error?: Error,
  ): Promise<void> {
    const execution = this.executionsRepository.create({
      ruleId: rule.id,
      ruleCode: rule.code,
      ruleName: rule.name,
      eventType: context.eventType,
      entityType: context.entityType,
      entityId: context.entityId,
      context: {
        eventType: context.eventType,
        entityType: context.entityType,
        entityId: context.entityId,
        plantCode: context.plantCode,
        areaCode: context.areaCode,
      },
      conditionsPassed: result.conditionsPassed,
      conditionResults: result.conditionResults,
      actionsExecuted: result.actionsExecuted,
      actionResults: result.actionResults,
      result: this.determineExecutionResult(result, error),
      errorMessage: error?.message,
      errorStack: error?.stack,
      startedAt: result.startedAt,
      completedAt: result.completedAt,
      durationMs: result.duration,
      executedBy: context.userId,
    });

    await this.executionsRepository.save(execution);
  }

  private determineExecutionResult(
    result: RuleExecutionResult,
    error?: Error,
  ): ExecutionResult {
    if (error) return ExecutionResult.ERROR;
    if (!result.triggered) return ExecutionResult.SKIPPED;
    if (!result.conditionsPassed) return ExecutionResult.SKIPPED;
    if (result.actionsExecuted) return ExecutionResult.SUCCESS;
    return ExecutionResult.FAILED;
  }

  private createSkippedResult(
    rule: Rule,
    context: RuleContext,
    startTime: number,
  ): RuleExecutionResult {
    return {
      ruleId: rule.id,
      ruleCode: rule.code,
      ruleName: rule.name,
      triggered: false,
      conditionsPassed: false,
      actionsExecuted: false,
      conditionResults: [],
      actionResults: [],
      startedAt: new Date(startTime),
      completedAt: new Date(),
      duration: Date.now() - startTime,
      context: {
        eventType: context.eventType,
        entityType: context.entityType,
        entityId: context.entityId,
      },
    };
  }
}
