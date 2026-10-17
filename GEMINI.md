# Reglas Globales de Desarrollo - Juan Oviedo (Antigravity Workspace)

## EstÃ¡ndar Universal de DiseÃ±o y Frontend (OBLIGATORIO)

### 1. Enfoque Mobile-First Obligatorio en TODOS los Proyectos
- Todo desarrollo, interfaz, pantalla, componente web o aplicaciÃ³n se concibe, diseÃ±a y prueba **Mobile-First** (resoluciones de 360px a 430px) y luego se expande armÃ³nicamente a pantallas medianas y de escritorio (`sm:`, `md:`, `lg:`, `xl:`).
- **ErgonomÃ­a TÃ¡ctil Garantizada:**
  - Zonas de toque mÃ­nimas de 44px Ã— 44px para botones, enlaces y campos.
  - NavegaciÃ³n principal accesible al alcance del pulgar (Bottom Navigation Bar o menÃº colapsable cÃ³modo).
  - Formularios adaptativos de 1 sola columna en pantallas mÃ³viles.
  - Cero desbordes horizontales accidentales (`overflow-x` controlado).
- **Escalabilidad a Escritorio (Desktop/PC):**
  - Al abrirse en PC o monitores amplios, la aplicaciÃ³n aprovecha el ancho completo con layouts ejecutivos (tablas de mÃºltiples columnas, paneles laterales fijos, mÃ©tricas KPI en grid amplio).
  - Nunca degradar la experiencia de escritorio al adaptar a mÃ³vil, ni degradar la experiencia mÃ³vil al diseÃ±ar para escritorio.
