import axios from './axiosConfig';

const reservaService = {
    /**
     * Obtener todas las reservas (admin)
     * @returns {Promise<Array>}
     */
    getAll: async () => {
        const response = await axios.get('/reservas');
        return response.data;
    },

    /**
     * Obtener reserva por ID
     * @param {number} id - ID de la reserva
     * @returns {Promise<Object>}
     */
    getById: async (id) => {
        const response = await axios.get(`/reservas/${id}`);
        return response.data;
    },

    /**
     * Obtener reservas de un visitante
     * @param {number} visitanteId - ID del visitante
     * @returns {Promise<Array>}
     */
    getByVisitante: async (visitanteId) => {
        const response = await axios.get(`/reservas/visitante/${visitanteId}`);
        return response.data;
    },

    /**
     * Obtener reservas por sendero
     * @param {number} senderoId - ID del sendero
     * @returns {Promise<Array>}
     */
    getBySendero: async (senderoId) => {
        const response = await axios.get(`/reservas/sendero/${senderoId}`);
        return response.data;
    },

    /**
     * Obtener reservas por fecha
     * @param {string} fecha - Fecha (YYYY-MM-DD)
     * @returns {Promise<Array>}
     */
    getByFecha: async (fecha) => {
        const response = await axios.get('/reservas/fecha', {
            params: { fecha }
        });
        return response.data;
    },

    /**
     * Crear nueva reserva
     * @param {number} visitanteId - ID del visitante
     * @param {Object} reservaData - Datos de la reserva
     * @returns {Promise<Object>}
     */
    create: async (visitanteId, reservaData) => {
        const response = await axios.post(`/reservas/visitante/${visitanteId}`, reservaData);
        return response.data;
    },

    /**
     * Actualizar reserva
     * @param {number} id - ID de la reserva
     * @param {Object} reservaData - Datos actualizados
     * @returns {Promise<Object>}
     */
    update: async (id, reservaData) => {
        const response = await axios.put(`/reservas/${id}`, reservaData);
        return response.data;
    },

    /**
     * Cancelar reserva
     * @param {number} id - ID de la reserva
     * @param {string} motivo - Motivo de cancelación
     * @returns {Promise<Object>}
     */
    cancelar: async (id, motivo) => {
        const response = await axios.patch(`/reservas/${id}/cancelar`, null, {
            params: { motivo }
        });
        return response.data;
    },

    /**
     * Confirmar reserva (admin)
     * @param {number} id - ID de la reserva
     * @returns {Promise<Object>}
     */
    confirmar: async (id) => {
        const response = await axios.patch(`/reservas/${id}/confirmar`);
        return response.data;
    },

    /**
     * Marcar como completada
     * @param {number} id - ID de la reserva
     * @returns {Promise<Object>}
     */
    completar: async (id) => {
        const response = await axios.patch(`/reservas/${id}/completar`);
        return response.data;
    },

    /**
     * Marcar como no asistió
     * @param {number} id - ID de la reserva
     * @returns {Promise<Object>}
     */
    noAsistio: async (id) => {
        const response = await axios.patch(`/reservas/${id}/no-asistio`);
        return response.data;
    },

    /**
     * Eliminar reserva
     * @param {number} id - ID de la reserva
     * @returns {Promise<void>}
     */
    delete: async (id) => {
        await axios.delete(`/reservas/${id}`);
    },

    /**
     * Verificar disponibilidad
     * @param {Object} params - { senderoId, fecha, numeroPersonas }
     * @returns {Promise<Object>} { disponible, mensaje }
     */
    verificarDisponibilidad: async (params) => {
        const response = await axios.post('/reservas/verificar-disponibilidad', params);
        return response.data;
    }
};

export default reservaService;
