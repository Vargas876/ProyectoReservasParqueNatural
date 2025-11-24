import { useEffect, useState } from 'react';

/**
 * Hook para debounce de valores
 * Útil para búsquedas en tiempo real, evitando peticiones excesivas
 * @param {any} value - Valor a debounce
 * @param {number} delay - Delay en milisegundos (default: 500)
 * @returns {any} Valor debounced
 */
export const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Crear timeout para actualizar el valor
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Limpiar timeout si el valor cambia antes del delay
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};
