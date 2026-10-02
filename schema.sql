-- ==============================================================================
-- SISTEMA DE GESTIÓN DE RRHH, NOVEDADES Y PRE-LIQUIDACIÓN (RETAIL NAZARIA)
-- Esquema de Base de Datos para Supabase (PostgreSQL)
-- ==============================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA: SUCURSALES
CREATE TABLE IF NOT EXISTS public.sucursales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(20) UNIQUE NOT NULL,       -- 'TOM', 'MASCHWITZ'
    nombre VARCHAR(100) NOT NULL,             -- 'Tortugas Open Mall', 'Maschwitz Mall'
    pin VARCHAR(10) NOT NULL DEFAULT '1234',  -- PIN de acceso de la encargada
    activa BOOLEAN DEFAULT true,
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLA: COLABORADORAS
CREATE TABLE IF NOT EXISTS public.colaboradoras (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sucursal_id UUID REFERENCES public.sucursales(id) ON DELETE SET NULL,
    nombre_completo VARCHAR(150) NOT NULL,
    dni VARCHAR(20),
    cuil VARCHAR(25),
    fecha_ingreso DATE NOT NULL,
    categoria VARCHAR(50) DEFAULT 'Vendedora B', -- CCT 130/75 Comercio
    estado VARCHAR(20) DEFAULT 'activa',         -- 'activa', 'licencia', 'inactiva'
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLA: CIERRES MENSUALES (Pre-liquidación consolidada y horas por colaboradora)
CREATE TABLE IF NOT EXISTS public.cierres_mensuales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    periodo VARCHAR(7) NOT NULL,
    colab_id VARCHAR(50) NOT NULL,
    sucursal_codigo VARCHAR(20) NOT NULL,
    horas_base NUMERIC(6,1) DEFAULT 0,
    recibo_hs NUMERIC(6,1) DEFAULT 0,
    sin_recibo_hs NUMERIC(6,1) DEFAULT 0,
    adicional_hs NUMERIC(6,1) DEFAULT 0,
    feriados_hs NUMERIC(6,1) DEFAULT 0,
    extras_hs NUMERIC(6,1) DEFAULT 0,
    vacaciones_hs NUMERIC(6,1) DEFAULT 0,
    observaciones TEXT DEFAULT '',
    detalle_cobertura TEXT DEFAULT '',
    actualizado_en TIMESTAMPTZ DEFAULT NOW(),
    actualizado_por VARCHAR(50) DEFAULT 'Sistema',
    CONSTRAINT uq_cierre_periodo_colab UNIQUE(periodo, colab_id)
);

-- 5. TABLA: NOVEDADES PUNTUALES (Ausencias, Licencias Médicas con certificado, etc.)
CREATE TABLE IF NOT EXISTS public.novedades_puntuales (
    id VARCHAR(100) PRIMARY KEY,
    colaboradora_id VARCHAR(50) NOT NULL,
    codigo_sucursal VARCHAR(20) NOT NULL,
    tipo VARCHAR(50) NOT NULL, 
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    dias_computados NUMERIC(5,2) DEFAULT 1,
    certificado_url TEXT,
    observaciones TEXT,
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABLA: HORAS DETALLE (Justificación individual de horas extras y adicionales)
CREATE TABLE IF NOT EXISTS public.horas_detalle (
    id VARCHAR(100) PRIMARY KEY,
    colaboradora_id VARCHAR(50) NOT NULL,
    sucursal VARCHAR(20) NOT NULL,
    fecha DATE NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    horas NUMERIC(5,2) DEFAULT 0,
    motivo TEXT,
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABLA: RETIROS DE CALZADO (Pares de temporada y retiros por descuento en recibo)
CREATE TABLE IF NOT EXISTS public.retiros_calzado (
    id VARCHAR(100) PRIMARY KEY,
    colaboradora_id VARCHAR(50) NOT NULL,
    sucursal VARCHAR(20) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    articulo VARCHAR(100) NOT NULL,
    talle_color VARCHAR(100),
    fecha DATE NOT NULL,
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABLA: HORARIOS SEMANALES OFICIALES
CREATE TABLE IF NOT EXISTS public.horarios_sucursal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sucursal_codigo VARCHAR(20) NOT NULL,
    periodo VARCHAR(7) NOT NULL DEFAULT '2026-10',
    manana JSONB DEFAULT '{}'::jsonb,
    tarde JSONB DEFAULT '{}'::jsonb,
    notas TEXT,
    actualizado_en TIMESTAMPTZ DEFAULT NOW(),
    actualizado_por VARCHAR(50) DEFAULT 'Encargada',
    CONSTRAINT uq_horario_sucursal_periodo UNIQUE(sucursal_codigo, periodo)
);

-- 9. TABLA: FECHAS ESPECIALES
CREATE TABLE IF NOT EXISTS public.fechas_especiales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sucursal_codigo VARCHAR(20) NOT NULL,
    periodo VARCHAR(7) NOT NULL DEFAULT '2026-10',
    evento VARCHAR(150) NOT NULL,
    manana VARCHAR(150),
    tarde VARCHAR(150),
    observacion TEXT,
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TABLA: BITÁCORA DE MODIFICACIONES / CAMBIOS DE TURNO
CREATE TABLE IF NOT EXISTS public.horarios_modificaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sucursal_codigo VARCHAR(20) NOT NULL,
    periodo VARCHAR(7) NOT NULL DEFAULT '2026-10',
    fecha DATE NOT NULL,
    turno VARCHAR(50) NOT NULL,
    colaboradora_origen VARCHAR(100) NOT NULL,
    colaboradora_reemplazo VARCHAR(100) NOT NULL,
    motivo TEXT,
    creado_por VARCHAR(50) DEFAULT 'Encargada',
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- 11. STORAGE BUCKET PARA CERTIFICADOS MÉDICOS
INSERT INTO storage.buckets (id, name, public) 
VALUES ('certificados', 'certificados', true)
ON CONFLICT (id) DO NOTHING;

-- 12. HABILITACIÓN DE POLÍTICAS ROW LEVEL SECURITY
ALTER TABLE public.sucursales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colaboradoras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cierres_mensuales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.novedades_puntuales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horas_detalle ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retiros_calzado ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horarios_sucursal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fechas_especiales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horarios_modificaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acceso total a sucursales" ON public.sucursales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total a colaboradoras" ON public.colaboradoras FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total a cierres" ON public.cierres_mensuales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total a novedades" ON public.novedades_puntuales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total a horas_detalle" ON public.horas_detalle FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total a retiros" ON public.retiros_calzado FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total a horarios" ON public.horarios_sucursal FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total a fechas especiales" ON public.fechas_especiales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total a modificaciones" ON public.horarios_modificaciones FOR ALL USING (true) WITH CHECK (true);
