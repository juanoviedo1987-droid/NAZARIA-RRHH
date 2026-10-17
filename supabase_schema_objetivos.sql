-- ==============================================================================
-- TABLAS PARA OBJETIVOS MENSUALES Y LIQUIDACIÓN COMERCIAL NAZARIA
-- Compatible con Supabase RLS y sincronización en tiempo real
-- ==============================================================================

-- 1. Tabla de Objetivos Mensuales (Metas proyectadas para Local y Colaboradoras)
CREATE TABLE IF NOT EXISTS public.objetivos_mensuales (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    periodo TEXT NOT NULL,               -- Ej: '2026-10'
    sucursal_codigo TEXT NOT NULL,       -- 'TOM' o 'MASCHWITZ'
    colab_id TEXT NOT NULL,              -- 'TOTAL_LOCAL', 'c-sofi', 'c-esme', etc.
    nombre_concepto TEXT NOT NULL,       -- 'TOTAL LOCAL', 'Esme', 'Flavia', etc.
    rol TEXT NOT NULL,                   -- 'Encargada', 'Vendedora', 'Semi-Encargada', 'Local'
    horas_semanales NUMERIC(5,2) DEFAULT 0, -- Carga horaria de referencia
    objetivo_nivel_1 NUMERIC(14,2) NOT NULL DEFAULT 0,
    objetivo_nivel_2 NUMERIC(14,2) NOT NULL DEFAULT 0,
    pozo_grupal NUMERIC(14,2) DEFAULT 0, -- Monto pozo para Nivel 2
    estado TEXT NOT NULL DEFAULT 'borrador', -- 'borrador' (propuesta n8n/admin) | 'publicado' (aprobado por Juan y visible en sucursal)
    creado_en TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    actualizado_en TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    aprobado_por TEXT,
    aprobado_en TIMESTAMPTZ,
    UNIQUE(periodo, sucursal_codigo, colab_id)
);

-- 2. Tabla de Liquidaciones Comerciales (Cierre de Venta Real y Comisiones)
CREATE TABLE IF NOT EXISTS public.liquidaciones_comerciales (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    periodo TEXT NOT NULL,               -- Ej: '2026-09'
    sucursal_codigo TEXT NOT NULL,       -- 'TOM' o 'MASCHWITZ'
    colab_id TEXT NOT NULL,              -- 'TOTAL_LOCAL', 'c-esme', etc.
    nombre TEXT NOT NULL,
    rol TEXT NOT NULL,
    venta_bruta NUMERIC(14,2) DEFAULT 0,
    notas_credito NUMERIC(14,2) DEFAULT 0,
    venta_neta NUMERIC(14,2) NOT NULL DEFAULT 0,
    objetivo_previsto NUMERIC(14,2) DEFAULT 0,
    porc_alcance NUMERIC(6,2) DEFAULT 0,
    porc_comision NUMERIC(5,3) DEFAULT 0,
    monto_comision NUMERIC(14,2) DEFAULT 0,
    monto_plus_caja NUMERIC(14,2) DEFAULT 0,
    monto_pozo NUMERIC(14,2) DEFAULT 0,
    total_liquidado NUMERIC(14,2) NOT NULL DEFAULT 0,
    estado_premio TEXT DEFAULT 'Desempeño estándar', -- Texto cualitativo (Estrella del Mes, Superó N2, etc.)
    estado TEXT NOT NULL DEFAULT 'borrador',          -- 'borrador' | 'aprobado'
    creado_en TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    actualizado_en TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    aprobado_por TEXT,
    aprobado_en TIMESTAMPTZ,
    UNIQUE(periodo, sucursal_codigo, colab_id)
);

-- Habilitar RLS
ALTER TABLE public.objetivos_mensuales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.liquidaciones_comerciales ENABLE ROW LEVEL SECURITY;

-- Políticas de Acceso Público / Anon
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Permitir select publico en objetivos_mensuales" ON public.objetivos_mensuales;
    CREATE POLICY "Permitir select publico en objetivos_mensuales" 
        ON public.objetivos_mensuales FOR SELECT TO anon, authenticated USING (true);

    DROP POLICY IF EXISTS "Permitir all publico en objetivos_mensuales" ON public.objetivos_mensuales;
    CREATE POLICY "Permitir all publico en objetivos_mensuales" 
        ON public.objetivos_mensuales FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Permitir select publico en liquidaciones_comerciales" ON public.liquidaciones_comerciales;
    CREATE POLICY "Permitir select publico en liquidaciones_comerciales" 
        ON public.liquidaciones_comerciales FOR SELECT TO anon, authenticated USING (true);

    DROP POLICY IF EXISTS "Permitir all publico en liquidaciones_comerciales" ON public.liquidaciones_comerciales;
    CREATE POLICY "Permitir all publico en liquidaciones_comerciales" 
        ON public.liquidaciones_comerciales FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
END $$;

-- Habilitar Realtime en Supabase
ALTER PUBLICATION supabase_realtime ADD TABLE public.objetivos_mensuales;
ALTER PUBLICATION supabase_realtime ADD TABLE public.liquidaciones_comerciales;
