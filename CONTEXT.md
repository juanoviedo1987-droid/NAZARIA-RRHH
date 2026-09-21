# Contexto Tecnológico y Memoria Operativa: RRHH & Pre-liquidación (Nazaria)

Este documento es la **Fuente Central de Verdad y Memoria (SSOT)** del proyecto. Cualquier asistente de IA o desarrollador debe leer este archivo para comprender la arquitectura, el negocio y las reglas de trabajo sin necesidad de consultar historiales previos.

---

## 1. Identidad y Alcance del Negocio
* **Empresa:** Nazaria (Retail de calzado y accesorios femeninos).
* **Sucursales Activas para este sistema:**
  * **TOM** (Tortugas Open Mall)
  * **Maschwitz Mall** (Ingeniero Maschwitz)
* **Objetivo Central:** 
  * Registrar novedades mensuales (ausencias, licencias médicas con comprobantes, francos compensatorios, horas extras al 50% y 100%).
  * Controlar el saldo histórico de vacaciones según la Ley de Contrato de Trabajo (LCT 20.744 / CCT Comercio 130/75).
  * Generar a fin de mes el reporte consolidado para el liquidador de sueldos / estudio contable en formato Excel (.xlsx).
  * Mantener un histórico inalterable de cada mes cerrado para auditoría interna.

---

## 2. Infraestructura y Repositorio (100% Serverless)
* **Repositorio GitHub:** `https://github.com/juanoviedo1987-droid/NAZARIA-RRHH` (rama `main`).
* **Sitio Web Público (Terminales en Locales):**  
  `https://juanoviedo1987-droid.github.io/NAZARIA-RRHH/`
* **Directorio de Proyecto en Antigravity:**  
  `C:\Users\juano\.gemini\antigravity\scratch\NAZARIA-RRHH`
* **Backend Previsto:** Supabase (PostgreSQL en la nube + Storage para certificados médicos). *Estado: pendiente de vinculación final una vez aprobada la interfaz.*

---

## 3. Terminales y Credenciales de Acceso

| Terminal | PIN Acceso | Descripción |
| :--- | :---: | :--- |
| **TOM** | `1111` | Carga de novedades de TOM y grilla de horas extras mensual. |
| **Maschwitz** | `2222` | Carga de novedades de Maschwitz y grilla de horas extras mensual. |
| **Administración** | `9999` | Dueño / RRHH: consolidado, vacaciones, certificados y exportación a Excel. |

---

## 4. Archivos Clave del Proyecto
* `CONTEXT.md`: Este documento maestro de memoria y arquitectura.
* `index.html`: Single Page Application (SPA) con vistas de login, terminal de local y panel de administración.
* `app.js`: Motor de lógica, validaciones, cálculo de vacaciones LCT, compresión de fotos y exportación SheetJS.
* `styles.css`: Estilos visuales personalizados y optimizados para PC de local.
* `config.js`: Parámetros de conexión a Supabase y configuración de PINs.
* `schema.sql`: Script SQL con tablas y storage para Supabase.
* `deploy_github.js`: Script de sincronización directa con el repositorio de GitHub.

---

## 5. Metodología de Trabajo: "Paso a Paso"
1. **Validación Visual y Operativa:** El usuario prueba la web interactiva y define qué sobra, qué falta o qué nombres cambiar.
2. **Carga de Nómina Real:** Reemplazar los datos de prueba con las 8 colaboradoras reales de octubre (nombres, sucursales y fechas de ingreso).
3. **Conexión de Supabase:** Crear el proyecto en Supabase y correr `schema.sql` una vez que la pantalla esté 100% validada.
