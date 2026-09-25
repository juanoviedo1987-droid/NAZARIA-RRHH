// ==============================================================================
// LOGICA CENTRAL DE LA APLICACIÓN - NAZARIA RRHH & PRE-LIQUIDACIÓN
// Adaptado a la Operación Real de Sucursales (TOM & Maschwitz) y Estética SOPs
// ==============================================================================

(function() {
  'use strict';

  // --- 1. NOMINA OFICIAL REAL DE 8 COLABORADORAS ---
  const DEFAULT_COLABORADORAS = [
    // MASCHWITZ (3 Colaboradoras)
    {
      id: 'c-flavia',
      sucursal_id: 'suc-maschwitz',
      codigo_sucursal: 'MASCHWITZ',
      alias: 'Flavia G.',
      nombre_completo: 'Gómez Flavia Marianela',
      dni: '32826228',
      cuil: '27-32826228-8',
      fecha_ingreso: '2024-12-01',
      fecha_antiguedad_reconocida: null,
      categoria: 'Vendedora',
      esquema_jornada: '5 días / 5,5 hs (paga 8 hs)',
      horas_base_mes: 160.0,
      recibo_hs_base: 22.0,
      estado: 'activa'
    },
    {
      id: 'c-juli',
      sucursal_id: 'suc-maschwitz',
      codigo_sucursal: 'MASCHWITZ',
      alias: 'Julieta V.',
      nombre_completo: 'Vera Julieta Agustina',
      dni: '39445123',
      cuil: '27-39445123-2',
      fecha_ingreso: '2023-11-01',
      fecha_antiguedad_reconocida: null,
      categoria: 'Vendedora',
      esquema_jornada: '4 días / 5,5 hs',
      horas_base_mes: 88.0,
      recibo_hs_base: 64.0,
      estado: 'activa'
    },
    {
      id: 'c-cami',
      sucursal_id: 'suc-maschwitz',
      codigo_sucursal: 'MASCHWITZ',
      alias: 'Camila V.',
      nombre_completo: 'Vera Camila Abril',
      dni: '42189032',
      cuil: '27-42189032-6',
      fecha_ingreso: '2023-02-17',
      fecha_antiguedad_reconocida: null,
      categoria: 'Encargada de Sucursal',
      esquema_jornada: '4 días / 5,5 hs',
      horas_base_mes: 88.0,
      recibo_hs_base: 64.0,
      estado: 'activa'
    },

    // TOM (5 Colaboradoras)
    {
      id: 'c-sofi',
      sucursal_id: 'suc-tom',
      codigo_sucursal: 'TOM',
      alias: 'Sofia B.',
      nombre_completo: 'Barrientos Sofia',
      dni: '35290145',
      cuil: '27-35290145-8',
      fecha_ingreso: '2025-07-05',
      fecha_antiguedad_reconocida: '2018-09-01', // Reconocimiento de antigüedad LCT (21 días disponibles)
      categoria: 'Encargada de Sucursal',
      esquema_jornada: '6 días / 6 hs (paga 8 hs)',
      horas_base_mes: 192.0,
      recibo_hs_base: 22.0,
      estado: 'activa'
    },
    {
      id: 'c-esme',
      sucursal_id: 'suc-tom',
      codigo_sucursal: 'TOM',
      alias: 'Esmeralda G.',
      nombre_completo: 'Galarza Esmeralda Cristina',
      dni: '38901234',
      cuil: '27-38901234-1',
      fecha_ingreso: '2022-02-01',
      fecha_antiguedad_reconocida: null,
      categoria: 'Vendedora',
      esquema_jornada: '6 días / 4x6hs y 2x8hs',
      horas_base_mes: 160.0,
      recibo_hs_base: 96.0,
      estado: 'activa'
    },
    {
      id: 'c-martu',
      sucursal_id: 'suc-tom',
      codigo_sucursal: 'TOM',
      alias: 'Martina P.',
      nombre_completo: 'Pinto Martina',
      dni: '44102987',
      cuil: '27-44102987-9',
      fecha_ingreso: '2024-04-01',
      fecha_antiguedad_reconocida: null,
      categoria: 'Vendedora (Cubre TOM y Maschwitz)',
      esquema_jornada: '2 días / 6 hs',
      horas_base_mes: 48.0,
      recibo_hs_base: 22.0,
      estado: 'activa'
    },
    {
      id: 'c-cande',
      sucursal_id: 'suc-tom',
      codigo_sucursal: 'TOM',
      alias: 'Candela A.',
      nombre_completo: 'Almiron Miranda Candela Anahi',
      dni: '45091234',
      cuil: '27-45091234-5',
      fecha_ingreso: '2025-12-01',
      fecha_antiguedad_reconocida: null,
      categoria: 'Vendedora',
      esquema_jornada: '4 días / 6 hs',
      horas_base_mes: 96.0,
      recibo_hs_base: 0.0,
      estado: 'activa'
    },
    {
      id: 'c-anto',
      sucursal_id: 'suc-tom',
      codigo_sucursal: 'TOM',
      alias: 'Antonella B.',
      nombre_completo: 'Bustamante Vanina Antonella',
      dni: '43998120',
      cuil: '27-43998120-3',
      fecha_ingreso: '2025-12-01',
      fecha_antiguedad_reconocida: null,
      categoria: 'Vendedora',
      esquema_jornada: '4 días / 6 hs',
      horas_base_mes: 96.0,
      recibo_hs_base: 0.0,
      estado: 'activa'
    }
  ];

  // --- 1.B MARTINA PINTO (COBERTURA DOMINGOS MASCHWITZ) ---
  const DEFAULT_MARTU_MASCH = {
    id: 'c-martu_masch',
    sucursal_id: 'suc-maschwitz',
    codigo_sucursal: 'MASCHWITZ',
    alias: 'Martina P.',
    nombre_completo: 'Pinto Martina (Maschwitz)',
    dni: '44102987',
    cuil: '27-44102987-9',
    categoria: 'Vendedora',
    esquema_jornada: '1 día / 5,5 hs',
    horas_base_mes: 22.0,
    recibo_hs_base: 0.0,
    estado: 'activa',
    isCoverage: true
  };

  // --- 2. PLANILLA DE HORAS Y CIERRES MENSUALES (INICIO TRACKING: SEPTIEMBRE 2026) ---
  // Base mensual = Recibo (Hs) + Sin Recibo (Hs) | Adicional (Hs) = turnos extras reportados por sucursal
  const DEFAULT_CIERRES = {
    // MASCHWITZ (Septiembre 2026)
    '2026-09_c-flavia': { horas_base: 160.0, recibo_hs: 22.0, sin_recibo_hs: 138.0, adicional_hs: 0, feriados_hs: 0, extras_hs: 0, vacaciones_hs: 0, observaciones: '', adicionales_hs: 0, detalle_cobertura: '' },
    '2026-09_c-cami': { horas_base: 88.0, recibo_hs: 64.0, sin_recibo_hs: 24.0, adicional_hs: 0, feriados_hs: 0, extras_hs: 0, vacaciones_hs: 0, observaciones: '', adicionales_hs: 0, detalle_cobertura: '' },
    '2026-09_c-juli': { horas_base: 88.0, recibo_hs: 64.0, sin_recibo_hs: 24.0, adicional_hs: 0, feriados_hs: 0, extras_hs: 0, vacaciones_hs: 0, observaciones: '', adicionales_hs: 0, detalle_cobertura: '' },
    '2026-09_c-martu_masch': { horas_base: 22.0, recibo_hs: 0.0, sin_recibo_hs: 22.0, adicional_hs: 0, feriados_hs: 0, extras_hs: 0, vacaciones_hs: 0, observaciones: '', adicionales_hs: 0, detalle_cobertura: '' },

    // TOM (Septiembre 2026)
    '2026-09_c-sofi': { horas_base: 192.0, recibo_hs: 22.0, sin_recibo_hs: 170.0, adicional_hs: 0, feriados_hs: 0, extras_hs: 0, vacaciones_hs: 0, observaciones: '', adicionales_hs: 0, detalle_cobertura: '' },
    '2026-09_c-esme': { horas_base: 160.0, recibo_hs: 96.0, sin_recibo_hs: 64.0, adicional_hs: 0, feriados_hs: 0, extras_hs: 0, vacaciones_hs: 0, observaciones: '', adicionales_hs: 0, detalle_cobertura: '' },
    '2026-09_c-martu': { horas_base: 48.0, recibo_hs: 22.0, sin_recibo_hs: 26.0, adicional_hs: 0, feriados_hs: 0, extras_hs: 0, vacaciones_hs: 0, observaciones: '', adicionales_hs: 0, detalle_cobertura: '' },
    '2026-09_c-anto': { horas_base: 96.0, recibo_hs: 0.0, sin_recibo_hs: 96.0, adicional_hs: 0, feriados_hs: 0, extras_hs: 0, vacaciones_hs: 0, observaciones: '', adicionales_hs: 0, detalle_cobertura: '' },
    '2026-09_c-cande': { horas_base: 96.0, recibo_hs: 0.0, sin_recibo_hs: 96.0, adicional_hs: 0, feriados_hs: 0, extras_hs: 0, vacaciones_hs: 0, observaciones: '', adicionales_hs: 0, detalle_cobertura: '' }
  };

  // --- DETALLE INDIVIDUAL DE HORAS EXTRAS Y ADICIONALES ---
  const DEFAULT_HORAS_DETALLE = [];

  // --- 3. HORARIOS SEMANALES OFICIALES (Grilla de Turnos de Excel) ---
  const DEFAULT_HORARIOS = {
    'TOM': {
      manana: { lun: 'SOFI', mar: 'SOFI', mie: 'ESME', jue: 'ESME', vie: 'ESME/CANDE', sab: 'ESME/ANTO', dom: 'SOFI/CANDE' },
      tarde: { lun: 'ESME', mar: 'MARTU', mie: 'MARTU/CANDE', jue: 'SOFI/ANTO', vie: 'SOFI/ANTO', sab: 'SOFI/CANDE', dom: 'ESME/ANTO' }
    },
    'MASCHWITZ': {
      manana: { lun: 'JULI', mar: 'FLAVIA', mie: 'FLAVIA', jue: 'FLAVIA', vie: 'FLAVIA', sab: 'FLAVIA', dom: 'CAMI' },
      tarde: { lun: 'CAMI', mar: 'CAMI', mie: 'JULI', jue: 'CAMI', vie: 'JULI', sab: 'JULI', dom: 'MARTU' }
    }
  };

  // --- ANEXO: FECHAS ESPECIALES Y EXCEPCIONES (Punto 2) ---
  const DEFAULT_FECHAS_ESPECIALES = [];

  // --- NOTAS GENERALES DE COBERTURAS DEL MES ---
  const DEFAULT_HORARIOS_NOTAS = {
    'TOM': 'Sofi encargada turno mañana lun/mar. Martu cubre francos.',
    'MASCHWITZ': 'Martu Pinto viene a cubrir domingos según rotación.'
  };

  // --- BITÁCORA DE MODIFICACIONES Y COBERTURAS (Punto 2) ---
  const DEFAULT_HORARIOS_MODIFICACIONES = [
    {
      id: 'f2805d63-5355-4452-9553-e50e8c436757',
      sucursal: 'MASCHWITZ',
      periodo: '2026-09',
      fecha: '2026-09-14',
      turno: 'Mañana',
      colaboradora_origen_id: 'Juli Vera',
      colaboradora_origen: 'Juli Vera',
      colaboradora_reemplazo_id: 'Martu P.',
      colaboradora_reemplazo: 'Martu P.',
      motivo: 'vacaciones pendientes verano 2025',
      creado_por: 'Flavia',
      creado_en: '2026-09-24T14:14:17.201768+00:00'
    },
    {
      id: 'd7ea6053-51bf-4981-8e08-7be287210cc0',
      sucursal: 'MASCHWITZ',
      periodo: '2026-09',
      fecha: '2026-09-16',
      turno: 'Tarde',
      colaboradora_origen_id: 'Juli Vera',
      colaboradora_origen: 'Juli Vera',
      colaboradora_reemplazo_id: 'Martu P.',
      colaboradora_reemplazo: 'Martu P.',
      motivo: 'vacaciones pendientes verano 2025',
      creado_por: 'Flavia',
      creado_en: '2026-09-24T14:14:37.241948+00:00'
    },
    {
      id: '38597cc1-cd5c-4972-a655-827e104c0dae',
      sucursal: 'MASCHWITZ',
      periodo: '2026-09',
      fecha: '2026-09-18',
      turno: 'Tarde',
      colaboradora_origen_id: 'Juli Vera',
      colaboradora_origen: 'Juli Vera',
      colaboradora_reemplazo_id: 'Martu P.',
      colaboradora_reemplazo: 'Martu P.',
      motivo: 'vacaciones pendientes verano 2025',
      creado_por: 'Flavia',
      creado_en: '2026-09-24T14:14:54.967738+00:00'
    },
    {
      id: 'afbf6043-e5a7-40ed-bdef-295e822a61aa',
      sucursal: 'MASCHWITZ',
      periodo: '2026-09',
      fecha: '2026-09-19',
      turno: 'Tarde',
      colaboradora_origen_id: 'Juli Vera',
      colaboradora_origen: 'Juli Vera',
      colaboradora_reemplazo_id: 'Martu P.',
      colaboradora_reemplazo: 'Martu P.',
      motivo: 'vacaciones pendientes verano 2025',
      creado_por: 'Flavia',
      creado_en: '2026-09-24T14:18:04.469453+00:00'
    }
  ];

  // --- MOCK SVG CERTIFICADO MÉDICO REALISTA PARA AUDITORÍA ---
  const SAMPLE_CERT_SVG = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="780" viewBox="0 0 600 780" style="background:#ffffff; font-family:Helvetica, Arial, sans-serif;"><rect width="600" height="780" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/><rect x="25" y="25" width="550" height="730" fill="#fcfcfc" stroke="#e2e8f0" stroke-width="1.5" rx="8"/><rect x="25" y="25" width="550" height="90" fill="#f8fafc" rx="8"/><text x="50" y="65" font-size="16" font-weight="bold" fill="#0f172a">CENTRO MÉDICO PILAR</text><text x="50" y="85" font-size="11" fill="#64748b">Medicina Laboral y Guardia 24hs · Av. Tratado del Pilar 450</text><line x1="45" y1="115" x2="555" y2="115" stroke="#0f172a" stroke-width="2"/><text x="300" y="165" font-size="20" font-weight="bold" text-anchor="middle" fill="#0f172a">CERTIFICADO MÉDICO</text><text x="50" y="220" font-size="13" fill="#475569">Fecha de emisión: 14 de Octubre de 2026</text><text x="50" y="255" font-size="13" fill="#1e293b">Por la presente certifico que he examinado a la colaboradora:</text><rect x="45" y="275" width="510" height="40" fill="#f1f5f9" rx="4"/><text x="60" y="300" font-size="15" font-weight="bold" fill="#0f172a">GÓMEZ FLAVIA MARIANELA (DNI 32.826.228)</text><text x="50" y="355" font-size="13" fill="#334155">Diagnóstico clínico presuntivo:</text><text x="50" y="380" font-size="15" font-weight="bold" fill="#b91c1c">FARINGOAMIGDALITIS AGUDA CON REGISTRO FEBRIL</text><text x="50" y="435" font-size="13" fill="#334155">Indicación médica:</text><text x="50" y="460" font-size="14" font-weight="bold" fill="#0f172a">REPOSO LABORAL POR 48 HORAS (14/10/2026 al 16/10/2026).</text><text x="50" y="485" font-size="12" fill="#64748b">Pudiendo reintegrarse a sus tareas el día 17 de Octubre de 2026.</text><g transform="translate(330, 580)"><path d="M 20 40 Q 60 5 110 35 T 190 25" stroke="#1d4ed8" stroke-width="2.5" fill="none" stroke-linecap="round"/><rect x="15" y="45" width="200" height="65" fill="#ffffff" stroke="#94a3b8" stroke-dasharray="3 3" rx="4"/><text x="115" y="65" font-size="12" font-weight="bold" text-anchor="middle" fill="#1e3a8a">DRA. MARIANA S. CASTILLO</text><text x="115" y="80" font-size="10" text-anchor="middle" fill="#334155">Médica Clínica - M.N. 148.922</text><text x="115" y="95" font-size="9" text-anchor="middle" fill="#64748b">Esp. en Medicina del Trabajo</text></g></svg>');

  // --- 4. RETIROS DE CALZADO Y PAR DE TEMPORADA ---
  const DEFAULT_RETIROS = [];

  // --- 5. NOVEDADES, FALTAS Y TRAMOS DE VACACIONES ---
  const DEFAULT_NOVEDADES = [];

  // --- ESTADO GLOBAL ---
  const state = {
    supabaseClient: null,
    isSupabaseConnected: false,
    currentRole: null,          // 'TOM' | 'MASCHWITZ' | 'ADMIN'
    currentPeriod: '2026-09',   // YYYY-MM
    activeStoreTab: 'horas',    // 'horas' | 'horarios' | 'novedades' | 'retiros' | 'vacaciones'
    activeAdminTab: 'consolidado', // 'consolidado' | 'horarios' | 'vacaciones' | 'retiros' | 'novedades' | 'colaboradoras'
    adminSelectedHorariosStore: 'TOM', // 'TOM' | 'MASCHWITZ'
    adminNovedadesFilter: 'todas',
    selectedPinTarget: null,
    currentSelectedFile: null,

    // Colecciones
    colaboradoras: [],
    martuMasch: null,
    novedades: [],
    cierres: {},
    horas_detalle: [],
    retiros: [],
    horarios: {},
    fechas_especiales: [],
    horarios_notas: {},
    horarios_modificaciones: [],

    // Banderas de edición protegida de grillas
    isStoreGridEditable: false,
    isAdminGridEditable: false
  };

  function getMartuMasch() {
    if (!state.martuMasch) {
      state.martuMasch = JSON.parse(localStorage.getItem('nazaria_martu_masch_v2') || JSON.stringify(DEFAULT_MARTU_MASCH));
    }
    return state.martuMasch;
  }

  // ============================================================================
  // INICIALIZACIÓN
  // ============================================================================
  function init() {
    initLucideIcons();
    initStorageData();
    renderPeriodSelectors();
    initSupabase();
    setupDropzone();
    restoreSession();
  }

  function initLucideIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function initStorageData() {
    // Inicializar o recargar datos con versión para migración limpia (v17: Ajuste base Martina Maschwitz 22hs)
    const DATA_VERSION = 'v17';
    const verKey = 'nazaria_data_version';
    if (localStorage.getItem(verKey) !== DATA_VERSION) {
      localStorage.setItem('nazaria_colaboradoras_v2', JSON.stringify(DEFAULT_COLABORADORAS));
      localStorage.setItem('nazaria_martu_masch_v2', JSON.stringify(DEFAULT_MARTU_MASCH));
      localStorage.setItem('nazaria_cierres_v2', JSON.stringify(DEFAULT_CIERRES));
      localStorage.setItem('nazaria_horas_detalle_v2', JSON.stringify(DEFAULT_HORAS_DETALLE));
      localStorage.setItem('nazaria_horarios_v2', JSON.stringify(DEFAULT_HORARIOS));
      localStorage.setItem('nazaria_fechas_especiales_v2', JSON.stringify(DEFAULT_FECHAS_ESPECIALES));
      localStorage.setItem('nazaria_horarios_notas_v2', JSON.stringify(DEFAULT_HORARIOS_NOTAS));
      localStorage.setItem('nazaria_horarios_modificaciones_v2', JSON.stringify(DEFAULT_HORARIOS_MODIFICACIONES));
      localStorage.setItem('nazaria_retiros_v2', JSON.stringify(DEFAULT_RETIROS));
      localStorage.setItem('nazaria_novedades_v2', JSON.stringify(DEFAULT_NOVEDADES));
      localStorage.setItem(verKey, DATA_VERSION);
    }

    state.colaboradoras = JSON.parse(localStorage.getItem('nazaria_colaboradoras_v2') || JSON.stringify(DEFAULT_COLABORADORAS));
    state.martuMasch = JSON.parse(localStorage.getItem('nazaria_martu_masch_v2') || JSON.stringify(DEFAULT_MARTU_MASCH));
    state.cierres = JSON.parse(localStorage.getItem('nazaria_cierres_v2') || JSON.stringify(DEFAULT_CIERRES));
    // Limpieza de texto de cobertura residual en observaciones
    Object.keys(state.cierres).forEach(k => {
      if (state.cierres[k]?.observaciones === 'Cubre domingos Maschwitz') {
        state.cierres[k].observaciones = '';
      }
      if (state.cierres[k]?.detalle_cobertura === 'Cubre domingos Maschwitz') {
        state.cierres[k].detalle_cobertura = '';
      }
    });
    state.horas_detalle = JSON.parse(localStorage.getItem('nazaria_horas_detalle_v2') || JSON.stringify(DEFAULT_HORAS_DETALLE));
    state.horarios = JSON.parse(localStorage.getItem('nazaria_horarios_v2') || JSON.stringify(DEFAULT_HORARIOS));
    state.fechas_especiales = JSON.parse(localStorage.getItem('nazaria_fechas_especiales_v2') || JSON.stringify(DEFAULT_FECHAS_ESPECIALES));
    state.horarios_notas = JSON.parse(localStorage.getItem('nazaria_horarios_notas_v2') || JSON.stringify(DEFAULT_HORARIOS_NOTAS));
    state.horarios_modificaciones = JSON.parse(localStorage.getItem('nazaria_horarios_modificaciones_v2') || JSON.stringify(DEFAULT_HORARIOS_MODIFICACIONES));
    state.retiros = JSON.parse(localStorage.getItem('nazaria_retiros_v2') || JSON.stringify(DEFAULT_RETIROS));
    state.novedades = JSON.parse(localStorage.getItem('nazaria_novedades_v2') || JSON.stringify(DEFAULT_NOVEDADES));
  }

  function initSupabase() {
    const url = window.APP_CONFIG?.SUPABASE_URL;
    const key = window.APP_CONFIG?.SUPABASE_ANON_KEY;
    const dbBadge = document.getElementById('badge-db-status');
    const dbStatusText = document.getElementById('db-status-text');

    if (url && key && window.supabase) {
      try {
        state.supabaseClient = window.supabase.createClient(url, key);
        state.isSupabaseConnected = true;
        if (dbBadge && dbStatusText) {
          dbBadge.className = "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-emerald-50 border border-emerald-200 text-emerald-800";
          dbStatusText.textContent = "Supabase Conectado";
        }
        syncFromSupabase();
      } catch (err) {
        setLocalModeBadge();
      }
    } else {
      setLocalModeBadge();
    }
  }

  async function syncFromSupabase() {
    if (!state.supabaseClient || !state.isSupabaseConnected) return;

    try {
      // 1. Horarios de sucursales
      const { data: remoteHorarios, error: errH } = await state.supabaseClient
        .from('horarios_sucursal')
        .select('*');

      if (!errH && remoteHorarios && remoteHorarios.length > 0) {
        remoteHorarios.forEach(row => {
          const code = row.sucursal_codigo;
          if (row.manana && row.tarde) {
            state.horarios[code] = { manana: row.manana, tarde: row.tarde };
          }
          if (row.notas) {
            state.horarios_notas[code] = row.notas;
          }
        });
        localStorage.setItem('nazaria_horarios_v2', JSON.stringify(state.horarios));
        localStorage.setItem('nazaria_horarios_notas_v2', JSON.stringify(state.horarios_notas));
      }

      // 2. Fechas especiales
      const { data: remoteFechas, error: errF } = await state.supabaseClient
        .from('fechas_especiales')
        .select('*');

      if (!errF && remoteFechas && remoteFechas.length > 0) {
        state.fechas_especiales = remoteFechas.map(r => ({
          id: r.id,
          sucursal: r.sucursal_codigo,
          fecha_evento: r.evento || r.fecha_evento,
          manana: r.manana,
          tarde: r.tarde,
          observacion: r.observacion
        }));
        localStorage.setItem('nazaria_fechas_especiales_v2', JSON.stringify(state.fechas_especiales));
      }

      // 3. Bitácora de modificaciones
      const { data: remoteMods, error: errM } = await state.supabaseClient
        .from('horarios_modificaciones')
        .select('*')
        .order('fecha', { ascending: false });

      if (!errM && remoteMods && remoteMods.length > 0) {
        state.horarios_modificaciones = remoteMods.map(r => ({
          id: r.id,
          sucursal: r.sucursal_codigo,
          periodo: r.periodo || state.currentPeriod,
          fecha: r.fecha,
          turno: r.turno,
          colaboradora_origen_id: r.colaboradora_origen_id || r.colaboradora_origen,
          colaboradora_origen: r.colaboradora_origen,
          colaboradora_reemplazo_id: r.colaboradora_reemplazo_id || r.colaboradora_reemplazo,
          colaboradora_reemplazo: r.colaboradora_reemplazo,
          motivo: r.motivo,
          creado_por: r.creado_por,
          creado_en: r.creado_en || r.created_at
        }));
        localStorage.setItem('nazaria_horarios_modificaciones_v2', JSON.stringify(state.horarios_modificaciones));
      }

      // Refrescar vistas si ya están activas
      if (state.currentRole === 'ADMIN') {
        if (state.activeAdminTab === 'horarios') renderAdminHorarios();
      } else if (state.currentRole) {
        if (state.activeStoreTab === 'horarios') {
          renderStoreHorarios();
          renderStoreFechasEspeciales();
        }
      }
    } catch (err) {
      console.warn('Sync from Supabase fallback to local:', err);
    }
  }

  function setLocalModeBadge() {
    state.isSupabaseConnected = false;
    const dbBadge = document.getElementById('badge-db-status');
    const dbStatusText = document.getElementById('db-status-text');
    if (dbBadge && dbStatusText) {
      dbBadge.className = "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-neutral-100 border border-neutral-200 text-neutral-600";
      dbStatusText.textContent = "Modo Local Demo";
    }
  }

  // ============================================================================
  // SESIÓN Y PIN
  // ============================================================================
  function promptPin(target) {
    state.selectedPinTarget = target;
    const modal = document.getElementById('modal-pin');
    const title = document.getElementById('modal-pin-title');
    const desc = document.getElementById('modal-pin-desc');
    const input = document.getElementById('input-pin');

    input.value = '';

    if (target === 'TOM') {
      title.textContent = 'Terminal TOM';
      desc.textContent = 'Ingresá tu PIN personal de Encargada (Sofi)';
    } else if (target === 'MASCHWITZ') {
      title.textContent = 'Terminal Maschwitz';
      desc.textContent = 'Ingresá tu PIN personal de Encargada (Flavia)';
    } else {
      title.textContent = 'Panel de Administración';
      desc.textContent = 'Ingresá tu clave personal de Administrador';
    }

    modal.classList.remove('hidden');
    input.focus();
  }

  function closePinModal() {
    document.getElementById('modal-pin').classList.add('hidden');
    document.getElementById('input-pin').value = '';
    state.selectedPinTarget = null;
  }

  function pressPinKey(key) {
    const input = document.getElementById('input-pin');
    if (key === 'C') {
      input.value = '';
    } else {
      if (input.value.length < 6) {
        input.value += key;
      }
    }
  }

  function submitPin() {
    const pin = document.getElementById('input-pin').value;
    const target = state.selectedPinTarget;
    const expectedPin = window.APP_CONFIG?.PINS?.[target] || (target === 'TOM' ? '0145' : target === 'MASCHWITZ' ? '6228' : '3585');

    if (pin === expectedPin) {
      sessionStorage.setItem('nazaria_session', target);
      state.currentRole = target;
      closePinModal();
      showToast(`Acceso concedido a ${target}`, 'success');
      renderCurrentView();
    } else {
      showToast('PIN incorrecto. Acceso denegado.', 'error');
      document.getElementById('input-pin').value = '';
    }
  }

  // Soporte de teclado físico para PC (Numpad, Enter, Backspace, Escape)
  document.addEventListener('keydown', (e) => {
    const pinModal = document.getElementById('modal-pin');
    const viewerModal = document.getElementById('modal-viewer');
    const exportModal = document.getElementById('modal-export-image');

    // Cerrar cualquier modal abierto con Escape
    if (e.key === 'Escape') {
      if (pinModal && !pinModal.classList.contains('hidden')) closePinModal();
      if (viewerModal && !viewerModal.classList.contains('hidden')) closeViewerModal();
      if (exportModal && !exportModal.classList.contains('hidden')) closeExportImageModal();
      return;
    }

    // Teclas numéricas y control para el modal de PIN
    if (pinModal && !pinModal.classList.contains('hidden')) {
      if (e.key >= '0' && e.key <= '9') {
        pressPinKey(e.key);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        submitPin();
      } else if (e.key === 'Backspace') {
        const input = document.getElementById('input-pin');
        if (input && input.value.length > 0) {
          input.value = input.value.slice(0, -1);
        }
      }
    }
  });

  function restoreSession() {
    const savedRole = sessionStorage.getItem('nazaria_session');
    if (savedRole) {
      state.currentRole = savedRole;
      renderCurrentView();
    } else {
      renderViewLogin();
    }
  }

  function logout() {
    sessionStorage.removeItem('nazaria_session');
    state.currentRole = null;
    renderViewLogin();
    showToast('Sesión finalizada.', 'info');
  }

  // --- GESTIÓN DINÁMICA DE PERÍODOS (INICIO SEPTIEMBRE 2026) ---
  const SYSTEM_START_PERIOD = '2026-09';

  function getAvailablePeriods() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1 a 12
    const [startYear, startMonth] = SYSTEM_START_PERIOD.split('-').map(Number);
    const totalStart = startYear * 12 + startMonth;
    const totalCurrent = Math.max(totalStart, currentYear * 12 + currentMonth);
    const periods = [];
    for (let t = totalCurrent; t >= totalStart; t--) {
      const y = Math.floor((t - 1) / 12);
      const m = ((t - 1) % 12) + 1;
      periods.push(`${y}-${String(m).padStart(2, '0')}`);
    }
    return periods;
  }

  function formatPeriodLabel(period) {
    const [y, m] = period.split('-').map(Number);
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return `${months[m - 1]} ${y}`;
  }

  function renderPeriodSelectors() {
    const available = getAvailablePeriods();
    if (!available.includes(state.currentPeriod)) {
      state.currentPeriod = available[0];
    }
    ['select-store-period', 'select-admin-period'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.innerHTML = available
        .map(p => `<option value="${p}">${formatPeriodLabel(p)}</option>`)
        .join('');
      el.value = state.currentPeriod;
    });
  }

  function changePeriod(newPeriod) {
    const available = getAvailablePeriods();
    if (!available.includes(newPeriod)) {
      showToast('Período no disponible aún.', 'error');
      return;
    }
    state.currentPeriod = newPeriod;
    const s1 = document.getElementById('select-store-period');
    const s2 = document.getElementById('select-admin-period');
    if (s1) s1.value = newPeriod;
    if (s2) s2.value = newPeriod;
    renderCurrentView();
    showToast(`Período actualizado a ${formatPeriodLabel(newPeriod)}`, 'info');
  }

  // ============================================================================
  // ENRUTAMIENTO Y RENDERIZADO DE VISTAS
  // ============================================================================
  function renderCurrentView() {
    const viewLogin = document.getElementById('view-login');
    const viewStore = document.getElementById('view-store');
    const viewAdmin = document.getElementById('view-admin');
    const badgeTerminal = document.getElementById('badge-active-terminal');
    const termName = document.getElementById('active-terminal-name');
    const btnLogout = document.getElementById('btn-logout');

    viewLogin.classList.add('hidden');
    viewStore.classList.add('hidden');
    viewAdmin.classList.add('hidden');

    if (!state.currentRole) {
      renderViewLogin();
      return;
    }

    badgeTerminal.classList.remove('hidden');
    badgeTerminal.classList.add('flex');
    btnLogout.classList.remove('hidden');
    btnLogout.classList.add('flex');

    if (state.currentRole === 'ADMIN') {
      termName.textContent = 'Administración';
      viewAdmin.classList.remove('hidden');
      renderAdminView();
    } else {
      termName.textContent = state.currentRole === 'TOM' ? 'TOM' : 'Maschwitz';
      viewStore.classList.remove('hidden');
      renderStoreView();
    }

    initLucideIcons();
  }

  function renderViewLogin() {
    document.getElementById('view-login').classList.remove('hidden');
    document.getElementById('view-store').classList.add('hidden');
    document.getElementById('view-admin').classList.add('hidden');
    document.getElementById('badge-active-terminal').classList.add('hidden');
    document.getElementById('btn-logout').classList.add('hidden');
    initLucideIcons();
  }

  // ============================================================================
  // TERMINAL DE LOCAL (STORE VIEW)
  // ============================================================================
  function renderStoreView() {
    const storeCode = state.currentRole;
    const storeTitle = document.getElementById('store-title');
    storeTitle.textContent = storeCode === 'TOM' ? 'Tortugas Open Mall (TOM)' : 'Maschwitz Mall';

    renderPeriodSelectors();

    // Poblar selects de colaboradoras para todos los formularios
    populateStoreColaboradorasSelects(storeCode);

    switchStoreTab(state.activeStoreTab);
  }

  function populateStoreColaboradorasSelects(storeCode) {
    const selects = [
      document.getElementById('nov-colaboradora'),
      document.getElementById('ret-colaboradora'),
      document.getElementById('hd-colaboradora'),
      document.getElementById('vac-colaboradora')
    ];

    const opts = ['<option value="">-- Seleccionar colaboradora --</option>'];

    // Colaboradoras asignadas a la sucursal
    const localColabs = state.colaboradoras.filter(c => c.codigo_sucursal === storeCode);
    localColabs.forEach(c => {
      opts.push(`<option value="${c.id}">${c.alias || c.nombre_completo} (${c.nombre_completo})</option>`);
    });

    // En Maschwitz, permitir seleccionar a colaboradoras de TOM para coberturas
    if (storeCode === 'MASCHWITZ') {
      opts.push('<optgroup label="Coberturas desde TOM">');
      state.colaboradoras.filter(c => c.codigo_sucursal === 'TOM').forEach(c => {
        opts.push(`<option value="${c.id}">${c.alias || c.nombre_completo} (Cubre de TOM)</option>`);
      });
      opts.push('</optgroup>');
    }

    const html = opts.join('');
    selects.forEach(sel => {
      if (sel) sel.innerHTML = html;
    });
  }

  function switchStoreTab(tab) {
    state.activeStoreTab = tab;

    const tabs = ['horas', 'horarios', 'novedades', 'retiros', 'vacaciones'];
    tabs.forEach(t => {
      const btn = document.getElementById(`tab-store-${t}`);
      const view = document.getElementById(`subview-store-${t}`);
      if (t === tab) {
        btn.className = "pb-3 text-xs sm:text-sm font-bold border-b-2 border-black text-neutral-900 flex items-center gap-2 whitespace-nowrap transition";
        view.classList.remove('hidden');
      } else {
        btn.className = "pb-3 text-xs sm:text-sm font-semibold text-neutral-500 hover:text-black flex items-center gap-2 whitespace-nowrap transition";
        view.classList.add('hidden');
      }
    });

    if (tab === 'horas') {
      renderStoreHoras();
      renderStoreHorasDetalle();
    }
    if (tab === 'horarios') {
      renderStoreHorarios();
      renderStoreFechasEspeciales();
    }
    if (tab === 'novedades') renderStoreNovedades();
    if (tab === 'retiros') renderStoreRetiros();
    if (tab === 'vacaciones') renderStoreVacaciones();

    initLucideIcons();
  }

  // Helper de nombre corto oficial: Primer Nombre + Inicial de Apellido (ej: Martina P.)
  function getColabShortName(colabId, fallback) {
    const MAP = {
      'c-flavia': 'Flavia G.',
      'c-juli': 'Julieta V.',
      'c-cami': 'Camila V.',
      'c-martu': 'Martina P.',
      'c-martu_masch': 'Martina P.',
      'c-sofi': 'Sofia B.',
      'c-esme': 'Esmeralda G.',
      'c-cande': 'Candela A.',
      'c-anto': 'Antonella B.'
    };
    if (MAP[colabId]) return MAP[colabId];
    if (fallback) {
      const parts = fallback.trim().split(/\s+/);
      if (parts.length >= 2) return `${parts[1]} ${parts[0][0]}.`;
      return fallback;
    }
    return 'Colaboradora';
  }

  // --- SUBVISTA 1: HORAS DEL MES & CIERRE (VISTA ENCARGADA: BASE + NOVEDADES) ---
  function renderStoreHoras() {
    const tbody = document.getElementById('tbody-store-horas');
    tbody.innerHTML = '';
    const storeCode = state.currentRole;

    const colabs = state.colaboradoras.filter(c => c.codigo_sucursal === storeCode);
    const listToRender = [...colabs];
    if (storeCode === 'MASCHWITZ') {
      listToRender.push(getMartuMasch());
    }

    listToRender.forEach(c => {
      const key = `${state.currentPeriod}_${c.id}`;
      const record = state.cierres[key] || {};

      const baseContractual = Number(record.horas_base ?? c.horas_base_mes ?? 0);
      const adicionalHs = Number(record.adicional_hs ?? 0);
      const feriadosHs = Number(record.feriados_hs ?? 0);
      const extrasHs = Number(record.extras_hs ?? 0);
      const vacacionesHs = Number(record.vacaciones_hs ?? 0);
      const obs = record.observaciones ?? record.detalle_cobertura ?? '';

      // Regla de Vacaciones: RESTAN directamente de las Horas Base
      const baseNeta = Math.max(0, baseContractual - vacacionesHs);
      const baseSubtext = vacacionesHs > 0 ? `<div class="text-[10px] text-neutral-400 font-mono mt-0.5">(${baseContractual} - ${vacacionesHs})</div>` : '';
      const displayName = getColabShortName(c.id, c.nombre_completo);

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="font-bold text-neutral-900 py-2.5">
          <div class="text-xs font-bold text-neutral-900">${displayName}</div>
          ${c.esquema_jornada ? `<div class="text-[10px] text-neutral-400 font-normal mt-0.5">${c.esquema_jornada}</div>` : ''}
        </td>
        <td class="text-center">
          <div id="hb-container-${c.id}" class="flex flex-col items-center">
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-100 border border-neutral-200 font-mono font-bold text-xs text-neutral-800" title="Horas base netas (Base contractual menos vacaciones)">
              <i data-lucide="lock" class="w-3 h-3 text-neutral-400"></i>
              <span>${baseNeta} hs</span>
            </div>
            ${baseSubtext}
          </div>
        </td>
        <td class="text-center">
          <input type="number" step="0.5" value="${adicionalHs}" id="ha-${c.id}" placeholder="0" class="w-16 p-1.5 border border-neutral-200 rounded font-mono text-center text-xs font-bold text-amber-900 focus:border-black focus:bg-white" onfocus="this.select()" title="Ajuste mensual de jornada: suma (+) o resta (-)">
        </td>
        <td class="text-center">
          <input type="number" step="0.5" min="0" value="${feriadosHs}" id="hf-${c.id}" class="w-16 p-1.5 border border-neutral-200 rounded font-mono text-center text-xs focus:border-black focus:bg-white" onfocus="this.select()">
        </td>
        <td class="text-center">
          <input type="number" step="0.5" min="0" value="${extrasHs}" id="he-${c.id}" class="w-16 p-1.5 border border-neutral-200 rounded font-mono text-center text-xs focus:border-black focus:bg-white" onfocus="this.select()">
        </td>
        <td class="text-center">
          <input type="number" step="0.5" min="0" value="${vacacionesHs}" id="hv-${c.id}" placeholder="0" class="w-16 p-1.5 border border-neutral-200 rounded font-mono text-center text-xs text-emerald-800 font-bold focus:border-black focus:bg-white" onfocus="this.select()" onchange="window.app.recalcStoreRowBase('${c.id}')" oninput="window.app.recalcStoreRowBase('${c.id}')" title="Horas de vacaciones (restan directamente de la Base)">
        </td>
        <td class="py-2 min-w-[260px]">
          <div class="flex items-start gap-1">
            <textarea id="dc-${c.id}" rows="2" placeholder="Observaciones / justificación de adicionales y vacaciones..." class="w-full text-xs p-1.5 border border-neutral-200 rounded focus:border-black focus:bg-white resize-y leading-tight font-sans transition" onfocus="this.select()">${obs}</textarea>
            <button type="button" onclick="window.app.openObservacionesModal('${c.id}', '${displayName}', 'store')" class="p-1 rounded hover:bg-neutral-100 text-neutral-400 hover:text-black transition cursor-pointer mt-0.5" title="Abrir editor amplio de observaciones">
              <i data-lucide="maximize-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    initLucideIcons();
  }

  function recalcStoreRowBase(colabId) {
    const key = `${state.currentPeriod}_${colabId}`;
    const rec = state.cierres[key] || {};
    const colab = colabId === 'c-martu_masch'
      ? getMartuMasch()
      : state.colaboradoras.find(c => c.id === colabId);
    const baseContractual = Number(rec.horas_base ?? colab?.horas_base_mes ?? 0);
    const hv = Number(document.getElementById(`hv-${colabId}`)?.value) || 0;
    const baseNeta = Math.max(0, baseContractual - hv);

    const hbEl = document.getElementById(`hb-container-${colabId}`);
    if (hbEl) {
      const baseSubtext = hv > 0 ? `<div class="text-[10px] text-neutral-400 font-mono mt-0.5">(${baseContractual} - ${hv})</div>` : '';
      hbEl.innerHTML = `
        <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-100 border border-neutral-200 font-mono font-bold text-xs text-neutral-800" title="Horas base netas (Base contractual menos vacaciones)">
          <i data-lucide="lock" class="w-3 h-3 text-neutral-400"></i>
          <span>${baseNeta} hs</span>
        </div>
        ${baseSubtext}
      `;
      initLucideIcons();
    }
  }

  function saveAllHorasStore() {
    const storeCode = state.currentRole;
    const colabs = state.colaboradoras.filter(c => c.codigo_sucursal === storeCode);
    const listToSave = [...colabs];
    if (storeCode === 'MASCHWITZ') {
      const mm = getMartuMasch();
      listToSave.push({ id: 'c-martu_masch', horas_base_mes: mm.horas_base_mes, recibo_hs_base: mm.recibo_hs_base });
    }

    listToSave.forEach(c => {
      const key = `${state.currentPeriod}_${c.id}`;
      const rec = state.cierres[key] || {};

      const ha = Number(document.getElementById(`ha-${c.id}`)?.value) || 0;
      const hf = Number(document.getElementById(`hf-${c.id}`)?.value) || 0;
      const he = Number(document.getElementById(`he-${c.id}`)?.value) || 0;
      const hv = Number(document.getElementById(`hv-${c.id}`)?.value) || 0;
      const obs = document.getElementById(`dc-${c.id}`)?.value.trim() || '';

      const hb = Number(rec.horas_base ?? c.horas_base_mes ?? 0);
      const reciboHs = Number(rec.recibo_hs ?? c.recibo_hs_base ?? 0);
      const sinReciboHs = Number(rec.sin_recibo_hs ?? Math.max(0, hb - reciboHs));

      state.cierres[key] = {
        ...rec,
        horas_base: hb,
        recibo_hs: reciboHs,
        sin_recibo_hs: sinReciboHs,
        adicional_hs: ha,
        feriados_hs: hf,
        extras_hs: he,
        vacaciones_hs: hv,
        observaciones: obs,
        adicionales_hs: ha,
        detalle_cobertura: obs
      };
    });

    localStorage.setItem('nazaria_cierres_v2', JSON.stringify(state.cierres));
    showToast('Horas del mes guardadas exitosamente.', 'success');
  }

  // --- SUBVISTA 1.B: DETALLE Y JUSTIFICACIÓN DE EXTRAS / ADICIONALES (Punto 1) ---
  function renderStoreHorasDetalle() {
    const tbody = document.getElementById('tbody-store-horas-detalle');
    if (!tbody) return;
    tbody.innerHTML = '';
    const storeCode = state.currentRole;

    // Filtrar y ordenar cronológicamente por fecha, luego por colaboradora
    const list = state.horas_detalle.filter(h => h.sucursal === storeCode);
    list.sort((a, b) => {
      const cmpDate = (a.fecha || '').localeCompare(b.fecha || '');
      if (cmpDate !== 0) return cmpDate;
      const cA = state.colaboradoras.find(c => c.id === a.colaboradora_id)?.nombre_completo || '';
      const cB = state.colaboradoras.find(c => c.id === b.colaboradora_id)?.nombre_completo || '';
      return cA.localeCompare(cB);
    });

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center py-5 text-neutral-400 text-xs">No hay detalle de horas extras o adicionales registradas.</td></tr>`;
      return;
    }

    list.forEach(h => {
      const colab = state.colaboradoras.find(c => c.id === h.colaboradora_id);
      const tr = document.createElement('tr');
      const isExtra = h.tipo === 'Hora Extra';

      tr.innerHTML = `
        <td class="font-mono text-xs text-neutral-600">${formatDateShort(h.fecha)}</td>
        <td class="font-bold text-xs text-neutral-900">${colab?.alias || colab?.nombre_completo || 'Colaboradora'}</td>
        <td><span class="px-2 py-0.5 rounded text-[10px] font-bold ${isExtra ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-blue-50 text-blue-800 border border-blue-200'}">${h.tipo}</span></td>
        <td class="font-mono font-bold text-xs text-neutral-900">${h.horas} hs</td>
        <td class="text-xs text-neutral-700">${h.motivo}</td>
        <td class="text-right">
          <button onclick="window.app.handleDeleteHoraDetalle('${h.id}')" class="text-neutral-400 hover:text-red-600 p-1" title="Eliminar registro">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    initLucideIcons();
  }

  function handleAddHoraDetalle(event) {
    event.preventDefault();
    const colabId = document.getElementById('hd-colaboradora').value;
    const fecha = document.getElementById('hd-fecha').value;
    const tipo = document.getElementById('hd-tipo').value;
    const horas = parseFloat(document.getElementById('hd-horas').value) || 0;
    const motivo = document.getElementById('hd-motivo').value.trim();

    const newRecord = {
      id: 'hd-' + Date.now(),
      colaboradora_id: colabId,
      sucursal: state.currentRole,
      fecha: fecha,
      tipo: tipo,
      horas: horas,
      motivo: motivo
    };

    state.horas_detalle.push(newRecord);
    localStorage.setItem('nazaria_horas_detalle_v2', JSON.stringify(state.horas_detalle));

    // Opcional: auto-sumar en la fila de la tabla principal
    const key = `${state.currentPeriod}_${colabId}`;
    if (state.cierres[key]) {
      if (tipo === 'Hora Extra') {
        state.cierres[key].extras_hs = (Number(state.cierres[key].extras_hs) || 0) + horas;
      } else {
        state.cierres[key].adicionales_hs = (Number(state.cierres[key].adicionales_hs) || 0) + horas;
      }
      localStorage.setItem('nazaria_cierres_v2', JSON.stringify(state.cierres));
    }

    document.getElementById('form-hora-detalle').reset();
    showToast('Horas registradas con justificación.', 'success');
    renderStoreHoras();
    renderStoreHorasDetalle();
  }

  function handleDeleteHoraDetalle(id) {
    const item = state.horas_detalle.find(h => h.id === id);
    if (!item) return;
    state.horas_detalle = state.horas_detalle.filter(h => h.id !== id);
    localStorage.setItem('nazaria_horas_detalle_v2', JSON.stringify(state.horas_detalle));

    // Restar de la fila principal si correspondía
    const key = `${state.currentPeriod}_${item.colaboradora_id}`;
    if (state.cierres[key]) {
      if (item.tipo === 'Hora Extra') {
        state.cierres[key].extras_hs = Math.max(0, (Number(state.cierres[key].extras_hs) || 0) - item.horas);
      } else {
        state.cierres[key].adicionales_hs = Math.max(0, (Number(state.cierres[key].adicionales_hs) || 0) - item.horas);
      }
      localStorage.setItem('nazaria_cierres_v2', JSON.stringify(state.cierres));
      renderStoreHoras();
    }

    renderStoreHorasDetalle();
    setUndoableDelete('hora_detalle', item, 'Horas eliminadas.');
  }

  // --- SUBVISTA 2: HORARIOS SEMANALES & FECHAS ESPECIALES (Punto 2) ---
  function renderStoreHorarios() {
    const storeCode = state.currentRole;
    const h = state.horarios[storeCode] || { manana: {}, tarde: {} };

    const days = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];
    days.forEach(d => {
      const elMan = document.getElementById(`h-man-${d}`);
      const elTar = document.getElementById(`h-tar-${d}`);
      if (elMan) elMan.value = h.manana[d] || '';
      if (elTar) elTar.value = h.tarde[d] || '';
    });

    const notasEl = document.getElementById('store-horarios-notas');
    if (notasEl) {
      notasEl.value = state.horarios_notas[storeCode] || '';
    }

    populateStoreModificacionSelects(storeCode);
    renderStoreModificaciones();
    renderStoreHorariosGridInputs();
  }

  function renderStoreHorariosGridInputs() {
    const isEdit = !!state.isStoreGridEditable;
    const days = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];
    days.forEach(d => {
      const elMan = document.getElementById(`h-man-${d}`);
      const elTar = document.getElementById(`h-tar-${d}`);
      [elMan, elTar].forEach(el => {
        if (!el) return;
        if (isEdit) {
          el.removeAttribute('readonly');
          el.className = "w-full text-center text-xs font-semibold p-1.5 border border-black rounded uppercase bg-white text-neutral-900 shadow-sm ring-2 ring-black/10 transition";
        } else {
          el.setAttribute('readonly', 'true');
          el.className = "w-full text-center text-xs font-semibold p-1.5 border border-neutral-200 rounded uppercase bg-neutral-100 text-neutral-700 cursor-default select-none transition";
        }
      });
    });

    const btn = document.getElementById('btn-toggle-store-grid-edit');
    if (btn) {
      if (isEdit) {
        btn.className = "px-3 py-2 rounded-lg border border-black text-xs font-bold bg-black text-white flex items-center gap-1.5 transition cursor-pointer";
        btn.innerHTML = `<i data-lucide="lock" class="w-3.5 h-3.5 text-[#E6D5C3]"></i> <span id="btn-toggle-store-grid-edit-text">Bloquear Grilla</span>`;
      } else {
        btn.className = "px-3 py-2 rounded-lg border border-neutral-300 text-xs font-bold bg-[#FAF9F6] text-neutral-700 hover:bg-neutral-100 flex items-center gap-1.5 transition cursor-pointer";
        btn.innerHTML = `<i data-lucide="pencil" class="w-3.5 h-3.5 text-neutral-500"></i> <span id="btn-toggle-store-grid-edit-text">Modificar Grilla</span>`;
      }
    }
    initLucideIcons();
  }

  function toggleStoreGridEdit() {
    state.isStoreGridEditable = !state.isStoreGridEditable;
    renderStoreHorariosGridInputs();
    if (state.isStoreGridEditable) {
      showToast('Modo edición activado: podés modificar turnos en la grilla.', 'info');
    }
  }

  async function saveHorariosStore() {
    const storeCode = state.currentRole;
    const days = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];
    const manana = {};
    const tarde = {};

    days.forEach(d => {
      manana[d] = document.getElementById(`h-man-${d}`)?.value.trim().toUpperCase() || '';
      tarde[d] = document.getElementById(`h-tar-${d}`)?.value.trim().toUpperCase() || '';
    });

    state.horarios[storeCode] = { manana, tarde };
    localStorage.setItem('nazaria_horarios_v2', JSON.stringify(state.horarios));

    state.isStoreGridEditable = false;
    renderStoreHorariosGridInputs();

    if (state.supabaseClient && state.isSupabaseConnected) {
      try {
        await state.supabaseClient
          .from('horarios_sucursal')
          .upsert({
            sucursal_codigo: storeCode,
            periodo: state.currentPeriod,
            manana: manana,
            tarde: tarde,
            notas: state.horarios_notas[storeCode] || '',
            actualizado_por: storeCode === 'TOM' ? 'Sofi' : 'Flavia',
            actualizado_en: new Date().toISOString()
          }, { onConflict: 'sucursal_codigo,periodo' });
      } catch (err) {
        console.warn('Error saving store horarios to Supabase:', err);
      }
    }

    showToast('Grilla de horarios guardada y fijada.', 'success');
  }

  function renderStoreFechasEspeciales() {
    const tbody = document.getElementById('tbody-store-fechas-especiales');
    if (!tbody) return;
    tbody.innerHTML = '';
    const storeCode = state.currentRole;

    const list = state.fechas_especiales.filter(f => f.sucursal === storeCode || f.sucursal_codigo === storeCode);
    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-neutral-400 text-xs">No hay fechas especiales cargadas este mes.</td></tr>`;
      return;
    }

    list.forEach(f => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="font-bold text-xs text-neutral-900">${f.fecha_evento}</td>
        <td class="font-mono text-xs uppercase">${f.manana}</td>
        <td class="font-mono text-xs uppercase">${f.tarde}</td>
        <td class="text-xs text-neutral-600">${f.observacion || '-'}</td>
        <td class="text-right">
          <button onclick="window.app.handleDeleteFechaEspecial('${f.id}')" class="text-neutral-400 hover:text-red-600 p-1" title="Eliminar">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    initLucideIcons();
  }

  async function handleAddFechaEspecial(event) {
    event.preventDefault();
    const evento = document.getElementById('fe-evento').value.trim();
    const manana = document.getElementById('fe-manana').value.trim().toUpperCase();
    const tarde = document.getElementById('fe-tarde').value.trim().toUpperCase();
    const obs = document.getElementById('fe-obs').value.trim();

    const newFe = {
      id: 'fe-' + Date.now(),
      sucursal: state.currentRole,
      fecha_evento: evento,
      manana: manana,
      tarde: tarde,
      observacion: obs
    };

    state.fechas_especiales.push(newFe);
    localStorage.setItem('nazaria_fechas_especiales_v2', JSON.stringify(state.fechas_especiales));

    if (state.supabaseClient && state.isSupabaseConnected) {
      try {
        await state.supabaseClient
          .from('fechas_especiales')
          .insert({
            sucursal_codigo: state.currentRole,
            periodo: state.currentPeriod,
            evento: evento,
            manana: manana,
            tarde: tarde,
            observacion: obs
          });
      } catch (err) {
        console.warn('Error inserting fecha especial in Supabase:', err);
      }
    }

    document.getElementById('form-fecha-especial').reset();
    showToast('Fecha especial agregada al anexo.', 'success');
    renderStoreFechasEspeciales();
    if (state.currentRole === 'ADMIN') renderAdminFechasEspeciales();
  }

  async function handleDeleteFechaEspecial(id) {
    const item = state.fechas_especiales.find(f => f.id === id);
    if (!item) return;
    state.fechas_especiales = state.fechas_especiales.filter(f => f.id !== id);
    localStorage.setItem('nazaria_fechas_especiales_v2', JSON.stringify(state.fechas_especiales));

    if (state.supabaseClient && state.isSupabaseConnected) {
      try {
        await state.supabaseClient
          .from('fechas_especiales')
          .delete()
          .eq('id', id);
      } catch (err) {
        console.warn('Error deleting fecha especial from Supabase:', err);
      }
    }

    renderStoreFechasEspeciales();
    if (state.currentRole === 'ADMIN') renderAdminFechasEspeciales();
    setUndoableDelete('fecha_especial', item, 'Fecha especial eliminada.');
  }

  async function saveHorariosNotas() {
    const storeCode = state.currentRole;
    const txt = document.getElementById('store-horarios-notas')?.value.trim() || '';
    state.horarios_notas[storeCode] = txt;
    localStorage.setItem('nazaria_horarios_notas_v2', JSON.stringify(state.horarios_notas));

    if (state.supabaseClient && state.isSupabaseConnected) {
      try {
        const h = state.horarios[storeCode] || { manana: {}, tarde: {} };
        await state.supabaseClient
          .from('horarios_sucursal')
          .upsert({
            sucursal_codigo: storeCode,
            periodo: state.currentPeriod,
            manana: h.manana || {},
            tarde: h.tarde || {},
            notas: txt,
            actualizado_por: storeCode === 'TOM' ? 'Sofi' : 'Flavia',
            actualizado_en: new Date().toISOString()
          }, { onConflict: 'sucursal_codigo,periodo' });
      } catch (err) {
        console.warn('Error syncing notas to Supabase:', err);
      }
    }

    showToast('Observaciones y coberturas guardadas.', 'success');
  }

  // --- SUBVISTA 2.B: BITÁCORA DE MODIFICACIONES EN TIENDA ---
  function populateStoreModificacionSelects(storeCode) {
    const selOrigen = document.getElementById('store-mod-colab-origen');
    const selReemplazo = document.getElementById('store-mod-colab-reemplazo');
    if (!selOrigen || !selReemplazo) return;

    const buildOpts = () => {
      const opts = ['<option value="">-- Seleccionar colaboradora --</option>'];
      const localColabs = state.colaboradoras.filter(c => c.codigo_sucursal === storeCode);
      opts.push(`<optgroup label="Equipo ${storeCode}">`);
      localColabs.forEach(c => {
        opts.push(`<option value="${c.id}">${c.alias || c.nombre_completo} (${c.nombre_completo})</option>`);
      });
      opts.push(`</optgroup>`);

      const otherColabs = state.colaboradoras.filter(c => c.codigo_sucursal !== storeCode);
      if (otherColabs.length > 0) {
        opts.push(`<optgroup label="Colaboradoras de otra sucursal">`);
        otherColabs.forEach(c => {
          opts.push(`<option value="${c.id}">${c.alias || c.nombre_completo} (${c.codigo_sucursal})</option>`);
        });
        opts.push(`</optgroup>`);
      }
      return opts.join('');
    };

    const html = buildOpts();
    selOrigen.innerHTML = html;
    selReemplazo.innerHTML = html;
  }

  function toggleStoreModificacionForm(show) {
    const card = document.getElementById('card-store-form-modificacion');
    if (card) {
      card.classList.toggle('hidden', !show);
    }
    if (show) {
      const dateEl = document.getElementById('store-mod-fecha');
      if (dateEl && !dateEl.value) {
        dateEl.value = new Date().toISOString().split('T')[0];
      }
    }
  }

  async function handleSaveStoreModificacion(e) {
    e.preventDefault();
    const fecha = document.getElementById('store-mod-fecha')?.value;
    const turno = document.getElementById('store-mod-turno')?.value;
    const origId = document.getElementById('store-mod-colab-origen')?.value;
    const repId = document.getElementById('store-mod-colab-reemplazo')?.value;
    const motivo = document.getElementById('store-mod-motivo')?.value.trim();

    if (!fecha || !turno || !origId || !repId || !motivo) {
      showToast('Por favor completá todos los campos obligatorios.', 'error');
      return;
    }

    const colabOrig = state.colaboradoras.find(c => c.id === origId);
    const colabRep = state.colaboradoras.find(c => c.id === repId);
    const storeCode = state.currentRole;
    const authorName = storeCode === 'TOM' ? 'Sofi' : 'Flavia';

    const newRecord = {
      id: 'mod-' + Date.now(),
      sucursal: storeCode,
      periodo: state.currentPeriod,
      fecha: fecha,
      turno: turno,
      colaboradora_origen_id: origId,
      colaboradora_origen: colabOrig ? (colabOrig.alias || colabOrig.nombre_completo) : 'Colaboradora',
      colaboradora_reemplazo_id: repId,
      colaboradora_reemplazo: colabRep ? (colabRep.alias || colabRep.nombre_completo) : 'Reemplazo',
      motivo: motivo,
      creado_por: authorName,
      creado_en: new Date().toISOString()
    };

    state.horarios_modificaciones.unshift(newRecord);
    localStorage.setItem('nazaria_horarios_modificaciones_v2', JSON.stringify(state.horarios_modificaciones));

    if (state.supabaseClient && state.isSupabaseConnected) {
      try {
        await state.supabaseClient
          .from('horarios_modificaciones')
          .insert({
            sucursal_codigo: storeCode,
            periodo: state.currentPeriod,
            fecha: fecha,
            turno: turno,
            colaboradora_origen: newRecord.colaboradora_origen,
            colaboradora_reemplazo: newRecord.colaboradora_reemplazo,
            motivo: motivo,
            creado_por: authorName
          });
      } catch (err) {
        console.warn('Error saving modificacion to Supabase:', err);
      }
    }

    document.getElementById('store-mod-motivo').value = '';
    toggleStoreModificacionForm(false);
    renderStoreModificaciones();
    showToast('Modificación registrada y notificada a Administración.', 'success');
  }

  function renderStoreModificaciones() {
    const tbody = document.getElementById('tbody-store-modificaciones');
    if (!tbody) return;
    tbody.innerHTML = '';
    const storeCode = state.currentRole;

    const list = state.horarios_modificaciones.filter(m => m.sucursal === storeCode || m.sucursal_codigo === storeCode);
    list.sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''));

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-neutral-400 text-xs">No hay modificaciones ni cambios de turno registrados en este local.</td></tr>`;
      return;
    }

    list.forEach(m => {
      const colabOrig = state.colaboradoras.find(c => c.id === m.colaboradora_origen_id);
      const colabRep = state.colaboradoras.find(c => c.id === m.colaboradora_reemplazo_id);
      const origName = colabOrig ? (colabOrig.alias || colabOrig.nombre_completo) : (m.colaboradora_origen || '-');
      const repName = colabRep ? (colabRep.alias || colabRep.nombre_completo) : (m.colaboradora_reemplazo || '-');

      const turnoBadge = m.turno === 'Mañana' 
        ? 'bg-amber-100 text-amber-900 border border-amber-200'
        : m.turno === 'Tarde'
        ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
        : 'bg-neutral-100 text-neutral-800 border border-neutral-200';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="font-mono text-xs text-neutral-700">${formatDateShort(m.fecha)}</td>
        <td><span class="px-2 py-0.5 rounded text-[10px] font-bold ${turnoBadge}">${m.turno}</span></td>
        <td class="font-bold text-xs text-neutral-900">${origName}</td>
        <td class="font-bold text-xs text-neutral-900 flex items-center gap-1.5 pt-3">
          <span class="text-neutral-400">→</span>
          <span class="bg-[#E6D5C3]/40 border border-[#E6D5C3] px-2 py-0.5 rounded text-neutral-900">${repName}</span>
        </td>
        <td class="text-xs text-neutral-700 max-w-[240px] truncate" title="${m.motivo || ''}">${m.motivo || '-'}</td>
        <td><span class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 text-neutral-700">${m.creado_por || 'Encargada'}</span></td>
        <td class="text-right">
          <button onclick="window.app.handleDeleteModificacion('${m.id}')" class="text-neutral-400 hover:text-red-600 p-1" title="Eliminar registro">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    initLucideIcons();
  }

  // --- SUBVISTA 3: NOVEDADES & FALTAS (Ordenado por Fecha y Colaboradora - Punto 3) ---
  function renderStoreNovedades() {
    const tbody = document.getElementById('tbody-store-novedades');
    tbody.innerHTML = '';
    const storeCode = state.currentRole;

    const filtered = state.novedades.filter(n => {
      if (n.codigo_sucursal !== storeCode || n.tipo === 'Vacaciones') return false;
      const dateStr = n.fecha_inicio || n.creado_en || '';
      return dateStr.startsWith(state.currentPeriod);
    });
    
    // Ordenar cronológicamente por fecha, luego por nombre de colaboradora
    filtered.sort((a, b) => {
      const cmpDate = (a.fecha_inicio || '').localeCompare(b.fecha_inicio || '');
      if (cmpDate !== 0) return cmpDate;
      const cA = state.colaboradoras.find(c => c.id === a.colaboradora_id)?.nombre_completo || '';
      const cB = state.colaboradoras.find(c => c.id === b.colaboradora_id)?.nombre_completo || '';
      return cA.localeCompare(cB);
    });

    document.getElementById('store-nov-count').textContent = `${filtered.length} registros (${state.currentPeriod})`;

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-neutral-400 text-xs">No hay novedades registradas para el período ${state.currentPeriod}.</td></tr>`;
      return;
    }

    filtered.forEach(n => {
      const colab = state.colaboradoras.find(c => c.id === n.colaboradora_id);
      const tr = document.createElement('tr');

      const certBtn = n.certificado_url
        ? `<button onclick="window.app.viewComprobante('${n.id}')" class="px-2.5 py-1 rounded bg-[#E6D5C3] hover:bg-[#d8c2ad] text-neutral-900 font-bold text-[11px] flex items-center gap-1 shadow-sm cursor-pointer whitespace-nowrap">
             <i data-lucide="image" class="w-3.5 h-3.5"></i> Ver Foto
           </button>`
        : `<span class="text-neutral-400 text-xs italic">-</span>`;

      tr.innerHTML = `
        <td class="font-mono text-xs text-neutral-600">${formatDateShort(n.fecha_inicio)}</td>
        <td class="font-bold text-xs text-neutral-900">${colab?.alias || colab?.nombre_completo || 'Colaboradora'}</td>
        <td><span class="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-200">${n.tipo}</span></td>
        <td class="font-mono font-bold text-xs text-center">${n.dias_computados}d</td>
        <td class="text-xs text-neutral-800 whitespace-normal leading-relaxed min-w-[180px]">
          ${n.observaciones ? `<div class="bg-neutral-50 p-1.5 rounded border border-neutral-200 text-[11px]">${n.observaciones}</div>` : '<span class="text-neutral-400 text-xs">-</span>'}
        </td>
        <td class="text-center">${certBtn}</td>
        <td class="text-right">
          <button onclick="window.app.deleteNovedad('${n.id}')" class="text-neutral-400 hover:text-red-600 p-1 cursor-pointer" title="Eliminar novedad">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    initLucideIcons();
  }

  function handleTipoNovedadChange() {
    const tipo = document.getElementById('nov-tipo').value;
    const badge = document.getElementById('nov-file-required-badge');
    if (tipo === 'Licencia Médica') {
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }

  async function handleSaveNovedad(event) {
    event.preventDefault();
    const colabId = document.getElementById('nov-colaboradora').value;
    const tipo = document.getElementById('nov-tipo').value;
    const fechaInicio = document.getElementById('nov-fecha-inicio').value;
    const fechaFin = document.getElementById('nov-fecha-fin').value;
    const dias = parseFloat(document.getElementById('nov-dias').value) || 1;
    const obs = document.getElementById('nov-observaciones').value.trim();

    if (tipo === 'Licencia Médica' && !state.currentSelectedFile) {
      showToast('Por favor adjuntá el certificado médico firmado.', 'error');
      return;
    }

    let certUrl = '';
    if (state.currentSelectedFile) {
      certUrl = state.currentSelectedFile.dataUrl;
    }

    const newNov = {
      id: 'nov-' + Date.now(),
      colaboradora_id: colabId,
      codigo_sucursal: state.currentRole,
      tipo: tipo,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      dias_computados: dias,
      certificado_url: certUrl,
      observaciones: obs,
      creado_en: new Date().toISOString()
    };

    state.novedades.unshift(newNov);
    localStorage.setItem('nazaria_novedades_v2', JSON.stringify(state.novedades));

    document.getElementById('form-novedad').reset();
    removeSelectedFile();
    showToast('Novedad guardada exitosamente.', 'success');
    renderStoreNovedades();
  }

  function deleteNovedad(id) {
    const item = state.novedades.find(n => n.id === id);
    if (!item) return;
    state.novedades = state.novedades.filter(n => n.id !== id);
    localStorage.setItem('nazaria_novedades_v2', JSON.stringify(state.novedades));
    renderStoreNovedades();
    renderStoreVacaciones();
    renderAdminNovedades();
    renderAdminVacaciones();
    updateAdminKPIs();
    const msg = item.tipo === 'Vacaciones' ? 'Tramo de vacaciones eliminado.' : 'Novedad eliminada.';
    setUndoableDelete('novedad', item, msg);
  }

  // --- SUBVISTA 4: RETIROS & PAR DE TEMPORADA (Ordenado por Fecha y Colaboradora - Punto 4) ---
  function renderStoreRetiros() {
    const tbody = document.getElementById('tbody-store-retiros');
    tbody.innerHTML = '';
    const storeCode = state.currentRole;

    const filtered = state.retiros.filter(r => r.sucursal === storeCode && r.fecha && r.fecha.startsWith(state.currentPeriod));
    
    // Ordenar cronológicamente por fecha, luego por nombre de colaboradora
    filtered.sort((a, b) => {
      const cmpDate = (a.fecha || '').localeCompare(b.fecha || '');
      if (cmpDate !== 0) return cmpDate;
      const cA = state.colaboradoras.find(c => c.id === a.colaboradora_id)?.nombre_completo || '';
      const cB = state.colaboradoras.find(c => c.id === b.colaboradora_id)?.nombre_completo || '';
      return cA.localeCompare(cB);
    });

    document.getElementById('store-ret-count').textContent = `${filtered.length} pares (${state.currentPeriod})`;

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-neutral-400 text-xs">No hay retiros ni pares de temporada en esta sucursal para ${state.currentPeriod}.</td></tr>`;
      return;
    }

    filtered.forEach(r => {
      const colab = state.colaboradoras.find(c => c.id === r.colaboradora_id);
      const tr = document.createElement('tr');

      const isSeason = r.tipo === 'Par de Temporada';
      const badgeType = isSeason
        ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E6D5C3] text-neutral-900">Temporada</span>`
        : `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-200">Retiro Descuento</span>`;

      tr.innerHTML = `
        <td>${badgeType}</td>
        <td class="font-bold text-xs text-neutral-900">${colab?.alias || colab?.nombre_completo || 'Colaboradora'}</td>
        <td class="font-mono font-bold text-xs uppercase text-neutral-800">${r.articulo}</td>
        <td class="text-xs uppercase text-neutral-700">${r.talle_color}</td>
        <td class="font-mono text-xs text-neutral-500">${r.fecha ? formatDateShort(r.fecha) : '-'}</td>
        <td class="text-right">
          <button onclick="window.app.deleteRetiro('${r.id}')" class="text-neutral-400 hover:text-red-600 p-1" title="Eliminar">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    initLucideIcons();
  }

  function handleSaveRetiro(event) {
    event.preventDefault();
    const colabId = document.getElementById('ret-colaboradora').value;
    const tipo = document.getElementById('ret-tipo').value;
    const fecha = document.getElementById('ret-fecha').value;
    const art = document.getElementById('ret-articulo').value.trim().toUpperCase();
    const talleColor = document.getElementById('ret-talle-color').value.trim().toUpperCase();

    const newRet = {
      id: 'ret-' + Date.now(),
      colaboradora_id: colabId,
      sucursal: state.currentRole,
      tipo: tipo,
      articulo: art,
      talle_color: talleColor,
      fecha: fecha || new Date().toISOString().split('T')[0]
    };

    state.retiros.push(newRet);
    localStorage.setItem('nazaria_retiros_v2', JSON.stringify(state.retiros));

    document.getElementById('form-retiro').reset();
    showToast('Calzado registrado con éxito.', 'success');
    renderStoreRetiros();
  }

  function deleteRetiro(id) {
    const item = state.retiros.find(r => r.id === id);
    if (!item) return;
    state.retiros = state.retiros.filter(r => r.id !== id);
    localStorage.setItem('nazaria_retiros_v2', JSON.stringify(state.retiros));
    renderStoreRetiros();
    renderAdminRetiros();
    updateAdminKPIs();
    setUndoableDelete('retiro', item, 'Calzado eliminado.');
  }

  function calcNovDaysAuto() {
    const d = document.getElementById('nov-fecha-inicio')?.value;
    const h = document.getElementById('nov-fecha-fin')?.value;
    if (d && h) {
      const date1 = new Date(d);
      const date2 = new Date(h);
      if (date2 >= date1) {
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        const diasEl = document.getElementById('nov-dias');
        if (diasEl) diasEl.value = diffDays;
      }
    }
  }

  // --- SUBVISTA 5: VACACIONES (Carga directa, Días Disponibles y Tramos Desplegados - Punto 5) ---
  function calcVacDaysAuto() {
    const d = document.getElementById('vac-desde')?.value;
    const h = document.getElementById('vac-hasta')?.value;
    if (d && h) {
      const date1 = new Date(d);
      const date2 = new Date(h);
      if (date2 >= date1) {
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        document.getElementById('vac-dias').value = diffDays;
      }
    }
  }

  function handleSaveVacaciones(event) {
    event.preventDefault();
    const colabId = document.getElementById('vac-colaboradora').value;
    const desde = document.getElementById('vac-desde').value;
    const hasta = document.getElementById('vac-hasta').value;
    const dias = parseFloat(document.getElementById('vac-dias').value) || 1;
    const obs = document.getElementById('vac-obs').value.trim();

    const newVac = {
      id: 'nov-' + Date.now(),
      colaboradora_id: colabId,
      codigo_sucursal: state.currentRole,
      tipo: 'Vacaciones',
      fecha_inicio: desde,
      fecha_fin: hasta,
      dias_computados: dias,
      certificado_url: '',
      observaciones: obs || `Tramo ${formatDateShort(desde)} al ${formatDateShort(hasta)}`,
      creado_en: new Date().toISOString()
    };

    state.novedades.push(newVac);
    localStorage.setItem('nazaria_novedades_v2', JSON.stringify(state.novedades));

    document.getElementById('form-vacaciones').reset();
    showToast('Tramo de vacaciones registrado.', 'success');
    renderStoreVacaciones();
  }

  function renderStoreVacaciones() {
    const tbody = document.getElementById('tbody-store-vacaciones');
    tbody.innerHTML = '';
    const storeCode = state.currentRole;
    const colabs = state.colaboradoras.filter(c => c.codigo_sucursal === storeCode);
    const anioFiscal = parseInt(state.currentPeriod.split('-')[0]) || 2026;

    colabs.forEach(c => {
      const calc = calcularVacacionesLCT(c, anioFiscal);
      
      // Buscar novedades de vacaciones para esta colaboradora
      const vacNovedades = state.novedades.filter(n => n.colaboradora_id === c.id && n.tipo === 'Vacaciones');
      // Ordenar tramos por fecha
      vacNovedades.sort((a, b) => (a.fecha_inicio || '').localeCompare(b.fecha_inicio || ''));

      const diasTomados = vacNovedades.reduce((sum, n) => sum + (Number(n.dias_computados) || 0), 0);
      const saldo = Math.max(0, calc.diasLey - diasTomados);

      // Renderizar tramos desplegados en tarjetas individuales
      let tramosHtml = '<div class="flex flex-wrap gap-1.5">';
      if (vacNovedades.length === 0) {
        tramosHtml += '<span class="text-neutral-400 text-xs italic">Sin tramos gozados aún</span>';
      } else {
        vacNovedades.forEach(n => {
          tramosHtml += `
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FAF9F6] border border-neutral-200 text-xs">
              <span class="font-medium text-neutral-800">📅 ${formatDateShort(n.fecha_inicio)} al ${formatDateShort(n.fecha_fin)}</span>
              <span class="font-bold text-amber-800">(${n.dias_computados}d)</span>
              ${n.observaciones ? `<span class="text-neutral-500 text-[11px] truncate max-w-[120px]" title="${n.observaciones}">· ${n.observaciones}</span>` : ''}
              <button onclick="window.app.deleteNovedad('${n.id}')" class="text-neutral-400 hover:text-red-600 font-bold ml-1" title="Eliminar tramo">✕</button>
            </div>
          `;
        });
      }
      tramosHtml += '</div>';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="font-bold text-neutral-900">
          <div>${c.alias || c.nombre_completo}</div>
          <div class="text-[11px] text-neutral-400 font-normal">Ingreso: ${formatDateShort(c.fecha_ingreso)} ${c.fecha_antiguedad_reconocida ? '<span class="text-amber-800 font-semibold">(Antigüedad: ' + formatDateShort(c.fecha_antiguedad_reconocida) + ')</span>' : ''}</div>
        </td>
        <td class="font-mono text-xs text-neutral-700">${calc.aniosAntiguedad} años al 31/12</td>
        <td class="font-mono font-bold text-xs text-center"><span class="bg-[#E6D5C3]/40 border border-[#E6D5C3] px-2.5 py-0.5 rounded text-neutral-900">${calc.diasLey} días</span></td>
        <td class="font-mono font-bold text-xs text-center text-amber-800">${diasTomados} días</td>
        <td class="font-mono font-bold text-sm text-center ${saldo === 0 ? 'text-neutral-400' : 'text-emerald-700'}">
          ${saldo} días
        </td>
        <td>${tramosHtml}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // ============================================================================
  // PANEL DE ADMINISTRACIÓN (ADMIN VIEW)
  // ============================================================================
  function renderAdminView() {
    renderPeriodSelectors();
    updateAdminKPIs();
    switchAdminTab(state.activeAdminTab);
  }

  function switchAdminTab(tab) {
    state.activeAdminTab = tab;
    const tabs = ['consolidado', 'horarios', 'vacaciones', 'novedades', 'retiros', 'colaboradoras'];
    tabs.forEach(t => {
      const btn = document.getElementById(`tab-admin-${t}`);
      const view = document.getElementById(`subview-admin-${t}`);
      if (t === tab) {
        btn.className = "pb-3 text-xs sm:text-sm font-bold border-b-2 border-black text-neutral-900 flex items-center gap-2 whitespace-nowrap transition";
        view.classList.remove('hidden');
      } else {
        btn.className = "pb-3 text-xs sm:text-sm font-semibold text-neutral-500 hover:text-black flex items-center gap-2 whitespace-nowrap transition";
        view.classList.add('hidden');
      }
    });

    if (tab === 'consolidado') renderAdminConsolidado();
    if (tab === 'horarios') renderAdminHorarios();
    if (tab === 'vacaciones') renderAdminVacaciones();
    if (tab === 'novedades') renderAdminNovedades();
    if (tab === 'retiros') renderAdminRetiros();
    if (tab === 'colaboradoras') renderAdminColaboradoras();

    initLucideIcons();
  }

  function getCierreTotal(rec) {
    if (!rec) return 0;
    const r = Number(rec.recibo_hs ?? 0);
    const sr = Number(rec.sin_recibo_hs ?? 0);
    const a = Number(rec.adicional_hs ?? 0);
    const f = Number(rec.feriados_hs ?? 0);
    const e = Number(rec.extras_hs ?? 0);
    const v = Number(rec.vacaciones_hs ?? 0);
    // Regla de Vacaciones: RESTAN del total trabajado (se liquidan aparte por LCT)
    return Math.max(0, r + sr + a + f + e - v);
  }

  function updateAdminKPIs() {
    const activeColabs = state.colaboradoras.filter(c => (c.estado || 'activa') === 'activa').length;
    const totalColabs = state.colaboradoras.length;
    document.getElementById('kpi-colabs').textContent = `${activeColabs} / ${totalColabs}`;

    let totalHoras = 0;
    Object.keys(state.cierres).forEach(k => {
      if (k.startsWith(state.currentPeriod)) {
        totalHoras += getCierreTotal(state.cierres[k]);
      }
    });
    document.getElementById('kpi-horas').textContent = `${totalHoras} hs`;

    const vacDays = state.novedades
      .filter(n => n.tipo === 'Vacaciones' && ((n.fecha_inicio && n.fecha_inicio.startsWith(state.currentPeriod)) || (n.creado_en && n.creado_en.startsWith(state.currentPeriod))))
      .reduce((sum, n) => sum + (Number(n.dias_computados) || 0), 0);
    document.getElementById('kpi-vacaciones').textContent = `${vacDays} d`;

    const retirosPeriod = state.retiros.filter(r => r.fecha && r.fecha.startsWith(state.currentPeriod));
    document.getElementById('kpi-retiros').textContent = retirosPeriod.length;
  }

  // --- HELPER: OBTENER CLAVES CONSOLIDADAS DEL PERÍODO (ORDEN MASCHWITZ PRIMERO, LUEGO TOM) ---
  function getConsolidadoKeysForPeriod(period) {
    let keys = Object.keys(state.cierres).filter(k => k.startsWith(period));
    if (keys.length === 0) {
      // 1. Maschwitz
      const maschColabs = state.colaboradoras.filter(c => c.codigo_sucursal === 'MASCHWITZ' && (c.estado || 'activa') === 'activa');
      maschColabs.forEach(c => {
        const k = `${period}_${c.id}`;
        if (!state.cierres[k]) {
          const hb = c.horas_base_mes || 88.0;
          const rec = c.recibo_hs_base || 0;
          const sinRec = Math.max(0, hb - rec);
          state.cierres[k] = {
            horas_base: hb,
            recibo_hs: rec,
            sin_recibo_hs: sinRec,
            adicional_hs: 0,
            feriados_hs: 0,
            extras_hs: 0,
            vacaciones_hs: 0,
            observaciones: '',
            adicionales_hs: 0,
            detalle_cobertura: ''
          };
        }
        keys.push(k);
      });
      const maschCovKey = `${period}_c-martu_masch`;
      if (!state.cierres[maschCovKey]) {
        const mm = getMartuMasch();
        state.cierres[maschCovKey] = {
          horas_base: mm.horas_base_mes,
          recibo_hs: mm.recibo_hs_base,
          sin_recibo_hs: Math.max(0, mm.horas_base_mes - mm.recibo_hs_base),
          adicional_hs: 0,
          feriados_hs: 0,
          extras_hs: 0,
          vacaciones_hs: 0,
          observaciones: '',
          adicionales_hs: 0,
          detalle_cobertura: ''
        };
      }
      keys.push(maschCovKey);

      // 2. TOM
      const tomColabs = state.colaboradoras.filter(c => c.codigo_sucursal === 'TOM' && (c.estado || 'activa') === 'activa');
      tomColabs.forEach(c => {
        const k = `${period}_${c.id}`;
        if (!state.cierres[k]) {
          const hb = c.horas_base_mes || 96.0;
          const rec = c.recibo_hs_base || 0;
          const sinRec = Math.max(0, hb - rec);
          state.cierres[k] = {
            horas_base: hb,
            recibo_hs: rec,
            sin_recibo_hs: sinRec,
            adicional_hs: 0,
            feriados_hs: 0,
            extras_hs: 0,
            vacaciones_hs: 0,
            observaciones: '',
            adicionales_hs: 0,
            detalle_cobertura: ''
          };
        }
        keys.push(k);
      });
    }

    // Orden idéntico a SUELDOS 2:
    // Maschwitz: Flavia, Martu P., Cami, Juli
    // TOM: Sofi, Esme, Martu P., Anto, Cande
    const priority = {
      'c-flavia': 1,
      'c-martu_masch': 2,
      'c-cami': 3,
      'c-juli': 4,
      'c-sofi': 10,
      'c-esme': 11,
      'c-martu': 12,
      'c-anto': 13,
      'c-cande': 14
    };

    return keys.sort((a, b) => {
      const colabIdA = a.replace(`${period}_`, '');
      const colabIdB = b.replace(`${period}_`, '');
      const pA = priority[colabIdA] || 99;
      const pB = priority[colabIdB] || 99;
      return pA - pB;
    });
  }

  // --- ADMIN 1: CONSOLIDADO DE HORAS (EDITABLE POR ADMIN, FORMATO SUELDOS 2) ---
  function renderAdminConsolidado() {
    const tbody = document.getElementById('tbody-admin-consolidado');
    tbody.innerHTML = '';

    const allKeys = getConsolidadoKeysForPeriod(state.currentPeriod);
    if (allKeys.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" class="text-center py-6 text-neutral-400 text-xs">No hay colaboradoras disponibles para este período (${state.currentPeriod}).</td></tr>`;
      return;
    }

    let lastStore = null;

    allKeys.forEach(k => {
      const colabId = k.replace(`${state.currentPeriod}_`, '');
      const isMaschCoverage = colabId === 'c-martu_masch';
      const colab = isMaschCoverage ? getMartuMasch() : state.colaboradoras.find(c => c.id === colabId);
      const sucursal = isMaschCoverage ? 'MASCHWITZ' : (colab?.codigo_sucursal || 'TOM');
      const rec = state.cierres[k] || {};

      const reciboHs = Number(rec.recibo_hs ?? colab?.recibo_hs_base ?? 0);
      const sinReciboHs = Number(rec.sin_recibo_hs ?? (colab ? Math.max(0, (colab.horas_base_mes || 0) - (colab.recibo_hs_base || 0)) : 0));
      const baseContractual = reciboHs + sinReciboHs;
      const adicionalHs = Number(rec.adicional_hs ?? 0);
      const feriadosHs = Number(rec.feriados_hs ?? 0);
      const extrasHs = Number(rec.extras_hs ?? 0);
      const vacacionesHs = Number(rec.vacaciones_hs ?? 0);
      const observaciones = rec.observaciones ?? rec.detalle_cobertura ?? '';

      // Regla de Vacaciones: RESTAN directamente de las Horas Base
      const baseNeta = Math.max(0, baseContractual - vacacionesHs);
      const baseSubtext = vacacionesHs > 0 ? `<div class="text-[10px] text-neutral-400 font-mono mt-0.5">(${baseContractual} - ${vacacionesHs})</div>` : '';

      // Encabezado visual de sucursal
      if (sucursal !== lastStore) {
        lastStore = sucursal;
        const bannerTr = document.createElement('tr');
        bannerTr.className = sucursal === 'MASCHWITZ' ? 'bg-[#d8b4e2]/25 border-y-2 border-[#d8b4e2]' : 'bg-[#fed7aa]/35 border-y-2 border-[#fed7aa]';
        bannerTr.innerHTML = `
          <td colspan="9" class="py-2.5 px-4 text-xs font-bold text-neutral-900 uppercase tracking-wider">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full ${sucursal === 'MASCHWITZ' ? 'bg-purple-600' : 'bg-amber-600'}"></span>
                <span>${sucursal} · ${sucursal === 'MASCHWITZ' ? 'Jornada 5.5 hs' : 'Jornada 6.0 hs'}</span>
              </div>
              <span class="text-[11px] font-normal text-neutral-500 lowercase">período: ${state.currentPeriod}</span>
            </div>
          </td>
        `;
        tbody.appendChild(bannerTr);
      }

      const displayName = getColabShortName(colabId, colab?.nombre_completo);
      const esquema = colab?.esquema_jornada || '';

      const tr = document.createElement('tr');
      tr.className = "hover:bg-neutral-50/50 transition border-b border-neutral-100";
      tr.innerHTML = `
        <td class="font-bold text-xs text-neutral-900 whitespace-nowrap py-2.5">
          <div class="flex items-center gap-2">
            <span class="px-1.5 py-0.5 rounded text-[10px] font-bold ${sucursal === 'TOM' ? 'bg-[#E6D5C3] text-neutral-900' : 'bg-purple-100 text-purple-900'}">${sucursal}</span>
            <div>
              <div class="font-bold text-xs text-neutral-900">${displayName}</div>
              <div class="flex items-center gap-1.5 mt-0.5">
                ${esquema ? `<span class="text-[10px] text-neutral-400 font-normal">${esquema}</span>` : ''}
                <button type="button" onclick="window.app.openEditEsquemaModal('${colabId}')" class="p-0.5 rounded text-neutral-400 hover:text-black transition cursor-pointer" title="Modificar esquema contractual y horas base habituales">
                  <i data-lucide="pencil" class="w-2.5 h-2.5"></i>
                </button>
              </div>
            </div>
          </div>
        </td>
        <td class="text-center py-2">
          <div class="inline-flex items-center justify-center gap-1">
            <input type="number" min="0" step="0.5" value="${reciboHs}" 
              id="input-rec-${k}"
              readonly
              title="Horas formales de recibo (fijo mensual · doble clic o clic en lápiz para editar)"
              onfocus="this.select()"
              ondblclick="window.app.toggleBaseEdit('rec', '${k}')"
              onchange="window.app.handleAdminUpdateCierre('${k}', 'recibo_hs', this.value)"
              onkeydown="if(event.key==='Enter') { this.blur(); window.app.toggleBaseEdit('rec', '${k}'); }"
              class="w-14 text-center text-xs py-1 px-1 rounded bg-neutral-100 border border-neutral-200 font-mono font-bold text-neutral-700 cursor-default select-none transition">
            <button type="button" 
              id="btn-rec-${k}" 
              onclick="window.app.toggleBaseEdit('rec', '${k}')" 
              class="p-1 rounded hover:bg-neutral-200 text-neutral-400 hover:text-black transition cursor-pointer" 
              title="Modificar horas de recibo">
              <i data-lucide="pencil" class="w-3 h-3"></i>
            </button>
          </div>
        </td>
        <td class="text-center py-2">
          <div class="inline-flex items-center justify-center gap-1">
            <input type="number" min="0" step="0.5" value="${sinReciboHs}" 
              id="input-sinrec-${k}"
              readonly
              title="Horas base fuera de recibo (fijo mensual · doble clic o clic en lápiz para editar)"
              onfocus="this.select()"
              ondblclick="window.app.toggleBaseEdit('sinrec', '${k}')"
              onchange="window.app.handleAdminUpdateCierre('${k}', 'sin_recibo_hs', this.value)"
              onkeydown="if(event.key==='Enter') { this.blur(); window.app.toggleBaseEdit('sinrec', '${k}'); }"
              class="w-14 text-center text-xs py-1 px-1 rounded bg-neutral-100 border border-neutral-200 font-mono font-bold text-neutral-700 cursor-default select-none transition">
            <button type="button" 
              id="btn-sinrec-${k}" 
              onclick="window.app.toggleBaseEdit('sinrec', '${k}')" 
              class="p-1 rounded hover:bg-neutral-200 text-neutral-400 hover:text-black transition cursor-pointer" 
              title="Modificar horas fuera de recibo">
              <i data-lucide="pencil" class="w-3 h-3"></i>
            </button>
          </div>
        </td>
        <td class="text-center py-2">
          <div id="admin-base-${k}" class="flex flex-col items-center">
            <span class="inline-block px-2 py-1 rounded bg-neutral-100 font-mono font-bold text-xs text-neutral-900 border border-neutral-200">${baseNeta} hs</span>
            ${baseSubtext}
          </div>
        </td>
        <td class="text-center py-2">
          <input type="number" step="0.5" value="${adicionalHs}" 
            title="Ajuste mensual de jornada: suma (+) o resta (-)"
            onfocus="this.select()"
            onchange="window.app.handleAdminUpdateCierre('${k}', 'adicional_hs', this.value)"
            class="w-16 text-center text-xs py-1 px-1 rounded bg-[#FAF9F6] border border-neutral-300 font-mono font-bold text-amber-900 focus:bg-white focus:border-black focus:outline-none transition">
        </td>
        <td class="text-center py-2">
          <input type="number" min="0" step="0.5" value="${feriadosHs}" 
            title="Horas de feriados trabajados"
            onfocus="this.select()"
            onchange="window.app.handleAdminUpdateCierre('${k}', 'feriados_hs', this.value)"
            class="w-14 text-center text-xs py-1 px-1 rounded bg-[#FAF9F6] border border-neutral-300 font-mono font-bold focus:bg-white focus:border-black focus:outline-none transition">
        </td>
        <td class="text-center py-2">
          <input type="number" min="0" step="0.5" value="${extrasHs}" 
            title="Horas extra trabajadas"
            onfocus="this.select()"
            onchange="window.app.handleAdminUpdateCierre('${k}', 'extras_hs', this.value)"
            class="w-14 text-center text-xs py-1 px-1 rounded bg-[#FAF9F6] border border-neutral-300 font-mono font-bold focus:bg-white focus:border-black focus:outline-none transition">
        </td>
        <td class="text-center py-2">
          <input type="number" min="0" step="0.5" value="${vacacionesHs}" 
            title="Horas de vacaciones liquidadas (restan de la Base)"
            onfocus="this.select()"
            onchange="window.app.handleAdminUpdateCierre('${k}', 'vacaciones_hs', this.value)"
            oninput="window.app.handleAdminUpdateCierre('${k}', 'vacaciones_hs', this.value)"
            class="w-14 text-center text-xs py-1 px-1 rounded bg-[#FAF9F6] border border-neutral-300 font-mono font-bold text-emerald-800 focus:bg-white focus:border-black focus:outline-none transition">
        </td>
        <td class="py-2 min-w-[260px]">
          <div class="flex items-start gap-1">
            <textarea rows="2" placeholder="Observaciones / justificación de adicionales y vacaciones..."
              id="admin-obs-${k}"
              onfocus="this.select()"
              onchange="window.app.handleAdminUpdateCierre('${k}', 'observaciones', this.value)"
              class="w-full text-xs py-1 px-2 rounded bg-[#FAF9F6] border border-neutral-300 focus:bg-white focus:border-black focus:outline-none transition resize-y leading-tight font-sans">${observaciones}</textarea>
            <button type="button" onclick="window.app.openObservacionesModal('${k}', '${displayName}', 'admin')" class="p-1 rounded hover:bg-neutral-200 text-neutral-400 hover:text-black transition cursor-pointer mt-0.5" title="Abrir editor amplio de días y observaciones">
              <i data-lucide="maximize-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    initLucideIcons();
  }

  function handleAdminUpdateCierre(key, field, val) {
    if (!state.cierres[key]) {
      const colabId = key.replace(`${state.currentPeriod}_`, '');
      const isMaschCov = colabId === 'c-martu_masch';
      const colab = isMaschCov ? getMartuMasch() : state.colaboradoras.find(c => c.id === colabId);
      const hb = colab?.horas_base_mes || 88.0;
      const recHs = colab?.recibo_hs_base || 0;
      const sinRec = Math.max(0, hb - recHs);
      state.cierres[key] = {
        horas_base: hb,
        recibo_hs: recHs,
        sin_recibo_hs: sinRec,
        adicional_hs: 0,
        feriados_hs: 0,
        extras_hs: 0,
        vacaciones_hs: 0,
        observaciones: '',
        adicionales_hs: 0,
        detalle_cobertura: ''
      };
    }
    if (field === 'observaciones' || field === 'detalle_cobertura') {
      state.cierres[key].observaciones = val.trim();
      state.cierres[key].detalle_cobertura = val.trim();
    } else {
      const numVal = parseFloat(val) || 0;
      state.cierres[key][field] = numVal;
      if (field === 'adicional_hs') state.cierres[key].adicionales_hs = numVal;
      // Horas base es la sumatoria de recibo_hs + sin_recibo_hs
      state.cierres[key].horas_base = (Number(state.cierres[key].recibo_hs) || 0) + (Number(state.cierres[key].sin_recibo_hs) || 0);
    }
    localStorage.setItem('nazaria_cierres_v2', JSON.stringify(state.cierres));

    // Actualizar Base Neta en vivo si se modificó recibo, sin_recibo o vacaciones
    const r = Number(state.cierres[key].recibo_hs || 0);
    const sr = Number(state.cierres[key].sin_recibo_hs || 0);
    const v = Number(state.cierres[key].vacaciones_hs || 0);
    const baseTot = r + sr;
    const baseNeta = Math.max(0, baseTot - v);
    const baseEl = document.getElementById(`admin-base-${key}`);
    if (baseEl) {
      const baseSubtext = v > 0 ? `<div class="text-[10px] text-neutral-400 font-mono mt-0.5">(${baseTot} - ${v})</div>` : '';
      baseEl.innerHTML = `
        <span class="inline-block px-2 py-1 rounded bg-neutral-100 font-mono font-bold text-xs text-neutral-900 border border-neutral-200">${baseNeta} hs</span>
        ${baseSubtext}
      `;
    }

    updateAdminKPIs();
    showToast('Ajuste de planilla guardado.', 'success');
  }

  function toggleBaseEdit(type, key) {
    const input = document.getElementById(`input-${type}-${key}`);
    const btn = document.getElementById(`btn-${type}-${key}`);
    if (!input) return;

    const isReadOnly = input.hasAttribute('readonly');

    if (isReadOnly) {
      // Desbloquear campo para edición
      input.removeAttribute('readonly');
      input.classList.remove('bg-neutral-100', 'border-neutral-200', 'text-neutral-700', 'cursor-default', 'select-none');
      input.classList.add('bg-white', 'border-black', 'text-neutral-900', 'ring-2', 'ring-black/10', 'shadow-sm');
      if (btn) {
        btn.innerHTML = '<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-600"></i>';
        btn.title = "Fijar y guardar valor";
      }
      initLucideIcons();
      input.focus();
      input.select();
    } else {
      // Bloquear y fijar valor nuevamente
      input.setAttribute('readonly', 'true');
      input.classList.remove('bg-white', 'border-black', 'text-neutral-900', 'ring-2', 'ring-black/10', 'shadow-sm');
      input.classList.add('bg-neutral-100', 'border-neutral-200', 'text-neutral-700', 'cursor-default', 'select-none');
      if (btn) {
        btn.innerHTML = '<i data-lucide="pencil" class="w-3 h-3 text-neutral-400 hover:text-black"></i>';
        btn.title = "Editar valor";
      }
      initLucideIcons();

      const field = type === 'rec' ? 'recibo_hs' : 'sin_recibo_hs';
      handleAdminUpdateCierre(key, field, input.value);
    }
  }

  function saveAllHorasAdmin() {
    // Bloquear cualquier input base que haya quedado abierto
    document.querySelectorAll('[id^="input-rec-"], [id^="input-sinrec-"]').forEach(inp => {
      if (!inp.hasAttribute('readonly')) {
        inp.setAttribute('readonly', 'true');
        inp.classList.remove('bg-white', 'border-black', 'text-neutral-900', 'ring-2', 'ring-black/10', 'shadow-sm');
        inp.classList.add('bg-neutral-100', 'border-neutral-200', 'text-neutral-700', 'cursor-default', 'select-none');
      }
    });
    document.querySelectorAll('[id^="btn-rec-"], [id^="btn-sinrec-"]').forEach(btn => {
      btn.innerHTML = '<i data-lucide="pencil" class="w-3 h-3 text-neutral-400 hover:text-black"></i>';
      btn.title = "Editar valor";
    });

    // Guardar también cualquier texto de observaciones del DOM
    document.querySelectorAll('[id^="admin-obs-"]').forEach(ta => {
      const k = ta.id.replace('admin-obs-', '');
      if (state.cierres[k]) {
        state.cierres[k].observaciones = ta.value.trim();
        state.cierres[k].detalle_cobertura = ta.value.trim();
      }
    });

    initLucideIcons();

    localStorage.setItem('nazaria_cierres_v2', JSON.stringify(state.cierres));
    updateAdminKPIs();
    showToast('Planilla de horas consolidada y guardada.', 'success');
  }

  // --- MODAL DE OBSERVACIONES Y REGISTRO AMPLIO DE DÍAS ---
  function openObservacionesModal(idOrKey, colabName, context) {
    const modal = document.getElementById('modal-observaciones');
    if (!modal) return;

    let key = '';
    let currentText = '';

    if (context === 'store') {
      key = `${state.currentPeriod}_${idOrKey}`;
      const input = document.getElementById(`dc-${idOrKey}`);
      currentText = input ? input.value : (state.cierres[key]?.observaciones || '');
    } else {
      key = idOrKey;
      const input = document.getElementById(`admin-obs-${key}`);
      currentText = input ? input.value : (state.cierres[key]?.observaciones || '');
    }

    state.activeObsTarget = { idOrKey, colabName, context, key };

    const nameEl = document.getElementById('modal-obs-colab-name');
    const subEl = document.getElementById('modal-obs-subtitle');
    const ta = document.getElementById('modal-obs-textarea');

    if (nameEl) nameEl.textContent = `${colabName} · Registro de Días y Novedades`;
    if (subEl) subEl.textContent = `Período: ${formatPeriodLabel(state.currentPeriod)} · Agregá notas, coberturas y días`;
    if (ta) ta.value = currentText;

    modal.classList.remove('hidden');
    initLucideIcons();
    if (ta) {
      setTimeout(() => ta.focus(), 60);
    }
  }

  function closeObservacionesModal() {
    const modal = document.getElementById('modal-observaciones');
    if (modal) modal.classList.add('hidden');
    state.activeObsTarget = null;
  }

  function appendObsTag(tag) {
    const ta = document.getElementById('modal-obs-textarea');
    if (!ta) return;

    const d = new Date();
    const dStr = String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0');

    let template = '';
    switch (tag) {
      case 'Guardia':
        template = `• ${dStr}: Guardia turno (6 hs)`;
        break;
      case 'Estudio':
        template = `• ${dStr}: Día de estudio`;
        break;
      case 'Cobertura':
        template = `• ${dStr}: Cubre turno a ...`;
        break;
      case 'Vacaciones':
        template = `• ${dStr} al ...: Vacaciones pendientes`;
        break;
      case 'Franco':
        template = `• ${dStr}: Franco compensatorio`;
        break;
      default:
        template = `• ${dStr}: `;
    }

    const current = ta.value;
    if (current && !current.endsWith('\n')) {
      ta.value = current + '\n' + template;
    } else {
      ta.value = current + template;
    }
    ta.focus();
  }

  function saveObservacionesModal() {
    if (!state.activeObsTarget) {
      closeObservacionesModal();
      return;
    }
    const { idOrKey, context, key } = state.activeObsTarget;
    const ta = document.getElementById('modal-obs-textarea');
    const newText = ta ? ta.value.trim() : '';

    if (!state.cierres[key]) {
      state.cierres[key] = {
        horas_base: 88,
        recibo_hs: 0,
        sin_recibo_hs: 88,
        adicional_hs: 0,
        feriados_hs: 0,
        extras_hs: 0,
        vacaciones_hs: 0,
        observaciones: '',
        adicionales_hs: 0,
        detalle_cobertura: ''
      };
    }

    state.cierres[key].observaciones = newText;
    state.cierres[key].detalle_cobertura = newText;
    localStorage.setItem('nazaria_cierres_v2', JSON.stringify(state.cierres));

    if (context === 'store') {
      const el = document.getElementById(`dc-${idOrKey}`);
      if (el) el.value = newText;
    } else {
      const el = document.getElementById(`admin-obs-${key}`);
      if (el) el.value = newText;
    }

    closeObservacionesModal();
    showToast('Observaciones y días guardados correctamente.', 'success');
  }

  // --- ADMIN 2: HORARIOS Y BITÁCORA DE TURNOS POR SUCURSAL ---
  function switchAdminHorariosStore(storeCode) {
    state.adminSelectedHorariosStore = storeCode;

    const btnTom = document.getElementById('admin-hor-btn-tom');
    const btnMasch = document.getElementById('admin-hor-btn-masch');
    if (btnTom && btnMasch) {
      if (storeCode === 'TOM') {
        btnTom.className = "px-4 py-2 rounded-lg text-xs font-bold bg-black text-white shadow-sm transition flex items-center gap-2";
        btnMasch.className = "px-4 py-2 rounded-lg text-xs font-bold text-neutral-600 hover:text-black transition flex items-center gap-2";
      } else {
        btnMasch.className = "px-4 py-2 rounded-lg text-xs font-bold bg-black text-white shadow-sm transition flex items-center gap-2";
        btnTom.className = "px-4 py-2 rounded-lg text-xs font-bold text-neutral-600 hover:text-black transition flex items-center gap-2";
      }
    }

    const titleEl = document.getElementById('admin-hor-title');
    if (titleEl) {
      titleEl.innerHTML = `Grilla de Turnos Semanales · ${storeCode === 'TOM' ? 'TOM' : 'Maschwitz'}
        <span id="admin-hor-updated-badge" class="text-[10px] font-medium bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded">Sincronizado en la nube</span>`;
    }

    populateAdminModificacionSelects(storeCode);
    renderAdminHorarios();
    renderAdminModificaciones();
    renderAdminFechasEspeciales();
    initLucideIcons();
  }

  function populateAdminModificacionSelects(storeCode) {
    const selOrigen = document.getElementById('mod-colab-origen');
    const selReemplazo = document.getElementById('mod-colab-reemplazo');
    if (!selOrigen || !selReemplazo) return;

    const opts = ['<option value="">-- Seleccionar colaboradora --</option>'];
    const localColabs = state.colaboradoras.filter(c => c.codigo_sucursal === storeCode);
    opts.push(`<optgroup label="Colaboradoras de ${storeCode}">`);
    localColabs.forEach(c => {
      opts.push(`<option value="${c.id}">${c.alias || c.nombre_completo} (${c.nombre_completo})</option>`);
    });
    opts.push(`</optgroup>`);

    const otherColabs = state.colaboradoras.filter(c => c.codigo_sucursal !== storeCode);
    if (otherColabs.length > 0) {
      opts.push(`<optgroup label="Colaboradoras de otra sucursal">`);
      otherColabs.forEach(c => {
        opts.push(`<option value="${c.id}">${c.alias || c.nombre_completo} (${c.codigo_sucursal})</option>`);
      });
      opts.push(`</optgroup>`);
    }

    const html = opts.join('');
    selOrigen.innerHTML = html;
    selReemplazo.innerHTML = html;
  }

  function renderAdminHorarios() {
    const storeCode = state.adminSelectedHorariosStore || 'TOM';
    const h = state.horarios[storeCode] || { manana: {}, tarde: {} };

    const days = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];
    days.forEach(d => {
      const elMan = document.getElementById(`admin-h-man-${d}`);
      const elTar = document.getElementById(`admin-h-tar-${d}`);
      if (elMan) elMan.value = h.manana[d] || '';
      if (elTar) elTar.value = h.tarde[d] || '';
    });

    const notasEl = document.getElementById('admin-hor-notas');
    if (notasEl) {
      notasEl.value = state.horarios_notas[storeCode] || '';
    }

    populateAdminModificacionSelects(storeCode);
    renderAdminModificaciones();
    renderAdminFechasEspeciales();
    renderAdminHorariosGridInputs();
    renderAdminEsquemasTable(storeCode);
  }

  function renderAdminHorariosGridInputs() {
    const isEdit = !!state.isAdminGridEditable;
    const days = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];
    days.forEach(d => {
      const elMan = document.getElementById(`admin-h-man-${d}`);
      const elTar = document.getElementById(`admin-h-tar-${d}`);
      [elMan, elTar].forEach(el => {
        if (!el) return;
        if (isEdit) {
          el.removeAttribute('readonly');
          el.className = "w-full text-center text-xs font-semibold p-1.5 border border-black rounded uppercase bg-white text-neutral-900 shadow-sm ring-2 ring-black/10 transition";
        } else {
          el.setAttribute('readonly', 'true');
          el.className = "w-full text-center text-xs font-semibold p-1.5 border border-neutral-200 rounded uppercase bg-neutral-100 text-neutral-700 cursor-default select-none transition";
        }
      });
    });

    const btn = document.getElementById('btn-toggle-admin-grid-edit');
    if (btn) {
      if (isEdit) {
        btn.className = "px-3.5 py-2 rounded-lg border border-black text-xs font-bold bg-black text-white flex items-center gap-1.5 transition cursor-pointer";
        btn.innerHTML = `<i data-lucide="lock" class="w-3.5 h-3.5 text-[#E6D5C3]"></i> <span id="btn-toggle-admin-grid-edit-text">Bloquear Grilla</span>`;
      } else {
        btn.className = "px-3.5 py-2 rounded-lg border border-neutral-300 text-xs font-bold bg-[#FAF9F6] text-neutral-700 hover:bg-neutral-100 flex items-center gap-1.5 transition cursor-pointer";
        btn.innerHTML = `<i data-lucide="pencil" class="w-3.5 h-3.5 text-neutral-500"></i> <span id="btn-toggle-admin-grid-edit-text">Modificar Grilla</span>`;
      }
    }
    initLucideIcons();
  }

  function toggleAdminGridEdit() {
    state.isAdminGridEditable = !state.isAdminGridEditable;
    renderAdminHorariosGridInputs();
    if (state.isAdminGridEditable) {
      showToast('Modo edición activado: podés modificar turnos en la grilla semanal.', 'info');
    }
  }

  // --- SECCIÓN: ESQUEMAS CONTRACTUALES Y HORAS BASE POR COLABORADORA ---
  function renderAdminEsquemasTable(storeCode) {
    const tbody = document.getElementById('tbody-admin-esquemas');
    if (!tbody) return;
    tbody.innerHTML = '';

    let list = [];
    if (storeCode === 'MASCHWITZ') {
      list = state.colaboradoras.filter(c => c.codigo_sucursal === 'MASCHWITZ');
      list.push(getMartuMasch());
    } else {
      list = state.colaboradoras.filter(c => c.codigo_sucursal === 'TOM');
    }

    list.forEach(c => {
      const isMaschCov = c.id === 'c-martu_masch';
      const sucursal = isMaschCov ? 'MASCHWITZ' : (c.codigo_sucursal || storeCode);
      const displayName = getColabShortName(c.id, c.nombre_completo);
      const esquema = c.esquema_jornada || 'A definir';
      const hb = Number(c.horas_base_mes ?? 88);
      const rec = Number(c.recibo_hs_base ?? 0);
      const sinRec = Math.max(0, hb - rec);

      const tr = document.createElement('tr');
      tr.className = "hover:bg-neutral-50/50 transition border-b border-neutral-100";
      tr.innerHTML = `
        <td class="py-2.5">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold ${sucursal === 'TOM' ? 'bg-[#E6D5C3] text-neutral-900' : 'bg-purple-100 text-purple-900'}">${sucursal}</span>
        </td>
        <td class="font-bold text-xs text-neutral-900 py-2.5">
          <div>${displayName}</div>
          <div class="text-[10px] text-neutral-400 font-normal">${c.categoria || 'Vendedora'}</div>
        </td>
        <td class="py-2.5">
          <div class="font-bold text-xs text-neutral-900">${esquema}</div>
        </td>
        <td class="text-center font-mono font-bold text-xs py-2.5 text-neutral-900">
          ${hb} hs
        </td>
        <td class="text-center font-mono font-bold text-xs py-2.5 text-neutral-800">
          ${rec} hs
        </td>
        <td class="text-center font-mono font-bold text-xs py-2.5 text-neutral-600">
          ${sinRec} hs
        </td>
        <td class="text-center py-2.5">
          <button type="button" onclick="window.app.openEditEsquemaModal('${c.id}')" class="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-black transition cursor-pointer flex items-center justify-center mx-auto gap-1 text-xs font-bold" title="Editar esquema contractual y horas base">
            <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
            <span class="hidden sm:inline">Editar</span>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    initLucideIcons();
  }

  // --- MODAL: EDICIÓN DE ESQUEMA CONTRACTUAL ---
  function openEditEsquemaModal(colabId) {
    const modal = document.getElementById('modal-edit-esquema');
    if (!modal) return;

    const isMaschCov = colabId === 'c-martu_masch';
    const colab = isMaschCov ? getMartuMasch() : state.colaboradoras.find(c => c.id === colabId);
    if (!colab) return;

    const displayName = getColabShortName(colabId, colab.nombre_completo);
    const store = isMaschCov ? 'MASCHWITZ' : (colab.codigo_sucursal || 'TOM');

    document.getElementById('edit-esquema-colab-id').value = colabId;
    document.getElementById('edit-esquema-title').textContent = `Esquema de ${displayName}`;
    
    const badge = document.getElementById('edit-esquema-store-badge');
    if (badge) {
      badge.textContent = store;
      badge.className = `px-2 py-0.5 rounded text-[10px] font-bold ${store === 'TOM' ? 'bg-[#E6D5C3] text-neutral-900' : 'bg-purple-100 text-purple-900'}`;
    }

    document.getElementById('edit-esquema-jornada').value = colab.esquema_jornada || '';
    document.getElementById('edit-esquema-horas-base').value = colab.horas_base_mes ?? 88;
    document.getElementById('edit-esquema-recibo-hs').value = colab.recibo_hs_base ?? 0;

    recalcModalEsquemaDiff();

    modal.classList.remove('hidden');
    initLucideIcons();
  }

  function recalcModalEsquemaDiff() {
    const hb = Number(document.getElementById('edit-esquema-horas-base')?.value) || 0;
    const rec = Number(document.getElementById('edit-esquema-recibo-hs')?.value) || 0;
    const sinRec = Math.max(0, hb - rec);
    const diffEl = document.getElementById('edit-esquema-sin-recibo-preview');
    if (diffEl) diffEl.textContent = `${sinRec} hs`;
  }

  function closeEditEsquemaModal() {
    const modal = document.getElementById('modal-edit-esquema');
    if (modal) modal.classList.add('hidden');
  }

  async function handleSaveEsquema(e) {
    if (e) e.preventDefault();
    const colabId = document.getElementById('edit-esquema-colab-id')?.value;
    const nuevaJornada = document.getElementById('edit-esquema-jornada')?.value.trim();
    const nuevasHorasBase = Number(document.getElementById('edit-esquema-horas-base')?.value) || 0;
    const nuevoReciboHs = Number(document.getElementById('edit-esquema-recibo-hs')?.value) || 0;

    if (!colabId) return;

    if (colabId === 'c-martu_masch') {
      const mm = getMartuMasch();
      mm.esquema_jornada = nuevaJornada;
      mm.horas_base_mes = nuevasHorasBase;
      mm.recibo_hs_base = nuevoReciboHs;
      state.martuMasch = mm;
      localStorage.setItem('nazaria_martu_masch_v2', JSON.stringify(mm));
    } else {
      const colab = state.colaboradoras.find(c => c.id === colabId);
      if (colab) {
        colab.esquema_jornada = nuevaJornada;
        colab.horas_base_mes = nuevasHorasBase;
        colab.recibo_hs_base = nuevoReciboHs;
        localStorage.setItem('nazaria_colaboradoras_v2', JSON.stringify(state.colaboradoras));
      }
    }

    // Actualizar también el cierre actual del período para impactar en las planillas inmediatamente
    const key = `${state.currentPeriod}_${colabId}`;
    if (!state.cierres[key]) {
      state.cierres[key] = {
        horas_base: nuevasHorasBase,
        recibo_hs: nuevoReciboHs,
        sin_recibo_hs: Math.max(0, nuevasHorasBase - nuevoReciboHs),
        adicional_hs: 0,
        feriados_hs: 0,
        extras_hs: 0,
        vacaciones_hs: 0,
        observaciones: '',
        adicionales_hs: 0,
        detalle_cobertura: ''
      };
    } else {
      state.cierres[key].horas_base = nuevasHorasBase;
      state.cierres[key].recibo_hs = nuevoReciboHs;
      state.cierres[key].sin_recibo_hs = Math.max(0, nuevasHorasBase - nuevoReciboHs);
    }
    localStorage.setItem('nazaria_cierres_v2', JSON.stringify(state.cierres));

    // Si Supabase está conectado, actualizar colaboradora
    if (state.supabaseClient && state.isSupabaseConnected && colabId !== 'c-martu_masch') {
      try {
        await state.supabaseClient
          .from('colaboradoras')
          .update({
            esquema_jornada: nuevaJornada,
            horas_base_mes: nuevasHorasBase,
            recibo_hs_base: nuevoReciboHs
          })
          .eq('id', colabId);
      } catch (err) {
        console.warn('Error saving esquema to Supabase:', err);
      }
    }

    closeEditEsquemaModal();

    // Re-renderizar vistas activas
    if (state.activeAdminTab === 'consolidado') renderAdminConsolidado();
    if (state.activeAdminTab === 'horarios') {
      renderAdminHorarios();
      renderAdminEsquemasTable(state.adminSelectedHorariosStore);
    }
    if (state.currentRole && state.currentRole !== 'ADMIN') renderStoreHoras();
    updateAdminKPIs();

    showToast('Esquema contractual y horas base guardados con éxito.', 'success');
  }

  // --- MODAL Y TOOLTIPS FLOTANTES DE AYUDA DE COLUMNAS (VACACIONES & ADICIONAL) ---
  function showHoverTooltip(e, type) {
    const tooltip = document.getElementById('floating-info-tooltip');
    if (!tooltip) return;

    if (type === 'vacaciones') {
      tooltip.innerHTML = `
        <div class="flex items-center gap-1.5 font-bold text-emerald-900 mb-1 text-xs">
          <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
          <span>¿Cómo cargar las Horas de Vacaciones?</span>
        </div>
        <p class="text-[11px] text-neutral-700 leading-snug">
          Se cargan <strong>únicamente las horas de los turnos en que debió trabajar y no vino</strong>:
        </p>
        <div class="my-1.5 bg-emerald-50 border border-emerald-300 rounded p-1.5 font-mono text-[10px] font-bold text-emerald-950 text-center">
          Turnos no trabajados × Horas del turno
        </div>
        <ul class="text-[10px] text-neutral-600 space-y-0.5 mb-1.5">
          <li>• <strong>5 días de 6 hs (1 sem):</strong> Cargar <strong>30 hs</strong>.</li>
          <li>• <strong>4 días de 5,5 hs (1 sem):</strong> Cargar <strong>22 hs</strong>.</li>
        </ul>
        <div class="text-[9px] text-emerald-800 border-t border-neutral-200 pt-1 font-semibold">
          💡 Restan de la Base (se pagan aparte por ley). Clic para abrir guía.
        </div>
      `;
    } else if (type === 'adicional') {
      tooltip.innerHTML = `
        <div class="flex items-center gap-1.5 font-bold text-amber-900 mb-1 text-xs">
          <span class="w-2 h-2 rounded-full bg-amber-600"></span>
          <span>Balance de Adicional (+ / -)</span>
        </div>
        <p class="text-[11px] text-neutral-700 leading-snug mb-1">
          Ajuste neto de horas habituales en el mes:
        </p>
        <div class="space-y-1 text-[10px]">
          <div class="bg-emerald-50 border border-emerald-200 rounded p-1 text-emerald-950">
            <strong>➕ Positivo:</strong> Días extras o coberturas de compañeras.
          </div>
          <div class="bg-rose-50 border border-rose-200 rounded p-1 text-rose-950">
            <strong>➖ Negativo:</strong> Llegadas tarde, retiros anticipados o ausencias.
          </div>
        </div>
        <div class="text-[9px] text-amber-900 border-t border-neutral-200 pt-1 mt-1.5 font-semibold">
          💡 Aclarar motivo en Observaciones. Clic para abrir guía.
        </div>
      `;
    }

    tooltip.classList.remove('hidden');

    const targetEl = (e && (e.currentTarget || e.target)) || null;
    if (!targetEl || !targetEl.getBoundingClientRect) return;
    const rect = targetEl.getBoundingClientRect();
    const tooltipWidth = 320;
    let left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
    if (left < 10) left = 10;
    if (left + tooltipWidth > window.innerWidth - 10) {
      left = window.innerWidth - tooltipWidth - 10;
    }
    let top = rect.bottom + 6;
    if (top + 220 > window.innerHeight) {
      top = Math.max(10, rect.top - 210);
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.style.width = `${tooltipWidth}px`;
  }

  function hideHoverTooltip() {
    const tooltip = document.getElementById('floating-info-tooltip');
    if (tooltip) tooltip.classList.add('hidden');
  }

  function openInfoModal(type) {
    hideHoverTooltip();
    const modal = document.getElementById('modal-info-columna');
    if (!modal) return;

    const iconContainer = document.getElementById('modal-info-icon-container');
    const titleEl = document.getElementById('modal-info-title');
    const subtitleEl = document.getElementById('modal-info-subtitle');
    const bodyEl = document.getElementById('modal-info-body');

    if (type === 'vacaciones') {
      if (iconContainer) {
        iconContainer.className = "w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold";
        iconContainer.innerHTML = '<i data-lucide="palmtree" class="w-4 h-4 text-emerald-800"></i>';
      }
      if (titleEl) titleEl.textContent = "¿Cómo cargar las Horas de Vacaciones?";
      if (subtitleEl) subtitleEl.textContent = "Cómputo en horas no trabajadas y descuento de la Base";
      if (bodyEl) {
        bodyEl.innerHTML = `
          <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-emerald-950 flex flex-col gap-2.5">
            <div class="font-bold flex items-center gap-1.5 text-emerald-900 text-xs">
              <i data-lucide="info" class="w-4 h-4 text-emerald-700"></i>
              <span>Criterio de Carga de Vacaciones (LCT 20.744)</span>
            </div>
            <p class="leading-relaxed">
              Las vacaciones por ley se otorgan en días corridos (semana completa), pero en esta planilla <strong>solo se cargan las horas de los turnos en los que la colaboradora debió venir a trabajar y no vino</strong>.
            </p>
            <div class="bg-white/90 p-2.5 rounded-lg border border-emerald-300 font-mono text-center font-bold text-emerald-900 text-xs shadow-2xs">
              Turnos que trabajaría en la semana × Horas del turno
            </div>
            <ul class="space-y-1.5 text-[11px] leading-relaxed mt-1">
              <li class="flex items-start gap-1.5">
                <span class="font-bold text-emerald-800">•</span>
                <span><strong>Ejemplo 1 (5 días de 6 hs):</strong> Si se toma 1 semana completa (7 días corridos), le correspondían 5 turnos de trabajo: <strong>5 × 6 hs = 30 hs</strong>. <em>(Se cargan 30 hs; los otros 2 días eran sus francos habituales)</em>.</span>
              </li>
              <li class="flex items-start gap-1.5">
                <span class="font-bold text-emerald-800">•</span>
                <span><strong>Ejemplo 2 (4 días de 5,5 hs):</strong> Si se toma 1 semana completa, le correspondían 4 turnos: <strong>4 × 5,5 hs = 22 hs</strong>.</span>
              </li>
            </ul>
            <div class="text-[11px] text-emerald-900 bg-white/80 p-2 rounded border border-emerald-200 mt-1">
              <strong>Nota sobre la Base:</strong> Estas horas se descuentan automáticamente de la columna <strong>Base</strong> porque no se pagan como horas normales de trabajo, sino que se liquidan por separado en el recibo de sueldo como <em>Plus Vacacional</em>.
            </div>
          </div>
        `;
      }
    } else if (type === 'adicional') {
      if (iconContainer) {
        iconContainer.className = "w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold";
        iconContainer.innerHTML = '<i data-lucide="scale" class="w-4 h-4 text-amber-800"></i>';
      }
      if (titleEl) titleEl.textContent = "¿Cómo usar la columna Adicional (+ / -)?";
      if (subtitleEl) subtitleEl.textContent = "Balance mensual de ajuste de jornada y movimientos";
      if (bodyEl) {
        bodyEl.innerHTML = `
          <div class="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 text-amber-950 flex flex-col gap-2.5">
            <div class="font-bold flex items-center gap-1.5 text-amber-900 text-xs">
              <i data-lucide="info" class="w-4 h-4 text-amber-700"></i>
              <span>Balance Mensual de Ajuste de Jornada</span>
            </div>
            <p class="leading-relaxed">
              Es el balance mensual para sumar o restar horas habituales no contempladas en la jornada base:
            </p>
            <div class="flex flex-col gap-2 mt-1">
              <div class="bg-white/90 p-2.5 rounded-lg border border-emerald-200 text-emerald-950 text-[11px] leading-relaxed">
                <div class="font-bold text-emerald-800 flex items-center gap-1 mb-1">
                  <span>➕ Valores positivos (+)</span>
                </div>
                <div>• <strong>Días extras trabajados:</strong> Cobertura de francos o turnos extra de compañeras.</div>
                <div>• <strong>Coberturas inter-sucursales:</strong> Si vino una colaboradora a prestar apoyo desde otra tienda.</div>
              </div>
              <div class="bg-white/90 p-2.5 rounded-lg border border-rose-200 text-rose-950 text-[11px] leading-relaxed">
                <div class="font-bold text-rose-800 flex items-center gap-1 mb-1">
                  <span>➖ Valores negativos (-)</span>
                </div>
                <div>• <strong>Descuentos de horas:</strong> Llegadas tarde, retiros anticipados o ausencias no justificadas.</div>
                <div>• <strong>Pases a otra sucursal:</strong> Si una colaboradora de esta tienda fue a trabajar a la otra sucursal (se restan acá para que la otra tienda las sume).</div>
              </div>
            </div>
            <div class="text-[11px] text-amber-950 bg-white/80 p-2 rounded border border-amber-200 mt-1">
              <strong>Importante:</strong> Siempre detallar en la columna <strong>Observaciones</strong> el motivo y fecha (ej: <em>"14/10 faltó sin aviso -5.5hs"</em> o <em>"20/10 cubrió en Maschwitz -6hs"</em>).
            </div>
          </div>
        `;
      }
    }

    modal.classList.remove('hidden');
    initLucideIcons();
  }

  function closeInfoModal() {
    const modal = document.getElementById('modal-info-columna');
    if (modal) modal.classList.add('hidden');
  }

  async function saveAdminHorarios() {
    const storeCode = state.adminSelectedHorariosStore || 'TOM';
    const days = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];
    const manana = {};
    const tarde = {};

    days.forEach(d => {
      manana[d] = document.getElementById(`admin-h-man-${d}`)?.value.trim().toUpperCase() || '';
      tarde[d] = document.getElementById(`admin-h-tar-${d}`)?.value.trim().toUpperCase() || '';
    });

    const notas = document.getElementById('admin-hor-notas')?.value.trim() || '';

    state.horarios[storeCode] = { manana, tarde };
    state.horarios_notas[storeCode] = notas;

    localStorage.setItem('nazaria_horarios_v2', JSON.stringify(state.horarios));
    localStorage.setItem('nazaria_horarios_notas_v2', JSON.stringify(state.horarios_notas));

    state.isAdminGridEditable = false;
    renderAdminHorariosGridInputs();

    if (state.supabaseClient && state.isSupabaseConnected) {
      try {
        await state.supabaseClient
          .from('horarios_sucursal')
          .upsert({
            sucursal_codigo: storeCode,
            periodo: state.currentPeriod,
            manana: manana,
            tarde: tarde,
            notas: notas,
            actualizado_por: 'Juan (Admin)',
            actualizado_en: new Date().toISOString()
          }, { onConflict: 'sucursal_codigo,periodo' });
      } catch (err) {
        console.warn('Error saving admin horarios to Supabase:', err);
      }
    }

    showToast(`Horarios y directivas de ${storeCode} guardados y fijados.`, 'success');
  }

  function toggleModificacionForm(show) {
    const card = document.getElementById('card-form-modificacion');
    if (card) {
      card.classList.toggle('hidden', !show);
    }
    if (show) {
      const dateEl = document.getElementById('mod-fecha');
      if (dateEl && !dateEl.value) {
        dateEl.value = new Date().toISOString().split('T')[0];
      }
    }
  }

  async function handleSaveModificacion(e) {
    e.preventDefault();
    const fecha = document.getElementById('mod-fecha')?.value;
    const turno = document.getElementById('mod-turno')?.value;
    const origId = document.getElementById('mod-colab-origen')?.value;
    const repId = document.getElementById('mod-colab-reemplazo')?.value;
    const motivo = document.getElementById('mod-motivo')?.value.trim();

    if (!fecha || !turno || !origId || !repId || !motivo) {
      showToast('Por favor completá todos los campos obligatorios.', 'error');
      return;
    }

    const colabOrig = state.colaboradoras.find(c => c.id === origId);
    const colabRep = state.colaboradoras.find(c => c.id === repId);
    const storeCode = state.adminSelectedHorariosStore || 'TOM';

    const newRecord = {
      id: 'mod-' + Date.now(),
      sucursal: storeCode,
      periodo: state.currentPeriod,
      fecha: fecha,
      turno: turno,
      colaboradora_origen_id: origId,
      colaboradora_origen: colabOrig ? (colabOrig.alias || colabOrig.nombre_completo) : 'Colaboradora',
      colaboradora_reemplazo_id: repId,
      colaboradora_reemplazo: colabRep ? (colabRep.alias || colabRep.nombre_completo) : 'Reemplazo',
      motivo: motivo,
      creado_por: 'Juan (Admin)',
      creado_en: new Date().toISOString()
    };

    state.horarios_modificaciones.unshift(newRecord);
    localStorage.setItem('nazaria_horarios_modificaciones_v2', JSON.stringify(state.horarios_modificaciones));

    if (state.supabaseClient && state.isSupabaseConnected) {
      try {
        await state.supabaseClient
          .from('horarios_modificaciones')
          .insert({
            sucursal_codigo: storeCode,
            periodo: state.currentPeriod,
            fecha: fecha,
            turno: turno,
            colaboradora_origen: newRecord.colaboradora_origen,
            colaboradora_reemplazo: newRecord.colaboradora_reemplazo,
            motivo: motivo,
            creado_por: 'Juan (Admin)'
          });
      } catch (err) {
        console.warn('Error saving admin modificacion to Supabase:', err);
      }
    }

    document.getElementById('mod-motivo').value = '';
    toggleModificacionForm(false);
    renderAdminModificaciones();
    renderStoreModificaciones();
    showToast('Cambio de turno registrado en la bitácora.', 'success');
  }

  async function handleDeleteModificacion(id) {
    const item = state.horarios_modificaciones.find(m => m.id === id);
    if (!item) return;

    state.horarios_modificaciones = state.horarios_modificaciones.filter(m => m.id !== id);
    localStorage.setItem('nazaria_horarios_modificaciones_v2', JSON.stringify(state.horarios_modificaciones));

    if (state.supabaseClient && state.isSupabaseConnected) {
      try {
        await state.supabaseClient
          .from('horarios_modificaciones')
          .delete()
          .eq('id', id);
      } catch (err) {
        console.warn('Error deleting modificacion from Supabase:', err);
      }
    }

    renderAdminModificaciones();
    renderStoreModificaciones();
    setUndoableDelete('horario_modificacion', item, 'Modificación eliminada.');
  }

  function renderAdminModificaciones() {
    const tbody = document.getElementById('tbody-admin-modificaciones');
    if (!tbody) return;
    tbody.innerHTML = '';
    const storeCode = state.adminSelectedHorariosStore || 'TOM';

    const list = state.horarios_modificaciones.filter(m => m.sucursal === storeCode || m.sucursal_codigo === storeCode);
    list.sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''));

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-neutral-400 text-xs">No hay modificaciones ni cambios de turno asentados para ${storeCode}.</td></tr>`;
      return;
    }

    list.forEach(m => {
      const colabOrig = state.colaboradoras.find(c => c.id === m.colaboradora_origen_id);
      const colabRep = state.colaboradoras.find(c => c.id === m.colaboradora_reemplazo_id);
      const origName = colabOrig ? (colabOrig.alias || colabOrig.nombre_completo) : (m.colaboradora_origen || '-');
      const repName = colabRep ? (colabRep.alias || colabRep.nombre_completo) : (m.colaboradora_reemplazo || '-');

      const turnoBadge = m.turno === 'Mañana' 
        ? 'bg-amber-100 text-amber-900 border border-amber-200'
        : m.turno === 'Tarde'
        ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
        : 'bg-neutral-100 text-neutral-800 border border-neutral-200';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="font-mono text-xs text-neutral-700">${formatDateShort(m.fecha)}</td>
        <td><span class="px-2 py-0.5 rounded text-[10px] font-bold ${turnoBadge}">${m.turno}</span></td>
        <td class="font-bold text-xs text-neutral-900">${origName}</td>
        <td class="font-bold text-xs text-neutral-900 flex items-center gap-1.5 pt-3">
          <span class="text-neutral-400">→</span>
          <span class="bg-[#E6D5C3]/40 border border-[#E6D5C3] px-2 py-0.5 rounded text-neutral-900">${repName}</span>
        </td>
        <td class="text-xs text-neutral-700 max-w-[240px] truncate" title="${m.motivo || ''}">${m.motivo || '-'}</td>
        <td><span class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 text-neutral-700">${m.creado_por || 'Encargada'}</span></td>
        <td class="text-right">
          <button onclick="window.app.handleDeleteModificacion('${m.id}')" class="text-neutral-400 hover:text-red-600 p-1" title="Eliminar registro">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    initLucideIcons();
  }

  function renderAdminFechasEspeciales() {
    const tbody = document.getElementById('tbody-admin-fechas-especiales');
    if (!tbody) return;
    tbody.innerHTML = '';
    const storeCode = state.adminSelectedHorariosStore || 'TOM';

    const list = state.fechas_especiales.filter(f => f.sucursal === storeCode || f.sucursal_codigo === storeCode);
    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-neutral-400 text-xs">No hay fechas especiales cargadas para ${storeCode}.</td></tr>`;
      return;
    }

    list.forEach(f => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="font-bold text-xs text-neutral-900">${f.fecha_evento}</td>
        <td class="font-mono text-xs uppercase">${f.manana}</td>
        <td class="font-mono text-xs uppercase">${f.tarde}</td>
        <td class="text-xs text-neutral-600">${f.observacion || '-'}</td>
        <td class="text-right">
          <button onclick="window.app.handleDeleteFechaEspecial('${f.id}')" class="text-neutral-400 hover:text-red-600 p-1" title="Eliminar">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    initLucideIcons();
  }

  // --- ADMIN 3: VACACIONES LCT (Sábana de 7 columnas sin scroll horizontal) ---
  function renderAdminVacaciones() {
    const tbody = document.getElementById('tbody-admin-vacaciones');
    tbody.innerHTML = '';
    const anioFiscal = parseInt(state.currentPeriod.split('-')[0]) || 2026;

    state.colaboradoras.forEach(c => {
      const calc = calcularVacacionesLCT(c, anioFiscal);
      const vacNovedades = state.novedades.filter(n => n.colaboradora_id === c.id && n.tipo === 'Vacaciones');
      vacNovedades.sort((a, b) => (a.fecha_inicio || '').localeCompare(b.fecha_inicio || ''));

      const diasTomados = vacNovedades.reduce((sum, n) => sum + (Number(n.dias_computados) || 0), 0);
      const saldo = Math.max(0, calc.diasLey - diasTomados);

      let tramosHtml = '<div class="flex flex-wrap gap-1">';
      if (vacNovedades.length === 0) {
        tramosHtml += '<span class="text-neutral-400 text-xs italic">Sin tramos</span>';
      } else {
        vacNovedades.forEach(n => {
          tramosHtml += `<span class="inline-block bg-[#FAF9F6] border border-neutral-200 px-2 py-0.5 rounded text-[11px] font-medium text-neutral-700">${formatDateShort(n.fecha_inicio)} al ${formatDateShort(n.fecha_fin)} (${n.dias_computados}d)</span>`;
        });
      }
      tramosHtml += '</div>';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="font-bold text-xs text-neutral-900 whitespace-nowrap">
          <div class="flex items-center gap-1.5">
            <span class="px-1.5 py-0.5 rounded text-[10px] font-bold ${c.codigo_sucursal === 'TOM' ? 'bg-[#E6D5C3] text-neutral-900' : 'bg-neutral-800 text-white'}">${c.codigo_sucursal}</span>
            <span>${c.nombre_completo}</span>
          </div>
        </td>
        <td>
          <div class="font-mono text-xs font-semibold text-neutral-800">${calc.aniosAntiguedad} años al 31/12</div>
          <div class="text-[10px] text-neutral-500">Ingreso: ${formatDateShort(c.fecha_ingreso)}</div>
          ${c.fecha_antiguedad_reconocida ? `<div class="text-[10px] text-amber-900 font-bold">⭐ Reconocida: ${formatDateShort(c.fecha_antiguedad_reconocida)}</div>` : ''}
        </td>
        <td class="font-mono font-bold text-xs text-center"><span class="bg-[#E6D5C3]/40 border border-[#E6D5C3] px-2.5 py-0.5 rounded text-neutral-900">${calc.diasLey} días</span></td>
        <td class="font-mono font-bold text-xs text-center text-amber-800">${diasTomados} días</td>
        <td class="font-mono font-bold text-sm text-center ${saldo === 0 ? 'text-neutral-400' : 'text-emerald-700'}">
          ${saldo} días
        </td>
        <td class="whitespace-normal leading-relaxed">${tramosHtml}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // --- ADMIN 3: RETIROS & TEMPORADA (Filtrado por Período y Ordenado por Fecha) ---
  function renderAdminRetiros() {
    const tbody = document.getElementById('tbody-admin-retiros');
    tbody.innerHTML = '';

    const list = state.retiros.filter(r => r.fecha && r.fecha.startsWith(state.currentPeriod));
    list.sort((a, b) => {
      const cmpDate = (a.fecha || '').localeCompare(b.fecha || '');
      if (cmpDate !== 0) return cmpDate;
      const cA = state.colaboradoras.find(c => c.id === a.colaboradora_id)?.nombre_completo || '';
      const cB = state.colaboradoras.find(c => c.id === b.colaboradora_id)?.nombre_completo || '';
      return cA.localeCompare(cB);
    });

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-neutral-400 text-xs">No hay retiros registrados para el período ${state.currentPeriod}.</td></tr>`;
      return;
    }

    list.forEach(r => {
      const colab = state.colaboradoras.find(c => c.id === r.colaboradora_id);
      const tr = document.createElement('tr');

      const isSeason = r.tipo === 'Par de Temporada';
      const badgeType = isSeason
        ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E6D5C3] text-neutral-900">Temporada</span>`
        : `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-200">Retiro Descuento</span>`;

      tr.innerHTML = `
        <td>${badgeType}</td>
        <td><span class="px-2 py-0.5 rounded text-[10px] font-bold ${r.sucursal === 'TOM' ? 'bg-[#E6D5C3] text-neutral-900' : 'bg-neutral-800 text-white'}">${r.sucursal}</span></td>
        <td class="font-bold text-xs text-neutral-900">${colab?.nombre_completo || 'Colaboradora'}</td>
        <td class="font-mono font-bold text-xs uppercase text-neutral-800">${r.articulo}</td>
        <td class="text-xs uppercase text-neutral-700">${r.talle_color}</td>
        <td class="font-mono text-xs text-neutral-500">${r.fecha ? formatDateShort(r.fecha) : '-'}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function filterAdminNovedades(filterType) {
    state.adminNovedadesFilter = filterType;
    const filters = ['todas', 'licencia', 'falta', 'otras'];
    filters.forEach(f => {
      const btn = document.getElementById(`btn-filtro-nov-${f}`);
      if (btn) {
        if (f === filterType) {
          btn.className = "px-3 py-1 rounded-full text-xs font-bold bg-black text-white transition tap-active cursor-pointer";
        } else {
          btn.className = "px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition tap-active cursor-pointer";
        }
      }
    });
    renderAdminNovedades();
  }

  // --- ADMIN 4: AUDITORÍA DE NOVEDADES Y CERTIFICADOS (Filtrado por Período y con Visor) ---
  function renderAdminNovedades() {
    const tbody = document.getElementById('tbody-admin-novedades');
    tbody.innerHTML = '';

    let list = state.novedades.filter(n => {
      if (n.tipo === 'Vacaciones') return false;
      const dateStr = n.fecha_inicio || n.creado_en || '';
      return dateStr.startsWith(state.currentPeriod);
    });

    if (state.adminNovedadesFilter === 'licencia') {
      list = list.filter(n => (n.tipo || '').toLowerCase().includes('médica') || (n.tipo || '').toLowerCase().includes('medica'));
    } else if (state.adminNovedadesFilter === 'falta') {
      list = list.filter(n => (n.tipo || '').toLowerCase().includes('falta') || (n.tipo || '').toLowerCase().includes('injustificada'));
    } else if (state.adminNovedadesFilter === 'otras') {
      list = list.filter(n => !(n.tipo || '').toLowerCase().includes('médica') && !(n.tipo || '').toLowerCase().includes('medica') && !(n.tipo || '').toLowerCase().includes('falta') && !(n.tipo || '').toLowerCase().includes('injustificada'));
    }

    list.sort((a, b) => {
      const cmpDate = (a.fecha_inicio || '').localeCompare(b.fecha_inicio || '');
      if (cmpDate !== 0) return cmpDate;
      const cA = state.colaboradoras.find(c => c.id === a.colaboradora_id)?.nombre_completo || '';
      const cB = state.colaboradoras.find(c => c.id === b.colaboradora_id)?.nombre_completo || '';
      return cA.localeCompare(cB);
    });

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center py-6 text-neutral-400 text-xs">No hay registros para este filtro en el período ${state.currentPeriod}.</td></tr>`;
      return;
    }

    list.forEach(n => {
      const colab = state.colaboradoras.find(c => c.id === n.colaboradora_id);
      const tr = document.createElement('tr');

      const certBtn = n.certificado_url
        ? `<button onclick="window.app.viewComprobante('${n.id}')" class="px-2.5 py-1 rounded bg-[#E6D5C3] hover:bg-[#d8c2ad] text-neutral-900 font-bold text-[11px] flex items-center gap-1 shadow-sm cursor-pointer whitespace-nowrap">
             <i data-lucide="image" class="w-3.5 h-3.5"></i> Ver Comprobante
           </button>`
        : `<span class="text-neutral-400 text-xs italic">Sin archivo</span>`;

      tr.innerHTML = `
        <td class="font-mono text-xs text-neutral-500">${formatDateShort(n.fecha_inicio)}</td>
        <td><span class="px-2 py-0.5 rounded text-[10px] font-bold ${n.codigo_sucursal === 'TOM' ? 'bg-[#E6D5C3] text-neutral-900' : 'bg-neutral-800 text-white'}">${n.codigo_sucursal}</span></td>
        <td class="font-bold text-xs text-neutral-900">${colab?.nombre_completo || 'Colaboradora'}</td>
        <td><span class="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-200">${n.tipo}</span></td>
        <td class="font-mono text-xs text-neutral-600">${formatDateShort(n.fecha_inicio)} al ${formatDateShort(n.fecha_fin)}</td>
        <td class="font-mono font-bold text-xs text-center">${n.dias_computados}d</td>
        <td class="text-xs text-neutral-800 whitespace-normal leading-relaxed min-w-[220px]">
          ${n.observaciones ? `<div class="bg-neutral-50 p-1.5 rounded border border-neutral-200 text-[11px]">${n.observaciones}</div>` : '<span class="text-neutral-400 text-xs">-</span>'}
        </td>
        <td class="text-center">${certBtn}</td>
      `;
      tbody.appendChild(tr);
    });

    initLucideIcons();
  }

  // --- ADMIN 5: PADRÓN DE COLABORADORAS (Inactivas al final) ---
  function renderAdminColaboradoras() {
    const tbody = document.getElementById('tbody-admin-colaboradoras');
    tbody.innerHTML = '';

    // Ordenar: primero colaboradoras activas, inactivas al final de la lista
    const list = [...state.colaboradoras].sort((a, b) => {
      const aActiva = (a.estado || 'activa') === 'activa';
      const bActiva = (b.estado || 'activa') === 'activa';
      if (aActiva && !bActiva) return -1;
      if (!aActiva && bActiva) return 1;
      return a.nombre_completo.localeCompare(b.nombre_completo);
    });

    list.forEach(c => {
      const isActiva = (c.estado || 'activa') === 'activa';
      const estadoBtn = isActiva
        ? `<button onclick="window.app.toggleColaboradoraEstado('${c.id}')" class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300 transition flex items-center gap-1.5 mx-auto cursor-pointer" title="Clic para desactivar (baja operativa)">
             <span class="w-2 h-2 rounded-full bg-emerald-600"></span> Activa
           </button>`
        : `<button onclick="window.app.toggleColaboradoraEstado('${c.id}')" class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-neutral-200 text-neutral-600 hover:bg-neutral-300 border border-neutral-300 transition flex items-center gap-1.5 mx-auto cursor-pointer" title="Clic para reactivar">
             <span class="w-2 h-2 rounded-full bg-neutral-400"></span> Inactiva
           </button>`;

      const accionTxt = isActiva
        ? `<span class="text-xs text-emerald-700 font-medium">En funciones</span>`
        : `<span class="text-xs text-neutral-500 font-medium">${c.fecha_baja ? 'Baja: ' + formatDateShort(c.fecha_baja) : 'Inactiva para nuevos meses'}</span>`;

      const tr = document.createElement('tr');
      tr.className = isActiva ? '' : 'opacity-70 bg-neutral-50/60';
      tr.innerHTML = `
        <td>
          <div class="font-bold text-neutral-900 text-xs">${c.nombre_completo}</div>
          <div class="text-[11px] text-neutral-500 font-mono">DNI ${c.dni} ${c.cuil ? '· CUIL ' + c.cuil : ''}</div>
        </td>
        <td>
          <div class="flex items-center gap-1.5">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${c.codigo_sucursal === 'TOM' ? 'bg-[#E6D5C3] text-neutral-900' : 'bg-neutral-800 text-white'}">${c.codigo_sucursal}</span>
            <span class="text-xs text-neutral-700 font-medium">${c.categoria}</span>
          </div>
          <div class="text-[10px] text-neutral-400 mt-0.5">Alias: ${c.alias || '-'}</div>
        </td>
        <td>
          <div class="text-xs text-neutral-700 font-medium">Ingreso: ${formatDateShort(c.fecha_ingreso)}</div>
          ${c.fecha_antiguedad_reconocida ? `<div class="text-[10px] text-amber-900 font-bold">⭐ Reconocida: ${formatDateShort(c.fecha_antiguedad_reconocida)}</div>` : '<div class="text-[10px] text-neutral-400">Sin antigüedad previa</div>'}
        </td>
        <td class="text-center">${estadoBtn}</td>
        <td>${accionTxt}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function toggleColaboradoraEstado(id) {
    const colab = state.colaboradoras.find(c => c.id === id);
    if (!colab) return;
    const isActiva = (colab.estado || 'activa') === 'activa';
    colab.estado = isActiva ? 'inactiva' : 'activa';
    if (colab.estado === 'inactiva') {
      colab.fecha_baja = new Date().toISOString().split('T')[0];
    } else {
      delete colab.fecha_baja;
    }
    localStorage.setItem('nazaria_colaboradoras_v2', JSON.stringify(state.colaboradoras));
    showToast(`${colab.nombre_completo} ahora está ${colab.estado.toUpperCase()}.`, 'info');
    renderAdminColaboradoras();
    updateAdminKPIs();
    if (state.currentRole && state.currentRole !== 'ADMIN') {
      populateStoreColaboradorasSelects(state.currentRole);
      renderStoreHoras();
    }
  }

  // ============================================================================
  // CÁLCULO DE VACACIONES LCT (LEY 20.744)
  // ============================================================================
  function calcularVacacionesLCT(colab, anioFiscal) {
    const fechaRef = colab.fecha_antiguedad_reconocida || colab.fecha_ingreso;
    if (!fechaRef) return { aniosAntiguedad: 0, diasLey: 14 };

    const ingreso = new Date(fechaRef);
    const corte = new Date(anioFiscal, 11, 31); // 31 de diciembre

    const diffAnios = (corte - ingreso) / (1000 * 60 * 60 * 24 * 365.25);
    const anios = Math.max(0, Math.floor(diffAnios));

    let dias = 14;
    if (anios >= 20) dias = 35;
    else if (anios >= 10) dias = 28;
    else if (anios >= 5) dias = 21;
    else dias = 14;

    return { aniosAntiguedad: anios, diasLey: dias };
  }

  // ============================================================================
  // EXPORTACIÓN A EXCEL COMPLETO (SHEETJS)
  // ============================================================================
  function exportFullExcelWorkbook() {
    if (!window.XLSX) {
      showToast('Librería XLSX no disponible.', 'error');
      return;
    }

    const anioFiscal = parseInt(state.currentPeriod.split('-')[0]) || 2026;
    const wb = XLSX.utils.book_new();

    // 1. SOLAPA: HORAS DEL MES Y LIQUIDACIÓN (FORMATO SUELDOS 2)
    const rowsHoras = [
      ['NAZARIA - PLANILLA DE SUELDOS Y HORAS CONSOLIDADA'],
      [`Período: ${formatPeriodLabel(state.currentPeriod)}`],
      [],
      ['MASCHWITZ', formatPeriodLabel(state.currentPeriod).toUpperCase()],
      ['NOMBRE', 'RECIBO (HS)', 'SIN RECIBO (HS)', 'TOTAL BASE', 'ADICIONAL', 'FERIADOS', 'HORAS EXTRA', 'VACACIONES', 'OBSERVACIONES']
    ];

    const allKeys = getConsolidadoKeysForPeriod(state.currentPeriod);
    const maschKeys = allKeys.filter(k => {
      const colabId = k.replace(`${state.currentPeriod}_`, '');
      return colabId === 'c-martu_masch' || state.colaboradoras.find(c => c.id === colabId)?.codigo_sucursal === 'MASCHWITZ';
    });
    const tomKeys = allKeys.filter(k => {
      const colabId = k.replace(`${state.currentPeriod}_`, '');
      return colabId !== 'c-martu_masch' && state.colaboradoras.find(c => c.id === colabId)?.codigo_sucursal === 'TOM';
    });

    let totMaschRec = 0, totMaschSinRec = 0, totMaschBase = 0, totMaschAdic = 0, totMaschFer = 0, totMaschExt = 0, totMaschVac = 0;
    maschKeys.forEach(k => {
      const colabId = k.replace(`${state.currentPeriod}_`, '');
      const isMaschCoverage = colabId === 'c-martu_masch';
      const colab = isMaschCoverage ? getMartuMasch() : state.colaboradoras.find(c => c.id === colabId);
      const rec = state.cierres[k] || {};
      const r = Number(rec.recibo_hs ?? colab?.recibo_hs_base ?? 0);
      const sinRec = Number(rec.sin_recibo_hs ?? Math.max(0, (rec.horas_base ?? colab?.horas_base_mes ?? 0) - r));
      const baseContractual = r + sinRec;
      const adicReportado = Number(rec.adicional_hs ?? rec.adicionales_hs ?? 0);
      const f = Number(rec.feriados_hs ?? 0);
      const e = Number(rec.extras_hs ?? 0);
      const v = Number(rec.vacaciones_hs ?? 0);
      // Regla de Vacaciones: RESTAN directamente de la Base
      const totBase = Math.max(0, baseContractual - v);
      totMaschRec += r; totMaschSinRec += sinRec; totMaschBase += totBase; totMaschAdic += adicReportado; totMaschFer += f; totMaschExt += e; totMaschVac += v;

      rowsHoras.push([
        getColabShortName(colabId, colab?.nombre_completo).toUpperCase(),
        r || '',
        sinRec || '',
        totBase,
        adicReportado !== 0 ? adicReportado : '',
        f || '',
        e || '',
        v || '',
        (rec.observaciones ?? rec.detalle_cobertura ?? '').replace(/\n+/g, ' | ')
      ]);
    });
    rowsHoras.push(['TOTAL MASCHWITZ', totMaschRec, totMaschSinRec, totMaschBase, totMaschAdic, totMaschFer, totMaschExt, totMaschVac, '']);

    rowsHoras.push([]);
    rowsHoras.push(['TOM', formatPeriodLabel(state.currentPeriod).toUpperCase()]);
    rowsHoras.push(['NOMBRE', 'RECIBO (HS)', 'SIN RECIBO (HS)', 'TOTAL BASE', 'ADICIONAL', 'FERIADOS', 'HORAS EXTRA', 'VACACIONES', 'OBSERVACIONES']);

    let totTomRec = 0, totTomSinRec = 0, totTomBase = 0, totTomAdic = 0, totTomFer = 0, totTomExt = 0, totTomVac = 0;
    tomKeys.forEach(k => {
      const colabId = k.replace(`${state.currentPeriod}_`, '');
      const colab = state.colaboradoras.find(c => c.id === colabId);
      const rec = state.cierres[k] || {};
      const r = Number(rec.recibo_hs ?? colab?.recibo_hs_base ?? 0);
      const sinRec = Number(rec.sin_recibo_hs ?? Math.max(0, (rec.horas_base ?? colab?.horas_base_mes ?? 0) - r));
      const baseContractual = r + sinRec;
      const adicReportado = Number(rec.adicional_hs ?? rec.adicionales_hs ?? 0);
      const f = Number(rec.feriados_hs ?? 0);
      const e = Number(rec.extras_hs ?? 0);
      const v = Number(rec.vacaciones_hs ?? 0);
      // Regla de Vacaciones: RESTAN directamente de la Base
      const totBase = Math.max(0, baseContractual - v);
      totTomRec += r; totTomSinRec += sinRec; totTomBase += totBase; totTomAdic += adicReportado; totTomFer += f; totTomExt += e; totTomVac += v;

      rowsHoras.push([
        getColabShortName(colabId, colab?.nombre_completo).toUpperCase(),
        r || '',
        sinRec || '',
        totBase,
        adicReportado !== 0 ? adicReportado : '',
        f || '',
        e || '',
        v || '',
        (rec.observaciones ?? rec.detalle_cobertura ?? '').replace(/\n+/g, ' | ')
      ]);
    });
    rowsHoras.push(['TOTAL TOM', totTomRec, totTomSinRec, totTomBase, totTomAdic, totTomFer, totTomExt, totTomVac, '']);

    const wsHoras = XLSX.utils.aoa_to_sheet(rowsHoras);
    XLSX.utils.book_append_sheet(wb, wsHoras, 'Sueldos_Consolidado');

    // 2. SOLAPA: DETALLE DE EXTRAS Y ADICIONALES
    const rowsHorasDetalle = [
      ['NAZARIA - DETALLE DE HORAS EXTRAS Y ADICIONALES'],
      [`Período: ${state.currentPeriod}`],
      [],
      ['Fecha', 'Sucursal', 'Colaboradora', 'Tipo', 'Horas', 'Motivo / Justificación']
    ];
    state.horas_detalle
      .filter(h => h.fecha && h.fecha.startsWith(state.currentPeriod))
      .forEach(h => {
        const colab = state.colaboradoras.find(c => c.id === h.colaboradora_id);
        rowsHorasDetalle.push([
          h.fecha,
          h.sucursal,
          colab?.nombre_completo || '',
          h.tipo,
          h.horas,
          h.motivo
        ]);
      });
    const wsHorasDetalle = XLSX.utils.aoa_to_sheet(rowsHorasDetalle);
    XLSX.utils.book_append_sheet(wb, wsHorasDetalle, 'Detalle_Extras_Adic');

    // 3. SOLAPA: VACACIONES
    const rowsVacaciones = [
      ['NAZARIA - CONTROL DE VACACIONES LCT 20.744'],
      [`Año Fiscal: ${anioFiscal}`],
      [],
      ['Sucursal', 'Colaboradora', 'Fecha Ingreso', 'Antigüedad Reconocida', 'Años al 31/12', 'Días Disponibles', 'Días Tomados', 'Saldo Restante', 'Tramos Tomados']
    ];

    state.colaboradoras.forEach(c => {
      const calc = calcularVacacionesLCT(c, anioFiscal);
      const vacNovedades = state.novedades.filter(n => n.colaboradora_id === c.id && n.tipo === 'Vacaciones');
      const diasTomados = vacNovedades.reduce((sum, n) => sum + (Number(n.dias_computados) || 0), 0);
      const saldo = Math.max(0, calc.diasLey - diasTomados);
      const tramos = vacNovedades.map(n => `${n.fecha_inicio} al ${n.fecha_fin} (${n.dias_computados}d)`).join('; ');

      rowsVacaciones.push([
        c.codigo_sucursal,
        c.nombre_completo,
        c.fecha_ingreso,
        c.fecha_antiguedad_reconocida || 'N/A',
        calc.aniosAntiguedad,
        calc.diasLey,
        diasTomados,
        saldo,
        tramos
      ]);
    });
    const wsVac = XLSX.utils.aoa_to_sheet(rowsVacaciones);
    XLSX.utils.book_append_sheet(wb, wsVac, 'Vacaciones_LCT');

    // 4. SOLAPA: RETIROS Y PAR DE TEMPORADA
    const rowsRetiros = [
      ['NAZARIA - RETIROS DE CALZADO Y PAR DE TEMPORADA'],
      [`Período: ${state.currentPeriod}`],
      [],
      ['Tipo', 'Sucursal', 'Colaboradora', 'Artículo', 'Talle y Color', 'Fecha']
    ];
    state.retiros
      .filter(r => r.fecha && r.fecha.startsWith(state.currentPeriod))
      .forEach(r => {
        const colab = state.colaboradoras.find(c => c.id === r.colaboradora_id);
        rowsRetiros.push([
          r.tipo,
          r.sucursal,
          colab?.nombre_completo || '',
          r.articulo,
          r.talle_color,
          r.fecha || ''
        ]);
      });
    const wsRet = XLSX.utils.aoa_to_sheet(rowsRetiros);
    XLSX.utils.book_append_sheet(wb, wsRet, 'Calzado_Retiros');

    // 5. SOLAPA: NOVEDADES Y FALTAS
    const rowsNov = [
      ['NAZARIA - NOVEDADES, LICENCIAS Y FALTAS'],
      [`Período: ${state.currentPeriod}`],
      [],
      ['Fecha Inicio', 'Fecha Fin', 'Sucursal', 'Colaboradora', 'Tipo', 'Días', 'Observaciones']
    ];
    state.novedades
      .filter(n => n.tipo !== 'Vacaciones' && ((n.fecha_inicio && n.fecha_inicio.startsWith(state.currentPeriod)) || (n.creado_en && n.creado_en.startsWith(state.currentPeriod))))
      .forEach(n => {
        const colab = state.colaboradoras.find(c => c.id === n.colaboradora_id);
        rowsNov.push([
          n.fecha_inicio,
          n.fecha_fin,
          n.codigo_sucursal,
          colab?.nombre_completo || '',
          n.tipo,
          n.dias_computados,
          n.observaciones || ''
        ]);
      });
    const wsNov = XLSX.utils.aoa_to_sheet(rowsNov);
    XLSX.utils.book_append_sheet(wb, wsNov, 'Novedades_Faltas');

    // Guardar archivo
    XLSX.writeFile(wb, `Reporte_RRHH_Nazaria_${state.currentPeriod}.xlsx`);
    showToast('Archivo Excel consolidado exportado.', 'success');
  }

  // ============================================================================
  // EXPORTACIÓN DE IMAGEN PARA WHATSAPP / LIQUIDADOR (HTML2CANVAS - FORMATO SUELDOS 2)
  // ============================================================================
  async function exportSummaryImage() {
    if (!window.html2canvas) {
      showToast('Librería de exportación de imagen no disponible.', 'error');
      return;
    }

    showToast('Generando placa de liquidación para WhatsApp...', 'info');

    const container = document.getElementById('export-card-render-container');
    if (!container) return;

    const currentPeriod = state.currentPeriod;
    const allKeys = getConsolidadoKeysForPeriod(currentPeriod);

    // Mapeo de meses en mayúsculas para encabezados
    const monthNames = [
      'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
      'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
    ];
    const [yNum, mNum] = currentPeriod.split('-').map(Number);
    const monthLabel = monthNames[(mNum || 9) - 1] || 'SEPTIEMBRE';

    // Helper de formato decimal argentino (vacío si es 0 para limpieza visual estilo Excel)
    function formatHsCell(val, showZero = false) {
      if (val === null || val === undefined || val === '') return '';
      const n = Number(val);
      if (isNaN(n)) return '';
      if (n === 0 && !showZero) return '';
      return n.toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    }

    function formatAdicCell(val, showZero = false) {
      if (val === null || val === undefined || val === '') return '';
      const n = Number(val);
      if (isNaN(n) || (n === 0 && !showZero)) return '';
      const formatted = Math.abs(n).toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
      if (n > 0) return `+${formatted}`;
      if (n < 0) return `-${formatted}`;
      return formatted;
    }

    // Separación estricta por sucursales activas (Maschwitz y TOM - Champagnat excluida)
    const maschKeys = allKeys.filter(k => {
      const colabId = k.replace(`${currentPeriod}_`, '');
      return colabId === 'c-martu_masch' || state.colaboradoras.find(c => c.id === colabId)?.codigo_sucursal === 'MASCHWITZ';
    });

    const tomKeys = allKeys.filter(k => {
      const colabId = k.replace(`${currentPeriod}_`, '');
      return colabId !== 'c-martu_masch' && state.colaboradoras.find(c => c.id === colabId)?.codigo_sucursal === 'TOM';
    });

    // 1. FILAS MASCHWITZ (Opción B: Detalle para liquidador con diseño limpio Editorial)
    let totMaschRec = 0, totMaschSinRec = 0, totMaschBaseNeta = 0, totMaschAdic = 0, totMaschFer = 0, totMaschExt = 0, totMaschVac = 0, totMaschTot = 0;
    const maschRowsHtml = maschKeys.map(k => {
      const colabId = k.replace(`${currentPeriod}_`, '');
      const isMaschCoverage = colabId === 'c-martu_masch';
      const colab = isMaschCoverage ? getMartuMasch() : state.colaboradoras.find(c => c.id === colabId);
      const rec = state.cierres[k] || {};

      const r = Number(rec.recibo_hs ?? colab?.recibo_hs_base ?? 0);
      const sinRec = Number(rec.sin_recibo_hs ?? (colab ? Math.max(0, (colab.horas_base_mes || 0) - (colab.recibo_hs_base || 0)) : 0));
      const baseContractual = r + sinRec;
      const v = Number(rec.vacaciones_hs ?? 0);
      const baseNeta = Math.max(0, baseContractual - v);
      const adic = Number(rec.adicional_hs ?? 0);
      const f = Number(rec.feriados_hs ?? 0);
      const e = Number(rec.extras_hs ?? 0);
      let obs = (rec.observaciones ?? rec.detalle_cobertura ?? '').trim();
      if (colabId === 'c-martu_masch' && obs.toLowerCase().includes('cubre domingos')) {
        obs = '';
      }

      const totColab = Math.max(0, baseNeta + adic + f + e);

      totMaschRec += r;
      totMaschSinRec += sinRec;
      totMaschBaseNeta += baseNeta;
      totMaschAdic += adic;
      totMaschFer += f;
      totMaschExt += e;
      totMaschVac += v;
      totMaschTot += totColab;

      const colabName = getColabShortName(colabId, colab?.nombre_completo);

      return `
        <tr style="background: #ffffff;">
          <td style="border: 1px solid #E5E7EB; padding: 7px 10px; vertical-align: middle;">
            <div style="display: flex; align-items: center; gap: 7px;">
              <span style="background: #EDE9FE; color: #5B21B6; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px; letter-spacing: 0.3px;">MASCH</span>
              <span style="font-weight: 700; font-size: 12px; color: #111827;">${colabName}</span>
            </div>
          </td>
          <td style="border: 1px solid #E5E7EB; padding: 7px 6px; text-align: center; font-size: 12px; font-weight: 600; font-family: 'SF Mono', Consolas, monospace; color: #374151;">${formatHsCell(r)}</td>
          <td style="border: 1px solid #E5E7EB; padding: 7px 6px; text-align: center; font-size: 12px; font-weight: 600; font-family: 'SF Mono', Consolas, monospace; color: #4B5563;">${formatHsCell(sinRec)}</td>
          <td style="border: 1px solid #E5E7EB; padding: 7px 6px; text-align: center; font-size: 12px; font-weight: 800; font-family: 'SF Mono', Consolas, monospace; color: #111827; background: #F8F6F2;">${formatHsCell(baseNeta)}</td>
          <td style="border: 1px solid #E5E7EB; padding: 7px 6px; text-align: center; font-size: 12px; font-weight: 700; font-family: 'SF Mono', Consolas, monospace; color: ${adic < 0 ? '#DC2626' : (adic > 0 ? '#B45309' : '#374151')};">${formatAdicCell(adic)}</td>
          <td style="border: 1px solid #E5E7EB; padding: 7px 6px; text-align: center; font-size: 12px; font-weight: 600; font-family: 'SF Mono', Consolas, monospace; color: #374151;">${formatHsCell(f)}</td>
          <td style="border: 1px solid #E5E7EB; padding: 7px 6px; text-align: center; font-size: 12px; font-weight: 600; font-family: 'SF Mono', Consolas, monospace; color: #374151;">${formatHsCell(e)}</td>
          <td style="border: 1px solid #E5E7EB; padding: 7px 6px; text-align: center; font-size: 12px; font-weight: 700; font-family: 'SF Mono', Consolas, monospace; color: #047857;">${formatHsCell(v)}</td>
          <td style="border: 1px solid #E5E7EB; padding: 7px 8px; text-align: left; font-size: 11px; color: #1F2937; font-family: 'Inter', sans-serif; line-height: 1.35;">${obs ? obs.replace(/\n/g, '<br>') : ''}</td>
        </tr>
      `;
    }).join('');

    // 2. FILAS TOM (Opción B: Detalle para liquidador con diseño limpio Editorial)
    let totTomRec = 0, totTomSinRec = 0, totTomBaseNeta = 0, totTomAdic = 0, totTomFer = 0, totTomExt = 0, totTomVac = 0, totTomTot = 0;
    const tomRowsHtml = tomKeys.map(k => {
      const colabId = k.replace(`${currentPeriod}_`, '');
      const colab = state.colaboradoras.find(c => c.id === colabId);
      const rec = state.cierres[k] || {};

      const r = Number(rec.recibo_hs ?? colab?.recibo_hs_base ?? 0);
      const sinRec = Number(rec.sin_recibo_hs ?? (colab ? Math.max(0, (colab.horas_base_mes || 0) - (colab.recibo_hs_base || 0)) : 0));
      const baseContractual = r + sinRec;
      const v = Number(rec.vacaciones_hs ?? 0);
      const baseNeta = Math.max(0, baseContractual - v);
      const adic = Number(rec.adicional_hs ?? 0);
      const f = Number(rec.feriados_hs ?? 0);
      const e = Number(rec.extras_hs ?? 0);
      let obs = (rec.observaciones ?? rec.detalle_cobertura ?? '').trim();
      if (colabId === 'c-martu_masch' && obs.toLowerCase().includes('cubre domingos')) {
        obs = '';
      }

      const totColab = Math.max(0, baseNeta + adic + f + e);

      totTomRec += r;
      totTomSinRec += sinRec;
      totTomBaseNeta += baseNeta;
      totTomAdic += adic;
      totTomFer += f;
      totTomExt += e;
      totTomVac += v;
      totTomTot += totColab;

      const colabName = getColabShortName(colabId, colab?.nombre_completo);

      return `
        <tr style="background: #ffffff;">
          <td style="border: 1px solid #E5E7EB; padding: 7px 10px; vertical-align: middle;">
            <div style="display: flex; align-items: center; gap: 7px;">
              <span style="background: #E6D5C3; color: #1A1A1A; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px; letter-spacing: 0.3px;">TOM</span>
              <span style="font-weight: 700; font-size: 12px; color: #111827;">${colabName}</span>
            </div>
          </td>
          <td style="border: 1px solid #E5E7EB; padding: 7px 6px; text-align: center; font-size: 12px; font-weight: 600; font-family: 'SF Mono', Consolas, monospace; color: #374151;">${formatHsCell(r)}</td>
          <td style="border: 1px solid #E5E7EB; padding: 7px 6px; text-align: center; font-size: 12px; font-weight: 600; font-family: 'SF Mono', Consolas, monospace; color: #4B5563;">${formatHsCell(sinRec)}</td>
          <td style="border: 1px solid #E5E7EB; padding: 7px 6px; text-align: center; font-size: 12px; font-weight: 800; font-family: 'SF Mono', Consolas, monospace; color: #111827; background: #F8F6F2;">${formatHsCell(baseNeta)}</td>
          <td style="border: 1px solid #E5E7EB; padding: 7px 6px; text-align: center; font-size: 12px; font-weight: 700; font-family: 'SF Mono', Consolas, monospace; color: ${adic < 0 ? '#DC2626' : (adic > 0 ? '#B45309' : '#374151')};">${formatAdicCell(adic)}</td>
          <td style="border: 1px solid #E5E7EB; padding: 7px 6px; text-align: center; font-size: 12px; font-weight: 600; font-family: 'SF Mono', Consolas, monospace; color: #374151;">${formatHsCell(f)}</td>
          <td style="border: 1px solid #E5E7EB; padding: 7px 6px; text-align: center; font-size: 12px; font-weight: 600; font-family: 'SF Mono', Consolas, monospace; color: #374151;">${formatHsCell(e)}</td>
          <td style="border: 1px solid #E5E7EB; padding: 7px 6px; text-align: center; font-size: 12px; font-weight: 700; font-family: 'SF Mono', Consolas, monospace; color: #047857;">${formatHsCell(v)}</td>
          <td style="border: 1px solid #E5E7EB; padding: 7px 8px; text-align: left; font-size: 11px; color: #1F2937; font-family: 'Inter', sans-serif; line-height: 1.35;">${obs ? obs.replace(/\n/g, '<br>') : ''}</td>
        </tr>
      `;
    }).join('');

    // TOTALES CONSOLIDADOS
    const grandRec = totMaschRec + totTomRec;
    const grandSinRec = totMaschSinRec + totTomSinRec;
    const grandBaseNeta = totMaschBaseNeta + totTomBaseNeta;
    const grandAdic = totMaschAdic + totTomAdic;
    const grandFer = totMaschFer + totTomFer;
    const grandExt = totMaschExt + totTomExt;
    const grandVac = totMaschVac + totTomVac;
    const grandTotal = totMaschTot + totTomTot;

    const todayStr = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });

    container.innerHTML = `
      <div id="capture-card" style="background: #FFFFFF; padding: 24px 28px; border: 1px solid #E5E7EB; border-radius: 12px; font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #111827; width: 1080px; box-sizing: border-box;">
        
        <!-- ENCABEZADO MODERNO Y DISCRETO (Identidad Nazaria Editorial Arena / Negro) -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #E6D5C3; padding-bottom: 14px; margin-bottom: 18px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #E6D5C3; display: inline-block;"></span>
              <h1 style="margin: 0; font-size: 18px; font-weight: 900; letter-spacing: -0.01em; color: #111827; text-transform: uppercase;">CONTROL MENSUAL DE HORAS</h1>
            </div>
            <p style="margin: 4px 0 0; font-size: 12px; color: #374151; font-weight: 600;">Resumen Operativo de Jornadas, Adicionales y Liquidación · Maschwitz y TOM</p>
          </div>
          <div style="text-align: right;">
            <div style="background: #E6D5C3; color: #1A1A1A; font-weight: 800; font-size: 12px; padding: 5px 14px; border-radius: 6px; border: 1px solid #D4C3B0; display: inline-block; text-transform: uppercase; letter-spacing: 0.3px;">
              Período: ${monthLabel} ${yNum}
            </div>
            <div style="font-size: 11px; color: #4B5563; margin-top: 4px; font-weight: 600;">Emisión: ${todayStr}</div>
          </div>
        </div>

        <!-- 1. BLOQUE MASCHWITZ -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr>
              <th colspan="9" style="background: #FAF9F6; border: 1px solid #E5E7EB; border-bottom: none; border-radius: 8px 8px 0 0; padding: 8px 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="background: #EDE9FE; color: #5B21B6; font-weight: 800; font-size: 11px; padding: 3px 8px; border-radius: 5px; border: 1px solid #DDD6FE;">MASCHWITZ MALL</span>
                  <span style="background: #F4EBE2; color: #451A03; font-weight: 700; font-size: 11px; padding: 2px 8px; border-radius: 5px;">${monthLabel} ${yNum}</span>
                </div>
              </th>
            </tr>
            <tr style="background: #F8F7F5; color: #374151; font-size: 10.5px; font-weight: 700; text-align: center; letter-spacing: 0.04em;">
              <th style="border: 1px solid #E5E7EB; border-bottom: 2px solid #E6D5C3; padding: 7px 8px; width: 140px; text-align: left;">COLABORADORA</th>
              <th style="border: 1px solid #E5E7EB; border-bottom: 2px solid #E6D5C3; padding: 7px 6px; width: 75px;">RECIBO</th>
              <th style="border: 1px solid #E5E7EB; border-bottom: 2px solid #E6D5C3; padding: 7px 6px; width: 85px;">AJUSTE BASE</th>
              <th style="border: 1px solid #E5E7EB; border-bottom: 2px solid #C9B29B; padding: 7px 6px; width: 85px; background: #F4EBE2; color: #1A1A1A;">TOTAL BASE</th>
              <th style="border: 1px solid #E5E7EB; border-bottom: 2px solid #E6D5C3; padding: 7px 6px; width: 80px;">ADICIONAL</th>
              <th style="border: 1px solid #E5E7EB; border-bottom: 2px solid #E6D5C3; padding: 7px 6px; width: 75px;">FERIADOS</th>
              <th style="border: 1px solid #E5E7EB; border-bottom: 2px solid #E6D5C3; padding: 7px 6px; width: 85px;">HORAS EXTRA</th>
              <th style="border: 1px solid #E5E7EB; border-bottom: 2px solid #E6D5C3; padding: 7px 6px; width: 85px;">VACACIONES</th>
              <th style="border: 1px solid #E5E7EB; border-bottom: 2px solid #E6D5C3; padding: 7px 8px; text-align: left;">OBSERVACIONES</th>
            </tr>
          </thead>
          <tbody>
            ${maschRowsHtml}
            <tr style="background: #FAF9F6; font-weight: 800; font-size: 11px;">
              <td style="border: 1px solid #CBD5E1; border-top: 2px solid #CBD5E1; padding: 7px 10px; text-align: right; color: #111827; text-transform: uppercase;">TOTAL MASCHWITZ</td>
              <td style="border: 1px solid #CBD5E1; border-top: 2px solid #CBD5E1; padding: 7px 6px; text-align: center; font-family: 'SF Mono', Consolas, monospace; font-weight: 800; color: #111827;">${formatHsCell(totMaschRec, true)}</td>
              <td style="border: 1px solid #CBD5E1; border-top: 2px solid #CBD5E1; padding: 7px 6px; text-align: center; font-family: 'SF Mono', Consolas, monospace; font-weight: 800; color: #111827;">${formatHsCell(totMaschSinRec, true)}</td>
              <td style="border: 1px solid #CBD5E1; border-top: 2px solid #C9B29B; padding: 7px 6px; text-align: center; font-family: 'SF Mono', Consolas, monospace; font-weight: 900; background: #F4EBE2; color: #1A1A1A;">${formatHsCell(totMaschBaseNeta, true)}</td>
              <td style="border: 1px solid #CBD5E1; border-top: 2px solid #CBD5E1; padding: 7px 6px; text-align: center; font-family: 'SF Mono', Consolas, monospace; font-weight: 800; color: ${totMaschAdic < 0 ? '#DC2626' : (totMaschAdic > 0 ? '#B45309' : '#111827')};">${formatAdicCell(totMaschAdic, true)}</td>
              <td style="border: 1px solid #CBD5E1; border-top: 2px solid #CBD5E1; padding: 7px 6px; text-align: center; font-family: 'SF Mono', Consolas, monospace; font-weight: 800; color: #111827;">${formatHsCell(totMaschFer, true)}</td>
              <td style="border: 1px solid #CBD5E1; border-top: 2px solid #CBD5E1; padding: 7px 6px; text-align: center; font-family: 'SF Mono', Consolas, monospace; font-weight: 800; color: #111827;">${formatHsCell(totMaschExt, true)}</td>
              <td style="border: 1px solid #CBD5E1; border-top: 2px solid #CBD5E1; padding: 7px 6px; text-align: center; font-family: 'SF Mono', Consolas, monospace; font-weight: 800; color: #047857;">${formatHsCell(totMaschVac, true)}</td>
              <td style="border: 1px solid #CBD5E1; border-top: 2px solid #CBD5E1; padding: 7px 10px; text-align: left; font-weight: 800;">
                <span style="background: #E6D5C3; color: #111827; padding: 2.5px 8px; border-radius: 4px; font-size: 11px;">Total Sucursal: ${formatHsCell(totMaschTot, true)} hs</span>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 2. BLOQUE TOM -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr>
              <th colspan="9" style="background: #FAF9F6; border: 1px solid #E5E7EB; border-bottom: none; border-radius: 8px 8px 0 0; padding: 8px 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="background: #E6D5C3; color: #1A1A1A; font-weight: 800; font-size: 11px; padding: 3px 8px; border-radius: 5px; border: 1px solid #D4C3B0;">TORTUGAS OPEN MALL (TOM)</span>
                  <span style="background: #F4EBE2; color: #451A03; font-weight: 700; font-size: 11px; padding: 2px 8px; border-radius: 5px;">${monthLabel} ${yNum}</span>
                </div>
              </th>
            </tr>
            <tr style="background: #F8F7F5; color: #374151; font-size: 10.5px; font-weight: 700; text-align: center; letter-spacing: 0.04em;">
              <th style="border: 1px solid #E5E7EB; border-bottom: 2px solid #E6D5C3; padding: 7px 8px; width: 140px; text-align: left;">COLABORADORA</th>
              <th style="border: 1px solid #E5E7EB; border-bottom: 2px solid #E6D5C3; padding: 7px 6px; width: 75px;">RECIBO</th>
              <th style="border: 1px solid #E5E7EB; border-bottom: 2px solid #E6D5C3; padding: 7px 6px; width: 85px;">AJUSTE BASE</th>
              <th style="border: 1px solid #E5E7EB; border-bottom: 2px solid #C9B29B; padding: 7px 6px; width: 85px; background: #F4EBE2; color: #1A1A1A;">TOTAL BASE</th>
              <th style="border: 1px solid #E5E7EB; border-bottom: 2px solid #E6D5C3; padding: 7px 6px; width: 80px;">ADICIONAL</th>
              <th style="border: 1px solid #E5E7EB; border-bottom: 2px solid #E6D5C3; padding: 7px 6px; width: 75px;">FERIADOS</th>
              <th style="border: 1px solid #E5E7EB; border-bottom: 2px solid #E6D5C3; padding: 7px 6px; width: 85px;">HORAS EXTRA</th>
              <th style="border: 1px solid #E5E7EB; border-bottom: 2px solid #E6D5C3; padding: 7px 6px; width: 85px;">VACACIONES</th>
              <th style="border: 1px solid #E5E7EB; border-bottom: 2px solid #E6D5C3; padding: 7px 8px; text-align: left;">OBSERVACIONES</th>
            </tr>
          </thead>
          <tbody>
            ${tomRowsHtml}
            <tr style="background: #FAF9F6; font-weight: 800; font-size: 11px;">
              <td style="border: 1px solid #CBD5E1; border-top: 2px solid #CBD5E1; padding: 7px 10px; text-align: right; color: #111827; text-transform: uppercase;">TOTAL TOM</td>
              <td style="border: 1px solid #CBD5E1; border-top: 2px solid #CBD5E1; padding: 7px 6px; text-align: center; font-family: 'SF Mono', Consolas, monospace; font-weight: 800; color: #111827;">${formatHsCell(totTomRec, true)}</td>
              <td style="border: 1px solid #CBD5E1; border-top: 2px solid #CBD5E1; padding: 7px 6px; text-align: center; font-family: 'SF Mono', Consolas, monospace; font-weight: 800; color: #111827;">${formatHsCell(totTomSinRec, true)}</td>
              <td style="border: 1px solid #CBD5E1; border-top: 2px solid #C9B29B; padding: 7px 6px; text-align: center; font-family: 'SF Mono', Consolas, monospace; font-weight: 900; background: #F4EBE2; color: #1A1A1A;">${formatHsCell(totTomBaseNeta, true)}</td>
              <td style="border: 1px solid #CBD5E1; border-top: 2px solid #CBD5E1; padding: 7px 6px; text-align: center; font-family: 'SF Mono', Consolas, monospace; font-weight: 800; color: ${totTomAdic < 0 ? '#DC2626' : (totTomAdic > 0 ? '#B45309' : '#111827')};">${formatAdicCell(totTomAdic, true)}</td>
              <td style="border: 1px solid #CBD5E1; border-top: 2px solid #CBD5E1; padding: 7px 6px; text-align: center; font-family: 'SF Mono', Consolas, monospace; font-weight: 800; color: #111827;">${formatHsCell(totTomFer, true)}</td>
              <td style="border: 1px solid #CBD5E1; border-top: 2px solid #CBD5E1; padding: 7px 6px; text-align: center; font-family: 'SF Mono', Consolas, monospace; font-weight: 800; color: #111827;">${formatHsCell(totTomExt, true)}</td>
              <td style="border: 1px solid #CBD5E1; border-top: 2px solid #CBD5E1; padding: 7px 6px; text-align: center; font-family: 'SF Mono', Consolas, monospace; font-weight: 800; color: #047857;">${formatHsCell(totTomVac, true)}</td>
              <td style="border: 1px solid #CBD5E1; border-top: 2px solid #CBD5E1; padding: 7px 10px; text-align: left; font-weight: 800;">
                <span style="background: #E6D5C3; color: #111827; padding: 2.5px 8px; border-radius: 4px; font-size: 11px;">Total Sucursal: ${formatHsCell(totTomTot, true)} hs</span>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- TOTAL GENERAL CONSOLIDADO -->
        <div style="border: 1px solid #E5E7EB; border-left: 4px solid #E6D5C3; background: #FAF9F6; padding: 14px 18px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center;">
          <div style="font-weight: 800; font-size: 12px; text-transform: uppercase; color: #111827; letter-spacing: 0.3px;">
            TOTAL GENERAL CONSOLIDADO (TOM + MASCHWITZ):
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 8px; font-size: 11px; align-items: center;">
            <div style="background: #FFFFFF; border: 1px solid #E5E7EB; padding: 4px 8px; border-radius: 6px; font-weight: 600; color: #111827;">Recibo: <strong style="color: #111827; font-family: monospace;">${formatHsCell(grandRec, true)} hs</strong></div>
            <div style="background: #FFFFFF; border: 1px solid #E5E7EB; padding: 4px 8px; border-radius: 6px; font-weight: 600; color: #111827;">Ajuste Base: <strong style="color: #111827; font-family: monospace;">${formatHsCell(grandSinRec, true)} hs</strong></div>
            <div style="background: #F4EBE2; border: 1px solid #D4C3B0; padding: 4px 8px; border-radius: 6px; font-weight: 700; color: #1A1A1A;">Total Base: <strong style="color: #1A1A1A; font-family: monospace;">${formatHsCell(grandBaseNeta, true)} hs</strong></div>
            <div style="background: #FFFFFF; border: 1px solid #E5E7EB; padding: 4px 8px; border-radius: 6px; font-weight: 600; color: #111827;">Adicional: <strong style="color: ${grandAdic < 0 ? '#DC2626' : (grandAdic > 0 ? '#B45309' : '#111827')}; font-family: monospace;">${formatAdicCell(grandAdic, true)} hs</strong></div>
            <div style="background: #FFFFFF; border: 1px solid #E5E7EB; padding: 4px 8px; border-radius: 6px; font-weight: 600; color: #111827;">Feriados: <strong style="color: #111827; font-family: monospace;">${formatHsCell(grandFer, true)} hs</strong></div>
            <div style="background: #FFFFFF; border: 1px solid #E5E7EB; padding: 4px 8px; border-radius: 6px; font-weight: 600; color: #111827;">Extras: <strong style="color: #111827; font-family: monospace;">${formatHsCell(grandExt, true)} hs</strong></div>
            <div style="background: #ECFDF5; border: 1px solid #A7F3D0; padding: 4px 8px; border-radius: 6px; font-weight: 700; color: #047857;">Vacaciones: <strong style="color: #047857; font-family: monospace;">${formatHsCell(grandVac, true)} hs</strong></div>
            <div style="background: #1A1A1A; color: #FFFFFF; padding: 6px 14px; border-radius: 8px; font-size: 13px; font-weight: 900; letter-spacing: 0.5px;">TOTAL: ${formatHsCell(grandTotal, true)} hs</div>
          </div>
        </div>
      </div>
    `;

    try {
      const cardEl = document.getElementById('capture-card');
      const canvas = await window.html2canvas(cardEl, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const filename = `Control_Horas_${currentPeriod}.png`;

      const modal = document.getElementById('modal-export-image');
      const resultImg = document.getElementById('export-result-img');
      const downloadBtn = document.getElementById('btn-download-image');
      const periodLabel = document.getElementById('export-image-period-label');

      resultImg.src = imgData;
      downloadBtn.href = imgData;
      downloadBtn.download = filename;
      periodLabel.textContent = `Período: ${currentPeriod} · Resumen Oficial`;

      modal.classList.remove('hidden');

      // Descarga directa automática eliminada: el usuario revisa la imagen y descarga si lo desea con el botón
      showToast('Placa generada. Podés revisarla o descargarla.', 'success');
      initLucideIcons();
    } catch (err) {
      console.error(err);
      showToast('Error al generar la imagen: ' + err.message, 'error');
    }
  }

  function closeExportImageModal() {
    document.getElementById('modal-export-image')?.classList.add('hidden');
  }

  function copyExportImageToClipboard() {
    const resultImg = document.getElementById('export-result-img');
    if (!resultImg || !resultImg.src) {
      showToast('No hay imagen para copiar.', 'error');
      return;
    }

    fetch(resultImg.src)
      .then(res => res.blob())
      .then(blob => {
        if (navigator.clipboard && window.ClipboardItem) {
          navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
            .then(() => showToast('¡Imagen copiada al portapapeles! Ya podés pegarla con Ctrl+V en WhatsApp Web.', 'success'))
            .catch(() => showToast('Hacé clic derecho en la imagen y seleccioná "Copiar imagen".', 'info'));
        } else {
          showToast('Hacé clic derecho en la imagen y seleccioná "Copiar imagen".', 'info');
        }
      })
      .catch(() => {
        showToast('Descargá el archivo PNG directamente.', 'info');
      });
  }

  async function shareExportImage() {
    const resultImg = document.getElementById('export-result-img');
    if (!resultImg || !resultImg.src) {
      showToast('Generando placa primero...', 'info');
      await exportSummaryImage();
    }

    const currentPeriod = state.currentPeriod;
    const filename = `Liquidacion_Nazaria_${currentPeriod}.png`;

    try {
      const res = await fetch(resultImg.src);
      const blob = await res.blob();
      const file = new File([blob], filename, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Liquidación Nazaria · ${currentPeriod}`,
          text: `Reporte de Liquidación Nazaria Retail (${currentPeriod}) para el estudio contable.`,
          files: [file]
        });
        showToast('¡Compartido con éxito!', 'success');
      } else if (navigator.share) {
        await navigator.share({
          title: `Liquidación Nazaria · ${currentPeriod}`,
          text: `Reporte de Liquidación Nazaria Retail (${currentPeriod})`,
          url: window.location.href
        });
      } else {
        copyExportImageToClipboard();
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error compartiendo:', err);
        copyExportImageToClipboard();
      }
    }
  }

  // ============================================================================
  // DROPZONE Y MANEJO DE FOTOS/CERTIFICADOS
  // ============================================================================
  function setupDropzone() {
    const dropzone = document.getElementById('dropzone-certificado');
    if (!dropzone) return;

    ['dragenter', 'dragover'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
      }, false);
    });

    dropzone.addEventListener('drop', (e) => {
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) processFile(files[0]);
    });
  }

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  function processFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      state.currentSelectedFile = { name: file.name, type: file.type, dataUrl: dataUrl };

      const empty = document.getElementById('dropzone-empty');
      const preview = document.getElementById('dropzone-preview');
      const previewImg = document.getElementById('preview-img');
      const filename = document.getElementById('preview-filename');

      empty.classList.add('hidden');
      preview.classList.remove('hidden');
      preview.classList.add('flex');
      filename.textContent = file.name;

      if (file.type.startsWith('image/')) {
        previewImg.src = dataUrl;
        previewImg.classList.remove('hidden');
      } else {
        previewImg.classList.add('hidden');
      }
    };
    reader.readAsDataURL(file);
  }

  function removeSelectedFile(e) {
    if (e) e.stopPropagation();
    state.currentSelectedFile = null;
    const fileInput = document.getElementById('nov-file-input');
    if (fileInput) fileInput.value = '';

    const empty = document.getElementById('dropzone-empty');
    const preview = document.getElementById('dropzone-preview');
    if (empty && preview) {
      empty.classList.remove('hidden');
      preview.classList.add('hidden');
      preview.classList.remove('flex');
    }
  }

  function viewComprobante(target, colabNombre, tipo) {
    let url = target;
    let titleText = tipo || 'Certificado Médico';
    let detailText = colabNombre || 'Colaboradora';

    const foundNov = state.novedades.find(n => n.id === target);
    if (foundNov) {
      url = foundNov.certificado_url;
      const colab = state.colaboradoras.find(c => c.id === foundNov.colaboradora_id);
      titleText = `Comprobante: ${foundNov.tipo}`;
      detailText = `${colab?.nombre_completo || 'Colaboradora'} · Período: ${formatDateShort(foundNov.fecha_inicio)} al ${formatDateShort(foundNov.fecha_fin)}`;
    }

    if (!url) {
      showToast('No hay archivo o comprobante adjunto en este registro.', 'info');
      return;
    }

    const modal = document.getElementById('modal-viewer');
    const img = document.getElementById('viewer-img');
    const title = document.getElementById('viewer-title');
    const details = document.getElementById('viewer-details');
    const downloadBtn = document.getElementById('viewer-download-btn');

    title.textContent = titleText;
    details.textContent = detailText;
    img.src = url;
    downloadBtn.href = url;

    modal.classList.remove('hidden');
    initLucideIcons();
  }

  function closeViewerModal() {
    document.getElementById('modal-viewer').classList.add('hidden');
  }

  // ============================================================================
  // UTILIDADES, DESHACER (UNDO) Y TOASTS
  // ============================================================================
  let lastDeletedItem = null;

  function setUndoableDelete(type, data, customMsg = 'Registro eliminado.') {
    lastDeletedItem = { type, data };
    showToast(customMsg, 'info', true);
  }

  function undoLastAction() {
    if (!lastDeletedItem) return;
    const { type, data } = lastDeletedItem;

    if (type === 'novedad') {
      state.novedades.unshift(data);
      localStorage.setItem('nazaria_novedades_v2', JSON.stringify(state.novedades));
      renderStoreNovedades();
      renderStoreVacaciones();
      renderAdminNovedades();
      renderAdminVacaciones();
      updateAdminKPIs();
    } else if (type === 'retiro') {
      state.retiros.unshift(data);
      localStorage.setItem('nazaria_retiros_v2', JSON.stringify(state.retiros));
      renderStoreRetiros();
      renderAdminRetiros();
      updateAdminKPIs();
    } else if (type === 'hora_detalle') {
      state.horas_detalle.push(data);
      localStorage.setItem('nazaria_horas_detalle_v2', JSON.stringify(state.horas_detalle));
      const key = `${state.currentPeriod}_${data.colaboradora_id}`;
      if (state.cierres[key]) {
        if (data.tipo === 'Hora Extra') {
          state.cierres[key].extras_hs = (Number(state.cierres[key].extras_hs) || 0) + data.horas;
        } else {
          state.cierres[key].adicionales_hs = (Number(state.cierres[key].adicionales_hs) || 0) + data.horas;
        }
        localStorage.setItem('nazaria_cierres_v2', JSON.stringify(state.cierres));
        renderStoreHoras();
      }
      renderStoreHorasDetalle();
    } else if (type === 'fecha_especial') {
      state.fechas_especiales.push(data);
      localStorage.setItem('nazaria_fechas_especiales_v2', JSON.stringify(state.fechas_especiales));
      renderStoreFechasEspeciales();
      if (state.currentRole === 'ADMIN') renderAdminFechasEspeciales();
    } else if (type === 'horario_modificacion') {
      state.horarios_modificaciones.unshift(data);
      localStorage.setItem('nazaria_horarios_modificaciones_v2', JSON.stringify(state.horarios_modificaciones));
      if (state.supabaseClient && state.isSupabaseConnected) {
        try {
          state.supabaseClient.from('horarios_modificaciones').insert(data);
        } catch (e) {}
      }
      renderStoreModificaciones();
      renderAdminModificaciones();
    }

    lastDeletedItem = null;
    showToast('Acción deshecha. Registro recuperado.', 'success');
  }

  function setDefaultDates() {
    const today = new Date().toISOString().split('T')[0];
    const inputs = ['ret-fecha', 'hd-fecha', 'nov-fecha-inicio', 'nov-fecha-fin', 'vac-desde', 'vac-hasta', 'mod-fecha', 'store-mod-fecha'];
    inputs.forEach(id => {
      const el = document.getElementById(id);
      if (el && !el.value) el.value = today;
    });
  }

  function formatDateShort(dateStr) {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('T')[0].split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  }

  function showToast(msg, type = 'info', hasUndo = false) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const bgClass = type === 'success' ? 'bg-black text-white' : type === 'error' ? 'bg-red-700 text-white' : 'bg-neutral-900 text-white';

    const undoBtn = hasUndo
      ? `<button onclick="window.app.undoLastAction()" class="bg-[#E6D5C3] text-neutral-900 hover:bg-white px-2.5 py-0.5 rounded text-[11px] font-bold ml-3 transition shadow-sm cursor-pointer">Deshacer</button>`
      : '';

    toast.className = `${bgClass} px-4 py-2.5 rounded-lg shadow-2xl text-xs font-bold flex items-center justify-between pointer-events-auto gap-2 fade-in border border-neutral-700`;
    toast.innerHTML = `<div class="flex items-center gap-1.5"><span>${msg}</span></div>${undoBtn}`;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, hasUndo ? 5000 : 3000);
  }

  // Exponer métodos globalmente
  window.app = {
    promptPin,
    closePinModal,
    pressPinKey,
    submitPin,
    logout,
    changePeriod,
    switchStoreTab,
    switchAdminTab,
    switchAdminHorariosStore,
    saveAdminHorarios,
    toggleModificacionForm,
    handleSaveModificacion,
    toggleStoreModificacionForm,
    handleSaveStoreModificacion,
    handleDeleteModificacion,
    saveAllHorasStore,
    recalcStoreRowBase,
    recalcRowTotal: recalcStoreRowBase,
    handleAddHoraDetalle,
    handleDeleteHoraDetalle,
    saveHorariosStore,
    handleAddFechaEspecial,
    handleDeleteFechaEspecial,
    saveHorariosNotas,
    handleTipoNovedadChange,
    handleSaveNovedad,
    deleteNovedad,
    handleSaveRetiro,
    deleteRetiro,
    calcNovDaysAuto,
    calcVacDaysAuto,
    filterAdminNovedades,
    handleSaveVacaciones,
    undoLastAction,
    exportFullExcelWorkbook,
    exportSummaryImage,
    closeExportImageModal,
    copyExportImageToClipboard,
    shareExportImage,
    handleAdminUpdateCierre,
    toggleBaseEdit,
    saveAllHorasAdmin,
    openObservacionesModal,
    closeObservacionesModal,
    appendObsTag,
    saveObservacionesModal,
    handleFileSelect,
    removeSelectedFile,
    viewComprobante,
    closeViewerModal,
    toggleColaboradoraEstado,
    openAddColaboradoraModal: () => showToast('Padrón centralizado de colaboradoras.', 'info'),

    // Métodos de edición de grillas y esquemas
    toggleStoreGridEdit,
    toggleAdminGridEdit,
    openEditEsquemaModal,
    recalcModalEsquemaDiff,
    closeEditEsquemaModal,
    handleSaveEsquema,

    // Modal y Tooltips flotantes de ayuda de columnas (Vacaciones y Adicional)
    openInfoModal,
    closeInfoModal,
    showHoverTooltip,
    hideHoverTooltip
  };

  // Inicializar al cargar el DOM
  document.addEventListener('DOMContentLoaded', () => {
    init();
    setDefaultDates();
  });

})();
