// ============================================
// STORE.JS - Estado Global + Persistencia (Supabase & Local)
// ============================================
import { CONFIG, getActiveSettings } from './config.js';

const STORAGE_KEY = 'kitu_app_state';

const defaultState = {
    isLoggedIn: false,
    user: null,
    currentView: 'login',
    role: 'client',
    selectedProfessions: [],
    requests: [],
    notifications: [],
    chatMessages: {},
    ratings: [],
    favorites: [],
    paymentMethods: [],
    addressBook: []
};

const STATUS_LABELS = {
    pending: { label: 'Buscando', color: '#f59e0b', icon: '⏳' },
    accepted: { label: 'En camino', color: '#3b82f6', icon: '🚗' },
    in_progress: { label: 'En progreso', color: '#8b5cf6', icon: '🔧' },
    completed: { label: 'Completado', color: '#10b981', icon: '✅' },
    cancelled: { label: 'Cancelado', color: '#ef4444', icon: '❌' }
};

class Store {
    constructor() {
        this._state = this._load();
        this._listeners = [];
        this.supabase = null;
        this.channel = null;
        
        if (CONFIG.DATABASE_MODE === 'supabase') {
            this.initSupabase();
        }
    }

    async initSupabase() {
        try {
            // Importar dinámicamente el SDK de Supabase desde un CDN compatible con ES Modules
            const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
            this.supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
            console.log('Supabase inicializado correctamente.');

            // Escuchar cambios de autenticación
            this.supabase.auth.onAuthStateChange(async (event, session) => {
                if (session) {
                    try {
                        const profile = await this.fetchProfile(session.user.id);
                        this.update({
                            isLoggedIn: true,
                            user: profile,
                            role: profile.role,
                            currentView: this.get('currentView') === 'login' ? 'home' : this.get('currentView')
                        });
                        await this.fetchInitialData();
                    } catch (e) {
                        console.error('Error fetching profile after auth change:', e);
                    }
                } else {
                    this.update({
                        isLoggedIn: false,
                        user: null,
                        role: 'client',
                        currentView: 'login',
                        requests: [],
                        chatMessages: {}
                    });
                    if (this.channel) {
                        this.supabase.removeChannel(this.channel);
                        this.channel = null;
                    }
                }
            });
        } catch (e) {
            console.error('Error al inicializar Supabase:', e);
            if (typeof window !== 'undefined' && window.alert) {
                window.alert('No se pudo conectar al servidor. Revisa tu conexión o las credenciales de Supabase.');
            }
        }
    }

    async fetchProfile(userId) {
        const { data: profile, error: profileError } = await this.supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (profileError) throw profileError;

        if (profile.role === 'provider') {
            const { data: details, error: detailsError } = await this.supabase
                .from('providers_details')
                .select('*')
                .eq('id', userId)
                .single();
            if (!detailsError && details) {
                return { ...profile, ...details };
            }
        }
        return profile;
    }

    async fetchInitialData() {
        if (CONFIG.DATABASE_MODE !== 'supabase' || !this._state.user) return;

        try {
            // Cargar solicitudes
            const { data: dbRequests, error: reqError } = await this.supabase
                .from('service_requests')
                .select('*, client:profiles!client_id(name), provider:profiles!provider_id(name)');
            
            if (!reqError && dbRequests) {
                const mappedRequests = dbRequests.map(r => ({
                    ...this._mapRequest(r),
                    clientName: r.client?.name,
                    providerName: r.provider?.name
                }));
                this.set('requests', mappedRequests);
            }

            // Configurar suscripciones en tiempo real
            this.setupRealtimeSubscriptions();
        } catch (e) {
            console.error('Error fetching initial data:', e);
        }
    }

    setupRealtimeSubscriptions() {
        if (!this.supabase || !this._state.user) return;

        if (this.channel) {
            this.supabase.removeChannel(this.channel);
        }

        const userId = this._state.user.id;
        const role = this._state.role;

        this.channel = this.supabase.channel('public:all_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'service_requests' }, async (payload) => {
                const newRow = payload.new;

                if (payload.eventType === 'INSERT') {
                    const isMyRequest = newRow.client_id === userId;
                    const matchesMyProfession = role === 'provider' && this._state.user.professions?.includes(newRow.service_id);
                    if (isMyRequest || matchesMyProfession) {
                        const { data: clientProfile } = await this.supabase.from('profiles').select('name').eq('id', newRow.client_id).single();
                        const mapped = {
                            ...this._mapRequest(newRow),
                            clientName: clientProfile?.name
                        };
                        const exists = this._state.requests.some(r => r.id === mapped.id);
                        if (!exists) {
                            this.set('requests', [...this._state.requests, mapped]);
                            this.addNotification(`Nueva solicitud: ${mapped.serviceTitle}`, 'info');
                        }
                    }
                } else if (payload.eventType === 'UPDATE') {
                    const isMyRequest = newRow.client_id === userId || newRow.provider_id === userId;
                    const isPendingAndMyProfession = newRow.status === 'pending' && role === 'provider' && this._state.user.professions?.includes(newRow.service_id);
                    if (isMyRequest || isPendingAndMyProfession) {
                        const { data: providerProfile } = newRow.provider_id ? await this.supabase.from('profiles').select('name').eq('id', newRow.provider_id).single() : { data: null };
                        const mapped = {
                            ...this._mapRequest(newRow),
                            providerName: providerProfile?.name
                        };
                        const updatedRequests = this._state.requests.map(r => r.id === mapped.id ? mapped : r);
                        this.set('requests', updatedRequests);
                        this.addNotification(`Solicitud de ${mapped.serviceTitle} actualizada: ${STATUS_LABELS[mapped.status]?.label || mapped.status}`, 'info');
                    }
                }
            })
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
                const newMsg = payload.new;
                const reqId = newMsg.request_id;
                
                const chat = { ...this._state.chatMessages };
                if (!chat[reqId]) chat[reqId] = [];
                const exists = chat[reqId].some(m => m.id === newMsg.id);
                if (!exists) {
                    chat[reqId].push({
                        id: newMsg.id,
                        sender: newMsg.sender_id,
                        message: newMsg.message,
                        timestamp: newMsg.created_at
                    });
                    this.set('chatMessages', chat);
                    if (newMsg.sender_id !== userId) {
                        this.addNotification('Nuevo mensaje recibido', 'info');
                    }
                }
            })
            .subscribe();
    }

    _mapRequest(dbReq) {
        // Preservar campos locales que Supabase aún no tiene (scheduledAt, quote, timeline)
        const local = (this._state.requests || []).find(r => r.id === dbReq.id) || {};
        const timeline = local.statusTimeline || {};
        return {
            id: dbReq.id,
            clientId: dbReq.client_id,
            clientName: dbReq.client_name || this._state.user?.name,
            serviceId: dbReq.service_id,
            serviceTitle: dbReq.service_title,
            description: dbReq.description,
            photoData: dbReq.photo_url,
            urgency: dbReq.urgency,
            address: dbReq.address,
            status: dbReq.status,
            providerId: dbReq.provider_id,
            providerName: dbReq.provider_name,
            rating: dbReq.rating,
            review: dbReq.review,
            price: dbReq.price,
            createdAt: dbReq.created_at,
            updatedAt: dbReq.updated_at,
            scheduledAt: dbReq.scheduled_at || local.scheduledAt || null,
            quote: dbReq.quote !== undefined && dbReq.quote !== null ? dbReq.quote : (local.quote || null),
            quoteStatus: dbReq.quote_status || local.quoteStatus || 'none',
            paymentMethodId: dbReq.payment_method_id || local.paymentMethodId || null,
            lat: local.lat || null,
            lng: local.lng || null,
            statusTimeline: {
                ...timeline,
                ...(dbReq.status && dbReq.created_at ? { created: dbReq.created_at } : {})
            }
        };
    }

    _load() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                return { ...defaultState, ...parsed };
            }
        } catch (e) {
            console.warn('Error loading state:', e);
        }
        return { ...defaultState };
    }

    _save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this._state));
        } catch (e) {
            console.warn('Error saving state:', e);
        }
    }

    get(key) {
        return this._state[key];
    }

    set(key, value) {
        this._state[key] = value;
        this._save();
        this._notify();
    }

    update(updates) {
        Object.assign(this._state, updates);
        this._save();
        this._notify();
    }

    getState() {
        return { ...this._state };
    }

    subscribe(fn) {
        this._listeners.push(fn);
    }

    _notify() {
        this._listeners.forEach(fn => fn(this._state));
    }

    // Auth Methods
    async register(userData) {
        if (CONFIG.DATABASE_MODE === 'supabase') {
            const { data, error } = await this.supabase.auth.signUp({
                email: userData.email,
                password: userData.password,
                options: {
                    data: {
                        name: userData.name,
                        phone: userData.phone,
                        role: userData.role,
                        address: userData.address,
                        country_code: CONFIG.ACTIVE_REGION
                    }
                }
            });
            if (error) throw error;

            if (userData.role === 'provider') {
                // Esperar a que el trigger handle_new_user complete la inserción
                await new Promise(resolve => setTimeout(resolve, 1000));
                const { error: detailError } = await this.supabase
                    .from('providers_details')
                    .update({
                        professions: userData.professions || [],
                        rate_per_hour: userData.ratePerHour || 0,
                        description: userData.description || ''
                    })
                    .eq('id', data.user.id);
                if (detailError) console.error('Error actualizando detalles del proveedor:', detailError);
            }

            const profile = await this.fetchProfile(data.user.id);
            this.update({
                isLoggedIn: true,
                user: profile,
                role: profile.role,
                currentView: 'home'
            });
            this.addNotification('¡Bienvenido a Kitu! Tu cuenta ha sido creada.', 'success');
            return profile;
        } else {
            const user = {
                id: 'user_' + Date.now(),
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                password: userData.password,
                avatar: null,
                role: userData.role || 'client',
                address: userData.address || '',
                professions: userData.professions || [],
                ratePerHour: userData.ratePerHour || 0,
                description: userData.description || '',
                certifications: [],
                rating: 5.0,
                totalJobs: 0,
                earnings: 0,
                createdAt: new Date().toISOString()
            };

            const users = this._getUsers();
            users.push(user);
            localStorage.setItem('kitu_users', JSON.stringify(users));

            this.update({
                isLoggedIn: true,
                user: user,
                role: user.role,
                currentView: 'home'
            });

            this.addNotification('¡Bienvenido a Kitu! Tu cuenta ha sido creada.', 'success');
            return user;
        }
    }

    async login(email, password) {
        if (CONFIG.DATABASE_MODE === 'supabase') {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password
            });
            if (error) throw error;
            const profile = await this.fetchProfile(data.user.id);
            this.update({
                isLoggedIn: true,
                user: profile,
                role: profile.role,
                currentView: 'home'
            });
            this.addNotification('Has iniciado sesión correctamente.', 'info');
            return profile;
        } else {
            const users = this._getUsers();
            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                this.update({
                    isLoggedIn: true,
                    user: user,
                    role: user.role,
                    currentView: 'home'
                });
                this.addNotification('Has iniciado sesión correctamente.', 'info');
                return user;
            }
            return null;
        }
    }

    async logout() {
        if (CONFIG.DATABASE_MODE === 'supabase') {
            await this.supabase.auth.signOut();
        } else {
            this.update({
                isLoggedIn: false,
                user: null,
                currentView: 'login',
                role: 'client'
            });
        }
    }

    async updateProfile(updates) {
        if (CONFIG.DATABASE_MODE === 'supabase') {
            const userId = this._state.user.id;
            const profileFields = ['name', 'phone', 'address', 'avatar_url'];
            const profileUpdates = {};
            const detailUpdates = {};

            Object.keys(updates).forEach(key => {
                if (profileFields.includes(key)) {
                    profileUpdates[key] = updates[key];
                } else {
                    const detailMapping = {
                        professions: 'professions',
                        ratePerHour: 'rate_per_hour',
                        description: 'description',
                        isAvailable: 'is_available',
                        latitude: 'latitude',
                        longitude: 'longitude'
                    };
                    if (detailMapping[key]) {
                        detailUpdates[detailMapping[key]] = updates[key];
                    }
                }
            });

            if (Object.keys(profileUpdates).length > 0) {
                const { error } = await this.supabase
                    .from('profiles')
                    .update(profileUpdates)
                    .eq('id', userId);
                if (error) throw error;
            }

            if (Object.keys(detailUpdates).length > 0 && this._state.role === 'provider') {
                const { error } = await this.supabase
                    .from('providers_details')
                    .update(detailUpdates)
                    .eq('id', userId);
                if (error) throw error;
            }

            const updatedUser = await this.fetchProfile(userId);
            this.set('user', updatedUser);
            this.addNotification('Perfil actualizado correctamente.', 'success');
        } else {
            const user = { ...this._state.user, ...updates };
            this.set('user', user);

            const users = this._getUsers();
            const idx = users.findIndex(u => u.id === user.id);
            if (idx !== -1) {
                users[idx] = user;
                localStorage.setItem('kitu_users', JSON.stringify(users));
            }
        }
    }

    _getUsers() {
        try {
            return JSON.parse(localStorage.getItem('kitu_users') || '[]');
        } catch {
            return [];
        }
    }

    // Request Methods
    async createRequest(requestData) {
        if (CONFIG.DATABASE_MODE === 'supabase') {
            const request = {
                client_id: this._state.user.id,
                service_id: requestData.serviceId,
                service_title: requestData.serviceTitle,
                description: requestData.description,
                photo_url: requestData.photoData || null,
                urgency: requestData.urgency || 'normal',
                address: requestData.address,
                status: 'pending'
            };
            const { data, error } = await this.supabase
                .from('service_requests')
                .insert(request)
                .select('*')
                .single();
            if (error) throw error;

            const mapped = {
                ...this._mapRequest(data),
                scheduledAt: requestData.scheduledAt || null,
                paymentMethodId: requestData.paymentMethodId || null,
                quote: requestData.quote || null,
                quoteStatus: requestData.quoteStatus || 'none',
                lat: requestData.lat || null,
                lng: requestData.lng || null,
                statusTimeline: { created: data.created_at }
            };
            this.set('requests', [...this._state.requests, mapped]);
            this.addNotification(`Solicitud de ${mapped.serviceTitle} creada. Buscando profesionales...`, 'info');
            return mapped;
        } else {
            const request = {
                id: 'req_' + Date.now(),
                clientId: this._state.user.id,
                clientName: this._state.user.name,
                serviceId: requestData.serviceId,
                serviceTitle: requestData.serviceTitle,
                description: requestData.description,
                photoData: requestData.photoData || null,
                urgency: requestData.urgency || 'normal',
                address: requestData.address,
                status: 'pending',
                providerId: null,
                providerName: null,
                rating: null,
                review: null,
                price: null,
                scheduledAt: requestData.scheduledAt || null,
                paymentMethodId: requestData.paymentMethodId || null,
                quote: requestData.quote || null,
                quoteStatus: requestData.quoteStatus || 'none',
                lat: requestData.lat || null,
                lng: requestData.lng || null,
                statusTimeline: { created: new Date().toISOString() },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            const requests = [...this._state.requests, request];
            this.set('requests', requests);
            this.addNotification(`Solicitud de ${request.serviceTitle} creada. Buscando profesionales...`, 'info');
            return request;
        }
    }

    async updateRequest(requestId, updates) {
        // Registrar línea de tiempo cuando cambia el estado
        if (updates.status) {
            const timeline = (this._state.requests.find(r => r.id === requestId) || {}).statusTimeline || {};
            if (!timeline[updates.status]) {
                updates.statusTimeline = {
                    ...timeline,
                    [updates.status]: new Date().toISOString()
                };
            }
        }

        if (CONFIG.DATABASE_MODE === 'supabase') {
            const dbUpdates = {};
            const fieldMapping = {
                status: 'status',
                providerId: 'provider_id',
                price: 'price',
                rating: 'rating',
                review: 'review'
            };
            Object.keys(updates).forEach(key => {
                if (fieldMapping[key]) {
                    dbUpdates[fieldMapping[key]] = updates[key];
                }
            });
            if (dbUpdates.status || dbUpdates.provider_id || dbUpdates.price !== undefined) {
                const { error } = await this.supabase
                    .from('service_requests')
                    .update(dbUpdates)
                    .eq('id', requestId);
                if (error) throw error;
            }
            // Aplicar campos locales (cita, cotización, timeline) sin enviarlos a Supabase
            const requests = this._state.requests.map(r =>
                r.id === requestId ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
            );
            this.set('requests', requests);
        } else {
            const requests = this._state.requests.map(r =>
                r.id === requestId ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
            );
            this.set('requests', requests);
        }
    }

    getRequest(requestId) {
        return this._state.requests.find(r => r.id === requestId);
    }

    getActiveRequests() {
        return this._state.requests.filter(r =>
            r.clientId === this._state.user?.id &&
            ['pending', 'accepted', 'in_progress'].includes(r.status)
        );
    }

    getCompletedRequests() {
        return this._state.requests.filter(r =>
            (r.clientId === this._state.user?.id || r.providerId === this._state.user?.id) &&
            r.status === 'completed'
        );
    }

    getProviderRequests() {
        if (!this._state.user) return [];
        return this._state.requests.filter(r =>
            r.providerId === this._state.user.id ||
            (r.status === 'pending' && this._state.user.professions?.some(p => {
                const serviceMap = {
                    plumbing: 'plumbing', electrician: 'electrician',
                    construction: 'construction', cleaning: 'cleaning',
                    tech: 'tech', repair: 'repair', painting: 'painting', gardening: 'gardening'
                };
                return serviceMap[p] === r.serviceId;
            }))
        );
    }

    // Notifications
    addNotification(message, type = 'info') {
        const notif = {
            id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            message,
            type,
            read: false,
            timestamp: new Date().toISOString()
        };
        const notifications = [notif, ...this._state.notifications].slice(0, 50);
        this.set('notifications', notifications);
    }

    markNotificationRead(notifId) {
        const notifications = this._state.notifications.map(n =>
            n.id === notifId ? { ...n, read: true } : n
        );
        this.set('notifications', notifications);
    }

    markAllNotificationsRead() {
        const notifications = this._state.notifications.map(n => ({ ...n, read: true }));
        this.set('notifications', notifications);
    }

    getUnreadCount() {
        return this._state.notifications.filter(n => !n.read).length;
    }

    // Chat
    async loadChatMessages(requestId) {
        if (CONFIG.DATABASE_MODE === 'supabase') {
            const { data, error } = await this.supabase
                .from('chat_messages')
                .select('*')
                .eq('request_id', requestId)
                .order('created_at', { ascending: true });
            if (!error && data) {
                const chat = { ...this._state.chatMessages };
                chat[requestId] = data.map(m => ({
                    id: m.id,
                    sender: m.sender_id,
                    message: m.message,
                    timestamp: m.created_at
                }));
                this.set('chatMessages', chat);
            }
        }
    }

    async addChatMessage(requestId, sender, message) {
        if (CONFIG.DATABASE_MODE === 'supabase') {
            const { error } = await this.supabase
                .from('chat_messages')
                .insert({
                    request_id: requestId,
                    sender_id: sender,
                    message: message
                });
            if (error) throw error;
        } else {
            const chat = { ...this._state.chatMessages };
            if (!chat[requestId]) chat[requestId] = [];
            chat[requestId].push({
                id: 'msg_' + Date.now(),
                sender,
                message,
                timestamp: new Date().toISOString()
            });
            this.set('chatMessages', chat);
        }
    }

    getChatMessages(requestId) {
        return this._state.chatMessages[requestId] || [];
    }

    // Ratings
    async addRating(requestId, providerId, stars, comment) {
        if (CONFIG.DATABASE_MODE === 'supabase') {
            const rating = {
                request_id: requestId,
                provider_id: providerId,
                user_id: this._state.user.id,
                stars,
                comment
            };
            // Supabase schema has service_requests directly handling rating and review,
            // but if there's no separate table for ratings, we can write rating to service_requests
            const { error } = await this.supabase
                .from('service_requests')
                .update({
                    rating: stars,
                    review: comment
                })
                .eq('id', requestId);
            if (error) throw error;
        } else {
            const rating = {
                id: 'rat_' + Date.now(),
                requestId,
                providerId,
                userId: this._state.user.id,
                stars,
                comment,
                createdAt: new Date().toISOString()
            };
            const ratings = [...this._state.ratings, rating];
            this.set('ratings', ratings);
            this.updateRequest(requestId, { rating: stars, review: comment });
        }
    }

    getProviderRatings(providerId) {
        return this._state.ratings.filter(r => r.providerId === providerId);
    }

    // Favorites
    isFavorite(providerId) {
        return (this._state.favorites || []).includes(providerId);
    }

    toggleFavorite(providerId) {
        const favorites = (this._state.favorites || []).slice();
        const idx = favorites.indexOf(providerId);
        if (idx > -1) favorites.splice(idx, 1); else favorites.push(providerId);
        this.set('favorites', favorites);
        return favorites.includes(providerId);
    }

    getFavorites() {
        return (this._state.favorites || []).slice();
    }

    // Payment Methods
    getPaymentMethods() {
        return (this._state.paymentMethods || []).slice();
    }

    addPaymentMethod(method) {
        const list = this._state.paymentMethods || [];
        const newMethod = {
            id: 'pm_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            ...method,
            createdAt: new Date().toISOString()
        };
        const paymentMethods = [...list, newMethod];
        this.set('paymentMethods', paymentMethods);
        this.addNotification('Método de pago agregado.', 'success');
        return newMethod;
    }

    removePaymentMethod(id) {
        this.set('paymentMethods', (this._state.paymentMethods || []).filter(m => m.id !== id));
    }

    getPaymentMethod(id) {
        return (this._state.paymentMethods || []).find(m => m.id === id);
    }

    // Address Book
    getAddressBook() {
        return (this._state.addressBook || []).slice();
    }

    addAddress(address) {
        const list = this._state.addressBook || [];
        const newAddress = {
            id: 'addr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            ...address,
            createdAt: new Date().toISOString()
        };
        const addressBook = [...list, newAddress];
        this.set('addressBook', addressBook);
        this.addNotification('Dirección guardada.', 'success');
        return newAddress;
    }

    updateAddress(id, updates) {
        this.set('addressBook', (this._state.addressBook || []).map(a =>
            a.id === id ? { ...a, ...updates } : a
        ));
    }

    removeAddress(id) {
        this.set('addressBook', (this._state.addressBook || []).filter(a => a.id !== id));
    }

    getAddress(id) {
        return (this._state.addressBook || []).find(a => a.id === id);
    }

    // Wallet / Earnings
    getWalletStats() {
        const userId = this._state.user?.id;
        const isProvider = this._state.role === 'provider';
        const myRequests = this._state.requests.filter(r =>
            isProvider ? r.providerId === userId : r.clientId === userId
        );

        const completed = myRequests.filter(r => r.status === 'completed');
        const active = myRequests.filter(r => ['pending', 'accepted', 'in_progress'].includes(r.status));

        const totalEarned = isProvider
            ? completed.reduce((sum, r) => sum + (Number(r.price) || 0), 0)
            : completed.reduce((sum, r) => sum + (Number(r.price) || 0), 0);

        const pendingBalance = active.reduce((sum, r) => sum + (Number(r.price) || 0), 0);

        return {
            totalJobs: completed.length,
            activeJobs: active.length,
            totalEarned,
            pendingBalance,
            avgRating: this._state.user?.rating || 5.0,
            transactions: completed.slice().reverse()
        };
    }
}

export const store = new Store();
store.CONFIG = CONFIG;
store.getActiveSettings = getActiveSettings;
if (typeof window !== 'undefined') {
    window.store = store;
}
