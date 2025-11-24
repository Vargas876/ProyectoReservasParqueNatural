import { toast } from 'react-toastify';
import { ERROR_MESSAGES } from './constants';

/**
 * Clase personalizada para errores de API
 */
export class ApiError extends Error {
    constructor(message, status, data = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

/**
 * Maneja errores de la API
 * @param {Error} error - Error capturado
 * @param {boolean} showToast - Si debe mostrar toast
 * @returns {Object} Error procesado
 */
export const handleApiError = (error, showToast = true) => {
    let errorMessage = ERROR_MESSAGES.SERVER_ERROR;
    let errorStatus = 500;
    let errorData = null;

    // Error de red
    if (!error.response) {
        errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
        errorStatus = 0;
    }
    // Error del servidor
    else {
        errorStatus = error.response.status;
        errorData = error.response.data;

        switch (errorStatus) {
            case 400:
                errorMessage = errorData?.message || ERROR_MESSAGES.VALIDATION_ERROR;
                break;
            case 401:
                errorMessage = ERROR_MESSAGES.SESSION_EXPIRED;
                break;
            case 403:
                errorMessage = ERROR_MESSAGES.UNAUTHORIZED;
                break;
            case 404:
                errorMessage = errorData?.message || ERROR_MESSAGES.NOT_FOUND;
                break;
            case 422:
                errorMessage = ERROR_MESSAGES.VALIDATION_ERROR;
                break;
            case 500:
            case 502:
            case 503:
                errorMessage = ERROR_MESSAGES.SERVER_ERROR;
                break;
            default:
                errorMessage = errorData?.message || ERROR_MESSAGES.SERVER_ERROR;
        }
    }

    if (showToast) {
        toast.error(errorMessage);
    }

    return {
        message: errorMessage,
        status: errorStatus,
        data: errorData
    };
};

/**
 * Maneja errores de validación de formularios
 * @param {Object} validationErrors - Errores de validación del backend
 * @returns {Object} Errores procesados por campo
 */
export const handleValidationErrors = (validationErrors) => {
    const errors = {};

    if (Array.isArray(validationErrors)) {
        validationErrors.forEach(error => {
            errors[error.field] = error.message;
        });
    } else if (typeof validationErrors === 'object') {
        Object.keys(validationErrors).forEach(key => {
            errors[key] = validationErrors[key];
        });
    }

    return errors;
};

/**
 * Logger de errores (para desarrollo)
 * @param {Error} error - Error a loggear
 * @param {string} context - Contexto del error
 */
export const logError = (error, context = '') => {
    if (process.env.NODE_ENV === 'development') {
        console.group(`🔴 Error ${context ? `en ${context}` : ''}`);
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        if (error.response) {
            console.error('Response:', error.response);
        }
        console.groupEnd();
    }
};

/**
 * Crea un error personalizado
 * @param {string} message - Mensaje de error
 * @param {number} status - Código de estado
 * @param {Object} data - Datos adicionales
 * @returns {ApiError} Error personalizado
 */
export const createError = (message, status = 500, data = null) => {
    return new ApiError(message, status, data);
};

/**
 * Verifica si un error es de un tipo específico
 * @param {Error} error - Error a verificar
 * @param {number} statusCode - Código de estado a verificar
 * @returns {boolean} true si coincide
 */
export const isErrorStatus = (error, statusCode) => {
    return error.response?.status === statusCode;
};

/**
 * Verifica si es un error de red
 * @param {Error} error - Error a verificar
 * @returns {boolean} true si es error de red
 */
export const isNetworkError = (error) => {
    return !error.response && error.message === 'Network Error';
};

/**
 * Verifica si es un error de autenticación
 * @param {Error} error - Error a verificar
 * @returns {boolean} true si es error 401
 */
export const isAuthError = (error) => {
    return isErrorStatus(error, 401);
};

/**
 * Verifica si es un error de permisos
 * @param {Error} error - Error a verificar
 * @returns {boolean} true si es error 403
 */
export const isPermissionError = (error) => {
    return isErrorStatus(error, 403);
};

/**
 * Verifica si es un error de validación
 * @param {Error} error - Error a verificar
 * @returns {boolean} true si es error 400 o 422
 */
export const isValidationError = (error) => {
    return isErrorStatus(error, 400) || isErrorStatus(error, 422);
};

/**
 * Maneja errores de forma asíncrona con try-catch
 * @param {Function} fn - Función asíncrona
 * @param {Object} options - Opciones
 * @returns {Function} Función envuelta
 */
export const withErrorHandling = (fn, options = {}) => {
    return async (...args) => {
        try {
            return await fn(...args);
        } catch (error) {
            const { showToast = true, onError, rethrow = false } = options;

            handleApiError(error, showToast);

            if (onError) {
                onError(error);
            }

            if (rethrow) {
                throw error;
            }

            return null;
        }
    };
};

/**
 * Retry de peticiones en caso de error
 * @param {Function} fn - Función a ejecutar
 * @param {number} retries - Número de reintentos
 * @param {number} delay - Delay entre reintentos (ms)
 * @returns {Promise} Resultado de la función
 */
export const retryOnError = async (fn, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === retries - 1) throw error;

            // Solo reintentar en errores de red o 5xx
            if (isNetworkError(error) || error.response?.status >= 500) {
                await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
            } else {
                throw error;
            }
        }
    }
};

/**
 * Obtiene un mensaje de error amigable
 * @param {Error} error - Error
 * @returns {string} Mensaje amigable
 */
export const getFriendlyErrorMessage = (error) => {
    if (isNetworkError(error)) {
        return 'Parece que no tienes conexión a internet. Verifica tu conexión y vuelve a intentar.';
    }

    if (isAuthError(error)) {
        return 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
    }

    if (isPermissionError(error)) {
        return 'No tienes permisos para realizar esta acción.';
    }

    if (isValidationError(error)) {
        return 'Algunos datos ingresados no son válidos. Por favor, revisa el formulario.';
    }

    return error.response?.data?.message || 'Ocurrió un error inesperado. Por favor, intenta nuevamente.';
};
