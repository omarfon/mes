import { RuleConditionType, LogicalOperator, RuleActionType } from './rule-enums';

/**
 * Contexto de ejecución de una regla
 * Contiene todos los datos disponibles para evaluar condiciones
 */
export interface RuleContext {
  // Identificador del evento
  eventType: string;
  eventId?: string;
  timestamp: Date;
  
  // Entidad principal relacionada
  entityType: string; // 'order', 'machine', 'lot', 'inspection', etc.
  entityId: string;
  entityData: any;
  
  // Contexto adicional
  plantCode?: string;
  areaCode?: string;
  workCenterCode?: string;
  machineCode?: string;
  productCode?: string;
  orderTypeCode?: string;
  
  // Usuario que disparó el evento (si aplica)
  userId?: string;
  username?: string;
  
  // Datos adicionales específicos del evento
  metadata?: Record<string, any>;
}

/**
 * Definición de una condición individual
 */
export interface ConditionDefinition {
  type: RuleConditionType;
  field?: string; // Campo a evaluar (ej: 'defectRate', 'status', 'duration')
  operator?: string; // Operador de comparación
  value?: any; // Valor a comparar
  values?: any[]; // Valores múltiples (para IN, NOT_IN)
  
  // Para condiciones custom
  query?: string; // Consulta SQL o expresión
  function?: string; // Nombre de función custom
  
  // Metadatos
  description?: string;
}

/**
 * Grupo de condiciones con operador lógico
 */
export interface ConditionGroup {
  operator: LogicalOperator; // AND, OR, NOT
  conditions: (ConditionDefinition | ConditionGroup)[];
}

/**
 * Definición de una acción
 */
export interface ActionDefinition {
  type: RuleActionType;
  
  // Parámetros específicos según tipo de acción
  params?: {
    // Para bloqueos
    blockReason?: string;
    blockUntil?: Date | string;
    
    // Para alertas/notificaciones
    title?: string;
    message?: string;
    severity?: string;
    recipients?: string[];
    
    // Para creación de work orders
    workOrderType?: string;
    priority?: string;
    assignTo?: string;
    
    // Para actualizaciones
    status?: string;
    fieldName?: string;
    fieldValue?: any;
    
    // Para webhooks
    url?: string;
    method?: string;
    headers?: Record<string, string>;
    body?: any;
    
    // Para custom functions
    functionName?: string;
    functionParams?: Record<string, any>;
    
    // Otros parámetros genéricos
    [key: string]: any;
  };
  
  // Orden de ejecución si hay múltiples acciones
  order?: number;
  
  // Continuar si falla esta acción
  continueOnError?: boolean;
  
  description?: string;
}

/**
 * Resultado de la evaluación de una condición
 */
export interface ConditionEvaluationResult {
  conditionId?: string;
  type: RuleConditionType;
  passed: boolean;
  actualValue?: any;
  expectedValue?: any;
  message?: string;
  evaluatedAt: Date;
}

/**
 * Resultado de la ejecución de una acción
 */
export interface ActionExecutionResult {
  actionId?: string;
  type: RuleActionType;
  success: boolean;
  output?: any;
  error?: string;
  executedAt: Date;
  duration?: number; // milisegundos
}

/**
 * Resultado completo de la ejecución de una regla
 */
export interface RuleExecutionResult {
  ruleId: string;
  ruleCode: string;
  ruleName: string;
  
  triggered: boolean;
  conditionsPassed: boolean;
  actionsExecuted: boolean;
  
  conditionResults: ConditionEvaluationResult[];
  actionResults: ActionExecutionResult[];
  
  startedAt: Date;
  completedAt: Date;
  duration: number; // milisegundos
  
  error?: string;
  context: Partial<RuleContext>;
}
