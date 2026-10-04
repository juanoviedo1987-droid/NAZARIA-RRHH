const https = require('https');

const SUPABASE_URL = 'https://hlvovocufifroigdlhmv.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsdm92b2N1Zmlmcm9pZ2RsaG12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxMDM3MjksImV4cCI6MjEwNTY3OTcyOX0.7KGejvoqjyTAZhEGYODz_Jm2DpddYiLUyIKdhhLxsr0';

function fetchTable(table) {
  return new Promise((resolve) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/${table}?select=*`);
    const options = {
      headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ table, status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ table, status: res.statusCode, raw: data });
        }
      });
    }).on('error', err => resolve({ table, error: err.message }));
  });
}

async function checkAll() {
  const tables = [
    'cierres_mensuales',
    'horas_detalle',
    'novedades_puntuales',
    'retiros_calzado',
    'horarios_sucursal',
    'horarios_modificaciones',
    'fechas_especiales'
  ];

  console.log('=== CONSULTANDO SUPABASE EN TIEMPO REAL ===\n');
  for (const t of tables) {
    const result = await fetchTable(t);
    if (result.status === 200 && Array.isArray(result.data)) {
      console.log(`Tabla: ${t} (${result.data.length} filas)`);
      if (result.data.length > 0) {
        console.log(JSON.stringify(result.data.slice(0, 5), null, 2));
      }
    } else {
      console.log(`Tabla ${t}: ERROR`, result.status, result.data || result.raw || result.error);
    }
    console.log('----------------------------------------');
  }
}

checkAll();
