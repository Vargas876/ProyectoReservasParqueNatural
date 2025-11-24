import axios from './axiosConfig';

const visitanteService = {
    /**
     * Obtener todos los visitantes (admin)
     * @returns {Promise<Array>}
     */
    getAll: async () => {
        const response = await axios.get('/visitantes');
        return response.data;
    },

    /**
     * Obtener visitantes activos
     * @returns {Promise<Array>}
     */
    getActivos: async () => {
        const response = await axios.get('/visitantes/activos');
        return response.data;
    },

    /**
     * Obtener visitante por ID
     * @param {number} id - ID del visitante
     * @returns {Promise<Object>}
     */
    getById: async (id) => {
        const response = await axios.get(`/visitantes/${id}`);
        return response.data;
    },

    /**
     * Buscar visitantes
     * @param {string} query - Término de búsqueda
     * @returns {Promise<Array>}
     */
    buscar: async (query) => {
        const response = await axios.get('/visitantes/buscar', {
            params: { q: query }
        });
        return response.data;
    },

    /**
     * Actualizar visitante
     * @param {number} id - ID del visitante
     * @param {Object} visitanteData - Datos actualizados
     * @returns {Promise<Object>}
     */
    update: async (id, visitanteData) => {
        const response = await axios.put(`/visitantes/${id}`, visitanteData);
        return response.data;
    },

    /**
     * Eliminar visitante
     * @param {number} id - ID del visitante
     * @returns {Promise<void>}
     */
    delete: async (id) => {
        await axios.delete(`/visitantes/${id}`);
    },

    /**
     * Cambiar estado del visitante
     * @param {number} id - ID del visitante
     * @param {string} estado - Nuevo estado
     * @returns {Promise<Object>}
     */
    cambiarEstado: async (id, estado) => {
        const response = await axios.patch(`/visitantes/${id}/estado`, { estado });
        return response.data;
    },

    /**
     * Obtener historial de reservas del visitante
     * @param {number} id - ID del visitante
     * @returns {Promise<Array>}
     */
    getHistorialReservas: async (id) => {
        const response = await axios.get(`/visitantes/${id}/reservas`);
        return response.data;
    },

    /**
     * Obtener estadísticas del visitante
     * @param {number} id - ID del visitante
     * @returns {Promise<Object>}
     */
    getEstadisticas: async (id) => {
        const response = await axios.get(`/visitantes/${id}/estadisticas`);
        return response.data;
    },

    /**
     * Bloquear visitante
     * @param {number} id - ID del visitante
     * @param {string} motivo - Motivo del bloqueo
     * @returns {Promise<Object>}
     */
    bloquear: async (id, motivo) => {
        const response = await axios.patch(`/visitantes/${id}/bloquear`, { motivo });
        return response.data;
    },

    /**
     * Desbloquear visitante
     * @param {number} id - ID del visitante
     * @returns {Promise<Object>}
     */
    desbloquear: async (id) => {
        const response = await axios.patch(`/visitantes/${id}/desbloquear`);
        return response.data;
    },

    /**
     * Obtener visitantes frecuentes
     * @param {number} minReservas - Mínimo de reservas
     * @returns {Promise<Array>}
     */
    getFrecuentes: async (minReservas = 5) => {
        const response = await axios.get('/visitantes/frecuentes', {
            params: { minReservas }
        });
        return response.data;
    }
};

export default visitanteService;
