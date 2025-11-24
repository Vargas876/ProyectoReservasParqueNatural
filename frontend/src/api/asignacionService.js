import axios from './axiosConfig';

const asignacionService = {
    /**
     * Obtener todas las asignaciones
     * @returns {Promise<Array>}
     */
    getAll: async () => {
        const response = await axios.get('/asignaciones');
        return response.data;
    },

    /**
     * Obtener asignación por ID
     * @param {number} id - ID de la asignación
     * @returns {Promise<Object>}
     */
    getById: async (id) => {
        const response = await axios.get(`/asignaciones/${id}`);
        return response.data;
    },

    /**
     * Obtener asignaciones de un guía
     * @param {number} guiaId - ID del guía
     * @returns {Promise<Array>}
     */
    getByGuia: async (guiaId) => {
        const response = await axios.get(`/asignaciones/guia/${guiaId}`);
        return response.data;
    },

    /**
     * Obtener asignaciones por reserva
     * @param {number} reservaId - ID de la reserva
     * @returns {Promise<Array>}
     */
    getByReserva: async (reservaId) => {
        const response = await axios.get(`/asignaciones/reserva/${reservaId}`);
        return response.data;
    },

    /**
     * Obtener asignaciones por fecha
     * @param {string} fecha - Fecha (YYYY-MM-DD)
     * @returns {Promise<Array>}
     */
    getByFecha: async (fecha) => {
        const response = await axios.get(`/asignaciones/fecha/${fecha}`);
        return response.data;
    },

    /**
     * Asignar guía a una reserva
     * @param {Object} data - { idReserva, idGuia, observaciones }
     * @returns {Promise<Object>}
     */
    asignarGuia: async (data) => {
        const response = await axios.post('/asignaciones', data);
        return response.data;
    },

    /**
     * Iniciar recorrido
     * @param {Object} data - { idAsignacion, observacionesInicio }
     * @returns {Promise<Object>}
     */
    iniciarRecorrido: async (data) => {
        const response = await axios.post('/asignaciones/iniciar', {
            idAsignacion: data.idAsignacion,
            observacionesInicio: data.observacionesInicio
        });
        return response.data;
    },

    /**
     * Finalizar recorrido
     * @param {Object} data - { idAsignacion, observacionesGuia, huboIncidencias, descripcionIncidencias }
     * @returns {Promise<Object>}
     */
    finalizarRecorrido: async (data) => {
        const response = await axios.post('/asignaciones/finalizar', {
            idAsignacion: data.idAsignacion,
            observacionesGuia: data.observacionesGuia,
            huboIncidencias: data.huboIncidencias,
            descripcionIncidencias: data.descripcionIncidencias
        });
        return response.data;
    },

    /**
     * Actualizar asignación
     * @param {number} id - ID de la asignación
     * @param {Object} data - Datos actualizados
     * @returns {Promise<Object>}
     */
    update: async (id, data) => {
        const response = await axios.put(`/asignaciones/${id}`, data);
        return response.data;
    },

    /**
     * Eliminar asignación
     * @param {number} id - ID de la asignación
     * @returns {Promise<void>}
     */
    delete: async (id) => {
        await axios.delete(`/asignaciones/${id}`);
    },

    /**
     * Reasignar guía
     * @param {number} id - ID de la asignación
     * @param {number} nuevoGuiaId - ID del nuevo guía
     * @param {string} motivo - Motivo de reasignación
     * @returns {Promise<Object>}
     */
    reasignarGuia: async (id, nuevoGuiaId, motivo) => {
        const response = await axios.patch(`/asignaciones/${id}/reasignar`, {
            nuevoGuiaId,
            motivo
        });
        return response.data;
    },

    /**
     * Calificar recorrido (visitante)
     * @param {number} id - ID de la asignación
     * @param {number} calificacion - Calificación (1-5)
     * @param {string} comentario - Comentario opcional
     * @returns {Promise<Object>}
     */
    calificar: async (id, calificacion, comentario = null) => {
        const response = await axios.patch(`/asignaciones/${id}/calificar`, {
            calificacion,
            comentario
        });
        return response.data;
    },

    /**
     * Obtener asignaciones activas (en curso)
     * @returns {Promise<Array>}
     */
    getActivas: async () => {
        const response = await axios.get('/asignaciones/activas');
        return response.data;
    },

    /**
     * Obtener historial de asignaciones de un guía
     * @param {number} guiaId - ID del guía
     * @param {Object} filters - Filtros opcionales
     * @returns {Promise<Array>}
     */
    getHistorialGuia: async (guiaId, filters = {}) => {
        const response = await axios.get(`/asignaciones/guia/${guiaId}/historial`, {
            params: filters
        });
        return response.data;
    }
};

export default asignacionService;
