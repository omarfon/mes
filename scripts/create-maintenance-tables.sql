-- Crear tabla de componentes de mantenimiento
CREATE TABLE IF NOT EXISTS maintenance_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    "assetCode" VARCHAR(100),
    "assetName" VARCHAR(255),
    category VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'OPERATIONAL',
    manufacturer VARCHAR(255),
    model VARCHAR(255),
    "serialNumber" VARCHAR(255),
    criticality VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    "installDate" TIMESTAMP,
    "expectedLifeHours" INTEGER,
    "currentHours" INTEGER DEFAULT 0,
    notes TEXT,
    "lastInspection" TIMESTAMP,
    "nextInspection" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de registros de mantenimiento
CREATE TABLE IF NOT EXISTS maintenance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "componentId" UUID NOT NULL,
    type VARCHAR(50) NOT NULL,
    technician VARCHAR(255) NOT NULL,
    "hoursAtMaintenance" INTEGER,
    notes TEXT,
    date TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_component
        FOREIGN KEY ("componentId") 
        REFERENCES maintenance_components(id)
        ON DELETE CASCADE
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_maintenance_components_code ON maintenance_components(code);
CREATE INDEX IF NOT EXISTS idx_maintenance_components_asset_code ON maintenance_components("assetCode");
CREATE INDEX IF NOT EXISTS idx_maintenance_components_status ON maintenance_components(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_components_criticality ON maintenance_components(criticality);
CREATE INDEX IF NOT EXISTS idx_maintenance_records_component_id ON maintenance_records("componentId");
CREATE INDEX IF NOT EXISTS idx_maintenance_records_date ON maintenance_records(date);

-- Verificar creación
SELECT COUNT(*) as maintenance_components_count FROM maintenance_components;
SELECT COUNT(*) as maintenance_records_count FROM maintenance_records;
