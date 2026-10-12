-- ==============================================================================
-- TABLA: AUDITORIAS SEMANALES (JUEVES)
-- Registro de arqueo de caja, muestreo de stock rotativo, e insumos de tienda
-- ==============================================================================

CREATE TABLE IF NOT EXISTS auditorias_semanales (
  id TEXT PRIMARY KEY,
  sucursal TEXT NOT NULL,                     -- 'TOM' | 'MASCHWITZ'
  fecha DATE NOT NULL,                        -- YYYY-MM-DD
  responsable TEXT NOT NULL,                  -- 'Sofi B.' | 'Flavia G.'
  caja_cajon NUMERIC DEFAULT 0,
  caja_sobres NUMERIC DEFAULT 0,
  caja_total_fisico NUMERIC DEFAULT 0,
  caja_teorico_dux NUMERIC DEFAULT 0,
  caja_diferencia NUMERIC DEFAULT 0,
  caja_justificacion TEXT DEFAULT '',
  stock_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  insumos JSONB NOT NULL DEFAULT '{}'::jsonb,
  personal_obs TEXT DEFAULT '',
  instalaciones_obs TEXT DEFAULT '',
  creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsqueda rápida por sucursal y fecha
CREATE INDEX IF NOT EXISTS idx_auditorias_sucursal_fecha 
  ON auditorias_semanales(sucursal, fecha DESC);

-- Habilitar Row Level Security (RLS) permisivo para anon pública (mismo esquema que el resto)
ALTER TABLE auditorias_semanales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir select auditorias anon" 
  ON auditorias_semanales FOR SELECT USING (true);

CREATE POLICY "Permitir insert auditorias anon" 
  ON auditorias_semanales FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir update auditorias anon" 
  ON auditorias_semanales FOR UPDATE USING (true);

CREATE POLICY "Permitir delete auditorias anon" 
  ON auditorias_semanales FOR DELETE USING (true);

