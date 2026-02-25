-- Insertar componentes de prueba
INSERT INTO maintenance_components (
  id, code, name, "assetCode", "assetName", category, status, manufacturer, 
  model, "serialNumber", criticality, "installDate", "expectedLifeHours", 
  "currentHours", notes, "lastInspection", "nextInspection", "createdAt", "updatedAt"
) VALUES
-- Motor principal de prensa hidráulica M-001 (CRITICAL, 25% de vida útil)
(
  gen_random_uuid(),
  'COMP-M001-MOT',
  'Motor Principal',
  'M-001',
  'Prensa Hidráulica 250T',
  'Motor',
  'OPERATIONAL',
  'Siemens',
  '1LA7-133-4AA60',
  'SN-MOT-2023-001',
  'CRITICAL',
  '2023-06-15',
  10000,
  2500,
  'Motor de 30kW, revisión programada cada 500 horas',
  '2024-12-15',
  '2025-06-15',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
-- Rodamiento delantero de motor M-001 (HIGH, 81.25% de vida útil, DEGRADED)
(
  gen_random_uuid(),
  'COMP-M001-BRG',
  'Rodamiento Delantero',
  'M-001',
  'Prensa Hidráulica 250T',
  'Rodamiento',
  'DEGRADED',
  'SKF',
  '6312-2Z',
  'SN-BRG-2023-045',
  'HIGH',
  '2023-06-15',
  8000,
  6500,
  'Se detectó vibración anormal en última inspección',
  '2025-01-10',
  '2025-02-15',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
-- Sensor de temperatura de torno CNC T-002 (MEDIUM, 40% de vida útil)
(
  gen_random_uuid(),
  'COMP-T002-TEMP',
  'Sensor de Temperatura',
  'T-002',
  'Torno CNC Haas ST-30',
  'Sensor',
  'OPERATIONAL',
  'Omron',
  'E52-CA10A',
  'SN-TEMP-2024-112',
  'MEDIUM',
  '2024-03-20',
  5000,
  2000,
  'Sensor PT100, rango -50°C a 250°C',
  '2024-12-20',
  '2025-03-20',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
-- Válvula proporcional de inyectora I-003 (HIGH, 56.67% de vida útil)
(
  gen_random_uuid(),
  'COMP-I003-VLV',
  'Válvula Proporcional',
  'I-003',
  'Inyectora 180T',
  'Válvula',
  'OPERATIONAL',
  'Bosch Rexroth',
  '4WRPEH6C3B24L-2X',
  'SN-VLV-2023-289',
  'HIGH',
  '2023-09-10',
  6000,
  3400,
  'Válvula de control de flujo hidráulico',
  '2024-11-10',
  '2025-05-10',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
-- Variador de frecuencia de extrusora E-004 (CRITICAL, 75% de vida útil)
(
  gen_random_uuid(),
  'COMP-E004-VFD',
  'Variador de Frecuencia',
  'E-004',
  'Extrusora Doble Husillo',
  'Electrónica',
  'OPERATIONAL',
  'WEG',
  'CFW11-0150',
  'SN-VFD-2022-067',
  'CRITICAL',
  '2022-11-25',
  12000,
  9000,
  'Variador 150kW, firmware v2.3.1',
  '2024-10-25',
  '2025-04-25',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
-- Encoder rotatorio de máquina de empaque M-005 (CRITICAL, 98.3% de vida útil, FAILED)
(
  gen_random_uuid(),
  'COMP-M005-ENC',
  'Encoder Rotatorio',
  'M-005',
  'Empacadora Automática',
  'Sensor',
  'FAILED',
  'Heidenhain',
  'ROD 426-2500',
  'SN-ENC-2021-145',
  'CRITICAL',
  '2021-08-15',
  12000,
  11800,
  'URGENTE: Encoder falla intermitente, requiere reemplazo inmediato',
  '2024-12-28',
  '2025-01-15',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
-- Servo motor de brazo robótico R-001 (HIGH, 45% de vida útil)
(
  gen_random_uuid(),
  'COMP-R001-SRV',
  'Servo Motor Eje Z',
  'R-001',
  'Robot Industrial ABB IRB 6700',
  'Motor',
  'OPERATIONAL',
  'ABB',
  '3HAC029157-001',
  'SN-SRV-2024-223',
  'HIGH',
  '2024-01-10',
  10000,
  4500,
  'Servo motor eje Z, torque máximo 450Nm',
  '2024-11-10',
  '2025-05-10',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
-- Husillo de torno CNC T-002 (MEDIUM, 62.5% de vida útil)
(
  gen_random_uuid(),
  'COMP-T002-SPD',
  'Husillo Principal',
  'T-002',
  'Torno CNC Haas ST-30',
  'Husillo',
  'OPERATIONAL',
  'Fanuc',
  'α-C400iA-30000/2500',
  'SN-SPD-2023-078',
  'MEDIUM',
  '2023-07-20',
  8000,
  5000,
  'Husillo de alta velocidad, max 30,000 RPM',
  '2024-10-20',
  '2025-04-20',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
-- Filtro de aceite hidráulico de prensa P-003 (MEDIUM, 3% de vida útil, recién reemplazado)
(
  gen_random_uuid(),
  'COMP-P003-FLT',
  'Filtro Hidráulico',
  'P-003',
  'Prensa Estampadora 400T',
  'Filtro',
  'REPLACED',
  'Parker',
  '938454Q',
  'SN-FLT-2025-001',
  'MEDIUM',
  '2025-01-02',
  5000,
  150,
  'Filtro reemplazado en mantenimiento preventivo',
  '2025-01-02',
  '2025-07-02',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
-- Controlador PLC de línea de ensamblaje L-001 (LOW, 33.33% de vida útil)
(
  gen_random_uuid(),
  'COMP-L001-PLC',
  'Controlador PLC',
  'L-001',
  'Línea Ensamblaje Automática',
  'Electrónica',
  'OPERATIONAL',
  'IFM',
  'CR0402',
  'SN-PLC-2024-156',
  'LOW',
  '2024-06-15',
  15000,
  5000,
  'PLC modular, 32 entradas / 24 salidas',
  '2024-12-15',
  '2025-06-15',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Insertar registros de mantenimiento para algunos componentes
-- Registro 1: Inspección del motor M-001
INSERT INTO maintenance_records (
  id, "componentId", type, technician, "hoursAtMaintenance", notes, date, "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  id,
  'INSPECTION',
  'Juan Pérez',
  2500,
  'Revisión trimestral: Estado general bueno, niveles de vibración normales',
  '2024-12-15',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM maintenance_components WHERE code = 'COMP-M001-MOT';

-- Registro 2: Lubricación del rodamiento M-001
INSERT INTO maintenance_records (
  id, "componentId", type, technician, "hoursAtMaintenance", notes, date, "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  id,
  'LUBRICATION',
  'Carlos González',
  6000,
  'Aplicación de grasa SKF LGHP 2, detectada vibración anormal',
  '2025-01-10',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM maintenance_components WHERE code = 'COMP-M001-BRG';

-- Registro 3: Reemplazo del filtro P-003
INSERT INTO maintenance_records (
  id, "componentId", type, technician, "hoursAtMaintenance", notes, date, "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  id,
  'REPLACEMENT',
  'María López',
  4850,
  'Reemplazo programado de filtro hidráulico, sistema presurizado correctamente',
  '2025-01-02',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM maintenance_components WHERE code = 'COMP-P003-FLT';

-- Registro 4: Reparación del encoder M-005
INSERT INTO maintenance_records (
  id, "componentId", type, technician, "hoursAtMaintenance", notes, date, "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  id,
  'REPAIR',
  'Roberto Sánchez',
  11500,
  'Intento de reparación de encoder con limpieza de contactos, falla persiste',
  '2024-12-28',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM maintenance_components WHERE code = 'COMP-M005-ENC';

-- Registro 5: Inspección del servo R-001
INSERT INTO maintenance_records (
  id, "componentId", type, technician, "hoursAtMaintenance", notes, date, "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  id,
  'INSPECTION',
  'Ana Martínez',
  4000,
  'Inspección de rutina: Servo operando dentro de parámetros normales',
  '2024-11-10',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM maintenance_components WHERE code = 'COMP-R001-SRV';

-- Verificar inserción
SELECT 
  code,
  name,
  "assetCode",
  status,
  criticality,
  "currentHours",
  "expectedLifeHours",
  ROUND(("currentHours"::DECIMAL / NULLIF("expectedLifeHours", 0)) * 100, 2) as life_percentage
FROM maintenance_components
ORDER BY code;
