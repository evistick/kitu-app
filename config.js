// ============================================
// CONFIG.JS - Configuración Regional y Supabase
// ============================================

export const CONFIG = {
    // Configuración Regional
    // Países soportados: 'MX' (México), 'US' (Estados Unidos), 'CO' (Colombia), 'AR' (Argentina), 'CL' (Chile)
    ACTIVE_REGION: 'MX',

    SUPABASE_URL: 'https://zqvhlnzaiguskcutcsza.supabase.co',
    SUPABASE_ANON_KEY: 'sb_publishable_HhLUzbxf85SIgSARcrneog_Cb2e93Hr',

    // Modos de Almacenamiento: 'local' (LocalStorage) o 'supabase' (Supabase)
    DATABASE_MODE: 'supabase',
};

// Configuración por Región
export const REGION_SETTINGS = {
    MX: {
        countryName: 'México',
        currency: 'MXN',
        currencySymbol: '$',
        phonePrefix: '+52',
        phoneLength: 10,
        locale: 'es-MX',
        defaultCoordinates: { lat: 19.4326, lng: -99.1332 }, // CDMX
        translations: {
            app_title: 'Kitu - Servicios del Hogar',
            welcome: '¡Bienvenido a Kitu!',
            login: 'Iniciar Sesión',
            register: 'Registrarse',
            phone_placeholder: 'Número celular (10 dígitos)',
            currency_format: (amount) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount),
        }
    },
    US: {
        countryName: 'United States',
        currency: 'USD',
        currencySymbol: '$',
        phonePrefix: '+1',
        phoneLength: 10,
        locale: 'en-US',
        defaultCoordinates: { lat: 37.7749, lng: -122.4194 }, // San Francisco
        translations: {
            app_title: 'Kitu - Home Services',
            welcome: 'Welcome to Kitu!',
            login: 'Sign In',
            register: 'Sign Up',
            phone_placeholder: 'Mobile number (10 digits)',
            currency_format: (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount),
        }
    },
    CO: {
        countryName: 'Colombia',
        currency: 'COP',
        currencySymbol: '$',
        phonePrefix: '+57',
        phoneLength: 10,
        locale: 'es-CO',
        defaultCoordinates: { lat: 4.7110, lng: -74.0721 }, // Bogotá
        translations: {
            app_title: 'Kitu - Servicios del Hogar',
            welcome: '¡Bienvenido a Kitu!',
            login: 'Iniciar Sesión',
            register: 'Registrarse',
            phone_placeholder: 'Número celular (10 dígitos)',
            currency_format: (amount) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount),
        }
    },
    AR: {
        countryName: 'Argentina',
        currency: 'ARS',
        currencySymbol: '$',
        phonePrefix: '+54',
        phoneLength: 10,
        locale: 'es-AR',
        defaultCoordinates: { lat: -34.6037, lng: -58.3816 }, // Buenos Aires
        translations: {
            app_title: 'Kitu - Servicios del Hogar',
            welcome: '¡Bienvenido a Kitu!',
            login: 'Iniciar Sesión',
            register: 'Registrarse',
            phone_placeholder: 'Número celular (10 dígitos)',
            currency_format: (amount) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount),
        }
    },
    CL: {
        countryName: 'Chile',
        currency: 'CLP',
        currencySymbol: '$',
        phonePrefix: '+56',
        phoneLength: 9,
        locale: 'es-CL',
        defaultCoordinates: { lat: -33.4489, lng: -70.6693 }, // Santiago
        translations: {
            app_title: 'Kitu - Servicios del Hogar',
            welcome: '¡Bienvenido a Kitu!',
            login: 'Iniciar Sesión',
            register: 'Registrarse',
            phone_placeholder: 'Número celular (9 dígitos)',
            currency_format: (amount) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(amount),
        }
    }
};

// Helper para obtener los settings activos
export function getActiveSettings() {
    return REGION_SETTINGS[CONFIG.ACTIVE_REGION] || REGION_SETTINGS.MX;
}

// Helper para traducir dinámicamente un tag
export function translate(key) {
    const settings = getActiveSettings();
    return settings.translations[key] || key;
}
