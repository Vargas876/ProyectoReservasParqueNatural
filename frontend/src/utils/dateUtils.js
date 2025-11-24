import { addDays, differenceInDays, format, isAfter, isBefore, isValid, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatea una fecha a string
 * @param {Date|string} date - Fecha a formatear
 * @param {string} formatStr - Formato deseado (default: 'dd/MM/yyyy')
 * @returns {string} Fecha formateada
 */
export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
    if (!date) return '';

    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        if (!isValid(dateObj)) return '';
        return format(dateObj, formatStr, { locale: es });
    } catch (error) {
        console.error('Error al formatear fecha:', error);
        return '';
    }
};

/**
 * Formatea una fecha a formato largo
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} Ej: "15 de marzo de 2024"
 */
export const formatDateLong = (date) => {
    return formatDate(date, "d 'de' MMMM 'de' yyyy");
};

/**
 * Formatea una fecha con hora
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} Ej: "15/03/2024 14:30"
 */
export const formatDateTime = (date) => {
    return formatDate(date, 'dd/MM/yyyy HH:mm');
};

/**
 * Formatea solo la hora
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} Ej: "14:30"
 */
export const formatTime = (date) => {
    return formatDate(date, 'HH:mm');
};

/**
 * Obtiene la fecha actual en formato ISO
 * @returns {string} Fecha actual ISO
 */
export const getCurrentDate = () => {
    return format(new Date(), 'yyyy-MM-dd');
};

/**
 * Obtiene la hora actual en formato HH:mm
 * @returns {string} Hora actual
 */
export const getCurrentTime = () => {
    return format(new Date(), 'HH:mm');
};

/**
 * Calcula días entre dos fechas
 * @param {Date|string} startDate - Fecha inicial
 * @param {Date|string} endDate - Fecha final
 * @returns {number} Número de días
 */
export const getDaysDifference = (startDate, endDate) => {
    try {
        const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
        const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
        return differenceInDays(end, start);
    } catch (error) {
        console.error('Error al calcular diferencia de días:', error);
        return 0;
    }
};

/**
 * Agrega días a una fecha
 * @param {Date|string} date - Fecha base
 * @param {number} days - Días a agregar
 * @returns {Date} Nueva fecha
 */
export const addDaysToDate = (date, days) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return addDays(dateObj, days);
};

/**
 * Verifica si una fecha es pasada
 * @param {Date|string} date - Fecha a verificar
 * @returns {boolean} true si es pasada
 */
export const isPastDate = (date) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isBefore(dateObj, new Date());
};

/**
 * Verifica si una fecha es futura
 * @param {Date|string} date - Fecha a verificar
 * @returns {boolean} true si es futura
 */
export const isFutureDate = (date) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isAfter(dateObj, new Date());
};

/**
 * Verifica si una fecha es hoy
 * @param {Date|string} date - Fecha a verificar
 * @returns {boolean} true si es hoy
 */
export const isToday = (date) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const today = new Date();
    return format(dateObj, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
};

/**
 * Obtiene el nombre del día de la semana
 * @param {Date|string} date - Fecha
 * @returns {string} Nombre del día
 */
export const getDayName = (date) => {
    return formatDate(date, 'EEEE');
};

/**
 * Obtiene el nombre del mes
 * @param {Date|string} date - Fecha
 * @returns {string} Nombre del mes
 */
export const getMonthName = (date) => {
    return formatDate(date, 'MMMM');
};

/**
 * Valida si un string es una fecha válida
 * @param {string} dateString - String de fecha
 * @returns {boolean} true si es válida
 */
export const isValidDateString = (dateString) => {
    try {
        const date = parseISO(dateString);
        return isValid(date);
    } catch {
        return false;
    }
};

/**
 * Formatea fecha relativa (hace X días)
 * @param {Date|string} date - Fecha
 * @returns {string} Ej: "Hace 3 días"
 */
export const getRelativeDate = (date) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const days = getDaysDifference(dateObj, new Date());

    if (days === 0) return 'Hoy';
    if (days === 1) return 'Ayer';
    if (days === -1) return 'Mañana';
    if (days > 0) return `Hace ${days} días`;
    return `En ${Math.abs(days)} días`;
};
