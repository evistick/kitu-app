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
    store.subscribe(function (state) {
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
    setTimeout(function () { toast.classList.add('toast-out'); setTimeout(function () { toast.remove(); }, 300); }, 3000);
}

// ============================================
// [8] BOTTOM SHEET / CONFIRMATION DIALOG
// ============================================

function showConfirm(title, message, confirmText, onConfirm) {
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = '<div class="bottom-sheet"><div class="sheet-handle"></div><h3>' + title + '</h3><p>' + message + '</p><div class="sheet-actions"><button class="btn-danger" id="sheet-confirm">' + confirmText + '</button><button class="btn-secondary full" id="sheet-cancel">Cancelar</button></div></div>';
    document.body.appendChild(overlay);

    overlay.querySelector('#sheet-confirm').addEventListener('click', function () { overlay.remove(); onConfirm(); });
    overlay.querySelector('#sheet-cancel').addEventListener('click', function () { overlay.remove(); });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) overlay.remove(); });
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

document.addEventListener('click', function (e) {
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
    setTimeout(function () { ripple.remove(); }, 600);
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

    appNav.innerHTML = navItems.map(function (n) {
        return '<button class="nav-item ' + (currentView === n.id ? 'active' : '') + '" onclick="navigate(\'' + n.id + '\')" aria-label="' + n.label + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' + n.icon + '</svg><span>' + n.label + '</span></button>';
    }).join('');
}

function renderView(viewId) {
    var viewMap = {
        login: renderLogin, register: renderRegister, home: renderHome, requests: renderRequests,
        'request-detail': renderRequestDetail,
        'select-provider': renderSelectProvider, map: renderMap, profile: renderProfile,
        'edit-profile': renderEditProfile, notifications: renderNotifications, chat: renderChat,
        'rate-service': renderRateService, history: renderHistory, 'provider-detail': renderProviderDetail,
        wallet: renderWallet, 'payment-methods': renderPaymentMethods,
        'address-book': renderAddressBook, favorites: renderFavorites,
        'edit-address': renderEditAddress
    };
    (viewMap[viewId] || renderHome)();
}

// ============================================
// [5] SPLASH SCREEN with delayed init
// ============================================

function splashThenInit() {
    console.log('splashThenInit called');
    setTimeout(function () {
        try {
            var st = window.store || (typeof store !== 'undefined' ? store : null);
            if (st && typeof st.get === 'function' && st.get('isLoggedIn')) {
                console.log('User logged in, navigating to', st.get('currentView') || 'home');
                navigate(st.get('currentView') || 'home');
            } else {
                console.log('User not logged in, navigating to login');
                navigate('login');
            }
        } catch (err) {
            console.error('Error in splashThenInit:', err);
            try { navigate('login'); } catch (e) {}
        } finally {
            const loadingEl = document.querySelector('.loading-screen');
            if (loadingEl) loadingEl.remove();
        }
    }, 400);
}

// ---- LOGIN ----
function renderLogin() {
    viewContainer.innerHTML = '<div class="auth-screen fade-in"><div class="auth-logo"><svg viewBox="0 0 100 100" class="logo-k large"><path d="M30 20 L30 80 M30 50 L70 20 M30 50 L70 80" stroke="currentColor" stroke-width="8" stroke-linecap="round" fill="none" /></svg><h1>Kitu</h1><p>Servicios profesionales a tu puerta</p></div><form id="login-form" class="auth-form"><div class="input-group"><label>Correo o Usuario</label><input type="text" id="login-email" placeholder="tu@correo.com o admin" required autocomplete="username"></div><div class="input-group"><label>Contraseña</label><div class="password-wrapper"><input type="password" id="login-password" placeholder="••••••••" required autocomplete="current-password"><span class="toggle-password" data-target="login-password" style="cursor:pointer; margin-left:-30px;">👁️</span></div></div><div id="login-error" class="form-error hidden"></div><button type="submit" class="btn-primary">Iniciar Sesión</button></form><p class="auth-switch">¿No tienes cuenta? <a href="#" id="go-register">Crear cuenta gratis</a></p></div>';

    document.getElementById('login-form').addEventListener('submit', async function (e) {
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

    document.getElementById('go-register').addEventListener('click', function (e) { e.preventDefault(); navigate('register'); });

    document.querySelectorAll('.toggle-password').forEach(function (toggle) {
        toggle.addEventListener('click', function () {
            var targetId = this.getAttribute('data-target');
            var input = document.getElementById(targetId);
            if (input.type === 'password') {
                input.type = 'text';
                this.textContent = '🙈';
            } else {
                input.type = 'password';
                this.textContent = '👁️';
            }
        });
    });
}

// ---- REGISTER ----
function renderRegister() {
    var professionsHTML = SERVICES.map(function (s) {
        return '<label class="profession-check"><input type="checkbox" value="' + s.id + '" name="professions"><span>' + s.icon + ' ' + s.title + '</span></label>';
    }).join('');

    viewContainer.innerHTML = '<div class="auth-screen fade-in"><div class="auth-logo small"><svg viewBox="0 0 100 100" class="logo-k medium"><path d="M30 20 L30 80 M30 50 L70 20 M30 50 L70 80" stroke="currentColor" stroke-width="8" stroke-linecap="round" fill="none" /></svg><h2>Crear Cuenta</h2><p>Únete a la comunidad Kitu</p></div><form id="register-form" class="auth-form"><div class="input-group"><label>Nombre completo</label><input type="text" id="reg-name" placeholder="Juan Pérez" required></div><div class="input-group"><label>Correo electrónico</label><input type="email" id="reg-email" placeholder="tu@correo.com" required></div><div class="input-group"><label>Teléfono</label><input type="tel" id="reg-phone" placeholder="' + getActiveSettings().translations.phone_placeholder + '" required></div><div class="input-group"><label>Contraseña</label><div class="password-wrapper"><input type="password" id="reg-password" placeholder="Mínimo 6 caracteres" required minlength="6"><span class="toggle-password" data-target="reg-password" style="cursor:pointer; margin-left:-30px;">👁️</span></div></div><div class="input-group"><label>¿Cómo usarás Kitu?</label><div class="role-selector"><button type="button" class="role-option active" data-role="client"><span class="role-icon">🏠</span><span class="role-label">Necesito servicios</span></button><button type="button" class="role-option" data-role="provider"><span class="role-icon">🔧</span><span class="role-label">Soy profesional</span></button></div></div><div id="professions-section" class="hidden"><label>Selecciona tus profesiones</label><div class="professions-grid">' + professionsHTML + '</div><div class="input-group" style="margin-top:12px"><label>Tarifa por hora (' + getActiveSettings().currencySymbol + ' ' + getActiveSettings().currency + ')</label><input type="number" id="reg-rate" placeholder="250" min="50"></div><div class="input-group"><label>Descripción profesional</label><textarea id="reg-desc" placeholder="Describe tu experiencia..." rows="3"></textarea></div></div><button type="submit" class="btn-primary">Crear Cuenta</button></form><p class="auth-switch">¿Ya tienes cuenta? <a href="#" id="go-login">Inicia Sesión</a></p></div>';

    var selectedRole = 'client';
    document.querySelectorAll('.role-option').forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.role-option').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            selectedRole = btn.getAttribute('data-role');
            document.getElementById('professions-section').classList.toggle('hidden', selectedRole !== 'provider');
        });
    });

    document.getElementById('register-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        var professions = [];
        if (selectedRole === 'provider') {
            document.querySelectorAll('input[name="professions"]:checked').forEach(function (cb) { professions.push(cb.value); });
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
                address: document.getElementById('reg-address')?.value || '',
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

    document.getElementById('go-login').addEventListener('click', function (e) { e.preventDefault(); navigate('login'); });

    document.querySelectorAll('.toggle-password').forEach(function (toggle) {
        toggle.addEventListener('click', function () {
            var targetId = this.getAttribute('data-target');
            var input = document.getElementById(targetId);
            if (input.type === 'password') {
                input.type = 'text';
                this.textContent = '🙈';
            } else {
                input.type = 'password';
                this.textContent = '👁️';
            }
        });
    });
}

// ---- HOME (CLIENT) ----
function renderHome() {
    var role = store.get('role');
    if (role === 'provider') return renderProviderHome();

    var user = store.get('user');
    var activeRequests = store.getActiveRequests();
    var addressStr = user?.address || 'Seleccionar ubicación...';
    if (addressStr.length > 25) addressStr = addressStr.substring(0, 22) + '...';

    var activeHTML = '';
    if (activeRequests.length > 0) {
        activeHTML = '<div class="section" style="margin-top: 10px;"><h2 class="section-title">Solicitudes Activas</h2>';
        activeRequests.forEach(function (r) {
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

    var horizontalCatsHTML = SERVICES.map(function (s) {
        return '<div class="service-cat-card" onclick="openNewRequestSheet(\'' + s.id + '\')">' +
            '<div class="service-cat-icon" style="color:' + s.color + '">' + s.icon + '</div>' +
            '<div class="service-cat-title">' + s.title + '</div></div>';
    }).join('');

    var servicesGridHTML = SERVICES.map(function (s) {
        return '<div class="service-card searchable-card" onclick="openNewRequestSheet(\'' + s.id + '\')">' +
            '<div class="icon-wrapper" style="background:' + s.color + '15; font-size: 26px;">' + s.icon + '</div>' +
            '<h3>' + s.title + '</h3><p>' + s.desc + '</p></div>';
    }).join('');

    viewContainer.innerHTML = '<div class="fade-in">' +
        '<div class="home-header">' +
        '<div class="location-bar" onclick="navigate(\'edit-profile\')"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg> <span>' + addressStr + '</span></div>' +
        '<div class="search-hero"><h1>¿Qué necesitas reparar hoy?</h1></div>' +
        '<div class="search-container" style="margin-top:0"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg><input type="text" id="search-input" class="search-input" placeholder="Servicios, problemas..." autocomplete="off"></div>' +
        '</div>' +
        '<div class="horizontal-scroll">' + horizontalCatsHTML + '</div>' +
        '<div class="promo-banner" style="margin-top: 24px;"><div><h3>Kitu Premium</h3><p>Servicios verificados en minutos.</p></div></div>' +
        activeHTML +
        '<div class="section"><h2 class="section-title" id="all-services-title">Todos los servicios</h2><div class="services-grid" id="services-grid-container">' + servicesGridHTML + '</div></div></div>';

    document.getElementById('search-input').addEventListener('input', function () {
        var query = this.value.toLowerCase().trim();
        document.querySelectorAll('.searchable-card').forEach(function (card, i) {
            var s = SERVICES[i];
            var match = (!query || s.title.toLowerCase().includes(query) || s.desc.toLowerCase().includes(query));
            card.style.display = match ? '' : 'none';
        });

        var isSearching = query.length > 0;
        document.querySelector('.horizontal-scroll').style.display = isSearching ? 'none' : '';
        document.querySelector('.promo-banner').style.display = isSearching ? 'none' : '';
        document.getElementById('all-services-title').textContent = isSearching ? 'Resultados de búsqueda' : 'Todos los servicios';
    });
}

// ---- HOME (PROVIDER) ----
function renderProviderHome() {
    var user = store.get('user');
    var myRequests = store.getProviderRequests();
    var pendingRequests = myRequests.filter(function (r) { return r.status === 'pending'; });
    var activeJobs = myRequests.filter(function (r) { return r.status === 'accepted' || r.status === 'in_progress'; });

    var chipsHTML = SERVICES.map(function (s) {
        var selected = user?.professions?.includes(s.id);
        return '<button class="chip ' + (selected ? 'active' : '') + '" onclick="toggleProfession(\'' + s.id + '\')">' + s.icon + ' ' + s.title + '</button>';
    }).join('');

    var pendingHTML = '';
    if (pendingRequests.length > 0) {
        pendingHTML = '<div class="section"><h2 class="section-title">🔔 Nuevas Solicitudes</h2>';
        pendingRequests.forEach(function (r) {
            var urg = URGENCY_OPTIONS.find(function (u) { return u.id === r.urgency; });
            var schedHTML = '';
            if (r.scheduledAt) {
                var schedDate = new Date(r.scheduledAt);
                schedHTML = '<p class="job-address">📅 Programada: ' + schedDate.toLocaleString(getActiveSettings().locale, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) + '</p>';
            }
            var hasQuote = r.quote !== null && r.quote !== undefined;
            pendingHTML += '<div class="job-card"><div class="job-card-header"><span class="job-service">' + r.serviceTitle + '</span><span>' + (urg?.icon || '🟡') + ' ' + r.urgency + '</span></div><p class="job-desc">' + r.description + '</p><p class="job-address">📍 ' + r.address + '</p>' + schedHTML + '<div class="job-actions"><button class="btn-accept" onclick="quoteRequest(\'' + r.id + '\')">' + (hasQuote ? 'Cotización enviada' : 'Enviar cotización') + '</button><button class="btn-decline" onclick="acceptRequest(\'' + r.id + '\')">Aceptar directo</button></div></div>';
        });
        pendingHTML += '</div>';
    }

    var activeHTML = '';
    if (activeJobs.length > 0) {
        activeHTML = '<div class="section"><h2 class="section-title">Trabajos Activos</h2>';
        activeJobs.forEach(function (r) {
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

    viewContainer.innerHTML = '<div class="fade-in"><h1 class="greeting">Panel <span class="accent">Profesional</span></h1><div class="stats-grid"><div class="stat-card" onclick="navigate(\'wallet\')" style="cursor:pointer"><div class="stat-value">' + formatCurrency(user?.earnings || 0) + '</div><div class="stat-label">Ganancias 💰</div></div><div class="stat-card"><div class="stat-value">' + (user?.totalJobs || 0) + '</div><div class="stat-label">Trabajos</div></div><div class="stat-card"><div class="stat-value">⭐ ' + ((user?.rating || 5.0).toFixed(1)) + '</div><div class="stat-label">Rating</div></div></div><div class="section"><h2 class="section-title">Tus Profesiones</h2><div class="chips-row">' + chipsHTML + '</div></div>' + pendingHTML + activeHTML + emptyHTML + '</div>';
}

// ---- MAP LOCATION PICKER (Fullscreen) ----
window.openMapPicker = function (initialCoords, onConfirm) {
    if (typeof L === 'undefined') {
        showToast('No se pudo cargar el mapa. Revisa tu conexión.', 'error');
        return;
    }

    var lat = initialCoords?.lat || store.get('user')?.lat || CONFIG.DEFAULT_LAT || 19.4326;
    var lng = initialCoords?.lng || store.get('user')?.lng || CONFIG.DEFAULT_LNG || -99.1332;

    var overlay = document.createElement('div');
    overlay.className = 'map-picker-overlay';
    overlay.innerHTML = '<div class="map-picker-header"><button class="btn-icon" id="mp-close">✕</button><h2>Elige tu ubicación</h2><span class="mp-gps-status" id="mp-gps-status"></span></div>' +
        '<div class="map-picker-map" id="mp-map"></div>' +
        '<button class="map-locate-btn" id="mp-locate" aria-label="Ir a mi ubicación"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><circle cx="12" cy="12" r="9" opacity="0.4"></circle><line x1="12" y1="1" x2="12" y2="5"></line><line x1="12" y1="19" x2="12" y2="23"></line><line x1="1" y1="12" x2="5" y2="12"></line><line x1="19" y1="12" x2="23" y2="12"></line></svg></button>' +
        '<div class="map-picker-footer"><div class="mp-address-label" id="mp-address">Obteniendo dirección...</div><button class="btn-primary" id="mp-confirm">✅ Confirmar ubicación</button></div>';

    document.body.appendChild(overlay);

    var map = L.map('mp-map', { zoomControl: false }).setView([lat, lng], 16);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);

    var marker = L.marker([lat, lng], { draggable: true }).addTo(map);

    var addressEl = document.getElementById('mp-address');
    var gpsStatusEl = document.getElementById('mp-gps-status');
    var resolvedAddress = null;
    var geocodeSeq = 0;

    function coordsLabel(ll) {
        return ll.lat.toFixed(5) + ', ' + ll.lng.toFixed(5);
    }

    function updateAddress() {
        var ll = marker.getLatLng();
        resolvedAddress = null;
        addressEl.textContent = '📍 ' + coordsLabel(ll);
        var seq = ++geocodeSeq;
        // Reverse geocoding para dirección legible
        fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + ll.lat + '&lon=' + ll.lng + '&accept-language=' + (getActiveSettings() ? getActiveSettings().locale.split('-')[0] : 'es'))
            .then(function (r) { return r.json(); })
            .then(function (d) {
                if (seq !== geocodeSeq) return;
                if (d && d.display_name) {
                    var parts = d.display_name.split(', ').slice(0, 3).join(', ');
                    resolvedAddress = parts;
                    addressEl.textContent = '📍 ' + parts;
                }
            })
            .catch(function () { });
    }

    updateAddress();

    marker.on('dragend', updateAddress);
    map.on('click', function (e) {
        marker.setLatLng(e.latlng);
        updateAddress();
    });

    // Botón "Ir a mi ubicación actual" (derecha)
    document.getElementById('mp-locate').addEventListener('click', function () {
        if (!navigator.geolocation) {
            showToast('Tu navegador no soporta geolocalización.', 'error');
            return;
        }
        gpsStatusEl.textContent = 'Buscando...';
        gpsStatusEl.classList.add('loading');
        navigator.geolocation.getCurrentPosition(function (pos) {
            var clat = pos.coords.latitude;
            var clng = pos.coords.longitude;
            marker.setLatLng([clat, clng]);
            map.setView([clat, clng], 17);
            located = true;
            gpsStatusEl.textContent = '📍';
            gpsStatusEl.classList.remove('loading');
            updateAddress();
            showToast('Esta es tu ubicación actual.', 'success');
        }, function (err) {
            gpsStatusEl.textContent = '';
            gpsStatusEl.classList.remove('loading');
            showToast('No se pudo obtener tu ubicación. Activa el GPS y los permisos.', 'warning');
        }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 });
    });

    // Cerrar
    function closePicker() {
        overlay.remove();
        map.remove();
    }
    document.getElementById('mp-close').addEventListener('click', closePicker);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closePicker(); });

    // Confirmar
    document.getElementById('mp-confirm').addEventListener('click', function () {
        var ll = marker.getLatLng();
        var addr = resolvedAddress || coordsLabel(ll);
        closePicker();
        if (onConfirm) onConfirm({ lat: ll.lat, lng: ll.lng, address: addr });
    });
};

// ---- NEW REQUEST (Uber Bottom Sheet style) ----
window.openNewRequestSheet = function (serviceId) {
    var service = SERVICES.find(function (s) { return s.id === serviceId; }) || SERVICES[0];
    var userAddress = store.get('user')?.address || '';
    var savedAddresses = store.getAddressBook();
    var paymentMethods = store.getPaymentMethods();

    var addressBookHTML = '';
    if (savedAddresses.length > 0) {
        var addrOptions = savedAddresses.map(function (a) {
            return '<option value="' + a.address + '">📍 ' + (a.label || 'Dirección') + '</option>';
        }).join('');
        addressBookHTML = '<div class="input-group"><label>Dirección guardada</label><select id="req-saved-address"><option value="">Seleccionar de la libreta...</option>' + addrOptions + '</select></div>';
    }

    var paymentHTML = '';
    if (paymentMethods.length > 0) {
        var pmOptions = paymentMethods.map(function (m, i) {
            var label = m.brand === 'Efectivo' ? '💵 Efectivo' : '💳 ' + m.brand + ' •••• ' + m.last4;
            return '<button type="button" class="urgency-btn ' + (i === 0 ? 'active' : '') + '" data-pmid="' + m.id + '" style="flex:1; padding:10px; font-size:12px;"><span style="display:block;margin-bottom:4px;font-size:18px;">' + (m.brand === 'Efectivo' ? '💵' : '💳') + '</span><span>' + (m.last4 ? '•••• ' + m.last4 : m.brand) + '</span></button>';
        }).join('');
        paymentHTML = '<div class="input-group"><label>Método de pago</label><div style="display:flex; gap:8px;">' + pmOptions + '</div></div>';
    }

    var overlay = document.createElement('div');
    overlay.className = 'sheet-overlay';

    var urgencyHTML = URGENCY_OPTIONS.map(function (u) {
        return '<button type="button" class="urgency-btn ' + (u.id === 'normal' ? 'active' : '') + '" data-urgency="' + u.id + '" style="flex:1; padding: 10px; font-size:12px;"><span style="display:block;margin-bottom:4px;font-size:18px;">' + u.icon + '</span><span>' + u.label + '</span></button>';
    }).join('');

    var minSched = new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16);

    overlay.innerHTML = '<div class="uber-bottom-sheet" id="request-sheet" onclick="event.stopPropagation()">' +
        '<div class="sheet-handle"></div>' +
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px;">' +
        '<h2 style="font-size: 20px; font-weight:800;">' + service.icon + ' ' + service.title + '</h2>' +
        '<button class="btn-icon" id="close-sheet">✕</button>' +
        '</div>' +
        '<div class="mini-map" id="sheet-map"><div class="mini-map-hint">📍 Toca para elegir tu ubicación</div><button type="button" class="mini-map-locate" id="mini-locate" aria-label="Ir a mi ubicación">🎯</button></div>' +
        '<form id="request-form">' +
        addressBookHTML +
        '<div class="input-group"><input type="text" id="req-address" placeholder="Confirma tu ubicación..." value="' + userAddress + '" required style="font-weight:600; font-size:15px; padding:14px; background:var(--bg-tertiary); border:1px solid var(--border); border-radius:12px; width:100%; color:var(--text);"></div>' +
        '<div class="input-group"><textarea id="req-desc" placeholder="¿Qué problema tienes exactamente?" rows="2" required style="font-size:14px; padding:14px; background:var(--bg-tertiary); border:1px solid var(--border); border-radius:12px; width:100%; color:var(--text); font-family:var(--font); outline:none; resize:none;"></textarea></div>' +
        '<div class="input-group"><label>Urgencia</label><div style="display:flex; gap:8px;">' + urgencyHTML + '</div></div>' +
        '<div class="input-group"><label>¿Cuándo?</label><div style="display:flex; gap:8px;">' +
        '<button type="button" class="urgency-btn active" data-sched="now" style="flex:1; padding:10px; font-size:12px;"><span style="display:block;margin-bottom:4px;font-size:18px;">⚡</span><span>Lo antes posible</span></button>' +
        '<button type="button" class="urgency-btn" data-sched="later" style="flex:1; padding:10px; font-size:12px;"><span style="display:block;margin-bottom:4px;font-size:18px;">📅</span><span>Programar cita</span></button>' +
        '</div></div>' +
        '<div class="input-group hidden" id="sched-field"><label>Fecha y hora</label><input type="datetime-local" id="req-scheduled" min="' + minSched + '" style="font-size:15px;"></div>' +
        paymentHTML +
        '<button type="submit" class="btn-primary" style="padding:16px; font-size:16px; border-radius:16px; margin-top:8px;">Pedir Servicio Ahora</button>' +
        '</form>' +
        '</div>';

    document.body.appendChild(overlay);

    var closeSheet = function () {
        document.getElementById('request-sheet').style.transform = 'translateY(100%)';
        overlay.style.opacity = '0';
        setTimeout(function () { overlay.remove(); }, 300);
    };

    document.getElementById('close-sheet').addEventListener('click', closeSheet);
    overlay.addEventListener('click', closeSheet);

    var selectedUrgency = 'normal';
    overlay.querySelectorAll('.urgency-btn[data-urgency]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            overlay.querySelectorAll('.urgency-btn[data-urgency]').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            selectedUrgency = btn.getAttribute('data-urgency');
        });
    });

    var selectedSched = 'now';
    var selectedPaymentId = paymentMethods.length > 0 ? paymentMethods[0].id : null;
    overlay.querySelectorAll('.urgency-btn[data-sched]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            overlay.querySelectorAll('.urgency-btn[data-sched]').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            selectedSched = btn.getAttribute('data-sched');
            document.getElementById('sched-field').classList.toggle('hidden', selectedSched === 'now');
        });
    });

    overlay.querySelectorAll('.urgency-btn[data-pmid]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            overlay.querySelectorAll('.urgency-btn[data-pmid]').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            selectedPaymentId = btn.getAttribute('data-pmid');
        });
    });

    var savedAddrSelect = document.getElementById('req-saved-address');
    if (savedAddrSelect) {
        savedAddrSelect.addEventListener('change', function () {
            if (this.value) document.getElementById('req-address').value = this.value;
        });
    }

    // ---- Selector de ubicación en el mapa (mini + fullscreen) ----
    var selectedCoords = null;
    var miniMap = null;
    var miniMarker = null;

    function placeMiniMap(lat, lng) {
        if (miniMap && miniMarker) {
            miniMap.setView([lat, lng], 15);
            miniMarker.setLatLng([lat, lng]);
        }
    }

    // Initialize Mini Map
    setTimeout(function () {
        var mapEl = document.getElementById('sheet-map');
        if (mapEl && window.L) {
            var lat = store.get('user')?.lat || CONFIG.DEFAULT_LAT || 19.4326;
            var lng = store.get('user')?.lng || CONFIG.DEFAULT_LNG || -99.1332;
            miniMap = L.map('sheet-map', { zoomControl: false }).setView([lat, lng], 15);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(miniMap);
            miniMarker = L.marker([lat, lng]).addTo(miniMap);
        }
    }, 400);

    // Abrir el selector de ubicación a pantalla completa
    function openLocationPicker() {
        openMapPicker(selectedCoords, function (res) {
            selectedCoords = { lat: res.lat, lng: res.lng };
            document.getElementById('req-address').value = res.address;
            placeMiniMap(res.lat, res.lng);
            showToast('Ubicación confirmada 📍', 'success');
        });
    }

    var sheetMapEl = document.getElementById('sheet-map');
    sheetMapEl.addEventListener('click', openLocationPicker);
    document.getElementById('mini-locate').addEventListener('click', function (e) {
        e.stopPropagation();
        openLocationPicker();
    });

    document.getElementById('request-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        var submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Buscando...'; submitBtn.disabled = true;

        try {
            var scheduledAt = null;
            if (selectedSched === 'later') {
                var schedVal = document.getElementById('req-scheduled').value;
                if (!schedVal) {
                    showToast('Selecciona una fecha para tu cita.', 'warning');
                    submitBtn.textContent = 'Pedir Servicio Ahora'; submitBtn.disabled = false;
                    return;
                }
                scheduledAt = new Date(schedVal).toISOString();
            }
            await store.createRequest({
                serviceId: service.id, serviceTitle: service.title,
                description: document.getElementById('req-desc').value,
                urgency: selectedUrgency, address: document.getElementById('req-address').value,
                scheduledAt: scheduledAt,
                paymentMethodId: selectedPaymentId,
                lat: selectedCoords?.lat || null,
                lng: selectedCoords?.lng || null,
                photoData: null // Simplified for Uber style speed
            });
            showToast('Buscando profesionales cerca de ti...', 'success');
            closeSheet();
            setTimeout(function () { navigate('home'); }, 300);
        } catch (err) {
            showToast('Error: ' + err.message, 'error');
            submitBtn.textContent = 'Pedir Servicio Ahora'; submitBtn.disabled = false;
        }
    });
};

// ---- SELECT PROVIDER ----
function renderSelectProvider() {
    var serviceId = _viewParams.serviceId;
    var favIds = store.getFavorites();
    var allPros = MOCK_PROFESSIONALS.filter(function (p) { return p.professions.includes(serviceId); });

    var stepperHTML = '<div class="stepper"><div class="stepper-step"><div class="step-circle done">✓</div></div><div class="step-line done"></div><div class="stepper-step"><div class="step-circle active">2</div></div><div class="step-line"></div><div class="stepper-step"><div class="step-circle">3</div></div></div>';

    viewContainer.innerHTML = '<div class="slide-in"><button class="btn-back" onclick="navigate(\'requests\')">← Volver</button>' + stepperHTML + '<h2 class="page-title">Elige profesional</h2><p class="text-secondary" style="margin-top:-12px;margin-bottom:16px"><span id="pro-count">' + allPros.length + '</span> disponibles cerca de ti</p>' +
        '<div class="filter-bar"><button class="filter-chip active" data-sort="recommended">Recomendados</button><button class="filter-chip" data-sort="rating">⭐ Mejor rating</button><button class="filter-chip" data-sort="price">💰 Menor precio</button><button class="filter-chip" data-sort="distance">📍 Más cerca</button><button class="filter-chip" data-sort="favorites">⭐ Favoritos</button></div>' +
        '<div class="providers-list" id="providers-list">' + buildProviderCards(allPros, favIds) + '</div></div>';

    document.querySelectorAll('.filter-chip').forEach(function (chip) {
        chip.addEventListener('click', function () {
            document.querySelectorAll('.filter-chip').forEach(function (c) { c.classList.remove('active'); });
            chip.classList.add('active');
            var sort = chip.getAttribute('data-sort');
            var list = allPros.slice();
            if (sort === 'rating') list.sort(function (a, b) { return b.rating - a.rating; });
            else if (sort === 'price') list.sort(function (a, b) { return a.ratePerHour - b.ratePerHour; });
            else if (sort === 'distance') list.sort(function (a, b) { return a.distance - b.distance; });
            else if (sort === 'favorites') list = list.filter(function (p) { return favIds.includes(p.id); });
            document.getElementById('providers-list').innerHTML = buildProviderCards(list, favIds);
            document.getElementById('pro-count').textContent = list.length;
        });
    });
}

function buildProviderCards(pros, favIds) {
    if (pros.length === 0) {
        return '<div class="empty-state"><span class="empty-icon">🔍</span><p>No hay profesionales con ese filtro</p></div>';
    }
    return pros.map(function (p) {
        var isFav = favIds.includes(p.id);
        return '<div class="provider-card"><div class="provider-avatar">' + p.avatar + '</div><div class="provider-info"><h3>' + p.name + '</h3><div class="provider-meta"><span>⭐ ' + p.rating + '</span><span>•</span><span>' + p.totalJobs + ' trabajos</span><span>•</span><span>📍 ' + p.distance + ' km</span></div><p class="provider-desc">' + p.description + '</p><div class="provider-rate">' + formatCurrency(p.ratePerHour) + '/hr</div></div><div class="provider-actions"><button class="btn-icon" onclick="toggleFavorite(\'' + p.id + '\')" style="color:' + (isFav ? '#ffd700' : 'var(--text-tertiary)') + '">' + (isFav ? '★' : '☆') + '</button><button class="btn-secondary" onclick="navigate(\'provider-detail\', {id:\'' + p.id + '\'})">Ver</button><button class="btn-primary small" onclick="selectProvider(\'' + p.id + '\')">Solicitar</button></div></div>';
    }).join('');
}

// ---- PROVIDER DETAIL ----
function renderProviderDetail() {
    var pro = MOCK_PROFESSIONALS.find(function (p) { return p.id === _viewParams.id; });
    if (!pro) return navigate('home');
    var ratings = store.getProviderRatings(pro.id);
    var profNames = pro.professions.map(function (pid) { var s = SERVICES.find(function (ss) { return ss.id === pid; }); return s ? s.title : pid; });
    var isFav = store.isFavorite(pro.id);

    var ratingsHTML = '';
    if (ratings.length > 0) {
        ratingsHTML = '<div class="section"><h3 class="section-title">Reseñas (' + ratings.length + ')</h3>';
        ratings.forEach(function (r) { ratingsHTML += '<div class="review-card"><div class="review-stars">' + '⭐'.repeat(r.stars) + '</div><p>' + r.comment + '</p></div>'; });
        ratingsHTML += '</div>';
    }

    viewContainer.innerHTML = '<div class="slide-in"><button class="btn-back" onclick="navigate(\'home\')">← Volver</button><div class="provider-profile"><div class="provider-avatar large">' + pro.avatar + '</div><button class="btn-icon fav-toggle ' + (isFav ? 'active' : '') + '" onclick="toggleFavorite(\'' + pro.id + '\')" aria-label="Favorito" style="position:absolute;right:20px;color:' + (isFav ? '#ffd700' : 'var(--text-tertiary)') + ';font-size:28px">' + (isFav ? '★' : '☆') + '</button><h2 style="font-size:22px;font-weight:800;margin-top:12px">' + pro.name + '</h2><div class="provider-meta centered" style="margin-top:6px"><span>⭐ ' + pro.rating + '</span><span>•</span><span>' + pro.totalJobs + ' trabajos</span><span>•</span><span>📍 ' + pro.distance + ' km</span></div><div class="provider-rate-large">' + formatCurrency(pro.ratePerHour) + ' <span style="font-size:16px;-webkit-text-fill-color:var(--text-secondary)">/hora</span></div><div class="section"><h3 class="section-title">Profesiones</h3><div class="chips-row" style="justify-content:center">' + profNames.map(function (n) { return '<span class="chip active">' + n + '</span>'; }).join('') + '</div></div><div class="section"><h3 class="section-title">Sobre mí</h3><p class="text-secondary" style="text-align:left;line-height:1.5">' + pro.description + '</p></div>' + ratingsHTML + '</div></div>';
}

// ---- REQUESTS ----
function renderRequests() {
    var role = store.get('role');
    var userId = store.get('user')?.id;
    var allRequests = role === 'client'
        ? store.get('requests').filter(function (r) { return r.clientId === userId; })
        : store.getProviderRequests();

    var active = allRequests.filter(function (r) { return ['pending', 'accepted', 'in_progress'].includes(r.status); });
    var completed = allRequests.filter(function (r) { return r.status === 'completed'; });

    var activeHTML = '';
    if (active.length > 0) {
        activeHTML = '<div class="section" style="margin-top:0"><h3 class="section-title">Activas</h3>';
        active.forEach(function (r) {
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
        completed.slice(0, 5).forEach(function (r) {
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
    var provider = request.providerId ? MOCK_PROFESSIONALS.find(function (p) { return p.id === request.providerId; }) || { name: request.providerName, avatar: '👷', id: request.providerId } : null;
    var urgOpt = URGENCY_OPTIONS.find(function (u) { return u.id === request.urgency; });

    var providerHTML = '';
    if (provider) {
        providerHTML = '<div class="detail-section"><h3>Profesional</h3><div class="provider-mini" onclick="navigate(\'provider-detail\', {id:\'' + provider.id + '\'})"><span class="provider-avatar small">' + provider.avatar + '</span><div><div style="font-weight:600">' + provider.name + '</div>' + (provider.rating ? '<div class="text-secondary" style="font-size:12px">⭐ ' + provider.rating + '</div>' : '') + '</div></div></div>';
    }

    var timelineHTML = '';
    var tl = request.statusTimeline || {};
    if (tl && Object.keys(tl).length > 0) {
        var tlSteps = [
            { key: 'created', label: 'Solicitado', icon: '📋' },
            { key: 'accepted', label: 'Aceptado', icon: '🚗' },
            { key: 'in_progress', label: 'En progreso', icon: '🔧' },
            { key: 'completed', label: 'Completado', icon: '✅' },
            { key: 'cancelled', label: 'Cancelado', icon: '❌' }
        ];
        var tlDone = 0;
        timelineHTML = '<div class="detail-section"><h3>Línea de tiempo</h3><div class="timeline">';
        tlSteps.forEach(function (step, i) {
            var ts = tl[step.key];
            var isDone = !!ts;
            var isLast = i === tlSteps.length - 1;
            var isActive = request.status === step.key;
            if (isDone) tlDone++;
            timelineHTML += '<div class="timeline-step ' + (isDone ? 'done' : '') + ' ' + (isActive ? 'active' : '') + '">' +
                '<div class="timeline-dot">' + (isDone ? step.icon : '') + '</div>' +
                (isLast ? '' : '<div class="timeline-line ' + (isDone ? 'done' : '') + '"></div>') +
                '<div class="timeline-content"><div class="timeline-label">' + step.label + '</div>' +
                (ts ? '<div class="timeline-date">' + new Date(ts).toLocaleString(getActiveSettings().locale, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) + '</div>' : '') +
                '</div></div>';
        });
        timelineHTML += '</div></div>';
    }

    var scheduledHTML = '';
    if (request.scheduledAt) {
        scheduledHTML = '<div class="detail-row"><span class="text-secondary">Programada</span><span>📅 ' + new Date(request.scheduledAt).toLocaleString(getActiveSettings().locale, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) + '</span></div>';
    }

    var paymentHTML = '';
    if (request.paymentMethodId) {
        var pm = store.getPaymentMethod(request.paymentMethodId);
        if (pm) {
            paymentHTML = '<div class="detail-row"><span class="text-secondary">Pago</span><span>' + (pm.brand === 'Efectivo' ? '💵 Efectivo' : '💳 ' + pm.brand + ' •••• ' + pm.last4) + '</span></div>';
        }
    }

    var quoteHTML = '';
    if (request.quoteStatus === 'pending' && request.quote !== null && request.quote !== undefined && role === 'client') {
        quoteHTML = '<div class="detail-section quote-box"><h3>Cotización recibida</h3><div class="quote-price">' + formatCurrency(request.quote) + '</div>' + (request.quoteNote ? '<p class="quote-note">" ' + request.quoteNote + '"</p>' : '') + '<p class="text-secondary" style="font-size:13px;margin-top:6px">' + (provider ? provider.name : request.providerName) + ' envió esta cotización.</p><div class="quote-actions"><button class="btn-primary" onclick="approveQuote(\'' + request.id + '\')">✅ Aprobar cotización</button><button class="btn-danger" onclick="declineQuote(\'' + request.id + '\')">Rechazar</button></div></div>';
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

    viewContainer.innerHTML = '<div class="slide-in"><button class="btn-back" onclick="navigate(\'requests\')">← Volver</button><div class="detail-header"><h2>' + request.serviceTitle + '</h2><span class="status-badge large" style="background:' + status.color + '18; color:' + status.color + '">' + status.icon + ' ' + status.label + '</span></div><div class="detail-section"><h3>Descripción</h3><p style="line-height:1.5">' + request.description + '</p></div>' + photoHTML + '<div class="detail-section"><h3>Detalles</h3><div class="detail-row"><span class="text-secondary">Urgencia</span><span>' + (urgOpt?.icon || '') + ' ' + (urgOpt?.label || request.urgency) + '</span></div>' + scheduledHTML + '<div class="detail-row"><span class="text-secondary">Dirección</span><span>📍 ' + request.address + '</span></div><div class="detail-row"><span class="text-secondary">Fecha</span><span>' + new Date(request.createdAt).toLocaleDateString(getActiveSettings().locale) + '</span></div>' + paymentHTML + (request.price ? '<div class="detail-row"><span class="text-secondary">Precio</span><span style="font-weight:700;color:var(--accent)">' + formatCurrency(request.price) + '</span></div>' : '') + '</div>' + quoteHTML + providerHTML + timelineHTML + actionsHTML + '</div>';
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
        : messages.map(function (m) {
            var isMine = m.sender === userId;
            var time = new Date(m.timestamp).toLocaleTimeString(getActiveSettings().locale, { hour: '2-digit', minute: '2-digit' });
            return '<div class="chat-bubble ' + (isMine ? 'mine' : 'theirs') + '"><p>' + m.message + '</p><span class="chat-time">' + time + '</span></div>';
        }).join('');

    viewContainer.innerHTML = '<div class="chat-screen fade-in"><div class="chat-header"><button class="btn-back" onclick="navigate(\'request-detail\', {id:\'' + request.id + '\'})">←</button><div class="chat-title"><h3>' + chatPartner + '</h3><span class="text-secondary">' + request.serviceTitle + '</span></div></div><div class="chat-messages" id="chat-messages">' + msgsHTML + '</div><div class="chat-input-bar"><input type="text" id="chat-input" placeholder="Escribe un mensaje..." autocomplete="off"><button class="btn-send" onclick="sendMessage(\'' + _viewParams.requestId + '\')"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg></button></div></div>';

    var chatBox = document.getElementById('chat-messages');
    chatBox.scrollTop = chatBox.scrollHeight;

    document.getElementById('chat-input').addEventListener('keypress', function (e) {
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

    document.querySelectorAll('.star-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            selectedStars = parseInt(btn.getAttribute('data-star'));
            document.querySelectorAll('.star-btn').forEach(function (b, i) {
                b.textContent = i < selectedStars ? '★' : '☆';
                b.classList.toggle('filled', i < selectedStars);
            });
            document.getElementById('star-label').textContent = starLabels[selectedStars];
            document.getElementById('submit-rating').disabled = false;
        });
    });

    document.getElementById('submit-rating').addEventListener('click', function () {
        var comment = document.getElementById('review-comment').value;
        store.addRating(request.id, request.providerId, selectedStars, comment);
        showToast('¡Gracias! Calificación de ' + selectedStars + ' estrellas enviada.', 'success');
        navigate('requests');
    });
}

// ---- NOTIFICATIONS ----
function renderNotifications() {
    var notifications = store.get('notifications');
    var hasUnread = notifications.some(function (n) { return !n.read; });

    var listHTML = '';
    if (notifications.length === 0) {
        listHTML = '<div class="empty-state"><span class="empty-icon">🔔</span><p>No tienes notificaciones</p></div>';
    } else {
        listHTML = '<div class="notifications-list">';
        notifications.forEach(function (n) {
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
    var prosListHTML = MOCK_PROFESSIONALS.slice(0, 6).map(function (p) {
        return '<div class="mock-pro-item" onclick="navigate(\'provider-detail\', {id:\'' + p.id + '\'})">' +
            '<span>' + p.avatar + '</span><span>' + p.name + '</span><span class="text-secondary">' + p.distance + ' km</span></div>';
    }).join('');

    viewContainer.innerHTML = '<div class="fade-in"><h2 class="page-title">Mapa</h2><div id="leaflet-map" class="map-container"></div><div class="map-legend"><span class="legend-item"><span class="legend-dot" style="background:var(--accent)"></span> Profesionales</span></div></div>';

    setTimeout(function () {
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
            MOCK_PROFESSIONALS.forEach(function (p) {
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
        var chips = (user.professions || []).map(function (pid) {
            var s = SERVICES.find(function (ss) { return ss.id === pid; });
            return s ? '<span class="chip active">' + s.icon + ' ' + s.title + '</span>' : '';
        }).join('');
        profsHTML = '<div class="section"><h3 class="section-title">Mis Profesiones</h3><div class="chips-row">' + chips + '</div></div><div class="section"><h3 class="section-title">Descripción</h3><p class="text-secondary">' + (user.description || 'Sin descripción') + '</p></div>';
    }

    viewContainer.innerHTML = '<div class="fade-in"><div class="profile-header"><div class="profile-avatar">👤</div><h2>' + (user?.name || 'Usuario') + '</h2><p class="text-secondary">' + (user?.email || '') + '</p><p class="text-secondary" style="margin-top:2px">📍 ' + (user?.address || 'Sin dirección') + '</p></div><div class="stats-grid"><div class="stat-card"><div class="stat-value">' + completedJobs.length + '</div><div class="stat-label">Servicios</div></div><div class="stat-card"><div class="stat-value">⭐ ' + ((user?.rating || 5.0).toFixed(1)) + '</div><div class="stat-label">Rating</div></div></div>' + profsHTML + '<div class="profile-menu"><button class="menu-item" onclick="navigate(\'edit-profile\')"><span>✏️ Editar Perfil</span><span class="arrow">›</span></button><button class="menu-item" onclick="navigate(\'wallet\')"><span>💳 ' + (user?.role === 'provider' ? 'Cartera y Ganancias' : 'Pagos y Cartera') + '</span><span class="arrow">›</span></button><button class="menu-item" onclick="navigate(\'payment-methods\')"><span>💳 Métodos de Pago</span><span class="arrow">›</span></button><button class="menu-item" onclick="navigate(\'address-book\')"><span>📌 Libreta de Direcciones</span><span class="arrow">›</span></button><button class="menu-item" onclick="navigate(\'favorites\')"><span>⭐ Favoritos</span><span class="arrow">›</span></button><button class="menu-item" onclick="navigate(\'history\')"><span>📋 Historial</span><span class="arrow">›</span></button><button class="menu-item" onclick="navigate(\'notifications\')"><span>🔔 Notificaciones</span><span class="arrow">›</span></button><button class="menu-item danger" onclick="confirmLogout()"><span>🚪 Cerrar Sesión</span><span class="arrow">›</span></button></div></div>';
}

// ---- EDIT PROFILE ----
function renderEditProfile() {
    var user = store.get('user');
    var proHTML = '';
    if (user?.role === 'provider') {
        var profsGrid = SERVICES.map(function (s) {
            var checked = user.professions?.includes(s.id) ? 'checked' : '';
            return '<label class="profession-check"><input type="checkbox" value="' + s.id + '" name="edit-professions" ' + checked + '><span>' + s.icon + ' ' + s.title + '</span></label>';
        }).join('');
        proHTML = '<div class="input-group"><label>Tarifa por hora (' + getActiveSettings().currencySymbol + ' ' + getActiveSettings().currency + ')</label><input type="number" id="edit-rate" value="' + (user.ratePerHour || '') + '" min="50"></div><div class="input-group"><label>Descripción profesional</label><textarea id="edit-desc" rows="3">' + (user.description || '') + '</textarea></div><div class="input-group"><label>Profesiones</label><div class="professions-grid">' + profsGrid + '</div></div>';
    }

    viewContainer.innerHTML = '<div class="slide-in"><button class="btn-back" onclick="navigate(\'profile\')">← Volver</button><h2 class="page-title">Editar Perfil</h2><form id="edit-form"><div class="input-group"><label>Nombre completo</label><input type="text" id="edit-name" value="' + (user?.name || '') + '" required></div><div class="input-group"><label>Teléfono</label><input type="tel" id="edit-phone" value="' + (user?.phone || '') + '" placeholder="' + getActiveSettings().translations.phone_placeholder + '"></div><div class="input-group"><label>Dirección</label><input type="text" id="edit-address" value="' + (user?.address || '') + '"></div>' + proHTML + '<button type="submit" class="btn-primary">Guardar Cambios</button></form></div>';

    document.getElementById('edit-form').addEventListener('submit', function (e) {
        e.preventDefault();
        var updates = { name: document.getElementById('edit-name').value, phone: document.getElementById('edit-phone').value, address: document.getElementById('edit-address').value };
        if (user?.role === 'provider') {
            updates.ratePerHour = parseInt(document.getElementById('edit-rate')?.value) || 0;
            updates.description = document.getElementById('edit-desc')?.value || '';
            var profs = [];
            document.querySelectorAll('input[name="edit-professions"]:checked').forEach(function (cb) { profs.push(cb.value); });
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
        completed.forEach(function (r) {
            listHTML += '<div class="request-card completed" onclick="navigate(\'request-detail\', {id:\'' + r.id + '\'})">';
            listHTML += '<div class="request-card-top"><span class="request-service">' + r.serviceTitle + '</span><span class="text-secondary">' + new Date(r.createdAt).toLocaleDateString(getActiveSettings().locale) + '</span></div>';
            listHTML += '<p class="request-desc-preview">' + r.description.substring(0, 80) + '</p>';
            listHTML += '<div class="request-card-bottom">' + (r.rating ? '<div class="review-stars small">' + '⭐'.repeat(r.rating) + '</div>' : '<span class="text-secondary">Sin calificar</span>') + (r.price ? '<span style="font-weight:600">' + formatCurrency(r.price) + '</span>' : '') + '</div></div>';
        });
    }
    viewContainer.innerHTML = '<div class="slide-in"><button class="btn-back" onclick="navigate(\'profile\')">← Volver</button><h2 class="page-title">Historial</h2>' + listHTML + '</div>';
}

// ---- WALLET (Ganancias) ----
function renderWallet() {
    var role = store.get('role');
    var isProvider = role === 'provider';
    var stats = store.getWalletStats();

    var paymentMethods = store.getPaymentMethods();
    var pmSummary = paymentMethods.length > 0
        ? paymentMethods.map(function (m) { return m.brand + ' •••• ' + (m.last4 || '····'); }).join(', ')
        : 'Sin métodos guardados';

    var txHTML = '';
    if (stats.transactions.length === 0) {
        txHTML = '<div class="empty-state"><span class="empty-icon">' + (isProvider ? '💰' : '🧾') + '</span><p>No hay transacciones completadas todavía</p></div>';
    } else {
        txHTML = '<div class="transactions-list">';
        stats.transactions.forEach(function (r) {
            var isPlus = isProvider;
            txHTML += '<div class="transaction-item"><div class="transaction-icon">' + (isPlus ? '⬇️' : '⬆️') + '</div><div class="transaction-info"><div style="font-weight:600">' + r.serviceTitle + '</div><span class="text-secondary" style="font-size:12px">' + new Date(r.createdAt).toLocaleDateString(getActiveSettings().locale) + '</span></div><div class="transaction-amount ' + (isPlus ? 'positive' : 'negative') + '">' + (isPlus ? '+' : '−') + formatCurrency(r.price || 0) + '</div></div>';
        });
        txHTML += '</div>';
    }

    var providerHTML = isProvider ? '<div class="wallet-cards"><div class="wallet-card main"><div class="wallet-card-label">Balance disponible</div><div class="wallet-balance">' + formatCurrency(stats.totalEarned) + '</div><div class="wallet-card-sub">' + stats.totalJobs + ' trabajos completados</div></div><div class="wallet-cards-row"><div class="wallet-card small"><div class="wallet-card-label">En proceso</div><div class="wallet-value">' + formatCurrency(stats.pendingBalance) + '</div></div><div class="wallet-card small"><div class="wallet-card-label">Rating</div><div class="wallet-value">⭐ ' + stats.avgRating.toFixed(1) + '</div></div></div></div>' : '';

    var clientHTML = !isProvider ? '<div class="wallet-cards"><div class="wallet-card main"><div class="wallet-card-label">Total gastado en servicios</div><div class="wallet-balance">' + formatCurrency(stats.totalEarned) + '</div><div class="wallet-card-sub">' + stats.totalJobs + ' servicios completados</div></div><div class="wallet-cards-row"><div class="wallet-card small"><div class="wallet-card-label">En proceso</div><div class="wallet-value">' + formatCurrency(stats.pendingBalance) + '</div></div><div class="wallet-card small"><div class="wallet-card-label">Métodos de pago</div><div class="wallet-value" style="font-size:13px">' + paymentMethods.length + '</div></div></div></div><button class="btn-secondary full" onclick="navigate(\'payment-methods\')">Gestionar métodos de pago</button>' : '';

    viewContainer.innerHTML = '<div class="slide-in"><button class="btn-back" onclick="navigate(\'profile\')">← Volver</button><h2 class="page-title">' + (isProvider ? 'Cartera y Ganancias' : 'Pagos y Cartera') + '</h2>' + providerHTML + clientHTML + '<div class="section"><h3 class="section-title">Movimientos</h3>' + txHTML + '</div></div>';
}

// ---- PAYMENT METHODS ----
function renderPaymentMethods() {
    var methods = store.getPaymentMethods();

    var listHTML = '';
    if (methods.length === 0) {
        listHTML = '<div class="empty-state"><span class="empty-icon">💳</span><p>Aún no tienes métodos de pago</p></div>';
    } else {
        listHTML = '<div class="payments-list">';
        methods.forEach(function (m) {
            listHTML += '<div class="payment-card"><div class="payment-brand">' + (m.brand === 'Efectivo' ? '💵' : '💳') + '</div><div class="payment-info"><div style="font-weight:600">' + m.brand + '</div><span class="text-secondary" style="font-size:12px">' + (m.last4 ? '•••• ' + m.last4 : m.details || '') + '</span></div><button class="btn-text danger" onclick="removePaymentMethod(\'' + m.id + '\')">Eliminar</button></div>';
        });
        listHTML += '</div>';
    }

    viewContainer.innerHTML = '<div class="slide-in"><button class="btn-back" onclick="navigate(\'profile\')">← Volver</button><h2 class="page-title">Métodos de Pago</h2>' + listHTML + '<div class="section"><button class="btn-primary" onclick="openAddPaymentSheet()">+ Agregar método de pago</button></div></div>';
}

window.openAddPaymentSheet = function () {
    var overlay = document.createElement('div');
    overlay.className = 'sheet-overlay';
    overlay.innerHTML = '<div class="uber-bottom-sheet" onclick="event.stopPropagation()"><div class="sheet-handle"></div><div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;"><h2 style="font-size:20px; font-weight:800;">Agregar método de pago</h2><button class="btn-icon" id="close-pm-sheet">✕</button></div><form id="pm-form"><div class="input-group"><label>Tipo</label><div class="role-selector" style="display:flex; gap:8px;"><button type="button" class="role-option active" data-brand="Efectivo" style="padding:12px; font-size:13px;">💵 Efectivo</button><button type="button" class="role-option" data-brand="Tarjeta" style="padding:12px; font-size:13px;">💳 Tarjeta</button></div></div><div id="pm-card-fields"><div class="input-group"><label>Número de tarjeta</label><input type="text" id="pm-number" placeholder="4242 4242 4242 4242" maxlength="19"></div><div class="input-group"><label>Titular</label><input type="text" id="pm-holder" placeholder="Nombre en la tarjeta"></div><div class="input-group" style="display:flex; gap:10px;"><div style="flex:1"><label>Vencimiento</label><input type="text" id="pm-expiry" placeholder="MM/AA" maxlength="5"></div><div style="flex:1"><label>CVV</label><input type="password" id="pm-cvv" placeholder="123" maxlength="4"></div></div></div><button type="submit" class="btn-primary">Guardar</button></form></div>';
    document.body.appendChild(overlay);

    var selectedBrand = 'Efectivo';
    overlay.querySelectorAll('.role-option').forEach(function (btn) {
        btn.addEventListener('click', function () {
            overlay.querySelectorAll('.role-option').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            selectedBrand = btn.getAttribute('data-brand');
            document.getElementById('pm-card-fields').style.display = selectedBrand === 'Tarjeta' ? '' : 'none';
        });
    });

    document.getElementById('close-pm-sheet').addEventListener('click', function () { overlay.remove(); });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) overlay.remove(); });

    document.getElementById('pm-form').addEventListener('submit', function (e) {
        e.preventDefault();
        if (selectedBrand === 'Tarjeta') {
            var num = document.getElementById('pm-number').value.replace(/[^0-9]/g, '');
            if (num.length < 13) { showToast('Número de tarjeta inválido.', 'error'); return; }
            store.addPaymentMethod({
                brand: 'Tarjeta',
                last4: num.slice(-4),
                holder: document.getElementById('pm-holder').value,
                expiry: document.getElementById('pm-expiry').value,
                details: 'Vence ' + document.getElementById('pm-expiry').value
            });
        } else {
            store.addPaymentMethod({ brand: 'Efectivo', last4: '', details: 'Pago en efectivo al finalizar' });
        }
        overlay.remove();
        renderPaymentMethods();
    });
};

window.removePaymentMethod = function (id) {
    showConfirm('Eliminar método de pago', '¿Seguro que quieres eliminar este método?', 'Eliminar', function () {
        store.removePaymentMethod(id);
        showToast('Método de pago eliminado.', 'info');
        renderPaymentMethods();
    });
};

// ---- ADDRESS BOOK ----
function renderAddressBook() {
    var addresses = store.getAddressBook();

    var listHTML = '';
    if (addresses.length === 0) {
        listHTML = '<div class="empty-state"><span class="empty-icon">📌</span><p>Aún no has guardado direcciones</p></div>';
    } else {
        listHTML = '<div class="addresses-list">';
        addresses.forEach(function (a) {
            listHTML += '<div class="address-card"><div class="address-icon">📍</div><div class="address-info"><div style="font-weight:600">' + (a.label || 'Dirección') + '</div><span class="text-secondary" style="font-size:12px">' + a.address + '</span></div><div style="display:flex; flex-direction:column; gap:4px;"><button class="btn-text" onclick="navigate(\'edit-address\',{id:\'' + a.id + '\'})">Editar</button><button class="btn-text danger" onclick="removeAddress(\'' + a.id + '\')">Eliminar</button></div></div>';
        });
        listHTML += '</div>';
    }

    viewContainer.innerHTML = '<div class="slide-in"><button class="btn-back" onclick="navigate(\'profile\')">← Volver</button><h2 class="page-title">Libreta de Direcciones</h2>' + listHTML + '<div class="section"><button class="btn-primary" onclick="navigate(\'edit-address\')">+ Agregar dirección</button></div></div>';
}

// ---- EDIT ADDRESS (add/edit) ----
function renderEditAddress() {
    var addr = null;
    if (_viewParams.id) {
        addr = store.getAddress(_viewParams.id);
        if (!addr) return navigate('address-book');
    }

    viewContainer.innerHTML = '<div class="slide-in"><button class="btn-back" onclick="navigate(\'address-book\')">← Volver</button><h2 class="page-title">' + (addr ? 'Editar Dirección' : 'Nueva Dirección') + '</h2><form id="addr-form"><div class="input-group"><label>Etiqueta</label><input type="text" id="addr-label" placeholder="Casa, Trabajo, Oficina..." value="' + (addr?.label || '') + '"></div><div class="input-group"><label>Dirección</label><textarea id="addr-text" rows="2" placeholder="Calle, número, colonia, ciudad..." required>' + (addr?.address || '') + '</textarea></div><div class="input-group"><label>Notas (opcional)</label><input type="text" id="addr-notes" placeholder="Referencias, código de acceso..." value="' + (addr?.notes || '') + '"></div><button type="submit" class="btn-primary">Guardar Dirección</button></form></div>';

    document.getElementById('addr-form').addEventListener('submit', function (e) {
        e.preventDefault();
        var data = {
            label: document.getElementById('addr-label').value || 'Dirección',
            address: document.getElementById('addr-text').value,
            notes: document.getElementById('addr-notes').value || ''
        };
        if (addr) {
            store.updateAddress(addr.id, data);
            showToast('Dirección actualizada.', 'success');
        } else {
            store.addAddress(data);
            showToast('Dirección guardada.', 'success');
        }
        navigate('address-book');
    });
}

window.removeAddress = function (id) {
    showConfirm('Eliminar dirección', '¿Seguro que quieres eliminar esta dirección?', 'Eliminar', function () {
        store.removeAddress(id);
        showToast('Dirección eliminada.', 'info');
        renderAddressBook();
    });
};

// ---- FAVORITES ----
function renderFavorites() {
    var favIds = store.getFavorites();
    var favPros = MOCK_PROFESSIONALS.filter(function (p) { return favIds.includes(p.id); });

    var listHTML = '';
    if (favPros.length === 0) {
        listHTML = '<div class="empty-state"><span class="empty-icon">⭐</span><p>No tienes profesionales favoritos</p><p class="text-secondary" style="margin-top:4px;font-size:13px">Marca el ⭐ en un perfil para guardarlo aquí</p></div>';
    } else {
        listHTML = '<div class="providers-list">';
        favPros.forEach(function (p) {
            listHTML += '<div class="provider-card"><div class="provider-avatar">' + p.avatar + '</div><div class="provider-info"><h3>' + p.name + '</h3><div class="provider-meta"><span>⭐ ' + p.rating + '</span><span>•</span><span>' + p.totalJobs + ' trabajos</span><span>•</span><span>📍 ' + p.distance + ' km</span></div><div class="provider-rate">' + formatCurrency(p.ratePerHour) + '/hr</div></div><div class="provider-actions"><button class="btn-icon" onclick="toggleFavorite(\'' + p.id + '\')" style="color:#ffd700">★</button><button class="btn-primary small" onclick="navigate(\'provider-detail\', {id:\'' + p.id + '\'})">Ver</button></div></div>';
        });
        listHTML += '</div>';
    }

    viewContainer.innerHTML = '<div class="slide-in"><button class="btn-back" onclick="navigate(\'profile\')">← Volver</button><h2 class="page-title">Favoritos</h2>' + listHTML + '</div>';
}

window.toggleFavorite = function (proId) {
    var isFav = store.toggleFavorite(proId);
    showToast(isFav ? 'Agregado a favoritos ⭐' : 'Eliminado de favoritos', isFav ? 'success' : 'info');
    var current = store.get('currentView');
    if (current === 'favorites' || current === 'provider-detail' || current === 'select-provider') {
        renderView(current);
    }
};

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
    var pro = MOCK_PROFESSIONALS.find(function (p) { return p.id === proId; });
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
            setTimeout(async function () {
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

window.quoteRequest = function (reqId) {
    var req = store.getRequest(reqId);
    if (!req) return;
    var overlay = document.createElement('div');
    overlay.className = 'sheet-overlay';
    overlay.innerHTML = '<div class="uber-bottom-sheet" onclick="event.stopPropagation()"><div class="sheet-handle"></div><div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;"><h2 style="font-size:20px; font-weight:800;">💰 Enviar cotización</h2><button class="btn-icon" id="close-quote-sheet">✕</button></div><div class="detail-section" style="margin-bottom:12px"><p style="line-height:1.5">' + req.serviceTitle + '</p><p class="text-secondary" style="font-size:13px;margin-top:4px">' + req.description + '</p></div><div class="input-group"><label>Precio (' + getActiveSettings().currencySymbol + ')</label><input type="number" id="quote-price" placeholder="250" min="50" value="' + (req.quote || 250) + '"></div><div class="input-group"><label>Nota para el cliente (opcional)</label><textarea id="quote-note" rows="2" placeholder="Ej. Incluye materiales básicos">' + (req.quoteNote || '') + '</textarea></div><button class="btn-primary" id="quote-send">Enviar cotización</button></div>';
    document.body.appendChild(overlay);

    overlay.querySelector('#close-quote-sheet').addEventListener('click', function () { overlay.remove(); });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) overlay.remove(); });

    overlay.querySelector('#quote-send').addEventListener('click', async function () {
        var price = parseFloat(document.getElementById('quote-price').value);
        if (!price || price < 1) { showToast('Ingresa un precio válido.', 'error'); return; }
        var note = document.getElementById('quote-note').value;
        var user = store.get('user');
        try {
            await store.updateRequest(reqId, {
                quote: price,
                quoteNote: note,
                quoteStatus: 'pending',
                providerId: user.id,
                providerName: user.name,
                price: price
            });
            overlay.remove();
            showToast('Cotización enviada. Esperando aprobación del cliente.', 'success');
            store.addNotification('Cotización enviada por ' + formatCurrency(price) + '.', 'info');
            navigate('home');
        } catch (err) {
            showToast('Error al enviar cotización: ' + err.message, 'error');
        }
    });
};

window.approveQuote = async function (reqId) {
    try {
        await store.updateRequest(reqId, { quoteStatus: 'approved', status: 'accepted' });
        showToast('Cotización aprobada. El profesional está en camino. 🚗', 'success');
        store.addNotification('Cotización aprobada. ¡En camino!', 'success');
        navigate('request-detail', { id: reqId });
    } catch (err) {
        showToast('Error al aprobar cotización: ' + err.message, 'error');
    }
};

window.declineQuote = async function (reqId) {
    try {
        await store.updateRequest(reqId, { quoteStatus: 'declined', providerId: null, providerName: null, quote: null, price: null });
        showToast('Cotización rechazada. Se seguirá buscando profesional.', 'info');
        store.addNotification('El cliente rechazó tu cotización.', 'info');
        navigate('request-detail', { id: reqId });
    } catch (err) {
        showToast('Error al rechazar cotización: ' + err.message, 'error');
    }
};

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
    showConfirm('Cancelar solicitud', '¿Estás seguro de que quieres cancelar esta solicitud? Esta acción no se puede deshacer.', 'Sí, cancelar', async function () {
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
    showConfirm('Cerrar sesión', '¿Seguro que quieres cerrar sesión?', 'Cerrar sesión', async function () {
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
            setTimeout(async function () {
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
    } catch (e) { }
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', splashThenInit);
} else {
    splashThenInit();
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js').catch(function () { });
    });
}
