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

## 5. Estructura del Panel de Administración (Orden Estratégico)
1. **1. Consolidado Horas a Liquidar (Liquidador):** Planilla unificada de horas trabajadas (base, feriados con recargo, extras, adicionales, coberturas y total hs), editable en vivo por el administrador con botón para guardar.
2. **2. Sábanas de Vacaciones LCT (Liquidador):** Control de días disponibles por ley según antigüedad al 31/12, días gozados y saldos restantes con tramos desplegados.
3. **3. Novedades, Licencias y Faltas (Liquidador):** Historial cronológico de ausencias, licencias médicas con visor de certificados firmados y faltas injustificadas.
4. **4. Retiros & Temporada (Control Interno Nazaria):** Registro de calzado retirado por colaboradora para deducción mensual interna y control del beneficio de temporada.
5. **5. Padrón de 8 Colaboradoras (RRHH):** Nómina centralizada de colaboradoras activas e inactivas (las inactivas se envían al final de la lista).

## 6. Exportación para Liquidación
* **📸 Exportar Imagen WhatsApp (.png):** Generador de placa oficial en alta resolución (Retina 2x) que compila exclusivamente los 3 bloques que necesita el liquidador:
  * Horas trabajadas a liquidar (con DNI/CUIL de cada colaboradora).
  * Vacaciones gozadas en el período (para liquidación del plus vacacional Art. 155 LCT).
  * Novedades, licencias médicas y faltas a descontar.
  * Incluye botón para copiar al portapapeles y pegar con `Ctrl + V` directamente en WhatsApp Web.
* **Excel Consolidado (.xlsx):** Libro de cálculo multi-solapa para archivo contable.
