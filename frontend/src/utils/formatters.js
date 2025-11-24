/**
 * Formatea un número como moneda (COP)
 * @param {number} value - Valor a formatear
 * @returns {string} Valor formateado
 */
export const formatCurrency = (value) => {
    if (!value && value !== 0) return '$0';

    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
};

/**
 * Formatea un número con separadores de miles
 * @param {number} value - Número a formatear
 * @returns {string} Número formateado
 */
export const formatNumber = (value) => {
    if (!value && value !== 0) return '0';

    return new Intl.NumberFormat('es-CO').format(value);
};

/**
 * Formatea un porcentaje
 * @param {number} value - Valor (0-100 o 0-1)
 * @param {boolean} isDecimal - Si el valor está en decimal (0-1)
 * @returns {string} Porcentaje formateado
 */
export const formatPercentage = (value, isDecimal = false) => {
    if (!value && value !== 0) return '0%';

    const percentage = isDecimal ? value * 100 : value;
    return `${percentage.toFixed(1)}%`;
};

/**
 * Formatea un teléfono
 * @param {string} phone - Teléfono a formatear
 * @returns {string} Teléfono formateado (XXX XXX XXXX)
 */
export const formatPhone = (phone) => {
    if (!phone) return '';

    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (match) {
        return `${match[1]} ${match[2]} ${match[3]}`;
    }

    return phone;
};

/**
 * Formatea una cédula
 * @param {string} cedula - Cédula a formatear
 * @returns {string} Cédula formateada (XXX.XXX.XXX)
 */
export const formatCedula = (cedula) => {
    if (!cedula) return '';

    const cleaned = cedula.replace(/\D/g, '');
    return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/**
 * Capitaliza la primera letra de cada palabra
 * @param {string} text - Texto a capitalizar
 * @returns {string} Texto capitalizado
 */
export const capitalize = (text) => {
    if (!text) return '';

    return text
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

/**
 * Convierte texto a minúsculas
 * @param {string} text - Texto
 * @returns {string} Texto en minúsculas
 */
export const lowercase = (text) => {
    if (!text) return '';
    return text.toLowerCase();
};

/**
 * Convierte texto a mayúsculas
 * @param {string} text - Texto
 * @returns {string} Texto en mayúsculas
 */
export const uppercase = (text) => {
    if (!text) return '';
    return text.toUpperCase();
};

/**
 * Trunca un texto a una longitud específica
 * @param {string} text - Texto a truncar
 * @param {number} length - Longitud máxima
 * @param {string} suffix - Sufijo (default: '...')
 * @returns {string} Texto truncado
 */
export const truncate = (text, length = 50, suffix = '...') => {
    if (!text) return '';
    if (text.length <= length) return text;

    return text.substring(0, length).trim() + suffix;
};

/**
 * Formatea un tamaño de archivo
 * @param {number} bytes - Bytes
 * @returns {string} Tamaño formateado (KB, MB, etc)
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Formatea una duración en segundos a HH:MM:SS
 * @param {number} seconds - Segundos
 * @returns {string} Duración formateada
 */
export const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return '00:00:00';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [hours, minutes, secs]
        .map(v => v < 10 ? `0${v}` : v)
        .join(':');
};

/**
 * Limpia espacios extra de un texto
 * @param {string} text - Texto
 * @returns {string} Texto limpio
 */
export const cleanSpaces = (text) => {
    if (!text) return '';
    return text.trim().replace(/\s+/g, ' ');
};

/**
 * Elimina acentos de un texto
 * @param {string} text - Texto
 * @returns {string} Texto sin acentos
 */
export const removeAccents = (text) => {
    if (!text) return '';
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

/**
 * Genera un slug a partir de un texto
 * @param {string} text - Texto
 * @returns {string} Slug
 */
export const slugify = (text) => {
    if (!text) return '';

    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};

/**
 * Formatea una lista de elementos
 * @param {Array} items - Lista de items
 * @param {string} separator - Separador (default: ', ')
 * @param {string} lastSeparator - Último separador (default: ' y ')
 * @returns {string} Lista formateada
 */
export const formatList = (items, separator = ', ', lastSeparator = ' y ') => {
    if (!items || items.length === 0) return '';
    if (items.length === 1) return items[0];

    const allButLast = items.slice(0, -1);
    const last = items[items.length - 1];

    return allButLast.join(separator) + lastSeparator + last;
};

/**
 * Extrae iniciales de un nombre
 * @param {string} name - Nombre completo
 * @returns {string} Iniciales
 */
export const getInitials = (name) => {
    if (!name) return '';

    return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
};

/**
 * Enmascara un email
 * @param {string} email - Email
 * @returns {string} Email enmascarado (ej: j***@example.com)
 */
export const maskEmail = (email) => {
    if (!email) return '';

    const [name, domain] = email.split('@');
    if (!domain) return email;

    const maskedName = name.charAt(0) + '***' + name.charAt(name.length - 1);
    return `${maskedName}@${domain}`;
};

/**
 * Enmascara un teléfono
 * @param {string} phone - Teléfono
 * @returns {string} Teléfono enmascarado (ej: ***-***-1234)
 */
export const maskPhone = (phone) => {
    if (!phone) return '';

    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 4) return phone;

    const last4 = cleaned.slice(-4);
    return '***-***-' + last4;
};

/**
 * Pluraliza una palabra según cantidad
 * @param {number} count - Cantidad
 * @param {string} singular - Palabra singular
 * @param {string} plural - Palabra plural (opcional)
 * @returns {string} Palabra pluralizada
 */
export const pluralize = (count, singular, plural = null) => {
    if (count === 1) return singular;
    return plural || singular + 's';
};
