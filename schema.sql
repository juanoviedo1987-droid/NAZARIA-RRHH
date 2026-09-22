-- ==============================================================================
-- SISTEMA DE GESTIÓN DE RRHH, NOVEDADES Y PRE-LIQUIDACIÓN (RETAIL)
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

-- 4. TABLA: NOVEDADES PUNTUALES (Ausencias, Licencias, Francos)
CREATE TABLE IF NOT EXISTS public.novedades_puntuales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    colaboradora_id UUID NOT NULL REFERENCES public.colaboradoras(id) ON DELETE CASCADE,
    sucursal_id UUID NOT NULL REFERENCES public.sucursales(id) ON DELETE CASCADE,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    tipo VARCHAR(50) NOT NULL, 
    -- Tipos: 'Licencia Médica', 'Falta Injustificada', 'Franco Compensatorio', 'Vacaciones', 'Examen', 'Llegada Tarde', 'Otro'
    dias_computados NUMERIC(5,2) DEFAULT 1,
    certificado_url TEXT,                      -- URL de la imagen en Supabase Storage
    observaciones TEXT,
    creado_por VARCHAR(50) DEFAULT 'Encargada',
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLA: CIERRES MENSUALES (Pre-liquidación consolidada)
CREATE TABLE IF NOT EXISTS public.cierres_mensuales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    periodo VARCHAR(7) NOT NULL,               -- 'YYYY-MM' (ej: '2026-10')
    sucursal_id UUID NOT NULL REFERENCES public.sucursales(id) ON DELETE CASCADE,
    colaboradora_id UUID NOT NULL REFERENCES public.colaboradoras(id) ON DELETE CASCADE,
    dias_base INT DEFAULT 30,
    hs_extras_50 NUMERIC(5,2) DEFAULT 0,       -- Lunes a Sábado hasta 13hs
    hs_extras_100 NUMERIC(5,2) DEFAULT 0,      -- Sábado post-13hs, Domingos, Feriados
    feriados_trabajados INT DEFAULT 0,
    faltas_injustificadas INT DEFAULT 0,
    dias_lic_medica INT DEFAULT 0,
    dias_vacaciones INT DEFAULT 0,
    adelantos_vales NUMERIC(12,2) DEFAULT 0,   -- Retiros de caja o transferencias
    observaciones_liquidacion TEXT,
    estado VARCHAR(30) DEFAULT 'borrador',     -- 'borrador', 'enviado_sucursal', 'cerrado_aprobado'
    cerrado_en TIMESTAMPTZ,
    cerrado_por VARCHAR(100),
    creado_en TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_periodo_colaboradora UNIQUE(periodo, colaboradora_id)
);

-- 6. TABLA: PERIODOS DE VACACIONES (Control histórico LCT 20.744)
CREATE TABLE IF NOT EXISTS public.periodos_vacaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    colaboradora_id UUID NOT NULL REFERENCES public.colaboradoras(id) ON DELETE CASCADE,
    anio_fiscal INT NOT NULL,                  -- ej: 2024, 2025, 2026
    dias_ley INT NOT NULL,                     -- 14, 21, 28 o 35 días
    dias_gozados INT DEFAULT 0,
    saldo_pendiente INT GENERATED ALWAYS AS (dias_ley - dias_gozados) STORED,
    observaciones TEXT,
    creado_en TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_colaboradora_anio UNIQUE(colaboradora_id, anio_fiscal)
);

-- ==============================================================================
-- 7. STORAGE BUCKET PARA CERTIFICADOS MÉDICOS
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('certificados', 'certificados', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de lectura y subida para el bucket certificados
CREATE POLICY "Permitir subida publica certificados" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'certificados');

CREATE POLICY "Permitir lectura publica certificados" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'certificados');

-- ==============================================================================
-- 8. DATOS INICIALES DE EJEMPLO (Seed Data)
-- ==============================================================================
-- Sucursales con sus PINs iniciales
INSERT INTO public.sucursales (codigo, nombre, pin) VALUES 
('TOM', 'Tortugas Open Mall', '1111'),
('MASCHWITZ', 'Maschwitz Mall', '2222')
ON CONFLICT (codigo) DO NOTHING;

-- Colaboradoras de TOM (5 colaboradoras oficiales)
INSERT INTO public.colaboradoras (sucursal_id, nombre_completo, dni, cuil, fecha_ingreso, categoria, estado)
SELECT id, 'Barrientos Sofia', '35290145', '27-35290145-8', '2025-07-05', 'Encargada de Sucursal', 'activa'
FROM public.sucursales WHERE codigo = 'TOM'
ON CONFLICT DO NOTHING;

INSERT INTO public.colaboradoras (sucursal_id, nombre_completo, dni, cuil, fecha_ingreso, categoria, estado)
SELECT id, 'Galarza Esmeralda Cristina', '38901234', '27-38901234-1', '2022-02-01', 'Vendedora', 'activa'
FROM public.sucursales WHERE codigo = 'TOM'
ON CONFLICT DO NOTHING;

INSERT INTO public.colaboradoras (sucursal_id, nombre_completo, dni, cuil, fecha_ingreso, categoria, estado)
SELECT id, 'Pinto Martina', '44102987', '27-44102987-9', '2024-04-01', 'Vendedora (Cubre TOM y Maschwitz)', 'activa'
FROM public.sucursales WHERE codigo = 'TOM'
ON CONFLICT DO NOTHING;

INSERT INTO public.colaboradoras (sucursal_id, nombre_completo, dni, cuil, fecha_ingreso, categoria, estado)
SELECT id, 'Almiron Miranda Candela Anahi', '45091234', '27-45091234-5', '2025-12-01', 'Vendedora', 'activa'
FROM public.sucursales WHERE codigo = 'TOM'
ON CONFLICT DO NOTHING;

INSERT INTO public.colaboradoras (sucursal_id, nombre_completo, dni, cuil, fecha_ingreso, categoria, estado)
SELECT id, 'Bustamante Vanina Antonella', '43998120', '27-43998120-3', '2025-12-01', 'Vendedora', 'activa'
FROM public.sucursales WHERE codigo = 'TOM'
ON CONFLICT DO NOTHING;

-- Colaboradoras de Maschwitz (3 colaboradoras oficiales)
INSERT INTO public.colaboradoras (sucursal_id, nombre_completo, dni, cuil, fecha_ingreso, categoria, estado)
SELECT id, 'Gómez Flavia Marianela', '37102934', '27-37102934-4', '2024-12-01', 'Vendedora', 'activa'
FROM public.sucursales WHERE codigo = 'MASCHWITZ'
ON CONFLICT DO NOTHING;

INSERT INTO public.colaboradoras (sucursal_id, nombre_completo, dni, cuil, fecha_ingreso, categoria, estado)
SELECT id, 'Vera Julieta Agustina', '39445123', '27-39445123-2', '2023-11-01', 'Vendedora', 'activa'
FROM public.sucursales WHERE codigo = 'MASCHWITZ'
ON CONFLICT DO NOTHING;

INSERT INTO public.colaboradoras (sucursal_id, nombre_completo, dni, cuil, fecha_ingreso, categoria, estado)
SELECT id, 'Vera Camila Abril', '42189032', '27-42189032-6', '2023-02-17', 'Encargada de Sucursal', 'activa'
FROM public.sucursales WHERE codigo = 'MASCHWITZ'
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- 9. HABILITACIÓN DE LECTURA Y ESCRITURA PÚBLICA (ANON)
-- ==============================================================================
ALTER TABLE public.sucursales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colaboradoras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.novedades_puntuales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cierres_mensuales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.periodos_vacaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acceso total a sucursales" ON public.sucursales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total a colaboradoras" ON public.colaboradoras FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total a novedades" ON public.novedades_puntuales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total a cierres" ON public.cierres_mensuales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total a vacaciones" ON public.periodos_vacaciones FOR ALL USING (true) WITH CHECK (true);
