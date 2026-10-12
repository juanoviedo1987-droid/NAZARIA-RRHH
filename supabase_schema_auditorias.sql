-- ==============================================================================
-- TABLA: AUDITORIAS SEMANALES (JUEVES)
-- Registro de arqueo de caja, muestreo de stock rotativo, e insumos de tienda
-- ==============================================================================

CREATE TABLE IF NOT EXISTS auditorias_semanales (
  id TEXT PRIMARY KEY,
  sucursal_codigo TEXT NOT NULL,           -- 'TOM' | 'MASCHWITZ'
  fecha DATE NOT NULL,                     -- YYYY-MM-DD
  encargada TEXT NOT NULL,                 -- 'Sofi' | 'Flavia' | 'Encargada'
  arqueo_efectivo JSONB NOT NULL DEFAULT '{}'::jsonb,
  auditoria_stock JSONB NOT NULL DEFAULT '[]'::jsonb,
  insumos JSONB NOT NULL DEFAULT '{}'::jsonb,
  estado_local TEXT DEFAULT '',
  creado_en TIMESTAMPTZ DEFAULT NOW(),
  creado_por TEXT DEFAULT '',
  telegram_enviado BOOLEAN DEFAULT false
);

-- Índices para búsqueda rápida por sucursal y fecha
CREATE INDEX IF NOT EXISTS idx_auditorias_sucursal_fecha 
  ON auditorias_semanales(sucursal_codigo, fecha DESC);

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
