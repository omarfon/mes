-- Crear tipos ENUM para el motor de reglas

-- Tipo de evento que dispara la regla
CREATE TYPE rule_event_type AS ENUM (
  'ORDER_CREATED', 'ORDER_STARTED', 'ORDER_PAUSED', 'ORDER_RESUMED', 
  'ORDER_COMPLETED', 'ORDER_CANCELLED',
  'INSPECTION_CREATED', 'INSPECTION_COMPLETED', 'INSPECTION_FAILED',
  'DEFECT_REGISTERED', 'DEFECT_RATE_EXCEEDED',
  'MACHINE_STOPPED', 'MACHINE_RUNNING', 'DOWNTIME_THRESHOLD_EXCEEDED',
  'LOT_CREATED', 'LOT_CONSUMED', 'LOT_BLOCKED', 'STOCK_BELOW_MIN',
  'MAINTENANCE_DUE', 'MAINTENANCE_COMPLETED',
  'SCHEDULED_CHECK', 'TIME_BASED_TRIGGER'
);

-- Prioridad de la regla
CREATE TYPE rule_priority AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');

-- Estado de la regla
CREATE TYPE rule_status AS ENUM ('ACTIVE', 'INACTIVE', 'DRAFT', 'ARCHIVED');

-- Ámbito de aplicación
CREATE TYPE rule_scope AS ENUM (
  'GLOBAL', 'PLANT', 'AREA', 'WORK_CENTER', 'MACHINE', 'PRODUCT', 'ORDER_TYPE'
);

-- Operador lógico
CREATE TYPE logical_operator AS ENUM ('AND', 'OR', 'NOT');

-- Resultado de ejecución
CREATE TYPE execution_result AS ENUM ('SUCCESS', 'FAILED', 'SKIPPED', 'ERROR');

-- Tabla de reglas
CREATE TABLE rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  
  -- Configuración de disparo
  event_type rule_event_type NOT NULL,
  priority rule_priority DEFAULT 'MEDIUM' NOT NULL,
  execution_order INT DEFAULT 100 NOT NULL,
  
  -- Ámbito
  scope rule_scope DEFAULT 'GLOBAL' NOT NULL,
  scope_value VARCHAR(100),
  
  -- Condiciones y acciones (almacenadas como JSONB)
  conditions JSONB,
  conditions_operator logical_operator DEFAULT 'AND' NOT NULL,
  actions JSONB NOT NULL,
  
  -- Estado
  status rule_status DEFAULT 'ACTIVE' NOT NULL,
  enabled BOOLEAN DEFAULT TRUE NOT NULL,
  valid_from TIMESTAMP,
  valid_to TIMESTAMP,
  
  -- Límites de ejecución
  max_executions_per_day INT,
  cooldown_minutes INT,
  
  -- Estadísticas
  execution_count INT DEFAULT 0 NOT NULL,
  last_executed_at TIMESTAMP,
  success_count INT DEFAULT 0 NOT NULL,
  failure_count INT DEFAULT 0 NOT NULL,
  
  -- Metadatos
  metadata JSONB,
  
  -- Auditoría
  created_by VARCHAR(100),
  updated_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP
);

-- Índices para optimizar consultas
CREATE UNIQUE INDEX idx_rules_code ON rules(code);
CREATE INDEX idx_rules_event_type ON rules(event_type);
CREATE INDEX idx_rules_status ON rules(status);
CREATE INDEX idx_rules_scope ON rules(scope, scope_value);
CREATE INDEX idx_rules_enabled ON rules(enabled) WHERE enabled = TRUE;

-- Tabla de ejecuciones de reglas (historial)
CREATE TABLE rule_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rule_id UUID NOT NULL REFERENCES rules(id) ON DELETE CASCADE,
  rule_code VARCHAR(50) NOT NULL,
  rule_name VARCHAR(200) NOT NULL,
  
  -- Contexto de ejecución
  event_type VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id VARCHAR(100),
  context JSONB,
  
  -- Resultados
  conditions_passed BOOLEAN NOT NULL,
  condition_results JSONB,
  actions_executed BOOLEAN NOT NULL,
  action_results JSONB,
  
  -- Resultado general
  result execution_result NOT NULL,
  error_message TEXT,
  error_stack TEXT,
  
  -- Tiempos
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP NOT NULL,
  duration_ms INT NOT NULL,
  
  -- Metadatos
  executed_by VARCHAR(100),
  metadata JSONB,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Índices para historial
CREATE INDEX idx_rule_executions_rule_id ON rule_executions(rule_id, executed_at DESC);
CREATE INDEX idx_rule_executions_event_type ON rule_executions(event_type);
CREATE INDEX idx_rule_executions_result ON rule_executions(result);
CREATE INDEX idx_rule_executions_executed_at ON rule_executions(executed_at DESC);
CREATE INDEX idx_rule_executions_entity ON rule_executions(entity_type, entity_id);

-- Tabla auxiliar para aprobaciones (usada por la acción REQUIRE_APPROVAL)
CREATE TABLE approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(100) NOT NULL,
  approval_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING' NOT NULL,
  required_by VARCHAR(100),
  approved_by VARCHAR(100),
  approved_at TIMESTAMP,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_approvals_entity ON approvals(entity_type, entity_id);
CREATE INDEX idx_approvals_status ON approvals(status);

-- Tabla auxiliar para alertas (usada por la acción CREATE_ALERT)
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type VARCHAR(100),
  entity_id VARCHAR(100),
  title VARCHAR(200) NOT NULL,
  message TEXT,
  severity VARCHAR(50) DEFAULT 'MEDIUM' NOT NULL,
  status VARCHAR(50) DEFAULT 'ACTIVE' NOT NULL,
  plant_code VARCHAR(50),
  area_code VARCHAR(50),
  acknowledged_by VARCHAR(100),
  acknowledged_at TIMESTAMP,
  resolved_by VARCHAR(100),
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_alerts_entity ON alerts(entity_type, entity_id);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_plant ON alerts(plant_code);

-- Tabla auxiliar para work orders (usada por la acción CREATE_WORK_ORDER)
-- Nota: Esta tabla puede ya existir en el módulo de mantenimiento
-- Solo crear si no existe
CREATE TABLE IF NOT EXISTS work_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL,
  priority VARCHAR(50) DEFAULT 'MEDIUM' NOT NULL,
  status VARCHAR(50) DEFAULT 'OPEN' NOT NULL,
  description TEXT,
  machine_code VARCHAR(50),
  assigned_to VARCHAR(100),
  completed_by VARCHAR(100),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rules_updated_at
  BEFORE UPDATE ON rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_approvals_updated_at
  BEFORE UPDATE ON approvals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at
  BEFORE UPDATE ON alerts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comentarios para documentación
COMMENT ON TABLE rules IS 'Motor de reglas de negocio - Definiciones de reglas';
COMMENT ON TABLE rule_executions IS 'Historial de ejecuciones de reglas';
COMMENT ON TABLE approvals IS 'Registro de aprobaciones requeridas por reglas';
COMMENT ON TABLE alerts IS 'Alertas generadas por el motor de reglas';

COMMENT ON COLUMN rules.conditions IS 'Condiciones en formato JSON que deben cumplirse para ejecutar la regla';
COMMENT ON COLUMN rules.actions IS 'Acciones en formato JSON a ejecutar cuando se cumplan las condiciones';
COMMENT ON COLUMN rules.cooldown_minutes IS 'Tiempo mínimo en minutos entre ejecuciones de la regla';
COMMENT ON COLUMN rules.max_executions_per_day IS 'Número máximo de ejecuciones permitidas por día';
