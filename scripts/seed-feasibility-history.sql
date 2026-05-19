-- ============================================================
-- Tabla: feasibility_history
-- ============================================================
CREATE TABLE IF NOT EXISTS feasibility_history (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  study_code   VARCHAR(50)  NOT NULL,
  client_name  VARCHAR(200) NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  quantity     NUMERIC(14,2) NOT NULL DEFAULT 0,
  uom          VARCHAR(50)  NOT NULL DEFAULT 'unidades',
  approved_date DATE        NOT NULL,
  approved_by  VARCHAR(150) NOT NULL,
  quote_price  NUMERIC(14,2) NOT NULL DEFAULT 0,
  currency     VARCHAR(10)  NOT NULL DEFAULT 'USD',
  result_type  VARCHAR(30)  NOT NULL CHECK (result_type IN ('PRODUCTION_ORDER','PURCHASE_REQUEST')),
  result_code  VARCHAR(50)  NOT NULL,
  result_date  DATE         NOT NULL,
  status       VARCHAR(20)  NOT NULL DEFAULT 'IN_PROGRESS' CHECK (status IN ('IN_PROGRESS','COMPLETED','CANCELLED')),
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fh_study_code   ON feasibility_history (study_code);
CREATE INDEX IF NOT EXISTS idx_fh_status        ON feasibility_history (status);
CREATE INDEX IF NOT EXISTS idx_fh_result_type   ON feasibility_history (result_type);
CREATE INDEX IF NOT EXISTS idx_fh_approved_date ON feasibility_history (approved_date DESC);

-- ============================================================
-- Seed: 18 registros de historial
-- ============================================================
INSERT INTO feasibility_history
  (study_code, client_name, product_name, quantity, uom, approved_date, approved_by,
   quote_price, currency, result_type, result_code, result_date, status)
VALUES
  ('FAC-2026-001', 'Textiles del Pacífico S.A.',    'Tela Jersey 30/1 algodón',         5000, 'metros',   '2026-01-08', 'Ing. Martínez',  8393.75,  'USD', 'PRODUCTION_ORDER',  'OP-2026-0087', '2026-01-09', 'IN_PROGRESS'),
  ('FAC-2026-002', 'Deportivos ProFit S.A.S.',       'Malla deportiva dry-fit',          8000, 'metros',   '2026-01-15', 'Ing. Rodríguez', 11069.50, 'USD', 'PRODUCTION_ORDER',  'OP-2026-0092', '2026-01-16', 'IN_PROGRESS'),
  ('FAC-2026-003', 'Hogar & Diseño Ltda.',           'Tela cortina blackout',            1200, 'metros',   '2026-01-22', 'Ing. Martínez',   4560.00, 'USD', 'PURCHASE_REQUEST',  'SP-2026-0034', '2026-01-23', 'COMPLETED'),
  ('FAC-2026-004', 'Ropa Kids Colombia',             'Franela algodón 20/1',             6000, 'metros',   '2026-02-03', 'Ing. López',      7200.00, 'USD', 'PRODUCTION_ORDER',  'OP-2026-0071', '2026-02-04', 'COMPLETED'),
  ('FAC-2026-005', 'Industrias Marítimas S.A.',      'Lona poliéster 600D',              2500, 'metros',   '2026-02-10', 'Ing. Rodríguez',  9875.00, 'USD', 'PURCHASE_REQUEST',  'SP-2026-0028', '2026-02-11', 'CANCELLED'),
  ('FAC-2026-006', 'Confecciones Élite Ltda.',       'Interlock 95% algodón',            4000, 'metros',   '2026-02-18', 'Ing. Martínez',   6320.00, 'USD', 'PRODUCTION_ORDER',  'OP-2026-0105', '2026-02-19', 'COMPLETED'),
  ('FAC-2026-007', 'Uniformes Corporativos S.A.S.',  'Dril algodón/poliéster 65/35',    10000, 'metros',   '2026-02-25', 'Ing. López',     15480.00, 'USD', 'PRODUCTION_ORDER',  'OP-2026-0112', '2026-02-26', 'IN_PROGRESS'),
  ('FAC-2026-008', 'Telas y Modas del Valle',        'Rib 1x1 poliéster 100%',           3500, 'metros',   '2026-03-04', 'Ing. Rodríguez',  4375.00, 'USD', 'PURCHASE_REQUEST',  'SP-2026-0041', '2026-03-05', 'COMPLETED'),
  ('FAC-2026-009', 'Bordados Andinos S.A.',           'Tela piqué algodón 40/2',          2800, 'metros',   '2026-03-11', 'Ing. Martínez',   5040.00, 'USD', 'PRODUCTION_ORDER',  'OP-2026-0128', '2026-03-12', 'COMPLETED'),
  ('FAC-2026-010', 'Artesanías del Norte Ltda.',     'Fieltro lana merino',               800, 'metros',   '2026-03-18', 'Ing. López',      3120.00, 'USD', 'PURCHASE_REQUEST',  'SP-2026-0047', '2026-03-19', 'COMPLETED'),
  ('FAC-2026-011', 'Calzado Punta Fina S.A.',        'Tela sintética forro zapato',      5500, 'metros',   '2026-03-25', 'Ing. Rodríguez',  7150.00, 'USD', 'PRODUCTION_ORDER',  'OP-2026-0143', '2026-03-26', 'IN_PROGRESS'),
  ('FAC-2026-012', 'Moda Sostenible Colombia',       'Tencel LENZING 30/1',              1500, 'metros',   '2026-04-01', 'Ing. Martínez',   6750.00, 'USD', 'PRODUCTION_ORDER',  'OP-2026-0158', '2026-04-02', 'IN_PROGRESS'),
  ('FAC-2026-013', 'Ropa de Trabajo S.A.S.',         'Denim stretch 10 oz',              7000, 'metros',   '2026-04-07', 'Ing. López',     11550.00, 'USD', 'PRODUCTION_ORDER',  'OP-2026-0164', '2026-04-08', 'IN_PROGRESS'),
  ('FAC-2026-014', 'Textiles Andinos Export',        'Lana peinada worsted',             1200, 'kg',       '2026-04-12', 'Ing. Rodríguez', 18600.00, 'USD', 'PURCHASE_REQUEST',  'SP-2026-0055', '2026-04-13', 'COMPLETED'),
  ('FAC-2026-015', 'Confecciones Futuro Ltda.',      'Polar fleece anti-pilling',        4500, 'metros',   '2026-04-17', 'Ing. Martínez',   8100.00, 'USD', 'PRODUCTION_ORDER',  'OP-2026-0179', '2026-04-18', 'IN_PROGRESS'),
  ('FAC-2026-016', 'Deportivos NorAndina',            'Malla hexagonal deportiva',        6000, 'metros',   '2026-04-22', 'Ing. López',      9600.00, 'USD', 'PRODUCTION_ORDER',  'OP-2026-0185', '2026-04-23', 'IN_PROGRESS'),
  ('FAC-2026-017', 'Boutique Élite Cali',             'Satén poliéster brillante',        900, 'metros',   '2026-04-28', 'Ing. Rodríguez',  2925.00, 'USD', 'PURCHASE_REQUEST',  'SP-2026-0062', '2026-04-29', 'CANCELLED'),
  ('FAC-2026-018', 'Industrias Algodonera S.A.',     'Tela canvas 100% algodón',         3200, 'metros',   '2026-05-05', 'Ing. Martínez',   5760.00, 'USD', 'PRODUCTION_ORDER',  'OP-2026-0201', '2026-05-06', 'IN_PROGRESS')
ON CONFLICT DO NOTHING;
