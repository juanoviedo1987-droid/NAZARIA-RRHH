// ==============================================================================
// CONFIGURACIÓN DE CONEXIÓN A SUPABASE
// ==============================================================================
// Puedes configurar tus credenciales aquí o directamente desde la pestaña
// "Configuración" en el panel de Administrador de la web.
// ==============================================================================

window.APP_CONFIG = {
  // Pega aquí la URL de tu proyecto de Supabase (ej: 'https://xyzcompany.supabase.co')
  SUPABASE_URL: localStorage.getItem('nazaria_supabase_url') || '',

  // Pega aquí tu clave anónima pública (anon key)
  SUPABASE_ANON_KEY: localStorage.getItem('nazaria_supabase_anon_key') || '',

  // Bucket para certificados médicos
  STORAGE_BUCKET: 'certificados',

  // PINs por defecto para acceso rápido en las terminales de local
  PINS: {
    TOM: '1111',
    MASCHWITZ: '2222',
    ADMIN: '9999'
  }
};
