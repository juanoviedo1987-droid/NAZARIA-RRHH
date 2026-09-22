// ==============================================================================
// CONFIGURACIÓN DE CONEXIÓN A SUPABASE
// ==============================================================================
window.APP_CONFIG = {
  // URL de producción del proyecto Supabase
  SUPABASE_URL: 'https://hlvovocufifroigdlhmv.supabase.co',

  // Clave pública anónima de producción
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsdm92b2N1Zmlmcm9pZ2RsaG12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxMDM3MjksImV4cCI6MjEwNTY3OTcyOX0.7KGejvoqjyTAZhEGYODz_Jm2DpddYiLUyIKdhhLxsr0',

  // Bucket para certificados médicos
  STORAGE_BUCKET: 'certificados',

  // PINs personales para acceso seguro (no visibles en la interfaz)
  PINS: {
    TOM: '0145',       // Últimos 4 dígitos DNI Sofia Barrientos (35290145)
    MASCHWITZ: '2934',  // Últimos 4 dígitos DNI Flavia Gómez (37102934)
    ADMIN: '3585'      // Clave personal exclusiva Juan
  }
};
