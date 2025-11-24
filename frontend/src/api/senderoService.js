import axios from './axiosConfig';

const senderoService = {
    /**
     * Obtener todos los senderos
     * @returns {Promise<Array>} Lista de senderos
     */
    getAll: async () => {
        const response = await axios.get('/senderos');
        return response.data;
    },

    /**
     * Obtener senderos activos
     * @returns {Promise<Array>} Lista de senderos activos
     */
    getActivos: async () => {
        const response = await axios.get('/senderos/activos');
        return response.data;
    },

    /**
     * Obtener sendero por ID
     * @param {number} id - ID del sendero
     * @returns {Promise<Object>} Sendero
     */
    getById: async (id) => {
        const response = await axios.get(`/senderos/${id}`);
        return response.data;
    },

    /**
     * Crear nuevo sendero
     * @param {Object} senderoData - Datos del sendero
     * @returns {Promise<Object>} Sendero creado
     */
    create: async (senderoData) => {
        const response = await axios.post('/senderos', senderoData);
        return response.data;
    },

    /**
     * Actualizar sendero
     * @param {number} id - ID del sendero
     * @param {Object} senderoData - Datos actualizados
     * @returns {Promise<Object>} Sendero actualizado
     */
    update: async (id, senderoData) => {
        const response = await axios.put(`/senderos/${id}`, senderoData);
        return response.data;
    },

    /**
     * Eliminar sendero
     * @param {number} id - ID del sendero
     * @returns {Promise<void>}
     */
    delete: async (id) => {
        await axios.delete(`/senderos/${id}`);
    },


    /**
     * Cambiar estado del sendero
     * @param {number} id - ID del sendero
     * @param {string} nuevoEstado - Nuevo estado (ACTIVO, INACTIVO, MANTENIMIENTO)
     * @returns {Promise<Object>}
     */
    cambiarEstado: async (id, nuevoEstado) => {
        const response = await axios.patch(`/senderos/${id}/estado`, null, {
            params: { nuevoEstado }
        });
        return response.data;
    },

    /**
     * Obtener senderos disponibles para una fecha
     * @param {string} fecha - Fecha (YYYY-MM-DD)
     * @returns {Promise<Array>}
     */
    getDisponibles: async (fecha) => {
        const response = await axios.get('/senderos/disponibles', {
            params: { fecha }
        });
        return response.data;
    },

    /**
     * Calcular cupo disponible para una fecha
     * @param {number} id - ID del sendero
     * @param {string} fecha - Fecha (YYYY-MM-DD)
     * @returns {Promise<Object>} { data: cupo }
     */
    calcularCupoDisponible: async (id, fecha) => {
        const response = await axios.get(`/senderos/${id}/cupo-disponible`, {
            params: { fecha }
        });
        return response.data;
    },


    /**
     * Obtener senderos por dificultad
     * @param {string} dificultad - Dificultad (FACIL, MODERADO, DIFICIL, EXTREMO)
     * @returns {Promise<Array>}
     */
    getByDificultad: async (dificultad) => {
        const response = await axios.get(`/senderos/dificultad/${dificultad}`);
        return response.data;
    }
};

export default senderoService;
