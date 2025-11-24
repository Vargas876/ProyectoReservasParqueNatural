import axios from './axiosConfig';

const estadisticasService = {
    /**
     * Obtener estadísticas generales del sistema
     * @returns {Promise<Object>}
     */
    getEstadisticasGenerales: async () => {
        const response = await axios.get('/estadisticas/generales');
        return response.data;
    },

    /**
     * Obtener estadísticas del dashboard
     * @returns {Promise<Object>}
     */
    getDashboard: async () => {
        const response = await axios.get('/estadisticas/dashboard');
        return response.data;
    },

    /**
     * Obtener reservas por estado
     * @returns {Promise<Object>}
     */
    getReservasPorEstado: async () => {
        const response = await axios.get('/estadisticas/reservas/estados');
        return response.data;
    },

    /**
     * Obtener reservas por mes
     * @param {number} year - Año
     * @returns {Promise<Array>}
     */
    getReservasPorMes: async (year = new Date().getFullYear()) => {
        const response = await axios.get('/estadisticas/reservas/mes', {
            params: { year }
        });
        return response.data;
    },

    /**
     * Obtener senderos más populares
     * @param {number} limit - Límite de resultados
     * @returns {Promise<Array>}
     */
    getSenderosPopulares: async (limit = 10) => {
        const response = await axios.get('/estadisticas/senderos/populares', {
            params: { limit }
        });
        return response.data;
    },

    /**
     * Obtener guías con mejor calificación
     * @param {number} limit - Límite de resultados
     * @returns {Promise<Array>}
     */
    getGuiasTopRated: async (limit = 10) => {
        const response = await axios.get('/estadisticas/guias/top-rated', {
            params: { limit }
        });
        return response.data;
    },

    /**
     * Obtener visitantes más frecuentes
     * @param {number} limit - Límite de resultados
     * @returns {Promise<Array>}
     */
    getVisitantesFrecuentes: async (limit = 10) => {
        const response = await axios.get('/estadisticas/visitantes/frecuentes', {
            params: { limit }
        });
        return response.data;
    },

    /**
     * Obtener estadísticas por rango de fechas
     * @param {string} fechaInicio - Fecha inicio (YYYY-MM-DD)
     * @param {string} fechaFin - Fecha fin (YYYY-MM-DD)
     * @returns {Promise<Object>}
     */
    getByRangoFechas: async (fechaInicio, fechaFin) => {
        const response = await axios.get('/estadisticas/rango', {
            params: { fechaInicio, fechaFin }
        });
        return response.data;
    },

    /**
     * Obtener ocupación por sendero
     * @param {string} fecha - Fecha (YYYY-MM-DD)
     * @returns {Promise<Array>}
     */
    getOcupacionSenderos: async (fecha) => {
        const response = await axios.get('/estadisticas/ocupacion', {
            params: { fecha }
        });
        return response.data;
    },

    /**
     * Obtener tendencias de reservas
     * @param {number} meses - Número de meses atrás
     * @returns {Promise<Object>}
     */
    getTendencias: async (meses = 6) => {
        const response = await axios.get('/estadisticas/tendencias', {
            params: { meses }
        });
        return response.data;
    },

    /**
     * Obtener ingresos estimados
     * @param {string} periodo - 'dia', 'semana', 'mes', 'año'
     * @returns {Promise<Object>}
     */
    getIngresos: async (periodo = 'mes') => {
        const response = await axios.get('/estadisticas/ingresos', {
            params: { periodo }
        });
        return response.data;
    },

    /**
     * Obtener tasa de cancelación
     * @param {string} periodo - Periodo a analizar
     * @returns {Promise<Object>}
     */
    getTasaCancelacion: async (periodo = 'mes') => {
        const response = await axios.get('/estadisticas/cancelaciones', {
            params: { periodo }
        });
        return response.data;
    },

    /**
     * Obtener promedio de personas por reserva
     * @returns {Promise<Object>}
     */
    getPromedioPersonas: async () => {
        const response = await axios.get('/estadisticas/promedio-personas');
        return response.data;
    },

    /**
     * Obtener horas pico de reservas
     * @returns {Promise<Array>}
     */
    getHorasPico: async () => {
        const response = await axios.get('/estadisticas/horas-pico');
        return response.data;
    },

    /**
     * Exportar reporte completo
     * @param {string} formato - 'pdf' o 'excel'
     * @param {Object} filtros - Filtros opcionales
     * @returns {Promise<Blob>}
     */
    exportarReporte: async (formato = 'pdf', filtros = {}) => {
        const response = await axios.get('/estadisticas/exportar', {
            params: { formato, ...filtros },
            responseType: 'blob'
        });
        return response.data;
    }
};

export default estadisticasService;
