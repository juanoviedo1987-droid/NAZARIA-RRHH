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

  // Configuración de Notificaciones Telegram
  TELEGRAM: {
    // Si se envía vía webhook n8n (seguro sin exponer tokens en frontend público)
    WEBHOOK_URL: 'https://34-135-56-126.sslip.io/webhook/nazaria-telegram-audit',
    CHAT_ID: '-1004489717253', // Grupo NAZARIA Socios
    BOT_TOKEN: '' // Token gestionado de forma segura en n8n Cloud / stack.env
  },

  // PINs personales para acceso seguro (no visibles en la interfaz)
  PINS: {
    TOM: '0145',       // Últimos 4 dígitos DNI Sofia Barrientos (35290145)
    MASCHWITZ: '6228',  // Últimos 4 dígitos DNI Flavia Gómez (32826228)
    ADMIN: '3585'      // Clave personal exclusiva Juan
  }
};
