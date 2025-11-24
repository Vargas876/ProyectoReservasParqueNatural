import axios from './axiosConfig';

const horarioService = {
    /**
     * Obtener todos los horarios
     * @returns {Promise<Array>}
     */
    getAll: async () => {
        const response = await axios.get('/horarios');
        return response.data;
    },

    /**
     * Obtener horario por ID
     * @param {number} id - ID del horario
     * @returns {Promise<Object>}
     */
    getById: async (id) => {
        const response = await axios.get(`/horarios/${id}`);
        return response.data;
    },

    /**
     * Obtener horarios de un sendero
     * @param {number} senderoId - ID del sendero
     * @returns {Promise<Array>}
     */
    getBySendero: async (senderoId) => {
        const response = await axios.get(`/horarios/sendero/${senderoId}`);
        return response.data;
    },

    /**
     * Obtener horarios activos de un sendero
     * @param {number} senderoId - ID del sendero
     * @returns {Promise<Array>}
     */
    getActivosBySendero: async (senderoId) => {
        const response = await axios.get(`/horarios/sendero/${senderoId}/activos`);
        return response.data;
    },

    /**
     * Obtener horarios disponibles para una fecha
     * @param {number} senderoId - ID del sendero
     * @param {string} fecha - Fecha (YYYY-MM-DD)
     * @returns {Promise<Array>}
     */
    getDisponibles: async (senderoId, fecha) => {
        const response = await axios.get(`/horarios/sendero/${senderoId}/disponibles`, {
            params: { fecha }
        });
        return response.data;
    },

    /**
     * Crear nuevo horario
     * @param {Object} horarioData - { idSendero, horaInicio, horaFin, activo }
     * @returns {Promise<Object>}
     */
    create: async (horarioData) => {
        const response = await axios.post('/horarios', horarioData);
        return response.data;
    },

    /**
     * Actualizar horario
     * @param {number} id - ID del horario
     * @param {Object} horarioData - Datos actualizados
     * @returns {Promise<Object>}
     */
    update: async (id, horarioData) => {
        const response = await axios.put(`/horarios/${id}`, horarioData);
        return response.data;
    },

    /**
     * Eliminar horario
     * @param {number} id - ID del horario
     * @returns {Promise<void>}
     */
    delete: async (id) => {
        await axios.delete(`/horarios/${id}`);
    },

    /**
     * Activar horario
     * @param {number} id - ID del horario
     * @returns {Promise<Object>}
     */
    activar: async (id) => {
        const response = await axios.patch(`/horarios/${id}/activar`);
        return response.data;
    },

    /**
     * Desactivar horario
     * @param {number} id - ID del horario
     * @returns {Promise<Object>}
     */
    desactivar: async (id) => {
        const response = await axios.patch(`/horarios/${id}/desactivar`);
        return response.data;
    },

    /**
     * Verificar disponibilidad de horario
     * @param {number} horarioId - ID del horario
     * @param {string} fecha - Fecha (YYYY-MM-DD)
     * @returns {Promise<Object>} { disponible, mensaje }
     */
    verificarDisponibilidad: async (horarioId, fecha) => {
        const response = await axios.get(`/horarios/${horarioId}/disponibilidad`, {
            params: { fecha }
        });
        return response.data;
    },

    /**
     * Crear múltiples horarios
     * @param {Array} horariosData - Array de horarios
     * @returns {Promise<Array>}
     */
    createMultiple: async (horariosData) => {
        const response = await axios.post('/horarios/multiple', horariosData);
        return response.data;
    }
};

export default horarioService;
