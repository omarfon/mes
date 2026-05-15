-- Seed de 10 despachos para visualizar en frontend
-- Vista objetivo: http://localhost:4200/production/dispatch
-- Fecha: 2026-04-24

INSERT INTO despachos (
  id,
  numero_despacho,
  orden_id,
  tipo,
  estado,
  destino,
  direccion,
  contacto,
  telefono,
  fecha_programada,
  fecha_despacho,
  fecha_entrega,
  items,
  cantidad_items,
  peso_total,
  volumen_total,
  transportista,
  numero_guia,
  vehiculo,
  conductor,
  documentos,
  observaciones,
  preparado_por,
  autorizado_por,
  created_at,
  updated_at
) VALUES
  (
    gen_random_uuid(), 'DESP-2026-101', NULL, 'CLIENTE', 'PENDIENTE',
    'Textiles Andinos SAC', 'Av. Industrial 123, Lima', 'Ana Ruiz', '+51 999111222',
    NOW() + INTERVAL '1 day', NULL, NULL,
    '[{"sku":"PRD-001","descripcion":"Hilo 29/1","cantidad":120,"uom":"UND"}]'::jsonb,
    1, 480.50, 3.20, 'Logistica Norte', NULL, NULL, NULL,
    NULL, 'Pendiente de preparación', NULL, NULL,
    NOW() - INTERVAL '2 days', NOW()
  ),
  (
    gen_random_uuid(), 'DESP-2026-102', NULL, 'INTERNO', 'EN_PREPARACION',
    'Almacén Planta Norte', 'Zona B - Rack 12', 'Carlos Mena', '+51 988333444',
    NOW() + INTERVAL '1 day', NULL, NULL,
    '[{"sku":"PRD-001","descripcion":"Hilo 29/1","cantidad":80,"uom":"UND"},{"sku":"PRD-002","descripcion":"Hilo 20/1","cantidad":20,"uom":"UND"}]'::jsonb,
    2, 320.00, 2.10, 'Flota Interna', NULL, 'ABC-123', 'Luis Paredes',
    NULL, 'Picking en curso', NULL, NULL,
    NOW() - INTERVAL '1 day', NOW()
  ),
  (
    gen_random_uuid(), 'DESP-2026-103', NULL, 'CLIENTE', 'LISTO',
    'Confecciones del Sur', 'Jr. Comercio 456, Arequipa', 'Marta León', '+51 977555666',
    NOW(), NOW(), NULL,
    '[{"sku":"PRD-001","descripcion":"Hilo 29/1","cantidad":150,"uom":"UND"}]'::jsonb,
    1, 600.00, 3.90, 'Rutas Express', 'GUIA-2026-103', 'BCD-456', 'Jorge Silva',
    '[{"tipo":"guia_remision","numero":"GUIA-2026-103"}]'::jsonb,
    'Listo para salida', NULL, NULL,
    NOW() - INTERVAL '3 days', NOW()
  ),
  (
    gen_random_uuid(), 'DESP-2026-104', NULL, 'TRANSFERENCIA', 'EN_TRANSITO',
    'Centro Distribución Este', 'Av. Logística 890, Huancayo', 'Rosa Vega', '+51 966777888',
    NOW() - INTERVAL '1 day', NOW() - INTERVAL '20 hours', NULL,
    '[{"sku":"PRD-003","descripcion":"Tela cruda","cantidad":60,"uom":"ROL"}]'::jsonb,
    1, 710.00, 4.20, 'Cargo Perú', 'GUIA-2026-104', 'CDE-789', 'Pedro Salas',
    '[{"tipo":"tracking","codigo":"TRK104"}]'::jsonb,
    'En ruta estimada 8 horas', NULL, NULL,
    NOW() - INTERVAL '4 days', NOW()
  ),
  (
    gen_random_uuid(), 'DESP-2026-105', NULL, 'CLIENTE', 'ENTREGADO',
    'Moda Pacifico', 'Calle Textil 222, Trujillo', 'Diana Flores', '+51 955000111',
    NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days',
    '[{"sku":"PRD-001","descripcion":"Hilo 29/1","cantidad":90,"uom":"UND"}]'::jsonb,
    1, 360.00, 2.50, 'TransAndes', 'GUIA-2026-105', 'DEF-321', 'Renato Cueva',
    '[{"tipo":"acta_entrega","numero":"AE-105"}]'::jsonb,
    'Entrega confirmada por cliente', NULL, NULL,
    NOW() - INTERVAL '6 days', NOW() - INTERVAL '2 days'
  ),
  (
    gen_random_uuid(), 'DESP-2026-106', NULL, 'CLIENTE', 'CANCELADO',
    'Retail Uno', 'Av. Central 100, Lima', 'Mario Peña', '+51 944222333',
    NOW() - INTERVAL '2 days', NULL, NULL,
    '[{"sku":"PRD-004","descripcion":"Tela premium","cantidad":40,"uom":"ROL"}]'::jsonb,
    1, 500.00, 2.90, 'QuickCargo', NULL, NULL, NULL,
    NULL, 'Cancelado por cambio de pedido', NULL, NULL,
    NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day'
  ),
  (
    gen_random_uuid(), 'DESP-2026-107', NULL, 'INTERNO', 'PENDIENTE',
    'Almacén Planta Sur', 'Zona C - Módulo 7', 'Erika Tello', '+51 933444555',
    NOW() + INTERVAL '2 days', NULL, NULL,
    '[{"sku":"PRD-005","descripcion":"Conos de hilo","cantidad":200,"uom":"UND"}]'::jsonb,
    1, 210.00, 1.30, 'Flota Interna', NULL, NULL, NULL,
    NULL, 'Pendiente asignación de unidad', NULL, NULL,
    NOW() - INTERVAL '2 days', NOW()
  ),
  (
    gen_random_uuid(), 'DESP-2026-108', NULL, 'TRANSFERENCIA', 'EN_PREPARACION',
    'Centro Logístico Callao', 'Depósito 4', 'Gina Robles', '+51 922111000',
    NOW() + INTERVAL '6 hours', NULL, NULL,
    '[{"sku":"PRD-006","descripcion":"Paquetes mixtos","cantidad":35,"uom":"CAJ"}]'::jsonb,
    1, 280.40, 1.80, 'MoveFast', NULL, 'EFG-654', 'Cesar Prado',
    NULL, 'Empaque y etiquetado', NULL, NULL,
    NOW() - INTERVAL '1 day', NOW()
  ),
  (
    gen_random_uuid(), 'DESP-2026-109', NULL, 'CLIENTE', 'LISTO',
    'Textil Premium SAC', 'Av. Los Telares 55, Lima', 'Noelia Campos', '+51 911222333',
    NOW() + INTERVAL '3 hours', NOW() - INTERVAL '30 minutes', NULL,
    '[{"sku":"PRD-007","descripcion":"Hilo fino","cantidad":75,"uom":"UND"}]'::jsonb,
    1, 295.00, 1.95, 'Rutas Express', 'GUIA-2026-109', 'FGH-987', 'Raul Pinto',
    '[{"tipo":"guia_remision","numero":"GUIA-2026-109"}]'::jsonb,
    'Unidad esperando salida', NULL, NULL,
    NOW() - INTERVAL '2 days', NOW()
  ),
  (
    gen_random_uuid(), 'DESP-2026-110', NULL, 'CLIENTE', 'EN_TRANSITO',
    'Comercial Lima Norte', 'Jr. Mercado 345, Lima', 'Patricia Soto', '+51 900123456',
    NOW() - INTERVAL '10 hours', NOW() - INTERVAL '9 hours', NULL,
    '[{"sku":"PRD-001","descripcion":"Hilo 29/1","cantidad":110,"uom":"UND"},{"sku":"PRD-008","descripcion":"Tela denim","cantidad":15,"uom":"ROL"}]'::jsonb,
    2, 640.90, 4.00, 'Cargo Perú', 'GUIA-2026-110', 'HIJ-741', 'Victor Jara',
    '[{"tipo":"tracking","codigo":"TRK110"}]'::jsonb,
    'Despacho en ruta al cliente', NULL, NULL,
    NOW() - INTERVAL '3 days', NOW()
  )
ON CONFLICT (numero_despacho) DO NOTHING;

SELECT estado, COUNT(*) AS total
FROM despachos
GROUP BY estado
ORDER BY estado;
