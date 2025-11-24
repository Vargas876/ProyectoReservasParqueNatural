import axios from './axiosConfig';

const guiaService = {
    /**
     * Obtener todos los guías
     * @returns {Promise<Array>}
     */
    getAll: async () => {
        const response = await axios.get('/guias');
        return response.data;
    },

    /**
     * Obtener guías activos
     * @returns {Promise<Array>}
     */
    getActivos: async () => {
        const response = await axios.get('/guias/activos');
        return response.data;
    },

    /**
     * Obtener guía por ID
     * @param {number} id - ID del guía
     * @returns {Promise<Object>}
     */
    getById: async (id) => {
        const response = await axios.get(`/guias/${id}`);
        return response.data;
    },

    /**
     * Obtener guías disponibles para una fecha
     * @param {string} fecha - Fecha (YYYY-MM-DD)
     * @returns {Promise<Array>}
     */
    getDisponibles: async (fecha) => {
        const response = await axios.get('/guias/disponibles', {
            params: { fecha }
        });
        return response.data;
    },

    /**
     * Obtener agenda de un guía
     * @param {number} guiaId - ID del guía
     * @param {string} fecha - Fecha (YYYY-MM-DD)
     * @returns {Promise<Array>}
     */
    getAgenda: async (guiaId, fecha) => {
        const response = await axios.get(`/guias/${guiaId}/agenda`, {
            params: { fecha }
        });
        return response.data;
    },

    /**
     * Actualizar guía
     * @param {number} id - ID del guía
     * @param {Object} guiaData - Datos actualizados
     * @returns {Promise<Object>}
     */
    update: async (id, guiaData) => {
        const response = await axios.put(`/guias/${id}`, guiaData);
        return response.data;
    },

    /**
     * Eliminar guía
     * @param {number} id - ID del guía
     * @returns {Promise<void>}
     */
    delete: async (id) => {
        await axios.delete(`/guias/${id}`);
    },

    /**
     * Cambiar estado del guía
     * @param {number} id - ID del guía
     * @param {string} estado - Nuevo estado
     * @returns {Promise<Object>}
     */
    cambiarEstado: async (id, estado) => {
        const response = await axios.patch(`/guias/${id}/estado`, { estado });
        return response.data;
    },

    /**
     * Obtener estadísticas del guía
     * @param {number} id - ID del guía
     * @returns {Promise<Object>}
     */
    getEstadisticas: async (id) => {
        const response = await axios.get(`/guias/${id}/estadisticas`);
        return response.data;
    }
};

export default guiaService;
