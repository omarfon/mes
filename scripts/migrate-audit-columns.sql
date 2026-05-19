-- =======================================================================
-- MIGRACIÓN: Campos de Auditoría de Usuario
-- Agrega usu_creacion, usu_edicion, usu_eliminacion a todas las tablas
-- transaccionales y maestros del sistema MES.
-- También agrega deleted_at a tablas que la necesitan para soft-delete.
-- Ejecutar en: mes_db
-- Fecha: 2026-05-15
-- =======================================================================

-- ── Agregar deleted_at a tablas que la necesitan para soft-delete ───────
DO $$
DECLARE
  tbl TEXT;
  tables TEXT[] := ARRAY[
    'activity_logs','alerts','approvals','asset_status','bom_lines',
    'control_tiempos','control_visual','ejecuciones','feasibility_history',
    'label_templates','lot_genealogy','lot_movements','lots','notifications',
    'production_order_operations','quality_defect_families','quality_defects',
    'quality_inspections','quality_severities','recipe_params','route_operations',
    'routing_steps','serials','trace_links','wip','work_orders'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = tbl AND column_name = 'deleted_at' AND table_schema = 'public'
    ) THEN
      EXECUTE format('ALTER TABLE %I ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE', tbl);
    END IF;
  END LOOP;
END $$;

-- ── Función auxiliar para agregar columnas solo si no existen ───────────
CREATE OR REPLACE FUNCTION add_audit_columns(p_table text) RETURNS void AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = p_table AND column_name = 'usu_creacion'
  ) THEN
    EXECUTE format('ALTER TABLE %I ADD COLUMN usu_creacion VARCHAR(200)', p_table);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = p_table AND column_name = 'usu_edicion'
  ) THEN
    EXECUTE format('ALTER TABLE %I ADD COLUMN usu_edicion VARCHAR(200)', p_table);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = p_table AND column_name = 'usu_eliminacion'
  ) THEN
    EXECUTE format('ALTER TABLE %I ADD COLUMN usu_eliminacion VARCHAR(200)', p_table);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ── Tablas Maestros ─────────────────────────────────────────────────────
SELECT add_audit_columns('areas');
SELECT add_audit_columns('bill_of_materials');
SELECT add_audit_columns('bom_lines');
SELECT add_audit_columns('empresas');
SELECT add_audit_columns('locations');
SELECT add_audit_columns('machines');
SELECT add_audit_columns('work_centers');
SELECT add_audit_columns('material_lots');
SELECT add_audit_columns('materials');
SELECT add_audit_columns('motivos_parada');
SELECT add_audit_columns('movement_types');
SELECT add_audit_columns('operadores');
SELECT add_audit_columns('order_types');
SELECT add_audit_columns('plant_calendar');
SELECT add_audit_columns('plants');
SELECT add_audit_columns('procesos');
SELECT add_audit_columns('products');
SELECT add_audit_columns('product_variants');
SELECT add_audit_columns('recipes');
SELECT add_audit_columns('recipe_params');
SELECT add_audit_columns('routes');
SELECT add_audit_columns('route_operations');
SELECT add_audit_columns('routings');
SELECT add_audit_columns('routing_steps');
SELECT add_audit_columns('shifts');
SELECT add_audit_columns('scrap_reasons');
SELECT add_audit_columns('shift_groups');
SELECT add_audit_columns('standard_times');
SELECT add_audit_columns('suppliers');
SELECT add_audit_columns('turnos');
SELECT add_audit_columns('unidades_medida');
SELECT add_audit_columns('users');
SELECT add_audit_columns('workstations');

-- ── Tablas Transaccionales ──────────────────────────────────────────────
SELECT add_audit_columns('production_orders');
SELECT add_audit_columns('production_order_operations');
SELECT add_audit_columns('ordenes_produccion');
SELECT add_audit_columns('wip');
SELECT add_audit_columns('ejecuciones');
SELECT add_audit_columns('despachos');
SELECT add_audit_columns('control_visual');
SELECT add_audit_columns('control_tiempos');
SELECT add_audit_columns('feasibility_history');
SELECT add_audit_columns('work_orders');
SELECT add_audit_columns('approvals');
SELECT add_audit_columns('alerts');

-- ── Tablas de Calidad ───────────────────────────────────────────────────
SELECT add_audit_columns('quality_inspections');
SELECT add_audit_columns('inspection_defects');
SELECT add_audit_columns('quality_defects');
SELECT add_audit_columns('quality_defect_families');
SELECT add_audit_columns('quality_severities');

-- ── Tablas de Trazabilidad ──────────────────────────────────────────────
SELECT add_audit_columns('lots');
SELECT add_audit_columns('lot_movements');
SELECT add_audit_columns('serials');
SELECT add_audit_columns('trace_nodes');
SELECT add_audit_columns('trace_links');
SELECT add_audit_columns('label_templates');
SELECT add_audit_columns('label_print_history');
SELECT add_audit_columns('audits');
SELECT add_audit_columns('traceability_events');
SELECT add_audit_columns('lot_genealogy');

-- ── Tablas de Mantenimiento ─────────────────────────────────────────────
SELECT add_audit_columns('maintenance_records');
SELECT add_audit_columns('maintenance_components');

-- ── Tablas de Reglas ────────────────────────────────────────────────────
SELECT add_audit_columns('rules');
SELECT add_audit_columns('rule_executions');

-- ── Tablas Misceláneas ──────────────────────────────────────────────────
SELECT add_audit_columns('notifications');
SELECT add_audit_columns('machine_events');
SELECT add_audit_columns('asset_status');

-- ── Limpiar función auxiliar ─────────────────────────────────────────────
DROP FUNCTION IF EXISTS add_audit_columns(text);

-- ── Verificación ────────────────────────────────────────────────────────
DO $$
DECLARE
  cnt INTEGER;
BEGIN
  SELECT COUNT(*) INTO cnt
  FROM information_schema.columns
  WHERE column_name = 'usu_creacion'
    AND table_schema = 'public';
  RAISE NOTICE 'Tablas con columna usu_creacion: %', cnt;
END $$;
