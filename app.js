// ============================================
// KITU v3 - Premium App Store Quality
// 20 Improvements Integrated
// ============================================

const CONFIG = window.store?.CONFIG;
const getActiveSettings = () => window.store?.getActiveSettings();

function formatCurrency(amount) {
    const settings = getActiveSettings();
    if (settings && settings.translations && typeof settings.translations.currency_format === 'function') {
        return settings.translations.currency_format(amount);
    }
    return '$' + amount;
}

// ============================================
// DATA
// ============================================

const SERVICES = [
    { id: 'plumbing', title: 'Fontanería', icon: '🚰', desc: 'Fugas, tuberías y drenaje.', color: '#3b82f6' },
    { id: 'electrician', title: 'Electricidad', icon: '⚡', desc: 'Cortocircuitos y cableado.', color: '#f59e0b' },
    { id: 'construction', title: 'Construcción', icon: '🏗️', desc: 'Albañilería y remodelación.', color: '#ef4444' },
    { id: 'cleaning', title: 'Limpieza', icon: '🧹', desc: 'Hogar y oficinas.', color: '#10b981' },
    { id: 'tech', title: 'Programación', icon: '💻', desc: 'Web, apps y soporte.', color: '#8b5cf6' },
    { id: 'repair', title: 'Reparaciones', icon: '🛠️', desc: 'Línea blanca y muebles.', color: '#ec4899' },
    { id: 'painting', title: 'Pintura', icon: '🎨', desc: 'Interior y exterior.', color: '#06b6d4' },
    { id: 'gardening', title: 'Jardinería', icon: '🌿', desc: 'Poda, riego y diseño.', color: '#22c55e' }
];

const MOCK_PROFESSIONALS = [
    { id: 'pro_001', name: 'Carlos Mendoza', avatar: '👷', professions: ['plumbing', 'repair'], rating: 4.8, totalJobs: 127, ratePerHour: 250, description: 'Fontanero certificado con 10 años de experiencia en instalaciones residenciales.', lat: 19.4326, lng: -99.1332, distance: 1.2 },
    { id: 'pro_002', name: 'Ana García', avatar: '👩‍🔧', professions: ['electrician'], rating: 4.9, totalJobs: 89, ratePerHour: 300, description: 'Ingeniera eléctrica especializada en instalaciones domésticas y comerciales.', lat: 19.4280, lng: -99.1400, distance: 2.1 },
    { id: 'pro_003', name: 'Roberto Jiménez', avatar: '👨‍🏭', professions: ['construction', 'painting'], rating: 4.6, totalJobs: 203, ratePerHour: 350, description: 'Maestro de obra con experiencia en remodelaciones completas y acabados finos.', lat: 19.4350, lng: -99.1250, distance: 0.8 },
    { id: 'pro_004', name: 'María López', avatar: '👩‍💻', professions: ['tech'], rating: 5.0, totalJobs: 45, ratePerHour: 500, description: 'Desarrolladora full-stack. Creo sitios web, apps móviles y automatizaciones.', lat: 19.4400, lng: -99.1500, distance: 3.4 },
    { id: 'pro_005', name: 'José Hernández', avatar: '🧔', professions: ['cleaning', 'gardening'], rating: 4.7, totalJobs: 310, ratePerHour: 180, description: 'Servicio integral de limpieza y mantenimiento de jardines residenciales.', lat: 19.4290, lng: -99.1280, distance: 1.5 },
    { id: 'pro_006', name: 'Luis Ramírez', avatar: '👨‍🔧', professions: ['repair', 'plumbing', 'electrician'], rating: 4.5, totalJobs: 178, ratePerHour: 220, description: 'Técnico multifacético. Reparo electrodomésticos, plomería y electricidad básica.', lat: 19.4310, lng: -99.1380, distance: 1.8 },
    { id: 'pro_007', name: 'Fernanda Torres', avatar: '👩‍🎨', professions: ['painting', 'construction'], rating: 4.9, totalJobs: 67, ratePerHour: 280, description: 'Especialista en pintura decorativa, murales y acabados texturizados.', lat: 19.4370, lng: -99.1420, distance: 2.5 },
    { id: 'pro_008', name: 'Miguel Ángel Ruiz', avatar: '🧑‍🏫', professions: ['tech', 'electrician'], rating: 4.8, totalJobs: 92, ratePerHour: 450, description: 'Ingeniero en sistemas. Redes, cámaras de seguridad e instalaciones inteligentes.', lat: 19.4260, lng: -99.1350, distance: 2.0 }
];

const URGENCY_OPTIONS = [
    { id: 'low', label: 'Puede esperar', icon: '🟢', desc: 'En los próximos días' },
    { id: 'normal', label: 'Normal', icon: '🟡', desc: 'Hoy o mañana' },
    { id: 'urgent', label: 'Urgente', icon: '🔴', desc: 'Lo antes posible' }
];

const STATUS_LABELS = {
    pending: { label: 'Buscando', color: '#f59e0b', icon: '⏳' },
    accepted: { label: 'En camino', color: '#3b82f6', icon: '🚗' },
    in_progress: { label: 'En progreso', color: '#8b5cf6', icon: '🔧' },
    completed: { label: 'Completado', color: '#10b981', icon: '✅' },
    cancelled: { label: 'Cancelado', color: '#ef4444', icon: '❌' }
};

const CHAT_RESPONSES = [
    'Perfecto, voy en camino. Llegaré en unos 15 minutos.',
    '¿Me puedes compartir una foto del problema?',
    'Entendido, llevo todas las herramientas necesarias.',
    'Ya estoy cerca de tu ubicación.',
    'Necesitaré unos materiales adicionales, ¿hay ferretería cerca?',
    'El trabajo tomará aproximadamente 2 horas.',
    'Listo, ya terminé. ¿Podrías revisar que todo quede bien?'
];

// ============================================
// STORE
// ============================================

// El almacén 'store' se carga globalmente a través de window.store en index.html
if (typeof store !== 'undefined') {
    store.subscribe(function(state) {
        // Evitar bucles infinitos de re-renderizado en formularios activos si es necesario
        // Re-renderiza la interfaz para reflejar cambios en tiempo real
        renderShell();
        const currentView = store.get('currentView');
        // No re-renderizar login/register constantemente para no interrumpir la escritura
        if (currentView !== 'login' && currentView !== 'register' && currentView !== 'new-request') {
            renderView(currentView);
        }
    });
}

// ============================================
// [6] TOAST NOTIFICATION SYSTEM
// ============================================

function showToast(message, type) {
    var container = document.getElementById('toast-container');
    if (!container) return;
    var icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = '<span class="toast-icon">' + (icons[type] || icons.info) + '</span><span class="toast-msg">' + message + '</span>';
    container.appendChild(toast);
    setTimeout(function() { toast.classList.add('toast-out'); setTimeout(function() { toast.remove(); }, 300); }, 3000);
}

// ============================================
// [8] BOTTOM SHEET / CONFIRMATION DIALOG
// ============================================

function showConfirm(title, message, confirmText, onConfirm) {
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = '<div class="bottom-sheet"><div class="sheet-handle"></div><h3>' + title + '</h3><p>' + message + '</p><div class="sheet-actions"><button class="btn-danger" id="sheet-confirm">' + confirmText + '</button><button class="btn-secondary full" id="sheet-cancel">Cancelar</button></div></div>';
    document.body.appendChild(overlay);

    overlay.querySelector('#sheet-confirm').addEventListener('click', function() { overlay.remove(); onConfirm(); });
    overlay.querySelector('#sheet-cancel').addEventListener('click', function() { overlay.remove(); });
    overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
}

// ============================================
// [7] SKELETON LOADING
// ============================================

function showSkeleton() {
    viewContainer.innerHTML = '<div class="fade-in"><div class="skeleton skeleton-title"></div><div class="skeleton skeleton-text"></div><div class="skeleton skeleton-text short"></div><div style="margin-top:24px"><div class="skeleton skeleton-card"></div><div class="skeleton skeleton-card"></div></div></div>';
}

// ============================================
// STATUS BAR CLOCK
// ============================================

function updateClock() {
    var el = document.getElementById('status-time');
    if (el) {
        var now = new Date();
        el.textContent = now.toLocaleTimeString(getActiveSettings().locale, { hour: '2-digit', minute: '2-digit', hour12: false });
    }
}
setInterval(updateClock, 30000);
updateClock();

// ============================================
// [3] RIPPLE EFFECT
// ============================================

document.addEventListener('click', function(e) {
    var btn = e.target.closest('.btn-primary, .btn-icon, .nav-item');
    if (!btn) return;
    var ripple = document.createElement('span');
    ripple.className = 'ripple';
    var rect = btn.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    btn.appendChild(ripple);
    setTimeout(function() { ripple.remove(); }, 600);
});

// ============================================
// APP CORE
// ============================================

var viewContainer = document.getElementById('view-container');
var appHeader = document.getElementById('app-header');
var appNav = document.getElementById('app-nav');
var _viewParams = {};
var _prevView = null;

function navigate(viewId, params) {
    _prevView = store.get('currentView');
    _viewParams = params || {};
    store.set('currentView', viewId);
    
    // Cargar mensajes si entramos a un chat en modo Supabase
    if (viewId === 'chat' && params && params.requestId && typeof store !== 'undefined' && store.supabase) {
        store.loadChatMessages(params.requestId);
    }
    
    // Refrescar solicitudes en pantallas clave
    if ((viewId === 'home' || viewId === 'requests') && typeof store !== 'undefined' && store.supabase) {
        store.fetchInitialData();
    }
    
    renderShell();
    renderView(viewId);
    viewContainer.scrollTop = 0;
}

function renderShell() {
    var isLoggedIn = store.get('isLoggedIn');
    var role = store.get('role');
    var unread = store.getUnreadCount();

    if (!isLoggedIn) {
        appHeader.style.display = 'none';
        appNav.style.display = 'none';
        return;
    }

    appHeader.style.display = 'flex';
    appNav.style.display = 'flex';

    appHeader.innerHTML = '<div class="logo-container"><svg viewBox="0 0 100 100" class="logo-k"><path d="M30 20 L30 80 M30 50 L70 20 M30 50 L70 80" stroke="currentColor" stroke-width="8" stroke-linecap="round" fill="none" /></svg><span class="brand-name">Kitu</span></div><div class="header-actions"><button class="btn-icon" onclick="navigate(\'notifications\')" aria-label="Notificaciones"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>' + (unread > 0 ? '<span class="badge">' + (unread > 9 ? '9+' : unread) + '</span>' : '') + '</button><button class="btn-role-toggle" onclick="toggleRole()">' + (role === 'client' ? '⚡ Pro' : '🏠 Cliente') + '</button></div>';

    var currentView = store.get('currentView');
    var navItems = [
        { id: 'home', icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>', label: role === 'client' ? 'Inicio' : 'Panel' },
        { id: 'requests', icon: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line>', label: role === 'client' ? 'Solicitudes' : 'Trabajos' },
        { id: 'map', icon: '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line>', label: 'Mapa' },
        { id: 'profile', icon: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>', label: 'Perfil' }
    ];

    appNav.innerHTML = navItems.map(function(n) {
        return '<button class="nav-item ' + (currentView === n.id ? 'active' : '') + '" onclick="navigate(\'' + n.id + '\')" aria-label="' + n.label + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' + n.icon + '</svg><span>' + n.label + '</span></button>';
    }).join('');
}

function renderView(viewId) {
    var viewMap = {
        login: renderLogin, register: renderRegister, home: renderHome, requests: renderRequests,
        'request-detail': renderRequestDetail, 'new-request': renderNewRequest,
        'select-provider': renderSelectProvider, map: renderMap, profile: renderProfile,
        'edit-profile': renderEditProfile, notifications: renderNotifications, chat: renderChat,
        'rate-service': renderRateService, history: renderHistory, 'provider-detail': renderProviderDetail
    };
    (viewMap[viewId] || renderHome)();
}

// ============================================
// [5] SPLASH SCREEN with delayed init
// ============================================

function splashThenInit() {
    // Dar 800ms para que el cliente de Supabase restaure la sesión de forma transparente
    setTimeout(function() {
        if (store.get('isLoggedIn')) {
            navigate(store.get('currentView') || 'home');
        } else {
            navigate('login');
        }
    }, 800);
}

// ---- LOGIN ----
function renderLogin() {
    viewContainer.innerHTML = '<div class="auth-screen fade-in"><div class="auth-logo"><svg viewBox="0 0 100 100" class="logo-k large"><path d="M30 20 L30 80 M30 50 L70 20 M30 50 L70 80" stroke="currentColor" stroke-width="8" stroke-linecap="round" fill="none" /></svg><h1>Kitu</h1><p>Servicios profesionales a tu puerta</p></div><form id="login-form" class="auth-form"><div class="input-group"><label>Correo o Usuario</label><input type="text" id="login-email" placeholder="tu@correo.com o admin" required autocomplete="username"></div><div class="input-group"><label>Contraseña</label><input type="password" id="login-password" placeholder="••••••••" required autocomplete="current-password"></div><div id="login-error" class="form-error hidden"></div><button type="submit" class="btn-primary">Iniciar Sesión</button></form><p class="auth-switch">¿No tienes cuenta? <a href="#" id="go-register">Crear cuenta gratis</a></p></div>';

    document.getElementById('login-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        var email = document.getElementById('login-email').value;
        var password = document.getElementById('login-password').value;
        
        // Mostrar cargando
        var submitBtn = e.target.querySelector('button[type="submit"]');
        var originalText = submitBtn.textContent;
        submitBtn.textContent = 'Iniciando...';
        submitBtn.disabled = true;

        try {
            var user = await store.login(email, password);
            if (user) { 
                navigate('home'); 
            } else {
                var err = document.getElementById('login-error');
                err.textContent = 'Credenciales incorrectas. Intenta de nuevo.';
                err.classList.remove('hidden');
            }
        } catch (errVal) {
            var err = document.getElementById('login-error');
            err.textContent = errVal.message || 'Error al iniciar sesión.';
            err.classList.remove('hidden');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    document.getElementById('go-register').addEventListener('click', function(e) { e.preventDefault(); navigate('register'); });
}

// ---- REGISTER ----
function renderRegister() {
    var professionsHTML = SERVICES.map(function(s) {
        return '<label class="profession-check"><input type="checkbox" value="' + s.id + '" name="professions"><span>' + s.icon + ' ' + s.title + '</span></label>';
    }).join('');

    viewContainer.innerHTML = '<div class="auth-screen fade-in"><div class="auth-logo small"><svg viewBox="0 0 100 100" class="logo-k medium"><path d="M30 20 L30 80 M30 50 L70 20 M30 50 L70 80" stroke="currentColor" stroke-width="8" stroke-linecap="round" fill="none" /></svg><h2>Crear Cuenta</h2><p>Únete a la comunidad Kitu</p></div><form id="register-form" class="auth-form"><div class="input-group"><label>Nombre completo</label><input type="text" id="reg-name" placeholder="Juan Pérez" required></div><div class="input-group"><label>Correo electrónico</label><input type="email" id="reg-email" placeholder="tu@correo.com" required></div><div class="input-group"><label>Teléfono</label><input type="tel" id="reg-phone" placeholder="' + getActiveSettings().translations.phone_placeholder + '" required></div><div class="input-group"><label>Dirección</label><input type="text" id="reg-address" placeholder="Calle, Colonia, Ciudad" required></div><div class="input-group"><label>Contraseña</label><input type="password" id="reg-password" placeholder="Mínimo 6 caracteres" required minlength="6"></div><div class="input-group"><label>¿Cómo usarás Kitu?</label><div class="role-selector"><button type="button" class="role-option active" data-role="client"><span class="role-icon">🏠</span><span class="role-label">Necesito servicios</span></button><button type="button" class="role-option" data-role="provider"><span class="role-icon">🔧</span><span class="role-label">Soy profesional</span></button></div></div><div id="professions-section" class="hidden"><label>Selecciona tus profesiones</label><div class="professions-grid">' + professionsHTML + '</div><div class="input-group" style="margin-top:12px"><label>Tarifa por hora (' + getActiveSettings().currencySymbol + ' ' + getActiveSettings().currency + ')</label><input type="number" id="reg-rate" placeholder="250" min="50"></div><div class="input-group"><label>Descripción profesional</label><textarea id="reg-desc" placeholder="Describe tu experiencia..." rows="3"></textarea></div></div><button type="submit" class="btn-primary">Crear Cuenta</button></form><p class="auth-switch">¿Ya tienes cuenta? <a href="#" id="go-login">Inicia Sesión</a></p></div>';

    var selectedRole = 'client';
    document.querySelectorAll('.role-option').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.role-option').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            selectedRole = btn.getAttribute('data-role');
            document.getElementById('professions-section').classList.toggle('hidden', selectedRole !== 'provider');
        });
    });

    document.getElementById('register-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        var professions = [];
        if (selectedRole === 'provider') {
            document.querySelectorAll('input[name="professions"]:checked').forEach(function(cb) { professions.push(cb.value); });
        }

        var submitBtn = e.target.querySelector('button[type="submit"]');
        var originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creando cuenta...';
        submitBtn.disabled = true;

        try {
            await store.register({
                name: document.getElementById('reg-name').value, 
                email: document.getElementById('reg-email').value,
                phone: document.getElementById('reg-phone').value, 
                address: document.getElementById('reg-address').value,
                password: document.getElementById('reg-password').value, 
                role: selectedRole, 
                professions: professions,
                ratePerHour: parseInt(document.getElementById('reg-rate')?.value) || 0,
                description: document.getElementById('reg-desc')?.value || ''
            });
            showToast('¡Bienvenido a Kitu! Tu cuenta ha sido creada.', 'success');
            navigate('home');
        } catch (errVal) {
            showToast(errVal.message || 'Error al registrar usuario.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    document.getElementById('go-login').addEventListener('click', function(e) { e.preventDefault(); navigate('login'); });
}

// ---- HOME (CLIENT) ----
function renderHome() {
    var role = store.get('role');
    if (role === 'provider') return renderProviderHome();

    var user = store.get('user');
    var activeRequests = store.getActiveRequests();
    var firstName = user?.name?.split(' ')[0] || 'Usuario';

    var activeHTML = '';
    if (activeRequests.length > 0) {
        activeHTML = '<div class="section"><h2 class="section-title">Solicitudes Activas</h2>';
        activeRequests.forEach(function(r) {
            var status = STATUS_LABELS[r.status];
            activeHTML += '<div class="request-card" onclick="navigate(\'request-detail\', {id:\'' + r.id + '\'})">';
            activeHTML += '<div class="request-card-top"><span class="request-service">' + r.serviceTitle + '</span>';
            activeHTML += '<span class="status-badge" style="background:' + status.color + '18; color:' + status.color + '">' + status.icon + ' ' + status.label + '</span></div>';
            activeHTML += '<p class="request-desc-preview">' + r.description.substring(0, 60) + '</p>';
            if (r.providerName) activeHTML += '<div class="request-card-bottom"><span class="text-secondary">👷 ' + r.providerName + '</span><span class="text-secondary">' + timeAgo(r.createdAt) + '</span></div>';
            activeHTML += '</div>';
        });
        activeHTML += '</div>';
    }

    var servicesHTML = SERVICES.map(function(s) {
        return '<div class="service-card" onclick="navigate(\'new-request\', {serviceId:\'' + s.id + '\'})">' +
            '<div class="icon-wrapper" style="background:' + s.color + '15; font-size: 26px;">' + s.icon + '</div>' +
            '<h3>' + s.title + '</h3><p>' + s.desc + '</p></div>';
    }).join('');

    viewContainer.innerHTML = '<div class="fade-in"><h1 class="greeting">Hola, <span class="accent">' + firstName + '</span></h1><p class="greeting-sub">¿En qué podemos ayudarte hoy?</p><div class="search-container"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg><input type="text" id="search-input" class="search-input" placeholder="Busca un servicio..." autocomplete="off"></div>' + activeHTML + '<div class="section"><h2 class="section-title">Servicios</h2><div class="services-grid">' + servicesHTML + '</div></div></div>';

    document.getElementById('search-input').addEventListener('input', function() {
        var query = this.value.toLowerCase().trim();
        document.querySelectorAll('.service-card').forEach(function(card, i) {
            var s = SERVICES[i];
            card.style.display = (!query || s.title.toLowerCase().includes(query) || s.desc.toLowerCase().includes(query)) ? '' : 'none';
        });
    });
}

// ---- HOME (PROVIDER) ----
function renderProviderHome() {
    var user = store.get('user');
    var myRequests = store.getProviderRequests();
    var pendingRequests = myRequests.filter(function(r) { return r.status === 'pending'; });
    var activeJobs = myRequests.filter(function(r) { return r.status === 'accepted' || r.status === 'in_progress'; });

    var chipsHTML = SERVICES.map(function(s) {
        var selected = user?.professions?.includes(s.id);
        return '<button class="chip ' + (selected ? 'active' : '') + '" onclick="toggleProfession(\'' + s.id + '\')">' + s.icon + ' ' + s.title + '</button>';
    }).join('');

    var pendingHTML = '';
    if (pendingRequests.length > 0) {
        pendingHTML = '<div class="section"><h2 class="section-title">🔔 Nuevas Solicitudes</h2>';
        pendingRequests.forEach(function(r) {
            var urg = URGENCY_OPTIONS.find(function(u) { return u.id === r.urgency; });
            pendingHTML += '<div class="job-card"><div class="job-card-header"><span class="job-service">' + r.serviceTitle + '</span><span>' + (urg?.icon || '🟡') + ' ' + r.urgency + '</span></div><p class="job-desc">' + r.description + '</p><p class="job-address">📍 ' + r.address + '</p><div class="job-actions"><button class="btn-accept" onclick="acceptRequest(\'' + r.id + '\')">Aceptar</button><button class="btn-decline" onclick="navigate(\'home\')">Rechazar</button></div></div>';
        });
        pendingHTML += '</div>';
    }

    var activeHTML = '';
    if (activeJobs.length > 0) {
        activeHTML = '<div class="section"><h2 class="section-title">Trabajos Activos</h2>';
        activeJobs.forEach(function(r) {
            var status = STATUS_LABELS[r.status];
            activeHTML += '<div class="request-card" onclick="navigate(\'request-detail\', {id:\'' + r.id + '\'})">';
            activeHTML += '<div class="request-card-top"><span class="request-service">' + r.serviceTitle + '</span>';
            activeHTML += '<span class="status-badge" style="background:' + status.color + '18; color:' + status.color + '">' + status.icon + ' ' + status.label + '</span></div>';
            activeHTML += '<p class="request-desc-preview">' + r.description.substring(0, 60) + '</p></div>';
        });
        activeHTML += '</div>';
    }

    var emptyHTML = '';
    if (pendingRequests.length === 0 && activeJobs.length === 0) {
        emptyHTML = '<div class="empty-state"><span class="empty-icon">📋</span><p>No hay solicitudes disponibles</p><p class="text-secondary" style="margin-top:4px;font-size:13px">Aparecerán según tus profesiones</p></div>';
    }

    viewContainer.innerHTML = '<div class="fade-in"><h1 class="greeting">Panel <span class="accent">Profesional</span></h1><div class="stats-grid"><div class="stat-card"><div class="stat-value">' + formatCurrency(user?.earnings || 0) + '</div><div class="stat-label">Ganancias</div></div><div class="stat-card"><div class="stat-value">' + (user?.totalJobs || 0) + '</div><div class="stat-label">Trabajos</div></div><div class="stat-card"><div class="stat-value">⭐ ' + ((user?.rating || 5.0).toFixed(1)) + '</div><div class="stat-label">Rating</div></div></div><div class="section"><h2 class="section-title">Tus Profesiones</h2><div class="chips-row">' + chipsHTML + '</div></div>' + pendingHTML + activeHTML + emptyHTML + '</div>';
}

// ---- NEW REQUEST (with progress stepper) ----
function renderNewRequest() {
    var service = SERVICES.find(function(s) { return s.id === _viewParams.serviceId; }) || SERVICES[0];
    var userAddress = store.get('user')?.address || '';

    var stepperHTML = '<div class="stepper"><div class="stepper-step"><div class="step-circle active">1</div></div><div class="step-line"></div><div class="stepper-step"><div class="step-circle">2</div></div><div class="step-line"></div><div class="stepper-step"><div class="step-circle">3</div></div></div>';

    var urgencyHTML = URGENCY_OPTIONS.map(function(u) {
        return '<button type="button" class="urgency-btn ' + (u.id === 'normal' ? 'active' : '') + '" data-urgency="' + u.id + '"><span>' + u.icon + '</span><span class="urgency-label">' + u.label + '</span><span class="urgency-desc">' + u.desc + '</span></button>';
    }).join('');

    viewContainer.innerHTML = '<div class="slide-in"><button class="btn-back" onclick="navigate(\'home\')">← Volver</button>' + stepperHTML + '<h2 class="page-title">' + service.icon + ' ' + service.title + '</h2><form id="request-form"><div class="input-group"><label>Describe tu problema</label><textarea id="req-desc" placeholder="Ej: Tengo una fuga en la tubería del baño..." rows="4" required></textarea></div><div class="input-group"><label>📷 Foto del problema (opcional)</label><div class="photo-upload"><input type="file" id="req-photo" accept="image/*" hidden><div class="photo-placeholder" onclick="document.getElementById(\'req-photo\').click()"><span style="font-size:24px;display:block;margin-bottom:4px">📷</span><span>Toca para agregar foto</span></div><div id="photo-preview" class="photo-preview hidden"></div></div></div><div class="input-group"><label>Urgencia</label><div class="urgency-options">' + urgencyHTML + '</div></div><div class="input-group"><label>Dirección</label><input type="text" id="req-address" placeholder="Calle, Número, Colonia" value="' + userAddress + '" required></div><button type="submit" class="btn-primary">Buscar Profesionales →</button></form></div>';

    var selectedUrgency = 'normal';
    document.querySelectorAll('.urgency-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.urgency-btn').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            selectedUrgency = btn.getAttribute('data-urgency');
        });
    });

    document.getElementById('req-photo').addEventListener('change', function(e) {
        var file = e.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(ev) {
                var preview = document.getElementById('photo-preview');
                preview.innerHTML = '<img src="' + ev.target.result + '" alt="Preview">';
                preview.classList.remove('hidden');
                document.querySelector('.photo-placeholder').classList.add('hidden');
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('request-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        var photoImg = document.querySelector('#photo-preview img');
        
        var submitBtn = e.target.querySelector('button[type="submit"]');
        var originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creando solicitud...';
        submitBtn.disabled = true;

        try {
            await store.createRequest({
                serviceId: service.id, 
                serviceTitle: service.title,
                description: document.getElementById('req-desc').value,
                photoData: photoImg ? photoImg.src : null,
                urgency: selectedUrgency,
                address: document.getElementById('req-address').value
            });
            navigate('select-provider', { serviceId: service.id });
        } catch (errVal) {
            showToast(errVal.message || 'Error al crear la solicitud.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ---- SELECT PROVIDER ----
function renderSelectProvider() {
    var serviceId = _viewParams.serviceId;
    var pros = MOCK_PROFESSIONALS.filter(function(p) { return p.professions.includes(serviceId); });

    var stepperHTML = '<div class="stepper"><div class="stepper-step"><div class="step-circle done">✓</div></div><div class="step-line done"></div><div class="stepper-step"><div class="step-circle active">2</div></div><div class="step-line"></div><div class="stepper-step"><div class="step-circle">3</div></div></div>';

    var listHTML = pros.map(function(p) {
        return '<div class="provider-card"><div class="provider-avatar">' + p.avatar + '</div><div class="provider-info"><h3>' + p.name + '</h3><div class="provider-meta"><span>⭐ ' + p.rating + '</span><span>•</span><span>' + p.totalJobs + ' trabajos</span><span>•</span><span>📍 ' + p.distance + ' km</span></div><p class="provider-desc">' + p.description + '</p><div class="provider-rate">' + formatCurrency(p.ratePerHour) + '/hr</div></div><div class="provider-actions"><button class="btn-secondary" onclick="navigate(\'provider-detail\', {id:\'' + p.id + '\'})">Ver</button><button class="btn-primary small" onclick="selectProvider(\'' + p.id + '\')">Solicitar</button></div></div>';
    }).join('');

    viewContainer.innerHTML = '<div class="slide-in"><button class="btn-back" onclick="navigate(\'requests\')">← Volver</button>' + stepperHTML + '<h2 class="page-title">Elige profesional</h2><p class="text-secondary" style="margin-top:-12px;margin-bottom:16px">' + pros.length + ' disponibles cerca de ti</p><div class="providers-list">' + listHTML + '</div></div>';
}

// ---- PROVIDER DETAIL ----
function renderProviderDetail() {
    var pro = MOCK_PROFESSIONALS.find(function(p) { return p.id === _viewParams.id; });
    if (!pro) return navigate('home');
    var ratings = store.getProviderRatings(pro.id);
    var profNames = pro.professions.map(function(pid) { var s = SERVICES.find(function(ss) { return ss.id === pid; }); return s ? s.title : pid; });

    var ratingsHTML = '';
    if (ratings.length > 0) {
        ratingsHTML = '<div class="section"><h3 class="section-title">Reseñas (' + ratings.length + ')</h3>';
        ratings.forEach(function(r) { ratingsHTML += '<div class="review-card"><div class="review-stars">' + '⭐'.repeat(r.stars) + '</div><p>' + r.comment + '</p></div>'; });
        ratingsHTML += '</div>';
    }

    viewContainer.innerHTML = '<div class="slide-in"><button class="btn-back" onclick="navigate(\'home\')">← Volver</button><div class="provider-profile"><div class="provider-avatar large">' + pro.avatar + '</div><h2 style="font-size:22px;font-weight:800;margin-top:12px">' + pro.name + '</h2><div class="provider-meta centered" style="margin-top:6px"><span>⭐ ' + pro.rating + '</span><span>•</span><span>' + pro.totalJobs + ' trabajos</span><span>•</span><span>📍 ' + pro.distance + ' km</span></div><div class="provider-rate-large">' + formatCurrency(pro.ratePerHour) + ' <span style="font-size:16px;-webkit-text-fill-color:var(--text-secondary)">/hora</span></div><div class="section"><h3 class="section-title">Profesiones</h3><div class="chips-row" style="justify-content:center">' + profNames.map(function(n) { return '<span class="chip active">' + n + '</span>'; }).join('') + '</div></div><div class="section"><h3 class="section-title">Sobre mí</h3><p class="text-secondary" style="text-align:left;line-height:1.5">' + pro.description + '</p></div>' + ratingsHTML + '</div></div>';
}

// ---- REQUESTS ----
function renderRequests() {
    var role = store.get('role');
    var userId = store.get('user')?.id;
    var allRequests = role === 'client'
        ? store.get('requests').filter(function(r) { return r.clientId === userId; })
        : store.getProviderRequests();

    var active = allRequests.filter(function(r) { return ['pending', 'accepted', 'in_progress'].includes(r.status); });
    var completed = allRequests.filter(function(r) { return r.status === 'completed'; });

    var activeHTML = '';
    if (active.length > 0) {
        activeHTML = '<div class="section" style="margin-top:0"><h3 class="section-title">Activas</h3>';
        active.forEach(function(r) {
            var status = STATUS_LABELS[r.status];
            activeHTML += '<div class="request-card" onclick="navigate(\'request-detail\', {id:\'' + r.id + '\'})">';
            activeHTML += '<div class="request-card-top"><span class="request-service">' + r.serviceTitle + '</span>';
            activeHTML += '<span class="status-badge" style="background:' + status.color + '18; color:' + status.color + '">' + status.icon + ' ' + status.label + '</span></div>';
            activeHTML += '<p class="request-desc-preview">' + r.description.substring(0, 80) + '</p>';
            activeHTML += '<div class="request-card-bottom"><span class="text-secondary">' + timeAgo(r.createdAt) + '</span>';
            if (r.providerName) activeHTML += '<span class="text-secondary">👷 ' + r.providerName + '</span>';
            activeHTML += '</div></div>';
        });
        activeHTML += '</div>';
    }

    var completedHTML = '';
    if (completed.length > 0) {
        completedHTML = '<div class="section"><h3 class="section-title">Completadas</h3>';
        completed.slice(0, 5).forEach(function(r) {
            completedHTML += '<div class="request-card completed" onclick="navigate(\'request-detail\', {id:\'' + r.id + '\'})">';
            completedHTML += '<div class="request-card-top"><span class="request-service">' + r.serviceTitle + '</span>';
            completedHTML += '<span class="status-badge" style="background:#10b98118; color:#10b981">✅ Completado</span></div>';
            completedHTML += '<p class="request-desc-preview">' + r.description.substring(0, 80) + '</p>';
            if (r.rating) completedHTML += '<div class="review-stars small">' + '⭐'.repeat(r.rating) + '</div>';
            completedHTML += '</div>';
        });
        if (completed.length > 5) completedHTML += '<button class="btn-secondary full" onclick="navigate(\'history\')">Ver historial completo</button>';
        completedHTML += '</div>';
    }

    var emptyHTML = '';
    if (active.length === 0 && completed.length === 0) {
        emptyHTML = '<div class="empty-state"><span class="empty-icon">' + (role === 'client' ? '📋' : '🔧') + '</span><p>' + (role === 'client' ? 'Aún no has solicitado ningún servicio' : 'No tienes trabajos asignados') + '</p>' + (role === 'client' ? '<button class="btn-primary" onclick="navigate(\'home\')">Buscar Servicios</button>' : '') + '</div>';
    }

    viewContainer.innerHTML = '<div class="fade-in"><h2 class="page-title">' + (role === 'client' ? 'Mis Solicitudes' : 'Mis Trabajos') + '</h2>' + activeHTML + completedHTML + emptyHTML + '</div>';
}

// ---- REQUEST DETAIL ----
function renderRequestDetail() {
    var request = store.getRequest(_viewParams.id);
    if (!request) return navigate('requests');

    var status = STATUS_LABELS[request.status];
    var role = store.get('role');
    var provider = request.providerId ? MOCK_PROFESSIONALS.find(function(p) { return p.id === request.providerId; }) || { name: request.providerName, avatar: '👷', id: request.providerId } : null;
    var urgOpt = URGENCY_OPTIONS.find(function(u) { return u.id === request.urgency; });

    var providerHTML = '';
    if (provider) {
        providerHTML = '<div class="detail-section"><h3>Profesional</h3><div class="provider-mini" onclick="navigate(\'provider-detail\', {id:\'' + provider.id + '\'})"><span class="provider-avatar small">' + provider.avatar + '</span><div><div style="font-weight:600">' + provider.name + '</div>' + (provider.rating ? '<div class="text-secondary" style="font-size:12px">⭐ ' + provider.rating + '</div>' : '') + '</div></div></div>';
    }

    var actionsHTML = '<div class="detail-actions">';
    if (request.status === 'accepted' || request.status === 'in_progress') {
        actionsHTML += '<button class="btn-primary" onclick="navigate(\'chat\', {requestId:\'' + request.id + '\'})">💬 Chat con profesional</button>';
    }
    if (request.status === 'in_progress' && role === 'provider') {
        actionsHTML += '<button class="btn-success" onclick="completeRequest(\'' + request.id + '\')">✅ Marcar como completado</button>';
    }
    if (request.status === 'accepted' && role === 'provider') {
        actionsHTML += '<button class="btn-primary" onclick="startWork(\'' + request.id + '\')">🔧 Iniciar trabajo</button>';
    }
    if (request.status === 'completed' && !request.rating && role === 'client') {
        actionsHTML += '<button class="btn-primary" onclick="navigate(\'rate-service\', {requestId:\'' + request.id + '\'})">⭐ Calificar servicio</button>';
    }
    if (request.status === 'pending' && role === 'client') {
        actionsHTML += '<button class="btn-danger" onclick="confirmCancel(\'' + request.id + '\')">Cancelar solicitud</button>';
    }
    actionsHTML += '</div>';

    var photoHTML = request.photoData ? '<div class="detail-section"><h3>Foto</h3><img src="' + request.photoData + '" class="detail-photo" alt="Foto del problema"></div>' : '';

    viewContainer.innerHTML = '<div class="slide-in"><button class="btn-back" onclick="navigate(\'requests\')">← Volver</button><div class="detail-header"><h2>' + request.serviceTitle + '</h2><span class="status-badge large" style="background:' + status.color + '18; color:' + status.color + '">' + status.icon + ' ' + status.label + '</span></div><div class="detail-section"><h3>Descripción</h3><p style="line-height:1.5">' + request.description + '</p></div>' + photoHTML + '<div class="detail-section"><h3>Detalles</h3><div class="detail-row"><span class="text-secondary">Urgencia</span><span>' + (urgOpt?.icon || '') + ' ' + (urgOpt?.label || request.urgency) + '</span></div><div class="detail-row"><span class="text-secondary">Dirección</span><span>📍 ' + request.address + '</span></div><div class="detail-row"><span class="text-secondary">Fecha</span><span>' + new Date(request.createdAt).toLocaleDateString(getActiveSettings().locale) + '</span></div>' + (request.price ? '<div class="detail-row"><span class="text-secondary">Precio</span><span style="font-weight:700;color:var(--accent)">' + formatCurrency(request.price) + '</span></div>' : '') + '</div>' + providerHTML + actionsHTML + '</div>';
}

// ---- CHAT ----
function renderChat() {
    var request = store.getRequest(_viewParams.requestId);
    if (!request) return navigate('requests');
    var messages = store.getChatMessages(_viewParams.requestId);
    var role = store.get('role');
    var userId = store.get('user')?.id;
    var chatPartner = role === 'client' ? (request.providerName || 'Profesional') : request.clientName;

    var msgsHTML = messages.length === 0
        ? '<div class="chat-empty"><span style="font-size:40px;display:block;margin-bottom:8px">💬</span><p class="text-secondary">Envía un mensaje para coordinar</p></div>'
        : messages.map(function(m) {
            var isMine = m.sender === userId;
            var time = new Date(m.timestamp).toLocaleTimeString(getActiveSettings().locale, { hour: '2-digit', minute: '2-digit' });
            return '<div class="chat-bubble ' + (isMine ? 'mine' : 'theirs') + '"><p>' + m.message + '</p><span class="chat-time">' + time + '</span></div>';
        }).join('');

    viewContainer.innerHTML = '<div class="chat-screen fade-in"><div class="chat-header"><button class="btn-back" onclick="navigate(\'request-detail\', {id:\'' + request.id + '\'})">←</button><div class="chat-title"><h3>' + chatPartner + '</h3><span class="text-secondary">' + request.serviceTitle + '</span></div></div><div class="chat-messages" id="chat-messages">' + msgsHTML + '</div><div class="chat-input-bar"><input type="text" id="chat-input" placeholder="Escribe un mensaje..." autocomplete="off"><button class="btn-send" onclick="sendMessage(\'' + _viewParams.requestId + '\')"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg></button></div></div>';

    var chatBox = document.getElementById('chat-messages');
    chatBox.scrollTop = chatBox.scrollHeight;

    document.getElementById('chat-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage(_viewParams.requestId);
    });
}

// ---- RATE SERVICE ----
function renderRateService() {
    var request = store.getRequest(_viewParams.requestId);
    if (!request) return navigate('requests');

    var stepperHTML = '<div class="stepper"><div class="stepper-step"><div class="step-circle done">✓</div></div><div class="step-line done"></div><div class="stepper-step"><div class="step-circle done">✓</div></div><div class="step-line done"></div><div class="stepper-step"><div class="step-circle active">3</div></div></div>';

    viewContainer.innerHTML = '<div class="slide-in rate-screen"><button class="btn-back" onclick="navigate(\'request-detail\', {id:\'' + request.id + '\'})">← Volver</button>' + stepperHTML + '<h2 class="page-title">Califica el servicio</h2><p class="text-secondary">' + request.serviceTitle + ' por ' + (request.providerName || 'Profesional') + '</p><div class="star-selector" id="star-selector"><button class="star-btn" data-star="1">☆</button><button class="star-btn" data-star="2">☆</button><button class="star-btn" data-star="3">☆</button><button class="star-btn" data-star="4">☆</button><button class="star-btn" data-star="5">☆</button></div><p id="star-label" class="star-label">Toca una estrella</p><div class="input-group" style="text-align:left"><label>Comentario (opcional)</label><textarea id="review-comment" placeholder="¿Cómo fue tu experiencia?" rows="3"></textarea></div><button class="btn-primary" id="submit-rating" disabled>Enviar Calificación</button></div>';

    var selectedStars = 0;
    var starLabels = ['', 'Muy malo', 'Malo', 'Regular', 'Bueno', '¡Excelente!'];

    document.querySelectorAll('.star-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            selectedStars = parseInt(btn.getAttribute('data-star'));
            document.querySelectorAll('.star-btn').forEach(function(b, i) {
                b.textContent = i < selectedStars ? '★' : '☆';
                b.classList.toggle('filled', i < selectedStars);
            });
            document.getElementById('star-label').textContent = starLabels[selectedStars];
            document.getElementById('submit-rating').disabled = false;
        });
    });

    document.getElementById('submit-rating').addEventListener('click', function() {
        var comment = document.getElementById('review-comment').value;
        store.addRating(request.id, request.providerId, selectedStars, comment);
        showToast('¡Gracias! Calificación de ' + selectedStars + ' estrellas enviada.', 'success');
        navigate('requests');
    });
}

// ---- NOTIFICATIONS ----
function renderNotifications() {
    var notifications = store.get('notifications');
    var hasUnread = notifications.some(function(n) { return !n.read; });

    var listHTML = '';
    if (notifications.length === 0) {
        listHTML = '<div class="empty-state"><span class="empty-icon">🔔</span><p>No tienes notificaciones</p></div>';
    } else {
        listHTML = '<div class="notifications-list">';
        notifications.forEach(function(n) {
            listHTML += '<div class="notification-item ' + (n.read ? 'read' : 'unread') + '" onclick="readNotification(\'' + n.id + '\')">';
            listHTML += '<div class="notif-dot ' + (n.read ? '' : 'active') + '"></div>';
            listHTML += '<div class="notif-content"><p>' + n.message + '</p><span class="text-secondary">' + timeAgo(n.timestamp) + '</span></div></div>';
        });
        listHTML += '</div>';
    }

    viewContainer.innerHTML = '<div class="slide-in"><button class="btn-back" onclick="navigate(\'home\')">← Volver</button><div class="page-header-row"><h2 class="page-title" style="margin-bottom:0">Notificaciones</h2>' + (hasUnread ? '<button class="btn-text" onclick="markAllRead()">Leer todas</button>' : '') + '</div>' + listHTML + '</div>';
}

// ---- MAP ----
function renderMap() {
    var prosListHTML = MOCK_PROFESSIONALS.slice(0, 6).map(function(p) {
        return '<div class="mock-pro-item" onclick="navigate(\'provider-detail\', {id:\'' + p.id + '\'})">' +
            '<span>' + p.avatar + '</span><span>' + p.name + '</span><span class="text-secondary">' + p.distance + ' km</span></div>';
    }).join('');

    viewContainer.innerHTML = '<div class="fade-in"><h2 class="page-title">Mapa</h2><div id="leaflet-map" class="map-container"></div><div class="map-legend"><span class="legend-item"><span class="legend-dot" style="background:var(--accent)"></span> Profesionales</span></div></div>';

    setTimeout(function() {
        var mapEl = document.getElementById('leaflet-map');
        if (!mapEl) return;
        if (typeof L === 'undefined') {
            mapEl.innerHTML = '<div class="map-fallback"><span>📍</span><p>Profesionales cercanos</p><div class="mock-pros-list">' + prosListHTML + '</div></div>';
            return;
        }
        try {
            var coords = [getActiveSettings().defaultCoordinates.lat, getActiveSettings().defaultCoordinates.lng];
            var map = L.map('leaflet-map').setView(coords, 14);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
            L.circleMarker(coords, { radius: 8, fillColor: '#007aff', fillOpacity: 1, color: '#fff', weight: 2 }).addTo(map).bindPopup('📍 Tu ubicación');
            MOCK_PROFESSIONALS.forEach(function(p) {
                var latOffset = p.lat - 19.4326;
                var lngOffset = p.lng - (-99.1332);
                var activeLat = coords[0] + latOffset;
                var activeLng = coords[1] + lngOffset;
                L.marker([activeLat, activeLng]).addTo(map).bindPopup('<b>' + p.name + '</b><br>⭐ ' + p.rating + ' • ' + formatCurrency(p.ratePerHour) + '/hr');
            });
        } catch (e) {
            mapEl.innerHTML = '<div class="map-fallback"><span>📍</span><p>Profesionales cercanos</p><div class="mock-pros-list">' + prosListHTML + '</div></div>';
        }
    }, 200);
}

// ---- PROFILE ----
function renderProfile() {
    var user = store.get('user');
    var completedJobs = store.getCompletedRequests();

    var profsHTML = '';
    if (user?.role === 'provider') {
        var chips = (user.professions || []).map(function(pid) {
            var s = SERVICES.find(function(ss) { return ss.id === pid; });
            return s ? '<span class="chip active">' + s.icon + ' ' + s.title + '</span>' : '';
        }).join('');
        profsHTML = '<div class="section"><h3 class="section-title">Mis Profesiones</h3><div class="chips-row">' + chips + '</div></div><div class="section"><h3 class="section-title">Descripción</h3><p class="text-secondary">' + (user.description || 'Sin descripción') + '</p></div>';
    }

    viewContainer.innerHTML = '<div class="fade-in"><div class="profile-header"><div class="profile-avatar">👤</div><h2>' + (user?.name || 'Usuario') + '</h2><p class="text-secondary">' + (user?.email || '') + '</p><p class="text-secondary" style="margin-top:2px">📍 ' + (user?.address || 'Sin dirección') + '</p></div><div class="stats-grid"><div class="stat-card"><div class="stat-value">' + completedJobs.length + '</div><div class="stat-label">Servicios</div></div><div class="stat-card"><div class="stat-value">⭐ ' + ((user?.rating || 5.0).toFixed(1)) + '</div><div class="stat-label">Rating</div></div></div>' + profsHTML + '<div class="profile-menu"><button class="menu-item" onclick="navigate(\'edit-profile\')"><span>✏️ Editar Perfil</span><span class="arrow">›</span></button><button class="menu-item" onclick="navigate(\'history\')"><span>📋 Historial</span><span class="arrow">›</span></button><button class="menu-item" onclick="navigate(\'notifications\')"><span>🔔 Notificaciones</span><span class="arrow">›</span></button><button class="menu-item danger" onclick="confirmLogout()"><span>🚪 Cerrar Sesión</span><span class="arrow">›</span></button></div></div>';
}

// ---- EDIT PROFILE ----
function renderEditProfile() {
    var user = store.get('user');
    var proHTML = '';
    if (user?.role === 'provider') {
        var profsGrid = SERVICES.map(function(s) {
            var checked = user.professions?.includes(s.id) ? 'checked' : '';
            return '<label class="profession-check"><input type="checkbox" value="' + s.id + '" name="edit-professions" ' + checked + '><span>' + s.icon + ' ' + s.title + '</span></label>';
        }).join('');
        proHTML = '<div class="input-group"><label>Tarifa por hora (' + getActiveSettings().currencySymbol + ' ' + getActiveSettings().currency + ')</label><input type="number" id="edit-rate" value="' + (user.ratePerHour || '') + '" min="50"></div><div class="input-group"><label>Descripción profesional</label><textarea id="edit-desc" rows="3">' + (user.description || '') + '</textarea></div><div class="input-group"><label>Profesiones</label><div class="professions-grid">' + profsGrid + '</div></div>';
    }

    viewContainer.innerHTML = '<div class="slide-in"><button class="btn-back" onclick="navigate(\'profile\')">← Volver</button><h2 class="page-title">Editar Perfil</h2><form id="edit-form"><div class="input-group"><label>Nombre completo</label><input type="text" id="edit-name" value="' + (user?.name || '') + '" required></div><div class="input-group"><label>Teléfono</label><input type="tel" id="edit-phone" value="' + (user?.phone || '') + '" placeholder="' + getActiveSettings().translations.phone_placeholder + '"></div><div class="input-group"><label>Dirección</label><input type="text" id="edit-address" value="' + (user?.address || '') + '"></div>' + proHTML + '<button type="submit" class="btn-primary">Guardar Cambios</button></form></div>';

    document.getElementById('edit-form').addEventListener('submit', function(e) {
        e.preventDefault();
        var updates = { name: document.getElementById('edit-name').value, phone: document.getElementById('edit-phone').value, address: document.getElementById('edit-address').value };
        if (user?.role === 'provider') {
            updates.ratePerHour = parseInt(document.getElementById('edit-rate')?.value) || 0;
            updates.description = document.getElementById('edit-desc')?.value || '';
            var profs = [];
            document.querySelectorAll('input[name="edit-professions"]:checked').forEach(function(cb) { profs.push(cb.value); });
            updates.professions = profs;
        }
        store.updateProfile(updates);
        showToast('Perfil actualizado correctamente.', 'success');
        navigate('profile');
    });
}

// ---- HISTORY ----
function renderHistory() {
    var completed = store.getCompletedRequests();
    var listHTML = '';
    if (completed.length === 0) {
        listHTML = '<div class="empty-state"><span class="empty-icon">📋</span><p>No tienes servicios completados</p></div>';
    } else {
        completed.forEach(function(r) {
            listHTML += '<div class="request-card completed" onclick="navigate(\'request-detail\', {id:\'' + r.id + '\'})">';
            listHTML += '<div class="request-card-top"><span class="request-service">' + r.serviceTitle + '</span><span class="text-secondary">' + new Date(r.createdAt).toLocaleDateString(getActiveSettings().locale) + '</span></div>';
            listHTML += '<p class="request-desc-preview">' + r.description.substring(0, 80) + '</p>';
            listHTML += '<div class="request-card-bottom">' + (r.rating ? '<div class="review-stars small">' + '⭐'.repeat(r.rating) + '</div>' : '<span class="text-secondary">Sin calificar</span>') + (r.price ? '<span style="font-weight:600">' + formatCurrency(r.price) + '</span>' : '') + '</div></div>';
        });
    }
    viewContainer.innerHTML = '<div class="slide-in"><button class="btn-back" onclick="navigate(\'profile\')">← Volver</button><h2 class="page-title">Historial</h2>' + listHTML + '</div>';
}

// ============================================
// GLOBAL ACTIONS
// ============================================

async function toggleRole() {
    var current = store.get('role');
    var newRole = current === 'client' ? 'provider' : 'client';
    store.set('role', newRole);
    showToast('Cambiado a modo ' + (newRole === 'client' ? 'cliente' : 'profesional'), 'info');
    navigate('home');
}

async function toggleProfession(profId) {
    var user = store.get('user');
    var profs = (user?.professions || []).slice();
    var idx = profs.indexOf(profId);
    if (idx > -1) profs.splice(idx, 1); else profs.push(profId);
    try {
        await store.updateProfile({ professions: profs });
        renderView('home');
    } catch (err) {
        showToast('Error al actualizar profesión: ' + err.message, 'error');
    }
}

async function selectProvider(proId) {
    var pro = MOCK_PROFESSIONALS.find(function(p) { return p.id === proId; });
    var requests = store.get('requests');
    var lastRequest = requests[requests.length - 1];
    if (lastRequest && lastRequest.status === 'pending') {
        try {
            await store.updateRequest(lastRequest.id, { 
                providerId: pro.id, 
                providerName: pro.name, 
                status: 'accepted', 
                price: pro.ratePerHour 
            });
            showToast(pro.name + ' aceptó tu solicitud. ¡Va en camino!', 'success');
            store.addNotification(pro.name + ' ha aceptado tu solicitud.', 'success');

            // Simulación estilo Uber: en modo Local o Supabase
            setTimeout(async function() {
                try {
                    await store.updateRequest(lastRequest.id, { status: 'in_progress' });
                    store.addNotification(pro.name + ' ha llegado y está trabajando.', 'info');
                    await store.addChatMessage(lastRequest.id, pro.id, 'Ya llegué. Voy a comenzar con el trabajo.');
                    
                    var currentView = store.get('currentView');
                    if (currentView === 'requests' || currentView === 'request-detail') {
                        renderView(currentView);
                    }
                    renderShell();
                } catch (e) {
                    console.error('Error en simulación de progreso:', e);
                }
            }, 10000);
        } catch (err) {
            showToast('Error al seleccionar proveedor: ' + err.message, 'error');
        }
    }
    navigate('requests');
}

async function acceptRequest(reqId) {
    var user = store.get('user');
    try {
        await store.updateRequest(reqId, { providerId: user.id, providerName: user.name, status: 'accepted' });
        showToast('Solicitud aceptada.', 'success');
        store.addNotification('Has aceptado una nueva solicitud.', 'success');
        navigate('home');
    } catch (err) {
        showToast('Error al aceptar solicitud: ' + err.message, 'error');
    }
}

async function startWork(reqId) {
    try {
        await store.updateRequest(reqId, { status: 'in_progress' });
        showToast('Trabajo iniciado.', 'info');
        store.addNotification('Has iniciado el trabajo.', 'info');
        navigate('request-detail', { id: reqId });
    } catch (err) {
        showToast('Error al iniciar trabajo: ' + err.message, 'error');
    }
}

async function completeRequest(reqId) {
    var user = store.get('user');
    var req = store.getRequest(reqId);
    try {
        await store.updateRequest(reqId, { status: 'completed' });
        await store.updateProfile({ 
            totalJobs: (user.totalJobs || 0) + 1, 
            earnings: (user.earnings || 0) + (req?.price || 250) 
        });
        showToast('¡Trabajo completado! 🎉', 'success');
        store.addNotification('¡Trabajo completado!', 'success');
        navigate('requests');
    } catch (err) {
        showToast('Error al completar trabajo: ' + err.message, 'error');
    }
}

function confirmCancel(reqId) {
    showConfirm('Cancelar solicitud', '¿Estás seguro de que quieres cancelar esta solicitud? Esta acción no se puede deshacer.', 'Sí, cancelar', async function() {
        try {
            await store.updateRequest(reqId, { status: 'cancelled' });
            showToast('Solicitud cancelada.', 'warning');
            store.addNotification('Solicitud cancelada.', 'info');
            navigate('requests');
        } catch (err) {
            showToast('Error al cancelar solicitud: ' + err.message, 'error');
        }
    });
}

function confirmLogout() {
    showConfirm('Cerrar sesión', '¿Seguro que quieres cerrar sesión?', 'Cerrar sesión', async function() {
        try {
            await store.logout();
            navigate('login');
        } catch (err) {
            showToast('Error al cerrar sesión: ' + err.message, 'error');
        }
    });
}

async function sendMessage(requestId) {
    var input = document.getElementById('chat-input');
    var msg = input.value.trim();
    if (!msg) return;
    try {
        await store.addChatMessage(requestId, store.get('user')?.id, msg);
        input.value = '';
        renderChat();

        // En modo local o de prueba, simulamos respuesta rápida del pro si el remitente es el cliente
        if (CONFIG.DATABASE_MODE !== 'supabase') {
            setTimeout(async function() {
                var response = CHAT_RESPONSES[Math.floor(Math.random() * CHAT_RESPONSES.length)];
                await store.addChatMessage(requestId, 'provider', response);
                if (store.get('currentView') === 'chat') renderChat();
            }, 1200 + Math.random() * 2000);
        }
    } catch (err) {
        showToast('Error al enviar mensaje: ' + err.message, 'error');
    }
}

function readNotification(notifId) {
    store.markNotificationRead(notifId);
    renderNotifications();
    renderShell();
}

function markAllRead() {
    store.markAllNotificationsRead();
    showToast('Todas las notificaciones leídas.', 'info');
    renderNotifications();
    renderShell();
}

async function doLogout() { 
    try {
        await store.logout(); 
        navigate('login'); 
    } catch (e) {}
}

// ============================================
// UTILITY
// ============================================

function timeAgo(dateString) {
    var diff = Date.now() - new Date(dateString).getTime();
    var mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Ahora';
    if (mins < 60) return mins + 'm';
    var hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + 'h';
    return Math.floor(hrs / 24) + 'd';
}

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', splashThenInit);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js').catch(function() {});
    });
}
