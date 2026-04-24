-- =====================================================
-- Script de Seed para Master Data
-- Datos ficticios para todos los módulos maestros
-- =====================================================

-- Limpiar datos existentes (opcional)
-- TRUNCATE TABLE movement_types, order_types, plant_calendar, plants, recipes, recipe_params, 
-- product_variants, routings, routing_steps, scrap_reasons, shift_groups, standard_times, 
-- workstations, suppliers CASCADE;

-- =====================================================
-- 1. PLANTS (Plantas)
-- =====================================================
INSERT INTO plants (id, code, name, country, city, timezone, active, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'PLT-001', 'Planta Central Lima', 'Perú', 'Lima', 'America/Lima', true, NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'PLT-002', 'Planta Norte Trujillo', 'Perú', 'Trujillo', 'America/Lima', true, NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'PLT-003', 'Planta Sur Arequipa', 'Perú', 'Arequipa', 'America/Lima', true, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- 1.1 AREAS (Áreas)
-- =====================================================
INSERT INTO areas (id, code, name, plant_code, type, description, active, created_at, updated_at) VALUES
('a1a1a1a1-1111-1111-1111-111111111111', 'AREA-HIL', 'Área de Hilatura', 'PLT-001', 'SPINNING', 'Proceso de hilado principal', true, NOW(), NOW()),
('a2a2a2a2-2222-2222-2222-222222222222', 'AREA-TEJ', 'Área de Tejido', 'PLT-001', 'WEAVING', 'Fabricación de telas', true, NOW(), NOW()),
('a3a3a3a3-3333-3333-3333-333333333333', 'AREA-TIN', 'Área de Tintorería', 'PLT-001', 'DYEING', 'Proceso de teñido', true, NOW(), NOW()),
('a4a4a4a4-4444-4444-4444-444444444444', 'AREA-ALM', 'Área de Almacén', 'PLT-002', 'WAREHOUSE', 'Almacenamiento de materiales', true, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- 2. MOVEMENT TYPES (Tipos de Movimiento)
-- =====================================================
INSERT INTO movement_types (id, code, name, category, notes, active, created_at, updated_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'MOV-IN-001', 'Recepción de Compra', 'IN', 'Ingreso por compra a proveedor', true, NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'MOV-IN-002', 'Devolución de Cliente', 'IN', 'Retorno de productos desde cliente', true, NOW(), NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'MOV-OUT-001', 'Venta/Despacho', 'OUT', 'Salida por venta a cliente', true, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'MOV-OUT-002', 'Consumo Producción', 'OUT', 'Materiales consumidos en producción', true, NOW(), NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'MOV-TRF-001', 'Transferencia Interna', 'TRANSFER', 'Movimiento entre ubicaciones', true, NOW(), NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'MOV-ADJ-001', 'Ajuste de Inventario', 'ADJUSTMENT', 'Ajuste por conteo físico', true, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- 3. ORDER TYPES (Tipos de Orden)
-- =====================================================
INSERT INTO order_types (id, code, name, description, requires_release, active, created_at, updated_at) VALUES
('44444444-4444-4444-4444-444444444444', 'ORD-STD', 'Orden Estándar', 'Orden de producción estándar', false, true, NOW(), NOW()),
('55555555-5555-5555-5555-555555555555', 'ORD-URG', 'Orden Urgente', 'Orden prioritaria de alta urgencia', true, true, NOW(), NOW()),
('66666666-6666-6666-6666-666666666666', 'ORD-RWK', 'Orden de Retrabajo', 'Orden para reprocesar producto no conforme', false, true, NOW(), NOW()),
('77777777-7777-7777-7777-777777777777', 'ORD-MTN', 'Orden de Mantenimiento', 'Orden para actividades de mantenimiento', true, true, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- 4. PLANT CALENDAR (Calendario de Planta)
-- =====================================================
INSERT INTO plant_calendar (id, plant_code, type, date, name, affects_all, notes, created_at, updated_at) VALUES
('88888888-8888-8888-8888-888888888888', 'PLT-001', 'HOLIDAY', '2026-05-01', 'Día del Trabajo', true, 'Feriado nacional', NOW(), NOW()),
('99999999-9999-9999-9999-999999999999', 'PLT-001', 'HOLIDAY', '2026-07-28', 'Fiestas Patrias', true, 'Celebración nacional', NOW(), NOW()),
('aaaabbbb-aaaa-bbbb-aaaa-bbbbaaaabbbb', 'PLT-001', 'PLANNED_STOP', '2026-06-15', 'Parada de mantenimiento', true, 'Mantenimiento preventivo planta', NOW(), NOW()),
('bbbbcccc-bbbb-cccc-bbbb-ccccbbbbcccc', 'PLT-002', 'EXTRA_SHIFT', '2026-05-20', 'Turno extra producción', false, 'Turno extra para cumplir demanda', NOW(), NOW()),
('ccccdddd-cccc-dddd-cccc-ddddccccdddd', 'PLT-001', 'MAINTENANCE_WINDOW', '2026-07-01', 'Ventana de mantenimiento', false, 'Ventana de mantenimiento eléctrico', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- 4.1 MATERIALS (Materiales)
-- =====================================================
INSERT INTO materials (id, code, name, type, uom, active, created_at, updated_at) VALUES
('f1f1f1f1-1111-4111-8111-111111111111', 'MAT-ALG-001', 'Algodón Peinado', 'RAW', 'kg', true, NOW(), NOW()),
('f2f2f2f2-2222-4222-8222-222222222222', 'MAT-TIN-001', 'Tinte Reactivo Azul', 'RAW', 'lt', true, NOW(), NOW()),
('f3f3f3f3-3333-4333-8333-333333333333', 'MAT-HIL-001', 'Hilo Semi Elaborado', 'WIP', 'kg', true, NOW(), NOW()),
('f4f4f4f4-4444-4444-8444-444444444444', 'MAT-TEL-001', 'Tela Terminada', 'FINISHED', 'm', true, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- 5. SUPPLIERS (Proveedores)
-- =====================================================
INSERT INTO suppliers (id, ruc, name, contact, phone, email, active, created_at, updated_at) VALUES
('12121212-1212-1212-1212-121212121212', '20123456789', 'Textiles del Pacífico S.A.C.', 'Juan Pérez', '+51 999888777', 'juan.perez@textilespacifico.com', true, NOW(), NOW()),
('23232323-2323-2323-2323-232323232323', '20987654321', 'Hilos y Fibras S.R.L.', 'María Gonzales', '+51 988777666', 'maria@hilosyfibras.com', true, NOW(), NOW()),
('34343434-3434-3434-3434-343434343434', '20456789123', 'Químicos Industriales SAC', 'Carlos Rodríguez', '+51 977666555', 'carlos.r@quimicos.com', true, NOW(), NOW()),
('45454545-4545-4545-4545-454545454545', '20654321987', 'Maquinaria Textil Import', 'Ana Torres', '+51 966555444', 'ana@maquinariatextil.com', true, NOW(), NOW())
ON CONFLICT (ruc) DO NOTHING;

-- =====================================================
-- 6. SCRAP REASONS (Razones de Scrap)
-- =====================================================
INSERT INTO scrap_reasons (id, code, name, description, category, active, created_at, updated_at) VALUES
('56565656-5656-5656-5656-565656565656', 'SCR-MAT-001', 'Defecto de Materia Prima', 'Material recibido con defectos', 'MATERIAL', true, NOW(), NOW()),
('67676767-6767-6767-6767-676767676767', 'SCR-PRO-001', 'Error en Proceso', 'Falla durante el proceso productivo', 'PROCESS', true, NOW(), NOW()),
('78787878-7878-7878-7878-787878787878', 'SCR-MAQ-001', 'Falla de Máquina', 'Scrap generado por desperfecto de equipo', 'EQUIPMENT', true, NOW(), NOW()),
('89898989-8989-8989-8989-898989898989', 'SCR-OPE-001', 'Error Humano', 'Scrap por error del operador', 'OPERATOR', true, NOW(), NOW()),
('9a9a9a9a-9a9a-9a9a-9a9a-9a9a9a9a9a9a', 'SCR-OTH-001', 'Otros Motivos', 'Scrap por otras causas', 'OTHER', true, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- 7. SHIFT GROUPS (Grupos de Turno)
-- =====================================================
INSERT INTO shift_groups (id, code, name, shift_codes, supervisor_code, notes, active, created_at, updated_at) VALUES
('abababab-abab-abab-abab-abababababab', 'GRP-A', 'Grupo A - Mañana', 'T1,T2', 'SUP-001', 'Grupo turno mañana', true, NOW(), NOW()),
('bcbcbcbc-bcbc-bcbc-bcbc-bcbcbcbcbcbc', 'GRP-B', 'Grupo B - Tarde', 'T2,T3', 'SUP-002', 'Grupo turno tarde', true, NOW(), NOW()),
('cdcdcdcd-cdcd-cdcd-cdcd-cdcdcdcdcdcd', 'GRP-C', 'Grupo C - Noche', 'T3,T1', 'SUP-003', 'Grupo turno noche', true, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- 7.1 WORK CENTERS (Centros de Trabajo)
-- =====================================================
INSERT INTO work_centers (id, code, name, description, type, area, location, "nominalCapacity", "isActive", created_at, updated_at) VALUES
('90909090-1111-4111-8111-111111111111', 'CDT-HIL1', 'Centro Hilado 1', 'Línea principal de hilatura', 'LINE', 'Hilatura', 'Nave A', 1200, true, NOW(), NOW()),
('90909090-2222-4222-8222-222222222222', 'CDT-CAR1', 'Centro Cardado 1', 'Preparación y cardado de fibra', 'CELL', 'Preparación', 'Nave A', 800, true, NOW(), NOW()),
('90909090-3333-4333-8333-333333333333', 'CDT-TEJ1', 'Centro Tejido 1', 'Tejido plano y acabado inicial', 'LINE', 'Tejido', 'Nave B', 600, true, NOW(), NOW()),
('90909090-4444-4444-8444-444444444444', 'CDT-TIN1', 'Centro Tintorería 1', 'Proceso de teñido y secado', 'AREA', 'Tintorería', 'Nave C', 400, true, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- 8. WORKSTATIONS (Estaciones de Trabajo)
-- =====================================================
INSERT INTO workstations (id, code, name, work_center_code, type, asset, operator_slots, active, created_at, updated_at) VALUES
('dededede-dede-dede-dede-dedededede00', 'WS-HIL-01', 'Puesto Hiladora #1', 'CDT-HIL1', 'SEMI_AUTO', 'MAQ-001', 1, true, NOW(), NOW()),
('efefefef-efef-efef-efef-efefefefefef', 'WS-HIL-02', 'Puesto Hiladora #2', 'CDT-HIL1', 'SEMI_AUTO', 'MAQ-002', 1, true, NOW(), NOW()),
('f0f0f0f0-f0f0-f0f0-f0f0-f0f0f0f0f0f0', 'WS-CAR-01', 'Puesto Cardado #1', 'CDT-CAR1', 'AUTOMATED', 'MAQ-003', 0, true, NOW(), NOW()),
('01010101-0101-0101-0101-010101010101', 'WS-TEJ-01', 'Telar Manual #1', 'CDT-TEJ1', 'MANUAL', '', 2, true, NOW(), NOW()),
('02020202-0202-0202-0202-020202020202', 'WS-TIN-01', 'Puesto Teñido #1', 'CDT-TIN1', 'SEMI_AUTO', 'MAQ-005', 1, true, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- 9. PRODUCT VARIANTS (Variantes de Producto)
-- =====================================================
INSERT INTO product_variants (id, product_code, sku, color, size, presentation, barcode, net_weight, weight_unit, active, created_at, updated_at) VALUES
('03030303-0303-0303-0303-030303030303', 'PROD-HIL-001', 'HIL-001-BLN-1KG', 'Blanco', '1kg', 'Cono', '7501234567890', 1.0, 'kg', true, NOW(), NOW()),
('04040404-0404-0404-0404-040404040404', 'PROD-HIL-001', 'HIL-001-GRS-1KG', 'Gris', '1kg', 'Cono', '7501234567891', 1.0, 'kg', true, NOW(), NOW()),
('05050505-0505-0505-0505-050505050505', 'PROD-TEJ-001', 'TEJ-001-AZL-10M', 'Azul', '10m', 'Rollo', '7501234567892', 5.5, 'kg', true, NOW(), NOW()),
('06060606-0606-0606-0606-060606060606', 'PROD-TEJ-001', 'TEJ-001-ROJ-10M', 'Rojo', '10m', 'Rollo', '7501234567893', 5.5, 'kg', true, NOW(), NOW())
ON CONFLICT (sku) DO NOTHING;

-- =====================================================
-- 10. RECIPES (Recetas de Proceso)
-- =====================================================
INSERT INTO recipes (id, code, name, product_code, operation_code, version, approved_by, approved_at, notes, active, created_at, updated_at) VALUES
('07070707-0707-0707-0707-070707070707', 'RCP-HIL-001', 'Receta Hilado Estándar', 'PROD-HIL-001', 'OP-HILADO', '1.0', 'ENG-001', '2026-01-15 10:00:00', 'Receta base para hilado', true, NOW(), NOW()),
('08080808-0808-0808-0808-080808080808', 'RCP-TEJ-001', 'Receta Tejido Plano', 'PROD-TEJ-001', 'OP-TEJIDO', '1.0', 'ENG-002', '2026-02-10 14:30:00', 'Receta para tejido plano', true, NOW(), NOW()),
('09090909-0909-0909-0909-090909090909', 'RCP-TIN-001', 'Receta Teñido Reactivo', 'PROD-TEJ-001', 'OP-TINTURA', '2.0', 'ENG-001', '2026-03-05 09:00:00', 'Receta teñido con colorantes reactivos', true, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- 11. RECIPE PARAMS (Parámetros de Receta)
-- =====================================================
INSERT INTO recipe_params (id, recipe_id, sequence, param_name, setpoint, min_value, max_value, unit, notes, created_at, updated_at) VALUES
-- Parámetros para RCP-HIL-001
('0a0a0a0a-0a0a-0a0a-0a0a-0a0a0a0a0a0a', '07070707-0707-0707-0707-070707070707', 1, 'Temperatura', '180', '170', '190', '°C', 'Temperatura del proceso', NOW(), NOW()),
('0b0b0b0b-0b0b-0b0b-0b0b-0b0b0b0b0b0b', '07070707-0707-0707-0707-070707070707', 2, 'Velocidad', '1200', '1000', '1400', 'rpm', 'Velocidad del husillo', NOW(), NOW()),
('0c0c0c0c-0c0c-0c0c-0c0c-0c0c0c0c0c0c', '07070707-0707-0707-0707-070707070707', 3, 'Tensión', '50', '45', '55', 'N', 'Tensión del hilo', NOW(), NOW()),
-- Parámetros para RCP-TEJ-001
('0d0d0d0d-0d0d-0d0d-0d0d-0d0d0d0d0d0d', '08080808-0808-0808-0808-080808080808', 1, 'Densidad Urdimbre', '40', '38', '42', 'hilos/cm', '', NOW(), NOW()),
('0e0e0e0e-0e0e-0e0e-0e0e-0e0e0e0e0e0e', '08080808-0808-0808-0808-080808080808', 2, 'Densidad Trama', '35', '33', '37', 'hilos/cm', '', NOW(), NOW()),
-- Parámetros para RCP-TIN-001
('0f0f0f0f-0f0f-0f0f-0f0f-0f0f0f0f0f0f', '09090909-0909-0909-0909-090909090909', 1, 'pH', '7.5', '7.0', '8.0', 'pH', 'pH del baño de teñido', NOW(), NOW()),
('10101010-1010-1010-1010-101010101010', '09090909-0909-0909-0909-090909090909', 2, 'Temperatura Baño', '60', '55', '65', '°C', '', NOW(), NOW()),
('11111111-2222-3333-4444-555555555555', '09090909-0909-0909-0909-090909090909', 3, 'Tiempo Reposo', '30', '25', '35', 'min', 'Tiempo de reposo post-teñido', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- 12. ROUTINGS (Rutas de Producción)
-- =====================================================
INSERT INTO routings (id, code, name, product_code, version, notes, active, created_at, updated_at) VALUES
('12121212-3333-4444-5555-666666666666', 'RUT-HIL-001', 'Ruta Hilado Estándar', 'PROD-HIL-001', '1.0', 'Ruta completa para hilado', true, NOW(), NOW()),
('13131313-3333-4444-5555-666666666666', 'RUT-TEJ-001', 'Ruta Tejido Completo', 'PROD-TEJ-001', '1.0', 'Ruta desde hilado hasta acabado', true, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- 13. ROUTING STEPS (Pasos de Ruta)
-- =====================================================
INSERT INTO routing_steps (id, routing_id, sequence, operation_code, workstation_code, standard_time, notes, created_at, updated_at) VALUES
-- Pasos para RUT-HIL-001
('14141414-4444-5555-6666-777777777777', '12121212-3333-4444-5555-666666666666', 1, 'OP-PREP', 'WS-CAR-01', 5, 'Preparación y cardado', NOW(), NOW()),
('15151515-4444-5555-6666-777777777777', '12121212-3333-4444-5555-666666666666', 2, 'OP-HILADO', 'WS-HIL-01', 15, 'Proceso de hilado', NOW(), NOW()),
('16161616-4444-5555-6666-777777777777', '12121212-3333-4444-5555-666666666666', 3, 'OP-INSP', 'WS-HIL-02', 3, 'Inspección de calidad', NOW(), NOW()),
-- Pasos para RUT-TEJ-001
('17171717-4444-5555-6666-777777777777', '13131313-3333-4444-5555-666666666666', 1, 'OP-HILADO', 'WS-HIL-01', 15, 'Hilado previo', NOW(), NOW()),
('18181818-4444-5555-6666-777777777777', '13131313-3333-4444-5555-666666666666', 2, 'OP-TEJIDO', 'WS-TEJ-01', 25, 'Tejido en telar', NOW(), NOW()),
('19191919-4444-5555-6666-777777777777', '13131313-3333-4444-5555-666666666666', 3, 'OP-TINTURA', 'WS-TIN-01', 45, 'Teñido de tela', NOW(), NOW()),
('1a1a1a1a-4444-5555-6666-777777777777', '13131313-3333-4444-5555-666666666666', 4, 'OP-ACAB', 'WS-TEJ-01', 10, 'Acabado final', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- 14. STANDARD TIMES (Tiempos Estándar)
-- =====================================================
INSERT INTO standard_times (id, code, name, operation_code, product_code, workstation_code, setup_time, cycle_time, batch_size, valid_from, notes, active, created_at, updated_at) VALUES
('1b1b1b1b-5555-6666-7777-888888888888', 'STD-HIL-001', 'Tiempo Estándar Hilado', 'OP-HILADO', 'PROD-HIL-001', 'WS-HIL-01', 30, 15, 100, '2026-01-01', 'Tiempo para lote de 100kg', true, NOW(), NOW()),
('1c1c1c1c-5555-6666-7777-888888888888', 'STD-TEJ-001', 'Tiempo Estándar Tejido', 'OP-TEJIDO', 'PROD-TEJ-001', 'WS-TEJ-01', 45, 25, 50, '2026-01-01', 'Tiempo para 50m de tela', true, NOW(), NOW()),
('1d1d1d1d-5555-6666-7777-888888888888', 'STD-TIN-001', 'Tiempo Estándar Teñido', 'OP-TINTURA', 'PROD-TEJ-001', 'WS-TIN-01', 60, 45, 100, '2026-02-01', 'Tiempo para lote de 100m', true, NOW(), NOW()),
('1e1e1e1e-5555-6666-7777-888888888888', 'STD-CAR-001', 'Tiempo Estándar Cardado', 'OP-PREP', 'PROD-HIL-001', 'WS-CAR-01', 15, 5, 200, '2026-01-01', 'Preparación fibra', true, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- 15. MATERIAL LOTS (Lotes de Material)
-- =====================================================
INSERT INTO material_lots (id, lot_number, material_code, material_name, supplier_code, supplier_lot, received_date, expiry_date, initial_qty, available_qty, uom, location_code, status, notes, created_at, updated_at) VALUES
('c1c1c1c1-1111-4111-8111-111111111111', 'LOT-ALG-2026-001', 'MAT-ALG-001', 'Algodón Peinado', '20123456789', 'SUP-LOT-001', '2026-04-01', '2026-10-01', 1000, 850, 'kg', 'ALM-001', 'AVAILABLE', 'Lote inicial de algodón', NOW(), NOW()),
('c2c2c2c2-2222-4222-8222-222222222222', 'LOT-TIN-2026-001', 'MAT-TIN-001', 'Tinte Reactivo Azul', '20456789123', 'SUP-LOT-045', '2026-04-05', '2026-12-31', 200, 180, 'lt', 'ALM-002', 'AVAILABLE', 'Tintes para producción', NOW(), NOW())
ON CONFLICT (lot_number) DO NOTHING;

-- =====================================================
-- 16. BILL OF MATERIALS (BOM)
-- =====================================================
INSERT INTO bill_of_materials (id, code, product_code, product_name, version, base_qty, base_uom, valid_from, active, created_at, updated_at) VALUES
('d1d1d1d1-1111-4111-8111-111111111111', 'BOM-HIL-001', 'PROD-HIL-001', 'Hilo Estándar', '1.0', 1, 'kg', '2026-01-01', true, NOW(), NOW()),
('d2d2d2d2-2222-4222-8222-222222222222', 'BOM-TEJ-001', 'PROD-TEJ-001', 'Tela Tejida', '1.0', 1, 'm', '2026-01-01', true, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

INSERT INTO bom_lines (id, bom_id, material_code, material_name, qty, uom, scrap_pct, phase, optional, notes, created_at, updated_at) VALUES
('e1e1e1e1-1111-4111-8111-111111111111', 'd1d1d1d1-1111-4111-8111-111111111111', 'MAT-ALG-001', 'Algodón Peinado', 1.050, 'kg', 5, 'HILADO', false, 'Materia prima principal', NOW(), NOW()),
('e2e2e2e2-2222-4222-8222-222222222222', 'd2d2d2d2-2222-4222-8222-222222222222', 'MAT-HIL-001', 'Hilo Semi Elaborado', 0.800, 'kg', 2, 'TEJIDO', false, 'Consumo para tejido', NOW(), NOW()),
('e3e3e3e3-3333-4333-8333-333333333333', 'd2d2d2d2-2222-4222-8222-222222222222', 'MAT-TIN-001', 'Tinte Reactivo Azul', 0.050, 'lt', 1, 'TINTURA', true, 'Colorante opcional según orden', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- Verificación de datos insertados
-- =====================================================
SELECT 'Areas: ' || COUNT(*) FROM areas;
SELECT 'Plants: ' || COUNT(*) FROM plants;
SELECT 'Materials: ' || COUNT(*) FROM materials;
SELECT 'Movement Types: ' || COUNT(*) FROM movement_types;
SELECT 'Order Types: ' || COUNT(*) FROM order_types;
SELECT 'Plant Calendar: ' || COUNT(*) FROM plant_calendar;
SELECT 'Suppliers: ' || COUNT(*) FROM suppliers;
SELECT 'Scrap Reasons: ' || COUNT(*) FROM scrap_reasons;
SELECT 'Shift Groups: ' || COUNT(*) FROM shift_groups;
SELECT 'Work Centers: ' || COUNT(*) FROM work_centers;
SELECT 'Workstations: ' || COUNT(*) FROM workstations;
SELECT 'Product Variants: ' || COUNT(*) FROM product_variants;
SELECT 'Recipes: ' || COUNT(*) FROM recipes;
SELECT 'Recipe Params: ' || COUNT(*) FROM recipe_params;
SELECT 'Routings: ' || COUNT(*) FROM routings;
SELECT 'Routing Steps: ' || COUNT(*) FROM routing_steps;
SELECT 'Standard Times: ' || COUNT(*) FROM standard_times;
SELECT 'Material Lots: ' || COUNT(*) FROM material_lots;
SELECT 'BOM: ' || COUNT(*) FROM bill_of_materials;
SELECT 'BOM Lines: ' || COUNT(*) FROM bom_lines;
