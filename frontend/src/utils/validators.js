import { VALIDATION } from './constants';

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean} true si es válido
 */
export const isValidEmail = (email) => {
    if (!email) return false;
    return VALIDATION.EMAIL_REGEX.test(email);
};

/**
 * Valida una cédula
 * @param {string} cedula - Cédula a validar
 * @returns {boolean} true si es válida
 */
export const isValidCedula = (cedula) => {
    if (!cedula) return false;
    return VALIDATION.CEDULA_REGEX.test(cedula);
};

/**
 * Valida un teléfono
 * @param {string} telefono - Teléfono a validar
 * @returns {boolean} true si es válido
 */
export const isValidTelefono = (telefono) => {
    if (!telefono) return false;
    return VALIDATION.PHONE_REGEX.test(telefono);
};

/**
 * Valida una contraseña
 * @param {string} password - Contraseña a validar
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export const validatePassword = (password) => {
    const errors = [];

    if (!password) {
        return { valid: false, errors: ['La contraseña es requerida'] };
    }

    if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
        errors.push(`Mínimo ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres`);
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Debe contener al menos una mayúscula');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Debe contener al menos una minúscula');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Debe contener al menos un número');
    }

    return {
        valid: errors.length === 0,
        errors
    };
};

/**
 * Valida si dos contraseñas coinciden
 * @param {string} password - Contraseña
 * @param {string} confirmPassword - Confirmación
 * @returns {boolean} true si coinciden
 */
export const passwordsMatch = (password, confirmPassword) => {
    return password === confirmPassword;
};

/**
 * Valida una URL
 * @param {string} url - URL a validar
 * @returns {boolean} true si es válida
 */
export const isValidUrl = (url) => {
    if (!url) return false;
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

/**
 * Valida un número positivo
 * @param {number|string} value - Valor a validar
 * @returns {boolean} true si es positivo
 */
export const isPositiveNumber = (value) => {
    const num = Number(value);
    return !isNaN(num) && num > 0;
};

/**
 * Valida un rango de números
 * @param {number|string} value - Valor a validar
 * @param {number} min - Mínimo
 * @param {number} max - Máximo
 * @returns {boolean} true si está en rango
 */
export const isInRange = (value, min, max) => {
    const num = Number(value);
    return !isNaN(num) && num >= min && num <= max;
};

/**
 * Valida campos requeridos de un formulario
 * @param {Object} values - Valores del formulario
 * @param {string[]} requiredFields - Campos requeridos
 * @returns {Object} Errores por campo
 */
export const validateRequiredFields = (values, requiredFields) => {
    const errors = {};

    requiredFields.forEach(field => {
        if (!values[field] || (typeof values[field] === 'string' && !values[field].trim())) {
            errors[field] = 'Este campo es requerido';
        }
    });

    return errors;
};

/**
 * Valida el tamaño de un archivo
 * @param {File} file - Archivo a validar
 * @param {number} maxSize - Tamaño máximo en bytes
 * @returns {boolean} true si es válido
 */
export const isValidFileSize = (file, maxSize) => {
    if (!file) return false;
    return file.size <= maxSize;
};

/**
 * Valida el tipo de un archivo
 * @param {File} file - Archivo a validar
 * @param {string[]} allowedTypes - Tipos permitidos
 * @returns {boolean} true si es válido
 */
export const isValidFileType = (file, allowedTypes) => {
    if (!file) return false;
    return allowedTypes.includes(file.type);
};
