/**
 * Reglas predefinidas del sistema
 * Estas reglas pueden ser cargadas al iniciar el sistema o mediante un script
 */

import {
  RuleEventType,
  RulePriority,
  RuleStatus,
  RuleScope,
  LogicalOperator,
  RuleConditionType,
  RuleActionType,
} from '../types/rule-enums';
import { CreateRuleDto } from '../dto';

/**
 * Regla 1: No finalizar OP si hay inspección pendiente
 */
export const preventCompletionWithPendingInspection: CreateRuleDto = {
  code: 'RULE-QA-001',
  name: 'Prevenir completación si hay inspección pendiente',
  description:
    'Bloquea la finalización de una orden de producción si tiene inspecciones de calidad pendientes',
  eventType: RuleEventType.ORDER_COMPLETED,
  priority: RulePriority.HIGH,
  executionOrder: 10,
  scope: RuleScope.GLOBAL,
  status: RuleStatus.ACTIVE,
  enabled: true,
  conditionsOperator: LogicalOperator.AND,
  conditions: {
    operator: LogicalOperator.AND,
    conditions: [
      {
        type: RuleConditionType.HAS_PENDING_INSPECTIONS,
        description: 'Verificar si tiene inspecciones pendientes',
      },
    ],
  },
  actions: [
    {
      type: RuleActionType.PREVENT_COMPLETION,
      params: {
        blockReason:
          'No se puede completar la orden porque tiene inspecciones de calidad pendientes',
      },
      order: 1,
      continueOnError: false,
    },
    {
      type: RuleActionType.CREATE_ALERT,
      params: {
        title: 'Completación bloqueada',
        message:
          'La orden {{entityId}} no puede completarse debido a inspecciones pendientes',
        severity: 'HIGH',
      },
      order: 2,
      continueOnError: true,
    },
    {
      type: RuleActionType.LOG_EVENT,
      params: {
        eventType: 'ORDER_COMPLETION_PREVENTED',
        message:
          'Orden {{entityId}} - Completación prevenida por inspecciones pendientes',
      },
      order: 3,
      continueOnError: true,
    },
  ],
};

/**
 * Regla 2: Bloquear lote si defectos > X%
 */
export const blockLotOnHighDefectRate: CreateRuleDto = {
  code: 'RULE-QA-002',
  name: 'Bloquear lote si tasa de defectos excede el umbral',
  description:
    'Bloquea automáticamente un lote de material si la tasa de defectos supera el 5%',
  eventType: RuleEventType.DEFECT_REGISTERED,
  priority: RulePriority.CRITICAL,
  executionOrder: 5,
  scope: RuleScope.GLOBAL,
  status: RuleStatus.ACTIVE,
  enabled: true,
  conditionsOperator: LogicalOperator.AND,
  conditions: {
    operator: LogicalOperator.AND,
    conditions: [
      {
        type: RuleConditionType.PERCENTAGE_EXCEEDS,
        field: 'entityData.defectRate',
        value: 5.0,
        description: 'Tasa de defectos mayor a 5%',
      },
    ],
  },
  actions: [
    {
      type: RuleActionType.BLOCK_LOT,
      params: {
        blockReason: 'Lote bloqueado automáticamente por alta tasa de defectos (>5%)',
      },
      order: 1,
      continueOnError: false,
    },
    {
      type: RuleActionType.CREATE_INSPECTION,
      params: {
        inspectionType: 'QUALITY_AUDIT',
      },
      order: 2,
      continueOnError: true,
    },
    {
      type: RuleActionType.CREATE_NOTIFICATION,
      params: {
        title: 'Lote bloqueado por defectos',
        message:
          'El lote {{entityId}} ha sido bloqueado automáticamente. Tasa de defectos: {{entityData.defectRate}}%',
        recipients: ['quality.manager', 'production.supervisor'],
      },
      order: 3,
      continueOnError: true,
    },
  ],
};

/**
 * Regla 3: Paro > N min genera alerta y OT
 */
export const createWorkOrderOnLongDowntime: CreateRuleDto = {
  code: 'RULE-MT-001',
  name: 'Crear OT si paro excede tiempo umbral',
  description:
    'Genera automáticamente una orden de trabajo de mantenimiento si una máquina está detenida más de 30 minutos',
  eventType: RuleEventType.DOWNTIME_THRESHOLD_EXCEEDED,
  priority: RulePriority.HIGH,
  executionOrder: 15,
  scope: RuleScope.GLOBAL,
  status: RuleStatus.ACTIVE,
  enabled: true,
  conditionsOperator: LogicalOperator.AND,
  conditions: {
    operator: LogicalOperator.AND,
    conditions: [
      {
        type: RuleConditionType.DURATION_EXCEEDED,
        field: 'entityData.downtimeStartedAt',
        value: 30, // minutos
        description: 'Paro mayor a 30 minutos',
      },
    ],
  },
  actions: [
    {
      type: RuleActionType.CREATE_WORK_ORDER,
      params: {
        workOrderType: 'CORRECTIVE',
        priority: 'HIGH',
        description:
          'Máquina {{machineCode}} detenida por más de 30 minutos. Motivo: {{entityData.reason}}',
        assignTo: 'maintenance.team',
      },
      order: 1,
      continueOnError: false,
    },
    {
      type: RuleActionType.CREATE_ALERT,
      params: {
        title: 'Paro prolongado detectado',
        message:
          'La máquina {{machineCode}} lleva {{entityData.downtimeDuration}} minutos detenida',
        severity: 'HIGH',
      },
      order: 2,
      continueOnError: true,
    },
    {
      type: RuleActionType.SEND_EMAIL,
      params: {
        recipients: ['maintenance.supervisor@company.com'],
        title: 'Alerta: Paro prolongado en {{machineCode}}',
        message:
          'Se ha generado automáticamente una OT de mantenimiento debido a un paro prolongado',
      },
      order: 3,
      continueOnError: true,
    },
  ],
  cooldownMinutes: 60, // No generar más OTs durante 1 hora
};

/**
 * Regla 4: Trazabilidad obligatoria por lote para ciertos productos
 */
export const requireLotTraceability: CreateRuleDto = {
  code: 'RULE-TR-001',
  name: 'Requiere trazabilidad por lote en productos regulados',
  description:
    'Obliga a registrar el lote de material en productos que requieren trazabilidad',
  eventType: RuleEventType.ORDER_STARTED,
  priority: RulePriority.CRITICAL,
  executionOrder: 5,
  scope: RuleScope.GLOBAL,
  status: RuleStatus.ACTIVE,
  enabled: true,
  conditionsOperator: LogicalOperator.AND,
  conditions: {
    operator: LogicalOperator.AND,
    conditions: [
      {
        type: RuleConditionType.FIELD_EQUALS,
        field: 'entityData.requiresLotTraceability',
        value: true,
        description: 'Producto requiere trazabilidad por lote',
      },
      {
        type: RuleConditionType.FIELD_IS_NULL,
        field: 'entityData.lotNumber',
        description: 'No se ha registrado número de lote',
      },
    ],
  },
  actions: [
    {
      type: RuleActionType.BLOCK_ORDER,
      params: {
        blockReason:
          'Este producto requiere trazabilidad por lote. Debe registrar el número de lote antes de iniciar producción',
      },
      order: 1,
      continueOnError: false,
    },
    {
      type: RuleActionType.CREATE_NOTIFICATION,
      params: {
        title: 'Número de lote requerido',
        message:
          'La orden {{entityId}} ha sido bloqueada porque el producto requiere trazabilidad por lote',
        recipients: ['production.operator', 'production.supervisor'],
      },
      order: 2,
      continueOnError: true,
    },
  ],
};

/**
 * Regla 5: Aprobación de calidad obligatoria en ciertos productos
 */
export const requireQualityApproval: CreateRuleDto = {
  code: 'RULE-QA-003',
  name: 'Requiere aprobación de calidad para productos críticos',
  description:
    'Exige aprobación del departamento de calidad antes de completar órdenes de productos críticos',
  eventType: RuleEventType.ORDER_COMPLETED,
  priority: RulePriority.CRITICAL,
  executionOrder: 8,
  scope: RuleScope.GLOBAL,
  status: RuleStatus.ACTIVE,
  enabled: true,
  conditionsOperator: LogicalOperator.AND,
  conditions: {
    operator: LogicalOperator.OR,
    conditions: [
      {
        type: RuleConditionType.FIELD_EQUALS,
        field: 'entityData.productCategory',
        value: 'PHARMACEUTICAL',
        description: 'Producto farmacéutico',
      },
      {
        type: RuleConditionType.FIELD_EQUALS,
        field: 'entityData.productCategory',
        value: 'FOOD',
        description: 'Producto alimenticio',
      },
      {
        type: RuleConditionType.FIELD_EQUALS,
        field: 'entityData.requiresQaApproval',
        value: true,
        description: 'Requiere aprobación explícita',
      },
    ],
  },
  actions: [
    {
      type: RuleActionType.REQUIRE_APPROVAL,
      params: {
        approvalType: 'QUALITY',
        requiredRole: 'quality.manager',
      },
      order: 1,
      continueOnError: false,
    },
    {
      type: RuleActionType.PREVENT_COMPLETION,
      params: {
        blockReason:
          'Este producto requiere aprobación del departamento de calidad antes de ser completado',
      },
      order: 2,
      continueOnError: false,
    },
    {
      type: RuleActionType.CREATE_NOTIFICATION,
      params: {
        title: 'Aprobación de calidad requerida',
        message:
          'La orden {{entityId}} requiere aprobación de calidad antes de completarse',
        recipients: ['quality.manager'],
      },
      order: 3,
      continueOnError: true,
    },
  ],
};

/**
 * Regla 6: Verificar stock antes de iniciar orden
 */
export const checkStockBeforeStart: CreateRuleDto = {
  code: 'RULE-INV-001',
  name: 'Verificar disponibilidad de material antes de iniciar',
  description:
    'Verifica que haya suficiente material disponible antes de permitir iniciar una orden de producción',
  eventType: RuleEventType.ORDER_STARTED,
  priority: RulePriority.MEDIUM,
  executionOrder: 20,
  scope: RuleScope.GLOBAL,
  status: RuleStatus.ACTIVE,
  enabled: true,
  conditionsOperator: LogicalOperator.AND,
  conditions: {
    operator: LogicalOperator.AND,
    conditions: [
      {
        type: RuleConditionType.CUSTOM_QUERY,
        query: `
          SELECT COUNT(*) as available FROM material_lots 
          WHERE material_code = '{{entityData.materialCode}}' 
          AND status = 'AVAILABLE' 
          AND quantity >= {{entityData.requiredQuantity}}
        `,
        description: 'Verificar stock disponible',
      },
    ],
  },
  actions: [
    {
      type: RuleActionType.BLOCK_ORDER,
      params: {
        blockReason: 'Material insuficiente para iniciar la producción',
      },
      order: 1,
      continueOnError: false,
    },
    {
      type: RuleActionType.CREATE_ALERT,
      params: {
        title: 'Material insuficiente',
        message:
          'No hay suficiente material {{entityData.materialCode}} para la orden {{entityId}}',
        severity: 'MEDIUM',
      },
      order: 2,
      continueOnError: true,
    },
  ],
};

/**
 * Regla 7: Alertar si máquina no está disponible
 */
export const checkMachineAvailability: CreateRuleDto = {
  code: 'RULE-PRD-001',
  name: 'Verificar disponibilidad de máquina',
  description:
    'Verifica que la máquina asignada esté disponible antes de iniciar la orden',
  eventType: RuleEventType.ORDER_STARTED,
  priority: RulePriority.HIGH,
  executionOrder: 10,
  scope: RuleScope.GLOBAL,
  status: RuleStatus.ACTIVE,
  enabled: true,
  conditionsOperator: LogicalOperator.AND,
  conditions: {
    operator: LogicalOperator.NOT,
    conditions: [
      {
        type: RuleConditionType.IS_MACHINE_AVAILABLE,
        description: 'Máquina no disponible',
      },
    ],
  },
  actions: [
    {
      type: RuleActionType.CREATE_ALERT,
      params: {
        title: 'Máquina no disponible',
        message:
          'La máquina {{machineCode}} asignada a la orden {{entityId}} no está disponible',
        severity: 'HIGH',
      },
      order: 1,
      continueOnError: true,
    },
    {
      type: RuleActionType.UPDATE_ORDER_STATUS,
      params: {
        status: 'PENDING_MACHINE',
      },
      order: 2,
      continueOnError: true,
    },
  ],
};

/**
 * Exporta todas las reglas predefinidas
 */
export const predefinedRules: CreateRuleDto[] = [
  preventCompletionWithPendingInspection,
  blockLotOnHighDefectRate,
  createWorkOrderOnLongDowntime,
  requireLotTraceability,
  requireQualityApproval,
  checkStockBeforeStart,
  checkMachineAvailability,
];

/**
 * Descripción de cada regla para documentación
 */
export const ruleDescriptions = {
  'RULE-QA-001': {
    category: 'Calidad',
    industry: 'Universal',
    businessImpact:
      'Asegura que todos los controles de calidad se completen antes de dar por terminada una orden',
  },
  'RULE-QA-002': {
    category: 'Calidad',
    industry: 'Manufactura',
    businessImpact:
      'Previene que lotes con alta tasa de defectos lleguen a clientes',
  },
  'RULE-MT-001': {
    category: 'Mantenimiento',
    industry: 'Universal',
    businessImpact:
      'Reduce tiempo de respuesta ante paros prolongados, mejorando disponibilidad de equipos',
  },
  'RULE-TR-001': {
    category: 'Trazabilidad',
    industry: 'Regulada (Pharma, Food)',
    businessImpact:
      'Cumple con requisitos regulatorios de trazabilidad por lote',
  },
  'RULE-QA-003': {
    category: 'Calidad',
    industry: 'Regulada (Pharma, Food)',
    businessImpact:
      'Garantiza revisión de calidad en productos críticos antes de liberarlos',
  },
  'RULE-INV-001': {
    category: 'Inventario',
    industry: 'Universal',
    businessImpact:
      'Evita iniciar órdenes que no puedan completarse por falta de material',
  },
  'RULE-PRD-001': {
    category: 'Producción',
    industry: 'Universal',
    businessImpact:
      'Optimiza asignación de recursos verificando disponibilidad de equipos',
  },
};
