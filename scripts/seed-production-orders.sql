-- Script para insertar 20 órdenes de producción de prueba
-- Fecha: 2026-04-24

-- Primero, crear algunas rutas básicas (si no existen)
INSERT INTO routes (id, code, name, version, description, product_id, effective_from, "isActive", created_at, updated_at)
VALUES 
  ('aaaaaaaa-1111-4111-8111-111111111111', 'RUTA-HIL-001', 'Ruta Estándar Hilo 29/1', 1, 'Proceso estándar para fabricación de hilo', 'dddd66eb-2ce8-42eb-b1e0-2d71e8bb0b7b', '2024-01-01', true, NOW(), NOW()),
  ('aaaaaaaa-2222-4222-8222-222222222222', 'RUTA-HIL-002', 'Ruta Express Hilo 29/1', 1, 'Proceso rápido para pedidos urgentes', 'dddd66eb-2ce8-42eb-b1e0-2d71e8bb0b7b', '2024-01-01', true, NOW(), NOW()),
  ('aaaaaaaa-3333-4333-8333-333333333333', 'RUTA-HIL-003', 'Ruta Premium Hilo 29/1', 1, 'Proceso con control de calidad estricto', 'dddd66eb-2ce8-42eb-b1e0-2d71e8bb0b7b', '2024-01-01', true, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Insertar 20 órdenes de producción con datos variados
INSERT INTO production_orders (
  id, code, external_code, product_id, route_id, 
  quantity_planned, quantity_produced, unit_of_measure, 
  status, priority, 
  main_work_center_id, shift_id,
  planned_start_date, planned_end_date,
  actual_start_date, actual_end_date,
  due_date,
  created_at, updated_at
) VALUES 
  -- Órdenes PLANIFICADAS (5)
  (gen_random_uuid(), 'OP-2026-001', 'ERP-2026-001', 'dddd66eb-2ce8-42eb-b1e0-2d71e8bb0b7b', 'aaaaaaaa-1111-4111-8111-111111111111', 
   1000, 0, 'KG', 'PLANNED', 'NORMAL', 
   '90909090-1111-4111-8111-111111111111', 'c3180a90-9dbc-4137-86ae-2f59399d284b',
   '2026-04-25 08:00:00', '2026-04-25 16:00:00',
   NULL, NULL,
   '2026-04-30 23:59:59',
   NOW() - INTERVAL '5 days', NOW()),

  (gen_random_uuid(), 'OP-2026-002', 'ERP-2026-002', 'dddd66eb-2ce8-42eb-b1e0-2d71e8bb0b7b', 'aaaaaaaa-2222-4222-8222-222222222222', 
   1500, 0, 'KG', 'PLANNED', 'HIGH', 
   '90909090-2222-4222-8222-222222222222', 'c3180a90-9dbc-4137-86ae-2f59399d284b',
   '2026-04-26 08:00:00', '2026-04-26 20:00:00',
   NULL, NULL,
   '2026-04-27 23:59:59',
   NOW() - INTERVAL '4 days', NOW()),

  (gen_random_uuid(), 'OP-2026-003', 'ERP-2026-003', 'dddd66eb-2ce8-42eb-b1e0-2d71e8bb0b7b', 'aaaaaaaa-3333-4333-8333-333333333333', 
   800, 0, 'KG', 'PLANNED', 'URGENT', 
   '90909090-3333-4333-8333-333333333333', 'c3180a90-9dbc-4137-86ae-2f59399d284b',
   '2026-04-24 20:00:00', '2026-04-25 04:00:00',
   NULL, NULL,
   '2026-04-25 12:00:00',
   NOW() - INTERVAL '3 days', NOW()),

  (gen_random_uuid(), 'OP-2026-004', 'ERP-2026-004', 'dddd66eb-2ce8-42eb-b1e0-2d71e8bb0b7b', 'aaaaaaaa-1111-4111-8111-111111111111', 
   2000, 0, 'KG', 'PLANNED', 'LOW', 
   '90909090-1111-4111-8111-111111111111', 'c3180a90-9dbc-4137-86ae-2f59399d284b',
   '2026-05-01 08:00:00', '2026-05-02 16:00:00',
   NULL, NULL,
   '2026-05-10 23:59:59',
   NOW() - INTERVAL '6 days', NOW()),

  (gen_random_uuid(), 'OP-2026-005', NULL, 'dddd66eb-2ce8-42eb-b1e0-2d71e8bb0b7b', 'aaaaaaaa-1111-4111-8111-111111111111', 
   1200, 0, 'KG', 'PLANNED', 'NORMAL', 
   '90909090-4444-4444-8444-444444444444', 'c3180a90-9dbc-4137-86ae-2f59399d284b',
   '2026-04-27 08:00:00', '2026-04-27 18:00:00',
   NULL, NULL,
   '2026-05-01 23:59:59',
   NOW() - INTERVAL '2 days', NOW()),

  -- Órdenes LIBERADAS (3)
  (gen_random_uuid(), 'OP-2026-006', 'ERP-2026-006', 'dddd66eb-2ce8-42eb-b1e0-2d71e8bb0b7b', 'aaaaaaaa-1111-4111-8111-111111111111', 
   1100, 0, 'KG', 'RELEASED', 'NORMAL', 
   '90909090-1111-4111-8111-111111111111', 'c3180a90-9dbc-4137-86ae-2f59399d284b',
   '2026-04-24 08:00:00', '2026-04-24 16:00:00',
   NULL, NULL,
   '2026-04-26 23:59:59',
   NOW() - INTERVAL '1 day', NOW()),

  (gen_random_uuid(), 'OP-2026-007', 'ERP-2026-007', 'dddd66eb-2ce8-42eb-b1e0-2d71e8bb0b7b', 'aaaaaaaa-2222-4222-8222-222222222222', 
   900, 0, 'KG', 'RELEASED', 'HIGH', 
   '90909090-2222-4222-8222-222222222222', 'c3180a90-9dbc-4137-86ae-2f59399d284b',
   '2026-04-24 14:00:00', '2026-04-24 22:00:00',
   NULL, NULL,
   '2026-04-25 23:59:59',
   NOW() - INTERVAL '1 day', NOW()),

  (gen_random_uuid(), 'OP-2026-008', NULL, 'dddd66eb-2ce8-42eb-b1e0-2d71e8bb0b7b', 'aaaaaaaa-1111-4111-8111-111111111111', 
   1300, 0, 'KG', 'RELEASED', 'NORMAL', 
   '90909090-3333-4333-8333-333333333333', 'c3180a90-9dbc-4137-86ae-2f59399d284b',
   '2026-04-24 10:00:00', '2026-04-24 18:00:00',
   NULL, NULL,
   '2026-04-28 23:59:59',
   NOW(), NOW()),

  -- Órdenes EN PROGRESO (6)
  (gen_random_uuid(), 'OP-2026-009', 'ERP-2026-009', 'dddd66eb-2ce8-42eb-b1e0-2d71e8bb0b7b', 'aaaaaaaa-1111-4111-8111-111111111111', 
   1400, 650, 'KG', 'IN_PROGRESS', 'NORMAL', 
   '90909090-1111-4111-8111-111111111111', 'c3180a90-9dbc-4137-86ae-2f59399d284b',
   '2026-04-23 08:00:00', '2026-04-24 16:00:00',
   '2026-04-23 08:15:00', NULL,
   '2026-04-25 23:59:59',
   NOW() - INTERVAL '2 days', NOW()),

  (gen_random_uuid(), 'OP-2026-010', 'ERP-2026-010', 'dddd66eb-2ce8-42eb-b1e0-2d71e8bb0b7b', 'aaaaaaaa-2222-4222-8222-222222222222', 
   1000, 850, 'KG', 'IN_PROGRESS', 'HIGH', 
   '90909090-2222-4222-8222-222222222222', 'c3180a90-9dbc-4137-86ae-2f59399d284b',
   '2026-04-23 14:00:00', '2026-04-24 06:00:00',
   '2026-04-23 14:20:00', NULL,
   '2026-04-24 18:00:00',
   NOW() - INTERVAL '1 day', NOW()),

  (gen_random_uuid(), 'OP-2026-011', 'ERP-2026-011', 'dddd66eb-2ce8-42eb-b1e0-2d71e8bb0b7b', 'aaaaaaaa-3333-4333-8333-333333333333', 
   2500, 1200, 'KG', 'IN_PROGRESS', 'URGENT', 
   '90909090-3333-4333-8333-333333333333', 'c3180a90-9dbc-4137-86ae-2f59399d284b',
   '2026-04-22 08:00:00', '2026-04-24 20:00:00',
   '2026-04-22 08:10:00', NULL,
   '2026-04-24 23:59:59',
   NOW() - INTERVAL '3 days', NOW()),

  (gen_random_uuid(), 'OP-2026-012', NULL, 'dddd66eb-2ce8-42eb-b1e0-2d71e8bb0b7b', 'aaaaaaaa-1111-4111-8111-111111111111', 
   800, 320, 'KG', 'IN_PROGRESS', 'NORMAL', 
   '90909090-4444-4444-8444-444444444444', 'c3180a90-9dbc-4137-86ae-2f59399d284b',
   '2026-04-24 06:00:00', '2026-04-24 14:00:00',
   '2026-04-24 06:05:00', NULL,
   '2026-04-26 23:59:59',
   NOW(), NOW()),

  (gen_random_uuid(), 'OP-2026-013', 'ERP-2026-013', 'dddd66eb-2ce8-42eb-b1e0-2d71e8bb0b7b', 'aaaaaaaa-1111-4111-8111-111111111111', 
   1600, 450, 'KG', 'IN_PROGRESS', 'HIGH', 
   '90909090-1111-4111-8111-111111111111', 'c3180a90-9dbc-4137-86ae-2f59399d284b',
   '2026-04-23 20:00:00', '2026-04-24 12:00:00',
   '2026-04-23 20:30:00', NULL,
   '2026-04-25 12:00:00',
   NOW() - INTERVAL '1 day', NOW()),

  (gen_random_uuid(), 'OP-2026-014', 'ERP-2026-014', 'dddd66eb-2ce8-42eb-b1e0-2d71e8bb0b7b', 'aaaaaaaa-2222-4222-8222-222222222222', 
   1100, 980, 'KG', 'IN_PROGRESS', 'NORMAL', 
   '90909090-2222-4222-8222-222222222222', 'c3180a90-9dbc-4137-86ae-2f59399d284b',
   '2026-04-24 02:00:00', '2026-04-24 10:00:00',
   '2026-04-24 02:15:00', NULL,
   '2026-04-25 23:59:59',
   NOW(), NOW()),

  -- Órdenes PAUSADAS (2)
  (gen_random_uuid(), 'OP-2026-015', 'ERP-2026-015', 'dddd66eb-2ce8-42eb-b1e0-2d71e8bb0b7b', 'aaaaaaaa-1111-4111-8111-111111111111', 
   1700, 890, 'KG', 'PAUSED', 'NORMAL', 
   '90909090-1111-4111-8111-111111111111', 'c3180a90-9dbc-4137-86ae-2f59399d284b',
   '2026-04-22 08:00:00', '2026-04-24 16:00:00',
   '2026-04-22 08:25:00', NULL,
   '2026-04-25 23:59:59',
   NOW() - INTERVAL '3 days', NOW()),

  (gen_random_uuid(), 'OP-2026-016', NULL, 'dddd66eb-2ce8-42eb-b1e0-2d71e8bb0b7b', 'aaaaaaaa-3333-4333-8333-333333333333', 
   950, 420, 'KG', 'PAUSED', 'HIGH', 
   '90909090-3333-4333-8333-333333333333', 'c3180a90-9dbc-4137-86ae-2f59399d284b',
   '2026-04-23 14:00:00', '2026-04-24 06:00:00',
   '2026-04-23 14:30:00', NULL,
   '2026-04-24 18:00:00',
   NOW() - INTERVAL '1 day', NOW()),

  -- Órdenes COMPLETADAS (3)
  (gen_random_uuid(), 'OP-2026-017', 'ERP-2026-017', 'dddd66eb-2ce8-42eb-b1e0-2d71e8bb0b7b', 'aaaaaaaa-1111-4111-8111-111111111111', 
   1000, 1000, 'KG', 'COMPLETED', 'NORMAL', 
   '90909090-1111-4111-8111-111111111111', 'c3180a90-9dbc-4137-86ae-2f59399d284b',
   '2026-04-20 08:00:00', '2026-04-20 16:00:00',
   '2026-04-20 08:10:00', '2026-04-20 15:45:00',
   '2026-04-22 23:59:59',
   NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days'),

  (gen_random_uuid(), 'OP-2026-018', 'ERP-2026-018', 'dddd66eb-2ce8-42eb-b1e0-2d71e8bb0b7b', 'aaaaaaaa-2222-4222-8222-222222222222', 
   1500, 1500, 'KG', 'COMPLETED', 'HIGH', 
   '90909090-2222-4222-8222-222222222222', 'c3180a90-9dbc-4137-86ae-2f59399d284b',
   '2026-04-21 08:00:00', '2026-04-22 16:00:00',
   '2026-04-21 08:05:00', '2026-04-22 14:30:00',
   '2026-04-23 23:59:59',
   NOW() - INTERVAL '4 days', NOW() - INTERVAL '3 days'),

  (gen_random_uuid(), 'OP-2026-019', NULL, 'dddd66eb-2ce8-42eb-b1e0-2d71e8bb0b7b', 'aaaaaaaa-3333-4333-8333-333333333333', 
   800, 800, 'KG', 'COMPLETED', 'URGENT', 
   '90909090-3333-4333-8333-333333333333', 'c3180a90-9dbc-4137-86ae-2f59399d284b',
   '2026-04-19 20:00:00', '2026-04-20 04:00:00',
   '2026-04-19 20:15:00', '2026-04-20 03:50:00',
   '2026-04-20 12:00:00',
   NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days'),

  -- Orden CANCELADA (1)
  (gen_random_uuid(), 'OP-2026-020', 'ERP-2026-020', 'dddd66eb-2ce8-42eb-b1e0-2d71e8bb0b7b', 'aaaaaaaa-1111-4111-8111-111111111111', 
   1200, 0, 'KG', 'CANCELED', 'NORMAL', 
   '90909090-4444-4444-8444-444444444444', 'c3180a90-9dbc-4137-86ae-2f59399d284b',
   '2026-04-18 08:00:00', '2026-04-18 16:00:00',
   NULL, NULL,
   '2026-04-20 23:59:59',
   NOW() - INTERVAL '7 days', NOW() - INTERVAL '6 days');

-- Verificar las órdenes creadas
SELECT 
  code, 
  status, 
  priority,
  quantity_planned,
  quantity_produced,
  ROUND((quantity_produced::numeric / quantity_planned::numeric * 100), 2) as progreso_pct,
  planned_start_date,
  actual_start_date
FROM production_orders
ORDER BY code;
