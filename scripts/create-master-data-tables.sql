-- =====================================================
-- Script DDL para crear tablas de Master Data
-- =====================================================

-- Crear extensión para UUIDs si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PLANTS (Plantas)
-- =====================================================
CREATE TABLE IF NOT EXISTS plants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    timezone VARCHAR(50) NOT NULL DEFAULT 'America/Lima',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_plants_code ON plants(code);

-- =====================================================
-- AREAS (Áreas)
-- =====================================================
DO $$ BEGIN
    CREATE TYPE area_type AS ENUM ('PREPARATION', 'SPINNING', 'WEAVING', 'DYEING', 'FINISHING', 'QUALITY', 'WAREHOUSE', 'MAINTENANCE', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    plant_code VARCHAR(50) NOT NULL,
    type area_type NOT NULL DEFAULT 'SPINNING',
    description TEXT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_areas_code ON areas(code);

-- =====================================================
-- PLANT CALENDAR (Calendario de Planta)
-- =====================================================
DO $$ BEGIN
    CREATE TYPE calendar_event_type AS ENUM ('HOLIDAY', 'PLANNED_STOP', 'EXTRA_SHIFT', 'MAINTENANCE_WINDOW');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS plant_calendar (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plant_code VARCHAR(50) NOT NULL,
    type calendar_event_type NOT NULL,
    date DATE NOT NULL,
    name VARCHAR(200) NOT NULL DEFAULT '',
    affects_all BOOLEAN NOT NULL DEFAULT true,
    notes TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- =====================================================
-- MOVEMENT TYPES (Tipos de Movimiento)
-- =====================================================
DO $$ BEGIN
    CREATE TYPE movement_category AS ENUM ('IN', 'OUT', 'TRANSFER', 'ADJUSTMENT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS movement_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    category movement_category NOT NULL,
    notes TEXT NOT NULL DEFAULT '',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_movement_types_code ON movement_types(code);

-- =====================================================
-- ORDER TYPES (Tipos de Orden)
-- =====================================================
CREATE TABLE IF NOT EXISTS order_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    requires_release BOOLEAN NOT NULL DEFAULT false,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_order_types_code ON order_types(code);

-- =====================================================
-- MATERIALS (Materiales)
-- =====================================================
DO $$ BEGIN
    CREATE TYPE material_type AS ENUM ('RAW', 'WIP', 'FINISHED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    type material_type NOT NULL DEFAULT 'RAW',
    uom VARCHAR(20) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_materials_code ON materials(code);

-- =====================================================
-- SUPPLIERS (Proveedores)
-- =====================================================
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ruc VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    contact VARCHAR(150) NOT NULL DEFAULT '',
    phone VARCHAR(50) NOT NULL DEFAULT '',
    email VARCHAR(100) NOT NULL DEFAULT '',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_suppliers_ruc ON suppliers(ruc);

-- =====================================================
-- SCRAP REASONS (Razones de Scrap)
-- =====================================================
DO $$ BEGIN
    CREATE TYPE scrap_category AS ENUM ('MATERIAL', 'PROCESS', 'EQUIPMENT', 'OPERATOR', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS scrap_reasons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    category scrap_category NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_scrap_reasons_code ON scrap_reasons(code);

-- =====================================================
-- SHIFT GROUPS (Grupos de Turno)
-- =====================================================
CREATE TABLE IF NOT EXISTS shift_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    shift_codes VARCHAR(255) NOT NULL DEFAULT '',
    supervisor_code VARCHAR(50) NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT '',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_shift_groups_code ON shift_groups(code);

-- =====================================================
-- WORKSTATIONS (Estaciones de Trabajo)
-- =====================================================
DO $$ BEGIN
    CREATE TYPE workstation_type AS ENUM ('MANUAL', 'SEMI_AUTO', 'AUTOMATED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS workstations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    work_center_code VARCHAR(50) NOT NULL DEFAULT '',
    type workstation_type NOT NULL DEFAULT 'MANUAL',
    asset VARCHAR(50) NOT NULL DEFAULT '',
    operator_slots INTEGER NOT NULL DEFAULT 1,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_workstations_code ON workstations(code);

-- =====================================================
-- PRODUCT VARIANTS (Variantes de Producto)
-- =====================================================
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_code VARCHAR(50) NOT NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(50) NOT NULL DEFAULT '',
    size VARCHAR(50) NOT NULL DEFAULT '',
    presentation VARCHAR(50) NOT NULL DEFAULT '',
    barcode VARCHAR(50) NOT NULL DEFAULT '',
    net_weight DECIMAL(10,3) NULL,
    weight_unit VARCHAR(20) NOT NULL DEFAULT 'kg',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);

-- =====================================================
-- RECIPES (Recetas)
-- =====================================================
CREATE TABLE IF NOT EXISTS recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    product_code VARCHAR(50) NOT NULL,
    operation_code VARCHAR(50) NOT NULL DEFAULT '',
    version VARCHAR(20) NOT NULL DEFAULT '1.0',
    approved_by VARCHAR(150) NOT NULL DEFAULT '',
    approved_at VARCHAR(50) NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT '',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_recipes_code ON recipes(code);

-- =====================================================
-- RECIPE PARAMS (Parámetros de Receta)
-- =====================================================
CREATE TABLE IF NOT EXISTS recipe_params (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    sequence INTEGER NOT NULL,
    param_name VARCHAR(100) NOT NULL,
    setpoint VARCHAR(50) NOT NULL,
    min_value VARCHAR(50) NOT NULL DEFAULT '',
    max_value VARCHAR(50) NOT NULL DEFAULT '',
    unit VARCHAR(20) NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ROUTINGS (Rutas de Producción)
-- =====================================================
CREATE TABLE IF NOT EXISTS routings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    product_code VARCHAR(50) NOT NULL,
    version VARCHAR(20) NOT NULL DEFAULT '1.0',
    notes TEXT NOT NULL DEFAULT '',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_routings_code ON routings(code);

-- =====================================================
-- ROUTING STEPS (Pasos de Ruta)
-- =====================================================
CREATE TABLE IF NOT EXISTS routing_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    routing_id UUID NOT NULL REFERENCES routings(id) ON DELETE CASCADE,
    sequence INTEGER NOT NULL,
    operation_code VARCHAR(100) NOT NULL,
    workstation_code VARCHAR(50) NOT NULL,
    standard_time DECIMAL(10,2) NOT NULL DEFAULT 0,
    notes TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- STANDARD TIMES (Tiempos Estándar)
-- =====================================================
CREATE TABLE IF NOT EXISTS standard_times (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    operation_code VARCHAR(100) NOT NULL,
    product_code VARCHAR(50) NOT NULL,
    workstation_code VARCHAR(50) NOT NULL,
    setup_time DECIMAL(10,2) NOT NULL DEFAULT 0,
    cycle_time DECIMAL(10,2) NOT NULL DEFAULT 0,
    batch_size INTEGER NOT NULL DEFAULT 1,
    valid_from VARCHAR(50) NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT '',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_standard_times_code ON standard_times(code);

-- =====================================================
-- MATERIAL LOTS (Lotes de Material)
-- =====================================================
DO $$ BEGIN
    CREATE TYPE lot_status AS ENUM ('AVAILABLE', 'QUARANTINE', 'CONSUMED', 'EXPIRED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS material_lots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lot_number VARCHAR(100) NOT NULL UNIQUE,
    material_code VARCHAR(50) NOT NULL,
    material_name VARCHAR(200) NOT NULL,
    supplier_code VARCHAR(50) NOT NULL DEFAULT '',
    supplier_lot VARCHAR(100) NOT NULL DEFAULT '',
    received_date DATE NOT NULL,
    expiry_date DATE NULL,
    initial_qty DECIMAL(12,3) NOT NULL,
    available_qty DECIMAL(12,3) NOT NULL,
    uom VARCHAR(20) NOT NULL,
    location_code VARCHAR(50) NOT NULL DEFAULT '',
    status lot_status NOT NULL DEFAULT 'AVAILABLE',
    notes TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_material_lots_number ON material_lots(lot_number);

-- =====================================================
-- BILL OF MATERIALS (BOM)
-- =====================================================
CREATE TABLE IF NOT EXISTS bill_of_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    product_code VARCHAR(50) NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    version VARCHAR(20) NOT NULL DEFAULT '1.0',
    base_qty DECIMAL(10,3) NOT NULL DEFAULT 1,
    base_uom VARCHAR(20) NOT NULL,
    valid_from DATE NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_bill_of_materials_code ON bill_of_materials(code);

CREATE TABLE IF NOT EXISTS bom_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bom_id UUID NOT NULL REFERENCES bill_of_materials(id) ON DELETE CASCADE,
    material_code VARCHAR(50) NOT NULL,
    material_name VARCHAR(200) NOT NULL,
    qty DECIMAL(12,3) NOT NULL,
    uom VARCHAR(20) NOT NULL,
    scrap_pct DECIMAL(5,2) NOT NULL DEFAULT 0,
    phase VARCHAR(50) NOT NULL DEFAULT '',
    optional BOOLEAN NOT NULL DEFAULT false,
    notes TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Verificación de tablas creadas
-- =====================================================
SELECT 'Tablas creadas exitosamente:' as mensaje;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'areas', 'materials', 'material_lots', 'bill_of_materials', 'bom_lines',
    'plants', 'plant_calendar', 'movement_types', 'order_types', 
    'suppliers', 'scrap_reasons', 'shift_groups', 'workstations', 
    'product_variants', 'recipes', 'recipe_params', 'routings', 
    'routing_steps', 'standard_times'
)
ORDER BY table_name;
