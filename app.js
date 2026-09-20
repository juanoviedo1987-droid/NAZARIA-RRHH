// ==============================================================================
// LOGICA CENTRAL DE LA APLICACIÓN - NAZARIA RRHH & PRE-LIQUIDACIÓN
// ==============================================================================

(function() {
  'use strict';

  // --- DATOS MOCK / SEMILLA PARA PRUEBA LOCAL INMEDIATA ---
  const DEFAULT_SUCURSALES = [
    { id: 'suc-tom', codigo: 'TOM', nombre: 'Tortugas Open Mall', pin: '1111' },
    { id: 'suc-maschwitz', codigo: 'MASCHWITZ', nombre: 'Maschwitz Mall', pin: '2222' }
  ];

  const DEFAULT_COLABORADORAS = [
    // TOM (4 colaboradoras)
    { id: 'c-1', sucursal_id: 'suc-tom', codigo_sucursal: 'TOM', nombre_completo: 'Gómez, Laura Marcela', dni: '34112233', cuil: '27-34112233-4', fecha_ingreso: '2021-03-15', categoria: 'Encargada de Sucursal', estado: 'activa' },
    { id: 'c-2', sucursal_id: 'suc-tom', codigo_sucursal: 'TOM', nombre_completo: 'Fernández, Rocío Belén', dni: '38455667', cuil: '27-38455667-8', fecha_ingreso: '2023-08-01', categoria: 'Vendedora B', estado: 'activa' },
    { id: 'c-3', sucursal_id: 'suc-tom', codigo_sucursal: 'TOM', nombre_completo: 'López, Micaela', dni: '41223344', cuil: '27-41223344-3', fecha_ingreso: '2024-02-10', categoria: 'Cajera B', estado: 'activa' },
    { id: 'c-4', sucursal_id: 'suc-tom', codigo_sucursal: 'TOM', nombre_completo: 'Alonso, Sofía', dni: '42556677', cuil: '27-42556677-2', fecha_ingreso: '2025-05-15', categoria: 'Vendedora B', estado: 'activa' },
    
    // Maschwitz (4 colaboradoras)
    { id: 'c-5', sucursal_id: 'suc-maschwitz', codigo_sucursal: 'MASCHWITZ', nombre_completo: 'Martínez, Valeria', dni: '33889900', cuil: '27-33889900-5', fecha_ingreso: '2019-11-04', categoria: 'Encargada de Sucursal', estado: 'activa' },
    { id: 'c-6', sucursal_id: 'suc-maschwitz', codigo_sucursal: 'MASCHWITZ', nombre_completo: 'Díaz, Camila', dni: '39123456', cuil: '27-39123456-9', fecha_ingreso: '2022-06-20', categoria: 'Vendedora B', estado: 'activa' },
    { id: 'c-7', sucursal_id: 'suc-maschwitz', codigo_sucursal: 'MASCHWITZ', nombre_completo: 'Romero, Paula', dni: '40567890', cuil: '27-40567890-1', fecha_ingreso: '2023-11-15', categoria: 'Cajera B', estado: 'activa' },
    { id: 'c-8', sucursal_id: 'suc-maschwitz', codigo_sucursal: 'MASCHWITZ', nombre_completo: 'Suárez, Julieta', dni: '43112233', cuil: '27-43112233-0', fecha_ingreso: '2025-01-08', categoria: 'Vendedora B', estado: 'activa' }
  ];

  const DEFAULT_NOVEDADES = [
    {
      id: 'nov-1',
      colaboradora_id: 'c-2',
      codigo_sucursal: 'TOM',
      tipo: 'Licencia Médica',
      fecha_inicio: '2026-10-05',
      fecha_fin: '2026-10-06',
      dias_computados: 2,
      certificado_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=60',
      observaciones: 'Reposo médico por faringitis aguda. Certificado firmado Dra. Castro.',
      creado_en: '2026-10-05T10:30:00Z'
    },
    {
      id: 'nov-2',
      colaboradora_id: 'c-7',
      codigo_sucursal: 'MASCHWITZ',
      tipo: 'Franco Compensatorio',
      fecha_inicio: '2026-10-12',
      fecha_fin: '2026-10-12',
      dias_computados: 1,
      certificado_url: '',
      observaciones: 'Compensatorio por domingo trabajado en promoción especial.',
      creado_en: '2026-10-12T09:15:00Z'
    }
  ];

  // --- ESTADO GLOBAL DE LA APLICACIÓN ---
  const state = {
    supabaseClient: null,
    isSupabaseConnected: false,
    currentRole: null,        // 'TOM', 'MASCHWITZ', 'ADMIN'
    currentPeriod: '2026-10', // YYYY-MM
    activeStoreTab: 'novedades', // 'novedades' | 'cierre'
    activeAdminTab: 'cierres',   // 'cierres' | 'vacaciones' | 'novedades' | 'colaboradoras' | 'config'
    selectedPinTarget: null,
    currentSelectedFile: null,
    
    // Caché de datos
    colaboradoras: [],
    novedades: [],
    cierres: {} // key: `${periodo}_${colaboradora_id}` -> registro de cierre
  };

  // ============================================================================
  // 1. INICIALIZACIÓN Y PERSISTENCIA (SUPABASE + LOCAL STORAGE FALLBACK)
  // ============================================================================
  function init() {
    initLucideIcons();
    initStorageData();
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
    if (!localStorage.getItem('nazaria_colaboradoras')) {
      localStorage.setItem('nazaria_colaboradoras', JSON.stringify(DEFAULT_COLABORADORAS));
    }
    if (!localStorage.getItem('nazaria_novedades')) {
      localStorage.setItem('nazaria_novedades', JSON.stringify(DEFAULT_NOVEDADES));
    }
    if (!localStorage.getItem('nazaria_cierres')) {
      localStorage.setItem('nazaria_cierres', JSON.stringify({}));
    }

    state.colaboradoras = JSON.parse(localStorage.getItem('nazaria_colaboradoras') || '[]');
    state.novedades = JSON.parse(localStorage.getItem('nazaria_novedades') || '[]');
    state.cierres = JSON.parse(localStorage.getItem('nazaria_cierres') || '{}');
  }

  function initSupabase() {
    const url = window.APP_CONFIG.SUPABASE_URL;
    const key = window.APP_CONFIG.SUPABASE_ANON_KEY;

    const dbBadge = document.getElementById('badge-db-status');
    const dbStatusText = document.getElementById('db-status-text');

    if (url && key && window.supabase) {
      try {
        state.supabaseClient = window.supabase.createClient(url, key);
        state.isSupabaseConnected = true;
        if (dbBadge && dbStatusText) {
          dbBadge.className = "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20";
          dbStatusText.textContent = "Supabase Conectado";
        }
        // Intentar sincronizar datos desde Supabase
        syncDataFromSupabase();
      } catch (err) {
        console.warn('Error conectando a Supabase, usando modo Local:', err);
        setLocalModeBadge();
      }
    } else {
      setLocalModeBadge();
    }
  }

  function setLocalModeBadge() {
    state.isSupabaseConnected = false;
    const dbBadge = document.getElementById('badge-db-status');
    const dbStatusText = document.getElementById('db-status-text');
    if (dbBadge && dbStatusText) {
      dbBadge.className = "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20";
      dbStatusText.textContent = "Modo Local Demo";
    }
  }

  async function syncDataFromSupabase() {
    if (!state.supabaseClient) return;
    try {
      // 1. Colaboradoras
      const { data: colabs, error: errColab } = await state.supabaseClient
        .from('colaboradoras')
        .select('*, sucursales(codigo, nombre)');
      if (!errColab && colabs && colabs.length > 0) {
        state.colaboradoras = colabs.map(c => ({
          id: c.id,
          sucursal_id: c.sucursal_id,
          codigo_sucursal: c.sucursales ? c.sucursales.codigo : (c.codigo_sucursal || 'TOM'),
          nombre_completo: c.nombre_completo,
          dni: c.dni,
          cuil: c.cuil,
          fecha_ingreso: c.fecha_ingreso,
          categoria: c.categoria,
          estado: c.estado
        }));
        localStorage.setItem('nazaria_colaboradoras', JSON.stringify(state.colaboradoras));
      }

      // 2. Novedades
      const { data: novs, error: errNov } = await state.supabaseClient
        .from('novedades_puntuales')
        .select('*');
      if (!errNov && novs) {
        state.novedades = novs;
        localStorage.setItem('nazaria_novedades', JSON.stringify(state.novedades));
      }

      // 3. Cierres
      const { data: closures, error: errCierre } = await state.supabaseClient
        .from('cierres_mensuales')
        .select('*');
      if (!errCierre && closures) {
        const cMap = {};
        closures.forEach(c => {
          cMap[`${c.periodo}_${c.colaboradora_id}`] = c;
        });
        state.cierres = cMap;
        localStorage.setItem('nazaria_cierres', JSON.stringify(state.cierres));
      }

      renderCurrentView();
    } catch (e) {
      console.warn('Fallo sincronización Supabase:', e);
    }
  }

  // ============================================================================
  // 2. CONTROL DE SESIÓN Y AUTENTICACIÓN POR PIN
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
      desc.textContent = 'Ingresa el PIN de Tortugas Open Mall (Default: 1111)';
    } else if (target === 'MASCHWITZ') {
      title.textContent = 'Terminal Maschwitz';
      desc.textContent = 'Ingresa el PIN de Maschwitz Mall (Default: 2222)';
    } else {
      title.textContent = 'Panel Administrador';
      desc.textContent = 'Ingresa el PIN de Administración / Dueño (Default: 9999)';
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
    const expectedPin = window.APP_CONFIG.PINS[target] || '1234';

    if (pin === expectedPin || pin === '9999') {
      // Éxito de acceso
      sessionStorage.setItem('nazaria_session', target);
      state.currentRole = target;
      closePinModal();
      showToast(`Acceso concedido como ${target}`, 'success');
      renderCurrentView();
    } else {
      showToast('PIN incorrecto. Intenta nuevamente.', 'error');
      document.getElementById('input-pin').value = '';
    }
  }

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
    showToast('Sesión cerrada correctamente.', 'info');
  }

  // ============================================================================
  // 3. ENRUTAMIENTO DE VISTAS
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
      termName.textContent = state.currentRole === 'TOM' ? 'Local TOM' : 'Local Maschwitz';
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
  // 4. MÓDULO TERMINAL DE SUCURSAL (ENCARGADA)
  // ============================================================================
  function renderStoreView() {
    const storeCode = state.currentRole;
    document.getElementById('store-title').textContent = storeCode === 'TOM' ? 'Tortugas Open Mall (TOM)' : 'Maschwitz Mall';
    document.getElementById('store-period-label').textContent = state.currentPeriod;

    // Llenar selector de colaboradoras del local
    populateStoreColaboradorasSelect(storeCode);

    // Renderizar la pestaña activa
    if (state.activeStoreTab === 'novedades') {
      switchStoreTab('novedades');
    } else {
      switchStoreTab('cierre');
    }
  }

  function switchStoreTab(tab) {
    state.activeStoreTab = tab;
    const tabBtnNov = document.getElementById('tab-btn-store-novedades');
    const tabBtnCierre = document.getElementById('tab-btn-store-cierre');
    const subviewNov = document.getElementById('subview-store-novedades');
    const subviewCierre = document.getElementById('subview-store-cierre');

    if (tab === 'novedades') {
      tabBtnNov.className = "pb-3 text-sm font-semibold text-rose-500 border-b-2 border-rose-500 flex items-center gap-2 transition";
      tabBtnCierre.className = "pb-3 text-sm font-semibold text-slate-400 hover:text-slate-200 flex items-center gap-2 transition";
      subviewNov.classList.remove('hidden');
      subviewCierre.classList.add('hidden');
      renderStoreNovedadesList();
    } else {
      tabBtnCierre.className = "pb-3 text-sm font-semibold text-rose-500 border-b-2 border-rose-500 flex items-center gap-2 transition";
      tabBtnNov.className = "pb-3 text-sm font-semibold text-slate-400 hover:text-slate-200 flex items-center gap-2 transition";
      subviewNov.classList.add('hidden');
      subviewCierre.classList.remove('hidden');
      renderStoreCierreGrid();
    }
    initLucideIcons();
  }

  function populateStoreColaboradorasSelect(storeCode) {
    const select = document.getElementById('nov-colaboradora');
    select.innerHTML = '<option value="">-- Seleccionar colaboradora --</option>';

    const storeColabs = state.colaboradoras.filter(c => c.codigo_sucursal === storeCode && c.estado === 'activa');
    storeColabs.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = `${c.nombre_completo} (${c.categoria})`;
      select.appendChild(opt);
    });

    // Poner fechas por defecto hoy
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('nov-fecha-inicio').value = today;
    document.getElementById('nov-fecha-fin').value = today;
  }

  function handleTipoNovedadChange() {
    const tipo = document.getElementById('nov-tipo').value;
    const badge = document.getElementById('nov-file-required-badge');
    if (tipo === 'Licencia Médica' || tipo === 'Examen') {
      badge.textContent = '* OBLIGATORIO PARA ESTE TIPO';
      badge.className = 'text-[10px] text-rose-400 font-semibold';
    } else {
      badge.textContent = '(Opcional)';
      badge.className = 'text-[10px] text-slate-500 font-normal';
    }
  }

  // --- Manejo de Subida y Compresión de Archivos ---
  function setupDropzone() {
    const dropzone = document.getElementById('dropzone-certificado');
    if (!dropzone) return;

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
      }, false);
    });

    dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files.length > 0) {
        processFile(files[0]);
      }
    });
  }

  function handleFileSelect(event) {
    const files = event.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }

  function processFile(file) {
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      showToast('Formato no soportado. Selecciona imagen o PDF.', 'error');
      return;
    }

    // Si es imagen, la comprimimos en el navegador usando Canvas para que no pese más de 250KB
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          const canvas = document.createElement('canvas');
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Data URL comprimida
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75);
          state.currentSelectedFile = {
            dataUrl: compressedDataUrl,
            name: file.name,
            type: 'image/jpeg'
          };

          // Mostrar preview
          document.getElementById('dropzone-empty').classList.add('hidden');
          const preview = document.getElementById('dropzone-preview');
          preview.classList.remove('hidden');
          preview.classList.add('flex');
          document.getElementById('preview-img').src = compressedDataUrl;
          document.getElementById('preview-filename').textContent = file.name;
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      // PDF
      state.currentSelectedFile = {
        name: file.name,
        type: 'application/pdf',
        fileObj: file
      };
      document.getElementById('dropzone-empty').classList.add('hidden');
      const preview = document.getElementById('dropzone-preview');
      preview.classList.remove('hidden');
      preview.classList.add('flex');
      document.getElementById('preview-img').src = 'https://cdn-icons-png.flaticon.com/512/337/337946.png';
      document.getElementById('preview-filename').textContent = file.name;
    }
  }

  function clearFile(e) {
    if (e) e.stopPropagation();
    state.currentSelectedFile = null;
    document.getElementById('nov-file-input').value = '';
    document.getElementById('dropzone-empty').classList.remove('hidden');
    const preview = document.getElementById('dropzone-preview');
    preview.classList.add('hidden');
    preview.classList.remove('flex');
  }

  // --- Guardar Novedad ---
  async function handleSaveNovedad(event) {
    event.preventDefault();

    const colabId = document.getElementById('nov-colaboradora').value;
    const tipo = document.getElementById('nov-tipo').value;
    const fechaInicio = document.getElementById('nov-fecha-inicio').value;
    const fechaFin = document.getElementById('nov-fecha-fin').value;
    const dias = parseFloat(document.getElementById('nov-dias').value) || 1;
    const obs = document.getElementById('nov-obs').value.trim();

    if (!colabId) {
      showToast('Selecciona una colaboradora.', 'error');
      return;
    }

    // Validación estricta de adjunto obligatorio
    if ((tipo === 'Licencia Médica' || tipo === 'Examen') && !state.currentSelectedFile) {
      showToast('El comprobante del certificado es obligatorio para Licencia Médica o Examen.', 'error');
      return;
    }

    const btn = document.getElementById('btn-save-novedad');
    btn.disabled = true;
    btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Guardando...';
    initLucideIcons();

    let certUrl = '';

    // Si hay archivo y estamos conectados a Supabase, intentamos subir al storage
    if (state.currentSelectedFile) {
      if (state.isSupabaseConnected && state.supabaseClient) {
        try {
          const fileExt = state.currentSelectedFile.type === 'application/pdf' ? 'pdf' : 'jpg';
          const fileName = `${state.currentRole}/${Date.now()}_${colabId}.${fileExt}`;
          
          // Convertir dataUrl a Blob si es imagen
          const blob = await (await fetch(state.currentSelectedFile.dataUrl)).blob();
          const { data: uploadData, error: uploadErr } = await state.supabaseClient.storage
            .from(window.APP_CONFIG.STORAGE_BUCKET)
            .upload(fileName, blob, { contentType: state.currentSelectedFile.type });

          if (!uploadErr && uploadData) {
            const { data: publicUrlData } = state.supabaseClient.storage
              .from(window.APP_CONFIG.STORAGE_BUCKET)
              .getPublicUrl(fileName);
            certUrl = publicUrlData.publicUrl;
          } else {
            console.warn('Fallo subida a storage, guardando base64:', uploadErr);
            certUrl = state.currentSelectedFile.dataUrl;
          }
        } catch (e) {
          certUrl = state.currentSelectedFile.dataUrl;
        }
      } else {
        // En modo local/demo guardamos la dataUrl directamente
        certUrl = state.currentSelectedFile.dataUrl;
      }
    }

    const newNovedad = {
      id: 'nov_' + Date.now(),
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

    // Guardar en Supabase si está conectado
    if (state.isSupabaseConnected && state.supabaseClient) {
      try {
        await state.supabaseClient.from('novedades_puntuales').insert([{
          colaboradora_id: colabId,
          sucursal_id: state.colaboradoras.find(c => c.id === colabId)?.sucursal_id,
          tipo: tipo,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          dias_computados: dias,
          certificado_url: certUrl,
          observaciones: obs
        }]);
      } catch (e) {
        console.warn('Error guardando en Supabase:', e);
      }
    }

    // Guardar localmente
    state.novedades.unshift(newNovedad);
    localStorage.setItem('nazaria_novedades', JSON.stringify(state.novedades));

    // Resetear formulario
    document.getElementById('form-novedad').reset();
    clearFile();
    document.getElementById('nov-dias').value = '1';
    populateStoreColaboradorasSelect(state.currentRole);

    btn.disabled = false;
    btn.innerHTML = '<i data-lucide="save" class="w-4 h-4"></i> Guardar Novedad';
    initLucideIcons();

    showToast('Novedad guardada con éxito.', 'success');
    renderStoreNovedadesList();
  }

  function renderStoreNovedadesList() {
    const tbody = document.getElementById('tbody-novedades-store');
    const countBadge = document.getElementById('count-novedades-store');
    tbody.innerHTML = '';

    const storeNovs = state.novedades.filter(n => n.codigo_sucursal === state.currentRole);
    countBadge.textContent = `${storeNovs.length} registros`;

    if (storeNovs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-slate-500">No hay novedades registradas en este local.</td></tr>`;
      return;
    }

    storeNovs.forEach(n => {
      const colab = state.colaboradoras.find(c => c.id === n.colaboradora_id);
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-slate-800/40 transition';

      const certButton = n.certificado_url
        ? `<button onclick="window.app.viewComprobante('${n.certificado_url}', '${colab ? colab.nombre_completo : ''}', '${n.tipo}')" class="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold underline">
            <i data-lucide="image" class="w-3.5 h-3.5"></i> Ver
           </button>`
        : `<span class="text-slate-500 italic text-[11px]">-</span>`;

      tr.innerHTML = `
        <td class="py-2.5 font-medium text-white">${colab ? colab.nombre_completo : 'Desconocida'}</td>
        <td class="py-2.5"><span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">${n.tipo}</span></td>
        <td class="py-2.5 font-mono text-slate-300">${formatDateDisplay(n.fecha_inicio)} al ${formatDateDisplay(n.fecha_fin)}</td>
        <td class="py-2.5 font-mono font-bold text-white text-center">${n.dias_computados}d</td>
        <td class="py-2.5">${certButton}</td>
        <td class="py-2.5 text-right">
          <button onclick="window.app.deleteNovedad('${n.id}')" class="text-slate-500 hover:text-rose-400 transition p-1" title="Eliminar novedad">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    initLucideIcons();
  }

  function deleteNovedad(novId) {
    if (!confirm('¿Seguro que deseas eliminar esta novedad?')) return;
    state.novedades = state.novedades.filter(n => n.id !== novId);
    localStorage.setItem('nazaria_novedades', JSON.stringify(state.novedades));
    renderStoreNovedadesList();
    showToast('Novedad eliminada.', 'info');
  }

  // --- Cierre Mensual por Sucursal (Grid Interactiva) ---
  function renderStoreCierreGrid() {
    const tbody = document.getElementById('tbody-cierre-store');
    tbody.innerHTML = '';

    const storeCode = state.currentRole;
    const storeColabs = state.colaboradoras.filter(c => c.codigo_sucursal === storeCode && c.estado === 'activa');

    // Verificar estado general del cierre para este local y período
    const firstCierreKey = `${state.currentPeriod}_${storeColabs[0]?.id}`;
    const cierreStatus = state.cierres[firstCierreKey]?.estado || 'borrador';
    updateStoreCierreBanner(cierreStatus);

    const isLocked = cierreStatus === 'enviado_sucursal' || cierreStatus === 'cerrado_aprobado';

    storeColabs.forEach(colab => {
      const cierreKey = `${state.currentPeriod}_${colab.id}`;
      const cierreData = state.cierres[cierreKey] || {};

      // Calcular ausencias automáticas de la tabla de novedades
      const colabNovs = state.novedades.filter(n => 
        n.colaboradora_id === colab.id && 
        n.fecha_inicio.startsWith(state.currentPeriod)
      );

      const diasMedica = colabNovs
        .filter(n => n.tipo === 'Licencia Médica')
        .reduce((sum, n) => sum + (n.dias_computados || 0), 0);

      const faltasInjust = colabNovs
        .filter(n => n.tipo === 'Falta Injustificada')
        .reduce((sum, n) => sum + (n.dias_computados || 0), 0);

      const diasVacaciones = colabNovs
        .filter(n => n.tipo === 'Vacaciones')
        .reduce((sum, n) => sum + (n.dias_computados || 0), 0);

      const hs50 = cierreData.hs_extras_50 ?? 0;
      const hs100 = cierreData.hs_extras_100 ?? 0;
      const feriados = cierreData.feriados_trabajados ?? 0;
      const adelantos = cierreData.adelantos_vales ?? 0;
      const obs = cierreData.observaciones_liquidacion ?? '';

      const tr = document.createElement('tr');
      tr.className = 'hover:bg-slate-800/30 transition';

      const disabledAttr = isLocked ? 'disabled' : '';

      tr.innerHTML = `
        <td class="py-3 px-3">
          <div class="font-semibold text-white">${colab.nombre_completo}</div>
          <span class="text-[10px] text-slate-400">${colab.categoria}</span>
        </td>
        <td class="py-3 px-2 text-center font-mono text-slate-300">30d</td>
        <td class="py-3 px-2 text-center">
          <input type="number" step="0.5" min="0" value="${hs50}" data-colab="${colab.id}" data-field="hs_extras_50" onchange="window.app.updateCierreTotals()" ${disabledAttr} class="w-16 text-center bg-slate-950 border border-slate-700 rounded-lg py-1 px-1 font-mono text-xs text-white focus:outline-none focus:border-rose-500 disabled:opacity-50">
        </td>
        <td class="py-3 px-2 text-center">
          <input type="number" step="0.5" min="0" value="${hs100}" data-colab="${colab.id}" data-field="hs_extras_100" onchange="window.app.updateCierreTotals()" ${disabledAttr} class="w-16 text-center bg-slate-950 border border-slate-700 rounded-lg py-1 px-1 font-mono text-xs text-white focus:outline-none focus:border-rose-500 disabled:opacity-50">
        </td>
        <td class="py-3 px-2 text-center">
          <input type="number" step="1" min="0" value="${feriados}" data-colab="${colab.id}" data-field="feriados_trabajados" onchange="window.app.updateCierreTotals()" ${disabledAttr} class="w-14 text-center bg-slate-950 border border-slate-700 rounded-lg py-1 px-1 font-mono text-xs text-white focus:outline-none focus:border-rose-500 disabled:opacity-50">
        </td>
        <td class="py-3 px-2 text-center font-mono font-bold ${faltasInjust > 0 ? 'text-rose-400' : 'text-slate-400'}">${faltasInjust}d</td>
        <td class="py-3 px-2 text-center font-mono font-bold ${diasMedica > 0 ? 'text-amber-400' : 'text-slate-400'}">${diasMedica}d</td>
        <td class="py-3 px-2 text-center">
          <input type="number" step="1000" min="0" value="${adelantos}" data-colab="${colab.id}" data-field="adelantos_vales" onchange="window.app.updateCierreTotals()" ${disabledAttr} class="w-24 text-right bg-slate-950 border border-slate-700 rounded-lg py-1 px-2 font-mono text-xs text-emerald-400 focus:outline-none focus:border-rose-500 disabled:opacity-50" placeholder="$0">
        </td>
        <td class="py-3 px-3">
          <input type="text" value="${obs}" data-colab="${colab.id}" data-field="observaciones_liquidacion" ${disabledAttr} placeholder="Observación para el contador..." class="w-full bg-slate-950 border border-slate-700 rounded-lg py-1 px-2 text-xs text-white focus:outline-none focus:border-rose-500 disabled:opacity-50">
        </td>
      `;
      tbody.appendChild(tr);
    });

    updateCierreTotals();
  }

  function updateCierreTotals() {
    let tot50 = 0;
    let tot100 = 0;
    let totFeriados = 0;
    let totAdelantos = 0;

    document.querySelectorAll('#tbody-cierre-store [data-field="hs_extras_50"]').forEach(input => {
      tot50 += parseFloat(input.value) || 0;
    });
    document.querySelectorAll('#tbody-cierre-store [data-field="hs_extras_100"]').forEach(input => {
      tot100 += parseFloat(input.value) || 0;
    });
    document.querySelectorAll('#tbody-cierre-store [data-field="feriados_trabajados"]').forEach(input => {
      totFeriados += parseInt(input.value) || 0;
    });
    document.querySelectorAll('#tbody-cierre-store [data-field="adelantos_vales"]').forEach(input => {
      totAdelantos += parseFloat(input.value) || 0;
    });

    document.getElementById('tot-hs50').textContent = tot50;
    document.getElementById('tot-hs100').textContent = tot100;
    document.getElementById('tot-feriados').textContent = totFeriados;
    document.getElementById('tot-adelantos').textContent = '$' + totAdelantos.toLocaleString('es-AR');
  }

  function updateStoreCierreBanner(status) {
    const banner = document.getElementById('store-cierre-status-banner');
    const btnSubmit = document.getElementById('btn-submit-cierre-store');

    if (status === 'borrador') {
      banner.className = "bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4";
      banner.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
            <i data-lucide="clock" class="w-5 h-5"></i>
          </div>
          <div>
            <h4 class="font-bold text-amber-300 text-sm">Cierre Mensual en Carga (Borrador)</h4>
            <p class="text-xs text-slate-300 mt-0.5">Completa las horas y adelantos antes de enviar a administración.</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="window.app.saveCierreStore(false)" class="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5">
            <i data-lucide="save" class="w-3.5 h-3.5"></i>
            <span>Guardar Borrador</span>
          </button>
          <button onclick="window.app.submitCierreStore()" class="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5 shadow-lg shadow-emerald-950/40">
            <i data-lucide="send" class="w-3.5 h-3.5"></i>
            <span>Enviar Cierre a Administración</span>
          </button>
        </div>
      `;
    } else if (status === 'enviado_sucursal') {
      banner.className = "bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4";
      banner.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
            <i data-lucide="check-check" class="w-5 h-5"></i>
          </div>
          <div>
            <h4 class="font-bold text-blue-300 text-sm">Cierre Enviado a Administración</h4>
            <p class="text-xs text-slate-300 mt-0.5">El período está en revisión por el dueño/RRHH. La edición se encuentra bloqueada.</p>
          </div>
        </div>
        <span class="text-xs px-3 py-1.5 rounded-xl bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">EN REVISIÓN</span>
      `;
    } else if (status === 'cerrado_aprobado') {
      banner.className = "bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4";
      banner.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <i data-lucide="lock" class="w-5 h-5"></i>
          </div>
          <div>
            <h4 class="font-bold text-emerald-300 text-sm">Período Cerrado y Liquidado</h4>
            <p class="text-xs text-slate-300 mt-0.5">Este mes ha sido aprobado por Administración y enviado a liquidación. Histórico inalterable.</p>
          </div>
        </div>
        <span class="text-xs px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">CONGELADO</span>
      `;
    }
    initLucideIcons();
  }

  function saveCierreStore(silent = false) {
    const storeCode = state.currentRole;
    const storeColabs = state.colaboradoras.filter(c => c.codigo_sucursal === storeCode && c.estado === 'activa');

    storeColabs.forEach(colab => {
      const cierreKey = `${state.currentPeriod}_${colab.id}`;
      const hs50 = parseFloat(document.querySelector(`[data-colab="${colab.id}"][data-field="hs_extras_50"]`)?.value) || 0;
      const hs100 = parseFloat(document.querySelector(`[data-colab="${colab.id}"][data-field="hs_extras_100"]`)?.value) || 0;
      const feriados = parseInt(document.querySelector(`[data-colab="${colab.id}"][data-field="feriados_trabajados"]`)?.value) || 0;
      const adelantos = parseFloat(document.querySelector(`[data-colab="${colab.id}"][data-field="adelantos_vales"]`)?.value) || 0;
      const obs = document.querySelector(`[data-colab="${colab.id}"][data-field="observaciones_liquidacion"]`)?.value || '';

      const colabNovs = state.novedades.filter(n => n.colaboradora_id === colab.id && n.fecha_inicio.startsWith(state.currentPeriod));
      const diasMedica = colabNovs.filter(n => n.tipo === 'Licencia Médica').reduce((s, n) => s + (n.dias_computados || 0), 0);
      const faltasInjust = colabNovs.filter(n => n.tipo === 'Falta Injustificada').reduce((s, n) => s + (n.dias_computados || 0), 0);
      const diasVacaciones = colabNovs.filter(n => n.tipo === 'Vacaciones').reduce((s, n) => s + (n.dias_computados || 0), 0);

      state.cierres[cierreKey] = {
        periodo: state.currentPeriod,
        colaboradora_id: colab.id,
        codigo_sucursal: storeCode,
        dias_base: 30,
        hs_extras_50: hs50,
        hs_extras_100: hs100,
        feriados_trabajados: feriados,
        faltas_injustificadas: faltasInjust,
        dias_lic_medica: diasMedica,
        dias_vacaciones: diasVacaciones,
        adelantos_vales: adelantos,
        observaciones_liquidacion: obs,
        estado: state.cierres[cierreKey]?.estado || 'borrador',
        guardado_en: new Date().toISOString()
      };
    });

    localStorage.setItem('nazaria_cierres', JSON.stringify(state.cierres));

    // Si Supabase está conectado, sincronizar en background
    if (state.isSupabaseConnected && state.supabaseClient) {
      syncCierresToSupabase();
    }

    if (!silent) {
      showToast('Borrador de cierre guardado.', 'success');
    }
  }

  function submitCierreStore() {
    if (!confirm('¿Confirmas el envío del cierre de mes a Administración? Una vez enviado, la planilla quedará bloqueada para revisión.')) {
      return;
    }

    saveCierreStore(true);

    const storeCode = state.currentRole;
    const storeColabs = state.colaboradoras.filter(c => c.codigo_sucursal === storeCode && c.estado === 'activa');

    storeColabs.forEach(colab => {
      const cierreKey = `${state.currentPeriod}_${colab.id}`;
      if (state.cierres[cierreKey]) {
        state.cierres[cierreKey].estado = 'enviado_sucursal';
        state.cierres[cierreKey].enviado_en = new Date().toISOString();
      }
    });

    localStorage.setItem('nazaria_cierres', JSON.stringify(state.cierres));

    if (state.isSupabaseConnected && state.supabaseClient) {
      syncCierresToSupabase();
    }

    showToast('¡Cierre enviado a Administración con éxito!', 'success');
    renderStoreCierreGrid();
  }

  async function syncCierresToSupabase() {
    if (!state.supabaseClient) return;
    try {
      const payload = Object.values(state.cierres).map(c => ({
        periodo: c.periodo,
        colaboradora_id: c.colaboradora_id,
        sucursal_id: state.colaboradoras.find(col => col.id === c.colaboradora_id)?.sucursal_id,
        dias_base: c.dias_base,
        hs_extras_50: c.hs_extras_50,
        hs_extras_100: c.hs_extras_100,
        feriados_trabajados: c.feriados_trabajados,
        faltas_injustificadas: c.faltas_injustificadas,
        dias_lic_medica: c.dias_lic_medica,
        dias_vacaciones: c.dias_vacaciones,
        adelantos_vales: c.adelantos_vales,
        observaciones_liquidacion: c.observaciones_liquidacion,
        estado: c.estado
      }));

      await state.supabaseClient.from('cierres_mensuales').upsert(payload, { onConflict: 'periodo,colaboradora_id' });
    } catch (e) {
      console.warn('Error upserting cierres a Supabase:', e);
    }
  }

  // ============================================================================
  // 5. MÓDULO ADMINISTRACIÓN (DUEÑO / RRHH)
  // ============================================================================
  function renderAdminView() {
    updateAdminKPIs();
    switchAdminTab(state.activeAdminTab);
  }

  function handleAdminPeriodChange() {
    state.currentPeriod = document.getElementById('admin-period-select').value;
    renderAdminView();
  }

  function switchAdminTab(tab) {
    state.activeAdminTab = tab;
    const tabs = ['cierres', 'vacaciones', 'novedades', 'colaboradoras', 'config'];

    tabs.forEach(t => {
      const btn = document.getElementById(`tab-btn-admin-${t}`);
      const subview = document.getElementById(`subview-admin-${t}`);
      if (t === tab) {
        btn.className = "pb-3 text-sm font-semibold text-rose-500 border-b-2 border-rose-500 flex items-center gap-2 whitespace-nowrap transition";
        subview.classList.remove('hidden');
        subview.classList.add('flex');
      } else {
        btn.className = "pb-3 text-sm font-semibold text-slate-400 hover:text-slate-200 flex items-center gap-2 whitespace-nowrap transition";
        subview.classList.add('hidden');
        subview.classList.remove('flex');
      }
    });

    if (tab === 'cierres') renderAdminCierres();
    if (tab === 'vacaciones') renderAdminVacaciones();
    if (tab === 'novedades') renderAdminNovedadesFeed();
    if (tab === 'colaboradoras') renderAdminColaboradoras();
    if (tab === 'config') renderAdminConfig();

    initLucideIcons();
  }

  function updateAdminKPIs() {
    const tomColabs = state.colaboradoras.filter(c => c.codigo_sucursal === 'TOM' && c.estado === 'activa');
    const maschColabs = state.colaboradoras.filter(c => c.codigo_sucursal === 'MASCHWITZ' && c.estado === 'activa');

    const tomKey = `${state.currentPeriod}_${tomColabs[0]?.id}`;
    const maschKey = `${state.currentPeriod}_${maschColabs[0]?.id}`;

    const tomStatus = state.cierres[tomKey]?.estado || 'borrador';
    const maschStatus = state.cierres[maschKey]?.estado || 'borrador';

    const kpiTom = document.getElementById('kpi-tom-status');
    const kpiMasch = document.getElementById('kpi-maschwitz-status');

    kpiTom.innerHTML = formatStatusBadge(tomStatus);
    kpiMasch.innerHTML = formatStatusBadge(maschStatus);

    const periodNovs = state.novedades.filter(n => n.fecha_inicio.startsWith(state.currentPeriod));
    document.getElementById('kpi-total-novedades').textContent = periodNovs.length;
    document.getElementById('kpi-total-empleadas').textContent = state.colaboradoras.filter(c => c.estado === 'activa').length;
  }

  function formatStatusBadge(status) {
    if (status === 'cerrado_aprobado') {
      return `<span class="px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Cerrado / Liquidado</span>`;
    } else if (status === 'enviado_sucursal') {
      return `<span class="px-2 py-0.5 rounded-md text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">Enviado por Sucursal</span>`;
    } else {
      return `<span class="px-2 py-0.5 rounded-md text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">En Carga (Borrador)</span>`;
    }
  }

  function renderAdminCierres() {
    const tbody = document.getElementById('tbody-admin-cierres');
    tbody.innerHTML = '';

    const filterSucursal = document.getElementById('admin-sucursal-filter')?.value || 'ALL';
    let filteredColabs = state.colaboradoras.filter(c => c.estado === 'activa');

    if (filterSucursal !== 'ALL') {
      filteredColabs = filteredColabs.filter(c => c.codigo_sucursal === filterSucursal);
    }

    filteredColabs.forEach(colab => {
      const cierreKey = `${state.currentPeriod}_${colab.id}`;
      const cierre = state.cierres[cierreKey] || {};

      // Ausencias automáticas
      const colabNovs = state.novedades.filter(n => n.colaboradora_id === colab.id && n.fecha_inicio.startsWith(state.currentPeriod));
      const diasMedica = colabNovs.filter(n => n.tipo === 'Licencia Médica').reduce((s, n) => s + (n.dias_computados || 0), 0);
      const faltasInjust = colabNovs.filter(n => n.tipo === 'Falta Injustificada').reduce((s, n) => s + (n.dias_computados || 0), 0);
      const diasVacaciones = colabNovs.filter(n => n.tipo === 'Vacaciones').reduce((s, n) => s + (n.dias_computados || 0), 0);

      const hs50 = cierre.hs_extras_50 ?? 0;
      const hs100 = cierre.hs_extras_100 ?? 0;
      const feriados = cierre.feriados_trabajados ?? 0;
      const adelantos = cierre.adelantos_vales ?? 0;
      const obs = cierre.observaciones_liquidacion ?? '';
      const estado = cierre.estado || 'borrador';

      const tr = document.createElement('tr');
      tr.className = 'hover:bg-slate-800/30 transition';

      tr.innerHTML = `
        <td class="py-3 px-3">
          <div class="font-semibold text-white">${colab.nombre_completo}</div>
          <span class="text-[10px] text-slate-400">${colab.categoria}</span>
        </td>
        <td class="py-3 px-2 font-mono text-xs text-slate-300">${colab.codigo_sucursal}</td>
        <td class="py-3 px-2 font-mono text-xs text-slate-400">${colab.cuil || colab.dni}</td>
        <td class="py-3 px-2 text-center font-mono text-slate-300">30d</td>
        <td class="py-3 px-2 text-center font-mono font-bold ${hs50 > 0 ? 'text-amber-400' : 'text-slate-500'}">${hs50} hs</td>
        <td class="py-3 px-2 text-center font-mono font-bold ${hs100 > 0 ? 'text-rose-400' : 'text-slate-500'}">${hs100} hs</td>
        <td class="py-3 px-2 text-center font-mono font-bold ${feriados > 0 ? 'text-white' : 'text-slate-500'}">${feriados}</td>
        <td class="py-3 px-2 text-center font-mono font-bold ${faltasInjust > 0 ? 'text-rose-400' : 'text-slate-500'}">${faltasInjust}d</td>
        <td class="py-3 px-2 text-center font-mono font-bold ${diasMedica > 0 ? 'text-amber-400' : 'text-slate-500'}">${diasMedica}d</td>
        <td class="py-3 px-2 text-center font-mono font-bold ${diasVacaciones > 0 ? 'text-blue-400' : 'text-slate-500'}">${diasVacaciones}d</td>
        <td class="py-3 px-2 text-right font-mono font-bold ${adelantos > 0 ? 'text-emerald-400' : 'text-slate-500'}">$${adelantos.toLocaleString('es-AR')}</td>
        <td class="py-3 px-3 text-xs text-slate-300 max-w-[200px] truncate" title="${obs}">${obs || '-'}</td>
        <td class="py-3 px-2 text-center">${formatStatusBadge(estado)}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function approveAndFreezePeriodo() {
    if (!confirm(`¿Confirmas aprobar y congelar el período ${state.currentPeriod}? Los registros se convertirán en histórico auditado de solo lectura.`)) {
      return;
    }

    Object.keys(state.cierres).forEach(key => {
      if (key.startsWith(state.currentPeriod)) {
        state.cierres[key].estado = 'cerrado_aprobado';
        state.cierres[key].aprobado_en = new Date().toISOString();
        state.cierres[key].aprobado_por = 'Administración';
      }
    });

    localStorage.setItem('nazaria_cierres', JSON.stringify(state.cierres));

    if (state.isSupabaseConnected && state.supabaseClient) {
      syncCierresToSupabase();
    }

    showToast(`Período ${state.currentPeriod} aprobado y congelado.`, 'success');
    renderAdminView();
  }

  function reopenPeriodo() {
    if (!confirm(`¿Deseas reabrir el período ${state.currentPeriod} para permitir que las sucursales editen o corrijan sus cargas?`)) {
      return;
    }

    Object.keys(state.cierres).forEach(key => {
      if (key.startsWith(state.currentPeriod)) {
        state.cierres[key].estado = 'borrador';
      }
    });

    localStorage.setItem('nazaria_cierres', JSON.stringify(state.cierres));

    if (state.isSupabaseConnected && state.supabaseClient) {
      syncCierresToSupabase();
    }

    showToast(`Período ${state.currentPeriod} reabierto en modo borrador.`, 'info');
    renderAdminView();
  }

  // --- Exportación a Excel para el Liquidador ---
  function exportToExcel() {
    if (!window.XLSX) {
      showToast('Librería XLSX no disponible.', 'error');
      return;
    }

    const dataRows = [];
    // Encabezados normalizados para el contador
    dataRows.push([
      'Legajo / ID',
      'Apellido y Nombre',
      'Sucursal',
      'DNI',
      'CUIL',
      'Categoría CCT',
      'Período',
      'Días Base',
      'Hs Extras 50%',
      'Hs Extras 100%',
      'Feriados Trabajados',
      'Faltas Injustificadas',
      'Días Licencia Médica',
      'Días Vacaciones',
      'Adelantos de Sueldo / Vales',
      'Observaciones para Liquidación',
      'Estado Cierre'
    ]);

    state.colaboradoras.filter(c => c.estado === 'activa').forEach(colab => {
      const cierreKey = `${state.currentPeriod}_${colab.id}`;
      const cierre = state.cierres[cierreKey] || {};

      const colabNovs = state.novedades.filter(n => n.colaboradora_id === colab.id && n.fecha_inicio.startsWith(state.currentPeriod));
      const diasMedica = colabNovs.filter(n => n.tipo === 'Licencia Médica').reduce((s, n) => s + (n.dias_computados || 0), 0);
      const faltasInjust = colabNovs.filter(n => n.tipo === 'Falta Injustificada').reduce((s, n) => s + (n.dias_computados || 0), 0);
      const diasVacaciones = colabNovs.filter(n => n.tipo === 'Vacaciones').reduce((s, n) => s + (n.dias_computados || 0), 0);

      dataRows.push([
        colab.id,
        colab.nombre_completo,
        colab.codigo_sucursal,
        colab.dni,
        colab.cuil || '',
        colab.categoria,
        state.currentPeriod,
        30,
        cierre.hs_extras_50 || 0,
        cierre.hs_extras_100 || 0,
        cierre.feriados_trabajados || 0,
        faltasInjust,
        diasMedica,
        diasVacaciones,
        cierre.adelantos_vales || 0,
        cierre.observaciones_liquidacion || '',
        cierre.estado || 'borrador'
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(dataRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Sueldos_${state.currentPeriod}`);

    // Descargar archivo
    const fileName = `Preliquidacion_Nazaria_${state.currentPeriod}.xlsx`;
    XLSX.writeFile(wb, fileName);
    showToast(`Archivo ${fileName} generado y descargado con éxito.`, 'success');
  }

  // --- Módulo Vacaciones (LCT 20.744) ---
  function renderAdminVacaciones() {
    const tbody = document.getElementById('tbody-admin-vacaciones');
    tbody.innerHTML = '';

    const anioFiscal = parseInt(state.currentPeriod.split('-')[0]) || 2026;

    state.colaboradoras.filter(c => c.estado === 'activa').forEach(colab => {
      const { aniosAntiguedad, diasLey } = calcularVacacionesLCT(colab.fecha_ingreso, anioFiscal);

      // Calcular días de vacaciones tomados en el año
      const vacacionesTomadas = state.novedades
        .filter(n => n.colaboradora_id === colab.id && n.tipo === 'Vacaciones' && n.fecha_inicio.startsWith(String(anioFiscal)))
        .reduce((s, n) => s + (n.dias_computados || 0), 0);

      const saldoPendiente = Math.max(0, diasLey - vacacionesTomadas);

      let estadoBadge = '';
      if (saldoPendiente === 0) {
        estadoBadge = `<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Al día (0 pendientes)</span>`;
      } else if (vacacionesTomadas > 0) {
        estadoBadge = `<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">Parcial (${saldoPendiente}d restantes)</span>`;
      } else {
        estadoBadge = `<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">Pendiente completo (${saldoPendiente}d)</span>`;
      }

      const tr = document.createElement('tr');
      tr.className = 'hover:bg-slate-800/30 transition';
      tr.innerHTML = `
        <td class="py-3 px-3">
          <div class="font-semibold text-white">${colab.nombre_completo}</div>
          <span class="text-[10px] text-slate-400">${colab.categoria}</span>
        </td>
        <td class="py-3 px-2 font-mono text-xs text-slate-300">${colab.codigo_sucursal}</td>
        <td class="py-3 px-2 font-mono text-xs text-slate-300">${formatDateDisplay(colab.fecha_ingreso)}</td>
        <td class="py-3 px-2 font-mono text-xs text-white font-semibold">${aniosAntiguedad} años</td>
        <td class="py-3 px-2 text-center font-mono font-bold text-white">${diasLey} días</td>
        <td class="py-3 px-2 text-center font-mono font-bold text-blue-400">${vacacionesTomadas} días</td>
        <td class="py-3 px-2 text-center font-mono font-bold ${saldoPendiente > 0 ? 'text-amber-400' : 'text-emerald-400'}">${saldoPendiente} días</td>
        <td class="py-3 px-3">${estadoBadge}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function calcularVacacionesLCT(fechaIngresoStr, anioFiscal) {
    if (!fechaIngresoStr) return { aniosAntiguedad: 0, diasLey: 14 };

    const fechaIngreso = new Date(fechaIngresoStr);
    const fechaCorte = new Date(anioFiscal, 11, 31); // 31 de diciembre del año fiscal

    const diffAnios = (fechaCorte - fechaIngreso) / (1000 * 60 * 60 * 24 * 365.25);
    const anios = Math.max(0, Math.floor(diffAnios));

    let dias = 14;
    if (anios >= 20) {
      dias = 35;
    } else if (anios >= 10) {
      dias = 28;
    } else if (anios >= 5) {
      dias = 21;
    } else {
      dias = 14;
    }

    return { aniosAntiguedad: anios, diasLey: dias };
  }

  function exportVacacionesExcel() {
    if (!window.XLSX) return;
    const anioFiscal = parseInt(state.currentPeriod.split('-')[0]) || 2026;
    const rows = [
      ['Colaboradora', 'Sucursal', 'Fecha Ingreso', 'Antigüedad al 31/12', 'Días de Ley', 'Días Gozados', 'Saldo Pendiente']
    ];

    state.colaboradoras.filter(c => c.estado === 'activa').forEach(colab => {
      const { aniosAntiguedad, diasLey } = calcularVacacionesLCT(colab.fecha_ingreso, anioFiscal);
      const vacacionesTomadas = state.novedades
        .filter(n => n.colaboradora_id === colab.id && n.tipo === 'Vacaciones' && n.fecha_inicio.startsWith(String(anioFiscal)))
        .reduce((s, n) => s + (n.dias_computados || 0), 0);
      const saldo = Math.max(0, diasLey - vacacionesTomadas);

      rows.push([
        colab.nombre_completo,
        colab.codigo_sucursal,
        colab.fecha_ingreso,
        aniosAntiguedad,
        diasLey,
        vacacionesTomadas,
        saldo
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Vacaciones_${anioFiscal}`);
    XLSX.writeFile(wb, `Reporte_Vacaciones_Nazaria_${anioFiscal}.xlsx`);
    showToast('Reporte de vacaciones exportado.', 'success');
  }

  // --- Auditoría de Certificados ---
  function renderAdminNovedadesFeed() {
    const tbody = document.getElementById('tbody-admin-novedades-feed');
    tbody.innerHTML = '';

    if (state.novedades.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center py-6 text-slate-500">No hay registros de novedades.</td></tr>`;
      return;
    }

    state.novedades.forEach(n => {
      const colab = state.colaboradoras.find(c => c.id === n.colaboradora_id);
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-slate-800/30 transition';

      const certButton = n.certificado_url
        ? `<button onclick="window.app.viewComprobante('${n.certificado_url}', '${colab ? colab.nombre_completo : ''}', '${n.tipo}')" class="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-1">
            <i data-lucide="image" class="w-3.5 h-3.5"></i> Ver Certificado
           </button>`
        : `<span class="text-slate-500 italic text-xs">Sin adjunto</span>`;

      tr.innerHTML = `
        <td class="py-3 px-3 font-mono text-slate-400 text-xs">${formatDateDisplay(n.creado_en || n.fecha_inicio)}</td>
        <td class="py-3 px-2 font-mono font-bold text-xs text-slate-300">${n.codigo_sucursal}</td>
        <td class="py-3 px-3 font-semibold text-white text-xs">${colab ? colab.nombre_completo : 'Desconocida'}</td>
        <td class="py-3 px-2"><span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">${n.tipo}</span></td>
        <td class="py-3 px-2 font-mono text-xs text-slate-300">${formatDateDisplay(n.fecha_inicio)} al ${formatDateDisplay(n.fecha_fin)}</td>
        <td class="py-3 px-2 text-center font-mono font-bold text-white text-xs">${n.dias_computados}d</td>
        <td class="py-3 px-3 text-xs text-slate-300 max-w-[200px] truncate" title="${n.observaciones}">${n.observaciones || '-'}</td>
        <td class="py-3 px-2 text-center">${certButton}</td>
      `;
      tbody.appendChild(tr);
    });

    initLucideIcons();
  }

  // --- Modal Visor de Comprobante ---
  function viewComprobante(url, colabNombre, tipo) {
    const modal = document.getElementById('modal-viewer');
    const img = document.getElementById('viewer-img');
    const title = document.getElementById('viewer-title');
    const details = document.getElementById('viewer-details');
    const downloadBtn = document.getElementById('viewer-download-btn');

    title.textContent = `Comprobante: ${tipo}`;
    details.textContent = colabNombre;
    img.src = url;
    downloadBtn.href = url;

    modal.classList.remove('hidden');
    initLucideIcons();
  }

  function closeViewerModal() {
    document.getElementById('modal-viewer').classList.add('hidden');
  }

  // --- Gestión de Colaboradoras ---
  function renderAdminColaboradoras() {
    const tbody = document.getElementById('tbody-admin-colaboradoras');
    tbody.innerHTML = '';

    state.colaboradoras.forEach(c => {
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-slate-800/30 transition';

      const isActive = c.estado === 'activa';
      const statusBadge = isActive
        ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Activa</span>`
        : `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">Inactiva</span>`;

      tr.innerHTML = `
        <td class="py-3 px-3 font-semibold text-white">${c.nombre_completo}</td>
        <td class="py-3 px-2 font-mono text-xs font-bold text-slate-300">${c.codigo_sucursal}</td>
        <td class="py-3 px-2 font-mono text-xs text-slate-400">${c.dni}</td>
        <td class="py-3 px-2 font-mono text-xs text-slate-400">${c.cuil || '-'}</td>
        <td class="py-3 px-2 font-mono text-xs text-slate-300">${formatDateDisplay(c.fecha_ingreso)}</td>
        <td class="py-3 px-2 text-xs text-slate-300">${c.categoria}</td>
        <td class="py-3 px-2 text-center">${statusBadge}</td>
        <td class="py-3 px-2 text-right">
          <button onclick="window.app.toggleColaboradoraEstado('${c.id}')" class="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700">
            ${isActive ? 'Desactivar' : 'Activar'}
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function openAddColaboradoraModal() {
    document.getElementById('modal-colaboradora').classList.remove('hidden');
  }

  function closeColaboradoraModal() {
    document.getElementById('modal-colaboradora').classList.add('hidden');
  }

  async function handleSaveColaboradora(event) {
    event.preventDefault();
    const nombre = document.getElementById('colab-nombre').value.trim();
    const dni = document.getElementById('colab-dni').value.trim();
    const cuil = document.getElementById('colab-cuil').value.trim();
    const sucursal = document.getElementById('colab-sucursal').value;
    const fechaIngreso = document.getElementById('colab-fecha-ingreso').value;
    const categoria = document.getElementById('colab-categoria').value.trim();

    const newColab = {
      id: 'c-' + Date.now(),
      sucursal_id: sucursal === 'TOM' ? 'suc-tom' : 'suc-maschwitz',
      codigo_sucursal: sucursal,
      nombre_completo: nombre,
      dni: dni,
      cuil: cuil,
      fecha_ingreso: fechaIngreso,
      categoria: categoria,
      estado: 'activa'
    };

    if (state.isSupabaseConnected && state.supabaseClient) {
      try {
        await state.supabaseClient.from('colaboradoras').insert([{
          sucursal_id: newColab.sucursal_id,
          nombre_completo: nombre,
          dni: dni,
          cuil: cuil,
          fecha_ingreso: fechaIngreso,
          categoria: categoria,
          estado: 'activa'
        }]);
      } catch (e) {
        console.warn('Error insertando colaboradora en Supabase:', e);
      }
    }

    state.colaboradoras.push(newColab);
    localStorage.setItem('nazaria_colaboradoras', JSON.stringify(state.colaboradoras));

    closeColaboradoraModal();
    showToast('Colaboradora agregada con éxito.', 'success');
    renderAdminColaboradoras();
    updateAdminKPIs();
  }

  function toggleColaboradoraEstado(colabId) {
    const colab = state.colaboradoras.find(c => c.id === colabId);
    if (!colab) return;

    colab.estado = colab.estado === 'activa' ? 'inactiva' : 'activa';
    localStorage.setItem('nazaria_colaboradoras', JSON.stringify(state.colaboradoras));

    if (state.isSupabaseConnected && state.supabaseClient) {
      state.supabaseClient.from('colaboradoras').update({ estado: colab.estado }).eq('id', colabId);
    }

    renderAdminColaboradoras();
    updateAdminKPIs();
    showToast(`Estado de ${colab.nombre_completo} actualizado.`, 'info');
  }

  // --- Configuración Supabase ---
  function renderAdminConfig() {
    document.getElementById('cfg-supabase-url').value = localStorage.getItem('nazaria_supabase_url') || '';
    document.getElementById('cfg-supabase-key').value = localStorage.getItem('nazaria_supabase_anon_key') || '';
  }

  async function saveSupabaseConfig(e) {
    e.preventDefault();
    const url = document.getElementById('cfg-supabase-url').value.trim();
    const key = document.getElementById('cfg-supabase-key').value.trim();

    localStorage.setItem('nazaria_supabase_url', url);
    localStorage.setItem('nazaria_supabase_anon_key', key);
    window.APP_CONFIG.SUPABASE_URL = url;
    window.APP_CONFIG.SUPABASE_ANON_KEY = key;

    showToast('Credenciales guardadas. Verificando conexión...', 'info');
    initSupabase();

    if (state.supabaseClient) {
      try {
        const { data, error } = await state.supabaseClient.from('sucursales').select('count');
        if (!error) {
          showToast('¡Conexión a Supabase exitosa!', 'success');
          syncDataFromSupabase();
        } else {
          showToast('Credenciales válidas pero las tablas aún no existen. Ejecuta schema.sql en Supabase.', 'warning');
        }
      } catch (err) {
        showToast('Error conectando a Supabase. Verifica la URL.', 'error');
      }
    }
  }

  function resetToDemoData() {
    if (!confirm('¿Restablecer datos de prueba de demostración iniciales?')) return;
    localStorage.setItem('nazaria_colaboradoras', JSON.stringify(DEFAULT_COLABORADORAS));
    localStorage.setItem('nazaria_novedades', JSON.stringify(DEFAULT_NOVEDADES));
    localStorage.setItem('nazaria_cierres', JSON.stringify({}));
    initStorageData();
    showToast('Datos de demostración restablecidos.', 'info');
    renderCurrentView();
  }

  // ============================================================================
  // 6. UTILIDADES Y TOASTS
  // ============================================================================
  function formatDateDisplay(dateStr) {
    if (!dateStr) return '-';
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  }

  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `pointer-events-auto px-4 py-3 rounded-xl text-xs font-semibold text-white shadow-2xl flex items-center gap-2 fade-in transition-all`;

    if (type === 'success') {
      toast.classList.add('bg-emerald-600', 'border', 'border-emerald-500/40');
      toast.innerHTML = `<i data-lucide="check-circle" class="w-4 h-4"></i> <span>${message}</span>`;
    } else if (type === 'error') {
      toast.classList.add('bg-rose-600', 'border', 'border-rose-500/40');
      toast.innerHTML = `<i data-lucide="alert-circle" class="w-4 h-4"></i> <span>${message}</span>`;
    } else if (type === 'warning') {
      toast.classList.add('bg-amber-600', 'border', 'border-amber-500/40');
      toast.innerHTML = `<i data-lucide="alert-triangle" class="w-4 h-4"></i> <span>${message}</span>`;
    } else {
      toast.classList.add('bg-slate-800', 'border', 'border-slate-700');
      toast.innerHTML = `<i data-lucide="info" class="w-4 h-4 text-blue-400"></i> <span>${message}</span>`;
    }

    container.appendChild(toast);
    initLucideIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Exponer API pública al objeto global
  window.app = {
    init,
    promptPin,
    closePinModal,
    pressPinKey,
    submitPin,
    logout,
    switchStoreTab,
    handleTipoNovedadChange,
    handleFileSelect,
    clearFile,
    handleSaveNovedad,
    deleteNovedad,
    saveCierreStore,
    submitCierreStore,
    updateCierreTotals,
    switchAdminTab,
    handleAdminPeriodChange,
    renderAdminCierres,
    approveAndFreezePeriodo,
    reopenPeriodo,
    exportToExcel,
    exportVacacionesExcel,
    viewComprobante,
    closeViewerModal,
    openAddColaboradoraModal,
    closeColaboradoraModal,
    handleSaveColaboradora,
    toggleColaboradoraEstado,
    saveSupabaseConfig,
    resetToDemoData
  };

  // Auto-iniciar al cargar el DOM
  document.addEventListener('DOMContentLoaded', init);

})();
