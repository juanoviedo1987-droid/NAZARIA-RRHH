# Contexto Tecnológico y Memoria Operativa: RRHH & Pre-liquidación (Nazaria)

Este documento es la **Fuente Central de Verdad y Memoria (SSOT)** del proyecto. Cualquier asistente de IA o desarrollador debe leer este archivo para comprender la arquitectura, el negocio y las reglas de trabajo sin necesidad de consultar historiales previos.

---

## 1. Identidad y Alcance del Negocio
* **Empresa:** Nazaria (Retail de calzado y accesorios femeninos).
* **Sucursales Activas para este sistema:**
  * **TOM** (Tortugas Open Mall)
  * **Maschwitz Mall** (Ingeniero Maschwitz)
* **Objetivo Central:** 
  * Registrar horarios semanales (turnos mañana/tarde de lunes a domingo) y coberturas entre locales.
  * Controlar horas trabajadas del mes: horas base, feriados trabajados (hs), horas extras y horas adicionales/coberturas.
  * Registrar retiros de calzado (descuentos en recibo) y asignación del beneficio de "Par de Temporada" (Artículo + Talle/Color).
  * Controlar el saldo histórico y tramos de vacaciones según la Ley de Contrato de Trabajo (LCT 20.744 / CCT Comercio 130/75).
  * Registrar novedades y faltas: días de estudio, francos compensatorios, licencias médicas con comprobante/foto y ausencias injustificadas a descontar.
  * Generar a fin de mes el reporte consolidado para el liquidador de sueldos / estudio contable en formato Excel (.xlsx).

---

## 2. Nómina Oficial de Colaboradoras (8 Personas)

### Sucursal Maschwitz (3 Colaboradoras)
1. **Gómez Flavia Marianela** (Alias: *Flavia G.*)
   * Sucursal: Maschwitz — Ingreso: `01/12/2024` — Categoría: Vendedora
2. **Vera Julieta Agustina** (Alias: *Juli Vera*)
   * Sucursal: Maschwitz — Ingreso: `01/11/2023` — Categoría: Vendedora
3. **Vera Camila Abril** (Alias: *Cami Vera*)
   * Sucursal: Maschwitz — Ingreso: `17/02/2023` — Categoría: Encargada de Sucursal

### Sucursal TOM (5 Colaboradoras)
4. **Barrientos Sofia** (Alias: *Sofi*)
   * Sucursal: TOM — Ingreso: `05/07/2025`
   * **Antigüedad Reconocida:** `01/09/2018` *(Regla de negocio: para el cómputo de vacaciones LCT cuenta con más de 5 años de antigüedad cumplidos, correspondiéndole 21 días de ley)*.
   * Categoría: Encargada de Sucursal
5. **Galarza Esmeralda Cristina** (Alias: *Esme*)
   * Sucursal: TOM — Ingreso: `01/02/2022` — Categoría: Vendedora
6. **Pinto Martina** (Alias: *Martu P.*)
   * Sucursal: TOM — Ingreso: `01/04/2024` — Categoría: Vendedora
   * *Nota operativa:* Presta servicios tanto en TOM como en coberturas habituales en Maschwitz.
7. **Almiron Miranda Candela Anahi** (Alias: *Cande*)
   * Sucursal: TOM — Ingreso: `01/12/2025` (dic 2025) — Categoría: Vendedora
8. **Bustamante Vanina Antonella** (Alias: *Anto*)
   * Sucursal: TOM — Ingreso: `01/12/2025` (dic 2025) — Categoría: Vendedora

---

## 3. Infraestructura y Repositorio (100% Serverless)
* **Repositorio GitHub:** `https://github.com/juanoviedo1987-droid/NAZARIA-RRHH` (rama `main`).
* **Sitio Web Público (Terminales en Locales):**  
  `https://juanoviedo1987-droid.github.io/NAZARIA-RRHH/`
* **Directorio de Proyecto en Antigravity:**  
  `C:\Users\juano\.gemini\antigravity\scratch\rrhh-nazaria`
* **Identidad Visual:** Sincronizada 100% con `NAZARIA-SOPs` (paleta clara editorial `#FAF9F6`, arena `#E6D5C3`, badge negro `NZ`, tipografía Inter).
* **Backend Previsto:** Supabase (PostgreSQL en la nube + Storage para certificados médicos).

---

## 4. Terminales y Credenciales de Acceso

| Terminal | PIN Acceso | Descripción |
| :--- | :---: | :--- |
| **TOM** | `1111` | Carga de horas, horarios semanales, retiros y novedades de TOM. |
| **Maschwitz** | `2222` | Carga de horas, horarios semanales, retiros y novedades de Maschwitz (+ coberturas). |
| **Administración** | `9999` | Dueño / RRHH: consolidado, vacaciones LCT, auditoría de certificados y exportación Excel. |

---

## 5. Módulos Operativos del Sistema
1. **Horas Trabajadas & Cierre:** Grilla de horas base, feriados, extras y adicionales por cobertura con cálculo automático.
2. **Horarios Semanales:** Asignación de turnos Mañana y Tarde (Lunes a Domingo) por local.
3. **Novedades & Faltas:** Carga de días de estudio, francos compensatorios, ausencias con descuento y licencias médicas con compresión de foto.
4. **Retiros & Par de Temporada:** Registro de compras con descuento en sueldo y asignación del par de temporada oficial.
5. **Vacaciones LCT 20.744:** Cómputo automático según antigüedad al 31/12, registro de tramos tomados y saldos restantes.
6. **Exportación Consolidada (.xlsx):** Generación automática de libro multi-hoja listo para el liquidador de sueldos.
