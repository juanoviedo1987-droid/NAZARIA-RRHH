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

  // PINs por defecto para acceso rápido en las terminales de local
  PINS: {
    TOM: '1111',
    MASCHWITZ: '2222',
    ADMIN: '9999'
  }
};
