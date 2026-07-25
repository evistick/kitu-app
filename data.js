// ============================================
// DATA.JS - Mock Data & Service Definitions
// ============================================

export const SERVICES = [
    { id: 'plumbing', title: 'Fontanería', icon: '🚰', desc: 'Fugas, tuberías y drenaje.', color: '#3b82f6' },
    { id: 'electrician', title: 'Electricidad', icon: '⚡', desc: 'Cortocircuitos y cableado.', color: '#f59e0b' },
    { id: 'construction', title: 'Construcción', icon: '🏗️', desc: 'Albañilería y remodelación.', color: '#ef4444' },
    { id: 'cleaning', title: 'Limpieza', icon: '🧹', desc: 'Hogar y oficinas.', color: '#10b981' },
    { id: 'tech', title: 'Programación', icon: '💻', desc: 'Web, apps y soporte.', color: '#8b5cf6' },
    { id: 'repair', title: 'Reparaciones', icon: '🛠️', desc: 'Línea blanca y muebles.', color: '#ec4899' },
    { id: 'painting', title: 'Pintura', icon: '🎨', desc: 'Interior y exterior.', color: '#06b6d4' },
    { id: 'gardening', title: 'Jardinería', icon: '🌿', desc: 'Poda, riego y diseño.', color: '#22c55e' }
];

export const MOCK_PROFESSIONALS = [
    {
        id: 'pro_001', name: 'Carlos Mendoza', avatar: '👷',
        professions: ['plumbing', 'repair'],
        rating: 4.8, totalJobs: 127, ratePerHour: 250,
        description: 'Fontanero certificado con 10 años de experiencia en instalaciones residenciales.',
        lat: 19.4326, lng: -99.1332, distance: 1.2
    },
    {
        id: 'pro_002', name: 'Ana García', avatar: '👩‍🔧',
        professions: ['electrician'],
        rating: 4.9, totalJobs: 89, ratePerHour: 300,
        description: 'Ingeniera eléctrica especializada en instalaciones domésticas y comerciales.',
        lat: 19.4280, lng: -99.1400, distance: 2.1
    },
    {
        id: 'pro_003', name: 'Roberto Jiménez', avatar: '👨‍🏭',
        professions: ['construction', 'painting'],
        rating: 4.6, totalJobs: 203, ratePerHour: 350,
        description: 'Maestro de obra con experiencia en remodelaciones completas y acabados finos.',
        lat: 19.4350, lng: -99.1250, distance: 0.8
    },
    {
        id: 'pro_004', name: 'María López', avatar: '👩‍💻',
        professions: ['tech'],
        rating: 5.0, totalJobs: 45, ratePerHour: 500,
        description: 'Desarrolladora full-stack. Creo sitios web, apps móviles y automatizaciones.',
        lat: 19.4400, lng: -99.1500, distance: 3.4
    },
    {
        id: 'pro_005', name: 'José Hernández', avatar: '🧔',
        professions: ['cleaning', 'gardening'],
        rating: 4.7, totalJobs: 310, ratePerHour: 180,
        description: 'Servicio integral de limpieza y mantenimiento de jardines residenciales.',
        lat: 19.4290, lng: -99.1280, distance: 1.5
    },
    {
        id: 'pro_006', name: 'Luis Ramírez', avatar: '👨‍🔧',
        professions: ['repair', 'plumbing', 'electrician'],
        rating: 4.5, totalJobs: 178, ratePerHour: 220,
        description: 'Técnico multifacético. Reparo electrodomésticos, plomería y electricidad básica.',
        lat: 19.4310, lng: -99.1380, distance: 1.8
    },
    {
        id: 'pro_007', name: 'Fernanda Torres', avatar: '👩‍🎨',
        professions: ['painting', 'construction'],
        rating: 4.9, totalJobs: 67, ratePerHour: 280,
        description: 'Especialista en pintura decorativa, murales y acabados texturizados.',
        lat: 19.4370, lng: -99.1420, distance: 2.5
    },
    {
        id: 'pro_008', name: 'Miguel Ángel Ruiz', avatar: '🧑‍🏫',
        professions: ['tech', 'electrician'],
        rating: 4.8, totalJobs: 92, ratePerHour: 450,
        description: 'Ingeniero en sistemas. Redes, cámaras de seguridad e instalaciones inteligentes.',
        lat: 19.4260, lng: -99.1350, distance: 2.0
    }
];

export const URGENCY_OPTIONS = [
    { id: 'low', label: 'Puede esperar', icon: '🟢', desc: 'En los próximos días' },
    { id: 'normal', label: 'Normal', icon: '🟡', desc: 'Hoy o mañana' },
    { id: 'urgent', label: 'Urgente', icon: '🔴', desc: 'Lo antes posible' }
];

export const STATUS_LABELS = {
    pending: { label: 'Buscando profesional', color: '#f59e0b', icon: '⏳' },
    accepted: { label: 'Profesional en camino', color: '#3b82f6', icon: '🚗' },
    in_progress: { label: 'En progreso', color: '#8b5cf6', icon: '🔧' },
    completed: { label: 'Completado', color: '#10b981', icon: '✅' },
    cancelled: { label: 'Cancelado', color: '#ef4444', icon: '❌' }
};

// Chat auto-responses for simulation
export const CHAT_RESPONSES = [
    'Perfecto, voy en camino. Llegaré en unos 15 minutos.',
    '¿Me puedes compartir una foto del problema?',
    'Entendido, llevo todas las herramientas necesarias.',
    'Ya estoy cerca de tu ubicación.',
    'Voy a necesitar unos materiales adicionales, ¿hay alguna ferretería cerca?',
    'El trabajo tomará aproximadamente 2 horas.',
    'Listo, ya terminé. ¿Podrías revisar que todo quede bien?'
];
