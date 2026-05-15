import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { RuleActionType } from '../types/rule-enums';
import {
  RuleContext,
  ActionDefinition,
  ActionExecutionResult,
} from '../types/rule-types';

@Injectable()
export class ActionExecutor {
  private readonly logger = new Logger(ActionExecutor.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Ejecuta una acciÃ³n
   */
  async executeAction(
    action: ActionDefinition,
    context: RuleContext,
  ): Promise<ActionExecutionResult> {
    const startTime = Date.now();
    const result: ActionExecutionResult = {
      type: action.type,
      success: false,
      executedAt: new Date(),
    };

    try {
      switch (action.type) {
        // Acciones de bloqueo
        case RuleActionType.BLOCK_ORDER:
          result.output = await this.blockOrder(action, context);
          result.success = true;
          break;
        case RuleActionType.BLOCK_LOT:
          result.output = await this.blockLot(action, context);
          result.success = true;
          break;
        case RuleActionType.BLOCK_MACHINE:
          result.output = await this.blockMachine(action, context);
          result.success = true;
          break;
        case RuleActionType.PREVENT_COMPLETION:
          result.output = await this.preventCompletion(action, context);
          result.success = true;
          break;
        case RuleActionType.REQUIRE_APPROVAL:
          result.output = await this.requireApproval(action, context);
          result.success = true;
          break;

        // Acciones de creaciÃ³n
        case RuleActionType.CREATE_ALERT:
          result.output = await this.createAlert(action, context);
          result.success = true;
          break;
        case RuleActionType.CREATE_NOTIFICATION:
          result.output = await this.createNotification(action, context);
          result.success = true;
          break;
        case RuleActionType.CREATE_WORK_ORDER:
          result.output = await this.createWorkOrder(action, context);
          result.success = true;
          break;
        case RuleActionType.CREATE_INSPECTION:
          result.output = await this.createInspection(action, context);
          result.success = true;
          break;

        // Acciones de actualizaciÃ³n
        case RuleActionType.UPDATE_ORDER_STATUS:
          result.output = await this.updateOrderStatus(action, context);
          result.success = true;
          break;
        case RuleActionType.UPDATE_MACHINE_STATUS:
          result.output = await this.updateMachineStatus(action, context);
          result.success = true;
          break;
        case RuleActionType.UPDATE_LOT_STATUS:
          result.output = await this.updateLotStatus(action, context);
          result.success = true;
          break;
        case RuleActionType.UPDATE_FIELD_VALUE:
          result.output = await this.updateFieldValue(action, context);
          result.success = true;
          break;

        // Acciones de notificaciÃ³n
        case RuleActionType.SEND_EMAIL:
          result.output = await this.sendEmail(action, context);
          result.success = true;
          break;
        case RuleActionType.SEND_SMS:
          result.output = await this.sendSMS(action, context);
          result.success = true;
          break;

        // Acciones de logging
        case RuleActionType.LOG_EVENT:
          result.output = await this.logEvent(action, context);
          result.success = true;
          break;
        case RuleActionType.LOG_METRIC:
          result.output = await this.logMetric(action, context);
          result.success = true;
          break;

        // Custom
        case RuleActionType.EXECUTE_WEBHOOK:
          result.output = await this.executeWebhook(action, context);
          result.success = true;
          break;

        default:
          this.logger.warn(`Unsupported action type: ${action.type}`);
          result.error = `Unsupported action type: ${action.type}`;
          result.success = false;
      }
    } catch (error) {
      this.logger.error(`Error executing action ${action.type}: ${error.message}`);
      result.success = false;
      result.error = error.message;
    }

    result.duration = Date.now() - startTime;
    return result;
  }

  /**
   * Ejecuta mÃºltiples acciones en orden
   */
  async executeActions(
    actions: ActionDefinition[],
    context: RuleContext,
  ): Promise<ActionExecutionResult[]> {
    const results: ActionExecutionResult[] = [];
    
    // Ordenar por order si estÃ¡ definido
    const sortedActions = [...actions].sort((a, b) => {
      return (a.order ?? 999) - (b.order ?? 999);
    });

    for (const action of sortedActions) {
      const result = await this.executeAction(action, context);
      results.push(result);
      
      // Si falla y no debe continuar, detener ejecuciÃ³n
      if (!result.success && !action.continueOnError) {
        this.logger.warn(`Action ${action.type} failed, stopping execution`);
        break;
      }
    }

    return results;
  }

  // ========== Implementaciones de acciones ==========

  private async blockOrder(
    action: ActionDefinition,
    context: RuleContext,
  ): Promise<any> {
    const reason = action.params?.blockReason || 'Bloqueado por regla de negocio';
    
    await this.dataSource.query(
      `UPDATE production_orders 
       SET status = 'BLOCKED', 
           block_reason = $1,
           updated_at = NOW()
       WHERE id = $2`,
      [reason, context.entityId],
    );
    
    this.logger.log(`Order ${context.entityId} blocked: ${reason}`);
    return { orderId: context.entityId, reason };
  }

  private async blockLot(
    action: ActionDefinition,
    context: RuleContext,
  ): Promise<any> {
    const reason = action.params?.blockReason || 'Bloqueado por regla de negocio';
    
    await this.dataSource.query(
      `UPDATE material_lots 
       SET status = 'BLOCKED', 
           block_reason = $1,
           updated_at = NOW()
       WHERE lot_number = $2`,
      [reason, context.entityId],
    );
    
    this.logger.log(`Lot ${context.entityId} blocked: ${reason}`);
    return { lotNumber: context.entityId, reason };
  }

  private async blockMachine(
    action: ActionDefinition,
    context: RuleContext,
  ): Promise<any> {
    const reason = action.params?.blockReason || 'Bloqueado por regla de negocio';
    
    await this.dataSource.query(
      `UPDATE machines 
       SET status = 'BLOCKED', 
           updated_at = NOW()
       WHERE code = $1`,
      [context.machineCode],
    );
    
    this.logger.log(`Machine ${context.machineCode} blocked: ${reason}`);
    return { machineCode: context.machineCode, reason };
  }

  private async preventCompletion(
    action: ActionDefinition,
    context: RuleContext,
  ): Promise<any> {
    const reason = action.params?.blockReason || 'CompletaciÃ³n prevenida por regla de negocio';
    
    // Esto podrÃ­a ser implementado como un flag en la orden
    await this.dataSource.query(
      `UPDATE production_orders 
       SET completion_prevented = true,
           prevention_reason = $1,
           updated_at = NOW()
       WHERE id = $2`,
      [reason, context.entityId],
    );
    
    this.logger.log(`Order ${context.entityId} completion prevented: ${reason}`);
    return { orderId: context.entityId, reason };
  }

  private async requireApproval(
    action: ActionDefinition,
    context: RuleContext,
  ): Promise<any> {
    const approvalType = action.params?.approvalType || 'QUALITY';
    
    // Crear registro de aprobaciÃ³n pendiente
    const result = await this.dataSource.query(
      `INSERT INTO approvals (
        entity_type, entity_id, approval_type, status, 
        required_by, created_at
      ) VALUES ($1, $2, $3, 'PENDING', $4, NOW())
      RETURNING id`,
      [context.entityType, context.entityId, approvalType, context.userId],
    );
    
    this.logger.log(`Approval required for ${context.entityType} ${context.entityId}`);
    return { approvalId: result[0].id, approvalType };
  }

  private async createAlert(
    action: ActionDefinition,
    context: RuleContext,
  ): Promise<any> {
    const title = this.interpolate(action.params?.title || 'Alerta de regla', context);
    const message = this.interpolate(action.params?.message || '', context);
    const severity = action.params?.severity || 'MEDIUM';
    
    const result = await this.dataSource.query(
      `INSERT INTO alerts (
        entity_type, entity_id, title, message, severity,
        plant_code, area_code, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING id`,
      [
        context.entityType,
        context.entityId,
        title,
        message,
        severity,
        context.plantCode,
        context.areaCode,
      ],
    );
    
    this.logger.log(`Alert created: ${title}`);
    return { alertId: result[0].id, title, severity };
  }

  private async createNotification(
    action: ActionDefinition,
    context: RuleContext,
  ): Promise<any> {
    const title = this.interpolate(action.params?.title || 'NotificaciÃ³n', context);
    const message = this.interpolate(action.params?.message || '', context);
    const recipients = action.params?.recipients || [];
    
    for (const recipient of recipients) {
      await this.dataSource.query(
        `INSERT INTO notifications (
          user_id, title, message, entity_type, entity_id, created_at
        ) VALUES ($1, $2, $3, $4, $5, NOW())`,
        [recipient, title, message, context.entityType, context.entityId],
      );
    }
    
    this.logger.log(`Notification sent to ${recipients.length} recipients`);
    return { recipients: recipients.length, title };
  }

  private async createWorkOrder(
    action: ActionDefinition,
    context: RuleContext,
  ): Promise<any> {
    const workOrderType = action.params?.workOrderType || 'CORRECTIVE';
    const priority = action.params?.priority || 'MEDIUM';
    const assignTo = action.params?.assignTo;
    const description = this.interpolate(
      action.params?.description || 'Generada automÃ¡ticamente por regla',
      context,
    );
    
    const result = await this.dataSource.query(
      `INSERT INTO work_orders (
        type, priority, status, description,
        machine_code, assigned_to, created_at
      ) VALUES ($1, $2, 'OPEN', $3, $4, $5, NOW())
      RETURNING id, code`,
      [workOrderType, priority, description, context.machineCode, assignTo],
    );
    
    this.logger.log(`Work order created: ${result[0].code}`);
    return { workOrderId: result[0].id, code: result[0].code };
  }

  private async createInspection(
    action: ActionDefinition,
    context: RuleContext,
  ): Promise<any> {
    const inspectionType = action.params?.inspectionType || 'QUALITY';
    
    const result = await this.dataSource.query(
      `INSERT INTO inspections (
        entity_type, entity_id, inspection_type, status, created_at
      ) VALUES ($1, $2, $3, 'PENDING', NOW())
      RETURNING id`,
      [context.entityType, context.entityId, inspectionType],
    );
    
    this.logger.log(`Inspection created for ${context.entityType} ${context.entityId}`);
    return { inspectionId: result[0].id, inspectionType };
  }

  private async updateOrderStatus(
    action: ActionDefinition,
    context: RuleContext,
  ): Promise<any> {
    const newStatus = action.params?.status;
    
    await this.dataSource.query(
      `UPDATE production_orders 
       SET status = $1, updated_at = NOW()
       WHERE id = $2`,
      [newStatus, context.entityId],
    );
    
    this.logger.log(`Order ${context.entityId} status updated to ${newStatus}`);
    return { orderId: context.entityId, status: newStatus };
  }

  private async updateMachineStatus(
    action: ActionDefinition,
    context: RuleContext,
  ): Promise<any> {
    const newStatus = action.params?.status;
    
    await this.dataSource.query(
      `UPDATE machines 
       SET status = $1, updated_at = NOW()
       WHERE code = $2`,
      [newStatus, context.machineCode],
    );
    
    this.logger.log(`Machine ${context.machineCode} status updated to ${newStatus}`);
    return { machineCode: context.machineCode, status: newStatus };
  }

  private async updateLotStatus(
    action: ActionDefinition,
    context: RuleContext,
  ): Promise<any> {
    const newStatus = action.params?.status;
    
    await this.dataSource.query(
      `UPDATE material_lots 
       SET status = $1, updated_at = NOW()
       WHERE lot_number = $2`,
      [newStatus, context.entityId],
    );
    
    this.logger.log(`Lot ${context.entityId} status updated to ${newStatus}`);
    return { lotNumber: context.entityId, status: newStatus };
  }

  private async updateFieldValue(
    action: ActionDefinition,
    context: RuleContext,
  ): Promise<any> {
    const tableName = action.params?.tableName || context.entityType;
    const fieldName = action.params?.fieldName;
    const fieldValue = action.params?.fieldValue;
    const idField = action.params?.idField || 'id';
    
    // PRECAUCIÃ“N: Esto es vulnerable a SQL injection, solo para demo
    // En producciÃ³n usar query builder o validar tabla/campo contra whitelist
    await this.dataSource.query(
      `UPDATE ${tableName} 
       SET ${fieldName} = $1, updated_at = NOW()
       WHERE ${idField} = $2`,
      [fieldValue, context.entityId],
    );
    
    this.logger.log(`Updated ${tableName}.${fieldName} to ${fieldValue}`);
    return { tableName, fieldName, fieldValue };
  }

  private async sendEmail(
    action: ActionDefinition,
    context: RuleContext,
  ): Promise<any> {
    // TODO: Integrar con servicio de email
    const recipients = action.params?.recipients || [];
    const subject = this.interpolate(action.params?.title || 'NotificaciÃ³n', context);
    const body = this.interpolate(action.params?.message || '', context);
    
    this.logger.log(`Email queued to ${recipients.join(', ')}: ${subject}`);
    
    // AquÃ­ irÃ­a la lÃ³gica de envÃ­o real
    return { recipients, subject, queued: true };
  }

  private async sendSMS(
    action: ActionDefinition,
    context: RuleContext,
  ): Promise<any> {
    // TODO: Integrar con servicio de SMS
    const recipients = action.params?.recipients || [];
    const message = this.interpolate(action.params?.message || '', context);
    
    this.logger.log(`SMS queued to ${recipients.join(', ')}`);
    
    return { recipients, message, queued: true };
  }

  private async logEvent(
    action: ActionDefinition,
    context: RuleContext,
  ): Promise<any> {
    const eventType = action.params?.eventType || context.eventType;
    const message = this.interpolate(action.params?.message || '', context);
    
    await this.dataSource.query(
      `INSERT INTO activity_log (
        event_type, entity_type, entity_id, message,
        user_id, plant_code, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [
        eventType,
        context.entityType,
        context.entityId,
        message,
        context.userId,
        context.plantCode,
      ],
    );
    
    this.logger.log(`Event logged: ${eventType}`);
    return { eventType, message };
  }

  private async logMetric(
    action: ActionDefinition,
    context: RuleContext,
  ): Promise<any> {
    const metricName = action.params?.metricName;
    const metricValue = action.params?.metricValue;
    
    // TODO: Integrar con sistema de mÃ©tricas/telemetrÃ­a
    this.logger.log(`Metric logged: ${metricName} = ${metricValue}`);
    
    return { metricName, metricValue };
  }

  private async executeWebhook(
    action: ActionDefinition,
    context: RuleContext,
  ): Promise<any> {
    const url = action.params?.url;
    const method = action.params?.method || 'POST';
    const headers = action.params?.headers || { 'Content-Type': 'application/json' };
    const body = action.params?.body || { context };
    
    // TODO: Integrar con HTTP client
    this.logger.log(`Webhook called: ${method} ${url}`);
    
    return { url, method, queued: true };
  }

  // ========== Utilidades ==========

  private interpolate(template: string, context: RuleContext): string {
    // Reemplazar placeholders como {{entityId}}, {{plantCode}}, etc.
    return template.replace(/\{\{(\w+(\.\w+)*)\}\}/g, (match, path) => {
      const parts = path.split('.');
      let value: any = context;
      
      for (const part of parts) {
        if (value === null || value === undefined) return match;
        value = value[part];
      }
      
      return value !== null && value !== undefined ? String(value) : match;
    });
  }
}
