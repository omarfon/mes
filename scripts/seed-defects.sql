-- Seed defects data
-- Defectos dimensionales
INSERT INTO quality_defects (id, code, name, description, family, severity, status, is_active, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'DIM-001', 'Sobredimensionado', 'Pieza con dimensiones mayores a las especificadas', '24d8fa21-2f42-42ce-8cd8-b677ab4d0912', '6257b701-81b6-433f-8746-c431f9574bbf', 'OPEN', true, NOW(), NOW()),
  (gen_random_uuid(), 'DIM-002', 'Subdimensionado', 'Pieza con dimensiones menores a las especificadas', '24d8fa21-2f42-42ce-8cd8-b677ab4d0912', 'fdd9e765-ab6c-4ea3-a6ef-361c8b80cf2f', 'OPEN', true, NOW(), NOW()),
  (gen_random_uuid(), 'DIM-003', 'Fuera de tolerancia', 'Medida fuera del rango de tolerancia', '24d8fa21-2f42-42ce-8cd8-b677ab4d0912', '6257b701-81b6-433f-8746-c431f9574bbf', 'OPEN', true, NOW(), NOW());

-- Defectos visuales
INSERT INTO quality_defects (id, code, name, description, family, severity, status, is_active, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'VIS-001', 'Rayadura superficial', 'Rayones en la superficie del producto', '56bbfe05-c74c-4171-afe8-610ce21e0c44', 'e8aca19a-0ac5-4a48-a7aa-52b041b7413b', 'OPEN', true, NOW(), NOW()),
  (gen_random_uuid(), 'VIS-002', 'Mancha de pintura', 'Manchas o gotas de pintura fuera de lugar', '56bbfe05-c74c-4171-afe8-610ce21e0c44', '7623eaf9-ef36-4cfc-a70b-cd850a01422e', 'OPEN', true, NOW(), NOW()),
  (gen_random_uuid(), 'VIS-003', 'Rebaba', 'Exceso de material en los bordes', '56bbfe05-c74c-4171-afe8-610ce21e0c44', '13923029-0319-4856-8af0-a046f5b73b7e', 'OPEN', true, NOW(), NOW());

-- Defectos funcionales
INSERT INTO quality_defects (id, code, name, description, family, severity, status, is_active, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'FUN-001', 'No arranca', 'Equipo no enciende o arranca', '7279902d-6910-44f2-8338-c2c100587595', 'fdd9e765-ab6c-4ea3-a6ef-361c8b80cf2f', 'OPEN', true, NOW(), NOW()),
  (gen_random_uuid(), 'FUN-002', 'Ruido anormal', 'Sonido inusual durante operación', '7279902d-6910-44f2-8338-c2c100587595', '13923029-0319-4856-8af0-a046f5b73b7e', 'OPEN', true, NOW(), NOW()),
  (gen_random_uuid(), 'FUN-003', 'Fuga de fluido', 'Pérdida de líquido en conexiones', '7279902d-6910-44f2-8338-c2c100587595', '6257b701-81b6-433f-8746-c431f9574bbf', 'OPEN', true, NOW(), NOW());

-- Defectos de material
INSERT INTO quality_defects (id, code, name, description, family, severity, status, is_active, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'MAT-001', 'Grieta', 'Fisura en el material', 'fb9b0e8d-be21-42d6-a406-f76960a30187', 'fdd9e765-ab6c-4ea3-a6ef-361c8b80cf2f', 'OPEN', true, NOW(), NOW()),
  (gen_random_uuid(), 'MAT-002', 'Porosidad', 'Poros o burbujas en el material', 'fb9b0e8d-be21-42d6-a406-f76960a30187', '6257b701-81b6-433f-8746-c431f9574bbf', 'OPEN', true, NOW(), NOW()),
  (gen_random_uuid(), 'MAT-003', 'Inclusión', 'Material extraño incluido', 'fb9b0e8d-be21-42d6-a406-f76960a30187', '13923029-0319-4856-8af0-a046f5b73b7e', 'OPEN', true, NOW(), NOW());

-- Defectos de ensamble
INSERT INTO quality_defects (id, code, name, description, family, severity, status, is_active, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'ASM-001', 'Tornillo faltante', 'Falta tornillo en la posición especificada', 'd5f4db4c-ac77-4456-8d11-e1dd3e97f487', '6257b701-81b6-433f-8746-c431f9574bbf', 'OPEN', true, NOW(), NOW()),
  (gen_random_uuid(), 'ASM-002', 'Ensamble incorrecto', 'Componente montado en posición incorrecta', 'd5f4db4c-ac77-4456-8d11-e1dd3e97f487', 'fdd9e765-ab6c-4ea3-a6ef-361c8b80cf2f', 'OPEN', true, NOW(), NOW()),
  (gen_random_uuid(), 'ASM-003', 'Ajuste flojo', 'Conexión o ajuste sin el apriete correcto', 'd5f4db4c-ac77-4456-8d11-e1dd3e97f487', '13923029-0319-4856-8af0-a046f5b73b7e', 'OPEN', true, NOW(), NOW());
