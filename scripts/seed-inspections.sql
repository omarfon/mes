-- Seed inspections data  
-- Primero necesitamos crear algunos nodos de trazabilidad si no existen

-- Crear nodos de trazabilidad de ejemplo (si no existen)
INSERT INTO trace_nodes (id, code, type, quantity, notes, created_at, updated_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'LOT-2026-001', 'MATERIAL_LOT', 100, 'Nodo para inspección materia prima', NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'LOT-2026-002', 'SEMI_FINISHED_LOT', 200, 'Nodo para inspección en proceso', NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', 'LOT-2026-003', 'FINISHED_GOOD', 150, 'Nodo para inspección producto terminado', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insertar 3 inspecciones de calidad de ejemplo
INSERT INTO quality_inspections (id, type, node_id, status, "inspectedQuantity", notes, created_at, updated_at)
VALUES 
  (
    gen_random_uuid(),
    'RAW_MATERIAL',
    '11111111-1111-1111-1111-111111111111',
    'PENDING',
    100,
    'Inspección de materia prima recibida - Lote 001',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'IN_PROCESS',
    '22222222-2222-2222-2222-222222222222',
    'PASSED',
    200,
    'Inspección durante proceso de fabricación - Todo OK',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'FINISHED_GOOD',
    '33333333-3333-3333-3333-333333333333',
    'FAILED',
    150,
    'Inspección de producto terminado - Se encontraron defectos',
    NOW(),
    NOW()
  );

-- Verificar inserción
SELECT 
  i.id,
  i.type,
  i.status,
  i."inspectedQuantity",
  i.notes,
  n.code as node_code,
  i.created_at
FROM quality_inspections i
LEFT JOIN trace_nodes n ON i.node_id = n.id
ORDER BY i.created_at DESC
LIMIT 3;
