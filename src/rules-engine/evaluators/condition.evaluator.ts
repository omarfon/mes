import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  RuleConditionType,
  LogicalOperator,
} from '../types/rule-enums';
import {
  RuleContext,
  ConditionDefinition,
  ConditionGroup,
  ConditionEvaluationResult,
} from '../types/rule-types';

@Injectable()
export class ConditionEvaluator {
  private readonly logger = new Logger(ConditionEvaluator.name);

  constructor(
    @InjectRepository(Repository)
    private readonly repository: Repository<any>,
  ) {}

  /**
   * Evalúa un grupo de condiciones
   */
  async evaluateConditionGroup(
    group: ConditionGroup,
    context: RuleContext,
  ): Promise<{ passed: boolean; results: ConditionEvaluationResult[] }> {
    const results: ConditionEvaluationResult[] = [];
    let passed = false;

    try {
      // Evaluar cada condición del grupo
      const evaluations = await Promise.all(
        group.conditions.map(async (condition) => {
          if (this.isConditionGroup(condition)) {
            // Es un sub-grupo, evaluar recursivamente
            return this.evaluateConditionGroup(condition as ConditionGroup, context);
          } else {
            // Es una condición individual
            const result = await this.evaluateCondition(
              condition as ConditionDefinition,
              context,
            );
            return { passed: result.passed, results: [result] };
          }
        }),
      );

      // Combinar resultados según el operador
      const allPassed = evaluations.map((e) => e.passed);
      evaluations.forEach((e) => results.push(...e.results));

      switch (group.operator) {
        case LogicalOperator.AND:
          passed = allPassed.every((p) => p);
          break;
        case LogicalOperator.OR:
          passed = allPassed.some((p) => p);
          break;
        case LogicalOperator.NOT:
          passed = !allPassed[0];
          break;
        default:
          passed = false;
      }
    } catch (error) {
      this.logger.error(`Error evaluating condition group: ${error.message}`);
      passed = false;
    }

    return { passed, results };
  }

  /**
   * Evalúa una condición individual
   */
  async evaluateCondition(
    condition: ConditionDefinition,
    context: RuleContext,
  ): Promise<ConditionEvaluationResult> {
    const result: ConditionEvaluationResult = {
      type: condition.type,
      passed: false,
      evaluatedAt: new Date(),
    };

    try {
      switch (condition.type) {
        // Comparaciones de campos
        case RuleConditionType.FIELD_EQUALS:
          result.passed = await this.evaluateFieldEquals(condition, context, result);
          break;
        case RuleConditionType.FIELD_NOT_EQUALS:
          result.passed = !(await this.evaluateFieldEquals(condition, context, result));
          break;
        case RuleConditionType.FIELD_GREATER_THAN:
          result.passed = await this.evaluateFieldComparison(condition, context, result, '>');
          break;
        case RuleConditionType.FIELD_LESS_THAN:
          result.passed = await this.evaluateFieldComparison(condition, context, result, '<');
          break;
        case RuleConditionType.FIELD_GREATER_OR_EQUAL:
          result.passed = await this.evaluateFieldComparison(condition, context, result, '>=');
          break;
        case RuleConditionType.FIELD_LESS_OR_EQUAL:
          result.passed = await this.evaluateFieldComparison(condition, context, result, '<=');
          break;
        case RuleConditionType.FIELD_IN:
          result.passed = await this.evaluateFieldIn(condition, context, result);
          break;
        case RuleConditionType.FIELD_NOT_IN:
          result.passed = !(await this.evaluateFieldIn(condition, context, result));
          break;
        case RuleConditionType.FIELD_CONTAINS:
          result.passed = await this.evaluateFieldContains(condition, context, result);
          break;
        case RuleConditionType.FIELD_IS_NULL:
          result.passed = await this.evaluateFieldIsNull(condition, context, result);
          break;
        case RuleConditionType.FIELD_IS_NOT_NULL:
          result.passed = !(await this.evaluateFieldIsNull(condition, context, result));
          break;

        // Condiciones de estado
        case RuleConditionType.HAS_PENDING_INSPECTIONS:
          result.passed = await this.evaluateHasPendingInspections(context, result);
          break;
        case RuleConditionType.HAS_ACTIVE_ALERTS:
          result.passed = await this.evaluateHasActiveAlerts(context, result);
          break;
        case RuleConditionType.IS_LOT_BLOCKED:
          result.passed = await this.evaluateIsLotBlocked(context, result);
          break;
        case RuleConditionType.IS_MACHINE_AVAILABLE:
          result.passed = await this.evaluateIsMachineAvailable(context, result);
          break;

        // Condiciones de tiempo
        case RuleConditionType.DURATION_EXCEEDED:
          result.passed = await this.evaluateDurationExceeded(condition, context, result);
          break;
        case RuleConditionType.WITHIN_TIME_RANGE:
          result.passed = await this.evaluateWithinTimeRange(condition, context, result);
          break;
        case RuleConditionType.WEEKDAY_IS:
          result.passed = await this.evaluateWeekdayIs(condition, context, result);
          break;

        // Condiciones de porcentaje
        case RuleConditionType.PERCENTAGE_EXCEEDS:
          result.passed = await this.evaluatePercentageExceeds(condition, context, result);
          break;
        case RuleConditionType.PERCENTAGE_BELOW:
          result.passed = !(await this.evaluatePercentageExceeds(condition, context, result));
          break;

        // Custom
        case RuleConditionType.CUSTOM_QUERY:
          result.passed = await this.evaluateCustomQuery(condition, context, result);
          break;

        default:
          this.logger.warn(`Unsupported condition type: ${condition.type}`);
          result.passed = false;
          result.message = `Unsupported condition type: ${condition.type}`;
      }
    } catch (error) {
      this.logger.error(`Error evaluating condition ${condition.type}: ${error.message}`);
      result.passed = false;
      result.message = `Error: ${error.message}`;
    }

    return result;
  }

  // ========== Evaluadores específicos ==========

  private async evaluateFieldEquals(
    condition: ConditionDefinition,
    context: RuleContext,
    result: ConditionEvaluationResult,
  ): Promise<boolean> {
    const actualValue = this.getFieldValue(condition.field!, context);
    result.actualValue = actualValue;
    result.expectedValue = condition.value;
    return actualValue === condition.value;
  }

  private async evaluateFieldComparison(
    condition: ConditionDefinition,
    context: RuleContext,
    result: ConditionEvaluationResult,
    operator: string,
  ): Promise<boolean> {
    const actualValue = this.getFieldValue(condition.field!, context);
    const expectedValue = condition.value;
    
    result.actualValue = actualValue;
    result.expectedValue = expectedValue;

    if (actualValue === null || actualValue === undefined) return false;

    switch (operator) {
      case '>':
        return Number(actualValue) > Number(expectedValue);
      case '<':
        return Number(actualValue) < Number(expectedValue);
      case '>=':
        return Number(actualValue) >= Number(expectedValue);
      case '<=':
        return Number(actualValue) <= Number(expectedValue);
      default:
        return false;
    }
  }

  private async evaluateFieldIn(
    condition: ConditionDefinition,
    context: RuleContext,
    result: ConditionEvaluationResult,
  ): Promise<boolean> {
    const actualValue = this.getFieldValue(condition.field!, context);
    result.actualValue = actualValue;
    result.expectedValue = condition.values;
    return condition.values?.includes(actualValue) ?? false;
  }

  private async evaluateFieldContains(
    condition: ConditionDefinition,
    context: RuleContext,
    result: ConditionEvaluationResult,
  ): Promise<boolean> {
    const actualValue = this.getFieldValue(condition.field!, context);
    result.actualValue = actualValue;
    result.expectedValue = condition.value;
    
    if (typeof actualValue === 'string') {
      return actualValue.includes(String(condition.value));
    }
    if (Array.isArray(actualValue)) {
      return actualValue.includes(condition.value);
    }
    return false;
  }

  private async evaluateFieldIsNull(
    condition: ConditionDefinition,
    context: RuleContext,
    result: ConditionEvaluationResult,
  ): Promise<boolean> {
    const actualValue = this.getFieldValue(condition.field!, context);
    result.actualValue = actualValue;
    return actualValue === null || actualValue === undefined;
  }

  private async evaluateHasPendingInspections(
    context: RuleContext,
    result: ConditionEvaluationResult,
  ): Promise<boolean> {
    // TODO: Consultar tabla de inspecciones
    // Ejemplo: SELECT COUNT(*) FROM inspections WHERE order_id = ? AND status = 'PENDING'
    try {
      const count = await this.repository.query(
        `SELECT COUNT(*) as count FROM inspections 
         WHERE entity_type = $1 AND entity_id = $2 AND status = 'PENDING' AND deleted_at IS NULL`,
        [context.entityType, context.entityId],
      );
      const hasPending = parseInt(count[0]?.count || '0') > 0;
      result.actualValue = hasPending;
      return hasPending;
    } catch (error) {
      this.logger.warn(`Could not check pending inspections: ${error.message}`);
      return false;
    }
  }

  private async evaluateHasActiveAlerts(
    context: RuleContext,
    result: ConditionEvaluationResult,
  ): Promise<boolean> {
    // TODO: Consultar tabla de alertas
    try {
      const count = await this.repository.query(
        `SELECT COUNT(*) as count FROM alerts 
         WHERE entity_type = $1 AND entity_id = $2 AND status = 'ACTIVE' AND deleted_at IS NULL`,
        [context.entityType, context.entityId],
      );
      const hasActive = parseInt(count[0]?.count || '0') > 0;
      result.actualValue = hasActive;
      return hasActive;
    } catch (error) {
      this.logger.warn(`Could not check active alerts: ${error.message}`);
      return false;
    }
  }

  private async evaluateIsLotBlocked(
    context: RuleContext,
    result: ConditionEvaluationResult,
  ): Promise<boolean> {
    // TODO: Consultar estado del lote
    try {
      const lot = await this.repository.query(
        `SELECT status FROM material_lots WHERE lot_number = $1 AND deleted_at IS NULL`,
        [context.entityId],
      );
      const isBlocked = lot[0]?.status === 'BLOCKED';
      result.actualValue = isBlocked;
      return isBlocked;
    } catch (error) {
      this.logger.warn(`Could not check lot status: ${error.message}`);
      return false;
    }
  }

  private async evaluateIsMachineAvailable(
    context: RuleContext,
    result: ConditionEvaluationResult,
  ): Promise<boolean> {
    // TODO: Consultar estado de la máquina
    try {
      const machine = await this.repository.query(
        `SELECT status FROM machines WHERE code = $1 AND deleted_at IS NULL`,
        [context.machineCode],
      );
      const isAvailable = machine[0]?.status === 'AVAILABLE';
      result.actualValue = isAvailable;
      return isAvailable;
    } catch (error) {
      this.logger.warn(`Could not check machine status: ${error.message}`);
      return false;
    }
  }

  private async evaluateDurationExceeded(
    condition: ConditionDefinition,
    context: RuleContext,
    result: ConditionEvaluationResult,
  ): Promise<boolean> {
    const startTimeField = condition.field || 'startedAt';
    const thresholdMinutes = condition.value;
    
    const startTime = this.getFieldValue(startTimeField, context);
    if (!startTime) return false;

    const startDate = new Date(startTime);
    const now = new Date();
    const durationMinutes = (now.getTime() - startDate.getTime()) / (1000 * 60);
    
    result.actualValue = durationMinutes;
    result.expectedValue = thresholdMinutes;
    
    return durationMinutes > thresholdMinutes;
  }

  private async evaluateWithinTimeRange(
    condition: ConditionDefinition,
    context: RuleContext,
    result: ConditionEvaluationResult,
  ): Promise<boolean> {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    // Espera { startTime: 'HH:MM', endTime: 'HH:MM' } en condition.value
    const range = condition.value as { startTime: string; endTime: string };
    const [startHour, startMin] = range.startTime.split(':').map(Number);
    const [endHour, endMin] = range.endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    result.actualValue = currentTime;
    result.expectedValue = range;
    
    return currentTime >= startMinutes && currentTime <= endMinutes;
  }

  private async evaluateWeekdayIs(
    condition: ConditionDefinition,
    context: RuleContext,
    result: ConditionEvaluationResult,
  ): Promise<boolean> {
    const now = new Date();
    const weekday = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    result.actualValue = weekday;
    result.expectedValue = condition.value;
    
    if (Array.isArray(condition.value)) {
      return condition.value.includes(weekday);
    }
    return weekday === condition.value;
  }

  private async evaluatePercentageExceeds(
    condition: ConditionDefinition,
    context: RuleContext,
    result: ConditionEvaluationResult,
  ): Promise<boolean> {
    const percentageField = condition.field || 'defectRate';
    const threshold = condition.value;
    
    const actualPercentage = this.getFieldValue(percentageField, context);
    
    result.actualValue = actualPercentage;
    result.expectedValue = threshold;
    
    if (actualPercentage === null || actualPercentage === undefined) return false;
    
    return Number(actualPercentage) > Number(threshold);
  }

  private async evaluateCustomQuery(
    condition: ConditionDefinition,
    context: RuleContext,
    result: ConditionEvaluationResult,
  ): Promise<boolean> {
    if (!condition.query) return false;
    
    try {
      // Reemplazar placeholders en la query
      const query = this.interpolateQuery(condition.query, context);
      const queryResult = await this.repository.query(query);
      
      // Si devuelve filas, pasó la condición
      const passed = queryResult && queryResult.length > 0;
      result.actualValue = queryResult;
      return passed;
    } catch (error) {
      this.logger.error(`Custom query failed: ${error.message}`);
      return false;
    }
  }

  // ========== Utilidades ==========

  private isConditionGroup(condition: any): boolean {
    return condition.operator !== undefined && condition.conditions !== undefined;
  }

  private getFieldValue(field: string, context: RuleContext): any {
    // Soporta dot notation: 'entityData.status', 'metadata.priority', etc.
    const parts = field.split('.');
    let value: any = context;
    
    for (const part of parts) {
      if (value === null || value === undefined) return undefined;
      value = value[part];
    }
    
    return value;
  }

  private interpolateQuery(query: string, context: RuleContext): string {
    // Reemplazar placeholders como {{entityId}}, {{plantCode}}, etc.
    return query.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      const value = this.getFieldValue(key, context);
      if (value === null || value === undefined) return 'NULL';
      if (typeof value === 'string') return `'${value}'`;
      return String(value);
    });
  }
}
