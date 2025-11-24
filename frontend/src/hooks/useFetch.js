import { useEffect, useState } from 'react';

/**
 * Hook para realizar peticiones HTTP con manejo de estados
 * @param {Function} fetchFunction - Función que retorna una promesa
 * @param {Array} dependencies - Dependencias para ejecutar el fetch
 * @param {boolean} immediate - Si debe ejecutarse inmediatamente
 * @returns {Object} Estado del fetch (data, loading, error, refetch)
 */
export const useFetch = (fetchFunction, dependencies = [], immediate = true) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(immediate);
    const [error, setError] = useState(null);

    const executeFetch = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetchFunction();
            setData(result);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Error al cargar datos');
            console.error('Error en useFetch:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (immediate) {
            executeFetch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);

    const refetch = () => {
        executeFetch();
    };

    return { data, loading, error, refetch };
};
