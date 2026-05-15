-- Crea tabla empresas (ejecutar si synchronize=false en TypeORM)
CREATE TABLE IF NOT EXISTS empresas (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ruc         VARCHAR(20)  NOT NULL UNIQUE,
  name        VARCHAR(200) NOT NULL,
  address     VARCHAR(255) NOT NULL DEFAULT '',
  phone       VARCHAR(50)  NOT NULL DEFAULT '',
  email       VARCHAR(100) NOT NULL DEFAULT '',
  active      BOOLEAN      NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_empresas_ruc ON empresas(ruc);

-- Seed 10 empresas de ejemplo
INSERT INTO empresas (ruc, name, address, phone, email, active) VALUES
  ('20100130492', 'Textiles del Pacífico S.A.',       'Av. Industrial 450, Lima',             '01-4251800', 'contacto@texpac.com.pe',    true),
  ('20204184468', 'Confecciones Aurora Ltda.',         'Calle 72 #15-30, Bogotá',              '601-3456789','aurora@confecciones.co',     true),
  ('20501523381', 'Deportivos ProFit S.A.S.',          'Carrera 50 #80-20, Medellín',          '604-5671234','ventas@profitdeport.com',    true),
  ('20100070970', 'Uniformes Nacionales S.A.',         'Zona Industrial Puente Aranda, Bogotá','601-4321567','compras@uninac.com.co',      true),
  ('20392819419', 'Industrias Andinas del Sur S.R.L.','Av. El Sol 330, Cusco',                '084-223456', 'info@indsur.com.pe',         true),
  ('20512354367', 'Hilandería San Miguel S.A.C.',      'Parque Industrial La Victoria, Lima',  '01-3241500', 'ventas@hilanderiasm.pe',     true),
  ('20605791233', 'Grupo Textil Horizonte E.I.R.L.',   'Jr. Gamarra 1080, Lima',              '01-3265900', 'horizonte@gthtextil.pe',     true),
  ('20417389751', 'Tejidos del Norte S.A.',            'Av. España 1720, Trujillo',            '044-295600', 'comercial@tejidosnorte.pe',  true),
  ('20522478012', 'Exportaciones Alpaca Gold S.A.C.', 'Av. Arequipa 3456, Arequipa',          '054-289100', 'export@alpacagold.com',      true),
  ('20100182628', 'Fibras Sintéticas del Perú S.A.',   'Av. Argentina 2985, Callao',           '01-4299000', 'fibras@fibrasperu.com.pe',   true)
ON CONFLICT (ruc) DO NOTHING;
