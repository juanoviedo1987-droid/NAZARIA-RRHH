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
      estado: 'activa'
    },
    {
      id: 'c-juli',
      sucursal_id: 'suc-maschwitz',
      codigo_sucursal: 'MASCHWITZ',
      alias: 'Juli Vera',
      nombre_completo: 'Vera Julieta Agustina',
      dni: '39445123',
      cuil: '27-39445123-2',
      fecha_ingreso: '2023-11-01',
      fecha_antiguedad_reconocida: null,
      categoria: 'Vendedora',
      estado: 'activa'
    },
    {
      id: 'c-cami',
      sucursal_id: 'suc-maschwitz',
      codigo_sucursal: 'MASCHWITZ',
      alias: 'Cami Vera',
      nombre_completo: 'Vera Camila Abril',
      dni: '42189032',
      cuil: '27-42189032-6',
      fecha_ingreso: '2023-02-17',
      fecha_antiguedad_reconocida: null,
      categoria: 'Encargada de Sucursal',
      estado: 'activa'
    },

    // TOM (5 Colaboradoras)
    {
      id: 'c-sofi',
      sucursal_id: 'suc-tom',
      codigo_sucursal: 'TOM',
      alias: 'Sofi',
      nombre_completo: 'Barrientos Sofia',
      dni: '35290145',
      cuil: '27-35290145-8',
      fecha_ingreso: '2025-07-05',
      fecha_antiguedad_reconocida: '2018-09-01', // Reconocimiento de antigüedad LCT (21 días disponibles)
      categoria: 'Encargada de Sucursal',
      estado: 'activa'
    },
    {
      id: 'c-esme',
      sucursal_id: 'suc-tom',
      codigo_sucursal: 'TOM',
      alias: 'Esme',
      nombre_completo: 'Galarza Esmeralda Cristina',
      dni: '38901234',
      cuil: '27-38901234-1',
      fecha_ingreso: '2022-02-01',
      fecha_antiguedad_reconocida: null,
      categoria: 'Vendedora',
      estado: 'activa'
    },
    {
      id: 'c-martu',
      sucursal_id: 'suc-tom',
      codigo_sucursal: 'TOM',
      alias: 'Martu P.',
      nombre_completo: 'Pinto Martina',
      dni: '44102987',
      cuil: '27-44102987-9',
      fecha_ingreso: '2024-04-01',
      fecha_antiguedad_reconocida: null,
      categoria: 'Vendedora (Cubre TOM y Maschwitz)',
      estado: 'activa'
    },
    {
      id: 'c-cande',
      sucursal_id: 'suc-tom',
      codigo_sucursal: 'TOM',
      alias: 'Cande',
      nombre_completo: 'Almiron Miranda Candela Anahi',
      dni: '45091234',
      cuil: '27-45091234-5',
      fecha_ingreso: '2025-12-01',
      fecha_antiguedad_reconocida: null,
      categoria: 'Vendedora',
      estado: 'activa'
    },
    {
      id: 'c-anto',
      sucursal_id: 'suc-tom',
      codigo_sucursal: 'TOM',
      alias: 'Anto',
      nombre_completo: 'Bustamante Vanina Antonella',
      dni: '43998120',
      cuil: '27-43998120-3',
      fecha_ingreso: '2025-12-01',
      fecha_antiguedad_reconocida: null,
      categoria: 'Vendedora',
      estado: 'activa'
    }
  ];

  // --- 2. PLANILLA DE HORAS Y CIERRES MENSUALES (INICIO TRACKING: SEPTIEMBRE 2026) ---
  const DEFAULT_CIERRES = {
    // TOM (Septiembre 2026)
    '2026-09_c-sofi': { horas_base: 0, feriados_hs: 0, extras_hs: 0, adicionales_hs: 0, detalle_cobertura: '' },
    '2026-09_c-esme': { horas_base: 0, feriados_hs: 0, extras_hs: 0, adicionales_hs: 0, detalle_cobertura: '' },
    '2026-09_c-martu': { horas_base: 0, feriados_hs: 0, extras_hs: 0, adicionales_hs: 0, detalle_cobertura: '' },
    '2026-09_c-cande': { horas_base: 0, feriados_hs: 0, extras_hs: 0, adicionales_hs: 0, detalle_cobertura: '' },
    '2026-09_c-anto': { horas_base: 0, feriados_hs: 0, extras_hs: 0, adicionales_hs: 0, detalle_cobertura: '' },
    
    // MASCHWITZ (Septiembre 2026)
    '2026-09_c-flavia': { horas_base: 0, feriados_hs: 0, extras_hs: 0, adicionales_hs: 0, detalle_cobertura: '' },
    '2026-09_c-juli': { horas_base: 0, feriados_hs: 0, extras_hs: 0, adicionales_hs: 0, detalle_cobertura: '' },
    '2026-09_c-cami': { horas_base: 0, feriados_hs: 0, extras_hs: 0, adicionales_hs: 0, detalle_cobertura: '' },
    '2026-09_c-martu_masch': { horas_base: 0, feriados_hs: 0, extras_hs: 0, adicionales_hs: 0, detalle_cobertura: 'Cubre en Maschwitz' }
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
    novedades: [],
    cierres: {},
    horas_detalle: [],
    retiros: [],
    horarios: {},
    fechas_especiales: [],
    horarios_notas: {},
    horarios_modificaciones: []
  };

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
    // Inicializar o recargar datos con versión para migración limpia
    const DATA_VERSION = 'v9';
    const verKey = 'nazaria_data_version';
    if (localStorage.getItem(verKey) !== DATA_VERSION) {
      localStorage.setItem('nazaria_colaboradoras_v2', JSON.stringify(DEFAULT_COLABORADORAS));
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
    state.cierres = JSON.parse(localStorage.getItem('nazaria_cierres_v2') || JSON.stringify(DEFAULT_CIERRES));
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

  // --- SUBVISTA 1: HORAS DEL MES & CIERRE ---
  function renderStoreHoras() {
    const tbody = document.getElementById('tbody-store-horas');
    tbody.innerHTML = '';
    const storeCode = state.currentRole;

    const colabs = state.colaboradoras.filter(c => c.codigo_sucursal === storeCode);
    const listToRender = [...colabs];
    if (storeCode === 'MASCHWITZ') {
      const martu = state.colaboradoras.find(c => c.id === 'c-martu');
      if (martu) listToRender.push({ ...martu, id: 'c-martu_masch', alias: 'Martu P. (Cobertura)', isCoverage: true });
    }

    listToRender.forEach(c => {
      const key = `${state.currentPeriod}_${c.id}`;
      const record = state.cierres[key] || { horas_base: 0, feriados_hs: 0, extras_hs: 0, adicionales_hs: 0, detalle_cobertura: '' };

      const totalHs = (Number(record.horas_base) || 0) + (Number(record.feriados_hs) || 0) + (Number(record.extras_hs) || 0) + (Number(record.adicionales_hs) || 0);

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="font-bold text-neutral-900">
          <div>${c.alias || c.nombre_completo}</div>
          <div class="text-[11px] text-neutral-400 font-normal">${c.nombre_completo}</div>
        </td>
        <td>
          <input type="number" step="1" min="0" value="${record.horas_base}" id="hb-${c.id}" class="w-20 p-1.5 border border-neutral-200 rounded font-mono text-center text-xs focus:border-black focus:bg-white" onfocus="this.select()" onchange="window.app.recalcRowTotal('${c.id}')">
        </td>
        <td>
          <input type="number" step="1" min="0" value="${record.feriados_hs}" id="hf-${c.id}" class="w-20 p-1.5 border border-neutral-200 rounded font-mono text-center text-xs focus:border-black focus:bg-white" onfocus="this.select()" onchange="window.app.recalcRowTotal('${c.id}')">
        </td>
        <td>
          <input type="number" step="1" min="0" value="${record.extras_hs}" id="he-${c.id}" class="w-20 p-1.5 border border-neutral-200 rounded font-mono text-center text-xs focus:border-black focus:bg-white" onfocus="this.select()" onchange="window.app.recalcRowTotal('${c.id}')">
        </td>
        <td>
          <input type="number" step="1" min="0" value="${record.adicionales_hs}" id="ha-${c.id}" class="w-20 p-1.5 border border-neutral-200 rounded font-mono text-center text-xs focus:border-black focus:bg-white" onfocus="this.select()" onchange="window.app.recalcRowTotal('${c.id}')">
        </td>
        <td>
          <input type="text" value="${record.detalle_cobertura || ''}" id="dc-${c.id}" placeholder="Ej: Cubre en Maschwitz..." class="w-full min-w-[160px] p-1.5 border border-neutral-200 rounded text-xs focus:border-black focus:bg-white" onfocus="this.select()">
        </td>
        <td class="font-mono font-bold text-sm text-neutral-900" id="total-${c.id}">
          ${totalHs} hs
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function recalcRowTotal(colabId) {
    const hb = Number(document.getElementById(`hb-${colabId}`)?.value) || 0;
    const hf = Number(document.getElementById(`hf-${colabId}`)?.value) || 0;
    const he = Number(document.getElementById(`he-${colabId}`)?.value) || 0;
    const ha = Number(document.getElementById(`ha-${colabId}`)?.value) || 0;
    const totalEl = document.getElementById(`total-${colabId}`);
    if (totalEl) totalEl.textContent = `${hb + hf + he + ha} hs`;
  }

  function saveAllHorasStore() {
    const storeCode = state.currentRole;
    const colabs = state.colaboradoras.filter(c => c.codigo_sucursal === storeCode);
    const listToSave = [...colabs];
    if (storeCode === 'MASCHWITZ') {
      listToSave.push({ id: 'c-martu_masch' });
    }

    listToSave.forEach(c => {
      const hb = Number(document.getElementById(`hb-${c.id}`)?.value) || 0;
      const hf = Number(document.getElementById(`hf-${c.id}`)?.value) || 0;
      const he = Number(document.getElementById(`he-${c.id}`)?.value) || 0;
      const ha = Number(document.getElementById(`ha-${c.id}`)?.value) || 0;
      const dc = document.getElementById(`dc-${c.id}`)?.value.trim() || '';

      const key = `${state.currentPeriod}_${c.id}`;
      state.cierres[key] = {
        horas_base: hb,
        feriados_hs: hf,
        extras_hs: he,
        adicionales_hs: ha,
        detalle_cobertura: dc
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

    showToast('Grilla de horarios guardada y sincronizada.', 'success');
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

  function updateAdminKPIs() {
    const activeColabs = state.colaboradoras.filter(c => (c.estado || 'activa') === 'activa').length;
    const totalColabs = state.colaboradoras.length;
    document.getElementById('kpi-colabs').textContent = `${activeColabs} / ${totalColabs}`;

    let totalHoras = 0;
    Object.keys(state.cierres).forEach(k => {
      if (k.startsWith(state.currentPeriod)) {
        const c = state.cierres[k];
        totalHoras += (Number(c.horas_base) || 0) + (Number(c.feriados_hs) || 0) + (Number(c.extras_hs) || 0) + (Number(c.adicionales_hs) || 0);
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

  // --- HELPER: OBTENER CLAVES CONSOLIDADAS DEL PERÍODO (ORDEN TOM PRIMERO, LUEGO MASCHWITZ) ---
  function getConsolidadoKeysForPeriod(period) {
    let keys = Object.keys(state.cierres).filter(k => k.startsWith(period));
    if (keys.length === 0) {
      // Si no hay cierres registrados aún para este período, inicializamos con las colaboradoras activas
      const tomColabs = state.colaboradoras.filter(c => c.codigo_sucursal === 'TOM' && (c.estado || 'activa') === 'activa');
      const maschColabs = state.colaboradoras.filter(c => c.codigo_sucursal === 'MASCHWITZ' && (c.estado || 'activa') === 'activa');
      tomColabs.forEach(c => {
        const k = `${period}_${c.id}`;
        if (!state.cierres[k]) state.cierres[k] = { horas_base: 0, feriados_hs: 0, extras_hs: 0, adicionales_hs: 0, detalle_cobertura: '' };
        keys.push(k);
      });
      maschColabs.forEach(c => {
        const k = `${period}_${c.id}`;
        if (!state.cierres[k]) state.cierres[k] = { horas_base: 0, feriados_hs: 0, extras_hs: 0, adicionales_hs: 0, detalle_cobertura: '' };
        keys.push(k);
      });
      const maschCovKey = `${period}_c-martu_masch`;
      if (!state.cierres[maschCovKey]) state.cierres[maschCovKey] = { horas_base: 0, feriados_hs: 0, extras_hs: 0, adicionales_hs: 0, detalle_cobertura: 'Cubre en Maschwitz' };
      keys.push(maschCovKey);
    }

    // Ordenar: primero TOM, luego MASCHWITZ, coberturas al final de la sucursal
    return keys.sort((a, b) => {
      const colabIdA = a.replace(`${period}_`, '');
      const colabIdB = b.replace(`${period}_`, '');
      const isCovA = colabIdA === 'c-martu_masch';
      const isCovB = colabIdB === 'c-martu_masch';
      const sucursalA = isCovA ? 'MASCHWITZ' : (state.colaboradoras.find(c => c.id === colabIdA)?.codigo_sucursal || 'TOM');
      const sucursalB = isCovB ? 'MASCHWITZ' : (state.colaboradoras.find(c => c.id === colabIdB)?.codigo_sucursal || 'TOM');

      if (sucursalA !== sucursalB) {
        return sucursalA === 'TOM' ? -1 : 1;
      }
      if (isCovA) return 1;
      if (isCovB) return -1;
      const nameA = state.colaboradoras.find(c => c.id === colabIdA)?.nombre_completo || '';
      const nameB = state.colaboradoras.find(c => c.id === colabIdB)?.nombre_completo || '';
      return nameA.localeCompare(nameB);
    });
  }

  // --- ADMIN 1: CONSOLIDADO DE HORAS (EDITABLE POR ADMIN) ---
  function renderAdminConsolidado() {
    const tbody = document.getElementById('tbody-admin-consolidado');
    tbody.innerHTML = '';

    const allKeys = getConsolidadoKeysForPeriod(state.currentPeriod);
    if (allKeys.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center py-6 text-neutral-400 text-xs">No hay colaboradoras disponibles para este período (${state.currentPeriod}).</td></tr>`;
      return;
    }

    allKeys.forEach(k => {
      const colabId = k.replace(`${state.currentPeriod}_`, '');
      const isMaschCoverage = colabId === 'c-martu_masch';
      const colab = isMaschCoverage ? state.colaboradoras.find(c => c.id === 'c-martu') : state.colaboradoras.find(c => c.id === colabId);
      const sucursal = isMaschCoverage ? 'MASCHWITZ' : (colab?.codigo_sucursal || 'TOM');
      const rec = state.cierres[k] || { horas_base: 0, feriados_hs: 0, extras_hs: 0, adicionales_hs: 0, detalle_cobertura: '' };

      const totalHs = (Number(rec.horas_base) || 0) + (Number(rec.feriados_hs) || 0) + (Number(rec.extras_hs) || 0) + (Number(rec.adicionales_hs) || 0);

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="font-bold text-xs text-neutral-900 whitespace-nowrap">
          <div class="flex items-center gap-1.5">
            <span class="px-1.5 py-0.5 rounded text-[10px] font-bold ${sucursal === 'TOM' ? 'bg-[#E6D5C3] text-neutral-900' : 'bg-neutral-800 text-white'}">${sucursal}</span>
            <span>${isMaschCoverage ? 'Martu P. (Cubre Masch)' : (colab?.nombre_completo || 'Colaboradora')}</span>
          </div>
        </td>
        <td class="text-center">
          <input type="number" min="0" step="1" value="${rec.horas_base || 0}" 
            onfocus="this.select()"
            onchange="window.app.handleAdminUpdateCierre('${k}', 'horas_base', this.value)"
            class="w-16 text-center text-xs py-1 px-1 rounded bg-[#FAF9F6] border border-neutral-300 font-mono font-bold focus:bg-white focus:border-black focus:outline-none transition">
        </td>
        <td class="text-center">
          <input type="number" min="0" step="1" value="${rec.feriados_hs || 0}" 
            onfocus="this.select()"
            onchange="window.app.handleAdminUpdateCierre('${k}', 'feriados_hs', this.value)"
            class="w-14 text-center text-xs py-1 px-1 rounded bg-[#FAF9F6] border border-neutral-300 font-mono font-bold focus:bg-white focus:border-black focus:outline-none transition">
        </td>
        <td class="text-center">
          <input type="number" min="0" step="1" value="${rec.extras_hs || 0}" 
            onfocus="this.select()"
            onchange="window.app.handleAdminUpdateCierre('${k}', 'extras_hs', this.value)"
            class="w-14 text-center text-xs py-1 px-1 rounded bg-[#FAF9F6] border border-neutral-300 font-mono font-bold focus:bg-white focus:border-black focus:outline-none transition">
        </td>
        <td class="text-center">
          <input type="number" min="0" step="1" value="${rec.adicionales_hs || 0}" 
            onfocus="this.select()"
            onchange="window.app.handleAdminUpdateCierre('${k}', 'adicionales_hs', this.value)"
            class="w-14 text-center text-xs py-1 px-1 rounded bg-[#FAF9F6] border border-neutral-300 font-mono font-bold text-amber-900 focus:bg-white focus:border-black focus:outline-none transition">
        </td>
        <td>
          <input type="text" value="${rec.detalle_cobertura || ''}" placeholder="Detalle cobertura / motivo..."
            onfocus="this.select()"
            onchange="window.app.handleAdminUpdateCierre('${k}', 'detalle_cobertura', this.value)"
            class="w-full text-xs py-1 px-2.5 rounded bg-[#FAF9F6] border border-neutral-300 focus:bg-white focus:border-black focus:outline-none transition">
        </td>
        <td class="font-mono font-bold text-sm text-neutral-900 text-right pr-4 whitespace-nowrap" id="admin-total-${k}">
          ${totalHs} hs
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function handleAdminUpdateCierre(key, field, val) {
    if (!state.cierres[key]) {
      state.cierres[key] = { horas_base: 0, feriados_hs: 0, extras_hs: 0, adicionales_hs: 0, detalle_cobertura: '' };
    }
    if (field === 'detalle_cobertura') {
      state.cierres[key][field] = val.trim();
    } else {
      state.cierres[key][field] = parseFloat(val) || 0;
    }
    localStorage.setItem('nazaria_cierres_v2', JSON.stringify(state.cierres));

    const rec = state.cierres[key];
    const totalHs = (Number(rec.horas_base) || 0) + (Number(rec.feriados_hs) || 0) + (Number(rec.extras_hs) || 0) + (Number(rec.adicionales_hs) || 0);
    const totalEl = document.getElementById(`admin-total-${key}`);
    if (totalEl) totalEl.textContent = `${totalHs} hs`;

    updateAdminKPIs();
    showToast('Ajuste de horas guardado.', 'success');
  }

  function saveAllHorasAdmin() {
    localStorage.setItem('nazaria_cierres_v2', JSON.stringify(state.cierres));
    updateAdminKPIs();
    showToast('Planilla de horas consolidada y guardada.', 'success');
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

    showToast(`Horarios y directivas de ${storeCode} guardados exitosamente.`, 'success');
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

    // 1. SOLAPA: HORAS DEL MES Y LIQUIDACIÓN
    const rowsHoras = [
      ['NAZARIA - REPORTE MENSUAL PARA LIQUIDACIÓN DE SUELDOS'],
      [`Período: ${state.currentPeriod}`],
      [],
      ['Sucursal', 'Colaboradora', 'DNI', 'Horas Base', 'Feriados (Hs)', 'Horas Extras', 'Horas Adicionales', 'Detalle Coberturas', 'Total Hs Liquidación']
    ];

    const allKeys = getConsolidadoKeysForPeriod(state.currentPeriod);
    allKeys.forEach(k => {
      const colabId = k.replace(`${state.currentPeriod}_`, '');
      const isMaschCoverage = colabId === 'c-martu_masch';
      const colab = isMaschCoverage ? state.colaboradoras.find(c => c.id === 'c-martu') : state.colaboradoras.find(c => c.id === colabId);
      const sucursal = isMaschCoverage ? 'MASCHWITZ' : (colab?.codigo_sucursal || 'TOM');
      const rec = state.cierres[k] || { horas_base: 0, feriados_hs: 0, extras_hs: 0, adicionales_hs: 0, detalle_cobertura: '' };
      const total = (Number(rec.horas_base) || 0) + (Number(rec.feriados_hs) || 0) + (Number(rec.extras_hs) || 0) + (Number(rec.adicionales_hs) || 0);

      rowsHoras.push([
        sucursal,
        isMaschCoverage ? 'Martu P. (Cobertura Masch)' : (colab?.nombre_completo || 'Colaboradora'),
        colab?.dni || '',
        rec.horas_base || 0,
        rec.feriados_hs || 0,
        rec.extras_hs || 0,
        rec.adicionales_hs || 0,
        rec.detalle_cobertura || '',
        total
      ]);
    });
    const wsHoras = XLSX.utils.aoa_to_sheet(rowsHoras);
    XLSX.utils.book_append_sheet(wb, wsHoras, 'Horas_Liquidacion');

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
  // EXPORTACIÓN DE IMAGEN PARA WHATSAPP / LIQUIDADOR (HTML2CANVAS)
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
    const vacPeriod = state.novedades.filter(n => n.tipo === 'Vacaciones' && (
      (n.fecha_inicio && n.fecha_inicio.startsWith(currentPeriod)) ||
      (n.fecha_fin && n.fecha_fin.startsWith(currentPeriod))
    ));
    vacPeriod.sort((a, b) => (a.fecha_inicio || '').localeCompare(b.fecha_inicio || ''));

    const novedadesPeriod = state.novedades.filter(n => n.tipo !== 'Vacaciones' && (
      (n.fecha_inicio && n.fecha_inicio.startsWith(currentPeriod)) ||
      (n.creado_en && n.creado_en.startsWith(currentPeriod))
    ));
    novedadesPeriod.sort((a, b) => (a.fecha_inicio || '').localeCompare(b.fecha_inicio || ''));

    let totalHorasRed = 0;
    let totalBaseRed = 0;
    let totalFeriadosRed = 0;
    let totalExtrasRed = 0;
    let totalAdicRed = 0;

    const horasRowsHtml = allKeys.map(k => {
      const colabId = k.replace(`${currentPeriod}_`, '');
      const isMaschCoverage = colabId === 'c-martu_masch';
      const colab = isMaschCoverage ? state.colaboradoras.find(c => c.id === 'c-martu') : state.colaboradoras.find(c => c.id === colabId);
      const sucursal = isMaschCoverage ? 'MASCHWITZ' : (colab?.codigo_sucursal || 'TOM');
      const rec = state.cierres[k] || { horas_base: 0, feriados_hs: 0, extras_hs: 0, adicionales_hs: 0, detalle_cobertura: '' };

      const b = Number(rec.horas_base) || 0;
      const f = Number(rec.feriados_hs) || 0;
      const ex = Number(rec.extras_hs) || 0;
      const ad = Number(rec.adicionales_hs) || 0;
      const tot = b + f + ex + ad;

      totalBaseRed += b;
      totalFeriadosRed += f;
      totalExtrasRed += ex;
      totalAdicRed += ad;
      totalHorasRed += tot;

      return `
        <tr style="border-bottom: 1px solid #e2e8f0; font-size: 13px;">
          <td style="padding: 9px 10px;">
            <span style="background: ${sucursal === 'TOM' ? '#E6D5C3' : '#0f172a'}; color: ${sucursal === 'TOM' ? '#1e1e1e' : '#ffffff'}; padding: 2px 7px; border-radius: 4px; font-size: 10px; font-weight: 800;">${sucursal}</span>
          </td>
          <td style="padding: 9px 10px; font-weight: 700; color: #0f172a;">
            <div>${isMaschCoverage ? 'Martu P. (Cubre Masch)' : (colab?.nombre_completo || 'Colaboradora')}</div>
            ${colab?.dni ? `<div style="font-size: 10px; color: #64748b; font-family: monospace; font-weight: normal; margin-top: 1px;">DNI ${colab.dni}</div>` : ''}
          </td>
          <td style="padding: 9px 10px; text-align: center; font-family: monospace; font-size: 13px;">${b}</td>
          <td style="padding: 9px 10px; text-align: center; font-family: monospace; font-size: 13px;">${f}</td>
          <td style="padding: 9px 10px; text-align: center; font-family: monospace; font-size: 13px;">${ex}</td>
          <td style="padding: 9px 10px; text-align: center; font-family: monospace; font-size: 13px; font-weight: 800; color: #92400e;">${ad}</td>
          <td style="padding: 9px 10px; font-size: 12px; color: #475569;">${rec.detalle_cobertura || '-'}</td>
          <td style="padding: 9px 10px; text-align: right; font-weight: 800; font-family: monospace; font-size: 14px; color: #0f172a;">${tot} hs</td>
        </tr>
      `;
    }).join('');

    let vacHtml = '<p style="font-size: 12px; color: #94a3b8; font-style: italic; margin: 8px 0;">Sin vacaciones gozadas registradas en este período.</p>';
    if (vacPeriod.length > 0) {
      vacHtml = `
        <table style="width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 12px;">
          <thead>
            <tr style="background: #f1f5f9; border-bottom: 1px solid #cbd5e1; text-align: left; color: #475569; font-size: 11px;">
              <th style="padding: 6px 8px;">Colaboradora</th>
              <th style="padding: 6px 8px;">Sucursal</th>
              <th style="padding: 6px 8px;">Tramo Fechas</th>
              <th style="padding: 6px 8px; text-align: center;">Días</th>
              <th style="padding: 6px 8px;">Detalle</th>
            </tr>
          </thead>
          <tbody>
            ${vacPeriod.map(n => {
              const c = state.colaboradoras.find(col => col.id === n.colaboradora_id);
              return `
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 6px 8px; font-weight: 700; color: #0f172a;">${c?.nombre_completo || 'Colaboradora'}</td>
                  <td style="padding: 6px 8px;"><span style="background: ${n.codigo_sucursal === 'TOM' ? '#E6D5C3' : '#0f172a'}; color: ${n.codigo_sucursal === 'TOM' ? '#1e1e1e' : '#ffffff'}; padding: 2px 5px; border-radius: 4px; font-size: 10px; font-weight: bold;">${n.codigo_sucursal}</span></td>
                  <td style="padding: 6px 8px; font-family: monospace; color: #334155;">${formatDateShort(n.fecha_inicio)} al ${formatDateShort(n.fecha_fin)}</td>
                  <td style="padding: 6px 8px; font-weight: bold; text-align: center; color: #065f46; font-size: 13px;">${n.dias_computados}d</td>
                  <td style="padding: 6px 8px; color: #475569;">${n.observaciones || 'Vacaciones anuales'}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    }

    let novsHtml = '<p style="font-size: 12px; color: #94a3b8; font-style: italic; margin: 8px 0;">Sin ausencias ni faltas registradas en este período.</p>';
    if (novedadesPeriod.length > 0) {
      novsHtml = `
        <table style="width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 12px;">
          <thead>
            <tr style="background: #f1f5f9; border-bottom: 1px solid #cbd5e1; text-align: left; color: #475569; font-size: 11px;">
              <th style="padding: 6px 8px;">Colaboradora</th>
              <th style="padding: 6px 8px;">Sucursal</th>
              <th style="padding: 6px 8px;">Tipo</th>
              <th style="padding: 6px 8px;">Rango Fechas</th>
              <th style="padding: 6px 8px; text-align: center;">Días</th>
              <th style="padding: 6px 8px;">Justificación</th>
            </tr>
          </thead>
          <tbody>
            ${novedadesPeriod.map(n => {
              const c = state.colaboradoras.find(col => col.id === n.colaboradora_id);
              const isFalta = n.tipo.toLowerCase().includes('falta') || n.tipo.toLowerCase().includes('injustificada');
              return `
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 6px 8px; font-weight: 700; color: #0f172a;">${c?.nombre_completo || 'Colaboradora'}</td>
                  <td style="padding: 6px 8px;"><span style="background: #e2e8f0; padding: 2px 5px; border-radius: 4px; font-size: 10px; font-weight: bold;">${n.codigo_sucursal}</span></td>
                  <td style="padding: 6px 8px; font-weight: 700; color: ${isFalta ? '#b91c1c' : '#0369a1'};">${n.tipo}</td>
                  <td style="padding: 6px 8px; font-family: monospace; color: #475569;">${formatDateShort(n.fecha_inicio)} al ${formatDateShort(n.fecha_fin)}</td>
                  <td style="padding: 6px 8px; font-weight: bold; text-align: center; color: #0f172a;">${n.dias_computados}d</td>
                  <td style="padding: 6px 8px; color: #334155;">${n.observaciones || '-'}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    }

    const todayStr = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });

    container.innerHTML = `
      <div id="capture-card" style="background: #ffffff; padding: 32px 36px; border: 1px solid #cbd5e1; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; width: 1020px; box-sizing: border-box;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <img src="favicon.png" alt="Nazaria" style="width: 46px; height: 46px; border-radius: 8px; object-fit: contain; border: 1px solid #cbd5e1; background: #ffffff; padding: 2px;">
            <div>
              <h1 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">NAZARIA RETAIL</h1>
              <p style="margin: 2px 0 0; font-size: 13px; color: #64748b; font-weight: 500;">Reporte Oficial de Pre-Liquidación Mensual · TOM & Maschwitz</p>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="background: #E6D5C3; color: #1e1e1e; font-weight: 800; font-size: 13px; padding: 4px 12px; border-radius: 6px; display: inline-block; text-transform: uppercase;">
              Período: ${currentPeriod}
            </div>
            <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Emisión: ${todayStr}</div>
          </div>
        </div>

        <div style="margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <h2 style="margin: 0; font-size: 14px; font-weight: 800; text-transform: uppercase; color: #0f172a;">
              1. Horas Trabajadas a Liquidar
            </h2>
            <span style="font-size: 12px; color: #64748b;">${allKeys.length} colaboradoras registradas</span>
          </div>

          <table style="width: 100%; border-collapse: collapse; border: 1px solid #cbd5e1;">
            <thead>
              <tr style="background: #0f172a; color: #ffffff; font-size: 12px; text-align: left;">
                <th style="padding: 8px 10px; width: 90px;">Sucursal</th>
                <th style="padding: 8px 10px;">Colaboradora & Documento</th>
                <th style="padding: 8px 10px; text-align: center; width: 75px;">Hs Base</th>
                <th style="padding: 8px 10px; text-align: center; width: 75px;">Feriados</th>
                <th style="padding: 8px 10px; text-align: center; width: 75px;">Extras</th>
                <th style="padding: 8px 10px; text-align: center; width: 85px;">Adicionales</th>
                <th style="padding: 8px 10px;">Motivo / Cobertura</th>
                <th style="padding: 8px 10px; text-align: right; width: 100px;">Total Hs</th>
              </tr>
            </thead>
            <tbody>
              ${horasRowsHtml}
              <tr style="background: #f8fafc; border-top: 2px solid #0f172a; font-weight: 800; font-size: 13px;">
                <td colspan="2" style="padding: 10px; text-align: right; text-transform: uppercase;">TOTALES RED:</td>
                <td style="padding: 10px; text-align: center; font-family: monospace;">${totalBaseRed} hs</td>
                <td style="padding: 10px; text-align: center; font-family: monospace;">${totalFeriadosRed} hs</td>
                <td style="padding: 10px; text-align: center; font-family: monospace;">${totalExtrasRed} hs</td>
                <td style="padding: 10px; text-align: center; font-family: monospace; color: #92400e;">${totalAdicRed} hs</td>
                <td style="padding: 10px;"></td>
                <td style="padding: 10px; text-align: right; font-family: monospace; font-size: 15px; color: #0f172a;">${totalHorasRed} hs</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
          <div style="border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; background: #fafafa;">
            <h3 style="margin: 0 0 4px; font-size: 13px; font-weight: 800; text-transform: uppercase; color: #0f172a;">
              2. Vacaciones Gozadas en el Mes
            </h3>
            <p style="margin: 0 0 8px; font-size: 11px; color: #64748b;">Días computados tomados en el período.</p>
            ${vacHtml}
          </div>

          <div style="border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; background: #fafafa;">
            <h3 style="margin: 0 0 4px; font-size: 13px; font-weight: 800; text-transform: uppercase; color: #0f172a; display: flex; align-items: center; justify-content: space-between;">
              <span>3. Novedades, Licencias y Faltas</span>
              <span style="font-size: 10px; background: #fee2e2; color: #991b1b; padding: 2px 6px; border-radius: 4px; font-weight: 700;">Descuentos / Certificados</span>
            </h3>
            <p style="margin: 0 0 8px; font-size: 11px; color: #64748b;">Faltas a descontar y licencias justificadas con certificado médico.</p>
            ${novsHtml}
          </div>
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #64748b;">
          <div>Resumen validado por Administración · Nazaria Retail</div>
          <div style="font-weight: 600;">Documento oficial para liquidación de haberes (Estudio Contable)</div>
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
      const filename = `Liquidacion_Nazaria_${currentPeriod}.png`;

      const modal = document.getElementById('modal-export-image');
      const resultImg = document.getElementById('export-result-img');
      const downloadBtn = document.getElementById('btn-download-image');
      const periodLabel = document.getElementById('export-image-period-label');

      resultImg.src = imgData;
      downloadBtn.href = imgData;
      downloadBtn.download = filename;
      periodLabel.textContent = `Período: ${currentPeriod} · Consolidado Oficial`;

      modal.classList.remove('hidden');

      // Descarga automática directa
      const autoLink = document.createElement('a');
      autoLink.href = imgData;
      autoLink.download = filename;
      autoLink.click();

      showToast('¡Placa descargada y lista para WhatsApp!', 'success');
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
    recalcRowTotal,
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
    saveAllHorasAdmin,
    handleFileSelect,
    removeSelectedFile,
    viewComprobante,
    closeViewerModal,
    toggleColaboradoraEstado,
    openAddColaboradoraModal: () => showToast('Padrón centralizado de colaboradoras.', 'info')
  };

  // Inicializar al cargar el DOM
  document.addEventListener('DOMContentLoaded', () => {
    init();
    setDefaultDates();
  });

})();
