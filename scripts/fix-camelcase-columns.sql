-- =============================================================================
-- MIGRACIÓN: Normalizar columnas de fecha a snake_case
-- Problema: varias tablas se crearon con TypeORM usando camelCase (createdAt,
--           updatedAt, deletedAt) en lugar de snake_case (created_at, etc.)
--           que espera AuditableEntity.
-- Tablas afectadas: unidades_medida, motivos_parada, operadores, procesos,
--                   turnos, audits, maintenance_components, maintenance_records,
--                   quality_defects
-- Ejecutar en: mes_db
-- =============================================================================

-- ── Helper: renombrar columna solo si existe con el nombre camelCase ──────────
CREATE OR REPLACE FUNCTION rename_to_snake(p_table text, p_from text, p_to text)
RETURNS void AS $$
BEGIN
  -- Solo renombrar si la columna camelCase existe y la snake_case NO existe
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = p_table AND column_name = p_from
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = p_table AND column_name = p_to
  ) THEN
    EXECUTE format('ALTER TABLE %I RENAME COLUMN %I TO %I', p_table, p_from, p_to);
    RAISE NOTICE 'Renombrada columna %.% → %', p_table, p_from, p_to;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ── Helper: eliminar columna redundante si existe ─────────────────────────────
CREATE OR REPLACE FUNCTION drop_if_exists(p_table text, p_col text)
RETURNS void AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = p_table AND column_name = p_col
  ) THEN
    EXECUTE format('ALTER TABLE %I DROP COLUMN %I', p_table, p_col);
    RAISE NOTICE 'Eliminada columna redundante %.%', p_table, p_col;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 1. unidades_medida
--    Tiene: createdAt, updatedAt, deletedAt (camelCase) + deleted_at (migración)
-- =============================================================================
SELECT rename_to_snake('unidades_medida', 'createdAt',  'created_at');
SELECT rename_to_snake('unidades_medida', 'updatedAt',  'updated_at');
-- deletedAt es redundante: ya existe deleted_at por la migración anterior
SELECT drop_if_exists('unidades_medida', 'deletedAt');

-- =============================================================================
-- 2. motivos_parada
--    Tiene: createdAt, updatedAt, deletedAt (camelCase) + deleted_at (migración)
-- =============================================================================
SELECT rename_to_snake('motivos_parada', 'createdAt',  'created_at');
SELECT rename_to_snake('motivos_parada', 'updatedAt',  'updated_at');
SELECT drop_if_exists('motivos_parada', 'deletedAt');

-- =============================================================================
-- 3. operadores
--    Tiene: createdAt, updatedAt, deletedAt (camelCase) + deleted_at (migración)
-- =============================================================================
SELECT rename_to_snake('operadores', 'createdAt',  'created_at');
SELECT rename_to_snake('operadores', 'updatedAt',  'updated_at');
SELECT drop_if_exists('operadores', 'deletedAt');

-- =============================================================================
-- 4. procesos
--    Tiene: createdAt, updatedAt, deletedAt (camelCase) + deleted_at (migración)
-- =============================================================================
SELECT rename_to_snake('procesos', 'createdAt',  'created_at');
SELECT rename_to_snake('procesos', 'updatedAt',  'updated_at');
SELECT drop_if_exists('procesos', 'deletedAt');

-- =============================================================================
-- 5. turnos
--    Tiene: createdAt, updatedAt, deletedAt (camelCase) + deleted_at (migración)
-- =============================================================================
SELECT rename_to_snake('turnos', 'createdAt',  'created_at');
SELECT rename_to_snake('turnos', 'updatedAt',  'updated_at');
SELECT drop_if_exists('turnos', 'deletedAt');

-- =============================================================================
-- 6. audits
--    Tiene: createdAt (camelCase) — falta updated_at
-- =============================================================================
SELECT rename_to_snake('audits', 'createdAt', 'created_at');
-- Agregar updated_at si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'audits'
      AND column_name IN ('updated_at', 'updatedAt')
  ) THEN
    ALTER TABLE audits ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT now();
    RAISE NOTICE 'Agregada columna audits.updated_at';
  END IF;
END $$;

-- =============================================================================
-- 7. maintenance_components
--    Tiene: createdAt, updatedAt (camelCase)
-- =============================================================================
SELECT rename_to_snake('maintenance_components', 'createdAt',  'created_at');
SELECT rename_to_snake('maintenance_components', 'updatedAt',  'updated_at');

-- =============================================================================
-- 8. maintenance_records
--    Tiene: createdAt, updatedAt (camelCase)
-- =============================================================================
SELECT rename_to_snake('maintenance_records', 'createdAt',  'created_at');
SELECT rename_to_snake('maintenance_records', 'updatedAt',  'updated_at');

-- =============================================================================
-- 9. quality_defects
--    Tiene: createdAt Y created_at (ambas) → eliminar camelCase redundante
-- =============================================================================
SELECT drop_if_exists('quality_defects', 'createdAt');

-- =============================================================================
-- Limpieza de funciones auxiliares
-- =============================================================================
DROP FUNCTION IF EXISTS rename_to_snake(text, text, text);
DROP FUNCTION IF EXISTS drop_if_exists(text, text);

-- =============================================================================
-- 10. lot_genealogy
--     Tiene: created_at, deleted_at — falta updated_at
-- =============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'lot_genealogy'
      AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE lot_genealogy ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT now();
    RAISE NOTICE 'Agregada columna lot_genealogy.updated_at';
  END IF;
END $$;

-- =============================================================================
-- Verificación final
-- =============================================================================
SELECT table_name, column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND column_name IN ('createdAt','updatedAt','deletedAt')
ORDER BY table_name, column_name;
-- Si la query anterior devuelve 0 filas, la migración fue exitosa.
