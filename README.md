# Nazaria · Sistema de Gestión de RRHH y Pre-liquidación

Sistema digital descentralizado para el control operativo mensual de personal, novedades, licencias médicas, seguimiento de vacaciones según la LCT argentina (Ley 20.744) y pre-liquidación de sueldos para sucursales comerciales de calzado (**Tortugas Open Mall - TOM** y **Maschwitz Mall**).

---

## 1. Arquitectura y Tecnologías

* **Frontend:** Single Page Application (SPA) responsive para pantallas de local (PC/Desktop) y móviles, construida con HTML5, Tailwind CSS y JavaScript ES6+.
* **Alojamiento:** GitHub Pages (100% Serverless, gratuito y sin costos de servidor).
* **Backend y Base de Datos:** Supabase (PostgreSQL en la nube con almacenamiento de comprobantes médicos en Supabase Storage).
* **Exportador:** Integración con SheetJS para generar archivos `.xlsx` oficiales para el estudio contable / liquidador de sueldos en 1 clic.

---

## 2. Estructura del Repositorio

* `index.html`: Estructura principal de la aplicación, selector de terminales, formularios y vistas.
* `app.js`: Lógica de negocio, autenticación por PIN, cálculo de vacaciones LCT, cierre mensual y exportación.
* `styles.css`: Estilos visuales personalizados y optimizados para terminales de tienda.
* `config.js`: Parámetros de conexión a Supabase y configuración de PINs.
* `schema.sql`: Script SQL completo para crear las tablas, buckets y datos iniciales en Supabase.

---

## 3. Terminales y Accesos por Defecto

| Terminal | Rol | PIN por Defecto |
| :--- | :--- | :---: |
| **TOM** | Encargada Tortugas Open Mall | `1111` |
| **MASCHWITZ** | Encargada Maschwitz Mall | `2222` |
| **ADMIN** | Dueño / Administración / RRHH | `9999` |

---

## 4. Configuración Rápida de Supabase

1. Entra a [supabase.com](https://supabase.com) y crea un proyecto gratuito.
2. En el **SQL Editor**, copia y pega el contenido del archivo `schema.sql` y presiona **RUN**.
3. En **Project Settings > API**, copia:
   * **Project URL**
   * **Project Anon / Public Key**
4. Abre la web, ingresa al **Panel de Administración (PIN: 9999) > Configuración Supabase**, pega las credenciales y haz clic en **Guardar y Probar Conexión**.

---

## 5. Licencia y Uso Interno

Propiedad de **Nazaria** · Uso exclusivo para la gestión de sucursales y liquidación de personal.
