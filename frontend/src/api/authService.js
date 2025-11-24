import axios from './axiosConfig';

const authService = {
    /**
     * Iniciar sesión
     * @param {Object} credentials - { email, password }
     * @returns {Promise<Object>} { token, user }
     */
    login: async (credentials) => {
        const response = await axios.post('/auth/login', credentials);
        return response.data;
    },

    /**
     * Registrar nuevo visitante
     * @param {Object} userData - Datos del visitante
     * @returns {Promise<Object>} { token, user }
     */
    registerVisitante: async (userData) => {
        const response = await axios.post('/auth/registro/visitante', userData);
        return response.data;
    },

    /**
     * Registrar nuevo guía (solo admin)
     * @param {Object} userData - Datos del guía
     * @returns {Promise<Object>} Usuario creado
     */
    registerGuia: async (userData) => {
        const response = await axios.post('/auth/registro/guia', userData);
        return response.data;
    },

    /**
     * Cerrar sesión
     * @returns {Promise<void>}
     */
    logout: async () => {
        try {
            await axios.post('/auth/logout');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },

    /**
     * Verificar token
     * @returns {Promise<Object>} { valid, user }
     */
    verifyToken: async () => {
        const response = await axios.get('/auth/verify');
        return response.data;
    },

    /**
     * Cambiar contraseña
     * @param {number} userId - ID del usuario
     * @param {string} currentPassword - Contraseña actual
     * @param {string} newPassword - Nueva contraseña
     * @returns {Promise<Object>}
     */
    cambiarPassword: async (userId, currentPassword, newPassword) => {
        const response = await axios.put(`/auth/cambiar-password/${userId}`, {
            currentPassword,
            newPassword
        });
        return response.data;
    },

    /**
     * Solicitar recuperación de contraseña
     * @param {string} email - Email del usuario
     * @returns {Promise<Object>}
     */
    solicitarRecuperacion: async (email) => {
        const response = await axios.post('/auth/recuperar-password', { email });
        return response.data;
    },

    /**
     * Restablecer contraseña con token
     * @param {string} token - Token de recuperación
     * @param {string} newPassword - Nueva contraseña
     * @returns {Promise<Object>}
     */
    restablecerPassword: async (token, newPassword) => {
        const response = await axios.post('/auth/restablecer-password', {
            token,
            newPassword
        });
        return response.data;
    }
};

export default authService;
