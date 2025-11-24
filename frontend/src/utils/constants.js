// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';
/**
 * ROLES DE USUARIO
 */
export const ROLES = {
    ADMIN: 'ADMIN',
    GUIA: 'GUIA',
    VISITANTE: 'VISITANTE'
};

/**
 * ESTADOS DE RESERVA
 */
export const ESTADOS_RESERVA = {
    PENDIENTE: 'PENDIENTE',
    CONFIRMADA: 'CONFIRMADA',
    CANCELADA: 'CANCELADA',
    COMPLETADA: 'COMPLETADA',
    NO_ASISTIO: 'NO_ASISTIO'
};

/**
 * LABELS Y COLORES PARA ESTADOS DE RESERVA
 */
export const ESTADO_RESERVA_LABELS = {
    PENDIENTE: { text: 'Pendiente', color: 'warning' },
    CONFIRMADA: { text: 'Confirmada', color: 'info' },
    CANCELADA: { text: 'Cancelada', color: 'danger' },
    COMPLETADA: { text: 'Completada', color: 'success' },
    NO_ASISTIO: { text: 'No Asistió', color: 'gray' }
};

/**
 * ESTADOS GENERALES
 */
export const ESTADOS_GENERAL = {
    ACTIVO: 'ACTIVO',
    INACTIVO: 'INACTIVO',
    BLOQUEADO: 'BLOQUEADO',
    ELIMINADO: 'ELIMINADO'
};

/**
 * DIFICULTADES DE SENDEROS
 */
export const DIFICULTADES = {
    FACIL: 'FACIL',
    MODERADO: 'MODERADO',
    DIFICIL: 'DIFICIL',
    EXTREMO: 'EXTREMO'
};

/**
 * LABELS Y COLORES PARA DIFICULTADES
 */
export const DIFICULTAD_LABELS = {
    FACIL: { text: 'Fácil', color: 'green' },
    MODERADO: { text: 'Moderado', color: 'blue' },
    DIFICIL: { text: 'Difícil', color: 'orange' },
    EXTREMO: { text: 'Extremo', color: 'red' }
};

/**
 * REGLAS DE NEGOCIO
 */
export const REGLAS_NEGOCIO = {
    MIN_PERSONAS_RESERVA: 1,
    MAX_PERSONAS_RESERVA: 20,
    MAX_RESERVAS_ACTIVAS: 3,
    HORAS_ANTICIPACION_MIN: 24,
    DIAS_CANCELACION_GRATIS: 2
};

/**
 * CONFIGURACIÓN DE PAGINACIÓN
 */
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100]
};

/**
 * MENSAJES DE ERROR COMUNES
 */
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
    UNAUTHORIZED: 'No tienes permisos para realizar esta acción.',
    NOT_FOUND: 'Recurso no encontrado.',
    SERVER_ERROR: 'Error del servidor. Intenta más tarde.',
    VALIDATION_ERROR: 'Por favor verifica los datos ingresados.',
    SESSION_EXPIRED: 'Tu sesión ha expirado. Inicia sesión nuevamente.'
};

/**
 * MENSAJES DE ÉXITO COMUNES
 */
export const SUCCESS_MESSAGES = {
    CREATED: 'Creado exitosamente',
    UPDATED: 'Actualizado exitosamente',
    DELETED: 'Eliminado exitosamente',
    SAVED: 'Guardado exitosamente'
};

/**
 * RUTAS DE LA API
 */
export const API_ROUTES = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        VERIFY: '/auth/verify'
    },
    SENDEROS: '/senderos',
    RESERVAS: '/reservas',
    GUIAS: '/guias',
    VISITANTES: '/visitantes',
    ASIGNACIONES: '/asignaciones',
    HORARIOS: '/horarios',
    ESTADISTICAS: '/estadisticas'
};

/**
 * FORMATOS DE FECHA
 */
export const DATE_FORMATS = {
    DEFAULT: 'dd/MM/yyyy',
    DATETIME: 'dd/MM/yyyy HH:mm',
    TIME: 'HH:mm',
    DATE_LONG: "d 'de' MMMM 'de' yyyy",
    DATE_SHORT: 'dd/MM/yy'
};

/**
 * CONFIGURACIÓN DE VALIDACIÓN
 */
export const VALIDATION = {
    PASSWORD_MIN_LENGTH: 8,
    CEDULA_LENGTH: { min: 6, max: 10 },
    TELEFONO_LENGTH: 10,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_REGEX: /^\d{10}$/,
    CEDULA_REGEX: /^\d{6,10}$/
};

/**
 * LÍMITES DE ARCHIVOS
 */
export const FILE_LIMITS = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png']
};

/**
 * COLORES DEL TEMA
 */
export const THEME_COLORS = {
    PRIMARY: '#0ea5e9',
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    DANGER: '#ef4444',
    INFO: '#3b82f6',
    GRAY: '#6b7280'
};
